import { NavLink, Outlet } from "react-router";
import { VscChromeClose } from "react-icons/vsc";

import styles from "./OrderPart.module.css";

export default function OrderPart({partName, partPrice}) {
    return (
        <>
            <div id={styles.part}>
                <div>
                    <VscChromeClose />
                    <p id={styles.partName}>{partName}</p>
                </div>
                <p id={styles.partPrice}>${partPrice}</p>
            </div>
        </>
    );
};