import { GoXCircle } from "react-icons/go";
import { IoIosRemoveCircleOutline } from "react-icons/io";

import styles from './OrderView.module.css';

export default function OrderView() {
    return (
        <>
            <h2 className={styles.orderHeader}>Order</h2>
            <div className={styles.orderMenuItems}>
                <div className={styles.orderMenuItem}>
                    <div className={styles.itemHeader}>
                        <h4 className={styles.itemTitle}>Menu Item</h4>
                        <span className={styles.itemPrice}>9.99</span>
                        <GoXCircle className={styles.itemXButton} />
                    </div>
                    <div className={styles.orderMenuPart}>
                        <span className={styles.partTitle}>Kung Pao Chicken</span>
                        <span className={styles.partPrice}>9.99</span>
                        <IoIosRemoveCircleOutline className={styles.partXButton}/>
                    </div>
                </div>
            </div>
            <div className={styles.orderTotals}></div>
            <button className={styles.confirmOrderButton}>Confirm Order</button>
        </>
    );
}

