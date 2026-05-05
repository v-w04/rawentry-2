/* RAW Entry — Core v.5.056
   Dial rediseñado en Canvas 2D puro.
   Overlay: position:fixed, backdrop-filter:blur, sin caja, sin marco.
   El canvas flota sobre el blur. Sin referencias a dial.html.
*/
window._apartadosData = window._apartadosData || [];
window._fijosData     = window._fijosData     || [];
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
  try { return typeof google!=='undefined'&&typeof google.script!=='undefined'&&typeof google.script.run!=='undefined'; }
  catch(e){ return false; }
})();

function gasRun(fn,...args){
  return new Promise((resolve,reject)=>{
    const runner=google.script.run.withSuccessHandler(resolve).withFailureHandler(e=>{console.error(fn,e);reject(e);});
    if(typeof runner[fn]==='function') runner[fn](...args);
    else reject(new Error('Función no encontrada: '+fn));
  });
}
async function apiGet(action,params={}){
  const url=new URL(API_URL);
  url.searchParams.set('action',action);
  Object.entries(params).forEach(([k,v])=>url.searchParams.set(k,v));
  const r=await fetch(url); return r.json();
}
async function apiPost(action,data={}){
  const r=await fetch(API_URL,{method:'POST',body:JSON.stringify({action,...data})});
  return r.json();
}

const api = {
  getAll:               ()=>EN_GAS?gasRun('getAll'):apiGet('getAll'),
  getSaldoDia:          (f)=>EN_GAS?gasRun('getSaldoDia',f):apiGet('getSaldoDia',{fecha:f}),
  getListaEstructura:   ()=>EN_GAS?gasRun('getListaEstructura'):apiGet('getListaEstructura'),
  insertarEnRAW:        (d)=>EN_GAS?gasRun('insertarEnRAW',d):apiPost('insertarEnRAW',{data:d}),
  actualizarFijo:       (fila,monto)=>EN_GAS?gasRun('actualizarFijo',fila,monto):apiPost('actualizarFijo',{fila,monto}),
  agregarALista:        (colIndex,valor)=>EN_GAS?gasRun('agregarALista',colIndex,valor):apiPost('agregarALista',{colIndex,valor}),
  marcarLogro:          (fila,val)=>EN_GAS?gasRun('marcarLogro',fila,val):apiPost('marcarLogro',{fila,val}),
  getFijos:             ()=>EN_GAS?gasRun('getFijos'):apiGet('getFijos'),
  getDatosMes:          ()=>EN_GAS?gasRun('getDatosMes'):apiGet('getDatosMes'),
  getGastos:            ()=>EN_GAS?gasRun('getGastos'):apiGet('getGastos'),
  getLogros:            ()=>EN_GAS?gasRun('getLogros'):apiGet('getLogros'),
  getActivityCheck:     ()=>EN_GAS?gasRun('getActivityCheck'):apiGet('getActivityCheck'),
  cargarActivityChecks: (semana)=>EN_GAS?gasRun('cargarActivityChecks',semana):apiGet('cargarActivityChecks',{semana}),
  guardarActivityChecks:(semana,checks)=>EN_GAS?gasRun('guardarActivityChecks',semana,checks):apiPost('guardarActivityChecks',{semana,checks}),
  guardarEnBancos:      (nombre,monto,fecha)=>EN_GAS?gasRun('guardarEnBancos',nombre,monto,fecha):apiPost('guardarEnBancos',{nombre,monto,fecha}),
  getFilaPorId:         (id)=>EN_GAS?gasRun('getFilaPorId',id):apiGet('getFilaPorId',{id}),
  editarFilaRAW:        (fila,datos)=>EN_GAS?gasRun('editarFilaRAW',fila,datos):apiPost('editarFilaRAW',{fila,datos}),
  getPensamientos:      ()=>EN_GAS?gasRun('getPensamientos'):apiGet('getPensamientos'),
  guardarPensamiento:   (d)=>EN_GAS?gasRun('guardarPensamiento',d):apiPost('guardarPensamiento',{datos:d}),
  getRelaciones:        ()=>EN_GAS?gasRun('getRelaciones'):apiGet('getRelaciones'),
  guardarInteraccion:   (d)=>EN_GAS?gasRun('guardarInteraccion',d):apiPost('guardarInteraccion',{datos:d}),
  getSalud:             ()=>EN_GAS?gasRun('getSalud'):apiGet('getSalud'),
  guardarSalud:         (d)=>EN_GAS?gasRun('guardarSalud',d):apiPost('guardarSalud',{datos:d}),
  getApartados:         ()=>EN_GAS?gasRun('getApartados'):apiGet('getApartados'),
  guardarApartado:      (d)=>EN_GAS?gasRun('guardarApartado',d):apiPost('guardarApartado',{datos:d}),
  actualizarApartado:   (fila,estado)=>EN_GAS?gasRun('actualizarApartado',fila,estado):apiPost('actualizarApartado',{fila,estado}),
  getFinancieroAvanzado:()=>EN_GAS?gasRun('getFinancieroAvanzado'):apiGet('getFinancieroAvanzado'),
  getRevision:          (tipo,anio,mes,semana)=>EN_GAS?gasRun('getRevision',tipo,anio,mes,semana):apiGet('getRevision',{tipo,anio,mes,semana}),
  getNecesidades:       (anio,mes,fecha)=>EN_GAS?gasRun('getNecesidades',anio,mes,fecha):apiGet('getNecesidades',{anio,mes,fecha}),
  getFlujoPorMes:       ()=>EN_GAS?gasRun('getFlujoPorMes'):apiGet('getFlujoPorMes'),
  getScoreVida:         ()=>EN_GAS?gasRun('getScoreVida'):apiGet('getScoreVida'),
  enviarSOS:            (d)=>EN_GAS?gasRun('enviarSOS',d):apiPost('enviarSOS',{datos:d}),
  getPatrimonio:        ()=>EN_GAS?gasRun('getPatrimonio'):apiGet('getPatrimonio'),
  getAhorro:            ()=>EN_GAS?gasRun('getAhorro'):apiGet('getAhorro'),
  getEfectivo:          ()=>EN_GAS?gasRun('getEfectivo'):apiGet('getEfectivo'),
  getInversion:         ()=>EN_GAS?gasRun('getInversion'):apiGet('getInversion'),
  guardarAhorro:        (d)=>EN_GAS?gasRun('guardarAhorro',d):apiPost('guardarAhorro',{datos:d}),
  guardarEfectivo:      (d)=>EN_GAS?gasRun('guardarEfectivo',d):apiPost('guardarEfectivo',{datos:d}),
  guardarInversion:     (d)=>EN_GAS?gasRun('guardarInversion',d):apiPost('guardarInversion',{datos:d}),
  setActivityCheck:     (tipo,fila,dia,valor)=>EN_GAS?gasRun('setActivityCheck',tipo,fila,dia,valor):apiPost('setActivityCheck',{tipo,fila,dia,valor}),
  marcarActivityItem:   (tipo,fila,valor)=>EN_GAS?gasRun('marcarActivityItem',tipo,fila,valor):apiPost('marcarActivityItem',{tipo,fila,valor}),
  agregarAActivity:     (tipo,datos)=>EN_GAS?gasRun('agregarAActivity',tipo,datos):apiPost('agregarAActivity',{tipo,datos}),
  resetearElectronics:  ()=>EN_GAS?gasRun('resetearElectronicsHoy'):apiGet('resetearElectronics'),
  getNutricion:         ()=>EN_GAS?gasRun('getNutricion'):apiGet('getNutricion'),
  getMetasNutricion:    ()=>EN_GAS?gasRun('getMetasNutricion'):apiGet('getMetasNutricion'),
  guardarNutricion:     (d)=>EN_GAS?gasRun('guardarNutricion',d):apiPost('guardarNutricion',{datos:d}),
  getEntrenamiento:     ()=>EN_GAS?gasRun('getEntrenamiento'):apiGet('getEntrenamiento'),
  guardarEntrenamiento: (d)=>EN_GAS?gasRun('guardarEntrenamiento',d):apiPost('guardarEntrenamiento',{datos:d}),
};

// ══════════════════════════════════════════
//  ESTADO
// ══════════════════════════════════════════
const CAMPOS=['fecha','proyecto','contacto','concepto','monto','recurrencia','necesidad','clave'];
const MESES_ES=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
let sign=1,cats={},proxSel='',contactoSel='',recSel='',necesidadSel='',sheetUrl='';
let _modoEditar=false,_filaEditar=null,_idEditar=null;
let _tabEntrada='nueva';
let datosMes={meses:[],grupos:{}};
let _toast=null;

