
import "./PendingOrder.css";

export default function PendingOrderItem({itemName, menuParts}) {
    return (
        <div className="pendingOrderItem">
            <h3 className="itemName">{itemName}</h3>
            { menuParts.map((prt,i) => <p key={i} className="menuPart">{prt}</p>) }
        </div>
    );
}