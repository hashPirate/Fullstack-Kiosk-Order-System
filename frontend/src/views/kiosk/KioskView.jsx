
import { Link, Outlet } from "react-router";
import { TiWeatherCloudy } from "react-icons/ti";
import { LuShoppingCart } from "react-icons/lu";
import { CiGlobe } from "react-icons/ci";
import { IoArrowBack } from "react-icons/io5";
import { useEffect, useState } from "react";
import { fetchWeatherApi } from 'openmeteo';

import styles from "./KioskView.module.css";

const langIcons = {
    "English": "🇬🇧",
    "Spanish": "🇪🇸",
};

export default function KioskView() {
    const [temp, setTemp] = useState("...");
    const [lang, setLang] = useState("English");

    // Fetch weather as soon as this component loads.
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
            <nav className={styles.kioskNav}>
                <div className={styles.navLeft}>
                    <Link to="language" className={styles.headerLink}><CiGlobe className={styles.kioskIcon}/></Link>
                    <span className={styles.langDisplay}>{langIcons[lang]}</span>
                </div>
                <Link to="/kiosk" className={styles.headerLink}><h1 className={styles.kioskTitle}>Ex-sell-ence</h1></Link>
                <div className={styles.navRight}>
                    <div className={styles.weather}><TiWeatherCloudy className={styles.kioskIcon}/> <span className={styles.weatherText}>{temp}</span></div>
                    <LuShoppingCart className={styles.kioskIcon}/>
                </div>
            </nav>
            <Outlet context={{lang, setLang}} />
        </>
    );
};
