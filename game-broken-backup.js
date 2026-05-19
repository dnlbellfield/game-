const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const gameShell = document.querySelector('.game-shell');
const statusEl = document.getElementById('status');
const startButton = document.getElementById('startButton');
const jumpButton = document.getElementById('jumpButton');
const runnerChip = document.getElementById('runnerChip');
const playAgainButton = document.getElementById('playAgainButton');
const donateButton = document.getElementById('donateButton');
const endSummaryEl = document.getElementById('endSummary');
const factSlideEl = document.getElementById('factSlide');
const factSlideCounterEl = document.getElementById('factSlideCounter');
const factPrevButton = document.getElementById('factPrevButton');
const factNextButton = document.getElementById('factNextButton');
const friendButtons = Array.from(document.querySelectorAll('.friend-button'));
ctx.imageSmoothingEnabled = true;

const slugSprite = new Image();
let slugSpriteReady = false;
slugSprite.src = 'slug.png';
slugSprite.onload = () => {
  slugSpriteReady = true;
};
slugSprite.onerror = () => {
  slugSpriteReady = false;
};

const bobcatSprite = new Image();
let bobcatSpriteReady = false;
bobcatSprite.src = 'bob-cat.png';
bobcatSprite.onload = () => {
  bobcatSpriteReady = true;
};
bobcatSprite.onerror = () => {
  bobcatSpriteReady = false;
};

const woodratSprite = new Image();
let woodratSpriteReady = false;
woodratSprite.src = 'ducky-footed-woodrat.png';
woodratSprite.onload = () => {
  woodratSpriteReady = true;
};
woodratSprite.onerror = () => {
  woodratSpriteReady = false;
};

const falconSprite = new Image();
let falconSpriteReady = false;
falconSprite.src = 'falcon.png';
falconSprite.onload = () => {
  falconSpriteReady = true;
};
falconSprite.onerror = () => {
  falconSpriteReady = false;
};

const treeSprite = new Image();
let treeSpriteReady = false;
treeSprite.src = 'tree.png';
treeSprite.onload = () => {
  treeSpriteReady = true;
};
treeSprite.onerror = () => {
  treeSpriteReady = false;
};

const bushSprite = new Image();
let bushSpriteReady = false;
bushSprite.src = 'bush.png';
bushSprite.onload = () => {
  bushSpriteReady = true;
};
bushSprite.onerror = () => {
  bushSpriteReady = false;
};

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const GROUND_Y = 344;
const BRIDGE_TOP = 314;
const GAME_SECONDS = 35;
const TARGET_FACTS = 10;

const baseWorldSpeed = 254;
const runnerStats = {
  slug: {
    jumpForce: 650,
    gravity: 1780,
    trait: 'steady glide',
  },
  bobcat: {
    jumpForce: 735,
    gravity: 2050,
    trait: 'springy leap',
  },
  falcon: {
    jumpForce: 665,
    gravity: 1500,
    trait: 'floaty glide',
  },
  woodrat: {
    jumpForce: 700,
    gravity: 1920,
    trait: 'quick hop',
  },
};

const slug = {
  x: 160,
  y: GROUND_Y - 28,
  w: 42,
  h: 28,
  vy: 0,
  onGround: true,
};

