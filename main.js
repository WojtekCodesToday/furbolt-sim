import './style.css';

document.title = "Furbolt Simulator";
const loadImage = (s) => { let i = new Image(); i.src = s; return i; }
const paths = {
  sprite: "./sprites/furbolt/",
  favIcon: "favicon.png",
  warn: "./sprites/objects/warning.png",
  map: "./sprites/map/main.png",
  loadingText: "./sprites/text/loading.png",
  cafeImg: "./sprites/buildings/cafe.png"
};

const constants = {
  furboltWidth: 100,
  furboltHeight: 100,
  speed: 200,
  sprintSpeedMultiplier: 4,
  normalSpeedMultiplier: 2,
  savingProgressTimeoutDuration: 20000
};

const game = document.createElement("canvas");
game.id = "game";
const ctx = game.getContext("2d");
ctx.font = "50px serif";
const loadingImg = loadImage(paths.loadingText)
loadingImg.onload = () => {
  ctx.drawImage(loadingImg, game.width - loadingImg.width / 2, game.height - loadingImg.height / 2);
}

let furbolt = {
  x: 0,
  y: 0,
  image: new Image(),
  state: 'idle',
  sprinting: false,
};

let keysPressed = {};
let lastFrameTime = performance.now();
const init = () => window.requestAnimationFrame(tick);
furbolt.image.src = paths.sprite + 'idle.png';
const mapImg = loadImage(paths.map);
mapImg.onload = () => {
  furbolt.x = (game.width - constants.furboltWidth) / 2;
  furbolt.y = (game.height - constants.furboltHeight) / 2;
  init(); // Start the game loop once the furbolt image is loaded
};

document.addEventListener('keydown', (event) => {
  keysPressed[event.key] = true;
  if (event.key === 'z') {
    furbolt.sprinting = true;
  }
  furbolt.state = (keysPressed['w'] || keysPressed['s'] || keysPressed['a'] || keysPressed['d']) ? 'move' : 'idle';
  furbolt.image = loadImage(paths.sprite + ((furbolt.sprinting) ? 'sprint.png' : 'move.png'));
});

document.addEventListener('keyup', (event) => {
  delete keysPressed[event.key];
  if (Object.keys(keysPressed).length === 0) {
    furbolt.state = 'idle';
    furbolt.sprinting = false;
    furbolt.image = loadImage(paths.sprite + 'idle.png');
  } else {
    furbolt.state = 'move';
    furbolt.image = loadImage(paths.sprite + ((furbolt.sprinting) ? 'sprint.png' : 'move.png'));
  }
});

const flipImage = (img) => {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(img, 0, 0);
  return canvas;
}

let gamePaused = false;

document.addEventListener("visibilitychange", () => {
  gamePaused = document.hidden;
});

