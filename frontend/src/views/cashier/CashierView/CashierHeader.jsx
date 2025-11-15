import styles from './CashierView.module.css';
import { Link } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";

export default function CashierHeader() {
    return (
        <div className={styles.header}>
            <Link to="/" className={styles.headerLink}><IoArrowBack className={styles.headerIcon} /></Link>
            <h1 className={styles.title}>ExSELLence Cashier</h1>
            {/* Header Spacers are the size of one icon and they are used to make sure the title is centered. */}
            <div className={styles.headerSpacer}></div>
        </div>
    );
}
