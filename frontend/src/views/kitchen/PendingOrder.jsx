
import PendingOrderItem from "./PendingOrderItem.jsx";
import { IoIosCloseCircleOutline } from "react-icons/io";


import "./PendingOrder.css";

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
        <div className="pendingOrder">
            <div className="orderHeading">
                <h3 className="orderTitle">Order #{orderId}</h3>
                <IoIosCloseCircleOutline className="orderIcon" onClick={() => handleRemoveOrder(orderId)}/>
            </div>
            { menuItems.map((mni, i) => <PendingOrderItem key={i} itemName={mni.itemName} menuParts={mni.menuParts}/>) }
        </div>
    );
}