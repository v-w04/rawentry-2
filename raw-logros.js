/* RAW Entry — Logros v.4.024
   Board/Carrusel · Tooltip · Logros+Íconos · Maslow · Tab Móvil
*/
// ══════════════════════════════════════════
//  FLIP BOARD — carrusel 3 pantallas
// ══════════════════════════════════════════
let _pantalla = 'anverso';
let _boardFlipped = false;
let _reversoMostrarDone = false;
let _ordenLogros = 'az';

// FIX 2: setOrdenLogros ahora está definida como función real
function setOrdenLogros(orden) {
  _ordenLogros = orden;
  // Actualizar estilos de botones
  ['az','desc','asc'].forEach(k => {
    const btn = document.getElementById('lord-' + k);
    if (btn) btn.classList.remove('on');
  });
  const map = { 'az': 'az', 'monto-desc': 'desc', 'monto': 'asc' };
  const btnId = 'lord-' + (map[orden] || 'az');
  const btn = document.getElementById(btnId);
  if (btn) btn.classList.add('on');
  pintarReverso();
}

function _setPantalla(p){
  _pantalla = p;
  _boardFlipped = (p !== 'anverso');

  const anv    = document.getElementById('board-anverso');
  const logros = document.getElementById('board-logros');
  const maslow = document.getElementById('board-maslow');

  anv.classList.remove('slide-left','slide-right');
  if(logros) logros.classList.remove('active');
  if(maslow) maslow.classList.remove('active');
  const act=document.getElementById('board-activity');if(act)act.classList.remove('active');

  if(p === 'logros'){
    anv.classList.add('slide-left');
    if(logros) logros.classList.add('active');
  } else if(p === 'maslow'){
    anv.classList.add('slide-right');
    if(maslow) maslow.classList.add('active');
  } else if(p === 'activity'){
    anv.classList.add('slide-right');
    const act = document.getElementById('board-activity');
    if(act) act.classList.add('active');
  }
  const bL = document.getElementById('btn-logros');
  const bM = document.getElementById('btn-maslow');
  const bA = document.getElementById('btn-activity');
  if(bL) bL.classList.toggle('active', p==='logros');
  if(bM) bM.classList.toggle('active', p==='maslow');
  if(bA) bA.classList.toggle('active', p==='activity');
  if(typeof _syncMobTab==='function') _syncMobTab(p);
}

function irALogros(){
  if(_pantalla==='logros'){ volverAlAnverso(); return; }
  _setPantalla('logros');
  pintarReverso();
}

function irAMaslow(){
  if(_pantalla==='maslow'){ volverAlAnverso(); return; }
  _setPantalla('maslow');
  poblarFiltrosMes();
  dibujarNecesidades();
}

function volverAlAnverso(){
  _setPantalla('anverso');
}

function flipBoard(){
  if(_pantalla==='anverso') irALogros();
  else volverAlAnverso();
}

function poblarFiltrosReverso(){
  const proyectos = [...new Set(_logrosRaw.map(it=>it.proyecto))].sort();
  const grupos    = [...new Set(_logrosRaw.map(it=>it.grupo))].sort();
  const selP = document.getElementById('reverso-fil-proyecto');
  const selG = document.getElementById('reverso-fil-grupo');
  if(selP) selP.innerHTML = '<option value="">Proyecto</option>' + proyectos.map(p=>`<option value="${p}">${p}</option>`).join('');
  if(selG) selG.innerHTML = '<option value="">Contacto</option>' + grupos.map(g=>`<option value="${g}">${g}</option>`).join('');
}

function filtrarReverso(){ pintarReverso(); }

function toggleReversoMostrarDone(){
  _reversoMostrarDone = !_reversoMostrarDone;
  const btn = document.getElementById('reverso-tog-done');
  if(btn){
    btn.innerHTML = _reversoMostrarDone
      ? '<i class="fas fa-eye"></i> Completados'
      : '<i class="fas fa-eye-slash"></i> Completados';
    btn.style.background = _reversoMostrarDone ? 'rgba(34,197,94,.2)' : 'rgba(34,197,94,.08)';
  }
  pintarReverso();
}

