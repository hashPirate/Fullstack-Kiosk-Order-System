import { useState } from 'react';
import styles from './ManageMenuParts.module.css';

const FAKE_MENU_PARTS = [
    { menu_part_id: 1, part_name: 'Beijing Beef', price: 1.00, for_sale: true },
    { menu_part_id: 2, part_name: 'Teriyaki Chicken', price: 1.00, for_sale: true },
    { menu_part_id: 3, part_name: 'Mushroom Chicken', price: 1.00, for_sale: true },
    { menu_part_id: 4, part_name: 'Orange Chicken', price: 1.00, for_sale: true },
    { menu_part_id: 5, part_name: 'White Rice', price: 0.50, for_sale: true },
    { menu_part_id: 6, part_name: 'Broccoli', price: 0.75, for_sale: true }
];

export default function ManageMenuParts() {
    const [menuParts] = useState(FAKE_MENU_PARTS);
    const [selectedPart, setSelectedPart] = useState(null);
    const [showEditIngredients, setShowEditIngredients] = useState(false);

    const handleAddMenuPart = () => {
        console.log('Add menu part(demo mode)');
    };

    const handleUpdateMenuPart = (part, field, value) => {
        console.log('Update menu part(demo mode):', part.part_name, field, value);
    };

    const handleCellEdit = (part, field, currentValue) => {
        if (field==='for_sale') {
            handleUpdateMenuPart(part, field, !currentValue);
            return;
        }
        
        const newValue = prompt(`Enter new ${field}:`, currentValue);
        if (newValue!==null && newValue!==currentValue.toString()) {
            handleUpdateMenuPart(part, field, newValue);
        }
    };

    const handleEditIngredients = (part) => {
        setSelectedPart(part);
        setShowEditIngredients(true);
    };

    return (
        <div className={styles.manageMenuParts}>
            <div className={styles.tableContainer}>
                <table className={styles.menuPartsTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Menu Part Name</th>
                            <th>Price</th>
                            <th>For Sale</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuParts.map(part => (
                            <tr
                                key={part.menu_part_id}
                                className={selectedPart?.menu_part_id === part.menu_part_id ? styles.selectedRow : ''}
                                onClick={() => setSelectedPart(part)}
                            >
                                <td>{part.menu_part_id}</td>
                                <td
                                    className={styles.editableCell}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCellEdit(part, 'part_name', part.part_name);
                                    }}
                                    title="Click to edit"
                                >
                                    {part.part_name}
                                </td>
                                <td
                                    className={styles.editableCell}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCellEdit(part, 'price', part.price);
                                    }}
                                    title="Click to edit"
                                >
                                    ${parseFloat(part.price).toFixed(2)}
                                </td>
                                <td onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        checked={part.for_sale}
                                        onChange={() => handleCellEdit(part, 'for_sale', part.for_sale)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.actionButtons}>
                <button onClick={handleAddMenuPart}>
                    Add
                </button>
                <button
                    onClick={() => selectedPart && handleEditIngredients(selectedPart)}
                    disabled={!selectedPart}
                >
                    Edit Ingredients
                </button>
            </div>

            {showEditIngredients && selectedPart && (
                <EditIngredientsModal
                    menuPart={selectedPart}
                    onClose={() => {
                        setShowEditIngredients(false);
                        setSelectedPart(null);
                    }}
                    onSave={() => {
                        setShowEditIngredients(false);
                        setSelectedPart(null);
                    }}
                />
            )}
        </div>
    );
}

const FAKE_ALL_INGREDIENTS = [
    { ingredient_id: 1, name: 'Chicken Breast' },
    { ingredient_id: 2, name: 'White Rice' },
    { ingredient_id: 3, name: 'Broccoli' },
    { ingredient_id: 4, name: 'Orange Sauce' },
    { ingredient_id: 5, name: 'Teriyaki Sauce' },
    { ingredient_id: 6, name: 'Mushrooms' },
    { ingredient_id: 7, name: 'Zucchini' },
    { ingredient_id: 8, name: 'Bell Peppers' },
    { ingredient_id: 9, name: 'Onions' }, // i literally just put the randomest ingredients i could think of lMAOOO
    { ingredient_id: 10, name: 'Sesame Seeds' }
];

function EditIngredientsModal({ menuPart, onClose, onSave }) {
    const [allIngredients] = useState(FAKE_ALL_INGREDIENTS);
    const [ingredientQuantities, setIngredientQuantities] = useState({
        1: 1, // Chicken Breast
        2: 1, // White Rice
        3: 1  // Broccoli
    });
    const handleToggleIngredient = (ingredientId) => {
        setIngredientQuantities(prev => {
            const newQuantities = { ...prev };
            if (newQuantities[ingredientId] !== undefined) {
                delete newQuantities[ingredientId];
            } else {
                newQuantities[ingredientId] = 1;
            }
            return newQuantities;
        });
    };
    const handleQuantityChange = (ingredientId, quantity) => {
        setIngredientQuantities(prev => ({
            ...prev,
            [ingredientId]: parseInt(quantity) || 1
        }));
    };
    const handleSave = () => {
        console.log('Save ingredients(demo mode):', ingredientQuantities);
        onSave();
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2>Edit Ingredients: {menuPart.part_name}</h2>
                <table className={styles.ingredientsTable}>
                    <thead>
                        <tr>
                            <th>Ingredient</th>
                            <th>Included</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allIngredients.map(ingredient => {
                            const isIncluded = ingredientQuantities[ingredient.ingredient_id] !== undefined;
                            const quantity = ingredientQuantities[ingredient.ingredient_id] || 1;
                            
                            return (
                                <tr key={ingredient.ingredient_id}>
                                    <td>{ingredient.name}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={isIncluded}
                                            onChange={() => handleToggleIngredient(ingredient.ingredient_id)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => handleQuantityChange(ingredient.ingredient_id, e.target.value)}
                                            disabled={!isIncluded}
                                            min="1"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className={styles.modalActions}>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
}
