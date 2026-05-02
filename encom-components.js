/* ═══════════════════════════════════════════════════════
   ENCOM COMPONENTS — LifeOS v1.0
   Extraído de arscan/encom-boardroom (MIT License)
   Standalone — sin browserify, sin jQuery, sin Three.js
   Solo activo cuando html.encom está activo
═══════════════════════════════════════════════════════ */

/* ──────────────────────────────
   SWIRL POINT (partícula orbital)
────────────────────────────── */
function SwirlPoint(label, canvas) {
  this.hitTime     = Date.now();
  this.hit         = true;
  this.startTime   = Date.now();
  this.hitCount    = 1;
  this.lastTime    = Date.now();
  this.decayTime   = 200;
  this.chaseRate   = .005;
  this.startRadians = Math.random() * Math.PI * 2;
  this.label       = label;
  this.canvas      = canvas;
  this.maxRadius   = Math.min(canvas.width, canvas.height) / 2;
  this.context     = canvas.getContext('2d');
  this.radius      = this.maxRadius / 2;
  this.targetRadius = this.radius;
  this.x = 0; this.y = 0;
  this.firstHit    = true;
}

SwirlPoint.prototype.animate = function() {
  var timeSinceStart = Date.now() - this.startTime;
  var animateTime    = Date.now() - this.lastTime;
  var radians = this.startRadians + (timeSinceStart / 10000) * Math.PI * 2;
  this.prevX = this.x; this.prevY = this.y;
  this.x = this.canvas.width  / 2 + Math.sin(radians) * this.radius;
  this.y = this.canvas.height / 2 + Math.cos(radians) * this.radius;
  if (!this.prevX) { this.prevX = this.x; this.prevY = this.y; }
  this.targetRadius = Math.max(1, this.targetRadius - animateTime / this.decayTime);
  if (this.targetRadius > this.radius) {
    this.radius = Math.min(this.targetRadius, this.radius + this.chaseRate * animateTime);
  } else {
    this.radius = Math.max(this.targetRadius, this.radius - this.chaseRate * animateTime);
  }
  this.lastTime = Date.now();
};

SwirlPoint.prototype.registerHit = function() {
  this.targetRadius = Math.min(this.maxRadius, this.targetRadius + 20);
  this.hitTime = Date.now();
  this.hit = true;
  this.hitCount++;
};

SwirlPoint.prototype.draw = function() {
  if (Date.now() - this.startTime < 1000) {
    this.context.fillStyle = '#00eeee';
    this.context.strokeStyle = '#00eeee';
  } else if (Date.now() - this.hitTime < 1000) {
    this.context.fillStyle = '#ffcc00';
    this.context.strokeStyle = '#ffcc00';
  } else {
    this.context.fillStyle = '#4a8a8a';
    this.context.strokeStyle = '#4a8a8a';
  }
  if (this.firstHit) {
    this.context.beginPath();
    this.context.arc(this.x, this.y, 3, 0, 2 * Math.PI);
    this.context.fill();
    this.context.closePath();
    this.firstHit = false;
  } else if (this.hit) {
    this.hit = false;
    this.context.font = '9px Inconsolata';
    if (this.x < this.canvas.width / 2) {
      this.context.fillText(this.label, this.x + 10, this.y - 10);
    } else {
      this.context.fillText(this.label, this.x + 10, this.y + 10);
    }
  }
  this.context.beginPath();
  this.context.lineWidth = 1 + 2 * this.radius / this.maxRadius;
  this.context.moveTo(this.prevX, this.prevY);
  this.context.lineTo(this.x, this.y);
  this.context.stroke();
  this.context.closePath();
};