function resetReverso(){
  ['reverso-fil-proyecto','reverso-fil-grupo'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.value='';
  });
  _ordenLogros = 'az';
  setOrdenLogros('az');
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
    return `<div class="inv-item${isDone?' done':''}${isInc?' inc':''}"
      title="${tooltip}" onclick="toggleLogroReverso(${i})">
      <div class="inv-corner ${isDone?'done':isInc?'warn':'pend'}">
        <i class="fas fa-${isDone?'check':isInc?'exclamation':'lock'}"></i>
      </div>
      <div class="inv-icon" style="opacity:${isDone?.5:1}">${icon}</div>
      <div class="inv-label" style="color:${isDone?'var(--m)':isInc?'var(--warn)':'var(--t)'};
        text-decoration:${isDone?'line-through':'none'}">
        ${label.length>28?label.slice(0,27)+'…':label}
      </div>
      ${monto?`<div class="inv-monto" style="opacity:${isDone?.5:1}">${monto}</div>`:''}
      ${tag?`<div class="inv-tag">${tag}</div>`:''}
    </div>`;
  }).join('');
  // Bug B fix: solo dibujar Maslow si ese panel está activo
  if(_pantalla==='maslow') dibujarNecesidades();
}

function toggleLogroReverso(idx){
  const filP  = document.getElementById('reverso-fil-proyecto')?.value||'';
  const filG  = document.getElementById('reverso-fil-grupo')?.value||'';
  let visibles = _logrosRaw.filter(it=>{
    if(!_reversoMostrarDone && it.completado) return false;
    if(filP && it.proyecto!==filP) return false;
    if(filG && it.grupo!==filG) return false;
    return true;
  });
  const item = visibles[idx];
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

// Reloj en vivo
(function tickClock(){
  const now=new Date();
  const t=now.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
  ['saldo-clock','saldo-clock2'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=t;});
  setTimeout(tickClock,1000);
})();


// ══════════════════════════════════════════
//  LOGROS — inventario RPG
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
  'Rectificación':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.96"/></svg>`,
  'Lectura':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  'ITIT':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  'Dentista':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a5 5 0 0 1 5 5c0 1-.3 2.1-.8 3L14 22h-4L7.8 10A5.07 5.07 0 0 1 7 7a5 5 0 0 1 5-5z"/></svg>`,
  'Médico':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  'Ojos':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  'Botiquín':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  'Cerradura':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  'Puerta':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M14 12h.01"/></svg>`,
  'Pantalla':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  'Proyector':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7 L19 7 L19 17 L5 17 Z"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  'Alfombra':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>`,
  'Muebles':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"/></svg>`,
  'Closet':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="7.5" y1="12" x2="7.5" y2="12.01"/><line x1="16.5" y1="12" x2="16.5" y2="12.01"/></svg>`,
  'Baño':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 Q9 2 12 2 Q15 2 15 6"/><ellipse cx="12" cy="14" rx="7" ry="5"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`,
  'iWatch':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="7" ry="7"/><polyline points="12 6 12 12 16 14"/></svg>`,
  'iPhone':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
  'Tintorería':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>`,
  'Cumpleaños':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  'Certificado':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  'Báscula':`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3 L8 9 M13 3 L16 9"/></svg>`,
  // FIX 5: íconos nuevos para Audio, Computación, Consumible, Ejercicio
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
  if(conc.includes('serie')||conc.includes('anime')||conc.includes('leveling')||
     conc.includes('hero')||conc.includes('jujutsu')||conc.includes('berserk')||
     conc.includes('dandadan')||conc.includes('hazbin')||conc.includes('alchemist')||
     conc.includes('what if')||conc.includes('comida')) return LOGROS_ICON_MAP['Movies'];
  if(conc.includes('leer')||conc.includes('lectura')||conc.includes('vero')||conc.includes('pmp')) return LOGROS_ICON_MAP['Lectura'];
  if(conc.includes('calcet')||conc.includes('cinturón')||conc.includes('playera')||conc.includes('cierre')) return LOGROS_ICON_MAP['Ropa'];
  if(conc.includes('mochila')) return LOGROS_ICON_MAP['Accesorios'];
  if(conc.includes('shampoo')||conc.includes('cera')||conc.includes('limpieza')) return LOGROS_ICON_MAP['Servicios'];
  if(conc.includes('cumple')) return LOGROS_ICON_MAP['Cumpleaños'];
  if(conc.includes('moho')||conc.includes('laminar')||conc.includes('vinil')||conc.includes('baño')) return LOGROS_ICON_MAP['Hogar'];
  if(conc.includes('borgia')||conc.includes('terminar')||conc.includes('itit')) return LOGROS_ICON_MAP['ITIT'];
  if(grupo.includes('movies')) return LOGROS_ICON_MAP['Movies'];
  if(grupo.includes('hogar')) return LOGROS_ICON_MAP['Hogar'];
  if(grupo.includes('ropa')) return LOGROS_ICON_MAP['Ropa'];
  if(grupo.includes('lectura')) return LOGROS_ICON_MAP['Lectura'];
  if(grupo.includes('audio')) return LOGROS_ICON_MAP['Audio'];
  if(grupo.includes('computación')||grupo.includes('computacion')) return LOGROS_ICON_MAP['Computación'];
  if(grupo.includes('consumible')) return LOGROS_ICON_MAP['Consumible'];
  if(grupo.includes('ejercicio')) return LOGROS_ICON_MAP['Ejercicio'];
  return LOGROS_ICON_MAP[proj] || LOGROS_ICON_MAP['default'];
}

