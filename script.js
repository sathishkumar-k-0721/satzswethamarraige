/* ═══════════════════════════════════════════════
   Wedding Site · Sathishkumar & Swetha · 2026
   Shared script: stars, hearts, butterflies,
                  countdown, scroll-reveal, sparkle
═══════════════════════════════════════════════ */

/* ─── STAR FIELD ──────────────────────────────
   Creates tiny twinkling star divs. All styles
   are set inline so no class dependency needed.
─────────────────────────────────────────────── */
function initStars(containerId, count) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var frag = document.createDocumentFragment();
  for (var i = 0; i < count; i++) {
    var star = document.createElement('div');
    var size = Math.random() * 2.2 + 0.4;
    star.style.cssText = [
      'position:absolute',
      'border-radius:50%',
      'background:#fff',
      'width:'  + size + 'px',
      'height:' + size + 'px',
      'top:'    + (Math.random() * 100) + '%',
      'left:'   + (Math.random() * 100) + '%',
      'opacity:' + (Math.random() * 0.55 + 0.08).toFixed(2),
      'animation:twinkle ' + (Math.random() * 3 + 2).toFixed(1) + 's ease infinite',
      'animation-delay:' + (Math.random() * 5).toFixed(2) + 's',
    ].join(';');
    frag.appendChild(star);
  }
  container.appendChild(frag);
}

/* ═══════════════════════════════════════════════
   PARTICLE COLOURS — shared by hearts & butterflies
═══════════════════════════════════════════════ */
var HEART_COLORS = [
  '#d4768e', '#e8749a', '#f4a8bc',
  '#c9a84c', '#e8cc80', '#a83458', '#ff6b9d',
];

/* ─── HEART ────────────────────────────────────
   Pure bezier-heart particles that fall gently.
   Oval/petal shapes removed entirely.
─────────────────────────────────────────────── */
function Heart(canvas, spread) {
  this.canvas = canvas;
  this.init(spread);
}

Heart.prototype.init = function (spread) {
  var w = this.canvas.width, h = this.canvas.height;
  this.x       = Math.random() * w;
  this.y       = spread ? Math.random() * h : -20 - Math.random() * 80;
  this.sz      = Math.random() * 11 + 4;
  this.vy      = Math.random() * 0.85 + 0.22;
  this.vx      = (Math.random() - 0.5) * 0.55;
  this.alpha   = Math.random() * 0.45 + 0.08;
  this.rot     = Math.random() * Math.PI * 2;
  this.rotV    = (Math.random() - 0.5) * 0.022;
  this.wobble  = Math.random() * Math.PI * 2;
  this.wobbleV = Math.random() * 0.03 + 0.008;
  this.color   = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
  /* NOTE: isPetal removed — all particles are hearts now */
};

Heart.prototype.update = function () {
  this.y      += this.vy;
  this.wobble += this.wobbleV;
  this.x      += this.vx + Math.sin(this.wobble) * 0.32;
  this.rot    += this.rotV;
  if (this.y > this.canvas.height + 30) this.init(false);
};

Heart.prototype.draw = function (ctx) {
  ctx.save();
  ctx.globalAlpha = this.alpha;
  ctx.fillStyle   = this.color;
  ctx.translate(this.x, this.y);
  ctx.rotate(this.rot);

  var s = this.sz;
  ctx.beginPath();
  ctx.moveTo(0, s * 0.9);
  /* left lobe */
  ctx.bezierCurveTo(-s * 0.06, s * 0.6, -s * 1.05, s * 0.35, -s * 0.72, -s * 0.1);
  ctx.bezierCurveTo(-s * 0.52, -s * 0.52, -s * 0.08, -s * 0.58, 0, -s * 0.18);
  /* right lobe */
  ctx.bezierCurveTo( s * 0.08, -s * 0.58,  s * 0.52, -s * 0.52,  s * 0.72, -s * 0.1);
  ctx.bezierCurveTo( s * 1.05,  s * 0.35,  s * 0.06,  s * 0.6,   0,         s * 0.9);
  ctx.fill();
  ctx.restore();
};

/* ─── BUTTERFLY ────────────────────────────────
   Canvas-drawn butterflies that fly across the
   screen with realistic flapping wings.

   Wing flap:  Math.abs(sin(tick × flapFreq))
               → 0 = wings closed, 1 = wings open
               → ctx.scale(wingSpread, 1) creates
                  the natural open/close motion.

   Flight path: horizontal drift + gentle sine wave.
─────────────────────────────────────────────── */

