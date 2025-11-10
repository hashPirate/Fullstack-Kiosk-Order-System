
import { NavLink, Outlet } from "react-router";
import LoremIpsum from '../../utilities/LoremIpsum.jsx';
import { useState } from 'react';

import styles from "./KitchenHome.module.css";
import PendingOrder from "./PendingOrder.jsx";

const exampleOrdersTemplate = [
    {
        orderId: 57295,
        menuItems: [
            {
                itemName: "Bowl",
                menuParts: [
                    "chow mein",
                    "kung pao chicken",
                ]
            },
            {
                itemName: "Plate",
                menuParts: [
                    "chow mein",
                    "kung pao chicken",
                    "kung pao chicken"
                ]
            },
            {
                itemName: "Drink",
                menuParts: [
                    "Dr. Pepper",
                ]
            }
        ]
    },
    {
        orderId: 57294,
        menuItems: [
            {
                itemName: "Drink",
                menuParts: [
                    "Dr. Pepper",
                ]
            }
        ]
    },
    {
        orderId: 57293,
        menuItems: [
            {
                itemName: "Plate",
                menuParts: [
                    "chow mein",
                    "kung pao chicken",
                    "kung pao chicken"
                ]
            }
        ]
    },
]



export default function KitchenHome() {
    const [orders, setOrders] = useState(exampleOrdersTemplate);

    function removeOrder(id) {
        const newOrders = orders.filter(o => o.orderId !== id);
        setOrders(newOrders);
    }

   function renderOrders() {
        if (!orders.length == 0) {
            // Render the actual pending orders if there are any.
            return orders.map((ord, i) => <PendingOrder key={i} orderId={ord.orderId} menuItems={ord.menuItems} handleRemoveOrder={removeOrder} />);
        } else {
            // Otherwise, render this
            return (
                <>
                    <h3 className={styles.placeholderTitle}>You're all caught up!</h3>
                    <p className={styles.placeholderBody}>Check back soon...</p>
                </>
            );
        }
   } 

    return (
        <div className={styles.kitchenHome}>
            { renderOrders() }
        </div>
    );
};