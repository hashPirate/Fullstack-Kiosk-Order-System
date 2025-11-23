
import { NavLink, Outlet } from "react-router";
import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import { HashLoader } from "react-spinners";

import styles from "./KitchenHome.module.css";
import PendingOrder from "./PendingOrder.jsx";

export default function KitchenHome() {
    // These are useRefs because useRefs update instantly and do not cause a
    // re-render when they are updated.
    const menuItemsMapping = useRef(undefined);
    const delOrderSem = useRef(0);      // Semaphore for order deletion.
    const fetchOrdersLock = useRef(false);     // Lock for syncing the orders.

    // These are state because they do not need to be updated instantly and they
    // should cause a re-render when updated.
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchIncomingOrders() {
        try {
            // This could be optimized, but tbh it's pretty fast as-is.
            if (menuItemsMapping.current === undefined) {
                throw new Error("Somehow, the menu items mapping is empty.");
            }

            // Get an array of all currently uncooked order IDs
            let incomingOrders = (await axios.get('/api/orders/uncooked')).data;
            for (const order of incomingOrders) {
                let orderItems = (await axios.get(`/api/orders/${order.order_id}/items`)).data;
                for (const item of orderItems) {
                    const menuParts = (await axios.get(`/api/orders/items/${item.order_item_id}/parts`)).data;
                    item.menu_parts = menuParts;
                    item.item_name = menuItemsMapping.current[item.menu_item_id].item_name;
                }
                order.menu_items = orderItems;
            }

            return incomingOrders;
        } catch (error) {
            console.log("ERROR while refreshing orders:", error);
        }
    }

    useEffect(() => {
        // This has to be an immediately invoked function. I forget why.
        (async function () {
            try {
                // Fetch menu items mapping and set it.
                const menuItemsData = await axios.get('/api/menu/items');
                let newItemsMapping = {};
                for (const item of menuItemsData.data) {
                    const {menu_item_id, ...itemRest} = item;
                    newItemsMapping[menu_item_id] = itemRest;
                }
                menuItemsMapping.current = newItemsMapping;

                // No need to use a semaphore here, since this function runs only in on init.
                const incomingOrders = await fetchIncomingOrders();
                setOrders(incomingOrders);

                // Stop displaying the spinner after initial load.
                setLoading(false);
            } catch (error) {
                console.log("ERROR while doing initial fetches:", error);
            }
        })();

        async function refreshOrders() {
            // This isn't great code, I should probably make it wait
            // to acquire the lock. However, it ain't broke, so I
            // won't fix it.
            console.log("Attempting to refresh kitchen orders....");
            const incomingOrders = await fetchIncomingOrders();
            if (delOrderSem.current === 0) {
                fetchOrdersLock.current = true;
                setOrders(incomingOrders);
                fetchOrdersLock.current = false;
                console.log("Kitchen orders refresh successful!");
            } else {
                console.log("Kitchen orders refresh unsuccessful.");
                return;
            }
        };

        const msRefreshRate = 5000;
        const ordersInterval = setInterval(refreshOrders, msRefreshRate);

        return () => {
            clearInterval(ordersInterval);
        };
    }, []);

    async function removeOrder(id) {
        // Once again, I'm just going to return if the lock is locked.
        // Bad practice, but I don't want to overcomplicate this.
        console.log(`Attempting to remove order ${id}...`);
        if (!fetchOrdersLock.current) {
            try {
                delOrderSem.current++;
                // optimistically remove order from screen
                const newOrders = orders.filter(o => o.order_id !== id);
                setOrders(newOrders);
                // update in db
                const setCookedResponse = await axios.put(`/api/orders/${id}/set-cooked`, { is_cooked: true });
                if (!setCookedResponse.data.success) {
                    console.log("ERROR: order could not actually be removed from database. Failing silently...");
                } else {
                    console.log("Order successfully removed from database.");
                }
            } finally {
                delOrderSem.current--;
                console.log(`Successfully removed order ${id}!`);
            }
        } else {
            console.log(`Could not remove order ${id}.`);
            return;
        }
    }

   function renderOrders() {
        if (!loading) {
            // Render main content if initial load is complete.
            if (!orders.length == 0) {
                return orders.map((ord, i) => <PendingOrder key={ord.order_id} orderId={ord.order_id} menuItems={ord.menu_items} handleRemoveOrder={removeOrder} />);
            } else {
                return (
                    <>
                        <h3 className={styles.placeholderTitle}>You're all caught up!</h3>
                        <p className={styles.placeholderBody}>Check back soon...</p>
                    </>
                );
            }
        } else {
            // Render loader if still loading.
            return <HashLoader className={styles.hashLoader} color={"#3CC7D1"}/>;
        }
   } 

    return (
        <div className={styles.kitchenHome}>
            { renderOrders() }
        </div>
    );
};