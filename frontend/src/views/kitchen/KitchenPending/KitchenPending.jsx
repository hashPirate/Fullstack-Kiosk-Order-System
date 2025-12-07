import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from "axios";
import { HashLoader } from "react-spinners";

import styles from "./KitchenPending.module.css";
import PendingOrder from "./PendingOrder.jsx";

async function getMenuItemsMapping() {
    let menuItemsMapping = {};
    const response = await axios.get('/api/menu/items');
    for (const item of response.data) {
        const {menu_item_id, ...itemRest} = item;
        menuItemsMapping[menu_item_id] = itemRest;
    }
    return menuItemsMapping;
}

async function refreshPendingOrders() {
    console.log("Refreshing uncooked orders...");

    // Get the menu items mapping.
    const menuItemsMapping = await getMenuItemsMapping();

    // Get an array of all currently uncooked orders
    let cookedOrders = (await axios.get(`/api/orders/uncooked`)).data;

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

export default function KitchenPending() {
    const queryClient = useQueryClient();

    const { data: ordersData, isLoading, error } = useQuery({
        queryKey: ["pendingOrders"],
        queryFn: () => refreshPendingOrders(),
        refetchInterval: 4000,
    });

    const mutation = useMutation({
        mutationKey: ['pendingOrdersSetIsCooked'],
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
            await queryClient.cancelQueries({ queryKey: ['pendingOrders'] });
        },
        onSuccess: async () => {
            console.log("Order completed successfully. Refreshing list...");
            await queryClient.invalidateQueries({ queryKey: ['pendingOrders'] });
        },
        onError: (err) => {
            // Just in case there was an error while completing the order
            console.error("Failed to complete order:", err);
        }
    });

    async function completeOrder(id) {
        console.log(`Attempting to mark order ${id} as complete...`);
        mutation.mutate({ order_id: id, is_cooked: true });
    }

    if (isLoading || mutation.isPending) {
        return <div className={styles.loaderDiv}> <HashLoader className={styles.hashLoader} color={"#3CC7D1"} /> </div>;
    }

    if (error) {
        return <div className={styles.error}>Error loading pending orders: {error.message}</div>;
    }

    if (ordersData?.length > 0) {
        return (
            <div className={styles.kitchenHome}>
                {ordersData.map((ord) => (
                    <PendingOrder 
                        key={ord.order_id} 
                        creationTime={ord.created_at}
                        orderId={ord.order_id} 
                        menuItems={ord.menu_items} 
                        handleCompleteOrder={completeOrder}
                    />
                ))}
            </div>
        );
    }

    // If no orders, then show "all caught up"
    return (
        <div className={styles.caughtUp}>
            <h3 className={styles.placeholderTitle}>You're all caught up!</h3>
            <p className={styles.placeholderBody}>Check back soon...</p>
        </div>
    );
};
