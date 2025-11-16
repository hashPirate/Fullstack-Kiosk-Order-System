import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import OrderView from './OrderView/OrderView.jsx';
import styles from "./CashierView.module.css";
import CashierHeader from './CashierHeader.jsx';
import ProgressBar from './OrderProgression.jsx';
import OrderProgression from './OrderProgression.jsx';

export default function CashierView() {
    return (
    <>
        <CashierHeader />
        <div className={styles.splitView}>
            <div className={styles.orderPane}>
                <OrderView />
            </div>
            <div className={styles.menuPane}>
                {/* Outlet the selection screens here. */}
                <OrderProgression />
                <Outlet />
            </div>
        </div>
    </>
    );
}

