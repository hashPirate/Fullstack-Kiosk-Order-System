/**
 * @module ManageMenuParts/useRemoveHandlers
 */

/**
 * Supplies helper callbacks for removing menu parts.
 * @param {Function} setIsRemoving Setter controlling whether the remove popup is visible.
 * @param {Function} setRemoveErrorString Setter used to display validation errors.
 * @param {Object} removeMutation React Query mutation responsible for deletions.
 * @param {Array<Object>} menuPartsData Cached menu parts used for validating IDs.
 * @returns {{handleRemoveStart: Function, handleRemoveCommit: Function, handleRemoveCancel: Function}} Remove handlers consumed by the UI.
 */
export default function useRemoveHandlers(setIsRemoving, setRemoveErrorString, removeMutation, menuPartsData) {
    /**
     * Opens the remove popup when the user initiates deletion.
     * @returns {void}
     */
    function handleRemoveStart() {
        setIsRemoving(true);
    }

    /**
     * Validates the ID entered by the user and runs the delete mutation if valid.
     * @param {string|number} id Identifier entered by the manager.
     * @returns {void}
     */
    function handleRemoveCommit(id) {
        // Check that id is numeric
        if ( isNaN( Number(id) ) ) {
            setRemoveErrorString("ERROR: id must be a number.");
            return;
        }

        // Check that menu part with `id` exists
        let validID = false;
        for (const part of menuPartsData) {
            if (part.menu_part_id === Number(id)) {
                validID = true;
                break;
            }
        }
        if (!validID) {
            setRemoveErrorString("ERROR: please enter a valid ID.");
            return;
        }

        removeMutation.mutate({ menu_part_id: Number(id) });
        setIsRemoving(false);
        setRemoveErrorString(null);
    }

    /**
     * Closes the remove popup and clears any errors.
     * @returns {void}
     */
    function handleRemoveCancel() {
        setIsRemoving(false);
        setRemoveErrorString(null);
    }

    return { handleRemoveStart, handleRemoveCommit, handleRemoveCancel };
}
