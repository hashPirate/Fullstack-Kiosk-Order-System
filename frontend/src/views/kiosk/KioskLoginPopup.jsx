import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { HashLoader } from "react-spinners";
import axios from "axios";

import styles from "./KioskLoginPopup.module.css";

export default function KioskLoginPopup({ setShowLoginPopup, setUser }) {
    const [sessionId, setSessionId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    function generateUUID() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        // Fallback for "older browsers." My Windows computer needs this, for some reason. -- Michael Z
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Generate a unique session ID when the component mounts
    useEffect(() => setSessionId(generateUUID()), []);

    // Poll the server to check if login has occurred
    useEffect(() => {
        if (!sessionId || isLoggedIn) return;

        const interval = setInterval(async () => {
            try {
                const response = await axios.get(`/api/kiosk-login/status/${sessionId}`);
                if (response.data.status === 'completed') {
                    setIsLoggedIn(true);
                    setUser(response.data.user);
                    console.log("Successfully signed in as:", response.data.user);
                    clearInterval(interval); // Stop polling
                    setTimeout(() => setShowLoginPopup(false), 2000);
                }
            } catch (error) {
                console.error("Error checking login status:", error);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [sessionId, isLoggedIn, setShowLoginPopup, setUser]);

    const loginUrl = sessionId ? `${window.location.origin}/api/kiosk-login/authenticate/${sessionId}` : "";

    console.log("loginUrl:", loginUrl);

    return (
        <div className={styles.popupBackdrop} onClick={() => setShowLoginPopup(false)}>
            <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={() => setShowLoginPopup(false)}>&times;</button>
                <h2>Want your favorites again?</h2>
                {isLoggedIn ? (
                    <div className={styles.loggedInMessage}><h3>Successfully signed in!</h3></div>
                ) : (
                    sessionId ? (
                        <>
                            <p>Scan this QR code with your phone to sign in.<br></br>Easily see your order history!</p>
                            <div className={styles.qrCodeContainer}>
                                <QRCodeSVG value={loginUrl} size={256} />
                            </div>
                            <p>Waiting for login...</p>
                            <button className={styles.noThanksButton} onClick={() => setShowLoginPopup(false)}>No Thanks</button>
                        </>
                    ) : (
                        <HashLoader color={"#DC143C"} />
                    )
                )}
            </div>
        </div>
    );
}