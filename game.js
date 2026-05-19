const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const gameShell = document.querySelector('.game-shell');
const statusEl = document.getElementById('status');
const startButton = document.getElementById('startButton');
const jumpButton = document.getElementById('jumpButton');
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
const gravity = 1900;
const jumpForce = 680;

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
  woodrat: 'San Francisco Dusky-footed Woodrat',
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

function syncUiState() {
  gameShell.classList.toggle('is-ready', gameState === 'ready');
  gameShell.classList.toggle('is-countdown', gameState === 'countdown');
  gameShell.classList.toggle('is-playing', gameState === 'playing');
  gameShell.classList.toggle('is-paused', gameState === 'paused');
  gameShell.classList.toggle('is-finished', gameState === 'won' || gameState === 'lost');
  jumpButton.hidden =
    !mobileJumpHintVisible || gameState === 'won' || gameState === 'lost' || gameState === 'paused' || gameState === 'countdown';

  if (gameState === 'ready') {
    startButton.textContent = 'Start Trail Adventure';
  } else if (gameState === 'playing') {
    startButton.textContent = 'Pause Trail Adventure';
  } else if (gameState === 'paused') {
    startButton.textContent = 'Resume Trail Adventure';
  } else if (gameState === 'countdown') {
    startButton.textContent = 'Get Ready';
  } else {
    startButton.textContent = 'Start Trail Adventure';
  }
}

const sceneThemes = [
  {
    label: 'Redwood Grove',
    sceneKey: 'grove',
    skyTop: '#224034',
    skyMid: '#3e6a56',
    skyBottom: '#aec8b0',
    hazeTop: '#f2f0df00',
    hazeBottom: '#d8e7d7aa',
    sunX: 700,
    sunY: 82,
    sunCore: '#ffe4a8c8',
    mountainFarTop: '#6f8d78',
    mountainFarBottom: '#58705f',
    mountainNearTop: '#3d5e4b',
    mountainNearBottom: '#294233',
    meadowTop: '#6d9451',
    meadowBottom: '#47693b',
    trailTop: '#8e6a49',
    trailMid: '#744f37',
    trailBottom: '#5d3f2d',
    frontTreeAlpha: 0.88,
    backTreeAlpha: 0.52,
    farTreeAlpha: 0.28,
  },
  {
    label: 'Mountain View',
    sceneKey: 'mountain',
    skyTop: '#4d7faa',
    skyMid: '#78a9cb',
    skyBottom: '#d7ecf7',
    hazeTop: '#ffffff00',
    hazeBottom: '#edf6faaa',
    sunX: 770,
    sunY: 70,
    sunCore: '#fff2bed2',
    mountainFarTop: '#8ea7b9',
    mountainFarBottom: '#70879b',
    mountainNearTop: '#577763',
    mountainNearBottom: '#3d5b49',
    meadowTop: '#83a95e',
    meadowBottom: '#577a43',
    trailTop: '#9a7652',
    trailMid: '#7d5b3f',
    trailBottom: '#664834',
    frontTreeAlpha: 0.62,
    backTreeAlpha: 0.38,
    farTreeAlpha: 0.18,
  },
  {
    label: 'Sunny Refuge',
    sceneKey: 'wildlife',
    skyTop: '#5f9fd0',
    skyMid: '#92c2df',
    skyBottom: '#f0dfbb',
    hazeTop: '#fff3dc00',
    hazeBottom: '#f2e1c29a',
    sunX: 790,
    sunY: 76,
    sunCore: '#ffe0a6d2',
    mountainFarTop: '#98ab95',
    mountainFarBottom: '#74856f',
    mountainNearTop: '#597255',
    mountainNearBottom: '#3e543d',
    meadowTop: '#88b45f',
    meadowBottom: '#587c45',
    trailTop: '#a6774c',
    trailMid: '#83583b',
    trailBottom: '#654330',
    frontTreeAlpha: 0.68,
    backTreeAlpha: 0.42,
    farTreeAlpha: 0.2,
  },
];

function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
    a: normalized.length === 8 ? parseInt(normalized.slice(6, 8), 16) / 255 : 1,
  };
}

