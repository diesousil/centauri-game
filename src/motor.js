import { globals } from "./globals.js";
import { render } from "./render.js";

function getStartGamestate() {
    return {
        player: { 
            position: {
                x: globals.canvas.width / 2, 
                y: globals.canvas.height - 100, 
            },
            velocity: {
                x: 0, 
                y: 0, 
            },
            acceleration: {
                x: 0, 
                y: 0, 
            },
            width: 50, 
            height: 80,
            maxSpeed: 20,
            accelerationForce: 1.5,
            friction: 0.95
        },
        obstacles: [],
        score: 0,
        gameOver: false,
        scrollSpeed: 3,
        particles: []
    };
}

function getFlameColor() {
    const colors = ['#ffcc00', '#ff6600', '#ff3300'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function createThrusterParticles(player) {
    const intensity = Math.max(0, -player.velocity.y);
    const count = Math.floor(5 + intensity * 20);

    for (let i = 0; i < count; i++) {
        const size = Math.random() * 4 + 2;
        const speed = Math.random() * 2 + 1;
        const angle = (Math.PI / 2) + (Math.random() * 0.4 - 0.2); 

        globals.gamestate.particles.push({
            x: player.position.x + player.width / 2,
            y: player.position.y + player.height,
            vx: speed * Math.cos(angle),
            vy: speed * Math.sin(angle),
            size: size,
            life: 30,
            color: getFlameColor()
        });
    }
}

function updateVelocity() {
    globals.gamestate.player.velocity.x += globals.gamestate.player.acceleration.x
    globals.gamestate.player.velocity.y += globals.gamestate.player.acceleration.y;
    
    globals.gamestate.player.velocity.x = Math.max(-globals.gamestate.player.maxSpeed, 
                                        Math.min(globals.gamestate.player.maxSpeed, globals.gamestate.player.velocity.x));

    globals.gamestate.player.velocity.y = Math.max(-globals.gamestate.player.maxSpeed, 
                                        Math.min(globals.gamestate.player.maxSpeed, globals.gamestate.player.velocity.y));
    
    if (globals.gamestate.player.acceleration.x === 0) {
        globals.gamestate.player.velocity.x *= globals.gamestate.player.friction;
    }
    
    if (globals.gamestate.player.acceleration.y === 0) {
        globals.gamestate.player.velocity.y *= globals.gamestate.player.friction;
    }

    if (Math.abs(globals.gamestate.player.velocity.x) < 0.1) globals.gamestate.player.velocity.x = 0;
    if (Math.abs(globals.gamestate.player.velocity.y) < 0.1) globals.gamestate.player.velocity.y = 0;
}

function updatePosition(deltaTime) {
    
    globals.gamestate.player.position.x += globals.gamestate.player.velocity.x * deltaTime * 60;
    globals.gamestate.player.position.y += globals.gamestate.player.velocity.y * deltaTime * 60;
    
    globals.gamestate.player.position.x = Math.max(0, 
                                       Math.min(globals.canvas.width - globals.gamestate.player.width, globals.gamestate.player.position.x));
    globals.gamestate.player.position.y = Math.max(0, 
                                       Math.min(globals.canvas.height - globals.gamestate.player.height, globals.gamestate.player.position.y));
}


function updateMovement(deltaTime) {    
    updateVelocity();
    updatePosition(deltaTime)
}

function gameLoop(timestamp) {
    const deltaTime = (timestamp - globals.lastTime) / 1000; 
    globals.lastTime = timestamp;
    
    if (!globals.gamestate.gameOver) {
        update(deltaTime);
    }
    render();
    requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    updateMovement(deltaTime);
    
    if (Math.random() < 0.02) {
        generateObstacle();
    }
    
    globals.gamestate.obstacles.forEach((obstacle, index) => {
        obstacle.y += globals.gamestate.scrollSpeed;
        
        if (checkCollision(globals.gamestate.player, obstacle)) {
            globals.gamestate.gameOver = true;
        }
        
        if (obstacle.y > globals.canvas.height) {
            globals.gamestate.obstacles.splice(index, 1);
            globals.gamestate.score++;
            
            if (globals.gamestate.score % 5 === 0) {
                globals.gamestate.scrollSpeed += 0.2;
            }
        }
    });

    globals.gamestate.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
    });
    globals.gamestate.particles = globals.gamestate.particles.filter(p => p.life > 0);

    if (globals.gamestate.player.acceleration.y < 0) {
        createThrusterParticles(globals.gamestate.player);
    }
}

function generateObstacle() {

    const asteroidType = Math.round(Math.random() * 6);
    const asteroidImage = globals.images.asteroids[asteroidType];   
    const width = asteroidImage.obj.width;
    const height = asteroidImage.obj.height;
    
    globals.gamestate.obstacles.push({
        x: Math.random() * (globals.canvas.width - width),
        y: -height,
        image:asteroidImage,
        width: width,
        height: height
    });
}


function getOverlapArea(player, obstacle) {

    const xStart = Math.max(player.position.x, obstacle.x);
    const xOverlapWidth = Math.max(0, 
        Math.min(
            player.position.x + player.width,
            obstacle.x + obstacle.width
        ) - 
        Math.max(
            player.position.x, 
            obstacle.x
        ));

    const yStart = Math.max(player.position.y, obstacle.y);
    const yOverlapWidth = Math.max(0, 
            Math.min(
                player.position.y + player.height,
                obstacle.y + obstacle.height
            ) - 
            Math.max(
                player.position.y, obstacle.y
            ));

    return {
        x: xStart,
        y: yStart,
        xWidth: xOverlapWidth,
        yWidth: yOverlapWidth
    }
}

function checkCollision(player, obstacle) {

    const overlap = getOverlapArea(player, obstacle);

    if (overlap.xOverlapWidth === 0 || overlap.yOverlapWidth === 0) 
        return false;

    /*
  const playerData = globals.ctx.getImageData(
    xStart - player.position.x,
    yStart - player.position.y,
    xOverlap, yOverlap
  ).data;

  const obstacleData = ctx.getImageData(
    xStart - obstacle.x,
    yStart - obstacle.y,
    xOverlap, yOverlap
  ).data;
  
  for (let i = 0; i < xOverlap * yOverlap * 4; i += 4) {
    const playerAlpha = playerData[i + 3];
    const obstacleAlpha = obstacleData[i + 3];

    if (playerAlpha > 0 && obstacleAlpha > 0) {
      return true; 
    }
  }*/

  return false;
}

function resetGame() {
    globals.gamestate = getStartGamestate();
}

export {gameLoop, getStartGamestate, resetGame};