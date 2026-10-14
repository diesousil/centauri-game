
function getImage(imgSrc) {
  return new Promise((resolve, reject) => {
    const imgObj = document.createElement("img");
    
    imgObj.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = imgObj.width;
      canvas.height = imgObj.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(imgObj, 0, 0);

      const imageData = ctx.getImageData(0, 0, imgObj.width, imgObj.height).data;
      resolve({
        obj: imgObj,
        data: imageData
      });
    };

    imgObj.onerror = reject;
    imgObj.src = imgSrc;
  });
}

async function loadImages() {

    const playerImage = await getImage('./assets/images/player/player.png');

    let asteroids = [];
    for(let i=1;i<=7;i++) {
        let asteroidImage = await getImage('./assets/images/asteroid/asteroid'+i+'.png');
        asteroids.push(asteroidImage);
    }
    
    return {
        player: playerImage,
        asteroids: asteroids
    };
}

export {loadImages};