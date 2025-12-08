import { useEffect, useState } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";

import styles from "./EditCellPopup.module.css";

export default function EditIngredientsPopup({ partName, menuPartId, onCommit, onCancel, errorString }) {
    const [ingredients, setIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load ingredients data on mount
    useEffect(() => {
        (async function () {
            // Simplify API results and use simplified results to set
            // `ingredients`, which will be used to render the inputs.
            try {
                let usedIngredients = (await axios.get(`/api/menu/parts/${menuPartId}/ingredients`)).data;
                let allIngredients = (await axios.get(`/api/ingredients`)).data;

                const ingQuantityMap = new Map();
                for (const u of usedIngredients) {
                    ingQuantityMap.set(u.ingredient_id, u.quantity_cost);
                }

                const mergedIngredients = allIngredients.map(ing => ({
                    ingredient_id: ing.ingredient_id,
                    name: ing.name,
                    quantity: ingQuantityMap.has(ing.ingredient_id) ? ingQuantityMap.get(ing.ingredient_id) : 0
                }));

                mergedIngredients.sort((a,b) => a.ingredient_id - b.ingredient_id);
                setIngredients(mergedIngredients);
            } catch (err) {
                console.error("Failed to load ingredients:", err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    // Reflect checkbox changes in state.
    function onQuantityChanged(event, id) {
        const newIngredients = ingredients.map(ing => (ing.ingredient_id === id) ? {
            ...ing,
            quantity: Math.max(Number(event.target.value), 0)
        } : ing);
        setIngredients(newIngredients);
    }

    // Show loader while loading.
    if (isLoading) {
        return (
            <div className={styles.popupContainer}>
                <div className={styles.popupContent}>
                    <HashLoader color={"#DC143C"} cssOverride={{"display": "block", "margin": "4rem"}} aria-label="Loading ingredients list..." />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.popupContainer}>
            <div className={styles.popupContent}>
                <p className={styles.editPrompt}>Edit ingredients for {partName}</p>
                { errorString ? <p className={styles.errorMessage}>{errorString}</p> : <></> }

                <div className={styles.ingredientsList}>
                    { ingredients.map(ing => <label key={ing.ingredient_id}>
                            {ing.name}:
                            &nbsp;
                            <input
                                type="number"
                                value={ ing.quantity }
                                onChange={event => onQuantityChanged(event, ing.ingredient_id)}
                            />
                        </label>
                    ) }
                </div>

                <div className={styles.buttons}>
                    <button className={styles.confirmButton} onClick={() => onCommit(ingredients)}>Done</button>
                    <button className={styles.cancelButton} onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}