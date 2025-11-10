import { NavLink, Outlet } from "react-router";

import styles from "./KioskHome.module.css";
import "./KioskMenuItem.jsx";
import KioskMenuItem from "./KioskMenuItem.jsx";

export default function KioskHome() {
    return (
        <>
            <div className={styles.kioskMenuItemsContainer}>
                {/* Remember: files in `public` are served as though they are in the project root. */}
                <KioskMenuItem img="/menu_item_images/bowl.png" name="Bowl" price="$5.00" linkto="build_bowl"/>
                <KioskMenuItem img="/menu_item_images/plate.jpg" name="Plate" price="$6.00" linkto="build_plate"/>
                <KioskMenuItem img="/menu_item_images/bigplate.png" name="Big Plate" price="$7.00" linkto="build_big_plate"/>
                <KioskMenuItem img="/menu_item_images/drink.png" name="Drink" price="$1.00" linkto="build_drink"/>
            </div>
        </>
    );
};