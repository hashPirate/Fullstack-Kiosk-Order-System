import { CiGlobe } from "react-icons/ci";
import { IoArrowBack } from "react-icons/io5";
import { NavLink, Outlet, useNavigate } from "react-router";
import clsx from "clsx";

import styles from "./KitchenView.module.css";

export default function KitchenView() {
    const navigate = useNavigate();

    return (
        <>
            <nav className={styles.kitchenNav}>
                <div className={styles.navLeft}>
                    <IoArrowBack className={clsx(styles.navIcon, styles.navLink)} onClick={() => navigate("/")}/>
                </div>
                <h2 className={styles.kitchenNavTitle}>Pending Orders</h2>
                <div className={styles.navRight}>
                    {/* Nothing here yet... I'm going to leave a spacer until some other icon replaces it. */}
                    <div className={styles.navSpacer}/>
                </div>
            </nav>
            <Outlet />
        </>
    );
};
