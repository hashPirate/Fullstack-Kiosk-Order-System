import { useState } from 'react';
import { useNavigate } from 'react-router';
import Collapsible from './Collapsible.jsx';
import KioskMenuPart from './KioskMenuPart.jsx';

import './OrderDetails.css';

export default function BuildPlate() {
    // For now, part 1 stores the name of the selected part. We can probably do better in the future.
    const [part1, setPart1] = useState('');
    const [part2, setPart2] = useState('');
    const [part3, setPart3] = useState('');
    const navigate = useNavigate();

    const sel1Parts = [
        {img: "/menu_part_images/rice.jpg", name: "Rice", price: "$0.00"},
        {img: "/menu_part_images/chow-mein.jpg", name: "Chow Mein", price: "$1.00"},
    ]

    const sel2Parts = [
        {img: "/menu_part_images/beijing-beef.jpg", name: "Beijing Beef", price: "$1.00"},
        {img: "/menu_part_images/grilled-teriyaki-chicken.jpg", name: "Teriyaki Chicken", price: "$1.00"},
        {img: "/menu_part_images/mushroom-chicken.jpg", name: "Mushroom Chicken", price: "$1.00"},
    ]

    const sel3Parts = [
        {img: "/menu_part_images/beijing-beef.jpg", name: "Beijing Beef", price: "$1.00"},
        {img: "/menu_part_images/grilled-teriyaki-chicken.jpg", name: "Teriyaki Chicken", price: "$1.00"},
        {img: "/menu_part_images/mushroom-chicken.jpg", name: "Mushroom Chicken", price: "$1.00"},
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
        <div id="kioskBuildPlate">
            <h3 id="buildHeading">Build your bowl.</h3>
            <Collapsible detailsClasses="menuPartCollapsible" summary="Choose a Base">
                {renderMenuParts(sel1Parts, part1, setPart1)}
            </Collapsible>
            <Collapsible detailsClasses="menuPartCollapsible" summary="Select First Side">
                {renderMenuParts(sel2Parts, part2, setPart2)}
            </Collapsible>
            <Collapsible detailsClasses="menuPartCollapsible" summary="Select Second Side">
                {renderMenuParts(sel3Parts, part3, setPart3)}
            </Collapsible>

            {/* DEBUG ONLY, delete this <p> later! */}
            <p>[DEBUG]: selected parts: {[part1, part2, part3].filter(item => item !== "").join(", ")}</p>

            <div id="orderButtons">
                {/* For now, both buttons just take you back to the kiosk. */}
                <button id="completeOrderButton" onClick={() => navigate("/kiosk")}>Complete Order</button>
                <button id="cancelOrderButton" onClick={() => navigate("/kiosk")}>Cancel</button>
            </div>
        </div>
    );
}
