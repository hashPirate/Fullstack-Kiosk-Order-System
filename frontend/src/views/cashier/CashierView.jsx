import { Link, Outlet } from "react-router";
import { useEffect, useState } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { SlGlobe } from "react-icons/sl";

import "./CashierView.css"
import OrderView from "./OrderView";
import ProgressBar from "./ProgressBar";

export default function CashierView() {

    const [lang, setLang] = useState("English");
    const [progress, setProgress] = useState(0);




    return (
        <>
            <div id="CashierView">
                <nav>
                    <Link to="/"><h1><SlArrowLeft /></h1></Link>               
                    <Link to="/cashier"><h1 id= "cashierTitle"> New Order </h1></Link>       
                    <Link to="/"><h1> <SlGlobe /> </h1></Link>
                    
                </nav>
                

                <div id="mainDiv">                
                    <OrderView/>

                    <div id = "diffViews">
                        <ProgressBar context={{progress}}/>
                        <Outlet context={{lang, setLang, setProgress}}/>
                    </div>

                </div>
            </div>


        </>
    );
};
