const appEl = document.getElementById("app");
const modalEl = document.getElementById("modal");
const modalContentEl = document.getElementById("modal-content");
let radioTypingRunId = 0;

function renderScene() {
  appEl.className = "scene-root";

  if (gameState.scene === "intro") renderIntro();
  if (gameState.scene === "radio") renderRadioBrief();
  if (gameState.scene === "chapter") renderChapter();
  if (gameState.scene === "interlude") renderInterlude();
  if (gameState.scene === "ending") renderEnding();

  updateMeta();
}

function renderIntro() {
  appEl.innerHTML = `
    <section class="scene">
      <h2>${caseLore.caseTitle}</h2>
      <p>${caseLore.backstory}</p>
      <div class="notice">각 챕터는 독립 페이지처럼 진행되며, 퍼즐 1개를 해결하면 다음 스토리로 이동합니다.</div>
      <div class="row">
        <div class="card">
          <h3>미션 브리핑</h3>
          <p>${caseLore.mission}</p>
          <p>${caseLore.stakes}</p>
        </div>
        <div class="card">
          <h3>진행 규칙</h3>
          <p>퍼즐은 순차 진행입니다.</p>
          <p>이전 토큰이 다음 계산식의 입력값이 됩니다.</p>
        </div>
      </div>
      <div class="controls">
        <button class="primary" id="start-btn">수사 시작</button>
        <button id="continue-btn">이어하기</button>
        <button id="new-btn">새 게임</button>
      </div>
    </section>
  `;

  document.getElementById("start-btn").onclick = () => {
    playSfx("open");
    if (!gameState.startTimestamp) gameState.startTimestamp = Date.now();
    gameState.scene = "radio";
    gameState.currentStage = 1;
    saveState();
    renderScene();
  };

  document.getElementById("continue-btn").onclick = () => {
    if (!gameState.startTimestamp) {
      playSfx("error");
      showToast("이어할 데이터가 없습니다.");
      return;
    }
    playSfx("open");
    if (gameState.scene === "intro") gameState.scene = "radio";
    saveState();
    renderScene();
  };

  document.getElementById("new-btn").onclick = () => {
    playSfx("click");
    resetHintSessions();
    resetState();
    renderScene();
  };
}

function renderRadioBrief() {
  const stageInfo = getStageInfo(gameState.currentStage);
  const lines = stageInfo.radioLog || [];

  appEl.classList.add(`stage-${stageInfo.stage}`);
  appEl.innerHTML = `
    <section class="scene radio-scene">
      <h2>암호 무전 채널</h2>
      <p>챕터 시작 전 현장 교신 로그를 확인하세요.</p>
      <div id="radio-box" class="radio-box"></div>
      <div class="controls">
        <button id="radio-skip-btn">즉시 표시</button>
        <button class="primary" id="radio-next-btn" disabled>챕터 입장</button>
      </div>
    </section>
  `;

  const boxEl = document.getElementById("radio-box");
  const skipBtn = document.getElementById("radio-skip-btn");
  const nextBtn = document.getElementById("radio-next-btn");

  const finish = () => {
    nextBtn.disabled = false;
    skipBtn.disabled = true;
  };

  const skipTyping = typeRadioLines(lines, boxEl, finish);
  skipBtn.onclick = () => {
    playSfx("click");
    skipTyping();
  };

  nextBtn.onclick = () => {
    playSfx("open");
    gameState.scene = "chapter";
    saveState();
    renderScene();
  };
}

