import { IoIosRemoveCircleOutline } from "react-icons/io";
import { useContext } from "react";

import styles from "./KioskCart.module.css";
import CartContext from "../CartContext.js";

/**
 * Shows a selected menu part underneath a cart item.
 * @param {{name: string, price: number}} props Data describing the part.
 * @returns {JSX.Element} Row showing the part name and its price delta.
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
