/**
 * @module KioskCart/CartMenuItem
 */
import { GoXCircle } from "react-icons/go";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router";

import styles from "./KioskCart.module.css";
import CartContext from "../CartContext.js";

/**
 * @function CartMenuItem
 * @description Displays a cart line item with its selected parts and allows removal.
 * @param {object} props - The component's props.
 * @param {string} props.name - The name of the menu item.
 * @param {number} props.price - The price of the menu item.
 * @param {number} props.itemIndex - The index of this item in the cart.
 * @param {React.ReactNode} props.children - The nested `CartMenuPart` components.
 * @returns {React.ReactElement} A cart entry with name, price, and nested parts.
 */
export default function CartMenuItem({name, price, itemIndex, children}) {
    const cartState = useContext(CartContext);

    // Right now, you have to remove the item from the underlying CartContext.cartContent
    // state as well as the translatedCartContent state. I decided to do this because
    // having translatedCartContent live-adjust to match CartContext.cartContent seems
    // like it might be atrociously bad for CPU. But idk, I might refactor this in the future.
    function onXClick() {
        cartState.removeCompletedItem(itemIndex);
    }

    return (
    <div className={styles.cartMenuItem}>
        <div className={styles.itemHeader}>
            <GoXCircle className={styles.itemXButton} onClick={onXClick} aria-label={`Remove ${name}`} />
            <h4 className={styles.itemTitle}>{name}</h4>
            <span className={styles.itemPrice}>${price}</span>
        </div>
        {children}
    </div>
    );
}
