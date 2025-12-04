
import styles from "./CompletedOrder.module.css";

export default function PendingOrderItem({itemName, menuParts}) {
    return (
        <div className={styles.completedOrderItem}>
            <h3 className={styles.itemName}>{itemName}</h3>
            { menuParts.map((prt,i) => <p key={i} className={styles.menuPart}>{prt.part_name}</p>) }
        </div>
    );
}