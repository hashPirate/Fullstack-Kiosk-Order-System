import { GoXCircle } from "react-icons/go";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router";

import styles from "./OrderView.module.css";
import OrderContext from "../../OrderContext";

/**
 * Component representing a menu item inside the current order view.
 * Displays the item name, price, a remove ("X") button, and any nested parts.
 *
 * @component
 * @param {Object} props
 * @param {string} props.name - Display name of the menu item.
 * @param {number|string} props.price - Price of the item (string-formatted or number).
 * @param {number} props.itemIndex - Index of this item inside `orderContent`.
 * @param {React.ReactNode} props.children - Parts belonging to this menu item.
 *
 * @description
 * Removes the item when the X icon is clicked. If the order becomes empty
 * after removing the item, the user is redirected back to `/cashier/menu_items`.
 *
 * @returns {JSX.Element} A styled container showing the order item and its parts.
 */

export default function OrderMenuItem({name, price, itemIndex, children}) {
    const orderState = useContext(OrderContext);
    const navigate = useNavigate();
    const location = useLocation();
    const outletPath = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);

    function onXClick() {
        // Calculating order length in this round-about way since state updates are not always immediately accessible!
        let orderLength = orderState.orderContent.length;
        orderState.removeMenuItem(itemIndex);
        orderLength -= 1;
        if (orderLength === 0) {
            navigate("/cashier/menu_items");
        }
    }

    return (
    <div className={styles.orderMenuItem}>
        <div className={styles.itemHeader}>
            <GoXCircle className={styles.itemXButton} onClick={onXClick}/>
            <h4 className={styles.itemTitle}>{name}</h4>
            <span className={styles.itemPrice}>{price}</span>
        </div>
        {children}
    </div>
    );
}
