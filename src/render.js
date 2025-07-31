import { globals } from "./globals.js";

function drawRotatedImage(img, x, y, width, height, angle) {
    globals.ctx.save();
    globals.ctx.translate(x + width / 2, y + height / 2);
    globals.ctx.rotate(angle);
    globals.ctx.drawImage(img, -width / 2, -height / 2, width, height);
    globals.ctx.restore();
}

function drawParticles() {
    globals.gamestate.particles.forEach(p => {
        globals.ctx.beginPath();
        globals.ctx.fillStyle = p.color;
        globals.ctx.globalAlpha = p.life / 30;
        globals.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        globals.ctx.fill();
    });
    globals.ctx.globalAlpha = 1;
}

function renderSetup() {
    globals.ctx.strokeStyle = '#ccc';
    globals.ctx.lineWidth = 2;
}

function renderStars() {
    const stars = [];
    const numStars = 300;

    for (let i = 0; i < numStars; i++) {
        stars.push({
        x: Math.random() * globals.canvas.width,
        y: Math.random() * globals.canvas.height,
        radius: Math.random() * 1.5 + 0.2,
        alpha: Math.random(),
        delta: (Math.random() * 0.02) - 0.01 
        });
    }

    globals.ctx.fillStyle = 'black';
    globals.ctx.fillRect(0, 0, globals.canvas.width, globals.canvas.height);

    for (const star of stars) {
      star.alpha += star.delta;
      if (star.alpha <= 0 || star.alpha >= 1) star.delta *= -1;

      globals.ctx.beginPath();
      globals.ctx.globalAlpha = star.alpha;
      globals.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      globals.ctx.fillStyle = 'white';
      globals.ctx.fill();
    }

    globals.ctx.globalAlpha = 1;
}

function renderBackground() {
    globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
    
    globals.ctx.fillStyle = '#000000';
    globals.ctx.fillRect(0, 0, globals.canvas.width, globals.canvas.height);

    renderStars();
}

function renderPlayer() {    
    drawParticles();

    let angle = globals.gamestate.player.velocity.x * 0.04;
    drawRotatedImage(globals.images.player.obj, 
                     globals.gamestate.player.position.x, 
                     globals.gamestate.player.position.y, 
                     globals.gamestate.player.width,
                     globals.gamestate.player.height, angle);
}

function renderObstacles() {
    globals.ctx.fillStyle = '#e74c3c';
    
    globals.gamestate.obstacles.forEach(obstacle => {
        const angle=0;
        drawRotatedImage(obstacle.image.obj, obstacle.x, obstacle.y, obstacle.width, obstacle.height, angle);
    });
}

function renderStats() {
    globals.ctx.fillStyle = '#fff';
    globals.ctx.font = '24px Arial';
    globals.ctx.fillText(`Score: ${globals.gamestate.score}`, 20, 40);
}

function renderGameOver() {
    if (globals.gamestate.gameOver) {
        globals.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        globals.ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        globals.ctx.fillStyle = '#fff';
        globals.ctx.font = '48px Arial';
        globals.ctx.textAlign = 'center';
        globals.ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        globals.ctx.font = '24px Arial';
        globals.ctx.fillText(`Final Score: ${globals.gamestate.score}`, canvas.width / 2, canvas.height / 2 + 50);
        globals.ctx.fillText('Clique para recomeçar', canvas.width / 2, canvas.height / 2 + 100);
        globals.ctx.textAlign = 'left';
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

export {render};