import styles from './Collapsible.module.css';
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
            <div className={clsx(styles.CollapsibleHeader, !collapsed && styles.UncollapsedHeader)} onClick={() => setCollapsed(!collapsed)}>
                <span className={styles.CollapsibleSummary}>{props.summary}</span>
                <IoArrowForwardCircleOutline className={clsx(!collapsed && styles.rotate90, styles.CollapsibleMarker)}/>
            </div>
            <div className={clsx(styles.CollapsibleDetails, !collapsed && styles.UncollapsedDetails, !collapsed && props.detailsClasses)}>
                {props.children}
            </div>
        </div>
    );
}


