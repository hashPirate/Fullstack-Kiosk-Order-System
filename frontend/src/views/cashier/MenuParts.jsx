import { Link, Outlet, useOutletContext } from "react-router";
import styles from "./MenuParts.module.css";
import { SlArrowLeft } from "react-icons/sl";
import SelectableMenuParts from "./SelectableMenuParts";

export default function MenuParts() {

    const ingredientList = [
        {
            color: "#332288", 
            img: "/menu_part_images/beijing-beef.jpg",
            name: "Rice Item", 
            price: 1.00
        },
        {
            color: "#117733", 
            img: "/menu_part_images/beijing-beef.jpg",
            name: "Chicken Item", 
            price: 2.00
        }, 

        {    color: "#44AA99", 
            img: "/menu_part_images/beijing-beef.jpg",
            name: "Beef Item", 
            price: 3.00
        }, 

        {    color: "#88CCEE", 
            img: "/menu_part_images/beijing-beef.jpg",
            name: "Other Item", 
            price: 4.00
        }, 

        {    color: "#DDCC77", 
            img: "/menu_part_images/beijing-beef.jpg",
            name: "Menu Item", 
            price: 5.00
        }
    ]

    const [total, setTotal, lang, progress, setProgress, orders, setOrders, newOrder, setNewOrder] = useOutletContext(); 


    return (
        <>
            <div id={styles.wideDiv}>
                <div id={styles.exitArrow}>
                    <Link to={"/cashier"} onClick={
                        () => {

                            let menuPartsTotal = 0;
                            for (i in newOrder.menuParts) {
                                menuPartsTotal += i.price;
                            }
                            setTotal(prevTotal => (prevTotal - newOrder.menuPrice - menuPartsTotal));
                            setNewOrder({});
                        }
                    }>
                        <SlArrowLeft />
                    </Link>

                </div>
                    

                <div id="container">
                    <div id={styles.ingredients}>
                        {
                            ingredientList.map((ingre, i) =>
                                <SelectableMenuParts order={ingre} onClick={
                                    () => {

                                        setTotal(prevTotal => (prevTotal + ingre.price));
                                        
                                        setNewOrder(previousState => 
                                        ({
                                            ...previousState,
                                            menuParts: [
                                                ...(previousState?.menuParts ?? []),
                                                {name: ingre.name, price: ingre.price}

                                            ]
                                        }));
                                    }
                                } setNewOrder={setNewOrder} />
                            )
                        }
                    </div>
                    
                    <Link to={"/cashier/cashier_drinks"}>
                        <div id={styles.next}>
                            <p> Next </p>
                        </div>
                    </Link>
                </div>

            </div> 
        </>
    );
};