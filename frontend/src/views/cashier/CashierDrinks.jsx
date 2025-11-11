import { Link, Outlet, useOutletContext } from "react-router";
import styles from "./CashierDrinks.module.css";
import { SlArrowLeft } from "react-icons/sl";
import SelectableMenuParts from "./SelectableMenuParts";

export default function CashierDrinks() {

    const ingredientList = [
        {
            color: "#332288",
            img: "/menu_item_images/drink.png",
            name: "Drinks 1",
            price: 0.00
        },
        {
            color: "#117733",
            img: "/menu_item_images/drink.png",
            name: "Drinks 2",
            price: 0.00
        },

        {
            color: "#44AA99",
            img: "/menu_item_images/drink.png",
            name: "Drinks 3",
            price: 0.00
        },

        {
            color: "#88CCEE",
            img: "/menu_item_images/drink.png",
            name: "Drinks 4",
            price: 0.00
        },

        {
            color: "#DDCC77",
            img: "/menu_item_images/drink.png",
            name: "Drinks 5",
            price: 0.00
        }
    ]
    
    const [total, setTotal, lang, progress, setProgress, orders, setOrders, newOrder, setNewOrder] = useOutletContext(); 


    return (
        <>
            <div id={styles.wideDiv}>
                <div id={styles.exitArrow}>
                    <Link to={"/cashier/cashier_menu_parts"}>
                        <SlArrowLeft />
                    </Link>

                </div>


                <div id="container">
                    <div id={styles.ingredients}>
                        {
                            ingredientList.map((ingre, i) =>
                                <SelectableMenuParts order={ingre} onClick={
                                    () => {


                                        setNewOrder(previousState =>
                                        ({
                                            ...previousState,
                                            menuParts: [
                                                ...(previousState?.menuParts ?? []),
                                                { name: ingre.name, price: ingre.price }

                                            ]
                                        }));
                                    }
                                } setNewOrder={setNewOrder} />
                            )
                        }
                    </div>

                    <Link to="/cashier" onClick={
                        () => {

                            setOrders(previousState => 
                            (   
                                [
                                    ...previousState, 
                                    newOrder
                                ]
                            ));

                            setNewOrder({});
                        }
                    }>
                        <div id={styles.next}>
                            <p> Next </p>
                        </div>
                    </Link>
                </div>

            </div>
        </>
    );
};