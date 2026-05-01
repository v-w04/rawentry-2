/* RAW Entry — Core v.5.001
   API · Estado · Utils · Init · Formulario · Entes · Panel · Refresh
*/
// Detectar móvil
(function(){
  if(/iPhone|iPad|iPod|Android.*Mobile/.test(navigator.userAgent)){
    document.documentElement.classList.add('mob');
  }
})();

// ══════════════════════════════════════════
//  API HÍBRIDA
// ══════════════════════════════════════════
const API_URL = 'https://script.google.com/macros/s/AKfycbzeJOsUXaMqDzCBu2MHsvFa01Jf96CUEoScH9cF_SWIfokWrwmcyKIwC_TCPhCAHPUrWg/exec';

const EN_GAS = (function(){
  try {
    return typeof google !== 'undefined'
      && typeof google.script !== 'undefined'
      && typeof google.script.run !== 'undefined';
  } catch(e){ return false; }
})();

function gasRun(fn, ...args) {
  return new Promise((resolve, reject) => {
    const runner = google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler(e => { console.error(fn, e); reject(e); });
    if (typeof runner[fn] === 'function') {
      runner[fn](...args);
    } else {
      reject(new Error('Función no encontrada: ' + fn));
    }
  });
}

async function apiGet(action, params={}) {
  const url = new URL(API_URL);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, v));
  const r = await fetch(url);
  return r.json();
}

async function apiPost(action, data={}) {
  const r = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action, ...data })
  });
  return r.json();
}

const api = {
  getAll:            () => EN_GAS ? gasRun('getAll') : apiGet('getAll'),
  getSaldoDia:       (f) => EN_GAS ? gasRun('getSaldoDia', f) : apiGet('getSaldoDia', { fecha: f }),
  getListaEstructura:() => EN_GAS ? gasRun('getListaEstructura') : apiGet('getListaEstructura'),
  insertarEnRAW:     (d) => EN_GAS ? gasRun('insertarEnRAW', d) : apiPost('insertarEnRAW', { data: d }),
  actualizarFijo:    (fila, monto) => EN_GAS ? gasRun('actualizarFijo', fila, monto) : apiPost('actualizarFijo', { fila, monto }),
  agregarALista:     (colIndex, valor) => EN_GAS ? gasRun('agregarALista', colIndex, valor) : apiPost('agregarALista', { colIndex, valor }),
  marcarLogro:       (fila, val) => EN_GAS ? gasRun('marcarLogro', fila, val) : apiPost('marcarLogro', { fila, val }),
  getFijos:          () => EN_GAS ? gasRun('getFijos') : apiGet('getFijos'),
  getDatosMes:       () => EN_GAS ? gasRun('getDatosMes') : apiGet('getDatosMes'),
  getGastos:         () => EN_GAS ? gasRun('getGastos') : apiGet('getGastos'),
  getLogros:         () => EN_GAS ? gasRun('getLogros') : apiGet('getLogros'),
  getActivityCheck:  () => EN_GAS ? gasRun('getActivityCheck') : apiGet('getActivityCheck'),
  guardarActivityChecks: (semana,checks) => EN_GAS ? gasRun('guardarActivityChecks',semana,checks) : apiPost('guardarActivityChecks',{semana,checks}),
  guardarEnBancos:      (nombre, monto, fecha) => EN_GAS ? gasRun('guardarEnBancos', nombre, monto, fecha) : apiPost('guardarEnBancos', { nombre, monto, fecha }),
  getFilaPorId:         (id) => EN_GAS ? gasRun('getFilaPorId', id) : apiGet('getFilaPorId', { id }),
  editarFilaRAW:        (fila, datos) => EN_GAS ? gasRun('editarFilaRAW', fila, datos) : apiPost('editarFilaRAW', { fila, datos }),
  // ── Módulos nuevos ──
  getPensamientos:      () => EN_GAS ? gasRun('getPensamientos') : apiGet('getPensamientos'),
  guardarPensamiento:   (d) => EN_GAS ? gasRun('guardarPensamiento', d) : apiPost('guardarPensamiento', { datos: d }),
  getRelaciones:        () => EN_GAS ? gasRun('getRelaciones') : apiGet('getRelaciones'),
  guardarInteraccion:   (d) => EN_GAS ? gasRun('guardarInteraccion', d) : apiPost('guardarInteraccion', { datos: d }),
  getSalud:             () => EN_GAS ? gasRun('getSalud') : apiGet('getSalud'),
  guardarSalud:         (d) => EN_GAS ? gasRun('guardarSalud', d) : apiPost('guardarSalud', { datos: d }),
  getApartados:         () => EN_GAS ? gasRun('getApartados') : apiGet('getApartados'),
  guardarApartado:      (d) => EN_GAS ? gasRun('guardarApartado', d) : apiPost('guardarApartado', { datos: d }),
  actualizarApartado:   (fila, estado) => EN_GAS ? gasRun('actualizarApartado', fila, estado) : apiPost('actualizarApartado', { fila, estado }),
  getFinancieroAvanzado:() => EN_GAS ? gasRun('getFinancieroAvanzado') : apiGet('getFinancieroAvanzado'),
  getRevision:          (tipo, anio, mes, semana) => EN_GAS ? gasRun('getRevision', tipo, anio, mes, semana) : apiGet('getRevision', { tipo, anio, mes, semana }),
  getNecesidades:       () => EN_GAS ? gasRun('getNecesidades') : apiGet('getNecesidades'),
  getFlujoPorMes:       () => EN_GAS ? gasRun('getFlujoPorMes') : apiGet('getFlujoPorMes'),
  getScoreVida:         () => EN_GAS ? gasRun('getScoreVida') : apiGet('getScoreVida'),
  enviarSOS:            (d) => EN_GAS ? gasRun('enviarSOS', d) : apiPost('enviarSOS', { datos: d }),
  // ── Patrimonio ──
  getPatrimonio:        () => EN_GAS ? gasRun('getPatrimonio') : apiGet('getPatrimonio'),
  getAhorro:            () => EN_GAS ? gasRun('getAhorro') : apiGet('getAhorro'),
  getEfectivo:          () => EN_GAS ? gasRun('getEfectivo') : apiGet('getEfectivo'),
  getInversion:         () => EN_GAS ? gasRun('getInversion') : apiGet('getInversion'),
  guardarAhorro:        (d) => EN_GAS ? gasRun('guardarAhorro', d) : apiPost('guardarAhorro', { datos: d }),
  guardarEfectivo:      (d) => EN_GAS ? gasRun('guardarEfectivo', d) : apiPost('guardarEfectivo', { datos: d }),
  guardarInversion:     (d) => EN_GAS ? gasRun('guardarInversion', d) : apiPost('guardarInversion', { datos: d }),
  marcarActivityItem:   (tipo, fila, valor) => EN_GAS ? gasRun('marcarActivityItem', tipo, fila, valor) : apiPost('marcarActivityItem', { tipo, fila, valor }),
  resetearElectronics:  () => EN_GAS ? gasRun('resetearElectronicsHoy') : apiGet('resetearElectronics'),
  getNutricion:         () => EN_GAS ? gasRun('getNutricion') : apiGet('getNutricion'),
  getMetasNutricion:    () => EN_GAS ? gasRun('getMetasNutricion') : apiGet('getMetasNutricion'),
  guardarNutricion:     (d) => EN_GAS ? gasRun('guardarNutricion', d) : apiPost('guardarNutricion', { datos: d }),
  getEntrenamiento:     () => EN_GAS ? gasRun('getEntrenamiento') : apiGet('getEntrenamiento'),
  guardarEntrenamiento: (d) => EN_GAS ? gasRun('guardarEntrenamiento', d) : apiPost('guardarEntrenamiento', { datos: d }),
};

// ══════════════════════════════════════════
//  ESTADO
// ══════════════════════════════════════════
const CAMPOS=['fecha','proyecto','contacto','concepto','monto','recurrencia','necesidad','clave'];
const MESES_ES=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
let sign=1, cats={}, proxSel='', contactoSel='', recSel='', necesidadSel='', sheetUrl='';
let _modoEditar=false, _filaEditar=null, _idEditar=null;
let _tabEntrada='nueva'; // nueva | editar | salud | pensamiento | persona | apartado
let datosMes={meses:[],grupos:{}};
let _toast=null;

// ══════════════════════════════════════════
//  PARTÍCULAS
// ══════════════════════════════════════════
(()=>{
  const c=document.getElementById('pts');
  if(!c)return;
  const esMob=/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const tipos=esMob
    ?['white','white','white','white','white','white']
    :['blue','blue','blue','cyan','cyan','blue'];
  for(let i=0;i<60;i++){
    const p=document.createElement('div');
    const tipo=tipos[Math.floor(Math.random()*tipos.length)];
    p.className='pt '+tipo;
    p.style.left=Math.random()*100+'vw';
    p.style.top=(100+Math.random()*120)+'vh';
    p.style.animationName='subir';
    p.style.animationDuration=(10+Math.random()*8)+'s';
    p.style.animationDelay=(Math.random()*12)+'s';
    p.style.animationTimingFunction='linear';
    p.style.animationIterationCount='infinite';
    c.appendChild(p);
  }
})();


// ══════════════════════════════════════════
//  TABLERO MÓVIL
// ══════════════════════════════════════════
function _initMobTablero(){
  const tablero = document.getElementById('mob-tablero');
  const sections = document.getElementById('mob-sections');
  if(tablero) tablero.style.display='none';
  if(sections) sections.style.display='flex';
}