const factPickups = [];
const waterHazards = [];
const factPool = [
  {
    scene: 'grove',
    label: 'Tallest Trees',
    text: 'Coast redwoods are the tallest trees on Earth and can grow more than 300 feet high.',
  },
  {
    scene: 'grove',
    label: 'Ancient Survivors',
    text: 'Redwoods have ancient roots in time: their lineage stretches back about 240 million years.',
  },
  {
    scene: 'wildlife',
    label: 'Forest Makers',
    text: 'Redwoods help shape their own habitat by catching fog, cooling forests, and supporting wildlife high in their branches.',
  },
  {
    scene: 'mountain',
    label: 'Strong Together',
    text: 'Redwoods stay strong in storms by spreading wide roots that intertwine with neighboring trees.',
  },
  {
    scene: 'grove',
    label: 'Long Lives',
    text: 'Coast redwoods can live for more than 2,000 years when forests are protected and allowed to grow.',
  },
  {
    scene: 'sunny',
    label: 'Fog Catchers',
    text: 'Redwoods can capture moisture from coastal fog, helping keep the forest cool through dry seasons.',
  },
  {
    scene: 'wildlife',
    label: 'Canopy Worlds',
    text: 'Soil can collect high in redwood branches, creating mini habitats for ferns, mosses, insects, and salamanders.',
  },
  {
    scene: 'mountain',
    label: 'Climate Heroes',
    text: 'Coast redwoods store more carbon than any other tree species on Earth.',
  },
  {
    scene: 'mountain',
    label: 'Rare Home',
    text: 'Coast redwoods grow naturally only along the Pacific coast, from Big Sur to southern Oregon.',
  },
  {
    scene: 'wildlife',
    label: 'Only Five Percent',
    text: 'Only about 5% of the original old-growth coast redwood forest remains today.',
  },
  {
    scene: 'wildlife',
    label: 'Wildlife Forest',
    text: 'Redwood forests support wildlife like bobcats, banana slugs, woodrats, owls, and endangered coho salmon.',
  },
  {
    scene: 'sunny',
    label: 'Rain Makers',
    text: 'Redwoods help move water through the forest by catching fog and releasing moisture back into the air.',
  },
  {
    scene: 'grove',
    label: 'Family Circles',
    text: 'New redwoods can sprout from the roots of older trees, creating clusters sometimes called family circles.',
  },
];
const runnerFactLibrary = {
  slug: {
    label: 'Banana Slug',
    text: 'Banana slugs are native to Pacific coast redwood forests and help recycle nutrients while spreading seeds and spores.',
  },
  bobcat: {
    label: 'Bobcat',
    text: 'Bobcats are stealthy woodland hunters whose spotted coats help them blend into forest habitat.',
  },
  falcon: {
    label: 'Peregrine Falcon',
    text: 'Peregrine falcons are a conservation success story and can dive at speeds recorded up to 242 miles per hour.',
  },
  woodrat: {
    label: 'Dusky-footed Woodrat',
    text: 'Dusky-footed woodrats build large stick nests called middens that can shelter many other forest creatures.',
  },
};
const runnerNames = {
  slug: 'Banana Slug',
  bobcat: 'Bobcat',
  falcon: 'Peregrine Falcon',
  woodrat: 'Dusky-footed Woodrat',
};
const sceneFactPlan = [
  { scenes: ['grove'], count: 4, startSecond: 1.6, endSecond: 9.4 },
  { scenes: ['mountain'], count: 3, startSecond: 10.4, endSecond: 18.6 },
  { scenes: ['sunny', 'wildlife'], count: 3, startSecond: 19.2, endSecond: 26.8 },
];

let lastTime = 0;
let timeLeft = GAME_SECONDS;
let gameState = 'ready';
let worldOffset = 0;
let pulseTime = 0;
let selectedRunner = 'slug';
let unlockedFacts = [];
let activeFacts = [];
let hazardCooldown = 0;
let summarySlides = [];
let currentSummarySlide = 0;
let mobileJumpHintVisible = true;
let endSummaryTimeoutId = null;
let countdownTimeLeft = 0;
let toastMessage = '';
let toastSubMessage = '';
let toastTime = 0;
let toastDuration = 1.5;

function showToast(message, subMessage = '', duration = 1.5) {
  toastMessage = message;
  toastSubMessage = subMessage;
  toastDuration = duration;
  toastTime = duration;
}

function updateRunnerChip() {
  runnerChip.textContent = '';

  const prefix = document.createTextNode('Playing as ');
  const strong = document.createElement('strong');
  strong.textContent = runnerNames[selectedRunner];

  runnerChip.append(prefix, strong);
}

function syncUiState() {
  gameShell.classList.toggle('is-ready', gameState === 'ready');
  gameShell.classList.toggle('is-countdown', gameState === 'countdown');
  gameShell.classList.toggle('is-playing', gameState === 'playing');
  gameShell.classList.toggle('is-paused', gameState === 'paused');
  gameShell.classList.toggle(
    'is-finished',
    gameState === 'won' || gameState === 'lost'
  );

  runnerChip.hidden = gameState === 'ready';
  updateRunnerChip();

  jumpButton.hidden =
    !mobileJumpHintVisible ||
    gameState === 'won' ||
    gameState === 'lost' ||
    gameState === 'paused' ||
    gameState === 'countdown';

  if (gameState === 'ready') {
    startButton.textContent = 'Start Trail';
  } else if (gameState === 'playing') {
    startButton.textContent = 'Pause Trail';
  } else if (gameState === 'paused') {
    startButton.textContent = 'Resume Trail';
  } else if (gameState === 'countdown') {
    startButton.textContent = 'Get Ready';
  } else {
    startButton.textContent = 'Play Again';
  }
}

