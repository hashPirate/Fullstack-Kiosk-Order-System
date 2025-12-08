import { HashLoader } from "react-spinners";
import styles from "./LoadingPopup.module.css";
/**
 * Simple loading popup with a centered spinner used in kitchen views.
 *
 * @function LoadingPopup
 * @returns {React.ReactElement} A centered loading spinner overlay.
 */
export default function LoadingPopup() {
    return (
        <div className={styles.loadingPopup}>
            <HashLoader className={styles.hashLoader} color={"#3CC7D1"}/>;
        </div>
    );
}

