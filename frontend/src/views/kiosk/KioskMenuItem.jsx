import { Link } from "react-router";

// Props:
    // img -- string
    // name -- string
    // price -- string
export default function KioskMenuItem(props) {
    return (
        <Link to={props.linkto}>
            <div className="kioskMenuItem">
                <img className="kioskMenuItemImage" src={props.img} alt={props.name} />
                <span className="menuItemName">{props.name}</span>
                <span className="menuItemPrice">{props.price}</span>
            </div>
        </Link>
    );
}
