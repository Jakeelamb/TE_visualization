// Ultra-simplified chromosomes visualization with 3D effects
let chromosomes = [
  { name: "X", length: 680, color: "#8BC34A" },
  { name: "2", length: 950 },
  { name: "3", length: 1000 },
  { name: "4", length: 160 },
  { name: "Y", length: 320, color: "#9E9E9E" }
];

let bands = [];
let transposableElements = [];
let animating = false;
let sourceIndex = -1;
let targetChromosome = -1;
let targetPosition = -1;
let animationProgress = 0;
let mutationShowing = false;
let mutationX = 0;
let mutationY = 0;
let mutationTimer = 0;

// Constants
const BAND_WIDTH = 3;
const CHROMOSOME_HEIGHT = 50;
const CHROMOSOME_SPACING = 30;
const START_X = 80;
const START_Y = 120;

function setup() {
  createCanvas(1100, 650); // Added extra height for button
  createBands();
  
  let button = createButton('Trigger Transposition');
  button.position(width/2 - 75, height - 30);
  button.mousePressed(triggerTransposition);
  button.style('background-color', '#4CAF50');
  button.style('color', 'white');
  button.style('border', 'none');
  button.style('padding', '10px 15px');
  button.style('border-radius', '5px');
  button.style('cursor', 'pointer');
}

function createBands() {
  bands = [];
  transposableElements = [];
  
  for (let i = 0; i < chromosomes.length; i++) {
    const bandCount = Math.floor(chromosomes[i].length / BAND_WIDTH);
    
    for (let j = 0; j < bandCount; j++) {
      // Determine band type (mostly introns, some exons)
      let type = random() < 0.3 ? "exon" : "intron";
      
      // Add some transposable elements
      if (random() < 0.05) {
        type = "transposable";
        transposableElements.push(bands.length); // Store the index of this element
      }
      
      bands.push({
        type: type,
        chromosome: i,
        position: j * BAND_WIDTH
      });
    }
  }
}

function triggerTransposition() {
  if (animating || mutationShowing || transposableElements.length === 0) return;
  
  // Select random transposable element
  sourceIndex = transposableElements[floor(random(transposableElements.length))];
  
  // Select random target position
  targetChromosome = floor(random(chromosomes.length));
  targetPosition = random(0, chromosomes[targetChromosome].length - BAND_WIDTH);
  
  animating = true;
  animationProgress = 0;
}

function draw() {
  background(245, 245, 250); // Slightly blue-tinted background
  drawChromosomes();
  drawBands();
  
  if (animating) {
    animateTransposition();
  }
  
  if (mutationShowing) {
    drawMutation();
  }
  
  drawHeader();
  drawLegend();
}

function drawChromosomes() {
  // Draw chromosome labels
  textAlign(RIGHT, CENTER);
  textSize(14);
  fill(0);
  for (let i = 0; i < chromosomes.length; i++) {
    text(chromosomes[i].name, START_X - 10, START_Y + i * (CHROMOSOME_HEIGHT + CHROMOSOME_SPACING) + CHROMOSOME_HEIGHT/2);
  }
  
  // Draw chromosome bodies with 3D effect
  for (let i = 0; i < chromosomes.length; i++) {
    const y = START_Y + i * (CHROMOSOME_HEIGHT + CHROMOSOME_SPACING);
    
    // Shadow for 3D effect
    noStroke();
    fill(200, 200, 200);
    rect(START_X + 3, y + 3, chromosomes[i].length, CHROMOSOME_HEIGHT, 10);
    
    // Main chromosome body
    if (chromosomes[i].color) {
      fill(chromosomes[i].color);
    } else {
      fill(230, 230, 235);
    }
    rect(START_X, y, chromosomes[i].length, CHROMOSOME_HEIGHT, 10);
    
    // Highlight for 3D effect
    fill(255, 255, 255, 30);
    rect(START_X, y, chromosomes[i].length, CHROMOSOME_HEIGHT/4, 10, 10, 0, 0);
  }
}

