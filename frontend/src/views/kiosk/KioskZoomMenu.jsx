import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";

import styles from "./KioskZoomMenu.module.css";

export default function KioskZoomMenu({ setShowZoomMenu, zoomLevel, setZoomLevel }) {

    return (
        <>
            <div className={styles.kioskZoomMenuContainer}>
                <div className={styles.kioskZoomMenu}>
                    <p className={styles.prompt}>Zoom In/Out</p>
                    <div className={styles.iconsContainer}>
                        <FaMinus className={styles.icon} color="black" onClick={() => setZoomLevel(z => z - 10)}/>
                        <p className={styles.prompt}>{zoomLevel}%</p>
                        <FaPlus className={styles.icon} color={"black"} onClick={() => setZoomLevel(z => z + 10)}/>
                    </div>
                </div>
            </div>
            {/* Clickout pane allows you to easily exit the zoom menu. */}
            <div className={styles.clickoutPane} onClick={() => setShowZoomMenu(false)}/>
        </>
    );
}
