import { globals } from "./globals.js";
import { resetGame } from "./motor.js";

function setEventHandling(canvas) {

    window.addEventListener('resize', handlerCanvasResize);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });
    canvas.addEventListener('touchend', stopMovement, { passive: false });
    canvas.addEventListener('touchcancel', stopMovement, { passive: false });

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

    function handleTouch(e) {
        e.preventDefault();

        const touch = e.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        const player = globals.gamestate.player;
        const force = player.accelerationForce;

        player.acceleration.x = 0;
        player.acceleration.y = 0;

        if (x < width * 0.4) {
            player.acceleration.x = -force; 
        } else if (x > width * 0.6) {
            player.acceleration.x = force; 
        }

        if (y < height * 0.4) {
            player.acceleration.y = -force;
        } else if (y > height * 0.6) {
            player.acceleration.y = force; 
        }
    }

    function stopMovement(e) {
        e.preventDefault();
        const player = globals.gamestate.player;
        player.acceleration.x = 0;
        player.acceleration.y = 0;
    }

    canvas.addEventListener('click', () => {
        if (globals.gamestate.gameOver) {
            resetGame();
        }
    });
}

export {setEventHandling};