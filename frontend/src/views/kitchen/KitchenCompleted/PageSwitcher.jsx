import styles from "./KitchenCompleted.module.css";

export default function PageSwitcher({ pageNum, totalPages, setPageNum }) {
    return (
        <div className={styles.pageSwitcher}>
            <button onClick={() => { setPageNum(p => p - 1); }}>prev</button>
            <p> Page {pageNum} of {totalPages}</p>
            <button onClick={() => { setPageNum(p => p + 1); }}>next</button>
        </div>
    );
}
