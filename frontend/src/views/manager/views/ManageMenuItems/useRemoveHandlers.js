/**
 * Supplies remove popup lifecycle handlers for the manager menu items view.
 * @param {Function} setIsRemoving Setter controlling the popup visibility.
 * @param {Function} setRemoveErrorString Setter for showing validation errors.
 * @param {import('@tanstack/react-query').UseMutationResult} removeMutation React Query mutation used to delete menu items.
 * @param {Array<Object>} menuItemsData Cached menu item data used for validation.
 * @returns {{handleRemoveStart: Function, handleRemoveCommit: Function, handleRemoveCancel: Function}} Removal handler helpers.
 */
export default function useRemoveHandlers(setIsRemoving, setRemoveErrorString, removeMutation, menuItemsData) {
    /**
     * Opens the removal popup when the user initiates the delete flow.
     * @returns {void}
     */
    function handleRemoveStart() {
        setIsRemoving(true);
    }

    /**
     * Validates the requested ID and performs the delete mutation if possible.
     * @param {string|number} id Identifier entered by the manager for removal.
     * @returns {void}
     */
    function handleRemoveCommit(id) {
        // Check that id is numeric
        if ( isNaN( Number(id) ) ) {
            setRemoveErrorString("ERROR: id must be a number.");
            return;
        }

        // Check that menu item with `id` exists
        let validID = false;
        for (const item of menuItemsData) {
            if (item.menu_item_id === Number(id)) {
                validID = true;
                break;
            }
        }
        if (!validID) {
            setRemoveErrorString("ERROR: please enter a valid ID.");
            return;
        }

        removeMutation.mutate({ menu_item_id: Number(id) });
        setIsRemoving(false);
        setRemoveErrorString(null);
    }

    /**
     * Closes the removal popup and clears any displayed errors.
     * @returns {void}
     */
    function handleRemoveCancel() {
        setIsRemoving(false);
        setRemoveErrorString(null);
    }

    return { handleRemoveStart, handleRemoveCommit, handleRemoveCancel };
}
