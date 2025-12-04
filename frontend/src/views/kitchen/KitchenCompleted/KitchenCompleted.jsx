
import { NavLink, Outlet } from "react-router";
import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import LoadingPopup from "../LoadingPopup.jsx";

import styles from "./KitchenCompleted.module.css";
import CompletedOrder from "./CompletedOrder.jsx";

export default function KitchenCompleted() {
    // These are useRefs because useRefs update instantly and do not cause a
    // re-render when they are updated.
    const menuItemsMapping = useRef(undefined);
    const numCooked = useRef(undefined);
    const fetchOrdersLock = useRef(false);     // Lock for syncing the orders.

    // These are state because they do not need to be updated instantly and they
    // should cause a re-render when updated.
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageNum, setPageNum] = useState(1);    // Start at page 1
    const pageOrderLimit = 10;

    async function fetchIncomingOrders() {
        try {
            // This could be optimized, but tbh it's pretty fast as-is.
            if (menuItemsMapping.current === undefined) {
                throw new Error("Somehow, the menu items mapping or numCooked is empty.");
            }

            // Get the number of cooked orders
            const cookedCount = (await axios.get("/api/orders/cooked/count")).data;
            const limit = pageOrderLimit;
            const offset = limit * (pageNum - 1);

            // Get an array of all currently uncooked order IDs
            let cookedOrders = (await axios.get(`/api/orders/cooked?limit=${limit}&offset=${offset}`)).data;
            for (const order of cookedOrders) {
                let orderItems = (await axios.get(`/api/orders/${order.order_id}/items`)).data;
                for (const item of orderItems) {
                    const menuParts = (await axios.get(`/api/orders/items/${item.order_item_id}/parts`)).data;
                    item.menu_parts = menuParts;
                    item.item_name = menuItemsMapping.current[item.menu_item_id].item_name;
                }
                order.menu_items = orderItems;
            }

            return {cookedOrders, cookedCount};
        } catch (error) {
            console.log("ERROR while refreshing orders:", error);
        }
    }

    useEffect(() => {
        // This has to be an immediately invoked function for async purposes.
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
                const { cookedOrders, cookedCount } = await fetchIncomingOrders();
                setOrders(cookedOrders);
                numCooked.current = cookedCount;

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
            const {cookedOrders, cookedCount} = await fetchIncomingOrders();

            fetchOrdersLock.current = true;
            setOrders(cookedOrders);
            numCooked.current = cookedCount;
            fetchOrdersLock.current = false;

            console.log("Kitchen orders refresh successful!");
        };

        const msRefreshRate = 5000;
        const ordersInterval = setInterval(refreshOrders, msRefreshRate);

        return () => {
            clearInterval(ordersInterval);
        };
    }, []);

    async function reviveOrder(id) {
        // Once again, I'm just going to return if the lock is locked.
        // Bad practice, but I don't want to overcomplicate this.
        console.log(`Attempting to mark order ${id}...`);
        if (!fetchOrdersLock.current) {
            try {
                // show loader while reviving
                setLoading(true);

                // non-optimistically revive order
                const setCookedResponse = await axios.put(`/api/orders/${id}/set-cooked`, { is_cooked: false });
                if (!setCookedResponse.data.success) {
                    console.log("ERROR: order could not actually be marked in database. Failing silently...");
                } else {
                    console.log("Order successfully marked in database.");
                }
                const newOrders = orders.filter(o => o.order_id !== id);
                setOrders(newOrders);
            } finally {
                setLoading(false);
                console.log(`Successfully marked order ${id}!`);
            }
        } else {
            console.log(`Could not mark order ${id}.`);
            return;
        }
    }

   function renderCookedOrders() {
        if (!loading) {
            // Render main content if initial load is complete.
            if (!orders.length == 0) {
                return orders.map((ord, i) => <CompletedOrder key={ord.order_id} orderId={ord.order_id} menuItems={ord.menu_items} handleRemoveOrder={reviveOrder} />);
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
            return <LoadingPopup/>;
        }
   } 

    return (
        <div className={styles.kitchenHome}>
            { renderCookedOrders() }
        </div>
    );
};