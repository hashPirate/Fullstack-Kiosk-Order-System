/**
 * Provides helper callbacks for the Add Menu Item popup lifecycle.
 * @param {Function} setIsAdding Setter for tracking whether the popup is visible.
 * @param {Function} setAddErrorString Setter used to present validation errors.
 * @param {import('@tanstack/react-query').UseMutationResult} addMutation React Query mutation for adding items.
 * @returns {{handleAddStart: Function, handleAddCommit: Function, handleAddCancel: Function}} Encapsulated handlers for popup flow.
 */
export default function useAddHandlers(setIsAdding, setAddErrorString, addMutation) {
    /**
     * Opens the add popup so the user can begin entering data.
     * @returns {void}
     */
    function handleAddStart() {
        setIsAdding(true);
    }

    /**
     * Validates user input and dispatches the add mutation when successful.
     * @param {string} name Name for the new menu item.
     * @param {string|number} price Price entered by the user.
     * @param {boolean} forSale Indicates if the item should be for sale immediately.
     * @returns {void}
     */
    function handleAddCommit(name, price, forSale) {
        // Check data
        if (typeof name !== 'string') {
            throw new Error("invalid item name data type.");
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

        addMutation.mutate({item_name: name, price: price, for_sale: forSale});
        setAddErrorString(null);
        setIsAdding(false);
    }

    /**
     * Closes the add popup while clearing active errors.
     * @returns {void}
     */
    function handleAddCancel() {
        setAddErrorString(null);
        setIsAdding(false);
    }

    return { handleAddStart, handleAddCommit, handleAddCancel };
}
