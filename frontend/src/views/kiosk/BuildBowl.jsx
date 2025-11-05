import { useState } from 'react';
import { useNavigate } from 'react-router';
import Collapsible from './Collapsible.jsx';
import KioskMenuPart from './KioskMenuPart.jsx';

import './OrderDetails.css';

export default function BuildBowl() {
    // For now, part 1 stores the name of the selected part. We can probably do better in the future.
    const [part1, setPart1] = useState('');
    const [part2, setPart2] = useState('');
    const navigate = useNavigate();

    const sel1Parts = [
        {img: "/menu_part_images/beijing-beef.jpg", name: "Beijing Beef", price: "$0.00", callback: setPart1},
        {img: "/menu_part_images/beijing-beef.jpg", name: "Broccoli Beef", price: "$0.00", callback: setPart1},
        {img: "/menu_part_images/beijing-beef.jpg", name: "Teriyaki Chicken", price: "$0.00", callback: setPart1}
    ]

    const sel2Parts = [
        {img: "/menu_part_images/egg-roll.jpg", name: "Egg Roll", price: "$1.00", callback: setPart2},
        {img: "/menu_part_images/cream-cheese-rangoon.jpg", name: "Rangoon", price: "$1.00", callback: setPart2}
    ]

    return (
        <div id="kioskBuildBowl">
            <Collapsible detailsClasses="menuPartCollapsible" summary="Select Part 1">
                {   sel1Parts.map((mpart, i) => {
                        if (mpart.name == part1) {
                            return <KioskMenuPart key={i} img={mpart.img} name={mpart.name} price={mpart.price} selectionCallback={mpart.callback} selected={true}/>
                        } else {
                            return <KioskMenuPart key={i} img={mpart.img} name={mpart.name} price={mpart.price} selectionCallback={mpart.callback} />
                        }
                    })
                }
            </Collapsible>
            <Collapsible detailsClasses="menuPartCollapsible" summary="Select Part 2">
                {   sel2Parts.map((mpart, i) => {
                        if (mpart.name == part2) {
                            return <KioskMenuPart key={i} img={mpart.img} name={mpart.name} price={mpart.price} selectionCallback={mpart.callback} selected={true}/>
                        } else {
                            return <KioskMenuPart key={i} img={mpart.img} name={mpart.name} price={mpart.price} selectionCallback={mpart.callback} />
                        }
                    })
                }
            </Collapsible>

            {/* DEBUG ONLY, delete this <p> later! */}
            <p>[DEBUG]: selected parts: {[part1, part2].filter(item => item !== "").join(", ")}</p>

            <div id="orderButtons">
                {/* For now, both buttons just take you back to the kiosk. */}
                <button id="completeOrderButton" onClick={() => navigate("/kiosk")}>Complete Order</button>
                <button id="cancelOrderButton" onClick={() => navigate("/kiosk")}>Cancel</button>
            </div>
        </div>
    );
}
