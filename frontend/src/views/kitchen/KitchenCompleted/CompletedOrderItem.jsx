
import styles from "./CompletedOrder.module.css";
/**
 * Displays an individual item inside a completed order, along with its
 * associated menu parts
 * @function CompletedOrderItem
 * @param {Object} props
 * @param {string} props.itemName - Name of the menu item.
 * @param {Array<Object>} props.menuParts - List of menu parts for the item.
 * @returns {React.ReactElement} The rendered completed order item.
 */
export default function PendingOrderItem({itemName, menuParts}) {
    return (
        <div className={styles.completedOrderItem}>
            <h3 className={styles.itemName}>{itemName}</h3>
            { menuParts.map((prt,i) => <p key={i} className={styles.menuPart}>{prt.part_name}</p>) }
        </div>
    );
}