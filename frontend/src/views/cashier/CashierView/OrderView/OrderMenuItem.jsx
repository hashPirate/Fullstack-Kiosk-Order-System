import { GoXCircle } from "react-icons/go";
import styles from "./OrderView.module.css";

export default function OrderMenuItem({name, price, children}) {
   return (
    <div className={styles.orderMenuItem}>
        <div className={styles.itemHeader}>
            <GoXCircle className={styles.itemXButton} />
            <h4 className={styles.itemTitle}>{name}</h4>
            <span className={styles.itemPrice}>{price}</span>
        </div>
        {children}
    </div>
   );
}
