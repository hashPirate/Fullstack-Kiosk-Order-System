import { useState } from 'react';
import { useNavigate } from 'react-router';
import Collapsible from '../../utilities/Collapsible.jsx';
import KioskMenuPart from './KioskMenuPart.jsx';
import clsx from 'clsx';

import './EnterItemDetails.css';

// sidePrompts: JS object of prompts and possible side choices
// setSelections: callback for OrderDetails to set the selections
export default function OrderDetails({sidePrompts, setSelectionsCallback, itemName}) {
    const [selections, setSelections] = useState(new Array(sidePrompts.length).fill(""))
    const navigate = useNavigate();

    function setSelectionI(idx, newVal) {
        const newSelections = [...selections];
        newSelections[idx] = newVal;
        setSelections(newSelections);
    }

    // Render a list of MenuParts, where each MenuPart is a JS object with img, name, price, callabck properties.
    function renderMenuParts(menuPartsObj, selNum) {
        return menuPartsObj.map((mpart, i) => {
            // Render a red (selected) element if mpart's name matches the name of the selected part for this element
            // (i hope that makes sense)
            if (mpart.name == selections[selNum]) {
                return <KioskMenuPart key={i} img={mpart.img} name={mpart.name} price={mpart.price} selectionCallback={newVal => setSelectionI(selNum, newVal)} selected={true}/>
            } else {
                return <KioskMenuPart key={i} img={mpart.img} name={mpart.name} price={mpart.price} selectionCallback={newVal => setSelectionI(selNum, newVal)} />
            }
        });
    }

    function renderCollapsibles() {
        return sidePrompts.map((sp, spNum) =>
            <Collapsible key={spNum} detailsClasses="menuPartCollapsible" summary={sp.prompt}>
                {renderMenuParts(sp.menuParts, spNum)}
            </Collapsible>
        );
    }

    return (
        <div id="orderDetailsPage" className={itemName}>
            <h3 id="buildHeading">Build your {itemName}.</h3>
            { renderCollapsibles() }

            {/* DEBUG ONLY, delete this <p> later! */}
            <p>[DEBUG]: selected parts: {selections.filter(item => item !== "").join(", ")}</p>

            <div id="orderButtons">
                {/* For now, both buttons just take you back to the kiosk. */}
                <button id="completeOrderButton" onClick={() => navigate("/kiosk")}>Order Item</button>
                <button id="cancelOrderButton" onClick={() => navigate("/kiosk")}>Cancel</button>
            </div>
        </div>
    );
}



