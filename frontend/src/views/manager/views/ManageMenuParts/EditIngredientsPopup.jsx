import { useEffect, useState } from "react";
import axios from "axios";

import styles from "./EditCellPopup.module.css";

export default function EditIngredientsPopup({ partName, menuPartId, onCommit, onCancel, errorString }) {
    const [ingredients, setIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load ingredients data
    useEffect(() => {
        (async function () {
            let usedIngredients = (await axios.get(`/menu/parts/${menuPartId}/ingredients`)).data;
            let allIngredients = (await axios.get(`/ingredients`)).data;

            for (let allIng of allIngredients) {
                let isBeingUsed = false;
                for (const usedIng of usedIngredients) {
                    if (usedIng.ingredient_id === allIng.ingredient_id) {
                        isBeingUsed = true;
                        break;
                    }
                }
                allIng.is_used = isBeingUsed;
            }

            allIngredients = allIngredients.map(ing => {
                const { ingredient_id, name, is_used } = ing;
                return { ingredient_id, name, is_used };
            });
            allIngredients.sort((a,b) => a.ingredient_id - b.ingredient_id);

            setIngredients(allIngredients);

            setIsLoading(false);
        })();
    }, []);

    function onIngredientChanged(event, id) {
        const newIngredients = ingredients.map(ing => (ing.ingredient_id === id) ? {
            ...ing,
            is_used: event.target.checked
        } : ing);
        setIngredients(newIngredients);
    }

    if (isLoading) {
        return (
            <div className={styles.popupContainer}>
                <div className={styles.popupContent}>
                    <HashLoader color={"#DC143C"} cssOverride={{"display": "block", "margin": "4rem"}} aria-label="Loading ingredients list..." />;
                </div>
            </div>
        );
    }

    return (
        <div className={styles.popupContainer}>
            <div className={styles.popupContent}>
                <p className={styles.editPrompt}>Edit ingredients for {partName}</p>
                { errorString ? <p className={styles.errorMessage}>{errorString}</p> : <></> }

                { ingredients.map(ing => <label>
                        {ing.name}
                        &nbsp;
                        <input
                            type="checkbox"
                            checked={ ingredients.find(el => el.ingredient_id === ing.ingredient_id).is_used }
                            onChange={event => onIngredientChanged(ing.ingredient_id, event)}
                        />
                    </label>
                ) }

                <div className={styles.buttons}>
                    <button className={styles.confirmButton} onClick={() => onCommit(ingredients)}>Done</button>
                    <button className={styles.cancelButton} onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}