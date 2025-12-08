/**
 * @module Kiosk/KioskHome
 */
import { useOutletContext, useNavigate } from "react-router";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { initGoogleTranslate, changeLanguage } from './languages.js';
import { HashLoader } from "react-spinners";

import styles from "./KioskHome.module.css";
import "./KioskMenuItem.jsx";
import KioskMenuItem from "./KioskMenuItem.jsx";
import CartContext from "./CartContext.js";

/**
 * @function PastOrdersCarousel
 * @description Displays a carousel of a signed-in user's previous orders with quick re-order buttons.
 * @param {object} props - The component's props.
 * @param {object|null} props.user - The authenticated kiosk user object.
 * @returns {React.ReactElement|null} Carousel UI if past orders exist, otherwise null.
 */
function PastOrdersCarousel({ user }) {
    const { addCompletedItem } = useContext(CartContext);
    const [pastOrders, setPastOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            axios.get('/api/orders/my-orders')
                .then(response => {
                    const sortedOrders = response.data
                        .filter(order => order.order_items && order.order_items.length > 0)
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    setPastOrders(sortedOrders);
                })
                .catch(error => console.error("Error fetching past orders:", error));
        }
    }, [user]);

    const handleReorder = (order) => {
        order.order_items.forEach(item => {
            const partIds = item.menu_parts ? item.menu_parts.map(part => part.menu_part_id) : [];
            addCompletedItem(item.menu_item_id, partIds);
        });
        
        navigate("/kiosk/cart");
    };

    if (!user || pastOrders.length === 0) return null;

    return (
        <div className={styles.carouselContainer}>
            <h2 className={styles.selectionPrompt}>Your order history</h2>
            <div className={styles.carousel}>
                {pastOrders.map((order, index) => (
                    <div key={index} className={styles.carouselItem}>
                        <h4>Order from {new Date(order.created_at).toLocaleDateString()}</h4>
                        <ul className={styles.orderItemList}>
                            {order.order_items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                    {item.quantity}x {item.menu_item.item_name}
                                    {item.menu_parts && item.menu_parts.length > 0 && (
                                        <ul className={styles.menuPartList}>{item.menu_parts.map(part => <li key={part.menu_part_id}>{part.part_name}</li>)}</ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <button className={styles.reorderButton} onClick={() => handleReorder(order)}>Re-order</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * @function KioskHome
 * @description Landing view for kiosk ordering that lists available menu items and past orders.
 * @returns {React.ReactElement} Kiosk home page content for selecting an item.
 */
export default function KioskHome() {
    const [loading, setLoading] = useState(true);
    const [menuItems, setMenuItems] = useState([]);
    const { user } = useOutletContext();
    
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

        // Initialize Google Translate when needed.
        if (!window.googleTranslateElement && user?.language && user.language !== 'en') {
            initGoogleTranslate('google_translate_element');
            changeLanguage(user.language).catch(error => {
                console.error("Failed to set user's preferred language:", error);
            });
        }
    }, [user]);

    function renderKioskItems() {
        if (loading) {
            return <HashLoader color={"#DC143C"} cssOverride={{"display": "block", "margin": "4rem auto"}} aria-label="Loading kiosk items..." />;
        } else {
            return (
                menuItems.map(
                    (itm, i) => <KioskMenuItem key={i} img={"/api/images/" + itm.image_name} name={itm.item_name} price={itm.price} itemId={itm.menu_item_id} partCount={itm.part_count}/>
                )
            );
        }
    }

    return (
        <>
            {/* This div is still required for the Google Translate widget to initialize, but we hide it. */}
            <div id='google_translate_element' style={{display: 'none'}}></div>

            <h2 className={styles.selectionPrompt}>Please select a menu item.</h2>
            <div className={styles.kioskMenuItemsContainer}>
                {/* Remember: files in `public` are served as though they are in the project root. */}
                {renderKioskItems()}
            </div>
            <PastOrdersCarousel user={user} />
        </>
    );
};
