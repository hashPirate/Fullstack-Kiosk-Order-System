import styles from "./CashierView.module.css";
import clsx from "clsx";
import { useLocation } from "react-router";

export default function ProgressBar() {
    const location = useLocation();
    const outletPath = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);

    return (
        <div className={styles.progressBarArea}>
            <div className={styles.progressBar}>
                <h3 className={clsx(styles.progressBarStage, (outletPath === "menu_items") && styles.progressBarActive)}>Menu Items</h3>
                <h3 className={clsx(styles.progressBarStage, (outletPath === "menu_parts") && styles.progressBarActive)}>Menu Parts</h3>
            </div>
        </div>
    );
}
