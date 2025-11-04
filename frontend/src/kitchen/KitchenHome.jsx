
import { NavLink, Outlet } from "react-router";

export default function KitchenHome() {
    return (
        <>
            <p>This is the Kitchen Home.</p>
            <NavLink to="/">Back to Main Page</NavLink>
        </>
    );
};