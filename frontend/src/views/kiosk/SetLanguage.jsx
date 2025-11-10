import {useOutletContext} from 'react-router';
import styles from './SetLanguage.module.css';
import clsx from 'clsx';

export default function SetLanguage() {
    const { lang, setLang } = useOutletContext();

    return (
        <div id="setLanguage">
            <h2 id="titleEng" className={styles.langTitle}>Choose your language.</h2>
            <h2 id="titleEsp" className={styles.langTitle}>Elige tu idioma.</h2>
            <div className={styles.langButtonsDiv}>
                <button className={clsx(styles.langButton, styles.englishButton)} onClick={() => setLang("English")}>English</button>
                <button className={clsx(styles.langButton, styles.spanishButton)} onClick={() => setLang("Spanish")}>Espanol</button>
            </div>

            {/* REMOVE THIS IN PROD */}
            <p>[DEBUG]: Selected: {lang}</p>
        </div>
    );
}