/* ──────────────────────────────
   SWIRLS (contenedor de partículas)
────────────────────────────── */
function EncomSwirls(containerId) {
  this.container = document.getElementById(containerId);
  if (!this.container) return;

  this.canvas = document.createElement('canvas');
  this.canvas.width  = this.container.clientWidth  || 290;
  this.canvas.height = this.container.clientHeight || 200;
  this.canvas.style.display = 'block';
  this.container.appendChild(this.canvas);
  this.context = this.canvas.getContext('2d');
  this.width   = this.canvas.width;
  this.height  = this.canvas.height;
  this.points  = {};

  // fondo con esquinas estilo boardroom
  this._background = this._makeBackground();
  this.context.drawImage(this._background, 0, 0);
}

EncomSwirls.prototype._makeBackground = function() {
  var c = document.createElement('canvas');
  c.width  = this.width;
  c.height = this.height;
  var ctx  = c.getContext('2d');

  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, this.width, this.height);

  ctx.strokeStyle = 'rgba(0,238,238,.12)';
  ctx.lineWidth = 1;

  // eje vertical
  ctx.beginPath();
  ctx.moveTo(this.width / 2 + .5, 5);
  ctx.lineTo(this.width / 2 + .5, this.height - 5);
  ctx.stroke();

  // eje horizontal
  ctx.beginPath();
  ctx.moveTo(5, this.height / 2);
  ctx.lineTo(this.width - 5, this.height / 2);
  ctx.stroke();

  // esquinas estilo Encom
  ctx.strokeStyle = 'rgba(0,238,238,.35)';
  ctx.lineWidth = 2;
  var cs = 16; // corner size
  // top-left
  ctx.beginPath(); ctx.moveTo(0, cs); ctx.lineTo(0, 0); ctx.lineTo(cs, 0); ctx.stroke();
  // top-right
  ctx.beginPath(); ctx.moveTo(this.width - cs, 0); ctx.lineTo(this.width, 0); ctx.lineTo(this.width, cs); ctx.stroke();
  // bottom-left
  ctx.beginPath(); ctx.moveTo(0, this.height - cs); ctx.lineTo(0, this.height); ctx.lineTo(cs, this.height); ctx.stroke();
  // bottom-right
  ctx.beginPath(); ctx.moveTo(this.width - cs, this.height); ctx.lineTo(this.width, this.height); ctx.lineTo(this.width, this.height - cs); ctx.stroke();

  // ticks en centros de ejes
  ctx.fillStyle = 'rgba(0,238,238,.3)';
  ctx.fillRect(this.width / 2 - 1.5, 2, 3, 5);
  ctx.fillRect(this.width / 2 - 1.5, this.height - 7, 3, 5);
  ctx.fillRect(2, this.height / 2 - 1.5, 5, 3);
  ctx.fillRect(this.width - 7, this.height / 2 - 1.5, 5, 3);

  return c;
};

EncomSwirls.prototype.tick = function() {
  var keys = Object.keys(this.points);

  // limpiar puntos muertos
  var checkIdx = Math.floor(Math.random() * keys.length);
  if (keys.length > 0 && this.points[keys[checkIdx]] &&
      this.points[keys[checkIdx]].radius < 2) {
    delete this.points[keys[checkIdx]];
  }

  if (!this.evenFrame) {
    this.evenFrame = true;
    this.context.globalAlpha = .08;
    this.context.drawImage(this._background, 0, 0);
    this.context.globalAlpha = 1.0;
  } else {
    this.evenFrame = false;
    for (var p in this.points) {
      this.points[p].animate();
      this.points[p].draw();
    }
  }
};

EncomSwirls.prototype.hit = function(label) {
  if (this.points[label]) {
    this.points[label].registerHit();
    return;
  }
  this.points[label] = new SwirlPoint(label, this.canvas);
};

// Genera hits aleatorios para modo decorativo (sin data stream real)
EncomSwirls.prototype.startAutoHits = function(labels, intervalMs) {
  var self = this;
  var lbl  = labels || ['A','B','C','D','E','F'];
  var iv   = intervalMs || 1800;
  this._autoInterval = setInterval(function() {
    if (!document.documentElement.classList.contains('encom')) {
      clearInterval(self._autoInterval);
      return;
    }
    self.hit(lbl[Math.floor(Math.random() * lbl.length)]);
  }, iv + Math.random() * 600);
};

