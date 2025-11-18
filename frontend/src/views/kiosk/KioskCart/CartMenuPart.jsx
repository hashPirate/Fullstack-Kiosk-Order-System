import { IoIosRemoveCircleOutline } from "react-icons/io";
import { useContext } from "react";

import styles from "./KioskCart.module.css";
import CartContext from "../CartContext.js";

export default function CartMenuPart({name, price, itemIndex, partIndex}) {
    const orderState = useContext(CartContext);

    function onXClick() {
        // TODO
    }

    return (
    <div className={styles.cartMenuPart}>
        <IoIosRemoveCircleOutline className={styles.partXButton} onClick={onXClick}/>
        <span className={styles.partTitle}>{name}</span>
        <span className={styles.partPrice}>{price}</span>
    </div>
    );
}
