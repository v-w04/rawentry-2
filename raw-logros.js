/* ═══════════════════════════════════════════════════════
   RAW LOGROS — Panel rediseñado estilo dial
   Cards con glow de color por categoría, header con nivel/XP,
   sidebar completados + categorías + recompensa por nivel
   v2.0 · Mismo lenguaje visual que el dial
═══════════════════════════════════════════════════════ */

/* ── Inyectar estilos del panel ── */
(function _inyectarEstilosLogros(){
  if(document.getElementById('logros-styles')) return;
  var s = document.createElement('style');
  s.id = 'logros-styles';
  s.textContent = `
/* ── PANEL LOGROS WRAPPER ── */
#board-logros {
  display:flex;
  flex-direction:column;
  overflow:hidden;
  background:#020810;
}

/* ── HEADER ── */
#lgr-header {
  display:flex;
  align-items:center;
  gap:20px;
  padding:14px 24px 12px;
  background:rgba(1,5,14,0.98);
  border-bottom:1px solid rgba(0,200,120,0.18);
  box-shadow:0 1px 0 rgba(0,255,136,0.08);
  flex-shrink:0;
  flex-wrap:wrap;
}

/* Nivel circular */
#lgr-nivel-badge {
  width:64px; height:64px;
  border-radius:50%;
  background:rgba(0,12,24,0.95);
  border:2px solid rgba(0,200,120,0.5);
  box-shadow:0 0 20px rgba(0,255,136,0.2), inset 0 0 12px rgba(0,255,136,0.06);
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  flex-shrink:0;
  animation:logrosBadgePulse 3s ease-in-out infinite;
}
@keyframes logrosBadgePulse {
  0%,100%{ box-shadow:0 0 16px rgba(0,255,136,0.18), inset 0 0 10px rgba(0,255,136,0.05); border-color:rgba(0,200,120,0.42); }
  50%    { box-shadow:0 0 30px rgba(0,255,136,0.35), inset 0 0 18px rgba(0,255,136,0.12); border-color:rgba(0,255,136,0.72); }
}
#lgr-nivel-num  { font-size:20px; font-weight:800; color:#00ff88; letter-spacing:-.02em; line-height:1; text-shadow:0 0 10px rgba(0,255,136,0.6); }
#lgr-nivel-lbl  { font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:.12em; color:rgba(0,255,136,0.5); margin-top:1px; }

/* Progreso general */
#lgr-progreso-wrap { flex:1; min-width:200px; }
#lgr-progreso-titulo { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.12em; color:rgba(255,255,255,0.35); margin-bottom:6px; }
#lgr-progreso-bar-wrap {
  height:6px;
  background:rgba(0,255,136,0.10);
  border-radius:0;
  overflow:hidden;
  position:relative;
}
#lgr-progreso-bar {
  height:100%;
  background:linear-gradient(90deg,#00cc66,#00ff88);
  box-shadow:0 0 10px rgba(0,255,136,0.6);
  transition:width 1s cubic-bezier(.4,0,.2,1);
  animation:logrosFillPulse 2.5s ease-in-out infinite;
}
@keyframes logrosFillPulse {
  0%,100%{ box-shadow:0 0 8px rgba(0,255,136,0.5); }
  50%    { box-shadow:0 0 18px rgba(0,255,136,0.9), 0 0 4px #00ff88; }
}
#lgr-progreso-txt { display:flex; justify-content:space-between; margin-top:5px; }
#lgr-progreso-frac { font-size:12px; font-weight:700; color:#fff; }
#lgr-prox-recompensa { font-size:11px; color:rgba(255,255,255,0.4); }
#lgr-prox-xp { font-size:11px; font-weight:700; color:#fbbf24; text-shadow:0 0 6px rgba(251,191,36,0.4); }
#lgr-prox-dinero { font-size:11px; font-weight:700; color:#00ff88; text-shadow:0 0 6px rgba(0,255,136,0.4); }

/* Filtros y ordenamiento */
#lgr-filtros {
  display:flex; align-items:center; gap:8px; flex-wrap:wrap;
  margin-left:auto;
}
.lgr-select {
  background:rgba(0,12,24,0.9);
  border:1px solid rgba(0,255,136,0.22);
  border-radius:0;
  color:rgba(0,255,136,0.8);
  font-family:inherit; font-size:10px; font-weight:600;
  padding:5px 10px; outline:none; cursor:pointer;
  letter-spacing:.04em;
  -webkit-appearance:none; appearance:none;
  transition:border-color .15s;
}
.lgr-select:hover { border-color:rgba(0,255,136,0.5); }
.lgr-select option { background:#020810; color:#fff; }

.lgr-pill-group { display:flex; gap:2px; background:rgba(0,0,0,0.6); padding:2px; border:1px solid rgba(0,255,136,0.12); }
.lgr-pill {
  padding:5px 12px;
  font-size:10px; font-weight:700;
  text-transform:uppercase; letter-spacing:.08em;
  background:none; border:none;
  color:rgba(255,255,255,0.35);
  cursor:pointer; font-family:inherit;
  transition:all .12s;
}
.lgr-pill:hover  { color:#fff; background:rgba(0,255,136,0.06); }
.lgr-pill.on     { background:rgba(0,255,136,0.14); color:#00ff88; box-shadow:0 0 8px rgba(0,255,136,0.2); }

.lgr-btn-volver {
  display:flex; align-items:center; gap:6px;
  padding:6px 14px;
  background:rgba(0,12,24,0.9);
  border:1px solid rgba(0,255,136,0.25);
  border-radius:0;
  color:rgba(0,255,136,0.8); font-family:inherit;
  font-size:11px; font-weight:700;
  text-transform:uppercase; letter-spacing:.08em;
  cursor:pointer; transition:all .15s;
}
.lgr-btn-volver:hover { background:rgba(0,255,136,0.10); color:#fff; box-shadow:0 0 12px rgba(0,255,136,0.2); }
.lgr-btn-done {
  display:flex; align-items:center; gap:5px;
  padding:5px 12px;
  background:rgba(0,0,0,0.5);
  border:1px solid rgba(255,255,255,0.10);
  border-radius:0; color:rgba(255,255,255,0.4);
  font-family:inherit; font-size:10px; font-weight:600;
  text-transform:uppercase; letter-spacing:.06em;
  cursor:pointer; transition:all .15s;
}
.lgr-btn-done:hover { border-color:rgba(255,255,255,0.25); color:#fff; }
.lgr-btn-done.on    { border-color:rgba(251,191,36,0.4); color:#fbbf24; background:rgba(251,191,36,0.06); }

/* ── BODY — grid + sidebar ── */
#lgr-body {
  display:grid;
  grid-template-columns:1fr 300px;
  gap:0;
  flex:1;
  overflow:hidden;
}

/* ── GRID DE CARDS ── */
#lgr-grid-wrap {
  overflow-y:auto;
  overflow-x:hidden;
  padding:16px 20px 24px;
}
#lgr-grid-wrap::-webkit-scrollbar { width:4px; }
#lgr-grid-wrap::-webkit-scrollbar-thumb { background:rgba(0,255,136,0.2); }

#inv-grid-full {
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(160px,1fr));
  gap:8px;
}

/* ── CARD DE LOGRO ── */
.lgr-card {
  position:relative;
  display:flex;
  flex-direction:column;
  align-items:stretch;
  gap:0;
  background:rgba(14,14,22,0.92);
  border:1px solid rgba(255,255,255,0.10);
  border-radius:0;
  cursor:pointer;
  transition:transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .18s, border-color .15s;
  overflow:hidden;
  user-select:none;
  aspect-ratio:unset;
}
/* Zona ícono — 2/3 superiores de la card, como RL */
.lgr-ico-wrap {
  width:100%;
  height:110px;
  display:flex;
  align-items:center;
  justify-content:center;
  position:relative;
  flex-shrink:0;
  background:radial-gradient(ellipse at 50% 55%, rgba(30,30,50,0.85) 0%, rgba(6,6,14,0.98) 100%);
}
/* Zona info — franja inferior compacta */
.lgr-info {
  width:100%;
  padding:9px 10px 10px;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:4px;
  background:rgba(6,6,14,0.92);
  border-top:1px solid rgba(255,255,255,0.07);
}
.lgr-card::before {
  content:'';
  position:absolute;
  top:0; left:0; right:0;
  height:2px;
  background:var(--lgr-color, rgba(255,255,255,0.2));
  box-shadow:0 0 8px var(--lgr-color, rgba(255,255,255,0.2));
  opacity:0.7;
  transition:opacity .2s;
}
/* Esquinas estilo dial */
.lgr-card::after {
  content:'';
  position:absolute;
  bottom:0; right:0;
  width:8px; height:8px;
  border-bottom:2px solid var(--lgr-color, rgba(255,255,255,0.2));
  border-right:2px solid var(--lgr-color, rgba(255,255,255,0.2));
  opacity:0.5;
}
.lgr-card:hover {
  transform:translateY(-5px) scale(1.025);
  border-color:rgba(255,255,255,0.22);
  box-shadow:0 8px 28px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.14);
}
.lgr-card:hover::before { opacity:1; }
.lgr-card.done {
  background:rgba(10,18,12,0.90);
  border-color:rgba(255,255,255,0.14);
}
.lgr-card.done::before { opacity:1; box-shadow:0 0 12px rgba(0,255,136,0.5); }
.lgr-card.activo {
  border-color:rgba(251,191,36,0.3);
}

.lgr-desc {
  font-size:9px; color:rgba(255,255,255,0.3); text-align:center;
  line-height:1.4; max-width:100%;
  display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden;
  letter-spacing:.01em;
}


/* Candado */
.lgr-lock {
  position:absolute; top:6px; right:8px;
  font-size:10px; color:rgba(255,255,255,0.18);
}
.lgr-card.done .lgr-lock { display:none; }

/* Ícono */
.lgr-ico {
  font-size:52px;
  line-height:1;
  transition:filter .2s, transform .2s;
  filter:grayscale(60%) brightness(.4);
  opacity:.45;
}
.lgr-card.done .lgr-ico,
.lgr-card:hover .lgr-ico {
  filter:drop-shadow(0 0 16px var(--lgr-color, rgba(255,255,255,0.5)));
  opacity:1;
  transform:scale(1.08);
}

/* Nombre */
.lgr-nombre {
  font-size:11px; font-weight:700;
  text-align:center; color:rgba(255,255,255,0.82);
  line-height:1.35; width:100%;
  letter-spacing:-.01em;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
}
.lgr-card.done .lgr-nombre { color:#fff; }
.lgr-card.done .lgr-nombre { color:#fff; }

/* Precio */
.lgr-precio {
  font-size:13px; font-weight:800;
  font-variant-numeric:tabular-nums;
  color:rgba(255,255,255,0.50);
  letter-spacing:-.02em;
}
.lgr-card.done .lgr-precio {
  color:var(--lgr-color);
  text-shadow:0 0 8px var(--lgr-color);
}
.lgr-card.done .lgr-precio { color:var(--lgr-color, #00ff88); text-shadow:0 0 6px var(--lgr-color, rgba(0,255,136,0.4)); }

/* Badge (ACTIVO, DENTISTA, etc.) */
.lgr-badge {
  font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:.08em;
  padding:2px 7px;
  background:rgba(251,191,36,0.12);
  border:1px solid rgba(251,191,36,0.3);
  color:#fbbf24;
}

/* Progreso 0/1 */
.lgr-progress-row {
  display:flex; align-items:center; gap:6px; width:100%;
  margin-top:2px;
}
.lgr-progress-bar {
  flex:1; height:2px;
  background:rgba(255,255,255,0.06);
  overflow:hidden;
}
.lgr-progress-fill {
  height:100%;
  background:var(--lgr-color, rgba(255,255,255,0.3));
  box-shadow:0 0 4px var(--lgr-color, rgba(255,255,255,0.3));
  transition:width .6s ease;
}
.lgr-progress-txt {
  font-size:9px; font-weight:600; color:rgba(255,255,255,0.28);
  flex-shrink:0; letter-spacing:.02em;
}
.lgr-card.done .lgr-progress-txt { color:var(--lgr-color, #00ff88); }

/* Badge completado */
.lgr-done-badge {
  position:absolute; top:6px; left:8px;
  font-size:9px; font-weight:800;
  padding:1px 7px;
  background:rgba(74,222,128,0.12);
  border:1px solid rgba(74,222,128,0.35);
  color:#4ADE80;
  letter-spacing:.06em;
  display:none;
}
.lgr-card.done .lgr-done-badge { display:block; }

/* ── SIDEBAR ── */
#lgr-sidebar {
  overflow-y:auto;
  border-left:1px solid rgba(0,255,136,0.12);
  display:flex;
  flex-direction:column;
  gap:0;
  background:rgba(0,6,14,0.96);
}
#lgr-sidebar::-webkit-scrollbar { width:3px; }
#lgr-sidebar::-webkit-scrollbar-thumb { background:rgba(0,255,136,0.2); }

.lgr-sidebar-section {
  border-bottom:1px solid rgba(0,255,136,0.08);
  flex-shrink:0;
}
.lgr-sidebar-title {
  padding:10px 14px 8px;
  font-size:8px; font-weight:700;
  text-transform:uppercase; letter-spacing:.16em;
  color:rgba(0,255,136,0.6);
  display:flex; align-items:center; gap:6px;
}
.lgr-sidebar-title i { color:rgba(0,255,136,0.8); }

/* Completados lista */
.lgr-completado-item {
  display:flex; align-items:center; gap:10px;
  padding:9px 14px;
  border-bottom:1px solid rgba(0,255,136,0.05);
  transition:background .12s;
  cursor:default;
}
.lgr-completado-item:hover { background:rgba(0,255,136,0.03); }
.lgr-completado-nombre { flex:1; font-size:11px; font-weight:600; color:rgba(255,255,255,0.8); min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.lgr-completado-monto  { font-size:11px; font-weight:700; color:#00ff88; text-shadow:0 0 6px rgba(0,255,136,0.3); flex-shrink:0; font-variant-numeric:tabular-nums; }
.lgr-completado-meta   { font-size:9px; color:rgba(255,255,255,0.3); }
.lgr-completado-btn {
  font-size:9px; padding:2px 8px;
  background:rgba(0,255,136,0.06); border:1px solid rgba(0,255,136,0.2);
  color:rgba(0,255,136,0.7); cursor:pointer; font-family:inherit; font-weight:600;
  border-radius:0; letter-spacing:.04em; transition:all .12s; flex-shrink:0;
}
.lgr-completado-btn:hover { background:rgba(0,255,136,0.14); color:#fff; }
/* Navegación completados */
.lgr-nav-btns { display:flex; gap:4px; margin-left:auto; }
.lgr-nav-btn {
  width:22px; height:22px;
  background:rgba(0,0,0,0.5); border:1px solid rgba(0,255,136,0.18);
  color:rgba(0,255,136,0.6); cursor:pointer; font-size:10px;
  display:flex; align-items:center; justify-content:center;
  transition:all .12s;
}
.lgr-nav-btn:hover { background:rgba(0,255,136,0.1); color:#fff; }

/* Categorías */
.lgr-cat-item {
  display:flex; align-items:center; gap:8px;
  padding:7px 14px;
  border-bottom:1px solid rgba(0,255,136,0.04);
  cursor:pointer; transition:background .12s;
}
.lgr-cat-item:hover { background:rgba(0,255,136,0.03); }
.lgr-cat-item.on    { background:rgba(0,255,136,0.06); }
.lgr-cat-ico { font-size:12px; width:16px; text-align:center; flex-shrink:0; }
.lgr-cat-nombre { flex:1; font-size:11px; font-weight:600; color:rgba(255,255,255,0.65); }
.lgr-cat-item.on .lgr-cat-nombre { color:#fff; }
.lgr-cat-prog-wrap { width:52px; height:2px; background:rgba(255,255,255,0.06); flex-shrink:0; }
.lgr-cat-prog-fill { height:100%; background:var(--cat-color,rgba(255,255,255,0.3)); box-shadow:0 0 4px var(--cat-color,rgba(255,255,255,0.3)); }
.lgr-cat-frac { font-size:9px; font-weight:700; color:rgba(255,255,255,0.3); flex-shrink:0; min-width:24px; text-align:right; }

/* Recompensa por nivel */
.lgr-recompensa {
  padding:12px 14px 16px;
  display:flex; flex-direction:column; gap:8px;
}
.lgr-recompensa-nivel { font-size:10px; font-weight:700; color:rgba(255,255,255,0.4); letter-spacing:.04em; }
.lgr-recompensa-items { display:flex; gap:8px; align-items:center; }
.lgr-recompensa-chip {
  display:flex; align-items:center; gap:5px;
  padding:5px 10px;
  background:rgba(251,191,36,0.08);
  border:1px solid rgba(251,191,36,0.25);
  font-size:12px; font-weight:700; color:#fbbf24;
  text-shadow:0 0 6px rgba(251,191,36,0.3);
}
.lgr-recompensa-chip.verde {
  background:rgba(0,255,136,0.08);
  border-color:rgba(0,255,136,0.25);
  color:#00ff88;
  text-shadow:0 0 6px rgba(0,255,136,0.3);
}
.lgr-recompensa-bar-wrap {
  height:3px; background:rgba(251,191,36,0.10); overflow:hidden;
}
.lgr-recompensa-bar {
  height:100%;
  background:linear-gradient(90deg,rgba(251,191,36,0.6),#fbbf24);
  box-shadow:0 0 6px rgba(251,191,36,0.5);
  transition:width .8s ease;
}

/* Tip bar */
#lgr-tip {
  position:sticky; bottom:0;
  display:flex; align-items:center; gap:10px;
  padding:8px 20px;
  background:rgba(0,4,12,0.97);
  border-top:1px solid rgba(0,255,136,0.12);
  font-size:11px; color:rgba(255,255,255,0.4);
  flex-shrink:0;
}
#lgr-tip .lgr-tip-badge {
  background:rgba(0,255,136,0.10); border:1px solid rgba(0,255,136,0.25);
  color:#00ff88; font-size:9px; font-weight:800; padding:2px 8px;
  letter-spacing:.12em; flex-shrink:0;
}
#lgr-tip-txt { flex:1; }
.lgr-tip-nav { display:flex; gap:3px; flex-shrink:0; }
.lgr-tip-nav-btn {
  width:20px; height:20px;
  background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.10);
  color:rgba(255,255,255,0.4); cursor:pointer; font-size:9px;
  display:flex; align-items:center; justify-content:center;
  transition:all .12s;
}
.lgr-tip-nav-btn:hover { border-color:rgba(0,255,136,0.3); color:#00ff88; }

/* Responsive */
@media(max-width:899px){
  #lgr-body { grid-template-columns:1fr !important; }
  #lgr-sidebar { border-left:none; border-top:1px solid rgba(0,255,136,0.12); max-height:320px; }
  #lgr-header { padding:10px 14px 8px; gap:10px; }
  #lgr-nivel-badge { width:52px; height:52px; }
  #lgr-nivel-num { font-size:17px; }
  #inv-grid-full { grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); gap:6px; }
  #lgr-grid-wrap { padding:10px 12px 16px; }
}
  `;
  document.head.appendChild(s);
})();

