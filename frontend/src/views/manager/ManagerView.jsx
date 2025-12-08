
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { TiWeatherCloudy } from "react-icons/ti";
import { useEffect, useState } from "react";
import { fetchWeatherApi } from 'openmeteo';
import clsx from 'clsx';
import { IoMdArrowBack } from "react-icons/io";

import styles from "./ManagerView.module.css";

export default function ManagerView() {
    const [temp, setTemp] = useState("...");
    const [lang, setLang] = useState("English");
    const location = useLocation();
    useEffect(() => {
        let alive = true;

        (async () => {
        try {
            const url = "https://api.open-meteo.com/v1/forecast";
            const params = {
            latitude: [30.601389],          // College Station, TX
            longitude: [-96.314445],
            current: "temperature_2m",      // only current temp
            temperature_unit: "fahrenheit", // °F
            timezone: "America/Chicago"
            };

            const responses = await fetchWeatherApi(url, params);
            const res = responses[0];
            const current = res.current();
            const f = current.variables(0).value(); // temperature_2m in °F

            if (alive) {
                setTemp(Math.round(f).toString() + "°");
            }
        } catch (e) {
            if (alive) {
                console.log("ERROR: could not load temperature.");
            }
        }
        })();

        return () => { alive = false; };
    }, []);

    return (
        <>
            <nav className={styles.managerNav}>
                <div className={styles.navLeft}>
                    {/* No need for language switching on Manager View... for now. */}
                    <Link to="/"><IoMdArrowBack className={styles.managerIcon}/></Link>
                </div>
                <Link to="/manager" className={styles.headerLink}><h1 className={styles.managerTitle}>Ex-sell-ence Manager</h1></Link>
                <div className={styles.navRight}>
                    <div className={styles.weather}><TiWeatherCloudy className={styles.managerIcon}/> <span className={styles.weatherText}>{temp}</span></div>
                    {/* No need for cart on Manager View either. */}
                </div>
            </nav>
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
            <Outlet context={{lang, setLang}} />
        </>
    );
};
