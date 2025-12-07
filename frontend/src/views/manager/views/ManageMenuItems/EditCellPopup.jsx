import { useState } from "react";
import styles from "./EditCellPopup.module.css";

export default function EditCellPopup({ prompt, onCommit, onCancel, errorString }) {
    const [inputVal, setInputVal] = useState("");

    // Calm luh managed component
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
                    <button className={styles.confirmButton} onClick={() => onCommit(inputVal)}>Ok</button>
                    <button className={styles.cancelButton} onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}


