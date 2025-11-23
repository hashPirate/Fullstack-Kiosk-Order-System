import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Inventory.module.css';

export default function Inventory() {
    const [filter, setFilter] = useState('all');
    const [ingredients,setIngredients] = useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);
    useEffect(() => {
        const fetchIngredients = async () => {
            setLoading(true);
            setError(null);
            try{
                let endpoint='/api/ingredients/all';
                if (filter==='in-stock') {
                    endpoint='/api/ingredients/in-stock';
                } else if (filter==='low-stock') {
                    endpoint= '/api/ingredients/low-stock';
                } else if (filter === 'out-of-stock') {
                    endpoint='/api/ingredients/out-of-stock';
                }
                const response=await axios.get(endpoint);
                setIngredients(response.data);
            } catch(err) {
                console.error('INGREDIENTERRORRRRRRRRRR: ',err);
                setError('Failed to load ingredients. Please retry!!');
            } finally {
                setLoading(false);
            }
        };
        fetchIngredients();
    }, [filter]);

    const handleAddIngredient=async () => {
        try {
            const response = await axios.post('/api/ingredients', {
                name:'New Ingredient',
                current_quantity:0,
                quantity_unit:'None',//i didnt set a default but i want it to be editable
                alert_threshold:700
            });
            const allResponse=await axios.get('/api/ingredients/all');
            setIngredients(allResponse.data);
            setFilter('all');
        } catch (err) {
            console.error('INGADDERROR:',err);
            alert('Failed to add the ingredient. Please retry!');
        }
    };
    const handleUpdateIngredient=async (ingredient, field, value)=>{
        try {
            const ingredientId=ingredient.ingredient_id;
            if (field==='name') {
                await axios.put(`/api/ingredients/${ingredientId}/name`,{ newName: value });
            } else if (field==='current_quantity') {
                const numValue=parseFloat(value);
                if(isNaN(numValue)) {
                    alert('Quantity must be a number');
                    return;
                }
                await axios.put(`/api/ingredients/${ingredientId}/quantity`,{ newQuantity: numValue });
            } else if(field==='quantity_unit'){
                await axios.put(`/api/ingredients/${ingredientId}/quantity-unit`,{ newUnit: value });
            } else if(field==='alert_threshold') {
                const numValue=parseFloat(value);
                if(isNaN(numValue)) {
                    alert('Alert threshold must be a number');
                    return;
                }
                await axios.put(`/api/ingredients/${ingredientId}`, {//when the alert threshold is done we gotta do a full req :/
                    name: ingredient.name,
                    current_quantity: ingredient.current_quantity,
                    quantity_unit: ingredient.quantity_unit,
                    alert_threshold: numValue
                });
            }
            let endpoint='/api/ingredients/all';
            if (filter==='in-stock') {
                endpoint = '/api/ingredients/in-stock';
            } else if(filter==='low-stock') {
                endpoint='/api/ingredients/low-stock';
            } else if(filter==='out-of-stock') {
                endpoint='/api/ingredients/out-of-stock';
            }
            const response= await axios.get(endpoint);
            setIngredients(response.data);
        }catch (err){
            console.error('Error updating ingredient:', err);
            alert('Failed to update ingredient. Please try again.');
        }
    };

    const handleCellEdit=(ingredient, field, currentValue) => {
        const newValue=prompt(`Enter new ${field}:`, currentValue);
        if (newValue!==null && newValue!==currentValue.toString()) {
            handleUpdateIngredient(ingredient,field,newValue);
        }
    };

    return (
        <div className={styles.inventory}>
            <div className={styles.filterButtons}>
                <button
                    className={filter === 'all' ? styles.active : ''}
                    onClick={() => setFilter('all')}
                    disabled={filter === 'all'}
                >
                    All Ingredients
                </button>
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

            {error && (
                <div style={{ color: 'red', padding: '10px' }}>
                    {error}
                </div>
            )}

            <div className={styles.tableContainer}>
                {loading ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>Loading ingredients...</div>
                ) : (
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
                            {ingredients.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                        No ingredients found
                                    </td>
                                </tr>
                            ) : (
                                ingredients.map(ingredient => (
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
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <div className={styles.actionButtons}>
                <button
                    className={filter !== 'all' ? styles.disabled : ''}
                    onClick={handleAddIngredient}
                    disabled={filter !== 'all' || loading}
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
