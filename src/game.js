import { globals } from "./globals.js";
import * as assets from "./assets.js";
import * as motor from "./motor.js";
import * as events from "./events.js";

async function setGlobals(canvas) {
    globals.canvas = canvas;
    globals.ctx = canvas.getContext('2d');
    globals.lastTime = 0;
    globals.gamestate = motor.getStartGamestate();
    globals.images = await assets.loadImages();
}

async function start() {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    await setGlobals(canvas);
    events.setEventHandling(canvas);
    motor.gameLoop(Date.now());
}

await start();
