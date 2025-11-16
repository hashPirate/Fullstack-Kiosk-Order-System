import { IoIosRemoveCircleOutline } from "react-icons/io";
import styles from "./OrderView.module.css";

export default function OrderMenuPart({name, price}) {
    return (
    <div className={styles.orderMenuPart}>
        <IoIosRemoveCircleOutline className={styles.partXButton}/>
        <span className={styles.partTitle}>{name}</span>
        <span className={styles.partPrice}>{price}</span>
    </div>
    );
}
