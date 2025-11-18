import { NavLink, Outlet } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";

import styles from "./KioskHome.module.css";
import "./KioskMenuItem.jsx";
import KioskMenuItem from "./KioskMenuItem.jsx";
import CartContext from "./CartContext.js";

export default function KioskHome() {
    const [loading, setLoading] = useState(true);
    const [menuItems, setMenuItems] = useState([]);
    
    useEffect(() => {
        (async () => {
            try {
                const loadedMenuItems = await axios.get("/api/menu/items");
                // Load all menu items with non-zero part counts that are for sale.
                setMenuItems(loadedMenuItems.data.filter(itm => (itm.part_count !== 0 && itm.for_sale === true)));
                setLoading(false);
            } catch (error) {
                console.log("ERROR while fetching menu items:", error);
            }
        })();
    }, []);

    function renderKioskItems() {
        if (loading) {
            return <HashLoader color={"#DC143C"}/>;
        } else {
            return (
                menuItems.map(
                    (itm, i) => <KioskMenuItem key={i} img="/menu_item_images/bowl.png" name={itm.item_name} price={itm.price} itemId={itm.menu_item_id} partCount={itm.part_count}/>
                )
            );
        }
    }

    return (
        <>
            <div className={styles.kioskMenuItemsContainer}>
                {/* Remember: files in `public` are served as though they are in the project root. */}
                {renderKioskItems()}
            </div>
        </>
    );
};