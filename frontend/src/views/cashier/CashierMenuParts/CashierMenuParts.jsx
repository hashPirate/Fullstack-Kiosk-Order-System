import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import axios from 'axios';
import clsx from "clsx";

import styles from "./CashierMenuParts.module.css";
import gridStyles from "../MenuGridStyles.module.css";
import MenuPart from "./MenuPart.jsx";
import pastelColors from "../pastelColors.js";
/**
 * @module views/cashier/CashierMenuParts/CashierMenuParts
 */
/**
 * Component responsible for displaying all available menu parts
 * associated with a selected menu item.
 * @function CashierMenuParts
 * @description
 * - Fetches menu parts using the `menuItemID` query parameter.
 * - Displays a loading spinner until data is retrieved.
 * - Renders each part using the <MenuPart /> component.
 * - Applies looping pastel background colors to each part.
 *
 * Fetches from:
 *   GET /api/menu/items/{menuItemID}/parts
 * @returns {React.ReactElement} A container that displays menu parts or a loader.
 */

export default function CashierMenuParts() {
    const [parts, setParts] = useState([]);
    const [partsLoaded, setPartsLoaded] = useState(false);

    useEffect(() => {
        const menuItemID = new URLSearchParams(window.location.search).get("menuItemID");
        
        axios.get("/api/menu/items/" + menuItemID + "/parts")
        .then(response => {
            setParts(response.data);
            setPartsLoaded(true);
        })
        .catch(error => {
            console.log("ERROR while fetching menu parts:", error);
        });
    }, []);
    /**
     * Renders the list of menu parts once they have been loaded.
     * If parts are not yet loaded, a HashLoader spinner is displayed.
     * @returns {React.ReactElement|React.ReactElement[]} List of {@link MenuPart} components or a loader.
     */
    function renderParts() {
        if (partsLoaded) {
            // Render list of items with looping pastel colors
            return parts.map((prt, i) => <MenuPart key={i} style={{backgroundColor: pastelColors[i % pastelColors.length]}} id={prt.menu_part_id} name={prt.part_name} price={prt.price} />);
        } else {
            return <HashLoader color={"#DC143C"}/>;
        }
    };

    
    function setPartSelected(id) {}

    return (
        // Let's just say it's not a grid container if the grid items haven't loaded yet...
        <div className={clsx(partsLoaded && gridStyles.menuGridContainer, !partsLoaded && styles.loadingContainer)}>
            { renderParts() }
        </div>
    );
}