// ── Guardar Nutrición ──
function _guardarNutricion(){
  var comida = document.getElementById('nut-comida').value.trim();
  var res    = document.getElementById('nut-res');
  if(!comida){ res.textContent='Escribe qué comiste'; res.style.color='var(--err)'; return; }
  res.textContent='Guardando…'; res.style.color='var(--m)';
  var datos = {
    comida:   comida,
    calorias: parseFloat(document.getElementById('nut-cal')?.value)||0,
    proteina: parseFloat(document.getElementById('nut-prot')?.value)||0,
    carbos:   parseFloat(document.getElementById('nut-carbos')?.value)||0,
    grasa:    parseFloat(document.getElementById('nut-grasa')?.value)||0,
    agua:     parseFloat(document.getElementById('nut-agua')?.value)||0,
    fasting:  parseFloat(document.getElementById('nut-fast')?.value)||0,
    notas:    document.getElementById('nut-notas')?.value||'',
    fecha:    fmtD(new Date())
  };
  api.guardarNutricion(datos)
    .then(function(r){
      res.textContent = r.ok ? '✓ Guardado' : '✗ '+r.mensaje;
      res.style.color = r.ok ? 'var(--ok)' : 'var(--err)';
      if(r.ok){
        document.getElementById('nut-comida').value='';
        ['nut-cal','nut-prot','nut-carbos','nut-grasa','nut-agua','nut-fast','nut-notas'].forEach(function(id){
          var el = document.getElementById(id); if(el) el.value='';
        });
        api.getNutricion().then(renderNutricion).catch(function(){});
      }
    }).catch(function(){ res.textContent='Error'; res.style.color='var(--err)'; });
}

// ── Guardar Entrenamiento ──
function _guardarEntrenamiento(){
  var ejercicio = document.getElementById('ent-ejercicio').value.trim();
  var res       = document.getElementById('ent-res');
  if(!ejercicio){ res.textContent='Escribe el ejercicio'; res.style.color='var(--err)'; return; }
  res.textContent='Guardando…'; res.style.color='var(--m)';
  var datos = {
    tipo:      document.getElementById('ent-tipo')?.value||'',
    ejercicio: ejercicio,
    duracion:  parseFloat(document.getElementById('ent-dur')?.value)||0,
    distancia: parseFloat(document.getElementById('ent-dist')?.value)||0,
    series:    parseFloat(document.getElementById('ent-series')?.value)||0,
    reps:      parseFloat(document.getElementById('ent-reps')?.value)||0,
    peso:      parseFloat(document.getElementById('ent-peso')?.value)||0,
    notas:     document.getElementById('ent-notas')?.value||'',
    fecha:     fmtD(new Date())
  };
  api.guardarEntrenamiento(datos)
    .then(function(r){
      res.textContent = r.ok ? '✓ Guardado' : '✗ '+r.mensaje;
      res.style.color = r.ok ? 'var(--ok)' : 'var(--err)';
      if(r.ok){
        document.getElementById('ent-ejercicio').value='';
        document.getElementById('ent-dur').value='';
        ['ent-series','ent-reps','ent-peso'].forEach(function(id){ document.getElementById(id).value=''; });
        api.getEntrenamiento().then(renderEntrenamiento).catch(function(){});
      }
    }).catch(function(){ res.textContent='Error'; res.style.color='var(--err)'; });
}



// ══════════════════════════════════════════
//  DROPDOWN NUEVA ENTRADA
// ══════════════════════════════════════════
function toggleEntradaDropdown(){
  const dd = document.getElementById('entrada-dropdown');
  const btn = document.getElementById('btn-nueva-entrada');
  if(!dd) return;
  const isOpen = dd.classList.contains('show');
  if(isOpen){
    dd.classList.remove('show');
    dd.style.display = 'none';
    if(btn) btn.classList.remove('active');
  } else {
    dd.classList.add('show');
    dd.style.display = 'flex';
    if(btn) btn.classList.add('active');
    if(typeof _inyectarToggleModo === 'function') _inyectarToggleModo();
    const fechaEl = document.getElementById('fecha');
    if(fechaEl && !fechaEl.value) fechaEl.value = fmtD(new Date());
    setTimeout(()=>{ const m=document.getElementById('monto'); if(m) m.focus(); }, 100);
  }
}

// Cerrar dropdown al hacer click en el overlay (fuera del inner)
document.addEventListener('click', function(e){
  const dd = document.getElementById('entrada-dropdown');
  const btn = document.getElementById('btn-nueva-entrada');
  if(!dd || !dd.classList.contains('show')) return;
  const inner = document.querySelector('.entrada-dropdown-inner');
  // Si el click fue en el overlay (dd) pero fuera del inner — cerrar
  if(e.target === dd){
    dd.classList.remove('show');
    dd.style.display = 'none';
    if(btn) btn.classList.remove('active');
  }
});

// Cerrar con Escape
document.addEventListener('keydown', function(e){
  if(e.key !== 'Escape') return;
  const dd = document.getElementById('entrada-dropdown');
  const btn = document.getElementById('btn-nueva-entrada');
  if(dd && dd.classList.contains('show')){
    dd.classList.remove('show');
    dd.style.display = 'none';
    if(btn) btn.classList.remove('active');
  }
});

// ── Nueva Entrada — form en col1, sin popup ──
function abrirEntrada(){
  // Siempre mostrar paso1 primero
  const paso1 = document.getElementById('entrada-paso1');
  const paso2 = document.getElementById('entrada-paso2');
  if(paso1) paso1.style.display = 'block';
  if(paso2) paso2.style.display = 'none';
  toggleEntradaDropdown();
}

function cerrarEntrada(){
  const dd = document.getElementById('entrada-dropdown');
  const btn = document.getElementById('btn-nueva-entrada');
  if(dd){ dd.classList.remove('show'); dd.style.display='none'; }
  if(btn) btn.classList.remove('active');
  // Regresar a paso1 para la próxima vez
  const paso1 = document.getElementById('entrada-paso1');
  const paso2 = document.getElementById('entrada-paso2');
  if(paso1) paso1.style.display = 'block';
  if(paso2) paso2.style.display = 'none';
}

// ══════════════════════════════════════════
//  GUARDAR BANCO
// ══════════════════════════════════════════
function guardarBanco(){
  const nombre = document.getElementById('banco-nombre').value.trim();
  const monto  = parseFloat(document.getElementById('banco-monto').value);
  const fecha  = document.getElementById('banco-fecha').value;
  if(!nombre || isNaN(monto) || !fecha){
    showToast('Completa todos los campos', false); return;
  }
  const btn = document.querySelector('#form-banco-wrap .btn-save');
  btn.disabled = true;
  api.guardarEnBancos(nombre, monto, fecha)
    .then(r=>{
      btn.disabled = false;
      if(r.ok){
        showToast('✓ Banco guardado');
        document.getElementById('banco-nombre').value='';
        document.getElementById('banco-monto').value='';
        const bfEl=document.getElementById('banco-fecha'); if(bfEl) bfEl.value=fmtD(new Date());
        api.getFijos().then(renderEntes);
      } else {
        showToast(r.mensaje||'Error', false);
      }
    })
    .catch(()=>{ btn.disabled=false; showToast('Error al guardar', false); });
}

// ══════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════
window.addEventListener('DOMContentLoaded',()=>{
  const hoy=fmtD(new Date());
  // fecha is inside popup — set it safely
  const fechaEl=document.getElementById('fecha');
  if(fechaEl) fechaEl.value=hoy;
  _inyectarToggleModo();
  // saldo se inicializa desde _renderCFO

  setChip('load','Cargando');
  api.getAll()
    .then(d=>{
      if(!d.ok && !d.catalogos){
        setChip('err','Error');
        mostrarErrorConexion('getAll falló: '+(d.error||'sin datos'));
        return;
      }
      sheetUrl = d.sheetUrl || '';
      onCats(d.catalogos);
      renderEntes(d.fijos);
      onDatosMes(d.datosMes);
      renderAnualidad(d.gastos);
      renderLogros(d.logros);
      renderNecesidades(d.necesidades);
      renderFlujoMensual(d.flujoPorMes);
      renderApartados(d.apartados||{items:[],totalApartado:0});
      if(d.activityCheck){ _actData=d.activityCheck; }
      if(d.financieroAvanzado) renderFinancieroAvanzado(d.financieroAvanzado);
      if(d.apartados) renderApartados(d.apartados);
      // Cargar módulos lazy
      api.getPensamientos().then(renderPensamientos).catch(()=>{});
      api.getRelaciones().then(renderRelaciones).catch(()=>{});
      api.getSalud().then(renderSalud).catch(()=>{});
      if(typeof cargarScore==='function') cargarScore();
      api.getPatrimonio().then(renderPatrimonio).catch(()=>renderPatrimonio({ok:true,total:0,
        banco:{saldo:0,pct:0,items:[]},fisico:{saldo:0,pct:0,items:[]},
        inversion:{saldo:0,pct:0,rendimientoTotal:0,items:[]},
        fondo:{meta:0,avance:0,meses:0,salud:'err'}}));
      cargarRevision('mensual', new Date().getFullYear(), new Date().getMonth()+1, null);
    })
    .catch(err=>{
      setChip('err','Error');
      mostrarErrorConexion(err.message);
    });

  initTooltip();
  _initMobTablero();
  const bfEl=document.getElementById('banco-fecha'); if(bfEl) bfEl.value=fmtD(new Date());
});