EncomSwirls.prototype.destroy = function() {
  clearInterval(this._autoInterval);
  if (this.canvas && this.canvas.parentNode) {
    this.canvas.parentNode.removeChild(this.canvas);
  }
  this.points = {};
};

/* ──────────────────────────────
   SIMPLE CLOCK (reloj analógico canvas)
────────────────────────────── */
function EncomSimpleClock(canvasId) {
  this.firstTick = new Date();
  var canvas = document.getElementById(canvasId);
  if (!canvas) return;
  this.context = canvas.getContext('2d');
  this.width   = canvas.width;
  this.height  = canvas.height;
  this.centerx = this.width  / 2;
  this.centery = this.height / 2;
  this._backBuffer = this._makeBackBuffer();
}

EncomSimpleClock.prototype._makeBackBuffer = function() {
  var c   = document.createElement('canvas');
  c.width  = this.width;
  c.height = this.height;
  var ctx  = c.getContext('2d');
  var x = this.centerx, y = this.centery;

  ctx.strokeStyle = 'rgba(0,238,238,.15)';
  ctx.lineWidth   = 1;
  ctx.beginPath(); ctx.arc(x, y, 8,  0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); ctx.stroke();

  ctx.strokeStyle = 'rgba(0,238,238,.1)';
  ctx.beginPath();
  ctx.moveTo(x, y + 8);  ctx.lineTo(x, y + 24);
  ctx.moveTo(x, y - 8);  ctx.lineTo(x, y - 24);
  ctx.moveTo(x + 8, y);  ctx.lineTo(x + 24, y);
  ctx.moveTo(x - 8, y);  ctx.lineTo(x - 24, y);
  ctx.stroke();
  return c;
};

EncomSimpleClock.prototype.tick = function() {
  var t = new Date() - this.firstTick;
  this.context.clearRect(0, 0, this.width, this.height);
  this.context.drawImage(this._backBuffer, 0, 0);

  this.context.strokeStyle = 'rgba(0,238,238,.6)';
  this.context.lineWidth   = 1;
  this.context.beginPath();
  // aguja minutos
  this.context.moveTo(this.centerx, this.centery);
  this.context.lineTo(
    this.centerx + 24 * Math.sin(t / 10000),
    this.centery - 24 * Math.cos(t / 10000)
  );
  // aguja horas
  this.context.moveTo(this.centerx, this.centery);
  this.context.lineTo(
    this.centerx + 18 * Math.sin(t / 100000),
    this.centery - 18 * Math.cos(t / 100000)
  );
  this.context.stroke();
  this.context.closePath();

  // punto centro
  this.context.fillStyle = '#00eeee';
  this.context.beginPath();
  this.context.arc(this.centerx, this.centery, 2, 0, Math.PI * 2);
  this.context.fill();
};

/* ──────────────────────────────
   ENCOM TICKER (texto animado estilo boardroom)
────────────────────────────── */
function EncomTicker(containerId) {
  this.container = document.getElementById(containerId);
  if (!this.container) return;
  this._labels = ['SYS','NET','I/O','MEM','CPU','DAT'];
  this._idx    = 0;
  this._val    = 0;
  this._target = 0;
  this._start();
}

EncomTicker.prototype._start = function() {
  var self = this;
  this._renderLabel();
  this._tickInterval = setInterval(function() {
    if (!document.documentElement.classList.contains('encom')) {
      clearInterval(self._tickInterval);
      return;
    }
    self._val += (self._target - self._val) * 0.15;
    if (Math.abs(self._val - self._target) < 0.5) {
      self._target = Math.random() * 200 - 100;
      self._idx    = (self._idx + 1) % self._labels.length;
      self._renderLabel();
    }
    self._renderVal();
  }, 60);
};

EncomTicker.prototype._renderLabel = function() {
  var lbl = this.container.querySelector('.enc-tick-lbl');
  if (lbl) lbl.textContent = this._labels[this._idx];
};

