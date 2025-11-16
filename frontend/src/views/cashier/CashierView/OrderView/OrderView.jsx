import { useContext } from 'react';

import styles from './OrderView.module.css';
import OrderMenuItem from "./OrderMenuItem";
import OrderMenuPart from "./OrderMenuPart";
import OrderSummary from './OrderSummary';

import OrderContext from '../../OrderContext';

export default function OrderView() {
    const orderState = useContext(OrderContext);

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

