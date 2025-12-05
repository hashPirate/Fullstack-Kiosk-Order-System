
import { NavLink, Outlet } from "react-router";
import { useEffect, useState } from 'react';
import axios from "axios";
import LoadingPopup from "../LoadingPopup.jsx";
import { HashLoader } from "react-spinners";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import styles from "./KitchenCompleted.module.css";
import CompletedOrder from "./CompletedOrder.jsx";
import PageSwitcher from "./PageSwitcher.jsx";

// Number of orders that should appear per page.
const pageOrderLimit = 10;

async function getMenuItemsMapping() {
    try {
        let menuItemsMapping = {};
        let response = await axios.get('/api/menu/items');
        for (const item of response.data) {
            const {menu_item_id, ...itemRest} = item;
            menuItemsMapping[menu_item_id] = itemRest;
        }

        return menuItemsMapping;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

async function fetchCookedOrders(pageNum) {
    try {
        // Get the menu items mapping.
        const menuItemsMapping = await getMenuItemsMapping();

        const limit = pageOrderLimit;
        const offset = limit * (pageNum - 1);

        // Get an array of all currently uncooked order IDs
        let cookedOrders = (await axios.get(`/api/orders/cooked?limit=${limit}&offset=${offset}`)).data;

        for (const order of cookedOrders) {
            const orderItems = (await axios.get(`/api/orders/${order.order_id}/items`)).data;
            for (const item of orderItems) {
                const menuParts = (await axios.get(`/api/orders/items/${item.order_item_id}/parts`)).data;
                item.menu_parts = menuParts;
                item.item_name = menuItemsMapping[item.menu_item_id].item_name;
            }
            order.menu_items = orderItems;
        }

        return cookedOrders;
    } catch (error) {
        console.log(error);
    }
}

async function refreshCookedOrders(pageNum) {
    console.log("Refreshing kitchen orders...");

    // Get the number of cooked orders
    let numOrders = (await axios.get("/api/orders/cooked/count")).data;
    const orders = await fetchCookedOrders(pageNum);

    return {orders, numOrders}
};

export default function KitchenCompleted() {
    // These are state because they do not need to be updated instantly and they
    // should cause a re-render when updated.
    const [pageNum, setPageNum] = useState(1);    // Start at page 1

    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["completedOrders", pageNum],
        queryFn: async () => { await refreshCookedOrders(pageNum) },
        refetchInterval: 5000
    });

    const mutation = useMutation({
        mutationKey: ['setIsCooked'],
        mutationFn: async (payload) => {
            const setCookedResponse = await axios.put(`/api/orders/${id}/set-cooked`, payload);
            if (!setCookedResponse.data.success) {
                throw new Error("Could not update is_cooked in db.");
            }
        },
        onMutate: async () => {
            // Cancel any pending refreshes.
            await queryClient.cancelQueries({ queryKey: ['completedOrders'] });
        },
        onSettled: () => {
            // Invalidate bc data has been updated.
            queryClient.invalidateQueries({ queryKey: ['completedOrders'] });
        }
    });

    async function reviveOrder(id) {
        console.log(`Attempting to revive order ${id}...`);
        try {
            mutation.mutate({ is_cooked: false });
        } catch (error) {
            console.log(error);
        }
    }

    function renderCookedOrders() {
        if (!isLoading) {
            // Render main content if initial load is complete.
            if (!data.orders.length == 0) {
                return data.orders.map((ord, i) => <CompletedOrder key={ord.order_id} orderId={ord.order_id} menuItems={ord.menu_items} handleRemoveOrder={reviveOrder} />);
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
            // return <LoadingPopup/>;    // Overlay loader.
            return <HashLoader className={styles.hashLoader} color={"#3CC7D1"}/>;    // "In-page" loader.
        }
    }

    return (
        <div className={styles.kitchenHome}>
            <PageSwitcher pageNum={pageNum} totalPages={(data.numOrders / pageOrderLimit) + 1} setPageNum={setPageNum} />
            { renderCookedOrders() }
            <PageSwitcher pageNum={pageNum} totalPages={(data.numOrders / pageOrderLimit) + 1} setPageNum={setPageNum} />
        </div>
    );
};