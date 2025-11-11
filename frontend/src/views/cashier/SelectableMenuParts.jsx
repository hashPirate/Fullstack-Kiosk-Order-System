import { Link, Outlet } from "react-router";
import { useEffect, useState } from "react";

import styles from "./SelectableMenuParts.module.css";

export default function SelectableMenuParts({order, onClick, setNewOrder}) {

    return (
        <>
            <Link to={order.linkto}>
                <div className={styles.container} style={{ backgroundColor: order.color}} onClick={onClick}>
                    <img src={order.img}/>
                    <p id={styles.name}>{order.name}</p>
                    <p id={styles.price}>${order.price}</p>
                </div>
            </Link>
           
        </>
    );
};