EncomTicker.prototype._renderVal = function() {
  var v = this.container.querySelector('.enc-tick-val');
  if (v) {
    var n = this._val.toFixed(1);
    v.textContent = (this._val >= 0 ? '+' : '') + n;
    v.style.color = this._val >= 0 ? '#00eeee' : '#ff3333';
  }
};

EncomTicker.prototype.destroy = function() {
  clearInterval(this._tickInterval);
};

/* ──────────────────────────────
   ENCOM HEADER LINES
   Líneas animadas estilo light-table header
────────────────────────────── */
function EncomHeaderLine(el) {
  // el: elemento DOM con clase enc-hdr-line
  // anima width de 0 a 100% al entrar en viewport
  if (!el) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        el.style.transition = 'width 1.2s cubic-bezier(.4,0,.2,1)';
        el.style.width = '100%';
        obs.disconnect();
      }
    });
  }, { threshold: 0.1 });
  obs.observe(el);
}

/* ──────────────────────────────
   ENCOM MANAGER
   Inicia y destruye todos los componentes según el tema
────────────────────────────── */
var EncomManager = (function() {
  var _swirls   = [];
  var _clocks   = [];
  var _tickers  = [];
  var _raf      = null;
  var _active   = false;

  function _animLoop() {
    if (!_active) return;
    _swirls.forEach(function(s) { s.tick(); });
    _clocks.forEach(function(c) { c.tick(); });
    _raf = requestAnimationFrame(_animLoop);
  }

  function init() {
    if (_active) return;
    _active = true;

    // ── Swirls en el anverso ──
    var swirlTargets = [
      { id: 'enc-swirls-fin',      labels: ['I','E','Δ','$','%','→'], interval: 1600 },
      { id: 'enc-swirls-activity', labels: ['⚡','✓','○','→','▲','◆'], interval: 1400 },
    ];
    swirlTargets.forEach(function(t) {
      var el = document.getElementById(t.id);
      if (!el) return;
      var s = new EncomSwirls(t.id);
      s.startAutoHits(t.labels, t.interval);
      _swirls.push(s);
    });

    // ── Simple Clock en el header Financiero ──
    var clockCanvas = document.getElementById('enc-clock-fin');
    if (clockCanvas) {
      _clocks.push(new EncomSimpleClock('enc-clock-fin'));
    }

    // ── Ticker en el header Financiero ──
    var tickerEl = document.getElementById('enc-ticker-fin');
    if (tickerEl) {
      _tickers.push(new EncomTicker('enc-ticker-fin'));
    }

    // ── Header lines animadas ──
    document.querySelectorAll('.enc-hdr-line').forEach(function(el) {
      el.style.width = '0';
      new EncomHeaderLine(el);
    });

    _animLoop();
  }

  function destroy() {
    _active = false;
    if (_raf) { cancelAnimationFrame(_raf); _raf = null; }
    _swirls.forEach(function(s)  { s.destroy(); });
    _clocks.forEach(function(c)  { /* canvas se limpia solo */ });
    _tickers.forEach(function(t) { t.destroy(); });
    _swirls  = [];
    _clocks  = [];
    _tickers = [];
  }

  return { init: init, destroy: destroy };
})();

/* ──────────────────────────────
   AUTO-INIT
   Se engancha al toggle del tema
────────────────────────────── */
(function() {
  // Observar cambios en la clase de html
  var _observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      if (m.attributeName === 'class') {
        var isEncom = document.documentElement.classList.contains('encom');
        if (isEncom) {
          // pequeño delay para que el DOM termine de renderizar
          setTimeout(EncomManager.init, 300);
        } else {
          EncomManager.destroy();
        }
      }
    });
  });

  _observer.observe(document.documentElement, { attributes: true });

  // Si ya está en modo encom al cargar
  if (document.documentElement.classList.contains('encom')) {
    setTimeout(EncomManager.init, 300);
  }
})();
