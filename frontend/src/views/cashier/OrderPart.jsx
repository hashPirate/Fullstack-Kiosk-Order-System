import { NavLink, Outlet } from "react-router";
import { VscChromeClose } from "react-icons/vsc";

import styles from "./OrderPart.module.css";

export default function OrderPart({partName, partPrice}) {
    return (
        <>
            <div className={styles.part}>
                <div>
                    <VscChromeClose />
                    <p className={styles.partName}>{partName}</p>
                </div>
                <p className={styles.partPrice}>${partPrice}</p>
            </div>
        </>
    );
};