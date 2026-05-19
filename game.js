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
slugSprite.src = 'banana_slug.png';
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

const treeBackgroundLayer = new Image();
let treeBackgroundLayerReady = false;
treeBackgroundLayer.src = 'tree-background-layer.png';
treeBackgroundLayer.onload = () => {
  treeBackgroundLayerReady = true;
};
treeBackgroundLayer.onerror = () => {
  treeBackgroundLayerReady = false;
};

const newTreeSprite = new Image();
let newTreeSpriteReady = false;
newTreeSprite.src = 'new_tree.png';
newTreeSprite.onload = () => {
  newTreeSpriteReady = true;
};
newTreeSprite.onerror = () => {
  newTreeSpriteReady = false;
};

const multipleTreesSprite = new Image();
let multipleTreesSpriteReady = false;
multipleTreesSprite.src = 'multipletrees.png';
multipleTreesSprite.onload = () => {
  multipleTreesSpriteReady = true;
};
multipleTreesSprite.onerror = () => {
  multipleTreesSpriteReady = false;
};

const cloudsSprite = new Image();
let cloudsSpriteReady = false;
cloudsSprite.src = 'clouds.png';
cloudsSprite.onload = () => {
  cloudsSpriteReady = true;
};
cloudsSprite.onerror = () => {
  cloudsSpriteReady = false;
};

const sunSprite = new Image();
let sunSpriteReady = false;
sunSprite.src = 'sun_.png';
sunSprite.onload = () => {
  sunSpriteReady = true;
};
sunSprite.onerror = () => {
  sunSpriteReady = false;
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
const GAME_SECONDS = 60;
const TARGET_FACTS = 10;
const RUNNER_SPRITE_SCALE_MULTIPLIER = 2;
const FACT_PICKUP_SCALE_MULTIPLIER = 1.5;
const TREE_DENSITY_MULTIPLIER = 1.1;
const RETRO_PIXEL_SIZE = 4;
const TREE_VISUAL_SECONDS = 24;
const BACKGROUND_TREE_VISUAL_SECONDS = 72;

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
    startButton.textContent = 'Start';
  } else if (gameState === 'playing') {
    startButton.textContent = 'Pause';
  } else if (gameState === 'paused') {
    startButton.textContent = 'Resume';
  } else if (gameState === 'countdown') {
    startButton.textContent = 'Get Ready';
  } else {
    startButton.textContent = 'Start';
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
    frontTreeAlpha: 0.36,
    backTreeAlpha: 0.22,
    farTreeAlpha: 0.1,
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
    frontTreeAlpha: 0.28,
    backTreeAlpha: 0.17,
    farTreeAlpha: 0.08,
  },
  {
    label: 'Golden Canopy',
    sceneKey: 'sunny',
    skyTop: '#6b98be',
    skyMid: '#a7c9d8',
    skyBottom: '#f4d8a8',
    hazeTop: '#fff0d100',
    hazeBottom: '#f5dcb59c',
    sunX: 752,
    sunY: 74,
    sunCore: '#ffe8add8',
    mountainFarTop: '#9aad8f',
    mountainFarBottom: '#7d9075',
    mountainNearTop: '#61775c',
    mountainNearBottom: '#455842',
    meadowTop: '#93b766',
    meadowBottom: '#65894c',
    trailTop: '#b07a4e',
    trailMid: '#8b5d3d',
    trailBottom: '#6d4732',
    frontTreeAlpha: 0.3,
    backTreeAlpha: 0.18,
    farTreeAlpha: 0.08,
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
    frontTreeAlpha: 0.31,
    backTreeAlpha: 0.19,
    farTreeAlpha: 0.09,
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
  const sceneLength = GAME_SECONDS / sceneThemes.length;
  const transitionSpan = 9;

  for (let i = 0; i < sceneThemes.length; i += 1) {
    const boundary = sceneLength * (i + 1);
    const currentTheme = sceneThemes[i];
    const nextTheme = sceneThemes[i + 1];

    if (elapsed < boundary) {
      if (nextTheme && elapsed > boundary - transitionSpan) {
        const rawAmount = (elapsed - (boundary - transitionSpan)) / transitionSpan;
        const amount = smoothStep(smoothStep(rawAmount));
        return blendThemes(currentTheme, nextTheme, amount);
      }
      return currentTheme;
    }
  }

  return sceneThemes[sceneThemes.length - 1];
}

