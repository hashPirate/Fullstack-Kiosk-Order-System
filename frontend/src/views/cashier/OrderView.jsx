import { NavLink, Outlet } from "react-router";
import Order from "./Order";
import styles from "./OrderView.module.css";

export default function OrderView({total, setTotal, orders, setOrders, newOrder, setNewOrder}) {

    const example = [
        {
            name: "chicken",
            price: 10.99
        },
        
        {
            name: "beef",
            price:11.99
        }
    ];

    return (
        <>
            <div id={styles.OrderView}>
                <div>
                    <h1 id={styles.orderTitle}>Order</h1>

                    {
                        orders.map((order, i) => 
                            <Order itemName={order.menuName} itemPrice={order.menuPrice} orderParts={order.menuParts} setOrders={setOrders}/>
                        )

                        
                    }

                    {
                        newOrder.menuName != null &&
                        <Order total={total} setTotal={setTotal} itemName={newOrder.menuName} itemPrice={newOrder.menuPrice} orderParts={newOrder.menuParts} setNewOrder={setNewOrder}/>
                    }
                </div>

                <div id={styles.totalAmount}>
                    <p>Total: $</p>
                    <p> {total} </p>
                </div>
            </div>

        </>
    );
};