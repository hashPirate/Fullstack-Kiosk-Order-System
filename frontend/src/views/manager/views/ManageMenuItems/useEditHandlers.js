import editType from "./editType";

/**
 * @module ManageMenuItems/useEditHandlers
 */

/**
 * Encapsulates edit popup lifecycle helpers for menu item rows.
 * @param {Function} setCurrentEditID Setter for tracking which item is being edited.
 * @param {Function} setCurrentEditType Setter for tracking which field is being edited.
 * @param {Function} setEditErrorString Setter for presenting validation errors inside the popup.
 * @param {Object} editMutation React Query mutation used to persist edits.
 * @returns {{handleEditStart: Function, handleEditCommit: Function, handleEditCancel: Function}} Collection of edit handlers.
 */
export default function useEditHandlers(setCurrentEditID, setCurrentEditType, setEditErrorString, editMutation) {
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

    // Finish editing an item by updating it in db.
    /**
     * Validates the edited data and triggers the appropriate mutation update.
     * @param {number} id Menu item identifier being modified.
     * @param {string} type Field identifier describing which value to edit.
     * @param {string|number|boolean} newData User-provided value for the field.
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