function getCurrentSpeed() {
  const elapsed = GAME_SECONDS - timeLeft;
  const sceneLength = GAME_SECONDS / sceneThemes.length;

  if (elapsed < sceneLength) {
    return baseWorldSpeed;
  }

  if (elapsed < sceneLength * 2) {
    return baseWorldSpeed * 1.06;
  }

  if (elapsed < sceneLength * 3) {
    return baseWorldSpeed * 1.13;
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

function getFactRespawnX(factId) {
  const furthestPickupX = factPickups.reduce((maxX, pickup) => (
    pickup.active ? Math.max(maxX, pickup.x + pickup.w) : maxX
  ), WIDTH + 40);
  const furthestHazardX = waterHazards.reduce((maxX, hazard) => (
    hazard.active ? Math.max(maxX, hazard.x + hazard.w) : maxX
  ), WIDTH + 40);
  const spacing = 150 + (factId % 3) * 55;

  return Math.max(furthestPickupX, furthestHazardX) + spacing;
}

function renderEndSummary() {
  if (gameState === 'playing' || gameState === 'ready') {
    endSummaryEl.hidden = true;
    endSummaryEl.classList.remove('is-visible');
    document.body.classList.remove('summary-open');
    syncUiState();
    return;
  }

  endSummaryEl.hidden = false;
  document.body.classList.add('summary-open');
  summarySlides = activeFacts.map((fact) => ({
    label: fact.label,
    text: fact.text,
  }));

  if (summarySlides.length === 0) {
    summarySlides = [
      {
        label: 'Keep Exploring',
        text: 'This trail did not generate any facts. Try again and discover 10 redwood and wildlife facts.',
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
  document.body.classList.remove('summary-open');
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

  if (gameState === 'ready') {
    setupLevel();
  }
}

function startGame() {
  if (gameState === 'playing') {
    gameState = 'paused';
    statusEl.textContent = 'Trail paused.';
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

function getPickupHeights() {
  const woodratOffset = selectedRunner === 'woodrat' ? 26 : 0;

  return [
    BRIDGE_TOP - 24 - woodratOffset,
    BRIDGE_TOP - 54 - woodratOffset,
    BRIDGE_TOP - 88 - woodratOffset,
    BRIDGE_TOP - 120 - woodratOffset,
  ];
}

function setupLevel() {
  factPickups.length = 0;
  waterHazards.length = 0;
  activeFacts = buildFactRun();
  const factEncounterX = slug.x + slug.w;
  const hazardEncounterX = slug.x + slug.w - 10;
  const pickupHeights = getPickupHeights();
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

function getFactCollectionRect() {
  const runnerPickupZones = {
    slug: { left: 16, top: 34, right: 26, bottom: 14 },
    bobcat: { left: 20, top: 54, right: 30, bottom: 16 },
    falcon: { left: 24, top: 52, right: 32, bottom: 18 },
    woodrat: { left: 18, top: 48, right: 28, bottom: 16 },
  };
  const zone = runnerPickupZones[selectedRunner] || runnerPickupZones.slug;

  return {
    x: slug.x - zone.left,
    y: slug.y - zone.top,
    w: slug.w + zone.left + zone.right,
    h: slug.h + zone.top + zone.bottom,
  };
}

function getHudRunnerName() {
  if (window.innerWidth <= 700 && selectedRunner === 'woodrat') {
    return 'Woodrat';
  }

  return runnerNames[selectedRunner];
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
      if (unlockedFacts.includes(fact.id)) {
        fact.active = false;
      } else {
        fact.x = getFactRespawnX(fact.id);
      }
      continue;
    }

    const factCollectionRect = getFactCollectionRect();
    if (intersectsRectRect(fact, factCollectionRect)) {
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
          ? `Splash! ${unlockedFacts.length}/${TARGET_FACTS} facts found.`
          : `Bump! ${unlockedFacts.length}/${TARGET_FACTS} facts found.`;
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

const cloudFrames = [
  { x: 70, y: 92, w: 630, h: 228 },
  { x: 785, y: 138, w: 610, h: 210 },
  { x: 110, y: 374, w: 520, h: 210 },
  { x: 700, y: 380, w: 470, h: 168 },
  { x: 1110, y: 464, w: 360, h: 150 },
  { x: 82, y: 700, w: 480, h: 165 },
  { x: 682, y: 682, w: 570, h: 180 },
];

function drawCloud(x, y, scale = 1, frameIndex = 0, alpha = 0.42) {
  if (!cloudsSpriteReady) {
    return;
  }

  const frame = cloudFrames[frameIndex % cloudFrames.length];
  const drawW = frame.w * scale;
  const drawH = frame.h * scale;
  const pulse = 0.55 + 0.45 * (Math.sin(pulseTime * 0.9 + frameIndex * 1.7) * 0.5 + 0.5);
  const animatedAlpha = Math.min(1, alpha * (0.75 + pulse * 0.8));
  ctx.save();
  ctx.globalAlpha = animatedAlpha;
  ctx.drawImage(cloudsSprite, frame.x, frame.y, frame.w, frame.h, x, y, drawW, drawH);
  ctx.restore();
}

function drawSunLayer() {
  if (!sunSpriteReady) {
    return;
  }

  const sourceX = 380;
  const sourceY = 120;
  const sourceW = 780;
  const sourceH = 760;
  const drawW = 180;
  const drawH = 176;
  const x = WIDTH - 310;
  const y = 24;

  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.drawImage(sunSprite, sourceX, sourceY, sourceW, sourceH, x, y, drawW, drawH);
  ctx.restore();
}

function drawMountainLayer(baseY, peakHeight, speed, topColor, bottomColor, alpha = 1, phase = 0) {
  const offset = (worldOffset * speed + phase) % WIDTH;
  ctx.save();
  ctx.globalAlpha = alpha;
  const mountainGradient = ctx.createLinearGradient(0, baseY - peakHeight, 0, baseY + 44);
  mountainGradient.addColorStop(0, topColor);
  mountainGradient.addColorStop(1, bottomColor);
  ctx.fillStyle = mountainGradient;

  for (let i = -1; i < 3; i += 1) {
    const x = i * WIDTH - offset;
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.lineTo(x + 124, baseY - peakHeight * 0.62);
    ctx.lineTo(x + 250, baseY - peakHeight * 0.3);
    ctx.lineTo(x + 392, baseY - peakHeight);
    ctx.lineTo(x + 548, baseY - peakHeight * 0.34);
    ctx.lineTo(x + 710, baseY - peakHeight * 0.78);
    ctx.lineTo(x + WIDTH, baseY - peakHeight * 0.28);
    ctx.lineTo(x + WIDTH, GROUND_Y);
    ctx.lineTo(x, GROUND_Y);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function drawTreeBackgroundLayer() {
  if (!treeBackgroundLayerReady) {
    return;
  }

  const sourceX = 0;
  const sourceY = 115;
  const sourceW = 1536;
  const sourceH = 770;
  const layerH = 274;
  const layerW = layerH * (sourceW / sourceH);
  const layerStep = layerW * 0.82;
  const baseY = 318;
  const layerSpeed = (WIDTH + layerW) / (baseWorldSpeed * BACKGROUND_TREE_VISUAL_SECONDS);
  const offset = (worldOffset * layerSpeed) % layerStep;

  ctx.save();
  ctx.globalAlpha = 1;
  for (let i = -3; i < WIDTH / layerStep + 4; i += 1) {
    const x = i * layerStep - offset;
    ctx.drawImage(
      treeBackgroundLayer,
      sourceX,
      sourceY,
      sourceW,
      sourceH,
      x,
      baseY - layerH,
      layerW,
      layerH
    );
  }

  ctx.restore();
}

function drawTreeSpriteLayer(image, ready, theme, motionFactor, options) {
  if (!ready) {
    return;
  }

  const sourceW = 1024;
  const sourceH = 1536;
  // Foreground tree layers should remain temporally continuous across scene/theme changes.
  // Use fixed layer parameters so no abrupt reseeding occurs at transition boundaries.
  const spacing = options.spacing;
  const baseY = options.baseY;
  const alpha = options.alpha;
  const maxHeight = options.height + Math.abs(options.heightJitter);
  const maxWidth = maxHeight * (sourceW / sourceH);
  const visualSeconds = options.visualSeconds || TREE_VISUAL_SECONDS;
  const layerSpeed = (WIDTH + maxWidth) / (baseWorldSpeed * visualSeconds * motionFactor);
  const offset = (worldOffset * layerSpeed * motionFactor + options.phase) % spacing;

  ctx.save();
  for (let i = -6; i < WIDTH / spacing + 8; i += 1) {
    if (options.skipEvery && i % options.skipEvery === 0) {
      continue;
    }
    const height = options.height + (i % 2 === 0 ? options.heightJitter : -options.heightJitter);
    const width = height * (sourceW / sourceH);
    const x = i * spacing + (options.xJitter || 0) - offset;
    const entryStartX = WIDTH + 70;
    const entryEndX = WIDTH - 140;
    let entryFade = 1;
    if (x > entryEndX) {
      const t = (entryStartX - x) / (entryStartX - entryEndX);
      entryFade = Math.max(0, Math.min(1, t));
    }
    ctx.globalAlpha = alpha * entryFade;
    ctx.drawImage(image, 0, 0, sourceW, sourceH, x, baseY - height, width, height);
  }
  ctx.restore();
}

function drawTreeAccentLayers(theme, motionFactor) {
  drawTreeSpriteLayer(multipleTreesSprite, multipleTreesSpriteReady, theme, motionFactor, {
    visualSeconds: 96,
    phase: 120,
    spacing: 600,
    baseY: 350,
    alpha: 1,
    height: 368,
    heightJitter: 18,
    xJitter: 0,
  });

  drawTreeSpriteLayer(newTreeSprite, newTreeSpriteReady, theme, motionFactor, {
    visualSeconds: 100,
    phase: 430,
    spacing: 760,
    baseY: 356,
    alpha: 1,
    height: 406,
    heightJitter: 14,
    xJitter: 0,
  });

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

  const skyBloom = ctx.createLinearGradient(0, 0, 0, 180);
  skyBloom.addColorStop(0, 'rgba(255, 248, 227, 0.08)');
  skyBloom.addColorStop(0.55, 'rgba(255, 248, 227, 0.02)');
  skyBloom.addColorStop(1, 'rgba(255, 248, 227, 0)');
  ctx.fillStyle = skyBloom;
  ctx.fillRect(0, 0, WIDTH, 180);

  drawSunLayer();

  const elapsedRatio = Math.max(0, Math.min(1, (GAME_SECONDS - timeLeft) / GAME_SECONDS));
  const midSunStrength = Math.max(0, 1 - Math.abs(elapsedRatio - 0.5) / 0.32);
  const cloudVisibilityFactor = 1 - midSunStrength * 0.7;
  const cloudOffset = (worldOffset * 0.035 * motionFactor) % (WIDTH + 260);
  drawCloud(80 - cloudOffset, 58, 0.34, 1, 0.62 * cloudVisibilityFactor);
  drawCloud(420 - cloudOffset, 74, 0.28, 3, 0.54 * cloudVisibilityFactor);
  drawCloud(790 - cloudOffset, 62, 0.32, 0, 0.58 * cloudVisibilityFactor);
  drawCloud(1160 - cloudOffset, 78, 0.26, 4, 0.5 * cloudVisibilityFactor);
  drawBirdSilhouette(180 - cloudOffset * 0.3, 58, 0.8);
  drawBirdSilhouette(560 - cloudOffset * 0.2, 112, 0.65);

  drawMountainLayer(246, 92, 0.025 * motionFactor, theme.mountainFarTop, theme.mountainFarBottom, 0.78, 0);
  drawMountainLayer(286, 76, 0.045 * motionFactor, theme.mountainNearTop, theme.mountainNearBottom, 0.86, 340);

  drawTreeBackgroundLayer();
  drawTreeAccentLayers(theme, motionFactor);

  const meadowGradient = ctx.createLinearGradient(0, GROUND_Y, 0, HEIGHT);
  meadowGradient.addColorStop(0, theme.meadowTop);
  meadowGradient.addColorStop(1, theme.meadowBottom);
  ctx.fillStyle = meadowGradient;
  ctx.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y);

  const stripOffset = Math.floor(worldOffset % 40);
  for (let i = -40; i < WIDTH + 40; i += 40) {
    const stripX = Math.round((i - stripOffset) / RETRO_PIXEL_SIZE) * RETRO_PIXEL_SIZE;
    ctx.fillStyle = '#4f733e';
    ctx.fillRect(stripX, GROUND_Y + 12, 24, 3);
    ctx.fillStyle = '#91b965';
    ctx.fillRect(stripX + 12, GROUND_Y + 22, 20, 3);
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
  ctx.fillStyle = 'rgba(44, 29, 18, 0.24)';
  for (let y = BRIDGE_TOP + 6; y < BRIDGE_TOP + 38; y += 8) {
    ctx.fillRect(0, y, WIDTH, 2);
  }

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

function drawIntroLeaves() {
  if (gameState !== 'playing') {
    return;
  }

  const elapsed = GAME_SECONDS - timeLeft;
  if (elapsed < 0 || elapsed > 3) {
    return;
  }

  const fade = 1 - elapsed / 3;
  const leafCount = 44;
  ctx.save();
  ctx.globalAlpha = 1 * fade;

  for (let i = 0; i < leafCount; i += 1) {
    const lane = i / leafCount;
    const sway = Math.sin((pulseTime * 2.8) + i * 1.13) * 24;
    const fall = ((elapsed * 180 + i * 34) % (HEIGHT + 100)) - 60;
    const drift = (worldOffset * 0.12 + i * 67) % (WIDTH + 140);
    const x = WIDTH - drift + sway;
    const y = Math.max(-24, Math.min(HEIGHT - 8, fall + lane * 18));
    const w = i % 3 === 0 ? 17 : 13;
    const h = i % 2 === 0 ? 9 : 7;
    const rot = Math.sin((pulseTime * 3.2) + i * 0.8) * 0.7;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = i % 4 === 0 ? 'rgba(210, 162, 62, 1)' : 'rgba(138, 176, 68, 1)';
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
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
    const glowRadius = 22 * FACT_PICKUP_SCALE_MULTIPLIER;
    const glow = ctx.createRadialGradient(x, y, 2, x, y, glowRadius);
    glow.addColorStop(0, '#dff5c2cc');
    glow.addColorStop(1, '#dff5c200');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(spin);
    ctx.scale(FACT_PICKUP_SCALE_MULTIPLIER, FACT_PICKUP_SCALE_MULTIPLIER);
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
      if (bushSpriteReady) {
        ctx.drawImage(bushSprite, hazard.x - 12, hazard.y - 8, hazard.w + 24, hazard.h + 24);
      } else {
        ctx.fillStyle = '#436d34';
        ctx.beginPath();
        ctx.arc(hazard.x + 18, hazard.y + 42, 18, Math.PI, 0);
        ctx.arc(hazard.x + 38, hazard.y + 30, 22, Math.PI, 0);
        ctx.arc(hazard.x + 60, hazard.y + 38, 18, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#7ab257';
        ctx.beginPath();
        ctx.arc(hazard.x + 20, hazard.y + 36, 12, Math.PI, 0);
        ctx.arc(hazard.x + 42, hazard.y + 24, 15, Math.PI, 0);
        ctx.arc(hazard.x + 62, hazard.y + 32, 11, Math.PI, 0);
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
    const spriteScale = 1.95 * RUNNER_SPRITE_SCALE_MULTIPLIER;
    const baseWidth = slug.w + 28;
    const baseHeight = slug.h + 22;
    const drawWidth = baseWidth * spriteScale;
    const drawHeight = baseHeight * spriteScale;
    const drawX = x - (drawWidth - slug.w) / 2 - 2;
    const drawY = y + slug.h - drawHeight + 10;

    ctx.drawImage(bobcatSprite, drawX, drawY, drawWidth, drawHeight);
    return;
  }

  const scale = 1.35;
  const bobcatX = x - 6;
  const bobcatY = y - 10;

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
    const spriteScale = 1.9 * RUNNER_SPRITE_SCALE_MULTIPLIER;
    const baseWidth = slug.w + 24;
    const baseHeight = slug.h + 20;
    const drawWidth = baseWidth * spriteScale;
    const drawHeight = baseHeight * spriteScale;
    const drawX = x - (drawWidth - slug.w) / 2;
    const drawY = y + slug.h - drawHeight + 9;

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
    const spriteScale = 1.9 * RUNNER_SPRITE_SCALE_MULTIPLIER;
    const baseWidth = slug.w + 26;
    const baseHeight = slug.h + 20;
    const drawWidth = baseWidth * spriteScale;
    const drawHeight = baseHeight * spriteScale;
    const drawX = x - (drawWidth - slug.w) / 2 - 1;
    const drawY = y + slug.h - drawHeight + 28;

    ctx.drawImage(woodratSprite, drawX, drawY, drawWidth, drawHeight);
    return;
  }

  const scale = 1.28;
  const ratX = x - 2;
  const ratY = y - 10;

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
    const spriteScale = 2.05 * RUNNER_SPRITE_SCALE_MULTIPLIER;
    const baseWidth = slug.w + 24;
    const baseHeight = slug.h + 18;
    const drawWidth = baseWidth * spriteScale;
    const drawHeight = baseHeight * spriteScale;
    const drawX = x - (drawWidth - slug.w) / 2;
    const drawY = y + slug.h - drawHeight + 32;

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

  const isMobileHud = window.innerWidth <= 700;
  const panelHeight = isMobileHud ? 68 : 42;
  const fontSize = isMobileHud ? 30 : 15;
  const textY = isMobileHud ? 42 : 25;
  const panelGradient = ctx.createLinearGradient(0, 0, 0, panelHeight);
  panelGradient.addColorStop(0, 'rgba(15, 27, 22, 0.88)');
  panelGradient.addColorStop(1, 'rgba(15, 27, 22, 0.56)');
  ctx.fillStyle = panelGradient;
  ctx.fillRect(0, 0, WIDTH, panelHeight);
  ctx.fillStyle = '#f4ead1';
  ctx.font = `bold ${fontSize}px Georgia, serif`;

  if (isMobileHud) {
    ctx.textAlign = 'left';
    ctx.fillText(`TIME ${timeLeft.toFixed(1)}s`, 16, textY);
    ctx.fillText(`FACTS ${unlockedFacts.length}/${TARGET_FACTS}`, 248, textY);
    ctx.textAlign = 'right';
    ctx.fillText(getHudRunnerName().toUpperCase(), WIDTH - 16, textY);
    ctx.textAlign = 'start';
    return;
  }

  ctx.fillText(`TIME ${timeLeft.toFixed(1)}s`, 16, textY);
  ctx.fillText(`FACTS ${unlockedFacts.length}/${TARGET_FACTS}`, 174, textY);
  ctx.fillText(getHudRunnerName().toUpperCase(), 332, textY);
}

function draw() {
  drawBackground();
  drawIntroLeaves();
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
    const isMobileCountdown = window.innerWidth <= 700;
    const countdownSize = countdownLabel === 'Go!' ? 52 : 76;
    const getReadySize = isMobileCountdown ? 52 : 20;
    const getReadyY = isMobileCountdown ? HEIGHT / 2 + 66 : HEIGHT / 2 + 52;

    ctx.fillStyle = 'rgba(8, 14, 11, 0.2)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = '#fff6e0';
    ctx.font = `bold ${countdownSize}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.fillText(countdownLabel, WIDTH / 2, HEIGHT / 2 + 10);
    ctx.font = `bold ${getReadySize}px Georgia, serif`;
    ctx.fillText('Get ready', WIDTH / 2, getReadyY);
    ctx.textAlign = 'start';
  }

  if (gameState === 'paused') {
    ctx.fillStyle = 'rgba(8, 14, 11, 0.34)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = '#fff6e0';
    ctx.font = 'bold 30px Georgia, serif';
    ctx.fillText('Trail Paused', WIDTH / 2 - 82, HEIGHT / 2 - 10);
    ctx.font = '18px Georgia, serif';
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
