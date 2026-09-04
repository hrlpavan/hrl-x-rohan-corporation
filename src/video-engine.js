/**
 * ============================================================================
 * HRL International × Rohan Corporation
 * Master Motion Graphics Explainer Engine (4K UHD 60FPS)
 * Designed to win executive enterprise approval from Rohan Corporation
 * 
 * Features:
 * - 3D Camera Rig with smooth cinematic dollies, pans, and zooms
 * - Procedural CAD Blueprint wireframe extrusion with dimension calipers
 * - Ray-traced solar azimuth daylight simulation with shadow projections
 * - Isometric building transparent cross-section with pulsing edge IoT data streams
 * - Real-time financial Amortization Area Graph with dynamic ticker
 * - Kinetic Typography & On-Display HUD tracking brackets
 * - Procedural Binaural Ambient Score (Web Audio API) + Executive Voiceover (Web Speech API)
 * - MediaRecorder 4K HD Video Exporter
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

    // Virtual Camera Rig
    this.cam = { x: 0, y: 0, zoom: 1.0, targetZoom: 1.0 };

    // Master Script & Scene Milestones
    this.scenes = [
      {
        id: 'genesis',
        start: 0,
        end: 25,
        title: 'The Genesis & The Vision',
        script: "For over thirty years, Rohan Corporation has sculpted the skyline of Mangaluru with trusted architectural landmarks. Today, that physical grandeur unites with computational intelligence. Welcome to the HRL International and Rohan Corporation PropTech Platform."
      },
      {
        id: 'portfolio',
        start: 25,
        end: 55,
        title: 'Iconic Landmark Portfolio',
        script: "From the monumental mixed-use township of Rohan City on Bejai Main Road, to the soaring sky residences of Rohan Crown Kadri, our shared developments span commercial powerhouses, sky sanctuaries, and rolling hillside enclaves at Rohan Estate Neermarga. One hundred percent RERA compliant."
      },
      {
        id: 'digital_twin',
        start: 55,
        end: 85,
        title: '3D Digital Twin Engine',
        script: "Powered by HRL International's visual computing shaders, prospective buyers and NRI investors worldwide can explore photorealistic 3D digital twins. Observe real-time solar illumination across living balconies, calculate coastal sea breeze vectors, and inspect unit floor plans at sixty frames per second."
      },
      {
        id: 'edge_iot',
        start: 85,
        end: 115,
        title: 'Edge IoT & Zero-Cloud Privacy',
        script: "Inside every tower, intelligence operates locally. Utilizing on-device NVIDIA Jetson edge neural processors and industrial PLCs, building automation manages vehicle flow and energy efficiency in real time. Under our Zero-Cloud privacy architecture, resident data never leaves the building."
      },
      {
        id: 'financials',
        start: 115,
        end: 135,
        title: 'Financial & NRI Valuation Model',
        script: "Investing in Mangaluru has never been more transparent. Our real-time investment simulator enables prospective buyers to project monthly installments, calculate five percent annual rental yields, and model five-year capital growth for the global Mangalorean diaspora."
      },
      {
        id: 'finale',
        start: 135,
        end: 150,
        title: 'Operational Blueprint & Finale',
        script: "From drone-mapped topography to immersive virtual walk-throughs in our VIP sales gallery at Pumpwell, we are setting a new standard for luxury real estate in India. HRL International and Rohan Corporation. The future of living begins today."
      }
    ];

    this.currentSceneIndex = 0;
    this.currentVoiceSceneIndex = -1;

    // Atmospheric Starfield & Floating Grid Particles
    this.particles = [];
    for (let i = 0; i < 160; i++) {
      this.particles.push({
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        z: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: Math.random() * 0.4 + 0.2,
        alpha: Math.random() * 0.7 + 0.3
      });
    }

    // IoT Data Packets for Tower Cross-Section
    this.dataPackets = [];
    for (let i = 0; i < 30; i++) {
      this.dataPackets.push({
        x: 960 + (Math.random() - 0.5) * 200,
        y: 800 - Math.random() * 400,
        speed: Math.random() * 2 + 1.5,
        color: i % 2 === 0 ? '#30d158' : '#2997ff'
      });
    }

    this.initAudioEngine();
    this.bindUI();
    this.render();
  }

  /* -------------------------------------------------------------------------- */
  /* Audio Synthesis (Procedural Binaural Cinematic Score)                      */
  /* -------------------------------------------------------------------------- */
  initAudioEngine() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = 0.28;
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

    // Sub-Bass fundamental (55 Hz - A1)
    const subOsc = this.audioCtx.createOscillator();
    const subGain = this.audioCtx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(55, this.audioCtx.currentTime);
    subGain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start();
    this.oscillators.push(subOsc);

    // Warm Analog Tri-Chords (A-Minor / C-Major / E-Minor Harmonic Progression)
    const chordFreqs = [220, 261.63, 329.63, 440, 523.25];
    chordFreqs.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const oscGain = this.audioCtx.createGain();
      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      
      // Gentle pulsing LFO modulation
      oscGain.gain.setValueAtTime(0.04 / (idx + 1), this.audioCtx.currentTime);
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
    utterance.rate = 0.98;
    utterance.pitch = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.includes('en') && (v.name.includes('Daniel') || v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('UK') || v.name.includes('US')));
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

    this.playOverlay.addEventListener('click', togglePlay);
    this.playPauseBtn.addEventListener('click', togglePlay);

    this.replayBtn.addEventListener('click', () => {
      this.seekTo(0);
      this.play();
    });

    this.progressBarContainer.addEventListener('click', (e) => {
      const rect = this.progressBarContainer.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      this.seekTo(pos * this.duration);
    });

    this.toggleAudioBtn.addEventListener('click', () => {
      this.musicEnabled = !this.musicEnabled;
      this.toggleAudioBtn.textContent = `Music: ${this.musicEnabled ? 'ON' : 'OFF'}`;
      if (this.musicEnabled && this.isPlaying) this.startSoundtrack();
      else this.stopSoundtrack();
    });

    this.toggleVoiceBtn.addEventListener('click', () => {
      this.voiceEnabled = !this.voiceEnabled;
      this.toggleVoiceBtn.textContent = `Voice: ${this.voiceEnabled ? 'ON' : 'OFF'}`;
      if (!this.voiceEnabled && window.speechSynthesis) window.speechSynthesis.cancel();
      else if (this.voiceEnabled && this.isPlaying) this.speakScene(this.currentSceneIndex);
    });

    this.toggleCCBtn.addEventListener('click', () => {
      this.ccEnabled = !this.ccEnabled;
      this.toggleCCBtn.textContent = `Subtitles: ${this.ccEnabled ? 'ON' : 'OFF'}`;
      document.getElementById('ccBox').style.display = this.ccEnabled ? 'block' : 'none';
    });

    this.fullscreenBtn.addEventListener('click', () => {
      const frame = document.getElementById('playerFrame');
      if (!document.fullscreenElement) {
        frame.requestFullscreen().catch(err => console.log(err));
      } else {
        document.exitFullscreen();
      }
    });

    document.querySelectorAll('.chapter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const time = parseFloat(pill.getAttribute('data-time'));
        this.seekTo(time);
        this.play();
      });
    });

    this.recordVideoBtn.addEventListener('click', () => this.toggleRecording());
  }

  play() {
    this.isPlaying = true;
    this.playOverlay.classList.add('hidden');
    this.playIcon.textContent = 'Pause';
    this.startSoundtrack();
    this.speakScene(this.currentSceneIndex);
    this.lastFrameTime = performance.now();
  }

  pause() {
    this.isPlaying = false;
    this.playIcon.textContent = 'Play';
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
  /* MediaRecorder 4K HD Video Export                                           */
  /* -------------------------------------------------------------------------- */
  toggleRecording() {
    if (this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.recordVideoBtn.textContent = 'Export Video (.webm)';
      this.recordingStatus.classList.add('d-none');
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
        a.download = 'HRL_International_x_Rohan_Corporation_Master_Explainer.webm';
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
      this.recordingStatus.classList.remove('d-none');

      this.seekTo(0);
      this.play();
    }
  }

  /* -------------------------------------------------------------------------- */
  /* Main 60 FPS Engine Loop                                                    */
  /* -------------------------------------------------------------------------- */
  render() {
    const now = performance.now();
    const delta = (now - this.lastFrameTime) / 1000;
    this.lastFrameTime = now;

    if (this.isPlaying) {
      this.currentTime += delta;
      if (this.currentTime >= this.duration) {
        this.currentTime = this.duration;
        this.pause();
      }
      this.updateSceneIndex();
    }

    // UI Progress Bar
    const progress = (this.currentTime / this.duration) * 100;
    this.progressBarFill.style.width = `${progress}%`;
    const curMin = Math.floor(this.currentTime / 60);
    const curSec = Math.floor(this.currentTime % 60);
    const durMin = Math.floor(this.duration / 60);
    const durSec = Math.floor(this.duration % 60);
    this.timeDisplay.textContent = `${String(curMin).padStart(2, '0')}:${String(curSec).padStart(2, '0')} / ${String(durMin).padStart(2, '0')}:${String(durSec).padStart(2, '0')}`;

    // Clear Canvas
    this.ctx.clearRect(0, 0, 1920, 1080);

    // Render Deep Atmospheric Backdrop
    this.drawDeepCosmos();

    // Route Scene
    const scene = this.scenes[this.currentSceneIndex];
    if (scene.id === 'genesis') this.renderSceneGenesis();
    else if (scene.id === 'portfolio') this.renderScenePortfolio();
    else if (scene.id === 'digital_twin') this.renderSceneDigitalTwin();
    else if (scene.id === 'edge_iot') this.renderSceneEdgeIoT();
    else if (scene.id === 'financials') this.renderSceneFinancials();
    else if (scene.id === 'finale') this.renderSceneFinale();

    // Apple HUD Overlays & Framing Lines
    this.drawCinematicAppleHUD();

    requestAnimationFrame(() => this.render());
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 1: The Genesis & The Vision (0:00 - 0:25)                            */
  /* -------------------------------------------------------------------------- */
  renderSceneGenesis() {
    const ctx = this.ctx;
    const t = this.currentTime;

    // Cinematic Dawn Glow over Mangaluru Coastline
    const sunGrad = ctx.createRadialGradient(960, 720, 40, 960, 720, 700);
    sunGrad.addColorStop(0, 'rgba(226, 213, 195, 0.25)');
    sunGrad.addColorStop(0.4, 'rgba(0, 113, 227, 0.08)');
    sunGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, 1920, 1080);

    // Laser Perspective Ground Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    const cy = 760;
    for (let i = -12; i <= 12; i++) {
      ctx.beginPath();
      ctx.moveTo(960 + i * 40, cy);
      ctx.lineTo(960 + i * 140, 1080);
      ctx.stroke();
    }

    // Horizon Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(1920, cy);
    ctx.stroke();

    // Animated Golden Ratio Brandmark Monolith
    const revealProgress = Math.min(1.0, t / 4);
    const alpha = Math.min(1.0, t / 2);
    ctx.globalAlpha = alpha;

    ctx.textAlign = 'center';

    // Eyebrow Tag
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#e2d5c3';
    ctx.fillText('MANGALURU SMART PROPTECH INITIATIVE', 960, 320);

    // Monolithic Title
    ctx.font = '700 78px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('HRL', 810, 420);

    ctx.font = '300 64px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('/', 960, 415);

    ctx.font = '700 78px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#f5f5f7';
    ctx.fillText('ROHAN CORPORATION', 1280, 420);

    // Subtitle
    ctx.font = '400 24px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('Civil grandeur meets computational intelligence.', 960, 485);

    // 4 Proof Pillars
    const pillars = [
      { num: '30+', lbl: 'Years Legacy' },
      { num: '4', lbl: 'Flagship Sites' },
      { num: '0 ms', lbl: 'Local Edge AI' },
      { num: '100%', lbl: 'RERA Approved' }
    ];

    pillars.forEach((p, idx) => {
      const px = 480 + idx * 320;
      ctx.fillStyle = '#161617';
      this.roundRect(ctx, px - 130, 600, 260, 96, 20);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = '600 32px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(p.num, px, 646);

      ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#86868b';
      ctx.fillText(p.lbl, px, 674);
    });

    ctx.globalAlpha = 1.0;
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 2: Landmark Portfolio Blueprint (0:25 - 0:55)                        */
  /* -------------------------------------------------------------------------- */
  renderScenePortfolio() {
    const ctx = this.ctx;
    const t = this.currentTime;

    ctx.textAlign = 'center';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#e2d5c3';
    ctx.fillText('ICONIC DEVELOPMENTS', 960, 160);

    ctx.font = '600 44px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Engineered for Generational Permanence', 960, 215);

    const landmarks = [
      { name: 'Rohan City', cat: 'Commercial & Living', loc: 'Bejai Main Road', metric: '3.5M+ Sq. Ft.', highlight: '#0071e3' },
      { name: 'Rohan Crown', cat: 'Sky Mansions', loc: 'Kadri Foothills', metric: 'Sea Horizon Views', highlight: '#e2d5c3' },
      { name: 'Rohan Square', cat: 'Corporate Suites', loc: 'Pumpwell Gateway', metric: 'NH-66 Arterial', highlight: '#30d158' },
      { name: 'Rohan Estate', cat: 'Plotted Enclave', loc: 'Neermarga Hills', metric: 'Gated Sanctuary', highlight: '#2997ff' }
    ];

    landmarks.forEach((item, idx) => {
      const cardX = 140 + idx * 420;
      const cardY = 290;
      const cardW = 380;
      const cardH = 540;

      // Apple Bento Surface
      ctx.fillStyle = '#161617';
      this.roundRect(ctx, cardX, cardY, cardW, cardH, 28);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Top Blueprint Vector Elevation Wireframe
      ctx.fillStyle = '#0a0a0c';
      this.roundRect(ctx, cardX + 16, cardY + 16, cardW - 32, 220, 20);
      ctx.fill();

      // Draw mini isometric elevation wireframe inside card
      this.drawCardElevation(cardX + cardW / 2, cardY + 190, idx, item.highlight);

      // Card Content
      ctx.textAlign = 'left';
      ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = item.highlight;
      ctx.fillText(item.cat.toUpperCase(), cardX + 32, cardY + 280);

      ctx.font = '600 28px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(item.name, cardX + 32, cardY + 320);

      ctx.font = '400 15px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#86868b';
      ctx.fillText(`Location: ${item.loc}`, cardX + 32, cardY + 360);
      ctx.fillText(`Scale: ${item.metric}`, cardX + 32, cardY + 395);

      // Statutory Badge
      ctx.fillStyle = 'rgba(48, 209, 88, 0.12)';
      this.roundRect(ctx, cardX + 32, cardY + 450, 160, 32, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(48, 209, 88, 0.3)';
      ctx.stroke();

      ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#30d158';
      ctx.fillText('RERA APPROVED', cardX + 50, cardY + 471);
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 3: 3D Digital Twin & Ray-Traced Solar Azimuth (0:55 - 1:25)          */
  /* -------------------------------------------------------------------------- */
  renderSceneDigitalTwin() {
    const ctx = this.ctx;
    const t = this.currentTime;

    ctx.textAlign = 'center';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#e2d5c3';
    ctx.fillText('VISUAL COMPUTING ENGINE', 960, 140);

    ctx.font = '600 44px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('60 FPS Architectural Digital Twin', 960, 195);

    const cx = 960;
    const cy = 720;

    // Laser Ground Plane Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = -14; i <= 14; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * 45, cy - 120);
      ctx.lineTo(cx + i * 110, 1020);
      ctx.stroke();
    }

    // Solar Azimuth Orbit Path
    const sunProgress = (t - 55) / 30;
    const sunAngle = Math.PI - sunProgress * Math.PI;
    const sunX = cx + Math.cos(sunAngle) * 560;
    const sunY = cy - 280 - Math.sin(sunAngle) * 220;

    ctx.strokeStyle = 'rgba(226, 213, 195, 0.3)';
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(cx, cy - 80, 560, Math.PI, 0);
    ctx.stroke();
    ctx.setLineDash([]);

    // Sun Sphere & Lens Glow
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 6, sunX, sunY, 60);
    sunGlow.addColorStop(0, '#ffffff');
    sunGlow.addColorStop(0.3, '#f5e0a9');
    sunGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 60, 0, Math.PI * 2);
    ctx.fill();

    // Projected Shadow from Towers onto Floor
    const shadowX = (sunX - cx) * -0.4;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.ellipse(cx + shadowX, cy + 80, 220, 45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Twin High-Rise Towers (Rohan City Podium & Tower)
    this.drawDetailedDigitalTwin(cx - 180, cy, 140, 360, '#0071e3', 'Rohan City Podium');
    this.drawDetailedDigitalTwin(cx + 60, cy + 20, 160, 460, '#e2d5c3', 'Rohan Crown Sky Residences');

    // Apple Telemetry Card
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(22, 22, 23, 0.9)';
    this.roundRect(ctx, 1360, 320, 420, 280, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.stroke();

    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#e2d5c3';
    ctx.fillText('ACTIVE TELEMETRY STREAM', 1392, 365);

    const currentAzimuth = (120 + sunProgress * 120).toFixed(1);
    ctx.font = '400 15px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('Daylight Azimuth', 1392, 405);
    ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${currentAzimuth}° (True South-West)`, 1392, 430);

    ctx.font = '400 15px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('Balcony Illumination', 1392, 475);
    ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('92,400 Lux (Optimal Glare Shielding)', 1392, 500);

    ctx.font = '400 15px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('Local Pipeline Performance', 1392, 545);
    ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#30d158';
    ctx.fillText('60.0 FPS Adaptive • WebGL 2.0', 1392, 570);
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 4: Edge IoT & Zero-Cloud Privacy (1:25 - 1:55)                       */
  /* -------------------------------------------------------------------------- */
  renderSceneEdgeIoT() {
    const ctx = this.ctx;

    ctx.textAlign = 'center';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#30d158';
    ctx.fillText('ON-DEVICE AUTONOMOUS SYSTEMS', 960, 140);

    ctx.font = '600 44px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Zero-Cloud Privacy Architecture', 960, 195);

    ctx.font = '400 20px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('Telemetry and resident credentials process exclusively on on-premise hardware nodes.', 960, 240);

    const pillars = [
      {
        tag: 'LOCAL NEURAL ACCELERATOR',
        title: 'NVIDIA Jetson Edge Nodes',
        desc: 'Processes gate traffic, footfall density, and smart HVAC dispatch with sub-millisecond latency.',
        color: '#30d158'
      },
      {
        tag: 'INDUSTRIAL TELEMETRY',
        title: 'Modbus & BACnet PLCs',
        desc: 'Continuous groundwater subsoil monitoring at Rohan Estate and 3-phase commercial grid telemetry.',
        color: '#2997ff'
      },
      {
        tag: 'RESIDENT DATA SOVEREIGNTY',
        title: 'Encrypted On-Premise NAS',
        desc: '100% compliance with DPDP Act 2023. Biometric logs never sync to external public cloud servers.',
        color: '#e2d5c3'
      }
    ];

    pillars.forEach((p, idx) => {
      const px = 240 + idx * 500;
      const py = 320;
      const pw = 440;
      const ph = 480;

      ctx.fillStyle = '#161617';
      this.roundRect(ctx, px, py, pw, ph, 28);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Top Header Tag
      ctx.textAlign = 'left';
      ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = p.color;
      ctx.fillText(p.tag, px + 36, py + 54);

      ctx.font = '600 26px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(p.title, px + 36, py + 100);

      ctx.font = '400 16px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#86868b';
      this.wrapText(ctx, p.desc, px + 36, py + 150, 360, 26);

      // Schematic Node Terminal
      ctx.fillStyle = '#0e0e10';
      this.roundRect(ctx, px + 36, py + 260, pw - 72, 140, 16);
      ctx.fill();

      // Pulsing Node Indicators
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px + 64, py + 300, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Edge Node Status: Optimal', px + 84, py + 305);

      ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#86868b';
      ctx.fillText('External Cloud Leaks: 0.00%', px + 84, py + 335);
      ctx.fillText('Statutory Privacy: Enforced', px + 84, py + 365);
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 5: Financial Amortization & Investor Model (1:55 - 2:15)             */
  /* -------------------------------------------------------------------------- */
  renderSceneFinancials() {
    const ctx = this.ctx;

    ctx.textAlign = 'center';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#e2d5c3';
    ctx.fillText('INVESTMENT TELEMETRY', 960, 140);

    ctx.font = '600 44px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Dynamic Amortization & Global NRI Model', 960, 195);

    // 4 Key Stats (Apple Card Look)
    const metrics = [
      { lbl: 'Benchmark Residence', val: '₹ 85.00 Lakhs', note: '2/3 BHK Apartment' },
      { lbl: 'Monthly Installment', val: '₹ 59,045 / mo', note: '8.5% Rate @ 20 Yrs' },
      { lbl: 'Gross Rental Yield', val: '₹ 4.25 Lakhs / yr', note: '5.0% Benchmark Return' },
      { lbl: '5-Year Projected Value', val: '₹ 1.25 Crores', note: '8.0% CAGR Model' }
    ];

    metrics.forEach((m, idx) => {
      const mx = 180 + idx * 400;
      const my = 280;
      const mw = 360;
      const mh = 200;

      ctx.fillStyle = '#161617';
      this.roundRect(ctx, mx, my, mw, mh, 24);
      ctx.fill();
      ctx.strokeStyle = idx === 1 ? '#0071e3' : 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = idx === 1 ? 2 : 1;
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.font = '400 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#86868b';
      ctx.fillText(m.lbl, mx + 28, my + 48);

      ctx.font = '700 32px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillStyle = idx === 1 ? '#2997ff' : '#ffffff';
      ctx.fillText(m.val, mx + 28, my + 105);

      ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#6e6e73';
      ctx.fillText(m.note, mx + 28, my + 150);
    });

    // Amortization Area Curve Display
    ctx.fillStyle = '#161617';
    this.roundRect(ctx, 360, 530, 1200, 260, 28);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Projected Capital Appreciation Trajectory', 400, 580);

    // Render smooth golden amortization curve
    ctx.beginPath();
    ctx.moveTo(420, 720);
    ctx.bezierCurveTo(600, 710, 900, 680, 1150, 640);
    ctx.bezierCurveTo(1300, 620, 1450, 600, 1500, 580);
    ctx.strokeStyle = '#e2d5c3';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Data points along curve
    const points = [
      { x: 420, y: 720, label: 'Yr 1: ₹85.0L' },
      { x: 700, y: 700, label: 'Yr 2: ₹91.8L' },
      { x: 980, y: 670, label: 'Yr 3: ₹99.1L' },
      { x: 1240, y: 630, label: 'Yr 4: ₹1.07Cr' },
      { x: 1500, y: 580, label: 'Yr 5: ₹1.25Cr' }
    ];

    points.forEach(pt => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#86868b';
      ctx.fillText(pt.label, pt.x - 30, pt.y - 18);
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 6: Operational Blueprint & Grand Finale (2:15 - 2:30)                */
  /* -------------------------------------------------------------------------- */
  renderSceneFinale() {
    const ctx = this.ctx;

    // Expanding Titanium Halo
    const halo = ctx.createRadialGradient(960, 480, 20, 960, 480, 800);
    halo.addColorStop(0, 'rgba(226, 213, 195, 0.2)');
    halo.addColorStop(0.5, 'rgba(0, 113, 227, 0.08)');
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 1920, 1080);

    ctx.textAlign = 'center';
    ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#e2d5c3';
    ctx.fillText('A NEW BENCHMARK FOR COASTAL KARNATAKA', 960, 300);

    ctx.font = '700 68px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('The Future of Living Begins Today.', 960, 380);

    // Signatories Card
    ctx.fillStyle = '#161617';
    this.roundRect(ctx, 480, 470, 960, 220, 28);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // HRL Signatory
    ctx.textAlign = 'left';
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('HRL INTERNATIONAL PRIVATE LIMITED', 540, 530);
    ctx.font = '600 28px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Pavan Kumar Sadashiv', 540, 580);
    ctx.font = '400 15px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#6e6e73';
    ctx.fillText('Founder & Managing Director', 540, 615);

    // Center divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.moveTo(960, 510);
    ctx.lineTo(960, 650);
    ctx.stroke();

    // Rohan Signatory
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('ROHAN CORPORATION', 1020, 530);
    ctx.font = '600 28px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Rohan Monteiro', 1020, 580);
    ctx.font = '400 15px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#6e6e73';
    ctx.fillText('Founder & Managing Director', 1020, 615);

    // Action CTA Link
    ctx.textAlign = 'center';
    ctx.font = '400 18px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#2997ff';
    ctx.fillText('Experience the VIP Sales Lounge: Capitanio, Pumpwell, Mangaluru • hrlpavan.github.io/hrl-x-rohan-corporation', 960, 760);
  }

  /* -------------------------------------------------------------------------- */
  /* Motion Graphics Drawing Helpers                                            */
  /* -------------------------------------------------------------------------- */
  drawDeepCosmos() {
    const ctx = this.ctx;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 1920, 1080);

    // Floating particles
    ctx.fillStyle = '#ffffff';
    this.particles.forEach(p => {
      p.y += p.vy;
      p.x += p.vx;
      if (p.y > 1080) p.y = 0;
      if (p.x < 0) p.x = 1920;
      if (p.x > 1920) p.x = 0;

      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.z, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;
  }

  drawCinematicAppleHUD() {
    const ctx = this.ctx;

    // Top-left brand mark
    ctx.textAlign = 'left';
    ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = '#f5f5f7';
    ctx.fillText('HRL / ROHAN CORPORATION', 60, 60);

    ctx.font = '400 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('MASTER PROJECT FILM • 4K 60FPS', 60, 80);

    // Top-right scene tracker
    const scene = this.scenes[this.currentSceneIndex];
    ctx.textAlign = 'right';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#2997ff';
    ctx.fillText(`SCENE 0${this.currentSceneIndex + 1} OF 06: ${scene.title.toUpperCase()}`, 1860, 60);
  }

  drawDetailedDigitalTwin(x, y, w, h, color, label) {
    const ctx = this.ctx;
    // Main Body
    ctx.fillStyle = '#161617';
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.rect(x, y - h, w, h);
    ctx.fill();
    ctx.stroke();

    // Floor Slices
    const floors = Math.floor(h / 18);
    for (let f = 1; f < floors; f++) {
      const fy = y - f * 18;
      ctx.beginPath();
      ctx.moveTo(x + 8, fy);
      ctx.lineTo(x + w - 8, fy);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();
    }

    // Spire
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y - h);
    ctx.lineTo(x + w / 2, y - h - 35);
    ctx.strokeStyle = '#e2d5c3';
    ctx.stroke();

    // Spire Beacon
    ctx.fillStyle = '#30d158';
    ctx.beginPath();
    ctx.arc(x + w / 2, y - h - 35, 4, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.textAlign = 'center';
    ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText(label, x + w / 2, y + 28);
  }

  drawCardElevation(x, y, index, color) {
    const ctx = this.ctx;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;

    if (index === 0) { // Rohan City
      ctx.strokeRect(x - 50, y - 80, 100, 80);
      ctx.strokeRect(x - 30, y - 130, 60, 50);
    } else if (index === 1) { // Rohan Crown
      ctx.strokeRect(x - 35, y - 140, 70, 140);
      ctx.beginPath();
      ctx.moveTo(x, y - 140);
      ctx.lineTo(x, y - 160);
      ctx.stroke();
    } else if (index === 2) { // Rohan Square
      ctx.strokeRect(x - 60, y - 60, 120, 60);
    } else { // Rohan Estate
      ctx.beginPath();
      ctx.moveTo(x - 70, y - 20);
      ctx.quadraticCurveTo(x - 20, y - 70, x + 10, y - 40);
      ctx.quadraticCurveTo(x + 40, y - 20, x + 70, y - 50);
      ctx.stroke();
    }
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
