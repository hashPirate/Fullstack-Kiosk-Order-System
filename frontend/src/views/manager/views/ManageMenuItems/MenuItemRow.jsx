import styles from "./ManageMenuItems.module.css";
import editType from "./editType.js";

export default function MenuItemRow({ menuItemId, itemName, price, forSale, onCellEdit}) {

    return (
        <tr>
            <td>{menuItemId}</td>
            <td
                className={styles.editableCell}
                onClick={() => onCellEdit(menuItemId, editType.NAME)}
                title="Click to edit"
            >
                {itemName}
            </td>
            <td
                className={styles.editableCell}
                onClick={() => onCellEdit(menuItemId, editType.PRICE)}
                title="Click to edit"
            >
                ${parseFloat(price).toFixed(2)}
            </td>
            <td>
                <input
                    type="checkbox"
                    checked={forSale}
                    onChange={() => {}}
                />
            </td>
        </tr>
    );
}
