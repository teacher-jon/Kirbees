// --- CONFIGURATION ---
const speechConfig = {
    key: "PASTE_YOUR_AZURE_KEY_HERE", 
    region: "chinaeast2" 
};

const currentMission = {
    targetWord: "Quickly",
    successMessage: "Great job!"
};

const vocab = {
    adjectives: [
        { word: "Big", class: "big" },
        { word: "Small", class: "small" },
        { word: "Red", class: "red" }
    ],
    adverbs: [
        // THESE MUST MATCH YOUR FILE NAMES!
        // If file is 'run.glb', logic uses 'run'
        { word: "Quickly", file: "run.glb" },
        { word: "Slowly", file: "walk.glb" },
        { word: "High", file: "jump.glb" },
        { word: "Quietly", file: "sneak.glb" }
    ]
};

let currentLang = 'en';

window.onload = function() {
    // Populate Dropdowns
    const adjSelect = document.getElementById('adjective-select');
    const advSelect = document.getElementById('adverb-select');

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

function activateKirby() {
    const adjData = JSON.parse(document.getElementById('adjective-select').value);
    const advData = JSON.parse(document.getElementById('adverb-select').value);
    const kirby = document.getElementById('kirby');
    const goal = document.getElementById('goal');

    // 1. SWAP THE MODEL (The Magic Trick)
    // We instantly change the source to the animation file (run.glb, walk.glb)
    const newModelPath = "assets/" + advData.file;
    kirby.src = newModelPath;
    
    // reset position
    kirby.style.transition = 'none';
    kirby.style.left = '20px';
    goal.style.display = 'block';

    // 2. Play the Action
    setTimeout(() => {
        kirby.style.transition = 'all 2.5s linear'; // Make it slide smoothly

        // WIN Logic
        if (advData.word === currentMission.targetWord) {
            kirby.style.left = '650px'; // Move to apple
            
            // Confetti
            if (window.confetti) confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            
            setTimeout(() => { goal.style.display = 'none'; }, 2200);
        } else {
            kirby.style.left = '150px'; // Move a little bit
        }

        speakSentence(adjData, advData);
    }, 100);
}

function speakSentence(adj, adv) {
    if (speechConfig.key === "PASTE_YOUR_AZURE_KEY_HERE" || speechConfig.key === "") {
        // Fallback Voice
        const u = new SpeechSynthesisUtterance(`The ${adj.word} Kirby moves ${adv.word}.`);
        window.speechSynthesis.speak(u);
        return;
    }
    // (Azure code excluded for brevity - paste your key logic here if you have it)
}