/* ── Estado global del panel ── */
var _lgr = {
  items:       [],
  orden:       'az',
  mostrarDone: true,
  filProy:     '',
  filGrupo:    '',
  filCat:      '',
  nivel:       1,
  xpActual:    0,
  xpNivel:     500,
  pagComp:     0,
  perPagComp:  4,
  tipIdx:      0,
  tips: [
    'Completa logros para ganar XP y subir de nivel. ¡Cada nivel desbloquea mejores recompensas!',
    'Los logros activos tienen un proyecto o fecha asignada. ¡Priorízalos!',
    'Filtra por categoría para enfocarte en un área a la vez.',
    'Revisa la sección de recompensas para saber qué ganas en el próximo nivel.',
  ],
};

var _CATEGORIAS_LOGROS = [
  { key:'Salud',          ico:'❤️',  color:'#f87171' },
  { key:'Educación',      ico:'📚',  color:'#60a5fa' },
  { key:'Tecnología',     ico:'💻',  color:'#22d3ee' },
  { key:'Hogar',          ico:'🏠',  color:'#a78bfa' },
  { key:'Personal',       ico:'✨',  color:'#f0abfc' },
  { key:'Entretenimiento',ico:'🎮',  color:'#fb923c' },
  { key:'Misceláneos',    ico:'📦',  color:'#94a3b8' },
];

