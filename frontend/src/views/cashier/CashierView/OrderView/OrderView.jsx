
import styles from './OrderView.module.css';
import OrderMenuItem from "./OrderMenuItem";
import OrderMenuPart from "./OrderMenuPart";
import OrderSummary from './OrderSummary';

export default function OrderView() {
    return (
        <div className={styles.orderView}>
            <h2 className={styles.orderHeader}>Order</h2>
            <div className={styles.orderMenuItems}>
                <OrderMenuItem name="Menu Item" price="99.99">
                    {/* <OrderMenuPart name="Menu Part" price="8.88"/>
                    <OrderMenuPart name="Menu Part" price="8.88"/>
                    <OrderMenuPart name="Menu Part" price="8.88"/> */}
                </OrderMenuItem>
            </div>
            <OrderSummary/>
        </div>
    );
}

