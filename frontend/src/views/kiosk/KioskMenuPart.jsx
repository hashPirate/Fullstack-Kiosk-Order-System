
import { Link } from "react-router";
import styles from './KioskMenuPart.module.css';
import clsx from 'clsx';

// Props:
    // img -- string
    // name -- string
    // price -- string
export default function KioskMenuItem(props) {
    return (
        <div className={clsx(styles.kioskMenuPart, props.selected && styles.partSelected)} onClick={() => props.selectionCallback(props.name)}>
            <img className={styles.kioskMenuPartImage} src={props.img} alt={props.name} />
            <span className={styles.menuPartName}>{props.name}</span>
            <span className={styles.menuPartPrice}>{props.price}</span>
        </div>
    );
}
