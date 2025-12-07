// import {useOutletContext} from 'react-router';
import styles from './SetLanguage.module.css';
import { languages } from './languages.js';
import { useEffect, useState } from 'react';
import clsx from "clsx";
import { useOutletContext } from 'react-router';

export default function SetLanguage() {
    const { selectedLang, setSelectedLang } = useOutletContext();

    useEffect(()=>{
        // Put the existing Google translate element back into container if translate already initialized
        if (window.googleTranslateElement) {
            const container = document.getElementById('google_translate_element');

            if (container) {
                container.appendChild(window.googleTranslateElement.Z);
            }

            return;
        }

        const script = document.createElement('script');
        script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.body.appendChild(script);
        window.googleTranslateElementInit = () =>{
            const languageCodes = languages.map(lang => lang.code).join(',');
            
            // ↓↓↓ this comment will disable a warning for the global `google` object
            // eslint-disable-next-line no-undef
            window.googleTranslateElement = new google.translate.TranslateElement({pageLanguage: 'en',
                includedLanguages: languageCodes,
                layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL
            }, 'google_translate_element');

            setTimeout(() => {
                const select = document.querySelector('.goog-te-combo');
                if (!select || select.dataset.listenerAttached) {
                    return;
                }
                const hasEnglish = Array.from(select.options).some(
                    (opt) => opt.value === 'en'
                );
                if (!hasEnglish) {
                    const englishOption = document.createElement('option');
                    englishOption.value = 'en';
                    englishOption.textContent = 'English';
                    select.insertBefore(englishOption, select.firstChild);
                }
            }, 500);
        };


    }, []);

    return (
        <div id="setLanguage">
            <h2 className={styles.langTitle}>Choose your preferred language</h2>

            {/* This div is still required for the Google Translate widget to function, but we hide it. */}
            <div id='google_translate_element' style={{display: 'none'}}></div>

            <div className={styles.langButtonsGrid}>
                {languages.map((lang) => (
                    <button key={lang.code} className={clsx(styles.langButton, "skiptranslate", (selectedLang === lang.code) && styles.langSelected)} aria-label={`Change language to ${lang.name}`} onClick={() => {
                        const select = document.querySelector('.goog-te-combo');
                        if (select) select.value = lang.code;
                        select?.dispatchEvent(new Event('change'));
                        setSelectedLang(lang.code);
                    }}>
                        <span className={styles.langName}>{lang.name}</span>
                        <span className={styles.langEmoji}>{lang.emoji}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}