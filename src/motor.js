function getStartGamestate() {
    return {
        player: { 
            position: {
                x: canvas.width / 2, 
                y: canvas.height - 100, 
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
        scrollSpeed: 3
    };
}

function updateVelocity() {
    gameState.player.velocity.x += gameState.player.acceleration.x
    gameState.player.velocity.y += gameState.player.acceleration.y;
    
    gameState.player.velocity.x = Math.max(-gameState.player.maxSpeed, 
                                        Math.min(gameState.player.maxSpeed, gameState.player.velocity.x));

    gameState.player.velocity.y = Math.max(-gameState.player.maxSpeed, 
                                        Math.min(gameState.player.maxSpeed, gameState.player.velocity.y));
    
    if (gameState.player.acceleration.x === 0) {
        gameState.player.velocity.x *= gameState.player.friction;
    }
    
    if (gameState.player.acceleration.y === 0) {
        gameState.player.velocity.y *= gameState.player.friction;
    }

    if (Math.abs(gameState.player.velocity.x) < 0.1) gameState.player.velocity.x = 0;
    if (Math.abs(gameState.player.velocity.y) < 0.1) gameState.player.velocity.y = 0;
}

function updatePosition(deltaTime) {
    
    gameState.player.position.x += gameState.player.velocity.x * deltaTime * 60; // *60 para compensar o deltaTime em segundos
    gameState.player.position.y += gameState.player.velocity.y * deltaTime * 60;
    
    gameState.player.position.x = Math.max(0, 
                                       Math.min(canvas.width - gameState.player.width, gameState.player.position.x));
    gameState.player.position.y = Math.max(0, 
                                       Math.min(canvas.height - gameState.player.height, gameState.player.position.y));
}


function updateMovement(deltaTime) {    
    updateVelocity();
    updatePosition(deltaTime)
}

function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastTime) / 1000; 
    lastTime = timestamp;
    
    if (!gameState.gameOver) {
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
    
    gameState.obstacles.forEach((obstacle, index) => {
        obstacle.y += gameState.scrollSpeed;
        
        if (checkCollision(gameState.player, obstacle)) {
            gameState.gameOver = true;
        }
        
        if (obstacle.y > canvas.height) {
            gameState.obstacles.splice(index, 1);
            gameState.score++;
            
            if (gameState.score % 5 === 0) {
                gameState.scrollSpeed += 0.2;
            }
        }
    });
}

function generateObstacle() {
    const width = 60 + Math.random() * 40;
    const height = 40 + Math.random() * 60;
    
    gameState.obstacles.push({
        x: Math.random() * (canvas.width - width),
        y: -height,
        width: width,
        height: height
    });
}

function checkCollision(player, obstacle) {
    return player.position.x < obstacle.x + obstacle.width &&
           player.position.x + player.width > obstacle.x &&
           player.position.y < obstacle.y + obstacle.height &&
           player.position.y + player.height > obstacle.y;
}

function resetGame() {
    gameState = getStartGamestate();
}