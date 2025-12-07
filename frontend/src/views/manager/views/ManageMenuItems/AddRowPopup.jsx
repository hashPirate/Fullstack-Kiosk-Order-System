import { useState } from "react";
import styles from "./AddRowPopup.module.css";

export default function EditCellPopup({ prompt, onCommit, onCancel, errorString }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [forSale, setForSale] = useState(false);

    // Calm luh managed components
    function handleNameChange(e) {
        setName(e.target.value);
    }
    function handlePriceChange(e) {
        setPrice(e.target.value);
    }
    function handleForSaleChange(e) {
        setForSale(e.target.checked);
    }

    return (
        <div className={styles.popupContainer}>
            <div className={styles.popupContent}>
                <p className={styles.editPrompt}>{prompt}</p>
                { errorString ? <p className={styles.errorMessage}>{errorString}</p> : <></> }

                <label>
                    Name:
                    <input value={name} onChange={handleNameChange} className={styles.input} />
                </label>

                <label>
                    Price:
                    <input value={price} onChange={handlePriceChange} className={styles.input} />
                </label>

                <label>
                    For sale: <input type="checkbox" checked={forSale} onChange={handleForSaleChange}/>
                </label>

                <input value={name} onChange={handleNameChange} className={styles.input} />

                <div className={styles.buttons}>
                    <button className={styles.confirmButton} onClick={() => onCommit(inputVal)}>Add</button>
                    <button className={styles.cancelButton} onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}


