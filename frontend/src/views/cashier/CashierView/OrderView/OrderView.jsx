import { useContext } from 'react';

import styles from './OrderView.module.css';
import OrderMenuItem from "./OrderMenuItem";
import OrderMenuPart from "./OrderMenuPart";
import OrderSummary from './OrderSummary';

import OrderContext from '../../OrderContext';

/**
 * @module views/cashier/CashierView/OrderView/OrderView
 */
/**
 * Main component responsible for displaying all items in the current order,
 * including their parts, and the order summary/confirmation section.
 *
 * @function OrderView
 * @description
 * Pulls {@link module:views/cashier/OrderContext~OrderContextType.orderContent} from context and renders:
 * - A list of {@link OrderMenuItem} components.
 * - Each containing nested {@link OrderMenuPart} components.
 * - The {@link OrderSummary} component at the bottom.
 *
 * @returns {React.ReactElement} Full order view layout for the cashier UI.
 */

export default function OrderView() {
    const orderState = useContext(OrderContext);
    
    /**
     * Maps the current `orderContent` array into JSX elements for rendering.
     * @returns {React.ReactElement[]} List of {@link OrderMenuItem} components.
     */

    function renderOrderContent() {
        return orderState.orderContent.map((item, i) => {
            return (
                <OrderMenuItem key={i} id={item.itemId} name={item.itemName} price={item.itemPrice.toFixed(2)} itemIndex={i}>
                    { item.parts.map((part, j) => <OrderMenuPart key={j} id={part.partId} name={part.partName} price={part.partPrice.toFixed(2)} itemIndex={i} partIndex={j} />) }
                </OrderMenuItem>
            );
        });
    }

    return (
        <div className={styles.orderView}>
            <h2 className={styles.orderHeader}>Order</h2>
            <div className={styles.orderMenuItems}>
                { renderOrderContent() }
            </div>
            <OrderSummary/>
        </div>
    );
}