const tick = () => {
  if (gamePaused) {
    window.requestAnimationFrame(tick); // Keep requesting animation frame when the game is paused
    return;
  }

  const now = performance.now();
  const deltaTime = (now - lastFrameTime) / 1000; // Convert to seconds
  lastFrameTime = now;

  ctx.clearRect(0, 0, game.width, game.height);

  game.width = window.innerWidth;
  game.height = window.innerHeight;
  const mapSectionWidth = mapImg.width / 5;
  const mapSectionHeight = mapImg.height / 5;

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const sx = i * mapSectionWidth;
      const sy = j * mapSectionHeight;
      const sWidth = mapSectionWidth;
      const sHeight = mapSectionHeight;

      const dx = game.width / 2 - mapImg.width / 2 + (i * mapSectionWidth) - furbolt.x;
      const dy = game.height / 2 - mapImg.height / 2 + (j * mapSectionHeight) - furbolt.y;
      const dWidth = mapSectionWidth;
      const dHeight = mapSectionHeight;

      ctx.drawImage(mapImg, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }
  }

  const speed = constants.speed;
  const multiplier = furbolt.sprinting ? constants.sprintSpeedMultiplier : constants.normalSpeedMultiplier;
  const prevX = furbolt.x; // Store the previous position
  const prevY = furbolt.y; // Store the previous position

  if (keysPressed['w']) {
    furbolt.y -= multiplier * speed * deltaTime;
  }
  if (keysPressed['s']) {
    furbolt.y += multiplier * speed * deltaTime;
  }
  if (keysPressed['a']) {
    furbolt.x -= multiplier * speed * deltaTime;
  }
  if (keysPressed['d']) {
    furbolt.x += multiplier * speed * deltaTime;
  }

  const furboltX = (game.width - constants.furboltWidth) / 2;
  const furboltY = (game.height - constants.furboltHeight) / 2;
  const defaultX = game.width / 2 - furbolt.x;
  const defaultY = game.height / 2 - furbolt.y;

  let offsetX = 1219.47; // Adjust these values based on your hitbox position
  let offsetY = 829.92; // Adjust these values based on your hitbox position
  let a = loadImage(paths.cafeImg)
  // Collision check with cafe hitbox
  try {
    const cafeHitbox = loadImage(paths.cafeImg.replace(".png", "-hitbox.png"));
    ctx.drawImage(cafeHitbox, defaultX - offsetX, defaultY - offsetY);
    const cafeCollisionData = ctx.getImageData(furboltX, furboltY, constants.furboltWidth, constants.furboltHeight).data;
    if (cafeCollisionData.some((value, index) => index % 4 === 0 && value === 255)) {
      // Collision detected with cafe hitbox
      furbolt.x = prevX; // Revert to the previous position
      furbolt.y = prevY; // Revert to the previous position
    }
  } catch (err) {
    console.error("Error checking collision with cafe hitbox:", err);
  }

  // Draw cafe image
  ctx.drawImage(a, 0, a.height/2, a.width, a.height / 2, defaultX - 1219.47, defaultY - 829.92 + a.height/2, a.width, a.height/2);
  
  // Draw warnImg at its own place
  const warnOffsetX = 94.3; // Adjust these values based on the position of warnImg
  const warnOffsetY = 353.94; // Adjust these values based on the position of warnImg
  drawObjectWithHitbox(loadImage(paths.warn), warnOffsetX, warnOffsetY);

  // Draw furbolt image first
  try {
    if (furbolt.state === 'idle') {
      ctx.drawImage(furbolt.image, furboltX, furboltY, constants.furboltWidth, constants.furboltHeight);
    } else if (furbolt.state === 'move') {
      if (keysPressed['a']) {
        ctx.drawImage(flipImage(furbolt.image), furboltX, furboltY, constants.furboltWidth, constants.furboltHeight);
      } else {
        ctx.drawImage(furbolt.image, furboltX, furboltY, constants.furboltWidth, constants.furboltHeight);
      }
    }
  } catch (err) {}
  ctx.drawImage(a, 0, 0, a.width, a.height / 2, defaultX - 1219.47, defaultY - 829.92, a.width, a.height/2);
  
  // Draw furbolt coordinates
  ctx.fillText(furbolt.x + " - " + furbolt.y, 10, 10);

  window.requestAnimationFrame(tick);
}

// Function to draw an object with its hitbox
const drawObjectWithHitbox = (src, offsetX, offsetY) => {
  const defaultX = game.width / 2 - furbolt.x;
  const defaultY = game.height / 2 - furbolt.y;

  // Draw hitbox
  ctx.save(); // Save the current canvas state
  try {
    ctx.drawImage(loadImage(src.replace(".png", "-hitbox.png")), defaultX - offsetX, defaultY - offsetY);
  } catch (err) { }
  ctx.restore(); // Restore the canvas state to hide the hitbox

  // Draw object
  try {
    ctx.drawImage(loadImage(src), defaultX - offsetX, defaultY - offsetY);
  } catch (err) { }
}

furbolt.x = 0; furbolt.y = 0;
document.body.appendChild(game);
