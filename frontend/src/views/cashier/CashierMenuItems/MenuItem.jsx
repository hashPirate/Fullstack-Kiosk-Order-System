import gridStyles from '../MenuGridStyles.module.css'; 

export default function MenuItem({style}) {
    return (
        <div className={gridStyles.gridItem} style={style}>
            Menu Item Name Here
        </div>
    );
}
