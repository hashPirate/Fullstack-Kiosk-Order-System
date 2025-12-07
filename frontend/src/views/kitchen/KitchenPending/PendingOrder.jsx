
import PendingOrderItem from "./PendingOrderItem.jsx";
import { FaRegSquareCheck } from "react-icons/fa6";

import styles from "./PendingOrder.module.css";
import timeAgo from "../../../utilities/timeAgo.js";

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


export default function PendingOrder({orderId, creationTime, menuItems, handleCompleteOrder}) {

    return (
        <div className={styles.pendingOrder}>
            <div className={styles.orderHeading}>
                <h3 className={styles.orderTitle}>Order #{orderId} &nbsp; (Created {timeAgo(creationTime)})</h3>
                <FaRegSquareCheck className={styles.orderIcon} onClick={() => handleCompleteOrder(orderId)}/>
            </div>
            { menuItems.map((mni, i) => <PendingOrderItem key={i} itemName={mni.item_name} menuParts={mni.menu_parts}/>) }
        </div>
    );
}