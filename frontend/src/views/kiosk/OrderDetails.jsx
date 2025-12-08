import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import Collapsible from '../../utilities/Collapsible.jsx';
import KioskMenuPart from './KioskMenuPart.jsx';
import clsx from 'clsx';

import styles from './OrderDetails.module.css';
import CartContext from './CartContext.js';

// sidePrompts: list of JS objects that each contain a prompts and an array of possible side choices.
export default function OrderDetails({sidePrompts, itemId, itemName}) {
    // selectedParts is an array that functions like a dictionary. It maps the side prompt (the collapsible)
    // to the id of the currently selected part in that collapsible.
    // So, just to recap, each collapsible represents a "side prompt" (because it is prompting you to select a side).
    const [selectedPartIds, setSelectedPartIds] = useState(new Array(sidePrompts.length).fill(undefined));

    const navigate = useNavigate();

    const cartState = useContext(CartContext);

    // Set selected menu part for a given "side prompt" (aka. collapsible)
    function setSidePromptSelection(sidePromptIndex, selPartId) {
        let newSelectedParts = [...selectedPartIds];
        newSelectedParts[sidePromptIndex] = selPartId;
        setSelectedPartIds(newSelectedParts);
    }

    // Render the menu parts within each collapsible.
    function renderMenuParts(menuPartsArray, sidePromptIndex) {
        return menuPartsArray.map((mpart, i) => {
            return <KioskMenuPart key={i}
                    img={mpart.img}
                    partId={mpart.menu_part_id}
                    name={mpart.part_name}
                    price={mpart.price}
                    dietary_restrictions={mpart.dietary_restrictions}
                    onClick={() => setSidePromptSelection(sidePromptIndex, mpart.menu_part_id)}
                    selected={mpart.menu_part_id === selectedPartIds[sidePromptIndex]}
                    />;
        });
    }

    // Render the collapsibles
    function renderCollapsibles() {
        return sidePrompts.map((sp, sidePromptIndex) =>
            <Collapsible key={sidePromptIndex} summaryClasses={styles.menuPartCollapsibleSummary} detailsClasses={styles.menuPartCollapsibleDetails} summary={sp.prompt}>
                {renderMenuParts(sp.menuParts, sidePromptIndex)}
            </Collapsible>
        );
    }

    function handleOrderItem() {
        cartState.addCompletedItem(itemId, selectedPartIds);
        navigate("/kiosk");
    }

    return (
        <div className={clsx(styles.orderDetailsPage, styles.itemName)}>
            <h3 className={styles.buildHeading}>Build your {itemName}.</h3>
            { renderCollapsibles() }

            {/* DEBUG ONLY, delete this <p> later! */}
            {/* <p>[DEBUG]: selected parts: {selectedPartIds.filter(item => item !== undefined).join(", ")}</p> */}

            <div className={styles.orderButtons}>
                {/* Only let the user order if all menu parts have been selected. */}
                <button disabled={selectedPartIds.includes(undefined)} className={clsx(styles.orderItemButton, (selectedPartIds.includes(undefined)) && styles.buttonDisabled)} onClick={handleOrderItem}>Add to Cart</button>
                <button className={styles.cancelOrderButton} onClick={() => navigate("/kiosk")}>Cancel</button>
            </div>
        </div>
    );
}



