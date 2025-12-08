
/**
 * @module Kiosk/KioskMenuPart
 */
import { Link } from "react-router";
import styles from './KioskMenuPart.module.css';
import clsx from 'clsx';

// Props:
    // img -- string
    // name -- string
    // price -- number
    // dietary_restrictions -- array of strings
/**
 * @function KioskMenuPart
 * @description A selectable tile for a menu part option displayed within the item build flow.
 * @param {object} props - The component's props.
 * @param {boolean} props.selected - Whether this part is currently selected.
 * @param {string} props.img - The URL for the part's image.
 * @param {string} props.name - The name of the menu part.
 * @param {number} props.price - The price of the menu part.
 * @param {number} props.partId - The database ID of the menu part.
 * @param {Function} props.onClick - The callback function to execute when the part is clicked.
 * @param {Array<string>} props.dietary_restrictions - A list of dietary restrictions for this part.
 * @returns {React.ReactElement} A button-like UI showing the part image, price, and dietary chips.
 */
export default function KioskMenuPart({selected, img, name, price, partId, onClick, dietary_restrictions}) {
    return (
        <div className={clsx(styles.kioskMenuPart, selected && styles.partSelected)} onClick={onClick}>
            <img className={styles.kioskMenuPartImage} src={img} alt={name} />
            <span className={styles.menuPartName}>{name}</span>
            <div className={styles.menuPartInfo}>
                <span className={styles.menuPartPrice}>+${price.toFixed(2)}</span>
                <div className={styles.dietaryChips}>
                    {dietary_restrictions?.map((restriction, index) => (
                        <span key={index} className={styles.dietaryChip}>
                            {restriction}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
