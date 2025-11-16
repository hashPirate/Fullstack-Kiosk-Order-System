import styles from "./OrderView.module.css";

export default function OrderSummary() {
    return (
    <div className={styles.orderSummary}>
        <div className={styles.orderTotal}>
            <h4 className={styles.totalHeader}>Total:</h4>
            <span className={styles.totalPrice}>99.99</span>
        </div>
        <button className={styles.confirmOrderButton}>Confirm Order</button>
    </div>
    );
}
