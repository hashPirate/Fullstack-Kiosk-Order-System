import { useState } from "react";
import styles from "./AddRowPopup.module.css";

/**
 * Popup that collects new menu part details from the manager.
 * @param {{prompt: string, onCommit: Function, onCancel: Function, errorString: string|null}} props Popup configuration supplied by the parent.
 * @returns {JSX.Element} Form for creating a new menu part entry.
 */
export default function EditCellPopup({ prompt, onCommit, onCancel, errorString }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [forSale, setForSale] = useState(false);

    // Calm luh managed components
    /**
     * Tracks changes to the part name text field.
     * @param {import('react').ChangeEvent<HTMLInputElement>} e Text input change event.
     * @returns {void}
     */
    function handleNameChange(e) {
        setName(e.target.value);
    }
    /**
     * Updates price state as the user types.
     * @param {import('react').ChangeEvent<HTMLInputElement>} e Numeric input change event.
     * @returns {void}
     */
    function handlePriceChange(e) {
        setPrice(e.target.value);
    }
    /**
     * Toggles whether the new part is marked for sale immediately.
     * @param {import('react').ChangeEvent<HTMLInputElement>} e Checkbox change event.
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

