
// Set up for the game canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;

// Loading in sprites for game
const playerSprites = {
    down: new Image(),
    left: new Image(),
    right: new Image(),
    up: new Image()
};

playerSprites.down.src = "assets/player_down.png";
playerSprites.left.src = "assets/player_left.png";
playerSprites.right.src = "assets/player_right.png";
playerSprites.up.src = "assets/player_up.png";

// Npc sprits
const npcSprite = new Image();
npcSprite.src = "assets/npc_sprite.png";

//==============================================================================
/*  Declaration of Objects */

// Player Character
const player = {
    x: 180, // Starting position
    y: 300,
    width: 30,
    height: 50,
    color: "#f2dc9d",
    speed: 3,
    direction: "down",   // default facing direction
    frameX: 0,
    maxFrame: 3,
    frameDelay: 0,
    frameDelayMax: 8
};

// Player Movement
const keys = {
    left: false,
    right: false,
    up: false,
    down: false
};

// Translation NPC (Has the translation challenges)
const translationNPC = {
    x: 200,
    y: 150,
    width: 30,
    height: 40,
    color: "blue",
    dialogues: [
        {npc: "こんにちは", answer: "Hello"},
        {npc: "はじめまして", answer: "Nice to meet you"},
        { npc: "ありがとう", answer: "Thank you"}
    ],
    currentDialogue: "",
    correctAnswer: "",
    showDialogue: false
};

// Just a quick board that gives players information
const instructionBoard = {
    x: 20,
    y: 300,
    width: 100,
    height: 30,
    color: "brown",
    text: "INSTRUCTIONS", // Sign title
    instructions: [
        "Use W, A, S, D to move.",
        "Press E near a blue NPC to translate.",
        "Type the correct translation and press Check.",
    ],
    showInstructions: false
};

//==============================================================================

// Track active NPC (which NPC the player is talking to)
let activeNPC = null;

// Track if player is typing
let isTyping = false;

//==============================================================================
/*  ALL DRAWING CODE WILL BE HERE */

// Drawing the background
function drawBackground() {
    // Draw grass (green background)
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw dirt path
    ctx.fillStyle = "#8B4513"; // Brown
    ctx.fillRect(150, 0, 100, canvas.height);
}

// Function to draw the player character
function drawPlayer() {
    const spriteWidth = 16;  // frame width
    const spriteHeight = 25; // frame height

    const spriteImage = playerSprites[player.direction];

    ctx.drawImage(
        spriteImage,
        player.frameX * spriteWidth, 0,
        spriteWidth, spriteHeight,
        player.x, player.y,
        player.width, player.height
    );
}

// Function to draw NPC
function drawNPC() {
    ctx.drawImage(npcSprite, translationNPC.x, translationNPC.y, translationNPC.width, translationNPC.height);
}

// Function to draw the Instruction Board
function drawInstructionBoard() {
    ctx.fillStyle = instructionBoard.color;
    ctx.fillRect(instructionBoard.x, instructionBoard.y, instructionBoard.width, instructionBoard.height);

    // Draw text on the board
    ctx.fillStyle = "#fff";
    ctx.font = "12px Arial";
    ctx.fillText(instructionBoard.text, instructionBoard.x + 5, instructionBoard.y + 20);
}

//==============================================================================

// Detect when player starts typing to disable movement
document.getElementById("translationInput").addEventListener("focus", () => {
    isTyping = true;
});

// Detect when typing finishes to re-enable movement
document.getElementById("translationInput").addEventListener("blur", () => {
    isTyping = false;
});

/* Event Listeners */
window.addEventListener("keydown", (event) => {
    if (isTyping) return; 
    if (event.key === "a") keys.left = true;
    if (event.key === "d") keys.right = true;
    if (event.key === "w") keys.up = true;
    if (event.key === "s") keys.down = true;
    if (event.key === "e") {
        interactWithNPC(); // Press E to talk to NPC
    }
});

window.addEventListener("keyup", (event) => {
    if (event.key === "a") keys.left = false;
    if (event.key === "d") keys.right = false;
    if (event.key === "w") keys.up = false;
    if (event.key === "s") keys.down = false;
});
    //==============================================================================

