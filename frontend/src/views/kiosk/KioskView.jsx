
import { Link, Outlet, useLocation } from "react-router";
import { TiWeatherCloudy } from "react-icons/ti";
import { LuShoppingCart } from "react-icons/lu";
import { CiGlobe } from "react-icons/ci";
import { IoArrowBack } from "react-icons/io5";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { fetchWeatherApi } from 'openmeteo';

import styles from "./KioskView.module.css";
import CartContext from "./CartContext.js";
import KioskZoomMenu from "./KioskZoomMenu.jsx";

const langIcons = {
    "English": "🇬🇧",
    "Spanish": "🇪🇸",
};

export default function KioskView() {
    const [temp, setTemp] = useState("...");
    const [showZoomMenu, setShowZoomMenu] = useState(false);
    const location = useLocation();
    const outletLocation = location.pathname.slice(location.pathname.lastIndexOf("/") + 1);

    // Defining the cart context stuff here so that everything in the app can use it.
    const [cartContent, setCartContent] = useState([]);
    // itemId: int
    // menuPartIds: Array(int)
    function addCompletedItem(itemId, menuPartIds) {
        // Make sure itemId is a number, it will make our jobs a lot easier.
        if (typeof itemId !== 'number') {
            throw new Error(`itemId must be a number, got ${typeof itemId}`);
        }
        // Make sure every item in menuPartIds is a number
        if (!Array.isArray(menuPartIds)) {
            throw new Error(`menuPartIds must be an array, got ${typeof menuPartIds}`);
        }
        menuPartIds.forEach((partId, index) => {
            if (typeof partId !== 'number') {
                throw new Error(`menuPartIds[${index}] must be a number, got ${typeof partId}`);
            }
        });

        const newCartContent = [...cartContent, {
            itemId: itemId,
            parts: [...menuPartIds]
        }];
        setCartContent(newCartContent);
    }
    function removeCompletedItem(itemIndex) {
        const newCartContent = cartContent.filter((cc,i) => i !== itemIndex);
        setCartContent(newCartContent);
    }
    const cartContextValue = {
        cartContent,
        setCartContent,
        addCompletedItem,
        removeCompletedItem,
    };

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
        <CartContext.Provider value={cartContextValue}>
            <nav className={styles.kioskNav + " skiptranslate"}>
                <div className={styles.navLeft}>
                    {/* This conditional rendering just makes sure that there is a back button on the language / cart page. */}
                    { (outletLocation === "language" || outletLocation === "cart") ? <Link to="/kiosk" className={styles.headerLink}><IoArrowBack className={styles.kioskIcon}/></Link> : <></> }
                    <Link to="language" className={styles.headerLink}><CiGlobe className={styles.kioskIcon}/></Link>
                    <FaMagnifyingGlass className={styles.kioskIcon + " " + styles.magGlassIcon} onClick={() => setShowZoomMenu(!showZoomMenu)} />
                    { (showZoomMenu)
                    ? <KioskZoomMenu setShowZoomMenu={setShowZoomMenu} />
                    : <></> }
                    {/* navSpacers just exist to balance things out and make sure the title is centered. */}
                    {/* { (outletLocation === "language" || outletLocation === "cart") ? <></> : <div className={styles.navSpacer}></div> } */}
                </div>
                <Link to="/kiosk" className={styles.headerLink}><h1 className={styles.kioskTitle}>Ex-sell-ence</h1></Link>
                <div className={styles.navRight}>
                    <div className={styles.weather}><TiWeatherCloudy className={styles.kioskIcon}/> <span className={styles.weatherText}>{temp}</span></div>
                    <Link to="cart" className={styles.headerLink}><LuShoppingCart className={styles.kioskIcon}/></Link>
                </div>
            </nav>
            <Outlet />
        </CartContext.Provider>
    );
};
