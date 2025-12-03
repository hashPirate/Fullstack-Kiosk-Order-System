import styles from "./ConfirmationScreen.module.css";


// ? <ConfirmationScreen orderBeingRemoved={orderBeingRemoved} setOrderBeingRemoved={setOrderBeingRemoved} handleRemoveOrder={removeOrder}/>
export default function ConfirmationScreen({orderToRemove, setOrderToRemove, handleRemoveOrder}) {

    // When yes clickced, remove order and unset it
    async function onYesClick() {
        handleRemoveOrder(orderToRemove);
        setOrderToRemove(null);   // reset to null
    }

    return (
        <div className={styles.confirmationScreen}>
            <div className={styles.confirmationDialog}>
                <p className={styles.confMessage}>Are you sure you want to confirm this order?</p>
                <div className={styles.dialogButtons}>
                    <button className={styles.yesButton} onClick={onYesClick}>Yes</button>
                    <button className={styles.noButton} onClick={() => setOrderToRemove(null)}>No</button>
                </div>
            </div>
        </div>
    );
}