/* Palettes: [upperFill, lowerFill, outline/body]
   Subtle translucent fill + clear outline = logo-style wing cells */
var BUTTERFLY_PALETTES = [
  ['rgba(201,168,76,0.13)',  'rgba(201,168,76,0.08)',  'rgba(201,168,76,0.72)' ], /* gold      */
  ['rgba(212,116,141,0.13)','rgba(212,116,141,0.08)', 'rgba(212,116,141,0.72)'], /* rose      */
  ['rgba(244,168,188,0.13)','rgba(212,116,141,0.08)', 'rgba(244,168,188,0.68)'], /* pink      */
  ['rgba(232,204,128,0.13)','rgba(201,168,76,0.08)',  'rgba(232,204,128,0.68)'], /* cream-gold*/
  ['rgba(255,210,228,0.12)','rgba(212,116,141,0.07)', 'rgba(255,180,210,0.65)'], /* blush     */
];

function Butterfly(canvas, spread) {
  this.canvas = canvas;
  this.init(spread);
}

Butterfly.prototype.init = function (spread) {
  var w = this.canvas.width;
  var h = this.canvas.height;

  this.dir   = Math.random() > 0.5 ? 1 : -1;
  this.x     = spread ? Math.random() * w : (this.dir === 1 ? -100 : w + 100);
  this.baseY = (0.06 + Math.random() * 0.76) * h;
  this.y     = this.baseY;

  this.sz       = Math.random() * 14 + 14;   /* 14–28 px — bigger & clearer  */
  this.vx       = (Math.random() * 0.6 + 0.3) * this.dir;
  this.waveAmp  = Math.random() * 22 + 10;
  this.waveFreq = Math.random() * 0.014 + 0.006;
  this.flapFreq = Math.random() * 0.10 + 0.11;   /* slightly faster flap       */
  this.tick     = Math.random() * 300;
  this.alpha    = Math.random() * 0.38 + 0.22;

  var p         = BUTTERFLY_PALETTES[Math.floor(Math.random() * BUTTERFLY_PALETTES.length)];
  this.cUpper   = p[0];   /* subtle fill  */
  this.cLower   = p[1];   /* subtle fill  */
  this.cOutline = p[2];   /* clear stroke */
};

Butterfly.prototype.update = function () {
  this.tick++;
  this.x  += this.vx;
  this.y   = this.baseY + Math.sin(this.tick * this.waveFreq) * this.waveAmp;

  var w = this.canvas.width;
  if (this.dir ===  1 && this.x >  w + 100) { this.init(false); this.x = -90; }
  if (this.dir === -1 && this.x < -100)      { this.init(false); this.x = w + 90; }
};

