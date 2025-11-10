
import styles from "./PendingOrder.module.css";

export default function PendingOrderItem({itemName, menuParts}) {
    return (
        <div className={styles.pendingOrderItem}>
            <h3 className={styles.itemName}>{itemName}</h3>
            { menuParts.map((prt,i) => <p key={i} className={styles.menuPart}>{prt}</p>) }
        </div>
    );
}