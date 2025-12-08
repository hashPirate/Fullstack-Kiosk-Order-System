
import { Link } from "react-router";
import styles from './KioskMenuPart.module.css';
import clsx from 'clsx';

// Props:
    // img -- string
    // name -- string
    // price -- number
    // dietary_restrictions -- array of strings
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
