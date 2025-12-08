import { useState } from "react";
import styles from "./AddRowPopup.module.css";

/**
 * Modal that collects the details for a new menu item prior to submission.
 * @param {{prompt: string, onCommit: Function, onCancel: Function, errorString: string|null}} props Popup props supplied by the parent component.
 * @returns {JSX.Element} Form that allows the manager to add a new row.
 */
export default function EditCellPopup({ prompt, onCommit, onCancel, errorString }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [forSale, setForSale] = useState(false);

    // Calm luh managed components
    /**
     * Updates the local name state when the user edits the input.
     * @param {import('react').ChangeEvent<HTMLInputElement>} e Change event from the text field.
     * @returns {void}
     */
    function handleNameChange(e) {
        setName(e.target.value);
    }
    /**
     * Keeps the price field in sync with the component state.
     * @param {import('react').ChangeEvent<HTMLInputElement>} e Change event from the price field.
     * @returns {void}
     */
    function handlePriceChange(e) {
        setPrice(e.target.value);
    }
    /**
     * Toggles whether the new item should be marked as available for sale.
     * @param {import('react').ChangeEvent<HTMLInputElement>} e Change event from the checkbox.
     * @returns {void}
     */
    function handleForSaleChange(e) {
        setForSale(e.target.checked);
    }

    return (
        <div className={styles.popupContainer}>
            <div className={styles.popupContent}>
                <p className={styles.editPrompt}>{prompt}</p>
                { errorString ? <p className={styles.errorMessage}>{errorString}</p> : <></> }

                <label>
                    Name:<br/>
                    <input value={name} onChange={handleNameChange} className={styles.input} />
                </label>

                <label>
                    Price:<br/>
                    <input value={price} onChange={handlePriceChange} className={styles.input} />
                </label>

                <label>
                    For sale: <input type="checkbox" checked={forSale} onChange={handleForSaleChange}/>
                </label>

                <div className={styles.buttons}>
                    <button className={styles.confirmButton} onClick={() => onCommit(name, price, forSale)}>Add</button>
                    <button className={styles.cancelButton} onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

