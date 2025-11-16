import clsx from "clsx";
import { useLocation, useNavigate } from "react-router";

import styles from "./CashierView.module.css";

export default function OrderProgression() {
    const navigate = useNavigate();
    const location = useLocation();
    const outletPath = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);

    function onDoneClick() {
        navigate("/cashier/menu_items");
    }

    return (
        <div className={styles.orderProgression}>
            <div className={styles.progressBar}>
                <h3 className={clsx(styles.progressBarStage, (outletPath === "menu_items") && styles.progressBarActive)}>Menu Items</h3>
                <h3 className={clsx(styles.progressBarStage, (outletPath === "menu_parts") && styles.progressBarActive)}>Menu Parts</h3>
            </div>
            <button className={clsx(styles.doneButton, (outletPath === "menu_parts") && styles.buttonActive)}
                disabled={outletPath !== "menu_parts"} 
                onClick={onDoneClick}>Done ✓</button>
        </div>
    );
}
