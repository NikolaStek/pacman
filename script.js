const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE = 16;

// Карта 28×14 — значить канвас повинен бути 448×224
// 1 = стіна, 0 = точка, 2 = порожньо
const map = [
    "1111111111111111111111111111",
    "1000000000110000000000000001",
    "1011111100110111111110111101",
    "1011111100000111111110111101",
    "1000000000000000000000000001",
    "1011110111110111111011111101",
    "1000000110000000110000000001",
    "1111110110111101101110111111",
    "0000010000000000000001000000",
    "1111010111110111111010111111",
    "1000000000110000001100000001",
    "1011111110110111101111111101",
    "1000000000000000000000000001",
    "1111111111111111111111111111"
];

let pacman = { 
    x: 14 * TILE, 
    y: 7 * TILE,   // переніс у центр карти
    dx: 0, 
    dy: 0, 
    speed: 2 
};

let ghost = { 
    x: 14 * TILE, 
    y: 3 * TILE, 
    dx: 2, 
    dy: 0 
};

function drawMap() {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === "1") {
                ctx.fillStyle = "#0011ff";
                ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
            } else if (map[y][x] === "0") {
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.arc(x * TILE + 8, y * TILE + 8, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function drawPacman() {
    ctx.beginPath();
    ctx.arc(pacman.x + 8, pacman.y + 8, 8, 0.25 * Math.PI, 1.75 * Math.PI);
    ctx.lineTo(pacman.x + 8, pacman.y + 8);
    ctx.fillStyle = "yellow";
    ctx.fill();
}

function drawGhost() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ghost.x + 8, ghost.y + 8, 8, 0, Math.PI * 2);
    ctx.fill();
}

function canMove(x, y) {
    const col = Math.floor(x / TILE);
    const row = Math.floor(y / TILE);
    return map[row] && map[row][col] !== "1";
}

function movePacman() {
    if (canMove(pacman.x + pacman.dx, pacman.y))
        pacman.x += pacman.dx;

    if (canMove(pacman.x, pacman.y + pacman.dy))
        pacman.y += pacman.dy;

    // Збирання точки
    const col = Math.floor((pacman.x + 8) / TILE);
    const row = Math.floor((pacman.y + 8) / TILE);

    if (map[row][col] === "0") {
        map[row] = map[row].substring(0, col) + "2" + map[row].substring(col + 1);
    }
}

function moveGhost() {
    const dirs = [
        { dx: 2, dy: 0 },
        { dx: -2, dy: 0 },
        { dx: 0, dy: 2 },
        { dx: 0, dy: -2 }
    ];

    if (!canMove(ghost.x + ghost.dx, ghost.y + ghost.dy)) {
        const r = Math.floor(Math.random() * dirs.length);
        ghost.dx = dirs[r].dx;
        ghost.dy = dirs[r].dy;
    }

    ghost.x += ghost.dx;
    ghost.y += ghost.dy;
}

function checkCollision() {
    const dist = Math.hypot(
        pacman.x - ghost.x,
        pacman.y - ghost.y
    );

    if (dist < 16) {
        alert("Гру закінчено! Привид спіймав тебе!");
        document.location.reload();
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMap();
    movePacman();
    moveGhost();
    drawPacman();
    drawGhost();
    checkCollision();

    requestAnimationFrame(update);
}

// Клавіатура
document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") pacman.dx = 0, pacman.dy = -pacman.speed;
    if (e.key === "ArrowDown") pacman.dx = 0, pacman.dy = pacman.speed;
    if (e.key === "ArrowLeft") pacman.dx = -pacman.speed, pacman.dy = 0;
    if (e.key === "ArrowRight") pacman.dx = pacman.speed, pacman.dy = 0;
});

// Віртуальні кнопки
document.querySelectorAll("#controls button").forEach(btn => {
    btn.onclick = () => {
        const dir = btn.dataset.dir;
        if (dir === "up") pacman.dx = 0, pacman.dy = -pacman.speed;
        if (dir === "down") pacman.dx = 0, pacman.dy = pacman.speed;
        if (dir === "left") pacman.dx = -pacman.speed, pacman.dy = 0;
        if (dir === "right") pacman.dx = pacman.speed, pacman.dy = 0;
    };
});

// Старт
document.getElementById("startBtn").onclick = () => {
    update();
};

