
import PendingOrderItem from "./PendingOrderItem.jsx";
import { IoIosCloseCircleOutline } from "react-icons/io";


import styles from "./PendingOrder.module.css";

// menuItems example:
// [
//     {
//         itemName: "Bowl",
//         menuparts: [
//             "chow mein",
//             "kung pao chicken",
//         ]
//     },
//     {
//         itemname: "plate",
//         menuparts: [
//             "chow mein",
//             "kung pao chicken",
//             "kung pao chicken"
//         ]
//     },
//     {
//         itemname: "drink",
//         menuparts: [
//             "Dr. Pepper",
//         ]
//     },
//     ...
// ]


export default function PendingOrder({orderId, menuItems, handleRemoveOrder}) {

    return (
        <div className={styles.pendingOrder}>
            <div className={styles.orderHeading}>
                <h3 className={styles.orderTitle}>Order #{orderId}</h3>
                <IoIosCloseCircleOutline className={styles.orderIcon} onClick={() => handleRemoveOrder(orderId)}/>
            </div>
            { menuItems.map((mni, i) => <PendingOrderItem key={i} itemName={mni.itemName} menuParts={mni.menuParts}/>) }
        </div>
    );
}