import { CiGlobe } from "react-icons/ci";
import { IoArrowBack } from "react-icons/io5";
import { NavLink, Outlet } from "react-router";

import "./KitchenView.css";

export default function KitchenView() {
    return (
        <>
            <nav>
                <div id="navLeft">
                    <IoArrowBack className="navIcon" />
                </div>
                <h2 id="kitchenNavTitle">Pending Orders</h2>
                <div id="navRight">
                    {/* Nothing here yet... I'm going to leave a spacer until some other icon replaces it. */}
                    <div class="navSpacer"/>
                </div>
            </nav>
            <Outlet />
        </>
    );
};
