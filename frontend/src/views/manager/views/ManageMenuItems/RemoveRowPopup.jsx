import { useState } from "react";
import styles from "./AddRowPopup.module.css";

export default function RemoveRowPopup({ prompt, onCommit, onCancel, errorString}) {
    const [removalID, setRemovalID] = useState("");

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


