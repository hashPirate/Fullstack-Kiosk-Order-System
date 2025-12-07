
import CompletedOrderItem from "./CompletedOrderItem.jsx";
import { LuUndo2 } from "react-icons/lu";


import styles from "./CompletedOrder.module.css";

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
    const prettyCompletionTime = completionTime 
    ?   (
            completionTime.slice(0, completionTime.indexOf("T"))
            + " "
            + completionTime.slice(completionTime.indexOf("T") + 1, completionTime.lastIndexOf(":"))
        ).replaceAll("-", "/")
    :   "???";

    return (
        <div className={styles.completedOrder}>
            <div className={styles.orderHeading}>
                <h3 className={styles.orderTitle}>Order #{orderId} &nbsp; [Completed at {prettyCompletionTime}]</h3>
                <LuUndo2 className={styles.orderIcon} onClick={() => handleReviveOrder(orderId)}/>
            </div>
            { menuItems.map((mni, i) => <CompletedOrderItem key={i} itemName={mni.item_name} menuParts={mni.menu_parts}/>) }
        </div>
    );
}