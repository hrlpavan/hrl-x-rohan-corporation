/**
 * ============================================================================
 * HRL International × Rohan Corporation
 * Master Project Explainer Engine (4K UHD 60FPS)
 * 
 * Aspect Ratio Fidelity: Exact 2.37:1 (1024 × 432) Ultra-Wide Panoramic Alignment
 * Incorporating Authentic Photographic Renders:
 * 1. Rohan City (Bejai Main Road, Mangaluru) - 1024 × 432 (Ratio 2.37:1)
 * 2. Rohan Marina One (Surathkal, Mangalore) - 1024 × 431 (Ratio 2.37:1)
 * 3. Rohan Square (Capitanio, Pumpwell, Mangalore) - 1024 × 431 (Ratio 2.37:1)
 * 4. Rohan Estate (Neermarga Hills, Mangaluru) - 1024 × 432 (Ratio 2.37:1)
 * ============================================================================
 */

class MasterMotionGraphicsEngine {
  constructor() {
    this.canvas = document.getElementById('videoCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.duration = 120; // Exact 2 minutes 00 seconds synchronized to narration pacing
    this.currentTime = 0;
    this.isPlaying = false;
    this.musicEnabled = true;
    this.voiceEnabled = true;
    this.ccEnabled = true;
    this.isRecording = false;
    this.autoRun = true;
    this.lastFrameTime = performance.now();

    // Preload Real Photographic Assets (All Native 2.37:1)
    this.assets = {
      city: this.loadImage('assets/images/rohan-city-bejai.jpg'),
      marina: this.loadImage('assets/images/rohan-marina-one-surathkal.jpg'),
      square: this.loadImage('assets/images/rohan-square-pumpwell.jpg'),
      estate: this.loadImage('assets/images/rohan-estate-neermarga.jpg')
    };

    // Master Script & Scene Milestones with Precise Word/Sentence Cues for Auto-Sync
    this.scenes = [
      {
        id: 'genesis',
        start: 0,
        end: 20,
        title: 'Genesis & Shared Vision',
        script: "For over thirty years, Rohan Corporation has sculpted the skyline of Mangaluru with trusted architectural landmarks. Today, that physical grandeur unites with computational intelligence. Welcome to the HRL International and Rohan Corporation Smart PropTech Platform.",
        cues: [
          { start: 0.0, end: 6.8, text: "For over thirty years, Rohan Corporation has sculpted the skyline of Mangaluru with trusted architectural landmarks." },
          { start: 6.8, end: 11.2, text: "Today, that physical grandeur unites with computational intelligence." },
          { start: 11.2, end: 17.5, text: "Welcome to the HRL International & Rohan Corporation Smart PropTech Platform." }
        ]
      },
      {
        id: 'portfolio',
        start: 20,
        end: 45,
        title: 'Flagship Developments Portfolio',
        script: "Our joint initiative powers Rohan Corporation's premier developments: Rohan City at Bejai, Rohan Marina One at Surathkal beach, Rohan Square at Pumpwell, and the hillside paradise of Rohan Estate at Neermarga. Each project is fully RERA approved and engineered for generational permanence.",
        cues: [
          { start: 0.0, end: 12.2, text: "Our joint initiative powers Rohan Corporation's premier developments: Rohan City, Marina One, Rohan Square, and Rohan Estate." },
          { start: 12.2, end: 22.5, text: "Each project is fully RERA approved and engineered for generational permanence." }
        ]
      },
      {
        id: 'rohan_city',
        start: 45,
        end: 66,
        title: 'Rohan City: Digital Twin & Simulation',
        script: "At Rohan City on Bejai Main Road, over 3.5 million square feet of commercial and residential space comes alive inside the browser. Prospective buyers can explore photorealistic digital twins, inspect sunlight on living balconies, and tour retail plazas at sixty frames per second.",
        cues: [
          { start: 0.0, end: 8.0, text: "At Rohan City on Bejai Main Road, over 3.5 million square feet of space comes alive inside the browser." },
          { start: 8.0, end: 18.0, text: "Prospective buyers can explore photorealistic digital twins, inspect sunlight on balconies, and tour retail plazas at 60 FPS." }
        ]
      },
      {
        id: 'rohan_marina',
        start: 66,
        end: 86,
        title: 'Rohan Marina One: Sea-Facing Innovation',
        script: "At Rohan Marina One in Surathkal, where every home faces the sea, our visual computing engine models panoramic ocean horizons, coastal breeze vectors, and unobstructed sunset vistas, enabling seamless remote reservations for NRI families across the globe.",
        cues: [
          { start: 0.0, end: 8.0, text: "At Rohan Marina One in Surathkal, where every home faces the sea, our visual computing engine models ocean horizons and breeze vectors," },
          { start: 8.0, end: 17.0, text: "enabling seamless remote reservations for NRI families across the globe." }
        ]
      },
      {
        id: 'square_estate',
        start: 86,
        end: 104,
        title: 'Rohan Square & Rohan Estate: Smart Ecosystems',
        script: "From corporate suites and ready-to-move-in homes at Rohan Square Pumpwell, to serene hillside plotted enclaves with subsoil telemetry at Rohan Estate Neermarga, intelligent edge sensors provide real-time assurance with zero cloud privacy risks.",
        cues: [
          { start: 0.0, end: 8.5, text: "From corporate suites at Rohan Square Pumpwell to hillside plotted enclaves at Rohan Estate Neermarga," },
          { start: 8.5, end: 14.5, text: "intelligent edge sensors provide real-time assurance with zero cloud privacy risks." }
        ]
      },
      {
        id: 'finale',
        start: 104,
        end: 120,
        title: 'Executive Partnership & Next Steps',
        script: "HRL International and Rohan Corporation. Together, we are establishing the benchmark for luxury living and smart real estate in Coastal Karnataka. The future of living begins today.",
        cues: [
          { start: 0.0, end: 8.6, text: "HRL International & Rohan Corporation: establishing the benchmark for luxury living and smart real estate in Coastal Karnataka." },
          { start: 8.6, end: 12.0, text: "The future of living begins today." }
        ]
      }
    ];

    this.currentSceneIndex = 0;
    this.currentVoiceSceneIndex = -1;
    this.currentNarrator = 'samantha'; // Exclusively polite, warm female executive voice
    this.currentActiveAudio = null;
    this.narratorPool = {
      samantha: []
    };

    this.initAudioEngine();
    this.bindUI();
    this.render();

    // Autonomous Auto-Run on Launch
    setTimeout(() => {
      this.play();
    }, 200);

    // Audio unblocking listener for browser autoplay restrictions
    const unlockAudio = () => {
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
        if (this.musicEnabled && this.isPlaying) this.startSoundtrack();
      }
      if (this.voiceEnabled && this.isPlaying) {
        if (this.currentActiveAudio && this.currentActiveAudio.paused && this.currentActiveAudio.currentTime > 0 && !this.currentActiveAudio.ended) {
          this.currentActiveAudio.play().catch(e => {
            if (e.name !== 'AbortError') console.log(e);
          });
        } else {
          this.speakScene(this.currentSceneIndex);
        }
      }
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('click', unlockAudio);
  }

  loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
  }

