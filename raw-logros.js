/* RAW Entry — Logros v.5.054 */
// RAW Entry — Logros + Activity + Maslow
// ══════════════════════════════════════════
//  ESTADO
// ══════════════════════════════════════════
let _pantalla       = 'anverso';
let _boardFlipped   = false;
let _ordenLogros    = 'az';
let _reversoMostrarDone = false;

function setOrdenLogros(orden) {
  _ordenLogros = orden;
  ['az','desc','asc'].forEach(k => {
    const btn = document.getElementById('lord-' + k);
    if (btn) btn.classList.remove('on');
  });
  const map = { 'az': 'az', 'monto-desc': 'desc', 'monto': 'asc' };
  const btn = document.getElementById('lord-' + (map[orden] || 'az'));
  if (btn) btn.classList.add('on');
  pintarReverso();
}

function _setPantalla(p){
  _pantalla = p;
  _boardFlipped = (p !== 'anverso');
  const anv    = document.getElementById('board-anverso');
  const logros = document.getElementById('board-logros');
  const maslow = document.getElementById('board-maslow');
  const act    = document.getElementById('board-activity');
  const sheets = document.getElementById('board-sheets');
  anv.classList.remove('slide-left','slide-right');
  if(logros) logros.classList.remove('active');
  if(maslow) maslow.classList.remove('active');
  if(act)    act.classList.remove('active');
  if(sheets) sheets.classList.remove('active');
  const scoreP = document.getElementById('board-score');
  if(scoreP) scoreP.classList.remove('active');
  const nutP = document.getElementById('board-nutricion');
  if(nutP) nutP.classList.remove('active');
  if(p === 'logros'){ anv.classList.add('slide-left'); if(logros) logros.classList.add('active'); }
  else if(p === 'maslow'){ anv.classList.add('slide-right'); if(maslow) maslow.classList.add('active'); }
  else if(p === 'activity'){ anv.classList.add('slide-right'); if(act) act.classList.add('active'); }
  else if(p.startsWith('sheets_')){ anv.classList.add('slide-right'); if(sheets) sheets.classList.add('active'); }
  else if(p === 'score'){
    anv.classList.add('slide-right');
    const scorePanel = document.getElementById('board-score');
    if(scorePanel) scorePanel.classList.add('active');
  }
  else if(p === 'nutricion'){ anv.classList.add('slide-right'); if(nutP) nutP.classList.add('active'); }
  const bL = document.getElementById('btn-logros');
  const bM = document.getElementById('btn-maslow');
  const bA = document.getElementById('btn-activity');
  const bS  = document.getElementById('btn-sheets');
  const bSc = document.getElementById('btn-score');
  if(bL)  bL.classList.toggle('active', p==='logros');
  if(bM)  bM.classList.toggle('active', p==='maslow');
  if(bA)  bA.classList.toggle('active', p==='activity');
  if(bS)  bS.classList.toggle('active', p.startsWith('sheets_'));
  if(bSc) bSc.classList.toggle('active', p==='score');
  var bNut = document.getElementById('btn-nutricion');
  if(bNut) bNut.classList.toggle('active', p==='nutricion');
  if(typeof _syncMobTab==='function') _syncMobTab(p);
}

function irALogros(){ if(_pantalla==='logros'){ volverAlAnverso(); return; } _setPantalla('logros'); pintarReverso(); }
function irAMaslow(){
  if(_pantalla==='maslow'){ volverAlAnverso(); return; }
  _setPantalla('maslow');
  poblarFiltrosMes();
  dibujarNecesidades();
  // Lazy load nutrición y entrenamiento
  if(typeof renderNutricion==='function' && typeof api!=='undefined'){
    api.getNutricion().then(renderNutricion).catch(function(){ renderNutricion({ok:true,items:[],resumen:{}}); });
    api.getEntrenamiento().then(renderEntrenamiento).catch(function(){ renderEntrenamiento({ok:true,items:[]}); });
  }
}
function irAActivity(){
  if(_pantalla==='activity'){ volverAlAnverso(); return; }
  _setPantalla('activity');
  // Reset diario de Electronics
  if(typeof api !== 'undefined' && api.resetearElectronics){
    api.resetearElectronics().catch(function(){});
  }
  if(_actData) renderActivity();
  else {
    var grid = document.getElementById('act-container');
    if(grid) grid.innerHTML='<div style="padding:40px;text-align:center;color:var(--m)"><i class="fas fa-circle-notch fa-spin" style="font-size:20px"></i></div>';
    api.getActivityCheck().then(function(d){ _actData=d; renderActivity(); }).catch(function(){});
  }
}
function irAScore(){ if(_pantalla==='score'){ volverAlAnverso(); return; } _setPantalla('score'); cargarScore(); }