/* ── Color por categoría ── */
function _lgrColor(cat){
  var found = _CATEGORIAS_LOGROS.find(function(c){ return c.key===cat; });
  if(found) return found.color;
  // Fallback hue desde nombre
  var h = 0; for(var i=0;i<(cat||'').length;i++) h = (h+cat.charCodeAt(i)*37)%360;
  return 'hsl('+h+',70%,60%)';
}

/* ── XP/Nivel desde datos ── */
function _lgrCalcularNivel(items){
  var completados = (items||[]).filter(function(l){ return _lgrIsDone(l); });
  var xpTotal = completados.reduce(function(acc,l){ return acc+(parseInt(l.xp)||50); }, 0);
  // 500 XP por nivel, escalando
  var nivel=1, xpAcc=0;
  while(xpAcc+nivel*500<=xpTotal){ xpAcc+=nivel*500; nivel++; }
  _lgr.nivel    = nivel;
  _lgr.xpActual = xpTotal - xpAcc;
  _lgr.xpNivel  = nivel*500;
}


/* ── Mapa categoría → ícono ── */
var _LGR_ICO_MAP = {
  'Salud':'❤️','Educación':'📚','Tecnología':'💻','Hogar':'🏠',
  'Personal':'✨','Entretenimiento':'🎮','Misceláneos':'📦',
  'Accesorios':'⌚','Audio':'🎧','Baño':'🚿','Computación':'💻',
  'Consumible':'🧴','Ejercicio':'🏋️','Ropa':'👕',
};
function _lgrCatIco(cat){ return _LGR_ICO_MAP[cat]||'🎯'; }

