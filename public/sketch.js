// NY1609 - Pre-European Manhattan Game
// Main character: Aiyana, a 16-year-old Lenape boy

let player;
let trees = [];
let animals = [];
let score = 0;
let health = 100;
let camera = { x: 0, y: 0, z: 0 };
let introMode = true;
let introTimer = 0;
let introDuration = 120; // 2 seconds at 60fps

function setup() {
  // Manhattan proportions in 3D: narrow and long
  createCanvas(800, 1200, WEBGL);
  
  // Initialize player in lower Manhattan (southern tip)
  player = {
    x: 0,
    y: 0,
    z: 500, // Start at southern tip
    vx: 0,
    vy: 0,
    vz: 0,
    size: 15,
    speed: 2
  };
  
  // Create trees distributed across Manhattan's 3D shape
  for (let i = 0; i < 60; i++) {
    let z = random(-600, 600); // Length of Manhattan
    let maxWidth = getManhattanWidth3D(z);
    trees.push({
      x: random(-maxWidth/2, maxWidth/2),
      y: getTerrainHeight(random(-maxWidth/2, maxWidth/2), z),
      z: z,
      height: random(30, 60),
      radius: random(8, 15)
    });
  }
  
  // Create animals across Manhattan
  for (let i = 0; i < 20; i++) {
    let z = random(-600, 600);
    let maxWidth = getManhattanWidth3D(z);
    animals.push({
      x: random(-maxWidth/2, maxWidth/2),
      y: 0,
      z: z,
      vx: random(-0.5, 0.5),
      vy: 0,
      vz: random(-0.5, 0.5),
      size: random(4, 8),
      wanderTimer: 0
    });
  }
  
  console.log("NY1609 - Welcome to pre-European Manhattan in 3D!");
}

function draw() {
  background(0, 0, 0, 0); // Transparent background
  
  // Lighting
  ambientLight(150);
  directionalLight(255, 255, 255, -0.5, -1, -0.3);
  
  // Handle intro animation
  if (introMode) {
    updateIntroAnimation();
  } else {
    // Update game objects normally
    updatePlayer();
    updateAnimals();
    updateCamera();
  }
  
  // Set up 3D camera view
  if (introMode) {
    // Dynamic intro camera with visible rotation
    let progress = introTimer / introDuration;
    let rotationX = lerp(-0.1, -0.4, progress); // Gradually tilt down
    let rotationY = sin(progress * PI * 2) * 0.2; // Oscillating rotation for dynamic movement
    
    rotateX(rotationX);
    rotateY(rotationY);
    translate(-camera.x, -camera.y, -camera.z);
  } else {
    // Normal gameplay camera
    rotateX(-0.4); // Tilt down to see the island
    rotateY(0.1);  // Slight rotation for better perspective
    translate(-camera.x, -camera.y, -camera.z);
  }
  
  // Draw Manhattan Island in 3D
  drawManhattanIsland3D();
  drawTrees3D();
  drawAnimals3D();
  drawPlayer3D();
  
  // Update UI
  updateUI();
  
  // Skip text overlay to avoid WEBGL font errors
  // Focus on camera movement animation
}

// Function to get Manhattan's width at different Z positions (3D) - More detailed
function getManhattanWidth3D(z) {
  // Normalize z position (-600 to 600 becomes 0 to 1)
  let normalizedZ = (z + 600) / 1200;
  
  // More detailed Manhattan geography based on real coastline
  if (normalizedZ < 0.05) { // Battery Park - very narrow southern tip
    return 45;
  } else if (normalizedZ < 0.1) { // Financial District
    return 65;
  } else if (normalizedZ < 0.15) { // South Street Seaport area
    return 85;
  } else if (normalizedZ < 0.2) { // Brooklyn Bridge area
    return 95;
  } else if (normalizedZ < 0.25) { // Lower East Side
    return 105;
  } else if (normalizedZ < 0.3) { // Chinatown/Little Italy
    return 115;
  } else if (normalizedZ < 0.35) { // SoHo/Tribeca
    return 125;
  } else if (normalizedZ < 0.4) { // Greenwich Village
    return 135;
  } else if (normalizedZ < 0.45) { // Chelsea
    return 145;
  } else if (normalizedZ < 0.5) { // Midtown South
    return 155;
  } else if (normalizedZ < 0.55) { // Times Square area - widest part
    return 165;
  } else if (normalizedZ < 0.6) { // Central Park South
    return 160;
  } else if (normalizedZ < 0.65) { // Central Park area
    return 155;
  } else if (normalizedZ < 0.7) { // Upper East/West Side
    return 150;
  } else if (normalizedZ < 0.75) { // Harlem
    return 140;
  } else if (normalizedZ < 0.8) { // Upper Harlem
    return 130;
  } else if (normalizedZ < 0.85) { // Washington Heights
    return 120;
  } else if (normalizedZ < 0.9) { // Fort Tryon area
    return 110;
  } else if (normalizedZ < 0.95) { // Inwood
    return 95;
  } else { // Northern tip - Spuyten Duyvil
    return 75;
  }
}