// FIX 3: renderLogros solo usa la hoja Logros, sin mezclar eventuales
function renderLogros(data) {
  window._logrosData = data;
  const fromSheet = (data && data.items) ? data.items : [];

  const normalizados = fromSheet.map((it, i) => {
    const proyecto   = (it.proyecto && it.proyecto.trim()) ? it.proyecto.trim() : 'Sin Proyecto';
    const grupo      = (it.contacto && it.contacto.trim()) ? it.contacto.trim() : 'Sin Contacto';
    const concepto   = (it.concepto && it.concepto.trim()) ? it.concepto.trim() : 'Sin Concepto';
    const monto      = (typeof it.ie === 'number') ? it.ie : null;
    const fecha      = (it.recurrencia && it.recurrencia !== '-' && it.recurrencia !== 'null') ? it.recurrencia : '';
    const desc       = (it.descripcion && it.descripcion.trim()) ? it.descripcion.trim() : '';
    const completado = (it.completado === 'Sí' || it.completado === 'Si' || it.completado === 'sí');
    // FIX 4: solo flag incompleto cuando falta Concepto
    const incompleto = concepto === 'Sin Concepto';
    return { proyecto, grupo, concepto, monto, fecha, desc, completado, incompleto, fila: it.fila };
  });

  // FIX 3: ya NO se mezclan eventuales — _logrosRaw solo contiene normalizados
  _logrosRaw = normalizados;
  poblarFiltrosReverso();
  pintarInventario([]);
}

// FIX 3: renderEventuales se mantiene por compatibilidad pero ya no alimenta _logrosRaw
function renderEventuales(data) {
  window._eventualesData = data;
  // No hace nada más — eventuales ya viven en hoja Logros en v18
}

function poblarFiltrosLogros() {
  const proyectos = [...new Set(_logrosRaw.map(it=>it.proyecto))].sort();
  const grupos    = [...new Set(_logrosRaw.map(it=>it.grupo))].sort();
  const selP = document.getElementById('logros-fil-proyecto');
  const selG = document.getElementById('logros-fil-grupo');
  if(selP) selP.innerHTML = '<option value="">Proyecto</option>' + proyectos.map(p=>`<option value="${p}">${p}</option>`).join('');
  if(selG) selG.innerHTML = '<option value="">Contacto</option>' + grupos.map(g=>`<option value="${g}">${g}</option>`).join('');
}

function toggleMostrarDone(){
  _mostrarDone = !_mostrarDone;
  // Solo reverso-tog-done existe en HTML (logros-tog-done era código muerto)
  const btn = document.getElementById('reverso-tog-done');
  if(btn){
    btn.innerHTML = _mostrarDone
      ? '<i class="fas fa-eye"></i> Completados'
      : '<i class="fas fa-eye-slash"></i> Completados';
    btn.style.background = _mostrarDone ? 'rgba(34,197,94,.2)' : 'rgba(34,197,94,.08)';
  }
  if(_boardFlipped) pintarReverso();
  else pintarInventario([]);
}

function filtrarLogros() {
  pintarInventario([]);
  if(_boardFlipped) pintarReverso();
}

function resetLogros(){
  ['logros-fil-proyecto','logros-fil-grupo'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.value='';
  });
  _ordenLogros = 'az';
  if(_mostrarDone) toggleMostrarDone();
  else filtrarLogros();
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

function toggleLogro(idx, event){
  if(event) event.stopPropagation();
  const item = _logrosRaw[idx];
  if(!item) return;
  if(item.incompleto){
    showToast('⚠ Agrega el Concepto en el Sheet primero', false);
    return;
  }
  const nuevoVal = item.completado ? 'No' : 'Sí';
  item.completado = !item.completado;
  pintarInventario([]);
  if(_boardFlipped) pintarReverso();
  if(item.fila){
    api.marcarLogro(item.fila, nuevoVal)
      .then(r=>{ if(!r.ok) { item.completado=!item.completado; pintarInventario([]); if(_boardFlipped) pintarReverso(); showToast('Error al guardar', false); }
                 else showToast(nuevoVal==='Sí'?'✓ Logro completado':'Logro desmarcado', nuevoVal==='Sí'); })
      .catch(()=>{ item.completado=!item.completado; pintarInventario([]); if(_boardFlipped) pintarReverso(); });
  } else {
    showToast(nuevoVal==='Sí'?'✓ Marcado':'Desmarcado', true);
  }
}