/* ── Inferir categoría desde el concepto y proyecto ── */
function _lgrInferirCat(concepto, proyecto){
  var c = (concepto||'').toLowerCase();
  var p = (proyecto||'').toLowerCase();
  if(/salud|médic|doctor|cita|dent|medic|farma|gym|ejercic|deport/.test(c+p)) return 'Salud';
  if(/libro|curso|clase|estudio|educaci|aprend|certif/.test(c+p)) return 'Educación';
  if(/celular|comput|laptop|tablet|audifon|teclado|mouse|camara|tech|electron/.test(c+p)) return 'Tecnología';
  if(/ropa|camisa|pantalon|zapato|playera|chamarra|tenis|vestido|traje/.test(c+p)) return 'Ropa';
  if(/hogar|mueble|cocina|sala|cama|baño|limpieza|casa/.test(c+p)) return 'Hogar';
  if(/viaje|vuelo|hotel|restaur|comida|cena|café|entretenim|cine|juego/.test(c+p)) return 'Entretenimiento';
  if(/accesorio|bolsa|mochila|maleta|reloj|lentes/.test(c+p)) return 'Accesorios';
  return 'Misceláneos';
}

function _lgrIsDone(l){ var v=String(l.completado||'').trim(); return v==='Sí'||v==='Si'||v==='sí'||v==='si'||v==='1'||l.completado===true; }