Butterfly.prototype.draw = function (ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);
  if (this.dir === -1) ctx.scale(-1, 1);

  var s  = this.sz;
  var sw = Math.max(0.06, Math.abs(Math.sin(this.tick * this.flapFreq))); /* wing spread 0..1 */
  var lw = Math.max(0.55, s * 0.048);  /* stroke width */

  /* ════ RIGHT UPPER WING ════ */
  ctx.save();
  ctx.scale(sw, 1);
  ctx.globalAlpha = this.alpha;

  /* Filled shape */
  ctx.fillStyle = this.cUpper;
  ctx.beginPath();
  ctx.moveTo(0,  s * 0.04);
  ctx.bezierCurveTo( s * 0.42, -s * 1.08,  s * 2.05, -s * 0.78,  s * 1.72,  s * 0.18);
  ctx.bezierCurveTo( s * 1.28,  s * 0.52,  s * 0.28,  s * 0.42,  0,  s * 0.04);
  ctx.fill();

  /* Outline */
  ctx.strokeStyle = this.cOutline;
  ctx.lineWidth   = lw;
  ctx.stroke();

  /* Vein ribs — 3 lines from body to outer edge */
  ctx.lineWidth   = Math.max(0.35, lw * 0.55);
  ctx.globalAlpha = this.alpha * 0.55;

  ctx.beginPath(); /* rib 1 — main */
  ctx.moveTo(0, s * 0.04);
  ctx.bezierCurveTo(s * 0.5, -s * 0.35, s * 1.25, -s * 0.22, s * 1.62, s * 0.12);
  ctx.stroke();

  ctx.beginPath(); /* rib 2 — upper */
  ctx.moveTo(s * 0.08, -s * 0.12);
  ctx.bezierCurveTo(s * 0.35, -s * 0.68, s * 0.95, -s * 0.78, s * 1.35, -s * 0.52);
  ctx.stroke();

  ctx.beginPath(); /* rib 3 — top */
  ctx.moveTo(s * 0.18, -s * 0.30);
  ctx.bezierCurveTo(s * 0.38, -s * 0.95, s * 0.82, -s * 0.98, s * 1.10, -s * 0.72);
  ctx.stroke();

  ctx.beginPath(); /* rib 4 — lower */
  ctx.moveTo(0, s * 0.18);
  ctx.bezierCurveTo(s * 0.42, s * 0.22, s * 1.05, s * 0.32, s * 1.45, s * 0.32);
  ctx.stroke();

  ctx.restore();

  /* ════ LEFT UPPER WING (mirror, dimmer) ════ */
  ctx.save();
  ctx.scale(-sw, 1);
  ctx.globalAlpha = this.alpha * 0.52;

  ctx.fillStyle = this.cUpper;
  ctx.beginPath();
  ctx.moveTo(0,  s * 0.04);
  ctx.bezierCurveTo( s * 0.42, -s * 1.08,  s * 2.05, -s * 0.78,  s * 1.72,  s * 0.18);
  ctx.bezierCurveTo( s * 1.28,  s * 0.52,  s * 0.28,  s * 0.42,  0,  s * 0.04);
  ctx.fill();
  ctx.strokeStyle = this.cOutline;
  ctx.lineWidth = lw;
  ctx.stroke();

  ctx.restore();

  /* ════ RIGHT LOWER WING ════ */
  ctx.save();
  ctx.scale(sw * 0.8, 1);
  ctx.globalAlpha = this.alpha * 0.82;

  ctx.fillStyle = this.cLower;
  ctx.beginPath();
  ctx.moveTo(0,  s * 0.08);
  ctx.bezierCurveTo( s * 0.28,  s * 0.32,  s * 1.18,  s * 0.78,  s * 0.98,  s * 1.12);
  ctx.bezierCurveTo( s * 0.58,  s * 1.38,  s * 0.08,  s * 0.92,  0,  s * 0.08);
  ctx.fill();
  ctx.strokeStyle = this.cOutline;
  ctx.lineWidth = lw * 0.85;
  ctx.stroke();

  /* Lower wing vein rib */
  ctx.lineWidth   = Math.max(0.3, lw * 0.5);
  ctx.globalAlpha = this.alpha * 0.35;
  ctx.beginPath();
  ctx.moveTo(s * 0.04, s * 0.20);
  ctx.bezierCurveTo(s * 0.38, s * 0.55, s * 0.70, s * 0.88, s * 0.88, s * 1.08);
  ctx.stroke();

  ctx.restore();

  /* ════ LEFT LOWER WING (mirror, dimmer) ════ */
  ctx.save();
  ctx.scale(-sw * 0.8, 1);
  ctx.globalAlpha = this.alpha * 0.50;

  ctx.fillStyle = this.cLower;
  ctx.beginPath();
  ctx.moveTo(0,  s * 0.08);
  ctx.bezierCurveTo( s * 0.28,  s * 0.32,  s * 1.18,  s * 0.78,  s * 0.98,  s * 1.12);
  ctx.bezierCurveTo( s * 0.58,  s * 1.38,  s * 0.08,  s * 0.92,  0,  s * 0.08);
  ctx.fill();
  ctx.strokeStyle = this.cOutline;
  ctx.lineWidth = lw * 0.85;
  ctx.stroke();

  ctx.restore();

  /* ════ BODY ════ */
  ctx.globalAlpha = this.alpha;
  ctx.fillStyle   = this.cOutline;
  ctx.beginPath();
  ctx.ellipse(0, s * 0.48, s * 0.10, s * 0.58, 0, 0, Math.PI * 2);
  ctx.fill();

  /* Head dot */
  ctx.beginPath();
  ctx.arc(0, -s * 0.06, s * 0.13, 0, Math.PI * 2);
  ctx.fill();

  /* ════ ANTENNAE ════ */
  ctx.strokeStyle = this.cOutline;
  ctx.lineWidth   = Math.max(0.5, lw * 0.72);
  ctx.globalAlpha = this.alpha * 0.70;

  ctx.beginPath();
  ctx.moveTo( s * 0.06, -s * 0.09);
  ctx.quadraticCurveTo( s * 0.68, -s * 0.98,  s * 0.78, -s * 1.18);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc( s * 0.78, -s * 1.18, s * 0.09, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-s * 0.06, -s * 0.09);
  ctx.quadraticCurveTo(-s * 0.68, -s * 0.98, -s * 0.78, -s * 1.18);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-s * 0.78, -s * 1.18, s * 0.09, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

