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
/* 3. Canvas 3D Digital Twin Simulator                                        */
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
  let angle = 0;

  function setMode(newMode) {
    mode = newMode;
    [simDayBtn, simSunsetBtn, simNightBtn].forEach(b => b.classList.remove('active'));
    if (mode === 'day') {
      simDayBtn.classList.add('active');
      sunlightText.textContent = 'Solar Azimuth: 145° (Midday Daylight & Balcony Lux Level: 92,000)';
    } else if (mode === 'sunset') {
      simSunsetBtn.classList.add('active');
      sunlightText.textContent = 'Golden Hour Azimuth: 260° (Sea Breeze Vector: 14 knots West)';
    } else if (mode === 'night') {
      simNightBtn.classList.add('active');
      sunlightText.textContent = 'Night Smart Grid: LED Facade Illumination & 38% Energy Savings';
    }
  }

  simDayBtn.addEventListener('click', () => setMode('day'));
  simSunsetBtn.addEventListener('click', () => setMode('sunset'));
  simNightBtn.addEventListener('click', () => setMode('night'));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background sky gradient based on mode
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (mode === 'day') {
      sky.addColorStop(0, '#0c1d36');
      sky.addColorStop(1, '#050a14');
    } else if (mode === 'sunset') {
      sky.addColorStop(0, '#4a1525');
      sky.addColorStop(0.6, '#b45309');
      sky.addColorStop(1, '#0f1118');
    } else {
      sky.addColorStop(0, '#020617');
      sky.addColorStop(1, '#05070d');
    }
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid Floor
    ctx.strokeStyle = mode === 'night' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(212, 175, 55, 0.15)';
    ctx.lineWidth = 1;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2 + 60;

    for (let i = -6; i <= 6; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * 35, cy);
      ctx.lineTo(cx + i * 65, canvas.height);
      ctx.stroke();
    }

    // Draw Isometric Towers representing Rohan City & Rohan Crown
    angle += 0.01;
    drawTower(cx - 70, cy - 20, 50, 140, mode, 'Rohan City Hub');
    drawTower(cx + 30, cy - 10, 60, 180, mode, 'Rohan Crown Tower');
    drawTower(cx + 110, cy - 25, 40, 100, mode, 'Plaza Suites');

    requestAnimationFrame(draw);
  }

  function drawTower(x, y, w, h, currentMode, label) {
    // Front Face
    const front = ctx.createLinearGradient(x, y - h, x, y);
    if (currentMode === 'day') {
      front.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
      front.addColorStop(1, 'rgba(15, 23, 42, 0.85)');
    } else if (currentMode === 'sunset') {
      front.addColorStop(0, 'rgba(245, 158, 11, 0.5)');
      front.addColorStop(1, 'rgba(30, 27, 75, 0.9)');
    } else {
      front.addColorStop(0, 'rgba(168, 85, 247, 0.4)');
      front.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
    }

    ctx.fillStyle = front;
    ctx.strokeStyle = currentMode === 'night' ? '#38bdf8' : '#d4af37';
    ctx.lineWidth = 1.2;

    ctx.beginPath();
    ctx.rect(x, y - h, w, h);
    ctx.fill();
    ctx.stroke();

    // Windows / Floor Levels
    const floors = Math.floor(h / 14);
    for (let f = 1; f < floors; f++) {
      const fy = y - f * 14;
      ctx.beginPath();
      ctx.moveTo(x + 4, fy);
      ctx.lineTo(x + w - 4, fy);
      ctx.strokeStyle = currentMode === 'night' ? 'rgba(243, 229, 171, 0.6)' : 'rgba(255, 255, 255, 0.2)';
      ctx.stroke();
    }

    // Rooftop Spire & Beacon
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y - h);
    ctx.lineTo(x + w / 2, y - h - 18);
    ctx.strokeStyle = '#d4af37';
    ctx.stroke();

    // Beacon blink
    const blink = Math.sin(angle * 4) > 0;
    if (blink) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(x + w / 2, y - h - 18, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
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
