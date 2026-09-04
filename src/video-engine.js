/**
 * HRL International × Rohan Corporation
 * 4K 60FPS Cinematic Explainer Video Engine
 * Features: Procedural Web Audio Soundtrack, Web Speech Voiceover,
 * Canvas 2D/3D Motion Graphics, Real-time Subtitles, & MediaRecorder Video Export.
 */

class CinematicVideoEngine {
  constructor() {
    this.canvas = document.getElementById('videoCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.duration = 150; // 2 minutes 30 seconds (150 seconds total)
    this.currentTime = 0;
    this.isPlaying = false;
    this.musicEnabled = true;
    this.voiceEnabled = true;
    this.ccEnabled = true;
    this.isRecording = false;
    this.lastFrameTime = performance.now();

    // Scene Definitions (Timeline in seconds)
    this.scenes = [
      {
        id: 'genesis',
        start: 0,
        end: 25,
        title: 'The Genesis & The Vision',
        script: "For over thirty years, Rohan Corporation has sculpted the skyline of Mangaluru with trusted architectural landmarks. Today, physical grandeur unites with computational intelligence. Welcome to the HRL International and Rohan Corporation PropTech Platform."
      },
      {
        id: 'portfolio',
        start: 25,
        end: 55,
        title: 'Iconic Landmark Portfolio',
        script: "From the monumental mixed-use township of Rohan City on Bejai Main Road, to the soaring sky residences of Rohan Crown Kadri, our developments span commercial powerhouses, sky sanctuaries, and rolling hillside enclaves at Rohan Estate Neermarga. One hundred percent RERA compliant."
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

    // Stars/Particles for animated cosmos
    this.particles = [];
    for (let i = 0; i < 120; i++) {
      this.particles.push({
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.4 + 0.1,
        alpha: Math.random() * 0.8 + 0.2
      });
    }

    this.initAudioEngine();
    this.bindUI();
    this.render();
  }

  /* -------------------------------------------------------------------------- */
  /* Audio Synthesis (Pure Web Audio API Soundtrack)                            */
  /* -------------------------------------------------------------------------- */
  initAudioEngine() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = 0.25;
      this.gainNode.connect(this.audioCtx.destination);
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  startSoundtrack() {
    if (!this.audioCtx || !this.musicEnabled) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    // Play subtle chord sequence (A-minor: A3, C4, E4, G4)
    this.stopSoundtrack();
    this.oscillators = [];
    const baseFreqs = [220, 261.63, 329.63, 392.00];

    baseFreqs.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const oscGain = this.audioCtx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      oscGain.gain.setValueAtTime(0.08 / (idx + 1), this.audioCtx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(this.gainNode);
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
  /* Voice Narration (Web Speech API)                                           */
  /* -------------------------------------------------------------------------- */
  speakScene(sceneIndex) {
    if (!this.voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const scene = this.scenes[sceneIndex];
    if (!scene) return;

    const utterance = new SpeechSynthesisUtterance(scene.script);
    utterance.rate = 0.98;
    utterance.pitch = 0.95;

    // Pick executive international voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.includes('en') && (v.name.includes('Daniel') || v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('UK') || v.name.includes('US')));
    if (preferred) utterance.voice = preferred;

    window.speechSynthesis.speak(utterance);
    this.currentVoiceSceneIndex = sceneIndex;
  }

  /* -------------------------------------------------------------------------- */
  /* UI Binding & Control Listeners                                             */
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
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    };

    this.playOverlay.addEventListener('click', togglePlay);
    this.playPauseBtn.addEventListener('click', togglePlay);

    this.replayBtn.addEventListener('click', () => {
      this.seekTo(0);
      this.play();
    });

    // Seek bar click
    this.progressBarContainer.addEventListener('click', (e) => {
      const rect = this.progressBarContainer.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      this.seekTo(pos * this.duration);
    });

    // Audio & Voice toggles
    this.toggleAudioBtn.addEventListener('click', () => {
      this.musicEnabled = !this.musicEnabled;
      this.toggleAudioBtn.textContent = `🎵 Music: ${this.musicEnabled ? 'ON' : 'OFF'}`;
      if (this.musicEnabled && this.isPlaying) {
        this.startSoundtrack();
      } else {
        this.stopSoundtrack();
      }
    });

    this.toggleVoiceBtn.addEventListener('click', () => {
      this.voiceEnabled = !this.voiceEnabled;
      this.toggleVoiceBtn.textContent = `🎙️ Voice: ${this.voiceEnabled ? 'ON' : 'OFF'}`;
      if (!this.voiceEnabled && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      } else if (this.voiceEnabled && this.isPlaying) {
        this.speakScene(this.currentSceneIndex);
      }
    });

    this.toggleCCBtn.addEventListener('click', () => {
      this.ccEnabled = !this.ccEnabled;
      this.toggleCCBtn.textContent = `💬 CC: ${this.ccEnabled ? 'ON' : 'OFF'}`;
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

    // Chapter buttons
    document.querySelectorAll('.chapter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const time = parseFloat(pill.getAttribute('data-time'));
        this.seekTo(time);
        this.play();
      });
    });

    // Video Recording Feature
    this.recordVideoBtn.addEventListener('click', () => this.toggleRecording());
  }

  play() {
    this.isPlaying = true;
    this.playOverlay.classList.add('hidden');
    this.playIcon.textContent = '⏸';
    this.startSoundtrack();
    this.speakScene(this.currentSceneIndex);
    this.lastFrameTime = performance.now();
  }

  pause() {
    this.isPlaying = false;
    this.playIcon.textContent = '▶';
    this.stopSoundtrack();
    if (window.speechSynthesis) window.speechSynthesis.pause();
  }

  seekTo(seconds) {
    this.currentTime = Math.max(0, Math.min(this.duration, seconds));
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

      // Update chapter pills
      document.querySelectorAll('.chapter-pill').forEach((pill, i) => {
        if (i === newIdx) pill.classList.add('active');
        else pill.classList.remove('active');
      });
    }

    // Update Subtitles
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
      this.recordVideoBtn.textContent = '🎥 Record & Export Video (.webm)';
      this.recordVideoBtn.classList.remove('btn-outline');
      this.recordVideoBtn.classList.add('btn-gold');
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
        a.download = 'HRL_International_x_Rohan_Corporation_Explainer.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      this.recordVideoBtn.textContent = '⏹ Stop & Download Video';
      this.recordVideoBtn.classList.remove('btn-gold');
      this.recordVideoBtn.classList.add('btn-outline');
      this.recordingStatus.classList.remove('d-none');

      // Restart from beginning for a clean capture
      this.seekTo(0);
      this.play();
    }
  }

  /* -------------------------------------------------------------------------- */
  /* Main 60 FPS Render Loop                                                    */
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

    // Update Progress Bar & Time
    const progress = (this.currentTime / this.duration) * 100;
    this.progressBarFill.style.width = `${progress}%`;
    const curMin = Math.floor(this.currentTime / 60);
    const curSec = Math.floor(this.currentTime % 60);
    const durMin = Math.floor(this.duration / 60);
    const durSec = Math.floor(this.duration % 60);
    this.timeDisplay.textContent = `${String(curMin).padStart(2, '0')}:${String(curSec).padStart(2, '0')} / ${String(durMin).padStart(2, '0')}:${String(durSec).padStart(2, '0')}`;

    // Clear Canvas
    this.ctx.clearRect(0, 0, 1920, 1080);

    // Draw Background & Starfield
    this.drawCosmos();

    // Route to Scene Renderer
    const scene = this.scenes[this.currentSceneIndex];
    if (scene.id === 'genesis') this.renderSceneGenesis();
    else if (scene.id === 'portfolio') this.renderScenePortfolio();
    else if (scene.id === 'digital_twin') this.renderSceneDigitalTwin();
    else if (scene.id === 'edge_iot') this.renderSceneEdgeIoT();
    else if (scene.id === 'financials') this.renderSceneFinancials();
    else if (scene.id === 'finale') this.renderSceneFinale();

    // Draw Top Cinematic HUD Badge
    this.drawCinematicHUD();

    requestAnimationFrame(() => this.render());
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 1: The Genesis & The Vision (0:00 - 0:25)                            */
  /* -------------------------------------------------------------------------- */
  renderSceneGenesis() {
    const ctx = this.ctx;
    const t = this.currentTime;

    // Glowing Sunrise over Mangaluru Coastline
    const sunGrad = ctx.createRadialGradient(960, 680, 20, 960, 680, 600);
    sunGrad.addColorStop(0, 'rgba(212, 175, 55, 0.35)');
    sunGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.1)');
    sunGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, 1920, 1080);