// ══════════════════════════════════════════
//  MASLOW — análisis completo
// ══════════════════════════════════════════
let _necData  = null;
let _necVista = 'piramide';
let _radarChart = null;
let _pctAhorro = 20; // % ajustable por el usuario

const NEC_NIVELES = [
  { key:'1', label:'Fisiológicas',    sub:'Comer, dormir, agua',              color:'#EF4444', emoji:'🔴' },
  { key:'2', label:'Seguridad',       sub:'Estabilidad y vivienda',           color:'#F97316', emoji:'🟠' },
  { key:'3', label:'Afiliación',      sub:'Relaciones y pertenencia',         color:'#EAB308', emoji:'🟡' },
  { key:'4', label:'Reconocimiento',  sub:'Logros y autoestima',              color:'#22C55E', emoji:'🟢' },
  { key:'5', label:'Autorrealización',sub:'Propósito y potencial',            color:'#8B5CF6', emoji:'🟣' },
];

let _necMesesSeleccionados = new Set();

function renderNecesidades(data){
  _necData = data;
  if(_pantalla==='maslow'){
    poblarFiltrosMes();
    dibujarNecesidades();
  }
}

function poblarFiltrosMes(){
  const cont = document.getElementById('nec-filtros-mes');
  if(!cont || !_necData || !_necData.mesesDisponibles) return;
  cont.innerHTML = _necData.mesesDisponibles.map(m=>{
    const on = _necMesesSeleccionados.has(m);
    return `<button onclick="toggleFiltroMes('${m}')" id="nec-fil-${m.replace(' ','_')}"
      style="padding:3px 10px;border-radius:20px;font-size:10px;font-weight:600;
      background:${on?'rgba(139,92,246,.25)':'rgba(255,255,255,.04)'};
      border:1px solid ${on?'rgba(139,92,246,.5)':'var(--border)'};
      color:${on?'#C4B5FD':'var(--m)'};
      cursor:pointer;font-family:inherit;transition:all .15s">${m}</button>`;
  }).join('');
}

function toggleFiltroMes(mes){
  if(_necMesesSeleccionados.has(mes)) _necMesesSeleccionados.delete(mes);
  else _necMesesSeleccionados.add(mes);
  poblarFiltrosMes();
  dibujarNecesidades();
}

function resetFiltrosMes(){
  _necMesesSeleccionados.clear();
  poblarFiltrosMes();
  dibujarNecesidades();
}

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
  return ['1','2','3','4','5'].map(key=>({
    key, total: sumas[key]?sumas[key].total:0, conceptos: sumas[key]?sumas[key].conceptos:[]
  }));
}

function switchVistaNec(vista){
  _necVista = vista;
  ['piramide','radar','ahorro','tendencia'].forEach(v=>{
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
    cont.innerHTML='<div style="padding:40px;text-align:center;color:var(--m);font-size:13px">Cargando…</div>';
    return;
  }
  const nivelesFiltrados = calcularNivelesFiltrados();
  const per = document.getElementById('nec-periodo');
  if(per){
    if(_necMesesSeleccionados.size>0) per.textContent=[..._necMesesSeleccionados].join(', ');
    else per.textContent=_necData.periodo||'';
  }
  if(_necVista==='piramide')  dibujarPiramide(cont, nivelesFiltrados);
  else if(_necVista==='radar') dibujarRadar(cont, nivelesFiltrados);
  else if(_necVista==='ahorro') dibujarAhorro(cont, nivelesFiltrados);
  else if(_necVista==='tendencia') dibujarTendencia(cont);
  dibujarTablaAnalisis(nivelesFiltrados);
}

function dataNivel(key, nivelesArr){
  const arr = nivelesArr || (_necData ? _necData.niveles : []);
  return arr.find(n=>n.key===key)||{key,total:0,conceptos:[]};
}
function fmtK(v){ const a=Math.abs(v); return a>=1000?'$'+Math.round(a/1000)+'k':'$'+a.toLocaleString('es-MX',{maximumFractionDigits:0}); }

// ── Pirámide — barras horizontales minimalistas
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

// ── Radar
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
    data:{ labels, datasets:[{
      label:'Gasto por necesidad', data:norm,
      backgroundColor:'rgba(139,92,246,.12)', borderColor:'rgba(139,92,246,.6)',
      borderWidth:1.5, pointBackgroundColor:colors, pointBorderColor:'#111',
      pointBorderWidth:2, pointRadius:5, pointHoverRadius:7, fill:true,
    }]},
    options:{
      responsive:true, maintainAspectRatio:true, aspectRatio:1.3,
      plugins:{
        legend:{display:false},
        tooltip:{
          backgroundColor:'rgba(15,23,42,.95)', borderColor:'rgba(139,92,246,.3)',
          borderWidth:1, titleColor:'#fff', bodyColor:'#94A3B8', padding:10,
          callbacks:{ label:ctx=>{ const i=ctx.dataIndex; return ' '+NEC_NIVELES[i].emoji+' $ '+valores[i].toLocaleString('es-MX',{minimumFractionDigits:0}); }}
        }
      },
      scales:{ r:{
        min:0, max:100, backgroundColor:'rgba(0,0,0,.15)',
        angleLines:{color:'rgba(255,255,255,.06)',lineWidth:1},
        grid:{color:'rgba(255,255,255,.06)'},
        ticks:{display:false,stepSize:25},
        pointLabels:{ font:{size:11,weight:'600',family:'system-ui'}, color:ctx=>colors[ctx.index]||'#94A3B8',
          callback:(label,i)=>[label,fmtK(valores[i])] }
      }}
    }
  });
}

