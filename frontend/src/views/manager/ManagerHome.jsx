/**
 * @module views/manager
 */

import { NavLink } from "react-router";
import clsx from 'clsx';
import styles from "./ManagerHome.module.css";

/**
 * Manager home component that displays navigation tabs for manager views.
 * @function ManagerHome
 * @returns {React.ReactElement} The rendered manager home navigation tabs.
 */
export default function ManagerHome() {
    return (
        <>
            <div className={styles.managerTabs}>
                <NavLink to="/manager/servers" className={({isActive}) => clsx(styles.managerTab, isActive && styles.active)}>
                    Servers
                </NavLink>
                <NavLink to="/manager/inventory" className={({isActive}) => clsx(styles.managerTab, isActive && styles.active)}>
                    Inventory
                </NavLink>
                <NavLink to="/manager/reports" className={({isActive}) => clsx(styles.managerTab, isActive && styles.active)}>
                    Reports
                </NavLink>
                <NavLink to="/manager/menu-parts" className={({isActive}) => clsx(styles.managerTab, isActive && styles.active)}>
                    Menu Parts
                </NavLink>
                <NavLink to="/manager/menu-items" className={({isActive}) => clsx(styles.managerTab, isActive && styles.active)}>
                    Menu Items
                </NavLink>
                <NavLink to="/manager/sales-report" className={({isActive}) => clsx(styles.managerTab, isActive && styles.active)}>
                    Sales & Product Reports
                </NavLink>
                <NavLink to="/manager/menu-manager" className={({isActive}) => clsx(styles.managerTab, isActive && styles.active)}>
                    Menu Manager
                </NavLink>
            </div>
        </>
    );
};