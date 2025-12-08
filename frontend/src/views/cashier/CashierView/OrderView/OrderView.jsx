import { useContext } from 'react';

import styles from './OrderView.module.css';
import OrderMenuItem from "./OrderMenuItem";
import OrderMenuPart from "./OrderMenuPart";
import OrderSummary from './OrderSummary';

import OrderContext from '../../OrderContext';

/**
 * Main component responsible for displaying all items in the current order,
 * including their parts, and the order summary/confirmation section.
 *
 * @component
 *
 * @description
 * Pulls `orderContent` from context and renders:
 * - A list of <OrderMenuItem> components.
 * - Each containing nested <OrderMenuPart> components.
 * - The <OrderSummary> component at the bottom.
 *
 * @returns {JSX.Element} Full order view layout for the cashier UI.
 */

export default function OrderView() {
    const orderState = useContext(OrderContext);
    
    /**
     * Maps the current `orderContent` array into JSX elements for rendering.
     *
     * @returns {JSX.Element[]} List of <OrderMenuItem> components.
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

