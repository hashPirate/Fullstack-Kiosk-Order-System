/**
 * @module views/manager/views
 */

import { useState } from 'react';
import styles from './ManageMenuItems.module.css';

//demoitems
const FAKE_MENU_ITEMS = [
    { menu_item_id: 1, item_name: 'Bowl', price: 5.00, for_sale: true },
    { menu_item_id: 2, item_name: 'Plate', price: 6.00, for_sale: true },
    { menu_item_id: 3, item_name: 'Big Plate', price: 7.00, for_sale: true },
    { menu_item_id: 4, item_name: 'Drink', price: 1.00, for_sale: true }
];

/**
 * Component for managing menu items.
 * Allows viewing and editing menu items including name, price, and availability.
 * @function ManageMenuItems
 * @returns {React.ReactElement} The rendered menu items management interface.
 */
export default function ManageMenuItems() {
    const [menuItems] = useState(FAKE_MENU_ITEMS);

    const handleAddMenuItem = () => {
        console.log('Add menu item (demo mode)');
    };

    const handleUpdateMenuItem = (item, field, value) => {
        console.log('Update menu item (demo mode):', item.item_name, field, value);
    };
    const handleCellEdit = (item, field, currentValue) => {
        if (field === 'for_sale') {
            handleUpdateMenuItem(item, field, !currentValue);
            return;
        }
        const newValue = prompt(`Enter new ${field}:`, currentValue);
        if (newValue !== null && newValue !== currentValue.toString()) {
            handleUpdateMenuItem(item, field, newValue);
        }
    };
    return (
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
                        {menuItems.map(item => (
                            <tr key={item.menu_item_id}>
                                <td>{item.menu_item_id}</td>
                                <td
                                    className={styles.editableCell}
                                    onClick={() => handleCellEdit(item, 'item_name', item.item_name)}
                                    title="Click to edit"
                                >
                                    {item.item_name}
                                </td>
                                <td
                                    className={styles.editableCell}
                                    onClick={() => handleCellEdit(item, 'price', item.price)}
                                    title="Click to edit"
                                >
                                    ${parseFloat(item.price).toFixed(2)}
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={item.for_sale}
                                        onChange={() => handleCellEdit(item, 'for_sale', item.for_sale)}
                                    />
                                </td>
                            </tr>
                        ))}
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
    );
}
