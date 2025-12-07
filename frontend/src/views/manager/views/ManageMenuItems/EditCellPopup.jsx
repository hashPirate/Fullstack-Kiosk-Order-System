import styles from "./EditCellPopup.module.css";

export default function EditCellPopup({ prompt, currentVal, onCommit, onCancel }) {
    return (
        <div className={styles.popupContainer}>
            <div className={styles.popupContent}>
                <p className={styles.editPrompt}>{prompt}</p>
                <input className={styles.input} placeholder={currentVal} />
                <div className={styles.buttons}>
                    <button className={styles.confirmButton} onClick={onCommit}>Ok</button>
                    <button className={styles.cancelButton} onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}


