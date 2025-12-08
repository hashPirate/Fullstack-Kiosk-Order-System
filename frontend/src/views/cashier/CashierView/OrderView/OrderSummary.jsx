import { useContext, useState } from "react";
import clsx from "clsx";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./OrderView.module.css";
import OrderContext from "../../OrderContext";

/**
 * @module views/cashier/CashierView/OrderView/OrderSummary
 */
/**
 * Displays the total cost of the current order and includes a button for
 * submitting (confirming) the order to the backend.
 *
 * @function OrderSummary
 * @description
 * - Computes an order total by summing item prices and part prices.
 * - Confirms the order by:
 *   1. Creating an empty order in the backend.
 *   2. Adding each item.
 *   3. Adding associated parts for each item.
 *   4. Finalizing the order.
 *
 * Handles loading state with a disabled "Confirm" button while the order
 * is being processed. Redirects away from `menu_parts` if confirmation is triggered from the wrong screen.
 * is triggered from the wrong screen.
 *
 * @returns {JSX.Element} Summary box containing total price and confirmation button.
 */

export default function OrderSummary() {
    const orderState = useContext(OrderContext);
    const [confirmDisabled, setConfirmDisabled] = useState(false);
    const location = useLocation();
    const locationHead = location.pathname.slice(location.pathname.lastIndexOf("/") + 1);
    const navigate = useNavigate();
    /**
     * Calculates the total cost of all menu items and their parts.
     *
     * @returns {string} The total formatted as a fixed two-decimal string.
     */

    function getOrderTotal() {
        let total = 0;
        orderState.orderContent.forEach((item, i) => {
            total += item.itemPrice;
            item.parts.forEach((part, j) => {
                total += part.partPrice;
            });
        });
        return total.toFixed(2);
    }

    // Sends the order to the database in kind of a round-about way.
    // You can't just send a whole order object in, you need to first create an
    // empty order in the database, then add an item to that order, then add
    // parts to that item, and then add another item, and so on.
    // TODO: add flag for errors and use it to retry the confirmation if errors occurred.

    /**
     * Sends the order to the backend API. Performs multiple sequential operations:
     * - Creates new order
     * - Sends each item (with quantity)
     * - Sends each part for that item
     * - Finalizes the order
     *
     * @async
     * @returns {Promise<void>}
     */
    async function confirmOrder() {
        setConfirmDisabled(true);
        orderState.setIsProcessing(true);
        if (orderState.orderContent.length === 0) {
            console.log("Cannot make order without at least one item!");
            setConfirmDisabled(false);
            return;
        }

        // Move to menu_items screen if the order is made while on menu_parts screen.
        if (locationHead === "menu_parts") {
            navigate("/cashier/menu_items");
        }
        
        try {
            // Create empty order
            const orderResp = await axios.post('/api/orders/', {});
            const orderId = orderResp.data.order_id;
            console.log("Successfully created order.");
            
            // Add items to order sequentially
            for (const item of orderState.orderContent) {
                const itemResp = await axios.post(`/api/orders/${orderId}/items`, {
                    menu_item_id: item.itemId, 
                    quantity: 1
                });
                const orderItemId = itemResp.data.order_item_id;
                console.log("Successfully added order item.");
                
                // Add parts to orderItem
                for (const part of item.parts) {
                    await axios.post(`/api/orders/items/${orderItemId}/parts`, {
                        menu_part_id: part.partId 
                    });
                    console.log("Successfully added menu part to order item.");
                }
            }
            
            const finalizeOrder = await axios.put(`/api/orders/${orderId}/finalize`, {});
            if (finalizeOrder.data.success !== true) {
                throw new Error("ERROR: order finalization failed!");
            }

            console.log("Order confirmed successfully!");
            orderState.setOrderContent([]);    // Clear the order.
        } catch (error) {
            console.log("ERROR during order confirmation:", error);
        } finally {
            setConfirmDisabled(false);
            orderState.setIsProcessing(false);
        }
    };

    return (
    <div className={styles.orderSummary}>
        <div className={styles.orderTotal}>
            <h4 className={styles.totalHeader}>Total:</h4>
            <span className={styles.totalPrice}>{ getOrderTotal() }</span>
        </div>
        <button className={clsx(styles.confirmOrderButton, confirmDisabled && styles.confirmDisabled)} disabled={confirmDisabled} onClick={confirmOrder}>{ confirmDisabled ? "Processing Order..." : "Confirm Order" }</button>
    </div>
    );
}