/* ─── INIT PARTICLES ───────────────────────────
   Creates hearts + butterflies on the same canvas.
   Butterfly count is derived automatically from
   the heart count (≈ 22% of total, min 4).
─────────────────────────────────────────────── */
function initParticles(canvasId, heartCount) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var hearts      = [];
  var butterflies = [];
  var bfCount     = Math.max(5, Math.floor(heartCount * 0.30));

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (var i = 0; i < heartCount; i++) {
    hearts.push(new Heart(canvas, true));
  }
  for (var j = 0; j < bfCount; j++) {
    butterflies.push(new Butterfly(canvas, true));
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* Draw hearts first (background layer) */
    for (var i = 0; i < hearts.length; i++) {
      hearts[i].update();
      hearts[i].draw(ctx);
    }
    /* Draw butterflies on top */
    for (var j = 0; j < butterflies.length; j++) {
      butterflies[j].update();
      butterflies[j].draw(ctx);
    }

    requestAnimationFrame(loop);
  }
  loop();
}

/* ─── SCROLL REVEAL ───────────────────────────── */
function initScrollReveal() {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  els.forEach(function (el) { observer.observe(el); });

  /* Immediately reveal anything already in the viewport */
  setTimeout(function () {
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, 100);
}

/* ─── COUNTDOWN TIMER ─────────────────────────── */
function initCountdown() {
  var dEl = document.getElementById('t-days');
  var hEl = document.getElementById('t-hours');
  var mEl = document.getElementById('t-mins');
  var sEl = document.getElementById('t-secs');
  if (!dEl) return;

  var target = new Date('2026-06-18T09:00:00+05:30').getTime();

  function pad(n) { return String(n).padStart(2, '0'); }

  function flip(el, val) {
    if (el.textContent === val) return;
    el.classList.add('tick');
    setTimeout(function () {
      el.textContent = val;
      el.classList.remove('tick');
    }, 220);
  }

  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      var wrap = document.getElementById('timer-container');
      if (wrap) wrap.innerHTML = '<p class="timer-done">💍 &nbsp;The Day Has Arrived!&nbsp; 💍</p>';
      return;
    }
    flip(dEl, pad(Math.floor(diff / 86400000)));
    flip(hEl, pad(Math.floor((diff % 86400000) / 3600000)));
    flip(mEl, pad(Math.floor((diff % 3600000)  / 60000)));
    flip(sEl, pad(Math.floor((diff % 60000)    / 1000)));
  }

  tick();
  setInterval(tick, 1000);
}

/* ─── CLICK SPARKLE ───────────────────────────── */
document.addEventListener('click', function (e) {
  for (var i = 0; i < 9; i++) {
    (function (idx) {
      var el    = document.createElement('span');
      var angle = (idx / 9) * Math.PI * 2;
      var dist  = 28 + Math.random() * 24;
      var sz    = 9 + Math.random() * 10;
      var col   = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
      var dx    = Math.cos(angle) * dist;
      var dy    = Math.sin(angle) * dist;

      el.textContent = '♥';
      el.style.cssText = [
        'position:fixed',
        'left:' + e.clientX + 'px',
        'top:'  + e.clientY + 'px',
        'pointer-events:none',
        'z-index:9998',
        'font-size:' + sz + 'px',
        'color:' + col,
        'transform:translate(-50%,-50%)',
        'transition:transform 0.65s cubic-bezier(.2,.8,.4,1),opacity 0.65s ease',
        'opacity:1',
        'user-select:none',
      ].join(';');

      document.body.appendChild(el);
      requestAnimationFrame(function () {
        el.style.transform = 'translate(calc(-50% + ' + dx + 'px),calc(-50% + ' + dy + 'px)) scale(0.2)';
        el.style.opacity   = '0';
      });
      setTimeout(function () { el.remove(); }, 700);
    })(i);
  }
});
