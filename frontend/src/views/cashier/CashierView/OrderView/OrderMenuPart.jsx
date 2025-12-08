import { IoIosRemoveCircleOutline } from "react-icons/io";
import { useContext } from "react";

import styles from "./OrderView.module.css";
import OrderContext from "../../OrderContext";

/**
 * @module views/cashier/CashierView/OrderView/OrderMenuPart
 */
/**
 * Component that displays an individual menu part (modifier/add-on) belonging
 * to a menu item in the order view.
 *
 * @function OrderMenuPart
 * @param {object} props - The component's props.
 * @param {string} props.name - Name of the menu part.
 * @param {number|string} props.price - Additional cost of this menu part.
 * @param {number} props.itemIndex - Parent menu item index in {@link module:views/cashier/CashierView/CashierView~orderContent}.
 * @param {number} props.partIndex - Index of this part inside the item's `parts` array.
 * @description
 * Clicking the remove icon removes this part from its parent item via context.
 *
 * @returns {React.ReactElement} A styled row containing part name, price, and removal button.
 */

export default function OrderMenuPart({name, price, itemIndex, partIndex}) {
    const orderState = useContext(OrderContext);

    function onXClick() {
        orderState.removeMenuPart(itemIndex, partIndex);
    }

    return (
    <div className={styles.orderMenuPart}>
        <IoIosRemoveCircleOutline className={styles.partXButton} onClick={onXClick}/>
        <span className={styles.partTitle}>{name}</span>
        <span className={styles.partPrice}>{price}</span>
    </div>
    );
}
