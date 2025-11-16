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
        axios.get("http://localhost:3000/api/menu/parts")
        .then(response => {
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
            return parts.map((prt, i) => <MenuPart key={i} style={{backgroundColor: pastelColors[i % pastelColors.length]}} name={prt.part_name} id={prt.menu_part_id} />);
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
