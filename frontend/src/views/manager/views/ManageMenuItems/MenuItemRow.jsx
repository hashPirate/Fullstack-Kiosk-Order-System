import styles from "./ManageMenuItems.module.css";

export default function MenuItemRow({ menuItemId, itemName, price, forSale }) {
    // TODO
    function handleCellEdit() {}

    return (
        <tr>
            <td>{menuItemId}</td>
            <td
                className={styles.editableCell}
                onClick={() => handleCellEdit()}
                title="Click to edit"
            >
                {itemName}
            </td>
            <td
                className={styles.editableCell}
                onClick={() => handleCellEdit()}
                title="Click to edit"
            >
                ${parseFloat(price).toFixed(2)}
            </td>
            <td>
                <input
                    type="checkbox"
                    checked={forSale}
                    onChange={() => handleCellEdit()}
                />
            </td>
        </tr>
    );
}
