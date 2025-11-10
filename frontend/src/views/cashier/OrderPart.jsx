import { NavLink, Outlet } from "react-router";
import { VscChromeClose } from "react-icons/vsc";

import "./OrderPart.css";

export default function OrderPart({partName, partPrice}) {
    return (
        <>
            <div id="part">
                <div>
                    <VscChromeClose />
                    <p id="partName">{partName}</p>
                </div>
                <p id="partPrice">${partPrice}</p>
            </div>
        </>
    );
};