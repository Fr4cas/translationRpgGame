
// Set up the game canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
//==============================================================================

/*  ALL DRAWING CODE WILL BE HERE 
    Seperating the functions to make it easier to manage */

// Function to draw the background
function drawBackground() {
    // Draw grass (green background)
    ctx.fillStyle = "#4CAF50"; // Green
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw dirt path
    ctx.fillStyle = "#8B4513"; // Brown
    ctx.fillRect(150, 0, 100, canvas.height);
}

// Draw NPC on the canvas
function drawNPC() {
    ctx.fillStyle = "blue";
    ctx.fillRect(150, 150, 50, 50); // Simple blue square as NPC
}
//==============================================================================
/*  CODE FOR THE PLAYER */

// Player Data
let score = 0;
let currentDialogue;
//==============================================================================
/*  CODE FOR THE NPCS */

// NPC Dialogue Data
const dialogues = [
    { npc: "Hola, ¿cómo estás?", answer: "Hello, how are you?" },
    { npc: "Merci beaucoup", answer: "Thank you very much" },
    { npc: "Guten Morgen", answer: "Good morning" },
    { npc: "ありがとう", answer: "Thank you" }
];
//==============================================================================
/*  GAME FUNCTIONS */

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

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawNPC();
    requestAnimationFrame(gameLoop);
}

// Start game
startDialogue();
gameLoop();