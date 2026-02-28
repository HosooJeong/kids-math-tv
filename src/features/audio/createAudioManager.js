const STORAGE_KEY = "kids-math-tv:muted";
const FIRST_INTERACTION_EVENTS = ["pointerdown", "keydown", "touchstart", "mousedown"];

const TRACKS = {
  calm: {
    cycleSeconds: 3.2,
    notes: [
      { at: 0.0, freqs: [196, 261.63], duration: 0.42, gain: 0.019, type: "sine" },
      { at: 0.62, freqs: [246.94, 329.63], duration: 0.34, gain: 0.018, type: "sine" },
      { at: 1.2, freqs: [220, 293.66], duration: 0.36, gain: 0.017, type: "triangle" },
      { at: 1.92, freqs: [196, 261.63], duration: 0.38, gain: 0.018, type: "sine" },
      { at: 2.52, freqs: [220, 349.23], duration: 0.4, gain: 0.017, type: "triangle" }
    ]
  },
  result: {
    cycleSeconds: 2.8,
    notes: [
      { at: 0.0, freqs: [392, 523.25], duration: 0.28, gain: 0.02, type: "triangle" },
      { at: 0.34, freqs: [440, 587.33], duration: 0.28, gain: 0.019, type: "triangle" },
      { at: 0.68, freqs: [493.88, 659.25], duration: 0.28, gain: 0.019, type: "triangle" },
      { at: 1.08, freqs: [523.25, 698.46], duration: 0.3, gain: 0.02, type: "triangle" },
      { at: 1.58, freqs: [493.88, 659.25], duration: 0.3, gain: 0.018, type: "sine" },
      { at: 2.02, freqs: [440, 587.33], duration: 0.32, gain: 0.017, type: "sine" }
    ]
  }
};

function readMutedPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeMutedPreference(muted) {
  try {
    localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
  } catch {
    // Ignore storage failures.
  }
}

function toFreqArray(freqs) {
  return Array.isArray(freqs) ? freqs : [freqs];
}

