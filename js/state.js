const STORAGE_KEY = "escape_case17_save_v2";
const TOTAL_SECONDS = 15 * 60;

const defaultState = {
  scene: "intro",
  currentStage: 1,
  startTimestamp: null,
  elapsedSeconds: 0,
  hintCount: 0,
  inventory: [],
  stats: {
    attemptsByPuzzle: {},
    wrongAttemptLog: [],
  },
  solved: {
    desk: false,
    board: false,
    cctv: false,
    statement: false,
    archive: false,
    finalDoor: false,
  },
  flags: {
    lastSolvedKey: null,
  },
};

let gameState = loadState() || structuredClone(defaultState);

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      stats: {
        ...defaultState.stats,
        ...(parsed.stats || {}),
        attemptsByPuzzle: {
          ...defaultState.stats.attemptsByPuzzle,
          ...((parsed.stats && parsed.stats.attemptsByPuzzle) || {}),
        },
        wrongAttemptLog: Array.isArray(parsed?.stats?.wrongAttemptLog)
          ? parsed.stats.wrongAttemptLog
          : [],
      },
      solved: { ...defaultState.solved, ...(parsed.solved || {}) },
      flags: { ...defaultState.flags, ...(parsed.flags || {}) },
      inventory: Array.isArray(parsed.inventory) ? parsed.inventory : [],
    };
  } catch {
    return null;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
}

function resetState() {
  gameState = structuredClone(defaultState);
  localStorage.removeItem(STORAGE_KEY);
}

function addInventory(item) {
  if (!gameState.inventory.includes(item)) {
    gameState.inventory.push(item);
    saveState();
  }
}

function markSolved(key) {
  gameState.solved[key] = true;
  gameState.flags.lastSolvedKey = key;
  saveState();
}

function recordWrongAttempt(key, reason = "wrong_answer") {
  if (!gameState.stats.attemptsByPuzzle[key]) {
    gameState.stats.attemptsByPuzzle[key] = 0;
  }
  gameState.stats.attemptsByPuzzle[key] += 1;

  gameState.stats.wrongAttemptLog.push({
    key,
    reason,
    stage: gameState.currentStage,
    atSeconds: gameState.elapsedSeconds,
  });

  if (gameState.stats.wrongAttemptLog.length > 120) {
    gameState.stats.wrongAttemptLog = gameState.stats.wrongAttemptLog.slice(-120);
  }

  saveState();
}

function getWrongAttempts(key) {
  return gameState.stats.attemptsByPuzzle[key] || 0;
}

function getRemainingSeconds() {
  return Math.max(0, TOTAL_SECONDS - gameState.elapsedSeconds);
}

function formatSeconds(total) {
  const mm = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const ss = (total % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}
