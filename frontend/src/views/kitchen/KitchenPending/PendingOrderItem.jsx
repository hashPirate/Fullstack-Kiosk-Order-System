
import styles from "./PendingOrder.module.css";
/**
 * Renders an individual item inside a pending order, showing its name
 * and all associated menu parts (e.g., base + sides).
 *
 * @function PendingOrderItem
 * @param {Object} props
 * @param {string} props.itemName - Name of the menu item.
 * @param {Array<Object>} props.menuParts - Parts included in the item.
 * @returns {React.ReactElement} The rendered pending order item.
 */
export default function PendingOrderItem({itemName, menuParts}) {
    return (
        <div className={styles.pendingOrderItem}>
            <h3 className={styles.itemName}>{itemName}</h3>
            { menuParts.map((prt,i) => <p key={i} className={styles.menuPart}>{prt.part_name}</p>) }
        </div>
    );
}