function irANutricion(){
  if(_pantalla==='nutricion'){ volverAlAnverso(); return; }
  _setPantalla('nutricion');
  var lbl = document.getElementById('nut-fecha-lbl');
  if(lbl){ var hoy=new Date(); lbl.textContent=hoy.toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'}); }
  if(typeof renderNutricion==='function' && typeof api!=='undefined'){
    Promise.all([api.getNutricion(), api.getMetasNutricion ? api.getMetasNutricion() : Promise.resolve(null)])
      .then(function(res){ renderNutricion(res[0], res[1]); })
      .catch(function(){ renderNutricion({ok:true,dias:{},semana:[],hoy:{cal:0,prot:0,carbos:0,grasa:0,agua:0}}); });
  }
}
function volverAlAnverso(){ _setPantalla('anverso'); }
function flipBoard(){ if(_pantalla==='anverso') irALogros(); else volverAlAnverso(); }

function poblarFiltrosReverso(){
  const proyectos = [...new Set(_logrosRaw.map(it=>it.proyecto))].sort();
  const grupos    = [...new Set(_logrosRaw.map(it=>it.grupo))].sort();
  const selP = document.getElementById('reverso-fil-proyecto');
  const selG = document.getElementById('reverso-fil-grupo');
  if(selP) selP.innerHTML = '<option value="">Proyecto</option>' + proyectos.map(p=>`<option value="${p}">${p}</option>`).join('');
  if(selG) selG.innerHTML = '<option value="">Contacto</option>' + grupos.map(g=>`<option value="${g}">${g}</option>`).join('');
}

function toggleReversoMostrarDone(){
  _reversoMostrarDone = !_reversoMostrarDone;
  const btn = document.getElementById('reverso-tog-done');
  if(btn){
    btn.innerHTML = _reversoMostrarDone ? '<i class="fas fa-eye"></i> Completados' : '<i class="fas fa-eye-slash"></i> Completados';
    btn.style.background = _reversoMostrarDone ? 'rgba(34,197,94,.2)' : 'rgba(34,197,94,.08)';
  }
  pintarReverso();
}

function resetReverso(){
  ['reverso-fil-proyecto','reverso-fil-grupo'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  _ordenLogros = 'az'; setOrdenLogros('az');
}

function pintarReverso(){
  if(typeof poblarFiltrosMes === 'function') poblarFiltrosMes();
  poblarFiltrosReverso();
  const filP  = document.getElementById('reverso-fil-proyecto')?.value||'';
  const filG  = document.getElementById('reverso-fil-grupo')?.value||'';
  const orden = _ordenLogros || 'az';
  let items = _logrosRaw.filter(it=>{
    if(!_reversoMostrarDone && it.completado) return false;
    if(filP && it.proyecto!==filP) return false;
    if(filG && it.grupo!==filG) return false;
    return true;
  });
  if(orden==='az') items.sort((a,b)=>a.concepto.localeCompare(b.concepto,'es'));
  else if(orden==='monto') items.sort((a,b)=>(Math.abs(a.monto||0))-(Math.abs(b.monto||0)));
  else if(orden==='monto-desc') items.sort((a,b)=>(Math.abs(b.monto||0))-(Math.abs(a.monto||0)));
  const total = _logrosRaw.length;
  const done  = _logrosRaw.filter(it=>it.completado).length;
  const cnt   = document.getElementById('reverso-count');
  if(cnt) cnt.textContent = `${done} completados · ${total-done} pendientes`;
  const grid = document.getElementById('inv-grid-full');
  if(!grid) return;
  if(!items.length){
    grid.innerHTML=`<div style="text-align:center;padding:48px;color:var(--m);grid-column:1/-1">
      <div style="font-size:48px;margin-bottom:12px">🏆</div>
      <div style="font-size:14px">${done===total&&total>0?'¡Todos completados! 🎉':'Sin logros aún — agrega desde tu Sheet.'}</div>
    </div>`;
    return;
  }
  grid.innerHTML = items.map((it,i)=>{
    const icon   = getLogroIcon(it);
    const label  = it.concepto;
    const monto  = it.monto?'$ '+Math.abs(it.monto).toLocaleString('es-MX',{minimumFractionDigits:0}):'';
    const tag    = it.grupo!==it.proyecto?it.grupo:'';
    const tooltip= [label,monto,it.proyecto,it.fecha].filter(Boolean).join(' · ');
    const isDone = it.completado;
    const isInc  = it.incompleto;
    const uid    = it.fila || ('tmp_'+i);
    return `<div class="inv-item${isDone?' done':''}${isInc?' inc':''}"
      title="${tooltip}" data-uid="${uid}" onclick="toggleLogroReverso('${uid}')">
      <div class="inv-corner ${isDone?'done':isInc?'warn':'pend'}">
        <i class="fas fa-${isDone?'check':isInc?'exclamation':'lock'}"></i>
      </div>
      <div class="inv-icon" style="opacity:${isDone?.5:1}">${icon}</div>
      <div class="inv-label" style="color:${isDone?'var(--m)':isInc?'var(--warn)':'var(--t)'};text-decoration:${isDone?'line-through':'none'}">
        ${label.length>28?label.slice(0,27)+'…':label}
      </div>
      ${monto?`<div class="inv-monto" style="opacity:${isDone?.5:1}">${monto}</div>`:''}
      ${tag?`<div class="inv-tag">${tag}</div>`:''}
    </div>`;
  }).join('');
  if(_pantalla==='maslow') dibujarNecesidades();
}

function toggleLogroReverso(uid){
  const item = _logrosRaw.find(it=>{
    const itUid = it.fila ? String(it.fila) : null;
    return itUid === String(uid) || ('tmp_'+_logrosRaw.indexOf(it)) === String(uid);
  });
  if(!item) return;
  if(item.incompleto){ showToast('⚠ Completa el Concepto en el Sheet primero', false); return; }
  const nuevoVal = item.completado ? 'No' : 'Sí';
  item.completado = !item.completado;
  pintarReverso();
  if(item.fila){
    api.marcarLogro(item.fila, nuevoVal)
      .then(r=>{ if(!r.ok){item.completado=!item.completado;pintarReverso();showToast('Error al guardar',false);}
                 else showToast(nuevoVal==='Sí'?'✓ Logro completado':'Logro desmarcado',nuevoVal==='Sí'); })
      .catch(()=>{item.completado=!item.completado;pintarReverso();});
  } else {
    showToast(nuevoVal==='Sí'?'✓ Marcado':'Desmarcado', true);
  }
}

// ══════════════════════════════════════════
//  TOOLTIP GLOBAL
// ══════════════════════════════════════════
function initTooltip(){
  const tip=document.getElementById('gtip');
  document.addEventListener('mouseover',e=>{
    const el=e.target.closest('[title]');
    if(!el||!el.title)return;
    tip.textContent=el.title;tip.classList.add('show');
    const r=el.getBoundingClientRect();
    tip.style.left=Math.max(6,r.left+r.width/2-tip.offsetWidth/2)+'px';
    tip.style.top=(r.bottom+8)+'px';
  });
  document.addEventListener('mouseout',()=>tip.classList.remove('show'));
}

(function tickClock(){
  const now=new Date();
  const t=now.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
  ['saldo-clock','saldo-clock2'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=t;});
  setTimeout(tickClock,1000);
})();

// ══════════════════════════════════════════
//  LOGROS
// ══════════════════════════════════════════
let _logrosRaw = [];
let _mostrarDone = false;

const LOGROS_ICON_MAP = {
  'Salud':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  'Casa':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  'Hogar':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  'Ropa':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>`,
  'Educación':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  'Futuro':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
  'Movies':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>`,
  'Accesorios':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
  'Work':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  'Foodies':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
  'Servicios':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M20 12h-2M17.66 17.66l-1.41-1.41M12 20v-2M6.34 17.66l1.41-1.41M4 12h2M6.34 6.34l1.41 1.41"/></svg>`,
  '∴':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`,
  'Lectura':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  'Audio':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  'Computación':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><polyline points="9 8 12 11 15 8"/></svg>`,
  'Consumible':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  'Ejercicio':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 5v14M18 5v14M3 9h3M18 9h3M3 15h3M18 15h3M9 5h6M9 19h6"/></svg>`,
  'default':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
};

function getLogroIcon(it) {
  const keys  = Object.keys(LOGROS_ICON_MAP);
  const conc  = String(it.concepto||'').toLowerCase();
  const grupo = String(it.grupo||'').toLowerCase();
  const proj  = String(it.proyecto||'').toLowerCase();
  for(const k of keys){
    if(k==='default') continue;
    const kl = k.toLowerCase();
    if(conc.includes(kl)||grupo.includes(kl)||proj.includes(kl)) return LOGROS_ICON_MAP[k];
  }
  if(conc.includes('serie')||conc.includes('anime')) return LOGROS_ICON_MAP['Movies'];
  if(conc.includes('leer')||conc.includes('lectura')) return LOGROS_ICON_MAP['Lectura'];
  if(grupo.includes('audio')) return LOGROS_ICON_MAP['Audio'];
  if(grupo.includes('computación')||grupo.includes('computacion')) return LOGROS_ICON_MAP['Computación'];
  if(grupo.includes('consumible')) return LOGROS_ICON_MAP['Consumible'];
  if(grupo.includes('ejercicio')) return LOGROS_ICON_MAP['Ejercicio'];
  return LOGROS_ICON_MAP[proj] || LOGROS_ICON_MAP['default'];
}

function renderLogros(data) {
  window._logrosData = data;
  const fromSheet = (data && data.items) ? data.items : [];
  const normalizados = fromSheet.map((it, i) => {
    const proyecto   = (it.proyecto && it.proyecto.trim()) ? it.proyecto.trim() : 'Sin Proyecto';
    const grupo      = (it.contacto && it.contacto.trim()) ? it.contacto.trim() : 'Sin Contacto';
    const concepto   = (it.concepto && it.concepto.trim()) ? it.concepto.trim() : 'Sin Concepto';
    const monto      = (typeof it.ie === 'number') ? it.ie : null;
    const fecha      = (it.recurrencia && it.recurrencia !== '-' && it.recurrencia !== 'null') ? it.recurrencia : '';
    const completado = (it.completado === 'Sí' || it.completado === 'Si' || it.completado === 'sí');
    const incompleto = concepto === 'Sin Concepto';
    return { proyecto, grupo, concepto, monto, fecha, completado, incompleto, fila: it.fila };
  });
  _logrosRaw = normalizados;
  poblarFiltrosReverso();
  pintarInventario([]);
}

function pintarInventario(items){
  const total = _logrosRaw.length;
  const done  = _logrosRaw.filter(it=>it.completado).length;
  const btnFlip = document.getElementById('btn-logros');
  if(btnFlip && _pantalla==='anverso'){
    btnFlip.innerHTML = `<i class="fas fa-trophy"></i> Logros <span style="font-size:10px;opacity:.7">${done}/${total}</span>`;
  }
  if(_boardFlipped) pintarReverso();
}

// ══════════════════════════════════════════
//  MASLOW
// ══════════════════════════════════════════
let _necData  = null;
let _necVista = 'piramide';
let _radarChart = null;
let _pctAhorro = 20;

const NEC_NIVELES = [
  { key:'1', label:'Fisiológicas',    sub:'Comer, dormir, agua',     color:'#EF4444', emoji:'🔴' },
  { key:'2', label:'Seguridad',       sub:'Estabilidad y vivienda',  color:'#F97316', emoji:'🟠' },
  { key:'3', label:'Afiliación',      sub:'Relaciones y pertenencia',color:'#EAB308', emoji:'🟡' },
  { key:'4', label:'Reconocimiento',  sub:'Logros y autoestima',     color:'#22C55E', emoji:'🟢' },
  { key:'5', label:'Autorrealización',sub:'Propósito y potencial',   color:'#8B5CF6', emoji:'🟣' },
];

let _necMesesSeleccionados = new Set();

function renderNecesidades(data){ _necData = data; if(_pantalla==='maslow'){ poblarFiltrosMes(); dibujarNecesidades(); } }

function poblarFiltrosMes(){
  const cont = document.getElementById('nec-filtros-mes');
  if(!cont || !_necData || !_necData.mesesDisponibles) return;
  cont.innerHTML = _necData.mesesDisponibles.map(m=>{
    const on = _necMesesSeleccionados.has(m);
    return `<button onclick="toggleFiltroMes('${m}')" id="nec-fil-${m.replace(' ','_')}"
      style="padding:3px 10px;border-radius:20px;font-size:10px;font-weight:600;
      background:${on?'rgba(139,92,246,.25)':'rgba(255,255,255,.04)'};
      border:1px solid ${on?'rgba(139,92,246,.5)':'var(--border)'};
      color:${on?'#C4B5FD':'var(--m)'};cursor:pointer;font-family:inherit;transition:all .15s">${m}</button>`;
  }).join('');
}

function toggleFiltroMes(mes){
  if(_necMesesSeleccionados.has(mes)) _necMesesSeleccionados.delete(mes);
  else _necMesesSeleccionados.add(mes);
  poblarFiltrosMes(); dibujarNecesidades();
}

function resetFiltrosMes(){ _necMesesSeleccionados.clear(); poblarFiltrosMes(); dibujarNecesidades(); }

function calcularNivelesFiltrados(){
  if(!_necData) return [];
  if(!_necData.rawPorMes || _necMesesSeleccionados.size === 0) return _necData.niveles || [];
  const sumas = {};
  [..._necMesesSeleccionados].forEach(mes=>{
    (_necData.rawPorMes[mes]||[]).forEach(({key,monto,concepto})=>{
      if(!sumas[key]) sumas[key]={total:0,conceptos:[]};
      sumas[key].total += monto;
      if(concepto && !sumas[key].conceptos.includes(concepto)) sumas[key].conceptos.push(concepto);
    });
  });
  return ['1','2','3','4','5'].map(key=>({ key, total: sumas[key]?sumas[key].total:0, conceptos: sumas[key]?sumas[key].conceptos:[] }));
}

function switchVistaNec(vista){
  _necVista = vista;
  ['piramide','radar'].forEach(v=>{
    const btn = document.getElementById('nec-btn-'+v);
    if(!btn) return;
    const on = v===vista;
    btn.style.background  = on?'rgba(139,92,246,.25)':'rgba(255,255,255,.04)';
    btn.style.borderColor = on?'rgba(139,92,246,.6)':'var(--border)';
    btn.style.color       = on?'#C4B5FD':'var(--m)';
    btn.style.fontWeight  = on?'700':'500';
  });
  if(_radarChart){ try{_radarChart.destroy();}catch(e){} _radarChart=null; }
  dibujarNecesidades();
}

function dibujarNecesidades(){
  const cont = document.getElementById('nec-container');
  if(!cont) return;
  if(!_necData || (!_necData.niveles && !_necData.rawPorMes)){
    cont.innerHTML='<div style="padding:40px;text-align:center;color:var(--m);font-size:13px">Cargando…</div>';return;
  }
  const nivelesFiltrados = calcularNivelesFiltrados();
  const per = document.getElementById('nec-periodo');
  if(per){ if(_necMesesSeleccionados.size>0) per.textContent=[..._necMesesSeleccionados].join(', '); else per.textContent=_necData.periodo||''; }
  if(_necVista==='piramide') dibujarPiramide(cont, nivelesFiltrados);
  else if(_necVista==='radar') dibujarRadar(cont, nivelesFiltrados);
  dibujarTablaAnalisis(nivelesFiltrados);
}

function dataNivel(key, nivelesArr){
  const arr = nivelesArr || (_necData ? _necData.niveles : []);
  return arr.find(n=>n.key===key)||{key,total:0,conceptos:[]};
}
function fmtK(v){ const a=Math.abs(v); return a>=1000?'$'+Math.round(a/1000)+'k':'$'+a.toLocaleString('es-MX',{maximumFractionDigits:0}); }

function dibujarPiramide(cont, niveles){
  niveles = niveles || (_necData ? _necData.niveles : []);
  const maxAbs  = Math.max(...NEC_NIVELES.map(n=>Math.abs(dataNivel(n.key,niveles).total||0)),1);
  const totalSum= NEC_NIVELES.reduce((s,n)=>s+Math.abs(dataNivel(n.key,niveles).total||0),0);
  const pisos   = [...NEC_NIVELES].reverse();
  const html = pisos.map((niv)=>{
    const d    = dataNivel(niv.key, niveles);
    const abs  = Math.abs(d.total||0);
    const pct  = totalSum>0 ? (abs/totalSum*100) : 0;
    const barW = maxAbs>0 ? (abs/maxAbs*100) : 0;
    const vacio = abs===0;
    const tops  = (d.conceptos||[]).slice(0,3).join(', ');
    return `<div style="margin-bottom:14px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:8px;height:8px;border-radius:50%;background:${vacio?'var(--dim)':niv.color};flex-shrink:0"></div>
          <span style="font-size:12px;font-weight:600;color:${vacio?'var(--m)':'var(--t)'}">${niv.label}</span>
          ${vacio?'<span style="font-size:10px;color:var(--warn)">⚠ descuidado</span>':''}
        </div>
        <div>
          <span style="font-size:13px;font-weight:700;color:${vacio?'var(--dim)':'var(--t)'};font-variant-numeric:tabular-nums">
            ${vacio?'—':'$ '+abs.toLocaleString('es-MX',{minimumFractionDigits:0})}
          </span>
          <span style="font-size:10px;color:var(--m);margin-left:6px">${vacio?'':Math.round(pct)+'%'}</span>
        </div>
      </div>
      <div style="height:4px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${barW.toFixed(1)}%;background:${niv.color};border-radius:2px;opacity:${vacio?.25:.8}"></div>
      </div>
      ${tops?`<div style="font-size:10px;color:var(--m);margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">↳ ${tops}</div>`:''}
    </div>`;
  }).join('');
  cont.innerHTML=`<div style="padding:4px 0">${html}</div>`;
}

function dibujarRadar(cont, niveles){
  niveles = niveles || (_necData ? _necData.niveles : []);
  cont.innerHTML=`<canvas id="radar-canvas" style="max-height:320px"></canvas>`;
  const canvas = document.getElementById('radar-canvas');
  if(!canvas||!window.Chart) return;
  const labels  = NEC_NIVELES.map(n=>n.label);
  const valores  = NEC_NIVELES.map(n=>Math.abs(dataNivel(n.key,niveles).total||0));
  const colors   = NEC_NIVELES.map(n=>n.color);
  const maxVal   = Math.max(...valores,1);
  const norm     = valores.map(v=>(v/maxVal*100));
  if(_radarChart){ try{_radarChart.destroy();}catch(e){} _radarChart=null; }
  _radarChart = new Chart(canvas,{
    type:'radar',
    data:{ labels, datasets:[{ label:'Gasto por necesidad', data:norm,
      backgroundColor:'rgba(139,92,246,.12)', borderColor:'rgba(139,92,246,.6)',
      borderWidth:1.5, pointBackgroundColor:colors, pointBorderColor:'#111',
      pointBorderWidth:2, pointRadius:5, pointHoverRadius:7, fill:true }]},
    options:{ responsive:true, maintainAspectRatio:true, aspectRatio:1.3,
      plugins:{ legend:{display:false}, tooltip:{ backgroundColor:'rgba(15,23,42,.95)',
        borderColor:'rgba(139,92,246,.3)', borderWidth:1, titleColor:'#fff', bodyColor:'#94A3B8', padding:10,
        callbacks:{ label:ctx=>{ const i=ctx.dataIndex; return ' '+NEC_NIVELES[i].emoji+' $ '+valores[i].toLocaleString('es-MX',{minimumFractionDigits:0}); }}}},
      scales:{ r:{ min:0, max:100, backgroundColor:'rgba(0,0,0,.15)',
        angleLines:{color:'rgba(255,255,255,.06)',lineWidth:1}, grid:{color:'rgba(255,255,255,.06)'},
        ticks:{display:false,stepSize:25},
        pointLabels:{ font:{size:11,weight:'600',family:'system-ui'}, color:ctx=>colors[ctx.index]||'#94A3B8',
          callback:(label,i)=>[label,fmtK(valores[i])] }}}}
  });
}

function dibujarTablaAnalisis(niveles){
  niveles = niveles || (_necData ? _necData.niveles : []);
  const cont = document.getElementById('nec-tabla');
  if(!cont||!_necData||!_necData.niveles) return;
  const total  = NEC_NIVELES.reduce((s,n)=>s+Math.abs(dataNivel(n.key,niveles).total||0),0);
  const sorted = [...NEC_NIVELES].map(n=>({...n,...dataNivel(n.key,niveles)})).sort((a,b)=>Math.abs(b.total||0)-Math.abs(a.total||0));
  const rows = sorted.map(n=>{
    const abs  = Math.abs(n.total||0);
    const pct  = total>0?(abs/total*100).toFixed(1):0;
    const tops = (n.conceptos||[]).join(', ')||'—';
    const vacio= abs===0;
    const status = vacio
      ? `<span style="font-size:10px;color:var(--warn);background:rgba(245,158,11,.08);padding:2px 8px;border-radius:10px;border:1px solid rgba(245,158,11,.15)">⚠ Descuidado</span>`
      : pct>40
        ? `<span style="font-size:10px;color:var(--err);background:rgba(239,68,68,.08);padding:2px 8px;border-radius:10px;border:1px solid rgba(239,68,68,.15)">Alto</span>`
        : `<span style="font-size:10px;color:var(--ok);background:rgba(74,222,128,.08);padding:2px 8px;border-radius:10px;border:1px solid rgba(74,222,128,.15)">✓ OK</span>`;
    return `<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.04)">
      <div style="width:8px;height:8px;border-radius:50%;background:${n.color};flex-shrink:0"></div>
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;font-weight:600;color:${vacio?'var(--m)':'var(--t)'}">${n.label}</div>
        <div style="font-size:10px;color:var(--m);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${tops}</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-size:13px;font-weight:700;color:${vacio?'var(--dim)':'var(--t)'};font-variant-numeric:tabular-nums">${vacio?'—':'$ '+abs.toLocaleString('es-MX',{minimumFractionDigits:0})}</div>
        <div style="font-size:10px;color:var(--m)">${pct}%</div>
      </div>
      <div style="flex-shrink:0">${status}</div>
    </div>`;
  }).join('');
  cont.innerHTML=`<div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m);margin-bottom:10px">Resumen · <span style="color:var(--t);font-variant-numeric:tabular-nums">$ ${total.toLocaleString('es-MX',{minimumFractionDigits:0})}</span></div>${rows}`;
}

// ══════════════════════════════════════════
//  TAB BAR MÓVIL
// ══════════════════════════════════════════
let _mobTabActivo = 'entrada';

function mobTab(tab){
  _mobTabActivo = tab;
  document.querySelectorAll('.mob-tab').forEach(b=>{ b.classList.toggle('active', b.dataset.tab===tab); });
  if(tab==='logros'){ irALogros(); return; }
  if(tab==='maslow'){ irAMaslow(); return; }
  if(tab==='activity'){ irAActivity(); return; }
  if(tab==='score'){ irAScore(); return; }
  if(tab==='sheets'){ irASheets('raw'); return; }
  if(_pantalla!=='anverso') volverAlAnverso();
  const ids = { entrada:'col1-wrap', flujo:'sec-flujo' };
  const targetId = ids[tab];
  if(targetId){
    setTimeout(()=>{
      const el = document.getElementById(targetId);
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      if(tab==='flujo'){
        const hdr = document.getElementById('sec-flujo-hdr');
        const body = document.getElementById('sec-flujo-body');
        if(body && !body.classList.contains('open')){ body.classList.add('open'); if(hdr) hdr.classList.add('open'); }
      }
    }, _pantalla!=='anverso' ? 560 : 0);
  }
}

function _syncMobTab(p){
  const map = {anverso:'entrada', logros:'logros', maslow:'maslow', activity:'activity', score:'score', nutricion:'nutricion'};
  const t = p.startsWith('sheets_') ? 'sheets' : (map[p]||'entrada');
  document.querySelectorAll('.mob-tab').forEach(b=>{ b.classList.toggle('active', b.dataset.tab===t); });
}

if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});

