import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import OrderView from './OrderView/OrderView.jsx';
import styles from "./CashierView.module.css";
import CashierHeader from './CashierHeader.jsx';
import ProgressBar from './OrderProgression.jsx';
import OrderProgression from './OrderProgression.jsx';
import OrderContext from '../OrderContext.jsx';
import { useState } from 'react';

export default function CashierView() {
    // Order content is a list of menu item objects
    // Menu item object will look as follows:
        // {
        //     itemId: 5,     // The ID from the database
        //     itemName: "Example Item",
        //     itemPrice: 9.99,
        //     parts: [
        //         ...
        //     ]
        // }
    // orderContent[i].parts will be of the following form:
        // {
        //     partId: 5,      // The ID from the database
        //     partName: "Example Menu Part",
        //     partPrice: 9.99
        // }
    const [orderContent, setOrderContent] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    
    function addMenuItem(menuItemId, menuItemName, menuItemPrice) {
        setOrderContent([ ...orderContent, {itemId: menuItemId, itemName: menuItemName, itemPrice: menuItemPrice, parts: []} ]);
    }

    function removeMenuItem(removeItemIndex) {
        setOrderContent(orderContent.slice(0, removeItemIndex).concat(orderContent.slice(removeItemIndex + 1, orderContent.length)));
    }

    function addMenuPart(itemIndex, menuPartId, menuPartName, menuPartPrice) {
        const newOrderContent = orderContent.map((item, i) => {
            if (i === itemIndex) {
                return {
                    ...item,
                    parts: [...item.parts, {partId: menuPartId, partName: menuPartName, partPrice: menuPartPrice}]
                };
            }
            return item;
        })
        setOrderContent(newOrderContent);
    }

    function removeMenuPart(itemIndex, removePartIndex) {
        const newOrderContent = orderContent.map((item, i) => {
            if (i === itemIndex) {
                return {
                    ...item,
                    parts: item.parts.slice(0, removePartIndex).concat(item.parts.slice(removePartIndex + 1))
                };
            }
            return item;
        });
        setOrderContent(newOrderContent);
    }

    const orderContextVal = {
        orderContent,
        isProcessing,
        setIsProcessing,
        setOrderContent,
        addMenuItem,
        removeMenuItem,
        addMenuPart,
        removeMenuPart,
    };

    return (
    <OrderContext.Provider value={orderContextVal}>
        <CashierHeader />
        <div className={styles.splitView}>
            <div className={styles.orderPane}>
                <OrderView />
            </div>
            <div className={styles.menuPane}>
                {/* Outlet the selection screens here. */}
                <OrderProgression />
                <Outlet />
            </div>
        </div>
    </OrderContext.Provider>
    );
}

