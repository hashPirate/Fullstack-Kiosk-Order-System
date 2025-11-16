// import {useNavigate} from 'react-router-dom';
import clsx from 'clsx';
import { useContext } from 'react';

import gridStyles from '../MenuGridStyles.module.css'; 
import styles from './CashierMenuParts.module.css';
import OrderContext from '../OrderContext';

export default function MenuPart({style, id, name, price}) {
    const orderState = useContext(OrderContext);

    function onPartClick() {
        if (orderState.length === 0) {
            console.log("ERROR: cannot add menu parts when there are no menu items!");
            return;
        }
        orderState.addMenuPart(orderState.orderContent.length - 1, id, name, price);
    }

    return (
        <div className={clsx(gridStyles.gridItem, styles.menuPart)} style={style} onClick={onPartClick}>
            {name}
        </div>
    );
}
