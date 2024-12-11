const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const gameOverMessage = document.getElementById('gameOverMessage');
const finalScoreDisplay = document.getElementById('finalScore');
const leaderboard = document.getElementById('leaderboard');
const scoreList = document.getElementById('scoreList');
const restartButton = document.getElementById('restartButton');

let score = 0;
let timeLeft = 30;
let gameOver = false;
let target = {};
let coins = [];
let collectedCoins = 0;
let gameInterval, timerInterval;
let targetHit = false;

// Function to start the game
function startGame() {
    score = 0;
    collectedCoins = 0;
    timeLeft = 30;
    gameOver = false;
    targetHit = false;
    target = generateTarget();
    coins = [];
    generateCoins(5);
    updateScore();
    updateTime();
    startTimer();
    startGameInterval();
    restartButton.style.display = 'none';
    gameOverMessage.style.display = 'none';
}

// Generate random target
function generateTarget() {
    const x = Math.random() * (canvas.width - 50);
    const y = Math.random() * (canvas.height - 50);
    return { x: x, y: y, hit: false };
}

// Generate random coins with flip state
function generateCoins(number) {
    for (let i = 0; i < number; i++) {
        coins.push({
            x: Math.random() * (canvas.width - 30),
            y: Math.random() * (canvas.height - 30),
            radius: 15,
            flip: false,  // Initially not flipping
            flipAngle: 0  // The angle of the flip
        });
    }
}

// Draw target with animation on hit
function drawTarget() {
    ctx.fillStyle = target.hit ? '#ff6347' : '#ff007f'; // Change color on hit
    ctx.beginPath();
    ctx.arc(target.x + 25, target.y + 25, 25, 0, Math.PI * 2);
    ctx.fill();
    if (target.hit) {
        target.x += Math.random() * 5 - 2.5; // Slight random movement after hit
        target.y += Math.random() * 5 - 2.5;
        target.hit = false; // Reset hit status after animation
    }
}

// Draw coins with flip animation
function drawCoins() {
    ctx.fillStyle = '#ffcc00';
    coins.forEach(coin => {
        ctx.save();
        ctx.translate(coin.x + coin.radius, coin.y + coin.radius);

        // If coin is flipping, animate the flip
        if (coin.flip) {
            coin.flipAngle += 0.05; // Slower flip
            if (coin.flipAngle >= Math.PI * 2) {  // Complete flip
                coin.flip = false;
                coin.flipAngle = 0;
            }
        }

        ctx.rotate(coin.flipAngle);  // Apply the flip rotation
        ctx.beginPath();
        ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

// Update score
function updateScore() {
    scoreDisplay.textContent = `Оноо: ${score}`;
}

// Update time
function updateTime() {
    timeDisplay.textContent = `Цаг: ${timeLeft}`;
}

// Start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        if (gameOver) return;
        timeLeft--;
        updateTime();
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// Start the game loop
function startGameInterval() {
    gameInterval = setInterval(() => {
        if (gameOver) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTarget();
        drawCoins();
    }, 1000 / 60);
}

// Handle mouse or touch click (shooting)
function handleClick(event) {
    if (gameOver) return;

    const mouseX = event.clientX - canvas.offsetLeft;
    const mouseY = event.clientY - canvas.offsetTop;

    // Check if target was clicked
    const targetDistance = Math.sqrt(Math.pow(mouseX - (target.x + 25), 2) + Math.pow(mouseY - (target.y + 25), 2));
    if (targetDistance < 25) {
        score++;
        updateScore();
        target.hit = true;  // Mark the target as hit
    }

    // Check if coin was clicked
    coins.forEach((coin, index) => {
        const coinDistance = Math.sqrt(Math.pow(mouseX - (coin.x + coin.radius), 2) + Math.pow(mouseY - (coin.y + coin.radius), 2));
        if (coinDistance < coin.radius) {
            coins.splice(index, 1);  // Remove the collected coin
            collectedCoins++;
            score += 2;  // Each coin gives 2 extra points
            updateScore();
            generateCoins(1);  // Add one more coin randomly
            coin.flip = true;  // Start flipping animation on collection
        }
    });
}

// End the game
function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    gameOver = true;
    finalScoreDisplay.textContent = score;
    gameOverMessage.style.display = 'block';
    restartButton.style.display = 'block';
    updateLeaderboard();
}

// Restart the game
function restartGame() {
    startGame();
}

// Update the leaderboard
function updateLeaderboard() {
    let playerScore = score;
    let playerName = prompt("Таны нэрийг оруулна уу:") || "Player1";

    let newScores = [
        { name: "Player1", score: 50 },
        { name: "Player2", score: 45 },
        { name: "Player3", score: 40 },
        { name: playerName, score: playerScore }
    ];

    newScores.sort((a, b) => b.score - a.score);  // Sort by score in descending order

    // Display top 5 scores
    scoreList.innerHTML = '';
    newScores.slice(0, 5).forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name} - ${player.score}`;
        scoreList.appendChild(li);
    });
}

// Event listener for mouse or touch click
canvas.addEventListener('click', handleClick);
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleClick(e.touches[0]);
});

// Start the game when the page is loaded
window.onload = startGame;