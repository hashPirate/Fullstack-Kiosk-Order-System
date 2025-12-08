import { useState } from 'react';
import { HashLoader } from 'react-spinners';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import MenuPartRow from "./MenuPartRow.jsx";
import EditCellPopup from "./EditCellPopup.jsx";
import AddRowPopup from "./AddRowPopup.jsx";
import RemoveRowPopup from './RemoveRowPopup.jsx';
import styles from './ManageMenuParts.module.css';
import axios from 'axios';
import useEditHandlers from "./useEditHandlers.js";
import useAddHandlers from './useAddHandlers.js';
import useRemoveHandlers from './useRemoveHandlers.js';
import editType from './editType.js';
import EditIngredientsPopup from './EditIngredientsPopup.jsx';

const refetchIntervalSecs = 15;

async function fetchMenuParts() {
    console.log("[Menu Parts]: refreshing menu parts...");
    const menuParts = (await axios.get("/api/menu/parts")).data;
    return menuParts;
}

export default function ManageMenuParts() {
    const [currentEditID, setCurrentEditID] = useState(null);     // Stores the ID of the menu part to edit.
    const [currentEditName, setCurrentEditName] = useState(null);     // Stores the name of the menu part to edit.
    const [currentEditType, setCurrentEditType] = useState(null);     // Stores the type of edit currently being performed (if any).
    const [editErrorString, setEditErrorString] = useState(null);     // Stores an error message that may be displayed in the Edit popup.

    const [isAdding, setIsAdding] = useState(false);    // Is a menu part being added right now?
    const [addErrorString, setAddErrorString] = useState(null);    // Stores error message that may be displayed on the Add popup.

    const [isRemoving, setIsRemoving] = useState(false);    // Is a menu part being added right now?
    const [removeErrorString, setRemoveErrorString] = useState(null);

    const queryClient = useQueryClient();

    // Refresh data every `refetchIntervalSecs` seconds just in case something changed somehow.
    const { data: menuPartsData, isLoading, error } = useQuery({
        queryKey: ["managerMenuParts"],
        queryFn: fetchMenuParts,
        refetchInterval: refetchIntervalSecs * 1000,
    });

    const editMutation = useMutation({
        mutationKey: ['managerEditMenuPart'],
        mutationFn: async (partUpdatePayload) => {
            // Ensure ID exists.
            if (!partUpdatePayload.menu_part_id) {
                throw new Error("ID is required for part modification.");
            }

            let newPartData;
            try {
                newPartData = (menuPartsData.filter(part => part.menu_part_id === partUpdatePayload.menu_part_id))[0];
            } catch {
                throw new Error("Invalid menu part id in mutation... probably.");
            }
            
            // Copy over any changed properties from the payload into the new part object.
            for (const [key, val] of Object.entries(partUpdatePayload)) {
                newPartData[key] = val;
            }

            const updatePartResponse = await axios.put(`/api/menu/parts/${partUpdatePayload.menu_part_id}`, newPartData);
            
            if (updatePartResponse.data.success === false) {
                throw new Error("Could not update part in db.");
            }
            return updatePartResponse.data;
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['managerMenuParts'] });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['managerMenuParts'] });
        },
        onError: (err) => {
            // Just in case there was an error while doing thinf
            console.error("Failed to change menu part:", err);
        }
    });

    const addMutation = useMutation({
        mutationKey: ['managerAddMenuPart'],
        mutationFn: async (newPartPayload) => {
            const newPartResponse = await axios.post(`/api/menu/parts`, newPartPayload);
            
            if (newPartResponse.data.success === false) {
                throw new Error("Could not add new part to db.");
            }
            return newPartResponse.data;
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['managerMenuParts'] });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['managerMenuParts'] });
        },
        onError: (err) => {
            // Just in case there was an error while doing thing
            console.error("Failed to add new menu part:", err);
        }
    });

    const removeMutation = useMutation({
        mutationKey: ['managerRemoveMenuPart'],
        mutationFn: async ({ menu_part_id }) => {
            const removePartResponse = await axios.delete(`/api/menu/parts/${menu_part_id}`);
            
            if (removePartResponse.data.success === false) {
                throw new Error("Could not remove part from db.");
            }
            return removePartResponse.data;
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['managerMenuParts'] });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['managerMenuParts'] });
        },
        onError: (err) => {
            // Just in case there was an error while doing tihng
            console.error("Failed to remove menu part:", err);
        }
    });


    // Custom hook that abstracts Edit handling logic into another file.
    const { handleEditStart, handleEditCommit, handleEditCancel } = useEditHandlers(setCurrentEditID, setCurrentEditType, setEditErrorString, setCurrentEditName, editMutation);

    // Custom hook that abstracts Add handling logic into another file.
    const { handleAddStart, handleAddCommit, handleAddCancel } = useAddHandlers(setIsAdding, setAddErrorString, addMutation);

    // Custom hook that abstracts Remove handling logic into another file.
    const { handleRemoveStart, handleRemoveCommit, handleRemoveCancel } = useRemoveHandlers(setIsRemoving, setRemoveErrorString, removeMutation, menuPartsData);

    if (isLoading || editMutation.isPending || addMutation.isPending) {
        return <HashLoader color={"#DC143C"} cssOverride={{"display": "block", "margin": "4rem auto"}} aria-label="Loading menu parts..." />;
    }

    if (error) {
        return (
            <p>Error while fetching menu parts. Retrying in {refetchIntervalSecs} seconds...</p>
        );
    }

    return (
        <>
            { (currentEditID !== null)
                ? ( (currentEditType === editType.INGREDIENTS)
                    ? <EditIngredientsPopup
                        partName={currentEditName}
                        menuPartId={currentEditID}
                        onCommit={(newData) => handleEditCommit(currentEditID, currentEditType, newData)}
                        onCancel={handleEditCancel}
                        errorString={editErrorString}
                      />
                    : <EditCellPopup
                        prompt={`Edit menu part ${currentEditType}`}
                        onCommit={(newData) => handleEditCommit(currentEditID, currentEditType, newData)}
                        onCancel={handleEditCancel}
                        errorString={editErrorString}
                      />
                  )
                : <></>
            }
            
            { isAdding
                ? <AddRowPopup prompt={"Add enter info for new menu part"} onCommit={handleAddCommit} onCancel={handleAddCancel} errorString={addErrorString}/>
                : <></> }

            { isRemoving
                ? <RemoveRowPopup prompt={"Enter the ID of the part you want to remove"} onCommit={handleRemoveCommit} onCancel={handleRemoveCancel} errorString={removeErrorString}/>
                : <></> }
            
            <div className={styles.manageMenuParts}>
                <div className={styles.tableContainer}>
                    <table className={styles.menuPartsTable}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Menu Part Name</th>
                                <th>Price</th>
                                <th>For Sale</th>
                                <th>Ingredients</th>
                            </tr>
                        </thead>
                        <tbody>
                            { menuPartsData.map((part, i) => <MenuPartRow
                                        key={i}
                                        menuPartId={part.menu_part_id}
                                        partName={part.part_name}
                                        price={part.price}
                                        forSale={part.for_sale}
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
