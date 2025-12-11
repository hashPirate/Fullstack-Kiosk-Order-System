/**
 * @module ManageMenuItems/EditPartsPopup
 */
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EditPartsPopup.module.css";

/**
 * Popup that allows the manager to associate menu parts with a menu item.
 * @param {{menuItemId: number, prompt: string, onCommit: Function, onCancel: Function, errorString: string|null}} props
 * @returns {React.ReactElement}
 */
export default function EditPartsPopup({ menuItemId, prompt, onCommit, onCancel, errorString }) {
    const [allParts, setAllParts] = useState([]);
    const [selectedPartIds, setSelectedPartIds] = useState(new Set());
    const [initialPartIds, setInitialPartIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        let mounted = true;
        const fetchData = async () => {
            try {
                const [partsRes, itemPartsRes] = await Promise.all([
                    axios.get("/api/menu/parts"),
                    axios.get(`/api/menu/items/${menuItemId}/parts`)
                ]);
                
                if (mounted) {
                    setAllParts(partsRes.data);
                    const currentIds = new Set(itemPartsRes.data.map(p => p.menu_part_id));
                    setSelectedPartIds(currentIds);
                    setInitialPartIds(currentIds);
                    setLoading(false);
                }
            } catch (err) {
                if (mounted) {
                    console.error(err);
                    setFetchError("Failed to load parts data.");
                    setLoading(false);
                }
            }
        };
        fetchData();
        return () => { mounted = false; };
    }, [menuItemId]);

    const handleCheckboxChange = (partId) => {
        const newSelected = new Set(selectedPartIds);
        if (newSelected.has(partId)) {
            newSelected.delete(partId);
        } else {
            newSelected.add(partId);
        }
        setSelectedPartIds(newSelected);
    };

    const handleSave = () => {
        const added = [...selectedPartIds].filter(id => !initialPartIds.has(id));
        const removed = [...initialPartIds].filter(id => !selectedPartIds.has(id));
        onCommit({ added, removed });
    };

    if (loading) return <div className={styles.popupContainer}><div className={styles.popupContent}>Loading...</div></div>;

    return (
        <div className={styles.popupContainer}>
            <div className={styles.popupContent}>
                <p className={styles.editPrompt}>{prompt}</p>
                { (errorString || fetchError) && <p className={styles.errorMessage}>{errorString || fetchError}</p> }
                
                <div className={styles.partsList}>
                    {allParts.map(part => (
                        <label key={part.menu_part_id} className={styles.partItem}>
                            <input 
                                type="checkbox" 
                                checked={selectedPartIds.has(part.menu_part_id)} 
                                onChange={() => handleCheckboxChange(part.menu_part_id)}
                            />
                            {part.part_name}
                        </label>
                    ))}
                </div>

                <div className={styles.buttons}>
                    <button className={styles.confirmButton} onClick={handleSave}>Save</button>
                    <button className={styles.cancelButton} onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}