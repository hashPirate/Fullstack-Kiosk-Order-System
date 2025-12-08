import { Link } from "react-router";
import styles from "./KioskHome.module.css";

// Props:
    // img -- string
    // name -- string
    // price -- string
/**
 * Card representing an entree option on the kiosk home screen.
 * @param {{img: string, name: string, price: number, itemId: number, partCount: number}} props Menu item metadata.
 * @returns {JSX.Element} Linkable tile that navigates to the build flow.
 */
export default function KioskMenuItem({img, name, price, itemId, partCount}) {
    return (
        <Link to={`build_item?itemId=${itemId}&itemName=${encodeURIComponent(name)}&partCount=${partCount}`} aria-label={`Build a ${name} meal` }>
            <div className={styles.kioskMenuItem}>
                <img className={styles.kioskMenuItemImage} src={img} alt={name} />
                <span className={styles.menuItemName}>{name}</span>
                <span className={styles.menuItemPrice}>${price.toFixed(2)}</span>
            </div>
        </Link>
    );
}