function getTerrainHeight(x, z) {
  // Generate terrain height using noise
  return noise(x * 0.01, z * 0.01) * 20 - 10;
}

function drawManhattanIsland3D() {
  // Draw Manhattan as a detailed 3D landmass with accurate geography
  fill(34, 139, 34); // Green grass
  noStroke();
  
  // Create Manhattan's detailed shape using smaller cross-sections for accuracy
  for (let z = -600; z < 600; z += 10) { // Smaller increments for more detail
    let width = getManhattanWidth3D(z);
    
    // Draw terrain segments with more detail
    for (let x = -width/2; x < width/2; x += 8) { // Smaller segments for smoother coastline
      let height = getTerrainHeight(x, z);
      
      // Add geographic variation based on real Manhattan features
      let geoHeight = getGeographicHeight(x, z);
      
      push();
      translate(x, height + geoHeight, z);
      box(8, 6 + geoHeight, 10);
      pop();
    }
  }
  
  // Add specific Manhattan geographic features
  drawManhattanFeatures();
}

function getGeographicHeight(x, z) {
  let normalizedZ = (z + 600) / 1200;
  let height = 0;
  
  // Add elevation for specific Manhattan areas
  if (normalizedZ > 0.8 && normalizedZ < 0.95) { // Washington Heights/Fort Tryon - highest point
    height += 15 * (1 - abs(x) / getManhattanWidth3D(z) * 2); // Higher in center
  } else if (normalizedZ > 0.4 && normalizedZ < 0.7) { // Central Park area - slight elevation
    height += 8 * (1 - abs(x) / getManhattanWidth3D(z) * 2);
  } else if (normalizedZ < 0.1) { // Lower Manhattan - mostly flat
    height += 2;
  }
  
  return height;
}

function drawManhattanFeatures() {
  // Central Park area (more detailed)
  fill(50, 150, 50);
  push();
  translate(0, 5, -100); // Central Park location
  box(80, 3, 150);
  pop();
  
  // Washington Heights elevation
  fill(60, 120, 60);
  push();
  translate(0, 12, 400); // Washington Heights
  box(60, 8, 80);
  pop();
  
  // Battery Park
  fill(40, 130, 40);
  push();
  translate(0, 2, 580); // Southern tip
  box(30, 2, 40);
  pop();
  
  // Add small hills and rocky outcrops throughout Manhattan
  fill(80, 100, 80);
  for (let i = 0; i < 12; i++) {
    let hillZ = random(-500, 500);
    let hillWidth = getManhattanWidth3D(hillZ);
    let hillX = random(-hillWidth/3, hillWidth/3);
    let hillHeight = random(3, 8);
    
    push();
    translate(hillX, hillHeight, hillZ);
    box(random(15, 25), hillHeight, random(15, 25));
    pop();
  }
  
  // Add Manhattan schist rock formations
  fill(120, 120, 120);
  for (let i = 0; i < 8; i++) {
    let rockZ = random(-400, 400);
    let rockWidth = getManhattanWidth3D(rockZ);
    let rockX = random(-rockWidth/4, rockWidth/4);
    
    push();
    translate(rockX, 3, rockZ);
    box(random(8, 15), random(4, 8), random(8, 15));
    pop();
  }
}