export function createAudioManager() {
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  const supported = Boolean(AudioCtor);
  const muteListeners = new Set();
  let ctx = null;
  let masterGain = null;
  let musicGain = null;
  let sfxGain = null;
  let muted = readMutedPreference();
  let unlocked = false;
  let desiredTrackName = null;
  let activeTrackName = null;
  let trackTimer = null;
  let unlockListenersAttached = false;

  function emitMuteChange() {
    muteListeners.forEach((listener) => listener(muted));
  }

  function ensureContext() {
    if (!supported) return null;
    if (ctx) return ctx;

    try {
      ctx = new AudioCtor();
    } catch {
      ctx = null;
      return null;
    }

    masterGain = ctx.createGain();
    musicGain = ctx.createGain();
    sfxGain = ctx.createGain();

    // Conservative defaults for kids.
    masterGain.gain.value = muted ? 0 : 1;
    musicGain.gain.value = 0.5;
    sfxGain.gain.value = 0.42;

    musicGain.connect(masterGain);
    sfxGain.connect(masterGain);
    masterGain.connect(ctx.destination);
    return ctx;
  }

  function resumeContextIfNeeded() {
    if (!ctx || ctx.state !== "suspended") return;
    ctx.resume().catch(() => {});
  }

  function setMasterMuted(nextMuted) {
    if (!ctx || !masterGain) return;
    const now = ctx.currentTime;
    const target = nextMuted ? 0 : 1;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setTargetAtTime(target, now, 0.015);
  }

  function playTone(targetCtx, targetGain, {
    freq,
    start,
    duration,
    gain = 0.05,
    type = "sine"
  }) {
    const osc = targetCtx.createOscillator();
    const envelope = targetCtx.createGain();
    const attack = Math.min(0.03, duration * 0.35);
    const endTime = start + duration;

    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(Math.max(gain, 0.0002), start + attack);
    envelope.gain.exponentialRampToValueAtTime(0.0001, endTime);

    osc.connect(envelope).connect(targetGain);
    osc.start(start);
    osc.stop(endTime + 0.04);
  }

  function stopTrackLoop() {
    if (trackTimer) {
      window.clearInterval(trackTimer);
      trackTimer = null;
    }
    activeTrackName = null;
  }

  function scheduleTrackCycle(track) {
    const targetCtx = ensureContext();
    if (!targetCtx || !musicGain) return;
    const base = targetCtx.currentTime + 0.03;

    track.notes.forEach((note) => {
      const freqs = toFreqArray(note.freqs);
      freqs.forEach((freq) => {
        playTone(targetCtx, musicGain, {
          freq,
          start: base + note.at,
          duration: note.duration,
          gain: note.gain,
          type: note.type
        });
      });
    });
  }

  function canPlayAudio() {
    return supported && !muted && unlocked;
  }

  function refreshTrackPlayback() {
    if (!desiredTrackName || !canPlayAudio()) {
      stopTrackLoop();
      return;
    }

    const track = TRACKS[desiredTrackName] || TRACKS.calm;
    if (activeTrackName === desiredTrackName && trackTimer) return;

    stopTrackLoop();
    ensureContext();
    resumeContextIfNeeded();
    scheduleTrackCycle(track);
    trackTimer = window.setInterval(() => scheduleTrackCycle(track), Math.round(track.cycleSeconds * 1000));
    activeTrackName = desiredTrackName;
  }

  function registerInteraction() {
    if (unlocked) return;
    unlocked = true;
    ensureContext();
    resumeContextIfNeeded();
    refreshTrackPlayback();
    detachUnlockListeners();
  }

  function handleFirstInteraction() {
    registerInteraction();
  }

  function attachUnlockListeners() {
    if (unlockListenersAttached) return;
    unlockListenersAttached = true;
    FIRST_INTERACTION_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleFirstInteraction, { capture: true });
    });
  }

  function detachUnlockListeners() {
    if (!unlockListenersAttached) return;
    unlockListenersAttached = false;
    FIRST_INTERACTION_EVENTS.forEach((eventName) => {
      window.removeEventListener(eventName, handleFirstInteraction, { capture: true });
    });
  }

  function playCorrectSfx(combo = 0) {
    if (!canPlayAudio()) return;
    const targetCtx = ensureContext();
    if (!targetCtx || !sfxGain) return;
    resumeContextIfNeeded();

    const now = targetCtx.currentTime;
    const boost = Math.min(combo * 0.01, 0.04);

    // Preserve the original success sound with a tiny sparkle layer.
    playTone(targetCtx, sfxGain, { freq: 660, start: now, duration: 0.16, gain: 0.1 + boost, type: "triangle" });
    playTone(targetCtx, sfxGain, { freq: 990, start: now + 0.07, duration: 0.2, gain: 0.085 + boost, type: "triangle" });
    playTone(targetCtx, sfxGain, { freq: 220, start: now + 0.02, duration: 0.08, gain: 0.05 + boost, type: "square" });
    playTone(targetCtx, sfxGain, { freq: 330, start: now + 0.1, duration: 0.1, gain: 0.045 + boost, type: "square" });
    playTone(targetCtx, sfxGain, { freq: 1320, start: now + 0.19, duration: 0.11, gain: 0.03 + boost, type: "sine" });
  }

  function playWrongSfx() {
    if (!canPlayAudio()) return;
    const targetCtx = ensureContext();
    if (!targetCtx || !sfxGain) return;
    resumeContextIfNeeded();

    const now = targetCtx.currentTime;
    playTone(targetCtx, sfxGain, { freq: 300, start: now, duration: 0.16, gain: 0.048, type: "sine" });
    playTone(targetCtx, sfxGain, { freq: 245, start: now + 0.11, duration: 0.2, gain: 0.045, type: "triangle" });
  }

  function playUiNavigate() {
    if (!canPlayAudio()) return;
    const targetCtx = ensureContext();
    if (!targetCtx || !sfxGain) return;
    resumeContextIfNeeded();

    const now = targetCtx.currentTime;
    playTone(targetCtx, sfxGain, { freq: 540, start: now, duration: 0.05, gain: 0.024, type: "triangle" });
  }

  function playUiSelect() {
    if (!canPlayAudio()) return;
    const targetCtx = ensureContext();
    if (!targetCtx || !sfxGain) return;
    resumeContextIfNeeded();

    const now = targetCtx.currentTime;
    playTone(targetCtx, sfxGain, { freq: 760, start: now, duration: 0.06, gain: 0.026, type: "triangle" });
    playTone(targetCtx, sfxGain, { freq: 980, start: now + 0.04, duration: 0.08, gain: 0.02, type: "sine" });
  }

  function setBgmScene(scene) {
    desiredTrackName = scene === "result" ? "result" : "calm";
    refreshTrackPlayback();
  }

  function isMuted() {
    return muted;
  }

  function setMuted(nextMuted) {
    muted = Boolean(nextMuted);
    writeMutedPreference(muted);
    ensureContext();
    setMasterMuted(muted);
    if (muted) {
      stopTrackLoop();
    } else {
      refreshTrackPlayback();
    }
    emitMuteChange();
  }

  function toggleMute() {
    setMuted(!muted);
    return muted;
  }

  function onMuteChange(listener) {
    if (typeof listener !== "function") {
      return () => {};
    }
    muteListeners.add(listener);
    return () => muteListeners.delete(listener);
  }

  attachUnlockListeners();

  return {
    isSupported: () => supported,
    isMuted,
    setMuted,
    toggleMute,
    onMuteChange,
    setBgmScene,
    registerInteraction,
    playCorrectSfx,
    playWrongSfx,
    playUiNavigate,
    playUiSelect
  };
}
