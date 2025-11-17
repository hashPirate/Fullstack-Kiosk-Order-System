import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import axios from 'axios';
import clsx from "clsx";

import styles from "./CashierMenuParts.module.css";
import gridStyles from "../MenuGridStyles.module.css";
import MenuPart from "./MenuPart.jsx";
import pastelColors from "../pastelColors.js";

export default function CashierMenuParts() {
    const [parts, setParts] = useState([]);
    const [partsLoaded, setPartsLoaded] = useState(false);

    useEffect(() => {
        const menuItemID = new URLSearchParams(window.location.search).get("menuItemID");
        
        axios.get("/api/menu/items/" + menuItemID + "/parts")
        .then(response => {
            console.log(response.data);
            setParts(response.data);
            setPartsLoaded(true);
        })
        .catch(error => {
            console.log("ERROR while fetching menu parts:", error);
        });
    }, []);

    function renderParts() {
        if (partsLoaded) {
            // Render list of items with looping pastel colors
            return parts.map((prt, i) => <MenuPart key={i} style={{backgroundColor: pastelColors[i % pastelColors.length]}} id={prt.menu_part_id} name={prt.part_name} price={prt.price} />);
        } else {
            return <HashLoader color={"#1FD5D4"}/>;
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
