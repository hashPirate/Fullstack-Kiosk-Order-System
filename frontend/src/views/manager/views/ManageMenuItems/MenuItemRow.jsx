/**
 * @module ManageMenuItems/MenuItemRow
 */
import styles from "./ManageMenuItems.module.css";
import editType from "./editType.js";

// Passing in the entire handleEditCommit function for for_sale
/**
 * Displays a single menu item entry with inline edit affordances.
 * @param {{menuItemId: number, itemName: string, price: number|string, forSale: boolean, onEditStart: Function, handleEditCommit: Function}} props Row props provided by the parent list.
 * @returns {React.ReactElement} Table row representing a single menu item.
 */
export default function MenuItemRow({ menuItemId, itemName, price, forSale, onEditStart, handleEditCommit}) {

    return (
        <tr>
            <td>{menuItemId}</td>
            <td
                className={styles.editableCell}
                onClick={() => onEditStart(menuItemId, editType.NAME)}
                title="Click to edit"
            >
                {itemName}
            </td>
            <td
                className={styles.editableCell}
                onClick={() => onEditStart(menuItemId, editType.PRICE)}
                title="Click to edit"
            >
                ${parseFloat(price).toFixed(2)}
            </td>
            <td>
                <input
                    type="checkbox"
                    checked={forSale}
                    onChange={(event) => handleEditCommit(menuItemId, editType.FOR_SALE, event.target.checked)}
                />
            </td>
        </tr>
    );
}