function drawWater3D() {
  // Draw unified water plane representing Manhattan's surrounding waters
  push();
  fill(65, 105, 225); // Clean blue water
  noStroke();
  
  // Single large water plane covering the entire area around Manhattan
  push();
  translate(0, 5, 0); // Slightly below terrain level
  rotateX(PI/2);
  plane(1000, 1400); // Large unified plane covering all water areas
  pop();
  
  pop();
}

function drawTrees3D() {
  for (let tree of trees) {
    let distToPlayer = dist(tree.x, tree.z, player.x, player.z);
    if (distToPlayer < 200) { // Only draw nearby trees for performance
      // Tree trunk
      push();
      fill(101, 67, 33); // Brown
      translate(tree.x, tree.y + tree.height/2, tree.z);
      cylinder(3, tree.height);
      pop();
      
      // Tree foliage
      push();
      fill(34, 85, 34); // Dark green
      translate(tree.x, tree.y + tree.height - tree.radius/2, tree.z);
      sphere(tree.radius);
      pop();
    }
  }
}

function drawAnimals3D() {
  for (let animal of animals) {
    let distToPlayer = dist(animal.x, animal.z, player.x, player.z);
    if (distToPlayer < 150) {
      push();
      fill(139, 69, 19); // Brown
      translate(animal.x, animal.y + animal.size/2, animal.z);
      sphere(animal.size);
      pop();
    }
  }
}

function drawPlayer3D() {
  push();
  
  // Player body
  fill(139, 69, 19); // Brown skin
  translate(player.x, player.y, player.z);
  cylinder(player.size/3, player.size);
  
  // Player head
  push();
  translate(0, -player.size/2 - 5, 0);
  sphere(5);
  pop();
  
  // Traditional clothing
  push();
  fill(101, 67, 33); // Brown clothing
  translate(0, -2, 0);
  cylinder(player.size/3 + 1, player.size/2);
  pop();
  
  pop();
}

function updatePlayer() {
  // Handle input
  if (keyIsDown(87) || keyIsDown(UP_ARROW)) { // W - North (negative Z)
    player.vz -= player.speed * 0.1;
  }
  if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) { // S - South (positive Z)
    player.vz += player.speed * 0.1;
  }
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) { // A - West (negative X)
    player.vx -= player.speed * 0.1;
  }
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) { // D - East (positive X)
    player.vx += player.speed * 0.1;
  }
  
  // Apply friction
  player.vx *= 0.9;
  player.vz *= 0.9;
  
  // Update position
  player.x += player.vx;
  player.z += player.vz;
  
  // Keep player within Manhattan's 3D boundaries
  let maxWidth = getManhattanWidth3D(player.z);
  player.x = constrain(player.x, -maxWidth/2 + 10, maxWidth/2 - 10);
  player.z = constrain(player.z, -590, 590);
  
  // Set player height to terrain
  player.y = getTerrainHeight(player.x, player.z) + 8;
}

function updateAnimals() {
  for (let animal of animals) {
    animal.wanderTimer++;
    
    // Change direction occasionally
    if (animal.wanderTimer > 120) {
      animal.vx = random(-0.3, 0.3);
      animal.vz = random(-0.3, 0.3);
      animal.wanderTimer = 0;
    }
    
    // Move animal
    animal.x += animal.vx;
    animal.z += animal.vz;
    
    // Keep animals within Manhattan's boundaries
    let maxWidth = getManhattanWidth3D(animal.z);
    if (animal.x < -maxWidth/2 + 5 || animal.x > maxWidth/2 - 5) animal.vx *= -1;
    if (animal.z < -590 || animal.z > 590) animal.vz *= -1;
    
    // Set animal height to terrain
    animal.y = getTerrainHeight(animal.x, animal.z);
    
    // Run from player
    let distToPlayer = dist(animal.x, animal.z, player.x, player.z);
    if (distToPlayer < 40) {
      let angle = atan2(animal.z - player.z, animal.x - player.x);
      animal.vx = cos(angle) * 1.5;
      animal.vz = sin(angle) * 1.5;
      
      // Award points
      if (frameCount % 60 === 0) {
        score += 1;
      }
    }
  }
}

