
import { Link, Outlet } from "react-router";
import SelectableMenuParts from "./SelectableMenuParts";

export default function CashierHome() {
    return (
        <>
            <div>
                <div>
                    <SelectableMenuParts color="#44AA99" name="eg roll" price="5.00"/>
                </div>
            </div> 
        </>
    );
};