// Function to update player while the game is running
function updatePlayer() {
    if (isTyping) return;

    let isMoving = false;

    if (keys.left && player.x > 0) {
        player.x -= player.speed;
        player.direction = "left";
        isMoving = true;
    }
    if (keys.right && player.x + player.width < canvas.width) {
        player.x += player.speed;
        player.direction = "right";
        isMoving = true;
    }
    if (keys.up && player.y > 0) {
        player.y -= player.speed;
        player.direction = "up";
        isMoving = true;
    }
    if (keys.down && player.y + player.height < canvas.height) {
        player.y += player.speed;
        player.direction = "down";
        isMoving = true;
    }

    // Animate only when moving
    if (isMoving) {
        player.frameDelay++;
        if (player.frameDelay >= player.frameDelayMax) {
            player.frameDelay = 0;
            player.frameX++;
            if (player.frameX > player.maxFrame) {
                player.frameX = 0;
            }
        }
    } else {
        player.frameX = 0; // idle frame
    }

    // Hides dialogue when player moves away
    if (!isPlayerNearNPC()) {
        translationNPC.showDialogue = false;
        hideTranslationUI();
    }

    // Hide instructions when player moves away from the board
    if (!isPlayerNearInstructionBoard()) {
        instructionBoard.showInstructions = false;
    }

    instructionBoard.showInstructions = isPlayerNearInstructionBoard();
}

//==============================================================================
/*  GAME CONTROL FUNCTIONS */

// Function to check if the player is near the NPC
function isPlayerNearNPC() {
    let distance = Math.sqrt(
        (player.x - translationNPC.x) ** 2 + (player.y - translationNPC.y) ** 2
    );
    return distance < 20; // Interaction range
}

// Function to handle NPC interaction
function interactWithNPC() {
    if (isPlayerNearNPC()) {
        let randomIndex = Math.floor(Math.random() * translationNPC.dialogues.length);
        translationNPC.currentDialogue = translationNPC.dialogues[randomIndex].npc;
        translationNPC.correctAnswer = translationNPC.dialogues[randomIndex].answer;
        translationNPC.showDialogue = true;
        showTranslationUI();
    }
}

// Function to check if the player is near the Instruction Board
function isPlayerNearInstructionBoard() {
    let distance = Math.sqrt(
        (player.x - instructionBoard.x) ** 2 + (player.y - instructionBoard.y) ** 2
    );
    return distance < 80; // Interaction range
}

// Function to handle Instruction Board interaction
function interactWithInstructionBoard() {
    if (isPlayerNearInstructionBoard()) {
        instructionBoard.showInstructions = !instructionBoard.showInstructions;
    }
}

// Function to draw instructions when interacting with the board
function drawInstructions() {
    if (instructionBoard.showInstructions) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(30, 50, 440, 100);

        ctx.fillStyle = "#ffffff";
        ctx.font = "16px Arial";
        instructionBoard.instructions.forEach((line, index) => {
            ctx.fillText(line, 40, 70 + index * 20);
        });
    }
}

    //==============================================================================
// Function to draw dialogue box with translation challenge
function drawDialogue() {
    if (translationNPC.showDialogue) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(50, 350, 400, 100);

        ctx.fillStyle = "#ffffff";
        ctx.font = "16px Arial";
        ctx.fillText("NPC says: " + translationNPC.currentDialogue, 70, 370);
    }
}

// Show translation UI (input box & button)
function showTranslationUI() {
    document.getElementById("translationInput").style.display = "block";
    document.getElementById("checkTranslation").style.display = "block";
}

// Hide translation UI
function hideTranslationUI() {
    document.getElementById("translationInput").style.display = "none";
    document.getElementById("checkTranslation").style.display = "none";
}

// Function to check player's translation
function checkTranslation() {
    let playerInput = document.getElementById("translationInput").value.trim().toLowerCase();
    if (playerInput === translationNPC.correctAnswer.toLowerCase()) {
        alert(" Correct! You earned 10 points!");
    } else {
        alert(` Wrong! The correct answer was: ${translationNPC.correctAnswer}`);
    }
    document.getElementById("translationInput").value = "";
    translationNPC.showDialogue = false; // Hide dialogue after checking
    hideTranslationUI();
}
    //==============================================================================

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawNPC();
    drawInstructionBoard();
    drawPlayer();
    updatePlayer();
    drawDialogue();
    drawInstructions();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
