import { GoXCircle } from "react-icons/go";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router";

import styles from "./KioskCart.module.css";
import CartContext from "../CartContext.js";

export default function CartMenuItem({name, price, itemIndex, children, transCartContent, setTransCartContent}) {
    const cartState = useContext(CartContext);

    // Right now, you have to remove the item from the underlying CartContext.cartContent
    // state as well as the translatedCartContent state. I decided to do this because
    // having translatedCartContent live-adjust to match CartContext.cartContent seems
    // like it might be atrociously bad for CPU. But idk, I might refactor this in the future.
    function onXClick() {
        cartState.removeCompletedItem(itemIndex);
        const newTransCartContent = transCartContent.filter((itm,i) => i !== itemIndex);
        setTransCartContent(newTransCartContent);
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
