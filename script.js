//==============================================================================
/*  Globals */

// Set up for the game canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 750;
canvas.height = 600;

// World size
const world = {
    width: 1500,
    height: 1500
};

// Use of a camera to allow players to explore the map
let camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
};

// translation challenges
let currentInput = ""; // what the player is typing
let cursorVisible = true;

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

// Translation NPC
const npcs = [
    {
        x: 200,
        y: 150,
        width: 30,
        height: 40,
        dialogues: [
            { npc: "こんにちは", answer: "Hello" },
            { npc: "はじめまして", answer: "Nice to meet you" },
            { npc: "ありがとう", answer: "Thank you" }
        ],
        currentDialogue: "",
        correctAnswer: "",
        showDialogue: false,
        currentIndex: 0
    },
    {
        x: 350,
        y: 100,
        width: 30,
        height: 40,
        dialogues: [
            { npc: "さようなら", answer: "Goodbye" },
            { npc: "すみません", answer: "Excuse me" },
            { npc: "はい", answer: "Yes" }
        ],
        currentDialogue: "",
        correctAnswer: "",
        showDialogue: false,
        currentIndex: 0
    },
    {
        x: 500,
        y: 250,
        width: 30,
        height: 40,
        dialogues: [
            { npc: "すし", answer: "sushi" },
            { npc: "ごはん", answer: "rice" },
            { npc: "水", answer: "water" }
        ],
        currentDialogue: "",
        correctAnswer: "",
        showDialogue: false,
        currentIndex: 0
    },
    {
        x: 700,
        y: 400,
        width: 30,
        height: 40,
        dialogues: [
            { npc: "学生", answer: "student" },
            { npc: "先生", answer: "teacher" },
            { npc: "学校", answer: "school" }
        ],
        currentDialogue: "",
        correctAnswer: "",
        showDialogue: false,
        currentIndex: 0
    }
];

// Just a quick board that gives players information
const instructionBoard = {
    x: player.x,
    y: player.y - 60,
    instructions: [
        "Use W, A, S, D to move.",
        "Press E near a NPC to translate.",
        "Type the correct translation and press Enter or Check.",
    ],
    showInstructions: true
};

//==============================================================================

// Track which NPC player is interacting with
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
    ctx.fillRect(150 - camera.x, 0 - camera.y, 100, world.height);
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
        player.x - camera.x, player.y - camera.y,
        player.width, player.height
    );
}

// Function to draw NPC
function drawNPC() {
    npcs.forEach(npc => {
        ctx.drawImage(
            npcSprite,
            npc.x - camera.x, npc.y - camera.y,
            npc.width, npc.height
        );
    });
}

// Function to draw the Instruction Board
function drawInstructionBoard() {
    if (instructionBoard.showInstructions) {
        // Optional: background behind instructions
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(player.x - camera.x - 20, player.y - camera.y - 90, 350, 80);

        // Draw instruction text
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px Arial";
        instructionBoard.instructions.forEach((line, index) => {
            ctx.fillText(
                line,
                player.x - camera.x,
                player.y - camera.y - 70 + index * 18
            );
        });
    }
}

//==============================================================================

// Detect when player is pressing keys
window.addEventListener("keydown", (event) => {
    if (activeNPC && activeNPC.showDialogue) {
        if (event.key === "Backspace") {
            event.preventDefault();
            currentInput = currentInput.slice(0, -1);
        } else if (event.key === "Enter") {
            checkCanvasTranslation();
        } else if (event.key.length === 1) {
            currentInput += event.key;
        }
        return; // prevents movement while inputting
    }

    if (event.key === "a") keys.left = true;
    if (event.key === "d") keys.right = true;
    if (event.key === "w") keys.up = true;
    if (event.key === "s") keys.down = true;
    if (event.key === "e") interactWithNPC();
});

