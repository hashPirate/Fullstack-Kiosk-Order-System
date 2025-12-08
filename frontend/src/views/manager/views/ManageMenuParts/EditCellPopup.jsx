/**
 * @module ManageMenuParts/EditCellPopup
 */
import { useState } from "react";
import styles from "./EditCellPopup.module.css";

/**
 * Popup that accepts a single updated value for a menu part field.
 * @param {{prompt: string, onCommit: Function, onCancel: Function, errorString: string|null}} props Configuration and callbacks passed by parent.
 * @returns {React.ReactElement} Modal allowing text edits for a field.
 */
export default function EditCellPopup({ prompt, onCommit, onCancel, errorString }) {
    const [inputVal, setInputVal] = useState("");

    // Calm luh managed component
    /**
     * Keeps the controlled text input synchronized with state.
     * @param {Object} e Input change event.
     * @returns {void}
     */
    function handleInputChange(e) {
        setInputVal(e.target.value);
    }

    return (
        <div className={styles.popupContainer}>
            <div className={styles.popupContent}>
                <p className={styles.editPrompt}>{prompt}</p>
                { errorString ? <p className={styles.errorMessage}>{errorString}</p> : <></> }

                <input value={inputVal} onChange={handleInputChange} className={styles.input} />

                <div className={styles.buttons}>
                    <button className={styles.confirmButton} onClick={() => onCommit(inputVal)}>Done</button>
                    <button className={styles.cancelButton} onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
