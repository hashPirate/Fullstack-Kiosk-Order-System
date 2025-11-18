import {useOutletContext} from 'react-router';
import styles from './SetLanguage.module.css';
import clsx from 'clsx';
import { useEffect } from 'react';

export default function SetLanguage() {


    useEffect(()=>{
        //i intially used this to avoid multiple runs of the same google translate element but though using container would be more effective
        // if (!window.translateAlrAdded){
        //     window.translateAlrAdded = false;
        // }
        const script = document.createElement('script');
        script.src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.body.appendChild(script);
        window.googleTranslateElementInit= () =>{
    
            const container = document.getElementById('google_translate_element');
            if(container) {
                container.innerHTML = '';
            }
            new google.translate.TranslateElement({pageLanguage: 'en',
                layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL
            }, 'google_translate_element');
            setTimeout(() => {
                const select =document.querySelector('.goog-te-combo');
                if (!select || select.dataset.listenerAttached) {
                    return;
                }
                const hasEnglish =Array.from(select.options).some(
                    (opt) => opt.value === 'en'
                );
                if (!hasEnglish) {
                    const englishOption = document.createElement('option');
                    englishOption.value = 'en';
                    englishOption.textContent = 'English';
                    select.insertBefore(englishOption, select.firstChild);
                }
                select.dataset.listenerAttached = 'true';
                select.addEventListener('change', () =>{
                    if (select.value === 'en'){
                        //when selected language is english, the original page is shown (i had to add this to not lose the og text on the pages)
                        setTimeout(() =>{
                            window.location.reload();
                        }, 200);
                    }
                });
            }, 500);
  
            
            //this will automatically refresh the page every time we switch to a diff language, not sure if we need it yet...
            // window.location.reload(); 
        };


    }, []);
    return (
        
        <div id="setLanguage">
  
            <h2 className={styles.langTitle}>Choose your preferred language</h2>
            <div id='google_translate_element' className={styles.langButtonsDiv}></div>
        </div>
    );
}


