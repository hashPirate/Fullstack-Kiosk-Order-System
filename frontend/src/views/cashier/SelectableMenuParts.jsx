import { Link, Outlet } from "react-router";
import { useEffect, useState } from "react";

import styles from "./SelectableMenuParts.module.css";

export default function SelectableMenuParts(color, img, name, price) {

    return (
        <>
            <div className={styles.container} color={color}>
                <img src={img}/>
                <p id={styles.name}>{name}</p>
                <p id={styles.price}>${price}</p>
            </div>
        </>
    );
};