// ══════════════════════════════════════════
//  ACTIVITY CHECK
// ══════════════════════════════════════════
let _actData    = null;
let _actVista   = 'habitos';
let _actChecks  = {};

function switchVistaAct(vista){
  _actVista = vista;
  ['habitos','electronics','libros','movies','norut'].forEach(function(v){
    var btn = document.getElementById('act-btn-'+v);
    if(!btn) return;
    var on = (v===vista);
    btn.style.background  = on?'rgba(59,130,246,.25)':'rgba(255,255,255,.04)';
    btn.style.borderColor = on?'rgba(59,130,246,.6)':'var(--border)';
    btn.style.color       = on?'#93C5FD':'var(--m)';
    btn.style.fontWeight  = on?'700':'500';
  });
  var cont = document.getElementById('act-container');
  if(!cont) return;
  if(!_actData){ cont.innerHTML='<div style="padding:40px;text-align:center;color:var(--m)"><i class="fas fa-circle-notch fa-spin"></i></div>'; return; }
  if(vista==='habitos')          dibujarHabitos(cont, (_actData.habitosPersonal||_actData.habitos||[]));
  else if(vista==='electronics') dibujarHabitos(cont, _actData.habitosElectronics||[], true);
  else if(vista==='libros')      dibujarMedia(cont, _actData.libros||[], 'Lectura');
  else if(vista==='movies')      dibujarMedia(cont, _actData.movies||[], 'Movie');
  else if(vista==='norut')       dibujarNoRutinarias(cont, _actData.noRutinarias||[]);
}