function updateCamera() {
  // Third-person camera following player with closer 3D view
  camera.x = lerp(camera.x, player.x, 0.05);
  camera.y = lerp(camera.y, player.y - 75, 0.05); // Closer height to match intro end
  camera.z = lerp(camera.z, player.z + 100, 0.05); // Closer distance to match intro end
}
function updateIntroAnimation() {
  introTimer++;
  
  // Intro camera positioning with visible movement
  let progress = introTimer / introDuration;
  let easeProgress = 1 - pow(1 - progress, 3); // Ease out cubic
  
  if (introTimer < introDuration) {
    // Camera orbits around the player while pulling back
    let orbitAngle = progress * PI * 2; // Full 360-degree orbit during intro
    
    // Start 50% closer (15 units), finish 200% further zoomed in (100 units instead of 200)
    let orbitRadius = lerp(15, 100, easeProgress); // Much closer start and closer end
    
    // Calculate orbital position
    let orbitX = player.x + cos(orbitAngle) * orbitRadius;
    let orbitZ = player.z + sin(orbitAngle) * orbitRadius;
    
    // Height movement - starts low, rises up, then settles to closer final position
    let heightProgress = progress * 2; // Double speed for height
    let targetHeight;
    if (heightProgress < 1) {
      // First half: rise up dramatically
      targetHeight = lerp(5, 60, heightProgress); // Start closer to ground
    } else {
      // Second half: settle to closer final height (75 instead of 150)
      targetHeight = lerp(60, 75, heightProgress - 1);
    }
    
    // Smooth camera movement to orbital position
    camera.x = lerp(camera.x, orbitX, 0.12); // Faster movement for shorter duration
    camera.y = lerp(camera.y, player.y - targetHeight, 0.12);
    camera.z = lerp(camera.z, orbitZ, 0.12);
    
    // Add slight camera shake for dynamic feel
    if (progress < 0.3) {
      camera.x += sin(introTimer * 0.5) * 1.5; // Adjusted for shorter duration
      camera.y += cos(introTimer * 0.3) * 0.8;
    }
  } else {
    // Transition to normal gameplay
    introMode = false;
    console.log("Welcome to Manhattan Island, 1609! Explore as Aiyana, young Lenape warrior.");
  }
}

function drawIntroOverlay() {
  // Draw 2D overlay text during intro
  push();
  // Reset all transformations for 2D overlay
  resetMatrix();
  
  // Semi-transparent background
  fill(0, 0, 0, 100);
  rect(0, 0, width, height);
  
  // Title text
  fill(255, 255, 255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("NY1609", width/2, height/2 - 100);
  
  textSize(18);
  text("Manhattan Island, Pre-European Era", width/2, height/2 - 60);
  
  textSize(14);
  text("Meet Aiyana, 16-year-old Lenape warrior", width/2, height/2 - 20);
  
  // Fade out effect
  let fadeProgress = introTimer / introDuration;
  if (fadeProgress > 0.7) {
    let fadeAlpha = map(fadeProgress, 0.7, 1.0, 0, 255);
    fill(135, 206, 235, fadeAlpha); // Sky blue fade
    rect(0, 0, width, height);
  }
  
  pop();
}

function updateUI() {
  document.getElementById('healthValue').textContent = health;
  document.getElementById('scoreValue').textContent = score;
}

function keyPressed() {
  if (key === ' ') {
    score += 5;
    console.log("Aiyana leaps with ancestral grace!");
  }
  
  if (key === 'e' || key === 'E') {
    // Check interactions
    for (let tree of trees) {
      if (dist(tree.x, tree.z, player.x, player.z) < 25) {
        score += 10;
        console.log("Aiyana gathers resources from the ancient forest!");
        break;
      }
    }
    
    for (let animal of animals) {
      if (dist(animal.x, animal.z, player.x, player.z) < 20) {
        score += 15;
        console.log("Aiyana observes the sacred wildlife!");
        break;
      }
    }
  }
}

// Continuous scoring
setInterval(() => {
  score += 1;
}, 3000);