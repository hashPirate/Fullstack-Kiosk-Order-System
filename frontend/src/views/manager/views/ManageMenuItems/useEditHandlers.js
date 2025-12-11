import editType from "./editType";
import axios from "axios";

/**
 * @module ManageMenuItems/useEditHandlers
 */

/**
 * Encapsulates edit popup lifecycle helpers for menu item rows.
 * @param {Function} setCurrentEditID Setter for tracking which item is being edited.
 * @param {Function} setCurrentEditType Setter for tracking which field is being edited.
 * @param {Function} setEditErrorString Setter for presenting validation errors inside the popup.
 * @param {Object} editMutation React Query mutation used to persist edits.
 * @param {Object} queryClient The React Query client instance for invalidating queries.
 * @returns {{handleEditStart: Function, handleEditCommit: Function, handleEditCancel: Function}} Collection of edit handlers.
 */
export default function useEditHandlers(setCurrentEditID, setCurrentEditType, setEditErrorString, editMutation, queryClient) {
    // Begin editing an item by showing the popup
    /**
     * Opens the edit popup by recording the selected menu item and type.
     * @param {number} id Menu item identifier selected for editing.
     * @param {string} type Field identifier describing which value to edit.
     * @returns {void}
     */
    function handleEditStart(id, type) {
        setCurrentEditID(id);
        setCurrentEditType(type);
    }

    /**
     * Handles the upload of a new image for a menu item.
     * @param {number} id - The ID of the menu item.
     * @param {File} imageFile - The image file to upload.
     */
    async function handleImageUpload(id, imageFile) {
        try {
            const imageName = `menu_item_${id}_${Date.now()}.${imageFile.name.split('.').pop()}`;
            await axios.post(`/api/images/${imageName}/upload`, imageFile, {
                headers: {
                    'Content-Type': imageFile.type
                }
            });
    
            editMutation.mutate({ menu_item_id: id, image_name: imageName });
            setCurrentEditID(null);
            setCurrentEditType(null);
            setEditErrorString(null);
        } catch (err) {
            console.error("Failed to upload image:", err);
            setEditErrorString("ERROR: Failed to upload image.");
        }
    }


    // Finish editing an item by updating it in db.
    /**
     * Validates the edited data and triggers the appropriate mutation update.
     * @param {number} id Menu item identifier being modified.
     * @param {string} type Field identifier describing which value to edit.
     * @param {string|number|boolean} newData User-provided value for the field.
     * @returns {void}
     */
    async function handleEditCommit(id, type, newData) {
        if (type === editType.NAME) {
            // Check valid name and data type.
            if (newData === "") {
                setEditErrorString("ERROR: new name cannot be empty.");
                return;
            }
            if (typeof newData !== "string") {
                throw new Error(`newData must have type 'string' to update name. Current type is ${typeof newData}`);
            }

            editMutation.mutate({menu_item_id: id, item_name: newData});
            setCurrentEditID(null);
            setCurrentEditType(null);
            setEditErrorString(null);
        } else if (type === editType.PRICE) {
            // Check valid price and data type.
            if (newData === "") {
                setEditErrorString("ERROR: new price cannot be empty.");
                return;
            }
            if ( isNaN(Number(newData)) ) {
                throw new Error("newData must have type 'numer' to update price.");
            }
            if (newData < 0) {
                setEditErrorString("ERROR: new price cannot be less than 0.");
                return;
            }

            editMutation.mutate({menu_item_id: id, price: Number(newData)});
            setCurrentEditID(null);
            setCurrentEditType(null);
            setEditErrorString(null);
        } else if (type === editType.FOR_SALE) {
            // Check data type
            if (typeof newData !== 'boolean') {
                throw new Error("Invalid data type for for_sale.");
            }

            editMutation.mutate({menu_item_id: id, for_sale: newData});
            setCurrentEditID(null);
            setCurrentEditType(null);
            setEditErrorString(null);
        } else if (type === editType.IMAGE) {
            handleImageUpload(id, newData); // newData is the imageFile
        } else if (type === editType.PARTS) {
            try {
                const { added, removed } = newData;
                const promises = [];
                
                added.forEach(partId => {
                    promises.push(axios.post(`/api/menu/items/${id}/parts`, { partId }));
                });
                
                removed.forEach(partId => {
                    promises.push(axios.delete(`/api/menu/items/${id}/parts/${partId}`));
                });

                await Promise.all(promises);
                
                queryClient.invalidateQueries({ queryKey: ['managerMenuItems'] });
                setCurrentEditID(null);
                setCurrentEditType(null);
                setEditErrorString(null);
            } catch (err) {
                console.error("Failed to update parts:", err);
                setEditErrorString("ERROR: Failed to update parts.");
            }
        } else {
            throw new Error("Invalid edit type.");
        }
    }

    /**
     * Closes the edit popup and clears any pending error messages.
     * @returns {void}
     */
    function handleEditCancel() {
        setCurrentEditID(null);
        setCurrentEditType(null);
        setEditErrorString(null);
    }

    return {handleEditStart, handleEditCommit, handleEditCancel};
}