/* ── RENDER PRINCIPAL ── */
function renderLogros(data){
  _lgr.items = (data&&data.items) ? data.items : (Array.isArray(data)?data:[]);
  window._logrosData = { items:_lgr.items };
  _lgrCalcularNivel(_lgr.items);
  _lgrMontarShell();
  _lgrPintarHeader();
  _lgrPintarGrid();
  _lgrPintarSidebar();
  _lgrPintarTip();
  _lgrPoblarFiltros();
}

/* ── MONTAR ESTRUCTURA DEL PANEL ── */
function _lgrMontarShell(){
  var board = document.getElementById('board-logros');
  if(!board) return;

  // Limpiar contenido previo excepto el div original
  board.innerHTML = '';

  // Header
  board.insertAdjacentHTML('beforeend', `
    <div id="lgr-header">
      <div id="lgr-nivel-badge">
        <div id="lgr-nivel-num">${_lgr.nivel}</div>
        <div id="lgr-nivel-lbl">Nivel</div>
      </div>
      <div id="lgr-progreso-wrap">
        <div id="lgr-progreso-titulo">Progreso general</div>
        <div id="lgr-progreso-bar-wrap"><div id="lgr-progreso-bar" style="width:0%"></div></div>
        <div id="lgr-progreso-txt">
          <span id="lgr-progreso-frac">—</span>
          <span id="lgr-prox-recompensa">Próxima recompensa: <span id="lgr-prox-xp"></span> <span id="lgr-prox-dinero"></span></span>
        </div>
      </div>
      <div id="lgr-filtros">
        <select class="lgr-select" id="reverso-fil-proyecto" onchange="pintarReverso()">
          <option value="">Proyecto</option>
        </select>
        <select class="lgr-select" id="reverso-fil-grupo" onchange="pintarReverso()">
          <option value="">Contacto</option>
        </select>
        <div class="lgr-pill-group">
          <button class="lgr-pill on" id="lord-az"   onclick="setOrdenLogros('az')">A–Z</button>
          <button class="lgr-pill"    id="lord-desc" onclick="setOrdenLogros('monto-desc')">$ ↓</button>
          <button class="lgr-pill"    id="lord-asc"  onclick="setOrdenLogros('monto')">$ ↑</button>
        </div>
        <button class="lgr-btn-done on" id="reverso-tog-done" onclick="toggleReversoMostrarDone()">
          <i class="fas fa-check-circle" style="font-size:10px"></i> Completados
        </button>
        <button class="lgr-btn-volver" onclick="volverAlAnverso()">
          <i class="fas fa-chevron-left" style="font-size:10px"></i> Volver
        </button>
      </div>
    </div>
  `);

  // Body
  board.insertAdjacentHTML('beforeend', `
    <div id="lgr-body">
      <div id="lgr-grid-wrap">
        <div id="inv-grid-full"></div>
      </div>
      <div id="lgr-sidebar"></div>
    </div>
  `);

  // Tip bar
  board.insertAdjacentHTML('beforeend', `
    <div id="lgr-tip">
      <span class="lgr-tip-badge">TIP</span>
      <i class="fas fa-rotate-right" style="font-size:10px;color:rgba(0,255,136,0.5)"></i>
      <span id="lgr-tip-txt"></span>
      <div class="lgr-tip-nav">
        <button class="lgr-tip-nav-btn" onclick="_lgrTipPrev()">‹</button>
        <button class="lgr-tip-nav-btn" onclick="_lgrTipNext()">›</button>
      </div>
    </div>
  `);
}