function drawBands() {
  for (let i = 0; i < bands.length; i++) {
    // Skip the source band if it's being animated
    if (animating && i === sourceIndex) continue;
    
    const band = bands[i];
    const x = START_X + band.position;
    const y = START_Y + band.chromosome * (CHROMOSOME_HEIGHT + CHROMOSOME_SPACING);
    
    // Only draw if within chromosome bounds
    if (band.position < chromosomes[band.chromosome].length) {
      // 3D effect for bands
      noStroke();
      if (band.type === "exon") {
        fill(82, 167, 86); // Darker for shadow
        rect(x+1, y+1, BAND_WIDTH, CHROMOSOME_HEIGHT);
        fill(102, 187, 106);
      }
      else if (band.type === "intron") {
        fill(121, 90, 79); // Darker for shadow
        rect(x+1, y+1, BAND_WIDTH, CHROMOSOME_HEIGHT);
        fill(141, 110, 99);
      }
      else if (band.type === "transposable") {
        fill(219, 63, 60); // Darker for shadow
        rect(x+1, y+1, BAND_WIDTH, CHROMOSOME_HEIGHT);
        fill(239, 83, 80);
      }
      
      rect(x, y, BAND_WIDTH, CHROMOSOME_HEIGHT);
      
      // Add highlight at top for 3D effect
      if (band.type === "exon") fill(122, 207, 126, 100);
      else if (band.type === "intron") fill(161, 130, 119, 100);
      else if (band.type === "transposable") fill(255, 103, 100, 100);
      rect(x, y, BAND_WIDTH, CHROMOSOME_HEIGHT/4);
    }
  }
}

function animateTransposition() {
  animationProgress += 0.04; // Faster animation
  
  if (animationProgress < 1) {
    // Source and target positions
    const sourceBand = bands[sourceIndex];
    const sourceX = START_X + sourceBand.position + BAND_WIDTH/2;
    const sourceY = START_Y + sourceBand.chromosome * (CHROMOSOME_HEIGHT + CHROMOSOME_SPACING) + CHROMOSOME_HEIGHT/2;
    
    const targetX = START_X + targetPosition + BAND_WIDTH/2;
    const targetY = START_Y + targetChromosome * (CHROMOSOME_HEIGHT + CHROMOSOME_SPACING) + CHROMOSOME_HEIGHT/2;
    
    // Animation path (simple arc)
    let t = animationProgress;
    let midX = (sourceX + targetX) / 2;
    let midY = min(sourceY, targetY) - 100;
    
    let curveX = bezierPoint(sourceX, midX, midX, targetX, t);
    let curveY = bezierPoint(sourceY, midY, midY, targetY, t);
    
    // Draw the moving element with 3D effect
    fill(219, 63, 60); // Shadow
    ellipse(curveX+2, curveY+2, BAND_WIDTH * 2, CHROMOSOME_HEIGHT * 0.8);
    fill(239, 83, 80);
    ellipse(curveX, curveY, BAND_WIDTH * 2, CHROMOSOME_HEIGHT * 0.8);
    fill(255, 103, 100, 150); // Highlight
    ellipse(curveX-1, curveY-1, BAND_WIDTH * 1.5, CHROMOSOME_HEIGHT * 0.5);
  } else {
    // Complete the transposition
    completeTransposition();
  }
}

function completeTransposition() {
  // Get the original element and create a new one at the target position
  const sourceBand = bands[sourceIndex];
  
  const newBand = {
    type: "transposable",
    chromosome: targetChromosome,
    position: targetPosition
  };
  
  // Check if insertion disrupts an exon
  let disruptsExon = false;
  for (let i = 0; i < bands.length; i++) {
    if (bands[i].type === "exon" && 
        bands[i].chromosome === targetChromosome &&
        Math.abs(bands[i].position - targetPosition) < BAND_WIDTH * 2) {
      
      mutationX = START_X + targetPosition + BAND_WIDTH/2;
      mutationY = START_Y + targetChromosome * (CHROMOSOME_HEIGHT + CHROMOSOME_SPACING) + CHROMOSOME_HEIGHT/2;
      disruptsExon = true;
      break;
    }
  }
  
  // Remove the element from the transposable elements array
  for (let i = 0; i < transposableElements.length; i++) {
    if (transposableElements[i] === sourceIndex) {
      transposableElements.splice(i, 1);
      break;
    }
  }
  
  // Add the new element to the bands array
  bands.push(newBand);
  
  // Add the new element index to transposable elements
  transposableElements.push(bands.length - 1);
  
  // Set the original element to be an intron (it stays in place)
  bands[sourceIndex].type = "intron";
  
  // Reset animation
  animating = false;
  sourceIndex = -1;
  
  // Show mutation if needed
  if (disruptsExon) {
    mutationShowing = true;
    mutationTimer = 0;
  }
}

