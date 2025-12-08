export default function useAddHandlers(setIsAdding, setAddErrorString, addMutation) {
    function handleAddStart() {
        setIsAdding(true);
    }

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

    function handleAddCancel() {
        setAddErrorString(null);
        setIsAdding(false);
    }

    return { handleAddStart, handleAddCommit, handleAddCancel };
}
