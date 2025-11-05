import OrderDetails from './EnterItemDetails.jsx';

export default function BuildDrink() {
    const sidePrompts = [
        {
            prompt: "Choose a Drink",
            menuParts: [
                {img: "/menu_part_images/dr-pepper.jpg", name: "Dr. Pepper", price: "$0.00"},
                {img: "/menu_part_images/iced-tea.jpg", name: "Iced Tea", price: "$1.00"},
            ]
        },
    ]

    return (
        <>
            <OrderDetails sidePrompts={sidePrompts} itemName="Drink" />
        </>
    );
}
