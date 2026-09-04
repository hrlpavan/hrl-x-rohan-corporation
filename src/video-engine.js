/**
 * ============================================================================
 * HRL International × Rohan Corporation
 * Master Project Explainer Engine (4K UHD 60FPS)
 * 
 * Clean, Clutter-Free, Cinematic Apple-Grade Visual Explanation
 * Incorporating Authentic Photographic Renders:
 * 1. Rohan City (Bejai Main Road, Mangaluru)
 * 2. Rohan Marina One (Surathkal, Mangalore)
 * 3. Rohan Square (Capitanio, Pumpwell, Mangalore)
 * 4. Rohan Estate (Neermarga Hills, Mangaluru)
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
    this.lastFrameTime = performance.now();

    // Preload Real Photographic Assets
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
    this.autoRun = true;

    this.initAudioEngine();
    this.bindUI();
    this.render();

    // Auto-Run immediately upon launch
    setTimeout(() => {
      this.play();
    }, 200);

    // Smoothly unlock audio if browser autoplay policy delays Web Audio until gesture
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

    // Warm Analog Tri-Chords (Warm C-Major9 / A-Minor7 Chord Bed)
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

    this.toggleAutoBtn = document.getElementById('toggleAutoBtn');
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
  /* Main 60 FPS Engine Loop (Clean, Clutter-Free)                              */
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

    // Clean Obsidian Background - No Clutter, No Starfield!
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

    // Clean, Minimalist Header & Metadata (No Clutter)
    this.drawCleanHeader();

    requestAnimationFrame(() => this.render());
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 1: The Genesis & The Vision (0:00 - 0:25)                            */
  /* Clean, elegant Apple typography with subtle collage preview               */
  /* -------------------------------------------------------------------------- */
  renderSceneGenesis() {
    const ctx = this.ctx;
    const t = this.currentTime;
    const sceneProgress = Math.min(1.0, t / 25);

    // Subtle background collage of the real properties with soft opacity
    const bgOpacity = Math.min(0.25, t * 0.08);
    ctx.save();
    ctx.globalAlpha = bgOpacity;
    if (this.assets.city.complete) {
      const zoom = 1.0 + sceneProgress * 0.05;
      this.drawImageCover(ctx, this.assets.city, 0, 0, 1920, 1080, 0, zoom);
    }
    // Gradient overlay to keep text 100% legible
    const vignette = ctx.createRadialGradient(960, 540, 200, 960, 540, 900);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.96)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, 1920, 1080);
    ctx.restore();

    // Clean Monolithic Typography (ZERO OVERLAP!)
    ctx.textAlign = 'center';

    // Eyebrow Badge
    ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#e2d5c3';
    ctx.letterSpacing = '0.12em';
    ctx.fillText('MANGALURU SMART PROPTECH INITIATIVE', 960, 340);

    // Primary Partnership Title - High Contrast, Crystal Clear
    ctx.font = '700 68px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('HRL INTERNATIONAL  ×  ROHAN CORPORATION', 960, 430);

    // Subtitle
    ctx.font = '400 24px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('Bridging Architectural Grandeur with Computational Intelligence', 960, 485);

    // Thin elegant separator
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(760, 530);
    ctx.lineTo(1160, 530);
    ctx.stroke();

    // 4 Key Pillar Badges
    const pillars = [
      { num: '30+ Years', lbl: 'Rohan Corporation Legacy' },
      { num: '4 Flagships', lbl: 'Mangaluru Premier Sites' },
      { num: 'Digital Twin', lbl: '60 FPS 3D Interactive Web' },
      { num: '100% RERA', lbl: 'Govt Sanctioned & Approved' }
    ];

    pillars.forEach((p, idx) => {
      const px = 300 + idx * 360;
      const py = 600;
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
  /* Displays the 4 real photographic assets in clean Apple Bento cards        */
  /* -------------------------------------------------------------------------- */
  renderScenePortfolio() {
    const ctx = this.ctx;

    ctx.textAlign = 'center';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#e2d5c3';
    ctx.fillText('PORTFOLIO OVERVIEW', 960, 130);

    ctx.font = '600 42px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Four Landmark Developments Across Mangaluru', 960, 185);

    const items = [
      {
        title: 'Rohan City',
        sub: 'Bejai Main Road',
        config: '3, 2 & 1 BHK + Commercial',
        img: this.assets.city,
        highlight: '#0071e3'
      },
      {
        title: 'Rohan Marina One',
        sub: 'Surathkal Beachfront',
        config: '2, 3 & 4 BHK Sea-Facing',
        img: this.assets.marina,
        highlight: '#2997ff'
      },
      {
        title: 'Rohan Square',
        sub: 'Capitanio, Pumpwell',
        config: 'Ready to Move In Homes',
        img: this.assets.square,
        highlight: '#30d158'
      },
      {
        title: 'Rohan Estate',
        sub: 'Neermarga Hills',
        config: 'Plots from 5.5 Cents',
        img: this.assets.estate,
        highlight: '#e2d5c3'
      }
    ];

    const cardW = 390;
    const cardH = 550;
    const cardY = 250;
    const startX = 120;
    const gap = 30;

    items.forEach((item, idx) => {
      const cardX = startX + idx * (cardW + gap);

      // Card Container
      ctx.fillStyle = '#161617';
      this.roundRect(ctx, cardX, cardY, cardW, cardH, 24);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Top Real Image Preview
      const imgH = 260;
      if (item.img.complete) {
        ctx.save();
        this.clipRoundedRect(ctx, cardX + 12, cardY + 12, cardW - 24, imgH, 16);
        this.drawImageCover(ctx, item.img, cardX + 12, cardY + 12, cardW - 24, imgH, 0, 1.0);
        ctx.restore();
      }

      // Project Details
      ctx.textAlign = 'left';

      // Category Pill
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      this.roundRect(ctx, cardX + 24, cardY + imgH + 28, 120, 26, 13);
      ctx.fill();
      ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = item.highlight;
      ctx.fillText('FLAGSHIP SITE', cardX + 36, cardY + imgH + 45);

      // Title
      ctx.font = '600 26px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(item.title, cardX + 24, cardY + imgH + 90);

      // Location
      ctx.font = '400 15px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#86868b';
      ctx.fillText(item.sub, cardX + 24, cardY + imgH + 122);

      // Specs
      ctx.font = '500 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#f5f5f7';
      ctx.fillText(item.config, cardX + 24, cardY + imgH + 160);

      // Bottom Status Indicator
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.moveTo(cardX + 24, cardY + cardH - 56);
      ctx.lineTo(cardX + cardW - 24, cardY + cardH - 56);
      ctx.stroke();

      ctx.fillStyle = '#30d158';
      ctx.beginPath();
      ctx.arc(cardX + 32, cardY + cardH - 30, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#86868b';
      ctx.fillText('RERA Approved • PropTech Integrated', cardX + 46, cardY + cardH - 26);
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 3: Rohan City — Bejai (0:55 - 1:25)                                 */
  /* Clean deep-dive on Rohan City with authentic render & clear features      */
  /* -------------------------------------------------------------------------- */
  renderSceneRohanCity() {
    const ctx = this.ctx;
    const t = this.currentTime;
    const progress = (t - 55) / 30;

    // Left Side: Cinematic Large Display of Rohan City Render
    const imgX = 100;
    const imgY = 160;
    const imgW = 1080;
    const imgH = 680;

    if (this.assets.city.complete) {
      ctx.save();
      this.clipRoundedRect(ctx, imgX, imgY, imgW, imgH, 28);
      // Gentle Ken-Burns zoom
      const zoom = 1.0 + progress * 0.04;
      this.drawImageCover(ctx, this.assets.city, imgX, imgY, imgW, imgH, 0, zoom, progress * -20, 0);

      // Subtle gradient at bottom of image
      const grad = ctx.createLinearGradient(0, imgY + imgH - 140, 0, imgY + imgH);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
      ctx.fillStyle = grad;
      ctx.fillRect(imgX, imgY + imgH - 140, imgW, 140);

      // Image Caption
      ctx.textAlign = 'left';
      ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Rohan City • Bejai Main Road, Mangaluru', imgX + 36, imgY + imgH - 50);

      ctx.font = '400 15px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#86868b';
      ctx.fillText('3, 2 & 1 BHK Apartments & Commercial Spaces', imgX + 36, imgY + imgH - 24);

      ctx.restore();

      // Border outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      this.roundRect(ctx, imgX, imgY, imgW, imgH, 28);
      ctx.stroke();
    }

    // Right Side: Clean Apple Bento Spec & Explanation Column
    const panelX = 1220;
    const panelY = 160;
    const panelW = 600;
    const panelH = 680;

    ctx.fillStyle = '#161617';
    this.roundRect(ctx, panelX, panelY, panelW, panelH, 28);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#0071e3';
    ctx.fillText('FLAGSHIP MIXED-USE TOWNSHIP', panelX + 44, panelY + 54);

    ctx.font = '600 36px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Rohan City', panelX + 44, panelY + 104);

    ctx.font = '400 16px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    this.wrapText(ctx, "Mangaluru's most ambitious mixed-use development combining world-class retail plazas, dining arcades, and luxury residential towers.", panelX + 44, panelY + 145, 510, 24);

    // 3 Clean PropTech Pillars
    const features = [
      {
        title: '3D Photorealistic Digital Twin',
        desc: 'Enables global NRI buyers to walk through apartments, view actual floor plans, and inspect living room balconies.'
      },
      {
        title: 'Daylight & Solar Azimuth Engine',
        desc: 'Calculates real-time natural sunlight exposure across all 3, 2 & 1 BHK residences throughout the calendar year.'
      },
      {
        title: 'Zero-Cloud On-Premise IoT',
        desc: 'NVIDIA Jetson edge nodes govern parking dispatch and energy efficiency while protecting resident data privacy.'
      }
    ];

    features.forEach((feat, idx) => {
      const fy = panelY + 260 + idx * 125;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      this.roundRect(ctx, panelX + 44, fy, 512, 105, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.stroke();

      ctx.font = '600 17px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(feat.title, panelX + 64, fy + 36);

      ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#86868b';
      this.wrapText(ctx, feat.desc, panelX + 64, fy + 62, 470, 18);
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 4: Rohan Marina One — Surathkal (0:85 - 1:15)                       */
  /* Clean showcase of the real sea-facing photographic render                 */
  /* -------------------------------------------------------------------------- */
  renderSceneRohanMarina() {
    const ctx = this.ctx;
    const t = this.currentTime;
    const progress = (t - 85) / 30;

    // Right Side: Cinematic Large Display of Rohan Marina One Render
    const imgX = 740;
    const imgY = 160;
    const imgW = 1080;
    const imgH = 680;

    if (this.assets.marina.complete) {
      ctx.save();
      this.clipRoundedRect(ctx, imgX, imgY, imgW, imgH, 28);
      const zoom = 1.0 + progress * 0.04;
      this.drawImageCover(ctx, this.assets.marina, imgX, imgY, imgW, imgH, 0, zoom, progress * -15, 0);

      // Bottom gradient
      const grad = ctx.createLinearGradient(0, imgY + imgH - 140, 0, imgY + imgH);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
      ctx.fillStyle = grad;
      ctx.fillRect(imgX, imgY + imgH - 140, imgW, 140);

      ctx.textAlign = 'left';
      ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Rohan Marina One • Surathkal, Mangalore', imgX + 36, imgY + imgH - 50);

      ctx.font = '400 15px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#86868b';
      ctx.fillText('Where Every Home Faces the Sea • 2, 3 & 4 BHK Apartments', imgX + 36, imgY + imgH - 24);

      ctx.restore();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      this.roundRect(ctx, imgX, imgY, imgW, imgH, 28);
      ctx.stroke();
    }

    // Left Side: Explanation Panel
    const panelX = 100;
    const panelY = 160;
    const panelW = 600;
    const panelH = 680;

    ctx.fillStyle = '#161617';
    this.roundRect(ctx, panelX, panelY, panelW, panelH, 28);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#2997ff';
    ctx.fillText('ULTRA-LUXURY COASTAL WATERFRONT', panelX + 44, panelY + 54);

    ctx.font = '600 36px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Rohan Marina One', panelX + 44, panelY + 104);

    ctx.font = '400 16px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    this.wrapText(ctx, "Direct Arabian Sea coastal frontage in Surathkal. Towering residences designed where 100% of apartments enjoy uninterrupted maritime horizon views.", panelX + 44, panelY + 145, 510, 24);

    // 3 Clean PropTech Pillars
    const features = [
      {
        title: '100% Sea-Horizon Visibility Simulation',
        desc: 'Buyers can verify exact sea-facing sightlines from any floor level prior to construction booking.'
      },
      {
        title: 'Coastal Wind Vector Analytics',
        desc: 'Simulates natural cross-ventilation corridors, calculating reduced seasonal air conditioning loads.'
      },
      {
        title: 'Instant NRI Remote Reservation',
        desc: 'Interactive 3D unit reservation pipeline built for Gulf and international Mangalorean diaspora.'
      }
    ];

    features.forEach((feat, idx) => {
      const fy = panelY + 260 + idx * 125;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      this.roundRect(ctx, panelX + 44, fy, 512, 105, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.stroke();

      ctx.font = '600 17px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(feat.title, panelX + 64, fy + 36);

      ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#86868b';
      this.wrapText(ctx, feat.desc, panelX + 64, fy + 62, 470, 18);
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 5: Rohan Square & Rohan Estate (1:15 - 1:35)                        */
  /* Clean side-by-side presentation using real photos                         */
  /* -------------------------------------------------------------------------- */
  renderSceneSquareEstate() {
    const ctx = this.ctx;
    const t = this.currentTime;
    const progress = (t - 115) / 20;

    ctx.textAlign = 'center';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#e2d5c3';
    ctx.fillText('COMPREHENSIVE ECOSYSTEM', 960, 120);

    ctx.font = '600 40px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Commercial Transit Hub & Hillside Plotted Sanctuary', 960, 172);

    const cardW = 820;
    const cardH = 580;
    const cardY = 230;

    // Left Card: Rohan Square (Pumpwell)
    const leftX = 100;
    ctx.fillStyle = '#161617';
    this.roundRect(ctx, leftX, cardY, cardW, cardH, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();

    if (this.assets.square.complete) {
      ctx.save();
      this.clipRoundedRect(ctx, leftX + 16, cardY + 16, cardW - 32, 320, 16);
      this.drawImageCover(ctx, this.assets.square, leftX + 16, cardY + 16, cardW - 32, 320, 0, 1.0 + progress * 0.03);
      ctx.restore();
    }

    ctx.textAlign = 'left';
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#30d158';
    ctx.fillText('READY TO MOVE IN • COMMERCIAL & RESIDENTIAL', leftX + 32, cardY + 380);

    ctx.font = '600 28px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Rohan Square', leftX + 32, cardY + 420);

    ctx.font = '400 15px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('Capitanio, Pumpwell, Mangalore • NH-66 Arterial Gateway', leftX + 32, cardY + 452);

    ctx.font = '400 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#d2d2d7';
    this.wrapText(ctx, 'Prime strategic highway connectivity with high-footfall executive suites, retail outlets, and ready-to-move-in luxury residences.', leftX + 32, cardY + 490, cardW - 64, 22);

    // Right Card: Rohan Estate (Neermarga Hills)
    const rightX = 1000;
    ctx.fillStyle = '#161617';
    this.roundRect(ctx, rightX, cardY, cardW, cardH, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();

    if (this.assets.estate.complete) {
      ctx.save();
      this.clipRoundedRect(ctx, rightX + 16, cardY + 16, cardW - 32, 320, 16);
      this.drawImageCover(ctx, this.assets.estate, rightX + 16, cardY + 16, cardW - 32, 320, 0, 1.0 + progress * 0.03);
      ctx.restore();
    }

    ctx.textAlign = 'left';
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#e2d5c3';
    ctx.fillText('LUSH GREENERY • PLOTTED COMMUNITY', rightX + 32, cardY + 380);

    ctx.font = '600 28px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Rohan Estate', rightX + 32, cardY + 420);

    ctx.font = '400 15px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('Neermarga Hills, Mangaluru • Plots Starts from 5.5 Cents', rightX + 32, cardY + 452);

    ctx.font = '400 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#d2d2d7';
    this.wrapText(ctx, 'Tranquil hillside development with asphalted boulevards, subsoil moisture telemetry, automated perimeter security, and serene green vistas.', rightX + 32, cardY + 490, cardW - 64, 22);
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 6: Executive Sign-off & Partnership Finale (1:35 - 2:30)             */
  /* Clean, authoritative boardroom close                                       */
  /* -------------------------------------------------------------------------- */
  renderSceneFinale() {
    const ctx = this.ctx;

    ctx.textAlign = 'center';
    ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#e2d5c3';
    ctx.fillText('OFFICIAL JOINT INITIATIVE', 960, 240);

    ctx.font = '700 64px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('The Future of Living Begins Today.', 960, 320);

    ctx.font = '400 22px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('Engineered to accelerate pre-sales velocity and empower NRI investors worldwide.', 960, 375);

    // Executive Signatories Card
    const signW = 1080;
    const signH = 220;
    const signX = (1920 - signW) / 2;
    const signY = 440;

    ctx.fillStyle = '#161617';
    this.roundRect(ctx, signX, signY, signW, signH, 28);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();

    // Left: HRL International
    ctx.textAlign = 'left';
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#0071e3';
    ctx.fillText('TECHNOLOGY PARTNER', signX + 60, signY + 54);

    ctx.font = '600 28px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Pavan Kumar Sadashiv', signX + 60, signY + 104);

    ctx.font = '400 15px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('HRL International Private Limited', signX + 60, signY + 140);
    ctx.fillText('Managing Director & AI Architect', signX + 60, signY + 168);

    // Center Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.moveTo(960, signY + 40);
    ctx.lineTo(960, signY + signH - 40);
    ctx.stroke();

    // Right: Rohan Corporation
    ctx.textAlign = 'left';
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#e2d5c3';
    ctx.fillText('REAL ESTATE CONGLOMERATE', 1020, signY + 54);

    ctx.font = '600 28px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Rohan Monteiro', 1020, signY + 104);

    ctx.font = '400 15px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('Rohan Corporation', 1020, signY + 140);
    ctx.fillText('Founder & Chairman', 1020, signY + 168);

    // Bottom Action / Next Step Pill
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0, 113, 227, 0.12)';
    this.roundRect(ctx, 640, 720, 640, 56, 28);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 113, 227, 0.35)';
    ctx.stroke();

    ctx.font = '500 16px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#2997ff';
    ctx.fillText('Phase 1 Pilot Sanction • Rohan City Drone & LiDAR Baseline Survey', 960, 755);
  }

  /* -------------------------------------------------------------------------- */
  /* Clean Header (Minimal, No Clutter)                                         */
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
  /* Geometry & Image Helper Methods                                            */
  /* -------------------------------------------------------------------------- */
  drawImageCover(ctx, img, x, y, width, height, radius = 0, scale = 1.0, panX = 0, panY = 0) {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const imgAspect = imgW / imgH;
    const frameAspect = width / height;

    let sW, sH, sX, sY;

    if (imgAspect > frameAspect) {
      sH = imgH / scale;
      sW = sH * frameAspect;
      sX = (imgW - sW) / 2 + panX;
      sY = (imgH - sH) / 2 + panY;
    } else {
      sW = imgW / scale;
      sH = sW / frameAspect;
      sX = (imgW - sW) / 2 + panX;
      sY = (imgH - sH) / 2 + panY;
    }

    sX = Math.max(0, Math.min(imgW - sW, sX));
    sY = Math.max(0, Math.min(imgH - sH, sY));

    ctx.drawImage(img, sX, sY, sW, sH, x, y, width, height);
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
    ctx.lineTo(x, y + radius);
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

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.videoEngine = new MasterMotionGraphicsEngine();
});