function mostrarErrorConexion(msg){
  const d=document.createElement('div');
  d.style.cssText='position:fixed;top:60px;left:8px;right:8px;z-index:9999;background:#EF4444;color:#fff;padding:12px 16px;border-radius:12px;font-size:13px;font-weight:600';
  d.innerHTML='⚠ <b>Error de conexión:</b> '+msg+'<br><small>Verifica que la URL de GAS es correcta y está desplegada como web app pública</small>';
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),10000);
}

// ══════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════
function fmtD(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}

function fmtDiaSemana(str){
  if(!str)return'';
  const DIAS=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const p=str.split('-');
  if(p.length!==3)return str;
  const d=new Date(Number(p[0]),Number(p[1])-1,Number(p[2]));
  return DIAS[d.getDay()]+' '+p[2]+'/'+p[1];
}

function fmtMoneda(v){
  if(v===null||v===undefined||v==='')return{txt:'—',cls:'z'};
  const n=Number(v);if(isNaN(n))return{txt:'—',cls:'z'};
  if(n===0)return{txt:'$ 0',cls:'z'};
  const abs='$ '+Math.abs(n).toLocaleString('es-MX',{minimumFractionDigits:2,maximumFractionDigits:2});
  return n>0?{txt:abs,cls:'pos'}:{txt:'− '+abs,cls:'neg'};
}

function setChip(t,txt){
  ['chip','chip2'].forEach(id=>{
    const c=document.getElementById(id);
    if(c)c.className='hero-chip '+t;
  });
  ['chip-txt','chip-txt2'].forEach(id=>{
    const ct=document.getElementById(id);
    if(ct)ct.textContent=txt;
  });
}

function showToast(msg,ok=true){
  const t=document.getElementById('toast');
  t.className='toast '+(ok?'ok':'err');
  t.querySelector('i').className=ok?'fas fa-circle-check':'fas fa-circle-xmark';
  document.getElementById('toast-msg').textContent=msg;
  t.classList.add('show');
  clearTimeout(_toast);
  _toast=setTimeout(()=>t.classList.remove('show'),2800);
}

function progStart(){const b=document.getElementById('prog');b.className='prog-bar ind';}
function progDone(){const b=document.getElementById('prog');b.className='prog-bar';b.style.width='100%';setTimeout(()=>{b.style.width='0%';},400);}

// ══════════════════════════════════════════
//  ACORDEONES
// ══════════════════════════════════════════
function togKard(id){
  const el=document.getElementById(id);
  if(!el)return;
  const isOpen=el.style.display==='block';
  el.style.display=isOpen?'none':'block';
  const card=el.closest?el.closest('.kard'):el.parentElement;
  if(card){
    const chev=card.querySelector('span.kard-chev');
    if(chev)chev.textContent=isOpen?'▾':'▴';
  }
}

function togSec(hdr){
  const isMob=document.documentElement.classList.contains('mob');
  if(!isMob)return;
  const bodyId=hdr.id.replace('-hdr','-body');
  const body=document.getElementById(bodyId);
  const isOpen=body.classList.contains('open');
  body.classList.toggle('open',!isOpen);
  hdr.classList.toggle('open',!isOpen);
}

// ══════════════════════════════════════════
//  CAMPOS NUEVA ENTRADA
// ══════════════════════════════════════════
function activarCampo(id){
  CAMPOS.forEach(f=>{
    const el=document.getElementById('cf-'+f);
    if(el)el.classList.remove('active');
  });
  const el=document.getElementById('cf-'+id);
  if(el){
    el.classList.add('active');
    setTimeout(()=>{
      const inp=el.querySelector('input:not([readonly])');
      if(inp&&inp.type!=='date')inp.focus();
    },50);
  }
}

function avanzarA(id){
  const idx=CAMPOS.indexOf(id);
  if(idx<CAMPOS.length-1)activarCampo(CAMPOS[idx+1]);
}

function marcarDone(id){
  const el=document.getElementById('cf-'+id);
  if(el) el.classList.add('done');
}

function setFieldVal(id,val,empty=false){
  const el=document.getElementById('cv-'+id);
  if(!el)return;
  el.textContent=val;
  el.classList.toggle('empty',empty);
}

function onFechaChange(){
  const v=document.getElementById('fecha').value;
  actualizarResumenFecha(v);marcarDone('fecha');
}
function actualizarResumenFecha(v){ /* fecha visible directo en input */ }
function onClaveChange(){
  const v=document.getElementById('clave').value.trim();
  setFieldVal('clave',v||'Opcional',!v);
}

// ══════════════════════════════════════════
//  CATÁLOGOS
// ══════════════════════════════════════════
function onCats(d){
  cats=d;
  buildOpts('sw-proyecto',d.proyectos,v=>{proxSel=v;setFieldVal('proyecto',v);marcarDone('proyecto');avanzarA('proyecto');});
  buildOpts('sw-contacto',d.contactos,v=>{contactoSel=v;setFieldVal('contacto',v);marcarDone('contacto');avanzarA('contacto');});
  buildOpts('sw-recurrencia',d.recurrencias,v=>{recSel=v;setFieldVal('recurrencia',v);marcarDone('recurrencia');avanzarA('recurrencia');});
  if(d.necesidades && d.necesidades.length){
    buildOptsNecesidad('sw-necesidad', d.necesidades, v=>{necesidadSel=v;setFieldVal('necesidad',v.slice(0,30)+'…');marcarDone('necesidad');avanzarA('necesidad');});
  }
  setChip('ok','Listo');
}

function buildOptsNecesidad(id,items,cb){
  const w=document.getElementById(id);if(!w)return;w.innerHTML='';
  const COLORES=['#3B82F6','#4ADE80','#F59E0B','#EC4899','#8B5CF6'];
  items.forEach((it,i)=>{
    const b=document.createElement('button');b.className='opt';
    const m = it.match(/^(\d+)\.\s+(\w+)/);
    b.textContent = m ? m[1]+'. '+m[2] : it.slice(0,20);
    b.title = it;
    b.style.borderColor = COLORES[i%5]+'44';
    b.onclick=e=>{e.stopPropagation();w.querySelectorAll('.opt').forEach(x=>x.classList.remove('on'));b.classList.add('on');cb(it);};
    w.appendChild(b);
  });
}

function buildOpts(id,items,cb){
  const w=document.getElementById(id);if(!w)return;w.innerHTML='';
  items.forEach(it=>{
    const b=document.createElement('button');b.className='opt';b.textContent=it;
    b.onclick=e=>{e.stopPropagation();w.querySelectorAll('.opt').forEach(x=>x.classList.remove('on'));b.classList.add('on');cb(it);};
    w.appendChild(b);
  });
}

// ══════════════════════════════════════════
//  POPUP CONCEPTO
// ══════════════════════════════════════════
function abrirConcepto(){
  activarCampo('concepto');
  renderConceptoPopup('');
  document.getElementById('popup-concepto').classList.add('show');
  setTimeout(()=>document.getElementById('pop-search').focus(),80);
}
function cerrarConcepto(e){
  if(e&&e.target!==document.getElementById('popup-concepto'))return;
  document.getElementById('popup-concepto').classList.remove('show');
  document.getElementById('pop-search').value='';
}
function filtrarConcepto(){renderConceptoPopup(document.getElementById('pop-search').value)}
function renderConceptoPopup(q){
  const items=(cats.conceptos||[]).filter(i=>!q||i.toLowerCase().includes(q.toLowerCase()))
    .sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'}));
  const body=document.getElementById('pop-body');
  if(!items.length){body.innerHTML='<div style="text-align:center;padding:24px;color:var(--m)">Sin resultados</div>';return;}
  const actual=document.getElementById('cv-concepto').classList.contains('empty')?'':document.getElementById('cv-concepto').textContent.trim();
  const grupos={};
  items.forEach(it=>{const l=it[0].toUpperCase().replace(/[^A-Z0-9]/,'#');if(!grupos[l])grupos[l]=[];grupos[l].push(it);});
  body.innerHTML=Object.keys(grupos).sort().map(l=>`
    <div class="pop-grupo-lbl">${l}</div>
    <div class="pop-items">${grupos[l].map(it=>`
      <div class="pop-item${it===actual?' on':''}" onclick="selConcepto('${it.replace(/'/g,"\\'")}')">${it}</div>
    `).join('')}</div>
  `).join('');
}
function selConcepto(val){
  setFieldVal('concepto',val);marcarDone('concepto');
  document.getElementById('popup-concepto').classList.remove('show');
  document.getElementById('pop-search').value='';
  avanzarA('concepto');
}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape')document.getElementById('popup-concepto').classList.remove('show');
});

// ══════════════════════════════════════════
//  MONTO
// ══════════════════════════════════════════
function setSign(s){
  sign=s;
  document.getElementById('sbp').className='msign'+(s===1?' pos':'');
  document.getElementById('sbn').className='msign'+(s===-1?' neg':'');
  upM();
}
function upM(){
  const v=(parseFloat(document.getElementById('monto').value)||0)*sign;
  const {txt,cls}=fmtMoneda(v||null);
  document.getElementById('mprev').textContent=v===0?'$ 0.00':txt;
  document.getElementById('mprev').className='mprev'+(v>0?' pos':v<0?' neg':'');
  setFieldVal('monto',v===0?'$ 0.00':txt,v===0);
  if(v!==0)marcarDone('monto');
}

