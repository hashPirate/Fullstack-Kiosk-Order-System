/**
 * @module ManageMenuParts/useAddHandlers
 */

/**
 * Produces helper callbacks that manage the Add Menu Part popup lifecycle.
 * @param {Function} setIsAdding Setter controlling popup visibility state.
 * @param {Function} setAddErrorString Setter for displaying validation errors.
 * @param {Object} addMutation React Query mutation used to create new parts.
 * @returns {{handleAddStart: Function, handleAddCommit: Function, handleAddCancel: Function}} Helper callbacks for the popup.
 */
export default function useAddHandlers(setIsAdding, setAddErrorString, addMutation) {
    /**
     * Opens the add popup when the manager initiates the flow.
     * @returns {void}
     */
    function handleAddStart() {
        setIsAdding(true);
    }

    /**
     * Validates the entered data and triggers the add mutation upon success.
     * @param {string} name Name provided for the new part.
     * @param {string|number} price Price entered for the part.
     * @param {boolean} forSale Whether the part should be immediately available.
     * @returns {void}
     */
    function handleAddCommit(name, price, forSale) {
        // Check data
        if (typeof name !== 'string') {
            throw new Error("invalid part name data type.");
        }
        if (name === "") {
            setAddErrorString("ERROR: please enter a name.");
            return;
        }
        if (price === "") {
            setAddErrorString("ERROR: please enter a price.");
            return;
        }
        if (isNaN(Number(price))) {
            setAddErrorString("ERROR: price must be a number.");
            return;
        }
        if (Number(price) < 0) {
            setAddErrorString("ERROR: price must be positive.");
            return;
        }

        addMutation.mutate({part_name: name, price: price, for_sale: forSale});
        setAddErrorString(null);
        setIsAdding(false);
    }

    /**
     * Closes the add popup and resets any lingering errors.
     * @returns {void}
     */
    function handleAddCancel() {
        setAddErrorString(null);
        setIsAdding(false);
    }

    return { handleAddStart, handleAddCommit, handleAddCancel };
}
