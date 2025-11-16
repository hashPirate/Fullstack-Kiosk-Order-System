import { IoIosRemoveCircleOutline } from "react-icons/io";
import { useContext } from "react";

import styles from "./OrderView.module.css";
import OrderContext from "../../OrderContext";

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
