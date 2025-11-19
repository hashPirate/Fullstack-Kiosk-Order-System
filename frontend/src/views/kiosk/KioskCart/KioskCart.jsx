import { useContext, useEffect, useState } from "react";
import axios from "axios";
import clsx from "clsx";
import { HashLoader } from "react-spinners";

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
    const [completeDisabled, setCompleteDisabled] = useState(false);
    const [orderCompleted, setOrderCompleted] = useState(false);    // Remember, this function's state will clear when we switch to another screen!

    const cartState = useContext(CartContext);
    const [translatedCartContent, setTranslatedCartContent] = useState([]);

    // Get info for menu item given its ID
    function itemIdToInfo(itemId) {
        for (const item of menuItems) {
            console.log("Item comparison:", item.menu_item_id, itemId);
            if (item.menu_item_id === itemId) {
                return item;
            }
        }

        console.log("Could not find a menu item with that ID!");
        console.log(itemId);
        return {};
    }

    // Get info for menu part given its ID
    function partIdToInfo(partId) {
        for (const part of menuParts) {
            console.log("Item comparison:", part.menu_part_id, partId);
            if (part.menu_part_id === partId) {
                return part;
            }
        }

        console.log("Could not find a part with that ID!");
        return {};
    }

    function translateCartContent(cartContent) {
        return (
            cartContent.map((cartItem) => {
                const itemInfo = itemIdToInfo(cartItem.itemId);
                const parts = cartItem.parts.map( (partId) => {
                    const partInfo = partIdToInfo(partId);
                    return { partId: partInfo.menu_part_id, name: partInfo.part_name, price: partInfo.price };
                });
                return { itemId: cartItem.itemId, name: itemInfo.item_name, price: itemInfo.price, parts: parts };
            })
        );
    }

    // This effect runs whenever menuItems or menuParts changes.
    // You may not know this, but React state does not update immediately
    // after you call a set<StateName>() function. My goal is to get
    // translatedCartContent to update as soon as both menuItems and
    // menuParts are loaded...
    useEffect(() => {
        if (menuItems.length !== 0 && menuParts.length !== 0) {
            console.log(menuItems);   // DEBUG
            setTranslatedCartContent(translateCartContent(cartState.cartContent));    // See appendix for more info on this...
            setLoading(false);
        }
    }, [menuItems, menuParts, cartState.cartContent]);

    // This effect runs once when the program first loads -- it loads the data.
    useEffect(() => {
        (async () => {
            // Fetch list of both parts and items for ID conversion
            try {
                const loadedMenuItems = await axios.get("/api/menu/items");
                const loadedMenuParts = await axios.get("/api/menu/parts");
                setMenuItems(loadedMenuItems.data);
                setMenuParts(loadedMenuParts.data);
                // `loading` unfortunately must be dealt with in the other useEffect 🙃
                // since the screen is officially done loading when the order is
                // "translated" from IDs into meaningful data.
            } catch (error) {
                console.log("ERROR fetching parts / items for cart:", error);
            }
        })();
    }, []);

    // Renders the header text -- which is more complicated than you think!
    function renderOrderHeader() {
        if (orderCompleted) {
            return "Order complete! Thank you for shopping at Panda Express.";
        } else if (cartState.cartContent.length === 0) {
            return "You need to order something first!";
        } else {
            return "Your order:";
        }
    }

    // Renders cart items and parts from translatedCartContent
    function renderCart() {
        return translatedCartContent.map(
            (tcc, i) => {
                return <CartMenuItem key={i} name={tcc.name} price={tcc.price} itemIndex={i} transCartContent={translatedCartContent} setTransCartContent={setTranslatedCartContent}>
                    {
                        tcc.parts.map( (prt, j) => {
                            return <CartMenuPart key={`${i}-${j}`} name={prt.name} price={prt.price} />;
                        })
                    }
                </CartMenuItem>;
            }
        );
    }

    async function confirmOrder() {
        setCompleteDisabled(true);
        
        try {
            // Create empty order
            const orderResp = await axios.post('/api/orders', { });
            const orderId = orderResp.data.order_id;
            console.log("Successfully created order in db.");

            // Add items sequentially
            for (const item of translatedCartContent) {
                const itemResp = await axios.post(`/api/orders/${orderId}/items`, {
                    menu_item_id: item.itemId,
                    quantity: 1
                });
                const orderItemId = itemResp.data.order_item_id;
                console.log("Successfully added item to order in db.");

                // Add parts to orderItem
                for (const part of item.parts) {
                    await axios.post(`/api/orders/items/${orderItemId}/parts`, {
                        menu_part_id: part.partId
                    });
                    console.log("Successfully added part to order item in db.");
                }
            }

            const finalizeOrder = await axios.put(`/api/orders/${orderId}/finalize`, { });
            if (finalizeOrder.data.success !== true) {
                throw new Error("ERROR: order finalization in db failed.");
            }

            console.log("Order completed successfully!");
            setOrderCompleted(true);    // Set this so that header shows visual feedback.
            cartState.setCartContent([]);    // This should update the order screen, right?
        } catch (error) {
            console.log("ERROR while completing order:", error);
        } finally {
            setCompleteDisabled(false);
        }
    }

    // This is the return for component function.
    if (loading) {
        return <HashLoader color={"#DC143C"}/>;
    } else {
        return (
            <div className={styles.kioskCart}>
                <h2 className={styles.cartTitle}>{renderOrderHeader()}</h2>
                <div className={styles.cartItems}>
                    { renderCart() }
                </div>
                {/* Only load the button if there are things in the cart. */}
                <div className={styles.completeOrderContainer}>
                { (cartState.cartContent.length === 0) ? <></> : <button className={clsx(styles.completeOrderButton, completeDisabled && styles.buttonDisabled)}
                                                                    disabled={completeDisabled}
                                                                    onClick={confirmOrder}>{ completeDisabled ? "Processing..." : "Complete Order" }</button>}
                </div>
            </div>
        );
    }
}


// APPENDIX:

// translateCartContent():
    // This function will translate cart content from pure IDs, e.g.
        // [
        //     { itemID: 4, parts: [2, 5] },
        //     ...
        // ]
    // To a structure with more info, e.g.
        // [
        //     {
        //         itemId: 4,
        //         name: "Item Name",
        //         price: 9.99,
        //         parts: [
        //             { partId: 2, name: "Part Name", price: 9.99}
        //         ]
        //     },
        //     ...
        // ]