// Keep your existing sceneThemes, helpers, rendering, and setup functions here.
// Below are the functions/sections that should be replaced or added.

function updateSummarySlide() {
  const slide = summarySlides[currentSummarySlide];

  factSlideEl.textContent = '';

  const label = document.createElement('span');
  label.className = 'fact-card-label';
  label.textContent = slide.label;

  const text = document.createTextNode(slide.text);

  factSlideEl.append(label, text);

  factSlideCounterEl.textContent = `${currentSummarySlide + 1} of ${
    summarySlides.length
  }`;
  factPrevButton.disabled = currentSummarySlide === 0;
  factNextButton.disabled = currentSummarySlide === summarySlides.length - 1;
  factPrevButton.hidden = summarySlides.length <= 1;
  factNextButton.hidden = summarySlides.length <= 1;
}

function setRunner(nextRunner) {
  selectedRunner = nextRunner;

  friendButtons.forEach((button) => {
    const isActive = button.dataset.runner === nextRunner;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  if (!runnerChip.hidden) {
    updateRunnerChip();
  }
}

function startGame() {
  if (gameState === 'playing') {
    gameState = 'paused';
    statusEl.textContent =
      'Trail paused. Press Resume, P, or Escape to keep going.';
    syncUiState();
    return;
  }

  if (gameState === 'paused') {
    gameState = 'playing';
    statusEl.textContent = `Back on the trail. ${unlockedFacts.length}/${TARGET_FACTS} facts found.`;
    syncUiState();
    return;
  }

  if (gameState === 'ready') {
    gameState = 'countdown';
    countdownTimeLeft = 4;
    statusEl.textContent = 'Get ready...';
    showToast('Get ready!', runnerStats[selectedRunner].trait, 1.2);
    endSummaryEl.hidden = true;
    syncUiState();
  }
}

function jump() {
  if (gameState === 'ready') {
    startGame();
  }

  if (gameState !== 'playing') {
    return;
  }

  if (slug.onGround) {
    slug.vy = -runnerStats[selectedRunner].jumpForce;
    slug.onGround = false;
  }
}

function resetGame() {
  setRunner('slug');
  slug.y = GROUND_Y - slug.h;
  slug.vy = 0;
  slug.onGround = true;
  timeLeft = GAME_SECONDS;
  gameState = 'ready';
  worldOffset = 0;
  setupLevel();
  unlockedFacts = [];
  pulseTime = 0;
  hazardCooldown = 0;
  countdownTimeLeft = 0;
  mobileJumpHintVisible = true;
  toastMessage = '';
  toastSubMessage = '';
  toastTime = 0;
  statusEl.textContent =
    'Choose your forest friend, then press Start Trail or Spacebar.';

  if (endSummaryTimeoutId) {
    clearTimeout(endSummaryTimeoutId);
    endSummaryTimeoutId = null;
  }

  hideEndSummary();
  syncUiState();
}

friendButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const nextRunner = button.dataset.runner;
    setRunner(nextRunner);

    if (gameState === 'ready') {
      statusEl.textContent = `${runnerNames[nextRunner]} is ready with a ${runnerStats[nextRunner].trait}. Press Start Trail or Spacebar to begin.`;
    } else {
      statusEl.textContent = `${runnerNames[nextRunner]} is on the trail with a ${runnerStats[nextRunner].trait}.`;
    }
  });
});

