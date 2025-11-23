import { Link } from "react-router";
import styles from "./KioskHome.module.css";

// Props:
    // img -- string
    // name -- string
    // price -- string
export default function KioskMenuItem({img, name, price, itemId, partCount}) {
    return (
        <Link to={`build_item?itemId=${itemId}&itemName=${encodeURIComponent(name)}&partCount=${partCount}`} aria-label={`Build a ${name} meal` }>
            <div className={styles.kioskMenuItem}>
                <img className={styles.kioskMenuItemImage} src={img} alt={name} />
                <span className={styles.menuItemName}>{name}</span>
                <span className={styles.menuItemPrice}>{price}</span>
            </div>
        </Link>
    );
}
