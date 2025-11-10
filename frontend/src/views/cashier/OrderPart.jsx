import { NavLink, Outlet } from "react-router";
import "./OrderPart.css";

export default function OrderPart() {
    return (
        <>
            <div id="part">
                <p id="partName">Part 1 Name</p>
                <p id="partPrice">$0.50</p>
            </div>
        </>
    );
};