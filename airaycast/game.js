const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
  x: 5,
  y: 5,
  angle: Math.PI / 4, // starting angle (45 degrees)
  speed: 0.03,
  rotationSpeed: 0.03,
  movingForward: false,
  movingBackward: false,
  turningLeft: false,
  turningRight: false
};

// Player health
let playerHealth = 100;

// Function to render the health bar
function renderHealthBar() {
  ctx.fillStyle = 'red';
  ctx.fillRect(10, 10, 200, 20);  // Background bar (red)

  ctx.fillStyle = 'green';
  ctx.fillRect(10, 10, 2 * playerHealth, 20);  // Foreground bar (green)
  
  // Text display for health
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.fillText(`Health: ${playerHealth}%`, 10, 45);
}

// Call this function in the game loop after drawing FPS and before any other rendering

// Projectiles array
let projectiles = [];

// Projectile constructor
function Projectile(x, y, angle) {
  this.x = x;
  this.y = y;
  this.angle = angle;  // Direction the player is facing
  this.speed = 0.5;     // Speed of the projectile
  this.maxDistance = 100; // Max distance the projectile can travel before disappearing
  this.travelled = 0;   // How far the projectile has travelled
  this.hitWall = false; // Whether the projectile has hit a wall
}

// Cast the projectile as a ray (same as raycasting)
Projectile.prototype.castRay = function() {
  let rayX = this.x;
  let rayY = this.y;
  let stepSize = 0.1; // The step size to move the ray

  while (this.travelled < this.maxDistance && !this.hitWall) {
    rayX += Math.cos(this.angle) * stepSize;
    rayY += Math.sin(this.angle) * stepSize;
    this.travelled += stepSize;

    const mapX = Math.floor(rayX);
    const mapY = Math.floor(rayY);

    // Check if the ray intersects with a wall (value of 1 in the map)
    if (map[mapY] && map[mapY][mapX] === 1) {
      this.hitWall = true;
      return { x: rayX, y: rayY };  // Return the collision point
    }
  }
  
  return { x: rayX, y: rayY }; // Return the final position if no collision occurs
}

// Update the projectile
Projectile.prototype.update = function() {
  const collisionPoint = this.castRay();

  // If the projectile hit a wall, we stop it and return true (to remove it)
  if (this.hitWall) {
    return true;
  }

  // Otherwise, keep updating the position based on the raycasting
  this.x = collisionPoint.x;
  this.y = collisionPoint.y;

  return false;  // Keep the projectile alive
};

// Draw the projectile as a line (similar to a ray)
Projectile.prototype.draw = function() {
  ctx.strokeStyle = 'yellow';
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(this.x + Math.cos(this.angle) * 10, this.y + Math.sin(this.angle) * 10);
  ctx.stroke();
};

// Create a new projectile when the spacebar is pressed
document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {  // Spacebar to shoot
    const newProjectile = new Projectile(player.x, player.y, player.angle);
    projectiles.push(newProjectile);
  }
});

// Update and render projectiles in the game loop
function updateProjectiles() {
  for (let i = 0; i < projectiles.length; i++) {
    if (projectiles[i].update()) {
      // Remove the projectile if it hit a wall or exceeded max distance
      projectiles.splice(i, 1);
      i--; // Adjust the index due to array modification
    } else {
      projectiles[i].draw();
    }
  }
}


// Map layout: 1 = wall, 0 = empty space
const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const TILE_SIZE = 64;
const FOV = Math.PI / 3; // field of view
const NUM_RAYS = 160; // Reduced number of rays for better performance
const MAX_DEPTH = 20; // max distance to render walls
const WALL_HEIGHT = canvas.height / 2;

let lastFrameTime = 0;
let fps = 0;

// Load the texture image
const wallTexture = document.createElement('img');
wallTexture.src = 'https://placehold.co/600x400'; // Placeholder image for texture

// Wait for the texture to load before starting the game loop
wallTexture.onload = () => {
  gameLoop();
};

function gameLoop(timestamp) {
  const deltaTime = timestamp - lastFrameTime;
  lastFrameTime = timestamp;

  fps = Math.round(1000 / deltaTime); // Calculate FPS
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas

  handleMovement();
  castRays();
  updateProjectiles();  // Update and draw projectiles
  renderHealthBar();  // Render the health bar
  drawFPS();

  // Request the next frame to keep the game running smoothly
  requestAnimationFrame(gameLoop);
}


