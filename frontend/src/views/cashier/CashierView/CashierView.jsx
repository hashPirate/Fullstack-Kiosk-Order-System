import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import OrderView from './OrderView/OrderView.jsx';
import styles from "./CashierView.module.css";
import CashierHeader from './CashierHeader.jsx';
import ProgressBar from './OrderProgression.jsx';
import OrderProgression from './OrderProgression.jsx';
import OrderContext from '../OrderContext.jsx';
import { useState } from 'react';
/**
 * @module views/cashier/CashierView/CashierView
 */
/**
 * Main container for the cashier workflow. Manages global order state and
 * provides it to all descendants through React context.
 *
 * @function CashierView
 * @description
 * This component:
 * - Stores the current order (items + parts)
 * - Provides functions for adding/removing items and parts
 * - Tracks whether the system is currently processing an order
 * - Renders the order pane (left) and menu-selection pane (right)
 * - Wraps everything with an OrderContext.Provider
 *
 * Child components access order state and actions via {@link module:views/cashier/OrderContext~OrderContext}.
 *
 * @returns {React.ReactElement} Split-view cashier interface with order and menu panes.
 */
export default function CashierView() {
    // Order content is a list of menu item objects
    // Menu item object will look as follows:
        // {
        //     itemId: 5,     // The ID from the database
        //     itemName: "Example Item",
        //     itemPrice: 9.99,
        //     parts: [
        //         ...
        //     ]
        // }
    // orderContent[i].parts will be of the following form:
        // {
        //     partId: 5,      // The ID from the database
        //     partName: "Example Menu Part",
        //     partPrice: 9.99
        // }
    const [orderContent, setOrderContent] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    /**
     * Adds a new menu item to the order.
     *
     * @param {number} menuItemId - ID of the selected menu item.
     * @param {string} menuItemName - Human-readable item name.
     * @param {number} menuItemPrice - Base price of the menu item.
     */

    function addMenuItem(menuItemId, menuItemName, menuItemPrice) {
        setOrderContent([ ...orderContent, {itemId: menuItemId, itemName: menuItemName, itemPrice: menuItemPrice, parts: []} ]);
    }
    /**
     * Removes a menu item from the order.
     *
     * @param {number} removeItemIndex - Array index of the item to remove.
     */
    function removeMenuItem(removeItemIndex) {
        setOrderContent(orderContent.slice(0, removeItemIndex).concat(orderContent.slice(removeItemIndex + 1, orderContent.length)));
    }
    /**
     * Adds a menu part (modifier/add-on) to a specific menu item.
     *
     * @param {number} itemIndex - Index of the parent item.
     * @param {number} menuPartId - ID of the selected part.
     * @param {string} menuPartName - Display name of the part.
     * @param {number} menuPartPrice - Price impact of the part.
     */
    function addMenuPart(itemIndex, menuPartId, menuPartName, menuPartPrice) {
        const newOrderContent = orderContent.map((item, i) => {
            if (i === itemIndex) {
                return {
                    ...item,
                    parts: [...item.parts, {partId: menuPartId, partName: menuPartName, partPrice: menuPartPrice}]
                };
            }
            return item;
        })
        setOrderContent(newOrderContent);
    }
    /**
     * Removes a menu part from a specific menu item.
     *
     * @param {number} itemIndex - Index of the parent item.
     * @param {number} removePartIndex - Index of the part to remove.
     */
    function removeMenuPart(itemIndex, removePartIndex) {
        const newOrderContent = orderContent.map((item, i) => {
            if (i === itemIndex) {
                return {
                    ...item,
                    parts: item.parts.slice(0, removePartIndex).concat(item.parts.slice(removePartIndex + 1))
                };
            }
            return item;
        });
        setOrderContent(newOrderContent);
    }

    const orderContextVal = {
        orderContent,
        isProcessing,
        setIsProcessing,
        setOrderContent,
        addMenuItem,
        removeMenuItem,
        addMenuPart,
        removeMenuPart,
    };

    return (
    <OrderContext.Provider value={orderContextVal}>
        <CashierHeader />
        <div className={styles.splitView}>
            <div className={styles.orderPane}>
                <OrderView />
            </div>
            <div className={styles.menuPane}>
                {/* Outlet the selection screens here. */}
                <OrderProgression />
                <Outlet />
            </div>
        </div>
    </OrderContext.Provider>
    );
}
