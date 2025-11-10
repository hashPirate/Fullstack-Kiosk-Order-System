import OrderDetails from './OrderDetails.jsx';

export default function BuildPlate() {
    const sidePrompts = [
        {
            prompt: "Choose a Base",
            menuParts: [
                {img: "/menu_part_images/rice.jpg", name: "Rice", price: "$0.00"},
                {img: "/menu_part_images/chow-mein.jpg", name: "Chow Mein", price: "$1.00"},
            ]
        },
        {
            prompt: "Choose Side 1",
            menuParts: [
                {img: "/menu_part_images/beijing-beef.jpg", name: "Beijing Beef", price: "$1.00"},
                {img: "/menu_part_images/grilled-teriyaki-chicken.jpg", name: "Teriyaki Chicken", price: "$1.00"},
                {img: "/menu_part_images/mushroom-chicken.jpg", name: "Mushroom Chicken", price: "$1.00"},
            ]
        },
        {
            prompt: "Choose Side 2",
            menuParts: [
                {img: "/menu_part_images/beijing-beef.jpg", name: "Beijing Beef", price: "$1.00"},
                {img: "/menu_part_images/grilled-teriyaki-chicken.jpg", name: "Teriyaki Chicken", price: "$1.00"},
                {img: "/menu_part_images/mushroom-chicken.jpg", name: "Mushroom Chicken", price: "$1.00"},
            ]
        },
    ]

    return (
        <>
            <OrderDetails sidePrompts={sidePrompts} itemName="Plate" />
        </>
    );
}
