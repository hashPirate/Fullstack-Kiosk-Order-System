import { useState } from 'react';
import axios from "axios";
import { HashLoader } from "react-spinners";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import styles from "./KitchenCompleted.module.css";
import CompletedOrder from "./CompletedOrder.jsx";
import PageSwitcher from "./PageSwitcher.jsx";

const pageOrderLimit = 10;

async function getMenuItemsMapping() {
    let menuItemsMapping = {};
    const response = await axios.get('/api/menu/items');
    for (const item of response.data) {
        const {menu_item_id, ...itemRest} = item;
        menuItemsMapping[menu_item_id] = itemRest;
    }
    return menuItemsMapping;
}

async function fetchCookedOrders(pageNum) {
    // Get the menu items mapping.
    const menuItemsMapping = await getMenuItemsMapping();

    const limit = pageOrderLimit;
    const offset = limit * (pageNum - 1);

    // Get an array of all currently uncooked orders
    let cookedOrders = (await axios.get(`/api/orders/cooked?limit=${limit}&offset=${offset}`)).data;

    await Promise.all(cookedOrders.map(async (order) => {
        const orderItems = (await axios.get(`/api/orders/${order.order_id}/items`)).data;

        await Promise.all(orderItems.map(async (item) => {
            const menuParts = (await axios.get(`/api/orders/items/${item.order_item_id}/parts`)).data;
            item.menu_parts = menuParts;

            // Guard clause in case mapping is missing
            if (menuItemsMapping[item.menu_item_id]) {
                item.item_name = menuItemsMapping[item.menu_item_id].item_name;
            } else {
                throw new Error("Menu items mapping is invalid.");
            }
        }));

        order.menu_items = orderItems;
    }));

    return cookedOrders;
}

async function refreshCookedOrders(pageNum) {
    console.log("Refreshing kitchen orders...");

    const countResponse = await axios.get("/api/orders/cooked/count");
    const numOrders = countResponse.data.count

    const orders = await fetchCookedOrders(pageNum);

    return { orders, numOrders };
};

export default function KitchenCompleted() {
    const [pageNum, setPageNum] = useState(1);
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["completedOrders", pageNum],
        queryFn: () => refreshCookedOrders(pageNum),
        refetchInterval: 5000,
    });

    const mutation = useMutation({
        mutationKey: ['completedOrdersSetIsCooked'],
        mutationFn: async ({ order_id, is_cooked }) => {
            // Ensure order_id is valid before sending
            if (!order_id) {
                throw new Error("No Order ID provided to mutation");
            }

            const setCookedResponse = await axios.put(`/api/orders/${order_id}/set-cooked`, { is_cooked: is_cooked });
            
            if (setCookedResponse.data.success === false) {
                throw new Error("Could not update is_cooked in db.");
            }
            return setCookedResponse.data;
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['completedOrders'] });
        },
        onSuccess: async () => {
            console.log("Order revived successfully. Refreshing list...");
            await queryClient.invalidateQueries({ queryKey: ['completedOrders'] });
        },
        onError: (err) => {
            // Just in case there was an error while reviving the order
            console.error("Failed to revive order:", err);
        }
    });

    // "Revive" the order, aka. mark it as pending again
    function reviveOrder(id) {
        console.log(`Attempting to revive order ${id}...`);
        mutation.mutate({ order_id: id, is_cooked: false });
    }

    if (isLoading || mutation.isPending) {
        return <div className={styles.loaderDiv}> <HashLoader className={styles.hashLoader} color={"#3CC7D1"} /> </div>;
    }

    if (error) {
        return <div className={styles.error}>Error loading completed orders: {error.message}</div>;
    }

    const totalPages = data?.numOrders ? Math.ceil(data.numOrders / pageOrderLimit) : 1;

    return (
        <div className={styles.kitchenHome}>
            <PageSwitcher 
                pageNum={pageNum} 
                totalPages={totalPages} 
                setPageNum={setPageNum} 
            />
            
            {data?.orders?.length > 0 ? (
                data.orders.map((ord) => (
                    <CompletedOrder 
                        key={ord.order_id} 
                        orderId={ord.order_id} 
                        menuItems={ord.menu_items} 
                        handleReviveOrder={reviveOrder}      // NOTE to self: is this calling with actual `id`?
                    />
                ))
            ) : (
                <>
                    <h3 className={styles.placeholderTitle}>No past orders!</h3>
                    <p className={styles.placeholderBody}>Wait for some orders to come in...</p>
                </>
            )}

            <PageSwitcher 
                pageNum={pageNum} 
                totalPages={totalPages} 
                setPageNum={setPageNum} 
            />
        </div>
    );
};