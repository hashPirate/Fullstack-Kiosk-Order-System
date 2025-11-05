import './Collapsible.css';
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { useState } from 'react';
import clsx from 'clsx';

// TODO: MAKE ACCESSIBLE
// NOTE: Don't try making this accessible by turning it into a <details> <summary> thing. I've gone down that route. The support is terrible and it is very hard to work with. Maybe our grandchildren will be able to do this using <details> <summary>.
//       -- Donnell
export default function Collapsible(props) {
    const [collapsed, setCollapsed] = useState(true);
    return (
        <div className="CollapsibleComponent">
            <div className={clsx("CollapsibleHeader", !collapsed && "UncollapsedHeader")} onClick={() => setCollapsed(!collapsed)}>
                <span className="CollapsibleSummary">{props.summary}</span>
                <IoArrowForwardCircleOutline className={clsx(!collapsed && "rotate90", "CollapsibleMarker")}/>
            </div>
            <div className={clsx("CollapsibleDetails", !collapsed && "UncollapsedDetails", !collapsed && props.detailsClasses)}>
                {props.children}
            </div>
        </div>
    );
}


