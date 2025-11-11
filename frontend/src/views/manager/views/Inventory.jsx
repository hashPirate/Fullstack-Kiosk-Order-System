import { useState, useMemo } from 'react';
import styles from './Inventory.module.css';


const FAKE_INGREDIENTS = [
    { ingredient_id: 1, name: 'Chicken Breast', current_quantity: 150, quantity_unit: 'lbs', alert_threshold: 50 },
    { ingredient_id: 2, name: 'White Rice', current_quantity: 200, quantity_unit: 'lbs', alert_threshold: 100 },
    { ingredient_id: 3, name: 'Broccoli', current_quantity: 45, quantity_unit: 'lbs', alert_threshold: 50 },
    { ingredient_id: 4, name: 'Orange Sauce', current_quantity: 30, quantity_unit: 'oz', alert_threshold: 40 },
    { ingredient_id: 5, name: 'Teriyaki Sauce', current_quantity: 25, quantity_unit: 'oz', alert_threshold: 40 },
    { ingredient_id: 6, name: 'Mushrooms', current_quantity: 15, quantity_unit: 'lbs', alert_threshold: 20 },
    { ingredient_id: 7, name: 'Zucchini', current_quantity: 8, quantity_unit: 'lbs', alert_threshold: 20 },
    { ingredient_id: 8, name: 'Bell Peppers', current_quantity: 0, quantity_unit: 'lbs', alert_threshold: 20 },
    { ingredient_id: 9, name: 'Onions', current_quantity: 35, quantity_unit: 'lbs', alert_threshold: 30 },
    { ingredient_id: 10, name: 'Sesame Seeds', current_quantity: 5, quantity_unit: 'oz', alert_threshold: 10 }
];

export default function Inventory() {
    const [filter, setFilter] = useState('all');

    const ingredients = useMemo(() => {
        if (filter === 'in-stock') {
            return FAKE_INGREDIENTS.filter(ing => ing.current_quantity > ing.alert_threshold);
        } else if (filter === 'low-stock') {
            return FAKE_INGREDIENTS.filter(ing => ing.current_quantity > 0 && ing.current_quantity <= ing.alert_threshold);
        } else if (filter === 'out-of-stock') {
            return FAKE_INGREDIENTS.filter(ing => ing.current_quantity === 0);
        } else {
            return FAKE_INGREDIENTS;
        }
    }, [filter]);

    const handleAddIngredient = () => {
        console.log('Add ingredient (demo mode)');
    };

    const handleUpdateIngredient = (ingredient, field, value) => {
        console.log('Update ingredient (demo mode):', ingredient.name, field, value);
    };

    const handleCellEdit = (ingredient, field, currentValue) => {
        const newValue = prompt(`Enter new ${field}:`, currentValue);
        if (newValue !== null && newValue !== currentValue.toString()) {
            handleUpdateIngredient(ingredient, field, newValue);
        }
    };

    return (
        <div className={styles.inventory}>
            <div className={styles.filterButtons}>
                <button
                    className={filter === 'in-stock' ? styles.active : ''}
                    onClick={() => setFilter('in-stock')}
                    disabled={filter === 'in-stock'}
                >
                    In Stock
                </button>
                <button
                    className={filter === 'low-stock' ? styles.active : ''}
                    onClick={() => setFilter('low-stock')}
                    disabled={filter === 'low-stock'}
                >
                    Needs Restocking
                </button>
                <button
                    className={filter === 'out-of-stock' ? styles.active : ''}
                    onClick={() => setFilter('out-of-stock')}
                    disabled={filter === 'out-of-stock'}
                >
                    Out of Stock
                </button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.ingredientsTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Quantity Unit</th>
                            <th>Alert Threshold</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredients.map(ingredient => (
                            <tr key={ingredient.ingredient_id}>
                                <td>{ingredient.ingredient_id}</td>
                                <td
                                    className={styles.editableCell}
                                    onClick={() => handleCellEdit(ingredient, 'name', ingredient.name)}
                                    title="Click to edit"
                                >
                                    {ingredient.name}
                                </td>
                                <td
                                    className={styles.editableCell}
                                    onClick={() => handleCellEdit(ingredient, 'current_quantity', ingredient.current_quantity)}
                                    title="Click to edit"
                                >
                                    {ingredient.current_quantity}
                                </td>
                                <td
                                    className={styles.editableCell}
                                    onClick={() => handleCellEdit(ingredient, 'quantity_unit', ingredient.quantity_unit)}
                                    title="Click to edit"
                                >
                                    {ingredient.quantity_unit}
                                </td>
                                <td
                                    className={styles.editableCell}
                                    onClick={() => handleCellEdit(ingredient, 'alert_threshold', ingredient.alert_threshold)}
                                    title="Click to edit"
                                >
                                    {ingredient.alert_threshold}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.actionButtons}>
                <button
                    className={filter === 'all' ? styles.disabled : ''}
                    onClick={() => setFilter('all')}
                    disabled={filter === 'all'}
                >
                    All Ingredients
                </button>
                <button
                    className={filter !== 'all' ? styles.disabled : ''}
                    onClick={handleAddIngredient}
                    disabled={filter !== 'all'}
                >
                    Add
                </button>
                <button disabled title="Remove functionality not implemented">
                    Remove
                </button>
            </div>
        </div>
    );
}
