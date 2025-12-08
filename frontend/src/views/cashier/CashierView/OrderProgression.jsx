import clsx from "clsx";
import { useLocation, useNavigate } from "react-router";

import styles from "./CashierView.module.css";
/**
 * Component representing the order progression bar displayed in the menu pane.
 *
 * @component
 *
 * @description
 * Highlights the current step of the order:
 * - "Menu Items"
 * - "Menu Parts"
 *
 * Also includes a "Done ✓" button, which becomes active only when on the
 * "menu_parts" route, and navigates back to the Menu Items screen.
 *
 * @returns {JSX.Element} A dynamic progress bar with conditional styling.
 */
export default function OrderProgression() {
    const navigate = useNavigate();
    const location = useLocation();
    const outletPath = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
    /**
     * Navigates the user back to the menu items screen.
     *
     * @returns {void}
     */
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
