import { useContext, useEffect, useState } from "react";
import axios from "axios";

import CartMenuItem from "./CartMenuItem";
import CartMenuPart from "./CartMenuPart";
import styles from "./KioskCart.module.css";
import CartContext from "../CartContext.js";

export default function KioskCart() {
    // Since CartContext only stores IDs, we will need to fetch a list of
    // Menu Items and Menu Parts again so that we can translate item / part
    // IDs into their names and prices.
    const [menuItems, setMenuItems] = useState([]);
    const [menuParts, setMenuParts] = useState([]);
    const [loading, setLoading] = useState(true);

    const cartState = useContext(CartContext);
    const [translatedCartContent, setTranslatedCartContent] = useState([]);

    // Get info for menu item given its ID
    function ItemIdToInfo(itemId) {
        for (const item of menuItems) {
            if (item.menu_item_id === itemId) {
                return item;
            }
        }

        console.log("Could not find a menu item with that ID!");
        return {};
    }

    // Get info for menu part given its ID
    function PartIdToInfo(partId) {
        for (const part of menuParts) {
            if (part.menu_part_id === partId) {
                return part;
            }
        }

        console.log("Could not find a part with that ID!");
        return {};
    }

    function translateCartContent(cartContent) {
        return (
            cartState.cartContent.map((cartItem) => {
                const itemInfo = ItemIdToInfo(cartItem.itemId);
                const parts = cartItem.parts.map( (partId) => {
                    const partInfo = PartIdToInfo(partId);
                    return { name: };
                });
                return { name: itemInfo.item_name, price: itemInfo.price, parts: parts };
            })
        );
    }

    useEffect(() => {
        (async () => {
            // Fetch list of both parts and items for ID conversion
            try {
                const loadedMenuItems = await axios.get("/api/menu/items");
                const loadedMenuParts = await axios.get("/api/menu/parts");
                setMenuItems(loadedMenuItems.data);
                setMenuParts(loadedMenuParts.data);
                setLoading(false);
            } catch (error) {
                console.log("ERROR fetching parts / items for cart:", error);
            }
        })();
    }, []);

    if (loading) {
        return <HashLoader color={"#DC143C"}/>;
    } else {
        return (
            <div className={styles.kioskCart}>
                <h2 className={styles.cartTitle}>Your order:</h2>
                <div className={styles.cartItems}>
                    <CartMenuItem name="my item" price={2}>
                        <CartMenuPart name="my part" price={2}/>
                        <CartMenuPart name="my part" price={2}/>
                        <CartMenuPart name="my part" price={2}/>
                    </CartMenuItem>
                </div>
            </div>
        );
    }
}
