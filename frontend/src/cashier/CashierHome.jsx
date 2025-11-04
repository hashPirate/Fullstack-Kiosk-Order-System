
import { NavLink, Outlet } from "react-router";

export default function CashierHome() {
    return (
        <>
            <p>This is the Cashier Home.</p>
            <NavLink to="/">Back to Main Page</NavLink>
        </>
    );
};
