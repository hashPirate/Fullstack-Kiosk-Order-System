import editType from "./editType";

export default function useEditHandlers(setCurrentEditID, setCurrentEditType, setEditErrorString, editMutation) {
    // Begin editing an item by showing the popup
    function handleEditStart(id, type) {
        setCurrentEditID(id);
        setCurrentEditType(type);
    }

    // Finish editing an item by updating it in db.
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

    function handleEditCancel() {
        setCurrentEditID(null);
        setCurrentEditType(null);
        setEditErrorString(null);
    }

    return {handleEditStart, handleEditCommit, handleEditCancel};
}
