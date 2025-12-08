export default function useRemoveHandlers(setIsRemoving, setRemoveErrorString, removeMutation, menuPartsData) {
    function handleRemoveStart() {
        setIsRemoving(true);
    }

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

    function handleRemoveCancel() {
        setIsRemoving(false);
        setRemoveErrorString(null);
    }

    return { handleRemoveStart, handleRemoveCommit, handleRemoveCancel };
}