function update(dt) {
  if (gameState === 'countdown') {
    countdownTimeLeft = Math.max(0, countdownTimeLeft - dt);

    if (toastTime > 0) {
      toastTime = Math.max(0, toastTime - dt);
    }

    if (countdownTimeLeft <= 0) {
      gameState = 'playing';
      statusEl.textContent = `Collect all ${TARGET_FACTS} redwood facts before time runs out.`;
      showToast('Trail started!', runnerStats[selectedRunner].trait, 1.2);
      syncUiState();
    }

    return;
  }

  if (toastTime > 0) {
    toastTime = Math.max(0, toastTime - dt);
  }

  if (gameState !== 'playing') {
    return;
  }

  const speed = getCurrentSpeed();

  timeLeft -= dt;
  worldOffset += speed * dt;

  slug.vy += runnerStats[selectedRunner].gravity * dt;
  slug.y += slug.vy * dt;

  if (slug.y + slug.h >= GROUND_Y) {
    slug.y = GROUND_Y - slug.h;
    slug.vy = 0;
    slug.onGround = true;
  }

  if (hazardCooldown > 0) {
    hazardCooldown -= dt;
  }

  for (const fact of factPickups) {
    if (!fact.active) {
      continue;
    }

    fact.x -= speed * dt;

    if (fact.x + fact.w < 0) {
      fact.active = false;
      continue;
    }

    const slugRect = { x: slug.x, y: slug.y, w: slug.w, h: slug.h };

    if (intersectsRectRect(fact, slugRect)) {
      fact.active = false;

      if (!unlockedFacts.includes(fact.id)) {
        unlockedFacts.push(fact.id);
        unlockedFacts.sort((a, b) => a - b);
      }

      const collectedFact = activeFacts[fact.id];

      if (unlockedFacts.length >= TARGET_FACTS) {
        gameState = 'won';
        statusEl.textContent = `You found all ${TARGET_FACTS} redwood facts!`;
        showToast('All facts found!', 'Trail complete', 1.8);
        showEndSummarySoon();
      } else {
        statusEl.textContent = `New fact found! ${unlockedFacts.length}/${TARGET_FACTS} discovered.`;
        showToast(
          'New fact found!',
          collectedFact
            ? collectedFact.label
            : `${unlockedFacts.length}/${TARGET_FACTS}`,
          1.5
        );
      }
    }
  }

  for (const hazard of waterHazards) {
    if (!hazard.active) {
      continue;
    }

    hazard.x -= speed * dt;

    if (hazard.x + hazard.w < 0) {
      hazard.active = false;
      continue;
    }

    if (hazard.triggered || hazardCooldown > 0) {
      continue;
    }

    const slugRect = { x: slug.x, y: slug.y, w: slug.w, h: slug.h };

    if (
      intersectsRectRect(slugRect, hazard) &&
      slug.y + slug.h > BRIDGE_TOP + 10
    ) {
      hazard.triggered = true;
      hazardCooldown = 0.8;
      timeLeft = Math.max(0, timeLeft - 2.5);
      slug.vy = -320;
      slug.onGround = false;
      statusEl.textContent =
        hazard.type === 'creek'
          ? `Splash! Jump the creek to save time. ${unlockedFacts.length}/${TARGET_FACTS} facts found.`
          : `Bump! Hop over the bushes to stay quick. ${unlockedFacts.length}/${TARGET_FACTS} facts found.`;

      showToast(
        hazard.type === 'creek' ? 'Splash!' : 'Bump!',
        '-2.5 seconds',
        1.2
      );
    }
  }

  if (timeLeft <= 0 && gameState === 'playing') {
    timeLeft = 0;
    gameState = unlockedFacts.length >= TARGET_FACTS ? 'won' : 'lost';
    statusEl.textContent =
      gameState === 'won'
        ? 'You found all the redwood facts just in time!'
        : `Time up! You found ${unlockedFacts.length}/${TARGET_FACTS} redwood facts.`;
    showEndSummarySoon();
  }

  pulseTime += dt;
}

