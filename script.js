const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let pacman = { x: 200, y: 200, size: 20, dx: 0, dy: 0 };

let dots = [];
for (let i = 20; i < 400; i += 40) {
    for (let j = 20; j < 400; j += 40) {
        dots.push({ x: i, y: j, size: 5 });
    }
}

function drawPacman() {
    ctx.beginPath();
    ctx.arc(pacman.x, pacman.y, pacman.size, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x, pacman.y);
    ctx.fillStyle = "yellow";
    ctx.fill();
}

function drawDots() {
    dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    });
}

function movePacman() {
    pacman.x += pacman.dx;
    pacman.y += pacman.dy;

    // Межі
    if (pacman.x < pacman.size) pacman.x = pacman.size;
    if (pacman.y < pacman.size) pacman.y = pacman.size;
    if (pacman.x > 400 - pacman.size) pacman.x = 400 - pacman.size;
    if (pacman.y > 400 - pacman.size) pacman.y = 400 - pacman.size;

    // Збір крапок
    dots = dots.filter(dot => {
        const dist = Math.hypot(pacman.x - dot.x, pacman.y - dot.y);
        return dist > pacman.size;
    });
}

function update() {
    ctx.clearRect(0, 0, 400, 400);
    drawDots();
    drawPacman();
    movePacman();
    requestAnimationFrame(update);
}

document.getElementById("startBtn").onclick = () => {
    pacman = { x: 200, y: 200, size: 20, dx: 0, dy: 0 };
    update();
};

document.addEventListener("keydown", event => {
    if (event.key === "ArrowUp")    pacman.dy = -2, pacman.dx = 0;
    if (event.key === "ArrowDown")  pacman.dy = 2, pacman.dx = 0;
    if (event.key === "ArrowLeft")  pacman.dx = -2, pacman.dy = 0;
    if (event.key === "ArrowRight") pacman.dx = 2, pacman.dy = 0;
});