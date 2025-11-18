import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import axios from 'axios';
import clsx from "clsx";

import styles from "./CashierMenuItems.module.css";
import gridStyles from "../MenuGridStyles.module.css";
import MenuItem from "./MenuItem.jsx";
import pastelColors from "../pastelColors.js";

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

    function renderItems() {
        if (itemsLoaded) {
            // Render list of items with looping pastel colors
            return items.map((itm, i) => <MenuItem key={i} style={{backgroundColor: pastelColors[i % pastelColors.length]}} id={itm.menu_item_id} name={itm.item_name} price={itm.price} />);
        } else {
            return <HashLoader color={"#1FD5D4"}/>;
        }
    };

    return (
        // Let's just say it's not a grid container if the grid items haven't loaded yet...
        <div className={clsx(itemsLoaded && gridStyles.menuGridContainer, !itemsLoaded && styles.loadingContainer)}>
            { renderItems() }
        </div>
    );
}
