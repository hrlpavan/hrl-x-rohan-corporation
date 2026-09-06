# PROPTECH SYSTEM ARCHITECTURE & VISUAL COMPUTING SPECIFICATION
## HRL International Private Limited × Rohan Corporation Joint Venture
**Platform Edition:** Enterprise Commercial Sales Suite v4.1  
**Architecture Classification:** Zero-Framework Vanilla Modern Web Engineering  
**Revision Date:** September 6, 2026  
**Engineering Contact:** hrlinternationalprivatelimited@gmail.com  

---

## 1. Architectural Philosophy & Principles

The HRL × Rohan Corporation PropTech Platform is designed to deliver executive-grade performance, aesthetic refinement, and absolute institutional reliability. Rejecting framework overhead and external runtime dependencies, the platform operates entirely on modern web standards (Vanilla ES6+ and CSS3 Custom Properties).

```
+---------------------------------------------------------------------------------------+
|                               PLATFORM ARCHITECTURE STACK                             |
+---------------------------------------------------------------------------------------+
|  PRESENTATION LAYER    |  CSS3 Modern Grid, Flexbox, Glassmorphism, 4K Responsive      |
|  VISUAL COMPUTING      |  HTML5 Canvas 2D Context, Retina Sub-Pixel Vector Pipeline    |
|  AUDIO SYNTHESIS       |  Web Audio API, Dual Oscillator Synth, Dynamic Biquad Filter |
|  FINANCIAL MODELING    |  Pure Math Engine (FOIR, Amortization, Tax Shield, Stamp)    |
|  CRYPTOGRAPHY          |  Web Crypto API (SHA-256 Title Vault Hashes & Receipt Gen)    |
+---------------------------------------------------------------------------------------+
```

### Key Performance Pillars:
- **Sub-100ms First Contentful Paint (FCP):** Zero external JavaScript bundles or blocking fonts.
- **Constant 60 FPS Visual Refresh:** RAF (requestAnimationFrame) rendering loops optimized with zero GC allocations in hot paths.
- **Zero-Void Spatial Layout:** Fluid adaptive matrix preventing visual drop-offs or stranded white space across all display viewports.
- **Air-Gapped Local Execution:** Fully functional offline or behind restricted institutional banking firewalls.

---

## 2. Visual Computing & Floor Plan Simulation Engine

The interactive floor plan visualizer (`#floorPlanCanvas`) employs an advanced 2D Canvas rendering pipeline with automatic Retina scaling:

```
[Window Viewport DPR] ---> [Canvas Buffer Dimension = DPR * CSS Dimensions]
                                     |
                                     v
                        [Canvas Context Scaling: ctx.scale(DPR, DPR)]
                                     |
                                     v
                        [Sub-Pixel Anti-Aliased Vector Grid]
                                     |
                                     v
            +---------------------------------------------------+
            | - Outer Architectural Envelope (Polygonal)        |
            | - Demising Walls (Offset Poly-lines with Alpha)   |
            | - Room Partitions & Structural Load Columns       |
            | - Interactive Unit Hotspots (Collision Polygon)   |
            | - Dynamic Dimension Callouts & RERA Area Badges   |
            +---------------------------------------------------+
                                     |
                                     v
                        [High-Contrast Unit Status Glow]
```

### Technical Highlights:
1. **DPI Compensation:** Automatically measures `window.devicePixelRatio || 1` and resizes the internal canvas buffer to match physical hardware pixels, eliminating blurriness on Apple Retina and high-PPI OLED displays.
2. **Hit-Testing Engine:** Custom ray-casting and bounding-box algorithms calculate cursor intersection over complex non-rectangular commercial unit footprints.
3. **Smooth Color Transitioning:** Hex and RGBA interpolators ensure smooth visual feedback on unit selection without triggering DOM reflows.

---

## 3. Web Audio API Procedural Sound Engine

To elevate the luxury investment experience, the platform includes a zero-asset procedural sound generator using the browser native Web Audio API:

```
[User Interaction Event]
           |
           v
[AudioContext Instance]
           |
   +-------+-------+
   |               |
   v               v
[Oscillator 1]   [Oscillator 2] (Detuned for rich harmonic warmth)
 (Sine Wave)      (Triangle)
   |               |
   +-------+-------+
           |
           v
[BiquadFilterNode] (Low-pass dynamic cutoff frequency modulation)
           |
           v
[GainNode (Envelope)] (Attack: 15ms, Decay: 80ms, Sustain: 0.2, Release: 250ms)
           |
           v
[StereoPannerNode / Master Output]
           |
           v
[Speakers / Headphones]
```

This delivers satisfying acoustic confirmation (micro-chimes, soft mechanical clicks, ambient harmonic confirmation) without downloading a single megabyte of MP3/WAV files.

---

## 4. Financial & Underwriting Calculation Engine

The platform mathematical engine executes instantaneous client-side calculations across four interwoven modules:

### 4.1 Loan Amortization & Monthly Outflow
$$	ext{EMI} = P \cdot r \cdot rac{(1 + r)^n}{(1 + r)^n - 1}$$
Where $P$ is principal, $r$ is monthly interest rate ($	ext{Annual Rate} / 12 / 100$), and $n$ is tenure in months.

### 4.2 Banking Consortium FOIR Benchmark
$$	ext{Max Allowed EMI} = 	ext{Monthly Income} 	imes 0.40$$
$$	ext{Eligible Loan Capacity} = rac{	ext{Max Allowed EMI} \cdot ((1+r)^n - 1)}{r \cdot (1+r)^n}$$

### 4.3 Composite Acquisition Cost (Karnataka 6.6%)
$$	ext{Acquisition Fee} = 	ext{Property Cost} 	imes (0.05 + 0.001 + 0.005 + 0.01) = 	ext{Property Cost} 	imes 0.066$$

### 4.4 Indian Tax Shield Engine
- **Section 24(b):** Up to ₹2,00,000 annual interest deduction on self-occupied properties (100% deduction on commercially rented properties).
- **Section 80C:** Up to ₹1,50,000 principal repayment deduction.
- **Combined Annual Shield:** Up to ₹3,50,000 deductible from gross taxable income, yielding up to ₹1,09,200 annual cash tax savings at the 30% tax bracket (+ cess).

---

## 5. Zero-Void Layout Grid System

The Section 04 spatial layout incorporates our **Zero-Void Matrix Architecture**:
- **Grid Container:** 3-column responsive grid on desktop (`minmax(320px, 1fr)`).
- **Pillar 19 Full-Width Capstone Hero:** Configured with `grid-column: 1 / -1; width: 100%;` to anchor the bottom of the section with zero stranded whitespace.
- **Paired Symmetry:** Secondary investment telemetry (resale premium projection) seamlessly pairs with primary acquisition telemetry to guarantee an even, balanced baseline.

---

## 6. Cryptographic Security & SHA-256 Title Vault

For institutional investors, the platform provides immutable token generation for title verification:
```javascript
async function generateTitleVaultHash(unitId, reraNo, timestamp, investorRef) {
  const payload = `${unitId}::${reraNo}::${timestamp}::${investorRef}::HRL_ROHAN_JV_2026`;
  const msgBuffer = new TextEncoder().encode(payload);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
```

This cryptographic string is stamped onto downloadable term sheets and acquisition receipts.

---

*HRL International Private Limited × Rohan Corporation Systems Engineering Group.*