/* ── HEADER ── */
function _lgrPintarHeader(){
  var items    = _lgr.items;
  var total    = items.length;
  var hechos   = items.filter(_lgrIsDone).length;
  var pct      = total>0 ? Math.round(hechos/total*100) : 0;
  var bar      = document.getElementById('lgr-progreso-bar');
  var frac     = document.getElementById('lgr-progreso-frac');
  var xpEl     = document.getElementById('lgr-prox-xp');
  var dinEl    = document.getElementById('lgr-prox-dinero');
  var nivEl    = document.getElementById('lgr-nivel-num');
  if(bar)  setTimeout(function(){ bar.style.width=pct+'%'; },80);
  if(frac) frac.textContent = hechos+' / '+total;
  if(xpEl) xpEl.textContent = '+500 XP';
  if(dinEl){ dinEl.textContent = '+ $250'; }
  if(nivEl) nivEl.textContent = _lgr.nivel;
}

/* ── FILTROS — poblar opciones ── */
function _lgrPoblarFiltros(){
  var items = _lgr.items;
  var proyEl   = document.getElementById('reverso-fil-proyecto');
  var grupoEl  = document.getElementById('reverso-fil-grupo');
  if(!proyEl||!grupoEl) return;
  var proyectos = [...new Set(items.map(function(l){return l.proyecto||'';}).filter(Boolean))].sort();
  var grupos    = [...new Set(items.map(function(l){return l.contacto||'';}).filter(Boolean))].sort();
  proyectos.forEach(function(p){ var o=document.createElement('option');o.value=p;o.textContent=p;proyEl.appendChild(o); });
  grupos.forEach(function(g){ var o=document.createElement('option');o.value=g;o.textContent=g;grupoEl.appendChild(o); });
}

/* ── GRID ── */
function pintarReverso(){ _lgrPintarGrid(); _lgrPintarSidebar(); }

