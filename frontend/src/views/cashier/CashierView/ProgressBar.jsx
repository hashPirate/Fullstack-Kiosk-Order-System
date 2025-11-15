import styles from "./CashierView.module.css";

export default function ProgressBar() {
    return (
        <div className={styles.progressBarArea}>
            <div className={styles.progressBar}>
            <h3 className={styles.progressBarStage}>Menu Items</h3>
            <h3 className={styles.progressBarStage}>Menu Parts</h3>
            </div>
        </div>
    );
}
