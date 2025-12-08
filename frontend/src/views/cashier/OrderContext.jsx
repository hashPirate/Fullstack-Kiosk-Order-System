import { createContext } from "react";

/**
 * @module views/cashier/OrderContext
 */

/**
 * @typedef {object} OrderItemContent
 * @property {number} itemId - The database ID of the menu item.
 * @property {string} itemName - Human-readable item name.
 * @property {number} itemPrice - Base price of the menu item.
 * @property {Array<OrderPartContent>} parts - List of menu parts associated with this item.
 */

/**
 * @typedef {object} OrderPartContent
 * @property {number} partId - The database ID of the menu part.
 * @property {string} partName - Display name of the menu part.
 * @property {number} partPrice - Price impact of the menu part.
 */

/**
 * @typedef {object} OrderContextType
 * @property {Array<OrderItemContent>} orderContent - The current list of items in the order.
 * @property {boolean} isProcessing - Indicates if an order is currently being processed (e.g., sent to backend).
 * @property {function(boolean): void} setIsProcessing - Function to set the processing state.
 * @property {function(Array<OrderItemContent>): void} setOrderContent - Function to set the entire order content.
 * @property {function(number, string, number): void} addMenuItem - Function to add a new menu item to the order.
 * @property {function(number): void} removeMenuItem - Function to remove a menu item from the order.
 * @property {function(number, number, string, number): void} addMenuPart - Function to add a menu part to a specific order item.
 * @property {function(number, number): void} removeMenuPart - Function to remove a menu part from a specific order item.
 */

/**
 * React Context for managing the global order state in the cashier view.
 * This context allows all components in the cashier view to access and manipulate the order state.
 * @type {React.Context<OrderContextType>}
 */
const OrderContext = createContext({
    orderContent: [],
    isProcessing: false,
    setIsProcessing: null,
    setOrderContent: null,
    addMenuItem: null,
    removeMenuItem: null,
    addMenuPart: null,
    removeMenuPart: null
});
export default OrderContext;
