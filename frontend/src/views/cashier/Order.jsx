import { NavLink, Outlet } from "react-router";
import OrderPart from "./OrderPart";
import "./Order.css";

export default function Order() {
    return (
        <>  
            <div id="order">
                <div id="header">
                    <h1>Menu Item Name</h1>
                    <h1>$10.99</h1>
                </div>

                <div id="partList">
                    <OrderPart/>
                </div>
            </div>

        </>
    );
};