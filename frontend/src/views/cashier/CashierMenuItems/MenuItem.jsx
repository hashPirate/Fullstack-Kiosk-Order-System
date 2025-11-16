import {useNavigate} from 'react-router-dom';
import clsx from 'clsx';

import gridStyles from '../MenuGridStyles.module.css'; 
import styles from './CashierMenuItems.module.css';

export default function MenuItem({name, id, style}) {
    const navigate = useNavigate();

    function onItemClick() {
        navigate(`/cashier/menu_parts?menuItemID=${id}`);
    }

    return (
        <div className={clsx(gridStyles.gridItem, styles.menuItem)} style={style} onClick={onItemClick}>
            {name}
        </div>
    );
}
