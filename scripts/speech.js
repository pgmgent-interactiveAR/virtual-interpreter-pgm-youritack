const SpeechApp = () => {
  const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
  const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
  const SpeechRecognitionEvent =
    window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    const speechrecognitionlist = new SpeechGrammarList();
    const subtitles = document.querySelector('.subtitles');
    const subtitlesContainer = document.querySelector('.subtitles-container');
    const handmodel = document.querySelector('#handModel');
    const speechButton = document.querySelector('#microphone');
    const speechButtonImage = document.querySelector('#microphone-image');
    const subtitlesButton = document.querySelector('#subtitles');
    const subtitlesButtonImage = document.querySelector('#subtitles-image');


    const animationlistobj=[
        {
            animationName:'hello',
            target: 447,
            position:"1 0 0",
        },
        {
            animationName:'peace',
            target : 447,
            position : "1 0 0",
        },
        {
            animationName:'goodbye',
            target : 447,
            position :"1 0 0",
            repetitions: 2,
            loop:"repeat",
        },
        {
            animationName:'box',
            target : 447,
            position : "1 0 0",
        },
        {
            animationName:'nice',
            target : 447,
            position : "1 0 0",
        },

    ];
    const renderqueue=[];

    speechButton.addEventListener('click',()=>{
        if (speechButton.classList.contains("active")) {
            speechButton.classList.remove("active");
            speechButtonImage.src = "../assets/svg/microphone.svg";
            recognition.start();
          } else {
            speechButton.classList.add("active");
            speechButtonImage.src = "../assets/svg/microphone-mute.svg";
            recognition.stop();
          }
    },false)
    
    subtitlesButton.addEventListener('click',()=>{
        if (subtitlesButton.classList.contains("active")) {
            subtitlesButton.classList.remove("active");
            subtitlesButtonImage.src = "../assets/svg/subtitle.svg";
            subtitlesContainer.classList.remove('hidden');
          } else {
            subtitlesButton.classList.add("active");
            subtitlesButtonImage.src = "../assets/svg/subtitle-not-active.svg";
            subtitlesContainer.classList.add('hidden');
          }
    },false)


    recognition.addEventListener('result',(event)=>{
        const guess = event.results[event.results.length-1];
        const sentence = guess[0].transcript;
        subtitles.textContent+= sentence;
        subtitles.scrollTop=subtitles.scrollHeight - subtitles.clientHeight;
        displayHand(sentence);
    });

   const displayHand=(sentence)=>{
        sentence.split(" ").forEach(word => {
            const element = getanimation(word);
            if(element!==undefined){
            if(handmodel.getAttribute("animation-mixer")){
                renderqueue.push(element)
                return;
            }
            playAnimation(element);
        }
        });
    }
   const getanimation=(word)=>{
        return animationlistobj.find((element)=>{
            return word===element.animationName;
        });
    };
    const playAnimation=({
        animationName,
        target = 447,
        position ="1 0 0",
        repetitions,
        loop="once",

    })=>{
        handmodel.parentElement.setAttribute(
            "mindar-face-target",
            `anchorIndex:${target}`
        );
        handmodel.setAttribute("animation-mixer",{
            clip:`${animationName}`,
            loop: loop,
            repetitions:repetitions,
            crossFadeDuration:0,
        })
        handmodel.setAttribute("visible",true);
        handmodel.setAttribute('position',position);
    }
    const animationStopped=document.body.addEventListener("animation-finished",()=>{
        
        if(renderqueue.length>0){
            playAnimation(renderqueue.shift());
            return;
        }
        handmodel.removeAttribute('animation-mixer');
        handmodel.setAttribute("visible",false);
    })
};

export default SpeechApp;

