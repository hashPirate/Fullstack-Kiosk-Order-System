
import { Link, Outlet, useOutletContext } from "react-router";
import SelectableMenuParts from "./SelectableMenuParts";
import styles from "./CashierHome.module.css";

export default function CashierHome({}) {

    const biggerPlate = {
        color: "#44AA99",
        img: "/menu_part_images/beijing-beef.jpg",
        name: "Bigger Plate",
        price: 5.00,
        linkto: "cashier_menu_parts"
    }

    const plate = {
        color: "#DDCC77",
        img: "/menu_part_images/beijing-beef.jpg",
        name: "Plate",
        price: 5.00,
        linkto: "cashier_menu_parts"
    }
    const bowl = {
        color: "#88CCEE",
        img: "/menu_part_images/beijing-beef.jpg",
        name: "Bowl",
        price: 5.00,
        linkto: "cashier_menu_parts"
    }

    const [total, setTotal, lang, progress, setProgress, orders, setOrders, newOrder, setNewOrder] = useOutletContext(); 

    return (
        <>
            <div id={styles.wideDiv}>
                <SelectableMenuParts order={bowl} onClick={
                    () => 
                        {
                            
                            setNewOrder({menuName: "Bowl", menuPrice: 10.99, menuParts: []})
                            setTotal(prevTotal => (prevTotal + 10.99))
                        }
                    } 
                setNewOrder={setNewOrder} />
                <div>
                    <SelectableMenuParts order={biggerPlate} onClick={
                    () => 
                        {
                            
                            setNewOrder({menuName: "Bigger Plate", menuPrice: 10.99, menuParts: []})
                            setTotal(prevTotal => (prevTotal + 10.99))
                        }
                }setNewOrder={setNewOrder}/>
                    <SelectableMenuParts order={plate} onClick={
                    () => 
                        {
                            
                            setNewOrder({menuName: "Plate", menuPrice: 10.99, menuParts: []})
                            setTotal(prevTotal => (prevTotal + 10.99))
                        }
                }setNewOrder={setNewOrder}/>
                </div>
            </div> 
        </>
    );
};
