/**
 * @module ManageMenuItems/ManageMenuItems
 */
import { useState } from 'react';
import { HashLoader } from 'react-spinners';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import MenuItemRow from "./MenuItemRow.jsx";
import EditCellPopup from "./EditCellPopup";
import AddRowPopup from "./AddRowPopup.jsx";
import ImageUploadPopup from '../ImageUploadPopup.jsx';
import EditPartsPopup from "./EditPartsPopup.jsx";
import RemoveRowPopup from './RemoveRowPopup.jsx';
import styles from './ManageMenuItems.module.css';
import axios from 'axios';
import useEditHandlers from "./useEditHandlers.js";
import useAddHandlers from './useAddHandlers.js';
import editType from "./editType.js";
import useRemoveHandlers from './useRemoveHandlers.js';

const refetchIntervalSecs = 15;

/**
 * Fetches the current list of menu items from the API for the manager view.
 * @returns {Promise<Array<Object>>} Resolves with the array of menu items returned by the backend.
 */
async function fetchMenuItems() {
    console.log("[Menu Items]: refreshing menu items...");
    const menuItems = (await axios.get("/api/menu/items")).data;
    return menuItems;
}

/**
 * Manager interface for viewing, editing, adding, and removing menu items.
 * @returns {React.ReactElement} Application section that renders the menu table and supporting popups.
 */
