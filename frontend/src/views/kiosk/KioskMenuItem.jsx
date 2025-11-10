import { Link } from "react-router";
import styles from "./KioskHome.module.css";

// Props:
    // img -- string
    // name -- string
    // price -- string
export default function KioskMenuItem(props) {
    return (
        <Link to={props.linkto}>
            <div className={styles.kioskMenuItem}>
                <img className={styles.kioskMenuItemImage} src={props.img} alt={props.name} />
                <span className={styles.menuItemName}>{props.name}</span>
                <span className={styles.menuItemPrice}>{props.price}</span>
            </div>
        </Link>
    );
}