function handleMovement() {
  let moveX = 0;
  let moveY = 0;

  // Movement controls (up, down, left, right)
  if (player.movingForward) {
    moveX += Math.cos(player.angle) * player.speed;
    moveY += Math.sin(player.angle) * player.speed;
  }
  if (player.movingBackward) {
    moveX -= Math.cos(player.angle) * player.speed;
    moveY -= Math.sin(player.angle) * player.speed;
  }

  // Normalize diagonal movement
  const length = Math.sqrt(moveX * moveX + moveY * moveY);
  if (length > player.speed) {
    moveX *= player.speed / length;
    moveY *= player.speed / length;
  }

  // Apply movement with collision checks
  if (canMoveTo(player.x + moveX, player.y)) {
    player.x += moveX;
  }
  if (canMoveTo(player.x, player.y + moveY)) {
    player.y += moveY;
  }

  // Rotation controls (left, right)
  if (player.turningLeft) {
    player.angle -= player.rotationSpeed;
  }
  if (player.turningRight) {
    player.angle += player.rotationSpeed;
  }
}

function castRays() {
  const startAngle = player.angle - FOV / 2;
  for (let i = 0; i < NUM_RAYS; i++) {
    const rayAngle = startAngle + (i / NUM_RAYS) * FOV;
    const { distance, wallHeight, textureX } = castSingleRay(rayAngle);

    // Lighting effect: dim the color of farther walls
    const brightness = Math.max(0, Math.min(255, 255 - distance * 10));
    ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;

    // Render the wall slice with texture
    renderWallSlice(i, wallHeight, textureX);
  }
}

function renderWallSlice(rayIndex, wallHeight, textureX) {
  const sliceWidth = canvas.width / NUM_RAYS;

  // Wall slice is centered vertically on the canvas
  const wallTop = (canvas.height - wallHeight) / 2;
  const wallBottom = (canvas.height + wallHeight) / 2;

  // Draw the texture portion for the current slice
  const textureHeight = wallTexture.height;
  const textureY = 0; // Y-coordinate in texture (start at the top of the texture)

  // Ensure that textureX is within bounds
  textureX = Math.min(wallTexture.width - 1, Math.max(0, textureX));

  // Draw the portion of the texture to the canvas
  ctx.drawImage(
    wallTexture,                          // The texture image
    textureX, 0,                           // X, Y position in the texture
    1, wallTexture.height,                 // The width and height of the texture slice (1px wide and full height)
    rayIndex * sliceWidth, wallTop,        // Position and size on the canvas
    sliceWidth, wallHeight                 // Size of the slice (scaled to the wall height)
  );
}

function castSingleRay(rayAngle) {
  let distance = 0;
  let x = player.x;
  let y = player.y;
  const deltaX = Math.cos(rayAngle);
  const deltaY = Math.sin(rayAngle);

  while (distance < MAX_DEPTH) {
    x += deltaX * 0.1;
    y += deltaY * 0.1;
    distance += 0.1;

    const mapX = Math.floor(x);
    const mapY = Math.floor(y);

    if (map[mapY] && map[mapY][mapX] === 1) {
      // Calculate the wall height based on the distance
      const wallHeight = Math.min(WALL_HEIGHT / distance, canvas.height);

      // Texture mapping: Calculate which column of the texture to use
      const textureX = Math.floor((x % TILE_SIZE) / TILE_SIZE * wallTexture.width);
      return { distance, wallHeight, textureX };
    }
  }

  return { distance, wallHeight: 0, textureX: 0 };
}

function canMoveTo(x, y) {
  const mapX = Math.floor(x);
  const mapY = Math.floor(y);
  return map[mapY] && map[mapY][mapX] !== 1;  // Check for wall at the given position
}

function drawFPS() {
  ctx.font = '24px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(`FPS: ${fps}`, 10, 30);
}

// Key event handlers for player movement
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') player.movingForward = true;
  if (e.key === 'ArrowDown') player.movingBackward = true;
  if (e.key === 'ArrowLeft') player.turningLeft = true;
  if (e.key === 'ArrowRight') player.turningRight = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp') player.movingForward = false;
  if (e.key === 'ArrowDown') player.movingBackward = false;
  if (e.key === 'ArrowLeft') player.turningLeft = false;
  if (e.key === 'ArrowRight') player.turningRight = false;
});
