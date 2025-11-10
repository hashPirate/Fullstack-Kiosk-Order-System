import { NavLink, Outlet } from "react-router";
import OrderPart from "./OrderPart";
import styles from "./Order.module.css";



export default function Order({itemName, itemPrice, orderParts}) {

    // function partsList(parts) {
    //     const items = parts.map((orderParts, i) =>
    //         <OrderPart partName={}
    //     );
    // }

    return (
        <>  
            <div className={styles.order}>
                <div className={styles.header}>
                    <h1>{itemName}</h1>
                    <h1>$ {itemPrice} </h1>
                </div>

                <div className={styles.partList}>
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