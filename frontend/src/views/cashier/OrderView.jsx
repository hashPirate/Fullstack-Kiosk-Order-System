import { NavLink, Outlet } from "react-router";
import Order from "./Order";
import "./OrderView.css";

export default function OrderView() {

    const example = [
        {
            name: "chicken",
            price: 10.99
        },
        
        {
            name: "beef",
            price:11.99
        }
    ];

    return (
        <>
            <div id="OrderView">
                <h1 id="orderTitle">Order</h1>

                <Order itemName = "Kung Pao Chicken" itemPrice= "5.99" orderParts={example}/>

                {/* <Order itemName = "Chinese Fried Chicken" itemPrice = "6.99"/> */}

                <div id="totalAmount">
                    <p>Total: $</p>
                    <p> 10.99</p>
                </div>
            </div>

        </>
    );
};