function rgbToHex({ r, g, b, a = 1 }) {
  const toHex = (value) => Math.round(value).toString(16).padStart(2, '0');
  const alphaHex = a < 1 ? toHex(a * 255) : '';
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`;
}

function mixColor(colorA, colorB, amount) {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  return rgbToHex({
    r: a.r + (b.r - a.r) * amount,
    g: a.g + (b.g - a.g) * amount,
    b: a.b + (b.b - a.b) * amount,
    a: a.a + (b.a - a.a) * amount,
  });
}

function smoothStep(value) {
  return value * value * (3 - 2 * value);
}

function blendThemes(themeA, themeB, amount) {
  const blended = {};
  Object.keys(themeA).forEach((key) => {
    if (typeof themeA[key] === 'number') {
      blended[key] = themeA[key] + (themeB[key] - themeA[key]) * amount;
    } else if (typeof themeA[key] === 'string' && themeA[key].startsWith('#')) {
      blended[key] = mixColor(themeA[key], themeB[key], amount);
    } else {
      blended[key] = amount < 0.5 ? themeA[key] : themeB[key];
    }
  });
  return blended;
}

function getSceneTheme() {
  const elapsed = GAME_SECONDS - timeLeft;
  const sceneLength = GAME_SECONDS / 3;
  const firstBoundary = sceneLength;
  const secondBoundary = sceneLength * 2;
  const transitionSpan = 3.2;

  if (elapsed < firstBoundary) {
    if (elapsed > firstBoundary - transitionSpan) {
      const amount = smoothStep((elapsed - (firstBoundary - transitionSpan)) / transitionSpan);
      return blendThemes(sceneThemes[0], sceneThemes[1], amount);
    }
    return sceneThemes[0];
  }

  if (elapsed < secondBoundary) {
    if (elapsed > secondBoundary - transitionSpan) {
      const amount = smoothStep((elapsed - (secondBoundary - transitionSpan)) / transitionSpan);
      return blendThemes(sceneThemes[1], sceneThemes[2], amount);
    }
    return sceneThemes[1];
  }

  return sceneThemes[2];
}

function getCurrentSpeed() {
  const elapsed = GAME_SECONDS - timeLeft;
  const sceneLength = GAME_SECONDS / 3;

  if (elapsed < sceneLength) {
    return baseWorldSpeed;
  }

  if (elapsed < sceneLength * 2) {
    return baseWorldSpeed * 1.1;
  }

  return baseWorldSpeed * 1.2;
}

function getSceneMotionFactor() {
  const elapsedRatio = (GAME_SECONDS - timeLeft) / GAME_SECONDS;
  return 1 + elapsedRatio * 0.18;
}

function getDistanceForTime(seconds) {
  return seconds * baseWorldSpeed;
}

function renderEndSummary() {
  if (gameState === 'playing' || gameState === 'ready') {
    endSummaryEl.hidden = true;
    endSummaryEl.classList.remove('is-visible');
    syncUiState();
    return;
  }

  endSummaryEl.hidden = false;
  summarySlides = activeFacts
    .filter((_, index) => unlockedFacts.includes(index))
    .map((fact) => ({
      label: fact.label,
      text: fact.text,
    }));

  if (summarySlides.length === 0) {
    summarySlides = [
      {
        label: 'Keep Exploring',
        text: 'You did not collect a fact this run. Try again and discover up to 10 redwood and wildlife facts.',
      },
    ];
  }

  currentSummarySlide = 0;
  updateSummarySlide();
  requestAnimationFrame(() => {
    endSummaryEl.classList.add('is-visible');
  });
  syncUiState();
}

function hideEndSummary() {
  if (endSummaryTimeoutId) {
    clearTimeout(endSummaryTimeoutId);
    endSummaryTimeoutId = null;
  }
  endSummaryEl.classList.remove('is-visible');
  endSummaryEl.hidden = true;
  syncUiState();
}

function showEndSummarySoon() {
  if (endSummaryTimeoutId) {
    clearTimeout(endSummaryTimeoutId);
  }
  endSummaryEl.classList.remove('is-visible');
  endSummaryTimeoutId = setTimeout(() => {
    endSummaryTimeoutId = null;
    renderEndSummary();
  }, 550);
}

function updateSummarySlide() {
  const slide = summarySlides[currentSummarySlide];
  factSlideEl.innerHTML = `<span class="fact-card-label">${slide.label}</span>${slide.text}`;
  factSlideCounterEl.textContent = `${currentSummarySlide + 1} of ${summarySlides.length}`;
  factPrevButton.disabled = currentSummarySlide === 0;
  factNextButton.disabled = currentSummarySlide === summarySlides.length - 1;
  factPrevButton.hidden = summarySlides.length <= 1;
  factNextButton.hidden = summarySlides.length <= 1;
}

function setRunner(nextRunner) {
  selectedRunner = nextRunner;
  friendButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.runner === nextRunner);
  });
}

function startGame() {
  if (gameState === 'playing') {
    gameState = 'paused';
    statusEl.textContent = 'Trail paused. Press Resume, P, or Escape to keep going.';
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
    endSummaryEl.hidden = true;
    syncUiState();
  }
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickFactsForScene(sceneKeys, count, usedLabels) {
  const keys = Array.isArray(sceneKeys) ? sceneKeys : [sceneKeys];
  return shuffle(factPool.filter((fact) => keys.includes(fact.scene) && !usedLabels.has(fact.label))).slice(0, count);
}

function buildFactRun() {
  const usedLabels = new Set();
  const facts = [];

  sceneFactPlan.forEach((entry) => {
    const picks = pickFactsForScene(entry.scenes, entry.count, usedLabels);
    picks.forEach((fact) => {
      usedLabels.add(fact.label);
      facts.push(fact);
    });
  });

  return facts.slice(0, TARGET_FACTS);
}

function setupLevel() {
  factPickups.length = 0;
  waterHazards.length = 0;
  activeFacts = buildFactRun();
  const factEncounterX = slug.x + slug.w;
  const hazardEncounterX = slug.x + slug.w - 10;
  const pickupHeights = [BRIDGE_TOP - 24, BRIDGE_TOP - 54, BRIDGE_TOP - 88, BRIDGE_TOP - 120];
  const guaranteedGroundFactIds = new Set([0, 3, 6, 8]);
  let factIndex = 0;

  sceneFactPlan.forEach((entry, sceneIndex) => {
    const windowDuration = entry.endSecond - entry.startSecond;
    const usableWindow = windowDuration * 0.56;
    const windowStart = entry.startSecond + windowDuration * 0.02;

    for (let i = 0; i < entry.count && factIndex < activeFacts.length; i += 1) {
      const normalizedSlot = (i + 0.5) / entry.count;
      const timeOffset = windowStart + normalizedSlot * usableWindow;
      const heightIndex = guaranteedGroundFactIds.has(factIndex) ? 0 : (factIndex + sceneIndex * 2) % pickupHeights.length;
      factPickups.push({
        id: factIndex,
        x: factEncounterX + getDistanceForTime(timeOffset),
        y: pickupHeights[heightIndex],
        w: 28,
        h: 28,
        active: true,
      });
      factIndex += 1;
    }
  });

  const hazardTimes = [7.2, 15.4, 24.8, 31.6];
  hazardTimes.forEach((timeOffset, index) => {
    waterHazards.push({
      type: index === 1 ? 'creek' : 'bush',
      x: hazardEncounterX + getDistanceForTime(timeOffset),
      y: index === 1 ? BRIDGE_TOP + 4 : BRIDGE_TOP - 32,
      w: index === 1 ? 82 : 92,
      h: index === 1 ? 30 : 78,
      active: true,
      triggered: false,
      ripplePhase: index * 0.8,
    });
  });
}

function jump() {
  if (gameState === 'ready') {
    startGame();
  }

  if (gameState !== 'playing') {
    return;
  }

  if (slug.onGround) {
    slug.vy = -jumpForce;
    slug.onGround = false;
  }
}

function togglePause() {
  if (gameState === 'playing' || gameState === 'paused') {
    startGame();
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
  statusEl.textContent = 'Choose your forest friend, then press Start or Spacebar.';
  if (endSummaryTimeoutId) {
    clearTimeout(endSummaryTimeoutId);
    endSummaryTimeoutId = null;
  }
  endSummaryEl.classList.remove('is-visible');
  renderEndSummary();
  syncUiState();
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'KeyW') {
    event.preventDefault();
    jump();
  }

  if ((event.code === 'KeyP' || event.code === 'Escape') && (gameState === 'playing' || gameState === 'paused')) {
    event.preventDefault();
    togglePause();
  }

  if (event.code === 'KeyR' && gameState !== 'playing') {
    resetGame();
  }
});

canvas.addEventListener('pointerdown', jump);
startButton.addEventListener('click', startGame);
jumpButton.addEventListener('click', () => {
  mobileJumpHintVisible = false;
  syncUiState();
  jump();
});
playAgainButton.addEventListener('click', resetGame);
donateButton.addEventListener('click', hideEndSummary);
factPrevButton.addEventListener('click', () => {
  if (currentSummarySlide > 0) {
    currentSummarySlide -= 1;
    updateSummarySlide();
  }
});
factNextButton.addEventListener('click', () => {
  if (currentSummarySlide < summarySlides.length - 1) {
    currentSummarySlide += 1;
    updateSummarySlide();
  }
});
endSummaryEl.addEventListener('click', (event) => {
  if (event.target === endSummaryEl) {
    hideEndSummary();
  }
});
friendButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setRunner(button.dataset.runner);
    if (gameState === 'ready') {
      statusEl.textContent = `${runnerNames[button.dataset.runner]} is ready. Press Start or Spacebar to begin.`;
    } else {
      statusEl.textContent = `${runnerNames[button.dataset.runner]} is on the trail. Collect all ${TARGET_FACTS} facts!`;
    }
  });
});
canvas.addEventListener(
  'touchstart',
  (event) => {
    event.preventDefault();
    jump();
  },
  { passive: false }
);

function intersectsCircleRect(circle, rect) {
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  return dx * dx + dy * dy < circle.r * circle.r;
}

function intersectsRectRect(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function update(dt) {
  if (gameState === 'countdown') {
    countdownTimeLeft = Math.max(0, countdownTimeLeft - dt);

    if (countdownTimeLeft <= 0) {
      gameState = 'playing';
      statusEl.textContent = `Collect all ${TARGET_FACTS} redwood facts before time runs out.`;
      syncUiState();
    }
    return;
  }

  if (gameState !== 'playing') {
    return;
  }

  timeLeft -= dt;
  worldOffset += baseWorldSpeed * dt;

  slug.vy += gravity * dt;
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

    fact.x -= baseWorldSpeed * dt;
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
      if (unlockedFacts.length >= TARGET_FACTS) {
        gameState = 'won';
        statusEl.textContent = `You found all ${TARGET_FACTS} redwood facts!`;
        showEndSummarySoon();
      } else {
        statusEl.textContent = `Fact found! ${unlockedFacts.length}/${TARGET_FACTS} discovered.`;
      }
    }
  }

  for (const hazard of waterHazards) {
    if (!hazard.active) {
      continue;
    }

    hazard.x -= baseWorldSpeed * dt;
    if (hazard.x + hazard.w < 0) {
      hazard.active = false;
      continue;
    }

    if (hazard.triggered || hazardCooldown > 0) {
      continue;
    }

    const slugRect = { x: slug.x, y: slug.y, w: slug.w, h: slug.h };
    if (intersectsRectRect(slugRect, hazard) && slug.y + slug.h > BRIDGE_TOP + 10) {
      hazard.triggered = true;
      hazardCooldown = 0.8;
      timeLeft = Math.max(0, timeLeft - 2.5);
      slug.vy = -320;
      slug.onGround = false;
      statusEl.textContent =
        hazard.type === 'creek'
          ? `Splash! Jump the creek to save time. ${unlockedFacts.length}/${TARGET_FACTS} facts found.`
          : `Bump! Hop over the bushes to stay quick. ${unlockedFacts.length}/${TARGET_FACTS} facts found.`;
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

function drawRedwood(x, baseY, scale = 1, alpha = 1, lean = 0) {
  const trunkW = 20 * scale;
  const trunkH = 220 * scale;
  const trunkTopX = x + lean * 10 * scale;
  ctx.save();
  ctx.globalAlpha = alpha;

  const trunkGradient = ctx.createLinearGradient(x, baseY - trunkH, x, baseY);
  trunkGradient.addColorStop(0, '#6d3428');
  trunkGradient.addColorStop(0.3, '#84503a');
  trunkGradient.addColorStop(0.7, '#6f3a2b');
  trunkGradient.addColorStop(1, '#4b231c');
  ctx.fillStyle = trunkGradient;
  ctx.beginPath();
  ctx.moveTo(x - trunkW / 2, baseY);
  ctx.lineTo(trunkTopX - trunkW * 0.34, baseY - trunkH);
  ctx.lineTo(trunkTopX + trunkW * 0.34, baseY - trunkH);
  ctx.lineTo(x + trunkW / 2, baseY);
  ctx.closePath();
  ctx.fill();

  for (let i = -3; i <= 3; i += 1) {
    const stripeX = x + i * 3.5 * scale + lean * 3 * scale;
    const stripeShade = i % 2 === 0 ? '#9a6444' : '#51271f';
    ctx.fillStyle = stripeShade;
    ctx.fillRect(stripeX, baseY - trunkH, 1.5 * scale, trunkH);
  }

  ctx.fillStyle = '#c08a62';
  ctx.fillRect(x - 2 * scale, baseY - trunkH, 2 * scale, trunkH);

  const canopyBaseY = baseY - trunkH + 26 * scale;
  const foliageLayers = [
    { width: 64, height: 42, offsetY: 0, color: '#1f4a30' },
    { width: 52, height: 38, offsetY: -24, color: '#28553a' },
    { width: 42, height: 34, offsetY: -46, color: '#2f6141' },
    { width: 32, height: 28, offsetY: -66, color: '#3a714a' },
    { width: 22, height: 22, offsetY: -84, color: '#4a8253' },
  ];

  foliageLayers.forEach((layer, index) => {
    const layerY = canopyBaseY + layer.offsetY * scale;
    const layerW = layer.width * scale;
    const layerH = layer.height * scale;
    const shift = lean * (index + 1) * 3 * scale;
    ctx.fillStyle = layer.color;
    ctx.beginPath();
    ctx.moveTo(trunkTopX + shift, layerY - layerH);
    ctx.lineTo(trunkTopX - layerW / 2 + shift, layerY);
    ctx.quadraticCurveTo(trunkTopX + shift, layerY - layerH * 0.18, trunkTopX + layerW / 2 + shift, layerY);
    ctx.closePath();
    ctx.fill();
  });

  ctx.fillStyle = '#688f61';
  ctx.beginPath();
  ctx.ellipse(trunkTopX + lean * 10 * scale, canopyBaseY - 72 * scale, 8 * scale, 16 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawFern(x, y, scale = 1, flip = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flip, 1);
  ctx.strokeStyle = '#355e34';
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(6 * scale, -12 * scale, 12 * scale, -28 * scale);
  ctx.stroke();

  for (let i = 0; i < 4; i += 1) {
    const py = -6 * scale - i * 6 * scale;
    ctx.beginPath();
    ctx.moveTo(5 * scale, py);
    ctx.lineTo(14 * scale, py - 6 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(5 * scale, py - 1 * scale);
    ctx.lineTo(-4 * scale, py - 7 * scale);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBirdSilhouette(x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = 'rgba(32, 48, 39, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-10 * scale, 0, 10 * scale, Math.PI * 1.1, Math.PI * 1.9);
  ctx.arc(10 * scale, 0, 10 * scale, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
  ctx.restore();
}

function drawCloud(x, y, scale = 1) {
  const cloudGradient = ctx.createRadialGradient(x + 8 * scale, y - 8 * scale, 8, x, y, 50 * scale);
  cloudGradient.addColorStop(0, '#ffffffee');
  cloudGradient.addColorStop(1, '#dceeff9f');
  ctx.fillStyle = cloudGradient;
  ctx.beginPath();
  ctx.arc(x, y, 20 * scale, 0, Math.PI * 2);
  ctx.arc(x + 22 * scale, y - 8 * scale, 18 * scale, 0, Math.PI * 2);
  ctx.arc(x + 42 * scale, y, 16 * scale, 0, Math.PI * 2);
  ctx.fill();
}

function drawForestSprite(image, x, baseY, width, height, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(image, x, baseY - height, width, height);
  ctx.restore();
}

function drawBackground() {
  const theme = getSceneTheme();
  const motionFactor = getSceneMotionFactor();
  const skyGradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  skyGradient.addColorStop(0, theme.skyTop);
  skyGradient.addColorStop(0.45, theme.skyMid);
  skyGradient.addColorStop(1, theme.skyBottom);
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const sunGradient = ctx.createRadialGradient(theme.sunX, theme.sunY, 14, theme.sunX, theme.sunY, 130);
  sunGradient.addColorStop(0, theme.sunCore);
  sunGradient.addColorStop(1, '#ffe6ad00');
  ctx.fillStyle = sunGradient;
  ctx.fillRect(620, -30, 280, 220);

  const hazeGradient = ctx.createLinearGradient(0, 100, 0, 280);
  hazeGradient.addColorStop(0, theme.hazeTop);
  hazeGradient.addColorStop(1, theme.hazeBottom);
  ctx.fillStyle = hazeGradient;
  ctx.fillRect(0, 90, WIDTH, 180);

  const fogBand = ctx.createLinearGradient(0, 150, 0, 250);
  fogBand.addColorStop(0, 'rgba(222, 233, 219, 0)');
  fogBand.addColorStop(0.55, 'rgba(222, 233, 219, 0.16)');
  fogBand.addColorStop(1, 'rgba(222, 233, 219, 0)');
  ctx.fillStyle = fogBand;
  ctx.fillRect(0, 138, WIDTH, 120);

  const cloudOffset = (worldOffset * 0.15 * motionFactor) % (WIDTH + 150);
  drawCloud(120 - cloudOffset, 82, 1.25);
  drawCloud(390 - cloudOffset, 66, 1.1);
  drawCloud(770 - cloudOffset, 92, 1.35);
  drawCloud(980 - cloudOffset, 72, 1.05);
  drawBirdSilhouette(180 - cloudOffset * 0.3, 58, 0.8);
  drawBirdSilhouette(560 - cloudOffset * 0.2, 112, 0.65);

  const mountainFarGradient = ctx.createLinearGradient(0, 140, 0, 248);
  mountainFarGradient.addColorStop(0, theme.mountainFarTop);
  mountainFarGradient.addColorStop(1, theme.mountainFarBottom);
  ctx.fillStyle = mountainFarGradient;
  ctx.beginPath();
  ctx.moveTo(0, 232);
  ctx.lineTo(90, 176);
  ctx.lineTo(190, 214);
  ctx.lineTo(305, 162);
  ctx.lineTo(420, 220);
  ctx.lineTo(560, 150);
  ctx.lineTo(705, 216);
  ctx.lineTo(860, 164);
  ctx.lineTo(960, 220);
  ctx.lineTo(960, 260);
  ctx.lineTo(0, 260);
  ctx.closePath();
  ctx.fill();

  const mountainNearGradient = ctx.createLinearGradient(0, 165, 0, 274);
  mountainNearGradient.addColorStop(0, theme.mountainNearTop);
  mountainNearGradient.addColorStop(1, theme.mountainNearBottom);
  ctx.fillStyle = mountainNearGradient;
  ctx.beginPath();
  ctx.moveTo(0, 250);
  ctx.lineTo(120, 196);
  ctx.lineTo(245, 242);
  ctx.lineTo(360, 186);
  ctx.lineTo(520, 246);
  ctx.lineTo(680, 188);
  ctx.lineTo(840, 236);
  ctx.lineTo(960, 204);
  ctx.lineTo(960, 286);
  ctx.lineTo(0, 286);
  ctx.closePath();
  ctx.fill();

  const treeOffsetBackFar = (worldOffset * 0.2 * motionFactor) % 150;
  for (let i = -1; i < 9; i += 1) {
    drawRedwood(i * 150 + 30 - treeOffsetBackFar, 238, 0.95, theme.farTreeAlpha, i % 2 === 0 ? -0.12 : 0.08);
  }

  const treeOffsetBack = (worldOffset * 0.35 * motionFactor) % 126;
  for (let i = -1; i < 10; i += 1) {
    drawRedwood(i * 126 + 40 - treeOffsetBack, 250, 1.18, theme.backTreeAlpha, i % 3 === 0 ? -0.1 : 0.06);
  }

  const treeOffsetFront = (worldOffset * 0.55 * motionFactor) % 102;
  for (let i = -1; i < 12; i += 1) {
    drawRedwood(i * 102 + 18 - treeOffsetFront, 270, 1.28, theme.frontTreeAlpha, i % 2 === 0 ? 0.08 : -0.06);
  }

  if (treeSpriteReady) {
    const singleTreeOffset = (worldOffset * 0.48 * motionFactor) % 188;
    const singleTreeAlpha = theme.sceneKey === 'grove' ? 0.48 : theme.sceneKey === 'mountain' ? 0.3 : 0.16;
    const singleTreeWidth = theme.sceneKey === 'grove' ? 112 : 98;
    const singleTreeHeight = theme.sceneKey === 'grove' ? 196 : 172;
    const baseY = theme.sceneKey === 'grove' ? 278 : 270;
    const clusterOffsets = [
      { x: -36, y: 4, scale: 0.9, alpha: 0.72 },
      { x: -10, y: -6, scale: 1, alpha: 1 },
      { x: 18, y: 2, scale: 0.92, alpha: 0.76 },
      { x: 42, y: -10, scale: 0.82, alpha: 0.58 },
    ];
    for (let i = -1; i < 7; i += 1) {
      const clusterX = i * 188 + 24 - singleTreeOffset;
      clusterOffsets.forEach((offset) => {
        drawForestSprite(
          treeSprite,
          clusterX + offset.x,
          baseY + offset.y,
          singleTreeWidth * offset.scale,
          singleTreeHeight * offset.scale,
          singleTreeAlpha * offset.alpha
        );
      });
    }
  }

  const meadowGradient = ctx.createLinearGradient(0, GROUND_Y, 0, HEIGHT);
  meadowGradient.addColorStop(0, theme.meadowTop);
  meadowGradient.addColorStop(1, theme.meadowBottom);
  ctx.fillStyle = meadowGradient;
  ctx.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y);

  const stripOffset = worldOffset % 40;
  for (let i = -40; i < WIDTH + 40; i += 40) {
    ctx.fillStyle = '#648944';
    ctx.fillRect(i - stripOffset, GROUND_Y + 14, 24, 2);
    ctx.fillStyle = '#88ae60';
    ctx.fillRect(i - stripOffset + 10, GROUND_Y + 20, 20, 2);
  }

  const trailShadow = ctx.createLinearGradient(0, BRIDGE_TOP - 4, 0, BRIDGE_TOP + 44);
  trailShadow.addColorStop(0, '#4a332300');
  trailShadow.addColorStop(1, '#2e1d11aa');
  ctx.fillStyle = trailShadow;
  ctx.fillRect(0, BRIDGE_TOP - 4, WIDTH, 48);

  const trailGradient = ctx.createLinearGradient(0, BRIDGE_TOP, 0, BRIDGE_TOP + 38);
  trailGradient.addColorStop(0, theme.trailTop);
  trailGradient.addColorStop(0.5, theme.trailMid);
  trailGradient.addColorStop(1, theme.trailBottom);
  ctx.fillStyle = trailGradient;
  ctx.fillRect(0, BRIDGE_TOP, WIDTH, 38);

  ctx.fillStyle = '#b18961';
  ctx.fillRect(0, BRIDGE_TOP + 2, WIDTH, 2);
  ctx.fillStyle = '#65472f';
  ctx.fillRect(0, BRIDGE_TOP + 20, WIDTH, 2);

  const edgeOffset = worldOffset % 52;
  for (let i = -52; i < WIDTH + 52; i += 52) {
    const edgeX = i - edgeOffset;
    ctx.fillStyle = '#72994f';
    ctx.fillRect(edgeX, BRIDGE_TOP - 3, 18, 3);
    ctx.fillRect(edgeX + 26, BRIDGE_TOP + 38, 20, 3);
  }

  const pebbleOffset = worldOffset % 70;
  for (let i = -70; i < WIDTH + 70; i += 70) {
    const pebbleX = i - pebbleOffset;
    ctx.fillStyle = '#4e3b2c';
    ctx.fillRect(pebbleX + 10, BRIDGE_TOP + 10, 3, 2);
    ctx.fillRect(pebbleX + 34, BRIDGE_TOP + 26, 2, 2);
    ctx.fillRect(pebbleX + 52, BRIDGE_TOP + 14, 3, 2);
    ctx.fillStyle = '#b08a61';
    ctx.fillRect(pebbleX + 22, BRIDGE_TOP + 18, 2, 1);
  }

  for (let i = 0; i < 10; i += 1) {
    const fernBaseX = (i * 108 - (worldOffset * 0.9) % 108) - 10;
    drawFern(fernBaseX, GROUND_Y + 4, 0.95, i % 2 === 0 ? 1 : -1);
  }
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
    const glow = ctx.createRadialGradient(x, y, 2, x, y, 22);
    glow.addColorStop(0, '#dff5c2cc');
    glow.addColorStop(1, '#dff5c200');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(spin);
    ctx.fillStyle = '#f1ead6';
    ctx.fillRect(-11, -14, 22, 28);
    ctx.fillStyle = '#d9ccac';
    ctx.fillRect(-9, -12, 18, 24);
    ctx.fillStyle = '#88ad68';
    ctx.fillRect(-11, -14, 22, 4);
    ctx.fillStyle = '#7b9d5d';
    ctx.fillRect(-7, -5, 12, 2);
    ctx.fillRect(-7, 1, 12, 2);
    ctx.fillRect(-7, 7, 12, 2);
    ctx.fillStyle = '#4f653b';
    ctx.font = 'bold 11px Georgia, serif';
    ctx.fillText('i', -1.5, -1);
    ctx.restore();
  }
}

function drawWaterHazards() {
  for (const hazard of waterHazards) {
    if (!hazard.active) {
      continue;
    }

    if (hazard.type === 'bush') {
      ctx.fillStyle = '#00000024';
      ctx.beginPath();
      ctx.ellipse(hazard.x + hazard.w * 0.5, hazard.y + hazard.h + 6, hazard.w * 0.4, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      if (bushSpriteReady) {
        ctx.drawImage(bushSprite, hazard.x - 12, hazard.y - 18, hazard.w + 24, hazard.h + 24);
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

    const waterGradient = ctx.createLinearGradient(hazard.x, hazard.y, hazard.x, hazard.y + hazard.h);
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

function drawBobcat() {
  const x = slug.x;
  const y = slug.y;

  if (bobcatSpriteReady) {
    const spriteScale = 1.95;
    const baseWidth = slug.w + 28;
    const baseHeight = slug.h + 22;
    const drawWidth = baseWidth * spriteScale;
    const drawHeight = baseHeight * spriteScale;
    const drawX = x - (drawWidth - slug.w) / 2 - 2;
    const drawY = y + slug.h - drawHeight + 3;

    ctx.fillStyle = '#00000030';
    ctx.beginPath();
    ctx.ellipse(x + slug.w * 0.45, y + slug.h - 1, 24, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(bobcatSprite, drawX, drawY, drawWidth, drawHeight);
    return;
  }

  const scale = 1.35;
  const bobcatX = x - 6;
  const bobcatY = y - 10;
  ctx.fillStyle = '#00000028';
  ctx.beginPath();
  ctx.ellipse(bobcatX + 28, bobcatY + 38, 24, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#c98d59';
  ctx.fillRect(bobcatX + 4 * scale, bobcatY + 16 * scale, 32 * scale, 14 * scale);
  ctx.fillRect(bobcatX + 24 * scale, bobcatY + 8 * scale, 14 * scale, 12 * scale);
  ctx.fillStyle = '#efd7b2';
  ctx.fillRect(bobcatX + 27 * scale, bobcatY + 12 * scale, 8 * scale, 4 * scale);
  ctx.fillStyle = '#7a4d2d';
  ctx.fillRect(bobcatX + 8 * scale, bobcatY + 20 * scale, 4 * scale, 10 * scale);
  ctx.fillRect(bobcatX + 18 * scale, bobcatY + 20 * scale, 4 * scale, 10 * scale);
  ctx.fillRect(bobcatX + 28 * scale, bobcatY + 20 * scale, 4 * scale, 10 * scale);
  ctx.fillRect(bobcatX - 2 * scale, bobcatY + 17 * scale, 10 * scale, 4 * scale);
  ctx.fillRect(bobcatX - 8 * scale, bobcatY + 12 * scale, 8 * scale, 4 * scale);
  ctx.fillStyle = '#f6e3c1';
  ctx.fillRect(bobcatX + 28 * scale, bobcatY + 8 * scale, 3 * scale, 4 * scale);
  ctx.fillRect(bobcatX + 34 * scale, bobcatY + 8 * scale, 3 * scale, 4 * scale);
  ctx.fillStyle = '#24150f';
  ctx.fillRect(bobcatX + 31 * scale, bobcatY + 14 * scale, 2.5 * scale, 2.5 * scale);
}

function drawFalcon() {
  const x = slug.x;
  const y = slug.y;

  if (falconSpriteReady) {
    const spriteScale = 1.9;
    const baseWidth = slug.w + 24;
    const baseHeight = slug.h + 20;
    const drawWidth = baseWidth * spriteScale;
    const drawHeight = baseHeight * spriteScale;
    const drawX = x - (drawWidth - slug.w) / 2;
    const drawY = y + slug.h - drawHeight + 4;

    ctx.fillStyle = '#0000002b';
    ctx.beginPath();
    ctx.ellipse(x + slug.w * 0.45, y + slug.h - 1, 22, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(falconSprite, drawX, drawY, drawWidth, drawHeight);
    return;
  }

  const scale = 1.5;
  const birdX = x - 4;
  const birdY = y - 8;
  ctx.fillStyle = '#00000022';
  ctx.beginPath();
  ctx.ellipse(birdX + 26, birdY + 36, 23, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#5b473c';
  ctx.beginPath();
  ctx.ellipse(birdX + 18 * scale, birdY + 16 * scale, 16 * scale, 10 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f2efe6';
  ctx.beginPath();
  ctx.ellipse(birdX + 20 * scale, birdY + 18 * scale, 8 * scale, 6 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3b2f28';
  ctx.beginPath();
  ctx.moveTo(birdX + 6 * scale, birdY + 16 * scale);
  ctx.lineTo(birdX - 4 * scale, birdY + 10 * scale);
  ctx.lineTo(birdX + 2 * scale, birdY + 20 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(birdX + 26 * scale, birdY + 14 * scale);
  ctx.lineTo(birdX + 40 * scale, birdY + 10 * scale);
  ctx.lineTo(birdX + 29 * scale, birdY + 19 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c97f37';
  ctx.beginPath();
  ctx.moveTo(birdX + 35 * scale, birdY + 14 * scale);
  ctx.lineTo(birdX + 43 * scale, birdY + 16 * scale);
  ctx.lineTo(birdX + 35 * scale, birdY + 18 * scale);
  ctx.closePath();
  ctx.fill();
}

function drawWoodrat() {
  const x = slug.x;
  const y = slug.y;

  if (woodratSpriteReady) {
    const spriteScale = 1.9;
    const baseWidth = slug.w + 26;
    const baseHeight = slug.h + 20;
    const drawWidth = baseWidth * spriteScale;
    const drawHeight = baseHeight * spriteScale;
    const drawX = x - (drawWidth - slug.w) / 2 - 1;
    const drawY = y + slug.h - drawHeight + 4;

    ctx.fillStyle = '#0000002d';
    ctx.beginPath();
    ctx.ellipse(x + slug.w * 0.45, y + slug.h - 1, 23, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(woodratSprite, drawX, drawY, drawWidth, drawHeight);
    return;
  }

  const scale = 1.28;
  const ratX = x - 2;
  const ratY = y - 10;

  ctx.fillStyle = '#00000026';
  ctx.beginPath();
  ctx.ellipse(ratX + 28, ratY + 38, 24, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#7b5b45';
  ctx.beginPath();
  ctx.ellipse(ratX + 18 * scale, ratY + 18 * scale, 15 * scale, 10 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#8f6b52';
  ctx.beginPath();
  ctx.ellipse(ratX + 31 * scale, ratY + 15 * scale, 8 * scale, 7 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#cfa98c';
  ctx.beginPath();
  ctx.ellipse(ratX + 33 * scale, ratY + 18 * scale, 5 * scale, 4 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#d8b7a0';
  ctx.beginPath();
  ctx.ellipse(ratX + 28 * scale, ratY + 10 * scale, 3 * scale, 4 * scale, -0.3, 0, Math.PI * 2);
  ctx.ellipse(ratX + 35 * scale, ratY + 9 * scale, 3 * scale, 4 * scale, 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#c58f7b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ratX + 6 * scale, ratY + 16 * scale);
  ctx.quadraticCurveTo(ratX - 12 * scale, ratY + 8 * scale, ratX - 4 * scale, ratY + 1 * scale);
  ctx.stroke();

  ctx.fillStyle = '#5f4434';
  ctx.fillRect(ratX + 10 * scale, ratY + 22 * scale, 3 * scale, 8 * scale);
  ctx.fillRect(ratX + 20 * scale, ratY + 22 * scale, 3 * scale, 8 * scale);
  ctx.fillRect(ratX + 28 * scale, ratY + 22 * scale, 3 * scale, 8 * scale);

  ctx.fillStyle = '#2f1f19';
  ctx.fillRect(ratX + 34 * scale, ratY + 16 * scale, 2.2 * scale, 2.2 * scale);

  ctx.strokeStyle = '#d8b7a0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(ratX + 38 * scale, ratY + 18 * scale);
  ctx.lineTo(ratX + 44 * scale, ratY + 16 * scale);
  ctx.moveTo(ratX + 38 * scale, ratY + 19 * scale);
  ctx.lineTo(ratX + 44 * scale, ratY + 19 * scale);
  ctx.moveTo(ratX + 38 * scale, ratY + 20 * scale);
  ctx.lineTo(ratX + 44 * scale, ratY + 22 * scale);
  ctx.stroke();

  ctx.fillStyle = '#efe1cf';
  ctx.beginPath();
  ctx.ellipse(ratX + 24 * scale, ratY + 20 * scale, 7 * scale, 4 * scale, 0, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawSlug() {
  const x = slug.x;
  const y = slug.y;

  if (slugSpriteReady) {
    const spriteScale = 2.05;
    const baseWidth = slug.w + 24;
    const baseHeight = slug.h + 18;
    const drawWidth = baseWidth * spriteScale;
    const drawHeight = baseHeight * spriteScale;
    const drawX = x - (drawWidth - slug.w) / 2;
    const drawY = y + slug.h - drawHeight + 2;

    const shadowWidth = slug.w + 24 + Math.abs(slug.vy) * 0.01;
    ctx.fillStyle = '#00000030';
    ctx.beginPath();
    ctx.ellipse(x + slug.w * 0.45, y + slug.h - 1, shadowWidth * 0.4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(slugSprite, drawX, drawY, drawWidth, drawHeight);
    return;
  }

  ctx.fillStyle = '#d4a80c';
  ctx.fillRect(x - 2, y + 8, slug.w + 4, slug.h - 4);

  ctx.fillStyle = '#f4cf2d';
  ctx.fillRect(x, y + 6, slug.w, slug.h - 6);
  ctx.fillRect(x + slug.w - 8, y + 2, 12, 12);

  ctx.fillStyle = '#ffe27a';
  ctx.fillRect(x + 6, y + 9, 16, 5);
  ctx.fillRect(x + slug.w - 7, y + 4, 6, 4);

  ctx.fillStyle = '#222';
  ctx.fillRect(x + slug.w - 3, y + 5, 3, 3);

  ctx.fillStyle = '#8a6d00';
  ctx.fillRect(x + 3, y + slug.h - 2, slug.w - 6, 2);
}

function drawRunner() {
  if (selectedRunner === 'bobcat') {
    drawBobcat();
    return;
  }

  if (selectedRunner === 'falcon') {
    drawFalcon();
    return;
  }

  if (selectedRunner === 'woodrat') {
    drawWoodrat();
    return;
  }

  drawSlug();
}

function drawHud() {
  if (gameState === 'ready' || gameState === 'countdown') {
    return;
  }

  const panelGradient = ctx.createLinearGradient(0, 0, 0, 42);
  panelGradient.addColorStop(0, 'rgba(15, 27, 22, 0.88)');
  panelGradient.addColorStop(1, 'rgba(15, 27, 22, 0.56)');
  ctx.fillStyle = panelGradient;
  ctx.fillRect(0, 0, WIDTH, 42);
  ctx.fillStyle = '#f4ead1';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.fillText(`TIME ${timeLeft.toFixed(1)}s`, 16, 25);
  ctx.fillText(`FACTS ${unlockedFacts.length}/${TARGET_FACTS}`, 174, 25);
  ctx.fillText(getSceneTheme().label.toUpperCase(), 332, 25);
  ctx.fillText(runnerNames[selectedRunner].toUpperCase(), 636, 25);
}

function draw() {
  drawBackground();
  drawWaterHazards();
  drawFactPickups();
  drawRunner();
  drawHud();

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
    const countdownLabel = countdownTimeLeft > 3 ? '3' : countdownTimeLeft > 2 ? '2' : countdownTimeLeft > 1 ? '1' : 'Go!';
    const countdownSize = countdownLabel === 'Go!' ? 52 : 76;

    ctx.fillStyle = 'rgba(8, 14, 11, 0.2)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = '#fff6e0';
    ctx.font = `bold ${countdownSize}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.fillText(countdownLabel, WIDTH / 2, HEIGHT / 2 + 10);
    ctx.font = '20px Georgia, serif';
    ctx.fillText('Get ready to run', WIDTH / 2, HEIGHT / 2 + 52);
    ctx.textAlign = 'start';
  }

  if (gameState === 'paused') {
    ctx.fillStyle = 'rgba(8, 14, 11, 0.34)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = '#fff6e0';
    ctx.font = 'bold 30px Georgia, serif';
    ctx.fillText('Trail Paused', WIDTH / 2 - 82, HEIGHT / 2 - 10);
    ctx.font = '18px Georgia, serif';
    ctx.fillText('Press Resume, P, or Escape to continue', WIDTH / 2 - 164, HEIGHT / 2 + 22);
  }
}

function gameLoop(timestamp) {
  if (!lastTime) {
    lastTime = timestamp;
  }

  const dt = Math.min((timestamp - lastTime) / 1000, 0.033);
  lastTime = timestamp;

  update(dt);
  draw();

  requestAnimationFrame(gameLoop);
}

setupLevel();
renderEndSummary();
syncUiState();
requestAnimationFrame(gameLoop);
