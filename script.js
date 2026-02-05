const speechConfig = { key: "", region: "chinaeast2" }; // Add key if you have it
const currentMission = { targetWord: "Quickly", successMessage: "Great job!" };
const vocab = {
    adjectives: [ { word: "Big", class: "big" }, { word: "Small", class: "small" }, { word: "Red", class: "red" } ],
    adverbs: [
        { word: "Quickly", file: "run.glb" }, 
        { word: "Slowly", file: "walk.glb" }, 
        { word: "High", file: "jump.glb" },
        { word: "Quietly", file: "sneak.glb" }
    ]
};

window.onload = function() {
    const adjSelect = document.getElementById('adjective-select');
    const advSelect = document.getElementById('adverb-select');
    vocab.adjectives.forEach(adj => { let opt = document.createElement('option'); opt.value = JSON.stringify(adj); opt.innerText = adj.word; adjSelect.appendChild(opt); });
    vocab.adverbs.forEach(adv => { let opt = document.createElement('option'); opt.value = JSON.stringify(adv); opt.innerText = adv.word; advSelect.appendChild(opt); });
};

function activateKirby() {
    const adjData = JSON.parse(document.getElementById('adjective-select').value);
    const advData = JSON.parse(document.getElementById('adverb-select').value);
    const kirby = document.getElementById('kirby');
    const goal = document.getElementById('goal');

    // Swap the model to the animation file inside 'assets/'
    kirby.src = "assets/" + advData.file; 

    kirby.style.transition = 'none'; kirby.style.left = '20px'; goal.style.display = 'block';
    setTimeout(() => {
        kirby.style.transition = 'all 2.5s linear';
        if (advData.word === currentMission.targetWord) {
            kirby.style.left = '650px';
            if (window.confetti) confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => { goal.style.display = 'none'; }, 2200);
        } else { kirby.style.left = '150px'; }

        // Speak Logic
        const u = new SpeechSynthesisUtterance(`The ${adjData.word} Kirby moves ${advData.word}.`);
        window.speechSynthesis.speak(u);
    }, 100);
}
