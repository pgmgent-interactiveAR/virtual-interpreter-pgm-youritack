import SpeechApp from './speech.js';
import FreeGlasses from './glasses.js';


const initApp = () => {

    try {
        SpeechApp();
    } catch (error) {
        FreeGlasses();
    }
}


document.addEventListener('DOMContentLoaded', initApp);