export default function ManageMenuItems() {
    const [currentEditID, setCurrentEditID] = useState(null);     // Stores the ID of the menu item to edit.
    const [currentEditType, setCurrentEditType] = useState(null);     // Stores the type of edit currently being performed (if any).
    const [editErrorString, setEditErrorString] = useState(null);     // Stores an error message that may be displayed in the Edit popup.

    const [isAdding, setIsAdding] = useState(false);    // Is a menu item being added right now?
    const [addErrorString, setAddErrorString] = useState(null);    // Stores error message that may be displayed on the Add popup.

    const [isRemoving, setIsRemoving] = useState(false);    // Is a menu item being added right now?
    const [removeErrorString, setRemoveErrorString] = useState(null);

    const queryClient = useQueryClient();

    // Refresh data every `refetchIntervalSecs` seconds just in case something changed somehow.
    const { data: menuItemsData, isLoading, error } = useQuery({
        queryKey: ["managerMenuItems"],
        queryFn: fetchMenuItems,
        refetchInterval: refetchIntervalSecs * 1000,
    });

    const editMutation = useMutation({
        mutationKey: ['managerEditMenuItem'],
        /**
         * Applies pending changes to a menu item via the backend API.
         * @param {Object} itemUpdatePayload Partial menu item data including `menu_item_id`.
         * @returns {Promise<Object>} Backend response payload for the update request.
         */
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
        /**
         * Prevents overlapping fetches by canceling active queries before mutating.
         * @returns {Promise<void>} Resolves when the query cancellation is issued.
         */
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['managerMenuItems'] });
        },
        /**
         * Refreshes menu item data after a successful edit mutation completes.
         * @returns {Promise<void>} Resolves when the invalidate request is scheduled.
         */
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['managerMenuItems'] });
        },
        /**
         * Logs edit failures to aid debugging of unsuccessful mutation attempts.
         * @param {Error} err Error thrown by the mutation lifecycle.
         * @returns {void}
         */
        onError: (err) => {
            // Just in case there was an error while doing thinf
            console.error("Failed to change menu item:", err);
        }
    });

    const addMutation = useMutation({
        mutationKey: ['managerAddMenuItem'],
        /**
         * Sends a request to create a new menu item with the provided data payload.
         * @param {Object} newItemPayload Fields that describe the menu item to add.
         * @returns {Promise<Object>} Backend response payload for the create request.
         */
        mutationFn: async (newItemPayload) => {
            const newItemResponse = await axios.post(`/api/menu/items`, newItemPayload);
            
            if (newItemResponse.data.success === false) {
                throw new Error("Could not add new item to db.");
            }
            return newItemResponse.data;
        },
        /**
         * Cancels any in-flight menu item queries before adding a new item.
         * @returns {Promise<void>} Resolves once the cancellation call succeeds.
         */
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['managerMenuItems'] });
        },
        /**
         * Ensures menu data is refreshed once the create operation completes.
         * @returns {Promise<void>} Resolves when the invalidate request is issued.
         */
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['managerMenuItems'] });
        },
        /**
         * Reports add failures so the UI can surface issues while mutating.
         * @param {Error} err Error thrown when the mutation fails.
         * @returns {void}
         */
        onError: (err) => {
            // Just in case there was an error while doing thing
            console.error("Failed to add new menu item:", err);
        }
    });

    const removeMutation = useMutation({
        mutationKey: ['managerRemoveMenuItem'],
        /**
         * Deletes a menu item identified by the provided menu_item_id.
         * @param {{menu_item_id: number}} param0 Destructured argument containing the id to remove.
         * @returns {Promise<Object>} Backend response payload for the delete request.
         */
        mutationFn: async ({ menu_item_id }) => {
            const removeItemResponse = await axios.delete(`/api/menu/items/${menu_item_id}`);
            
            if (removeItemResponse.data.success === false) {
                throw new Error("Could not remove item item from db.");
            }
            return removeItemResponse.data;
        },
        /**
         * Temporarily halts background refetching while a delete mutation is running.
         * @returns {Promise<void>} Resolves when pending queries have been canceled.
         */
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['managerMenuItems'] });
        },
        /**
         * Requests a refetch after successfully deleting a menu item.
         * @returns {Promise<void>} Resolves when the refetch is queued.
         */
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['managerMenuItems'] });
        },
        /**
         * Surfaces any deletion issues that occur during mutation execution.
         * @param {Error} err Error reported from the mutation lifecycle.
         * @returns {void}
         */
        onError: (err) => {
            // Just in case there was an error while doing tihng
            console.error("Failed to remove menu item:", err);
        }
    });


    // Custom hook that abstracts Edit handling logic into another file.
    const { handleEditStart, handleEditCommit, handleEditCancel } = useEditHandlers(setCurrentEditID, setCurrentEditType, setEditErrorString, editMutation, queryClient);

    // Custom hook that abstracts Add handling logic into another file.
    const { handleAddStart, handleAddCommit, handleAddCancel } = useAddHandlers(setIsAdding, setAddErrorString, addMutation);

    // Custom hook that abstracts Remove handling logic into another file.
    const { handleRemoveStart, handleRemoveCommit, handleRemoveCancel } = useRemoveHandlers(setIsRemoving, setRemoveErrorString, removeMutation, menuItemsData);

    if (isLoading || editMutation.isPending || addMutation.isPending) {
        return <HashLoader color={"#DC143C"} cssOverride={{"display": "block", "margin": "4rem auto"}} aria-label="Loading menu items..." />;
    }

    if (error) {
        return (
            <p>Error while fetching menu items. Retrying in {refetchIntervalSecs} seconds...</p>
        );
    }

    return (
        <>
            { (currentEditType !== 'image' && currentEditID !== null)
                ? <EditCellPopup prompt={`Edit menu item ${currentEditType}`} onCommit={(newData) => handleEditCommit(currentEditID, currentEditType, newData)} onCancel={handleEditCancel} errorString={editErrorString} />
                : <></> }

            { (currentEditType === 'image' && currentEditID !== null)
                ? <ImageUploadPopup prompt={`Upload new image for menu item`} onCommit={(imageFile) => handleEditCommit(currentEditID, editType.IMAGE, imageFile)} onCancel={handleEditCancel} errorString={editErrorString} />
                : <></> }
            
            { (currentEditType === editType.PARTS && currentEditID !== null)
                ? <EditPartsPopup 
                    menuItemId={currentEditID} 
                    prompt={`Manage parts for menu item`} 
                    onCommit={(diff) => handleEditCommit(currentEditID, editType.PARTS, diff)} 
                    onCancel={handleEditCancel} 
                    errorString={editErrorString} 
                  />
                : <></> }
            
            { isAdding
                ? <AddRowPopup prompt={"Add enter info for new menu item"} onCommit={handleAddCommit} onCancel={handleAddCancel} errorString={addErrorString}/>
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
                                <th>Image</th>
                                <th>For Sale</th>
                                <th>Parts</th>
                            </tr>
                        </thead>
                        <tbody>
                            { menuItemsData.map(item => <MenuItemRow
                                        menuItemId={item.menu_item_id}
                                        itemName={item.item_name}
                                        price={item.price}
                                        imageName={item.image_name}
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
                    <button onClick={handleRemoveStart}>
                        Remove
                    </button>
                </div>
            </div>
        </>
    );
}
