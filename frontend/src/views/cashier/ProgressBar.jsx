import { Link, Outlet } from "react-router";
import { useEffect, useState } from "react";

import styles from "./ProgressBar.module.css";

export default function ProgressBar() {

    return (
        <>
            <div className={styles.ProgressBar}>
                <p>Menu Item</p>
                <p>Menu Parts</p>
                <p>Drinks</p>
            </div>
        </>
    );
};

