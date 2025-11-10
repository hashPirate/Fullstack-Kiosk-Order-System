
import { Link, Outlet } from "react-router";
import SelectableMenuParts from "./SelectableMenuParts";
import styles from "./CashierHome.module.css";

export default function CashierHome() {

    const biggerPlate = {
        color: "#44AA99",
        img: "/menu_part_images/beijing-beef.jpg",
        name: "Bigger Plate",
        price: 5.00
    }

    const plate = {
        color: "#DDCC77",
        img: "/menu_part_images/beijing-beef.jpg",
        name: "Plate",
        price: 5.00
    }
    const bowl = {
        color: "#88CCEE",
        img: "/menu_part_images/beijing-beef.jpg",
        name: "Bowl",
        price: 5.00
    }

    return (
        <>
            <div id={styles.wideDiv}>
                <SelectableMenuParts order={bowl} />
                <div>
                    <SelectableMenuParts order={biggerPlate}/>
                    <SelectableMenuParts order={plate}/>
                </div>
            </div> 
        </>
    );
};
