import { useState } from 'react';
import { HashLoader } from 'react-spinners';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import MenuItemRow from "./MenuItemRow.jsx";
import EditCellPopup from "./EditCellPopup";
import styles from './ManageMenuItems.module.css';
import axios from 'axios';

async function fetchMenuItems() {
    const menuItems = (await axios.get("/api/menu/items")).data;
    return menuItems;
}

// Types of edits you can make using the popup.
const editType = {
    PRICE: "PRICE",
    NAME: "NAME",
}

export default function ManageMenuItems() {
    const [currentEditID, setCurrentEditID] = useState(null);     // Stores the ID of the menu item to edit.
    const [currentEditType, setCurrentEditType] = useState(null);     // Stores the type of edit currently being performed (if any).
    const [editErrorString, setEditErrorString] = useState(null);     // Stores an error message that may be displayed in the edit popup.
    const queryClient = useQueryClient();

    // Refresh data every 10 seconds just in case something changed.
    const { data: menuItemsData, isLoading, error } = useQuery({
        queryKey: ["managerMenuItems"],
        queryFn: fetchMenuItems,
        refetchInterval: 10_000,
    });

    const mutation = useMutation({
        mutationKey: ['managerChangeMenuItem'],
        mutationFn: async (itemUpdatePayload) => {
            // Ensure ID exists.
            if (!itemUpdatePayload.menu_item_id) {
                throw new Error("ID is required for item modification.");
            }

            let newItemData;
            try {
                newItemData = (menuItemsData.filter(item => item.menu_item_id === itemUpdatePayload.menu_item_id))[0];
            } catch {
                throw new Error("Invalid menu item id in mutation... probably.");
            }
            
            // Copy over any changed properties from the payload into the new item object.
            for (const key of itemUpdatePayload) {
                newItemData[key] = itemUpdatePayload[key];
            }

            const updateItemResponse = await axios.put(`/api/menu/items/${itemUpdatePayload.menu_item_id}`, newItemData);
            
            if (updateItemResponse.data.success === false) {
                throw new Error("Could not update item in db.");
            }
            return updateItemResponse.data;
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['managerMenuItems'] });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['managerMenuItems'] });
        },
        onError: (err) => {
            // Just in case there was an error while changing menu item
            console.error("Failed to change menu item:", err);
        }
    });

    // Begin editing an item by showing the popup.
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
                throw new Error("newData must have type 'string' to update name.");
            }

            mutation.mutate({menu_item_id: id, item_name: newData});
            setCurrentEditID(null);
            setCurrentEditType(null);
            setEditErrorString(null);
        } else if (type === editType.PRICE) {
            // Check valid price and data type.
            if (newData === "") {
                setEditErrorString("ERROR: new price cannot be empty.");
                return;
            }
            if (typeof newData !== "number") {
                throw new Error("newData must have type 'numer' to update price.");
            }
            if (newData < 0) {
                setEditErrorString("ERROR: new price cannot be less than 0.");
                return;
            }

            mutation.mutate({menu_item_id: id, price: newData});
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

    function handleAddMenuItem() {
        // TODO
    }

    if (isLoading || mutation.isPending) {
        return <HashLoader color={"#DC143C"} cssOverride={{"display": "block", "margin": "4rem auto"}} aria-label="Loading kiosk items..." />;
    }

    if (error) {
        return (
            <p>Error while fetching menu items. Retrying soon...</p>
        );
    }

    return (
        <>
            <EditCellPopup prompt={"Edit this shit twin"} currentVal={999} onCommit={() => {}} onCancel={() => {}}/>
            <div className={styles.manageMenuItems}>
                <div className={styles.tableContainer}>
                    <table className={styles.menuItemsTable}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Menu Item Name</th>
                                <th>Price</th>
                                <th>For Sale</th>
                            </tr>
                        </thead>
                        <tbody>
                            { menuItemsData.map(item => <MenuItemRow  menuItemId={item.menu_item_id} itemName={item.item_name} price={item.price} forSale={item.for_sale} />) }
                        </tbody>
                    </table>
                </div>

                <div className={styles.actionButtons}>
                    <button onClick={handleAddMenuItem}>
                        Add
                    </button>
                    <button disabled title="Remove functionality not implemented">
                        Remove
                    </button>
                </div>
            </div>
        </>
    );
}
