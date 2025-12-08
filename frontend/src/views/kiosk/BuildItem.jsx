/**
 * @module Kiosk/BuildItem
 */
import { useEffect, useState } from 'react';
import OrderDetails from './OrderDetails.jsx';
import { useOutletContext, useSearchParams } from 'react-router';
import { HashLoader } from "react-spinners";
import axios from 'axios';

import styles from './BuildItem.module.css';

/**
 * @function BuildItem
 * @description Kiosk flow for building a menu item by selecting side parts with dietary filtering.
 * @returns {React.ReactElement} A page that handles restriction filters and renders `OrderDetails` for the chosen item.
 */
export default function BuildItem() {
    const [searchParams, setSearchParams] = useSearchParams();
    const itemId = Number(searchParams.get("itemId"));
    const itemName = decodeURIComponent(searchParams.get("itemName"));
    const partCount = Number(searchParams.get("partCount"));

    const [sidePrompts, setSidePrompts] = useState();
    const [originalSidePrompts, setOriginalSidePrompts] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user, allRestrictions, selectedRestrictions, setSelectedRestrictions } = useOutletContext();

    useEffect(() => {
        (async () => {
            try {
                const partsResponse = await axios.get(`/api/menu/items/${itemId}/parts`);

                let newSidePrompts = [];
                
                // Get the parts data in the right format
                let loadedMenuParts = partsResponse.data.filter(mp => mp.for_sale);    // Filter out menu parts that are not for_sale
                loadedMenuParts = loadedMenuParts.map(mp => ({...mp, img: "/api/images/" + mp.image_name}));
                for (let i = 0; i < partCount; i++) {
                    // "Drinks" item (which has an ID of 5), and "Appetizer"
                    // item (which has an ID of 4) must be treated specially.
                    switch (itemId) {
                        case 4:
                            newSidePrompts.push({
                                prompt: `Choose an appetizer`,
                                menuParts: loadedMenuParts
                            });
                            break;
                        case 5:
                            newSidePrompts.push({
                                prompt: `Choose a drink`,
                                menuParts: loadedMenuParts
                            });
                            break;
                        default:
                            newSidePrompts.push({
                                prompt: `Choose side ${i+1}`,
                                menuParts: loadedMenuParts
                            });
                    }
                }

                const uncheckedRestrictions = allRestrictions
                    .map(r => r.dietary_restriction_name)
                    .filter(name => !selectedRestrictions.includes(name));

                const filteredSidePrompts = newSidePrompts.map(prompt => ({
                    ...prompt,
                    menuParts: prompt.menuParts.filter(part => {
                        return uncheckedRestrictions.every(unchecked => !part.dietary_restrictions.includes(unchecked));
                    })
                }));

                setSidePrompts(filteredSidePrompts);
                console.log(filteredSidePrompts);
                setLoading(false);
                setOriginalSidePrompts(newSidePrompts);
            } catch (error) {
                console.log("ERROR loading menu parts:", error);
            }
        })();
    }, [allRestrictions, selectedRestrictions, itemId, partCount]);

    function renderOrderDetails() {
        return <OrderDetails sidePrompts={sidePrompts} itemId={itemId} itemName={itemName} />;
    }

    const handleRestrictionChange = (restrictionName) => {
        const newSelected = selectedRestrictions.includes(restrictionName)
            ? selectedRestrictions.filter(r => r !== restrictionName)
            : [...selectedRestrictions, restrictionName];

        setSelectedRestrictions(newSelected);

        if (user) {
            const restriction = allRestrictions.find(r => r.dietary_restriction_name === restrictionName);
            if (!restriction) return;

            const restrictionId = restriction.dietary_restriction_id;
            const isNowUnchecked = !newSelected.includes(restrictionName);

            try {
                if (isNowUnchecked) {
                    axios.post('/api/dietary-restrictions/my-restrictions', { restrictionId }); // Add restriction to user
                } else {
                    axios.delete(`/api/dietary-restrictions/my-restrictions/${restrictionId}`); // Remove restriction from user
                }
            } catch (error) {
                console.error("Failed to update user dietary restrictions:", error);
            }
        }

        const uncheckedRestrictions = allRestrictions
            .map(r => r.dietary_restriction_name)
            .filter(name => !newSelected.includes(name));

        const filteredSidePrompts = originalSidePrompts.map(prompt => ({
            ...prompt,
            menuParts: prompt.menuParts.filter(part => {
                // A menu part is included if it does NOT have ANY of the unchecked restrictions.
                return uncheckedRestrictions.every(unchecked => !part.dietary_restrictions.includes(unchecked));
            }
            )
        }));
        setSidePrompts(filteredSidePrompts);
    };

    if (loading) {
        return <HashLoader color={"#DC143C"} cssOverride={{"display": "block", "margin": "4rem auto"}} aria-label="Loading item details..." />;
    }

    return (
        <>
            <div className={styles.filterContainer}>
                <h4 className={styles.filterTitle}>Filter by Dietary Restrictions:</h4>
                <div className={styles.scrollableChips}>
                    {allRestrictions.map(restriction => (
                        <label key={restriction.dietary_restriction_id} className={styles.chip}>
                            <input
                                type="checkbox"
                                checked={selectedRestrictions.includes(restriction.dietary_restriction_name)}
                                onChange={() => handleRestrictionChange(restriction.dietary_restriction_name)}
                            />
                            {restriction.dietary_restriction_name}
                        </label>
                    ))}
                </div>
            </div>
            {renderOrderDetails()}
        </>
    );
}
