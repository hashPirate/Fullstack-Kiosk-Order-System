
import { NavLink, Outlet } from "react-router";
import LoremIpsum from '../../utilities/LoremIpsum.jsx';

export default function KitchenHome() {
    return (
        <>
            <p>This is the Kitchen Home.</p>
            <LoremIpsum p={4} />
            <NavLink to="/">Back to Main Page</NavLink>
        </>
    );
};