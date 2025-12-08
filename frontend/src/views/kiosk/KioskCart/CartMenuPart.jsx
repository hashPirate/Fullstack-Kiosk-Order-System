/**
 * @module KioskCart/CartMenuPart
 */
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { useContext } from "react";

import styles from "./KioskCart.module.css";
import CartContext from "../CartContext.js";

/**
 * @function CartMenuPart
 * @description Shows a selected menu part underneath a cart item.
 * @param {object} props - The component's props.
 * @param {string} props.name - The name of the menu part.
 * @param {number} props.price - The price of the menu part.
 * @returns {React.ReactElement} A row showing the part name and its price.
 */
export default function CartMenuPart({name, price}) {
    const orderState = useContext(CartContext);

    return (
    <div className={styles.cartMenuPart}>
        <span className={styles.partTitle}>{name}</span>
        <span className={styles.partPrice}>${price}</span>
    </div>
    );
}