    // Coastal horizon line
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 720);
    ctx.lineTo(1920, 720);
    ctx.stroke();

    // Converging Logos
    const logoY = 400 + Math.sin(t * 1.5) * 8;
    ctx.textAlign = 'center';

    // Badge Pill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    this.roundRect(ctx, 960 - 240, logoY - 140, 480, 44, 22);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.stroke();

    ctx.font = '600 18px "Plus Jakarta Sans"';
    ctx.fillStyle = '#d4af37';
    ctx.fillText('MANGALURU SMART PROPTECH INITIATIVE • 2026', 960, logoY - 112);

    // Dual Brand Display
    ctx.font = '800 68px "Outfit"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('HRL™', 760, logoY);

    ctx.fillStyle = '#d4af37';
    ctx.fillText('×', 890, logoY);

    ctx.fillStyle = '#f3e5ab';
    ctx.fillText('ROHAN CORPORATION', 1190, logoY);

    // Main Tagline
    ctx.font = '500 28px "Plus Jakarta Sans"';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('Bridging Architectural Grandeur with Computational Intelligence', 960, logoY + 70);

    // Legacy Pillars Strip
    const pillars = ['30+ Years Construction Legacy', '4 Master Developments', 'Zero-Cloud On-Device AI', '100% RERA Compliant'];
    pillars.forEach((p, idx) => {
      const px = 420 + idx * 280;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      this.roundRect(ctx, px - 120, 800, 240, 54, 12);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();

      ctx.font = '600 15px "Plus Jakarta Sans"';
      ctx.fillStyle = '#f3f4f6';
      ctx.fillText(p, px, 832);
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 2: Landmark Portfolio Showcase (0:25 - 0:55)                         */
  /* -------------------------------------------------------------------------- */
  renderScenePortfolio() {
    const ctx = this.ctx;
    const landmarks = [
      { name: 'Rohan City', cat: 'Mega Commercial & Living', loc: 'Bejai Main Road', spec: 'Over 3.5M Sq. Ft. Complex', color: '#38bdf8' },
      { name: 'Rohan Crown', cat: 'Ultra-Luxury Sky Mansions', loc: 'Kadri Foothills', spec: 'Infinity Rooftop Pool & Sea Vista', color: '#d4af37' },
      { name: 'Rohan Square', cat: 'Corporate Transit Hub', loc: 'Capitanio / Pumpwell', spec: 'Grade-A Retail & Office Suites', color: '#10b981' },
      { name: 'Rohan Estate', cat: 'Panoramic Plotted Layout', loc: 'Neermarga Hills', spec: 'Gated Hillside Villa Sanctuary', color: '#a855f7' }
    ];

    ctx.textAlign = 'center';
    ctx.font = '600 46px var(--apple-font, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif)';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Iconic Rohan Corporation Landmarks', 960, 220);

    ctx.font = '400 20px var(--apple-font, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif)';
    ctx.fillStyle = '#86868b';
    ctx.fillText('Engineered for generational permanence, augmented with real-time digital twins.', 960, 265);

    // 4 Landmark Cards
    landmarks.forEach((item, idx) => {
      const cardX = 180 + idx * 400;
      const cardY = 340;
      const cardW = 360;
      const cardH = 460;

      // Card Background Glass
      ctx.fillStyle = '#161617';
      this.roundRect(ctx, cardX, cardY, cardW, cardH, 24);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Card Visual Banner
      const bannerGrad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + 160);
      bannerGrad.addColorStop(0, '#1c1c1e');
      bannerGrad.addColorStop(1, '#0e0e10');
      ctx.fillStyle = bannerGrad;
      this.roundRect(ctx, cardX, cardY, cardW, 160, 24);
      ctx.fill();

      // Card Title & Badges
      ctx.textAlign = 'left';
      ctx.font = '600 26px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(item.name, cardX + 24, cardY + 220);

      ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = item.color;
      ctx.fillText(item.cat.toUpperCase(), cardX + 24, cardY + 250);

      ctx.font = '400 15px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#86868b';
      ctx.fillText(item.loc, cardX + 24, cardY + 290);
      ctx.fillText(item.spec, cardX + 24, cardY + 330);

      // RERA Badge
      ctx.fillStyle = 'rgba(48, 209, 88, 0.15)';
      this.roundRect(ctx, cardX + 24, cardY + 380, 180, 34, 17);
      ctx.fill();
      ctx.strokeStyle = 'rgba(48, 209, 88, 0.3)';
      ctx.stroke();

      ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#30d158';
      ctx.fillText('RERA SANCTIONED', cardX + 38, cardY + 402);
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 3: 3D Digital Twin Engine (0:55 - 1:25)                              */
  /* -------------------------------------------------------------------------- */
  renderSceneDigitalTwin() {
    const ctx = this.ctx;
    const t = this.currentTime;

    ctx.textAlign = 'center';
    ctx.font = '700 46px "Outfit"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Real-Time Architectural Digital Twin Engine', 960, 180);

    ctx.font = '400 22px "Plus Jakarta Sans"';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('Photorealistic solar daylight azimuth & floor plan telemetry at 60 FPS.', 960, 225);

    // Center Isometric Digital Twin Towers
    const cx = 960;
    const cy = 680;

    // Ground Grid
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * 50, cy - 80);
      ctx.lineTo(cx + i * 90, cy + 220);
      ctx.stroke();
    }

    // Solar Path Arc
    const sunAngle = ((t - 55) / 30) * Math.PI;
    const sunX = cx + Math.cos(sunAngle) * 450;
    const sunY = cy - 250 - Math.sin(sunAngle) * 180;

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.arc(cx, cy - 100, 450, Math.PI, 0);
    ctx.stroke();
    ctx.setLineDash([]);

    // Glowing Sun
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, 40);
    sunGlow.addColorStop(0, '#fef08a');
    sunGlow.addColorStop(0.5, '#f59e0b');
    sunGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 40, 0, Math.PI * 2);
    ctx.fill();

    // 3D Towers
    this.drawIsometricTower(cx - 150, cy, 110, 320, '#38bdf8', 'Rohan City Commercial');
    this.drawIsometricTower(cx + 40, cy + 20, 130, 420, '#d4af37', 'Rohan Crown Sky Tower');

    // Telemetry Box
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(8, 9, 13, 0.85)';
    this.roundRect(ctx, 1380, 400, 380, 240, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.stroke();

    ctx.font = '700 18px "Outfit"';
    ctx.fillStyle = '#d4af37';
    ctx.fillText('LIVE TELEMETRY HUD', 1410, 440);

    ctx.font = '400 16px monospace';
    ctx.fillStyle = '#f3f4f6';
    ctx.fillText(`• Solar Azimuth: ${(145 + Math.sin(t) * 20).toFixed(1)}°`, 1410, 480);
    ctx.fillText('• Balcony Lux: 92,400 lx (Peak)', 1410, 515);
    ctx.fillText('• Sea Breeze: 14 kts (W-SW)', 1410, 550);
    ctx.fillText('• WebGL Render: 60.0 FPS', 1410, 585);
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 4: Edge IoT & Zero-Cloud Privacy (1:25 - 1:55)                       */
  /* -------------------------------------------------------------------------- */
  renderSceneEdgeIoT() {
    const ctx = this.ctx;

    ctx.textAlign = 'center';
    ctx.font = '700 46px "Outfit"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Autonomous Building AI & Zero-Cloud Privacy', 960, 180);

    ctx.font = '400 22px "Plus Jakarta Sans"';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('On-device neural inference guarantees resident data never leaves the building.', 960, 225);

    // 3 Central Hardware Pillars
    const nodes = [
      { title: 'NVIDIA Jetson Edge Nodes', desc: 'Real-time vehicle flow, parking occupancy, and HVAC demand response.', tag: 'NEURAL ACCELERATION', color: '#30d158' },
      { title: 'Industrial DIN-Rail PLCs', desc: 'Subsoil moisture telemetry at Rohan Estate and 3-phase microgrid metering.', tag: 'MODBUS / BACNET', color: '#2997ff' },
      { title: 'Encrypted Edge Storage', desc: 'On-premise resident data sovereignty fully compliant with DPDP Act 2023.', tag: 'ZERO-CLOUD PRIVACY', color: '#e2d5c3' }
    ];

    nodes.forEach((node, idx) => {
      const nx = 260 + idx * 480;
      const ny = 340;
      const nw = 440;
      const nh = 420;

      ctx.fillStyle = '#161617';
      this.roundRect(ctx, nx, ny, nw, nh, 24);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Eyebrow tag
      ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = node.color;
      ctx.fillText(node.tag, nx + 220, ny + 90);

      ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(node.title, nx + 220, ny + 150);

      ctx.font = '400 16px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = '#86868b';
      this.wrapText(ctx, node.desc, nx + 220, ny + 210, 360, 26);

      // Status Pill
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      this.roundRect(ctx, nx + 120, ny + 340, 200, 34, 17);
      ctx.fill();
      ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
      ctx.fillStyle = node.color;
      ctx.fillText('HARDWARE ACTIVE', nx + 220, ny + 362);
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 5: Financial Amortization & NRI Model (1:55 - 2:15)                  */
  /* -------------------------------------------------------------------------- */
  renderSceneFinancials() {
    const ctx = this.ctx;

    ctx.textAlign = 'center';
    ctx.font = '700 46px "Outfit"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Frictionless Financial Intelligence & NRI Model', 960, 180);

    ctx.font = '400 22px "Plus Jakarta Sans"';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('Dynamic loan amortization, 5% annual rental yield, and transparent RERA metrics.', 960, 225);

    // Financial Metric Boxes
    const metrics = [
      { label: 'Benchmark Luxury Unit', val: '₹ 85.00 Lakhs', sub: 'Standard 2/3 BHK Apartment' },
      { label: 'Estimated Monthly EMI', val: '₹ 59,045 / mo', sub: '8.5% Interest Rate @ 20 Yrs' },
      { label: 'Projected Annual Rental Yield', val: '₹ 4.25 Lakhs / yr', sub: '5.0% Gross Yield Benchmark' },
      { label: '5-Year Capital Valuation', val: '₹ 1.25 Crores', sub: '8.0% CAGR Growth Model' }
    ];

    metrics.forEach((m, idx) => {
      const mx = 200 + idx * 390;
      const my = 320;
      const mw = 360;
      const mh = 220;

      ctx.fillStyle = 'rgba(22, 25, 37, 0.85)';
      this.roundRect(ctx, mx, my, mw, mh, 16);
      ctx.fill();
      ctx.strokeStyle = idx === 1 ? '#d4af37' : 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = idx === 1 ? 2 : 1;
      ctx.stroke();

      ctx.font = '600 16px "Plus Jakarta Sans"';
      ctx.fillStyle = '#9ca3af';
      ctx.fillText(m.label, mx + 180, my + 50);

      ctx.font = '800 32px "Outfit"';
      ctx.fillStyle = idx === 1 ? '#d4af37' : '#ffffff';
      ctx.fillText(m.val, mx + 180, my + 115);

      ctx.font = '400 14px "Plus Jakarta Sans"';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(m.sub, mx + 180, my + 165);
    });

    // Amortization Visual Bar
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    this.roundRect(ctx, 360, 600, 1200, 180, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = '700 20px "Outfit"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Projected Capital Growth Trajectory (Mangaluru Real Estate Index)', 400, 645);

    // Bar comparisons
    const years = ['Year 1: ₹85.0 L', 'Year 2: ₹91.8 L', 'Year 3: ₹99.1 L', 'Year 4: ₹1.07 Cr', 'Year 5: ₹1.25 Cr'];
    years.forEach((yr, i) => {
      const barX = 400 + i * 230;
      const barH = 30 + i * 15;
      ctx.fillStyle = '#d4af37';
      this.roundRect(ctx, barX, 740 - barH, 180, barH, 6);
      ctx.fill();

      ctx.font = '600 14px monospace';
      ctx.fillStyle = '#f3f4f6';
      ctx.fillText(yr, barX + 10, 770);
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Scene 6: Operational Blueprint & Grand Finale (2:15 - 2:30)                */
  /* -------------------------------------------------------------------------- */
  renderSceneFinale() {
    const ctx = this.ctx;
    const t = this.currentTime;

    // Expanding Gold Rays
    const rayGrad = ctx.createRadialGradient(960, 500, 50, 960, 500, 750);
    rayGrad.addColorStop(0, 'rgba(212, 175, 55, 0.25)');
    rayGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.08)');
    rayGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = rayGrad;
    ctx.fillRect(0, 0, 1920, 1080);

    ctx.textAlign = 'center';
    ctx.font = '800 60px "Outfit"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('The Future of Living Begins Today', 960, 360);

    ctx.font = '500 26px "Plus Jakarta Sans"';
    ctx.fillStyle = '#d4af37';
    ctx.fillText('HRL International × Rohan Corporation Joint Platform', 960, 420);

    // Signatories Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    this.roundRect(ctx, 480, 500, 960, 220, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.stroke();

    ctx.textAlign = 'center';
    // HRL Signatory
    ctx.font = '600 16px "Plus Jakarta Sans"';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('HRL INTERNATIONAL PRIVATE LIMITED', 700, 560);
    ctx.font = '800 28px "Outfit"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Pavan Kumar Sadashiv', 700, 610);
    ctx.font = '400 16px "Plus Jakarta Sans"';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('Founder & Managing Director', 700, 650);

    // Divider
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.beginPath();
    ctx.moveTo(960, 540);
    ctx.lineTo(960, 680);
    ctx.stroke();

    // Rohan Signatory
    ctx.font = '600 16px "Plus Jakarta Sans"';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('ROHAN CORPORATION', 1220, 560);
    ctx.font = '800 28px "Outfit"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Rohan Monteiro', 1220, 610);
    ctx.font = '400 16px "Plus Jakarta Sans"';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('Founder & Managing Director', 1220, 650);

    // Action CTA Link
    ctx.font = '700 20px "Plus Jakarta Sans"';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Experience the VIP Sales Gallery: Pumpwell, Mangaluru • hrlpavan.github.io/hrl-x-rohan-corporation', 960, 800);
  }

  /* -------------------------------------------------------------------------- */
  /* Helper Graphics & Drawing Functions                                        */
  /* -------------------------------------------------------------------------- */
  drawCosmos() {
    const ctx = this.ctx;
    // Dark sky backdrop
    ctx.fillStyle = '#05060a';
    ctx.fillRect(0, 0, 1920, 1080);

    // Animated particles
    ctx.fillStyle = '#ffffff';
    this.particles.forEach(p => {
      p.y += p.speed;
      if (p.y > 1080) p.y = 0;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;
  }

  drawCinematicHUD() {
    const ctx = this.ctx;
    // Top Left Watermark
    ctx.textAlign = 'left';
    ctx.font = '800 18px "Outfit"';
    ctx.fillStyle = '#d4af37';
    ctx.fillText('HRL™ × ROHAN CORPORATION', 60, 60);

    ctx.font = '500 13px "Plus Jakarta Sans"';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('OFFICIAL PROPTECH MASTER EXPLAINER • 4K 60FPS', 60, 85);

    // Top Right Scene Tracker
    const scene = this.scenes[this.currentSceneIndex];
    ctx.textAlign = 'right';
    ctx.font = '700 15px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`SCENE 0${this.currentSceneIndex + 1}/06: ${scene.title.toUpperCase()}`, 1860, 60);
  }

  drawIsometricTower(x, y, w, h, color, label) {
    const ctx = this.ctx;
    // Front face
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.rect(x, y - h, w, h);
    ctx.fill();
    ctx.stroke();

    // Floor lines
    const floors = Math.floor(h / 18);
    for (let f = 1; f < floors; f++) {
      const fy = y - f * 18;
      ctx.beginPath();
      ctx.moveTo(x + 6, fy);
      ctx.lineTo(x + w - 6, fy);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.stroke();
    }

    // Spire beacon
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y - h);
    ctx.lineTo(x + w / 2, y - h - 30);
    ctx.strokeStyle = '#d4af37';
    ctx.stroke();

    // Beacon blink
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(x + w / 2, y - h - 30, 4, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.textAlign = 'center';
    ctx.font = '600 14px "Plus Jakarta Sans"';
    ctx.fillStyle = '#f3f4f6';
    ctx.fillText(label, x + w / 2, y + 30);
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

// Instantiate engine when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.videoEngine = new CinematicVideoEngine();
});
