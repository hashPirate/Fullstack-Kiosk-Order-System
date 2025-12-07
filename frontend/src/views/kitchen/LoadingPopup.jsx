import { HashLoader } from "react-spinners";
import styles from "./LoadingPopup.module.css";

export default function LoadingPopup() {
    return (
        <div className={styles.loadingPopup}>
            <HashLoader className={styles.hashLoader} color={"#3CC7D1"}/>;
        </div>
    );
}

