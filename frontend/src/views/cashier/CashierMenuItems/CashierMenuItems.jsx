import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import axios from 'axios';
import clsx from "clsx";

import styles from "./CashierMenuItems.module.css";
import gridStyles from "../MenuGridStyles.module.css";
import MenuItem from "./MenuItem.jsx";
import pastelColors from "../pastelColors.js";
/**
 * Component responsible for displaying all available menu items.
 *
 * @component
 *
 * @description
 * - Fetches menu items from `/api/menu/items`
 * - Displays a loading spinner until items finish loading
 * - Renders each item with a looping pastel background color
 * - Uses <MenuItem /> for individual item rendering
 *
 * @returns {JSX.Element} A dynamic grid containing menu items or a loading indicator.
 */
export default function CashierMenuItems() {
    const [items, setItems] = useState([]);
    const [itemsLoaded, setItemsLoaded] = useState(false);

    useEffect(() => {
        axios.get("/api/menu/items")
        .then(response => {
            setItems(response.data);
            setItemsLoaded(true);
        })
        .catch(error => {
            console.log("ERROR while fetching menu items:", error);
        });
    }, []);
    /**
     * Renders the list of menu items once they have been fetched.
     * Until items load, displays a HashLoader spinner.
     *
     * @returns {JSX.Element|JSX.Element[]} A list of <MenuItem /> components or a loader.
     */
    function renderItems() {
        if (itemsLoaded) {
            // Render list of items with looping pastel colors
            return items.map((itm, i) => <MenuItem key={i} style={{backgroundColor: pastelColors[i % pastelColors.length]}} id={itm.menu_item_id} name={itm.item_name} price={itm.price} />);
        } else {
            return <HashLoader color={"#DC143C"}/>;
        }
    };

    return (
        // Let's just say it's not a grid container if the grid items haven't loaded yet...
        <div className={clsx(itemsLoaded && gridStyles.menuGridContainer, !itemsLoaded && styles.loadingContainer)}>
            { renderItems() }
        </div>
    );
}
