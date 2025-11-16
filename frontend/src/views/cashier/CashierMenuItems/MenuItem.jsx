import {useNavigate} from 'react-router-dom';
import clsx from 'clsx';

import gridStyles from '../MenuGridStyles.module.css'; 
import styles from './CashierMenuItems.module.css';

export default function MenuItem({style}) {
    const navigate = useNavigate();

    function onItemClick() {
        navigate("/cashier/menu_parts");
    }

    return (
        <div className={clsx(gridStyles.gridItem, styles.menuItem)} style={style} onClick={onItemClick}>
            Menu Item Name Here
        </div>
    );
}
