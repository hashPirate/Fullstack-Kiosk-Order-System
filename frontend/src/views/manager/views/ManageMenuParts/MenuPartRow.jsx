import styles from "./ManageMenuParts.module.css";
import editType from "./editType.js";

// Passing in the entire handleEditCommit function for for_sale
export default function MenuPartRow({ menuPartId, partName, price, forSale, onEditStart, handleEditCommit}) {

    return (
        <tr>
            <td>{menuPartId}</td>
            <td
                className={styles.editableCell}
                onClick={() => onEditStart(menuPartId, partName, editType.NAME)}
                title="Click to edit"
            >
                {partName}
            </td>
            <td
                className={styles.editableCell}
                onClick={() => onEditStart(menuPartId, partName, editType.PRICE)}
                title="Click to edit"
            >
                ${parseFloat(price).toFixed(2)}
            </td>
            <td>
                <input
                    type="checkbox"
                    checked={forSale}
                    onChange={(event) => handleEditCommit(menuPartId, editType.FOR_SALE, event.target.checked)}
                />
            </td>
            <td
                className={styles.editableCell}
                onClick={() => onEditStart(menuPartId, partName, editType.INGREDIENTS)}
                title="Click to view / edit"
            >
                <button className={styles.editButton}>Edit</button>
            </td>
        </tr>
    );
}
