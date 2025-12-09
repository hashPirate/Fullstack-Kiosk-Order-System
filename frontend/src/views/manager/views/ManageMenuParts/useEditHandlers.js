import editType from "./editType";
import axios from "axios";

/**
 * @module ManageMenuParts/useEditHandlers
 */

/**
 * Provides edit popup lifecycle hooks for menu part rows.
 * @param {Function} setCurrentEditID Setter that tracks which part is being edited.
 * @param {Function} setCurrentEditType Setter tracking which field is under edit.
 * @param {Function} setEditErrorString Setter used to display validation messages.
 * @param {Function} setCurrentEditName Setter storing the current part name for ingredient modal.
 * @param {Object} editMutation React Query mutation that persists part updates.
 * @returns {{handleEditStart: Function, handleEditCommit: Function, handleEditCancel: Function}} Helper callbacks exposed to the UI.
 */
export default function useEditHandlers(setCurrentEditID, setCurrentEditType, setEditErrorString, setCurrentEditName, editMutation) {
    // Begin editing an item by showing the popup
    /**
     * Opens the edit popup for the specified part and captures its metadata.
     * @param {number} id Menu part identifier selected for editing.
     * @param {string} name Current part name, used when editing ingredients.
     * @param {string} type Field identifier describing which attribute to edit.
     * @returns {void}
     */
    function handleEditStart(id, name, type) {
        setCurrentEditID(id);
        setCurrentEditName(name);
        setCurrentEditType(type);
    }

    /**
     * Handles the upload of a new image for a menu part.
     * @param {number} id - The ID of the menu part.
     * @param {File} imageFile - The image file to upload.
     */
    async function handleImageUpload(id, imageFile) {
        try {
            const imageName = `menu_part_${id}_${Date.now()}.${imageFile.name.split('.').pop()}`;
            await axios.post(`/api/images/${imageName}/upload`, imageFile, {
                headers: {
                    'Content-Type': imageFile.type
                }
            });
    
            editMutation.mutate({ menu_part_id: id, image_name: imageName });
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
     * Validates edit input and triggers the appropriate mutation.
     * @param {number} id Menu part identifier being updated.
     * @param {string} type Field identifier describing the edit type.
     * @param {string|number|boolean|Array<Object>} newData Value supplied by the user, format depends on type.
     * @returns {void}
     */
    function handleEditCommit(id, type, newData) {
        if (type === editType.NAME) {
            // Check valid name and data type.
            if (newData === "") {
                setEditErrorString("ERROR: new name cannot be empty.");
                return;
            }
            if (typeof newData !== "string") {
                throw new Error(`newData must have type 'string' to update name. Current type is ${typeof newData}`);
            }

            editMutation.mutate({menu_part_id: id, part_name: newData});
            setCurrentEditID(null);
            setCurrentEditType(null);
            setCurrentEditName(null);
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

            editMutation.mutate({menu_part_id: id, price: Number(newData)});
            setCurrentEditID(null);
            setCurrentEditType(null);
            setCurrentEditName(null);
            setEditErrorString(null);
        } else if (type === editType.FOR_SALE) {
            // Check data type
            if (typeof newData !== 'boolean') {
                throw new Error("Invalid data type for for_sale.");
            }

            editMutation.mutate({menu_part_id: id, for_sale: newData});
            setCurrentEditID(null);
            setCurrentEditType(null);
            setCurrentEditName(null);
            setEditErrorString(null);
        } else if (type === editType.INGREDIENTS) {
            // This is what we will actually send to the server.
            // No names, just ingredient_id -> quantity.
            let ingredientsDeliverable = {};
            for (const d of newData) {
                ingredientsDeliverable[d.ingredient_id] = d.quantity;
            }

            // No need to run checks for this one tbh.
            editMutation.mutate( { menu_part_id: id, ingredients: ingredientsDeliverable } );
            setCurrentEditID(null);
            setCurrentEditType(null);
            setCurrentEditName(null);
            setEditErrorString(null);
        } else if (type === editType.IMAGE) {
            handleImageUpload(id, newData); // newData is the imageFile
        } else {
            throw new Error("Invalid edit type.");
        }
    }

    /**
     * Resets edit state and closes any open edit popup.
     * @returns {void}
     */
    function handleEditCancel() {
        setCurrentEditID(null);
        setCurrentEditType(null);
        setCurrentEditName(null);
        setEditErrorString(null);
    }

    return {handleEditStart, handleEditCommit, handleEditCancel};
}
