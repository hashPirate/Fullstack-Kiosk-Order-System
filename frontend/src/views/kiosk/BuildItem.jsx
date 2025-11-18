import { useEffect, useState } from 'react';
import OrderDetails from './OrderDetails.jsx';
import { useSearchParams } from 'react-router';
import { HashLoader } from "react-spinners";
import axios from 'axios';

export default function BuildItem() {
    const [searchParams, setSearchParams] = useSearchParams();
    const itemId = searchParams.get("itemId");
    const partCount = searchParams.get("partCount");

    const [sidePrompts, setSidePrompts] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                let newSidePrompts = [];
                let loadedMenuParts = await axios.get(`/api/menu/items/${itemId}/parts`);

                // Get the parts data in the right format
                loadedMenuParts = loadedMenuParts.data.filter(mp => mp.for_sale);    // Filter out menu parts that are not for_sale 
                loadedMenuParts = loadedMenuParts.map( mp => ({...mp, img: "/menu_part_images/rice.jpg"}) );
                for (let i = 0; i < partCount; i++) {
                    newSidePrompts.push({
                        prompt: `Choose Side ${i+1}`,
                        menuParts: loadedMenuParts.map( mp => ({...mp, img: "/menu_part_images/rice.jpg"}) )
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
            return <HashLoader color={"#1FD5D4"}/>;
        } else {
            return <OrderDetails sidePrompts={sidePrompts} itemName="Plate" />;
        }
    }

    return (
        <>
            {renderOrderDetails()}
        </>
    );
}



    // const sidePrompts = [
    //     {
    //         prompt: "Choose a Base",
    //         menuParts: [
    //             {img: "/menu_part_images/rice.jpg", name: "Rice", price: "$0.00"},
    //             {img: "/menu_part_images/chow-mein.jpg", name: "Chow Mein", price: "$1.00"},
    //         ]
    //     },
    //     {
    //         prompt: "Choose Side 1",
    //         menuParts: [
    //             {img: "/menu_part_images/beijing-beef.jpg", name: "Beijing Beef", price: "$1.00"},
    //             {img: "/menu_part_images/grilled-teriyaki-chicken.jpg", name: "Teriyaki Chicken", price: "$1.00"},
    //             {img: "/menu_part_images/mushroom-chicken.jpg", name: "Mushroom Chicken", price: "$1.00"},
    //         ]
    //     },
    //     {
    //         prompt: "Choose Side 2",
    //         menuParts: [
    //             {img: "/menu_part_images/beijing-beef.jpg", name: "Beijing Beef", price: "$1.00"},
    //             {img: "/menu_part_images/grilled-teriyaki-chicken.jpg", name: "Teriyaki Chicken", price: "$1.00"},
    //             {img: "/menu_part_images/mushroom-chicken.jpg", name: "Mushroom Chicken", price: "$1.00"},
    //         ]
    //     },
    // ]