// ══════════════════════════════════════════
//  PARTÍCULAS
// ══════════════════════════════════════════
(()=>{
  const c=document.getElementById('pts'); if(!c)return;
  const esMob=/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const tipos=esMob?['white','white','white','white','white','white']:['blue','blue','blue','cyan','cyan','blue'];
  for(let i=0;i<60;i++){
    const p=document.createElement('div');
    p.className='pt '+tipos[Math.floor(Math.random()*tipos.length)];
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

function _initMobTablero(){
  const tablero=document.getElementById('mob-tablero');
  const sections=document.getElementById('mob-sections');
  if(tablero) tablero.style.display='none';
  if(sections) sections.style.display='flex';
}

// ══════════════════════════════════════════
//  DIAL — Canvas 2D
//  Overlay: position:fixed, blur, sin caja
// ══════════════════════════════════════════

// Definición de sectores con iconos Lucide-style dibujados en canvas
// ══════════════════════════════════════════
//  DIAL — Canvas 2D v3
//  Canvas 800px para que el subanillo quepa
//  Ícono centrado en gajo + texto pequeño debajo (como referencia)
//  Segundo anillo visible sin cortes
// ══════════════════════════════════════════

// Colores de sector — monocromáticos
// Monocromático — profundidad por capas de gris oscuro
// ══════════════════════════════════════════
//  DIAL — Canvas 2D v4
//  Réplica de referencia: gajos 3D con borde iluminado,
//  ícono grande centrado, label uppercase, glow exterior
// ══════════════════════════════════════════

// Colores base — monocromático con acento por sector en ícono
var _DIAL_BASE      = 'rgba(18,18,24,0.95)';
var _DIAL_HOVER     = 'rgba(30,30,42,0.98)';
var _DIAL_ACT       = 'rgba(24,24,36,0.98)';
var _DIAL_SBASE     = 'rgba(14,14,20,0.96)';
var _DIAL_SHOV      = 'rgba(26,26,38,0.99)';

// Ícono draw functions subitems
function _icoLibro(ctx,x,y,s,c){var k=s/22;ctx.beginPath();ctx.rect(x-7*k,y-9*k,14*k,18*k);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.lineJoin='round';ctx.stroke();ctx.beginPath();ctx.moveTo(x-7*k,y-2*k);ctx.lineTo(x-1*k,y-9*k);ctx.lineTo(x-1*k,y+5*k);ctx.closePath();ctx.strokeStyle=c;ctx.stroke();}
function _icoMovie(ctx,x,y,s,c){var k=s/22;ctx.beginPath();ctx.rect(x-9*k,y-6*k,18*k,12*k);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.lineJoin='round';ctx.stroke();[-6,-2,2,6].forEach(function(dx){ctx.beginPath();ctx.moveTo(x+dx*k,y-6*k);ctx.lineTo(x+dx*k,y+6*k);ctx.strokeStyle=c;ctx.lineWidth=1.2;ctx.stroke();});}
function _icoPendiente(ctx,x,y,s,c){var k=s/22;ctx.beginPath();ctx.arc(x,y,8*k,0,Math.PI*2);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.arc(x-2.5*k,y-1*k,1.8*k,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();ctx.beginPath();ctx.arc(x+2.5*k,y+1*k,1.8*k,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();}
function _icoAhorro(ctx,x,y,s,c){var k=s/22;ctx.beginPath();ctx.arc(x,y,7*k,Math.PI*.15,Math.PI*2.85);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.moveTo(x+7*k,y-2*k);ctx.lineTo(x+11*k,y-4*k);ctx.lineTo(x+11*k,y+2*k);ctx.fillStyle=c;ctx.fill();}
function _icoEfectivo(ctx,x,y,s,c){var k=s/22;ctx.beginPath();ctx.rect(x-9*k,y-5*k,18*k,10*k);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.moveTo(x-4*k,y);ctx.lineTo(x+4*k,y);ctx.strokeStyle=c;ctx.lineWidth=2.5;ctx.lineCap='round';ctx.stroke();}
function _icoInversion(ctx,x,y,s,c){var k=s/22;ctx.beginPath();ctx.moveTo(x-8*k,y+6*k);ctx.lineTo(x-3*k,y);ctx.lineTo(x+2*k,y+4*k);ctx.lineTo(x+8*k,y-6*k);ctx.strokeStyle=c;ctx.lineWidth=2.2;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke();}

// Contexto pre-seleccionado desde el dial — se lee en abrirFormulario
var _dialPreset = {};

// Función helper para íconos de subs simples (texto)
function _icoTexto(label){ return function(ctx,x,y,s,c){ var k=s/22; ctx.font='bold '+Math.round(s*0.38)+'px -apple-system,sans-serif'; ctx.fillStyle=c; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(label,x,y); }; }

var _DIAL_ITEMS = [
  // ── ACTIVITY — subs: tipo de registro ──
  { id:'activity', label:'Activity', accent:'#22d3c8',
    draw:function(ctx,x,y,s,c){var k=s/22;ctx.beginPath();ctx.moveTo(x-8*k,y+4*k);ctx.lineTo(x-2*k,y-2*k);ctx.lineTo(x+3*k,y+3*k);ctx.lineTo(x+9*k,y-7*k);ctx.strokeStyle=c;ctx.lineWidth=2.4;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke();},
    subs:[
      {id:'libro',   label:'Libros',     accent:'#ec4899', draw:_icoLibro,
       preset:function(){ _dialPreset={tab:'libro'}; }},
      {id:'movie',   label:'Movies',     accent:'#f59e0b', draw:_icoMovie,
       preset:function(){ _dialPreset={tab:'movie'}; }},
      {id:'norut',   label:'Pendientes', accent:'#8b5cf6', draw:_icoPendiente,
       preset:function(){ _dialPreset={tab:'norut'}; }},
    ]},

  // ── APARTADO — directo al form ──
  { id:'apartado', label:'Apartado', accent:'#4ade80',
    draw:function(ctx,x,y,s,c){var k=s/22;ctx.beginPath();ctx.arc(x,y-2*k,5.5*k,0,Math.PI*2);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.moveTo(x-8*k,y+5*k);ctx.lineTo(x+8*k,y+5*k);ctx.lineTo(x+6*k,y+10*k);ctx.lineTo(x-6*k,y+10*k);ctx.closePath();ctx.strokeStyle=c;ctx.lineWidth=2;ctx.stroke();}},

  // ── BANCOS — subs: banco específico de _fijosData ──
  { id:'bancos', label:'Bancos', accent:'#f59e0b',
    draw:function(ctx,x,y,s,c){var k=s/22;ctx.beginPath();ctx.moveTo(x-9*k,y+7*k);ctx.lineTo(x+9*k,y+7*k);ctx.moveTo(x-6*k,y-1*k);ctx.lineTo(x-6*k,y+7*k);ctx.moveTo(x,y-1*k);ctx.lineTo(x,y+7*k);ctx.moveTo(x+6*k,y-1*k);ctx.lineTo(x+6*k,y+7*k);ctx.moveTo(x-9*k,y-1*k);ctx.lineTo(x+9*k,y-1*k);ctx.moveTo(x-10*k,y-6*k);ctx.lineTo(x,y-12*k);ctx.lineTo(x+10*k,y-6*k);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();},
    subsGen:function(){
      // Genera subs dinámicamente desde _fijosData al momento de abrir
      var bancos=(window._fijosData||[]).filter(function(f){return f.nombre&&f.nombre!=='P';}).slice(0,5);
      if(!bancos.length) return null;
      return bancos.map(function(f){
        return {id:'bancos', label:f.nombre, accent:'#f59e0b', draw:_icoTexto(f.nombre.slice(0,4)),
          preset:function(){ _dialPreset={tab:'bancos', banco:f.nombre}; }};
      });
    }},

  // ── ENTRENAMIENTO — subs: tipo de entrenamiento ──
  { id:'entrenamiento', label:'Entrena', accent:'#fb923c',
    draw:function(ctx,x,y,s,c){var k=s/22;[[-9,0,3.5],[9,0,3.5]].forEach(function(p){ctx.beginPath();ctx.arc(x+p[0]*k,y+p[1]*k,p[2]*k,0,Math.PI*2);ctx.strokeStyle=c;ctx.lineWidth=2.2;ctx.stroke();});ctx.beginPath();ctx.moveTo(x-5*k,y);ctx.lineTo(x+5*k,y);ctx.strokeStyle=c;ctx.lineWidth=3;ctx.lineCap='round';ctx.stroke();},
    subs:[
      {id:'entrenamiento', label:'Fuerza',      accent:'#fb923c', draw:_icoTexto('💪'),
       preset:function(){ _dialPreset={tab:'entrenamiento',tipo:'Fuerza'}; }},
      {id:'entrenamiento', label:'Cardio',       accent:'#f87171', draw:_icoTexto('🏃'),
       preset:function(){ _dialPreset={tab:'entrenamiento',tipo:'Cardio'}; }},
      {id:'entrenamiento', label:'HIIT',         accent:'#fbbf24', draw:_icoTexto('⚡'),
       preset:function(){ _dialPreset={tab:'entrenamiento',tipo:'HIIT'}; }},
      {id:'entrenamiento', label:'Flex',         accent:'#86efac', draw:_icoTexto('🧘'),
       preset:function(){ _dialPreset={tab:'entrenamiento',tipo:'Flexibilidad'}; }},
      {id:'entrenamiento', label:'Deporte',      accent:'#93c5fd', draw:_icoTexto('⚽'),
       preset:function(){ _dialPreset={tab:'entrenamiento',tipo:'Deporte'}; }},
    ]},

  // ── NUTRICIÓN — subs: momento del día ──
  { id:'nutricion', label:'Nutrición', accent:'#86efac',
    draw:function(ctx,x,y,s,c){var k=s/22;ctx.beginPath();ctx.arc(x,y+2*k,7*k,0,Math.PI*2);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.moveTo(x,y-5*k);ctx.bezierCurveTo(x,y-12*k,x+7*k,y-11*k,x+6*k,y-5*k);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.lineCap='round';ctx.stroke();},
    subs:[
      {id:'nutricion', label:'Desayuno', accent:'#fbbf24', draw:_icoTexto('☀️'),
       preset:function(){ _dialPreset={tab:'nutricion',momento:'Desayuno'}; }},
      {id:'nutricion', label:'Comida',   accent:'#86efac', draw:_icoTexto('🍽'),
       preset:function(){ _dialPreset={tab:'nutricion',momento:'Comida'}; }},
      {id:'nutricion', label:'Cena',     accent:'#c4b5fd', draw:_icoTexto('🌙'),
       preset:function(){ _dialPreset={tab:'nutricion',momento:'Cena'}; }},
      {id:'nutricion', label:'Snack',    accent:'#f0abfc', draw:_icoTexto('🍎'),
       preset:function(){ _dialPreset={tab:'nutricion',momento:'Snack'}; }},
    ]},

  // ── PATRIMONIO — subs: tipo de movimiento ──
  { id:'patrimonio', label:'Patrimonio', accent:'#c4b5fd',
    draw:function(ctx,x,y,s,c){var k=s/22;ctx.beginPath();ctx.moveTo(x-10*k,y+8*k);ctx.lineTo(x+10*k,y+8*k);ctx.moveTo(x-6*k,y-1*k);ctx.lineTo(x-6*k,y+8*k);ctx.moveTo(x,y-1*k);ctx.lineTo(x,y+8*k);ctx.moveTo(x+6*k,y-1*k);ctx.lineTo(x+6*k,y+8*k);ctx.moveTo(x-10*k,y-1*k);ctx.lineTo(x+10*k,y-1*k);ctx.moveTo(x-12*k,y-7*k);ctx.lineTo(x,y-13*k);ctx.lineTo(x+12*k,y-7*k);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();},
    subs:[
      {id:'patrimonio', label:'Banco',     accent:'#4ade80',  draw:_icoAhorro,
       preset:function(){ _dialPreset={tab:'patrimonio',tipo:'ahorro'}; }},
      {id:'patrimonio', label:'Efectivo',  accent:'#fbbf24',  draw:_icoEfectivo,
       preset:function(){ _dialPreset={tab:'patrimonio',tipo:'efectivo'}; }},
      {id:'patrimonio', label:'Inversión', accent:'#c4b5fd',  draw:_icoInversion,
       preset:function(){ _dialPreset={tab:'patrimonio',tipo:'inversion'}; }},
    ]},

  // ── PENSAMIENTO — subs: categoría ──
  { id:'pensamiento', label:'Pensa', accent:'#f0abfc',
    draw:function(ctx,x,y,s,c){var k=s/22;ctx.beginPath();ctx.arc(x-1*k,y-2*k,8*k,Math.PI*.3,Math.PI*2.2);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.arc(x+5*k,y+8*k,2.5*k,0,Math.PI*2);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.arc(x+9*k,y+13*k,1.5*k,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();},
    subs:[
      {id:'pensamiento', label:'Emoción',   accent:'#ec4899', draw:_icoTexto('💗'),
       preset:function(){ _dialPreset={tab:'pensamiento',categoria:'Emoción'}; }},
      {id:'pensamiento', label:'Idea',       accent:'#fbbf24', draw:_icoTexto('💡'),
       preset:function(){ _dialPreset={tab:'pensamiento',categoria:'Idea'}; }},
      {id:'pensamiento', label:'Reflexión',  accent:'#8b5cf6', draw:_icoTexto('🔮'),
       preset:function(){ _dialPreset={tab:'pensamiento',categoria:'Reflexión'}; }},
      {id:'pensamiento', label:'Decisión',   accent:'#f59e0b', draw:_icoTexto('⚖'),
       preset:function(){ _dialPreset={tab:'pensamiento',categoria:'Decisión'}; }},
      {id:'pensamiento', label:'Sueño',      accent:'#67e8f9', draw:_icoTexto('💭'),
       preset:function(){ _dialPreset={tab:'pensamiento',categoria:'Sueño'}; }},
    ]},

  // ── PERSONA — subs: energía ──
  { id:'persona', label:'Persona', accent:'#93c5fd',
    draw:function(ctx,x,y,s,c){var k=s/22;ctx.beginPath();ctx.arc(x-3*k,y-5*k,4*k,0,Math.PI*2);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.arc(x+5*k,y-7*k,3.2*k,0,Math.PI*2);ctx.strokeStyle=c;ctx.lineWidth=1.8;ctx.stroke();ctx.beginPath();ctx.moveTo(x-12*k,y+10*k);ctx.quadraticCurveTo(x-3*k,y+2*k,x+5*k,y+10*k);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.lineCap='round';ctx.stroke();ctx.beginPath();ctx.moveTo(x+3*k,y+4*k);ctx.quadraticCurveTo(x+11*k,y,x+14*k,y+10*k);ctx.strokeStyle=c;ctx.lineWidth=1.8;ctx.lineCap='round';ctx.stroke();},
    subs:[
      {id:'persona', label:'+ Energía', accent:'#4ade80', draw:_icoTexto('+'),
       preset:function(){ _dialPreset={tab:'persona',energia:1}; }},
      {id:'persona', label:'Neutral',   accent:'#94a3b8', draw:_icoTexto('○'),
       preset:function(){ _dialPreset={tab:'persona',energia:0}; }},
      {id:'persona', label:'− Energía', accent:'#f87171', draw:_icoTexto('−'),
       preset:function(){ _dialPreset={tab:'persona',energia:-1}; }},
    ]},

  // ── EDITAR — especial: abre input HTML flotante para ID ──
  { id:'editar', label:'Editar', accent:'#a5b4fc',
    draw:function(ctx,x,y,s,c){var k=s/22;ctx.save();ctx.translate(x,y);ctx.rotate(-Math.PI/4);ctx.beginPath();ctx.rect(-2.5*k,-9*k,5*k,16*k);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.lineJoin='round';ctx.stroke();ctx.beginPath();ctx.moveTo(-2.5*k,7*k);ctx.lineTo(0,12*k);ctx.lineTo(2.5*k,7*k);ctx.fillStyle=c;ctx.fill();ctx.restore();},
    accionEspecial:true},  // abre input ID overlay en vez de subs canvas

  // ── SALUD — subs: tipo de registro ──
  { id:'salud', label:'Salud', accent:'#fca5a5',
    draw:function(ctx,x,y,s,c){var k=s/22;ctx.beginPath();ctx.moveTo(x,y+9*k);ctx.bezierCurveTo(x-12*k,y,x-12*k,y-9*k,x,y-4*k);ctx.bezierCurveTo(x+12*k,y-9*k,x+12*k,y,x,y+9*k);ctx.strokeStyle=c;ctx.lineWidth=2.2;ctx.lineJoin='round';ctx.stroke();},
    subs:[
      {id:'salud', label:'Cita',        accent:'#67e8f9', draw:_icoTexto('📅'),
       preset:function(){ _dialPreset={tab:'salud',tipo:'Cita'}; }},
      {id:'salud', label:'Síntoma',     accent:'#f87171', draw:_icoTexto('🤒'),
       preset:function(){ _dialPreset={tab:'salud',tipo:'Síntoma'}; }},
      {id:'salud', label:'Medicamento', accent:'#a78bfa', draw:_icoTexto('💊'),
       preset:function(){ _dialPreset={tab:'salud',tipo:'Medicamento'}; }},
      {id:'salud', label:'Resultado',   accent:'#fbbf24', draw:_icoTexto('📋'),
       preset:function(){ _dialPreset={tab:'salud',tipo:'Resultado'}; }},
      {id:'salud', label:'Vacuna',      accent:'#86efac', draw:_icoTexto('💉'),
       preset:function(){ _dialPreset={tab:'salud',tipo:'Vacuna'}; }},
    ]},
];

var _dialOverlay   = null;
var _dialCanvas    = null;
var _dialCtx       = null;
var _dialHovered   = -1;
var _dialSubHov    = -1;
var _dialActiveSub = -1;
var _dialVisible   = false;
var _dialCentroHov = false;   // hover sobre botón RAW
var _dialPulseT    = 0;       // tiempo para animación pulso centro
var _dialRAF       = null;    // requestAnimationFrame del pulso

// Geometría del dial
var _DC = {
  W:920, H:920, CX:460, CY:460,
  R_IN:90,    // agujero grande — como en referencia
  R_OUT:310,  // anillo principal profundo
  R_SI:328,   // inicio subanillo
  R_SO:420,   // fin subanillo — 460-40=420 margen OK
  GAP:0.022,
};

function _crearDialOverlay(){
  if(_dialOverlay) return;

  _dialOverlay = document.createElement('div');
  _dialOverlay.id = 'dial-overlay';
  _dialOverlay.style.cssText = [
    'position:fixed','inset:0','z-index:9000',
    'display:none','align-items:center','justify-content:center',
    'background:rgba(4,4,10,0.5)',
    'backdrop-filter:blur(24px) saturate(150%)',
    '-webkit-backdrop-filter:blur(24px) saturate(150%)',
  ].join(';');

  _dialCanvas = document.createElement('canvas');
  _dialCanvas.width  = _DC.W;
  _dialCanvas.height = _DC.H;
  _dialCanvas.style.cssText = 'display:block;cursor:pointer;width:min(850px,88vw);height:min(850px,88vw);position:relative';
  _dialCtx = _dialCanvas.getContext('2d');

  // Overlay centrado — el dial siempre en el centro exacto
  _dialOverlay.style.cssText = [
    'position:fixed','inset:0','z-index:9000',
    'display:none','align-items:center','justify-content:center',
    'background:rgba(4,4,10,0.5)',
    'backdrop-filter:blur(24px) saturate(150%)',
    '-webkit-backdrop-filter:blur(24px) saturate(150%)',
  ].join(';');

  // ── Panel derecho — navegación a otras secciones ──
  var _navPanel = document.createElement('div');
  _navPanel.id = 'dial-nav-panel';
  _navPanel.style.cssText = [
    'position:fixed',
    'top:50%',
    'left:calc(50% + min(430px,52vw))',
    'transform:translateY(-50%)',
    'display:flex','flex-direction:column','gap:6px',
    'width:190px',
    'z-index:9001',
  ].join(';');

  var NAV_ITEMS = [
    { label:'Logros',     icon:'fa-trophy',      fn:'irALogros',    color:'#fbbf24' },
    { label:'Bitácora',   icon:'fa-book-open',   fn:'irABitacora',  color:'#c4b5fd' },
    { label:'Activity',   icon:'fa-bolt',        fn:'irAActivity',  color:'#22d3c8' },
    { label:'Nutrición',  icon:'fa-leaf',        fn:'irANutricion', color:'#86efac' },
    { label:'RAW Sheet',  icon:'fa-table',       fn:'irASheets',    color:'#a5b4fc' },
    { label:'Actualizar', icon:'fa-rotate-right', fn:'refreshTodo', color:'#94a3b8' },
  ];

  var hdr = document.createElement('div');
  hdr.style.cssText = [
    'font-size:8px','font-weight:700','letter-spacing:.18em',
    'text-transform:uppercase','color:rgba(255,255,255,0.22)',
    'margin-bottom:6px','padding-left:4px',
  ].join(';');
  hdr.textContent = 'Navegación';
  _navPanel.appendChild(hdr);

  NAV_ITEMS.forEach(function(nav){
    var btn = document.createElement('button');
    // Estilo base: mismo lenguaje visual que el dial
    // fondo muy oscuro semitransparente, borde sutil de sector, sin radio
    btn.style.cssText = [
      'display:flex','align-items:center','gap:13px',
      'padding:10px 15px',
      'background:rgba(18,18,28,0.88)',
      'border:1px solid rgba(255,255,255,0.10)',
      'border-radius:0',
      'cursor:pointer',
      'font-family:-apple-system,BlinkMacSystemFont,sans-serif',
      'font-size:11px','font-weight:700',
      'letter-spacing:.06em','text-transform:uppercase',
      'color:rgba(255,255,255,0.55)',
      'text-align:left',
      'transition:all .15s',
      'width:100%',
      'position:relative',
      'overflow:hidden',
    ].join(';');

    // Ícono con glow de color del sector
    btn.innerHTML =
      '<i class="fas ' + nav.icon + '" style="' +
        'font-size:15px;color:' + nav.color + ';' +
        'width:20px;text-align:center;flex-shrink:0;' +
        'filter:drop-shadow(0 0 4px ' + nav.color + '88);' +
        'transition:filter .15s' +
      '"></i>' +
      '<span style="letter-spacing:.05em">' + nav.label + '</span>';

    btn.addEventListener('mouseenter', function(){
      btn.style.background = 'rgba(26,26,40,0.97)';
      btn.style.borderColor = nav.color + '70';
      btn.style.color = '#ffffff';
      // glow exterior del acento — como el borde iluminado del sector en hover
      btn.style.boxShadow =
        '0 0 0 1px ' + nav.color + '44,' +
        '0 0 18px ' + nav.color + '18,' +
        'inset 0 0 14px rgba(0,0,0,0.4)';
      btn.style.transform = 'translateX(5px)';
      // intensificar glow del ícono
      var ico = btn.querySelector('i');
      if(ico) ico.style.filter = 'drop-shadow(0 0 8px ' + nav.color + ')';
    });
    btn.addEventListener('mouseleave', function(){
      btn.style.background = 'rgba(18,18,28,0.88)';
      btn.style.borderColor = 'rgba(255,255,255,0.10)';
      btn.style.color = 'rgba(255,255,255,0.55)';
      btn.style.boxShadow = 'none';
      btn.style.transform = 'translateX(0)';
      var ico = btn.querySelector('i');
      if(ico) ico.style.filter = 'drop-shadow(0 0 4px ' + nav.color + '88)';
    });
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      cerrarDial();
      if(typeof window[nav.fn] === 'function') window[nav.fn]();
    });
    _navPanel.appendChild(btn);
  });



  // Orden: dial a la izquierda, nav a la derecha
  _dialOverlay.appendChild(_dialCanvas);
  _dialOverlay.appendChild(_navPanel);
  document.body.appendChild(_dialOverlay);

  _dialOverlay.addEventListener('click',function(e){ if(e.target===_dialOverlay) cerrarDial(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&_dialVisible) cerrarDial(); });

  _dialCanvas.addEventListener('mousemove',function(e){
    var r=_dialCanvas.getBoundingClientRect();
    var mx=(e.clientX-r.left)*(_DC.W/r.width);
    var my=(e.clientY-r.top)*(_DC.H/r.height);
    var dx0=mx-_DC.CX,dy0=my-_DC.CY;
    var enCentro=(Math.sqrt(dx0*dx0+dy0*dy0)<_DC.R_IN);
    var h=enCentro?-1:_dialHitTest(mx,my,false);
    var hs=_dialActiveSub>=0&&!enCentro?_dialHitTest(mx,my,true):-1;
    var cambio=(h!==_dialHovered||hs!==_dialSubHov||enCentro!==_dialCentroHov);
    _dialHovered=h; _dialSubHov=hs; _dialCentroHov=enCentro;
    if(cambio){
      if(enCentro){ _iniciarPulsoCentro(); }
      else { _detenerPulsoCentro(); _dialDraw(); }
    }
    _dialCanvas.style.cursor=(h>=0||hs>=0||enCentro)?'pointer':'default';
  });
  _dialCanvas.addEventListener('mouseleave',function(){ _dialHovered=-1;_dialSubHov=-1;_dialCentroHov=false;_detenerPulsoCentro();_dialDraw(); });
  _dialCanvas.addEventListener('click',function(e){
    var r=_dialCanvas.getBoundingClientRect();
    var mx=(e.clientX-r.left)*(_DC.W/r.width);
    var my=(e.clientY-r.top)*(_DC.H/r.height);
    // ── Click en subanillo ──
    if(_dialActiveSub>=0){
      var hs=_dialHitTest(mx,my,true);
      if(hs>=0){
        var parentItem=_DIAL_ITEMS[_dialActiveSub];
        var activeSubs=parentItem._subsResueltos||parentItem.subs||[];
        var sub=activeSubs[hs];
        if(sub){
          _dialPreset={};
          if(typeof sub.preset==='function') sub.preset();
          cerrarDial();
          abrirFormulario(sub.id);
        }
        return;
      }
    }
    // ── Click en anillo principal ──
    var h=_dialHitTest(mx,my,false);
    if(h>=0){
      var item=_DIAL_ITEMS[h];
      // Editar — acción especial: overlay HTML con input de ID
      if(item.accionEspecial){
        _abrirEditarOverlay();
        return;
      }
      // Bancos — subs dinámicos desde _fijosData
      if(item.subsGen && !item._subsResueltos){
        var gen=item.subsGen();
        item._subsResueltos = gen && gen.length ? gen : null;
      }
      var subsActivos = item._subsResueltos || item.subs;
      if(subsActivos && subsActivos.length){
        _dialActiveSub=(_dialActiveSub===h)?-1:h;
        _dialSubHov=-1; _dialDraw();
      } else {
        _dialPreset={}; cerrarDial(); abrirFormulario(item.id);
      }
    } else {
      var dx=mx-_DC.CX,dy=my-_DC.CY;
      if(Math.sqrt(dx*dx+dy*dy)<_DC.R_IN){ _dialPreset={}; cerrarDial(); abrirFormulario('nueva'); }
    }
  });
}

function _dialHitTest(mx,my,ring){
  var dc=_DC,N=_DIAL_ITEMS.length,slice=Math.PI*2/N;
  var dx=mx-dc.CX,dy=my-dc.CY;
  var dist=Math.sqrt(dx*dx+dy*dy);
  var angle=Math.atan2(dy,dx)+Math.PI/2;
  if(angle<0) angle+=Math.PI*2;
  if(!ring){
    if(dist<dc.R_IN||dist>dc.R_OUT+14) return -1;
    return Math.min(Math.floor(angle/slice),N-1);
  } else {
    if(_dialActiveSub<0) return -1;
    var item=_DIAL_ITEMS[_dialActiveSub];
    var subsActivos=item._subsResueltos||item.subs;
    if(!subsActivos||!subsActivos.length) return -1;
    if(dist<dc.R_SI||dist>dc.R_SO+12) return -1;
    var pmidA=Math.PI*2*(_dialActiveSub+0.5)/N-Math.PI/2;
    var spread=Math.PI*0.50,nSub=subsActivos.length,subSlice=spread/nSub;
    var startA=pmidA-spread/2;
    var absA=Math.atan2(dy,dx);
    var diff=absA-startA;
    while(diff>Math.PI) diff-=Math.PI*2;
    while(diff<-Math.PI) diff+=Math.PI*2;
    if(diff<0||diff>spread) return -1;
    return Math.min(Math.floor(diff/subSlice),nSub-1);
  }
}

// Dibuja un sector con borde iluminado en el arco exterior (efecto 3D de referencia)
function _dialDrawSector(ctx,startA,endA,rOut,rIn,fill,accent,isActive){
  var dc=_DC;
  // Fondo del sector
  ctx.beginPath();
  ctx.moveTo(dc.CX+rIn*Math.cos(startA),dc.CY+rIn*Math.sin(startA));
  ctx.arc(dc.CX,dc.CY,rOut,startA,endA);
  ctx.lineTo(dc.CX+rIn*Math.cos(endA),dc.CY+rIn*Math.sin(endA));
  ctx.arc(dc.CX,dc.CY,rIn,endA,startA,true);
  ctx.closePath();
  ctx.fillStyle=fill; ctx.fill();
  // Borde lateral (separadores entre sectores)
  ctx.strokeStyle='rgba(255,255,255,0.10)'; ctx.lineWidth=1; ctx.stroke();

  // Borde exterior iluminado — el efecto "3D" de la referencia
  var glowA = isActive ? accent : 'rgba(255,255,255,0.28)';
  var glowW = isActive ? 3.5 : 2;
  ctx.save();
  ctx.shadowColor = isActive ? accent : 'rgba(255,255,255,0.4)';
  ctx.shadowBlur  = isActive ? 24 : 10;
  ctx.beginPath();
  ctx.arc(dc.CX,dc.CY,rOut,startA+0.01,endA-0.01);
  ctx.strokeStyle=glowA; ctx.lineWidth=glowW; ctx.stroke();
  ctx.restore();
  // Segundo pass para más intensidad
  if(isActive){
    ctx.save();
    ctx.globalAlpha=0.4;
    ctx.shadowColor=accent; ctx.shadowBlur=40;
    ctx.beginPath();
    ctx.arc(dc.CX,dc.CY,rOut,startA+0.01,endA-0.01);
    ctx.strokeStyle=accent; ctx.lineWidth=1.5; ctx.stroke();
    ctx.restore();
  }

  // Borde interior (el que da el efecto de anillo biselado interior)
  ctx.beginPath();
  ctx.arc(dc.CX,dc.CY,rIn+1,startA+0.01,endA-0.01);
  ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=1; ctx.stroke();
}

// ── Dibuja el centro RAW con hover y animación de pulso ──
function _dialDrawCentro(ctx, dc, isHov, pulseT){
  var pulse  = isHov ? (Math.sin(pulseT * 0.08) * 0.5 + 0.5) : 0;
  var glowAmt = isHov ? (30 + pulse * 25) : 14;
  var scaleR  = isHov ? (dc.R_IN + pulse * 6) : dc.R_IN;

  // Halo exterior animado — aparece solo en hover
  if(isHov){
    ctx.save();
    ctx.shadowColor = 'rgba(165,150,255,0.7)';
    ctx.shadowBlur  = 40 + pulse*20;
    ctx.beginPath();
    ctx.arc(dc.CX, dc.CY, scaleR + 4, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(165,150,255,' + (0.3 + pulse*0.3) + ')';
    ctx.lineWidth   = 2;
    ctx.stroke();
    ctx.restore();
    // Segundo halo más externo, más tenue
    ctx.save();
    ctx.beginPath();
    ctx.arc(dc.CX, dc.CY, scaleR + 14, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(140,120,255,' + (0.12 + pulse*0.15) + ')';
    ctx.lineWidth   = 1;
    ctx.stroke();
    ctx.restore();
  }

  // Fondo gradiente radial
  var g = ctx.createRadialGradient(dc.CX, dc.CY, 0, dc.CX, dc.CY, scaleR);
  if(isHov){
    g.addColorStop(0,   'rgba(40,36,80,0.99)');
    g.addColorStop(0.5, 'rgba(24,22,52,0.99)');
    g.addColorStop(1,   'rgba(10,10,22,0.99)');
  } else {
    g.addColorStop(0,   'rgba(28,28,50,0.98)');
    g.addColorStop(0.6, 'rgba(14,14,28,0.98)');
    g.addColorStop(1,   'rgba(8,8,16,0.98)');
  }
  ctx.beginPath();
  ctx.arc(dc.CX, dc.CY, scaleR, 0, Math.PI*2);
  ctx.fillStyle = g; ctx.fill();

  // Borde principal con glow
  ctx.save();
  ctx.shadowColor = isHov ? 'rgba(180,160,255,0.9)' : 'rgba(140,130,255,0.5)';
  ctx.shadowBlur  = isHov ? (glowAmt + pulse*10) : 16;
  ctx.beginPath();
  ctx.arc(dc.CX, dc.CY, scaleR, 0, Math.PI*2);
  ctx.strokeStyle = isHov
    ? 'rgba(180,160,255,' + (0.8 + pulse*0.2) + ')'
    : 'rgba(120,110,240,0.65)';
  ctx.lineWidth = isHov ? 2.5 : 1.8;
  ctx.stroke();
  ctx.restore();

  // Anillo interior secundario
  ctx.beginPath();
  ctx.arc(dc.CX, dc.CY, scaleR - 11, 0, Math.PI*2);
  ctx.strokeStyle = isHov
    ? 'rgba(160,140,255,' + (0.18 + pulse*0.12) + ')'
    : 'rgba(100,90,200,0.20)';
  ctx.lineWidth = 1; ctx.stroke();

  // ⇄ icono
  ctx.save();
  ctx.shadowColor = 'rgba(185,180,255,0.9)';
  ctx.shadowBlur  = isHov ? (16 + pulse*12) : 10;
  ctx.font        = '500 ' + (isHov ? 34 : 28) + 'px -apple-system,sans-serif';
  ctx.fillStyle   = isHov
    ? 'rgba(220,210,255,' + (0.9 + pulse*0.1) + ')'
    : 'rgba(165,180,252,0.8)';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⇄', dc.CX, dc.CY - 14);
  ctx.restore();

  // RAW label
  ctx.save();
  ctx.shadowColor = 'rgba(180,160,255,0.7)';
  ctx.shadowBlur  = isHov ? (10 + pulse*8) : 6;
  ctx.font        = 'bold ' + (isHov ? 22 : 18) + 'px -apple-system,sans-serif';
  ctx.fillStyle   = isHov ? '#e0d8ff' : '#c4b5fd';
  ctx.textAlign   = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RAW', dc.CX, dc.CY + 14);
  ctx.restore();
}

function _iniciarPulsoCentro(){
  if(_dialRAF) return;  // ya corriendo
  function loop(){
    _dialPulseT++;
    _dialDraw();
    _dialRAF = requestAnimationFrame(loop);
  }
  _dialRAF = requestAnimationFrame(loop);
}

function _detenerPulsoCentro(){
  if(_dialRAF){ cancelAnimationFrame(_dialRAF); _dialRAF=null; }
  _dialPulseT = 0;
}

function _dialDraw(){
  var ctx=_dialCtx;
  var dc=_DC;
  var N=_DIAL_ITEMS.length;
  var slice=Math.PI*2/N;

  ctx.clearRect(0,0,dc.W,dc.H);

  // Halo exterior del dial completo
  ctx.save();
  ctx.shadowColor='rgba(120,110,255,0.25)';
  ctx.shadowBlur=50;
  ctx.beginPath();
  ctx.arc(dc.CX,dc.CY,dc.R_OUT+2,0,Math.PI*2);
  ctx.strokeStyle='rgba(255,255,255,0.08)';
  ctx.lineWidth=1.5; ctx.stroke();
  ctx.restore();
  // Segundo halo — círculo grande muy tenue
  ctx.save();
  ctx.beginPath();
  ctx.arc(dc.CX,dc.CY,dc.R_OUT+18,0,Math.PI*2);
  ctx.strokeStyle='rgba(120,110,255,0.06)';
  ctx.lineWidth=8; ctx.stroke();
  ctx.restore();

  // ── Anillo principal ──
  for(var i=0;i<N;i++){
    var item   = _DIAL_ITEMS[i];
    var startA = -Math.PI/2 + i*slice + dc.GAP/2;
    var endA   = -Math.PI/2 + (i+1)*slice - dc.GAP/2;
    var midA   = (startA+endA)/2;
    var isHov  = (i===_dialHovered);
    var isAct  = (i===_dialActiveSub);

    // Sector activo/hover se eleva ligeramente (radio mayor)
    var rOut = (isHov||isAct) ? dc.R_OUT+14 : dc.R_OUT;
    var rIn  = dc.R_IN;

    var fill = isAct ? _DIAL_ACT : isHov ? _DIAL_HOVER : _DIAL_BASE;

    _dialDrawSector(ctx,startA,endA,rOut,rIn,fill,item.accent,(isHov||isAct));

    // Centroide — ligeramente más afuera del centro para aprovechar espacio
    var rMid = rIn + (rOut-rIn)*0.54;
    var cx   = dc.CX + rMid*Math.cos(midA);
    var cy   = dc.CY + rMid*Math.sin(midA);

    // Ícono — grande, con glow de color en hover
    var icoS = isHov||isAct ? 52 : 44;
    ctx.save();
    ctx.shadowColor = item.accent;
    ctx.shadowBlur  = isHov||isAct ? 28 : 12;
    item.draw(ctx,cx,cy-8,icoS,item.accent);
    ctx.restore();
    // Segundo pass de glow más intenso en hover/activo
    if(isHov||isAct){
      ctx.save();
      ctx.globalAlpha = 0.45;
      ctx.shadowColor = item.accent;
      ctx.shadowBlur  = 40;
      item.draw(ctx,cx,cy-8,icoS,item.accent);
      ctx.restore();
    }

    // Label — uppercase, bold, blanco, fuente mediana
    ctx.save();
    ctx.font         = 'bold '+(isHov||isAct?13:11)+'px -apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif';
    ctx.fillStyle    = '#ffffff';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    ctx.shadowColor  = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur   = 6;
    ctx.fillText(item.label.toUpperCase(), cx, cy+16);
    ctx.restore();

    // Indicador de sub — línea de acento en arco exterior del sector
    if(item.subs){
      ctx.save();
      ctx.shadowColor = item.accent;
      ctx.shadowBlur  = isAct ? 12 : 4;
      ctx.beginPath();
      ctx.arc(dc.CX,dc.CY,rOut-2,midA-0.10,midA+0.10);
      ctx.strokeStyle = isAct ? item.accent : item.accent+'99';
      ctx.lineWidth   = isAct ? 4 : 2;
      ctx.lineCap     = 'round';
      ctx.stroke();
      ctx.restore();
    }
  }

  // ── Subanillo ──
  if(_dialActiveSub>=0){
    var parent=_DIAL_ITEMS[_dialActiveSub];
    var _subsArr=parent._subsResueltos||parent.subs||[];
    var nSub=_subsArr.length;
    if(nSub>0){
      var pmidA  = Math.PI*2*(_dialActiveSub+0.5)/N - Math.PI/2;
      var spread = Math.PI*0.48;
      var subSlice = spread/nSub;
      var subGap   = 0.020;
      var subStart = pmidA - spread/2;

      for(var j=0;j<nSub;j++){
        var sub    = parent.subs[j];
        var sA     = subStart + j*subSlice + subGap/2;
        var eA     = subStart + (j+1)*subSlice - subGap/2;
        var smA    = (sA+eA)/2;
        var isShov = (j===_dialSubHov);
        var rso    = isShov ? dc.R_SO+10 : dc.R_SO;

        var sfill = isShov ? _DIAL_SHOV : _DIAL_SBASE;
        _dialDrawSector(ctx,sA,eA,rso,dc.R_SI,sfill,sub.accent,isShov);

        var srMid = dc.R_SI + (rso-dc.R_SI)*0.52;
        var scx   = dc.CX + srMid*Math.cos(smA);
        var scy   = dc.CY + srMid*Math.sin(smA);
        var sicoS = isShov ? 40 : 34;

        ctx.save();
        ctx.shadowColor=sub.accent;
        ctx.shadowBlur=isShov?18:7;
        sub.draw(ctx,scx,scy-7,sicoS,sub.accent);
        ctx.restore();

        ctx.save();
        ctx.font='bold '+(isShov?14:12)+'px -apple-system,BlinkMacSystemFont,sans-serif';
        ctx.fillStyle='#ffffff';
        ctx.textAlign='center';
        ctx.textBaseline='top';
        ctx.shadowColor='rgba(0,0,0,0.9)';
        ctx.shadowBlur=5;
        ctx.fillText(sub.label.toUpperCase(),scx,scy+12);
        ctx.restore();
      }
    }
  }

  // ── Centro — con hover y pulso ──
  _dialDrawCentro(ctx, dc, _dialCentroHov, _dialPulseT);
}

// ── Overlay HTML para Editar — input de ID antes del form ──
function _abrirEditarOverlay(){
  // Si ya existe, reusar
  var existing = document.getElementById('editar-id-overlay');
  if(existing){ existing.style.display='flex'; setTimeout(function(){ var inp=document.getElementById('editar-id-input-dial'); if(inp) inp.focus(); },80); return; }

  var ov = document.createElement('div');
  ov.id  = 'editar-id-overlay';
  ov.style.cssText = [
    'position:fixed','inset:0','z-index:9100',
    'display:flex','align-items:center','justify-content:center',
    'background:rgba(4,4,10,0.55)',
    'backdrop-filter:blur(24px) saturate(140%)',
    '-webkit-backdrop-filter:blur(24px) saturate(140%)',
  ].join(';');

  var box = document.createElement('div');
  box.style.cssText = [
    'background:rgba(14,14,24,0.97)',
    'border:1px solid rgba(165,180,252,0.25)',
    'border-radius:16px',
    'box-shadow:0 0 40px rgba(165,180,252,0.12),0 8px 48px rgba(0,0,0,0.7)',
    'padding:28px 28px 24px',
    'width:340px','max-width:92vw',
    'display:flex','flex-direction:column','gap:16px',
  ].join(';');

  box.innerHTML =
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:2px">' +
      '<span style="font-size:22px">✏️</span>' +
      '<div>' +
        '<div style="font-size:14px;font-weight:700;color:#e2e8f0;letter-spacing:.01em">Editar entrada</div>' +
        '<div style="font-size:11px;color:rgba(255,255,255,0.38);margin-top:1px">Ingresa el ID de la fila a editar</div>' +
      '</div>' +
    '</div>' +
    '<div style="display:flex;gap:8px">' +
      '<input id="editar-id-input-dial" type="number" min="1" placeholder="Ej: 142"' +
        ' style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(165,180,252,0.3);border-radius:10px;' +
        'color:#e2e8f0;font-size:22px;font-weight:600;padding:10px 14px;outline:none;font-family:inherit;' +
        'text-align:center;-webkit-appearance:none;appearance:none">' +
      '<button id="editar-id-btn-dial"' +
        ' style="background:rgba(165,180,252,0.15);border:1px solid rgba(165,180,252,0.35);border-radius:10px;' +
        'color:#a5b4fc;font-size:13px;font-weight:700;padding:10px 18px;cursor:pointer;font-family:inherit;' +
        'white-space:nowrap;transition:all .15s">' +
        'Buscar →' +
      '</button>' +
    '</div>' +
    '<div id="editar-id-msg-dial" style="font-size:11px;color:rgba(255,255,255,0.4);min-height:14px;text-align:center"></div>';

  ov.appendChild(box);
  document.body.appendChild(ov);

  // Cerrar al click fuera del box
  ov.addEventListener('click', function(e){ if(e.target===ov) ov.style.display='none'; });

  // Focus + enter
  setTimeout(function(){
    var inp = document.getElementById('editar-id-input-dial');
    if(inp){
      inp.focus();
      inp.addEventListener('keydown', function(e){
        if(e.key==='Enter') _confirmarEditarId();
        if(e.key==='Escape') ov.style.display='none';
      });
      // Estilo focus
      inp.addEventListener('focus', function(){ inp.style.borderColor='rgba(165,180,252,0.7)'; inp.style.boxShadow='0 0 0 2px rgba(165,180,252,0.18)'; });
      inp.addEventListener('blur',  function(){ inp.style.borderColor='rgba(165,180,252,0.3)'; inp.style.boxShadow='none'; });
    }
    var btn = document.getElementById('editar-id-btn-dial');
    if(btn){
      btn.addEventListener('click', _confirmarEditarId);
      btn.addEventListener('mouseenter', function(){ btn.style.background='rgba(165,180,252,0.25)'; btn.style.color='#c4b5fd'; });
      btn.addEventListener('mouseleave', function(){ btn.style.background='rgba(165,180,252,0.15)'; btn.style.color='#a5b4fc'; });
    }
  }, 80);
}

function _confirmarEditarId(){
  var inp = document.getElementById('editar-id-input-dial');
  var msg = document.getElementById('editar-id-msg-dial');
  if(!inp) return;
  var id  = parseInt(inp.value,10);
  if(!id || id < 1){
    msg.textContent='Ingresa un ID válido';
    msg.style.color='#f87171';
    inp.focus(); return;
  }
  msg.textContent='Buscando…'; msg.style.color='rgba(255,255,255,0.4)';
  // Ocultar overlay y abrir form de editar con ID pre-cargado
  var ov = document.getElementById('editar-id-overlay');
  if(ov) ov.style.display='none';
  _dialPreset = { tab:'editar', filaId:id };
  cerrarDial();
  abrirFormulario('editar');
}

function toggleEntradaDropdown(){
  if(_dialVisible) cerrarDial(); else abrirDial();
}

function abrirDial(){
  _crearDialOverlay();
  _dialHovered=-1; _dialSubHov=-1; _dialActiveSub=-1; _dialCentroHov=false; _detenerPulsoCentro();
  _dialDraw();
  _dialOverlay.style.display='flex';
  _dialVisible=true;
  // Ocultar panel nav en pantallas pequeñas
  var navPanel=document.getElementById('dial-nav-panel');
  if(navPanel) navPanel.style.display=window.innerWidth<900?'none':'flex';
  var btn=document.getElementById('btn-nueva-entrada');
  if(btn) btn.classList.add('active');
}

function cerrarDial(){
  if(_dialOverlay) _dialOverlay.style.display='none';
  _dialVisible=false; _dialActiveSub=-1; _dialCentroHov=false; _detenerPulsoCentro();
  var btn=document.getElementById('btn-nueva-entrada');
  if(btn) btn.classList.remove('active');
}

function abrirFormulario(modo){
  var dd=document.getElementById('entrada-dropdown');
  if(dd){
    dd.style.cssText='position:fixed;inset:0;z-index:9001;display:flex;align-items:center;justify-content:center;background:rgba(4,4,10,0.5);backdrop-filter:blur(24px) saturate(150%);-webkit-backdrop-filter:blur(24px) saturate(150%)';
    dd.classList.add('show');
    // Cerrar al click fuera del formulario — solo registrar una vez
    if(!dd._dialClickOut){
      dd._dialClickOut=true;
      dd.addEventListener('click',function(e){
        if(e.target===dd) cerrarEntrada();
      });
    }
  }
  var inner=document.getElementById('sec-entrada');
  if(inner){
    inner.style.cssText='background:rgba(14,14,22,0.97);border:1px solid rgba(255,255,255,0.10);border-radius:16px;box-shadow:0 8px 48px rgba(0,0,0,0.7),0 0 0 1px rgba(120,110,240,0.15);width:420px;max-width:94vw;max-height:88vh;overflow-y:auto;display:flex;flex-direction:column';
  }
  if(typeof _inyectarToggleModo==='function') _inyectarToggleModo();
  var tabs=document.getElementById('toggle-modo-wrap');
  if(tabs) tabs.style.display='none';
  var p1=document.getElementById('entrada-paso1');
  var p2=document.getElementById('entrada-paso2');
  if(p1) p1.style.display='none';
  if(p2) p2.style.display='block';
  if(typeof setModoEntrada==='function') setModoEntrada(modo);
  // ── Aplicar preset del dial con requestIdleCallback ──
  if(_dialPreset && Object.keys(_dialPreset).length){
    var presetSnap = JSON.parse(JSON.stringify(_dialPreset));
    setTimeout(function(){ _aplicarDialPreset(presetSnap); }, 120);
    _dialPreset = {};
  }
}

// Aplica el contexto pre-seleccionado desde el dial al formulario abierto
function _aplicarDialPreset(p){
  // Helper: click en opt button cuyo texto coincide con val
  function selectOpt(swId, val){
    var w=document.getElementById(swId); if(!w) return;
    w.querySelectorAll('.opt').forEach(function(b){
      if(b.textContent.trim()===val){ if(!b.classList.contains('on')) b.click(); }
    });
  }
  // Helper: setear valor en campo hidden o input
  function setVal(id, val){
    var el=document.getElementById('cv-'+id)||document.getElementById(id);
    if(!el) return;
    el.textContent=val; el.value=val;
    el.classList.remove('empty');
  }

  // ── Nutrición: momento del día ──
  if(p.momento){
    selectOpt('sw-momento', p.momento);
    setVal('momento', p.momento);
  }

  // ── Entrenamiento: tipo ──
  if(p.tipo && p.tab==='entrenamiento'){
    selectOpt('sw-tipo-entrena', p.tipo);
    setVal('tipo', p.tipo);
  }

  // ── Salud: tipo de registro ──
  if(p.tipo && p.tab==='salud'){
    selectOpt('sw-tipo-salud', p.tipo);
    setVal('tipo-salud', p.tipo);
  }

  // ── Patrimonio: tipo ──
  if(p.tipo && p.tab==='patrimonio'){
    selectOpt('sw-tipo-patrimonio', p.tipo);
    setVal('tipo-patrimonio', p.tipo);
  }

  // ── Pensamiento: categoría ──
  if(p.categoria){
    selectOpt('sw-cat-pensamiento', p.categoria);
    setVal('categoria', p.categoria);
  }

  // ── Persona: energía ──
  if(p.energia !== undefined){
    var eMap = {1:'Positiva', 0:'Neutral', '-1':'Negativa'};
    var eLabel = eMap[String(p.energia)] || eMap[p.energia];
    if(eLabel){ selectOpt('sw-energia-persona', eLabel); setVal('energia', eLabel); }
  }

  // ── Bancos: banco específico ──
  if(p.banco){
    selectOpt('sw-banco', p.banco);
    setVal('banco', p.banco);
    // Intentar abrir la fila del banco directamente
    var entes=document.querySelectorAll('.ente-nombre');
    entes.forEach(function(el){
      if(el.textContent.trim()===p.banco){
        var row=el.closest('.ente-row'); if(row) row.click();
      }
    });
  }

  // ── Editar: ID de fila — cargar directamente ──
  if(p.tab==='editar' && p.filaId){
    // Poner el ID en el input del form y disparar búsqueda
    setTimeout(function(){
      var inp=document.getElementById('editar-id-input');
      if(inp){ inp.value=p.filaId; if(typeof buscarFilaId==='function') buscarFilaId(); }
    }, 80);
  }

  // ── Activity: tab ──
  if(p.tab && ['libro','movie','norut'].includes(p.tab)){
    var btn=document.getElementById('btn-tab-'+p.tab);
    if(btn && !btn.classList.contains('on')) btn.click();
  }
}

function cerrarEntrada(){
  cerrarDial();
  var dd=document.getElementById('entrada-dropdown');
  var btn=document.getElementById('btn-nueva-entrada');
  if(dd){ dd.classList.remove('show'); dd.style.display='none'; }
  if(btn) btn.classList.remove('active');
  var p1=document.getElementById('entrada-paso1');
  var p2=document.getElementById('entrada-paso2');
  if(p1) p1.style.display='block';
  if(p2) p2.style.display='none';
}

function volverAPaso1(){ cerrarEntrada(); abrirDial(); }
function abrirEntrada(){ abrirDial(); }
function _abrirEntradaLegacy(){ abrirDial(); }
function _posicionarRadial(){}




// ══════════════════════════════════════════
//  GUARDAR BANCO
// ══════════════════════════════════════════
function guardarBanco(){
  const nombre=document.getElementById('banco-nombre').value.trim();
  const monto=parseFloat(document.getElementById('banco-monto').value);
  const fecha=document.getElementById('banco-fecha').value;
  if(!nombre||isNaN(monto)||!fecha){ showToast('Completa todos los campos',false); return; }
  const btn=document.querySelector('#form-banco-wrap .btn-save');
  btn.disabled=true;
  api.guardarEnBancos(nombre,monto,fecha)
    .then(r=>{
      btn.disabled=false;
      if(r.ok){
        showToast('✓ Banco guardado');var sb=document.querySelector('.btn-save');if(sb){sb.classList.add('saved');setTimeout(function(){sb.classList.remove('saved');},1200);}  
        document.getElementById('banco-nombre').value='';
        document.getElementById('banco-monto').value='';
        const bfEl=document.getElementById('banco-fecha'); if(bfEl) bfEl.value=fmtD(new Date());
        api.getFijos().then(renderEntes);
      } else { showToast(r.mensaje||'Error',false); }
    })
    .catch(()=>{ btn.disabled=false; showToast('Error al guardar',false); });
}

// ══════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════
function togGraf(bodyId){
  var body=document.getElementById(bodyId); if(!body)return;
  var isOpen=body.style.display!=='none';
  body.style.display=isOpen?'none':'block';
  var chevId=bodyId.replace('-body','-chev');
  var chev=document.getElementById(chevId);
  if(chev) chev.style.transform=isOpen?'':'rotate(180deg)';
  if(!isOpen){ setTimeout(function(){ var canvas=body.querySelector('canvas'); if(canvas&&canvas._chart) canvas._chart.resize(); window.dispatchEvent(new Event('resize')); },50); }
}

window.addEventListener('DOMContentLoaded',()=>{
  const hoy=fmtD(new Date());
  const fechaEl=document.getElementById('fecha');
  if(fechaEl) fechaEl.value=hoy;
  _inyectarToggleModo();

  setChip('load','Cargando');
  api.getAll()
    .then(d=>{
      if(!d.ok&&!d.catalogos){ setChip('err','Error'); mostrarErrorConexion('getAll falló: '+(d.error||'sin datos')); return; }
      sheetUrl=d.sheetUrl||'';
      onCats(d.catalogos);
      if(typeof renderApartados==='function') renderApartados(d.apartados||{items:[],totalApartado:0});
      if(typeof renderEntes==='function') renderEntes(d.fijos);
      if(typeof onDatosMes==='function') onDatosMes(d.datosMes);
      if(typeof renderAnualidad==='function') renderAnualidad(d.gastos);
      if(typeof renderLogros==='function') renderLogros(d.logros);
      if(typeof renderNecesidades==='function') renderNecesidades(d.necesidades);
      if(typeof renderNecesidadesInline==='function'){
        renderNecesidadesInline(d.necesidades);
        setTimeout(function(){ if(typeof actualizarNecInline==='function') actualizarNecInline(); },50);
      }
      if(typeof renderFlujoMensual==='function') renderFlujoMensual(d.flujoPorMes);
      if(d.activityCheck){ _actData=d.activityCheck; }
      if(typeof renderFinancieroAvanzado==='function'&&d.financieroAvanzado) renderFinancieroAvanzado(d.financieroAvanzado);
      api.getPensamientos().then(r=>{ if(typeof renderPensamientos==='function') renderPensamientos(r); }).catch(()=>{});
      api.getRelaciones().then(r=>{ if(typeof renderRelaciones==='function') renderRelaciones(r); }).catch(()=>{});
      api.getSalud().then(r=>{ if(typeof renderSalud==='function') renderSalud(r); }).catch(()=>{});
      if(typeof cargarScore==='function') cargarScore();
      api.getPatrimonio().then(r=>{ if(typeof renderPatrimonio==='function') renderPatrimonio(r); }).catch(()=>{});
      if(typeof cargarRevision==='function') cargarRevision('mensual',new Date().getFullYear(),new Date().getMonth()+1,null);
    })
    .catch(err=>{ setChip('err','Error'); mostrarErrorConexion(err.message); });

  initTooltip();
  _initMobTablero();
  const bfEl=document.getElementById('banco-fecha'); if(bfEl) bfEl.value=fmtD(new Date());
  _initEncomTheme();
});

// ══════════════════════════════════════════
//  ENCOM THEME
// ══════════════════════════════════════════
function _initEncomTheme(){
  if(localStorage.getItem('lifeos_theme')==='encom'){
    document.documentElement.classList.add('encom');
    _updateEncomBtn(true);
  }
}
function toggleEncomTheme(){
  const isEncom=document.documentElement.classList.toggle('encom');
  localStorage.setItem('lifeos_theme',isEncom?'encom':'default');
  _updateEncomBtn(isEncom);
  showToast(isEncom?'⬡ ENCOM MODE ON':'● Default Mode',true);
}
function _updateEncomBtn(active){
  const btn=document.getElementById('btn-encom-toggle'); if(!btn)return;
  btn.title=active?'Desactivar Encom Mode':'Activar Encom Mode';
}
function mostrarErrorConexion(msg){
  const d=document.createElement('div');
  d.style.cssText='position:fixed;top:60px;left:8px;right:8px;z-index:9999;background:#EF4444;color:#fff;padding:12px 16px;border-radius:12px;font-size:13px;font-weight:600';
  d.innerHTML='⚠ <b>Error de conexión:</b> '+msg;
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
  const p=str.split('-'); if(p.length!==3)return str;
  const d=new Date(Number(p[0]),Number(p[1])-1,Number(p[2]));
  return DIAS[d.getDay()]+' '+p[2]+'/'+p[1];
}
function fmtMoneda(v){
  if(v===null||v===undefined||v==='')return{txt:'—',cls:'z'};
  const n=Number(v); if(isNaN(n))return{txt:'—',cls:'z'};
  if(n===0)return{txt:'$ 0',cls:'z'};
  const abs='$ '+Math.abs(n).toLocaleString('es-MX',{minimumFractionDigits:2,maximumFractionDigits:2});
  return n>0?{txt:abs,cls:'pos'}:{txt:'− '+abs,cls:'neg'};
}
function setChip(t,txt){
  ['chip','chip2'].forEach(id=>{ const c=document.getElementById(id); if(c)c.className='hero-chip '+t; });
  ['chip-txt','chip-txt2'].forEach(id=>{ const ct=document.getElementById(id); if(ct)ct.textContent=txt; });
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
function togKard(id){ const el=document.getElementById(id);if(!el)return;const isOpen=el.style.display==='block';el.style.display=isOpen?'none':'block'; }
function togSec(hdr){
  const isMob=document.documentElement.classList.contains('mob'); if(!isMob)return;
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
  CAMPOS.forEach(f=>{ const el=document.getElementById('cf-'+f); if(el)el.classList.remove('active'); });
  const el=document.getElementById('cf-'+id);
  if(el){ el.classList.add('active'); setTimeout(()=>{ const inp=el.querySelector('input:not([readonly])'); if(inp&&inp.type!=='date')inp.focus(); },50); }
}
function avanzarA(id){ const idx=CAMPOS.indexOf(id); if(idx<CAMPOS.length-1)activarCampo(CAMPOS[idx+1]); }
function marcarDone(id){ const el=document.getElementById('cf-'+id); if(el)el.classList.add('done'); }
function setFieldVal(id,val,empty=false){ const el=document.getElementById('cv-'+id);if(!el)return;el.textContent=val;el.classList.toggle('empty',empty); }
function onFechaChange(){ const v=document.getElementById('fecha').value; marcarDone('fecha'); }
function onClaveChange(){ const v=document.getElementById('clave').value.trim(); setFieldVal('clave',v||'Opcional',!v); }

// ══════════════════════════════════════════
//  CATÁLOGOS
// ══════════════════════════════════════════
function onCats(d){
  cats=d;
  buildOpts('sw-proyecto',d.proyectos,v=>{proxSel=v;setFieldVal('proyecto',v);marcarDone('proyecto');avanzarA('proyecto');});
  buildOpts('sw-contacto',d.contactos,v=>{contactoSel=v;setFieldVal('contacto',v);marcarDone('contacto');avanzarA('contacto');});
  buildOpts('sw-recurrencia',d.recurrencias,v=>{recSel=v;setFieldVal('recurrencia',v);marcarDone('recurrencia');avanzarA('recurrencia');});
  if(d.necesidades&&d.necesidades.length){ buildOptsNecesidad('sw-necesidad',d.necesidades,v=>{necesidadSel=v;setFieldVal('necesidad',v.slice(0,30)+'…');marcarDone('necesidad');avanzarA('necesidad');}); }
  setChip('ok','Listo');
  var chipEl=document.getElementById('chip');
  if(chipEl&&!chipEl._refreshBound){
    chipEl._refreshBound=true; chipEl.style.cursor='pointer'; chipEl.title='Click para actualizar';
    chipEl.addEventListener('click',function(){
      _actData=null; setChip('load','Cargando');
      api.getAll().then(function(d){
        if(!d.ok&&!d.catalogos){ setChip('err','Error'); return; }
        sheetUrl=d.sheetUrl||''; onCats(d.catalogos);
        if(typeof renderApartados==='function') renderApartados(d.apartados||{items:[],totalApartado:0});
        if(typeof renderEntes==='function') renderEntes(d.fijos);
        if(typeof onDatosMes==='function') onDatosMes(d.datosMes);
        if(typeof renderAnualidad==='function') renderAnualidad(d.gastos);
        if(typeof renderLogros==='function') renderLogros(d.logros);
        if(typeof renderNecesidades==='function') renderNecesidades(d.necesidades);
        if(typeof renderNecesidadesInline==='function'){ renderNecesidadesInline(d.necesidades); setTimeout(function(){ if(typeof actualizarNecInline==='function') actualizarNecInline(); },50); }
        if(typeof renderFlujoMensual==='function') renderFlujoMensual(d.flujoPorMes);
        if(d.activityCheck){ _actData=d.activityCheck; if(typeof renderActivity==='function'&&_pantalla==='activity') renderActivity(); }
        if(typeof renderFinancieroAvanzado==='function'&&d.financieroAvanzado) renderFinancieroAvanzado(d.financieroAvanzado);
        setChip('ok','Listo ↺'); showToast('✓ Datos actualizados');
      }).catch(function(){ setChip('err','Error'); });
    });
  }
}
function buildOptsNecesidad(id,items,cb){
  const w=document.getElementById(id);if(!w)return;w.innerHTML='';
  const COLORES=['#3B82F6','#4ADE80','#F59E0B','#EC4899','#8B5CF6'];
  items.forEach((it,i)=>{
    const b=document.createElement('button');b.className='opt';
    const m=it.match(/^(\d+)\.\s+(\w+)/);
    b.textContent=m?m[1]+'. '+m[2]:it.slice(0,20); b.title=it;
    b.style.borderColor=COLORES[i%5]+'44';
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
function abrirConcepto(){ activarCampo('concepto'); renderConceptoPopup(''); document.getElementById('popup-concepto').classList.add('show'); setTimeout(()=>document.getElementById('pop-search').focus(),80); }
function cerrarConcepto(e){ if(e&&e.target!==document.getElementById('popup-concepto'))return; document.getElementById('popup-concepto').classList.remove('show'); document.getElementById('pop-search').value=''; }
function filtrarConcepto(){ renderConceptoPopup(document.getElementById('pop-search').value); }
function renderConceptoPopup(q){
  const items=(cats.conceptos||[]).filter(i=>!q||i.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'}));
  const body=document.getElementById('pop-body');
  if(!items.length){body.innerHTML='<div style="text-align:center;padding:24px;color:var(--m)">Sin resultados</div>';return;}
  const actual=document.getElementById('cv-concepto').classList.contains('empty')?'':document.getElementById('cv-concepto').textContent.trim();
  const grupos={};
  items.forEach(it=>{const l=it[0].toUpperCase().replace(/[^A-Z0-9]/,'#');if(!grupos[l])grupos[l]=[];grupos[l].push(it);});
  body.innerHTML=Object.keys(grupos).sort().map(l=>`<div class="pop-grupo-lbl">${l}</div><div class="pop-items">${grupos[l].map(it=>`<div class="pop-item${it===actual?' on':''}" onclick="selConcepto('${it.replace(/'/g,"\\'")}')">${it}</div>`).join('')}</div>`).join('');
}
function selConcepto(val){ setFieldVal('concepto',val);marcarDone('concepto'); document.getElementById('popup-concepto').classList.remove('show'); document.getElementById('pop-search').value=''; avanzarA('concepto'); }
document.addEventListener('keydown',e=>{ if(e.key==='Escape') document.getElementById('popup-concepto').classList.remove('show'); });

// ══════════════════════════════════════════
//  MONTO
// ══════════════════════════════════════════
function setSign(s){ sign=s; document.getElementById('sbp').className='msign'+(s===1?' pos':''); document.getElementById('sbn').className='msign'+(s===-1?' neg':''); upM(); }
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
  api.getSaldoDia(f).then(r=>{el.textContent=r.display;el.className='saldo-val '+(r.valor>0?'pos':r.valor<0?'neg':'')+' updated';setTimeout(function(){el.classList.remove('updated');},500);}).catch(()=>{el.className='saldo-val ld';el.textContent='—';});
}

// ══════════════════════════════════════════
//  GUARDAR
// ══════════════════════════════════════════
function guardar(){
  const fecha=document.getElementById('fecha').value;
  const concepto=document.getElementById('cv-concepto').classList.contains('empty')?'':document.getElementById('cv-concepto').textContent.trim();
  const monto=(parseFloat(document.getElementById('monto').value)||0)*sign;
  if(_modoEditar){
    if(!_filaEditar){mostrarRes(false,'Busca un ID primero');return;}
  } else {
    const errs=[];
    if(!fecha)errs.push('Fecha');if(!proxSel)errs.push('Proyecto');if(!contactoSel)errs.push('Contacto');
    if(!concepto)errs.push('Concepto');if(monto===0)errs.push('Monto');if(!recSel)errs.push('Recurrencia');
    if(errs.length){ mostrarRes(false,'Faltan: '+errs.join(', ')); return; }
  }
  ocultarRes();progStart();setBtn(true);
  const claveVal=document.getElementById('clave').value.trim();
  const payload={fecha,proyecto:proxSel,contacto:contactoSel,concepto,monto,recurrencia:recSel,necesidad:necesidadSel,clave:claveVal};
  const promesa=_modoEditar&&_filaEditar?api.editarFilaRAW(_filaEditar,payload):api.insertarEnRAW(payload);
  promesa.then(r=>{
    progDone();setBtn(false);mostrarRes(r.ok,r.mensaje);showToast(r.ok?'✓ Guardado':'Error al guardar',r.ok);
    if(r.ok){ limpiar(false);consultarSaldo();api.getFijos().then(renderEntes);api.getGastos().then(renderAnualidad);api.getDatosMes().then(onDatosMes);setTimeout(cerrarEntrada,800); }
  }).catch(e=>{progDone();setBtn(false);mostrarRes(false,'Error: '+e.message);showToast('Error',false);});
}
function setBtn(l){ const b=document.getElementById('btnG');if(b)b.disabled=l;const sp=document.getElementById('spin');if(sp)sp.style.display=l?'block':'none';const bi=document.getElementById('bico');if(bi)bi.style.display=l?'none':'inline'; }
function mostrarRes(ok,msg){ const el=document.getElementById('save-res');document.getElementById('res-ico').textContent=ok?'✓':'✗';document.getElementById('res-msg').textContent=msg;el.className='save-res '+(ok?'ok':'err'); }
function ocultarRes(){ document.getElementById('save-res').className='save-res'; }
function limpiar(rf=true){
  if(rf){const fEl=document.getElementById('fecha');if(fEl)fEl.value=fmtD(new Date());}
  ['proyecto','contacto','recurrencia'].forEach(k=>{document.querySelectorAll(`#sw-${k} .opt`).forEach(b=>b.classList.remove('on'));setFieldVal(k,'',true);});
  proxSel='';contactoSel='';recSel='';necesidadSel='';
  document.querySelectorAll('#sw-necesidad .opt').forEach(b=>b.classList.remove('on'));setFieldVal('necesidad','',true);
  document.getElementById('monto').value='';document.getElementById('clave').value='';
  setFieldVal('concepto','',true);setFieldVal('monto','$ 0.00',true);setFieldVal('clave','',true);
  CAMPOS.forEach(f=>{const e=document.getElementById('cf-'+f);if(e)e.classList.remove('done');});
  setSign(1);upM();ocultarRes();activarCampo('fecha');
}
function irASheet(){ var url=sheetUrl||'https://docs.google.com/spreadsheets/d/15T14Hb7tvmv24ZAaC3su1NRtDwVS6-dWbJGxQYUGP1o/edit';window.open(url,'_blank'); }

// ══════════════════════════════════════════
//  SHEETS EMBED
// ══════════════════════════════════════════
const SHEETS_CONFIG=[{id:'raw',label:'RAW',emoji:'📄',gid:'0',spreadsheetId:'15T14Hb7tvmv24ZAaC3su1NRtDwVS6-dWbJGxQYUGP1o'}];

/* ═══════════════════════════════════════════════════════
   NAVEGACIÓN — funciones de nav robustas
═══════════════════════════════════════════════════════ */

/* ── NAVEGACIÓN — stubs de fallback
   Solo se definen si el GAS no los inyectó primero.
   El GAS define: irABitacora, irAActivity, irANutricion,
                  volverAlAnverso, _syncMobTab, _setPantalla
   Si corren en GAS → estas líneas no hacen nada (typeof !== 'undefined')
   Si corren localmente → proporcionan navegación básica por CSS
── */

var _panelActual = 'anverso';

// Helper interno — manipula clases CSS directamente
function _irAPanel(boardId, tabKey){
  var esAnverso = (boardId === 'board-anverso');

  // Toggle: si ya estás aquí, vuelve al anverso
  if(!esAnverso && _panelActual === boardId){
    if(typeof volverAlAnverso==='function') volverAlAnverso();
    return;
  }
  _panelActual = esAnverso ? 'anverso' : boardId;

  // Anverso: slide
  var anverso = document.getElementById('board-anverso');
  if(anverso){
    if(esAnverso) anverso.classList.remove('slide-right','slide-left');
    else          anverso.classList.add('slide-right');
  }

  // Paneles secundarios
  document.querySelectorAll('.board-face:not(.anverso)').forEach(function(f){
    f.classList.remove('active');
  });
  if(!esAnverso){
    var dest = document.getElementById(boardId);
    if(dest) dest.classList.add('active');
  }

  // Hero btns
  document.querySelectorAll('.btn-flip').forEach(function(b){ b.classList.remove('active'); });
  var bh = document.getElementById('btn-home');
  if(bh) bh.classList.toggle('on', esAnverso);
  var ids = {'logros':'btn-logros','bitacora':'btn-maslow',
              'activity':'btn-activity','nutricion':'btn-nutricion','sheets':'btn-sheets'};
  var heroBtn = document.getElementById(ids[tabKey] || ('btn-'+tabKey));
  if(heroBtn) heroBtn.classList.add('active');

  // Mob tabs
  document.querySelectorAll('.mob-tab').forEach(function(t){
    t.classList.toggle('active', t.dataset.tab === tabKey);
  });
}

// Cada función solo se define si el GAS no la definió primero
// Stubs como window assignments — el GAS puede sobreescribirlos en cualquier momento
// (function declarations quedan hoisted y no se pueden pisar)
window.volverAlAnverso = window.volverAlAnverso || function(){
  _panelActual = 'anverso';
  var anv = document.getElementById('board-anverso');
  if(anv) anv.classList.remove('slide-right','slide-left');
  document.querySelectorAll('.board-face:not(.anverso)').forEach(function(f){ f.classList.remove('active'); });
  var bh = document.getElementById('btn-home'); if(bh) bh.classList.add('on');
  document.querySelectorAll('.btn-flip').forEach(function(b){ b.classList.remove('active'); });
  document.querySelectorAll('.mob-tab').forEach(function(t){ t.classList.toggle('active', t.dataset.tab==='entrada'); });
  var dd = document.getElementById('entrada-dropdown');
  if(dd){ dd.classList.remove('show'); dd.style.display='none'; }
};

window.irABitacora = window.irABitacora || function(){
  _irAPanel('board-bitacora','bitacora');
};

window.irAActivity = window.irAActivity || function(){
  _irAPanel('board-activity','activity');
  if(typeof renderActivity==='function' && window._actData) renderActivity();
};

window.irANutricion = window.irANutricion || function(){
  _irAPanel('board-nutricion','nutricion');
};

window._syncMobTab = window._syncMobTab || function(tabKey){
  document.querySelectorAll('.mob-tab').forEach(function(t){
    t.classList.toggle('active', t.dataset.tab===tabKey);
  });
};

/* ── FALLBACKS Activity y Nutrición ── */
document.addEventListener('DOMContentLoaded', function(){

  // Solo crear fallback si el GAS no definió renderActivity
  if(typeof window.renderActivity !== 'function'){
    window.renderActivity = function(){
      var d = window._actData; if(!d) return;
      var tabsEl = document.getElementById('act-tabs');
      var cont   = document.getElementById('act-container');
      if(!cont) return;

      var TABS = [
        {k:'personal',    l:'Personal',      ico:'🧘', items: d.habitosPersonal||[]},
        {k:'electronics', l:'Electronics',   ico:'⚡', items: d.habitosElectronics||[]},
        {k:'libros',      l:'Libros',        ico:'📚', items: d.libros||[]},
        {k:'movies',      l:'Movies',        ico:'🎬', items: d.movies||[]},
        {k:'norut',       l:'No Rutinarias', ico:'✨', items: d.noRutinarias||[]},
      ];

      if(tabsEl){
        tabsEl.innerHTML = TABS.map(function(t,i){
          return '<button class="rev-pill act-tab-btn" data-tab-key="'+t.k+'" style="opacity:'+(i===0?'1':'0.4')+'">'+t.ico+' '+t.l+' <span style="font-size:9px;opacity:.5">'+t.items.length+'</span></button>';
        }).join('');
        tabsEl.addEventListener('click',function(e){
          var b=e.target.closest('.act-tab-btn'); if(b) window._actShowTab(b.dataset.tabKey);
        });
      }
      window._actShowTab('personal');
    };

    window._actShowTab = function(key){
      var d = window._actData; if(!d) return;
      var cont = document.getElementById('act-container'); if(!cont) return;

      // Highlight tab
      document.querySelectorAll('.act-tab-btn').forEach(function(b){
        b.style.opacity = (b.dataset.tabKey === key) ? '1' : '0.4';
      });

      var DIAS = ['L','M','W','J','V','S','D'];
      var DLBL = {L:'Lun',M:'Mar',W:'Mié',J:'Jue',V:'Vie',S:'Sáb',D:'Dom'};
      var diaKey = DIAS[(new Date().getDay()+6)%7];

      var items;
      var tipo = 'habito';
      if(key==='personal')     { items = d.habitosPersonal||[];    tipo='habito'; }
      else if(key==='electronics'){ items = d.habitosElectronics||[]; tipo='habito'; diasKeys=['L','M','W','J','V']; }
      else if(key==='libros')  { items = d.libros||[];             tipo='lista'; }
      else if(key==='movies')  { items = d.movies||[];             tipo='lista'; }
      else if(key==='norut')   { items = d.noRutinarias||[];       tipo='lista'; }

      var diasKeys = (key==='electronics') ? ['L','M','W','J','V'] : DIAS;

      if(!items.length){
        cont.innerHTML = '<div style="padding:40px;text-align:center;color:rgba(255,255,255,.25);font-size:12px">Sin registros</div>';
        return;
      }

      if(tipo==='habito'){
        var h = '<table style="width:100%;border-collapse:collapse">';
        // Header
        h += '<tr><th style="text-align:left;padding:7px 20px;font-size:9px;letter-spacing:.10em;text-transform:uppercase;color:rgba(255,255,255,.28);border-bottom:1px solid rgba(255,255,255,.07);font-weight:700">Hábito</th>';
        diasKeys.forEach(function(dia){
          var esH = (dia===diaKey);
          h += '<th style="text-align:center;padding:7px 4px;font-size:9px;font-weight:'+(esH?800:600)+';color:'+(esH?'#fff':'rgba(255,255,255,.28)')+';border-bottom:1px solid rgba(255,255,255,.07);min-width:48px">'+DLBL[dia]+'</th>';
        });
        h += '</tr>';
        // Filas
        items.forEach(function(hab){
          h += '<tr>';
          h += '<td style="padding:10px 20px;border-bottom:1px solid rgba(255,255,255,.04)">';
          if(hab.sims||hab.bw) h += '<div style="font-size:8px;color:rgba(255,255,255,.25);text-transform:uppercase;letter-spacing:.08em;margin-bottom:1px">'+(hab.sims||hab.bw)+'</div>';
          h += '<div style="font-size:12px;font-weight:600;color:rgba(255,255,255,.82)">'+hab.nombre+'</div></td>';
          diasKeys.forEach(function(dia){
            var chk = hab.checks && hab.checks[dia];
            var esH = (dia===diaKey);
            h += '<td style="text-align:center;padding:8px 4px;border-bottom:1px solid rgba(255,255,255,.04)">';
            h += '<div class="_act-chk" data-fila="'+hab.fila+'" data-dia="'+dia+'" style="width:28px;height:28px;border-radius:50%;border:'+(esH?2:1.5)+'px solid '+(chk?'rgba(74,222,128,.7)':'rgba(255,255,255,'+(esH?.28:.14)+')')+';background:'+(chk?'rgba(74,222,128,.18)':'transparent')+';display:flex;align-items:center;justify-content:center;cursor:pointer;margin:auto;transition:all .12s">';
            if(chk) h += '<i class="fas fa-check" style="font-size:9px;color:#4ADE80;pointer-events:none"></i>';
            h += '</div></td>';
          });
          h += '</tr>';
        });
        h += '</table>';
        cont.innerHTML = h;
        cont.querySelectorAll('._act-chk').forEach(function(el){
          el.addEventListener('click', function(){
            var circle = this;
            var checked = !!circle.querySelector('.fa-check');
            circle.style.borderColor = checked ? 'rgba(255,255,255,.14)' : 'rgba(74,222,128,.7)';
            circle.style.background  = checked ? 'transparent' : 'rgba(74,222,128,.18)';
            circle.innerHTML = checked ? '' : '<i class="fas fa-check" style="font-size:9px;color:#4ADE80;pointer-events:none"></i>';
            if(typeof api!=='undefined') api.setActivityCheck('personal', parseInt(this.dataset.fila), this.dataset.dia, !checked);
          });
        });
      } else {
        // Lista (libros, movies, noRutinarias)
        cont.innerHTML = '<div style="padding:0 20px;display:flex;flex-direction:column;gap:2px">'+
          items.map(function(it){
            return '<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.04)">'+
              '<div style="width:24px;height:24px;border-radius:50%;border:1.5px solid '+(it.completado?'rgba(74,222,128,.6)':'rgba(255,255,255,.2)')+';background:'+(it.completado?'rgba(74,222,128,.15)':'transparent')+';display:flex;align-items:center;justify-content:center;flex-shrink:0">'+
              (it.completado?'<i class="fas fa-check" style="font-size:9px;color:#4ADE80"></i>':'')+
              '</div>'+
              '<span style="font-size:13px;font-weight:600;color:'+(it.completado?'rgba(255,255,255,.35)':'rgba(255,255,255,.82)')+'">'+it.nombre+'</span>'+
            '</div>';
          }).join('')+
        '</div>';
      }
    };
  }

  // NUTRICIÓN fallback
  if(typeof window.renderNutricion !== 'function'){
    window.renderNutricion = function(data){
      var body = document.getElementById('nut-panel-body'); if(!body) return;
      if(!data||!data.ok){ body.innerHTML='<div style="padding:40px;text-align:center;color:rgba(255,255,255,.25);font-size:12px">Sin registros</div>'; return; }
      var dias = data.semana || Object.values(data.dias||{});
      if(!dias.length){ body.innerHTML='<div style="padding:40px;text-align:center;color:rgba(255,255,255,.25);font-size:12px">Sin registros esta semana</div>'; return; }
      var hoy = data.hoy||{};
      var html = '<div style="padding:0 20px 24px;display:flex;flex-direction:column;gap:12px">';
      if(hoy.cal||hoy.prot){
        html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.06)">';
        [{l:'Calorías',v:Math.round(hoy.cal||0),u:'kcal',c:'#fbbf24'},{l:'Proteína',v:Math.round(hoy.prot||0),u:'g',c:'#4ADE80'},{l:'Carbos',v:Math.round(hoy.carbos||0),u:'g',c:'#60a5fa'},{l:'Agua',v:(hoy.agua||0).toFixed(1),u:'L',c:'#22d3ee'}].forEach(function(m){
          html += '<div style="text-align:center"><div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.28);margin-bottom:3px">'+m.l+'</div><div style="font-size:18px;font-weight:800;color:'+m.c+';letter-spacing:-.02em">'+m.v+'<span style="font-size:9px;color:rgba(255,255,255,.28);margin-left:2px">'+m.u+'</span></div></div>';
        });
        html += '</div>';
      }
      dias.forEach(function(dia){
        if(!dia.items||!dia.items.length) return;
        html += '<div><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:rgba(255,255,255,.35);margin-bottom:6px">'+dia.fecha+'</div>';
        dia.items.forEach(function(it){
          html += '<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.04)">'+
            '<span style="font-size:9px;font-weight:700;padding:2px 7px;border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.35);text-transform:uppercase;flex-shrink:0">'+(it.momento||'—')+'</span>'+
            '<span style="flex:1;font-size:13px;color:rgba(255,255,255,.8)">'+it.alimento+'</span>'+
            (it.cal?'<span style="font-size:11px;font-weight:700;color:#fbbf24;flex-shrink:0">'+Math.round(it.cal)+' kcal</span>':'')+
          '</div>';
        });
        html += '</div>';
      });
      html += '</div>';
      body.innerHTML = html;
    };
  }


});



function irASheets(sheetId){
  sheetId=sheetId||'raw';
  // _setPantalla puede no existir localmente — usar _irAPanel
  if(typeof _setPantalla==='function'){
    if(_pantalla==='sheets_'+sheetId){volverAlAnverso();return;}
    _setPantalla('sheets_'+sheetId);
  } else {
    _irAPanel('board-sheets','sheets');
  }
  const cfg=SHEETS_CONFIG.find(s=>s.id===sheetId); if(!cfg)return;
  const cont=document.getElementById('sheets-iframe-cont');
  if(cont){ var embedUrl='https://docs.google.com/spreadsheets/d/'+cfg.spreadsheetId+'/htmlview?gid='+cfg.gid+'&widget=true';cont.innerHTML='<iframe src="'+embedUrl+'" style="width:100%;height:100%;border:none;display:block" allowfullscreen scrolling="yes"></iframe>'; }
  const lbl=document.getElementById('sheets-panel-label'); if(lbl)lbl.textContent=cfg.emoji+' '+cfg.label;
  const btn=document.getElementById('sheets-open-btn'); if(btn)btn.href=`https://docs.google.com/spreadsheets/d/${cfg.spreadsheetId}/edit#gid=${cfg.gid}`;
}

// ══════════════════════════════════════════
//  MODO NUEVA / EDITAR (paso 2)
// ══════════════════════════════════════════
function _inyectarToggleModo(){
  if(document.getElementById('toggle-modo-wrap'))return;
  const wrap=document.createElement('div');
  wrap.id='toggle-modo-wrap';
  wrap.innerHTML=`
    <button id="btn-tab-nueva"          onclick="setModoEntrada('nueva')"          class="tab-entrada on">+ Nueva</button>
    <button id="btn-tab-editar"         onclick="setModoEntrada('editar')"         class="tab-entrada">✏ Editar</button>
    <button id="btn-tab-pensamiento"    onclick="setModoEntrada('pensamiento')"    class="tab-entrada">💭</button>
    <button id="btn-tab-persona"        onclick="setModoEntrada('persona')"        class="tab-entrada">👥</button>
    <button id="btn-tab-salud"          onclick="setModoEntrada('salud')"          class="tab-entrada">🏥</button>
    <button id="btn-tab-apartado"       onclick="setModoEntrada('apartado')"       class="tab-entrada">💰</button>
    <button id="btn-tab-patrimonio"     onclick="setModoEntrada('patrimonio')"     class="tab-entrada">🏦</button>
    <button id="btn-tab-nutricion"      onclick="setModoEntrada('nutricion')"      class="tab-entrada">🥗</button>
    <button id="btn-tab-entrenamiento"  onclick="setModoEntrada('entrenamiento')"  class="tab-entrada">💪</button>
    <button id="btn-tab-activity"       onclick="setModoEntrada('activity')"       class="tab-entrada">⚡</button>`;
  const body=document.getElementById('sec-entrada-body')||document.getElementById('entrada-paso2')||document.getElementById('wrap-entrada');
  if(body) body.insertBefore(wrap,body.firstChild);

  const idWrap=document.createElement('div');
  idWrap.id='editar-id-wrap'; idWrap.style.cssText='display:none;padding:12px var(--pad) 0;';
  idWrap.innerHTML=`<div style="display:flex;align-items:center;gap:8px"><input type="number" id="editar-id-input" class="finput" placeholder="ID de la fila" onkeydown="if(event.key==='Enter') buscarFilaId()"><button onclick="buscarFilaId()" class="btn-save" style="flex-shrink:0;padding:10px 18px;font-size:13px;border-radius:999px;min-width:80px"><span id="buscar-spin" class="spin-sm" style="display:none"></span>Buscar</button></div><div id="editar-id-msg" style="font-size:11px;margin-top:6px;color:var(--m)"></div>`;
  if(body) body.insertBefore(idWrap,wrap.nextSibling);

  ['pensamiento','persona','salud','apartado','patrimonio','bancos','nutricion','entrenamiento','activity'].forEach(tab=>{
    const tw=document.createElement('div'); tw.id=tab+'-wrap'; tw.style.display='none';
    if(body) body.insertBefore(tw,idWrap.nextSibling);
  });
}

function setModoEntrada(modo){
  _tabEntrada=modo; _modoEditar=(modo==='editar');
  const paso1=document.getElementById('entrada-paso1');
  const paso2=document.getElementById('entrada-paso2');
  if(paso1) paso1.style.display='none';
  if(paso2) paso2.style.display='block';

  const titulos={nueva:'💸 RAW',editar:'✏️ Editar',pensamiento:'💭 Pensamiento',persona:'👥 Persona',salud:'🏥 Salud',apartado:'💰 Apartado',patrimonio:'🏦 Patrimonio',bancos:'🏛️ Bancos',nutricion:'🥗 Nutrición',entrenamiento:'💪 Entrenamiento',activity:'⚡ Activity'};
  const tituloEl=document.getElementById('entrada-paso2-titulo');
  if(tituloEl) tituloEl.textContent=titulos[modo]||modo;

  ['nueva','editar','pensamiento','persona','salud','apartado','patrimonio','bancos','nutricion','entrenamiento','libro','movie','norut','activity'].forEach(t=>{
    const btn=document.getElementById('btn-tab-'+t); if(btn)btn.classList.toggle('on',t===modo);
    const w=document.getElementById(t+'-wrap'); if(w)w.innerHTML='';
  });

  ['editar-id-wrap','pensamiento-wrap','persona-wrap','salud-wrap','apartado-wrap'].forEach(id=>{ const el=document.getElementById(id);if(el)el.style.display='none'; });

  const formActions=document.querySelector('.form-actions');
  if(modo==='nueva'){
    _mostrarCamposBase(true); if(formActions)formActions.style.display='flex';
    const btnG=document.getElementById('btnG'); if(btnG)btnG.innerHTML='<div class="spin-sm" id="spin"></div><i class="fas fa-floppy-disk" id="bico"></i> Guardar';
    _filaEditar=null;_idEditar=null; limpiar(true);
  } else if(modo==='editar'){
    _mostrarCamposBase(true); if(formActions)formActions.style.display='flex';
    const idWrap=document.getElementById('editar-id-wrap'); if(idWrap)idWrap.style.display='block';
    const btnG=document.getElementById('btnG'); if(btnG)btnG.innerHTML='<div class="spin-sm" id="spin"></div><i class="fas fa-pen" id="bico"></i> Actualizar';
    limpiar(false);
  } else {
    _mostrarCamposBase(false); if(formActions)formActions.style.display='none';
    const wrap=document.getElementById(modo+'-wrap'); if(wrap)wrap.style.display='block';
    _renderTabEntrada(modo);
  }
}

function _mostrarCamposBase(visible){
  ['cf-fecha','cf-proyecto','cf-contacto','cf-concepto','cf-monto','cf-recurrencia','cf-necesidad','cf-clave'].forEach(id=>{ const el=document.getElementById(id);if(el)el.style.display=visible?'':'none'; });
  const saveRes=document.getElementById('save-res'); if(saveRes&&!visible)saveRes.className='save-res';
}

function _renderTabEntrada(tab){
  const wrap=document.getElementById(tab+'-wrap'); if(!wrap)return;
  wrap.innerHTML='';
  if(tab==='pensamiento')     _renderPensamientoForm(wrap);
  else if(tab==='persona')    _renderPersonaForm(wrap);
  else if(tab==='salud')      _renderSaludForm(wrap);
  else if(tab==='apartado')   _renderApartadoForm(wrap);
  else if(tab==='patrimonio') _renderPatrimonioForm(wrap);
  else if(tab==='bancos')     _renderBancosForm(wrap);
  else if(tab==='nutricion')  _renderNutricionForm(wrap);
  else if(tab==='entrenamiento') _renderEntrenamientoForm(wrap);
  else if(tab==='libro')      _renderLibroForm(wrap);
  else if(tab==='movie')      _renderMovieForm(wrap);
  else if(tab==='norut')      _renderNoRutForm(wrap);
  else if(tab==='activity')   _renderActivityForm(wrap);
}

// ══════════════════════════════════════════
//  FORMULARIOS DE TABS (sin cambios)
// ══════════════════════════════════════════
function _renderActivityForm(wrap){
  var SIMS_OPTS=['energia','hambre','cuerpo','higiene','mental','disfrute','entorno'];
  var RECS=['Diario','Semanal','Eventual'];
  wrap.innerHTML=`<div style="padding:16px var(--pad);display:flex;flex-direction:column;gap:10px">
    <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">¿Qué quieres agregar?</div>
    <div class="opts" id="act-col-opts">
      <button class="opt" onclick="event.stopPropagation();_selOpt(this,'act-col-opts');_onActColChange('personal')">👤 Personal</button>
      <button class="opt" onclick="event.stopPropagation();_selOpt(this,'act-col-opts');_onActColChange('electronics')">💼 Trabajo</button>
      <button class="opt" onclick="event.stopPropagation();_selOpt(this,'act-col-opts');_onActColChange('libro')">📚 Libro</button>
      <button class="opt" onclick="event.stopPropagation();_selOpt(this,'act-col-opts');_onActColChange('movie')">🎬 Movie</button>
      <button class="opt" onclick="event.stopPropagation();_selOpt(this,'act-col-opts');_onActColChange('norut')">📌 Pendiente</button>
    </div>
    <input type="hidden" id="act-col-tipo" value="">
    <div id="act-col-extra" style="display:flex;flex-direction:column;gap:8px"></div>
    <button onclick="_guardarActivityForm()" class="btn-save" style="border-radius:var(--rad-pill);display:none" id="act-btn-guardar"><i class="fas fa-floppy-disk"></i> Agregar</button>
    <div id="act-res" style="font-size:12px;text-align:center;color:var(--m)"></div>
  </div>`;
}
function _onActColChange(tipo){
  document.getElementById('act-col-tipo').value=tipo;
  var extra=document.getElementById('act-col-extra');
  var btn=document.getElementById('act-btn-guardar');
  if(btn)btn.style.display='flex';
  var SIMS_OPTS=['energia','hambre','cuerpo','higiene','mental','disfrute','entorno'];
  var RECS=['Diario','Semanal','Eventual'];
  var recHtml='<div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Recurrencia</div><div class="opts" id="act-rec-opts">'+RECS.map(r=>`<button class="opt" onclick="event.stopPropagation();_selOpt(this,'act-rec-opts');document.getElementById('act-rec').value='${r}'">${r}</button>`).join('')+'</div><input type="hidden" id="act-rec" value="Diario"></div>';
  if(tipo==='personal'){
    extra.innerHTML='<input type="text" id="act-nombre" class="finput" placeholder="Nombre del hábito" style="font-size:14px;padding:10px 14px">'+recHtml+'<div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Categoría Sims</div><div class="opts" id="act-sims-opts">'+SIMS_OPTS.map(s=>`<button class="opt" onclick="event.stopPropagation();_selOpt(this,'act-sims-opts');document.getElementById('act-sims').value='${s}'">${s}</button>`).join('')+'</div><input type="hidden" id="act-sims" value=""></div>';
  } else if(tipo==='electronics'){
    extra.innerHTML='<input type="text" id="act-nombre" class="finput" placeholder="Nombre del check de trabajo" style="font-size:14px;padding:10px 14px">'+recHtml;
  } else {
    var label=tipo==='libro'?'Título del libro':tipo==='movie'?'Título de la película/serie':'Descripción del pendiente';
    extra.innerHTML='<input type="text" id="act-nombre" class="finput" placeholder="'+label+'" style="font-size:14px;padding:10px 14px">';
  }
}
function _guardarActivityForm(){
  var tipo=document.getElementById('act-col-tipo').value;
  var nombre=(document.getElementById('act-nombre')||{}).value;
  var res=document.getElementById('act-res');
  if(!tipo){res.textContent='Selecciona una columna';res.style.color='var(--err)';return;}
  if(!nombre||!nombre.trim()){res.textContent='Escribe un nombre';res.style.color='var(--err)';return;}
  nombre=nombre.trim(); res.textContent='Guardando…'; res.style.color='var(--m)';
  var datos={nombre:nombre};
  if(tipo==='personal'){datos.recurrencia=(document.getElementById('act-rec')||{}).value||'Diario';datos.sims=(document.getElementById('act-sims')||{}).value||'';}
  if(tipo==='electronics'){datos.recurrencia=(document.getElementById('act-rec')||{}).value||'Diario';}
  var tipoBack=tipo==='electronics'?'electronics':tipo==='libro'?'libro':tipo==='movie'?'movie':tipo==='norut'?'norut':'personal';
  api.agregarAActivity(tipoBack,datos).then(function(r){
    res.textContent=r.ok?'✓ Agregado':'✗ '+(r.mensaje||'Error');
    res.style.color=r.ok?'var(--ok)':'var(--err)';
    if(r.ok){showToast('✓ Agregado a Activity Check');setTimeout(cerrarEntrada,800);}
  }).catch(function(){res.textContent='Error';res.style.color='var(--err)';});
}

function _guardarNutricion(){
  var comida=document.getElementById('nut-comida').value.trim();
  var res=document.getElementById('nut-res');
  if(!comida){res.textContent='Escribe qué comiste';res.style.color='var(--err)';return;}
  res.textContent='Guardando…';res.style.color='var(--m)';
  var datos={comida,calorias:parseFloat(document.getElementById('nut-cal')?.value)||0,proteina:parseFloat(document.getElementById('nut-prot')?.value)||0,carbos:parseFloat(document.getElementById('nut-carbos')?.value)||0,grasa:parseFloat(document.getElementById('nut-grasa')?.value)||0,agua:parseFloat(document.getElementById('nut-agua')?.value)||0,fasting:parseFloat(document.getElementById('nut-fast')?.value)||0,notas:document.getElementById('nut-notas')?.value||'',fecha:fmtD(new Date())};
  api.guardarNutricion(datos).then(function(r){
    res.textContent=r.ok?'✓ Guardado':'✗ '+r.mensaje;res.style.color=r.ok?'var(--ok)':'var(--err)';
    if(r.ok){showToast('✓ Nutrición guardada');document.getElementById('nut-comida').value='';api.getNutricion().then(renderNutricion).catch(function(){});setTimeout(cerrarEntrada,800);}
  }).catch(function(){res.textContent='Error';res.style.color='var(--err)';});
}

function _guardarEntrenamiento(){
  var ejercicio=document.getElementById('ent-ejercicio').value.trim();
  var res=document.getElementById('ent-res');
  if(!ejercicio){res.textContent='Escribe el ejercicio';res.style.color='var(--err)';return;}
  res.textContent='Guardando…';res.style.color='var(--m)';
  var datos={tipo:document.getElementById('ent-tipo')?.value||'',ejercicio,duracion:parseFloat(document.getElementById('ent-dur')?.value)||0,distancia:parseFloat(document.getElementById('ent-dist')?.value)||0,series:parseFloat(document.getElementById('ent-series')?.value)||0,reps:parseFloat(document.getElementById('ent-reps')?.value)||0,peso:parseFloat(document.getElementById('ent-peso')?.value)||0,notas:document.getElementById('ent-notas')?.value||'',fecha:fmtD(new Date())};
  api.guardarEntrenamiento(datos).then(function(r){
    res.textContent=r.ok?'✓ Guardado':'✗ '+r.mensaje;res.style.color=r.ok?'var(--ok)':'var(--err)';
    if(r.ok){showToast('✓ Entrenamiento guardado');document.getElementById('ent-ejercicio').value='';api.getEntrenamiento().then(renderEntrenamiento).catch(function(){});setTimeout(cerrarEntrada,800);}
  }).catch(function(){res.textContent='Error';res.style.color='var(--err)';});
}

function _renderLibroForm(wrap){wrap.innerHTML=`<div style="padding:16px var(--pad);display:flex;flex-direction:column;gap:12px"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">Marcar libro como leído</div><input type="text" id="libro-nombre" class="finput" placeholder="Título del libro" style="font-size:14px;padding:10px 14px"><input type="text" id="libro-autor" class="finput" placeholder="Autor (opcional)" style="font-size:14px;padding:10px 14px"><button onclick="_guardarLibroForm()" class="btn-save" style="border-radius:var(--rad-pill)"><i class="fas fa-book"></i> Guardar libro</button><div id="libro-res" style="font-size:12px;text-align:center;color:var(--m)"></div></div>`;}
function _guardarLibroForm(){var nombre=document.getElementById('libro-nombre')?.value?.trim();if(!nombre){showToast('Escribe el título del libro',false);return;}var res=document.getElementById('libro-res');if(res)res.textContent='Guardando…';api.marcarActivityItem('libro',nombre,true).then(function(r){if(res)res.textContent=r.ok?'✓ Libro guardado':'Error: '+r.mensaje;if(r.ok){document.getElementById('libro-nombre').value='';if(document.getElementById('libro-autor'))document.getElementById('libro-autor').value='';}}).catch(function(){if(res)res.textContent='Error al guardar';});}

function _renderMovieForm(wrap){wrap.innerHTML=`<div style="padding:16px var(--pad);display:flex;flex-direction:column;gap:12px"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">Registrar película / serie</div><input type="text" id="movie-nombre" class="finput" placeholder="Título de la película o serie" style="font-size:14px;padding:10px 14px"><button onclick="_guardarMovieForm()" class="btn-save" style="border-radius:var(--rad-pill)"><i class="fas fa-film"></i> Guardar</button><div id="movie-res" style="font-size:12px;text-align:center;color:var(--m)"></div></div>`;}
function _guardarMovieForm(){var nombre=document.getElementById('movie-nombre')?.value?.trim();if(!nombre){showToast('Escribe el título',false);return;}var res=document.getElementById('movie-res');if(res)res.textContent='Guardando…';api.marcarActivityItem('movie',nombre,true).then(function(r){if(res)res.textContent=r.ok?'✓ Guardado':'Error: '+r.mensaje;if(r.ok)document.getElementById('movie-nombre').value='';}).catch(function(){if(res)res.textContent='Error al guardar';});}

function _renderNoRutForm(wrap){wrap.innerHTML=`<div style="padding:16px var(--pad);display:flex;flex-direction:column;gap:12px"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">Agregar pendiente</div><input type="text" id="norut-nombre" class="finput" placeholder="Nombre de la tarea o pendiente" style="font-size:14px;padding:10px 14px"><textarea id="norut-nota" class="finput" placeholder="Notas opcionales" rows="3" style="font-size:13px;padding:10px 14px;resize:none"></textarea><button onclick="_guardarNoRutForm()" class="btn-save" style="border-radius:var(--rad-pill)"><i class="fas fa-thumbtack"></i> Guardar pendiente</button><div id="norut-res" style="font-size:12px;text-align:center;color:var(--m)"></div></div>`;}
function _guardarNoRutForm(){var nombre=document.getElementById('norut-nombre')?.value?.trim();if(!nombre){showToast('Escribe el nombre del pendiente',false);return;}var res=document.getElementById('norut-res');if(res)res.textContent='Guardando…';api.marcarActivityItem('norut',nombre,false).then(function(r){if(res)res.textContent=r.ok?'✓ Pendiente guardado':'Error: '+r.mensaje;if(r.ok){document.getElementById('norut-nombre').value='';if(document.getElementById('norut-nota'))document.getElementById('norut-nota').value='';}}).catch(function(){if(res)res.textContent='Error al guardar';});}

function _renderBancosForm(wrap){
  wrap.innerHTML=`<div style="padding:16px var(--pad);display:flex;flex-direction:column;gap:12px"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">Registrar en Bancos</div><input type="text" id="banco-nombre" class="finput" placeholder="Nombre del banco (BBVA, BEATS…)" style="font-size:14px;padding:10px 14px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Monto</div><input type="number" id="banco-monto" class="finput" placeholder="0.00" step="0.01" inputmode="decimal" style="font-size:16px;padding:10px 12px"></div><div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Fecha</div><input type="date" id="banco-fecha" class="finput" style="font-size:13px;padding:9px 12px"></div></div><button onclick="_guardarBancosForm()" class="btn-save" style="border-radius:var(--rad-pill)"><i class="fas fa-floppy-disk"></i> Guardar en Bancos</button><div id="banco-res" style="font-size:12px;text-align:center;color:var(--m)"></div></div>`;
  const fechaEl=document.getElementById('banco-fecha'); if(fechaEl)fechaEl.value=fmtD(new Date());
}
function _guardarBancosForm(){
  const nombre=document.getElementById('banco-nombre').value.trim();
  const monto=parseFloat(document.getElementById('banco-monto').value);
  const fecha=document.getElementById('banco-fecha').value;
  const res=document.getElementById('banco-res');
  if(!nombre||isNaN(monto)||!fecha){res.textContent='Completa todos los campos';res.style.color='var(--err)';return;}
  res.textContent='Guardando…';res.style.color='var(--m)';
  api.guardarEnBancos(nombre,monto,fecha).then(r=>{
    res.textContent=r.ok?'✓ Guardado':'✗ '+(r.mensaje||'Error');res.style.color=r.ok?'var(--ok)':'var(--err)';
    if(r.ok){showToast('✓ Banco guardado');var sb=document.querySelector('.btn-save');if(sb){sb.classList.add('saved');setTimeout(function(){sb.classList.remove('saved');},1200);}  document.getElementById('banco-nombre').value='';document.getElementById('banco-monto').value='';document.getElementById('banco-fecha').value=fmtD(new Date());api.getFijos().then(renderEntes);setTimeout(cerrarEntrada,800);}
  }).catch(()=>{res.textContent='Error';res.style.color='var(--err)';});
}

function _renderPatrimonioForm(wrap){
  wrap.innerHTML=`<div style="padding:16px var(--pad);display:flex;flex-direction:column;gap:12px"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">Registrar movimiento</div><div><div style="font-size:10px;color:var(--m);margin-bottom:6px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Tipo</div><div class="opts" id="pat-tipo-opts"><button class="opt" onclick="event.stopPropagation();_selOpt(this,'pat-tipo-opts');document.getElementById('pat-tipo').value='ahorro';_onPatTipoChange()">💳 Banco</button><button class="opt" onclick="event.stopPropagation();_selOpt(this,'pat-tipo-opts');document.getElementById('pat-tipo').value='efectivo';_onPatTipoChange()">💵 Efectivo</button><button class="opt" onclick="event.stopPropagation();_selOpt(this,'pat-tipo-opts');document.getElementById('pat-tipo').value='inversion';_onPatTipoChange()">📈 Inversión</button></div><input type="hidden" id="pat-tipo" value=""></div><input type="text" id="pat-concepto" class="finput" placeholder="Concepto" style="font-size:14px;padding:10px 14px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Monto</div><input type="number" id="pat-monto" class="finput" placeholder="0.00" step="0.01" inputmode="decimal" style="font-size:16px;padding:10px 12px"></div><div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Fecha</div><input type="date" id="pat-fecha" class="finput" style="font-size:13px;padding:9px 12px"></div></div><div id="pat-extra" style="display:flex;flex-direction:column;gap:8px"></div><button onclick="_guardarPatrimonio()" class="btn-save" style="border-radius:var(--rad-pill)"><i class="fas fa-floppy-disk"></i> Guardar</button><div id="pat-res" style="font-size:12px;text-align:center;color:var(--m)"></div></div>`;
  document.getElementById('pat-fecha').value=fmtD(new Date());
}
function _onPatTipoChange(){const tipo=document.getElementById('pat-tipo').value;const extra=document.getElementById('pat-extra');if(!extra)return;if(tipo==='ahorro'){extra.innerHTML=`<input type="text" id="pat-banco" class="finput" placeholder="Banco" style="font-size:13px;padding:9px 12px"><div class="opts" id="pat-mov-opts"><button class="opt" onclick="event.stopPropagation();_selOpt(this,'pat-mov-opts');document.getElementById('pat-movtipo').value='Depósito'">Depósito</button><button class="opt" onclick="event.stopPropagation();_selOpt(this,'pat-mov-opts');document.getElementById('pat-movtipo').value='Retiro'">Retiro</button></div><input type="hidden" id="pat-movtipo" value="Depósito">`;}else if(tipo==='inversion'){extra.innerHTML=`<input type="text" id="pat-instrumento" class="finput" placeholder="Instrumento (CETES, GBM…)" style="font-size:13px;padding:9px 12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><input type="text" id="pat-plazo" class="finput" placeholder="Plazo" style="font-size:13px;padding:9px 12px"><input type="number" id="pat-rendimiento" class="finput" placeholder="Rendimiento $" step="0.01" style="font-size:13px;padding:9px 12px"></div>`;}else{extra.innerHTML='';}}
function _guardarPatrimonio(){
  const tipo=document.getElementById('pat-tipo').value;const concepto=document.getElementById('pat-concepto').value.trim();const monto=parseFloat(document.getElementById('pat-monto').value);const fecha=document.getElementById('pat-fecha').value;const res=document.getElementById('pat-res');
  if(!tipo){res.textContent='Selecciona un tipo';res.style.color='var(--err)';return;}if(!concepto||isNaN(monto)){res.textContent='Concepto y monto requeridos';res.style.color='var(--err)';return;}
  res.textContent='Guardando…';res.style.color='var(--m)';
  let datos={concepto,monto,fecha};let promise;
  if(tipo==='ahorro'){datos.banco=document.getElementById('pat-banco')?.value.trim()||'';datos.tipo=document.getElementById('pat-movtipo')?.value||'Depósito';promise=api.guardarAhorro(datos);}
  else if(tipo==='efectivo'){promise=api.guardarEfectivo(datos);}
  else{datos.instrumento=document.getElementById('pat-instrumento')?.value.trim()||'CETES';datos.plazo=document.getElementById('pat-plazo')?.value.trim()||'';datos.rendimiento=parseFloat(document.getElementById('pat-rendimiento')?.value)||0;promise=api.guardarInversion(datos);}
  promise.then(r=>{res.textContent=r.ok?'✓ Guardado':'✗ '+r.mensaje;res.style.color=r.ok?'var(--ok)':'var(--err)';if(r.ok){showToast('✓ Patrimonio guardado');api.getPatrimonio().then(r=>{if(typeof renderPatrimonio==='function')renderPatrimonio(r);}).catch(()=>{});setTimeout(cerrarEntrada,800);}}).catch(()=>{res.textContent='Error';res.style.color='var(--err)';});
}

function _renderNutricionForm(wrap){wrap.innerHTML=`<div style="padding:16px var(--pad);display:flex;flex-direction:column;gap:10px"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">Registrar comida / día</div><input type="text" id="nut-comida" class="finput" placeholder="Ej. Desayuno: huevos + aguacate" style="font-size:14px;padding:10px 14px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Calorías (kcal)</div><input type="number" id="nut-cal" class="finput" placeholder="0" style="font-size:16px;padding:10px 12px"></div><div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Proteína (g)</div><input type="number" id="nut-prot" class="finput" placeholder="0" style="font-size:16px;padding:10px 12px"></div></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px"><div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Carbos</div><input type="number" id="nut-carbos" class="finput" placeholder="0" style="padding:9px 10px;font-size:13px"></div><div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Grasa</div><input type="number" id="nut-grasa" class="finput" placeholder="0" style="padding:9px 10px;font-size:13px"></div><div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Agua (L)</div><input type="number" id="nut-agua" class="finput" placeholder="0.0" step="0.1" style="padding:9px 10px;font-size:13px"></div></div><div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Fasting (horas)</div><div class="opts" id="nut-fast-opts">${[0,12,14,16,18,20].map(h=>`<button class="opt" onclick="event.stopPropagation();_selOpt(this,'nut-fast-opts');document.getElementById('nut-fast').value=${h}">${h?h+'h':'Sin ayuno'}</button>`).join('')}</div><input type="hidden" id="nut-fast" value="0"></div><input type="text" id="nut-notas" class="finput" placeholder="Notas opcionales" style="font-size:13px;padding:9px 12px"><button onclick="_guardarNutricion()" class="btn-save" style="border-radius:var(--rad-pill)"><i class="fas fa-floppy-disk"></i> Guardar</button><div id="nut-res" style="font-size:12px;text-align:center;color:var(--m)"></div></div>`;}

function _renderEntrenamientoForm(wrap){wrap.innerHTML=`<div style="padding:16px var(--pad);display:flex;flex-direction:column;gap:10px"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">Registrar sesión</div><div><div style="font-size:10px;color:var(--m);margin-bottom:6px">Tipo</div><div class="opts" id="ent-tipo-opts">${['Fuerza','Cardio','HIIT','Flexibilidad','Deporte'].map(t=>`<button class="opt" onclick="event.stopPropagation();_selOpt(this,'ent-tipo-opts');document.getElementById('ent-tipo').value='${t}'">${t}</button>`).join('')}</div><input type="hidden" id="ent-tipo" value=""></div><input type="text" id="ent-ejercicio" class="finput" placeholder="Ejercicio (ej. Press banca, Caminata)" style="font-size:14px;padding:10px 14px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Duración (min)</div><input type="number" id="ent-dur" class="finput" placeholder="0" style="font-size:16px;padding:10px 12px"></div><div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Distancia (km)</div><input type="number" id="ent-dist" class="finput" placeholder="0.0" step="0.1" style="font-size:16px;padding:10px 12px"></div></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px"><div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Series</div><input type="number" id="ent-series" class="finput" placeholder="0" style="padding:9px 10px;font-size:13px"></div><div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Reps</div><input type="number" id="ent-reps" class="finput" placeholder="0" style="padding:9px 10px;font-size:13px"></div><div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Peso (kg)</div><input type="number" id="ent-peso" class="finput" placeholder="0" step="0.5" style="padding:9px 10px;font-size:13px"></div></div><input type="text" id="ent-notas" class="finput" placeholder="Notas" style="font-size:13px;padding:9px 12px"><button onclick="_guardarEntrenamiento()" class="btn-save" style="border-radius:var(--rad-pill)"><i class="fas fa-floppy-disk"></i> Guardar sesión</button><div id="ent-res" style="font-size:12px;text-align:center;color:var(--m)"></div></div>`;}

function _renderPensamientoForm(wrap){wrap.innerHTML=`<div style="padding:16px var(--pad);display:flex;flex-direction:column;gap:12px"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">¿En qué estás pensando?</div><textarea id="p-texto" class="finput" rows="4" placeholder="Escribe aquí tu pensamiento…" style="resize:none;line-height:1.5;font-size:14px"></textarea><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div><div style="font-size:10px;color:var(--m);margin-bottom:4px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Categoría</div><div class="opts" id="p-cat-opts">${['Emoción','Idea','Reflexión','Decisión','Sueño'].map(c=>`<button class="opt" onclick="event.stopPropagation();_selOpt(this,'p-cat-opts');document.getElementById('p-cat').value='${c}'">${c}</button>`).join('')}</div><input type="hidden" id="p-cat" value=""></div><div><div style="font-size:10px;color:var(--m);margin-bottom:4px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Energía</div><div class="opts" id="p-energia-opts">${[1,2,3,4,5].map(n=>`<button class="opt" onclick="event.stopPropagation();_selOpt(this,'p-energia-opts');document.getElementById('p-energia').value=${n}" style="padding:8px 10px">${n}</button>`).join('')}</div><input type="hidden" id="p-energia" value=""></div></div><input type="text" id="p-etiquetas" class="finput" placeholder="Etiquetas (trabajo, familia…)" style="font-size:13px;padding:9px 12px"><button onclick="_guardarPensamiento()" class="btn-save" style="border-radius:var(--rad-pill)"><i class="fas fa-floppy-disk"></i> Guardar pensamiento</button><div id="p-res" style="font-size:12px;text-align:center;color:var(--m)"></div></div>`;}
function _guardarPensamiento(){const texto=document.getElementById('p-texto').value.trim();const categoria=document.getElementById('p-cat').value;const energia=document.getElementById('p-energia').value;const etiquetas=document.getElementById('p-etiquetas').value.trim();const res=document.getElementById('p-res');if(!texto){res.textContent='Escribe algo primero';res.style.color='var(--err)';return;}res.textContent='Guardando…';res.style.color='var(--m)';api.guardarPensamiento({texto,categoria,energia:energia||null,etiquetas,fecha:fmtD(new Date())}).then(r=>{res.textContent=r.ok?'✓ Guardado':'✗ '+r.mensaje;res.style.color=r.ok?'var(--ok)':'var(--err)';if(r.ok){showToast('✓ Pensamiento guardado');document.getElementById('p-texto').value='';document.getElementById('p-etiquetas').value='';document.querySelectorAll('#p-cat-opts .opt,#p-energia-opts .opt').forEach(b=>b.classList.remove('on'));document.getElementById('p-cat').value='';document.getElementById('p-energia').value='';setTimeout(cerrarEntrada,800);}}).catch(()=>{res.textContent='Error';res.style.color='var(--err)';});}

function _renderPersonaForm(wrap){wrap.innerHTML=`<div style="padding:16px var(--pad);display:flex;flex-direction:column;gap:12px"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">¿Con quién interactuaste?</div><input type="text" id="per-nombre" class="finput" placeholder="Nombre" style="font-size:14px;padding:10px 14px"><div><div style="font-size:10px;color:var(--m);margin-bottom:6px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Tipo</div><div class="opts" id="per-tipo-opts">${['Familia','Amigo','Pareja','Trabajo','Médico','Otro'].map(t=>`<button class="opt" onclick="event.stopPropagation();_selOpt(this,'per-tipo-opts');document.getElementById('per-tipo').value='${t}'">${t}</button>`).join('')}</div><input type="hidden" id="per-tipo" value=""></div><div><div style="font-size:10px;color:var(--m);margin-bottom:6px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Energía</div><div class="opts" id="per-energia-opts"><button class="opt" onclick="event.stopPropagation();_selOpt(this,'per-energia-opts');document.getElementById('per-energia').value=1" style="color:var(--ok)">+ Positiva</button><button class="opt" onclick="event.stopPropagation();_selOpt(this,'per-energia-opts');document.getElementById('per-energia').value=0">Neutral</button><button class="opt" onclick="event.stopPropagation();_selOpt(this,'per-energia-opts');document.getElementById('per-energia').value=-1" style="color:var(--err)">− Negativa</button></div><input type="hidden" id="per-energia" value=""></div><textarea id="per-notas" class="finput" rows="2" placeholder="Notas de la interacción…" style="resize:none;font-size:13px"></textarea><button onclick="_guardarPersona()" class="btn-save" style="border-radius:var(--rad-pill)"><i class="fas fa-floppy-disk"></i> Registrar interacción</button><div id="per-res" style="font-size:12px;text-align:center;color:var(--m)"></div></div>`;}
function _guardarPersona(){const nombre=document.getElementById('per-nombre').value.trim();const tipo=document.getElementById('per-tipo').value;const energia=document.getElementById('per-energia').value;const notas=document.getElementById('per-notas').value.trim();const res=document.getElementById('per-res');if(!nombre){res.textContent='Escribe un nombre';res.style.color='var(--err)';return;}res.textContent='Guardando…';res.style.color='var(--m)';api.guardarInteraccion({nombre,tipo,energia:energia!==''?Number(energia):0,notas}).then(r=>{res.textContent=r.ok?'✓ '+r.mensaje:'✗ '+r.mensaje;res.style.color=r.ok?'var(--ok)':'var(--err)';if(r.ok){showToast('✓ Interacción guardada');document.getElementById('per-nombre').value='';document.getElementById('per-notas').value='';document.querySelectorAll('#per-tipo-opts .opt,#per-energia-opts .opt').forEach(b=>b.classList.remove('on'));document.getElementById('per-tipo').value='';document.getElementById('per-energia').value='';setTimeout(cerrarEntrada,800);}}).catch(()=>{res.textContent='Error';res.style.color='var(--err)';});}

function _renderSaludForm(wrap){wrap.innerHTML=`<div style="padding:16px var(--pad);display:flex;flex-direction:column;gap:12px"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">Registro de salud</div><div><div style="font-size:10px;color:var(--m);margin-bottom:6px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Tipo</div><div class="opts" id="sal-tipo-opts">${['Cita','Síntoma','Medicamento','Resultado','Vacuna','Check-in'].map(t=>`<button class="opt" onclick="event.stopPropagation();_selOpt(this,'sal-tipo-opts');document.getElementById('sal-tipo').value='${t}'">${t}</button>`).join('')}</div><input type="hidden" id="sal-tipo" value=""></div><input type="text" id="sal-desc" class="finput" placeholder="Descripción" style="font-size:14px;padding:10px 14px"><input type="text" id="sal-doctor" class="finput" placeholder="Doctor (opcional)" style="font-size:13px;padding:9px 12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Fecha</div><input type="date" id="sal-fecha" class="finput" style="font-size:13px;padding:9px 12px"></div><div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Próxima cita</div><input type="date" id="sal-proxima" class="finput" style="font-size:13px;padding:9px 12px"></div></div><textarea id="sal-notas" class="finput" rows="2" placeholder="Notas…" style="resize:none;font-size:13px"></textarea><button onclick="_guardarSalud()" class="btn-save" style="border-radius:var(--rad-pill)"><i class="fas fa-floppy-disk"></i> Guardar registro</button><div id="sal-res" style="font-size:12px;text-align:center;color:var(--m)"></div></div>`;document.getElementById('sal-fecha').value=fmtD(new Date());}
function _guardarSalud(){const tipo=document.getElementById('sal-tipo').value;const desc=document.getElementById('sal-desc').value.trim();const doctor=document.getElementById('sal-doctor').value.trim();const fecha=document.getElementById('sal-fecha').value;const prox=document.getElementById('sal-proxima').value;const notas=document.getElementById('sal-notas').value.trim();const res=document.getElementById('sal-res');if(!desc){res.textContent='Agrega una descripción';res.style.color='var(--err)';return;}res.textContent='Guardando…';res.style.color='var(--m)';api.guardarSalud({tipo,descripcion:desc,doctor,fecha,proxima:prox||null,notas,estado:'Pendiente'}).then(r=>{res.textContent=r.ok?'✓ Guardado':'✗ '+r.mensaje;res.style.color=r.ok?'var(--ok)':'var(--err)';if(r.ok){showToast('✓ Salud guardada');document.getElementById('sal-desc').value='';document.getElementById('sal-doctor').value='';document.getElementById('sal-proxima').value='';document.getElementById('sal-notas').value='';document.querySelectorAll('#sal-tipo-opts .opt').forEach(b=>b.classList.remove('on'));document.getElementById('sal-tipo').value='';setTimeout(cerrarEntrada,800);}}).catch(()=>{res.textContent='Error';res.style.color='var(--err)';});}

function _renderApartadoForm(wrap){wrap.innerHTML=`<div style="padding:16px var(--pad);display:flex;flex-direction:column;gap:12px"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m)">Nuevo apartado</div><input type="text" id="ap-nombre" class="finput" placeholder="Nombre del apartado" style="font-size:14px;padding:10px 14px"><input type="text" id="ap-categoria" class="finput" placeholder="Categoría (Renta, Viaje, Emergencia…)" style="font-size:13px;padding:9px 12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Monto</div><input type="number" id="ap-monto" class="finput" placeholder="0.00" step="0.01" inputmode="decimal" style="font-size:16px;padding:10px 12px"></div><div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Banco</div><input type="text" id="ap-banco" class="finput" placeholder="BBVA, BEATS…" style="font-size:13px;padding:9px 12px"></div></div><div><div style="font-size:10px;color:var(--m);margin-bottom:4px">Fecha meta</div><input type="date" id="ap-meta" class="finput" style="font-size:13px;padding:9px 12px"></div><textarea id="ap-notas" class="finput" rows="2" placeholder="Notas…" style="resize:none;font-size:13px"></textarea><button onclick="_guardarApartado()" class="btn-save" style="border-radius:var(--rad-pill)"><i class="fas fa-floppy-disk"></i> Guardar apartado</button><div id="ap-res" style="font-size:12px;text-align:center;color:var(--m)"></div></div>`;}
function _guardarApartado(){const nombre=document.getElementById('ap-nombre').value.trim();const categoria=document.getElementById('ap-categoria').value.trim();const monto=parseFloat(document.getElementById('ap-monto').value);const banco=document.getElementById('ap-banco').value.trim();const meta=document.getElementById('ap-meta').value;const notas=document.getElementById('ap-notas').value.trim();const res=document.getElementById('ap-res');if(!nombre||isNaN(monto)){res.textContent='Nombre y monto requeridos';res.style.color='var(--err)';return;}res.textContent='Guardando…';res.style.color='var(--m)';api.guardarApartado({nombre,categoria,monto,banco,meta:meta||null,notas,estado:'Activo'}).then(r=>{res.textContent=r.ok?'✓ Guardado':'✗ '+r.mensaje;res.style.color=r.ok?'var(--ok)':'var(--err)';if(r.ok){showToast('✓ Apartado guardado');document.getElementById('ap-nombre').value='';document.getElementById('ap-categoria').value='';document.getElementById('ap-monto').value='';document.getElementById('ap-banco').value='';document.getElementById('ap-meta').value='';document.getElementById('ap-notas').value='';setTimeout(cerrarEntrada,800);}}).catch(()=>{res.textContent='Error';res.style.color='var(--err)';});}

function _selOpt(btn,containerId){ document.querySelectorAll('#'+containerId+' .opt').forEach(b=>b.classList.remove('on')); btn.classList.add('on'); }

function buscarFilaId(){
  const id=document.getElementById('editar-id-input').value.trim();
  if(!id){document.getElementById('editar-id-msg').textContent='Escribe un ID';return;}
  const spin=document.getElementById('buscar-spin');const msg=document.getElementById('editar-id-msg');
  if(spin)spin.style.display='block';msg.textContent='Buscando…';msg.style.color='var(--m)';
  api.getFilaPorId(id).then(r=>{
    if(spin)spin.style.display='none';
    if(!r.ok){msg.textContent='✗ '+r.mensaje;msg.style.color='var(--err)';return;}
    _filaEditar=r.fila;_idEditar=r.id;msg.textContent='✓ ID '+r.id+' — fila '+r.fila;msg.style.color='var(--ok)';
    document.getElementById('fecha').value=r.fecha||fmtD(new Date());marcarDone('fecha');
    proxSel=r.proyecto;setFieldVal('proyecto',r.proyecto,!r.proyecto);_selectOpt('sw-proyecto',r.proyecto);marcarDone('proyecto');
    contactoSel=r.contacto;setFieldVal('contacto',r.contacto,!r.contacto);_selectOpt('sw-contacto',r.contacto);marcarDone('contacto');
    setFieldVal('concepto',r.concepto,!r.concepto);marcarDone('concepto');
    const m=r.monto||0;sign=m>=0?1:-1;document.getElementById('monto').value=Math.abs(m);
    document.getElementById('sbp').className='msign'+(sign===1?' pos':'');document.getElementById('sbn').className='msign'+(sign===-1?' neg':'');
    upM();marcarDone('monto');
    recSel=r.recurrencia;setFieldVal('recurrencia',r.recurrencia,!r.recurrencia);_selectOpt('sw-recurrencia',r.recurrencia);marcarDone('recurrencia');
    document.getElementById('clave').value=r.clave||'';setFieldVal('clave',r.clave||'',!r.clave);if(r.clave)marcarDone('clave');
    necesidadSel=r.necesidad||'';if(r.necesidad){setFieldVal('necesidad',r.necesidad.slice(0,30),false);marcarDone('necesidad');}
  }).catch(e=>{if(spin)spin.style.display='none';msg.textContent='Error: '+e.message;msg.style.color='var(--err)';});
}
function _selectOpt(swId,val){ const w=document.getElementById(swId);if(!w)return;w.querySelectorAll('.opt').forEach(b=>{b.classList.toggle('on',b.textContent.trim()===val);}); }

// ══════════════════════════════════════════
//  ENTES
// ══════════════════════════════════════════
function renderEntes(data){
  window._fijosData=data||[];
  const body=document.getElementById('entes-list');
  if(!data||!data.length){body.innerHTML='<div style="padding:16px;color:var(--m);text-align:center">Sin datos</div>';return;}
  const apartadosPorBanco={};let totalApartadosActivos=0;
  (window._apartadosData||[]).forEach(ap=>{if(ap.estado&&ap.estado.toLowerCase()==='usado')return;const banco=(ap.banco||'').trim().toUpperCase();apartadosPorBanco[banco]=(apartadosPorBanco[banco]||0)+(ap.monto||0);totalApartadosActivos+=(ap.monto||0);});
  const total=data.reduce((s,f)=>f.nombre==='P'?s:s+(f.monto||0),0);
  const totalDisponible=total-totalApartadosActivos;
  const {txt:tt,cls:tc}=fmtMoneda(totalDisponible);
  document.getElementById('entes-total').textContent=tt;document.getElementById('entes-total').className='sec-hdr-val '+tc;
  const hayExcluidos=data.some(f=>f.nombre==='P');
  body.innerHTML=data.map(f=>{
    const {txt,cls}=fmtMoneda(f.monto);const excluido=f.nombre==='P';
    const bancKey=(f.nombre||'').trim().toUpperCase();const apBanco=apartadosPorBanco[bancKey]||0;
    const disponible=(f.monto||0)-apBanco;const {txt:dTxt}=fmtMoneda(disponible);
    return `<div class="ente-row${excluido?' excluido-total':''}" onclick="togEnteEdit(${f.fila})">
      <div class="ente-nombre">${f.nombre}</div>
      <div class="ente-right">
        <div style="text-align:right">
          <div class="ente-monto ${cls}" id="em-${f.fila}">${txt}</div>
          ${!excluido&&apBanco>0?`<div style="font-size:11px;color:var(--m);margin-top:2px">disponible: <span style="color:#4ADE80;font-weight:700;font-size:12px">${dTxt}</span></div>`:''}
        </div>
        <div class="ente-fecha">${fmtDiaSemana(f.fecha)}</div>
      </div>
    </div>
    <div class="ente-edit" id="ee-${f.fila}">
      <input type="number" value="${f.monto!==null?f.monto:''}" step="0.01" inputmode="decimal" id="ei-${f.fila}" placeholder="0.00"
        onkeydown="if(event.key==='Enter')guardarEnte(${f.fila});if(event.key==='Escape')togEnteEdit(${f.fila})">
      <button class="btn-check" id="ec-${f.fila}" onclick="guardarEnte(${f.fila})"><i class="fas fa-check" id="ei-ico-${f.fila}"></i></button>
    </div>`;
  }).join('')+(hayExcluidos?'<div class="ente-excluido-nota">* excluido del total</div>':'');
}
function togEnteEdit(fila){const ee=document.getElementById('ee-'+fila);const isOpen=ee.classList.contains('open');document.querySelectorAll('.ente-edit').forEach(e=>e.classList.remove('open'));if(!isOpen){ee.classList.add('open');document.getElementById('ei-'+fila).focus();}}
function guardarEnte(fila){
  const inp=document.getElementById('ei-'+fila);const val=parseFloat(inp.value);if(isNaN(val))return;
  const ico=document.getElementById('ei-ico-'+fila);ico.className='fas fa-circle-notch fa-spin';
  api.actualizarFijo(fila,val).then(r=>{
    ico.className='fas fa-check';
    if(r.ok){const {txt,cls}=fmtMoneda(val);const em=document.getElementById('em-'+fila);if(em){em.textContent=txt;em.className='ente-monto '+cls;}togEnteEdit(fila);
      Promise.all([api.getFijos(),api.getApartados(),api.getPatrimonio()]).then(([fijos,apData,pat])=>{if(apData&&typeof renderApartados==='function')renderApartados(apData);if(typeof renderEntes==='function')renderEntes(fijos);if(pat&&typeof renderPatrimonio==='function')renderPatrimonio(pat);}).catch(()=>api.getFijos().then(f=>{if(typeof renderEntes==='function')renderEntes(f);}));}
  }).catch(()=>{ico.className='fas fa-check';});
}

// ══════════════════════════════════════════
//  SOS
// ══════════════════════════════════════════
function activarSOS(){
  const btn=document.getElementById('btn-sos');if(btn){btn.disabled=true;btn.textContent='Enviando…';}
  const msg='🚨 Necesito ayuda — enviado desde RAW Entry';
  if(navigator.geolocation){navigator.geolocation.getCurrentPosition(function(pos){_doEnviarSOS(msg,'https://maps.google.com/?q='+pos.coords.latitude+','+pos.coords.longitude,btn);},function(){_doEnviarSOS(msg,'',btn);},{enableHighAccuracy:true,timeout:15000,maximumAge:0});}
  else _doEnviarSOS(msg,'',btn);
}
function _doEnviarSOS(mensaje,ubicacion,btn){
  api.enviarSOS({mensaje,ubicacion}).then(r=>{showToast(r.ok?'🚨 SOS enviado a '+r.enviados+' contacto(s)':'Error: '+r.mensaje,r.ok);if(btn){btn.disabled=false;btn.textContent='🚨 SOS';}}).catch(()=>{showToast('Error al enviar SOS',false);if(btn){btn.disabled=false;btn.textContent='🚨 SOS';}});
}

// Tooltip genérico
function initTooltip(){
  var tip=document.getElementById('gtip');if(!tip)return;
  document.addEventListener('mouseover',function(e){var t=e.target.closest('[data-tip]');if(!t){tip.classList.remove('show');return;}tip.textContent=t.getAttribute('data-tip');var r=t.getBoundingClientRect();tip.style.left=(r.left+r.width/2-tip.offsetWidth/2)+'px';tip.style.top=(r.top-tip.offsetHeight-6+window.scrollY)+'px';tip.classList.add('show');});
  document.addEventListener('mouseout',function(e){if(!e.target.closest('[data-tip]'))tip.classList.remove('show');});
}
