import { NavLink, Outlet } from "react-router";
import OrderPart from "./OrderPart";
import "./Order.css";



export default function Order({itemName, itemPrice, orderParts}) {

    // function partsList(parts) {
    //     const items = parts.map((orderParts, i) =>
    //         <OrderPart partName={}
    //     );
    // }

    return (
        <>  
            <div id="order">
                <div id="header">
                    <h1>{itemName}</h1>
                    <h1>$ {itemPrice} </h1>
                </div>

                <div id="partList">
                    {
                        orderParts.map((orderParts, i) => 
                            <OrderPart partName= {orderParts.name} partPrice={orderParts.price}/>
                        )
                    }
                </div>
            </div>

        </>
    );
};