function renderChapter() {
  const stageInfo = getStageInfo(gameState.currentStage);
  const puzzle = puzzleData[stageInfo.key];
  const currentWrong = getWrongAttempts(stageInfo.key);
  appEl.classList.add(`stage-${stageInfo.stage}`);

  const clues = gameState.inventory
    .map((item) => `<div class="clue-item">${item}</div>`)
    .join("");

  appEl.innerHTML = `
    <section class="scene chapter-scene">
      <div class="chapter-head">
        <div>
          <h2>${stageInfo.chapterTitle}</h2>
          <p>${stageInfo.chapterLead}</p>
          <div class="status-bar">진행: ${gameState.currentStage}/6</div>
        </div>
        <img src="${stageInfo.chapterImage}" alt="${stageInfo.chapterTitle} 배경" class="chapter-image" />
      </div>

      <div class="row">
        <div class="card">
          <h3>현재 목표</h3>
          <p>${puzzle.title}</p>
          <p>${puzzle.description.split("\n").join("<br>")}</p>
          <p class="attempt-chip">현재 퍼즐 오답: ${currentWrong}회</p>
          <div class="controls">
            <button class="primary" id="investigate-btn">단서 조사</button>
          </div>
        </div>

        <div class="card briefing-card">
          <h3>현장 브리핑</h3>
          <p>${stageInfo.chapterBrief}</p>
          <p class="tension-text">위험 요소: ${stageInfo.chapterTension}</p>
        </div>

        <div class="card story-card">
          <h3>확보한 토큰</h3>
          ${clues || '<p class="muted">아직 확보된 토큰이 없습니다.</p>'}
          <div class="controls">
            <button id="save-btn">수동 저장</button>
            <button id="intro-btn">인트로로</button>
          </div>
        </div>
      </div>
    </section>
  `;

  document.getElementById("investigate-btn").onclick = () => openPuzzle(stageInfo.key);

  document.getElementById("save-btn").onclick = () => {
    playSfx("click");
    saveState();
    showToast("저장되었습니다.");
  };

  document.getElementById("intro-btn").onclick = () => {
    playSfx("click");
    gameState.scene = "intro";
    saveState();
    renderScene();
  };
}

function renderInterlude() {
  const prevStage = Math.max(1, gameState.currentStage - 1);
  const stageInfo = getStageInfo(prevStage);
  const solvedPuzzle = puzzleData[stageInfo.key];

  appEl.innerHTML = `
    <section class="scene interlude-scene">
      <h2>수사 기록 업데이트</h2>
      <div class="notice">${stageInfo.interlude}</div>
      <div class="card">
        <h3>회수된 기록</h3>
        <p>${solvedPuzzle.narrative}</p>
      </div>
      <div class="card">
        <p>다음 챕터로 이동해 연쇄 단서를 이어서 복구하세요.</p>
        <div class="controls">
          <button class="primary" id="next-stage-btn">다음 챕터</button>
          <button id="intro-btn">인트로로</button>
        </div>
      </div>
    </section>
  `;

  document.getElementById("next-stage-btn").onclick = () => {
    playSfx("open");
    gameState.scene = "radio";
    saveState();
    renderScene();
  };

  document.getElementById("intro-btn").onclick = () => {
    playSfx("click");
    gameState.scene = "intro";
    saveState();
    renderScene();
  };
}

function renderEnding() {
  const remaining = getRemainingSeconds();
  const used = gameState.hintCount;
  const attemptStatsHtml = renderAttemptStats();

  appEl.innerHTML = `
    <section class="scene">
      <h2>사건 해결 완료</h2>
      <p class="success">최종 잠금이 해제되었습니다. 조작된 수사 체계의 증거 사슬을 완전히 복원했습니다.</p>
      <div class="notice">사건 결론: 경비팀 내부 공모 + 기록 위조 + 동선 은폐가 결합된 계획 범행.</div>
      <div class="row">
        <div class="card">
          <h3>결과</h3>
          <p>남은 시간: ${formatSeconds(remaining)}</p>
          <p>힌트 사용: ${used}회</p>
        </div>
        <div class="card">
          <h3>평가</h3>
          <p>${gradeResult(remaining, used)}</p>
        </div>
      </div>
      ${attemptStatsHtml}
      <div class="controls">
        <button class="primary" id="restart-btn">새로 플레이</button>
        <button id="back-intro-btn">인트로로</button>
      </div>
    </section>
  `;

  document.getElementById("restart-btn").onclick = () => {
    playSfx("open");
    resetHintSessions();
    resetState();
    gameState.startTimestamp = Date.now();
    gameState.scene = "radio";
    gameState.currentStage = 1;
    saveState();
    renderScene();
  };

  document.getElementById("back-intro-btn").onclick = () => {
    playSfx("click");
    gameState.scene = "intro";
    saveState();
    renderScene();
  };
}