function renderActivity(){
  if(!_actData) return;
  var tabBar = document.getElementById('act-tabs');
  if(tabBar){
    var ts = _actTabStyle();
    tabBar.innerHTML =
      '<button id="act-btn-habitos"     onclick="switchVistaAct(\'habitos\')"     style="'+ts+'">Personal</button> ' +
      '<button id="act-btn-electronics" onclick="switchVistaAct(\'electronics\')" style="'+ts+'">Trabajo</button> ' +
      '<button id="act-btn-libros"      onclick="switchVistaAct(\'libros\')"      style="'+ts+'">Libros</button> ' +
      '<button id="act-btn-movies"      onclick="switchVistaAct(\'movies\')"      style="'+ts+'">Movies</button> ' +
      '<button id="act-btn-norut"       onclick="switchVistaAct(\'norut\')"       style="'+ts+'">Pendientes</button>';
  }
  switchVistaAct('habitos');
}

function _actTabStyle(){
  return 'padding:5px 10px;border-radius:var(--rad-pill);font-size:10px;font-weight:500;'+
    'background:rgba(255,255,255,.04);border:1px solid var(--border);color:var(--m);'+
    'cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap';
}

function _getSemanaKey(){
  var d = new Date();
  var jan1 = new Date(d.getFullYear(), 0, 1);
  var week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return d.getFullYear() + '-W' + String(week).padStart(2,'0');
}

