
// Set up the game canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

// NPC Dialogue Data
const dialogues = [
    { npc: "Hola, ¿cómo estás?", answer: "Hello, how are you?" },
    { npc: "Merci beaucoup", answer: "Thank you very much" },
    { npc: "Guten Morgen", answer: "Good morning" },
    { npc: "ありがとう", answer: "Thank you" }
];

// Player Data
let score = 0;
let currentDialogue;

// Function to start a new translation challenge
function startDialogue() {
    let randomIndex = Math.floor(Math.random() * dialogues.length);
    currentDialogue = dialogues[randomIndex];
    document.getElementById("npcText").innerText = `NPC says: ${currentDialogue.npc}`;
}

// Check the player's answer
document.getElementById("checkAnswer").addEventListener("click", () => {
    let playerInput = document.getElementById("playerInput").value;

    if (playerInput.toLowerCase().trim() === currentDialogue.answer.toLowerCase().trim()) {
        score += 10;
        document.getElementById("score").innerText = score;
        alert("✅ Correct! You earned 10 points!");
    } else {
        alert(`❌ Wrong! The correct answer was: ${currentDialogue.answer}`);
    }

    document.getElementById("playerInput").value = "";
    startDialogue();
});

// Draw NPC on the canvas
function drawNPC() {
    ctx.fillStyle = "blue";
    ctx.fillRect(150, 150, 50, 50); // Simple blue square as NPC
}

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNPC();
    requestAnimationFrame(gameLoop);
}

// Start game
startDialogue();
gameLoop();