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
    this.duration = 150; // 2 minutes 30 seconds
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

    // Master Script & Scene Milestones
    this.scenes = [
      {
        id: 'genesis',
        start: 0,
        end: 25,
        title: 'Genesis & Shared Vision',
        script: "For over thirty years, Rohan Corporation has sculpted the skyline of Mangaluru with trusted architectural landmarks. Today, that physical grandeur unites with computational intelligence. Welcome to the HRL International and Rohan Corporation Smart PropTech Platform."
      },
      {
        id: 'portfolio',
        start: 25,
        end: 55,
        title: 'Flagship Developments Portfolio',
        script: "Our joint initiative powers Rohan Corporation's premier developments: Rohan City at Bejai, Rohan Marina One at Surathkal beach, Rohan Square at Pumpwell, and the hillside paradise of Rohan Estate at Neermarga. Each project is fully RERA approved and engineered for generational permanence."
      },
      {
        id: 'rohan_city',
        start: 55,
        end: 85,
        title: 'Rohan City: Digital Twin & Simulation',
        script: "At Rohan City on Bejai Main Road, over 3.5 million square feet of commercial and residential space comes alive inside the browser. Prospective buyers can explore photorealistic digital twins, inspect sunlight on living balconies, and tour retail plazas at sixty frames per second."
      },
      {
        id: 'rohan_marina',
        start: 85,
        end: 115,
        title: 'Rohan Marina One: Sea-Facing Innovation',
        script: "At Rohan Marina One in Surathkal, where every home faces the sea, our visual computing engine models panoramic ocean horizons, coastal breeze vectors, and unobstructed sunset vistas, enabling seamless remote reservations for NRI families across the globe."
      },
      {
        id: 'square_estate',
        start: 115,
        end: 135,
        title: 'Rohan Square & Rohan Estate: Smart Ecosystems',
        script: "From corporate suites and ready-to-move-in homes at Rohan Square Pumpwell, to serene hillside plotted enclaves with subsoil telemetry at Rohan Estate Neermarga, intelligent edge sensors provide real-time assurance with zero cloud privacy risks."
      },
      {
        id: 'finale',
        start: 135,
        end: 150,
        title: 'Executive Partnership & Next Steps',
        script: "HRL International and Rohan Corporation. Together, we are establishing the benchmark for luxury living and smart real estate in Coastal Karnataka. The future of living begins today."
      }
    ];

    this.currentSceneIndex = 0;
    this.currentVoiceSceneIndex = -1;

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
      if (this.voiceEnabled && this.isPlaying && window.speechSynthesis && !window.speechSynthesis.speaking) {
        this.speakScene(this.currentSceneIndex);
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
      this.masterGain.gain.value = 0.22;
      this.masterGain.connect(this.audioCtx.destination);
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
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
  /* Voiceover Narration (Web Speech API)                                       */
  /* -------------------------------------------------------------------------- */
  speakScene(sceneIndex) {
    if (!this.voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const scene = this.scenes[sceneIndex];
    if (!scene) return;

    const utterance = new SpeechSynthesisUtterance(scene.script);
    utterance.rate = 0.96;
    utterance.pitch = 0.98;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Daniel') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('US') || v.name.includes('UK')));
    if (preferred) utterance.voice = preferred;

    window.speechSynthesis.speak(utterance);
    this.currentVoiceSceneIndex = sceneIndex;
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
    this.toggleCCBtn = document.getElementById('toggleCCBtn');
    this.fullscreenBtn = document.getElementById('fullscreenBtn');
    this.recordVideoBtn = document.getElementById('recordVideoBtn');
    this.recordingStatus = document.getElementById('recordingStatus');

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
        if (!this.voiceEnabled && window.speechSynthesis) window.speechSynthesis.cancel();
        else if (this.voiceEnabled && this.isPlaying) this.speakScene(this.currentSceneIndex);
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
    this.speakScene(this.currentSceneIndex);
    this.lastFrameTime = performance.now();
  }

  pause() {
    this.isPlaying = false;
    if (this.playIcon) this.playIcon.textContent = 'Play';
    this.stopSoundtrack();
    if (window.speechSynthesis) window.speechSynthesis.pause();
  }

  seekTo(seconds) {
    this.currentTime = Math.max(0, Math.min(this.duration, seconds));
    this.updateSceneIndex();
    if (this.isPlaying) this.speakScene(this.currentSceneIndex);
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
      this.captionText.textContent = currentScene.script;
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
      this.currentTime += delta;
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
  renderSceneGenesis() {
    const ctx = this.ctx;
    const t = this.currentTime;

    // Soft panoramic ambient backdrop (preserving 2.37:1 ratio)
    ctx.save();
    ctx.globalAlpha = 0.22;
    if (this.assets.city.complete) {
      this.drawImageNativeRatio(ctx, this.assets.city, 200, 120, 1520, 24);
    }
    const vignette = ctx.createRadialGradient(960, 540, 200, 960, 540, 900);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.98)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, 1920, 1080);
    ctx.restore();

    // Monolithic Partnership Typography (Zero Overlap)
    ctx.textAlign = 'center';

    // Eyebrow
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#e2d5c3';
    ctx.fillText('MANGALURU SMART PROPTECH INITIATIVE', 960, 330);

    // Headline
    ctx.font = '700 64px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('HRL INTERNATIONAL  ×  ROHAN CORPORATION', 960, 420);

    // Subtitle
    ctx.font = '400 24px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('Bridging Architectural Grandeur with Computational Intelligence', 960, 475);

    // Separator line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
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
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillStyle = '#ffffff';
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
    ctx.fillStyle = '#e2d5c3';
    ctx.fillText('PORTFOLIO OVERVIEW • 2.37:1 NATIVE ARCHITECTURAL RATIO', 960, 118);

    ctx.font = '600 38px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Four Landmark Developments Across Mangaluru', 960, 162);

    const items = [
      {
        title: 'Rohan City',
        sub: 'Bejai Main Road • 3, 2 & 1 BHK + Commercial Spaces',
        spec: 'RERA: PRM/KA/RERA/1251/305/PR/210219/003908 • 3.5M Sq. Ft.',
        img: this.assets.city,
        col: 0, row: 0,
        highlight: '#0071e3'
      },
      {
        title: 'Rohan Marina One',
        sub: 'Surathkal Beach • 2, 3 & 4 BHK Sea-Facing Apartments',
        spec: '100% Sea-Horizon Visibility • Coastal Wind Vector Modeling',
        img: this.assets.marina,
        col: 1, row: 0,
        highlight: '#2997ff'
      },
      {
        title: 'Rohan Square',
        sub: 'Capitanio, Pumpwell • Ready to Move In Corporate & Living',
        spec: 'NH-66 Arterial Gateway • Smart Micro-Grid Dual Power Backup',
        img: this.assets.square,
        col: 0, row: 1,
        highlight: '#30d158'
      },
      {
        title: 'Rohan Estate',
        sub: 'Neermarga Hills • Plots Starting from 5.5 Cents',
        spec: 'Gated Hillside Sanctuary • IoT Subsoil Moisture Telemetry',
        img: this.assets.estate,
        col: 1, row: 1,
        highlight: '#e2d5c3'
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
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Native 2.37:1 Image Drawing (Zero Crop, Zero Distortion)
      if (item.img.complete) {
        this.drawImageNativeRatio(ctx, item.img, cx + 10, cy + 10, imgW, 14);
      }

      // Bottom Professional Spec Strip
      ctx.textAlign = 'left';
      ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#30d158';
      ctx.fillText('RERA APPROVED', cx + 20, cy + imgH + 34);

      ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#86868b';
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
    ctx.fillStyle = '#0071e3';
    ctx.fillText('FLAGSHIP MIXED-USE TOWNSHIP • CENTRAL MANGALURU', 960, 118);

    ctx.font = '600 38px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
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
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
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
      ctx.fillStyle = idx === 0 ? '#30d158' : '#0071e3';
      ctx.fillText(col.tag, cx, trayY + 38);

      ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(col.title, cx, trayY + 68);

      ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#86868b';
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
    ctx.fillStyle = '#2997ff';
    ctx.fillText('ULTRA-LUXURY COASTAL WATERFRONT • SURATHKAL', 960, 118);

    ctx.font = '600 38px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
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
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
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
      ctx.fillStyle = idx === 0 ? '#2997ff' : '#e2d5c3';
      ctx.fillText(col.tag, cx, trayY + 38);

      ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(col.title, cx, trayY + 68);

      ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#86868b';
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
    ctx.fillStyle = '#e2d5c3';
    ctx.fillText('COMPREHENSIVE ECOSYSTEM • COMMERCIAL HUB & HILLSIDE SANCTUARY', 960, 118);

    ctx.font = '600 38px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
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
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#30d158';
    ctx.fillText('READY TO MOVE IN • IMMEDIATE POSSESSION', leftX + 32, trayY + 40);

    ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
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
      ctx.fillStyle = '#86868b';
      ctx.fillText(s.l + ':', leftX + 32, sy);
      ctx.fillStyle = '#f5f5f7';
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
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#e2d5c3';
    ctx.fillText('LUSH GREEN HILLSIDE SANCTUARY • PLOTS FROM 5.5 CENTS', rightX + 32, trayY + 40);

    ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
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
      ctx.fillStyle = '#86868b';
      ctx.fillText(s.l + ':', rightX + 32, sy);
      ctx.fillStyle = '#f5f5f7';
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
    ctx.fillStyle = '#e2d5c3';
    ctx.fillText('OFFICIAL STRATEGIC ALLIANCE', 960, 120);

    ctx.font = '700 56px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('The Future of Living Begins Today.', 960, 185);

    ctx.font = '400 20px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
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
      ctx.fillStyle = '#86868b';
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
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Left: HRL International
    ctx.textAlign = 'left';
    ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#0071e3';
    ctx.fillText('TECHNOLOGY PARTNER', signX + 60, signY + 45);

    ctx.font = '600 26px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Pavan Kumar Sadashiv', signX + 60, signY + 85);

    ctx.font = '400 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('HRL International Private Limited • AI Architect & MD', signX + 60, signY + 115);

    // Center Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.moveTo(960, signY + 30);
    ctx.lineTo(960, signY + signH - 30);
    ctx.stroke();

    // Right: Rohan Corporation
    ctx.textAlign = 'left';
    ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#e2d5c3';
    ctx.fillText('REAL ESTATE CONGLOMERATE', 1020, signY + 45);

    ctx.font = '600 26px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Rohan Monteiro', 1020, signY + 85);

    ctx.font = '400 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('Rohan Corporation • Founder & Chairman', 1020, signY + 115);

    // Bottom Action Pill
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0, 113, 227, 0.12)';
    this.roundRect(ctx, 640, 740, 640, 54, 27);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 113, 227, 0.35)';
    ctx.stroke();

    ctx.font = '500 16px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#2997ff';
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
    ctx.fillText('HRL INTERNATIONAL / ROHAN CORPORATION', 60, 55);

    if (this.autoRun) {
      ctx.fillStyle = '#30d158';
      ctx.beginPath();
      ctx.arc(385, 51, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#30d158';
      ctx.fillText('AUTO-RUN', 396, 55);
    }

    ctx.font = '400 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('PROPTECH MASTER PRESENTATION • 4K 60FPS', 60, 74);

    // Top-right scene tracker
    const scene = this.scenes[this.currentSceneIndex];
    ctx.textAlign = 'right';
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText(`SCENE ${String(this.currentSceneIndex + 1).padStart(2, '0')} / 06`, 1860, 55);

    ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#0071e3';
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
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x + radius, y);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.clip();
  }

  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
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

document.addEventListener('DOMContentLoaded', () => {
  window.videoEngine = new MasterMotionGraphicsEngine();
});
