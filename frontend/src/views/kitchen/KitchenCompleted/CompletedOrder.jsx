
import CompletedOrderItem from "./CompletedOrderItem.jsx";
import { LuUndo2 } from "react-icons/lu";

import styles from "./CompletedOrder.module.css";
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


export default function PendingOrder({orderId, completionTime, menuItems, handleReviveOrder}) {

    return (
        <div className={styles.completedOrder}>
            <div className={styles.orderHeading}>
                <h3 className={styles.orderTitle}>Order #{orderId} &nbsp; (Completed {timeAgo(completionTime)})</h3>
                <LuUndo2 className={styles.orderIcon} onClick={() => handleReviveOrder(orderId)}/>
            </div>
            { menuItems.map((mni, i) => <CompletedOrderItem key={i} itemName={mni.item_name} menuParts={mni.menu_parts}/>) }
        </div>
    );
}