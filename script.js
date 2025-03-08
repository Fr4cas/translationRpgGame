
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

// Player Character
const player = {
    x: 180, // Starting position (on the path)
    y: 300,
    width: 40,
    height: 30,
    color: "#f2dc9d", // Gold color
    speed: 3
};

// Function to draw the player character
function drawPlayer() {
    // Body
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - 5, player.y, player.width + 10, player.height);

    // Head
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.fillRect(player.x, player.y - 20, player.width, player.height);
    ctx.fill();
    
    // Clothes
    ctx.fillStyle = "#23B8A6";
    ctx.fillRect(player.x , player.y, player.width, player.height);

    // Hair
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.fillRect(player.x, player.y - 25, player.width, 5);
    ctx.fill();

    // Eyes
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(player.x + 13, player.y - 12, 3, 0, Math.PI * 2);
    ctx.arc(player.x + 27, player.y - 12, 3, 0, Math.PI * 2);
    ctx.fill();

    

    // Legs
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x , player.y + 30, 10, 10);
    ctx.fillRect(player.x + 28, player.y + 30, 10, 10);
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

// Player Movement
const keys = {
    left: false,
    right: false,
    up: false,
    down: false
};

// Event Listeners for Key Presses
window.addEventListener("keydown", (event) => {
    if (event.key === "a") keys.left = true;
    if (event.key === "d") keys.right = true;
    if (event.key === "w") keys.up = true;
    if (event.key === "s") keys.down = true;
});

window.addEventListener("keyup", (event) => {
    if (event.key === "a") keys.left = false;
    if (event.key === "d") keys.right = false;
    if (event.key === "w") keys.up = false;
    if (event.key === "s") keys.down = false;
});

// Function to update player movement
function updatePlayer() {
    if (keys.left && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.right && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }
    if (keys.up && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys.down && player.y + player.height < canvas.height) {
        player.y += player.speed;
    }
}
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
/*  GAME CONTROL FUNCTIONS */

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
    drawPlayer();
    updatePlayer();
    requestAnimationFrame(gameLoop);
}

// Start game
startDialogue();
gameLoop();