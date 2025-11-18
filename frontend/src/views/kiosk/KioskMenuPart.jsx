
import { Link } from "react-router";
import styles from './KioskMenuPart.module.css';
import clsx from 'clsx';

// Props:
    // img -- string
    // name -- string
    // price -- string
export default function KioskMenuItem({selectionCallback, selected, img, name, price, partId, onClick}) {
    return (
        <div className={clsx(styles.kioskMenuPart, selected && styles.partSelected)} onClick={onClick}>
            <img className={styles.kioskMenuPartImage} src={img} alt={name} />
            <span className={styles.menuPartName}>{name}</span>
            <span className={styles.menuPartPrice}>{price}</span>
        </div>
    );
}
