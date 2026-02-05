// --- CONFIGURATION ---
const speechConfig = {
    key: "PASTE_YOUR_AZURE_KEY_HERE", 
    region: "chinaeast2" 
};

// --- GAME SETTINGS (The Mission) ---
const currentMission = {
    targetWord: "Quickly", // The word the student MUST pick to win
    successMessage: "Great job! Kirby reached the apple!"
};

// --- VOCABULARY LIST ---
const vocab = {
    adjectives: [
        { word: "Big", kr: "큰", zh: "巨大的", class: "big" },
        { word: "Small", kr: "작은", zh: "小小的", class: "small" },
        { word: "Heavy", kr: "무거운", zh: "沉重的", class: "heavy" },
        { word: "Light", kr: "가벼운", zh: "轻盈的", class: "light" },
        { word: "Red", kr: "빨간", zh: "红色的", class: "red" },
        { word: "Green", kr: "초록", zh: "绿色的", class: "green" },
        { word: "Hard", kr: "단단한", zh: "坚硬的", class: "hard" },
        { word: "Soft", kr: "부드러운", zh: "柔软的", class: "soft" }
    ],
    adverbs: [
        { word: "Quickly", kr: "빨리", zh: "快速地", class: "quickly" },
        { word: "Slowly", kr: "천천히", zh: "慢慢地", class: "slowly" },
        { word: "High", kr: "높게", zh: "高高地", class: "high" },
        { word: "Low", kr: "낮게", zh: "低低地", class: "low" },
        { word: "Quietly", kr: "조용히", zh: "安静地", class: "quietly" },
        { word: "Easily", kr: "쉽게", zh: "容易地", class: "easily" }
    ]
};

let currentLang = 'en';

// --- SETUP ON LOAD ---
window.onload = function() {
    const adjSelect = document.getElementById('adjective-select');
    const advSelect = document.getElementById('adverb-select');

    // Fill the dropdown menus
    vocab.adjectives.forEach(adj => {
        let opt = document.createElement('option');
        opt.value = JSON.stringify(adj);
        opt.innerText = adj.word;
        adjSelect.appendChild(opt);
    });

    vocab.adverbs.forEach(adv => {
        let opt = document.createElement('option');
        opt.value = JSON.stringify(adv);
        opt.innerText = adv.word;
        advSelect.appendChild(opt);
    });
};

function setLanguage(lang) {
    currentLang = lang;
    alert("Language set to: " + lang.toUpperCase());
}

// --- MAIN GAME LOGIC (WITH WIN/LOSS) ---
function activateKirby() {
    // 1. Get chosen words & Elements
    const adjData = JSON.parse(document.getElementById('adjective-select').value);
    const advData = JSON.parse(document.getElementById('adverb-select').value);
    const kirby = document.getElementById('kirby');
    const goal = document.getElementById('goal');

    // 2. Reset Position (Instant)
    kirby.style.transition = 'none'; 
    kirby.style.left = '20px'; 
    goal.style.display = 'block'; // Bring apple back if it was eaten
    
    // 3. The Gameplay Loop
    setTimeout(() => {
        kirby.style.transition = 'all 2s ease'; // Turn movement back on

        // Apply Visual Size/Color (Big, Small, etc.)
        kirby.classList.add(adjData.class);

        // --- CHECK: DID THEY WIN? ---
        if (advData.word === currentMission.targetWord) {
            // *** WINNER ***
            // Move Kirby all the way to the Apple (Right side)
            kirby.style.left = '650px'; 
            
            // Speak the Sentence
            speakSentence(adjData, advData);
            
            // Trigger Confetti!
            if (window.confetti) {
                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            }
            
            // Eat the Apple after 2 seconds
            setTimeout(() => {
                goal.style.display = 'none'; 
            }, 2000);

        } else {
            // *** TRY AGAIN ***
            // Kirby only moves a little bit (stuck)
            kirby.style.left = '100px';
            
            // Shake effect
            kirby.classList.add('shake');
            setTimeout(() => kirby.classList.remove('shake'), 500);

            // Hint
            console.log("Wrong answer. Try again!");
        }

    }, 100);
}

// --- SPEECH FUNCTION ---
function speakSentence(adj, adv) {
    // 1. Check if Azure Key is missing
    if (speechConfig.key === "PASTE_YOUR_AZURE_KEY_HERE" || speechConfig.key === "") {
        console.log("No Azure Key found. Using Browser Backup Voice.");
        
        const utterance = new SpeechSynthesisUtterance();
        
        if (currentLang === 'en') {
            utterance.text = `The ${adj.word} Kirby moves ${adv.word}.`;
            utterance.lang = 'en-US';
        } else if (currentLang === 'kr') {
            utterance.text = `${adj.kr} 커비가 ${adv.kr} 움직여요.`;
            utterance.lang = 'ko-KR';
        } else if (currentLang === 'zh') {
            utterance.text = `${adj.zh}卡比${adv.zh}移动。`;
            utterance.lang = 'zh-CN';
        }
        
        window.speechSynthesis.speak(utterance);
        return; 
    }

    // 2. AZURE SETUP
    const speechSDK = window.SpeechSDK;
    const config = speechSDK.SpeechConfig.fromSubscription(speechConfig.key, speechConfig.region);
    
    let textToSpeak = "";
    let voiceName = "";

    if (currentLang === 'en') {
        textToSpeak = `The ${adj.word} Kirby moves ${adv.word}.`;
        voiceName = "en-US-AnaNeural";
    } else if (currentLang === 'kr') {
        textToSpeak = `${adj.kr} 커비가 ${adv.kr} 움직여요.`;
        voiceName = "ko-KR-SunHiNeural";
    } else if (currentLang === 'zh') {
        textToSpeak = `${adj.zh}卡比${adv.zh}移动。`;
        voiceName = "zh-CN-XiaoxiaoNeural";
    }

    config.speechSynthesisVoiceName = voiceName;
    const synthesizer = new speechSDK.SpeechSynthesizer(config);

    synthesizer.speakTextAsync(
        textToSpeak,
        result => {
            if (result.reason === speechSDK.ResultReason.SynthesizingAudioCompleted) {
                console.log("Speech working!");
            } else {
                console.error(result.errorDetails);
            }
            synthesizer.close();
        },
        error => {
            console.error(error);
            synthesizer.close();
        }
    );
}