// ══════════════════════════════════════════
//  SALDO
// ══════════════════════════════════════════
function consultarSaldo(){
  const f=document.getElementById('saldo-fecha').value;if(!f)return;
  const el=document.getElementById('saldo-val');el.className='saldo-val ld';el.textContent='…';
  const elMob=document.getElementById('saldo-val-mob');if(elMob){elMob.className='saldo-val ld';elMob.textContent='…';}
  api.getSaldoDia(f)
    .then(r=>{el.textContent=r.display;el.className='saldo-val '+(r.valor>0?'pos':r.valor<0?'neg':'');})
    .catch(()=>{el.className='saldo-val ld';el.textContent='—';});
}

// ══════════════════════════════════════════
//  GUARDAR
// ══════════════════════════════════════════
function guardar(){
  const fecha=document.getElementById('fecha').value;
  const concepto=document.getElementById('cv-concepto').classList.contains('empty')?'':document.getElementById('cv-concepto').textContent.trim();
  const monto=(parseFloat(document.getElementById('monto').value)||0)*sign;
  // En modo editar solo validar que haya ID cargado
  if(_modoEditar){
    if(!_filaEditar){ mostrarRes(false,'Busca un ID primero'); return; }
  } else {
    const errs=[];
    if(!fecha)errs.push('Fecha');
    if(!proxSel)errs.push('Proyecto');
    if(!contactoSel)errs.push('Contacto');
    if(!concepto)errs.push('Concepto');
    if(monto===0)errs.push('Monto');
    if(!recSel)errs.push('Recurrencia');
    if(errs.length){
      mostrarRes(false,'Faltan: '+errs.join(', '));
      errs.forEach(e=>{
        const m={Fecha:'fecha',Proyecto:'proyecto',Contacto:'contacto',Concepto:'concepto',Monto:'monto',Recurrencia:'recurrencia'};
        const el=document.getElementById('cf-'+m[e]);
        if(el){el.style.outline='1px solid var(--err)';setTimeout(()=>el.style.outline='',2000);}
      });
      return;
    }
  }
  ocultarRes();progStart();setBtn(true);
  const claveVal = document.getElementById('clave').value.trim();
  const payload  = {fecha,proyecto:proxSel,contacto:contactoSel,concepto,monto,recurrencia:recSel,necesidad:necesidadSel,clave:claveVal};
  const promesa  = _modoEditar && _filaEditar
    ? api.editarFilaRAW(_filaEditar, payload)
    : api.insertarEnRAW(payload);
  promesa.then(r=>{
      progDone();setBtn(false);
      mostrarRes(r.ok,r.mensaje);
      showToast(r.ok?'✓ Guardado':'Error al guardar',r.ok);
      if(r.ok){
        limpiar(false);consultarSaldo();
        api.getFijos().then(renderEntes);
        api.getGastos().then(renderAnualidad);
        api.getDatosMes().then(onDatosMes);
      }
    })
    .catch(e=>{progDone();setBtn(false);mostrarRes(false,'Error: '+e.message);showToast('Error',false);});
}

function setBtn(l){
  const b=document.getElementById('btnG');if(b)b.disabled=l;
  const sp=document.getElementById('spin');if(sp)sp.style.display=l?'block':'none';
  const bi=document.getElementById('bico');if(bi)bi.style.display=l?'none':'inline';
}
function mostrarRes(ok,msg){
  const el=document.getElementById('save-res');
  document.getElementById('res-ico').textContent=ok?'✓':'✗';
  document.getElementById('res-msg').textContent=msg;
  el.className='save-res '+(ok?'ok':'err');
}
function ocultarRes(){document.getElementById('save-res').className='save-res';}

function limpiar(rf=true){
  if(rf){const fEl=document.getElementById('fecha');if(fEl)fEl.value=fmtD(new Date());}
  actualizarResumenFecha(rf?fmtD(new Date()):'');
  ['proyecto','contacto','recurrencia'].forEach(k=>{
    document.querySelectorAll(`#sw-${k} .opt`).forEach(b=>b.classList.remove('on'));
    setFieldVal(k,'',true);
  });
  proxSel='';contactoSel='';recSel='';necesidadSel='';
  document.querySelectorAll('#sw-necesidad .opt').forEach(b=>b.classList.remove('on'));
  setFieldVal('necesidad','',true);
  document.getElementById('monto').value='';
  document.getElementById('clave').value='';
  setFieldVal('concepto','',true);
  setFieldVal('monto','$ 0.00',true);
  setFieldVal('clave','',true);
  CAMPOS.forEach(f=>{const e=document.getElementById('cf-'+f);if(e)e.classList.remove('done');});
  setSign(1);upM();ocultarRes();activarCampo('fecha');
}
function irASheet(){
  var url = sheetUrl || 'https://docs.google.com/spreadsheets/d/15T14Hb7tvmv24ZAaC3su1NRtDwVS6-dWbJGxQYUGP1o/edit';
  window.open(url,'_blank');
}

// ══════════════════════════════════════════
//  SHEETS EMBED — config de hojas
// ══════════════════════════════════════════
const SHEETS_CONFIG = [
  {
    id:    'raw',
    label: 'RAW',
    emoji: '📄',
    gid:   '0',   // gid de la pestaña RAW en tu Sheets
    spreadsheetId: '15T14Hb7tvmv24ZAaC3su1NRtDwVS6-dWbJGxQYUGP1o',
  },
  // Para agregar más hojas en el futuro:
  // { id:'pagos', label:'Pagos', emoji:'💳', gid:'123456789', spreadsheetId:'...' },
];

function _sheetEmbedUrl(cfg){
  return `https://docs.google.com/spreadsheets/d/${cfg.spreadsheetId}/edit?usp=sharing&rm=minimal#gid=${cfg.gid}`;
}

function irASheets(sheetId){
  sheetId = sheetId || 'raw';
  if(_pantalla === 'sheets_'+sheetId){ volverAlAnverso(); return; }
  _setPantalla('sheets_'+sheetId);
  const cfg = SHEETS_CONFIG.find(s=>s.id===sheetId);
  if(!cfg) return;
  // Render iframe
  const cont = document.getElementById('sheets-iframe-cont');
  if(cont){
    // Google Sheets embed URL
    var embedUrl = 'https://docs.google.com/spreadsheets/d/' + cfg.spreadsheetId + '/htmlview?gid=' + cfg.gid + '&widget=true';
    cont.innerHTML = '<iframe src="' + embedUrl + '" style="width:100%;height:100%;border:none;display:block" allowfullscreen scrolling="yes"></iframe>';
  }
  // Update header label
  const lbl = document.getElementById('sheets-panel-label');
  if(lbl) lbl.textContent = cfg.emoji + ' ' + cfg.label;
  // Update open-in-sheets link
  const btn = document.getElementById('sheets-open-btn');
  if(btn) btn.href = `https://docs.google.com/spreadsheets/d/${cfg.spreadsheetId}/edit#gid=${cfg.gid}`;
}