function _getDiasEstaSemanaMX(){
  var hoy = new Date();
  var dow = hoy.getDay();
  var lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - (dow === 0 ? 6 : dow - 1));
  var dias = [];
  var LABELS = ['Lu','Ma','Mi','Ju','Vi','Sa','Do'];
  for(var i = 0; i < 7; i++){
    var d = new Date(lunes);
    d.setDate(lunes.getDate() + i);
    var iso = d.toISOString().slice(0,10);
    var hoyIso = hoy.toISOString().slice(0,10);
    dias.push({ date: iso, label: LABELS[i], isPast: iso <= hoyIso });
  }
  return dias;
}

function toggleHabito(nombre, semana, fecha){
  var key = nombre + '_' + semana + '_' + fecha;
  _actChecks[key] = !_actChecks[key];
  dibujarHabitos(document.getElementById('act-container'),
    (_actVista==='electronics' ? (_actData.habitosElectronics||[]) : (_actData.habitosPersonal||_actData.habitos||[])),
    _actVista==='electronics');
}

function guardarChecks(){
  var semana = _getSemanaKey();
  var checks = Object.entries(_actChecks)
    .filter(function(e){ return e[1] && e[0].includes('_'+semana+'_'); })
    .map(function(e){ return { nombre: e[0].split('_'+semana+'_')[0], fecha: e[0].split('_'+semana+'_')[1] }; });
  api.guardarActivityChecks(semana, checks)
    .then(function(r){ showToast(r.ok ? '✓ Semana guardada' : 'Error: '+r.mensaje, r.ok); })
    .catch(function(){ showToast('Error al guardar', false); });
}

