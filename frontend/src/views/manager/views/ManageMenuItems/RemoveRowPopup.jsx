/**
 * @module ManageMenuItems/RemoveRowPopup
 */
import { useState } from "react";
import styles from "./AddRowPopup.module.css";

/**
 * Popup that asks the manager for the ID of the menu item to remove.
 * @param {{prompt: string, onCommit: Function, onCancel: Function, errorString: string|null}} props Popup props configured by the parent view.
 * @returns {React.ReactElement} Modal that confirms removal input.
 */
export default function RemoveRowPopup({ prompt, onCommit, onCancel, errorString}) {
    const [removalID, setRemovalID] = useState("");

    /**
     * Updates the target removal ID as the user enters a value.
     * @param {Object} e Change event from the numeric field.
     * @returns {void}
     */
    function handleIdChange(e) {
        setRemovalID(e.target.value);
    }

    return (
        <div className={styles.popupContainer}>
            <div className={styles.popupContent}>
                <p className={styles.editPrompt}>{prompt}</p>
                { errorString ? <p className={styles.errorMessage}>{errorString}</p> : <></> }

                <label>
                    ID to remove:<br/>
                    <input value={removalID} onChange={handleIdChange} className={styles.input} />
                </label>

                <div className={styles.buttons}>
                    <button className={styles.confirmButton} onClick={() => onCommit(removalID)}>Remove</button>
                    <button className={styles.cancelButton} onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
