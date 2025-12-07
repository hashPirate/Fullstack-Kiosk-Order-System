import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Inventory.module.css';

export default function Inventory() {
    const [filter, setFilter] = useState('all');
    const [ingredients,setIngredients] = useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);
    const [editingIngredient, setEditingIngredient] = useState(null);

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

    const handleEditRestrictions = (ingredient) => {
        setEditingIngredient(ingredient);
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
                                <th>Dietary Restrictions</th>
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
                                        <td>
                                            <button
                                                onClick={() => handleEditRestrictions(ingredient)}
                                                className={styles.editButton}>
                                                Edit
                                            </button>
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
            {editingIngredient && (
                <EditRestrictionsModal
                    ingredient={editingIngredient}
                    onClose={() => setEditingIngredient(null)}
                />
            )}
        </div>
    );
}

function EditRestrictionsModal({ ingredient, onClose }) {
    const [allRestrictions, setAllRestrictions] = useState([]);
    const [ingredientRestrictionIds, setIngredientRestrictionIds] = useState(new Set());
    const [initialIngredientRestrictionIds, setInitialIngredientRestrictionIds] = useState(new Set());
    const [newRestrictionName, setNewRestrictionName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [allRes, ingredientRes] = await Promise.all([
                    axios.get('/api/dietary-restrictions'),
                    axios.get(`/api/dietary-restrictions/ingredient/${ingredient.ingredient_id}`)
                ]);
                setAllRestrictions(allRes.data);
                const initialIds = new Set(ingredientRes.data.map(r => r.dietary_restriction_id));
                setIngredientRestrictionIds(initialIds);
                setInitialIngredientRestrictionIds(initialIds);
            } catch (error) {
                console.error('Error fetching restrictions:', error);
                alert('Failed to load restriction data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [ingredient.ingredient_id]);

    const handleToggleRestriction = (restrictionId) => {
        setIngredientRestrictionIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(restrictionId)) {
                newSet.delete(restrictionId);
            } else {
                newSet.add(restrictionId);
            }
            return newSet;
        });
    };

    const handleSave = async () => {
        try {
            const toAdd = [...ingredientRestrictionIds].filter(id => !initialIngredientRestrictionIds.has(id));
            const toRemove = [...initialIngredientRestrictionIds].filter(id => !ingredientRestrictionIds.has(id));

            const addPromises = toAdd.map(restrictionId =>
                axios.post(`/api/dietary-restrictions/ingredient/${ingredient.ingredient_id}/${restrictionId}`)
            );

            const removePromises = toRemove.map(restrictionId =>
                axios.delete(`/api/dietary-restrictions/ingredient/${ingredient.ingredient_id}/${restrictionId}`)
            );

            await Promise.all([...addPromises, ...removePromises]);

            onClose();
        } catch (error) {
            console.error('Error saving restrictions:', error);
            alert('Failed to save restrictions.');
        }
    };

    const handleAddNewRestriction = async () => {
        if (!newRestrictionName.trim()) {
            alert('Please enter a name for the new restriction.');
            return;
        }
        try {
            const response = await axios.post('/api/dietary-restrictions', { name: newRestrictionName });
            setAllRestrictions(prev => [...prev, response.data]);
            setNewRestrictionName('');
        } catch (error) {
            console.error('Error adding new restriction:', error);
            alert('Failed to add new restriction.');
        }
    };

    const handleDeleteRestriction = async (restrictionId) => {
        if (window.confirm('Are you sure you want to permanently delete this dietary restriction from the system? This cannot be undone.')) {
            try {
                await axios.delete(`/api/dietary-restrictions/${restrictionId}`);
                setAllRestrictions(prev => prev.filter(r => r.dietary_restriction_id !== restrictionId));
                setIngredientRestrictionIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(restrictionId);
                    return newSet;
                });
            } catch (error) {
                console.error('Error deleting restriction:', error);
                alert('Failed to delete restriction.');
            }
        }
    };

    return (
        <div className={styles.popupOverlay} onClick={onClose}>
            <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                <h2>Edit Restrictions for {ingredient.name}</h2>
                {loading ? <p>Loading...</p> : (
                    <div className={styles.formField}>
                        {allRestrictions.map(res => (
                            <div key={res.dietary_restriction_id} className={styles.restrictionItem}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={ingredientRestrictionIds.has(res.dietary_restriction_id)}
                                        onChange={() => handleToggleRestriction(res.dietary_restriction_id)}
                                    />
                                    {res.dietary_restriction_name}
                                </label>
                                <button onClick={() => handleDeleteRestriction(res.dietary_restriction_id)} className={styles.deleteButton} title="Delete restriction permanently">
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className={styles.addNewRestriction}>
                    <input
                        type="text"
                        value={newRestrictionName}
                        onChange={(e) => setNewRestrictionName(e.target.value)}
                        placeholder="New restriction name"
                    />
                    <button onClick={handleAddNewRestriction} title="Add new restriction">
                        <FaPlus />
                    </button>
                </div>
                <div className={styles.popupActions}>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
}
