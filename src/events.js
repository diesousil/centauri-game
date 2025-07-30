function setEventHandling(canvas) {
    window.addEventListener('resize', handlerCanvasResize);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    function handlerCanvasResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function handleKeyDown(e) {
        if (gameState.gameOver) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                gameState.player.acceleration.x = -gameState.player.accelerationForce;
                break;
            case 'ArrowRight':
                gameState.player.acceleration.x = gameState.player.accelerationForce;
                break;
            case 'ArrowDown':
                gameState.player.acceleration.y = gameState.player.accelerationForce;
                break;
            case 'ArrowUp':
                gameState.player.acceleration.y = -gameState.player.accelerationForce;
                break;
        }
        
    }

    function handleKeyUp(e) {
        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowRight':
                gameState.player.acceleration.x = 0;
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                gameState.player.acceleration.y = 0;
                break;
        }
    }

    canvas.addEventListener('click', () => {
        if (gameState.gameOver) {
            resetGame();
        }
    });
}
