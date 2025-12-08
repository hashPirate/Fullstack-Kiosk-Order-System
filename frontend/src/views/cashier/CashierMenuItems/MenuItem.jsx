import {useNavigate} from 'react-router-dom';
import clsx from 'clsx';
import { useContext } from 'react';

import gridStyles from '../MenuGridStyles.module.css'; 
import styles from './CashierMenuItems.module.css';
import OrderContext from '../OrderContext';

/**
 * Component representing a single selectable menu item in the cashier's
 * menu items grid.
 *
 * @component
 *
 * @param {Object} props
 * @param {number|string} props.id - The database ID of the menu item.
 * @param {string} props.name - Human-readable name of the menu item.
 * @param {number} props.price - Base price of the menu item.
 * @param {Object} [props.style] - Optional inline styles applied to the card.
 *
 * @description
 * When clicked:
 * - Ensures no order is currently being processed
 * - Adds the menu item to the active order using `orderState.addMenuItem()`
 * - Navigates the user to the menu parts selection screen:
 *     `/cashier/menu_parts?menuItemID={id}`
 *
 * @returns {JSX.Element} A styled tile representing a single menu item.
 */

export default function MenuItem({id, name, price, style}) {
    const navigate = useNavigate();
    const orderState = useContext(OrderContext);
    /**
     * Handles selection of the menu item.
     * Adds the item to the order and navigates to the menu parts screen.
     *
     * @returns {void}
     */
    function onItemClick() {
        if (orderState.isProcessing) {
            console.log("ERROR: cannot add items to a new order while processing another order.");
            return;
        }

        orderState.addMenuItem(id, name, price);
        navigate(`/cashier/menu_parts?menuItemID=${id}`);
    }

    return (
        <div className={clsx(gridStyles.gridItem, styles.menuItem)} style={style} onClick={onItemClick}>
            {name}
        </div>
    );
}
