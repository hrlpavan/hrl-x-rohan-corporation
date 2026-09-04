/**
 * HRL International × Rohan Corporation
 * Interactive PropTech Showcase & ROI Calculator Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initPropertyFilters();
  initCalculator();
  initCanvasSimulator();
  initModal();
  initBookingForm();
  initMobileMenu();
  initVentureSimulator();
  initVentureTabs();
});

/* -------------------------------------------------------------------------- */
/* 1. Property Filters                                                        */
/* -------------------------------------------------------------------------- */
function initPropertyFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.property-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 2. Smart ROI & Mortgage Calculator                                        */
/* -------------------------------------------------------------------------- */
function initCalculator() {
  const priceRange = document.getElementById('priceRange');
  const downRange = document.getElementById('downRange');
  const tenureRange = document.getElementById('tenureRange');
  const rateRange = document.getElementById('rateRange');

  const priceVal = document.getElementById('priceVal');
  const downVal = document.getElementById('downVal');
  const tenureVal = document.getElementById('tenureVal');
  const rateVal = document.getElementById('rateVal');

  const emiOutput = document.getElementById('emiOutput');
  const loanOutput = document.getElementById('loanOutput');
  const interestOutput = document.getElementById('interestOutput');
  const yieldOutput = document.getElementById('yieldOutput');
  const appreciationOutput = document.getElementById('appreciationOutput');

  function calculate() {
    const priceLakhs = parseFloat(priceRange.value);
    const downPercent = parseFloat(downRange.value);
    const tenureYears = parseInt(tenureRange.value, 10);
    const rateAnnual = parseFloat(rateRange.value);

    // Update labels
    priceVal.textContent = formatCurrency(priceLakhs * 100000);
    const downAmount = (priceLakhs * 100000) * (downPercent / 100);
    downVal.textContent = `${downPercent}% (${formatCurrency(downAmount)})`;
    tenureVal.textContent = `${tenureYears} Years`;
    rateVal.textContent = `${rateAnnual.toFixed(1)}%`;

    // Loan Amount
    const principal = (priceLakhs * 100000) - downAmount;
    const monthlyRate = (rateAnnual / 12) / 100;
    const totalMonths = tenureYears * 12;

    // EMI Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    let emi = 0;
    if (monthlyRate > 0) {
      emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      emi = principal / totalMonths;
    }

    const totalRepayable = emi * totalMonths;
    const totalInterest = totalRepayable - principal;

    // PropTech Metrics:
    // Avg coastal commercial/luxury rental yield ~ 4.5% - 5.5%
    const annualRentalYield = (priceLakhs * 100000) * 0.05;
    // Projected 5-year capital appreciation at 8% CAGR
    const fiveYearAppreciation = (priceLakhs * 100000) * Math.pow(1.08, 5);

    emiOutput.textContent = `₹ ${Math.round(emi).toLocaleString('en-IN')}`;
    loanOutput.textContent = formatCurrency(principal);
    interestOutput.textContent = formatCurrency(totalInterest);
    yieldOutput.textContent = formatCurrency(annualRentalYield);
    appreciationOutput.textContent = formatCurrency(fiveYearAppreciation);
  }

  function formatCurrency(amount) {
    if (amount >= 10000000) {
      return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹ ${(amount / 100000).toFixed(2)} Lakhs`;
    }
    return `₹ ${Math.round(amount).toLocaleString('en-IN')}`;
  }

  [priceRange, downRange, tenureRange, rateRange].forEach(input => {
    input.addEventListener('input', calculate);
  });

  calculate();
}

/* -------------------------------------------------------------------------- */
/* 3. Canvas 3D Digital Twin Visual Computing Engine                          */
/* -------------------------------------------------------------------------- */
function initCanvasSimulator() {
  const canvas = document.getElementById('twinCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const sunlightText = document.getElementById('sunlightText');

  const simDayBtn = document.getElementById('simDayBtn');
  const simSunsetBtn = document.getElementById('simSunsetBtn');
  const simNightBtn = document.getElementById('simNightBtn');

  let mode = 'day'; // day, sunset, night
  let rotAngle = 0.2;
  let mouseOffset = { x: 0, y: 0 };
  let targetMouse = { x: 0, y: 0 };
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = '60.0';

  // Interactive subtle parallax on mouse move
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    targetMouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    targetMouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  });

  canvas.addEventListener('mouseleave', () => {
    targetMouse.x = 0;
    targetMouse.y = 0;
  });

  function setMode(newMode) {
    mode = newMode;
    [simDayBtn, simSunsetBtn, simNightBtn].forEach(b => b.classList.remove('active'));
    if (mode === 'day') {
      simDayBtn.classList.add('active');
      if (sunlightText) sunlightText.textContent = 'Solar Azimuth: 145° (Midday Daylight • Balcony Lux Level: 92,000)';
    } else if (mode === 'sunset') {
      simSunsetBtn.classList.add('active');
      if (sunlightText) sunlightText.textContent = 'Golden Hour Azimuth: 260° (Sea Breeze Vector: 14 knots West)';
    } else if (mode === 'night') {
      simNightBtn.classList.add('active');
      if (sunlightText) sunlightText.textContent = 'Night Smart Grid: LED Facade Illumination & 38% Energy Savings';
    }
  }

  if (simDayBtn) simDayBtn.addEventListener('click', () => setMode('day'));
  if (simSunsetBtn) simSunsetBtn.addEventListener('click', () => setMode('sunset'));
  if (simNightBtn) simNightBtn.addEventListener('click', () => setMode('night'));

  // 3D Isometric Projection Helper
  function project(x, y, z, cx, cy) {
    const cos30 = 0.8660254;
    const sin30 = 0.5;
    const cosR = Math.cos(rotAngle + mouseOffset.x * 0.15);
    const sinR = Math.sin(rotAngle + mouseOffset.x * 0.15);

    const rx = x * cosR - y * sinR;
    const ry = x * sinR + y * cosR;

    const px = cx + (rx - ry) * cos30;
    const py = cy + (rx + ry) * sin30 - z + mouseOffset.y * 12;
    return { x: px, y: py };
  }

  // Draw an isometric 3D box with architectural lighting
  function drawIsoBlock(x, y, z, w, d, h, cx, cy, topColor, leftColor, rightColor, strokeColor) {
    const p000 = project(x, y, z, cx, cy);
    const p100 = project(x + w, y, z, cx, cy);
    const p110 = project(x + w, y + d, z, cx, cy);
    const p010 = project(x, y + d, z, cx, cy);

    const p001 = project(x, y, z + h, cx, cy);
    const p101 = project(x + w, y, z + h, cx, cy);
    const p111 = project(x + w, y + d, z + h, cx, cy);
    const p011 = project(x, y + d, z + h, cx, cy);

    ctx.lineWidth = 1;
    ctx.strokeStyle = strokeColor || 'rgba(223, 183, 108, 0.2)';

    // Left Face
    ctx.fillStyle = leftColor;
    ctx.beginPath();
    ctx.moveTo(p000.x, p000.y);
    ctx.lineTo(p100.x, p100.y);
    ctx.lineTo(p101.x, p101.y);
    ctx.lineTo(p001.x, p001.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right Face
    ctx.fillStyle = rightColor;
    ctx.beginPath();
    ctx.moveTo(p100.x, p100.y);
    ctx.lineTo(p110.x, p110.y);
    ctx.lineTo(p111.x, p111.y);
    ctx.lineTo(p101.x, p101.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Top Face
    ctx.fillStyle = topColor;
    ctx.beginPath();
    ctx.moveTo(p001.x, p001.y);
    ctx.lineTo(p101.x, p101.y);
    ctx.lineTo(p111.x, p111.y);
    ctx.lineTo(p011.x, p011.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  function draw() {
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      fps = (frameCount * 1000 / (now - lastTime)).toFixed(1);
      frameCount = 0;
      lastTime = now;
    }

    // Smooth lerp mouse parallax
    mouseOffset.x += (targetMouse.x - mouseOffset.x) * 0.08;
    mouseOffset.y += (targetMouse.y - mouseOffset.y) * 0.08;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Atmospheric Backdrop
    const sky = ctx.createRadialGradient(canvas.width / 2, canvas.height * 0.4, 40, canvas.width / 2, canvas.height / 2, canvas.width);
    if (mode === 'day') {
      sky.addColorStop(0, '#101a28');
      sky.addColorStop(0.6, '#080d15');
      sky.addColorStop(1, '#020305');
    } else if (mode === 'sunset') {
      sky.addColorStop(0, '#38161e');
      sky.addColorStop(0.5, '#1e0f14');
      sky.addColorStop(1, '#050306');
    } else { // night
      sky.addColorStop(0, '#0d131f');
      sky.addColorStop(0.6, '#05080e');
      sky.addColorStop(1, '#000000');
    }
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2 + 35;

    // Architectural Ground Grid (3D Projected Isometric Matrix)
    ctx.lineWidth = 1;
    ctx.strokeStyle = mode === 'sunset' ? 'rgba(223, 183, 108, 0.12)' : (mode === 'night' ? 'rgba(41, 151, 255, 0.12)' : 'rgba(255, 255, 255, 0.07)');
    const gridSize = 160;
    const step = 20;
    for (let gx = -gridSize; gx <= gridSize; gx += step) {
      const pA = project(gx, -gridSize, 0, cx, cy);
      const pB = project(gx, gridSize, 0, cx, cy);
      ctx.beginPath();
      ctx.moveTo(pA.x, pA.y);
      ctx.lineTo(pB.x, pB.y);
      ctx.stroke();
    }
    for (let gy = -gridSize; gy <= gridSize; gy += step) {
      const pA = project(-gridSize, gy, 0, cx, cy);
      const pB = project(gridSize, gy, 0, cx, cy);
      ctx.beginPath();
      ctx.moveTo(pA.x, pA.y);
      ctx.lineTo(pB.x, pB.y);
      ctx.stroke();
    }

    // Palette per mode
    let colTop, colLeft, colRight, wireCol;
    if (mode === 'day') {
      colTop = 'rgba(235, 240, 250, 0.22)';
      colLeft = 'rgba(56, 130, 210, 0.45)';
      colRight = 'rgba(20, 35, 60, 0.85)';
      wireCol = 'rgba(223, 183, 108, 0.35)';
    } else if (mode === 'sunset') {
      colTop = 'rgba(250, 230, 190, 0.3)';
      colLeft = 'rgba(220, 120, 40, 0.5)';
      colRight = 'rgba(40, 18, 30, 0.9)';
      wireCol = 'rgba(250, 210, 120, 0.45)';
    } else { // night
      colTop = 'rgba(30, 45, 75, 0.4)';
      colLeft = 'rgba(20, 30, 50, 0.7)';
      colRight = 'rgba(10, 15, 25, 0.95)';
      wireCol = 'rgba(41, 151, 255, 0.4)';
    }

    // 1. Commercial Podium Base (Rohan City Ground & Retail Plaza)
    drawIsoBlock(-90, -70, 0, 180, 140, 26, cx, cy, colTop, colLeft, colRight, wireCol);

    // 2. Tower A (Rohan City North Tower - 24 Storeys)
    drawIsoBlock(-70, -50, 26, 60, 55, 140, cx, cy, colTop, colLeft, colRight, wireCol);

    // Cantilever Balcony Bands on Tower A
    for (let f = 36; f < 160; f += 16) {
      drawIsoBlock(-73, -53, f, 66, 6, 2, cx, cy, 'rgba(223, 183, 108, 0.4)', 'rgba(223, 183, 108, 0.5)', 'rgba(223, 183, 108, 0.2)', 'rgba(223, 183, 108, 0.5)');
    }

    // 3. Tower B (Rohan City South Tower - Commercial Suites)
    drawIsoBlock(10, -35, 26, 65, 60, 110, cx, cy, colTop, colLeft, colRight, wireCol);
    for (let f = 36; f < 130; f += 14) {
      drawIsoBlock(8, -37, f, 6, 64, 2, cx, cy, 'rgba(223, 183, 108, 0.4)', 'rgba(223, 183, 108, 0.5)', 'rgba(223, 183, 108, 0.2)', 'rgba(223, 183, 108, 0.5)');
    }

    // 4. Rooftop Architectural Spire & Solar Node
    const spireTop = project(-40, -22, 178, cx, cy);
    const spireBase = project(-40, -22, 166, cx, cy);
    ctx.strokeStyle = '#dfb76c';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(spireBase.x, spireBase.y);
    ctx.lineTo(spireTop.x, spireTop.y);
    ctx.stroke();

    // Beacon Pulse
    const pulse = (Math.sin(now * 0.005) + 1) * 0.5;
    ctx.fillStyle = `rgba(255, 69, 58, ${0.4 + pulse * 0.6})`;
    ctx.beginPath();
    ctx.arc(spireTop.x, spireTop.y, 2.5 + pulse * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Solar Azimuth Vector Ray Projection
    const sunAngle = mode === 'day' ? 145 * Math.PI / 180 : (mode === 'sunset' ? 260 * Math.PI / 180 : 0);
    if (mode !== 'night') {
      const sunDist = 180;
      const sunHeight = mode === 'day' ? 160 : 40;
      const sunPos = project(Math.cos(sunAngle) * sunDist, Math.sin(sunAngle) * sunDist, sunHeight, cx, cy);

      // Sun flare
      const flareGrad = ctx.createRadialGradient(sunPos.x, sunPos.y, 2, sunPos.x, sunPos.y, 40);
      flareGrad.addColorStop(0, mode === 'day' ? 'rgba(255, 250, 220, 0.9)' : 'rgba(255, 180, 80, 0.9)');
      flareGrad.addColorStop(0.3, mode === 'day' ? 'rgba(255, 220, 140, 0.3)' : 'rgba(255, 120, 50, 0.3)');
      flareGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = flareGrad;
      ctx.beginPath();
      ctx.arc(sunPos.x, sunPos.y, 40, 0, Math.PI * 2);
      ctx.fill();

      // Light vector lines toward towers
      ctx.strokeStyle = mode === 'day' ? 'rgba(255, 235, 180, 0.25)' : 'rgba(255, 160, 60, 0.35)';
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(sunPos.x, sunPos.y);
      ctx.lineTo(cx - 30, cy - 60);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Technical Architectural HUD Overlays
    ctx.font = '600 9px -apple-system, BlinkMacSystemFont, "SF Mono", Menlo, monospace';
    ctx.fillStyle = 'rgba(223, 183, 108, 0.85)';
    ctx.textAlign = 'left';
    ctx.fillText('ROHAN CITY DIGITAL TWIN • 12°52\'N 74°50\'E', 16, 22);

    ctx.font = '400 9px -apple-system, BlinkMacSystemFont, "SF Mono", Menlo, monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText('STRUCTURAL GRID: 8.4m × 8.4m | ELEVATION: 22m MSL', 16, 36);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#30d158';
    ctx.fillText(`${fps} FPS`, canvas.width - 16, 22);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText('HARDWARE ACCELERATED', canvas.width - 16, 36);

    requestAnimationFrame(draw);
  }

  draw();
}

/* -------------------------------------------------------------------------- */
/* 4. Modal Explorer                                                          */
/* -------------------------------------------------------------------------- */
function initModal() {
  const modal = document.getElementById('tourModal');
  const closeBtn = document.getElementById('modalClose');
  const openBtns = document.querySelectorAll('.open-modal-btn');
  const modalTitle = document.getElementById('modalTitle');
  const modalSpecs = document.getElementById('modalSpecs');
  const modalVisualText = document.getElementById('modalVisualText');

  const projectData = {
    'Rohan City': {
      title: 'Rohan City — Bejai Commercial & Living Digital Twin',
      elevation: '24-Storey Mega Commercial & Sky Residence Complex',
      specs: [
        { label: 'Location', val: 'Bejai Main Road, Central Mangaluru' },
        { label: 'Total Footprint', val: 'Over 3.5 Million Sq. Ft. Mixed-Use Ecosystem' },
        { label: 'Commercial Facilities', val: 'High-Street Retail, Food Courts & Hypermarket' },
        { label: 'Smart Tech', val: 'Edge AI Vehicle Flow & Occupancy Thermal Sensors' },
        { label: 'RERA Status', val: 'Fully Sanctioned & Compliant' }
      ]
    },
    'Rohan Marina One': {
      title: 'Rohan Marina One — Sea-Facing Beachfront Digital Twin',
      elevation: 'Direct Maritime Frontage with 100% Uninterrupted Ocean Horizons',
      specs: [
        { label: 'Location', val: 'Surathkal Beachfront, Mangalore' },
        { label: 'Configuration', val: '2, 3 & 4 BHK Sea-Facing Luxury Apartments' },
        { label: 'Sea Visibility', val: '100% Guaranteed Arabian Sea Vista from Every Home' },
        { label: 'Smart Tech', val: 'Coastal Wind Vector Shaders & Remote NRI Reservation' },
        { label: 'RERA Status', val: 'Approved by Karnataka RERA Authority' }
      ]
    },
    'Rohan Crown': {
      title: 'Rohan Crown — Ultra-Luxury Sky Residence Twin',
      elevation: 'Towering Horizon Landmark with Arabian Sea Vista',
      specs: [
        { label: 'Location', val: 'Kadri / Bejai Hills, Mangaluru' },
        { label: 'Configuration', val: 'Palatial 3 BHK & 4 BHK Sky Mansions' },
        { label: 'Amenities', val: 'Infinity Rooftop Pool, Sky Gym & Club Royale' },
        { label: 'Smart Tech', val: 'HRL On-Device Zero-Cloud Biometric Access' },
        { label: 'RERA Status', val: 'Approved by Karnataka RERA Authority' }
      ]
    },
    'Rohan Square': {
      title: 'Rohan Square — Transit Hub Commercial Complex',
      elevation: 'Arterial Highway Commercial & Executive Corporate Suites',
      specs: [
        { label: 'Location', val: 'Pumpwell / Capitanio Gateway' },
        { label: 'Suitability', val: 'MNC Corporate Offices, Flagship Showrooms' },
        { label: 'Power & Infrastructure', val: '100% Dual Power Backup & High-Speed Elevators' },
        { label: 'Smart Tech', val: 'Smart Micro-Grid Energy Telemetry' },
        { label: 'RERA Status', val: 'Registered & Certified' }
      ]
    },
    'Rohan Estate': {
      title: 'Rohan Estate — Panoramic Neermarga Plotted Sanctuary',
      elevation: 'Topographic Drone-Mapped Gated Villa Enclave',
      specs: [
        { label: 'Location', val: 'Neermarga Hills, Mangaluru' },
        { label: 'Plot Sizes', val: 'Custom Villa Dimensions with Clear Title Deeds' },
        { label: 'Green Infrastructure', val: 'Rainwater Harvesting, Solar Street Lighting' },
        { label: 'Smart Tech', val: 'IoT Subsoil Moisture & Drone Perimeter Surveillance' },
        { label: 'RERA Status', val: 'Sanctioned Layout Clearance' }
      ]
    }
  };

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const data = projectData[projKey] || projectData['Rohan City'];

      modalTitle.textContent = data.title;
      modalVisualText.textContent = `[3D DIGITAL TWIN] ${data.elevation}`;

      let specsHtml = '<ul class="modal-specs-list">';
      data.specs.forEach(s => {
        specsHtml += `<li><span>${s.label}</span><strong>${s.val}</strong></li>`;
      });
      specsHtml += '</ul>';
      modalSpecs.innerHTML = specsHtml;

      modal.classList.add('open');
    });
  });

  closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });
}

/* -------------------------------------------------------------------------- */
/* 5. Booking Form Submission                                                 */
/* -------------------------------------------------------------------------- */
function initBookingForm() {
  const form = document.getElementById('tourBookingForm') || document.getElementById('propertyBookingForm');
  const successBox = document.getElementById('formSuccess');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const originalText = submitBtn ? submitBtn.textContent : 'Submit';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Transmitting VIP Registration...';
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '✓ Request Successfully Registered';
      }
      if (successBox) {
        successBox.classList.remove('d-none');
        setTimeout(() => successBox.classList.add('d-none'), 7000);
      } else {
        alert('Thank you. Your VIP inspection request has been registered with HRL × Rohan Corporation.');
      }
      form.reset();
      setTimeout(() => {
        if (submitBtn) submitBtn.textContent = originalText;
      }, 4000);
    }, 800);
  });
}

/* -------------------------------------------------------------------------- */
/* 6. Mobile Menu Toggle                                                      */
/* -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isFlex = navLinks.style.display === 'flex';
    navLinks.style.display = isFlex ? 'none' : 'flex';
    if (!isFlex) {
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.background = '#08090d';
      navLinks.style.padding = '20px';
      navLinks.style.borderBottom = '1px solid rgba(212, 175, 55, 0.2)';
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 7. HRL International™ 19-Pillar Venture Multiplier Simulator               */
/* -------------------------------------------------------------------------- */
function initVentureSimulator() {
  const portfolioRange = document.getElementById('portfolioRange');
  const portfolioVal = document.getElementById('portfolioVal');
  const gdvGainOutput = document.getElementById('gdvGainOutput');
  const forexGainOutput = document.getElementById('forexGainOutput');

  if (!portfolioRange || !portfolioVal || !gdvGainOutput || !forexGainOutput) return;

  function update() {
    const cr = parseFloat(portfolioRange.value);
    portfolioVal.textContent = `₹ ${cr.toLocaleString('en-IN')} Crores`;
    
    // Algorithmic Yield: ~ 14.2% incremental GDV
    const gdvGain = cr * 0.142;
    // Forex Slippage Recovered: ~ 3.7% on NRI portion (65% of total portfolio)
    const forexGain = (cr * 0.65) * 0.037;

    gdvGainOutput.textContent = `+₹ ${gdvGain.toFixed(1)} Cr`;
    forexGainOutput.textContent = `₹ ${forexGain.toFixed(1)} Cr`;
  }

  portfolioRange.addEventListener('input', update);
  update();
}

/* -------------------------------------------------------------------------- */
/* 8. 19-Pillar Venture Architecture Tier Tabs Filter                         */
/* -------------------------------------------------------------------------- */
function initVentureTabs() {
  const tabs = document.querySelectorAll('.venture-tab-btn');
  const cards = document.querySelectorAll('.venture-pillar-card, .secret-pillar-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const tier = tab.getAttribute('data-tier');
      cards.forEach(card => {
        const cardTier = card.getAttribute('data-tier');
        if (tier === 'all' || cardTier === tier) {
          card.classList.remove('d-none');
        } else {
          card.classList.add('d-none');
        }
      });
    });
  });
}