// ── Ahorro — regla 50/30/20 + slider
function dibujarAhorro(cont, niveles){
  niveles = niveles || (_necData ? _necData.niveles : []);
  // Calcular ingresos del mes actual desde flujoPorMes
  const MESES_ES=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const mesActual = MESES_ES[new Date().getMonth()];

  // Usar datos de flujo si están disponibles, si no estimamos desde niveles
  const totalGasto = Math.abs(NEC_NIVELES.reduce((s,n)=>s+Math.abs(dataNivel(n.key,niveles).total||0),0));
  const necesidades = Math.abs(dataNivel('1',niveles).total||0) + Math.abs(dataNivel('2',niveles).total||0);
  const deseos      = Math.abs(dataNivel('3',niveles).total||0) + Math.abs(dataNivel('4',niveles).total||0) + Math.abs(dataNivel('5',niveles).total||0);

  const mesesCount = _necMesesSeleccionados.size || _necData?.mesesDisponibles?.length || 1;
  const promedioMensual = totalGasto / mesesCount;

  const pctN = Math.round(necesidades/totalGasto*100)||0;
  const pctD = Math.round(deseos/totalGasto*100)||0;

  cont.innerHTML=`
    <div style="margin-bottom:20px">
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m);margin-bottom:12px">
        Meta de ahorro mensual
      </div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
        <span style="font-size:12px;color:var(--m);white-space:nowrap">Objetivo:</span>
        <input type="range" min="5" max="50" step="5" value="${_pctAhorro}"
          oninput="_pctAhorro=parseInt(this.value);document.getElementById('ahorro-pct-lbl').textContent=this.value+'%';_recalcAhorro()"
          style="flex:1;accent-color:var(--ok)">
        <span id="ahorro-pct-lbl" style="font-size:16px;font-weight:700;color:var(--ok);min-width:36px">${_pctAhorro}%</span>
      </div>
    </div>

    <div id="ahorro-cards" style="display:flex;flex-direction:column;gap:10px">
      <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:14px 16px">
        <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m);margin-bottom:8px">Gasto promedio mensual</div>
        <div style="font-size:22px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--t)">
          $ ${promedioMensual.toLocaleString('es-MX',{minimumFractionDigits:0})}
        </div>
        <div style="font-size:11px;color:var(--m);margin-top:2px">basado en ${mesesCount} mes${mesesCount!==1?'es':''}</div>
      </div>

      <div style="background:rgba(74,222,128,.06);border:1px solid rgba(74,222,128,.15);border-radius:10px;padding:14px 16px">
        <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--ok);margin-bottom:8px">Ahorro mínimo mensual (${_pctAhorro}%)</div>
        <div id="ahorro-meta-val" style="font-size:22px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--ok)">
          $ ${Math.round(promedioMensual*_pctAhorro/100).toLocaleString('es-MX')}
        </div>
        <div style="font-size:11px;color:var(--m);margin-top:2px">del gasto promedio mensual</div>
      </div>

      <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:14px 16px">
        <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m);margin-bottom:10px">Distribución 50/30/20 ideal</div>
        ${[
          {label:'Necesidades',pct:50,color:'#EF4444',real:pctN},
          {label:'Deseos',pct:30,color:'#8B5CF6',real:pctD},
          {label:'Ahorro',pct:20,color:'var(--ok)',real:_pctAhorro},
        ].map(r=>`
          <div style="margin-bottom:8px">
            <div style="display:flex;justify-content:space-between;margin-bottom:3px">
              <span style="font-size:11px;color:var(--m)">${r.label}</span>
              <span style="font-size:11px;font-weight:600;color:${r.color}">${r.pct}% ideal · <span style="color:var(--t)">${r.real||_pctAhorro}% actual</span></span>
            </div>
            <div style="height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden">
              <div style="height:100%;width:${Math.min(r.real||_pctAhorro,100)}%;background:${r.color};border-radius:2px;opacity:.8"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

function _recalcAhorro(){
  const niveles = calcularNivelesFiltrados();
  const totalGasto = NEC_NIVELES.reduce((s,n)=>s+Math.abs(dataNivel(n.key,niveles).total||0),0);
  const mesesCount = _necMesesSeleccionados.size || _necData?.mesesDisponibles?.length || 1;
  const prom = totalGasto / mesesCount;
  const el = document.getElementById('ahorro-meta-val');
  if(el) el.textContent='$ '+Math.round(prom*_pctAhorro/100).toLocaleString('es-MX');
}

// ── Tendencia mensual por nivel
function dibujarTendencia(cont){
  if(!_necData||!_necData.rawPorMes){
    cont.innerHTML='<div style="padding:24px;text-align:center;color:var(--m)">Sin datos de tendencia</div>';
    return;
  }
  cont.innerHTML=`<canvas id="tend-canvas" style="height:280px"></canvas>`;
  const canvas = document.getElementById('tend-canvas');
  if(!canvas||!window.Chart) return;

  const ORDEN_M=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const meses = (_necData.mesesDisponibles||[]).sort((a,b)=>ORDEN_M.indexOf(a)-ORDEN_M.indexOf(b));

  const datasets = NEC_NIVELES.map(niv=>{
    const data = meses.map(mes=>{
      const items = (_necData.rawPorMes[mes]||[]).filter(i=>i.key===niv.key);
      return items.reduce((s,i)=>s+Math.abs(i.monto||0),0)||null;
    });
    return {
      label: niv.label, data,
      borderColor: niv.color, borderWidth:1.5,
      pointRadius:3, pointHoverRadius:6,
      fill:false, tension:.3, spanGaps:true,
    };
  });

  new Chart(canvas,{
    type:'line',
    data:{labels:meses,datasets},
    options:{
      responsive:true, maintainAspectRatio:false,
      interaction:{mode:'index',intersect:false},
      plugins:{
        legend:{display:false},
        tooltip:{
          backgroundColor:'rgba(15,23,42,.95)',borderColor:'rgba(255,255,255,.1)',
          borderWidth:1,titleColor:'#fff',bodyColor:'#94A3B8',padding:10,
          callbacks:{ label:ctx=>{ const v=ctx.raw; return v?` ${ctx.dataset.label}: $ ${v.toLocaleString('es-MX',{minimumFractionDigits:0})}`:null; }}
        }
      },
      scales:{
        x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#64748B',font:{size:10}}},
        y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#64748B',font:{size:10},callback:v=>'$'+Math.abs(v/1000).toFixed(0)+'k'}}
      }
    }
  });
}

// ── Tabla análisis
function dibujarTablaAnalisis(niveles){
  niveles = niveles || (_necData ? _necData.niveles : []);
  const cont = document.getElementById('nec-tabla');
  if(!cont||!_necData||!_necData.niveles) return;

  const total  = NEC_NIVELES.reduce((s,n)=>s+Math.abs(dataNivel(n.key,niveles).total||0),0);
  const sorted = [...NEC_NIVELES]
    .map(n=>({...n,...dataNivel(n.key,niveles)}))
    .sort((a,b)=>Math.abs(b.total||0)-Math.abs(a.total||0));

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
        <div style="font-size:13px;font-weight:700;color:${vacio?'var(--dim)':'var(--t)'};font-variant-numeric:tabular-nums">
          ${vacio?'—':'$ '+abs.toLocaleString('es-MX',{minimumFractionDigits:0})}
        </div>
        <div style="font-size:10px;color:var(--m)">${pct}%</div>
      </div>
      <div style="flex-shrink:0">${status}</div>
    </div>`;
  }).join('');

  cont.innerHTML=`
    <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m);margin-bottom:10px">
      Resumen · <span style="color:var(--t);font-variant-numeric:tabular-nums">$ ${total.toLocaleString('es-MX',{minimumFractionDigits:0})}</span>
    </div>
    ${rows}`;
}


// ── Tab Bar Móvil ──
let _mobTabActivo = 'entrada';

function mobTab(tab){
  _mobTabActivo = tab;
  document.querySelectorAll('.mob-tab').forEach(b=>{
    b.classList.toggle('active', b.dataset.tab===tab);
  });
  if(tab==='logros'){ irALogros(); return; }
  if(tab==='maslow'){ irAMaslow(); return; }
  if(tab==='activity'){ irAActivity(); return; }
  if(_pantalla!=='anverso') volverAlAnverso();
  const ids = { entrada:'col1-wrap', bancos:'col1-wrap', flujo:'sec-flujo' };
  const targetId = ids[tab];
  if(targetId){
    setTimeout(()=>{
      const el = document.getElementById(targetId);
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      const hdr = document.getElementById('sec-flujo-hdr');
      if(tab==='flujo' && hdr){
        const body = document.getElementById('sec-flujo-body');
        if(body && !body.classList.contains('open')){
          body.classList.add('open');
          const chev = hdr.querySelector('.sec-chevron');
          if(chev) chev.style.transform='rotate(180deg)';
        }
      }
    }, _pantalla!=='anverso' ? 560 : 0);
  }
}

function _syncMobTab(p){
  const map = {anverso:'entrada', logros:'logros', maslow:'maslow'};
  const t = map[p]||'entrada';
  document.querySelectorAll('.mob-tab').forEach(b=>{
    b.classList.toggle('active', b.dataset.tab===t);
  });
}

if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});

// ══════════════════════════════════════════
//  ACTIVITY CHECK — hábitos + lecturas
// ══════════════════════════════════════════
let _actData    = null;
let _actVista   = 'habitos';
let _actChecks  = {}; // { 'habitoKey_YYYY-WW': true/false }

function irAActivity(){
  if(_pantalla==='activity'){ volverAlAnverso(); return; }
  _setPantalla('activity');
  if(_actData) renderActivity();
  else {
    const grid = document.getElementById('act-container');
    if(grid) grid.innerHTML='<div style="padding:40px;text-align:center;color:var(--m)"><i class="fas fa-circle-notch fa-spin" style="font-size:20px"></i></div>';
    api.getActivityCheck().then(d=>{ _actData=d; renderActivity(); }).catch(()=>{});
  }
}

function renderActivity(){
  if(!_actData) return;
  switchVistaAct(_actVista);
}

function switchVistaAct(vista){
  _actVista = vista;
  ['habitos','media','historial'].forEach(v=>{
    const btn = document.getElementById('act-btn-'+v);
    if(!btn) return;
    const on = v===vista;
    btn.style.background  = on?'rgba(59,130,246,.25)':'rgba(255,255,255,.04)';
    btn.style.borderColor = on?'rgba(59,130,246,.6)':'var(--border)';
    btn.style.color       = on?'#93C5FD':'var(--m)';
    btn.style.fontWeight  = on?'700':'500';
  });
  const cont = document.getElementById('act-container');
  if(!cont) return;
  if(vista==='habitos')   dibujarHabitos(cont);
  else if(vista==='media') dibujarMedia(cont);
  else if(vista==='historial') dibujarHistorial(cont);
}

// ── Semana actual
function _getSemanaKey(){
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week  = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2,'0')}`;
}

