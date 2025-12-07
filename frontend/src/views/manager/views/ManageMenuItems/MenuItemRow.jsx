import styles from "./ManageMenuItems.module.css";
import editType from "./editType.js";

// Passing in the entire handleEditCommit function for for_sale
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
