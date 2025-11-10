
import { NavLink } from "react-router";
import "./ManagerHome.css";

export default function ManagerHome() {
    return (
        <>
            <div id="managerTabs">
                <NavLink to="/manager/servers" className={({isActive}) => `managerTab ${isActive ? 'active' : ''}`}>
                    Servers
                </NavLink>
                <NavLink to="/manager/inventory" className={({isActive}) => `managerTab ${isActive ? 'active' : ''}`}>
                    Inventory
                </NavLink>
                <NavLink to="/manager/reports" className={({isActive}) => `managerTab ${isActive ? 'active' : ''}`}>
                    Reports
                </NavLink>
                <NavLink to="/manager/menu-parts" className={({isActive}) => `managerTab ${isActive ? 'active' : ''}`}>
                    Menu Parts
                </NavLink>
                <NavLink to="/manager/menu-items" className={({isActive}) => `managerTab ${isActive ? 'active' : ''}`}>
                    Menu Items
                </NavLink>
                <NavLink to="/manager/sales-report" className={({isActive}) => `managerTab ${isActive ? 'active' : ''}`}>
                    Sales Report
                </NavLink>
            </div>
        </>
    );
};