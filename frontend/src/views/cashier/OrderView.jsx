import { NavLink, Outlet } from "react-router";
import Order from "./Order";
import "./OrderView.css";

export default function OrderView() {
    return (
        <>
            <div id="OrderView">
                <h1 id="orderTitle">Order</h1>

                <Order />

                <Order />

                <div id="totalAmount">
                    <p>Total: $</p>
                    <p> 10.99</p>
                </div>
            </div>

        </>
    );
};