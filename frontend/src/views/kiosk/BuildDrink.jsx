import { useState } from 'react';
import { useNavigate } from 'react-router';
import Collapsible from './Collapsible.jsx';
import KioskMenuPart from './KioskMenuPart.jsx';

import './OrderDetails.css';

export default function BuildDrink() {
    // For now, part 1 stores the name of the selected part. We can probably do better in the future.
    const [part1, setPart1] = useState('');
    const navigate = useNavigate();

    const sel1Parts = [
        {img: "/menu_part_images/dr-pepper.jpg", name: "Dr. Pepper", price: "$0.00"},
        {img: "/menu_part_images/iced-tea.jpg", name: "Iced Tea", price: "$0.00"},
    ]

    // Render a list of MenuParts, where each MenuPart is a JS object with img, name, price, callabck properties.
    function renderMenuParts(menuPartsObj, selectionState, selectionSetter) {
        return menuPartsObj.map((mpart, i) => {
            if (mpart.name == selectionState) {
                return <KioskMenuPart key={i} img={mpart.img} name={mpart.name} price={mpart.price} selectionCallback={selectionSetter} selected={true}/>
            } else {
                return <KioskMenuPart key={i} img={mpart.img} name={mpart.name} price={mpart.price} selectionCallback={selectionSetter} />
            }
        });
    }

    return (
        <div id="kioskBuildDrink">
            <h3 id="buildHeading">Choose your drink.</h3>
            <Collapsible detailsClasses="menuPartCollapsible" summary="Choose a Drink">
                {renderMenuParts(sel1Parts, part1, setPart1)}
            </Collapsible>

            {/* DEBUG ONLY, delete this <p> later! */}
            <p>[DEBUG]: selected parts: {[part1].filter(item => item !== "").join(", ")}</p>

            <div id="orderButtons">
                {/* For now, both buttons just take you back to the kiosk. */}
                <button id="completeOrderButton" onClick={() => navigate("/kiosk")}>Complete Order</button>
                <button id="cancelOrderButton" onClick={() => navigate("/kiosk")}>Cancel</button>
            </div>
        </div>
    );
}
