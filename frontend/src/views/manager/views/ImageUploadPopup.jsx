/**
 * @module ManageMenuItems/ImageUploadPopup
 */
import { useState } from 'react';
import styles from './ImageUploadPopup.module.css';

/**
 * A popup component for uploading an image.
 * @param {Object} props - The component props.
 * @param {string} props.prompt - The prompt message to display.
 * @param {Function} props.onCommit - The function to call when the upload is confirmed.
 * @param {Function} props.onCancel - The function to call when the upload is canceled.
 * @param {string} props.errorString - An error message to display.
 * @returns {React.ReactElement} The image upload popup component.
 */
export default function ImageUploadPopup({ prompt, onCommit, onCancel, errorString }) {
    const [imageFile, setImageFile] = useState(null);

    function handleFileChange(e) {
        setImageFile(e.target.files[0]);
    }

    function handleCommit() {
        if (imageFile) {
            onCommit(imageFile);
        }
    }

    return (
        <div className={styles.popupContainer}>
            <div className={styles.popupContent}>
                <p className={styles.editPrompt}>{prompt}</p>
                <input type="file" accept="image/*" onChange={handleFileChange} className={styles.input} />
                {errorString && <p className={styles.errorMessage}>{errorString}</p>}
                <div className={styles.actions}>
                    <button onClick={handleCommit} disabled={!imageFile} className={styles.confirmButton}>
                        Upload
                    </button>
                    <button onClick={onCancel} className={styles.cancelButton}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}