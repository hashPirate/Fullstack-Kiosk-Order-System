
import { NavLink, Outlet } from "react-router";
import { TiWeatherCloudy } from "react-icons/ti";
import { LuShoppingCart } from "react-icons/lu";
import { CiGlobe } from "react-icons/ci";
import { IoArrowBack } from "react-icons/io5";

import "./KioskView.css";

export default function KioskView() {
    return (
        <>
            <nav>
                <div id="navLeft">
                    <CiGlobe className="kioskIcon"/>
                </div>
                <h1 id="kioskTitle">Ex-sell-ence</h1>
                <div id="navRight">
                    <div id="weather"><TiWeatherCloudy className="kioskIcon"/> <span id="weatherText">99°</span></div>
                    <LuShoppingCart className="kioskIcon"/>
                </div>
            </nav>
            <Outlet />
        </>
    );
};
