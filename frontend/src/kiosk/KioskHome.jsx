

import { NavLink, Outlet } from "react-router";

export default function KioskHome() {
    return (
        <>
            <p>This is the Kiosk Home.</p>
            <NavLink to="/">Back to Main Page</NavLink>
        </>
    );
};