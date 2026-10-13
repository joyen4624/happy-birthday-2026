// ==========================================================
// BỘ PHÁT NHẠC VÀ HIỆU ỨNG ÂM THANH (WEB AUDIO API + MP3 FALLBACK)
// ==========================================================
class SoundController {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.customAudio = null;
    this.synthInterval = null;
    this.currentNoteIndex = 0;
    this.hasUserInteracted = false;
  }

  init() {
    if (this.audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }

    // Kiểm tra custom audio nếu có
    if (window.CARD_CONFIG && window.CARD_CONFIG.audio && window.CARD_CONFIG.audio.customAudioSrc) {
      this.customAudio = new Audio(window.CARD_CONFIG.audio.customAudioSrc);
      this.customAudio.loop = true;
      this.customAudio.preload = "auto";
      this.customAudio.addEventListener("error", () => {
        // Nếu không tìm thấy file custom audio mp3, fallback sang synthesizer
        this.customAudio = null;
      });
    }
  }

  ensureContext() {
    this.init();
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  // Chơi 1 nốt nhạc ngọt ngào kiểu Music Box / Celesta
  playMusicBoxNote(freq, time, duration = 0.8, volume = 0.12) {
    if (!this.audioCtx || this.isMuted) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    // Sóng sin pha trộn hài âm mềm mại
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  // Bật nhạc nền lãng mạn (Happy Birthday + Romantic Melody)
  playBGM() {
    this.ensureContext();
    this.isPlaying = true;

    // Nếu có file mp3 và tải thành công
    if (this.customAudio) {
      this.customAudio.play().catch(() => {
        this.startSynthesizedMelody();
      });
      return;
    }

    // Synthesized music box
    this.startSynthesizedMelody();
  }

  startSynthesizedMelody() {
    if (this.synthInterval) return;

    // Giai điệu Happy Birthday nhẹ nhàng (tần số Hz + nhịp)
    const melody = [
      { note: 261.63, dur: 0.35, rest: 0.4 },  // C4
      { note: 261.63, dur: 0.25, rest: 0.3 },  // C4
      { note: 293.66, dur: 0.6, rest: 0.65 },  // D4
      { note: 261.63, dur: 0.6, rest: 0.65 },  // C4
      { note: 349.23, dur: 0.6, rest: 0.65 },  // F4
      { note: 329.63, dur: 1.0, rest: 1.1 },   // E4

      { note: 261.63, dur: 0.35, rest: 0.4 },  // C4
      { note: 261.63, dur: 0.25, rest: 0.3 },  // C4
      { note: 293.66, dur: 0.6, rest: 0.65 },  // D4
      { note: 261.63, dur: 0.6, rest: 0.65 },  // C4
      { note: 392.00, dur: 0.6, rest: 0.65 },  // G4
      { note: 349.23, dur: 1.0, rest: 1.1 },   // F4

      { note: 261.63, dur: 0.35, rest: 0.4 },  // C4
      { note: 261.63, dur: 0.25, rest: 0.3 },  // C4
      { note: 523.25, dur: 0.6, rest: 0.65 },  // C5
      { note: 440.00, dur: 0.6, rest: 0.65 },  // A4
      { note: 349.23, dur: 0.6, rest: 0.65 },  // F4
      { note: 329.63, dur: 0.6, rest: 0.65 },  // E4
      { note: 293.66, dur: 0.9, rest: 1.0 },   // D4

      { note: 466.16, dur: 0.35, rest: 0.4 },  // Bb4
      { note: 466.16, dur: 0.25, rest: 0.3 },  // Bb4
      { note: 440.00, dur: 0.6, rest: 0.65 },  // A4
      { note: 349.23, dur: 0.6, rest: 0.65 },  // F4
      { note: 392.00, dur: 0.6, rest: 0.65 },  // G4
      { note: 349.23, dur: 1.2, rest: 1.6 }    // F4
    ];

    let index = 0;
    const playNext = () => {
      if (!this.isPlaying || this.isMuted) return;
      const current = melody[index];
      const now = this.audioCtx ? this.audioCtx.currentTime : 0;
      this.playMusicBoxNote(current.note, now, current.dur);
      
      // Thêm nốt hòa âm đệm lãng mạn
      if (index % 4 === 0) {
        this.playMusicBoxNote(current.note / 2, now, current.dur * 1.5, 0.08);
      }

      index = (index + 1) % melody.length;
      this.synthInterval = setTimeout(playNext, current.rest * 1000);
    };

    playNext();
  }

  stopBGM() {
    this.isPlaying = false;
    if (this.synthInterval) {
      clearTimeout(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.playBGM();
      return true;
    }
  }

  // Hiệu ứng tiếng thổi nến
  playBlowCandle() {
    this.ensureContext();
    if (!this.audioCtx) return;

    const bufferSize = this.audioCtx.sampleRate * 0.7;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.audioCtx.sampleRate * 0.2));
    }

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(600, this.audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(120, this.audioCtx.currentTime + 0.6);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.6);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    noise.start();
  }

  // Hiệu ứng pháo hoa chúc mừng / Chime lấp lánh
  playSparkleChime() {
    this.ensureContext();
    if (!this.audioCtx) return;

    const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chords.forEach((freq, idx) => {
      setTimeout(() => {
        if (this.audioCtx) {
          const now = this.audioCtx.currentTime;
          this.playMusicBoxNote(freq, now, 0.8, 0.15);
        }
      }, idx * 100);
    });
  }

  // Hiệu ứng nảy tim / Pop
  playPop() {
    this.ensureContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const now = this.audioCtx.currentTime;

    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }
}

window.soundController = new SoundController();
