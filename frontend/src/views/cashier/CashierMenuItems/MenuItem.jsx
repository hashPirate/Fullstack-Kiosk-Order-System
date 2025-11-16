import styles from './CashierMenuItems.module.css'; 

export default function MenuItem({style}) {
    return (
        <div className={styles.menuItem} style={style}>
            Menu Item Name Here
        </div>
    );
}
