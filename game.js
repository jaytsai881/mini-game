cat > game.js << 'EOF'
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    speed: 5,
    movingLeft: false,
    movingRight: false
};

// Bullets
let bullets = [];
const bulletSpeed = 7;

// Enemies
let enemies = [];
let enemySpeed = 2;
let spawnInterval = 80;

// Game State
let score = 0;
let gameOver = false;

// Keyboard input
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") player.movingLeft = true;
    if (e.key === "ArrowRight") player.movingRight = true;
    if (e.key === " ") shoot();
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") player.movingLeft = false;
    if (e.key === "ArrowRight") player.movingRight = false;
});

// Shooting
function shoot() {
    bullets.push({
        x: player.x + player.width / 2 - 3,
        y: player.y,
        width: 6,
        height: 12
    });
}

// Enemy spawn
function spawnEnemy() {
    enemies.push({
        x: Math.random() * (canvas.width - 40),
        y: -40,
        width: 40,
        height: 40
    });
}

// Collision detection
function rectsCollide(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// Game loop
function update() {
    if (gameOver) return;

    // Move player
    if (player.movingLeft && player.x > 0) player.x -= player.speed;
    if (player.movingRight && player.x < canvas.width - player.width) player.x += player.speed;

    // Move bullets
    bullets.forEach((b) => (b.y -= bulletSpeed));
    bullets = bullets.filter((b) => b.y > -20);

    // Move enemies
    enemies.forEach((e) => (e.y += enemySpeed));

    // Check bullet collisions
    bullets.forEach((b, bi) => {
        enemies.forEach((e, ei) => {
            if (rectsCollide(b, e)) {
                enemies.splice(ei, 1);
                bullets.splice(bi, 1);
                score++;
            }
        });
    });

    // Check game over
    enemies.forEach((e) => {
        if (rectsCollide(e, player) || e.y > canvas.height) {
            gameOver = true;
            document.getElementById("gameOver").classList.remove("hidden");
        }
    });

    // Render
    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player
    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Bullets
    bullets.forEach((b) => {
        ctx.fillStyle = "yellow";
        ctx.fillRect(b.x, b.y, b.width, b.height);
    });

    // Enemies
    enemies.forEach((e) => {
        ctx.fillStyle = "red";
        ctx.fillRect(e.x, e.y, e.width, e.height);
    });

    // Score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

// Restart game
function restartGame() {
    bullets = [];
    enemies = [];
    score = 0;
    gameOver = false;
    document.getElementById("gameOver").classList.add("hidden");
    update();
}

// Enemy spawn loop
setInterval(() => {
    if (!gameOver) spawnEnemy();
}, spawnInterval);

// Start game
update();
EOF
