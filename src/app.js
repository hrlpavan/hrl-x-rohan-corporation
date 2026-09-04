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
  initProjectFinanceVisualizers();
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
/* Helper: Retina Canvas DPI Setup                                            */
/* -------------------------------------------------------------------------- */
function setupCanvasDPI(canvas) {
  if (!canvas) return null;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || canvas.width || 300;
  const height = rect.height || canvas.height || 180;

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height, dpr };
}

/* -------------------------------------------------------------------------- */
/* 2. Smart ROI & Mortgage Calculator with Live Apple Financial Graph        */
/* -------------------------------------------------------------------------- */
function initCalculator() {
  const priceRange = document.getElementById('priceRange');
  const downRange = document.getElementById('downRange');
  const tenureRange = document.getElementById('tenureRange');
  const rateRange = document.getElementById('rateRange');

  if (!priceRange || !downRange || !tenureRange || !rateRange) return;

  const priceVal = document.getElementById('priceVal');
  const downVal = document.getElementById('downVal');
  const tenureVal = document.getElementById('tenureVal');
  const rateVal = document.getElementById('rateVal');

  const emiOutput = document.getElementById('emiOutput');
  const loanOutput = document.getElementById('loanOutput');
  const interestOutput = document.getElementById('interestOutput');
  const yieldOutput = document.getElementById('yieldOutput');
  const appreciationOutput = document.getElementById('appreciationOutput');

  // Chart UI Elements
  const chartCanvas = document.getElementById('mortgageChartCanvas');
  const chartTitle = document.getElementById('mortgageChartTitle');
  const btnAmort = document.getElementById('chartViewAmort');
  const btnWealth = document.getElementById('chartViewWealth');
  const splitPrincipalBar = document.getElementById('splitPrincipalBar');
  const splitInterestBar = document.getElementById('splitInterestBar');
  const splitPrincipalPercent = document.getElementById('splitPrincipalPercent');
  const splitInterestPercent = document.getElementById('splitInterestPercent');

  let currentMode = 'amort'; // 'amort' or 'wealth'

  if (btnAmort && btnWealth) {
    btnAmort.addEventListener('click', () => {
      currentMode = 'amort';
      btnAmort.classList.add('active');
      btnWealth.classList.remove('active');
      if (chartTitle) chartTitle.textContent = 'Equity Amortization Curve';
      calculate();
    });
    btnWealth.addEventListener('click', () => {
      currentMode = 'wealth';
      btnWealth.classList.add('active');
      btnAmort.classList.remove('active');
      if (chartTitle) chartTitle.textContent = '5-Year Wealth Trajectory';
      calculate();
    });
  }

  function calculate() {
    const priceLakhs = parseFloat(priceRange.value);
    const downPercent = parseFloat(downRange.value);
    const tenureYears = parseInt(tenureRange.value, 10);
    const rateAnnual = parseFloat(rateRange.value);

    const propertyPrice = priceLakhs * 100000;
    const downAmount = propertyPrice * (downPercent / 100);
    const principal = propertyPrice - downAmount;

    // Update labels
    if (priceVal) priceVal.textContent = formatCurrency(propertyPrice);
    if (downVal) downVal.textContent = `${downPercent}% (${formatCurrency(downAmount)})`;
    if (tenureVal) tenureVal.textContent = `${tenureYears} Years`;
    if (rateVal) rateVal.textContent = `${rateAnnual.toFixed(1)}%`;

    const monthlyRate = (rateAnnual / 12) / 100;
    const totalMonths = tenureYears * 12;

    let emi = 0;
    if (monthlyRate > 0) {
      emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      emi = principal / totalMonths;
    }

    const totalRepayable = emi * totalMonths;
    const totalInterest = Math.max(0, totalRepayable - principal);

    const annualRentalYield = propertyPrice * 0.05;
    const fiveYearAppreciation = propertyPrice * Math.pow(1.08, 5);

    if (emiOutput) emiOutput.textContent = `₹ ${Math.round(emi).toLocaleString('en-IN')}`;
    if (loanOutput) loanOutput.textContent = formatCurrency(principal);
    if (interestOutput) interestOutput.textContent = formatCurrency(totalInterest);
    if (yieldOutput) yieldOutput.textContent = formatCurrency(annualRentalYield);
    if (appreciationOutput) appreciationOutput.textContent = formatCurrency(fiveYearAppreciation);

    // Update Principal vs Interest Split Bar
    const totalOutflow = principal + totalInterest;
    if (totalOutflow > 0 && splitPrincipalBar && splitInterestBar) {
      const pPct = Math.round((principal / totalOutflow) * 100);
      const iPct = 100 - pPct;
      splitPrincipalBar.style.width = `${pPct}%`;
      splitInterestBar.style.width = `${iPct}%`;
      if (splitPrincipalPercent) splitPrincipalPercent.textContent = `${pPct}% (${formatCurrency(principal)})`;
      if (splitInterestPercent) splitInterestPercent.textContent = `${iPct}% (${formatCurrency(totalInterest)})`;
    }

    // Render Canvas Visualization
    if (chartCanvas) {
      drawMortgageGraph(chartCanvas, {
        mode: currentMode,
        propertyPrice,
        principal,
        downAmount,
        totalInterest,
        emi,
        tenureYears,
        monthlyRate,
        annualRentalYield
      });
    }
  }

  function drawMortgageGraph(canvas, data) {
    const dpi = setupCanvasDPI(canvas);
    if (!dpi) return;
    const { ctx, width, height } = dpi;

    ctx.clearRect(0, 0, width, height);

    const padLeft = 46;
    const padRight = 16;
    const padTop = 20;
    const padBottom = 26;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    // Background Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    for (let i = 0; i <= 4; i++) {
      const y = padTop + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    if (data.mode === 'amort') {
      const points = [];
      const steps = Math.min(data.tenureYears, 30);

      for (let y = 0; y <= steps; y++) {
        if (y === 0) {
          points.push({ year: 0, debt: data.principal, equity: data.downAmount });
        } else {
          const m = y * 12;
          let rem = 0;
          if (data.monthlyRate > 0) {
            const num = Math.pow(1 + data.monthlyRate, data.tenureYears * 12) - Math.pow(1 + data.monthlyRate, m);
            const den = Math.pow(1 + data.monthlyRate, data.tenureYears * 12) - 1;
            rem = data.principal * (num / den);
          }
          rem = Math.max(0, rem);
          const equity = data.propertyPrice - rem;
          points.push({ year: y, debt: rem, equity: equity });
        }
      }

      const maxVal = data.propertyPrice;

      // Draw Equity Area (Champagne Gold Fill)
      const gradEquity = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
      gradEquity.addColorStop(0, 'rgba(223, 183, 108, 0.28)');
      gradEquity.addColorStop(1, 'rgba(223, 183, 108, 0.02)');

      ctx.beginPath();
      ctx.moveTo(padLeft, padTop + plotH);
      points.forEach((p, idx) => {
        const x = padLeft + (idx / steps) * plotW;
        const y = padTop + plotH - (p.equity / maxVal) * plotH;
        ctx.lineTo(x, y);
      });
      ctx.lineTo(padLeft + plotW, padTop + plotH);
      ctx.closePath();
      ctx.fillStyle = gradEquity;
      ctx.fill();

      // Equity Stroke Line
      ctx.beginPath();
      points.forEach((p, idx) => {
        const x = padLeft + (idx / steps) * plotW;
        const y = padTop + plotH - (p.equity / maxVal) * plotH;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#dfb76c';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Remaining Loan Debt Line (Titanium Red/Coral)
      ctx.beginPath();
      points.forEach((p, idx) => {
        const x = padLeft + (idx / steps) * plotW;
        const y = padTop + plotH - (p.debt / maxVal) * plotH;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = 'rgba(255, 69, 58, 0.85)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Y-axis Labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '500 10px -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(formatCompact(maxVal), padLeft - 6, padTop + 10);
      ctx.fillText(formatCompact(maxVal / 2), padLeft - 6, padTop + plotH / 2 + 3);
      ctx.fillText('₹0', padLeft - 6, padTop + plotH);

      // X-axis Labels
      ctx.textAlign = 'center';
      ctx.fillText('Yr 0', padLeft, height - 8);
      ctx.fillText(`Yr ${Math.round(data.tenureYears / 2)}`, padLeft + plotW / 2, height - 8);
      ctx.fillText(`Yr ${data.tenureYears}`, padLeft + plotW, height - 8);

      // Final Point Accent
      const lastX = padLeft + plotW;
      const lastY = padTop + plotH - (points[points.length - 1].equity / maxVal) * plotH;
      ctx.beginPath();
      ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffe5a3';
      ctx.fill();

    } else {
      // 5-Year Wealth Trajectory Mode
      const years = [0, 1, 2, 3, 4, 5];
      const appreciation = years.map(y => data.propertyPrice * Math.pow(1.08, y));
      const rentalCumulative = years.map(y => data.annualRentalYield * y);
      const totalWealth = years.map((_, i) => appreciation[i] + rentalCumulative[i]);

      const maxVal = totalWealth[5] * 1.06;

      // Area under Total Wealth (Emerald)
      const gradWealth = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
      gradWealth.addColorStop(0, 'rgba(48, 209, 88, 0.25)');
      gradWealth.addColorStop(1, 'rgba(48, 209, 88, 0.01)');

      ctx.beginPath();
      ctx.moveTo(padLeft, padTop + plotH);
      years.forEach((y, idx) => {
        const x = padLeft + (idx / 5) * plotW;
        const valY = padTop + plotH - (totalWealth[idx] / maxVal) * plotH;
        ctx.lineTo(x, valY);
      });
      ctx.lineTo(padLeft + plotW, padTop + plotH);
      ctx.closePath();
      ctx.fillStyle = gradWealth;
      ctx.fill();

      // Total Wealth Stroke
      ctx.beginPath();
      years.forEach((y, idx) => {
        const x = padLeft + (idx / 5) * plotW;
        const valY = padTop + plotH - (totalWealth[idx] / maxVal) * plotH;
        if (idx === 0) ctx.moveTo(x, valY);
        else ctx.lineTo(x, valY);
      });
      ctx.strokeStyle = '#30d158';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Asset Appreciation Stroke (Champagne Gold Dashed)
      ctx.beginPath();
      years.forEach((y, idx) => {
        const x = padLeft + (idx / 5) * plotW;
        const valY = padTop + plotH - (appreciation[idx] / maxVal) * plotH;
        if (idx === 0) ctx.moveTo(x, valY);
        else ctx.lineTo(x, valY);
      });
      ctx.strokeStyle = '#dfb76c';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Final Year 5 Node
      const finalX = padLeft + plotW;
      const finalWealthY = padTop + plotH - (totalWealth[5] / maxVal) * plotH;
      ctx.beginPath();
      ctx.arc(finalX, finalWealthY, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#30d158';
      ctx.fill();

      // Y-axis Labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '500 10px -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(formatCompact(maxVal), padLeft - 6, padTop + 10);
      ctx.fillText(formatCompact(maxVal / 2), padLeft - 6, padTop + plotH / 2 + 3);
      ctx.fillText('₹0', padLeft - 6, padTop + plotH);

      // X-axis Labels
      ctx.textAlign = 'center';
      years.forEach((y, idx) => {
        const x = padLeft + (idx / 5) * plotW;
        ctx.fillText(`Yr ${y}`, x, height - 8);
      });
    }
  }

  function formatCompact(val) {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
    return `₹${Math.round(val)}`;
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

  window.addEventListener('resize', calculate);
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

  if (!modal || !closeBtn) return;

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
/* 7. HRL International™ 19-Pillar Venture Multiplier Simulator & Waterfall   */
/* -------------------------------------------------------------------------- */
function initVentureSimulator() {
  const portfolioRange = document.getElementById('portfolioRange');
  const portfolioVal = document.getElementById('portfolioVal');
  const gdvGainOutput = document.getElementById('gdvGainOutput');
  const forexGainOutput = document.getElementById('forexGainOutput');
  const waterfallCanvas = document.getElementById('ventureWaterfallCanvas');

  if (!portfolioRange || !portfolioVal || !gdvGainOutput || !forexGainOutput) return;

  function update() {
    const cr = parseFloat(portfolioRange.value);
    portfolioVal.textContent = `₹ ${cr.toLocaleString('en-IN')} Crores`;
    
    // Algorithmic Yield: ~ 14.2% incremental GDV
    const gdvGain = cr * 0.142;
    // Forex Slippage Recovered: ~ 3.7% on NRI portion (65% of total portfolio)
    const forexGain = (cr * 0.65) * 0.037;
    // Operational Escrow & Energy savings ~ 1.5%
    const opGain = cr * 0.015;
    const totalExpanded = cr + gdvGain + forexGain + opGain;

    gdvGainOutput.textContent = `+₹ ${gdvGain.toFixed(1)} Cr`;
    forexGainOutput.textContent = `₹ ${forexGain.toFixed(1)} Cr`;

    if (waterfallCanvas) {
      drawVentureWaterfall(waterfallCanvas, cr, gdvGain, forexGain, opGain, totalExpanded);
    }
  }

  function drawVentureWaterfall(canvas, baseCr, gdvGain, forexGain, opGain, totalExpanded) {
    const dpi = setupCanvasDPI(canvas);
    if (!dpi) return;
    const { ctx, width, height } = dpi;

    ctx.clearRect(0, 0, width, height);

    const padLeft = 52;
    const padRight = 20;
    const padTop = 26;
    const padBottom = 26;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const maxVal = totalExpanded * 1.15;

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    for (let i = 0; i <= 3; i++) {
      const y = padTop + (plotH / 3) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    const columns = [
      { label: 'Base GDV', start: 0, val: baseCr, color: 'rgba(255, 255, 255, 0.35)', isTotal: false },
      { label: '+14.2% AI', start: baseCr, val: gdvGain, color: '#dfb76c', isTotal: false },
      { label: '+Forex Lock', start: baseCr + gdvGain, val: forexGain, color: '#30d158', isTotal: false },
      { label: '+Op Yield', start: baseCr + gdvGain + forexGain, val: opGain, color: '#2997ff', isTotal: false },
      { label: 'Total Value', start: 0, val: totalExpanded, color: '#f5e6c8', isTotal: true }
    ];

    const colWidth = Math.min(plotW / 7, 54);
    const spacing = (plotW - colWidth * columns.length) / (columns.length - 1);

    columns.forEach((col, idx) => {
      const x = padLeft + idx * (colWidth + spacing);
      const topY = padTop + plotH - ((col.start + col.val) / maxVal) * plotH;
      const bottomY = padTop + plotH - (col.start / maxVal) * plotH;
      const h = Math.max(bottomY - topY, 4);

      if (col.isTotal) {
        const grad = ctx.createLinearGradient(0, topY, 0, topY + h);
        grad.addColorStop(0, '#ffe5a3');
        grad.addColorStop(1, '#dfb76c');
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = col.color;
      }

      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, topY, colWidth, h, 4);
      } else {
        ctx.rect(x, topY, colWidth, h);
      }
      ctx.fill();

      // Connector dashed lines between steps
      if (idx < columns.length - 1 && !columns[idx].isTotal && !columns[idx + 1].isTotal) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(x + colWidth, topY);
        ctx.lineTo(x + colWidth + spacing, topY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Value label on top of bar
      ctx.fillStyle = col.isTotal ? '#dfb76c' : '#ffffff';
      ctx.font = '600 9.5px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      const displayVal = col.val >= 100 ? Math.round(col.val) : col.val.toFixed(1);
      ctx.fillText(`₹${displayVal}`, x + colWidth / 2, topY - 5);

      // Bottom Category Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = '500 8.5px -apple-system, sans-serif';
      ctx.fillText(col.label, x + colWidth / 2, height - 8);
    });

    // Y Axis labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '500 9px -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`₹${Math.round(maxVal)}Cr`, padLeft - 6, padTop + 8);
    ctx.fillText(`₹${Math.round(maxVal / 2)}Cr`, padLeft - 6, padTop + plotH / 2 + 3);
    ctx.fillText('₹0', padLeft - 6, padTop + plotH);
  }

  portfolioRange.addEventListener('input', update);
  window.addEventListener('resize', update);
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

/* -------------------------------------------------------------------------- */
/* 9. Dedicated Project Financial Visualizers                                 */
/* -------------------------------------------------------------------------- */
function initProjectFinanceVisualizers() {
  initCityFinanceChart();
  initMarinaFinanceChart();
  initSquareFinanceChart();
  initEstateFinanceChart();
}

function initCityFinanceChart() {
  const canvas = document.getElementById('cityFinanceCanvas');
  if (!canvas) return;

  const unitTabs = document.querySelectorAll('.city-unit-btn');
  const valCurrent = document.getElementById('cityFinanceCurrentVal');
  const val5Yr = document.getElementById('cityFinance5YrVal');
  const valYield = document.getElementById('cityFinanceYieldVal');
  const valRoi = document.getElementById('cityFinanceRoiVal');

  const unitData = {
    '1bhk': { name: '1 BHK Suite', base: 48, p5: 71, rent: 2.50, yieldPct: '5.2% Net Yield', roi: '+48%' },
    '2bhk': { name: '2 BHK Residence', base: 82, p5: 122, rent: 4.10, yieldPct: '5.0% Net Yield', roi: '+49%' },
    '3bhk': { name: '3 BHK Skydeck', base: 128, p5: 194, rent: 6.14, yieldPct: '4.8% Net Yield', roi: '+51%' },
    'commercial': { name: 'Commercial Arcade', base: 95, p5: 158, rent: 8.08, yieldPct: '8.5% Lease Yield', roi: '+66%' }
  };

  let activeUnit = '2bhk';

  function draw() {
    const data = unitData[activeUnit];
    if (valCurrent) valCurrent.textContent = `₹ ${data.base} Lakhs`;
    if (val5Yr) val5Yr.textContent = data.p5 >= 100 ? `₹ ${(data.p5 / 100).toFixed(2)} Cr` : `₹ ${data.p5} Lakhs`;
    if (valYield) valYield.textContent = `₹ ${data.rent.toFixed(2)} L/yr (${data.yieldPct})`;
    if (valRoi) valRoi.textContent = data.roi;

    const dpi = setupCanvasDPI(canvas);
    if (!dpi) return;
    const { ctx, width, height } = dpi;

    ctx.clearRect(0, 0, width, height);

    const padLeft = 48;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 26;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const years = [0, 1, 2, 3, 4, 5];
    const cagrFactor = Math.pow(data.p5 / data.base, 1 / 5);
    const valuations = years.map(y => data.base * Math.pow(cagrFactor, y));
    const cumulativeRents = years.map(y => data.rent * y);
    const totalReturns = valuations.map((v, i) => v + cumulativeRents[i]);

    const maxVal = totalReturns[5] * 1.1;

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    for (let i = 0; i <= 3; i++) {
      const y = padTop + (plotH / 3) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Area Fill
    const grad = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
    grad.addColorStop(0, 'rgba(223, 183, 108, 0.28)');
    grad.addColorStop(1, 'rgba(223, 183, 108, 0.01)');

    ctx.beginPath();
    ctx.moveTo(padLeft, padTop + plotH);
    years.forEach((y, i) => {
      const x = padLeft + (i / 5) * plotW;
      const cy = padTop + plotH - (totalReturns[i] / maxVal) * plotH;
      ctx.lineTo(x, cy);
    });
    ctx.lineTo(padLeft + plotW, padTop + plotH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Total Wealth Stroke
    ctx.beginPath();
    years.forEach((y, i) => {
      const x = padLeft + (i / 5) * plotW;
      const cy = padTop + plotH - (totalReturns[i] / maxVal) * plotH;
      if (i === 0) ctx.moveTo(x, cy);
      else ctx.lineTo(x, cy);
    });
    ctx.strokeStyle = '#dfb76c';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Base Asset Valuation Stroke (Dashed Emerald)
    ctx.beginPath();
    years.forEach((y, i) => {
      const x = padLeft + (i / 5) * plotW;
      const cy = padTop + plotH - (valuations[i] / maxVal) * plotH;
      if (i === 0) ctx.moveTo(x, cy);
      else ctx.lineTo(x, cy);
    });
    ctx.strokeStyle = '#30d158';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Final Node
    const lastX = padLeft + plotW;
    const lastY = padTop + plotH - (totalReturns[5] / maxVal) * plotH;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffe5a3';
    ctx.fill();

    // Y Labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '500 9px -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`₹${Math.round(maxVal)}L`, padLeft - 6, padTop + 8);
    ctx.fillText(`₹${Math.round(maxVal / 2)}L`, padLeft - 6, padTop + plotH / 2 + 3);
    ctx.fillText('₹0', padLeft - 6, padTop + plotH);

    // X Labels
    ctx.textAlign = 'center';
    years.forEach((y, i) => {
      ctx.fillText(`Yr ${y}`, padLeft + (i / 5) * plotW, height - 8);
    });
  }

  unitTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      unitTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeUnit = tab.getAttribute('data-unit');
      draw();
    });
  });

  window.addEventListener('resize', draw);
  draw();
}

function initMarinaFinanceChart() {
  const canvas = document.getElementById('marinaFinanceCanvas');
  if (!canvas) return;

  const unitTabs = document.querySelectorAll('.marina-unit-btn');
  const valCurrent = document.getElementById('marinaFinanceCurrentVal');
  const val5Yr = document.getElementById('marinaFinance5YrVal');
  const valYield = document.getElementById('marinaFinanceYieldVal');
  const valRoi = document.getElementById('marinaFinanceRoiVal');

  const unitData = {
    '2bhk': { name: '2 BHK Seafront', base: 92, p5: 142, rent: 7.20, yieldPct: '7.8% Vacation Staycation', roi: '+54%' },
    '3bhk': { name: '3 BHK Ocean Deck', base: 148, p5: 236, rent: 11.10, yieldPct: '7.5% Vacation Staycation', roi: '+59%' },
    'penthouse': { name: '4 BHK Horizon Penthouse', base: 260, p5: 430, rent: 19.50, yieldPct: '7.5% Vacation Staycation', roi: '+65%' }
  };

  let activeUnit = '2bhk';

  function draw() {
    const data = unitData[activeUnit];
    if (valCurrent) valCurrent.textContent = `₹ ${data.base} Lakhs`;
    if (val5Yr) val5Yr.textContent = data.p5 >= 100 ? `₹ ${(data.p5 / 100).toFixed(2)} Cr` : `₹ ${data.p5} Lakhs`;
    if (valYield) valYield.textContent = `₹ ${data.rent.toFixed(2)} L/yr (${data.yieldPct})`;
    if (valRoi) valRoi.textContent = data.roi;

    const dpi = setupCanvasDPI(canvas);
    if (!dpi) return;
    const { ctx, width, height } = dpi;

    ctx.clearRect(0, 0, width, height);

    const padLeft = 48;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 26;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const years = [0, 1, 2, 3, 4, 5];
    const cagrFactor = Math.pow(data.p5 / data.base, 1 / 5);
    const valuations = years.map(y => data.base * Math.pow(cagrFactor, y));
    const cumulativeRents = years.map(y => data.rent * y);
    const totalReturns = valuations.map((v, i) => v + cumulativeRents[i]);

    const maxVal = totalReturns[5] * 1.1;

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    for (let i = 0; i <= 3; i++) {
      const y = padTop + (plotH / 3) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Ocean Gradient Area Fill
    const grad = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
    grad.addColorStop(0, 'rgba(41, 151, 255, 0.3)');
    grad.addColorStop(1, 'rgba(41, 151, 255, 0.01)');

    ctx.beginPath();
    ctx.moveTo(padLeft, padTop + plotH);
    years.forEach((y, i) => {
      const x = padLeft + (i / 5) * plotW;
      const cy = padTop + plotH - (totalReturns[i] / maxVal) * plotH;
      ctx.lineTo(x, cy);
    });
    ctx.lineTo(padLeft + plotW, padTop + plotH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line 1: Total Return
    ctx.beginPath();
    years.forEach((y, i) => {
      const x = padLeft + (i / 5) * plotW;
      const cy = padTop + plotH - (totalReturns[i] / maxVal) * plotH;
      if (i === 0) ctx.moveTo(x, cy);
      else ctx.lineTo(x, cy);
    });
    ctx.strokeStyle = '#2997ff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Line 2: Scarcity Capital Line
    ctx.beginPath();
    years.forEach((y, i) => {
      const x = padLeft + (i / 5) * plotW;
      const cy = padTop + plotH - (valuations[i] / maxVal) * plotH;
      if (i === 0) ctx.moveTo(x, cy);
      else ctx.lineTo(x, cy);
    });
    ctx.strokeStyle = '#dfb76c';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Y Labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '500 9px -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`₹${Math.round(maxVal)}L`, padLeft - 6, padTop + 8);
    ctx.fillText(`₹${Math.round(maxVal / 2)}L`, padLeft - 6, padTop + plotH / 2 + 3);
    ctx.fillText('₹0', padLeft - 6, padTop + plotH);

    // X Labels
    ctx.textAlign = 'center';
    years.forEach((y, i) => {
      ctx.fillText(`Yr ${y}`, padLeft + (i / 5) * plotW, height - 8);
    });
  }

  unitTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      unitTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeUnit = tab.getAttribute('data-unit');
      draw();
    });
  });

  window.addEventListener('resize', draw);
  draw();
}

function initSquareFinanceChart() {
  const canvas = document.getElementById('squareFinanceCanvas');
  if (!canvas) return;

  const unitTabs = document.querySelectorAll('.square-unit-btn');
  const valCurrent = document.getElementById('squareFinanceCurrentVal');
  const val10Yr = document.getElementById('squareFinance10YrVal');
  const valCapRate = document.getElementById('squareFinanceCapRate');
  const valLease = document.getElementById('squareFinanceLeaseTenure');

  const unitData = {
    'office': { name: 'Corporate Office Suite', base: 75, cashflow10: 84.5, capRate: '9.0% Cap Rate', lease: '9 Yrs (3+3+3)' },
    'retail': { name: 'High-Street Retail Store', base: 140, cashflow10: 158.0, capRate: '9.0% Cap Rate', lease: '12 Yrs (Anchor)' },
    'food': { name: 'Anchor F&B Rooftop', base: 195, cashflow10: 220.0, capRate: '9.0% Cap Rate', lease: '15 Yrs (Multiplex)' }
  };

  let activeUnit = 'office';

  function draw() {
    const data = unitData[activeUnit];
    if (valCurrent) valCurrent.textContent = `₹ ${data.base} Lakhs`;
    if (val10Yr) val10Yr.textContent = `₹ ${(data.cashflow10 / 100).toFixed(2)} Cr`;
    if (valCapRate) valCapRate.textContent = data.capRate;
    if (valLease) valLease.textContent = data.lease;

    const dpi = setupCanvasDPI(canvas);
    if (!dpi) return;
    const { ctx, width, height } = dpi;

    ctx.clearRect(0, 0, width, height);

    const padLeft = 48;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 26;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const years = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const initialRent = data.base * 0.09;
    let cum = 0;
    const cumulativeCashFlow = years.map(y => {
      // 5% escalation every 3 years
      const esc = Math.pow(1.05, Math.floor((y - 1) / 3));
      cum += initialRent * esc;
      return cum;
    });

    const maxVal = cumulativeCashFlow[9] * 1.15;

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    for (let i = 0; i <= 3; i++) {
      const y = padTop + (plotH / 3) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Step-up Cash Flow Bar Chart
    const barWidth = Math.min(plotW / 14, 22);
    const spacing = (plotW - barWidth * 10) / 9;

    cumulativeCashFlow.forEach((cVal, i) => {
      const x = padLeft + i * (barWidth + spacing);
      const barH = (cVal / maxVal) * plotH;
      const y = padTop + plotH - barH;

      const grad = ctx.createLinearGradient(0, y, 0, y + barH);
      grad.addColorStop(0, '#ffe5a3');
      grad.addColorStop(1, '#dfb76c');
      ctx.fillStyle = grad;

      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, barWidth, barH, 3);
      } else {
        ctx.rect(x, y, barWidth, barH);
      }
      ctx.fill();

      // Top label
      if (i === 4 || i === 9) {
        ctx.fillStyle = '#30d158';
        ctx.font = '600 8.5px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`₹${Math.round(cVal)}L`, x + barWidth / 2, y - 4);
      }

      // X label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '500 8.5px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Y${i + 1}`, x + barWidth / 2, height - 8);
    });

    // Y labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '500 9px -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`₹${Math.round(maxVal)}L`, padLeft - 6, padTop + 8);
    ctx.fillText(`₹${Math.round(maxVal / 2)}L`, padLeft - 6, padTop + plotH / 2 + 3);
    ctx.fillText('₹0', padLeft - 6, padTop + plotH);
  }

  unitTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      unitTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeUnit = tab.getAttribute('data-unit');
      draw();
    });
  });

  window.addEventListener('resize', draw);
  draw();
}