function _lgrPintarGrid(){
  var grid = document.getElementById('inv-grid-full');
  if(!grid) return;

  var filProy  = (document.getElementById('reverso-fil-proyecto')||{}).value||'';
  var filGrupo = (document.getElementById('reverso-fil-grupo')||{}).value||'';
  var filCat   = _lgr.filCat;

  var items = _lgr.items.slice();

  // Filtros
  if(filProy)  items = items.filter(function(l){ return (l.proyecto||'')==filProy; });
  if(filGrupo) items = items.filter(function(l){ return (l.contacto||'')==filGrupo; });
  if(filCat)   items = items.filter(function(l){ return _lgrInferirCat(l.concepto||l.descripcion||'', l.proyecto||'')==filCat; });
  if(!_lgr.mostrarDone) items = items.filter(function(l){ return !_lgrIsDone(l); });

  // Orden
  items.sort(function(a,b){
    if(_lgr.orden==='az') return (a.concepto||a.descripcion||'').localeCompare(b.concepto||b.descripcion||'','es');
    var ma=parseFloat(String(a.ie||'0').replace(/[^0-9.\-]/g,''))||0;
    var mb=parseFloat(String(b.ie||'0').replace(/[^0-9.\-]/g,''))||0;
    return _lgr.orden==='monto-desc' ? mb-ma : ma-mb;
  });

  grid.innerHTML = '';
  if(!items.length){
    grid.innerHTML='<div style="grid-column:1/-1;padding:40px;text-align:center;color:rgba(0,255,136,0.3);font-size:12px;letter-spacing:.08em">SIN RESULTADOS</div>';
    return;
  }

  items.forEach(function(l){
    var done   = _lgrIsDone(l);
    // Campos reales del GAS
    var nombre = l.concepto||l.descripcion||l.id||'—';
    var cat    = _lgrInferirCat(nombre, l.proyecto||'');
    var color  = _lgrColor(cat);
    var ie     = l.ie;
    var precioFmt = (ie!==null&&ie!==undefined&&ie!=='') ?
      '$ '+parseFloat(String(ie).replace(/[^0-9.\-]/g,'')).toLocaleString('es-MX',{minimumFractionDigits:0,maximumFractionDigits:0}) : '';
    var prog   = done ? 1 : 0;
    var activo = l.proyecto;
    var desc   = (l.descripcion&&l.descripcion!==nombre) ? l.descripcion : '';
    var ico    = _lgrCatIco(cat);

    var card = document.createElement('div');
    card.className = 'lgr-card' + (done?' done':'') + (activo?' activo':'');
    card.style.setProperty('--lgr-color', color);
    card.setAttribute('data-id', l.id||nombre||'');

    card.innerHTML =
      // ── Zona ícono — protagonista (RL style) ──
      '<div class="lgr-ico-wrap">' +
        '<div class="lgr-lock"><i class="fas fa-lock"></i></div>' +
        (done?'<div class="lgr-done-badge">✓</div>':'') +
        '<div class="lgr-ico">'+ico+'</div>' +
        // Línea de acento en borde inferior del ícono
        '<div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--lgr-color);box-shadow:0 0 10px var(--lgr-color);opacity:'+(done?1:.28)+'"></div>' +
      '</div>' +
      // ── Info inferior: nombre + monto + badges + progreso ──
      '<div class="lgr-info">' +
        '<div class="lgr-nombre">'+escH(nombre)+'</div>' +
        (precioFmt?'<div class="lgr-precio">'+escH(precioFmt)+'</div>':'') +
        // Badge de proyecto activo (como ACTIVO / DENTISTA en la imagen)
        (activo&&!done?'<div class="lgr-badge">'+escH(activo)+'</div>':'') +
        // Descripción breve si existe
        (desc?'<div class="lgr-desc">'+escH(desc)+'</div>':'') +
        // Fecha si completado
        (done&&l.fecha?'<div style="font-size:8px;color:rgba(255,255,255,0.3);text-align:center">'+escH(l.fecha)+'</div>':'') +
        '<div class="lgr-progress-row">' +
          '<div class="lgr-progress-bar"><div class="lgr-progress-fill" style="width:'+(prog*100)+'%;background:var(--lgr-color);box-shadow:0 0 4px var(--lgr-color)"></div></div>' +
          '<div class="lgr-progress-txt">'+(done?'1':'0')+'/1</div>' +
        '</div>' +
      '</div>';

    card.addEventListener('click', function(){ _lgrCardClick(l); });
    grid.appendChild(card);
  });
}

function _lgrCardClick(l){
  if(_lgrIsDone(l)) return; // Ya completado
  // Si tiene función de completar logro, llamarla
  if(typeof completarLogro==='function') completarLogro(l.id||l.nombre);
}

/* ── SIDEBAR ── */
function _lgrPintarSidebar(){
  var sb = document.getElementById('lgr-sidebar');
  if(!sb) return;
  sb.innerHTML='';

  // Sección completados
  var done = _lgr.items.filter(_lgrIsDone);
  var inicio= _lgr.pagComp * _lgr.perPagComp;
  var pag   = done.slice(inicio, inicio+_lgr.perPagComp);
  var totalPags = Math.ceil(done.length/_lgr.perPagComp);

  var secComp = document.createElement('div');
  secComp.className='lgr-sidebar-section';
  var titComp='<div class="lgr-sidebar-title"><i class="fas fa-trophy"></i> Completados'
    +(totalPags>1?'<div class="lgr-nav-btns"><button class="lgr-nav-btn" onclick="_lgrCompPrev()">‹</button><button class="lgr-nav-btn" onclick="_lgrCompNext()">›</button></div>':'')
    +'</div>';
  var itemsComp = pag.map(function(l){
    var nombre_c = l.concepto||l.descripcion||l.id||'—';
    var fmt = (l.ie!==null&&l.ie!==undefined&&l.ie!=='') ? '$ '+parseFloat(String(l.ie).replace(/[^0-9.\-]/g,'')).toLocaleString('es-MX',{minimumFractionDigits:0,maximumFractionDigits:0}) : '';
    var fecha = l.fecha||'';
    var cat = _lgrInferirCat(nombre_c, l.proyecto||'');
    return '<div class="lgr-completado-item">' +
      '<div style="flex:1;min-width:0">' +
        '<div class="lgr-completado-nombre">'+escH(nombre_c)+'</div>' +
        '<div class="lgr-completado-meta">'+escH(cat+(fecha?' · '+fecha:''))+'</div>' +
      '</div>' +
      (fmt?'<div class="lgr-completado-monto">'+escH(fmt)+'</div>':'') +
      (typeof revertirLogro==='function'?'<button class="lgr-completado-btn" onclick="revertirLogro(\''+escH(l.id||l.nombre||'')+'\')">Revertir</button>':'') +
    '</div>';
  }).join('');
  if(!pag.length) itemsComp='<div style="padding:12px 14px;font-size:11px;color:rgba(255,255,255,0.25);letter-spacing:.06em">Sin completados</div>';
  secComp.innerHTML = titComp+itemsComp;
  sb.appendChild(secComp);

  // Sección categorías
  var secCat = document.createElement('div');
  secCat.className='lgr-sidebar-section';
  secCat.innerHTML='<div class="lgr-sidebar-title"><i class="fas fa-layer-group"></i> Categorías</div>';

  _CATEGORIAS_LOGROS.forEach(function(c){
    var todos    = _lgr.items.filter(function(l){ return _lgrInferirCat(l.concepto||l.descripcion||'', l.proyecto||'')===c.key; });
    var hechos   = todos.filter(_lgrIsDone).length;
    if(!todos.length) return;
    var pctCat   = todos.length>0 ? Math.round(hechos/todos.length*100) : 0;
    var isOn     = _lgr.filCat===c.key;
    var el = document.createElement('div');
    el.className = 'lgr-cat-item'+(isOn?' on':'');
    el.style.setProperty('--cat-color', c.color);
    el.innerHTML =
      '<span class="lgr-cat-ico">'+c.ico+'</span>'+
      '<span class="lgr-cat-nombre">'+escH(c.key)+'</span>'+
      '<div class="lgr-cat-prog-wrap"><div class="lgr-cat-prog-fill" style="width:'+pctCat+'%;background:'+c.color+';box-shadow:0 0 4px '+c.color+'"></div></div>'+
      '<span class="lgr-cat-frac">'+hechos+'/'+todos.length+'</span>';
    el.addEventListener('click', function(){
      _lgr.filCat = isOn?'':c.key;
      _lgrPintarGrid(); _lgrPintarSidebar();
    });
    secCat.appendChild(el);
  });
  sb.appendChild(secCat);

  // Sección recompensa por nivel
  var proxNivel = _lgr.nivel+1;
  var pctXP = _lgr.xpNivel>0 ? Math.round(_lgr.xpActual/_lgr.xpNivel*100) : 0;
  var secRec = document.createElement('div');
  secRec.className='lgr-sidebar-section';
  secRec.innerHTML =
    '<div class="lgr-sidebar-title"><i class="fas fa-gift"></i> Recompensa por nivel</div>'+
    '<div class="lgr-recompensa">'+
      '<div class="lgr-recompensa-nivel">Nivel '+proxNivel+' · '+_lgr.xpActual+' / '+_lgr.xpNivel+' XP</div>'+
      '<div class="lgr-recompensa-items">'+
        '<div class="lgr-recompensa-chip"><i class="fas fa-bolt" style="font-size:10px"></i> +500 XP</div>'+
        '<div class="lgr-recompensa-chip verde"><i class="fas fa-dollar-sign" style="font-size:10px"></i> +$250</div>'+
        '<div style="margin-left:auto;font-size:18px">📦</div>'+
      '</div>'+
      '<div class="lgr-recompensa-bar-wrap"><div class="lgr-recompensa-bar" style="width:'+pctXP+'%"></div></div>'+
    '</div>';
  sb.appendChild(secRec);
}

