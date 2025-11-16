import styles from "./CashierMenuItems.module.css";
import MenuItem from "./MenuItem.jsx";

const pastelColors = [
    "#FFD1DC",
    "#AEC6CF",
    "#E6E6FA",
    "#B5EAD7",
    "#FFDAB9",
    "#FFFACD",
    "#F88379",
    "#C8A2C8",
    "#AFEEEE",
];

export default function CashierMenuItems() {
    return (
        <div className={styles.menuItemsContainer}>
            {pastelColors.map((c, i) => <MenuItem key={i} style={{backgroundColor: c}} />)}
        </div>
    );
}
