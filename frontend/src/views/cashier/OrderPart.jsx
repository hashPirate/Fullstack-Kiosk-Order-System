import { NavLink, Outlet } from "react-router";
import { VscChromeClose } from "react-icons/vsc";

import styles from "./OrderPart.module.css";

export default function OrderPart({partName, partPrice, newOrder, setNewOrder, onClick, xVisable}) {



    return (
        <>
            <div id={styles.part}>
                <div>   
                    {
                        xVisable &&
                        <VscChromeClose onClick={onClick}/>
                    }
                    <p id={styles.partName}>{partName}</p>
                </div>
                <p id={styles.partPrice}>${partPrice}</p>
            </div>
        </>
    );
};