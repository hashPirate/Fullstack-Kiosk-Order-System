import {useOutletContext} from 'react-router';
import './SetLanguage.css';

export default function SetLanguage() {
    const { lang, setLang } = useOutletContext();

    return (
        <div id="setLanguage">
            <h2 id="titleEng" className="langTitle">Choose your language.</h2>
            <h2 id="titleEsp" className="langTitle">Elige tu idioma.</h2>
            <div id="langButtonsDiv">
                <button className="langButton englishButton" onClick={() => setLang("English")}>English</button>
                <button className="langButton spanishButton" onClick={() => setLang("Spanish")}>Espanol</button>
            </div>

            {/* REMOVE THIS IN PROD */}
            <p>[DEBUG]: Selected: {lang}</p>
        </div>
    );
}


