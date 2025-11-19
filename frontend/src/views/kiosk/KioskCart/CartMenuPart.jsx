import { IoIosRemoveCircleOutline } from "react-icons/io";
import { useContext } from "react";

import styles from "./KioskCart.module.css";
import CartContext from "../CartContext.js";

export default function CartMenuPart({name, price}) {
    const orderState = useContext(CartContext);

    return (
    <div className={styles.cartMenuPart}>
        <span className={styles.partTitle}>{name}</span>
        <span className={styles.partPrice}>{price}</span>
    </div>
    );
}
