/**
 * @module ManageMenuItems/EditCellPopup
 */
import { useState } from "react";
import styles from "./EditCellPopup.module.css";

/**
 * Popup that captures the new value for a specific field of an existing menu item.
 * @param {{prompt: string, onCommit: Function, onCancel: Function, errorString: string|null}} props Configuration for the popup prompts and callbacks.
 * @returns {React.ReactElement} Form that accepts a single updated value.
 */
export default function EditCellPopup({ prompt, onCommit, onCancel, errorString }) {
    const [inputVal, setInputVal] = useState("");

    // Calm luh managed component
    /**
     * Synchronizes the text input with component state as the user types.
     * @param {Object} e Change event from the text box.
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
