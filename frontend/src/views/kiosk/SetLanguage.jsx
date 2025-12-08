import { useOutletContext } from 'react-router';
import styles from './SetLanguage.module.css';
import { languages, initGoogleTranslate, getCurrentLanguage, changeLanguage } from './languages.js';
import { useEffect, useState } from 'react';
import clsx from "clsx";
import axios from 'axios';

/**
 * Screen allowing kiosk users to pick their preferred language and sync with Google Translate.
 * @returns {JSX.Element} Language selection grid with Google Translate integration.
 */
export default function SetLanguage() {
    const { user } = useOutletContext();
    useEffect(()=>{
        if (window.googleTranslateElement) {
            // Already initialized
            return;
        }

        // Clear Google translate cookie, that so the default is english for those not signed in.
        document.cookie = "googtrans=/en/en; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        initGoogleTranslate('google_translate_element');
    }, []);

    const [selectedLang, setSelectedLang] = useState(getCurrentLanguage());

    useEffect(() => {
        // Keep the selected language in sync with the cookie
        setSelectedLang(getCurrentLanguage());
    });

    return (
        <div id="setLanguage">
            <h2 className={styles.langTitle}>Choose your preferred language</h2>

            {/* This div is still required for the Google Translate widget to initialize, but we hide it. */}
            <div id='google_translate_element' style={{display: 'none'}}></div>

            <div className={styles.langButtonsGrid}>
                {languages.map((lang) => (
                    <button key={lang.code} className={clsx(styles.langButton, "skiptranslate", (selectedLang === lang.code) && styles.langSelected)} aria-label={`Change language to ${lang.name}`} onClick={async () => {
                        try {
                            await changeLanguage(lang.code);
                            setSelectedLang(lang.code);
                        } catch (error) {
                            console.error(error.message);
                        }
                        if (user) {
                            try {
                                await axios.put('/api/users/language', { language: lang.code });
                            } catch (error) {
                                console.error("Failed to save language preference:", error);
                            }
                        }
                    }}>
                        <span className={styles.langName}>{lang.name}</span>
                        <span className={styles.langEmoji}>{lang.emoji}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
