import { NavLink, Outlet } from "react-router";
import OrderPart from "./OrderPart";
import styles from "./Order.module.css";



export default function Order({total, setTotal, itemName, itemPrice, orderParts, orders, setOrders, newOrder, setNewOrder}) {

    


    return (
        <>  
            <div id={styles.order}>
                <div id={styles.header}>
                    <h1>{ itemName != null && itemName}</h1>
                    <h1>${ itemPrice != null && itemPrice.toFixed(2)} </h1>
                </div>

                <div id={styles.partList}>
                    {
                        orderParts != null && setNewOrder != null &&
                        orderParts.map((orderParts, i) => 
                            <OrderPart total={total} setTotal={setTotal} partName= {orderParts.name} partPrice={orderParts.price.toFixed(2)} newOrder={newOrder} setNewOrder={setNewOrder} xVisable={true}
                            onClick={
                                () => {

                                    setTotal(prevTotal => prevTotal - orderParts.price);

                                    setNewOrder(previousOrder => 
                                    ({
                                        ...previousOrder, 
                                        menuParts: (previousOrder.menuParts.filter((_, j) => j != i))
                                    }));
                                }
                            }
                            />
                        )
                    }

                    {
                        orderParts != null && setOrders != null &&
                        orderParts.map((orderParts, i) => 
                            <OrderPart partName= {orderParts.name} partPrice={orderParts.price.toFixed(2)}/>
                        )
                    }
                </div>
            </div>

        </>
    );
};