import { GoXCircle } from "react-icons/go";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router";

import styles from "./OrderView.module.css";
import OrderContext from "../../OrderContext";

export default function OrderMenuItem({name, price, itemIndex, children}) {
    const orderState = useContext(OrderContext);
    const navigate = useNavigate();
    const location = useLocation();
    const outletPath = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);

    function onXClick() {
        orderState.removeMenuItem(itemIndex);
        if (orderState.length === 0 && outletPath === "menu_parts") {
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