function initEstateFinanceChart() {
  const canvas = document.getElementById('estateFinanceCanvas');
  if (!canvas) return;

  const unitTabs = document.querySelectorAll('.estate-unit-btn');
  const valCurrent = document.getElementById('estateFinanceCurrentVal');
  const val5Yr = document.getElementById('estateFinance5YrVal');
  const val10Yr = document.getElementById('estateFinance10YrVal');
  const valCagr = document.getElementById('estateFinanceCagr');

  const unitData = {
    '5cent': { name: '5 Cents Plot', base: 24, p5: 43, p10: 77, cagr: '12.4% Historical CAGR' },
    '8cent': { name: '8 Cents Plot', base: 38, p5: 68, p10: 122, cagr: '12.4% Historical CAGR' },
    '12cent': { name: '12 Cents Executive Estate', base: 58, p5: 104, p10: 186, cagr: '12.4% Historical CAGR' }
  };

  let activeUnit = '5cent';

  function draw() {
    const data = unitData[activeUnit];
    if (valCurrent) valCurrent.textContent = `₹ ${data.base} Lakhs`;
    if (val5Yr) val5Yr.textContent = `₹ ${data.p5} Lakhs (+79%)`;
    if (val10Yr) val10Yr.textContent = data.p10 >= 100 ? `₹ ${(data.p10 / 100).toFixed(2)} Cr (+221%)` : `₹ ${data.p10} Lakhs`;
    if (valCagr) valCagr.textContent = data.cagr;

    const dpi = setupCanvasDPI(canvas);
    if (!dpi) return;
    const { ctx, width, height } = dpi;

    ctx.clearRect(0, 0, width, height);

    const padLeft = 48;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 26;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const years = [0, 2, 4, 6, 8, 10];
    const valuations = years.map(y => data.base * Math.pow(1.124, y));
    const maxVal = valuations[5] * 1.1;

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    for (let i = 0; i <= 3; i++) {
      const y = padTop + (plotH / 3) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Gradient Area
    const grad = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
    grad.addColorStop(0, 'rgba(48, 209, 88, 0.3)');
    grad.addColorStop(1, 'rgba(48, 209, 88, 0.01)');

    ctx.beginPath();
    ctx.moveTo(padLeft, padTop + plotH);
    years.forEach((y, i) => {
      const x = padLeft + (i / 5) * plotW;
      const cy = padTop + plotH - (valuations[i] / maxVal) * plotH;
      ctx.lineTo(x, cy);
    });
    ctx.lineTo(padLeft + plotW, padTop + plotH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    years.forEach((y, i) => {
      const x = padLeft + (i / 5) * plotW;
      const cy = padTop + plotH - (valuations[i] / maxVal) * plotH;
      if (i === 0) ctx.moveTo(x, cy);
      else ctx.lineTo(x, cy);
    });
    ctx.strokeStyle = '#30d158';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Node at Year 10
    const finalX = padLeft + plotW;
    const finalY = padTop + plotH - (valuations[5] / maxVal) * plotH;
    ctx.beginPath();
    ctx.arc(finalX, finalY, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#30d158';
    ctx.fill();

    // Y labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '500 9px -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`₹${Math.round(maxVal)}L`, padLeft - 6, padTop + 8);
    ctx.fillText(`₹${Math.round(maxVal / 2)}L`, padLeft - 6, padTop + plotH / 2 + 3);
    ctx.fillText('₹0', padLeft - 6, padTop + plotH);

    // X labels
    ctx.textAlign = 'center';
    years.forEach((y, i) => {
      ctx.fillText(`Yr ${y}`, padLeft + (i / 5) * plotW, height - 8);
    });
  }

  unitTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      unitTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeUnit = tab.getAttribute('data-unit');
      draw();
    });
  });

  window.addEventListener('resize', draw);
  draw();
}
