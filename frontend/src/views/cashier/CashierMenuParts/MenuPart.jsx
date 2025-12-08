// import {useNavigate} from 'react-router-dom';
import clsx from 'clsx';
import { useContext } from 'react';
import { useNavigate } from 'react-router';

import gridStyles from '../MenuGridStyles.module.css'; 
import styles from './CashierMenuParts.module.css';
import OrderContext from '../OrderContext';

/**
 * Component representing a single selectable menu part (modifier/add-on)
 * inside the Menu Parts selection screen.
 *
 * @component
 *
 * @param {Object} props
 * @param {Object} [props.style] - Inline style object applied to the part tile.
 * @param {number|string} props.id - The database ID of the menu part.
 * @param {string} props.name - The display name of the menu part.
 * @param {number} props.price - The price of the menu part.
 *
 * @description
 * Clicking a part attempts to add it to the current order by calling:
 *   orderState.addMenuPart()
 *
 * Behavior:
 * - If an order is currently being processed → disallow adding parts.
 * - If there are no items in the order → redirect to /cashier/menu_items.
 * - Otherwise → add the part to the most recently added item.
 *
 * @returns {JSX.Element} A styled tile representing a selectable part.
 */

export default function MenuPart({style, id, name, price}) {
    const orderState = useContext(OrderContext);
    const navigate = useNavigate();

    /**
     * Handles adding a menu part to the current order.
     *
     * @returns {void}
     */

    function onPartClick() {
        if (orderState.isProcessing) {
            console.log("ERROR: cannot add parts to a new order while processing another order.");
            return;
        }

        if (orderState.orderContent.length === 0) {
            console.log("ERROR: cannot add menu parts when there are no menu items!");
            navigate("/cashier/menu_items");
            return;
        }
        orderState.addMenuPart(orderState.orderContent.length - 1, id, name, price);
    }

    return (
        <div className={clsx(gridStyles.gridItem, styles.menuPart)} style={style} onClick={onPartClick}>
            {name}
        </div>
    );
}
