
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { TiWeatherCloudy } from "react-icons/ti";
import { LuShoppingCart } from "react-icons/lu";
import { CiGlobe } from "react-icons/ci";
import { useEffect, useState } from "react";
import { fetchWeatherApi } from 'openmeteo';

import "./ManagerView.css";

const langIcons = {
    "English": "🇬🇧",
    "Spanish": "🇪🇸",
};

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
            <nav>
                <div id="navLeft">
                    <CiGlobe className="managerIcon"/>
                    <span id="langDisplay">{langIcons[lang]}</span>
                </div>
                <Link to="/manager" className="headerLink"><h1 id="managerTitle">Ex-sell-ence</h1></Link>
                <div id="navRight">
                    <div id="weather"><TiWeatherCloudy className="managerIcon"/> <span id="weatherText">{temp}</span></div>
                    <LuShoppingCart className="managerIcon"/>
                </div>
            </nav>
            <div id="managerTabs">
                <NavLink to="/manager/servers" className={({isActive}) => `managerTab ${isActive || location.pathname === '/manager' ? 'active' : ''}`}>
                    servers
                </NavLink>
                <NavLink to="/manager/inventory" className={({isActive}) => `managerTab ${isActive ? 'active' : ''}`}>
                    inventory
                </NavLink>
                <NavLink to="/manager/reports" className={({isActive}) => `managerTab ${isActive ? 'active' : ''}`}>
                    reports
                </NavLink>
                <NavLink to="/manager/menu-parts" className={({isActive}) => `managerTab ${isActive ? 'active' : ''}`}>
                    menu-parts
                </NavLink>
                <NavLink to="/manager/menu-items" className={({isActive}) => `managerTab ${isActive ? 'active' : ''}`}>
                    menu-items
                </NavLink>
                <NavLink to="/manager/sales-report" className={({isActive}) => `managerTab ${isActive ? 'active' : ''}`}>
                    sales-report
                </NavLink>
            </div>
            <Outlet context={{lang, setLang}} />
        </>
    );
};
