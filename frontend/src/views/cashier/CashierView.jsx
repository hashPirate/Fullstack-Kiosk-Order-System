import { Link, Outlet } from "react-router";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { CiGlobe } from "react-icons/ci";

import styles from "./CashierView.module.css"
import OrderView from "./OrderView";
import ProgressBar from "./ProgressBar";

export default function CashierView() {

    const [lang, setLang] = useState("English");
    const [progress, setProgress] = useState(0);




    return (
        <>
            <div className={styles.CashierView}>
                <nav className={styles.nav}>
                    <Link to="/"><IoArrowBack className={styles.navIcon}/></Link>               
                    <h1 className= {styles.cashierTitle}> New Order </h1>       
                    <Link to="language"><CiGlobe className={styles.navIcon}/></Link>
                    
                </nav>
                

                <div className={styles.mainDiv}>                
                    <OrderView/>

                    <div className = {styles.diffViews}>
                        <ProgressBar context={{progress}}/>
                        <Outlet context={{lang, setLang, setProgress}}/>
                    </div>

                </div>
            </div>


        </>
    );
};
