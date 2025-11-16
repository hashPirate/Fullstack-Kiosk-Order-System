import {useNavigate} from 'react-router-dom';
import clsx from 'clsx';

import gridStyles from '../MenuGridStyles.module.css'; 
import styles from './CashierMenuParts.module.css';

export default function MenuPart({style}) {
    const navigate = useNavigate();

    function onPartClick() {
        navigate("/cashier/menu_items");
    }

    return (
        <div className={clsx(gridStyles.gridItem, styles.menuPart)} style={style} onClick={onPartClick}>
            Menu Part Name Here
        </div>
    );
}
