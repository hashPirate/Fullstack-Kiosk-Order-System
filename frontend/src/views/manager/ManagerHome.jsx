
import { NavLink, Outlet } from "react-router";

export default function ManagerHome() {
    return (
        <>
            <p>This is the Manager Home.</p>
            <NavLink to="/">Back to Main Page</NavLink>
        </>
    );
};