import { globals } from "./globals.js";
import { resetGame } from "./motor.js";

function setEventHandling(canvas) {

    window.addEventListener('resize', handlerCanvasResize);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    function handlerCanvasResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function handleKeyDown(e) {
        if (globals.gamestate.gameOver) return;
        switch(e.key) {
            case 'ArrowLeft':
                globals.gamestate.player.acceleration.x = -globals.gamestate.player.accelerationForce;
                break;
            case 'ArrowRight':
                globals.gamestate.player.acceleration.x = globals.gamestate.player.accelerationForce;
                break;
            case 'ArrowDown':
                globals.gamestate.player.acceleration.y = globals.gamestate.player.accelerationForce;
                break;
            case 'ArrowUp':
                globals.gamestate.player.acceleration.y = -globals.gamestate.player.accelerationForce;
                break;
        }
        
    }

    function handleKeyUp(e) {
        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowRight':
                globals.gamestate.player.acceleration.x = 0;
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                globals.gamestate.player.acceleration.y = 0;
                break;
        }
    }

    canvas.addEventListener('click', () => {
        if (globals.gamestate.gameOver) {
            resetGame();
        }
    });
}

export {setEventHandling};