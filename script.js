// Target date: April 12 of this year at 09:00
const targetDate = new Date(new Date().getFullYear(), 3, 12, 9, 0, 0).getTime();

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const messageEl = document.getElementById("countdown-message");
const tulipGarden = document.getElementById("tulip-garden");

// Sprite sheet configuration
const tulipSprite = {
  imageUrl: "images/tulipeClosedAll_small.png",
  frameWidth: 74,
  frameHeight: 200,
  cols: 5,
  rows: 1,
};

// Positions of the 5 tulips in the sprite [column, row]
const tulipPositions = [
  [0, 0],
  [1, 0],
  [2, 0],
  [3, 0],
  [4, 0],
];

// Array that stores the chosen positions once and for all on load
let assignedPositions = [];

function calcTulipCount(daysLeft) {
  const revealDays = 30;
  const minTulips = 5;  // Start with 5 tulips
  const maxTulips = 30; // Can go up to 30 tulips
  
  let factor;
  if (daysLeft >= revealDays) {
    factor = 0;
  } else if (daysLeft <= 0) {
    factor = 1;
  } else {
    factor = 1 - daysLeft / revealDays;
  }
  
  const targetCount = Math.round(minTulips + factor * (maxTulips - minTulips));
  
  // Ensure at least 10 tulips at 12 days or less
  if (daysLeft <= 12 && targetCount < 10) {
    return 10;
  }
  
  return targetCount;
}

function getTulipDimensions(tulipCount) {
  // Calculate tulip size based on how many need to fit
  const screenWidth = window.innerWidth;
  const gap = 2;
  const padding = 8;
  const availableWidth = screenWidth - padding;
  
  // Calculate width needed per tulip
  const calculatedWidth = Math.floor((availableWidth - (tulipCount - 1) * gap) / tulipCount);
  
  // Constrain between min and max sizes
  const minWidth = 30;  // Minimum tulip width
  const maxWidth = 74;  // Original/maximum tulip width
  
  const width = Math.max(minWidth, Math.min(maxWidth, calculatedWidth));
  
  // Maintain aspect ratio (74:200)
  const height = Math.round((width / 74) * 200);
  
  return { width, height };
}

function renderTulipGarden(daysLeft) {
  if (!tulipGarden || tulipPositions.length === 0) return;

  const newCount = calcTulipCount(daysLeft);

  // On n'ajoute des tulipes que si le nombre augmente (jamais de reset)
  if (newCount <= assignedPositions.length) return;

  const dims = getTulipDimensions(newCount);
  // Total sprite sheet width = frameWidth × number of columns
  const spriteSheetWidth = dims.width * tulipSprite.cols;

  for (let i = assignedPositions.length; i < newCount; i++) {
    const randomPos =
      tulipPositions[Math.floor(Math.random() * tulipPositions.length)];
    assignedPositions.push(randomPos);

    const tulip = document.createElement("div");
    tulip.className = "tulip";
    
    // Calculate background position and size based on tulip count
    const offsetX = -randomPos[0] * dims.width;
    tulip.style.backgroundPosition = `${offsetX}px 0px`;
    tulip.style.backgroundSize = `${spriteSheetWidth}px ${dims.height}px`;
    tulip.style.width = `${dims.width}px`;
    tulip.style.height = `${dims.height}px`;
    
    tulipGarden.appendChild(tulip);
  }
  
  // Adjust garden height based on tulip size
  tulipGarden.style.height = `${dims.height + 10}px`;
}

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) {
    daysEl.textContent = "0";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    if (messageEl) messageEl.textContent = "It's the big day! ✨";
    renderTulipGarden(0);
    clearInterval(countdownInterval);
    return;
  }

  const oneSecond = 1000;
  const oneMinute = oneSecond * 60;
  const oneHour = oneMinute * 60;
  const oneDay = oneHour * 24;

  const days = Math.floor(distance / oneDay);
  const hours = Math.floor((distance % oneDay) / oneHour);
  const minutes = Math.floor((distance % oneHour) / oneMinute);
  const seconds = Math.floor((distance % oneMinute) / oneSecond);

  daysEl.textContent = days;
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");

  renderTulipGarden(days);
}

// Handle window resize to adjust tulip count and sizing
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Clear existing tulips and recalculate with new dimensions
    tulipGarden.innerHTML = "";
    assignedPositions = [];
    const now = new Date().getTime();
    const distance = targetDate - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    renderTulipGarden(days >= 0 ? days : 0);
  }, 150); // Debounce to avoid excessive recalculations
});

// First immediate call, then every second
updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);
