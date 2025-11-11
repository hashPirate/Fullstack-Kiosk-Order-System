import { Link, Outlet } from "react-router";
import styles from "./MenuParts.module.css";
import { SlArrowLeft } from "react-icons/sl";
import SelectableMenuParts from "./SelectableMenuParts";

export default function MenuParts() {

    const ingredientList = [
        {
            color: "#332288", 
            img: "/menu_part_images/beijing-beef.jpg",
            name: "Menu Item", 
            price: 0.00
        },
        {
            color: "#117733", 
            img: "/menu_part_images/beijing-beef.jpg",
            name: "Menu Item", 
            price: 0.00
        }, 

        {    color: "#44AA99", 
            img: "/menu_part_images/beijing-beef.jpg",
            name: "Menu Item", 
            price: 0.00
        }, 

        {    color: "#88CCEE", 
            img: "/menu_part_images/beijing-beef.jpg",
            name: "Menu Item", 
            price: 0.00
        }, 

        {    color: "#DDCC77", 
            img: "/menu_part_images/beijing-beef.jpg",
            name: "Menu Item", 
            price: 0.00
        }
    ]

    return (
        <>
            <div id={styles.wideDiv}>
                <div id={styles.exitArrow}>
                    <Link to={"/cashier"}>
                        <SlArrowLeft />
                    </Link>

                </div>
                    

                <div id="container">
                    <div id={styles.ingredients}>
                        {
                            ingredientList.map((ingre, i) =>
                                <SelectableMenuParts order={ingre}/>
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