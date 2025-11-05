
import { Link } from "react-router";
import './KioskMenuPart.css';
import clsx from 'clsx';

// Props:
    // img -- string
    // name -- string
    // price -- string
export default function KioskMenuItem(props) {
    return (
        <div className={clsx("kioskMenuPart", props.selected && "partSelected")} onClick={() => props.selectionCallback(props.name)}>
            <img className="kioskMenuPartImage" src={props.img} alt={props.name} />
            <span className="menuPartName">{props.name}</span>
            <span className="menuPartPrice">{props.price}</span>
        </div>
    );
}
