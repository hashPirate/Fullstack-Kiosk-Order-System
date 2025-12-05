
import { NavLink, Outlet } from "react-router";
import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import LoadingPopup from "../LoadingPopup.jsx";

import styles from "./KitchenCompleted.module.css";
import CompletedOrder from "./CompletedOrder.jsx";
import PageSwitcher from "./PageSwitcher.jsx";

export default function KitchenCompleted() {
    // These are state because they do not need to be updated instantly and they
    // should cause a re-render when updated.
    const [orders, setOrders] = useState([]);
    const [numOrders, setNumOrders] = useState(0);
    const [loading, setLoading] = useState(true);
    const [pageNum, setPageNum] = useState(1);    // Start at page 1

    const pageOrderLimit = 10;
    const totalPages = (numOrders / pageOrderLimit) + 1;

    function getMenuItemsMapping() {
        let menuItemsMapping = {};
        axios.get('/api/menu/items').then((response) => {
            for (const item of response.data) {
                const {menu_item_id, ...itemRest} = item;
                menuItemsMapping[menu_item_id] = itemRest;
            }
        }).catch((error) => {
            console.log("Error while getting menu items mapping.");
        });
        return menuItemsMapping;
    }

    function fetchCookedOrders() {
        // Get the menu items mapping.
        const menuItemsMapping = getMenuItemsMapping();

        const limit = pageOrderLimit;
        const offset = limit * (pageNum - 1);

        // Get an array of all currently uncooked order IDs
        let cookedOrders;
        axios.get(`/api/orders/cooked?limit=${limit}&offset=${offset}`).then((response) => {
            cookedOrders = response.data;
        }).catch((error) => {
            console.log("Error while fetching recent cooked orders.");
        });

        for (const order of cookedOrders) {
            let orderItems;
            axios.get(`/api/orders/${order.order_id}/items`).then((response => {
                orderItems = response.data;
            })).catch((error) => {
                console.log("Error while getting order items.");
            });
            for (const item of orderItems) {
                let menuParts;
                axios.get(`/api/orders/items/${item.order_item_id}/parts`).then((response) => {
                    menuParts = response.data;
                }).catch((error) => {
                    console.log("Error while getting order item menu parts.");
                });
                item.menu_parts = menuParts;
                item.item_name = menuItemsMapping[item.menu_item_id].item_name;
            }
            order.menu_items = orderItems;
        }

        return cookedOrders;
    }

    function refreshCookedOrders() {
        console.log("Refreshing kitchen orders...");

        // Get the number of cooked orders
        let newNumOrders;
        axios.get("/api/orders/cooked/count").then((response) => {
            newNumOrders = response.data;
        }).catch((error) => {
            console.log("Error while getting count of cooked orders.");
        });
        setNumOrders(newNumOrders);

        const newOrders = fetchCookedOrders();
        setOrders(newOrders);
    };

    // On initial load.
    useEffect(() => {
        // Initial refresh
        refreshCookedOrders();
        setLoading(false);

        const msRefreshRate = 5000;
        const ordersInterval = setInterval(refreshCookedOrders, msRefreshRate);

        return () => {
            clearInterval(ordersInterval);
        };
    }, []);

    // On pageNum change
    useEffect(() => {
        setLoading(true)
        refreshCookedOrders();
        setLoading(false)
    }, [pageNum]);

    async function reviveOrder(id) {
        console.log(`Attempting to revive order ${id}...`);
        try {
            // show loader while reviving
            setLoading(true);

            // non-optimistically revive order
            const setCookedResponse = await axios.put(`/api/orders/${id}/set-cooked`, { is_cooked: false });
            if (!setCookedResponse.data.success) {
                console.log("ERROR: order could not actually be marked in database. Failing silently...");
                return;
            } else {
                console.log("Order successfully marked in database.");
            }
            
            // Then refresh page, so that there are always 10 elements.
            await refreshCookedOrders();
            console.log(`Successfully revived order ${id}!`);
        } catch (error) {
            console.log("Error while trying to revive order:", error);
        } finally {
            setLoading(false);
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
            // return <LoadingPopup/>;
            return <HashLoader className={styles.hashLoader} color={"#3CC7D1"}/>;
        }
    }

    return (
        <div className={styles.kitchenHome}>
            <PageSwitcher pageNum={pageNum} totalPages={totalPages} setPageNum={setPageNum} />
            { renderCookedOrders() }
            <PageSwitcher pageNum={pageNum} totalPages={totalPages} setPageNum={setPageNum} />
        </div>
    );
};