/* ── TIP BAR ── */
function _lgrPintarTip(){
  var el = document.getElementById('lgr-tip-txt');
  if(el) el.textContent = _lgr.tips[_lgr.tipIdx % _lgr.tips.length];
}
function _lgrTipPrev(){ _lgr.tipIdx=(_lgr.tipIdx-1+_lgr.tips.length)%_lgr.tips.length; _lgrPintarTip(); }
function _lgrTipNext(){ _lgr.tipIdx=(_lgr.tipIdx+1)%_lgr.tips.length; _lgrPintarTip(); }

/* ── CONTROLES ── */
function setOrdenLogros(o){
  _lgr.orden=o;
  ['az','desc','asc'].forEach(function(k){
    var el=document.getElementById('lord-'+k);
    if(el) el.classList.remove('on');
  });
  var mapa={'az':'az','monto-desc':'desc','monto':'asc'};
  var el=document.getElementById('lord-'+mapa[o]);
  if(el) el.classList.add('on');
  _lgrPintarGrid();
}
function toggleReversoMostrarDone(){
  _lgr.mostrarDone=!_lgr.mostrarDone;
  var btn=document.getElementById('reverso-tog-done');
  if(btn) btn.classList.toggle('on',_lgr.mostrarDone);
  _lgrPintarGrid();
}
function resetReverso(){
  _lgr.filCat=''; _lgr.mostrarDone=true; _lgr.orden='az';
  var pEl=document.getElementById('reverso-fil-proyecto');
  var gEl=document.getElementById('reverso-fil-grupo');
  if(pEl) pEl.value=''; if(gEl) gEl.value='';
  setOrdenLogros('az');
  _lgrPintarGrid(); _lgrPintarSidebar();
}
function _lgrCompPrev(){ _lgr.pagComp=Math.max(0,_lgr.pagComp-1); _lgrPintarSidebar(); }
function _lgrCompNext(){
  var done=_lgr.items.filter(_lgrIsDone).length;
  var maxPag=Math.ceil(done/_lgr.perPagComp)-1;
  _lgr.pagComp=Math.min(maxPag,_lgr.pagComp+1); _lgrPintarSidebar();
}

/* ── NAVEGACIÓN ── */
function irALogros(){
  if(typeof _syncMobTab==='function') _syncMobTab('logros');
  document.querySelectorAll('.board-face').forEach(function(f){ f.classList.remove('active'); });
  var board=document.getElementById('board-logros');
  if(board){ board.classList.add('active'); board.scrollTop=0; }
  if(_lgr.items.length===0 && window._logrosData){
    renderLogros(window._logrosData);
  }
}

/* ── HELPER ── */
function escH(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
