/**
 * @module ManageMenuParts/MenuPartRow
 */
import styles from "./ManageMenuParts.module.css";
import editType from "./editType.js";

/**
 * Renders a single menu part row with inline edit affordances, including ingredient editing.
 * @param {{menuPartId: number, partName: string, price: number|string, imageName: string, forSale: boolean, onEditStart: Function, handleEditCommit: Function}} props Props supplied by parent with handlers and field data.
 * @returns {React.ReactElement} Table row for one menu part entry.
 */
export default function MenuPartRow({ menuPartId, partName, price, imageName, forSale, onEditStart, handleEditCommit}) {

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
            <td
                className={styles.editableCell}
                onClick={() => onEditStart(menuPartId, partName, editType.IMAGE)}
                title="Click to edit"
            >
                {imageName 
                    ? <img src={`/api/images/${imageName}`} alt={partName} style={{width: '100px', height: 'auto'}} />
                    : 'No Image'}
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