function _getDiasEstaSemanaMX(){
  const dias = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const hoy  = new Date();
  const dow   = hoy.getDay(); // 0=Dom
  const lunes = new Date(hoy); lunes.setDate(hoy.getDate() - (dow===0?6:dow-1));
  return Array.from({length:7},(_,i)=>{
    const d = new Date(lunes); d.setDate(lunes.getDate()+i);
    return { label:dias[d.getDay()], date:d.toISOString().slice(0,10), isPast: d<=hoy };
  });
}

// ── Hábitos — checkboxes semanales
function dibujarHabitos(cont){
  if(!_actData||!_actData.habitos||!_actData.habitos.length){
    cont.innerHTML='<div style="padding:40px;text-align:center;color:var(--m)">Sin hábitos configurados</div>';
    return;
  }

  const semana = _getSemanaKey();
  const dias   = _getDiasEstaSemanaMX();
  const hoy    = new Date().toISOString().slice(0,10);

  const thead = `<div style="display:grid;grid-template-columns:1fr ${dias.map(()=>'36px').join(' ')};gap:6px;align-items:center;padding:0 0 8px;border-bottom:1px solid rgba(255,255,255,.06);margin-bottom:8px">
    <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">Hábito</div>
    ${dias.map(d=>`<div style="text-align:center;font-size:9px;font-weight:600;color:${d.date===hoy?'var(--ok)':'var(--m)'};letter-spacing:.04em">${d.label}</div>`).join('')}
  </div>`;

  const rows = _actData.habitos.map(hab=>{
    const checks = dias.map(d=>{
      const key   = `${hab.nombre}_${semana}_${d.date}`;
      const done  = !!_actChecks[key];
      const past  = d.isPast;
      return `<div style="display:flex;align-items:center;justify-content:center">
        <button onclick="toggleHabito('${hab.nombre}','${semana}','${d.date}')"
          style="width:28px;height:28px;border-radius:8px;border:1px solid ${done?'rgba(74,222,128,.4)':'rgba(255,255,255,.1)'};
          background:${done?'rgba(74,222,128,.15)':'rgba(255,255,255,.03)'};cursor:${past?'pointer':'default'};
          display:flex;align-items:center;justify-content:center;font-size:13px;transition:all .15s;
          opacity:${past?1:.35}"
          ${!past?'disabled':''}>
          ${done?'✓':''}
        </button>
      </div>`;
    }).join('');

    const total = dias.filter(d=>{ const k=`${hab.nombre}_${semana}_${d.date}`; return _actChecks[k]; }).length;
    const pct   = Math.round(total/7*100);

    return `<div style="display:grid;grid-template-columns:1fr ${dias.map(()=>'36px').join(' ')};gap:6px;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.03)">
      <div>
        <div style="font-size:13px;font-weight:500;color:var(--t)">${hab.nombre}</div>
        <div style="font-size:10px;color:var(--m);margin-top:2px">${hab.recurrencia||'Diario'} · ${total}/7 días</div>
        <div style="height:2px;background:rgba(255,255,255,.06);border-radius:1px;margin-top:4px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:var(--ok);border-radius:1px;opacity:.7"></div>
        </div>
      </div>
      ${checks}
    </div>`;
  }).join('');

  const semanaLabel = `Semana ${semana}`;
  cont.innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div style="font-size:11px;color:var(--m)">${semanaLabel}</div>
      <button onclick="guardarChecks()" style="padding:6px 14px;border-radius:var(--rad-pill);background:var(--ok);color:#000;border:none;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">
        <i class="fas fa-cloud-arrow-up" style="margin-right:4px"></i>Guardar
      </button>
    </div>
    ${thead}${rows}`;
}

function toggleHabito(nombre, semana, fecha){
  const key = `${nombre}_${semana}_${fecha}`;
  _actChecks[key] = !_actChecks[key];
  dibujarHabitos(document.getElementById('act-container'));
}

function guardarChecks(){
  const semana = _getSemanaKey();
  const payload = Object.entries(_actChecks)
    .filter(([k,v])=>k.includes(semana) && v)
    .map(([k])=>{ const parts=k.split('_'); return {nombre:parts[0],semana:parts[1],fecha:parts[2]}; });
  api.guardarActivityChecks(semana, payload)
    .then(r=>showToast(r.ok?'✓ Guardado':'Error',r.ok))
    .catch(()=>showToast('Error al guardar',false));
}

// ── Media — lecturas, series, películas
function dibujarMedia(cont){
  if(!_actData||!_actData.media||!_actData.media.length){
    cont.innerHTML='<div style="padding:40px;text-align:center;color:var(--m)">Sin elementos en lista</div>';
    return;
  }

  const porCategoria = {};
  _actData.media.forEach(item=>{
    const cat = item.categoria||'Sin categoría';
    if(!porCategoria[cat]) porCategoria[cat]=[];
    porCategoria[cat].push(item);
  });

  const CAT_ICONS = {'L':'📚','M':'🎬','S':'📺','':'🎯'};

  const html = Object.entries(porCategoria).map(([cat,items])=>{
    const icon = CAT_ICONS[cat]||'🎯';
    const rows = items.map(item=>{
      const done = item.completado==='Sí'||item.completado==='Si';
      return `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.03)">
        <div style="width:20px;height:20px;border-radius:6px;border:1px solid ${done?'rgba(74,222,128,.4)':'rgba(255,255,255,.1)'};
          background:${done?'rgba(74,222,128,.1)':'transparent'};display:flex;align-items:center;justify-content:center;
          font-size:11px;flex-shrink:0;color:${done?'var(--ok)':'var(--m)'}">${done?'✓':''}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;color:${done?'var(--m)':'var(--t)'};text-decoration:${done?'line-through':'none'};
            overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${item.nombre}</div>
          ${item.nota?`<div style="font-size:10px;color:var(--m)">${item.nota}</div>`:''}
        </div>
        ${item.categoria?`<div style="font-size:18px;flex-shrink:0">${CAT_ICONS[item.categoria]||'🎯'}</div>`:''}
      </div>`;
    }).join('');
    const total = items.length;
    const done  = items.filter(i=>i.completado==='Sí'||i.completado==='Si').length;
    return `<div style="margin-bottom:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--m);display:flex;align-items:center;gap:6px">
          <span>${icon}</span><span>${cat==='L'?'Libros':cat==='M'?'Películas':cat==='S'?'Series':'Otros'}</span>
        </div>
        <span style="font-size:10px;color:var(--m)">${done}/${total}</span>
      </div>
      ${rows}
    </div>`;
  }).join('');

  cont.innerHTML=html;
}

// ── Historial — resumen por semana
function dibujarHistorial(cont){
  cont.innerHTML=`<div style="padding:40px;text-align:center;color:var(--m);font-size:13px">
    <div style="font-size:32px;margin-bottom:12px">📊</div>
    El historial se construirá conforme guardes semanas. Próximamente disponible.
  </div>`;
}