function gradeResult(remaining, hintsUsed) {
  if (remaining > 420 && hintsUsed <= 2) return "S+급 포렌식 분석관";
  if (remaining > 240 && hintsUsed <= 4) return "S급 포렌식 분석관";
  if (remaining > 120 && hintsUsed <= 6) return "A급 포렌식 분석관";
  if (remaining > 0) return "B급 분석관";
  return "시간 초과 (자료 일부 회수됨)";
}

function openPuzzle(key) {
  const data = puzzleData[key];
  if (!data) return;

  playSfx("open");

  const body = `
    <h3>${data.title}</h3>
    <p>${data.description.replace(/\n/g, "<br>")}</p>
    <div class="notice">${data.narrative}</div>
    <img class="puzzle-image" src="${data.image}" alt="${data.title} 단서 이미지" />
    <div class="input-row">
      <input type="text" id="answer-input" placeholder="정답 입력" autocomplete="off" />
      <button class="primary" id="submit-answer">제출</button>
    </div>
    <div class="controls">
      <button id="hint-btn">힌트 보기</button>
      <button id="close-btn">닫기</button>
    </div>
    <p id="feedback"></p>
  `;

  openModal(body);

  document.getElementById("submit-answer").onclick = () => {
    const input = document.getElementById("answer-input").value.trim();
    checkAnswer(key, input);
  };

  document.getElementById("hint-btn").onclick = () => {
    const msg = nextHint(key);
    playSfx("hint");
    const feedback = document.getElementById("feedback");
    feedback.className = "";
    feedback.textContent = `힌트: ${msg}`;
    updateMeta();
  };

  document.getElementById("close-btn").onclick = closeModal;
}

function checkAnswer(key, input) {
  const data = puzzleData[key];
  const feedback = document.getElementById("feedback");

  if (key === "finalDoor") {
    const required = ["desk", "board", "cctv", "statement", "archive"];
    const hasAll = required.every((item) => gameState.solved[item]);
    if (!hasAll) {
      recordWrongAttempt(key, "missing_tokens");
      feedback.className = "error";
      feedback.textContent = "잠금장치가 반응하지 않습니다. 누락된 토큰이 있습니다.";
      playSfx("error");
      flashScene("danger");
      return;
    }
  }

  if (!isCorrectAnswer(key, input)) {
    recordWrongAttempt(key, "wrong_answer");
    feedback.className = "error";
    feedback.textContent = "정답이 아닙니다.";
    playSfx("error");
    flashScene("danger");
    return;
  }

  feedback.className = "success";
  feedback.textContent = "정답입니다.";
  playSfx("success");
  flashScene("success");

  if (!gameState.solved[key]) {
    markSolved(key);
    if (data.reward) addInventory(data.reward);
  }

  if (key === "finalDoor") {
    gameState.solved.finalDoor = true;
    gameState.scene = "ending";
    saveState();
    setTimeout(() => {
      closeModal();
      renderScene();
    }, 500);
    return;
  }

  gameState.currentStage = Math.min(6, gameState.currentStage + 1);
  gameState.scene = "interlude";
  saveState();

  setTimeout(() => {
    closeModal();
    renderScene();
  }, 500);
}

function openModal(innerHTML) {
  modalContentEl.innerHTML = innerHTML;
  modalEl.classList.remove("hidden");
  modalEl.setAttribute("aria-hidden", "false");
}

