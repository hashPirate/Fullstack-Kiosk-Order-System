import { IoIosRemoveCircleOutline } from "react-icons/io";
import styles from "./OrderView.module.css";

export default function OrderMenuPart() {
    return (
    <div className={styles.orderMenuPart}>
        <IoIosRemoveCircleOutline className={styles.partXButton}/>
        <span className={styles.partTitle}>Kung Pao Chicken</span>
        <span className={styles.partPrice}>9.99</span>
    </div>
    );
}
