/* RAW Entry — Core v.4.014
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
const API_URL = 'https://script.google.com/macros/s/AKfycbytz5U_TaaE61H85pBdAsk_UUpMIfuKYopYH0kTzANJmCy8YYEfYO36uDRHhL6wI0maxw/exec';

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
  // ── Un solo request para toda la carga inicial ──
  getAll:            () => EN_GAS ? gasRun('getAll') : apiGet('getAll'),
  // ── Llamadas individuales que siguen siendo lazy ──
  getSaldoDia:       (f) => EN_GAS ? gasRun('getSaldoDia', f) : apiGet('getSaldoDia', { fecha: f }),
  getListaEstructura:() => EN_GAS ? gasRun('getListaEstructura') : apiGet('getListaEstructura'),
  // ── Escritura ──
  insertarEnRAW:     (d) => EN_GAS ? gasRun('insertarEnRAW', d) : apiPost('insertarEnRAW', { data: d }),
  actualizarFijo:    (fila, monto) => EN_GAS ? gasRun('actualizarFijo', fila, monto) : apiPost('actualizarFijo', { fila, monto }),
  agregarALista:     (colIndex, valor) => EN_GAS ? gasRun('agregarALista', colIndex, valor) : apiPost('agregarALista', { colIndex, valor }),
  marcarLogro:       (fila, val) => EN_GAS ? gasRun('marcarLogro', fila, val) : apiPost('marcarLogro', { fila, val }),
  // ── Individuales para refresh parcial post-guardar ──
  getFijos:          () => EN_GAS ? gasRun('getFijos') : apiGet('getFijos'),
  getDatosMes:       () => EN_GAS ? gasRun('getDatosMes') : apiGet('getDatosMes'),
  getGastos:         () => EN_GAS ? gasRun('getGastos') : apiGet('getGastos'),
  getLogros:         () => EN_GAS ? gasRun('getLogros') : apiGet('getLogros'),
};

// ══════════════════════════════════════════
//  ESTADO
// ══════════════════════════════════════════
const CAMPOS=['fecha','proyecto','contacto','concepto','monto','recurrencia','necesidad','clave'];
const MESES_ES=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
let sign=1, cats={}, proxSel='', contactoSel='', recSel='', necesidadSel='', sheetUrl='';
let datosMes={meses:[],grupos:{}};
let _toast=null;

// ══════════════════════════════════════════
//  PARTÍCULAS
// ══════════════════════════════════════════
(()=>{
  const c=document.getElementById('pts');
  if(!c)return;
  const tipos=['blue','blue','blue','cyan','cyan','white'];
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
//  INIT
// ══════════════════════════════════════════
window.addEventListener('DOMContentLoaded',()=>{
  const hoy=fmtD(new Date());
  document.getElementById('fecha').value=hoy;
  document.getElementById('saldo-fecha').value=hoy;
  actualizarResumenFecha(hoy);
  consultarSaldo();

  // Una sola llamada a GAS en lugar de 8
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
    })
    .catch(err=>{
      setChip('err','Error');
      mostrarErrorConexion(err.message);
    });

  initTooltip();
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
function fmtDisplay(str){if(!str)return'';const p=str.split('-');return`${p[2]}/${p[1]}/${p[0]}`;}
function fmtShort(str){if(!str)return'';const p=str.split('-');return p.length===3?`${p[2]}/${p[1]}`:''}

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
  ocultarRes();progStart();setBtn(true);
  api.insertarEnRAW({fecha,proyecto:proxSel,contacto:contactoSel,concepto,monto,recurrencia:recSel,necesidad:necesidadSel,clave:document.getElementById('clave').value.trim()})
    .then(r=>{
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
  const b=document.getElementById('btnG');b.disabled=l;
  document.getElementById('spin').style.display=l?'block':'none';
  document.getElementById('bico').style.display=l?'none':'inline';
}
function mostrarRes(ok,msg){
  const el=document.getElementById('save-res');
  document.getElementById('res-ico').textContent=ok?'✓':'✗';
  document.getElementById('res-msg').textContent=msg;
  el.className='save-res '+(ok?'ok':'err');
}
function ocultarRes(){document.getElementById('save-res').className='save-res';}

function limpiar(rf=true){
  if(rf)document.getElementById('fecha').value=fmtD(new Date());
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
//  ENTES (Fijos)
// ══════════════════════════════════════════
function renderEntes(data){
  const body=document.getElementById('entes-list');
  if(!data||!data.length){body.innerHTML='<div style="padding:16px;color:var(--m);text-align:center">Sin datos</div>';return;}
  const total=data.reduce((s,f)=>s+(f.monto||0),0);
  const {txt:tt,cls:tc}=fmtMoneda(total);
  document.getElementById('entes-total').textContent=tt;
  document.getElementById('entes-total').className='sec-hdr-val '+tc;
  body.innerHTML=data.map(f=>{
    const {txt,cls}=fmtMoneda(f.monto);
    return `<div class="ente-row" onclick="togEnteEdit(${f.fila})">
      <div class="ente-nombre">${f.nombre}</div>
      <div class="ente-right">
        <div class="ente-monto ${cls}" id="em-${f.fila}">${txt}</div>
        <div class="ente-fecha">${f.fecha}</div>
      </div>
    </div>
    <div class="ente-edit" id="ee-${f.fila}">
      <input type="number" value="${f.monto!==null?f.monto:''}" step="0.01" inputmode="decimal"
        id="ei-${f.fila}" placeholder="0.00"
        onkeydown="if(event.key==='Enter')guardarEnte(${f.fila});if(event.key==='Escape')togEnteEdit(${f.fila})">
      <button class="btn-check" id="ec-${f.fila}" onclick="guardarEnte(${f.fila})"><i class="fas fa-check" id="ei-ico-${f.fila}"></i></button>
    </div>`;
  }).join('');
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