function dibujarHabitos(cont, habitos, esElectronics){
  if(!habitos||!habitos.length){ cont.innerHTML='<div style="padding:40px;text-align:center;color:var(--m)">Sin hábitos</div>'; return; }
  var semana = _getSemanaKey();
  var dias   = _getDiasEstaSemanaMX();
  var hoy    = new Date().toISOString().slice(0,10);
  var color  = esElectronics ? '#3B82F6' : '#4ADE80';
  var thead = '<div style="display:grid;grid-template-columns:minmax(160px,1fr) '+dias.map(function(){return '36px';}).join(' ')+';gap:6px;align-items:center;padding:0 0 8px;border-bottom:1px solid rgba(255,255,255,.06);margin-bottom:8px">' +
    '<div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">Hábito</div>' +
    dias.map(function(d){ return '<div style="text-align:center;font-size:9px;font-weight:600;color:'+(d.date===hoy?'var(--ok)':'var(--m)')+';letter-spacing:.04em">'+d.label+'</div>'; }).join('') +
  '</div>';
  var rows = habitos.map(function(hab){
    var checks = dias.map(function(d){
      var key  = hab.nombre+'_'+semana+'_'+d.date;
      var done = !!_actChecks[key];
      var past = d.isPast;
      return '<div style="display:flex;align-items:center;justify-content:center">' +
        '<button onclick="toggleHabito(this.dataset.n,this.dataset.s,this.dataset.f)" ' +
        'data-n="'+hab.nombre.replace(/"/g,'&quot;')+'" data-s="'+semana+'" data-f="'+d.date+'" ' +
        'style="width:28px;height:28px;border-radius:8px;border:1px solid '+(done?'rgba(74,222,128,.4)':'rgba(255,255,255,.1)')+';'+
        'background:'+(done?'rgba(74,222,128,.15)':'rgba(255,255,255,.03)')+';cursor:'+(past?'pointer':'default')+';'+
        'display:flex;align-items:center;justify-content:center;font-size:13px;transition:all .15s;opacity:'+(past?1:.35)+';color:'+color+'" '+
        (past?'':' disabled')+'>'+(done?'✓':'')+'</button></div>';
    }).join('');
    var total = dias.filter(function(d){ return !!_actChecks[hab.nombre+'_'+semana+'_'+d.date]; }).length;
    var pct   = Math.round(total/7*100);
    return '<div style="display:grid;grid-template-columns:minmax(160px,1fr) '+dias.map(function(){return '36px';}).join(' ')+';gap:6px;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.03)">' +
      '<div><div style="font-size:13px;font-weight:500;color:var(--t)">'+hab.nombre+'</div>' +
      '<div style="font-size:10px;color:var(--m);margin-top:2px">'+(hab.recurrencia||'Eventual')+' · '+total+'/7 días</div>' +
      '<div style="height:2px;background:rgba(255,255,255,.06);border-radius:1px;margin-top:4px;overflow:hidden">' +
      '<div style="height:100%;width:'+pct+'%;background:'+color+';border-radius:1px;opacity:.7"></div></div></div>'+checks+'</div>';
  }).join('');
  cont.style.maxWidth = '860px';
  cont.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">' +
    '<div style="font-size:11px;color:var(--m)">Semana '+semana+'</div>' +
    '<button onclick="guardarChecks()" style="padding:6px 14px;border-radius:var(--rad-pill);background:'+color+';color:#000;border:none;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">' +
    '<i class="fas fa-cloud-arrow-up" style="margin-right:4px"></i>Guardar</button></div>' + thead + rows;
}

function dibujarMedia(cont, items, tipo){
  if(!items||!items.length){ cont.innerHTML='<div style="padding:40px;text-align:center;color:var(--m)">Sin elementos</div>'; return; }
  var color    = tipo==='Lectura' ? '#EC4899' : '#F59E0B';
  var emoji    = tipo==='Lectura' ? '📚' : '🎬';
  var tipoKey  = tipo==='Lectura' ? 'libro' : 'movie';
  var pendientes = items.filter(function(i){ return !i.completado; }).length;
  var completados = items.length - pendientes;
  var html = items.map(function(item, idx){
    var nombre = item.nombre || item;
    var done   = item.completado;
    var fila   = idx + 2;
    return '<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.03)">' +
      '<button data-tipo="'+tipoKey+'" data-fila="'+fila+'" data-val="'+(!done)+'" onclick="_toggleActivityItem(this,this.dataset.tipo,this.dataset.fila,this.dataset.val===\'true\')" ' +
      'style="width:22px;height:22px;border-radius:6px;border:1px solid '+(done?'rgba(74,222,128,.4)':'rgba(255,255,255,.15)')+';'+
      'background:'+(done?'rgba(74,222,128,.15)':'transparent')+';cursor:pointer;flex-shrink:0;'+
      'display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--ok);transition:all .2s">'+(done?'✓':'')+'</button>' +
      '<div style="flex:1;min-width:0"><div style="font-size:13px;color:'+(done?'var(--m)':'var(--t)')+';text-decoration:'+(done?'line-through':'none')+
      ';overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+nombre+'</div></div>' +
      '<div style="font-size:16px;flex-shrink:0;opacity:'+(done?.4:1)+'">'+emoji+'</div></div>';
  }).join('');
  cont.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;padding:0 0 10px">' +
    '<div style="font-size:11px;color:var(--m)">'+completados+' completados · '+pendientes+' pendientes</div>' +
    '<div style="height:3px;width:120px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden">' +
    '<div style="height:100%;width:'+(items.length>0?Math.round(completados/items.length*100):0)+'%;background:'+color+';border-radius:2px"></div></div></div>' + html;
}

function dibujarNoRutinarias(cont, items){
  if(!items||!items.length){ cont.innerHTML='<div style="padding:40px;text-align:center;color:var(--m)">Sin pendientes</div>'; return; }
  var pendientes = items.filter(function(i){ return !i.completado; }).length;
  var html = items.map(function(item, idx){
    var nombre = item.nombre || item;
    var done   = item.completado;
    var fila   = idx + 2;
    return '<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.03)">' +
      '<button data-tipo="norut" data-fila="'+fila+'" data-val="'+(!done)+'" onclick="_toggleActivityItem(this,this.dataset.tipo,this.dataset.fila,this.dataset.val===\'true\')" ' +
      'style="width:22px;height:22px;border-radius:6px;border:1px solid '+(done?'rgba(74,222,128,.4)':'rgba(139,92,246,.3)')+';'+
      'background:'+(done?'rgba(74,222,128,.15)':'rgba(139,92,246,.08)')+';cursor:pointer;flex-shrink:0;'+
      'display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--ok);transition:all .2s">'+(done?'✓':'')+'</button>' +
      '<div style="font-size:13px;color:'+(done?'var(--m)':'var(--t)')+';text-decoration:'+(done?'line-through':'none')+';flex:1">'+nombre+'</div></div>';
  }).join('');
  cont.innerHTML = '<div style="font-size:11px;color:var(--m);padding:0 0 10px">'+pendientes+' pendientes de '+items.length+'</div>' + html;
}

function _toggleActivityItem(btn, tipo, fila, nuevoValor){
  btn.disabled = true;
  api.marcarActivityItem(tipo, fila, nuevoValor)
    .then(function(r){
      if(r.ok){
        var lista = tipo==='libro'?_actData.libros:tipo==='movie'?_actData.movies:_actData.noRutinarias;
        if(lista && lista[fila-2]) lista[fila-2].completado = nuevoValor;
        var cont = document.getElementById('act-container');
        if(tipo==='libro')         dibujarMedia(cont, _actData.libros||[], 'Lectura');
        else if(tipo==='movie')    dibujarMedia(cont, _actData.movies||[], 'Movie');
        else                       dibujarNoRutinarias(cont, _actData.noRutinarias||[]);
      } else {
        btn.disabled = false;
        showToast('Error al marcar', false);
      }
    })
    .catch(function(){ btn.disabled=false; showToast('Error',false); });
}

function dibujarHistorial(cont){
  cont.innerHTML='<div style="padding:40px;text-align:center;color:var(--m);font-size:13px">' +
    '<div style="font-size:32px;margin-bottom:12px">📊</div>' +
    'El historial se construirá conforme guardes semanas.</div>';
}

function cargarScore(){
  const body = document.getElementById('score-body');
  if(body) body.innerHTML='<div style="padding:40px;text-align:center;color:var(--m)"><i class="fas fa-circle-notch fa-spin" style="font-size:20px"></i></div>';
  api.getScoreVida ? api.getScoreVida().then(renderScore).catch(()=>{}) : null;
}

function renderScore(data){
  const body = document.getElementById('score-body');
  if(!body) return;
  if(!data||!data.ok){ body.innerHTML='<div style="padding:20px;text-align:center;color:var(--m)">Sin datos de score</div>'; return; }
  const sc    = data.score || {};
  const score = sc.total || 0;
  const maximos = sc.maximos || { dinero:25, habitos:25, salud:20, relaciones:15, mental:15 };
  const desglose = sc.desglose || {};
  const areas = [
    { emoji:'💰', label:'Dinero',     score: Math.round((desglose.dinero||0)   / maximos.dinero   * 100), color:'#4ADE80' },
    { emoji:'⚡', label:'Hábitos',    score: Math.round((desglose.habitos||0)  / maximos.habitos  * 100), color:'#3B82F6' },
    { emoji:'🏥', label:'Salud',      score: Math.round((desglose.salud||0)    / maximos.salud    * 100), color:'#EC4899' },
    { emoji:'👥', label:'Relaciones', score: Math.round((desglose.relaciones||0)/ maximos.relaciones*100), color:'#F59E0B' },
    { emoji:'🧠', label:'Mental',     score: Math.round((desglose.mental||0)   / maximos.mental   * 100), color:'#8B5CF6' },
  ];
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#4ADE80' : score >= 40 ? '#FBBF24' : '#EF4444';
  body.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;padding:24px 20px 16px">
      <svg width="140" height="140" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="10"/>
        <circle cx="60" cy="60" r="54" fill="none" stroke="${color}" stroke-width="10"
          stroke-dasharray="${circumference}" stroke-dashoffset="${dashOffset}"
          stroke-linecap="round" transform="rotate(-90 60 60)" style="transition:stroke-dashoffset .8s ease"/>
        <text x="60" y="58" text-anchor="middle" font-size="26" font-weight="700" fill="${color}" font-family="system-ui">${score}</text>
        <text x="60" y="74" text-anchor="middle" font-size="10" fill="rgba(255,255,255,.4)" font-family="system-ui">/ 100</text>
      </svg>
      <div style="font-size:11px;color:var(--m);margin-top:4px">Score de Vida</div>
    </div>
    <div style="padding:0 20px 20px">
      ${(data.alertas||[]).slice(0,3).map(a=>`
      <div style="display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04)">
        <div style="font-size:13px;flex-shrink:0">${a.area}</div>
        <div style="font-size:12px;color:var(--err);flex:1">${a.msg}</div>
      </div>`).join('')}
    ${(data.positivos||[]).slice(0,2).map(a=>`
      <div style="display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04)">
        <div style="font-size:13px;flex-shrink:0">${a.area}</div>
        <div style="font-size:12px;color:var(--ok);flex:1">${a.msg}</div>
      </div>`).join('')}
    <div style="font-size:10px;color:var(--m);padding:8px 0;text-align:center">${sc.estado||''}</div>
    ${areas.map(a=>`
        <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04)">
          <div style="font-size:13px;flex-shrink:0">${a.emoji||'●'}</div>
          <div style="flex:1">
            <div style="font-size:12px;font-weight:600;color:var(--t)">${a.label}</div>
            <div style="height:3px;background:rgba(255,255,255,.06);border-radius:2px;margin-top:4px;overflow:hidden">
              <div style="height:100%;width:${a.score}%;background:${a.color||color};border-radius:2px"></div>
            </div>
          </div>
          <div style="font-size:13px;font-weight:700;color:${a.color||color};font-variant-numeric:tabular-nums">${a.score}</div>
        </div>`).join('')}
    </div>`;
}
