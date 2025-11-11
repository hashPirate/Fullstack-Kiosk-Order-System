import { Link, Outlet } from "react-router";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { SlArrowLeft } from "react-icons/sl";
import {SlGlobe } from "react-icons/sl";
import { CiGlobe } from "react-icons/ci";

import styles from "./CashierView.module.css"
import OrderView from "./OrderView";
import ProgressBar from "./ProgressBar";

export default function CashierView() {

    const [lang, setLang] = useState("English");
    const [progress, setProgress] = useState(0);

    // const [orders, setOrders] = useState([{
    //     menuName: "Plate",
    //     menuPrice: 9.00,
    //     menuParts: [{name: "Chicken", price: 10.99}, {name: "Beef", price: 10.99}],
    // }])    
    
    const [orders, setOrders] = useState([])

    const [newOrder, setNewOrder] = useState({})

    const [total, setTotal] = useState(0);


    return (
        <>
            <div id={styles.CashierView}>
                <nav>
                    <Link to="/"><h1><SlArrowLeft /></h1></Link>               
                    <Link to="/cashier"><h1 id= {styles.cashierTitle}> New Order </h1></Link>       
                    <Link to="/"><h1> <SlGlobe /> </h1></Link>
                    
                </nav>
                

                <div id={styles.mainDiv}>                
                    <OrderView total={total} setTotal={setTotal} orders={orders} setOrders={setOrders} newOrder = {newOrder} setNewOrder={setNewOrder}/>


                    <div id = {styles.diffViews}>
                        <ProgressBar context={{progress}}/>
                        <Outlet context={[total, setTotal, lang, progress, setProgress, orders, setOrders, newOrder, setNewOrder]}/>
                    </div>

                </div>
            </div>


        </>
    );
};