  /* -------------------------------------------------------------------------- */
  /* Audio Synthesis (Warm Cinematic Ambient Chord Progression)                 */
  /* -------------------------------------------------------------------------- */
  initAudioEngine() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = 0.20;
      this.masterGain.connect(this.audioCtx.destination);
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }

    // Pre-instantiate and preload polite female studio narrator audio tracks
    const narrators = ['samantha'];
    narrators.forEach(narrator => {
      this.narratorPool[narrator] = [];
      for (let s = 0; s < 6; s++) {
        const aud = new Audio();
        aud.preload = 'auto';
        aud.src = `assets/audio/narrator_${narrator}/scene_${s}.m4a`;

        // Acoustic Ducking: lower ambient volume to 0.06 while narrator is speaking
        aud.addEventListener('play', () => {
          if (this.masterGain && this.audioCtx && this.audioCtx.state === 'running') {
            this.masterGain.gain.setTargetAtTime(0.06, this.audioCtx.currentTime, 0.15);
          }
        });

        // Acoustic Restore: restore ambient volume to 0.20 when narrator finishes
        aud.addEventListener('ended', () => {
          if (this.masterGain && this.audioCtx && this.audioCtx.state === 'running') {
            this.masterGain.gain.setTargetAtTime(0.20, this.audioCtx.currentTime, 0.4);
          }
        });

        // Failover: if .m4a encounters codec issue, transparently failover to .wav
        aud.addEventListener('error', () => {
          if (aud.src && aud.src.endsWith('.m4a')) {
            console.log(`Failing over narrator_${narrator}/scene_${s} to WAV format`);
            aud.src = `assets/audio/narrator_${narrator}/scene_${s}.wav`;
            aud.load();
          }
        });

        this.narratorPool[narrator].push(aud);
      }
    });
  }

  startSoundtrack() {
    if (!this.audioCtx || !this.musicEnabled) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.stopSoundtrack();
    this.oscillators = [];

    // Warm Analog Tri-Chords (C-Major9 / A-Minor7 Chord Bed)
    const chordFreqs = [130.81, 164.81, 196.00, 246.94, 293.66];
    chordFreqs.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const oscGain = this.audioCtx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      oscGain.gain.setValueAtTime(0.035 / (idx + 1), this.audioCtx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      osc.start();
      this.oscillators.push(osc);
    });
  }

  stopSoundtrack() {
    if (this.oscillators) {
      this.oscillators.forEach(osc => {
        try { osc.stop(); } catch (e) {}
      });
      this.oscillators = [];
    }
  }

  /* -------------------------------------------------------------------------- */
  /* Studio Human Voice Narration Engine (Real Audio + Neural Fallback)          */
  /* -------------------------------------------------------------------------- */
  speakScene(sceneIndex) {
    if (!this.voiceEnabled) return;
    this.stopNarration();

    const scene = this.scenes[sceneIndex];
    if (!scene) return;

    this.currentVoiceSceneIndex = sceneIndex;

    const tracks = this.narratorPool ? this.narratorPool[this.currentNarrator] : null;
    if (tracks && tracks[sceneIndex]) {
      this.currentActiveAudio = tracks[sceneIndex];
      this.currentActiveAudio.currentTime = 0;
      const playPromise = this.currentActiveAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          if (err.name === 'AbortError') return;
          console.warn(`Studio audio playback blocked for ${this.currentNarrator}, scene ${sceneIndex}:`, err);
          this.fallbackSpeakScene(sceneIndex);
        });
      }
    } else {
      this.fallbackSpeakScene(sceneIndex);
    }
  }

  stopNarration() {
    if (this.currentActiveAudio) {
      this.currentActiveAudio.pause();
      this.currentActiveAudio.currentTime = 0;
      this.currentActiveAudio = null;
    }
    if (this.narratorPool) {
      Object.values(this.narratorPool).forEach(list => {
        list.forEach(a => {
          if (!a.paused) {
            a.pause();
            a.currentTime = 0;
          }
        });
      });
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (this.masterGain && this.audioCtx && this.audioCtx.state === 'running') {
      this.masterGain.gain.setTargetAtTime(0.20, this.audioCtx.currentTime, 0.15);
    }
  }

  fallbackSpeakScene(sceneIndex) {
    if (!this.voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const scene = this.scenes[sceneIndex];
    if (!scene) return;

    const utterance = new SpeechSynthesisUtterance(scene.script);
    utterance.rate = 0.93; // deliberate, calm, human pacing
    utterance.pitch = 0.98;

    const voices = window.speechSynthesis.getVoices();
    // Strictly filter for polite female voices — eliminate all male voices
    const femaleVoices = voices.filter(v => {
      const name = v.name.toLowerCase();
      const isMale = name.includes('male') || name.includes('daniel') || name.includes('oliver') ||
                     name.includes('george') || name.includes('rishi') || name.includes('aman') ||
                     name.includes('fred') || name.includes('alex') || name.includes('david') ||
                     name.includes('arthur') || name.includes('tom') || name.includes('albert');
      return !isMale;
    });

    let preferred = femaleVoices.find(v => (
      v.name.includes('Samantha') ||
      v.name.includes('Victoria') ||
      v.name.includes('Karen') ||
      v.name.includes('Zira') ||
      v.name.includes('Moira') ||
      v.name.includes('Fiona') ||
      v.name.includes('Tessa') ||
      v.name.includes('Veena') ||
      v.name.includes('Tara')
    ));

    if (!preferred) {
      preferred = femaleVoices[0] || voices.find(v => !v.name.toLowerCase().includes('daniel') && !v.name.toLowerCase().includes('rishi'));
    }

    if (preferred) utterance.voice = preferred;

    window.speechSynthesis.speak(utterance);
    this.currentVoiceSceneIndex = sceneIndex;
  }

  setNarrator(narratorName) {
    // Exclusively polite female narration
    this.currentNarrator = 'samantha';
    const label = 'Studio Master: Samantha (Polite Female Narration)';

    document.querySelectorAll('.voice-segment-btn').forEach(btn => {
      if (btn.getAttribute('data-voice') === 'samantha') {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (this.toggleNarratorBtn) {
      this.toggleNarratorBtn.textContent = label;
    }
    const badge = document.getElementById('activeVoiceBadge');
    if (badge) {
      badge.textContent = label;
    }

    const speakerTag = document.querySelector('.sub-speaker-tag');
    if (speakerTag) {
      speakerTag.textContent = 'Samantha';
    }

    // Trigger current scene narration
    if (this.isPlaying && this.voiceEnabled) {
      this.speakScene(this.currentSceneIndex);
    }
  }

  toggleNarrator() {
    this.setNarrator('samantha');
  }

  /* -------------------------------------------------------------------------- */
  /* UI Bindings                                                                */
  /* -------------------------------------------------------------------------- */
  bindUI() {
    this.playOverlay = document.getElementById('playOverlay');
    this.playPauseBtn = document.getElementById('playPauseBtn');
    this.playIcon = document.getElementById('playIcon');
    this.replayBtn = document.getElementById('replayBtn');
    this.progressBarFill = document.getElementById('progressBarFill');
    this.progressBarContainer = document.getElementById('progressBarContainer');
    this.timeDisplay = document.getElementById('timeDisplay');
    this.captionText = document.getElementById('captionText');
    this.toggleAutoBtn = document.getElementById('toggleAutoBtn');
    this.toggleAudioBtn = document.getElementById('toggleAudioBtn');
    this.toggleVoiceBtn = document.getElementById('toggleVoiceBtn');
    this.toggleNarratorBtn = document.getElementById('toggleNarratorBtn');
    this.toggleCCBtn = document.getElementById('toggleCCBtn');
    this.fullscreenBtn = document.getElementById('fullscreenBtn');
    this.recordVideoBtn = document.getElementById('recordVideoBtn');
    this.recordingStatus = document.getElementById('recordingStatus');

    // Segmented Persona Controls
    document.querySelectorAll('.voice-segment-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const v = btn.getAttribute('data-voice');
        if (v) this.setNarrator(v);
      });
    });

    const togglePlay = () => {
      if (this.isPlaying) this.pause();
      else this.play();
    };

    if (this.playOverlay) this.playOverlay.addEventListener('click', togglePlay);
    if (this.playPauseBtn) this.playPauseBtn.addEventListener('click', togglePlay);

    if (this.replayBtn) {
      this.replayBtn.addEventListener('click', () => {
        this.seekTo(0);
        this.play();
      });
    }

    if (this.progressBarContainer) {
      this.progressBarContainer.addEventListener('click', (e) => {
        const rect = this.progressBarContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.seekTo(pos * this.duration);
      });
    }

    if (this.toggleAutoBtn) {
      this.toggleAutoBtn.addEventListener('click', () => {
        this.autoRun = !this.autoRun;
        this.toggleAutoBtn.textContent = `Auto: ${this.autoRun ? 'ON' : 'OFF'}`;
        this.toggleAutoBtn.style.color = this.autoRun ? '#2997ff' : '#86868b';
      });
    }

    if (this.toggleAudioBtn) {
      this.toggleAudioBtn.addEventListener('click', () => {
        this.musicEnabled = !this.musicEnabled;
        this.toggleAudioBtn.textContent = `Music: ${this.musicEnabled ? 'ON' : 'OFF'}`;
        if (this.musicEnabled && this.isPlaying) this.startSoundtrack();
        else this.stopSoundtrack();
      });
    }

    if (this.toggleVoiceBtn) {
      this.toggleVoiceBtn.addEventListener('click', () => {
        this.voiceEnabled = !this.voiceEnabled;
        this.toggleVoiceBtn.textContent = `Voice: ${this.voiceEnabled ? 'ON' : 'OFF'}`;
        if (!this.voiceEnabled) {
          this.stopNarration();
        } else if (this.voiceEnabled && this.isPlaying) {
          this.speakScene(this.currentSceneIndex);
        }
      });
    }

    if (this.toggleNarratorBtn) {
      this.toggleNarratorBtn.addEventListener('click', () => {
        this.toggleNarrator();
      });
    }

    if (this.toggleCCBtn) {
      this.toggleCCBtn.addEventListener('click', () => {
        this.ccEnabled = !this.ccEnabled;
        this.toggleCCBtn.textContent = `Subtitles: ${this.ccEnabled ? 'ON' : 'OFF'}`;
        const ccBox = document.getElementById('ccBox');
        if (ccBox) ccBox.style.display = this.ccEnabled ? 'block' : 'none';
      });
    }

    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener('click', () => {
        const frame = document.getElementById('playerFrame');
        if (!document.fullscreenElement) {
          frame.requestFullscreen().catch(err => console.log(err));
        } else {
          document.exitFullscreen();
        }
      });
    }

    document.querySelectorAll('.chapter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const time = parseFloat(pill.getAttribute('data-time'));
        this.seekTo(time);
        this.play();
      });
    });

    if (this.recordVideoBtn) {
      this.recordVideoBtn.addEventListener('click', () => this.toggleRecording());
    }
  }

  play() {
    this.isPlaying = true;
    if (this.playOverlay) this.playOverlay.classList.add('hidden');
    if (this.playIcon) this.playIcon.textContent = 'Pause';
    this.startSoundtrack();
    if (this.voiceEnabled) {
      if (this.currentActiveAudio && this.currentActiveAudio.paused && this.currentActiveAudio.currentTime > 0 && !this.currentActiveAudio.ended) {
        this.currentActiveAudio.play().catch(e => {
          if (e.name !== 'AbortError') console.log(e);
        });
      } else {
        this.speakScene(this.currentSceneIndex);
      }
    }
    this.lastFrameTime = performance.now();
  }

  pause() {
    this.isPlaying = false;
    if (this.playIcon) this.playIcon.textContent = 'Play';
    this.stopSoundtrack();
    if (this.currentActiveAudio) {
      this.currentActiveAudio.pause();
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
  }

  seekTo(seconds) {
    this.currentTime = Math.max(0, Math.min(this.duration, seconds));
    this.stopNarration();
    this.updateSceneIndex();
    if (this.isPlaying) {
      this.speakScene(this.currentSceneIndex);
    }
  }

  updateSceneIndex() {
    const idx = this.scenes.findIndex(s => this.currentTime >= s.start && this.currentTime < s.end);
    const newIdx = idx !== -1 ? idx : this.scenes.length - 1;

    if (newIdx !== this.currentSceneIndex) {
      this.currentSceneIndex = newIdx;
      if (this.isPlaying && this.currentVoiceSceneIndex !== newIdx) {
        this.speakScene(newIdx);
      }
      document.querySelectorAll('.chapter-pill').forEach((pill, i) => {
        if (i === newIdx) pill.classList.add('active');
        else pill.classList.remove('active');
      });
    }

    const currentScene = this.scenes[this.currentSceneIndex];
    if (currentScene && this.captionText) {
      // Calculate precise audio playback offset within current scene
      let elapsedInScene = this.currentTime - currentScene.start;
      if (this.currentActiveAudio && !this.currentActiveAudio.paused && !this.currentActiveAudio.ended) {
        elapsedInScene = this.currentActiveAudio.currentTime;
      }

      // Auto-sync sentence by sentence with the narrator
      if (currentScene.cues && currentScene.cues.length > 0) {
        const activeCue = currentScene.cues.find(c => elapsedInScene >= c.start && elapsedInScene < c.end);
        const ccBox = document.getElementById('ccBox');

        if (activeCue) {
          this.captionText.textContent = activeCue.text;
          if (ccBox && this.ccEnabled) ccBox.style.opacity = '1';
        } else if (elapsedInScene >= currentScene.cues[currentScene.cues.length - 1].end) {
          // Graceful hold on final sentence of current chapter
          this.captionText.textContent = currentScene.cues[currentScene.cues.length - 1].text;
          if (ccBox && this.ccEnabled) ccBox.style.opacity = '0.55';
        } else {
          this.captionText.textContent = currentScene.cues[0].text;
        }
      } else {
        this.captionText.textContent = currentScene.script;
      }
    }
  }

  /* -------------------------------------------------------------------------- */
  /* MediaRecorder Video Export                                                 */
  /* -------------------------------------------------------------------------- */
  toggleRecording() {
    if (this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.recordVideoBtn.textContent = 'Export Video (.webm)';
      if (this.recordingStatus) this.recordingStatus.classList.add('d-none');
    } else {
      const stream = this.canvas.captureStream(60);
      this.recordedChunks = [];
      try {
        this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
      } catch (e) {
        this.mediaRecorder = new MediaRecorder(stream);
      }

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.recordedChunks.push(e.data);
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'HRL_x_Rohan_Corporation_Master_Explainer.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      this.recordVideoBtn.textContent = 'Stop & Save Video';
      if (this.recordingStatus) this.recordingStatus.classList.remove('d-none');

      this.seekTo(0);
      this.play();
    }
  }

  /* -------------------------------------------------------------------------- */
  /* Main 60 FPS Engine Loop (Clean, Clutter-Free, Auto-Looping)                */
  /* -------------------------------------------------------------------------- */
  render() {
    const now = performance.now();
    const delta = (now - this.lastFrameTime) / 1000;
    this.lastFrameTime = now;

    if (this.isPlaying) {
      const scene = this.scenes[this.currentSceneIndex];
      // Hardware-lock timeline directly to studio narration audio clock for 100% frame sync
      if (this.currentActiveAudio && !this.currentActiveAudio.paused && !this.currentActiveAudio.ended) {
        this.currentTime = scene.start + this.currentActiveAudio.currentTime;
      } else {
        this.currentTime += delta;
      }

      if (this.currentTime >= this.duration) {
        if (this.autoRun) {
          this.currentTime = 0;
          this.currentSceneIndex = 0;
          this.currentVoiceSceneIndex = -1;
          this.speakScene(0);
        } else {
          this.currentTime = this.duration;
          this.pause();
        }
      }
      this.updateSceneIndex();
    }

    // Update Progress Bar
    if (this.progressBarFill) {
      const progress = (this.currentTime / this.duration) * 100;
      this.progressBarFill.style.width = `${progress}%`;
    }
    if (this.timeDisplay) {
      const curMin = Math.floor(this.currentTime / 60);
      const curSec = Math.floor(this.currentTime % 60);
      const durMin = Math.floor(this.duration / 60);
      const durSec = Math.floor(this.duration % 60);
      this.timeDisplay.textContent = `${String(curMin).padStart(2, '0')}:${String(curSec).padStart(2, '0')} / ${String(durMin).padStart(2, '0')}:${String(durSec).padStart(2, '0')}`;
    }

    // Clean Obsidian Background
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, 1920, 1080);

    // Route Scene
    const scene = this.scenes[this.currentSceneIndex];
    if (scene.id === 'genesis') this.renderSceneGenesis();
    else if (scene.id === 'portfolio') this.renderScenePortfolio();
    else if (scene.id === 'rohan_city') this.renderSceneRohanCity();
    else if (scene.id === 'rohan_marina') this.renderSceneRohanMarina();
    else if (scene.id === 'square_estate') this.renderSceneSquareEstate();
    else if (scene.id === 'finale') this.renderSceneFinale();

    // Clean Header with Auto-Run Status
    this.drawCleanHeader();

    requestAnimationFrame(() => this.render());
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 1: The Genesis & The Vision (0:00 - 0:25)                            */
  /* Clean, elegant Apple typography with soft vignette                         */
  /* -------------------------------------------------------------------------- */
  /* Premium Metallic & Champagne Gold Typography Helper                        */
  /* -------------------------------------------------------------------------- */
  createGoldGradient(yTop, yBottom) {
    const grad = this.ctx.createLinearGradient(0, yTop, 0, yBottom);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, '#faeccd');
    grad.addColorStop(0.65, '#dfb76c');
    grad.addColorStop(1, '#9b7218');
    return grad;
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 1: Executive Genesis & Monolithic Branding (0:00 - 0:25)             */
  /* -------------------------------------------------------------------------- */
  renderSceneGenesis() {
    const ctx = this.ctx;
    const t = this.currentTime;

    // Clean luxury ambient backdrop (preserving 2.37:1 ratio)
    ctx.save();
    ctx.globalAlpha = 0.12;
    if (this.assets.city.complete) {
      this.drawImageNativeRatio(ctx, this.assets.city, 200, 120, 1520, 24);
    }
    // Deep center radial mask to completely eliminate background photo text overlap
    const vignette = ctx.createRadialGradient(960, 540, 120, 960, 540, 850);
    vignette.addColorStop(0, 'rgba(8, 8, 12, 0.96)');
    vignette.addColorStop(0.45, 'rgba(8, 8, 12, 0.92)');
    vignette.addColorStop(1, 'rgba(2, 2, 4, 0.98)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, 1920, 1080);
    ctx.restore();

    // Monolithic Partnership Typography (Zero Overlap, Premium Gold)
    ctx.textAlign = 'center';

    // Eyebrow
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#dfb76c';
    ctx.fillText('MANGALURU SMART PROPTECH INITIATIVE', 960, 330);

    // Headline (Metallic Gold Gradient)
    ctx.font = '700 64px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = this.createGoldGradient(360, 425);
    ctx.fillText('HRL INTERNATIONAL  ×  ROHAN CORPORATION', 960, 420);

    // Subtitle
    ctx.font = '400 24px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#f5e6c8';
    ctx.fillText('Bridging Architectural Grandeur with Computational Intelligence', 960, 475);

    // Separator line (Subtle Champagne Gold)
    ctx.strokeStyle = 'rgba(223, 183, 108, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(760, 520);
    ctx.lineTo(1160, 520);
    ctx.stroke();

    // 4 Proof Pillars
    const pillars = [
      { num: '30+ Years', lbl: 'Rohan Corporation Legacy' },
      { num: '4 Flagships', lbl: 'Mangaluru Premier Sites' },
      { num: 'Digital Twin', lbl: '60 FPS 3D Interactive Web' },
      { num: '100% RERA', lbl: 'Govt Sanctioned & Approved' }
    ];

    pillars.forEach((p, idx) => {
      const px = 300 + idx * 360;
      const py = 590;
      const pw = 300;
      const ph = 100;

      ctx.fillStyle = '#161617';
      this.roundRect(ctx, px, py, pw, ph, 20);
      ctx.fill();
      ctx.strokeStyle = 'rgba(223, 183, 108, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillStyle = this.createGoldGradient(py + 25, py + 48);
      ctx.fillText(p.num, px + pw / 2, py + 45);

      ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#86868b';
      ctx.fillText(p.lbl, px + pw / 2, py + 74);
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 2: Landmark Portfolio Showcase (0:25 - 0:55)                        */
  /* 2×2 Panoramic Grid: 100% Exact 2.37:1 Ratio for ALL 4 Banners             */
  /* -------------------------------------------------------------------------- */
  renderScenePortfolio() {
    const ctx = this.ctx;

    ctx.textAlign = 'center';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#dfb76c';
    ctx.fillText('PORTFOLIO OVERVIEW • 2.37:1 NATIVE ARCHITECTURAL RATIO', 960, 118);

    ctx.font = '600 38px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = this.createGoldGradient(125, 165);
    ctx.fillText('Four Landmark Developments Across Mangaluru', 960, 162);

    const items = [
      {
        title: 'Rohan City',
        sub: 'Bejai Main Road • 3, 2 & 1 BHK + Commercial Spaces',
        spec: 'RERA: PRM/KA/RERA/1251/305/PR/210219/003908 • 3.5M Sq. Ft.',
        img: this.assets.city,
        col: 0, row: 0,
        highlight: '#dfb76c'
      },
      {
        title: 'Rohan Marina One',
        sub: 'Surathkal Beach • 2, 3 & 4 BHK Sea-Facing Apartments',
        spec: '100% Sea-Horizon Visibility • Coastal Wind Vector Modeling',
        img: this.assets.marina,
        col: 1, row: 0,
        highlight: '#dfb76c'
      },
      {
        title: 'Rohan Square',
        sub: 'Capitanio, Pumpwell • Ready to Move In Corporate & Living',
        spec: 'NH-66 Arterial Gateway • Smart Micro-Grid Dual Power Backup',
        img: this.assets.square,
        col: 0, row: 1,
        highlight: '#dfb76c'
      },
      {
        title: 'Rohan Estate',
        sub: 'Neermarga Hills • Plots Starting from 5.5 Cents',
        spec: 'Gated Hillside Sanctuary • IoT Subsoil Moisture Telemetry',
        img: this.assets.estate,
        col: 1, row: 1,
        highlight: '#dfb76c'
      }
    ];

    const cardW = 790;
    const imgW = 770;
    const imgH = 325; // 770 / 2.3704 = 324.8 px
    const startX = 130;
    const startY = 195;
    const rowGap = 395;
    const colGap = 840;

    items.forEach(item => {
      const cx = startX + item.col * colGap;
      const cy = startY + item.row * rowGap;

      // Outer Card Box
      ctx.fillStyle = '#161617';
      this.roundRect(ctx, cx, cy, cardW, 375, 20);
      ctx.fill();
      ctx.strokeStyle = 'rgba(223, 183, 108, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Native 2.37:1 Image Drawing (Zero Crop, Zero Distortion)
      if (item.img.complete) {
        this.drawImageNativeRatio(ctx, item.img, cx + 10, cy + 10, imgW, 14);
      }

      // Bottom Professional Spec Strip
      ctx.textAlign = 'left';
      ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#dfb76c';
      ctx.fillText('RERA APPROVED', cx + 20, cy + imgH + 34);

      ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#f5e6c8';
      ctx.fillText(item.spec, cx + 138, cy + imgH + 34);
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 3: Rohan City — Bejai Deep-Dive (0:55 - 1:25)                        */
  /* Hero 2.37:1 Banner (1480×624) + Apple Professional Information Matrix Tray */
  /* -------------------------------------------------------------------------- */
  renderSceneRohanCity() {
    const ctx = this.ctx;

    ctx.textAlign = 'center';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#dfb76c';
    ctx.fillText('FLAGSHIP MIXED-USE TOWNSHIP • CENTRAL MANGALURU', 960, 118);

    ctx.font = '600 38px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = this.createGoldGradient(125, 165);
    ctx.fillText('Rohan City • Bejai Main Road, Mangaluru', 960, 160);

    // Hero 2.37:1 Banner Display (1480 px width -> 624 px height)
    const bannerW = 1480;
    const bannerH = 624; // 1480 / 2.37037 = 624.3 px
    const bannerX = (1920 - bannerW) / 2;
    const bannerY = 190;

    if (this.assets.city.complete) {
      this.drawImageNativeRatio(ctx, this.assets.city, bannerX, bannerY, bannerW, 20);
    }

    // Professional Information Tray
    const trayY = bannerY + bannerH + 18;
    const trayH = 150;
    ctx.fillStyle = '#161617';
    this.roundRect(ctx, bannerX, trayY, bannerW, trayH, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(223, 183, 108, 0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 4 Professional Real Estate Spec Columns
    const proCols = [
      {
        tag: 'STATUTORY REGISTRATION',
        title: 'Karnataka RERA Approved',
        desc: 'PRM/KA/RERA/1251/305/PR/210219/003908'
      },
      {
        tag: 'DEVELOPMENT SCALE',
        title: '3.5 Million+ Sq. Ft.',
        desc: 'Podium High-Street Retail & Luxury Twin Towers'
      },
      {
        tag: 'RESIDENCE MATRIX',
        title: '3, 2 & 1 BHK Apartments',
        desc: 'Skydeck Balconies with Panoramic City Views'
      },
      {
        tag: 'PROPTECH INTEGRATION',
        title: '60 FPS 3D Digital Twin',
        desc: 'Balcony Solar Daylight & Edge AI Building Node'
      }
    ];

    const colW = (bannerW - 80) / 4;
    proCols.forEach((col, idx) => {
      const cx = bannerX + 40 + idx * colW;
      ctx.textAlign = 'left';

      ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#dfb76c';
      ctx.fillText(col.tag, cx, trayY + 38);

      ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(col.title, cx, trayY + 68);

      ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#f5e6c8';
      ctx.fillText(col.desc, cx, trayY + 98);
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 4: Rohan Marina One — Surathkal Waterfront (1:25 - 1:55)             */
  /* Hero 2.37:1 Banner (1480×623) + Apple Professional Information Matrix Tray */
  /* -------------------------------------------------------------------------- */
  renderSceneRohanMarina() {
    const ctx = this.ctx;

    ctx.textAlign = 'center';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#dfb76c';
    ctx.fillText('ULTRA-LUXURY COASTAL WATERFRONT • SURATHKAL', 960, 118);

    ctx.font = '600 38px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = this.createGoldGradient(125, 165);
    ctx.fillText('Rohan Marina One • Where Every Home Faces the Sea', 960, 160);

    const bannerW = 1480;
    const bannerH = 623; // 1480 / 2.37587 = 622.9 px
    const bannerX = (1920 - bannerW) / 2;
    const bannerY = 190;

    if (this.assets.marina.complete) {
      this.drawImageNativeRatio(ctx, this.assets.marina, bannerX, bannerY, bannerW, 20);
    }

    // Professional Information Tray
    const trayY = bannerY + bannerH + 18;
    const trayH = 150;
    ctx.fillStyle = '#161617';
    this.roundRect(ctx, bannerX, trayY, bannerW, trayH, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(223, 183, 108, 0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();

    const proCols = [
      {
        tag: 'MARITIME ORIENTATION',
        title: '100% Sea-Facing Frontage',
        desc: 'Uninterrupted Arabian Sea Horizon Sightlines'
      },
      {
        tag: 'CONFIGURATIONS',
        title: '2, 3 & 4 BHK Sky Mansions',
        desc: 'Direct Coastal Access & Private Sea Balconies'
      },
      {
        tag: 'STRATEGIC LOCATION',
        title: 'Surathkal Beach Corridor',
        desc: 'Premium Educational & IT Hub Connectivity'
      },
      {
        tag: 'PROPTECH INTEGRATION',
        title: 'Wind Vector & NRI Engine',
        desc: 'Cross-Ventilation Shaders & Remote Booking'
      }
    ];

    const colW = (bannerW - 80) / 4;
    proCols.forEach((col, idx) => {
      const cx = bannerX + 40 + idx * colW;
      ctx.textAlign = 'left';

      ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#dfb76c';
      ctx.fillText(col.tag, cx, trayY + 38);

      ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(col.title, cx, trayY + 68);

      ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#f5e6c8';
      ctx.fillText(col.desc, cx, trayY + 98);
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 5: Rohan Square & Rohan Estate (1:55 - 2:15)                        */
  /* Side-by-Side Dual 2.37:1 Banners (820×346) + Professional Information Tray */
  /* -------------------------------------------------------------------------- */
  renderSceneSquareEstate() {
    const ctx = this.ctx;

    ctx.textAlign = 'center';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#dfb76c';
    ctx.fillText('COMPREHENSIVE ECOSYSTEM • COMMERCIAL HUB & HILLSIDE SANCTUARY', 960, 118);

    ctx.font = '600 38px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = this.createGoldGradient(125, 165);
    ctx.fillText('Rohan Square (Pumpwell) & Rohan Estate (Neermarga)', 960, 160);

    const bannerW = 810;
    const bannerH = 341; // 810 / 2.37587 = 340.9 px
    const leftX = 110;
    const rightX = 1000;
    const bannerY = 200;

    // Left Banner: Rohan Square (Pumpwell)
    if (this.assets.square.complete) {
      this.drawImageNativeRatio(ctx, this.assets.square, leftX, bannerY, bannerW, 16);
    }

    // Left Info Tray
    const trayY = bannerY + bannerH + 18;
    const trayH = 260;
    ctx.fillStyle = '#161617';
    this.roundRect(ctx, leftX, trayY, bannerW, trayH, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(223, 183, 108, 0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#dfb76c';
    ctx.fillText('READY TO MOVE IN • IMMEDIATE POSSESSION', leftX + 32, trayY + 40);

    ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#f5e6c8';
    ctx.fillText('Rohan Square • Capitanio, Pumpwell, Mangalore', leftX + 32, trayY + 75);

    const sqSpecs = [
      { l: 'Asset Class', v: 'Grade-A Retail Showrooms & Executive Corporate Suites' },
      { l: 'Connectivity', v: 'Arterial NH-66 Junction Gateway with High Footfall' },
      { l: 'Infrastructure', v: '100% Dual Power Backup & High-Speed Passenger Elevators' },
      { l: 'PropTech IoT', v: 'Smart Micro-Grid Energy Telemetry & Resident Privacy' }
    ];
    sqSpecs.forEach((s, idx) => {
      const sy = trayY + 115 + idx * 30;
      ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#dfb76c';
      ctx.fillText(s.l + ':', leftX + 32, sy);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(s.v, leftX + 140, sy);
    });

    // Right Banner: Rohan Estate (Neermarga)
    if (this.assets.estate.complete) {
      this.drawImageNativeRatio(ctx, this.assets.estate, rightX, bannerY, bannerW, 16);
    }

    // Right Info Tray
    ctx.fillStyle = '#161617';
    this.roundRect(ctx, rightX, trayY, bannerW, trayH, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(223, 183, 108, 0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#dfb76c';
    ctx.fillText('LUSH GREEN HILLSIDE SANCTUARY • PLOTS FROM 5.5 CENTS', rightX + 32, trayY + 40);

    ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#f5e6c8';
    ctx.fillText('Rohan Estate • Neermarga Hills, Mangaluru', rightX + 32, trayY + 75);

    const estSpecs = [
      { l: 'Configuration', v: 'Master-Planned Gated Villa Plots (Clear Statutory Titles)' },
      { l: 'Topography', v: 'Scenic Elevated Neermarga Hills with Panoramic Vistas' },
      { l: 'Civil Specs', v: 'Wide Asphalted Boulevards, Storm Drainage, Solar Streetlights' },
      { l: 'PropTech IoT', v: 'Subsoil Moisture Telemetry & Perimeter Drone Surveillance' }
    ];
    estSpecs.forEach((s, idx) => {
      const sy = trayY + 115 + idx * 30;
      ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#dfb76c';
      ctx.fillText(s.l + ':', rightX + 32, sy);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(s.v, rightX + 140, sy);
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 6: Executive Sign-off & Partnership Finale (2:15 - 2:30)             */
  /* Clean Boardroom Closing with 4 Mini 2.37:1 Panoramic Thumbnails            */
  /* -------------------------------------------------------------------------- */
  renderSceneFinale() {
    const ctx = this.ctx;

    ctx.textAlign = 'center';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#dfb76c';
    ctx.fillText('OFFICIAL STRATEGIC ALLIANCE', 960, 120);

    ctx.font = '700 56px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = this.createGoldGradient(140, 195);
    ctx.fillText('The Future of Living Begins Today.', 960, 185);

    ctx.font = '400 20px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#f5e6c8';
    ctx.fillText('Engineered to accelerate pre-sales velocity and empower NRI investors worldwide.', 960, 230);

    // 4 Mini 2.37:1 Panoramic Thumbnails in a Row
    const thumbW = 340;
    const thumbH = 143; // 340 / 2.3704 = 143.4 px
    const startX = (1920 - (4 * thumbW + 3 * 24)) / 2;
    const thumbY = 280;

    const miniList = [
      { img: this.assets.city, label: 'Rohan City (Bejai)' },
      { img: this.assets.marina, label: 'Rohan Marina One (Surathkal)' },
      { img: this.assets.square, label: 'Rohan Square (Pumpwell)' },
      { img: this.assets.estate, label: 'Rohan Estate (Neermarga)' }
    ];

    miniList.forEach((m, idx) => {
      const mx = startX + idx * (thumbW + 24);
      if (m.img.complete) {
        this.drawImageNativeRatio(ctx, m.img, mx, thumbY, thumbW, 12);
      }
      ctx.textAlign = 'center';
      ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#f5e6c8';
      ctx.fillText(m.label, mx + thumbW / 2, thumbY + thumbH + 24);
    });

    // Executive Signatories Card
    const signW = 1080;
    const signH = 190;
    const signX = (1920 - signW) / 2;
    const signY = 500;

    ctx.fillStyle = '#161617';
    this.roundRect(ctx, signX, signY, signW, signH, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(223, 183, 108, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Left: HRL International
    ctx.textAlign = 'left';
    ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#dfb76c';
    ctx.fillText('TECHNOLOGY PARTNER', signX + 60, signY + 45);

    ctx.font = '600 26px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#f5e6c8';
    ctx.fillText('Pavan Kumar Sadashiv', signX + 60, signY + 85);

    ctx.font = '400 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('HRL International Private Limited • AI Architect & MD', signX + 60, signY + 115);

    // Center Divider
    ctx.strokeStyle = 'rgba(223, 183, 108, 0.2)';
    ctx.beginPath();
    ctx.moveTo(960, signY + 30);
    ctx.lineTo(960, signY + signH - 30);
    ctx.stroke();

    // Right: Rohan Corporation
    ctx.textAlign = 'left';
    ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#dfb76c';
    ctx.fillText('REAL ESTATE CONGLOMERATE', 1020, signY + 45);

    ctx.font = '600 26px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#f5e6c8';
    ctx.fillText('Rohan Monteiro', 1020, signY + 85);

    ctx.font = '400 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('Rohan Corporation • Founder & Chairman', 1020, signY + 115);

    // Bottom Action Pill
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(223, 183, 108, 0.12)';
    this.roundRect(ctx, 640, 740, 640, 54, 27);
    ctx.fill();
    ctx.strokeStyle = 'rgba(223, 183, 108, 0.35)';
    ctx.stroke();

    ctx.font = '500 16px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#dfb76c';
    ctx.fillText('Phase 1 Pilot Sanction • Rohan City Drone & LiDAR Baseline Survey', 960, 773);
  }

  /* -------------------------------------------------------------------------- */
  /* Clean Header (Minimal, Auto-Run Indicator)                                 */
  /* -------------------------------------------------------------------------- */
  drawCleanHeader() {
    const ctx = this.ctx;

    // Top-left
    ctx.textAlign = 'left';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('HRL INTERNATIONAL', 60, 55);
    ctx.fillStyle = '#dfb76c';
    ctx.fillText(' / ROHAN CORPORATION', 60 + ctx.measureText('HRL INTERNATIONAL').width, 55);

    if (this.autoRun) {
      ctx.fillStyle = '#dfb76c';
      ctx.beginPath();
      ctx.arc(430, 51, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#dfb76c';
      ctx.fillText('AUTO-RUN', 440, 55);
    }

    ctx.font = '400 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('PROPTECH MASTER PRESENTATION • 4K 60FPS', 60, 74);

    // Top-right scene tracker
    const scene = this.scenes[this.currentSceneIndex];
    ctx.textAlign = 'right';
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#dfb76c';
    ctx.fillText(`SCENE ${String(this.currentSceneIndex + 1).padStart(2, '0')} / 06`, 1860, 55);

    ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#f5e6c8';
    ctx.fillText(scene.title.toUpperCase(), 1860, 74);
  }

  /* -------------------------------------------------------------------------- */
  /* Geometry & Image Helper: Native 2.37:1 Ratio Drawing                       */
  /* Guarantees ZERO CROPPING, ZERO DISTORTION across all photographic renders   */
  /* -------------------------------------------------------------------------- */
  drawImageNativeRatio(ctx, img, x, y, width, radius = 16) {
    if (!img || !img.complete || img.naturalWidth === 0) return 0;
    const ratio = img.naturalWidth / img.naturalHeight; // ~2.37:1
    const height = width / ratio;

    ctx.save();
    this.clipRoundedRect(ctx, x, y, width, height, radius);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, x, y, width, height);
    ctx.restore();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1;
    this.roundRect(ctx, x, y, width, height, radius);
    ctx.stroke();

    return height;
  }

  clipRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, width, height, radius);
    } else {
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }
    ctx.clip();
  }

  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, width, height, radius);
    } else {
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.videoEngine = new MasterMotionGraphicsEngine();
});