function drawMutation() {
  mutationTimer += 0.04; // Faster animation
  
  if (mutationTimer < 1.5) { // Extended time to allow falling off screen
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    
    // Create 3 copies of mutation text with slight offset
    for (let i = 0; i < 3; i++) {
      push();
      
      // Calculate position with less spiral, more falling
      let angle = mutationTimer * PI * 0.5; // Less rotation, only 1/4 circle
      let horizontalOffset = sin(angle) * 30 * (1 + i * 0.2); // Gentle horizontal movement
      
      // Quadratic acceleration downward (gravity effect)
      let fallDistance = pow(mutationTimer, 2) * 300; // Quadratic for acceleration
      
      // Position with falling effect
      let x = mutationX + horizontalOffset;
      let y = mutationY + fallDistance * (0.7 + i * 0.2); // Stagger the fall
      
      // Only draw if still on screen
      if (y < height + 100) {
        // Size and opacity calculations
        let size = map(mutationTimer, 0, 0.5, 24, 36); // Larger text
        if (mutationTimer > 0.5) size = 36; // Stay at max size while falling
        
        let alpha = 255;
        if (mutationTimer > 1.0) {
          alpha = map(mutationTimer, 1.0, 1.5, 255, 0); // Fade out at end
        }
        
        // 3D shadow effect
        textSize(size);
        fill(200, 0, 0, alpha);
        text("MUTATION!", x+2, y+2);
        
        // Main text
        fill(255, 50, 50, alpha);
        text("MUTATION!", x, y);
        
        // Slight rotation of each copy
        rotate(sin(angle) * 0.1);
      }
      
      pop();
    }
    
    // Draw exclamation mark at the insertion point
    if (mutationTimer < 0.5) {
      let markSize = map(mutationTimer, 0, 0.5, 30, 60);
      textSize(markSize);
      fill(200, 0, 0);
      text("!", mutationX+2, mutationY+2);
      fill(255, 50, 50);
      text("!", mutationX, mutationY);
    }
  } else {
    mutationShowing = false;
  }
}

function drawHeader() {
  // 3D effect for header box
  fill(230, 230, 240);
  rect(12, 12, width - 24, 50, 10);
  fill(255, 255, 255);
  rect(10, 10, width - 20, 50, 10);
  
  textAlign(CENTER, CENTER);
  fill(60, 60, 80);
  textSize(20);
  text("Drosophila Chromosomes - Transposable Elements", width/2, 35);
}

function drawLegend() {
  textAlign(LEFT, CENTER);
  textSize(12);
  
  let legendX = 20;
  let legendY = height - 60;
  let spacing = 150;
  
  // Draw legend background
  fill(255, 255, 255);
  rect(legendX - 10, legendY - 20, width - 40, 40, 5);
  
  // Exon with 3D effect
  fill(82, 167, 86);
  rect(legendX+1, legendY - 5, 15, 12);
  fill(102, 187, 106);
  rect(legendX, legendY - 6, 15, 12);
  fill(0);
  text("Exon", legendX + 25, legendY);
  
  // Intron with 3D effect
  fill(121, 90, 79);
  rect(legendX + spacing + 1, legendY - 5, 15, 12);
  fill(141, 110, 99);
  rect(legendX + spacing, legendY - 6, 15, 12);
  fill(0);
  text("Intron", legendX + spacing + 25, legendY);
  
  // Transposable Element with 3D effect
  fill(219, 63, 60);
  rect(legendX + spacing * 2 + 1, legendY - 5, 15, 12);
  fill(239, 83, 80);
  rect(legendX + spacing * 2, legendY - 6, 15, 12);
  fill(0);
  text("Transposable Element", legendX + spacing * 2 + 25, legendY);
}