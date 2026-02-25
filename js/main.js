const timerEl = document.getElementById("timer");
const hintCountEl = document.getElementById("hint-count");
let lastWarningSecond = null;

function updateMeta() {
  const remaining = getRemainingSeconds();
  timerEl.textContent = `남은 시간: ${formatSeconds(remaining)}`;
  timerEl.classList.toggle("pulse-danger", remaining <= 180 && gameState.scene === "room");
  hintCountEl.textContent = `힌트 사용: ${gameState.hintCount}`;
}

function tick() {
  if (!gameState.startTimestamp || gameState.scene === "intro" || gameState.scene === "ending") {
    updateMeta();
    return;
  }

  const now = Date.now();
  gameState.elapsedSeconds = Math.floor((now - gameState.startTimestamp) / 1000);
  const remaining = getRemainingSeconds();

  if (remaining <= 180 && remaining > 0 && remaining % 30 === 0 && lastWarningSecond !== remaining) {
    playSfx("warning");
    lastWarningSecond = remaining;
  }

  if (remaining <= 0) {
    gameState.elapsedSeconds = TOTAL_SECONDS;
    gameState.scene = "ending";
    playSfx("timeout");
    saveState();
    renderScene();
    return;
  }

  if (gameState.elapsedSeconds % 10 === 0) saveState();
  updateMeta();
}

(function bootstrap() {
  wireAudioToggle();

  if (gameState.scene !== "intro" && !gameState.startTimestamp) {
    gameState.startTimestamp = Date.now();
  }

  renderScene();
  updateMeta();
  setInterval(tick, 1000);
})();
