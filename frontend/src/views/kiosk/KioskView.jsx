
import { Link, Outlet, useLocation } from "react-router";
import { TiWeatherCloudy } from "react-icons/ti";
import { LuShoppingCart } from "react-icons/lu";
import { CiGlobe } from "react-icons/ci";
import { IoArrowBack } from "react-icons/io5";
import { FiLogIn } from "react-icons/fi";
import { HiMagnifyingGlassPlus } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { fetchWeatherApi } from 'openmeteo';

import styles from "./KioskView.module.css";
import CartContext from "./CartContext.js";
import KioskZoomMenu from "./KioskZoomMenu.jsx";
import KioskLoginPopup from "./KioskLoginPopup.jsx";

export default function KioskView() {
    const [temp, setTemp] = useState("...");
    const [showZoomMenu, setShowZoomMenu] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [user, setUser] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(100);
    const location = useLocation();
    const outletLocation = location.pathname.slice(location.pathname.lastIndexOf("/") + 1);

    // Defining the cart context stuff here so that everything in the app can use it.
    const [cartContent, setCartContent] = useState([]);
    const cartCount = cartContent.length;

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

        setCartContent(prevCartContent => [
            ...prevCartContent,
            { itemId: itemId, parts: [...menuPartIds] }
        ]);
    }

    function removeCompletedItem(itemIndex) {
        const newCartContent = cartContent.filter((cc,i) => i !== itemIndex);
        setCartContent(newCartContent);
    }

    function signOut() {
        setUser(null);

        // Queue sign in prompt and navigate back to home after 3 seconds
        setTimeout(() => {
            setShowLoginPopup(true);
            window.location.href = "/kiosk";
        }, 3000);
    }

    // Change the actual zoom on `zoomLevel` change
    useEffect(() => {
        document.body.style.zoom = `${zoomLevel}%`;
    }, [zoomLevel]);

    // Fetch weather as soon as this component loads.
    useEffect(() => {
        let alive = true;

        // Show the login popup every time the page loads.
        setShowLoginPopup(true);

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

    const cartContextValue = {
        cartContent,
        cartCount,
        setCartContent,
        addCompletedItem,
        removeCompletedItem,
        signOut,
    };

    return (
        <CartContext.Provider value={cartContextValue}>
            <nav className={styles.kioskNav + " skiptranslate"}>
            <div className={styles.navLeft}>
                    {/* This conditional rendering just makes sure that there is a back button on the language / cart page. */}
                    { (outletLocation === "language" || outletLocation === "cart") ? <Link to="/kiosk" className={styles.headerLink} aria-label="Go back to kiosk menu"><IoArrowBack className={styles.kioskIcon}/></Link> : <></> }
                    <Link to="language" className={styles.headerLink}><CiGlobe className={styles.kioskIcon} aria-label="Change language" /></Link>
                    <HiMagnifyingGlassPlus className={styles.kioskIcon + " " + styles.magGlassIcon} onClick={() => setShowZoomMenu(!showZoomMenu)} />
                    {user ? (
                        <span className={styles.loggedInUser}>Hi, {user.username}</span>
                    ) : (
                        <FiLogIn className={styles.kioskIcon} onClick={() => setShowLoginPopup(true)} />
                    )}
                    { (showZoomMenu)
                    ? <KioskZoomMenu setShowZoomMenu={setShowZoomMenu} zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
                    : <></> }
                </div>
                <Link to="/kiosk" className={`${styles.headerLink} ${styles.kioskTitleContainer}`}><h1 className={styles.kioskTitle}>Ex-sell-ence</h1></Link>
                <div className={styles.navRight}>
                    <div className={styles.weather}><TiWeatherCloudy className={styles.kioskIcon}/> <span className={styles.weatherText}>{temp}</span></div>
                    <Link to="cart" className={styles.headerLink}>
                        <LuShoppingCart className={styles.kioskIcon}>
                        </LuShoppingCart>
                        { (cartCount > 0)
                        ? <p className={styles.cartNumber}>{cartCount}</p>
                        : <></> }
                    </Link>
                </div>
            </nav>
            {showLoginPopup && <KioskLoginPopup setShowLoginPopup={setShowLoginPopup} setUser={setUser} />}
            <Outlet context={{ user: user }} />
        </CartContext.Provider>
    );
};

// Removed nav spacer code (I feel like it doesn't really matter tbh):
    // {/* navSpacers just exist to balance things out and make sure the title is centered. */}
    // {/* { (outletLocation === "language" || outletLocation === "cart") ? <></> : <div className={styles.navSpacer}></div> } */}