window.addEventListener("keyup", (event) => {
    if (event.key === "a") keys.left = false;
    if (event.key === "d") keys.right = false;
    if (event.key === "w") keys.up = false;
    if (event.key === "s") keys.down = false;
});

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (
        activeNPC && activeNPC.showDialogue &&
        mouseX >= 450 && mouseX <= 530 &&
        mouseY >= 495 && mouseY <= 520
    ) {
        checkCanvasTranslation();
    }
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
    if (keys.right && player.x + player.width < world.width) {
        player.x += player.speed;
        player.direction = "right";
        isMoving = true;
    }
    if (keys.up && player.y > 0) {
        player.y -= player.speed;
        player.direction = "up";
        isMoving = true;
    }
    if (keys.down && player.y + player.height < world.height) {
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

    // Camera code
    camera.x = player.x + player.width / 2 - canvas.width / 2;
    camera.y = player.y + player.height / 2 - canvas.height / 2;

    // Fix camera to map bounds
    camera.x = Math.max(0, Math.min(world.width - canvas.width, camera.x));
    camera.y = Math.max(0, Math.min(world.height - canvas.height, camera.y));


    // Hides dialogue when player moves away
    if (activeNPC) {
        const distance = Math.sqrt((player.x - activeNPC.x) ** 2 + (player.y - activeNPC.y) ** 2);
        if (distance > 25) {
            activeNPC.showDialogue = false;
            activeNPC = null;
            currentInput = ""; // clears input
        }
    }

    // Hide instructions when player moves away from the board
    if (!isPlayerNearInstructionBoard()) {
        instructionBoard.showInstructions = false;
    }

    instructionBoard.showInstructions = isPlayerNearInstructionBoard();

    // keeps player in bounds
    player.x = Math.max(0, Math.min(world.width - player.width, player.x));
    player.y = Math.max(0, Math.min(world.height - player.height, player.y));
}

//==============================================================================
/*  GAME CONTROL FUNCTIONS */

// Function to find the nearest NPC within range
function getNearbyNPC() {
    return npcs.find(npc => {
        const distance = Math.sqrt((player.x - npc.x) ** 2 + (player.y - npc.y) ** 2);
        return distance < 25; // interaction distance
    });
}

// Function to handle NPC interaction
function interactWithNPC() {
    const nearbyNPC = getNearbyNPC();
    if (nearbyNPC) {
        const i = nearbyNPC.currentIndex;

        if (i < nearbyNPC.dialogues.length) {
            const dialogue = nearbyNPC.dialogues[i];
            nearbyNPC.currentDialogue = dialogue.npc;
            nearbyNPC.correctAnswer = dialogue.answer;
            nearbyNPC.showDialogue = true;
            activeNPC = nearbyNPC;
        } else {
            nearbyNPC.currentDialogue = "No more questions!";
            nearbyNPC.correctAnswer = "";
            nearbyNPC.showDialogue = true;
            activeNPC = nearbyNPC;
        }
    }
}

// Function to check if the player is near the Instruction Board
function isPlayerNearInstructionBoard() {
    let distance = Math.sqrt(
        (player.x - instructionBoard.x) ** 2 + (player.y - instructionBoard.y) ** 2
    );
    return distance < 80; // Adjusts the hitbox
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
        ctx.fillRect(50, 450, 650, 120);

        ctx.fillStyle = "#ffffff";
        ctx.font = "16px Arial";
        instructionBoard.instructions.forEach((line, index) => {
            ctx.fillText(line, 70, 500 + index * 20);
        });
    }
}

    //==============================================================================
// Function to draw dialogue box with translation challenge
function drawDialogue() {
    if (activeNPC && activeNPC.showDialogue) {
        // Dialogue box
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(50, 450, 650, 120);

        ctx.fillStyle = "#ffffff";
        ctx.font = "16px Arial";
        ctx.fillText("NPC says: " + activeNPC.currentDialogue, 70, 480);

        // Input label
        ctx.fillText("Your answer:", 70, 510);

        // Input box
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(180, 495, 250, 25);
        ctx.fillStyle = "#000000";
        ctx.fillText(currentInput, 190, 512);

        // Input text with blinking cursor
        const inputWithCursor = cursorVisible ? currentInput + "|" : currentInput;
        ctx.fillText(inputWithCursor, 190, 512);

        // Check button
        ctx.fillStyle = "#007BFF";
        ctx.fillRect(450, 495, 80, 25);
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Check", 470, 512);
    }
}

// Function to check player translation
function checkCanvasTranslation() {
    let playerInput = currentInput.trim().toLowerCase();

    if (activeNPC && activeNPC.correctAnswer !== "") {
        if (playerInput === activeNPC.correctAnswer.toLowerCase()) {
            alert("Correct! You earned 10 points!");
        } else {
            alert(`Wrong! The correct answer was: ${activeNPC.correctAnswer}`);
        }

        // Advance to next dialogue only if we're in valid range
        if (activeNPC.currentIndex < activeNPC.dialogues.length) {
            activeNPC.currentIndex++;
        }
    }

    currentInput = "";
    if (activeNPC) activeNPC.showDialogue = false;
    activeNPC = null;
}
//==============================================================================

setInterval(() => {
    cursorVisible = !cursorVisible;
}, 500);

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

// Auto-hide instructions after 5 seconds
setTimeout(() => {
    instructionBoard.showInstructions = false;
}, 5000);
