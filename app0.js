const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Définition des dimensions du canvas
canvas.width = 800;
canvas.height = 400;

// Définition des raquettes
const paddleWidth = 10;
const paddleHeight = 100;
const paddleGap = 10;

const player = {
    x: paddleGap,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    score: 0
};

const computer = {
    x: canvas.width - paddleWidth - paddleGap,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    score: 0
};

// Définition de la balle
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 4,
    dx: 4,
    dy: 4
};

// Dessiner les raquettes
function drawPaddle(x, y, width, height) {
    ctx.fillStyle = '#FFF';
    ctx.fillRect(x, y, width, height);
}

// Dessiner la balle
function drawBall(x, y, radius) {
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

// Afficher les scores
function drawScore() {
    ctx.fillStyle = '#FFF';
    ctx.font = '35px Arial';
    ctx.fillText(player.score, canvas.width / 4, 50);
    ctx.fillText(computer.score, 3 * canvas.width / 4, 50);
}

// Mise à jour de la position des raquettes
function updatePaddlePosition() {
    player.y += player.dy;

    // Mouvement de la raquette de l'ordinateur
    computer.dy = (ball.y - (computer.y + paddleHeight / 2)) * 0.09; // Ajustez la valeur 0.09 pour modifier la difficulté
    computer.y += computer.dy;

    // Limiter la position des raquettes dans les limites du canvas
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
    if (computer.y < 0) computer.y = 0;
    if (computer.y + computer.height > canvas.height) computer.y = canvas.height - computer.height;
}

// Mise à jour de la position de la balle
function updateBallPosition() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Rebond de la balle sur les bords du canvas
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy *= -1;
    }

    // Rebond de la balle sur les raquettes
    if (ball.x - ball.radius < player.x + player.width && ball.y > player.y && ball.y < player.y + player.height) {
        ball.dx = -ball.dx;
        ball.x = player.x + player.width + ball.radius; // Ajustement pour empêcher la balle de sortir du canvas
    } else if (ball.x + ball.radius > computer.x && ball.y > computer.y && ball.y < computer.y + computer.height) {
        ball.dx = -ball.dx;
        ball.x = computer.x - ball.radius; // Ajustement pour empêcher la balle de sortir du canvas
    }

    // Points
    if (ball.x + ball.radius < 0) { // Si le joueur manque la balle
        computer.score++;
        resetBall();
    } else if (ball.x - ball.radius > canvas.width) { // Si l'ordinateur manque la balle
        player.score++;
        resetBall();
    }
}

// Réinitialiser la position de la balle
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 4;
    ball.dy = 4;
}

// Dessiner le jeu
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(player.x, player.y, player.width, player.height);
    drawPaddle(computer.x, computer.y, computer.width, computer.height);
    drawBall(ball.x, ball.y, ball.radius);
    drawScore();
}

// Boucle de jeu
function gameLoop() {
    updatePaddlePosition();
    updateBallPosition();
    draw();
    requestAnimationFrame(gameLoop);
}

// Contrôles des raquettes
document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowUp') player.dy = -5;
    if (event.key === 'ArrowDown') player.dy = 5;
});

document.addEventListener('keyup', function (event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') player.dy = 0;
});

// Lancer le jeu
gameLoop();

