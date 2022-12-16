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
    const subtitlescontainer = document.querySelector('.subtitles-container');
    const handmodel = document.querySelector('#handModel');
    const speechbutton = document.querySelector('#microphone');
    const speechbuttonImage = document.querySelector('#microphone-image');
    const subtitlesbutton = document.querySelector('#subtitles');
    const subtitlesbuttonImage = document.querySelector('#subtitle-image');

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
        }

    ];
    const renderqueue=[];

    speechbutton.addEventListener('click',()=>{
        if (speechbutton.classList.contains("active")) {
            speechbutton.classList.remove("active");
            speechbuttonImage.src = "../assets/svg/microphone.svg";
            recognition.start();
          } else {
            speechbutton.classList.add("active");
            speechbuttonImage.src = "../assets/svg/microphone_mute.svg";
            recognition.stop();
          }
    },false)
    subtitlesbutton.addEventListener('click',()=>{
        if (subtitlesbutton.classList.contains("active")) {
            subtitlesbutton.classList.remove("active");
            subtitlesbuttonImage.src = "../assets/svg/subtitle.svg";
            subtitlescontainer.classList.remove('hidden');
          } else {
            subtitlesbutton.classList.add("active");
            subtitlesbuttonImage.src = "../assets/svg/subtitle-not-active.svg";
            subtitlescontainer.classList.add('hidden');
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

    })=>{
        handmodel.parentElement.setAttribute(
            "mindar-face-target",
            `anchorIndex:${target}`
        );
        handmodel.setAttribute("animation-mixer",{
            clip:`${animationName}`,
            loop: "once",
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

