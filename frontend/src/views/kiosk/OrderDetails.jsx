import { useState } from 'react';
import { useNavigate } from 'react-router';
import Collapsible from '../../utilities/Collapsible.jsx';
import KioskMenuPart from './KioskMenuPart.jsx';
import clsx from 'clsx';

import styles from './OrderDetails.module.css';

// sidePrompts: JS object of prompts and possible side choices
// setSelections: callback for OrderDetails to set the selections
export default function OrderDetails({sidePrompts, itemName}) {
    // selectedParts is an array that functions like a dictionary. It maps the side prompt (the collapsible)
    // to the id of the currently selected part in that collapsible.
    // So, just to recap, each collapsible represents a "side prompt" (because it is prompting you to select a side).
    const [selectedParts, setSelectedParts] = useState(new Array(sidePrompts.length).fill(undefined));

    const navigate = useNavigate();

    // Set selected menu part for a given "side prompt" (aka. collapsible)
    function setSidePromptSelection(sidePromptIndex, selPartId) {
        let newSelectedParts = [...selectedParts];
        newSelectedParts[sidePromptIndex] = selPartId;
        setSelectedParts(newSelectedParts);
    }

    // Render the menu parts within each collapsible.
    function renderMenuParts(menuPartsArray, sidePromptIndex) {
        return menuPartsArray.map((mpart, i) => {
            return <KioskMenuPart key={i}
                    img={mpart.img}
                    partId={mpart.menu_part_id}
                    name={mpart.part_name}
                    price={mpart.price}
                    onClick={() => setSidePromptSelection(sidePromptIndex, mpart.menu_part_id)}
                    selected={mpart.menu_part_id === selectedParts[sidePromptIndex]}
                    />;
        });
    }

    // Render the collapsibles
    function renderCollapsibles() {
        return sidePrompts.map((sp, sidePromptIndex) =>
            <Collapsible key={sidePromptIndex} detailsClasses={styles.menuPartCollapsible} summary={sp.prompt}>
                {renderMenuParts(sp.menuParts, sidePromptIndex)}
            </Collapsible>
        );
    }

    return (
        <div className={clsx(styles.orderDetailsPage, styles.itemName)}>
            <h3 className={styles.buildHeading}>Build your {itemName}.</h3>
            { renderCollapsibles() }

            {/* DEBUG ONLY, delete this <p> later! */}
            <p>[DEBUG]: selected parts: {selectedParts.filter(item => item !== undefined).join(", ")}</p>

            <div className={styles.orderButtons}>
                {/* For now, both buttons just take you back to the kiosk. */}
                <button className={styles.completeOrderButton} onClick={() => navigate("/kiosk")}>Order Item</button>
                <button className={styles.cancelOrderButton} onClick={() => navigate("/kiosk")}>Cancel</button>
            </div>
        </div>
    );
}