function drawFactPickups() {
  for (const fact of factPickups) {
    if (!fact.active) {
      continue;
    }

    const bob = Math.sin(pulseTime * 4 + fact.x * 0.015) * 6;
    const spin = -(pulseTime * 1.6 + fact.x * 0.008);
    const x = fact.x + fact.w / 2;
    const y = fact.y + fact.h / 2 + bob;

    const outerGlow = ctx.createRadialGradient(x, y, 4, x, y, 34);
    outerGlow.addColorStop(0, 'rgba(255, 245, 166, 0.92)');
    outerGlow.addColorStop(0.48, 'rgba(246, 213, 106, 0.42)');
    outerGlow.addColorStop(1, 'rgba(246, 213, 106, 0)');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(x, y, 34, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(spin);

    ctx.fillStyle = 'rgba(0, 79, 47, 0.42)';
    ctx.beginPath();
    ctx.roundRect(-15, -18, 30, 36, 5);
    ctx.fill();

    ctx.fillStyle = '#fff8df';
    ctx.beginPath();
    ctx.roundRect(-12, -15, 24, 30, 4);
    ctx.fill();

    ctx.strokeStyle = '#cc4c28';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#d9ccac';
    ctx.fillRect(-9, -11, 18, 23);

    ctx.fillStyle = '#cc4c28';
    ctx.fillRect(-12, -15, 24, 5);

    ctx.fillStyle = '#7b9d5d';
    ctx.fillRect(-7, -5, 13, 2);
    ctx.fillRect(-7, 1, 13, 2);
    ctx.fillRect(-7, 7, 13, 2);

    ctx.fillStyle = '#004f2f';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('i', 0, 1);

    ctx.restore();
    ctx.textAlign = 'start';
  }
}

function drawHazardWarning(hazard) {
  const warningX = hazard.x + hazard.w / 2;
  const warningY = hazard.y - 18 + Math.sin(pulseTime * 6) * 2;

  ctx.save();
  ctx.fillStyle = 'rgba(204, 76, 40, 0.95)';
  ctx.beginPath();
  ctx.arc(warningX, warningY, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.82)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('!', warningX, warningY + 5);

  ctx.restore();
  ctx.textAlign = 'start';
}

function drawWaterHazards() {
  for (const hazard of waterHazards) {
    if (!hazard.active) {
      continue;
    }

    drawHazardWarning(hazard);

    if (hazard.type === 'bush') {
      ctx.fillStyle = '#00000024';
      ctx.beginPath();
      ctx.ellipse(
        hazard.x + hazard.w * 0.5,
        hazard.y + hazard.h + 6,
        hazard.w * 0.4,
        8,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.strokeStyle = 'rgba(204, 76, 40, 0.72)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(
        hazard.x + hazard.w * 0.5,
        hazard.y + hazard.h * 0.48,
        hazard.w * 0.46,
        hazard.h * 0.36,
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();

      if (bushSpriteReady) {
        ctx.drawImage(
          bushSprite,
          hazard.x - 12,
          hazard.y - 18,
          hazard.w + 24,
          hazard.h + 24
        );
      } else {
        ctx.fillStyle = '#436d34';
        ctx.beginPath();
        ctx.arc(hazard.x + 18, hazard.y + 34, 18, Math.PI, 0);
        ctx.arc(hazard.x + 38, hazard.y + 22, 22, Math.PI, 0);
        ctx.arc(hazard.x + 60, hazard.y + 30, 18, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#7ab257';
        ctx.beginPath();
        ctx.arc(hazard.x + 20, hazard.y + 28, 12, Math.PI, 0);
        ctx.arc(hazard.x + 42, hazard.y + 16, 15, Math.PI, 0);
        ctx.arc(hazard.x + 62, hazard.y + 24, 11, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
      }

      continue;
    }

    const ripple = Math.sin(pulseTime * 5 + hazard.x * 0.03) * 1.5;
    const bankHeight = 5;

    ctx.fillStyle = '#6f5339';
    ctx.beginPath();
    ctx.roundRect(hazard.x - 8, hazard.y - 3, hazard.w + 16, hazard.h + 6, 8);
    ctx.fill();

    ctx.fillStyle = '#7da35c';
    ctx.fillRect(hazard.x - 6, hazard.y - bankHeight, hazard.w + 12, bankHeight);
    ctx.fillRect(hazard.x - 6, hazard.y + hazard.h, hazard.w + 12, bankHeight);

    const waterGradient = ctx.createLinearGradient(
      hazard.x,
      hazard.y,
      hazard.x,
      hazard.y + hazard.h
    );
    waterGradient.addColorStop(0, '#a8dceb');
    waterGradient.addColorStop(0.38, '#66b8d1');
    waterGradient.addColorStop(1, '#2d7890');
    ctx.fillStyle = waterGradient;
    ctx.beginPath();
    ctx.roundRect(hazard.x, hazard.y, hazard.w, hazard.h, 6);
    ctx.fill();

    ctx.fillStyle = 'rgba(231, 249, 255, 0.78)';
    ctx.fillRect(hazard.x + 10, hazard.y + 6 + ripple, hazard.w - 20, 2);
    ctx.fillRect(hazard.x + 16, hazard.y + 15 - ripple, hazard.w - 32, 2);
    ctx.fillRect(hazard.x + 22, hazard.y + 22 + ripple * 0.6, hazard.w - 44, 2);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.beginPath();
    ctx.roundRect(hazard.x + 4, hazard.y + 3, hazard.w - 8, hazard.h * 0.45, 5);
    ctx.fill();
  }
}

function drawHud() {
  if (gameState === 'ready' || gameState === 'countdown') {
    return;
  }

  const isSmallScreen = window.innerWidth < 700;
  const panelGradient = ctx.createLinearGradient(0, 0, 0, 42);

  panelGradient.addColorStop(0, 'rgba(15, 27, 22, 0.9)');
  panelGradient.addColorStop(1, 'rgba(15, 27, 22, 0.6)');

  ctx.fillStyle = panelGradient;
  ctx.fillRect(0, 0, WIDTH, 42);

  ctx.fillStyle = '#f4ead1';
  ctx.font =
    '800 15px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  if (isSmallScreen) {
    ctx.fillText(`${timeLeft.toFixed(0)}s`, 16, 25);
    ctx.fillText(`${unlockedFacts.length}/${TARGET_FACTS}`, 82, 25);
    ctx.fillText(getSceneTheme().label.toUpperCase(), 142, 25);
    return;
  }

  ctx.fillText(`TIME ${timeLeft.toFixed(1)}s`, 16, 25);
  ctx.fillText(`FACTS ${unlockedFacts.length}/${TARGET_FACTS}`, 174, 25);
  ctx.fillText(getSceneTheme().label.toUpperCase(), 332, 25);
  ctx.fillText(runnerNames[selectedRunner].toUpperCase(), 636, 25);
}

function drawToast() {
  if (toastTime <= 0 || !toastMessage) {
    return;
  }

  const progress = toastTime / toastDuration;
  const alpha = Math.min(1, progress * 2);
  const lift = (1 - progress) * 10;
  const boxWidth = toastSubMessage ? 300 : 230;
  const boxHeight = toastSubMessage ? 66 : 46;
  const boxX = WIDTH / 2 - boxWidth / 2;
  const boxY = 58 - lift;

  ctx.save();
  ctx.globalAlpha = alpha;

  ctx.fillStyle = 'rgba(0, 79, 47, 0.86)';
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 20);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 246, 224, 0.44)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#fff6e0';
  ctx.textAlign = 'center';
  ctx.font =
    'bold 21px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(toastMessage, WIDTH / 2, boxY + 29);

  if (toastSubMessage) {
    ctx.fillStyle = '#f7d9a5';
    ctx.font =
      '700 15px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(toastSubMessage, WIDTH / 2, boxY + 51);
  }

  ctx.restore();
  ctx.textAlign = 'start';
}

function draw() {
  drawBackground();
  drawWaterHazards();
  drawFactPickups();
  drawRunner();
  drawHud();
  drawToast();

  if (gameState === 'ready') {
    ctx.fillStyle = 'rgba(8, 14, 11, 0.28)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = '#fff6e0';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillText('Choose a forest friend', WIDTH / 2 - 130, HEIGHT / 2 - 24);
    ctx.font = '18px Georgia, serif';
    ctx.fillText('Press Start or Spacebar to begin', WIDTH / 2 - 132, HEIGHT / 2 + 10);
  }

  if (gameState === 'countdown') {
    const countdownLabel =
      countdownTimeLeft > 3
        ? '3'
        : countdownTimeLeft > 2
          ? '2'
          : countdownTimeLeft > 1
            ? '1'
            : 'Go!';
    const countdownSize = countdownLabel === 'Go!' ? 52 : 76;

    ctx.fillStyle = 'rgba(8, 14, 11, 0.2)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = '#fff6e0';
    ctx.font = `bold ${countdownSize}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.fillText(countdownLabel, WIDTH / 2, HEIGHT / 2 + 10);
    ctx.font = '20px Georgia, serif';
    ctx.fillText('Get ready!', WIDTH / 2, HEIGHT / 2 + 52);
    ctx.textAlign = 'start';
  }

  if (gameState === 'paused') {
    ctx.fillStyle = 'rgba(8, 14, 11, 0.34)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = '#fff6e0';
    ctx.font = 'bold 30px Georgia, serif';
    ctx.fillText('Trail Paused', WIDTH / 2 - 82, HEIGHT / 2 - 10);
    ctx.font = '18px Georgia, serif';
    ctx.fillText(
      'Press Resume, P, or Escape to continue',
      WIDTH / 2 - 164,
      HEIGHT / 2 + 22
    );
  }
}