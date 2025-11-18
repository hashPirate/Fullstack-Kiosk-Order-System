import { GoXCircle } from "react-icons/go";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router";

import styles from "./KioskCart.module.css";
import CartContext from "../CartContext.js";

export default function CartMenuItem({name, price, itemIndex, children}) {
    const cartState = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();
    const outletPath = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);

    function onXClick() {
        // TODO
    }

    return (
    <div className={styles.cartMenuItem}>
        <div className={styles.itemHeader}>
            <GoXCircle className={styles.itemXButton} onClick={onXClick}/>
            <h4 className={styles.itemTitle}>{name}</h4>
            <span className={styles.itemPrice}>{price}</span>
        </div>
        {children}
    </div>
    );
}
