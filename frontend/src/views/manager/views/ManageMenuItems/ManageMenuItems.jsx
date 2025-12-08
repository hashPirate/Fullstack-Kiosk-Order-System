import { useState } from 'react';
import { HashLoader } from 'react-spinners';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import MenuItemRow from "./MenuItemRow.jsx";
import EditCellPopup from "./EditCellPopup";
import AddRowPopup from "./AddRowPopup.jsx";
import RemoveRowPopup from './RemoveRowPopup.jsx';
import styles from './ManageMenuItems.module.css';
import axios from 'axios';
import editType from "./editType.js";
import useEditHandlers from "./useEditHandlers.js";
import useAddHandlers from './useAddHandlers.js';

async function fetchMenuItems() {
    console.log("[Menu Items]: refreshing menu items...");
    const menuItems = (await axios.get("/api/menu/items")).data;
    return menuItems;
}

export default function ManageMenuItems() {
    const [currentEditID, setCurrentEditID] = useState(null);     // Stores the ID of the menu item to edit.
    const [currentEditType, setCurrentEditType] = useState(null);     // Stores the type of edit currently being performed (if any).
    const [editErrorString, setEditErrorString] = useState(null);     // Stores an error message that may be displayed in the Edit popup.

    const [isAdding, setIsAdding] = useState(false);    // Is a menu item being added right now?
    const [addErrorString, setAddErrorString] = useState(null);    // Stores error message that may be displayed on the Add popup.

    const [isRemoving, setIsRemoving] = useState(false);    // Is a menu item being added right now?
    const [removeErrorString, setRemoveErrorString] = useState(null);

    const queryClient = useQueryClient();

    // Refresh data every 15 seconds just in case something changed somehow.
    const { data: menuItemsData, isLoading, error } = useQuery({
        queryKey: ["managerMenuItems"],
        queryFn: fetchMenuItems,
        refetchInterval: 15_000,
    });

    const editMutation = useMutation({
        mutationKey: ['managerEditMenuItem'],
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
            for (const [key, val] of Object.entries(itemUpdatePayload)) {
                newItemData[key] = val;
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

    const addMutation = useMutation({
        mutationKey: ['managerAddMenuItem'],
        mutationFn: async (newItemPayload) => {
            const newItemResponse = await axios.post(`/api/menu/items`, newItemPayload);
            
            if (newItemResponse.data.success === false) {
                throw new Error("Could not add new item to db.");
            }
            return newItemResponse.data;
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

    const removeMutation = useMutation({
        mutationKey: ['managerRemoveMenuItem'],
        mutationFn: async (newItemPayload) => {
            const newItemResponse = await axios.post(`/api/menu/items`, newItemPayload);
            
            if (newItemResponse.data.success === false) {
                throw new Error("Could not add new item to db.");
            }
            return newItemResponse.data;
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


    // Custom hook that abstracts edit handling logic into another file.
    const { handleEditStart, handleEditCommit, handleEditCancel } = useEditHandlers(setCurrentEditID, setCurrentEditType, setEditErrorString, editMutation);

    // Custom hook that abstracts add handling logic into another file.
    const { handleAddStart, handleAddCommit, handleAddCancel } = useAddHandlers(setIsAdding, setAddErrorString, addMutation);

    function handleRemoveStart() {
        setIsRemoving(true);
    }

    function handleRemoveCommit(id) {
        // Check ID real quick
        let validID = false;
        for (const item of menuItemsData) {
            if (item.menu_item_id === id) {
                validID = true;
                break;
            }
        }
        if (!validID) {
            setRemoveErrorString("ERROR: please enter a valid ID.");
        }


    }

    function handleRemoveCancel() {
        setIsRemoving(false);
        setRemoveErrorString(null);
    }

    if (isLoading || editMutation.isPending || addMutation.isPending) {
        return <HashLoader color={"#DC143C"} cssOverride={{"display": "block", "margin": "4rem auto"}} aria-label="Loading kiosk items..." />;
    }

    if (error) {
        return (
            <p>Error while fetching menu items. Retrying soon...</p>
        );
    }

    return (
        <>
            { (currentEditID !== null)
                ? <EditCellPopup prompt={`Edit menu item ${currentEditType}`} onCommit={(newData) => handleEditCommit(currentEditID, currentEditType, newData)} onCancel={handleEditCancel} errorString={editErrorString} />
                : <></> }
            
            { isAdding
                ? <AddRowPopup prompt={"Add a new menu item"} onCommit={handleAddCommit} onCancel={handleAddCancel} errorString={addErrorString}/>
                : <></> }

            { isRemoving
                ? <RemoveRowPopup prompt={"Enter the ID of the item you want to remove"} onCommit={handleRemoveCommit} onCancel={handleRemoveCancel} errorString={removeErrorString}/>
                : <></> }
            
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
                            { menuItemsData.map(item => <MenuItemRow
                                        menuItemId={item.menu_item_id}
                                        itemName={item.item_name}
                                        price={item.price}
                                        forSale={item.for_sale}
                                        onEditStart={handleEditStart}
                                        handleEditCommit={handleEditCommit}
                                    />
                                )
                            }
                        </tbody>
                    </table>
                </div>

                <div className={styles.actionButtons}>
                    <button onClick={handleAddStart}>
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
