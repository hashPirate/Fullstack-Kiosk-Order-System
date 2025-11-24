import { useEffect, useState } from 'react';
import OrderDetails from './OrderDetails.jsx';
import { useSearchParams } from 'react-router';
import { HashLoader } from "react-spinners";
import axios from 'axios';

export default function BuildItem() {
    const [searchParams, setSearchParams] = useSearchParams();
    const itemId = Number(searchParams.get("itemId"));
    const itemName = decodeURIComponent(searchParams.get("itemName"));
    const partCount = Number(searchParams.get("partCount"));

    const [sidePrompts, setSidePrompts] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                let newSidePrompts = [];
                let loadedMenuParts = await axios.get(`/api/menu/items/${itemId}/parts`);

                // Get the parts data in the right format
                loadedMenuParts = loadedMenuParts.data.filter(mp => mp.for_sale);    // Filter out menu parts that are not for_sale 
                loadedMenuParts = loadedMenuParts.map( mp => ({...mp, img: "/api/images/" + mp.image_name}) );
                for (let i = 0; i < partCount; i++) {
                    newSidePrompts.push({
                        prompt: `Choose Side ${i+1}`,
                        menuParts: loadedMenuParts.map( mp => ({...mp, img: "/api/images/" + mp.image_name}) )
                    });
                }

                setSidePrompts(newSidePrompts);
                console.log(newSidePrompts);
                setLoading(false);
            } catch (error) {
                console.log("ERROR loading menu parts:", error);
            }
        })();
    }, []);

    function renderOrderDetails() {
        if (loading) {
            return <HashLoader color={"#DC143C"} aria-label="Loading item details..." />;
        } else {
            return <OrderDetails sidePrompts={sidePrompts} itemId={itemId} itemName={itemName} />;
        }
    }

    return (
        <>
            {renderOrderDetails()}
        </>
    );
}