function closeModal() {
  playSfx("click");
  modalEl.classList.add("hidden");
  modalEl.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  openModal(`
    <h3>알림</h3>
    <p>${message}</p>
    <div class="controls">
      <button id="toast-close" class="primary">확인</button>
    </div>
  `);
  document.getElementById("toast-close").onclick = closeModal;
}

modalEl.addEventListener("click", (e) => {
  if (e.target === modalEl) closeModal();
});

function flashScene(type) {
  const el = document.querySelector(".scene-root");
  if (!el) return;
  const klass = type === "danger" ? "fx-danger" : "fx-success";
  el.classList.remove("fx-danger", "fx-success");
  void el.offsetWidth;
  el.classList.add(klass);
}

function typeRadioLines(lines, targetEl, onDone) {
  radioTypingRunId += 1;
  const runId = radioTypingRunId;
  const safeLines = lines.length ? lines : ["통제실: 로그 없음. 바로 챕터로 진입합니다."];
  const rendered = new Array(safeLines.length).fill("");
  let lineIdx = 0;
  let charIdx = 0;

  const render = () => {
    targetEl.innerHTML = rendered
      .map((line) => `<div class="radio-line">${escapeHtml(line)}</div>`)
      .join("");
  };

  const done = () => {
    if (runId !== radioTypingRunId) return;
    rendered[rendered.length - 1] = `${rendered[rendered.length - 1]} ▌`;
    render();
    onDone();
  };

  const tick = () => {
    if (runId !== radioTypingRunId) return;

    const line = safeLines[lineIdx];
    if (charIdx < line.length) {
      rendered[lineIdx] += line.charAt(charIdx);
      charIdx += 1;
      render();
      setTimeout(tick, 16);
      return;
    }

    lineIdx += 1;
    charIdx = 0;
    if (lineIdx >= safeLines.length) {
      done();
      return;
    }
    setTimeout(tick, 280);
  };

  tick();

  return () => {
    if (runId !== radioTypingRunId) return;
    radioTypingRunId += 1;
    for (let i = 0; i < safeLines.length; i += 1) {
      rendered[i] = safeLines[i];
    }
    render();
    onDone();
  };
}

function escapeHtml(raw) {
  return raw
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderAttemptStats() {
  const entries = Object.entries(gameState.stats.attemptsByPuzzle || {});
  if (!entries.length) {
    return `
      <div class="card stats-card">
        <h3>오답 통계</h3>
        <p>오답 기록이 없습니다.</p>
      </div>
    `;
  }

  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const topRows = sorted
    .map(
      ([key, count], idx) =>
        `<tr><td>${idx + 1}</td><td>${getPuzzleTitleByKey(key)}</td><td>${count}회</td></tr>`
    )
    .join("");

  const recentLogs = [...(gameState.stats.wrongAttemptLog || [])]
    .slice(-8)
    .reverse()
    .map(
      (log) =>
        `<li>${formatSeconds(log.atSeconds || 0)} · 챕터 ${log.stage || "-"} · ${getPuzzleTitleByKey(
          log.key
        )} · ${getReasonLabel(log.reason)}</li>`
    )
    .join("");

  return `
    <div class="row" style="margin-top: 12px;">
      <div class="card stats-card">
        <h3>어디서 막혔는지 (오답 순위)</h3>
        <table class="stats-table">
          <thead>
            <tr><th>#</th><th>퍼즐</th><th>오답</th></tr>
          </thead>
          <tbody>${topRows}</tbody>
        </table>
      </div>
      <div class="card stats-card">
        <h3>최근 오답 로그</h3>
        <ul class="stats-log">${recentLogs}</ul>
      </div>
    </div>
  `;
}

function getPuzzleTitleByKey(key) {
  return puzzleData[key]?.title || key;
}

function getReasonLabel(reason) {
  if (reason === "missing_tokens") return "선행 토큰 미수집";
  return "정답 불일치";
}
