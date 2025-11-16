import gridStyles from "../MenuGridStyles.module.css";
import MenuPart from "./MenuPart.jsx";

// Copying this from CashierMenuItems, for now
const pastelColors = [
    "#FFD1DC",
    "#AEC6CF",
    "#E6E6FA",
    "#B5EAD7",
    "#FFDAB9",
    "#FFFACD",
    "#F88379",
    "#C8A2C8",
    "#AFEEEE",
    "#FFD1DC",
    "#AEC6CF",
    "#E6E6FA",
    "#B5EAD7",
    "#FFDAB9",
    "#FFFACD",
    "#F88379",
    "#C8A2C8",
    "#AFEEEE",
];

export default function CashierMenuParts() {
    return (
        <div className={gridStyles.menuGridContainer}>
            {pastelColors.map((c, i) => <MenuPart key={i} style={{backgroundColor: c}} />)}
        </div>
    );
}

