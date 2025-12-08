/**
 * @module Kiosk/KioskMenuItem
 */
import { Link } from "react-router";
import styles from "./KioskHome.module.css";

// Props:
    // img -- string
    // name -- string
/**
 * @function KioskMenuItem
 * @description Card representing an entree option on the kiosk home screen.
 * @param {object} props - The component's props.
 * @param {string} props.img - The URL for the item's image.
 * @param {string} props.name - The name of the menu item.
 * @param {number} props.price - The price of the menu item.
 * @param {number} props.itemId - The database ID of the menu item.
 * @param {number} props.partCount - The number of customizable parts for the item.
 * @returns {React.ReactElement} A linkable tile that navigates to the item build flow.
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
