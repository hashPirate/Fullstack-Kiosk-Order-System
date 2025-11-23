import {useNavigate} from 'react-router-dom';
import clsx from 'clsx';
import { useContext } from 'react';

import gridStyles from '../MenuGridStyles.module.css'; 
import styles from './CashierMenuItems.module.css';
import OrderContext from '../OrderContext';

export default function MenuItem({id, name, price, style}) {
    const navigate = useNavigate();
    const orderState = useContext(OrderContext);

    function onItemClick() {
        if (orderState.isProcessing) {
            console.log("ERROR: cannot add items to a new order while processing another order.");
            return;
        }

        orderState.addMenuItem(id, name, price);
        navigate(`/cashier/menu_parts?menuItemID=${id}`);
    }

    return (
        <div className={clsx(gridStyles.gridItem, styles.menuItem)} style={style} onClick={onItemClick}>
            {name}
        </div>
    );
}
