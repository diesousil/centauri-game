
// global variables defs
const canvas = document.getElementById('gameCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

let lastTime = 0;
let gameState = getStartGamestate();

const images = loadImages();

setEventHandling(canvas);
gameLoop(Date.now());