// ══════════════════════════════════════════
//  MODO NUEVA / EDITAR
// ══════════════════════════════════════════
function _inyectarToggleModo(){
  if(document.getElementById('toggle-modo-wrap')) return;
  const wrap = document.createElement('div');
  wrap.id = 'toggle-modo-wrap';
  wrap.style.cssText = 'display:flex;align-items:center;gap:0;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:999px;padding:3px;margin:0 0 10px;flex-wrap:wrap;';
  wrap.innerHTML = `
    <button id="btn-tab-nueva"       onclick="setModoEntrada('nueva')"       class="tab-entrada on">+ Nueva</button>
    <button id="btn-tab-editar"      onclick="setModoEntrada('editar')"      class="tab-entrada">✏ Editar</button>
    <button id="btn-tab-pensamiento" onclick="setModoEntrada('pensamiento')" class="tab-entrada">💭</button>
    <button id="btn-tab-persona"     onclick="setModoEntrada('persona')"     class="tab-entrada">👥</button>
    <button id="btn-tab-salud"       onclick="setModoEntrada('salud')"       class="tab-entrada">🏥</button>
    <button id="btn-tab-apartado"    onclick="setModoEntrada('apartado')"    class="tab-entrada">💰</button>
    <button id="btn-tab-patrimonio"  onclick="setModoEntrada('patrimonio')"  class="tab-entrada">🏦</button>
    <button id="btn-tab-nutricion"   onclick="setModoEntrada('nutricion')"   class="tab-entrada">🥗</button>
    <button id="btn-tab-entrenamiento" onclick="setModoEntrada('entrenamiento')" class="tab-entrada">💪</button>`;
  const body = document.getElementById('sec-entrada-body') || document.getElementById('entrada-paso2') || document.getElementById('wrap-entrada');
  if(body) body.insertBefore(wrap, body.firstChild);

  // ID input (hidden by default)
  const idWrap = document.createElement('div');
  idWrap.id = 'editar-id-wrap';
  idWrap.style.cssText = 'display:none;padding:12px var(--pad) 0;';
  idWrap.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px">
      <input type="number" id="editar-id-input" class="finput" placeholder="ID de la fila (ej. 100000012)"
        style="font-size:14px;padding:10px 14px;letter-spacing:0"
        onkeydown="if(event.key==='Enter') buscarFilaId()">
      <button onclick="buscarFilaId()" class="btn-save"
        style="flex-shrink:0;padding:10px 18px;font-size:13px;border-radius:999px;min-width:80px">
        <span id="buscar-spin" class="spin-sm" style="display:none"></span>
        Buscar
      </button>
    </div>
    <div id="editar-id-msg" style="font-size:11px;margin-top:6px;color:var(--m)"></div>`;
  if(body) body.insertBefore(idWrap, wrap.nextSibling);

  // Wraps para tabs alternativos
  ['pensamiento','persona','salud','apartado','patrimonio','nutricion','entrenamiento'].forEach(tab=>{
    const tw = document.createElement('div');
    tw.id = tab+'-wrap';
    tw.style.display = 'none';
    if(body) body.insertBefore(tw, idWrap.nextSibling);
  });
}

function volverAPaso1(){
  const paso1 = document.getElementById('entrada-paso1');
  const paso2 = document.getElementById('entrada-paso2');
  if(paso1) paso1.style.display = 'block';
  if(paso2) paso2.style.display = 'none';
}

function setModoEntrada(modo){
  _tabEntrada  = modo;
  _modoEditar  = (modo === 'editar');

  // Cambiar de paso1 a paso2
  const paso1 = document.getElementById('entrada-paso1');
  const paso2 = document.getElementById('entrada-paso2');
  if(paso1) paso1.style.display = 'none';
  if(paso2) paso2.style.display = 'block';

  // Título del paso2
  const titulos = {nueva:'💸 RAW',editar:'✏️ Editar',pensamiento:'💭 Pensamiento',persona:'👥 Persona',salud:'🏥 Salud',apartado:'💰 Apartado',patrimonio:'🏦 Patrimonio',bancos:'🏛️ Bancos',nutricion:'🥗 Nutrición',entrenamiento:'💪 Entrenamiento'};
  const tituloEl = document.getElementById('entrada-paso2-titulo');
  if(tituloEl) tituloEl.textContent = titulos[modo] || modo;

  // Actualizar tabs
  ['nueva','editar','pensamiento','persona','salud','apartado','patrimonio','bancos','nutricion','entrenamiento'].forEach(t=>{
    const btn = document.getElementById('btn-tab-'+t);
    if(btn) btn.classList.toggle('on', t===modo);
  });

  // Ocultar todos los wraps especiales
  const wraps = ['editar-id-wrap','pensamiento-wrap','persona-wrap','salud-wrap','apartado-wrap'];
  wraps.forEach(id=>{ const el=document.getElementById(id); if(el) el.style.display='none'; });

  // Mostrar/ocultar campos base según tab
  const camposBase = document.getElementById('sec-entrada-body');
  const formActions = document.querySelector('.form-actions');

  if(modo==='nueva'){
    _mostrarCamposBase(true);
    if(formActions) formActions.style.display='flex';
    const btnG = document.getElementById('btnG');
    if(btnG) btnG.innerHTML='<div class="spin-sm" id="spin"></div><i class="fas fa-floppy-disk" id="bico"></i> Guardar';
    _filaEditar=null; _idEditar=null;
    limpiar(true);
  } else if(modo==='editar'){
    _mostrarCamposBase(true);
    if(formActions) formActions.style.display='flex';
    const idWrap=document.getElementById('editar-id-wrap');
    if(idWrap) idWrap.style.display='block';
    const btnG = document.getElementById('btnG');
    if(btnG) btnG.innerHTML='<div class="spin-sm" id="spin"></div><i class="fas fa-pen" id="bico"></i> Actualizar';
    limpiar(false);
  } else {
    // Tabs de módulos alternativos — ocultar campos base del formulario financiero
    _mostrarCamposBase(false);
    if(formActions) formActions.style.display='none';
    const wrap = document.getElementById(modo+'-wrap');
    if(wrap) wrap.style.display='block';
    _renderTabEntrada(modo);
  }
}

function _mostrarCamposBase(visible){
  const campos = ['cf-fecha','cf-proyecto','cf-contacto','cf-concepto','cf-monto','cf-recurrencia','cf-necesidad','cf-clave'];
  campos.forEach(id=>{ const el=document.getElementById(id); if(el) el.style.display=visible?'':'none'; });
  const saveRes = document.getElementById('save-res');
  if(saveRes && !visible) saveRes.className='save-res';
}

function _renderTabEntrada(tab){
  const wrap = document.getElementById(tab+'-wrap');
  if(!wrap) return;
  if(tab==='pensamiento') _renderPensamientoForm(wrap);
  else if(tab==='persona') _renderPersonaForm(wrap);
  else if(tab==='salud')   _renderSaludForm(wrap);
  else if(tab==='apartado') _renderApartadoForm(wrap);
  else if(tab==='patrimonio')    _renderPatrimonioForm(wrap);
  else if(tab==='bancos')        _renderBancosForm(wrap);
  else if(tab==='nutricion')     _renderNutricionForm(wrap);
  else if(tab==='entrenamiento') _renderEntrenamientoForm(wrap);
}

// ── Formulario Bancos ──
function _renderBancosForm(wrap){
  wrap.innerHTML=`
    <div style="padding:16px var(--pad);display:flex;flex-direction:column;gap:12px">
      <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">Registrar en Bancos</div>
      <input type="text" id="banco-nombre" class="finput" placeholder="Nombre del banco (BBVA, BEATS…)" style="font-size:14px;padding:10px 14px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <div style="font-size:10px;color:var(--m);margin-bottom:4px">Monto</div>
          <input type="number" id="banco-monto" class="finput" placeholder="0.00" step="0.01" inputmode="decimal" style="font-size:16px;padding:10px 12px">
        </div>
        <div>
          <div style="font-size:10px;color:var(--m);margin-bottom:4px">Fecha</div>
          <input type="date" id="banco-fecha" class="finput" style="font-size:13px;padding:9px 12px">
        </div>
      </div>
      <button onclick="_guardarBancosForm()" class="btn-save" style="border-radius:var(--rad-pill)">
        <i class="fas fa-floppy-disk"></i> Guardar en Bancos
      </button>
      <div id="banco-res" style="font-size:12px;text-align:center;color:var(--m)"></div>
    </div>`;
  const fechaEl = document.getElementById('banco-fecha');
  if(fechaEl) fechaEl.value = fmtD(new Date());
}

function _guardarBancosForm(){
  const nombre = document.getElementById('banco-nombre').value.trim();
  const monto  = parseFloat(document.getElementById('banco-monto').value);
  const fecha  = document.getElementById('banco-fecha').value;
  const res    = document.getElementById('banco-res');
  if(!nombre || isNaN(monto) || !fecha){
    res.textContent='Completa todos los campos'; res.style.color='var(--err)'; return;
  }
  res.textContent='Guardando…'; res.style.color='var(--m)';
  api.guardarEnBancos(nombre, monto, fecha)
    .then(r=>{
      res.textContent = r.ok ? '✓ Guardado' : '✗ '+(r.mensaje||'Error');
      res.style.color = r.ok ? 'var(--ok)' : 'var(--err)';
      if(r.ok){
        document.getElementById('banco-nombre').value='';
        document.getElementById('banco-monto').value='';
        document.getElementById('banco-fecha').value = fmtD(new Date());
        api.getFijos().then(renderEntes);
        showToast('✓ Banco guardado');
      }
    }).catch(()=>{ res.textContent='Error'; res.style.color='var(--err)'; });
}

// ── Formulario Patrimonio ──
function _renderPatrimonioForm(wrap){
  wrap.innerHTML=`
    <div style="padding:16px var(--pad);display:flex;flex-direction:column;gap:12px">
      <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">Registrar movimiento</div>
      <div>
        <div style="font-size:10px;color:var(--m);margin-bottom:6px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Tipo</div>
        <div class="opts" id="pat-tipo-opts">
          <button class="opt" onclick="event.stopPropagation();_selOpt(this,'pat-tipo-opts');document.getElementById('pat-tipo').value='ahorro';_onPatTipoChange()">💳 Banco</button>
          <button class="opt" onclick="event.stopPropagation();_selOpt(this,'pat-tipo-opts');document.getElementById('pat-tipo').value='efectivo';_onPatTipoChange()">💵 Efectivo</button>
          <button class="opt" onclick="event.stopPropagation();_selOpt(this,'pat-tipo-opts');document.getElementById('pat-tipo').value='inversion';_onPatTipoChange()">📈 Inversión</button>
        </div>
        <input type="hidden" id="pat-tipo" value="">
      </div>
      <input type="text" id="pat-concepto" class="finput" placeholder="Concepto (ej. Ahorro Mayo)" style="font-size:14px;padding:10px 14px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <div style="font-size:10px;color:var(--m);margin-bottom:4px">Monto (+depósito / -retiro)</div>
          <input type="number" id="pat-monto" class="finput" placeholder="0.00" step="0.01" inputmode="decimal" style="font-size:16px;padding:10px 12px">
        </div>
        <div>
          <div style="font-size:10px;color:var(--m);margin-bottom:4px">Fecha</div>
          <input type="date" id="pat-fecha" class="finput" style="font-size:13px;padding:9px 12px">
        </div>
      </div>
      <div id="pat-extra" style="display:flex;flex-direction:column;gap:8px"></div>
      <button onclick="_guardarPatrimonio()" class="btn-save" style="border-radius:var(--rad-pill)">
        <i class="fas fa-floppy-disk"></i> Guardar
      </button>
      <div id="pat-res" style="font-size:12px;text-align:center;color:var(--m)"></div>
    </div>`;
  document.getElementById('pat-fecha').value = fmtD(new Date());
}

function _onPatTipoChange(){
  const tipo  = document.getElementById('pat-tipo').value;
  const extra = document.getElementById('pat-extra');
  if(!extra) return;
  if(tipo==='ahorro'){
    extra.innerHTML=`<input type="text" id="pat-banco" class="finput" placeholder="Banco (BBVA, BEATS…)" style="font-size:13px;padding:9px 12px">
      <div class="opts" id="pat-mov-opts">
        <button class="opt" onclick="event.stopPropagation();_selOpt(this,'pat-mov-opts');document.getElementById('pat-movtipo').value='Depósito'">Depósito</button>
        <button class="opt" onclick="event.stopPropagation();_selOpt(this,'pat-mov-opts');document.getElementById('pat-movtipo').value='Retiro'">Retiro</button>
      </div>
      <input type="hidden" id="pat-movtipo" value="Depósito">`;
  } else if(tipo==='inversion'){
    extra.innerHTML=`<input type="text" id="pat-instrumento" class="finput" placeholder="Instrumento (CETES, GBM…)" style="font-size:13px;padding:9px 12px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <input type="text" id="pat-plazo" class="finput" placeholder="Plazo (28d, 90d)" style="font-size:13px;padding:9px 12px">
        <input type="number" id="pat-rendimiento" class="finput" placeholder="Rendimiento $" step="0.01" style="font-size:13px;padding:9px 12px">
      </div>`;
  } else {
    extra.innerHTML='';
  }
}

function _guardarPatrimonio(){
  const tipo     = document.getElementById('pat-tipo').value;
  const concepto = document.getElementById('pat-concepto').value.trim();
  const monto    = parseFloat(document.getElementById('pat-monto').value);
  const fecha    = document.getElementById('pat-fecha').value;
  const res      = document.getElementById('pat-res');
  if(!tipo){ res.textContent='Selecciona un tipo'; res.style.color='var(--err)'; return; }
  if(!concepto||isNaN(monto)){ res.textContent='Concepto y monto requeridos'; res.style.color='var(--err)'; return; }
  res.textContent='Guardando…'; res.style.color='var(--m)';

  let datos = { concepto, monto, fecha };
  let promise;
  if(tipo==='ahorro'){
    datos.banco   = document.getElementById('pat-banco')?.value.trim()||'';
    datos.tipo    = document.getElementById('pat-movtipo')?.value||'Depósito';
    promise = api.guardarAhorro(datos);
  } else if(tipo==='efectivo'){
    promise = api.guardarEfectivo(datos);
  } else {
    datos.instrumento  = document.getElementById('pat-instrumento')?.value.trim()||'CETES';
    datos.plazo        = document.getElementById('pat-plazo')?.value.trim()||'';
    datos.rendimiento  = parseFloat(document.getElementById('pat-rendimiento')?.value)||0;
    promise = api.guardarInversion(datos);
  }

  promise.then(r=>{
    res.textContent = r.ok ? '✓ Guardado — Saldo: $'+r.saldo.toLocaleString('es-MX') : '✗ '+r.mensaje;
    res.style.color = r.ok ? 'var(--ok)' : 'var(--err)';
    if(r.ok){
      document.getElementById('pat-concepto').value='';
      document.getElementById('pat-monto').value='';
      api.getPatrimonio()
        .then(renderPatrimonio)
        .catch(()=>renderPatrimonio({ok:true,total:0,
          banco:{saldo:0,pct:0,items:[]},
          fisico:{saldo:0,pct:0,items:[]},
          inversion:{saldo:0,pct:0,rendimientoTotal:0,items:[]},
          fondo:{meta:0,avance:0,meses:0,salud:'err'}}));
    }
  }).catch(()=>{ res.textContent='Error'; res.style.color='var(--err)'; });
}


// ── Formulario Nutrición ──
function _renderNutricionForm(wrap){
  wrap.innerHTML=`
    <div style="padding:16px var(--pad);display:flex;flex-direction:column;gap:10px">
      <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">Registrar comida / día</div>
      <input type="text" id="nut-comida" class="finput" placeholder="Ej. Desayuno: huevos + aguacate" style="font-size:14px;padding:10px 14px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <div style="font-size:10px;color:var(--m);margin-bottom:4px">Calorías (kcal)</div>
          <input type="number" id="nut-cal" class="finput" placeholder="0" style="font-size:16px;padding:10px 12px">
        </div>
        <div>
          <div style="font-size:10px;color:var(--m);margin-bottom:4px">Proteína (g)</div>
          <input type="number" id="nut-prot" class="finput" placeholder="0" style="font-size:16px;padding:10px 12px">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
        <div>
          <div style="font-size:10px;color:var(--m);margin-bottom:4px">Carbos (g)</div>
          <input type="number" id="nut-carbos" class="finput" placeholder="0" style="padding:9px 10px;font-size:13px">
        </div>
        <div>
          <div style="font-size:10px;color:var(--m);margin-bottom:4px">Grasa (g)</div>
          <input type="number" id="nut-grasa" class="finput" placeholder="0" style="padding:9px 10px;font-size:13px">
        </div>
        <div>
          <div style="font-size:10px;color:var(--m);margin-bottom:4px">Agua (L)</div>
          <input type="number" id="nut-agua" class="finput" placeholder="0.0" step="0.1" style="padding:9px 10px;font-size:13px">
        </div>
      </div>
      <div>
        <div style="font-size:10px;color:var(--m);margin-bottom:4px">Fasting (horas de ayuno hoy)</div>
        <div class="opts" id="nut-fast-opts">
          ${[0,12,14,16,18,20].map(h=>`<button class="opt" onclick="event.stopPropagation();_selOpt(this,'nut-fast-opts');document.getElementById('nut-fast').value=${h}">${h?h+'h':'Sin ayuno'}</button>`).join('')}
        </div>
        <input type="hidden" id="nut-fast" value="0">
      </div>
      <input type="text" id="nut-notas" class="finput" placeholder="Notas opcionales" style="font-size:13px;padding:9px 12px">
      <button onclick="_guardarNutricion()" class="btn-save" style="border-radius:var(--rad-pill)">
        <i class="fas fa-floppy-disk"></i> Guardar
      </button>
      <div id="nut-res" style="font-size:12px;text-align:center;color:var(--m)"></div>
    </div>`;
}

// ── Formulario Entrenamiento ──
function _renderEntrenamientoForm(wrap){
  wrap.innerHTML=`
    <div style="padding:16px var(--pad);display:flex;flex-direction:column;gap:10px">
      <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">Registrar sesión</div>
      <div>
        <div style="font-size:10px;color:var(--m);margin-bottom:6px">Tipo</div>
        <div class="opts" id="ent-tipo-opts">
          ${['Fuerza','Cardio','HIIT','Flexibilidad','Deporte'].map(t=>
            `<button class="opt" onclick="event.stopPropagation();_selOpt(this,'ent-tipo-opts');document.getElementById('ent-tipo').value='${t}'">${t}</button>`
          ).join('')}
        </div>
        <input type="hidden" id="ent-tipo" value="">
      </div>
      <input type="text" id="ent-ejercicio" class="finput" placeholder="Ejercicio (ej. Press banca, Caminata, Yoga)" style="font-size:14px;padding:10px 14px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <div style="font-size:10px;color:var(--m);margin-bottom:4px">Duración (min)</div>
          <input type="number" id="ent-dur" class="finput" placeholder="0" style="font-size:16px;padding:10px 12px">
        </div>
        <div>
          <div style="font-size:10px;color:var(--m);margin-bottom:4px">Distancia (km)</div>
          <input type="number" id="ent-dist" class="finput" placeholder="0.0" step="0.1" style="font-size:16px;padding:10px 12px">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
        <div>
          <div style="font-size:10px;color:var(--m);margin-bottom:4px">Series</div>
          <input type="number" id="ent-series" class="finput" placeholder="0" style="padding:9px 10px;font-size:13px">
        </div>
        <div>
          <div style="font-size:10px;color:var(--m);margin-bottom:4px">Reps</div>
          <input type="number" id="ent-reps" class="finput" placeholder="0" style="padding:9px 10px;font-size:13px">
        </div>
        <div>
          <div style="font-size:10px;color:var(--m);margin-bottom:4px">Peso (kg)</div>
          <input type="number" id="ent-peso" class="finput" placeholder="0" step="0.5" style="padding:9px 10px;font-size:13px">
        </div>
      </div>
      <input type="text" id="ent-notas" class="finput" placeholder="Notas" style="font-size:13px;padding:9px 12px">
      <button onclick="_guardarEntrenamiento()" class="btn-save" style="border-radius:var(--rad-pill)">
        <i class="fas fa-floppy-disk"></i> Guardar sesión
      </button>
      <div id="ent-res" style="font-size:12px;text-align:center;color:var(--m)"></div>
    </div>`;
}

// ── Formulario Pensamiento ──
function _renderPensamientoForm(wrap){
  wrap.innerHTML=`
    <div style="padding:16px var(--pad);display:flex;flex-direction:column;gap:12px">
      <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">¿En qué estás pensando?</div>
      <textarea id="p-texto" class="finput" rows="4" placeholder="Escribe aquí tu pensamiento, idea o reflexión…"
        style="resize:none;line-height:1.5;font-size:14px"></textarea>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <div style="font-size:10px;color:var(--m);margin-bottom:4px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Categoría</div>
          <div class="opts" id="p-cat-opts">
            ${['Emoción','Idea','Reflexión','Decisión','Sueño'].map(c=>
              `<button class="opt" onclick="event.stopPropagation();_selOpt(this,'p-cat-opts');document.getElementById('p-cat').value='${c}'">${c}</button>`
            ).join('')}
          </div>
          <input type="hidden" id="p-cat" value="">
        </div>
        <div>
          <div style="font-size:10px;color:var(--m);margin-bottom:4px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Energía</div>
          <div class="opts" id="p-energia-opts">
            ${[1,2,3,4,5].map(n=>
              `<button class="opt" onclick="event.stopPropagation();_selOpt(this,'p-energia-opts');document.getElementById('p-energia').value=${n}" style="padding:8px 10px">${n}</button>`
            ).join('')}
          </div>
          <input type="hidden" id="p-energia" value="">
        </div>
      </div>
      <input type="text" id="p-etiquetas" class="finput" placeholder="Etiquetas (trabajo, familia, dinero…)" style="font-size:13px;padding:9px 12px">
      <button onclick="_guardarPensamiento()" class="btn-save" style="border-radius:var(--rad-pill)">
        <i class="fas fa-floppy-disk"></i> Guardar pensamiento
      </button>
      <div id="p-res" style="font-size:12px;text-align:center;color:var(--m)"></div>
    </div>`;
}

function _guardarPensamiento(){
  const texto     = document.getElementById('p-texto').value.trim();
  const categoria = document.getElementById('p-cat').value;
  const energia   = document.getElementById('p-energia').value;
  const etiquetas = document.getElementById('p-etiquetas').value.trim();
  const res       = document.getElementById('p-res');
  if(!texto){ res.textContent='Escribe algo primero'; res.style.color='var(--err)'; return; }
  res.textContent='Guardando…'; res.style.color='var(--m)';
  api.guardarPensamiento({ texto, categoria, energia: energia||null, etiquetas, fecha: fmtD(new Date()) })
    .then(r=>{
      res.textContent = r.ok ? '✓ Guardado' : '✗ '+r.mensaje;
      res.style.color = r.ok ? 'var(--ok)' : 'var(--err)';
      if(r.ok){ document.getElementById('p-texto').value=''; document.getElementById('p-etiquetas').value='';
        document.querySelectorAll('#p-cat-opts .opt,#p-energia-opts .opt').forEach(b=>b.classList.remove('on'));
        document.getElementById('p-cat').value=''; document.getElementById('p-energia').value=''; }
    }).catch(()=>{ res.textContent='Error'; res.style.color='var(--err)'; });
}

// ── Formulario Persona ──
function _renderPersonaForm(wrap){
  wrap.innerHTML=`
    <div style="padding:16px var(--pad);display:flex;flex-direction:column;gap:12px">
      <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">¿Con quién interactuaste?</div>
      <input type="text" id="per-nombre" class="finput" placeholder="Nombre" style="font-size:14px;padding:10px 14px">
      <div>
        <div style="font-size:10px;color:var(--m);margin-bottom:6px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Tipo</div>
        <div class="opts" id="per-tipo-opts">
          ${['Familia','Amigo','Pareja','Trabajo','Médico','Otro'].map(t=>
            `<button class="opt" onclick="event.stopPropagation();_selOpt(this,'per-tipo-opts');document.getElementById('per-tipo').value='${t}'">${t}</button>`
          ).join('')}
        </div>
        <input type="hidden" id="per-tipo" value="">
      </div>
      <div>
        <div style="font-size:10px;color:var(--m);margin-bottom:6px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Energía que te da</div>
        <div class="opts" id="per-energia-opts">
          <button class="opt" onclick="event.stopPropagation();_selOpt(this,'per-energia-opts');document.getElementById('per-energia').value=1" style="color:var(--ok)">+ Positiva</button>
          <button class="opt" onclick="event.stopPropagation();_selOpt(this,'per-energia-opts');document.getElementById('per-energia').value=0">Neutral</button>
          <button class="opt" onclick="event.stopPropagation();_selOpt(this,'per-energia-opts');document.getElementById('per-energia').value=-1" style="color:var(--err)">− Negativa</button>
        </div>
        <input type="hidden" id="per-energia" value="">
      </div>
      <textarea id="per-notas" class="finput" rows="2" placeholder="Notas de la interacción…" style="resize:none;font-size:13px"></textarea>
      <button onclick="_guardarPersona()" class="btn-save" style="border-radius:var(--rad-pill)">
        <i class="fas fa-floppy-disk"></i> Registrar interacción
      </button>
      <div id="per-res" style="font-size:12px;text-align:center;color:var(--m)"></div>
    </div>`;
}

function _guardarPersona(){
  const nombre  = document.getElementById('per-nombre').value.trim();
  const tipo    = document.getElementById('per-tipo').value;
  const energia = document.getElementById('per-energia').value;
  const notas   = document.getElementById('per-notas').value.trim();
  const res     = document.getElementById('per-res');
  if(!nombre){ res.textContent='Escribe un nombre'; res.style.color='var(--err)'; return; }
  res.textContent='Guardando…'; res.style.color='var(--m)';
  api.guardarInteraccion({ nombre, tipo, energia: energia!==''?Number(energia):0, notas })
    .then(r=>{
      res.textContent = r.ok ? '✓ '+r.mensaje : '✗ '+r.mensaje;
      res.style.color = r.ok ? 'var(--ok)' : 'var(--err)';
      if(r.ok){ document.getElementById('per-nombre').value=''; document.getElementById('per-notas').value='';
        document.querySelectorAll('#per-tipo-opts .opt,#per-energia-opts .opt').forEach(b=>b.classList.remove('on'));
        document.getElementById('per-tipo').value=''; document.getElementById('per-energia').value=''; }
    }).catch(()=>{ res.textContent='Error'; res.style.color='var(--err)'; });
}

// ── Formulario Salud ──
function _renderSaludForm(wrap){
  wrap.innerHTML=`
    <div style="padding:16px var(--pad);display:flex;flex-direction:column;gap:12px">
      <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">Registro de salud</div>
      <div>
        <div style="font-size:10px;color:var(--m);margin-bottom:6px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Tipo</div>
        <div class="opts" id="sal-tipo-opts">
          ${['Cita','Síntoma','Medicamento','Resultado','Vacuna','Check-in'].map(t=>
            `<button class="opt" onclick="event.stopPropagation();_selOpt(this,'sal-tipo-opts');document.getElementById('sal-tipo').value='${t}'">${t}</button>`
          ).join('')}
        </div>
        <input type="hidden" id="sal-tipo" value="">
      </div>
      <input type="text" id="sal-desc" class="finput" placeholder="Descripción" style="font-size:14px;padding:10px 14px">
      <input type="text" id="sal-doctor" class="finput" placeholder="Doctor (opcional)" style="font-size:13px;padding:9px 12px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <div style="font-size:10px;color:var(--m);margin-bottom:4px">Fecha</div>
          <input type="date" id="sal-fecha" class="finput" style="font-size:13px;padding:9px 12px">
        </div>
        <div>
          <div style="font-size:10px;color:var(--m);margin-bottom:4px">Próxima cita</div>
          <input type="date" id="sal-proxima" class="finput" style="font-size:13px;padding:9px 12px">
        </div>
      </div>
      <textarea id="sal-notas" class="finput" rows="2" placeholder="Notas…" style="resize:none;font-size:13px"></textarea>
      <button onclick="_guardarSalud()" class="btn-save" style="border-radius:var(--rad-pill)">
        <i class="fas fa-floppy-disk"></i> Guardar registro
      </button>
      <div id="sal-res" style="font-size:12px;text-align:center;color:var(--m)"></div>
    </div>`;
  document.getElementById('sal-fecha').value = fmtD(new Date());
}

function _guardarSalud(){
  const tipo   = document.getElementById('sal-tipo').value;
  const desc   = document.getElementById('sal-desc').value.trim();
  const doctor = document.getElementById('sal-doctor').value.trim();
  const fecha  = document.getElementById('sal-fecha').value;
  const prox   = document.getElementById('sal-proxima').value;
  const notas  = document.getElementById('sal-notas').value.trim();
  const res    = document.getElementById('sal-res');
  if(!desc){ res.textContent='Agrega una descripción'; res.style.color='var(--err)'; return; }
  res.textContent='Guardando…'; res.style.color='var(--m)';
  api.guardarSalud({ tipo, descripcion:desc, doctor, fecha, proxima:prox||null, notas, estado:'Pendiente' })
    .then(r=>{
      res.textContent = r.ok ? '✓ Guardado' : '✗ '+r.mensaje;
      res.style.color = r.ok ? 'var(--ok)' : 'var(--err)';
      if(r.ok){ document.getElementById('sal-desc').value=''; document.getElementById('sal-doctor').value='';
        document.getElementById('sal-proxima').value=''; document.getElementById('sal-notas').value='';
        document.querySelectorAll('#sal-tipo-opts .opt').forEach(b=>b.classList.remove('on'));
        document.getElementById('sal-tipo').value=''; }
    }).catch(()=>{ res.textContent='Error'; res.style.color='var(--err)'; });
}

// ── Formulario Apartado ──
function _renderApartadoForm(wrap){
  wrap.innerHTML=`
    <div style="padding:16px var(--pad);display:flex;flex-direction:column;gap:12px">
      <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">Nuevo apartado</div>
      <input type="text" id="ap-nombre" class="finput" placeholder="Nombre del apartado (ej. Renta Mayo)" style="font-size:14px;padding:10px 14px">
      <input type="text" id="ap-categoria" class="finput" placeholder="Categoría (Renta, Viaje, Emergencia…)" style="font-size:13px;padding:9px 12px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <div style="font-size:10px;color:var(--m);margin-bottom:4px">Monto</div>
          <input type="number" id="ap-monto" class="finput" placeholder="0.00" step="0.01" inputmode="decimal" style="font-size:16px;padding:10px 12px">
        </div>
        <div>
          <div style="font-size:10px;color:var(--m);margin-bottom:4px">Banco</div>
          <input type="text" id="ap-banco" class="finput" placeholder="BBVA, BEATS…" style="font-size:13px;padding:9px 12px">
        </div>
      </div>
      <div>
        <div style="font-size:10px;color:var(--m);margin-bottom:4px">Fecha meta (para cuándo)</div>
        <input type="date" id="ap-meta" class="finput" style="font-size:13px;padding:9px 12px">
      </div>
      <textarea id="ap-notas" class="finput" rows="2" placeholder="Notas…" style="resize:none;font-size:13px"></textarea>
      <button onclick="_guardarApartado()" class="btn-save" style="border-radius:var(--rad-pill)">
        <i class="fas fa-floppy-disk"></i> Guardar apartado
      </button>
      <div id="ap-res" style="font-size:12px;text-align:center;color:var(--m)"></div>
    </div>`;
}

function _guardarApartado(){
  const nombre    = document.getElementById('ap-nombre').value.trim();
  const categoria = document.getElementById('ap-categoria').value.trim();
  const monto     = parseFloat(document.getElementById('ap-monto').value);
  const banco     = document.getElementById('ap-banco').value.trim();
  const meta      = document.getElementById('ap-meta').value;
  const notas     = document.getElementById('ap-notas').value.trim();
  const res       = document.getElementById('ap-res');
  if(!nombre||isNaN(monto)){ res.textContent='Nombre y monto requeridos'; res.style.color='var(--err)'; return; }
  res.textContent='Guardando…'; res.style.color='var(--m)';
  api.guardarApartado({ nombre, categoria, monto, banco, meta:meta||null, notas, estado:'Activo' })
    .then(r=>{
      res.textContent = r.ok ? '✓ Guardado' : '✗ '+r.mensaje;
      res.style.color = r.ok ? 'var(--ok)' : 'var(--err)';
      if(r.ok){ document.getElementById('ap-nombre').value=''; document.getElementById('ap-categoria').value='';
        document.getElementById('ap-monto').value=''; document.getElementById('ap-banco').value='';
        document.getElementById('ap-meta').value=''; document.getElementById('ap-notas').value=''; }
    }).catch(()=>{ res.textContent='Error'; res.style.color='var(--err)'; });
}

// ── Helper: seleccionar opt ──
function _selOpt(btn, containerId){
  document.querySelectorAll('#'+containerId+' .opt').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
}

function buscarFilaId(){
  const id = document.getElementById('editar-id-input').value.trim();
  if(!id){ document.getElementById('editar-id-msg').textContent='Escribe un ID'; return; }
  const spin = document.getElementById('buscar-spin');
  const msg  = document.getElementById('editar-id-msg');
  if(spin) spin.style.display='block';
  msg.textContent='Buscando…'; msg.style.color='var(--m)';
  api.getFilaPorId(id)
    .then(r=>{
      if(spin) spin.style.display='none';
      if(!r.ok){ msg.textContent='✗ '+r.mensaje; msg.style.color='var(--err)'; return; }
      _filaEditar = r.fila;
      _idEditar   = r.id;
      msg.textContent='✓ ID '+r.id+' encontrado — fila '+r.fila;
      msg.style.color='var(--ok)';
      // Populate fields
      document.getElementById('fecha').value = r.fecha || fmtD(new Date());
      marcarDone('fecha');
      // Proyecto
      proxSel = r.proyecto;
      setFieldVal('proyecto', r.proyecto, !r.proyecto);
      _selectOpt('sw-proyecto', r.proyecto);
      marcarDone('proyecto');
      // Contacto
      contactoSel = r.contacto;
      setFieldVal('contacto', r.contacto, !r.contacto);
      _selectOpt('sw-contacto', r.contacto);
      marcarDone('contacto');
      // Concepto
      setFieldVal('concepto', r.concepto, !r.concepto);
      marcarDone('concepto');
      // Monto
      const m = r.monto || 0;
      sign = m >= 0 ? 1 : -1;
      document.getElementById('monto').value = Math.abs(m);
      document.getElementById('sbp').className='msign'+(sign===1?' pos':'');
      document.getElementById('sbn').className='msign'+(sign===-1?' neg':'');
      upM(); marcarDone('monto');
      // Recurrencia
      recSel = r.recurrencia;
      setFieldVal('recurrencia', r.recurrencia, !r.recurrencia);
      _selectOpt('sw-recurrencia', r.recurrencia);
      marcarDone('recurrencia');
      // Clave
      document.getElementById('clave').value = r.clave || '';
      setFieldVal('clave', r.clave||'', !r.clave);
      if(r.clave) marcarDone('clave');
      // Necesidad
      necesidadSel = r.necesidad || '';
      if(r.necesidad){ setFieldVal('necesidad', r.necesidad.slice(0,30), false); marcarDone('necesidad'); }
    })
    .catch(e=>{ if(spin) spin.style.display='none'; msg.textContent='Error: '+e.message; msg.style.color='var(--err)'; });
}

function _selectOpt(swId, val){
  const w = document.getElementById(swId);
  if(!w) return;
  w.querySelectorAll('.opt').forEach(b=>{
    b.classList.toggle('on', b.textContent.trim()===val);
  });
}

// ══════════════════════════════════════════
//  ENTES (Bancos)
// ══════════════════════════════════════════
function renderEntes(data){
  const body=document.getElementById('entes-list');
  if(!data||!data.length){body.innerHTML='<div style="padding:16px;color:var(--m);text-align:center">Sin datos</div>';return;}
  const total=data.reduce((s,f)=>f.nombre==='P'?s:s+(f.monto||0),0);
  const {txt:tt,cls:tc}=fmtMoneda(total);
  document.getElementById('entes-total').textContent=tt;
  document.getElementById('entes-total').className='sec-hdr-val '+tc;
  const hayExcluidos = data.some(f=>f.nombre==='P');
  body.innerHTML=data.map(f=>{
    const {txt,cls}=fmtMoneda(f.monto);
    const excluido = f.nombre==='P';
    return `<div class="ente-row${excluido?' excluido-total':''}" onclick="togEnteEdit(${f.fila})">
      <div class="ente-nombre">${f.nombre}</div>
      <div class="ente-right">
        <div class="ente-monto ${cls}" id="em-${f.fila}">${txt}</div>
        <div class="ente-fecha">${fmtDiaSemana(f.fecha)}</div>
      </div>
    </div>
    <div class="ente-edit" id="ee-${f.fila}">
      <input type="number" value="${f.monto!==null?f.monto:''}" step="0.01" inputmode="decimal"
        id="ei-${f.fila}" placeholder="0.00"
        onkeydown="if(event.key==='Enter')guardarEnte(${f.fila});if(event.key==='Escape')togEnteEdit(${f.fila})">
      <button class="btn-check" id="ec-${f.fila}" onclick="guardarEnte(${f.fila})"><i class="fas fa-check" id="ei-ico-${f.fila}"></i></button>
    </div>`;
  }).join('') + (hayExcluidos ? '<div class="ente-excluido-nota">* excluido del total</div>' : '');
}
function togEnteEdit(fila){
  const ee=document.getElementById('ee-'+fila);
  const isOpen=ee.classList.contains('open');
  document.querySelectorAll('.ente-edit').forEach(e=>e.classList.remove('open'));
  if(!isOpen){ee.classList.add('open');document.getElementById('ei-'+fila).focus();}
}
function guardarEnte(fila){
  const inp=document.getElementById('ei-'+fila);
  const val=parseFloat(inp.value);if(isNaN(val))return;
  const ico=document.getElementById('ei-ico-'+fila);
  ico.className='fas fa-circle-notch fa-spin';
  api.actualizarFijo(fila,val)
    .then(r=>{
      ico.className='fas fa-check';
      if(r.ok){
        const {txt,cls}=fmtMoneda(val);
        const em=document.getElementById('em-'+fila);
        if(em){em.textContent=txt;em.className='ente-monto '+cls;}
        togEnteEdit(fila);
        api.getFijos().then(renderEntes);
      }
    })
    .catch(()=>{ico.className='fas fa-check';});
}


// ══════════════════════════════════════════
//  SOS
// ══════════════════════════════════════════
function activarSOS(){
  const btn = document.getElementById('btn-sos');
  if(btn){ btn.disabled=true; btn.textContent='Enviando…'; }
  const msg = '🚨 Necesito ayuda — enviado desde RAW Entry';
  // Intentar obtener ubicación
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      function(pos){
        var lat = pos.coords.latitude;
        var lng = pos.coords.longitude;
        var acc = pos.coords.accuracy; // metros de precisión
        var loc = 'https://maps.google.com/?q=' + lat + ',' + lng;
        console.log('GPS accuracy: ' + acc + 'm');
        _doEnviarSOS(msg, loc, btn);
      },
      function(err){
        console.warn('Geolocation error:', err.code, err.message);
        _doEnviarSOS(msg, '', btn);
      },
      {
        enableHighAccuracy: true,  // fuerza GPS chip si disponible
        timeout: 15000,            // espera más tiempo para GPS real
        maximumAge: 0              // no usar caché — ubicación fresca
      }
    );
  } else {
    _doEnviarSOS(msg, '', btn);
  }
}

function _doEnviarSOS(mensaje, ubicacion, btn){
  api.enviarSOS({ mensaje, ubicacion })
    .then(r=>{
      showToast(r.ok ? '🚨 SOS enviado a '+r.enviados+' contacto(s)' : 'Error: '+r.mensaje, r.ok);
      if(btn){ btn.disabled=false; btn.textContent='🚨 SOS'; }
    })
    .catch(()=>{
      showToast('Error al enviar SOS', false);
      if(btn){ btn.disabled=false; btn.textContent='🚨 SOS'; }
    });
}
