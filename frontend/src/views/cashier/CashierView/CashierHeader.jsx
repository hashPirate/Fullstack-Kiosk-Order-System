import styles from './CashierView.module.css';
import { Link } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
/**
 * @module views/cashier/CashierView/CashierHeader
 */
/**
 * Header component for the Cashier view.
 * @function CashierHeader
 * Displays:
 * - A back button (link to "/")
 * - The title "ExSELLence Cashier"
 * - A spacer to keep the title perfectly centered
 *
 * The layout is controlled entirely through CSS, with the spacer
 * mirroring the width of the icon to balance the header visually.
 * @returns {React.ReactElement} The formatted cashier header.
 */

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
