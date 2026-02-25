const SOUND_STORAGE_KEY = "escape_case17_sound_enabled";

let audioCtx = null;
let masterGain = null;
let ambienceNodes = null;
let soundEnabled = localStorage.getItem(SOUND_STORAGE_KEY) !== "0";
let audioUnlocked = false;

function ensureAudioContext() {
  if (audioCtx) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;

  audioCtx = new Ctx();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.12;
  masterGain.connect(audioCtx.destination);
}

function unlockAudio() {
  if (audioUnlocked) return;
  ensureAudioContext();
  if (!audioCtx) return;

  audioCtx.resume();
  audioUnlocked = true;
  if (soundEnabled) startAmbience();
}

function setSoundEnabled(enabled) {
  soundEnabled = Boolean(enabled);
  localStorage.setItem(SOUND_STORAGE_KEY, soundEnabled ? "1" : "0");
  updateAudioButton();

  if (!soundEnabled) {
    stopAmbience();
    return;
  }

  unlockAudio();
  startAmbience();
}

function toggleSound() {
  setSoundEnabled(!soundEnabled);
}

function updateAudioButton() {
  const btn = document.getElementById("audio-toggle");
  if (!btn) return;
  btn.textContent = `사운드: ${soundEnabled ? "ON" : "OFF"}`;
}

function wireAudioToggle() {
  updateAudioButton();
  const btn = document.getElementById("audio-toggle");
  if (!btn) return;
  btn.onclick = () => {
    unlockAudio();
    toggleSound();
    playSfx("click");
  };
}

function playTone({ frequency, type = "sine", duration = 0.12, gain = 0.08, when = 0 }) {
  if (!soundEnabled || !audioCtx || !masterGain) return;

  const t0 = audioCtx.currentTime + when;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;

  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.connect(g);
  g.connect(masterGain);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

function playSfx(name) {
  if (!soundEnabled) return;
  unlockAudio();
  if (!audioCtx) return;

  if (name === "click") playTone({ frequency: 420, type: "square", gain: 0.03, duration: 0.05 });
  if (name === "open") playTone({ frequency: 290, type: "triangle", gain: 0.04, duration: 0.07 });
  if (name === "hint") {
    playTone({ frequency: 510, type: "sine", gain: 0.04, duration: 0.08 });
    playTone({ frequency: 620, type: "sine", gain: 0.04, duration: 0.09, when: 0.08 });
  }
  if (name === "error") playTone({ frequency: 170, type: "sawtooth", gain: 0.04, duration: 0.15 });
  if (name === "success") {
    playTone({ frequency: 440, type: "triangle", gain: 0.05, duration: 0.09 });
    playTone({ frequency: 554, type: "triangle", gain: 0.05, duration: 0.1, when: 0.09 });
    playTone({ frequency: 659, type: "triangle", gain: 0.05, duration: 0.12, when: 0.18 });
  }
  if (name === "warning") playTone({ frequency: 220, type: "square", gain: 0.03, duration: 0.07 });
  if (name === "timeout") {
    playTone({ frequency: 240, type: "sawtooth", gain: 0.05, duration: 0.2 });
    playTone({ frequency: 180, type: "sawtooth", gain: 0.05, duration: 0.2, when: 0.2 });
  }
}

function startAmbience() {
  if (!soundEnabled || !audioCtx || !masterGain || ambienceNodes) return;

  const base = audioCtx.createOscillator();
  const tremor = audioCtx.createOscillator();
  const lowpass = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  base.type = "triangle";
  base.frequency.value = 62;

  tremor.type = "sine";
  tremor.frequency.value = 0.18;

  lowpass.type = "lowpass";
  lowpass.frequency.value = 420;
  gain.gain.value = 0.03;

  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 16;
  tremor.connect(lfoGain);
  lfoGain.connect(lowpass.frequency);

  base.connect(lowpass);
  lowpass.connect(gain);
  gain.connect(masterGain);

  base.start();
  tremor.start();
  ambienceNodes = { base, tremor, gain };
}

function stopAmbience() {
  if (!ambienceNodes) return;
  ambienceNodes.gain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.08);
  ambienceNodes.base.stop(audioCtx.currentTime + 0.3);
  ambienceNodes.tremor.stop(audioCtx.currentTime + 0.3);
  ambienceNodes = null;
}

window.playSfx = playSfx;
window.wireAudioToggle = wireAudioToggle;
window.unlockAudio = unlockAudio;

document.addEventListener("pointerdown", unlockAudio, { once: true });
document.addEventListener("keydown", unlockAudio, { once: true });
