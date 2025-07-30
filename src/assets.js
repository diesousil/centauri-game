function loadImages() {

    const playerImage = new Image();
    playerImage.src = './assets/images/player/player.png';

    let asteroids = [];
    for(let i=1;i<=7;i++) {
        let asteroidImage = new Image();
        asteroidImage.src = './assets/images/asteroid/asteroid'+i+'.png';
        asteroids.push(asteroidImage);
    }
    
    return {
        player: playerImage,
        asteroids: asteroids
    };
}