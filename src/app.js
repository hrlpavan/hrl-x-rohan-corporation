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
  initPnlProfile();
  initStockMarketTerminal();
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
  const btnPnl = document.getElementById('chartViewPnl');
  const splitPrincipalBar = document.getElementById('splitPrincipalBar');
  const splitInterestBar = document.getElementById('splitInterestBar');
  const splitPrincipalPercent = document.getElementById('splitPrincipalPercent');
  const splitInterestPercent = document.getElementById('splitInterestPercent');

  let currentMode = 'amort'; // 'amort', 'wealth', or 'pnl'

  if (btnAmort && btnWealth) {
    btnAmort.addEventListener('click', () => {
      currentMode = 'amort';
      btnAmort.classList.add('active');
      btnWealth.classList.remove('active');
      if (btnPnl) btnPnl.classList.remove('active');
      if (chartTitle) chartTitle.textContent = 'Equity Amortization Curve';
      calculate();
    });
    btnWealth.addEventListener('click', () => {
      currentMode = 'wealth';
      btnWealth.classList.add('active');
      btnAmort.classList.remove('active');
      if (btnPnl) btnPnl.classList.remove('active');
      if (chartTitle) chartTitle.textContent = '5-Year Wealth Trajectory';
      calculate();
    });
    if (btnPnl) {
      btnPnl.addEventListener('click', () => {
        currentMode = 'pnl';
        btnPnl.classList.add('active');
        btnAmort.classList.remove('active');
        btnWealth.classList.remove('active');
        if (chartTitle) chartTitle.textContent = 'Annual Cash Flow P&L Statement';
        calculate();
      });
    }
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

    } else if (data.mode === 'wealth') {
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

    } else if (data.mode === 'pnl') {
      // 3. Annual Cash Flow P&L Statement Mode for Unit
      const grossRent = data.annualRentalYield; // 5%
      const annualAppreciation = data.propertyPrice * 0.08; // 8% CAGR
      const interestAnnual = data.principal * (data.monthlyRate * 12);
      const maintenanceAnnual = data.propertyPrice * 0.005;
      const taxAnnual = data.propertyPrice * 0.0025;
      const netCash = grossRent - (interestAnnual + maintenanceAnnual + taxAnnual);
      const totalWealthAnnual = netCash + annualAppreciation;

      const pnlBars = [
        { label: 'Gross Rent', val: grossRent, color: '#30d158' },
        { label: 'Loan Int.', val: -interestAnnual, color: '#ff453a' },
        { label: 'HOA/Tax', val: -(maintenanceAnnual + taxAnnual), color: '#ff453a' },
        { label: 'Net Cash', val: netCash, color: netCash >= 0 ? '#30d158' : '#ff453a' },
        { label: '8% Equity', val: annualAppreciation, color: '#dfb76c' },
        { label: 'Total Wealth', val: totalWealthAnnual, color: '#ffe5a3', isNet: true }
      ];

      const maxVal = Math.max(...pnlBars.map(b => Math.abs(b.val))) * 1.35;

      const colWidth = Math.min(plotW / (pnlBars.length * 1.35), 44);
      const spacing = (plotW - colWidth * pnlBars.length) / (pnlBars.length - 1);

      pnlBars.forEach((b, idx) => {
        const x = padLeft + idx * (colWidth + spacing);
        const absVal = Math.abs(b.val);
        const barH = Math.max((absVal / maxVal) * plotH, 4);
        const topY = padTop + plotH - barH;

        ctx.fillStyle = b.color;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, topY, colWidth, barH, 4);
        } else {
          ctx.rect(x, topY, colWidth, barH);
        }
        ctx.fill();

        ctx.fillStyle = b.val < 0 ? '#ff453a' : '#dfb76c';
        ctx.font = '600 8.5px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(formatCompact(b.val), x + colWidth / 2, topY - 5);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = '500 8px -apple-system, sans-serif';
        ctx.fillText(b.label, x + colWidth / 2, height - 8);
      });

      // Y-axis Labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '500 10px -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(formatCompact(maxVal), padLeft - 6, padTop + 10);
      ctx.fillText(formatCompact(maxVal / 2), padLeft - 6, padTop + plotH / 2 + 3);
      ctx.fillText('₹0', padLeft - 6, padTop + plotH);
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

  // CAD Model View Switcher (3D Interior CAD Suite vs Exterior Structural Twin)
  const cadViewInteriorBtn = document.getElementById('cadViewInteriorBtn');
  const cadViewExteriorBtn = document.getElementById('cadViewExteriorBtn');

  let mode = 'day'; // day, sunset, night
  let cadView = 'interior'; // 'interior' is active by default for advanced CAD interior demo
  let rotAngle = 0.22;
  let mouseOffset = { x: 0, y: 0 };
  let targetMouse = { x: 0, y: 0 };
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = '60.0';

  // Hardware-Accelerated Retina DPI Support
  let logicalW = 560;
  let logicalH = 340;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    logicalW = rect.width > 0 ? rect.width : 560;
    logicalH = 340;
    canvas.width = Math.round(logicalW * dpr);
    canvas.height = Math.round(logicalH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Interactive subtle parallax on mouse move
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || logicalW;
    const h = rect.height || logicalH;
    targetMouse.x = ((e.clientX - rect.left) / w - 0.5) * 2;
    targetMouse.y = ((e.clientY - rect.top) / h - 0.5) * 2;
  });

  canvas.addEventListener('mouseleave', () => {
    targetMouse.x = 0;
    targetMouse.y = 0;
  });

  function updateTelemetryText() {
    if (!sunlightText) return;
    if (cadView === 'interior') {
      if (mode === 'day') {
        sunlightText.textContent = 'CAD Solar Simulation: 145° Midday Azimuth • Balcony Daylight Penetration: 3.8m • Lux: 84,000';
      } else if (mode === 'sunset') {
        sunlightText.textContent = 'CAD Sunset Vector: 260° Golden Hour • Direct Living Room Coastal Ray Path • Sea Breeze: 14 kts';
      } else {
        sunlightText.textContent = 'CAD Smart Lighting: 3000K Recessed Ceiling Downlights • Concealed LED Cove • 48 dB Acoustic Rating';
      }
    } else {
      if (mode === 'day') {
        sunlightText.textContent = 'Solar Azimuth: 145° (Midday Daylight • Balcony Lux Level: 92,000)';
      } else if (mode === 'sunset') {
        sunlightText.textContent = 'Golden Hour Azimuth: 260° (Sea Breeze Vector: 14 knots West)';
      } else {
        sunlightText.textContent = 'Night Smart Grid: LED Facade Illumination & 38% Energy Savings';
      }
    }
  }

  function setMode(newMode) {
    mode = newMode;
    [simDayBtn, simSunsetBtn, simNightBtn].forEach(b => {
      if (b) b.classList.remove('active');
    });
    if (mode === 'day' && simDayBtn) simDayBtn.classList.add('active');
    else if (mode === 'sunset' && simSunsetBtn) simSunsetBtn.classList.add('active');
    else if (mode === 'night' && simNightBtn) simNightBtn.classList.add('active');
    updateTelemetryText();
  }

  function setCadView(newView) {
    cadView = newView;
    if (cadViewInteriorBtn && cadViewExteriorBtn) {
      if (cadView === 'interior') {
        cadViewInteriorBtn.classList.add('active');
        cadViewInteriorBtn.setAttribute('aria-selected', 'true');
        cadViewExteriorBtn.classList.remove('active');
        cadViewExteriorBtn.setAttribute('aria-selected', 'false');
      } else {
        cadViewExteriorBtn.classList.add('active');
        cadViewExteriorBtn.setAttribute('aria-selected', 'true');
        cadViewInteriorBtn.classList.remove('active');
        cadViewInteriorBtn.setAttribute('aria-selected', 'false');
      }
    }
    updateTelemetryText();
  }

  if (simDayBtn) simDayBtn.addEventListener('click', () => setMode('day'));
  if (simSunsetBtn) simSunsetBtn.addEventListener('click', () => setMode('sunset'));
  if (simNightBtn) simNightBtn.addEventListener('click', () => setMode('night'));

  if (cadViewInteriorBtn) cadViewInteriorBtn.addEventListener('click', () => setCadView('interior'));
  if (cadViewExteriorBtn) cadViewExteriorBtn.addEventListener('click', () => setCadView('exterior'));

  // 3D Isometric Projection Helper
  function project(x, y, z, cx, cy) {
    const cos30 = 0.8660254;
    const rot = rotAngle + mouseOffset.x * 0.20;
    const cosR = Math.cos(rot);
    const sinR = Math.sin(rot);

    const rx = x * cosR - y * sinR;
    const ry = x * sinR + y * cosR;

    const pitch = 0.52 + mouseOffset.y * 0.08;
    const px = cx + (rx - ry) * cos30;
    const py = cy + (rx + ry) * pitch - z;
    return { x: px, y: py };
  }

  // Draw an isometric 3D box with architectural lighting
  function drawIsoBlock(x, y, z, w, d, h, cx, cy, topColor, frontColor, sideColor, strokeColor) {
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

    // Front Face (+Y)
    if (frontColor) {
      ctx.fillStyle = frontColor;
      ctx.beginPath();
      ctx.moveTo(p010.x, p010.y);
      ctx.lineTo(p110.x, p110.y);
      ctx.lineTo(p111.x, p111.y);
      ctx.lineTo(p011.x, p011.y);
      ctx.closePath();
      ctx.fill();
      if (strokeColor) ctx.stroke();
    }

    // Side Face (+X)
    if (sideColor) {
      ctx.fillStyle = sideColor;
      ctx.beginPath();
      ctx.moveTo(p100.x, p100.y);
      ctx.lineTo(p110.x, p110.y);
      ctx.lineTo(p111.x, p111.y);
      ctx.lineTo(p101.x, p101.y);
      ctx.closePath();
      ctx.fill();
      if (strokeColor) ctx.stroke();
    }

    // Top Face (+Z)
    if (topColor) {
      ctx.fillStyle = topColor;
      ctx.beginPath();
      ctx.moveTo(p001.x, p001.y);
      ctx.lineTo(p101.x, p101.y);
      ctx.lineTo(p111.x, p111.y);
      ctx.lineTo(p011.x, p011.y);
      ctx.closePath();
      ctx.fill();
      if (strokeColor) ctx.stroke();
    }
  }

  // Draw high-precision frosted glass architectural CAD label badge
  function drawCADBadge(text, x, y, align = 'center') {
    ctx.save();
    ctx.font = '600 8px -apple-system, BlinkMacSystemFont, "SF Mono", Menlo, monospace';
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    const metrics = ctx.measureText(text);
    const padX = 7;
    const padY = 4;
    const w = metrics.width + padX * 2;
    const h = 15;
    let bx = x;
    if (align === 'center') bx = x - w / 2;
    else if (align === 'right') bx = x - w;
    else if (align === 'left') bx = x;
    const by = y - h / 2;

    // Frosted dark pill background
    ctx.fillStyle = 'rgba(8, 12, 18, 0.92)';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(bx, by, w, h, 3);
    } else {
      ctx.rect(bx, by, w, h);
    }
    ctx.fill();

    // High precision CAD border
    ctx.strokeStyle = 'rgba(223, 183, 108, 0.75)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Text
    ctx.fillStyle = '#dfb76c';
    const textX = align === 'center' ? x : (align === 'right' ? bx + w - padX : bx + padX);
    ctx.fillText(text, textX, y);
    ctx.restore();
  }

  /* -------------------------------------------------------------------------- */
  /* Advanced 3D Interior Architectural CAD Suite Demo                          */
  /* -------------------------------------------------------------------------- */
  function drawInteriorCAD(cx, cy, now) {
    let wallColor, floorColor, floorLineColor, rugColor, rugBorder;
    let sofaBody, sofaShade, sofaTop, sofaWire;
    let marbleTop;

    if (mode === 'day') {
      wallColor = 'rgba(24, 30, 42, 0.95)';
      floorColor = 'rgba(20, 26, 38, 0.9)';
      floorLineColor = 'rgba(223, 183, 108, 0.16)';
      rugColor = 'rgba(38, 48, 68, 0.85)';
      rugBorder = 'rgba(223, 183, 108, 0.6)';
      sofaBody = 'rgba(42, 54, 76, 0.92)';
      sofaShade = 'rgba(28, 38, 56, 0.95)';
      sofaTop = 'rgba(54, 70, 98, 0.9)';
      sofaWire = 'rgba(223, 183, 108, 0.35)';
      marbleTop = 'rgba(240, 245, 252, 0.92)';
    } else if (mode === 'sunset') {
      wallColor = 'rgba(42, 22, 30, 0.95)';
      floorColor = 'rgba(32, 18, 24, 0.92)';
      floorLineColor = 'rgba(255, 180, 80, 0.22)';
      rugColor = 'rgba(64, 32, 42, 0.85)';
      rugBorder = 'rgba(255, 190, 90, 0.7)';
      sofaBody = 'rgba(68, 36, 46, 0.92)';
      sofaShade = 'rgba(48, 24, 32, 0.95)';
      sofaTop = 'rgba(88, 48, 60, 0.9)';
      sofaWire = 'rgba(255, 180, 90, 0.4)';
      marbleTop = 'rgba(255, 235, 215, 0.95)';
    } else { // night
      wallColor = 'rgba(12, 16, 24, 0.98)';
      floorColor = 'rgba(8, 12, 18, 0.96)';
      floorLineColor = 'rgba(41, 151, 255, 0.14)';
      rugColor = 'rgba(18, 24, 36, 0.9)';
      rugBorder = 'rgba(223, 183, 108, 0.45)';
      sofaBody = 'rgba(22, 30, 44, 0.94)';
      sofaShade = 'rgba(14, 20, 30, 0.96)';
      sofaTop = 'rgba(32, 44, 64, 0.92)';
      sofaWire = 'rgba(41, 151, 255, 0.35)';
      marbleTop = 'rgba(215, 225, 240, 0.88)';
    }

    // 1. Structural Sub-Floor Foundation Slab
    drawIsoBlock(-82, -62, -5, 164, 140, 5, cx, cy, '#0d1117', '#080c10', '#040608', 'rgba(255, 255, 255, 0.1)');

    // 2. Main Living Room Polished Italian Statuario Marble Floor
    drawIsoBlock(-80, -60, 0, 160, 100, 1, cx, cy, floorColor, '#0a0d13', '#06080d', 'rgba(255,255,255,0.08)');

    // Precision CAD Marble Tile Grid (Joint lines every 20 units)
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = floorLineColor;
    for (let x = -80; x <= 80; x += 20) {
      const p1 = project(x, -60, 1, cx, cy);
      const p2 = project(x, 40, 1, cx, cy);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    for (let y = -60; y <= 40; y += 20) {
      const p1 = project(-80, y, 1, cx, cy);
      const p2 = project(80, y, 1, cx, cy);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // Statuario Marble Delicate Organic Vein Lines (Subtle Luxury Stone Shading)
    ctx.strokeStyle = mode === 'sunset' ? 'rgba(255, 190, 120, 0.14)' : 'rgba(200, 215, 235, 0.18)';
    ctx.lineWidth = 0.7;
    const mv1 = project(-55, -45, 1.1, cx, cy);
    const mvC1 = project(-25, -15, 1.1, cx, cy);
    const mv2 = project(15, -35, 1.1, cx, cy);
    ctx.beginPath();
    ctx.moveTo(mv1.x, mv1.y);
    ctx.quadraticCurveTo(mvC1.x, mvC1.y, mv2.x, mv2.y);
    ctx.stroke();

    const mv3 = project(-10, 5, 1.1, cx, cy);
    const mvC2 = project(25, 25, 1.1, cx, cy);
    const mv4 = project(55, 10, 1.1, cx, cy);
    ctx.beginPath();
    ctx.moveTo(mv3.x, mv3.y);
    ctx.quadraticCurveTo(mvC2.x, mvC2.y, mv4.x, mv4.y);
    ctx.stroke();

    // 3. Cantilevered Balcony Timber Decking (+40 to +75 on Y, step-down of 1 unit)
    drawIsoBlock(-80, 40, -1, 160, 36, 1, cx, cy, '#1c1510', '#100c08', '#080604', 'rgba(223, 183, 108, 0.2)');
    ctx.strokeStyle = 'rgba(160, 110, 50, 0.35)';
    ctx.lineWidth = 0.8;
    for (let by = 44; by <= 74; by += 6) {
      const bp1 = project(-80, by, 0, cx, cy);
      const bp2 = project(80, by, 0, cx, cy);
      ctx.beginPath();
      ctx.moveTo(bp1.x, bp1.y);
      ctx.lineTo(bp2.x, bp2.y);
      ctx.stroke();
    }

    // 4. Rear Wall (North Wall): Fluted Acoustic Wood Panel & Feature TV Wall
    drawIsoBlock(-80, -64, 0, 160, 4, 82, cx, cy, '#151922', wallColor, '#0a0d13', 'rgba(223, 183, 108, 0.25)');

    // Vertical fluted timber acoustic grooves
    ctx.strokeStyle = mode === 'sunset' ? 'rgba(255, 180, 80, 0.18)' : (mode === 'night' ? 'rgba(41, 151, 255, 0.12)' : 'rgba(223, 183, 108, 0.15)');
    ctx.lineWidth = 0.8;
    for (let fx = -76; fx <= 76; fx += 5) {
      const w1 = project(fx, -60, 2, cx, cy);
      const w2 = project(fx, -60, 80, cx, cy);
      ctx.beginPath();
      ctx.moveTo(w1.x, w1.y);
      ctx.lineTo(w2.x, w2.y);
      ctx.stroke();
    }

    // Left Wall (East Wall): Modern Architectural Cutaway with Accent Niche
    drawIsoBlock(-84, -60, 0, 4, 100, 82, cx, cy, '#151922', '#0a0d13', wallColor, 'rgba(223, 183, 108, 0.25)');

    // Inset Accent Niche on Left Wall
    drawIsoBlock(-83.8, -25, 26, 3.8, 45, 36, cx, cy, '#080b10', '#05070a', '#10141c', '#dfb76c');

    // 3D Projected Contemporary Architectural Art on Left Wall (plane x = -79.9)
    function artPoint(u, v) {
      return project(-79.9, -21 + 38 * u, 29 + 30 * v, cx, cy);
    }
    const aBL = artPoint(0, 0);
    const aBR = artPoint(1, 0);
    const aTR = artPoint(1, 1);
    const aTL = artPoint(0, 1);

    ctx.fillStyle = mode === 'sunset' ? 'rgba(38, 20, 26, 0.95)' : 'rgba(12, 18, 28, 0.95)';
    ctx.beginPath();
    ctx.moveTo(aBL.x, aBL.y);
    ctx.lineTo(aBR.x, aBR.y);
    ctx.lineTo(aTR.x, aTR.y);
    ctx.lineTo(aTL.x, aTL.y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#dfb76c';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Geometric Modernist Art Composition inside frame
    const artDiag1 = artPoint(0.15, 0.15);
    const artDiag2 = artPoint(0.85, 0.85);
    ctx.strokeStyle = mode === 'sunset' ? 'rgba(255, 180, 80, 0.5)' : 'rgba(41, 151, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(artDiag1.x, artDiag1.y);
    ctx.lineTo(artDiag2.x, artDiag2.y);
    ctx.stroke();

    const artCircle = artPoint(0.5, 0.5);
    ctx.strokeStyle = '#dfb76c';
    ctx.beginPath();
    ctx.arc(artCircle.x, artCircle.y, 6, 0, Math.PI * 2);
    ctx.stroke();

    // 5. Center Marble TV Feature Slab & Concealed Architectural Cove Lighting
    if (mode === 'night') {
      // Linear Cove wash above TV onto fluted timber wall
      const glowTopL = project(-32, -59.5, 78, cx, cy);
      const glowTopR = project(32, -59.5, 78, cx, cy);
      const glowBotR = project(32, -59.5, 58, cx, cy);
      const glowBotL = project(-32, -59.5, 58, cx, cy);
      const coveGradTop = ctx.createLinearGradient(
        (glowBotL.x + glowBotR.x) / 2, (glowBotL.y + glowBotR.y) / 2,
        (glowTopL.x + glowTopR.x) / 2, (glowTopL.y + glowTopR.y) / 2
      );
      coveGradTop.addColorStop(0, 'rgba(223, 183, 108, 0.45)');
      coveGradTop.addColorStop(0.5, 'rgba(223, 183, 108, 0.18)');
      coveGradTop.addColorStop(1, 'transparent');
      ctx.fillStyle = coveGradTop;
      ctx.beginPath();
      ctx.moveTo(glowBotL.x, glowBotL.y);
      ctx.lineTo(glowBotR.x, glowBotR.y);
      ctx.lineTo(glowTopR.x, glowTopR.y);
      ctx.lineTo(glowTopL.x, glowTopL.y);
      ctx.closePath();
      ctx.fill();

      // Linear Cove wash below TV onto credenza
      const coveBotL = project(-30, -59.5, 26, cx, cy);
      const coveBotR = project(30, -59.5, 26, cx, cy);
      const coveLowR = project(30, -59.5, 17, cx, cy);
      const coveLowL = project(-30, -59.5, 17, cx, cy);
      const coveGradBot = ctx.createLinearGradient(
        (coveBotL.x + coveBotR.x) / 2, (coveBotL.y + coveBotR.y) / 2,
        (coveLowL.x + coveLowR.x) / 2, (coveLowL.y + coveLowR.y) / 2
      );
      coveGradBot.addColorStop(0, 'rgba(223, 183, 108, 0.35)');
      coveGradBot.addColorStop(1, 'transparent');
      ctx.fillStyle = coveGradBot;
      ctx.beginPath();
      ctx.moveTo(coveBotL.x, coveBotL.y);
      ctx.lineTo(coveBotR.x, coveBotR.y);
      ctx.lineTo(coveLowR.x, coveLowR.y);
      ctx.lineTo(coveLowL.x, coveLowL.y);
      ctx.closePath();
      ctx.fill();
    }

    // Inset Statuario Marble Panel on TV Wall
    drawIsoBlock(-38, -59.5, 18, 76, 1.5, 48, cx, cy, marbleTop, '#e2e7ef', '#ccd3e0', 'rgba(223, 183, 108, 0.45)');

    // 75" 4K OLED Ultra-Thin Display Panel Bezel
    drawIsoBlock(-26, -58.2, 26, 52, 1.2, 32, cx, cy, '#020305', '#020305', '#05070a', '#dfb76c');

    // 3D Parametric OLED Display Surface (mounted on front face y = -57.0)
    function tvPoint(u, v) {
      return project(-25 + 50 * u, -57.0, 27 + 30 * v, cx, cy);
    }
    const scrBL = tvPoint(0, 0);
    const scrBR = tvPoint(1, 0);
    const scrTR = tvPoint(1, 1);
    const scrTL = tvPoint(0, 1);

    ctx.fillStyle = '#03060a';
    ctx.beginPath();
    ctx.moveTo(scrBL.x, scrBL.y);
    ctx.lineTo(scrBR.x, scrBR.y);
    ctx.lineTo(scrTR.x, scrTR.y);
    ctx.lineTo(scrTL.x, scrTL.y);
    ctx.closePath();
    ctx.fill();

    // 3D Projected BIM Blueprint Grid on OLED Screen
    ctx.strokeStyle = 'rgba(41, 151, 255, 0.22)';
    ctx.lineWidth = 0.6;
    for (let v = 0.2; v <= 0.85; v += 0.2) {
      const p1 = tvPoint(0.04, v);
      const p2 = tvPoint(0.96, v);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    for (let u = 0.2; u <= 0.85; u += 0.2) {
      const p1 = tvPoint(u, 0.05);
      const p2 = tvPoint(u, 0.95);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // 3D Projected BIM Blueprint Floorplan Diagram on Screen
    ctx.strokeStyle = '#2997ff';
    ctx.lineWidth = 1;
    const bp1 = tvPoint(0.12, 0.16);
    const bp2 = tvPoint(0.88, 0.16);
    const bp3 = tvPoint(0.88, 0.82);
    const bp4 = tvPoint(0.12, 0.82);
    ctx.beginPath();
    ctx.moveTo(bp1.x, bp1.y);
    ctx.lineTo(bp2.x, bp2.y);
    ctx.lineTo(bp3.x, bp3.y);
    ctx.lineTo(bp4.x, bp4.y);
    ctx.closePath();
    ctx.stroke();

    // Inner suite subdivision vectors
    ctx.strokeStyle = '#dfb76c';
    ctx.lineWidth = 0.8;
    const sub1 = tvPoint(0.12, 0.52);
    const sub2 = tvPoint(0.60, 0.52);
    const sub3 = tvPoint(0.60, 0.16);
    ctx.beginPath();
    ctx.moveTo(sub1.x, sub1.y);
    ctx.lineTo(sub2.x, sub2.y);
    ctx.lineTo(sub3.x, sub3.y);
    ctx.stroke();

    // Telemetry Pulsing Status Indicator on Screen
    const tPulse = (Math.sin(now * 0.006) + 1) * 0.5;
    const tLed = tvPoint(0.14, 0.90);
    ctx.fillStyle = `rgba(48, 209, 88, ${0.6 + tPulse * 0.4})`;
    ctx.beginPath();
    ctx.arc(tLed.x, tLed.y, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '600 6.5px -apple-system, BlinkMacSystemFont, "SF Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.textAlign = 'left';
    ctx.fillText('BIM v4.2 LIVE CAD', tLed.x + 6, tLed.y + 2);

    // Floating Media Console Credenza
    drawIsoBlock(-34, -58, 8, 68, 10, 9, cx, cy, '#18202d', '#101520', '#0a0d14', 'rgba(223, 183, 108, 0.4)');

    // Under-Credenza Ambient Soft Floor Pool
    if (mode === 'night') {
      const ugL = project(-32, -54, 0.5, cx, cy);
      const ugR = project(32, -54, 0.5, cx, cy);
      const ugGrad = ctx.createLinearGradient(ugL.x, ugL.y, ugR.x, ugR.y);
      ugGrad.addColorStop(0, 'rgba(223, 183, 108, 0.12)');
      ugGrad.addColorStop(0.5, 'rgba(223, 183, 108, 0.32)');
      ugGrad.addColorStop(1, 'rgba(223, 183, 108, 0.12)');
      ctx.fillStyle = ugGrad;
      const ugF1 = project(-32, -48, 0.5, cx, cy);
      const ugF2 = project(32, -48, 0.5, cx, cy);
      ctx.beginPath();
      ctx.moveTo(ugL.x, ugL.y);
      ctx.lineTo(ugR.x, ugR.y);
      ctx.lineTo(ugF2.x, ugF2.y);
      ctx.lineTo(ugF1.x, ugF1.y);
      ctx.closePath();
      ctx.fill();
    }

    // 6. Panoramic Floor-to-Ceiling Balcony Sliding Portal (at Y = 40)
    drawIsoBlock(-80, 39, 0, 3, 2, 78, cx, cy, '#444c5a', '#2a3240', '#181e28', '#86868b');
    drawIsoBlock(77, 39, 0, 3, 2, 78, cx, cy, '#444c5a', '#2a3240', '#181e28', '#86868b');
    drawIsoBlock(-80, 39, 76, 160, 2, 3, cx, cy, '#444c5a', '#2a3240', '#181e28', '#86868b');
    drawIsoBlock(-1, 39, 0, 2, 2, 76, cx, cy, '#444c5a', '#2a3240', '#181e28', '#86868b');

    // Acoustic Double Glazed Glass Panes (Semi-transparent)
    const glassP1 = project(-77, 40, 2, cx, cy);
    const glassP2 = project(77, 40, 2, cx, cy);
    const glassP3 = project(77, 40, 75, cx, cy);
    const glassP4 = project(-77, 40, 75, cx, cy);
    ctx.fillStyle = mode === 'day' ? 'rgba(120, 200, 255, 0.12)' : (mode === 'sunset' ? 'rgba(255, 180, 90, 0.15)' : 'rgba(41, 151, 255, 0.08)');
    ctx.beginPath();
    ctx.moveTo(glassP1.x, glassP1.y);
    ctx.lineTo(glassP2.x, glassP2.y);
    ctx.lineTo(glassP3.x, glassP3.y);
    ctx.lineTo(glassP4.x, glassP4.y);
    ctx.closePath();
    ctx.fill();

    // Specular diagonal reflection on glass
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const gRefl1 = project(-30, 40, 15, cx, cy);
    const gRefl2 = project(20, 40, 68, cx, cy);
    ctx.moveTo(gRefl1.x, gRefl1.y);
    ctx.lineTo(gRefl2.x, gRefl2.y);
    ctx.stroke();

    // 7. Cantilevered Glass Balustrade on Balcony Perimeter (at Y = 75)
    const balP1 = project(-80, 75, 0, cx, cy);
    const balP2 = project(80, 75, 0, cx, cy);
    const balP3 = project(80, 75, 28, cx, cy);
    const balP4 = project(-80, 75, 28, cx, cy);
    ctx.fillStyle = 'rgba(100, 210, 255, 0.16)';
    ctx.beginPath();
    ctx.moveTo(balP1.x, balP1.y);
    ctx.lineTo(balP2.x, balP2.y);
    ctx.lineTo(balP3.x, balP3.y);
    ctx.lineTo(balP4.x, balP4.y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#dfb76c';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(balP4.x, balP4.y);
    ctx.lineTo(balP3.x, balP3.y);
    ctx.stroke();

    // Horizon Sea Sightline Gradient beyond Balcony Glass
    const seaP1 = project(-80, 75, 12, cx, cy);
    const seaP2 = project(80, 75, 12, cx, cy);
    ctx.strokeStyle = mode === 'sunset' ? 'rgba(255, 160, 80, 0.4)' : (mode === 'night' ? 'rgba(41, 151, 255, 0.25)' : 'rgba(100, 190, 255, 0.35)');
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(seaP1.x, seaP1.y);
    ctx.lineTo(seaP2.x, seaP2.y);
    ctx.stroke();

    // Outdoor Balcony Lounger / Sunbed
    drawIsoBlock(30, 46, 0, 36, 18, 7, cx, cy, '#45352c', '#2e211a', '#1a120e', 'rgba(223, 183, 108, 0.4)');
    drawIsoBlock(56, 46, 7, 10, 18, 5, cx, cy, '#dfb76c', '#b8944d', '#7d6129', '#ffe5a3');

    // 8. Luxury Designer Area Rug
    const rugP1 = project(-48, -34, 1.2, cx, cy);
    const rugP2 = project(36, -34, 1.2, cx, cy);
    const rugP3 = project(36, 26, 1.2, cx, cy);
    const rugP4 = project(-48, 26, 1.2, cx, cy);
    ctx.fillStyle = rugColor;
    ctx.beginPath();
    ctx.moveTo(rugP1.x, rugP1.y);
    ctx.lineTo(rugP2.x, rugP2.y);
    ctx.lineTo(rugP3.x, rugP3.y);
    ctx.lineTo(rugP4.x, rugP4.y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = rugBorder;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 9. L-Shaped Sectional Lounge Sofa
    drawIsoBlock(-42, -26, 1.5, 68, 20, 11, cx, cy, sofaTop, sofaBody, sofaShade, sofaWire);
    drawIsoBlock(-42, -6, 1.5, 22, 28, 11, cx, cy, sofaTop, sofaBody, sofaShade, sofaWire);

    // Seating Cushions
    drawIsoBlock(-41, -25, 12.5, 66, 18, 3.5, cx, cy, sofaTop, sofaBody, sofaShade, 'rgba(223, 183, 108, 0.4)');
    drawIsoBlock(-41, -7, 12.5, 20, 26, 3.5, cx, cy, sofaTop, sofaBody, sofaShade, 'rgba(223, 183, 108, 0.4)');

    // Backrests with Soft Piping Lines
    drawIsoBlock(-44, -28, 12.5, 72, 5, 16, cx, cy, sofaTop, sofaBody, sofaShade, sofaWire);
    drawIsoBlock(-44, -28, 12.5, 5, 50, 16, cx, cy, sofaTop, sofaBody, sofaShade, sofaWire);

    // Decorative Accent Cushions
    drawIsoBlock(-14, -24, 16, 10, 3, 9, cx, cy, '#dfb76c', '#b8944d', '#7d6129', '#ffe5a3');
    drawIsoBlock(8, -24, 16, 10, 3, 9, cx, cy, '#2c3545', '#1e2430', '#12161e', 'rgba(255,255,255,0.3)');
    drawIsoBlock(-41, 6, 16, 3, 10, 9, cx, cy, '#dfb76c', '#b8944d', '#7d6129', '#ffe5a3');

    // 10. Sculptural Dual Coffee Table (Italian Statuario Marble + Smoked Bronze Glass)
    drawIsoBlock(-6, -4, 1.5, 26, 16, 9.5, cx, cy, marbleTop, '#ccd3df', '#aeb7c6', '#dfb76c');
    drawIsoBlock(-7, -5, 10, 28, 18, 1.2, cx, cy, '#dfb76c', '#b8944d', '#7d6129', '#ffe5a3');
    drawIsoBlock(14, 10, 1.5, 18, 18, 6.5, cx, cy, 'rgba(100, 180, 220, 0.5)', '#1e2e3e', '#121c26', '#dfb76c');

    // Accessories: Architectural Monograph
    drawIsoBlock(-1, 0, 11.2, 9, 7, 1.2, cx, cy, '#dfb76c', '#9e7e38', '#5e481c', '#ffe5a3');

    // 11. Minimalist Architectural Arc Floor Lamp
    drawIsoBlock(-66, -48, 1.5, 8, 8, 2.5, cx, cy, '#dfb76c', '#b8944d', '#7d6129', '#ffe5a3');
    const lampB = project(-62, -44, 4, cx, cy);
    const lampTop = project(-48, -32, 70, cx, cy);
    const lampHead = project(-28, -16, 52, cx, cy);
    ctx.strokeStyle = '#dfb76c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lampB.x, lampB.y);
    ctx.quadraticCurveTo(lampTop.x, lampTop.y, lampHead.x, lampHead.y);
    ctx.stroke();

    // 3D Lamp Head Dome Shade
    ctx.fillStyle = '#dfb76c';
    ctx.beginPath();
    ctx.arc(lampHead.x, lampHead.y, 6, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffe5a3';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 240, 200, 0.9)';
    ctx.beginPath();
    ctx.ellipse(lampHead.x, lampHead.y, 6, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 12. Architectural Indoor Planter (Monstera Foliage in 3D)
    drawIsoBlock(64, -48, 1.5, 12, 12, 18, cx, cy, '#28303e', '#1c222c', '#10141b', '#dfb76c');
    drawIsoBlock(65, -47, 19, 10, 10, 0.5, cx, cy, '#15110c', '#0d0a07', '#080604', 'transparent');

    const plantRoot = project(70, -42, 19.5, cx, cy);
    const leaves = [
      { tipX: 62, tipY: -36, tipZ: 33, w: 5, col: mode === 'sunset' ? '#4d7034' : '#289e47' },
      { tipX: 74, tipY: -34, tipZ: 37, w: 6, col: mode === 'sunset' ? '#5a823e' : '#30d158' },
      { tipX: 77, tipY: -44, tipZ: 32, w: 5, col: mode === 'sunset' ? '#3d5c28' : '#23823c' },
      { tipX: 64, tipY: -50, tipZ: 28, w: 4, col: mode === 'sunset' ? '#355022' : '#1e6e32' },
      { tipX: 70, tipY: -40, tipZ: 42, w: 6, col: mode === 'sunset' ? '#689447' : '#36db62' }
    ];

    leaves.forEach(leaf => {
      const tip = project(leaf.tipX, leaf.tipY, leaf.tipZ, cx, cy);
      const midX = (70 + leaf.tipX) / 2;
      const midY = (-42 + leaf.tipY) / 2;
      const midZ = (19.5 + leaf.tipZ) / 2 + 4;
      const mid = project(midX, midY, midZ, cx, cy);

      ctx.strokeStyle = '#23592d';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(plantRoot.x, plantRoot.y);
      ctx.quadraticCurveTo(mid.x, mid.y, tip.x, tip.y);
      ctx.stroke();

      const leafLeft = { x: mid.x - leaf.w, y: mid.y };
      const leafRight = { x: mid.x + leaf.w, y: mid.y };

      ctx.fillStyle = leaf.col;
      ctx.beginPath();
      ctx.moveTo(mid.x, mid.y - leaf.w * 0.5);
      ctx.lineTo(leafRight.x, leafRight.y);
      ctx.lineTo(tip.x, tip.y);
      ctx.lineTo(leafLeft.x, leafLeft.y);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(mid.x, mid.y - leaf.w * 0.5);
      ctx.lineTo(tip.x, tip.y);
      ctx.stroke();
    });

    // 13. Dynamic Lighting Physics Overlays
    if (mode === 'day') {
      const s1 = project(-70, 40, 0, cx, cy);
      const s2 = project(70, 40, 0, cx, cy);
      const s3 = project(45, -15, 0, cx, cy);
      const s4 = project(-45, -5, 0, cx, cy);
      ctx.fillStyle = 'rgba(255, 250, 220, 0.16)';
      ctx.beginPath();
      ctx.moveTo(s1.x, s1.y);
      ctx.lineTo(s2.x, s2.y);
      ctx.lineTo(s3.x, s3.y);
      ctx.lineTo(s4.x, s4.y);
      ctx.closePath();
      ctx.fill();
    } else if (mode === 'sunset') {
      const s1 = project(-80, 40, 0, cx, cy);
      const s2 = project(80, 40, 0, cx, cy);
      const s3 = project(20, -50, 0, cx, cy);
      const s4 = project(-80, -30, 0, cx, cy);
      ctx.fillStyle = 'rgba(255, 160, 60, 0.28)';
      ctx.beginPath();
      ctx.moveTo(s1.x, s1.y);
      ctx.lineTo(s2.x, s2.y);
      ctx.lineTo(s3.x, s3.y);
      ctx.lineTo(s4.x, s4.y);
      ctx.closePath();
      ctx.fill();
    } else {
      // 4 Photometric Downward Ceiling Spotlights
      [-50, -15, 20, 55].forEach(spotX => {
        const lightP = project(spotX, -20, 78, cx, cy);
        const floorP = project(spotX, -20, 1, cx, cy);
        const spotGrad = ctx.createLinearGradient(lightP.x, lightP.y, floorP.x, floorP.y);
        spotGrad.addColorStop(0, 'rgba(255, 225, 160, 0.22)');
        spotGrad.addColorStop(0.7, 'rgba(255, 225, 160, 0.06)');
        spotGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = spotGrad;
        ctx.beginPath();
        ctx.moveTo(lightP.x, lightP.y);
        ctx.lineTo(floorP.x - 24, floorP.y + 6);
        ctx.lineTo(floorP.x + 24, floorP.y - 6);
        ctx.closePath();
        ctx.fill();
      });

      const spot1 = project(0, 0, 0, cx, cy);
      const spotGrad = ctx.createRadialGradient(spot1.x, spot1.y, 4, spot1.x, spot1.y, 55);
      spotGrad.addColorStop(0, 'rgba(255, 230, 180, 0.35)');
      spotGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.ellipse(spot1.x, spot1.y, 55, 28, -0.25, 0, Math.PI * 2);
      ctx.fill();

      const lampPool = project(-28, -16, 0, cx, cy);
      const lampGrad = ctx.createRadialGradient(lampPool.x, lampPool.y, 4, lampPool.x, lampPool.y, 40);
      lampGrad.addColorStop(0, 'rgba(223, 183, 108, 0.38)');
      lampGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = lampGrad;
      ctx.beginPath();
      ctx.ellipse(lampPool.x, lampPool.y, 40, 20, -0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // 14. Architectural CAD Dimension Lines with Frosted Glass Badges (Zero Collisions)
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#dfb76c';
    ctx.fillStyle = '#dfb76c';

    // A. Room Width Dimension Line (Living Axis) - Placed in Clean Front Margin (y = 86)
    const dimW1 = project(-80, 86, 0, cx, cy);
    const dimW2 = project(80, 86, 0, cx, cy);
    ctx.beginPath();
    ctx.moveTo(dimW1.x, dimW1.y);
    ctx.lineTo(dimW2.x, dimW2.y);
    ctx.stroke();

    // Witness Extension Ticks
    const dimW1_Ext = project(-80, 78, 0, cx, cy);
    const dimW2_Ext = project(80, 78, 0, cx, cy);
    ctx.beginPath();
    ctx.moveTo(dimW1_Ext.x, dimW1_Ext.y);
    ctx.lineTo(dimW1.x, dimW1.y);
    ctx.moveTo(dimW2_Ext.x, dimW2_Ext.y);
    ctx.lineTo(dimW2.x, dimW2.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(dimW1.x, dimW1.y, 2, 0, Math.PI * 2);
    ctx.arc(dimW2.x, dimW2.y, 2, 0, Math.PI * 2);
    ctx.fill();

    drawCADBadge('↔ 5.40m [LIVING AXIS]', (dimW1.x + dimW2.x) / 2, (dimW1.y + dimW2.y) / 2 + 12, 'center');

    // B. Room Depth Dimension Line - In Clean Right Margin (x = 94, y = -60 to 40)
    const dimD1 = project(94, -60, 0, cx, cy);
    const dimD2 = project(94, 40, 0, cx, cy);
    ctx.beginPath();
    ctx.moveTo(dimD1.x, dimD1.y);
    ctx.lineTo(dimD2.x, dimD2.y);
    ctx.stroke();

    const dimD1_Ext = project(82, -60, 0, cx, cy);
    const dimD2_Ext = project(82, 40, 0, cx, cy);
    ctx.beginPath();
    ctx.moveTo(dimD1_Ext.x, dimD1_Ext.y);
    ctx.lineTo(dimD1.x, dimD1.y);
    ctx.moveTo(dimD2_Ext.x, dimD2_Ext.y);
    ctx.lineTo(dimD2.x, dimD2.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(dimD1.x, dimD1.y, 2, 0, Math.PI * 2);
    ctx.arc(dimD2.x, dimD2.y, 2, 0, Math.PI * 2);
    ctx.fill();

    drawCADBadge('↕ 4.20m [DEPTH]', (dimD1.x + dimD2.x) / 2 + 38, (dimD1.y + dimD2.y) / 2, 'center');

    // C. Balcony Depth Dimension Line - In Right Margin (x = 94, y = 40 to 75)
    const dimB1 = project(94, 40, 0, cx, cy);
    const dimB2 = project(94, 75, 0, cx, cy);
    ctx.beginPath();
    ctx.moveTo(dimB1.x, dimB1.y);
    ctx.lineTo(dimB2.x, dimB2.y);
    ctx.stroke();

    const dimB2_Ext = project(82, 75, 0, cx, cy);
    ctx.beginPath();
    ctx.moveTo(dimB2_Ext.x, dimB2_Ext.y);
    ctx.lineTo(dimB2.x, dimB2.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(dimB1.x, dimB1.y, 2, 0, Math.PI * 2);
    ctx.arc(dimB2.x, dimB2.y, 2, 0, Math.PI * 2);
    ctx.fill();

    drawCADBadge('↕ 2.10m [TERRACE]', (dimB1.x + dimB2.x) / 2 + 42, (dimB1.y + dimB2.y) / 2, 'center');

    // D. Clear Ceiling Height Dimension Line - In Left Margin (x = -96, y = -60, z = 0 to 82)
    const dimH1 = project(-96, -60, 0, cx, cy);
    const dimH2 = project(-96, -60, 82, cx, cy);
    ctx.beginPath();
    ctx.moveTo(dimH1.x, dimH1.y);
    ctx.lineTo(dimH2.x, dimH2.y);
    ctx.stroke();

    const dimH1_Ext = project(-86, -60, 0, cx, cy);
    const dimH2_Ext = project(-86, -60, 82, cx, cy);
    ctx.beginPath();
    ctx.moveTo(dimH1_Ext.x, dimH1_Ext.y);
    ctx.lineTo(dimH1.x, dimH1.y);
    ctx.moveTo(dimH2_Ext.x, dimH2_Ext.y);
    ctx.lineTo(dimH2.x, dimH2.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(dimH1.x, dimH1.y, 2, 0, Math.PI * 2);
    ctx.arc(dimH2.x, dimH2.y, 2, 0, Math.PI * 2);
    ctx.fill();

    drawCADBadge('↑ 3.15m CLEAR', dimH1.x - 38, (dimH1.y + dimH2.y) / 2, 'center');

    // E. Material Specification Callouts with Clean Leader Lines
    // Tag 1: Statuario Marble Floor
    const tagFloorTarget = project(-45, 12, 1, cx, cy);
    const tagFloorBadgePos = project(-68, 30, 1, cx, cy);
    ctx.strokeStyle = 'rgba(223, 183, 108, 0.6)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(tagFloorTarget.x, tagFloorTarget.y);
    ctx.lineTo(tagFloorBadgePos.x, tagFloorBadgePos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(tagFloorTarget.x, tagFloorTarget.y, 2, 0, Math.PI * 2);
    ctx.fill();
    drawCADBadge('[M-01: STATUARIO MARBLE]', tagFloorBadgePos.x - 4, tagFloorBadgePos.y, 'right');

    // Tag 2: Fluted Walnut Acoustic Wall (above wall to prevent overlap)
    const tagWallTarget = project(-65, -60, 68, cx, cy);
    const tagWallBadgePos = project(-65, -60, 88, cx, cy);
    ctx.beginPath();
    ctx.moveTo(tagWallTarget.x, tagWallTarget.y);
    ctx.lineTo(tagWallBadgePos.x, tagWallBadgePos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(tagWallTarget.x, tagWallTarget.y, 2, 0, Math.PI * 2);
    ctx.fill();
    drawCADBadge('[W-02: FLUTED WALNUT]', tagWallBadgePos.x, tagWallBadgePos.y - 8, 'center');

    // Tag 3: Low-E DGU Balcony Glass
    const tagGlassTarget = project(20, 40, 50, cx, cy);
    const tagGlassBadgePos = project(35, 40, 72, cx, cy);
    ctx.beginPath();
    ctx.moveTo(tagGlassTarget.x, tagGlassTarget.y);
    ctx.lineTo(tagGlassBadgePos.x, tagGlassBadgePos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(tagGlassTarget.x, tagGlassTarget.y, 2, 0, Math.PI * 2);
    ctx.fill();
    drawCADBadge('[G-01: LOW-E DGU GLASS]', tagGlassBadgePos.x, tagGlassBadgePos.y - 8, 'center');

    // 15. Technical Architectural HUD Headers
    ctx.font = '600 9px -apple-system, BlinkMacSystemFont, "SF Mono", Menlo, monospace';
    ctx.fillStyle = 'rgba(223, 183, 108, 0.95)';
    ctx.textAlign = 'left';
    ctx.fillText('ROHAN CITY INTERIOR CAD • 12°52\'N 74°50\'E', 16, 20);

    ctx.font = '400 9px -apple-system, BlinkMacSystemFont, "SF Mono", Menlo, monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('SUITE 1402 (3BHK MASTER LIVING & BALCONY) | SCALE 1:50', 16, 34);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#30d158';
    ctx.fillText(`${fps} FPS`, logicalW - 16, 20);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fillText('ACOUSTIC: 48 dB | THERMAL: 94.2%', logicalW - 16, 34);

    // Bottom telemetry
    const deg = Math.round((rotAngle + mouseOffset.x * 0.20) * 180 / Math.PI);
    const pitchDeg = Math.round((0.52 + mouseOffset.y * 0.08) * 100);
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(223, 183, 108, 0.85)';
    ctx.fillText(`ORBIT: ${deg}° | PITCH: ${pitchDeg}% | REAL-TIME MOUSE TILT & ROTATION`, 16, logicalH - 12);
  }

  /* -------------------------------------------------------------------------- */
  /* Structural Tower Exterior Digital Twin Rendering                           */
  /* -------------------------------------------------------------------------- */
  function drawExteriorTwin(cx, cy, now) {
    // Ground Grid
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

    // 1. Commercial Podium Base
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

    // 4. Rooftop Architectural Spire & Beacon
    const spireTop = project(-40, -22, 178, cx, cy);
    const spireBase = project(-40, -22, 166, cx, cy);
    ctx.strokeStyle = '#dfb76c';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(spireBase.x, spireBase.y);
    ctx.lineTo(spireTop.x, spireTop.y);
    ctx.stroke();

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

      const flareGrad = ctx.createRadialGradient(sunPos.x, sunPos.y, 2, sunPos.x, sunPos.y, 40);
      flareGrad.addColorStop(0, mode === 'day' ? 'rgba(255, 250, 220, 0.9)' : 'rgba(255, 180, 80, 0.9)');
      flareGrad.addColorStop(0.3, mode === 'day' ? 'rgba(255, 220, 140, 0.3)' : 'rgba(255, 120, 50, 0.3)');
      flareGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = flareGrad;
      ctx.beginPath();
      ctx.arc(sunPos.x, sunPos.y, 40, 0, Math.PI * 2);
      ctx.fill();

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
    ctx.fillText(`${fps} FPS`, logicalW - 16, 22);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText('HARDWARE ACCELERATED', logicalW - 16, 36);
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

    ctx.clearRect(0, 0, logicalW, logicalH);

    // Atmospheric Backdrop
    const sky = ctx.createRadialGradient(logicalW / 2, logicalH * 0.4, 40, logicalW / 2, logicalH / 2, logicalW);
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
    ctx.fillRect(0, 0, logicalW, logicalH);

    const cx = logicalW / 2;
    const cy = 195;

    if (cadView === 'interior') {
      drawInteriorCAD(cx, cy, now);
    } else {
      drawExteriorTwin(cx, cy, now);
    }

    if (isCanvasVisible) {
      animationFrameId = requestAnimationFrame(draw);
    }
  }

  let isCanvasVisible = true;
  let animationFrameId = null;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const wasVisible = isCanvasVisible;
        isCanvasVisible = entry.isIntersecting;
        if (!wasVisible && isCanvasVisible) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(draw);
        }
      });
    }, { threshold: 0.05 });
    observer.observe(canvas);
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

/* -------------------------------------------------------------------------- */
/* 10. Executive Profit & Loss (P&L) Profile System                            */
/* -------------------------------------------------------------------------- */
function initPnlProfile() {
  const pnlSection = document.getElementById('pnl-profile');
  if (!pnlSection) return;

  const btnDeveloper = document.getElementById('pnlBtnDeveloper');
  const btnInvestor = document.getElementById('pnlBtnInvestor');
  const titleElem = document.getElementById('pnlActiveTitle');
  const baseLabel = document.getElementById('pnlPortfolioBaseLabel');
  const marginBadge = document.getElementById('pnlNetMarginBadge');
  const tableBody = document.getElementById('pnlTableBody');
  const canvas = document.getElementById('pnlWaterfallCanvas');

  const portfolioRange = document.getElementById('portfolioRange');
  const priceRange = document.getElementById('priceRange');
  const rateRange = document.getElementById('rateRange');

  let activeMode = 'developer'; // 'developer' or 'investor'

  function renderDeveloperPnl() {
    const cr = portfolioRange ? parseFloat(portfolioRange.value) : 1500;
    if (titleElem) titleElem.textContent = 'Developer Venture P&L Statement';
    if (baseLabel) baseLabel.textContent = `₹ ${cr.toLocaleString('en-IN')} Crores GDV Portfolio`;

    // Dynamic metrics
    const gdvGain = cr * 0.142; // +14.2% AI dynamic tranche alpha
    const forexGain = (cr * 0.65) * 0.037; // +3.7% NRI forex recapture
    const grossRevLegacy = cr;
    const grossRevHrl = cr + gdvGain + forexGain;

    const epcLegacy = cr * 0.44; // 44.0%
    const epcHrl = cr * 0.415; // 41.5% (-2.5% MIVAN / supply chain optimization)

    const landLegacy = cr * 0.20; // 20%
    const landHrl = cr * 0.18; // 18% (-2.0% clearance savings)

    const salesLegacy = cr * 0.055; // 5.5%
    const salesHrl = cr * 0.022; // 2.2% AI Concierge

    const financeLegacy = cr * 0.08; // 8.0%
    const financeHrl = cr * 0.045; // 4.5% 21-day escrow cycle

    const outflowsLegacy = epcLegacy + landLegacy + salesLegacy + financeLegacy;
    const outflowsHrl = epcHrl + landHrl + salesHrl + financeHrl;

    const ebitdaLegacy = grossRevLegacy - outflowsLegacy;
    const ebitdaHrl = grossRevHrl - outflowsHrl;

    const marginLegacy = (ebitdaLegacy / grossRevLegacy) * 100;
    const marginHrl = (ebitdaHrl / grossRevHrl) * 100;
    const marginLift = marginHrl - marginLegacy;

    if (marginBadge) {
      marginBadge.textContent = `${marginHrl.toFixed(1)}% Net Margin (+${marginLift.toFixed(1)}% Lift)`;
    }

    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td><strong>Gross Sales Realization (Base Portfolio GDV)</strong></td>
          <td style="text-align: right;">₹ ${cr.toFixed(1)} Cr</td>
          <td style="text-align: right; color: #ffffff;">₹ ${cr.toFixed(1)} Cr</td>
          <td style="text-align: right;"><span class="pnl-alpha-dash">—</span></td>
        </tr>
        <tr>
          <td>Algorithmic Dynamic Pricing (+14.2% AI Tranche Lift)</td>
          <td style="text-align: right; color: rgba(255,255,255,0.4);">₹ 0.0 Cr (Flat)</td>
          <td style="text-align: right; color: var(--gold-primary);">+₹ ${gdvGain.toFixed(1)} Cr</td>
          <td style="text-align: right;"><span class="pnl-credit">+₹ ${gdvGain.toFixed(1)} Cr (+14.2%)</span></td>
        </tr>
        <tr>
          <td>NRI Direct Forex Settlement (+3.7% Arbitrage Hedged)</td>
          <td style="text-align: right; color: #ff453a;">-₹ ${forexGain.toFixed(1)} Cr (Leakage)</td>
          <td style="text-align: right; color: #30d158;">+₹ ${forexGain.toFixed(1)} Cr (Recaptured)</td>
          <td style="text-align: right;"><span class="pnl-credit">+₹ ${forexGain.toFixed(1)} Cr (Protected)</span></td>
        </tr>
        <tr class="pnl-row-subtotal">
          <td><strong>Subtotal: Effective Gross Revenue</strong></td>
          <td style="text-align: right; color: rgba(255,255,255,0.7);">₹ ${grossRevLegacy.toFixed(1)} Cr</td>
          <td style="text-align: right; color: var(--gold-champagne);"><strong>₹ ${grossRevHrl.toFixed(1)} Cr</strong></td>
          <td style="text-align: right;"><span class="pnl-credit">+₹ ${(grossRevHrl - grossRevLegacy).toFixed(1)} Cr (+${(((grossRevHrl - grossRevLegacy) / grossRevLegacy) * 100).toFixed(1)}%)</span></td>
        </tr>
        <tr>
          <td>Civil & Structural EPC Hard Costs (MIVAN / IoT Precast)</td>
          <td style="text-align: right; color: #ff453a;">-₹ ${epcLegacy.toFixed(1)} Cr (44.0%)</td>
          <td style="text-align: right; color: #ff6961;">-₹ ${epcHrl.toFixed(1)} Cr (41.5%)</td>
          <td style="text-align: right;"><span class="pnl-credit">+₹ ${(epcLegacy - epcHrl).toFixed(1)} Cr (-2.5% Optimized)</span></td>
        </tr>
        <tr>
          <td>Land Acquisition, Entitlements & Fast-Track RERA</td>
          <td style="text-align: right; color: #ff453a;">-₹ ${landLegacy.toFixed(1)} Cr (20.0%)</td>
          <td style="text-align: right; color: #ff6961;">-₹ ${landHrl.toFixed(1)} Cr (18.0%)</td>
          <td style="text-align: right;"><span class="pnl-credit">+₹ ${(landLegacy - landHrl).toFixed(1)} Cr (-2.0% Expedited)</span></td>
        </tr>
        <tr>
          <td>Sales, Institutional Marketing & Broker Commission</td>
          <td style="text-align: right; color: #ff453a;">-₹ ${salesLegacy.toFixed(1)} Cr (5.5%)</td>
          <td style="text-align: right; color: #ff6961;">-₹ ${salesHrl.toFixed(1)} Cr (2.2%)</td>
          <td style="text-align: right;"><span class="pnl-credit">+₹ ${(salesLegacy - salesHrl).toFixed(1)} Cr (AI Concierge -60%)</span></td>
        </tr>
        <tr>
          <td>Construction Finance & Escrow Holdback Carrying Cost</td>
          <td style="text-align: right; color: #ff453a;">-₹ ${financeLegacy.toFixed(1)} Cr (8.0%)</td>
          <td style="text-align: right; color: #ff6961;">-₹ ${financeHrl.toFixed(1)} Cr (4.5%)</td>
          <td style="text-align: right;"><span class="pnl-credit">+₹ ${(financeLegacy - financeHrl).toFixed(1)} Cr (21-Day Turnaround)</span></td>
        </tr>
        <tr class="pnl-row-subtotal">
          <td><strong>Total Capital Outflows / COGS</strong></td>
          <td style="text-align: right; color: #ff453a;"><strong>-₹ ${outflowsLegacy.toFixed(1)} Cr</strong></td>
          <td style="text-align: right; color: #ff6961;"><strong>-₹ ${outflowsHrl.toFixed(1)} Cr</strong></td>
          <td style="text-align: right;"><span class="pnl-credit">+₹ ${(outflowsLegacy - outflowsHrl).toFixed(1)} Cr Saved</span></td>
        </tr>
        <tr class="pnl-row-net">
          <td><strong>Net Developer Operating Margin (EBITDA)</strong></td>
          <td style="text-align: right; color: rgba(255,255,255,0.7);">₹ ${ebitdaLegacy.toFixed(1)} Cr (${marginLegacy.toFixed(1)}%)</td>
          <td style="text-align: right; color: var(--gold-primary);"><strong>₹ ${ebitdaHrl.toFixed(1)} Cr (${marginHrl.toFixed(1)}%)</strong></td>
          <td style="text-align: right;"><span class="pnl-tag-alpha">+${marginLift.toFixed(1)}% Alpha Expansion</span></td>
        </tr>
      `;
    }

    if (canvas) {
      drawDeveloperPnlChart(canvas, cr, gdvGain, forexGain, epcHrl, landHrl, salesHrl + financeHrl, ebitdaHrl);
    }
  }

  function renderInvestorPnl() {
    const priceLakhs = priceRange ? parseFloat(priceRange.value) : 85;
    const rate = rateRange ? parseFloat(rateRange.value) : 8.5;
    if (titleElem) titleElem.textContent = 'Private Investor Unit Cashflow P&L Statement';
    if (baseLabel) baseLabel.textContent = `₹ ${priceLakhs.toFixed(1)} Lakhs Luxury Unit Model`;

    // Legacy unmanaged vs HRL PropTech managed
    const rentalLegacy = priceLakhs * 0.032; // 3.2%
    const rentalHrl = priceLakhs * 0.050; // 5.0%

    const appreciationLegacy = priceLakhs * 0.055; // 5.5%
    const appreciationHrl = priceLakhs * 0.080; // 8.0%

    // 80% LTV Loan interest
    const principalLakhs = priceLakhs * 0.80;
    const interestLegacy = principalLakhs * (rate / 100);
    const interestHrl = principalLakhs * ((rate - 0.5) / 100); // Institutional bank tie-up preferential rate (-50 bps)

    const maintLegacy = priceLakhs * 0.007; // Standard grid & maintenance
    const maintHrl = priceLakhs * 0.0048; // -32% solar micro-grid savings

    const tax = priceLakhs * 0.0025;

    const netOperatingLegacy = rentalLegacy - (interestLegacy + maintLegacy + tax);
    const netOperatingHrl = rentalHrl - (interestHrl + maintHrl + tax);

    const totalWealthLegacy = netOperatingLegacy + appreciationLegacy;
    const totalWealthHrl = netOperatingHrl + appreciationHrl;
    const wealthLift = totalWealthHrl - totalWealthLegacy;

    if (marginBadge) {
      marginBadge.textContent = `+₹ ${totalWealthHrl.toFixed(2)}L / Yr Total Wealth (+${wealthLift.toFixed(2)}L Lift)`;
    }

    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td><strong>Gross Annual Rental Inflow</strong></td>
          <td style="text-align: right; color: rgba(255,255,255,0.7);">₹ ${rentalLegacy.toFixed(2)} Lakhs (3.2%)</td>
          <td style="text-align: right; color: #30d158;">₹ ${rentalHrl.toFixed(2)} Lakhs (5.0%)</td>
          <td style="text-align: right;"><span class="pnl-credit">+₹ ${(rentalHrl - rentalLegacy).toFixed(2)}L / yr (+56%)</span></td>
        </tr>
        <tr>
          <td>Capital Appreciation (1-Year Projected CAGR)</td>
          <td style="text-align: right; color: rgba(255,255,255,0.7);">₹ ${appreciationLegacy.toFixed(2)} Lakhs (5.5%)</td>
          <td style="text-align: right; color: var(--gold-primary);">₹ ${appreciationHrl.toFixed(2)} Lakhs (8.0%)</td>
          <td style="text-align: right;"><span class="pnl-credit">+₹ ${(appreciationHrl - appreciationLegacy).toFixed(2)}L / yr Lift</span></td>
        </tr>
        <tr class="pnl-row-subtotal">
          <td><strong>Subtotal: Gross Wealth Accumulation</strong></td>
          <td style="text-align: right; color: rgba(255,255,255,0.7);">₹ ${(rentalLegacy + appreciationLegacy).toFixed(2)} Lakhs</td>
          <td style="text-align: right; color: var(--gold-champagne);"><strong>₹ ${(rentalHrl + appreciationHrl).toFixed(2)} Lakhs</strong></td>
          <td style="text-align: right;"><span class="pnl-credit">+₹ ${((rentalHrl + appreciationHrl) - (rentalLegacy + appreciationLegacy)).toFixed(2)} Lakhs</span></td>
        </tr>
        <tr>
          <td>Mortgage Interest Deductions (Section 24b)</td>
          <td style="text-align: right; color: #ff453a;">-₹ ${interestLegacy.toFixed(2)} Lakhs (${rate}%)</td>
          <td style="text-align: right; color: #ff6961;">-₹ ${interestHrl.toFixed(2)} Lakhs (${(rate - 0.5).toFixed(1)}%)</td>
          <td style="text-align: right;"><span class="pnl-credit">+₹ ${(interestLegacy - interestHrl).toFixed(2)}L (Preferential Rate)</span></td>
        </tr>
        <tr>
          <td>Society Maintenance & Micro-Grid Solar Energy</td>
          <td style="text-align: right; color: #ff453a;">-₹ ${maintLegacy.toFixed(2)} Lakhs</td>
          <td style="text-align: right; color: #ff6961;">-₹ ${maintHrl.toFixed(2)} Lakhs</td>
          <td style="text-align: right;"><span class="pnl-credit">+₹ ${(maintLegacy - maintHrl).toFixed(2)}L (-32% Saved)</span></td>
        </tr>
        <tr>
          <td>Municipal Property Taxes (MCC E-Khata Sync)</td>
          <td style="text-align: right; color: #ff453a;">-₹ ${tax.toFixed(2)} Lakhs</td>
          <td style="text-align: right; color: #ff6961;">-₹ ${tax.toFixed(2)} Lakhs</td>
          <td style="text-align: right;"><span class="pnl-alpha-dash">Instant E-Khata</span></td>
        </tr>
        <tr class="pnl-row-subtotal">
          <td><strong>Total Annual Carrying Costs</strong></td>
          <td style="text-align: right; color: #ff453a;"><strong>-₹ ${(interestLegacy + maintLegacy + tax).toFixed(2)} Lakhs</strong></td>
          <td style="text-align: right; color: #ff6961;"><strong>-₹ ${(interestHrl + maintHrl + tax).toFixed(2)} Lakhs</strong></td>
          <td style="text-align: right;"><span class="pnl-credit">+₹ ${((interestLegacy + maintLegacy + tax) - (interestHrl + maintHrl + tax)).toFixed(2)}L Saved</span></td>
        </tr>
        <tr class="pnl-row-net">
          <td><strong>Net Annual Wealth Created (Cashflow + Equity)</strong></td>
          <td style="text-align: right; color: rgba(255,255,255,0.7);">₹ ${totalWealthLegacy.toFixed(2)} Lakhs</td>
          <td style="text-align: right; color: #30d158;"><strong>₹ ${totalWealthHrl.toFixed(2)} Lakhs / Yr</strong></td>
          <td style="text-align: right;"><span class="pnl-tag-alpha">+₹ ${wealthLift.toFixed(2)}L / Yr Alpha</span></td>
        </tr>
      `;
    }

    if (canvas) {
      drawInvestorPnlChart(canvas, rentalHrl, appreciationHrl, interestHrl, maintHrl + tax, totalWealthHrl);
    }
  }

  function drawDeveloperPnlChart(canvas, cr, gdvGain, forexGain, epc, land, salesFin, netEbitda) {
    const dpi = setupCanvasDPI(canvas);
    if (!dpi) return;
    const { ctx, width, height } = dpi;

    ctx.clearRect(0, 0, width, height);

    const padLeft = 48;
    const padRight = 16;
    const padTop = 24;
    const padBottom = 28;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const bars = [
      { label: 'Base GDV', val: cr, color: 'rgba(255, 255, 255, 0.45)', isOutflow: false },
      { label: '+14% AI', val: gdvGain, color: '#dfb76c', isOutflow: false },
      { label: '+FX Hedged', val: forexGain, color: '#30d158', isOutflow: false },
      { label: 'EPC Costs', val: epc, color: '#ff453a', isOutflow: true },
      { label: 'Land & RERA', val: land, color: '#ff6961', isOutflow: true },
      { label: 'Sales/Debt', val: salesFin, color: '#ff3b30', isOutflow: true },
      { label: 'Net EBITDA', val: netEbitda, color: '#dfb76c', isOutflow: false, isTotal: true }
    ];

    const maxVal = Math.max(...bars.map(b => b.val), cr * 1.1) * 1.18;

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

    const barWidth = Math.min(plotW / (bars.length * 1.4), 32);
    const spacing = (plotW - barWidth * bars.length) / (bars.length - 1);

    bars.forEach((b, i) => {
      const x = padLeft + i * (barWidth + spacing);
      const barH = Math.max((b.val / maxVal) * plotH, 4);
      const y = padTop + plotH - barH;

      ctx.fillStyle = b.color;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, barWidth, barH, 4);
      } else {
        ctx.rect(x, y, barWidth, barH);
      }
      ctx.fill();

      // Bar Value
      ctx.fillStyle = b.isOutflow ? '#ff6961' : (b.isTotal ? '#ffe5a3' : '#ffffff');
      ctx.font = '600 8.5px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      const prefix = b.isOutflow ? '-₹' : (b.isTotal ? '₹' : (i === 0 ? '₹' : '+₹'));
      ctx.fillText(`${prefix}${b.val.toFixed(0)}Cr`, x + barWidth / 2, y - 6);

      // Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = '500 8px -apple-system, sans-serif';
      ctx.fillText(b.label, x + barWidth / 2, height - 8);
    });

    // Y labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '500 9px -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`₹${Math.round(maxVal)}Cr`, padLeft - 6, padTop + 8);
    ctx.fillText(`₹${Math.round(maxVal / 2)}Cr`, padLeft - 6, padTop + plotH / 2 + 3);
    ctx.fillText('₹0', padLeft - 6, padTop + plotH);
  }

  function drawInvestorPnlChart(canvas, rent, appreciation, interest, maintTax, netWealth) {
    const dpi = setupCanvasDPI(canvas);
    if (!dpi) return;
    const { ctx, width, height } = dpi;

    ctx.clearRect(0, 0, width, height);

    const padLeft = 48;
    const padRight = 16;
    const padTop = 24;
    const padBottom = 28;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const bars = [
      { label: 'Rental Inflow', val: rent, color: '#30d158', isOutflow: false },
      { label: '8% CAGR Gain', val: appreciation, color: '#dfb76c', isOutflow: false },
      { label: 'Mortgage Int.', val: interest, color: '#ff453a', isOutflow: true },
      { label: 'HOA & Tax', val: maintTax, color: '#ff6961', isOutflow: true },
      { label: 'Net Annual Wealth', val: netWealth, color: '#30d158', isOutflow: false, isTotal: true }
    ];

    const maxVal = Math.max(...bars.map(b => b.val)) * 1.25;

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

    const barWidth = Math.min(plotW / (bars.length * 1.5), 36);
    const spacing = (plotW - barWidth * bars.length) / (bars.length - 1);

    bars.forEach((b, i) => {
      const x = padLeft + i * (barWidth + spacing);
      const barH = Math.max((b.val / maxVal) * plotH, 4);
      const y = padTop + plotH - barH;

      ctx.fillStyle = b.color;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, barWidth, barH, 4);
      } else {
        ctx.rect(x, y, barWidth, barH);
      }
      ctx.fill();

      // Bar Value
      ctx.fillStyle = b.isOutflow ? '#ff6961' : (b.isTotal ? '#30d158' : '#ffe5a3');
      ctx.font = '600 8.5px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      const prefix = b.isOutflow ? '-₹' : '+₹';
      ctx.fillText(`${prefix}${b.val.toFixed(2)}L`, x + barWidth / 2, y - 6);

      // Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = '500 8px -apple-system, sans-serif';
      ctx.fillText(b.label, x + barWidth / 2, height - 8);
    });

    // Y labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '500 9px -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`₹${maxVal.toFixed(1)}L`, padLeft - 6, padTop + 8);
    ctx.fillText(`₹${(maxVal / 2).toFixed(1)}L`, padLeft - 6, padTop + plotH / 2 + 3);
    ctx.fillText('₹0', padLeft - 6, padTop + plotH);
  }

  function update() {
    if (activeMode === 'developer') {
      renderDeveloperPnl();
    } else {
      renderInvestorPnl();
    }
  }

  if (btnDeveloper && btnInvestor) {
    btnDeveloper.addEventListener('click', () => {
      activeMode = 'developer';
      btnDeveloper.classList.add('active');
      btnInvestor.classList.remove('active');
      update();
    });

    btnInvestor.addEventListener('click', () => {
      activeMode = 'investor';
      btnInvestor.classList.add('active');
      btnDeveloper.classList.remove('active');
      update();
    });
  }

  // Listen to portfolio and calculator slider changes
  if (portfolioRange) portfolioRange.addEventListener('input', update);
  if (priceRange) priceRange.addEventListener('input', update);
  if (rateRange) rateRange.addEventListener('input', update);

  window.addEventListener('resize', update);

  // Initial draw
  update();
}

/* -------------------------------------------------------------------------- */
/* 11. Universal Stock Market & Global Capital Terminal System                 */
/* -------------------------------------------------------------------------- */
function initStockMarketTerminal() {
  const globalTickerTrack = document.getElementById('globalTickerTrack');
  const terminalSection = document.getElementById('stockmarket');

  if (!globalTickerTrack && !terminalSection) return;

  // Universal Market Instruments Data Dictionary
  const universalMarketData = {
    indices: [
      {
        id: 'sp500',
        symbol: 'S&P 500',
        tickerTag: '^GSPC',
        name: 'S&P 500 Index',
        market: 'US Large-Cap Equity Benchmark • NYSE / CBOE',
        currency: 'USD',
        price: 5983.25,
        change: 28.40,
        changePercent: 0.48,
        dayLow: 5958.10,
        dayHigh: 5992.40,
        week52Low: 4953.56,
        week52High: 6025.10,
        vol: '$42.8 Billion',
        ratioLbl: 'P/E Ratio',
        ratioVal: '26.4x',
        volatility: 1.25,
        insight: 'Universal institutional equity benchmark. Elevated US forward multiples (26.4x) are accelerating institutional capital rotation into high-yield tangible Indian real assets.'
      },
      {
        id: 'nasdaq',
        symbol: 'NASDAQ 100',
        tickerTag: '^NDX',
        name: 'NASDAQ 100',
        market: 'Global Technology & AI Infrastructure • NASDAQ',
        currency: 'USD',
        price: 21124.60,
        change: 138.20,
        changePercent: 0.66,
        dayLow: 20980.50,
        dayHigh: 21185.00,
        week52Low: 16973.10,
        week52High: 21340.50,
        vol: '$68.4 Billion',
        ratioLbl: 'P/E Ratio',
        ratioVal: '31.2x',
        volatility: 4.50,
        insight: 'Computational AI tech benchmark. Valuation expansion is prompting tech founders and diaspora leaders to anchor liquid gains in prime freehold residential and commercial estates.'
      },
      {
        id: 'nifty50',
        symbol: 'NIFTY 50',
        tickerTag: 'NIFTY 50',
        name: 'NSE NIFTY 50',
        market: 'National Stock Exchange of India • NSE Mumbai',
        currency: 'INR',
        price: 24852.15,
        change: 94.30,
        changePercent: 0.38,
        dayLow: 24740.10,
        dayHigh: 24895.50,
        week52Low: 21281.45,
        week52High: 26277.35,
        vol: '₹36,420 Cr',
        ratioLbl: 'P/E Ratio',
        ratioVal: '22.8x',
        volatility: 3.80,
        insight: 'Premier Indian sovereign index. Steady macro GDP growth (7.2%) underpins robust property absorption across Tier-1/2 coastal growth nodes.'
      },
      {
        id: 'sensex',
        symbol: 'BSE SENSEX',
        tickerTag: 'SENSEX',
        name: 'BSE SENSEX 30',
        market: 'Bombay Stock Exchange • BSE Mumbai',
        currency: 'INR',
        price: 81332.72,
        change: 331.45,
        changePercent: 0.41,
        dayLow: 81010.20,
        dayHigh: 81480.00,
        week52Low: 70001.20,
        week52High: 85978.25,
        vol: '₹12,850 Cr',
        ratioLbl: 'P/E Ratio',
        ratioVal: '23.1x',
        volatility: 12.00,
        insight: '30 premier blue-chip conglomerates reflecting strong corporate balance sheets and growing institutional appetite for co-developed infrastructure assets.'
      },
      {
        id: 'dfmgi',
        symbol: 'DFM GENERAL',
        tickerTag: 'DFMGI',
        name: 'Dubai Financial Market',
        market: 'Dubai Financial Market • UAE / GCC Capital Center',
        currency: 'AED',
        price: 4720.18,
        change: 43.15,
        changePercent: 0.92,
        dayLow: 4682.40,
        dayHigh: 4735.00,
        week52Low: 3980.20,
        week52High: 4785.40,
        vol: 'AED 780 Million',
        ratioLbl: 'P/E Ratio',
        ratioVal: '14.2x',
        volatility: 0.85,
        insight: 'Gulf diaspora financial capital center. Robust GCC liquidity drives 65%+ of Rohan Corporation luxury residential sales via direct AD-Cat 1 escrow pipelines.'
      },
      {
        id: 'ftse',
        symbol: 'FTSE 100',
        tickerTag: '^FTSE',
        name: 'FTSE 100 Index',
        market: 'London Stock Exchange • LSE London',
        currency: 'GBP',
        price: 8379.64,
        change: 18.45,
        changePercent: 0.22,
        dayLow: 8345.10,
        dayHigh: 8392.20,
        week52Low: 7420.10,
        week52High: 8485.20,
        vol: '£14.2 Billion',
        ratioLbl: 'P/E Ratio',
        ratioVal: '13.8x',
        volatility: 1.10,
        insight: 'UK and European multinational barometer. Favorable GBP/INR remittance parity (₹109.15) provides UK diaspora investors with outsized purchasing power.'
      },
      {
        id: 'nikkei',
        symbol: 'NIKKEI 225',
        tickerTag: '^N225',
        name: 'Nikkei 225',
        market: 'Tokyo Stock Exchange • TSE Tokyo',
        currency: 'JPY',
        price: 38720.50,
        change: -58.20,
        changePercent: -0.15,
        dayLow: 38550.00,
        dayHigh: 38890.00,
        week52Low: 35247.80,
        week52High: 42426.77,
        vol: '¥3.8 Trillion',
        ratioLbl: 'P/E Ratio',
        ratioVal: '16.4x',
        volatility: 8.50,
        insight: 'Asia-Pacific industrial index. Global capital rotation into non-correlated emerging market real assets offers portfolio resilience against Pacific currency fluctuations.'
      }
    ],
    reits: [
      {
        id: 'niftyrealty',
        symbol: 'NIFTY REALTY',
        tickerTag: 'NIFTY_REALTY',
        name: 'NIFTY Realty Index',
        market: 'Indian Listed Real Estate Developers • NSE',
        currency: 'INR',
        price: 1048.90,
        change: 18.95,
        changePercent: 1.84,
        dayLow: 1028.40,
        dayHigh: 1054.20,
        week52Low: 740.10,
        week52High: 1120.40,
        vol: '₹4,820 Cr',
        ratioLbl: '1Y Capital Gain',
        ratioVal: '+24.5%',
        volatility: 0.45,
        insight: 'Indian real estate developers benchmark. Outperforming broader indices as structural urban demand and institutional balance sheets drive historic multi-year expansion.'
      },
      {
        id: 'vnq',
        symbol: 'VANGUARD REIT',
        tickerTag: 'VNQ',
        name: 'Vanguard Real Estate ETF',
        market: 'Universal Commercial & Residential REITs • NYSE Arca',
        currency: 'USD',
        price: 92.14,
        change: 1.02,
        changePercent: 1.12,
        dayLow: 91.05,
        dayHigh: 92.45,
        week52Low: 78.20,
        week52High: 98.45,
        vol: '$1.42 Billion',
        ratioLbl: 'Div Yield',
        ratioVal: '4.12%',
        volatility: 0.08,
        insight: 'Universal benchmark for REIT valuations. Coastal Indian physical rental yields (5.8%–6.4% at Rohan City) exceed US commercial REIT distribution averages by over 180 bps.'
      },
      {
        id: 'embassy',
        symbol: 'EMBASSY REIT',
        tickerTag: 'EMBASSY',
        name: 'Embassy Office Parks REIT',
        market: 'Grade-A Institutional Tech Office Parks • NSE',
        currency: 'INR',
        price: 388.50,
        change: 5.35,
        changePercent: 1.40,
        dayLow: 382.10,
        dayHigh: 390.00,
        week52Low: 310.00,
        week52High: 412.00,
        vol: '₹95 Cr',
        ratioLbl: 'Distribution Yield',
        ratioVal: '7.20%',
        volatility: 0.25,
        insight: 'Institutional tech park REIT benchmark validating high Grade-A office demand across Karnataka, supporting Rohan Square commercial lease values.'
      },
      {
        id: 'brookfield',
        symbol: 'BROOKFIELD REIT',
        tickerTag: 'BIRET',
        name: 'Brookfield India Real Estate Trust',
        market: 'Institutional Real Estate Trust • NSE',
        currency: 'INR',
        price: 274.20,
        change: 2.45,
        changePercent: 0.90,
        dayLow: 271.00,
        dayHigh: 275.80,
        week52Low: 235.00,
        week52High: 290.00,
        vol: '₹42 Cr',
        ratioLbl: 'Distribution Yield',
        ratioVal: '7.85%',
        volatility: 0.20,
        insight: 'High-yielding institutional asset syndicate demonstrating strong investor appetite for institutional fractional real estate syndications.'
      }
    ],
    forex: [
      {
        id: 'usdinr',
        symbol: 'USD / INR',
        tickerTag: 'USDINR',
        name: 'USD to Indian Rupee',
        market: 'Interbank Forex Spot Rate • Sovereign FX',
        currency: 'INR',
        price: 86.425,
        change: -0.035,
        changePercent: -0.04,
        dayLow: 86.380,
        dayHigh: 86.490,
        week52Low: 82.800,
        week52High: 87.100,
        vol: 'RBI Fix: ₹86.41',
        ratioLbl: 'Hedging Buffer',
        ratioVal: '72h Lock',
        volatility: 0.012,
        insight: 'Universal reserve rate. HRL Pillar 01 autonomous 72-hour spot locking eliminates volatility friction for US diaspora remittances.'
      },
      {
        id: 'aedinr',
        symbol: 'AED / INR',
        tickerTag: 'AEDINR',
        name: 'UAE Dirham to Indian Rupee',
        market: 'UAE Central Bank Fixed Peg • GCC Corridor',
        currency: 'INR',
        price: 23.532,
        change: -0.005,
        changePercent: -0.02,
        dayLow: 23.510,
        dayHigh: 23.550,
        week52Low: 22.540,
        week52High: 23.720,
        vol: 'High Liquidity',
        ratioLbl: 'Allotment Speed',
        ratioVal: 'Sub-90s',
        volatility: 0.004,
        insight: 'Primary diaspora liquidity artery. Seamless AD-Cat 1 direct bank transfer secures prime Mangaluru units with zero intermediary forex shaving.'
      },
      {
        id: 'sarinr',
        symbol: 'SAR / INR',
        tickerTag: 'SARINR',
        name: 'Saudi Riyal to Indian Rupee',
        market: 'SAMA Central Bank Peg • Gulf Corridor',
        currency: 'INR',
        price: 23.041,
        change: -0.002,
        changePercent: -0.01,
        dayLow: 23.020,
        dayHigh: 23.060,
        week52Low: 22.050,
        week52High: 23.210,
        vol: 'High Liquidity',
        ratioLbl: 'KYC Process',
        ratioVal: 'Automated',
        volatility: 0.004,
        insight: 'Key Saudi Arabian diaspora corridor enabling institutional wealth preservation in freehold coastal property.'
      },
      {
        id: 'gbpinr',
        symbol: 'GBP / INR',
        tickerTag: 'GBPINR',
        name: 'British Pound to Indian Rupee',
        market: 'London Interbank FX Rate • European Desk',
        currency: 'INR',
        price: 109.150,
        change: 0.200,
        changePercent: 0.18,
        dayLow: 108.800,
        dayHigh: 109.400,
        week52Low: 103.400,
        week52High: 111.800,
        vol: 'High Flow',
        ratioLbl: 'Yield Conversion',
        ratioVal: '+18.2% 2Y',
        volatility: 0.025,
        insight: 'UK diaspora real estate wire with multi-year high conversion leverage on luxury sea-facing residences.'
      },
      {
        id: 'eurinr',
        symbol: 'EUR / INR',
        tickerTag: 'EURINR',
        name: 'Euro to Indian Rupee',
        market: 'European Central Bank Reference Rate',
        currency: 'INR',
        price: 90.280,
        change: 0.110,
        changePercent: 0.12,
        dayLow: 90.050,
        dayHigh: 90.450,
        week52Low: 88.100,
        week52High: 93.400,
        vol: 'Active Cross',
        ratioLbl: 'FEMA Compliance',
        ratioVal: 'Form A2 Auto',
        volatility: 0.020,
        insight: 'Direct Euro gateway clearing NRI investments without manual physical bank branch submissions.'
      }
    ],
    commodities: [
      {
        id: 'gold',
        symbol: 'GOLD (XAU)',
        tickerTag: 'XAU/USD',
        name: 'Gold Spot Bullion',
        market: 'Universal Real Asset Hedge • COMEX / LBMA',
        currency: 'USD/oz',
        price: 2912.40,
        change: 20.40,
        changePercent: 0.71,
        dayLow: 2888.00,
        dayHigh: 2920.50,
        week52Low: 2020.00,
        week52High: 2940.00,
        vol: '$28.4 Billion',
        ratioLbl: 'Asset Class',
        ratioVal: 'Store of Value',
        volatility: 1.50,
        insight: 'Gold hitting all-time highs reinforces investor demand to rotate liquid precious metals into revenue-generating freehold prime real estate.'
      },
      {
        id: 'brent',
        symbol: 'BRENT CRUDE',
        tickerTag: 'BRENT',
        name: 'Brent Crude Oil',
        market: 'Global Energy & Logistics Benchmark • ICE London',
        currency: 'USD/bbl',
        price: 74.20,
        change: -0.60,
        changePercent: -0.80,
        dayLow: 73.60,
        dayHigh: 74.90,
        week52Low: 68.50,
        week52High: 92.40,
        vol: '1.2M Contracts',
        ratioLbl: 'EPC Impact',
        ratioVal: 'Cost Neutral',
        volatility: 0.12,
        insight: 'Stabilized crude oil prices ease supply chain costs and concrete clinker logistics across coastal Karnataka construction sites.'
      },
      {
        id: 'us10y',
        symbol: 'US 10-YR YIELD',
        tickerTag: 'US10Y',
        name: 'US 10-Year Treasury Yield',
        market: 'Universal Sovereign Risk-Free Benchmark • US Treasury',
        currency: '%',
        price: 4.282,
        change: -0.032,
        changePercent: -0.74,
        dayLow: 4.260,
        dayHigh: 4.315,
        week52Low: 3.620,
        week52High: 4.740,
        vol: 'Benchmark',
        ratioLbl: 'Cap Rate Spread',
        ratioVal: '+210 bps',
        volatility: 0.005,
        insight: 'Global cost of capital barometer. The spread between Rohan commercial yields (6.4%) and US Treasuries remains attractive for international funds.'
      },
      {
        id: 'in10y',
        symbol: 'INDIA 10-YR G-SEC',
        tickerTag: 'IN10Y',
        name: 'India 10-Year G-Sec Benchmark',
        market: 'Sovereign Debt Hurdle Rate • RBI NDS-OM',
        currency: '%',
        price: 6.745,
        change: -0.018,
        changePercent: -0.27,
        dayLow: 6.730,
        dayHigh: 6.765,
        week52Low: 6.650,
        week52High: 7.220,
        vol: '₹4,200 Cr',
        ratioLbl: 'Mortgage Base',
        ratioVal: 'Repo Linked',
        volatility: 0.003,
        insight: 'Softening Indian sovereign bond yields pave the way for home loan interest rate reductions, spurring residential buyer liquidity.'
      }
    ]
  };

  function getUniverseOf(id) {
    for (const [cat, items] of Object.entries(universalMarketData)) {
      if (items.some(it => it.id === id)) return cat;
    }
    return 'indices';
  }

  function formatMarketPrice(price, currency) {
    if (currency === '%') return `${price.toFixed(3)}%`;
    if (currency === 'INR') {
      return price > 1000 ? `₹ ${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `₹ ${price.toFixed(2)}`;
    }
    if (currency === 'AED') return `AED ${price.toFixed(2)}`;
    if (currency === 'GBP') return `£ ${price.toFixed(2)}`;
    if (currency === 'JPY') return `¥ ${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    if (currency === 'USD/oz' || currency === 'USD/bbl') return `$ ${price.toFixed(2)}`;
    return `$ ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Populate Global Running Ticker Tape
  function populateTickerTape() {
    if (!globalTickerTrack) return;
    const allItems = [
      ...universalMarketData.indices,
      ...universalMarketData.reits,
      ...universalMarketData.forex,
      ...universalMarketData.commodities
    ];

    function createTickerHtml(list) {
      return list.map(item => {
        const isUp = item.change >= 0;
        const arrow = isUp ? '▲' : '▼';
        const deltaClass = isUp ? 'delta-up' : 'delta-down';
        const formattedPrice = formatMarketPrice(item.price, item.currency);
        const sign = isUp ? '+' : '';
        return `
          <a href="#stockmarket" class="ticker-item" data-id="${item.id}" data-universe="${getUniverseOf(item.id)}">
            <span class="ticker-symbol">${item.symbol}</span>
            <span class="ticker-price" id="tick-p-${item.id}">${formattedPrice}</span>
            <span class="ticker-delta ${deltaClass}" id="tick-d-${item.id}">${sign}${item.changePercent.toFixed(2)}% ${arrow}</span>
          </a>
        `;
      }).join('');
    }

    globalTickerTrack.innerHTML = createTickerHtml(allItems) + createTickerHtml(allItems);

    globalTickerTrack.querySelectorAll('.ticker-item').forEach(el => {
      el.addEventListener('click', () => {
        const u = el.getAttribute('data-universe');
        const id = el.getAttribute('data-id');
        if (u && id) selectAsset(u, id);
      });
    });
  }

  // State
  let activeUniverse = 'indices';
  let activeAssetId = 'sp500';
  let activeTimeframe = '1M';
  let hoveredPoint = null;

  // DOM Elements for Terminal
  const tabsContainer = document.getElementById('stockUniverseTabs');
  const activeAssetName = document.getElementById('activeAssetName');
  const activeAssetSymbol = document.getElementById('activeAssetSymbol');
  const activeAssetMarket = document.getElementById('activeAssetMarket');
  const activeAssetPrice = document.getElementById('activeAssetPrice');
  const activeAssetDelta = document.getElementById('activeAssetDelta');
  const metricDayRange = document.getElementById('metricDayRange');
  const metric52Range = document.getElementById('metric52Range');
  const metricVolLbl = document.getElementById('metricVolLbl');
  const metricVolVal = document.getElementById('metricVolVal');
  const metricValLbl = document.getElementById('metricValLbl');
  const metricValVal = document.getElementById('metricValVal');
  const stockWatchlistTbody = document.getElementById('stockWatchlistTbody');
  const watchlistCategoryTitle = document.getElementById('watchlistCategoryTitle');
  const watchlistCount = document.getElementById('watchlistCount');
  const stockMacroInsight = document.getElementById('stockMacroInsight');
  const timeframeButtons = document.getElementById('timeframeButtons');
  const chartCanvas = document.getElementById('stockMarketCanvas');
  const chartHoverPrice = document.getElementById('chartHoverPrice');

  function getActiveAsset() {
    const list = universalMarketData[activeUniverse] || [];
    return list.find(a => a.id === activeAssetId) || list[0] || universalMarketData.indices[0];
  }

  // Generate historical curve data deterministically
  function generateTimeSeries(asset, timeframe) {
    const counts = { '1D': 24, '1W': 14, '1M': 30, '1Y': 24, '5Y': 30 };
    const n = counts[timeframe] || 30;
    const points = [];
    const current = asset.price;
    const changePct = asset.changePercent / 100;
    
    // Determine start price
    let startPrice = current / (1 + changePct);
    if (timeframe === '1W') startPrice = current * (1 - changePct * 1.8);
    if (timeframe === '1M') startPrice = current * (1 - changePct * 3.2);
    if (timeframe === '1Y') startPrice = asset.week52Low + (current - asset.week52Low) * 0.2;
    if (timeframe === '5Y') startPrice = asset.week52Low * 0.72;

    const priceDiff = current - startPrice;
    
    for (let i = 0; i < n; i++) {
      const progress = i / (n - 1);
      // Realistic financial noise walk
      const noise = Math.sin(i * 1.7) * (asset.volatility * (timeframe === '1D' ? 0.8 : 3.5));
      const trend = startPrice + priceDiff * Math.pow(progress, 0.95);
      const val = i === n - 1 ? current : Math.max(0.01, trend + noise);
      
      let label = '';
      if (timeframe === '1D') label = `${String(Math.floor(i)).padStart(2, '0')}:00`;
      else if (timeframe === '1W') label = `Day ${i + 1}`;
      else if (timeframe === '1M') label = `D${i + 1}`;
      else if (timeframe === '1Y') label = `M${Math.floor(i / 2) + 1}`;
      else label = `Yr ${Math.floor(i / 6) + 1}`;

      points.push({ index: i, val: val, label: label });
    }
    return points;
  }

  function renderActiveAsset() {
    const asset = getActiveAsset();
    if (!asset) return;

    if (activeAssetName) {
      activeAssetName.innerHTML = `
        ${asset.name}
        <span class="stock-active-tag" id="activeAssetSymbol">${asset.tickerTag}</span>
      `;
    }
    if (activeAssetMarket) activeAssetMarket.textContent = asset.market;
    if (activeAssetPrice) activeAssetPrice.textContent = formatMarketPrice(asset.price, asset.currency);
    
    if (activeAssetDelta) {
      const isUp = asset.change >= 0;
      const sign = isUp ? '+' : '';
      const arrow = isUp ? '▲' : '▼';
      activeAssetDelta.className = `stock-delta-hero ${isUp ? 'delta-up' : 'delta-down'}`;
      activeAssetDelta.textContent = `${sign}${formatMarketPrice(asset.change, asset.currency)} (${sign}${asset.changePercent.toFixed(2)}%) ${arrow}`;
    }

    if (metricDayRange) metricDayRange.textContent = `${formatMarketPrice(asset.dayLow, asset.currency)} - ${formatMarketPrice(asset.dayHigh, asset.currency)}`;
    if (metric52Range) metric52Range.textContent = `${formatMarketPrice(asset.week52Low, asset.currency)} - ${formatMarketPrice(asset.week52High, asset.currency)}`;
    if (metricVolLbl) metricVolLbl.textContent = asset.currency === 'INR' || asset.currency === '%' ? 'Market Volume' : 'Trading Volume';
    if (metricVolVal) metricVolVal.textContent = asset.vol;
    if (metricValLbl) metricValLbl.textContent = asset.ratioLbl;
    if (metricValVal) metricValVal.textContent = asset.ratioVal;

    if (stockMacroInsight) {
      stockMacroInsight.innerHTML = `<strong>Macro Capital Moat:</strong> ${asset.insight}`;
    }

    drawChart();
  }

  function renderWatchlist() {
    if (!stockWatchlistTbody) return;
    const list = universalMarketData[activeUniverse] || [];

    const categoryTitles = {
      indices: 'Universal Equity Indices',
      reits: 'Global REITs & PropTech Pool',
      forex: 'Universal Diaspora Forex Crosses',
      commodities: 'Commodities & Sovereign Yields'
    };

    if (watchlistCategoryTitle) watchlistCategoryTitle.textContent = categoryTitles[activeUniverse] || 'Universal Instruments';
    if (watchlistCount) watchlistCount.textContent = `${list.length} Instruments`;

    stockWatchlistTbody.innerHTML = list.map(item => {
      const isUp = item.change >= 0;
      const sign = isUp ? '+' : '';
      const arrow = isUp ? '▲' : '▼';
      const deltaClass = isUp ? 'delta-up' : 'delta-down';
      const isActive = item.id === activeAssetId ? 'class="active"' : '';
      return `
        <tr ${isActive} data-id="${item.id}" id="row-${item.id}">
          <td>
            <div class="stock-row-symbol">
              <span>${item.symbol}</span>
              <span class="stock-row-subname">${item.name}</span>
            </div>
          </td>
          <td class="stock-row-price" id="row-p-${item.id}">${formatMarketPrice(item.price, item.currency)}</td>
          <td class="stock-row-delta">
            <span class="ticker-delta ${deltaClass}" id="row-d-${item.id}">${sign}${item.changePercent.toFixed(2)}% ${arrow}</span>
          </td>
        </tr>
      `;
    }).join('');

    stockWatchlistTbody.querySelectorAll('tr').forEach(tr => {
      tr.addEventListener('click', () => {
        const id = tr.getAttribute('data-id');
        selectAsset(activeUniverse, id);
      });
    });
  }

  function selectAsset(universe, id) {
    activeUniverse = universe;
    activeAssetId = id;

    if (tabsContainer) {
      tabsContainer.querySelectorAll('.stock-tab-btn').forEach(btn => {
        if (btn.getAttribute('data-universe') === universe) btn.classList.add('active');
        else btn.classList.remove('active');
      });
    }

    renderWatchlist();
    renderActiveAsset();
  }

  function drawChart() {
    if (!chartCanvas) return;
    const dpi = setupCanvasDPI(chartCanvas);
    if (!dpi) return;
    const { ctx, width, height } = dpi;

    ctx.clearRect(0, 0, width, height);

    const asset = getActiveAsset();
    const data = generateTimeSeries(asset, activeTimeframe);
    if (!data.length) return;

    const padLeft = 14;
    const padRight = 54;
    const padTop = 18;
    const padBottom = 26;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const values = data.map(d => d.val);
    const minVal = Math.min(...values) * 0.998;
    const maxVal = Math.max(...values) * 1.002;
    const range = maxVal - minVal || 1;

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
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

    const isPositive = asset.change >= 0;
    const strokeColor = isPositive ? '#30d158' : '#ff453a';

    // Area Gradient
    const gradArea = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
    if (isPositive) {
      gradArea.addColorStop(0, 'rgba(48, 209, 88, 0.26)');
      gradArea.addColorStop(1, 'rgba(48, 209, 88, 0.00)');
    } else {
      gradArea.addColorStop(0, 'rgba(255, 69, 58, 0.26)');
      gradArea.addColorStop(1, 'rgba(255, 69, 58, 0.00)');
    }

    // Path
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop + plotH);
    data.forEach((p, idx) => {
      const x = padLeft + (idx / (data.length - 1)) * plotW;
      const y = padTop + plotH - ((p.val - minVal) / range) * plotH;
      ctx.lineTo(x, y);
    });
    ctx.lineTo(padLeft + plotW, padTop + plotH);
    ctx.closePath();
    ctx.fillStyle = gradArea;
    ctx.fill();

    // Line
    ctx.beginPath();
    data.forEach((p, idx) => {
      const x = padLeft + (idx / (data.length - 1)) * plotW;
      const y = padTop + plotH - ((p.val - minVal) / range) * plotH;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // End node
    const lastX = padLeft + plotW;
    const lastY = padTop + plotH - ((data[data.length - 1].val - minVal) / range) * plotH;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = strokeColor;
    ctx.fill();

    // Crosshair hover inspection
    if (hoveredPoint !== null && hoveredPoint >= 0 && hoveredPoint < data.length) {
      const hp = data[hoveredPoint];
      const hx = padLeft + (hoveredPoint / (data.length - 1)) * plotW;
      const hy = padTop + plotH - ((hp.val - minVal) / range) * plotH;

      ctx.strokeStyle = 'rgba(223, 183, 108, 0.6)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(hx, padTop);
      ctx.lineTo(hx, padTop + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(hx, hy, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      if (chartHoverPrice) {
        chartHoverPrice.innerHTML = `<span style="color: #ffffff; font-weight: 600;">${hp.label}</span> • <strong style="color: var(--gold-champagne);">${formatMarketPrice(hp.val, asset.currency)}</strong>`;
      }
    }

    // Y labels (right)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '500 9px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(formatMarketPrice(maxVal, asset.currency), width - padRight + 6, padTop + 8);
    ctx.fillText(formatMarketPrice(minVal + range / 2, asset.currency), width - padRight + 6, padTop + plotH / 2 + 3);
    ctx.fillText(formatMarketPrice(minVal, asset.currency), width - padRight + 6, padTop + plotH);

    // X labels (bottom)
    ctx.textAlign = 'center';
    ctx.fillText(data[0].label, padLeft + 8, height - 8);
    ctx.fillText(data[Math.floor(data.length / 2)].label, padLeft + plotW / 2, height - 8);
    ctx.fillText(data[data.length - 1].label, padLeft + plotW - 12, height - 8);
  }

  // Crosshair mouse tracking
  if (chartCanvas) {
    chartCanvas.addEventListener('mousemove', (e) => {
      const rect = chartCanvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const padLeft = 14;
      const padRight = 54;
      const plotW = rect.width - padLeft - padRight;
      const ratio = Math.max(0, Math.min(1, (clientX - padLeft) / plotW));
      const asset = getActiveAsset();
      const data = generateTimeSeries(asset, activeTimeframe);
      hoveredPoint = Math.round(ratio * (data.length - 1));
      drawChart();
    });

    chartCanvas.addEventListener('mouseleave', () => {
      hoveredPoint = null;
      if (chartHoverPrice) chartHoverPrice.textContent = 'Drag or hover crosshair to inspect';
      drawChart();
    });
  }

  // Universe Switcher Tabs event listeners
  if (tabsContainer) {
    tabsContainer.querySelectorAll('.stock-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const u = btn.getAttribute('data-universe');
        if (u) {
          activeUniverse = u;
          const firstAsset = universalMarketData[u][0];
          activeAssetId = firstAsset ? firstAsset.id : 'sp500';
          tabsContainer.querySelectorAll('.stock-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          renderWatchlist();
          renderActiveAsset();
        }
      });
    });
  }

  // Timeframe buttons event listeners
  if (timeframeButtons) {
    timeframeButtons.querySelectorAll('.timeframe-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        timeframeButtons.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTimeframe = btn.getAttribute('data-tf') || '1M';
        drawChart();
      });
    });
  }

  // Live Exchange Clocks & Session Status
  function updateExchangeClocks() {
    const now = new Date();
    const utcHour = now.getUTCHours();
    const utcMin = now.getUTCMinutes();
    const utcSec = now.getUTCSeconds();
    const day = now.getUTCDay(); // 0 = Sun, 6 = Sat
    const isWeekday = day >= 1 && day <= 5;

    const utcTimeStr = `${String(utcHour).padStart(2, '0')}:${String(utcMin).padStart(2, '0')}:${String(utcSec).padStart(2, '0')}`;
    const istDate = new Date(now.getTime() + (5.5 * 3600000));
    const istTimeStr = `${String(istDate.getUTCHours()).padStart(2, '0')}:${String(istDate.getUTCMinutes()).padStart(2, '0')}:${String(istDate.getUTCSeconds()).padStart(2, '0')}`;
    const gstDate = new Date(now.getTime() + (4 * 3600000));
    const gstTimeStr = `${String(gstDate.getUTCHours()).padStart(2, '0')}:${String(gstDate.getUTCMinutes()).padStart(2, '0')}:${String(gstDate.getUTCSeconds()).padStart(2, '0')}`;

    const utcElem = document.getElementById('utcTime');
    const istElem = document.getElementById('istTime');
    const gstElem = document.getElementById('gstTime');
    if (utcElem) utcElem.textContent = utcTimeStr;
    if (istElem) istElem.textContent = istTimeStr;
    if (gstElem) gstElem.textContent = gstTimeStr;

    // Exchange Status Dots
    function setDot(id, isOpen) {
      const el = document.getElementById(id);
      if (el) {
        const dot = el.querySelector('.exchange-dot');
        if (dot) {
          dot.className = `exchange-dot ${isOpen ? 'open' : 'closed'}`;
        }
      }
    }

    // NYSE (14:30 - 21:00 UTC)
    const nyseOpen = isWeekday && (utcHour > 14 || (utcHour === 14 && utcMin >= 30)) && utcHour < 21;
    // NSE Mumbai (03:45 - 10:00 UTC)
    const nseOpen = isWeekday && (utcHour > 3 || (utcHour === 3 && utcMin >= 45)) && utcHour < 10;
    // DFM Dubai (06:00 - 11:00 UTC)
    const dfmOpen = isWeekday && utcHour >= 6 && utcHour < 11;
    // LSE London (08:00 - 16:30 UTC)
    const lseOpen = isWeekday && utcHour >= 8 && (utcHour < 16 || (utcHour === 16 && utcMin <= 30));
    // TSE Tokyo (00:00 - 06:00 UTC)
    const tseOpen = isWeekday && utcHour >= 0 && utcHour < 6;

    setDot('exchNYC', nyseOpen);
    setDot('exchMUM', nseOpen);
    setDot('exchDXB', dfmOpen);
    setDot('exchLON', lseOpen);
    setDot('exchTYO', tseOpen);
  }

  // Live Micro-Tick Engine (simulates live streaming market ticks every 1.8s)
  function runTick() {
    const allCategories = ['indices', 'reits', 'forex', 'commodities'];
    const chosenCat = allCategories[Math.floor(Math.random() * allCategories.length)];
    const list = universalMarketData[chosenCat];
    const asset = list[Math.floor(Math.random() * list.length)];

    const tickDelta = (Math.random() - 0.49) * asset.volatility;
    asset.price = Math.max(0.001, asset.price + tickDelta);
    asset.change += tickDelta;
    asset.changePercent = (asset.change / (asset.price - asset.change)) * 100;
    asset.dayHigh = Math.max(asset.dayHigh, asset.price);
    asset.dayLow = Math.min(asset.dayLow, asset.price);

    const isUp = tickDelta >= 0;
    const flashClass = isUp ? 'tick-flash-green' : 'tick-flash-red';
    const arrow = isUp ? '▲' : '▼';
    const sign = asset.change >= 0 ? '+' : '';
    const formattedPrice = formatMarketPrice(asset.price, asset.currency);

    // Update Ticker Tape Elements
    const tickPriceEl = document.getElementById(`tick-p-${asset.id}`);
    const tickDeltaEl = document.getElementById(`tick-d-${asset.id}`);
    if (tickPriceEl) {
      tickPriceEl.textContent = formattedPrice;
      tickPriceEl.classList.remove('tick-flash-green', 'tick-flash-red');
      void tickPriceEl.offsetWidth; // trigger reflow
      tickPriceEl.classList.add(flashClass);
    }
    if (tickDeltaEl) {
      tickDeltaEl.textContent = `${sign}${asset.changePercent.toFixed(2)}% ${arrow}`;
      tickDeltaEl.className = `ticker-delta ${asset.change >= 0 ? 'delta-up' : 'delta-down'}`;
    }

    // Update Watchlist Row
    const rowPriceEl = document.getElementById(`row-p-${asset.id}`);
    const rowDeltaEl = document.getElementById(`row-d-${asset.id}`);
    if (rowPriceEl) {
      rowPriceEl.textContent = formattedPrice;
      rowPriceEl.classList.remove('tick-flash-green', 'tick-flash-red');
      void rowPriceEl.offsetWidth;
      rowPriceEl.classList.add(flashClass);
    }
    if (rowDeltaEl) {
      rowDeltaEl.textContent = `${sign}${asset.changePercent.toFixed(2)}% ${arrow}`;
      rowDeltaEl.className = `ticker-delta ${asset.change >= 0 ? 'delta-up' : 'delta-down'}`;
    }

    // Update Active Inspector if this is the active asset
    if (asset.id === activeAssetId) {
      if (activeAssetPrice) {
        activeAssetPrice.textContent = formattedPrice;
        activeAssetPrice.classList.remove('tick-flash-green', 'tick-flash-red');
        void activeAssetPrice.offsetWidth;
        activeAssetPrice.classList.add(flashClass);
      }
      if (activeAssetDelta) {
        activeAssetDelta.className = `stock-delta-hero ${asset.change >= 0 ? 'delta-up' : 'delta-down'}`;
        activeAssetDelta.textContent = `${sign}${formatMarketPrice(asset.change, asset.currency)} (${sign}${asset.changePercent.toFixed(2)}%) ${arrow}`;
      }
      if (metricDayRange) {
        metricDayRange.textContent = `${formatMarketPrice(asset.dayLow, asset.currency)} - ${formatMarketPrice(asset.dayHigh, asset.currency)}`;
      }
      drawChart();
    }
  }

  // Initialize
  populateTickerTape();
  renderWatchlist();
  renderActiveAsset();
  updateExchangeClocks();

  // Intervals
  setInterval(updateExchangeClocks, 1000);
  setInterval(runTick, 1800);

  window.addEventListener('resize', () => {
    drawChart();
  });
}
