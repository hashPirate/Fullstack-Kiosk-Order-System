/**
 * @module views/kitchen
 */
import { CiGlobe } from "react-icons/ci";
import { IoArrowBack } from "react-icons/io5";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";

import styles from "./KitchenView.module.css";
/**
 * Parent navigation wrapper for kitchen operations.
 * Provides tabs for Pending and Completed views and includes routing.
 *
 * @function KitchenView
 * @returns {React.ReactElement} The rendered kitchen navigation layout.
 */
export default function KitchenView() {
    const navigate = useNavigate();
    const location = useLocation();
    const outletPath = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);

    return (
        <>
            <nav className={styles.kitchenNav}>
                <div className={styles.navLeft}>
                    <IoArrowBack className={clsx(styles.navIcon, styles.navLink)} onClick={() => navigate("/")}/>
                </div>
                <div className={styles.navTabView}>
                    <NavLink to="/kitchen/pending" style={{textDecoration: "none"}} className={styles.navLink}><span className={clsx(styles.navTab, (outletPath === "pending") && styles.activeTab)}>Pending Orders</span></NavLink>
                    <NavLink to="/kitchen/completed" style={{textDecoration: "none"}} className={styles.navLink}><span className={clsx(styles.navTab, (outletPath === "completed") && styles.activeTab)}>Completed Orders</span></NavLink>
                </div>
                <div className={styles.navRight}>
                    {/* Nothing here yet... I'm going to leave a spacer until some other icon replaces it. */}
                    <div className={styles.navSpacer}/>
                </div>
            </nav>
            <Outlet />
        </>
    );
};
