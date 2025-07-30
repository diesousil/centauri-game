
function drawRotatedImage(img, x, y, width, height, angle) {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(angle);
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();
}

function drawParticles() {
    gameState.particles.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

function renderSetup() {
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
}

function renderBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function renderPlayer() {    
    drawParticles();

    let angle = gameState.player.velocity.x * 0.04;
    drawRotatedImage(images.player, gameState.player.position.x, gameState.player.position.y, gameState.player.width, gameState.player.height, angle);
}

function renderObstacles() {
    ctx.fillStyle = '#e74c3c';
    gameState.obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function renderStats() {
    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${gameState.score}`, 20, 40);
}

function renderGameOver() {
    if (gameState.gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        ctx.font = '24px Arial';
        ctx.fillText(`Final Score: ${gameState.score}`, canvas.width / 2, canvas.height / 2 + 50);
        ctx.fillText('Clique para recomeçar', canvas.width / 2, canvas.height / 2 + 100);
        ctx.textAlign = 'left';
    }
}

function render() {    
    renderSetup();
    renderBackground();
    renderPlayer();
    renderObstacles();
    renderStats();
    renderGameOver();
}