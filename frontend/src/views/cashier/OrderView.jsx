import { NavLink, Outlet } from "react-router";
import Order from "./Order";
import styles from "./OrderView.module.css";

export default function OrderView() {

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
                <h1 id={styles.orderTitle}>Order</h1>

                <Order itemName = "Kung Pao Chicken" itemPrice= "5.99" orderParts={example}/>

                {/* <Order itemName = "Chinese Fried Chicken" itemPrice = "6.99"/> */}

                <div id={styles.totalAmount}>
                    <p>Total: $</p>
                    <p> 10.99</p>
                </div>
            </div>

        </>
    );
};