/* RAW Entry — Dashboard v.5.054
   Tablas Variables/Fijos · Flujo Mensual · Gráficas
   + Financiero Avanzado · Revisión · Relaciones · Salud · Apartados · Pensamientos
*/

// ══════════════════════════════════════════
//  ANUALIDAD (Fijos — tabla K:P)
// ══════════════════════════════════════════
function renderAnualidad(data){
  const body=document.getElementById('anualidad-body');
  if(!data.ok||!data.grupos||!data.grupos.length){
    body.innerHTML='<div style="padding:16px;color:var(--m);text-align:center">Sin datos</div>';return;
  }
  const esMob=document.documentElement.classList.contains('mob')||window.innerWidth<900;
  if(esMob){
    const mesActualIdx = new Date().getMonth();
    const uid = 'an'+Date.now();
    const cards = data.grupos.map((g,gi)=>{
      const isPagado = it => it.pagado==='Sí'||it.pagado==='Si'||it.pagado==='sí';
      const pagados = g.items.filter(isPagado).length;
      const totalHoy = g.items.reduce((s,it)=>{
        if(it.monto===null) return s;
        const claveL=(it.clave||'').toLowerCase();
        const MIDX={enero:0,febrero:1,marzo:2,abril:3,mayo:4,junio:5,julio:6,agosto:7,septiembre:8,octubre:9,noviembre:10,diciembre:11};
        const m=Object.keys(MIDX).find(k=>claveL.includes(k));
        if(m && MIDX[m]>mesActualIdx) return s;
        return s+(it.monto||0);
      },0);
      const {txt,cls}=fmtMoneda(totalHoy||null);
      const pct=Math.round(pagados/12*100);
      const cardId=uid+'_'+gi;
      const border=pagados>0?'rgba(34,197,94,.3)':'var(--border)';
      const mesesRows=g.items.map(it=>{
        const pag=isPagado(it);
        const {txt:mtxt}=fmtMoneda(it.monto);
        return `<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 14px;border-bottom:1px solid rgba(255,255,255,.05)">
          <span style="font-size:13px;color:var(--m);font-weight:600">${it.clave}</span>
          <span style="font-size:13px;font-weight:700;font-variant-numeric:tabular-nums;color:${pag?'var(--ok)':'var(--err)'}">${pag?'✓ ':''}${mtxt}</span>
        </div>`;
      }).join('');
      return `<div class="kard" style="border-color:${border};cursor:pointer" onclick="togKard('${cardId}')">
        <div class="kard-name">${g.concepto}<span class="kard-chev" style="float:right;font-size:11px;color:var(--m)">▾</span></div>
        <div class="kard-val ${pagados>0?'pos':cls}">${txt}</div>
        <div class="kard-prog"><div class="kard-prog-fill" style="width:${pct}%"></div></div>
        <div class="kard-meta">${pagados}/12 pagados</div>
        <div id="${cardId}" style="display:none;margin:8px -14px -14px;border-top:1px solid rgba(255,255,255,.08)">${mesesRows}</div>
      </div>`;
    }).join('');
    body.innerHTML=`<div class="cards-grid">${cards}</div>`;
  } else {
    const claves=[...new Set(data.grupos.flatMap(g=>g.items.map(it=>it.clave)))];
    const idx={};data.grupos.forEach(g=>{idx[g.concepto]={};g.items.forEach(it=>idx[g.concepto][it.clave]=it);});
    const mesActual=MESES_ES[new Date().getMonth()];
    const thead=`<tr><th>Concepto</th>${claves.map(c=>{const esA=c.toUpperCase()===mesActual.toUpperCase();return`<th class="${esA?'mes-actual':''}" style="text-align:center">${c}</th>`;}).join('')}</tr>`;
    const tbody=data.grupos.map(g=>{
      const celdas=claves.map(clave=>{
        const it=idx[g.concepto][clave];
        if(!it)return`<td style="text-align:center;color:var(--err);font-size:13px">✗</td>`;
        const {txt,cls}=fmtMoneda(it.monto);
        const pag=it.pagado==='Sí'||it.pagado==='Si'||it.pagado==='sí';
        const esA=clave.toUpperCase()===mesActual.toUpperCase();
        const tieneMonto = it.monto !== null && it.monto !== 0;
        const colorCls = tieneMonto ? (pag ? 'pos' : cls) : '';
        return `<td class="${colorCls}${esA?' mes-actual':''}" style="text-align:center">${tieneMonto?`<div>${txt}</div>`:`<div style="color:var(--err);font-size:13px">✗</div>`}</td>`;
      }).join('');
      return `<tr><td>${g.concepto}</td>${celdas}</tr>`;
    }).join('');
    body.innerHTML=`<div class="tbl-wrap"><table class="tbl"><thead>${thead}</thead><tbody>${tbody}</tbody></table></div>`;
  }
  initGraficaFijos(data);
}

// ══════════════════════════════════════════
//  GASTOS POR MES (Variables)
// ══════════════════════════════════════════
function onDatosMes(data){datosMes=data;renderGastos();initGraficas(data);}
function renderGastos(){
  const body=document.getElementById('gastos-body');
  const data=datosMes;
  if(!data.meses||!data.meses.length){body.innerHTML='<div style="padding:16px;color:var(--m);text-align:center">Sin datos</div>';return;}
  const esMob=document.documentElement.classList.contains('mob')||window.innerWidth<900;
  const mesActual=MESES_ES[new Date().getMonth()];
  if(esMob){
    const entesSet=new Set();
    data.meses.forEach(m=>(data.grupos[m]||[]).forEach(e=>entesSet.add(e.ente)));
    const entes=[...entesSet];
    const idx={};
    data.meses.forEach(mes=>{idx[mes]={};(data.grupos[mes]||[]).forEach(e=>idx[mes][e.ente]={monto:e.monto});});
    const uid2='gs_'+Date.now();
    const cards=entes.map((ente,ei)=>{
      const cardId=uid2+'_'+ei;
      const entesMesActual=['Final','P'];
      let total=0;
      if(entesMesActual.includes(ente)){total=idx[mesActual]?.[ente]?.monto||0;}
      else{data.meses.forEach(m=>{const mIdx=MESES_ES.indexOf(m);if(mIdx<=new Date().getMonth())total+=idx[m]?.[ente]?.monto||0;});}
      const {txt,cls}=fmtMoneda(total||null);
      const mesesHTML=data.meses.map(mes=>{
        const item=idx[mes]?.[ente];
        if(!item||item.monto===null)return'';
        const {txt:mtxt,cls:mcls}=fmtMoneda(item.monto);
        const esActual=mes.toUpperCase()===mesActual.toUpperCase();
        return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;border-bottom:1px solid rgba(255,255,255,.05);${esActual?'background:rgba(59,130,246,.08)':''}">
          <span style="font-size:13px;font-weight:${esActual?'700':'500'};color:${esActual?'var(--p)':'var(--m)'}">${mes}${esActual?' 📍':''}</span>
          <span style="font-size:14px;font-weight:700;font-variant-numeric:tabular-nums;color:${mcls==='pos'?'var(--ok)':mcls==='neg'?'var(--err)':'var(--m)'}">${mtxt}</span>
        </div>`;
      }).filter(Boolean).join('');
      return `<div class="kard" style="cursor:pointer" onclick="togKard('${cardId}')">
        <div class="kard-name">${ente}<span class="kard-chev" style="float:right;font-size:11px;color:var(--m);font-weight:400">▾</span></div>
        <div class="kard-val ${cls}">${txt}</div>
        <div id="${cardId}" style="display:none;margin:8px -14px -14px;border-top:1px solid rgba(255,255,255,.08)">${mesesHTML}</div>
      </div>`;
    }).join('');
    body.innerHTML=`<div class="cards-grid">${cards}</div>`;
  } else {
    const entesSet=new Set();
    data.meses.forEach(m=>(data.grupos[m]||[]).forEach(e=>entesSet.add(e.ente)));
    const entes=[...entesSet];
    const idx={};
    data.meses.forEach(mes=>{idx[mes]={};(data.grupos[mes]||[]).forEach(e=>idx[mes][e.ente]=e.monto);});
    const thead=`<tr><th>Ente</th>${data.meses.map(m=>{const esA=m.toUpperCase()===mesActual.toUpperCase();return`<th class="${esA?'mes-actual':''}">${m}</th>`;}).join('')}</tr>`;
    const tbody=entes.map(ente=>{
      const celdas=data.meses.map(mes=>{const {txt,cls}=fmtMoneda(idx[mes]?.[ente]??null);const esA=mes.toUpperCase()===mesActual.toUpperCase();return`<td class="${cls}${esA?' mes-actual':''}">${txt}</td>`;}).join('');
      return `<tr><td>${ente}</td>${celdas}</tr>`;
    }).join('');
    body.innerHTML=`<div class="tbl-wrap"><table class="tbl"><thead>${thead}</thead><tbody>${tbody}</tbody></table></div>`;
  }
}

// ══════════════════════════════════════════
//  PANEL GESTIONAR LISTA
// ══════════════════════════════════════════
const ICOS=['fa-folder','fa-user','fa-tag','fa-rotate','fa-calendar','fa-star'];
function oPanel(){
  document.getElementById('panel').classList.add('open');
  document.getElementById('panel-overlay').classList.add('show');
  document.body.style.overflow='hidden';
  cargarPanel();
}
function cPanel(){
  document.getElementById('panel').classList.remove('open');
  document.getElementById('panel-overlay').classList.remove('show');
  document.body.style.overflow='';
}
function cargarPanel(){
  const b=document.getElementById('panel-body');
  b.innerHTML='<div style="text-align:center;padding:24px;color:var(--m)"><i class="fas fa-circle-notch fa-spin" style="color:var(--p);font-size:18px"></i></div>';
  api.getListaEstructura().then(renderPanel).catch(()=>{});
}
function renderPanel(data){
  const b=document.getElementById('panel-body');
  if(!data.columnas||!data.columnas.length){b.innerHTML='<div style="padding:16px;color:var(--m)">Sin columnas</div>';return;}
  b.innerHTML=data.columnas.map((col,idx)=>`
    <div class="panel-group">
      <div class="panel-group-hdr">
        <div class="panel-group-name"><i class="fas ${ICOS[idx]||'fa-circle-dot'}"></i>${col.header}</div>
        <span class="panel-cnt" id="pc-${idx}">${col.count}</span>
      </div>
      <div class="panel-add">
        <input type="text" id="pi-${idx}" placeholder="Nuevo valor…" onkeydown="if(event.key==='Enter')addItem(${idx})">
        <button class="btn-add" onclick="addItem(${idx})"><i class="fas fa-plus"></i> Agregar</button>
      </div>
      <div class="panel-chips" id="pchips-${idx}">${col.valores.map(v=>`<span class="chip">${v}</span>`).join('')}</div>
    </div>`).join('');
}
function addItem(idx){
  const inp=document.getElementById('pi-'+idx);
  const val=inp.value.trim();if(!val)return;
  inp.disabled=true;
  api.agregarALista(idx,val).then(r=>{
    inp.disabled=false;inp.value='';
    if(r.ok){
      const chips=document.getElementById('pchips-'+idx);
      const ch=document.createElement('span');ch.className='chip new';ch.textContent=val;chips.appendChild(ch);
      const cnt=document.getElementById('pc-'+idx);cnt.textContent=parseInt(cnt.textContent)+1;
      const CMAP={0:'proyectos',1:'contactos',2:'conceptos',3:'recurrencias'};
      const key=CMAP[idx];
      if(key&&cats[key]&&!cats[key].includes(val)){
        cats[key].push(val);
        if(idx===0)buildOpts('sw-proyecto',cats.proyectos,v=>{proxSel=v;setFieldVal('proyecto',v);marcarDone('proyecto');avanzarA('proyecto');});
        else if(idx===1)buildOpts('sw-contacto',cats.contactos,v=>{contactoSel=v;setFieldVal('contacto',v);marcarDone('contacto');avanzarA('contacto');});
        else if(idx===3)buildOpts('sw-recurrencia',cats.recurrencias,v=>{recSel=v;setFieldVal('recurrencia',v);marcarDone('recurrencia');avanzarA('recurrencia');});
      }
    }
  }).catch(()=>{inp.disabled=false;});
}

// ══════════════════════════════════════════
//  REFRESH GLOBAL
// ══════════════════════════════════════════
function refreshTodo(){
  const btn=document.getElementById('btn-rf');
  btn.classList.add('spinning');btn.disabled=true;
  progStart();setChip('load','Actualizando');
  Promise.all([api.getAll(),consultarSaldo()])
  .then(([d])=>{
    if(d&&d.catalogos)   onCats(d.catalogos);
    if(d&&d.fijos)       renderEntes(d.fijos);
    if(d&&d.datosMes)    onDatosMes(d.datosMes);
    if(d&&d.gastos)      renderAnualidad(d.gastos);
    if(d&&d.logros)      renderLogros(d.logros);
    if(d&&d.necesidades) renderNecesidades(d.necesidades);
    if(d&&d.flujoPorMes) renderFlujoMensual(d.flujoPorMes);
    if(d&&d.financieroAvanzado) renderFinancieroAvanzado(d.financieroAvanzado);
    if(d&&d.apartados)   renderApartados(d.apartados);
    // Reload lazy modules
    api.getPensamientos().then(renderPensamientos).catch(()=>{});
    api.getRelaciones().then(renderRelaciones).catch(()=>{});
    api.getSalud().then(renderSalud).catch(()=>{});
    api.getPatrimonio().then(renderPatrimonio).catch(()=>{});
    if(typeof cargarScore==='function') cargarScore();
    cargarRevision('mensual', new Date().getFullYear(), new Date().getMonth()+1, null);
    btn.classList.remove('spinning');btn.disabled=false;
    progDone();showToast('Datos actualizados');
  })
  .catch(()=>{btn.classList.remove('spinning');btn.disabled=false;progDone();showToast('Error al actualizar',false);});
}

// ══════════════════════════════════════════
//  FINANCIERO AVANZADO
// ══════════════════════════════════════════
function renderFinancieroAvanzado(data){
  // Called from getAll with financieroAvanzado data
  // Merge into the unified CFO section
  if(data && data.ok) _finData = data;
  _renderCFO();
}

// ══════════════════════════════════════════
//  CFO — Financiero + Revisión fusionados
// ══════════════════════════════════════════
var _finData = null;
var _revData = null;
var _revTipo = 'mensual';

function onRevSelChange(){
  const anio   = document.getElementById('rev-sel-anio')?.value || '2026';
  const mes    = document.getElementById('rev-sel-mes')?.value  || '';
  const semana = document.getElementById('rev-sel-sem')?.value  || '';
  const tipo   = semana ? 'semanal' : mes ? 'mensual' : 'anual';
  cargarRevision(tipo, anio, mes||null, semana||null);
}

function cargarRevision(tipo, anio, mes, semana){
  _revTipo = tipo || 'mensual';
  // revision-body is rendered inside _renderCFO, spinner via fin-avanzado-body
  const _tmpBody = document.getElementById('revision-body');
  if(_tmpBody) _tmpBody.innerHTML='<div style="padding:16px;text-align:center;color:var(--m)"><i class="fas fa-circle-notch fa-spin" style="color:#C4B5FD"></i></div>';
  api.getRevision(_revTipo, anio, mes, semana)
    .then(d=>{ _revData=d; _renderCFO(); })
    .catch(()=>{});
}

function renderRevision(data){
  _revData = data;
  _renderCFO();
}

function _renderCFO(){
  const fin  = _finData || {};
  const m    = fin.metricas || {};
  const mes  = fin.mes || {};
  const rev  = _revData || {};
  const id   = rev.identidad || {};
  const ins  = rev.insights || [];
  const log  = rev.logros || {};
  const fin2 = rev.financiero || {};

  const body = document.getElementById('fin-avanzado-body');
  if(!body) return;

  const runway      = m.runwayDias;
  const runwayColor = runway===null?'var(--m)':runway<7?'var(--err)':runway<30?'var(--warn)':'var(--ok)';
  const ahorroColor = (m.porcentajeAhorro||0)<10?'var(--err)':(m.porcentajeAhorro||0)>=20?'var(--ok)':'var(--warn)';
  const fmtM = v => '$ '+(Math.abs(v)||0).toLocaleString('es-MX',{minimumFractionDigits:0});

  // ── Métricas vitales ──
  const vitales = `
    <div class="fin-grid">

      <div class="fin-card">
        <div class="fin-card-label" style="display:flex;align-items:center;gap:5px">
          <i class="fas fa-circle-dot" style="font-size:7px;color:var(--ok)"></i> SALDO
          <input type="date" id="saldo-fecha" class="saldo-date-input" onchange="consultarSaldo()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:20px;color:var(--t);font-family:inherit;font-size:10px;padding:2px 6px;outline:none;cursor:pointer;-webkit-appearance:none;margin-left:4px">
        </div>
        <div id="saldo-val" class="fin-card-val" style="color:${(m.saldoActual||0)>=0?'var(--ok)':'var(--err)'};font-size:22px;margin:4px 0">
          ${fmtMoneda(m.saldoActual).txt}
        </div>
        <div style="display:flex;gap:6px;margin-top:2px">
          <button onclick="consultarSaldo()" class="saldo-refresh-btn" title="Actualizar" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:20px;color:var(--m);cursor:pointer;font-size:10px;padding:3px 8px;font-family:inherit"><i class="fas fa-arrows-rotate"></i> Actualizar</button>
          <button onclick="irASheet()" class="saldo-refresh-btn" title="Ver Sheet" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:20px;color:var(--m);cursor:pointer;font-size:10px;padding:3px 8px;font-family:inherit"><i class="fas fa-table-cells"></i> Sheet</button>
        </div>
      </div>
      <div class="fin-card">
        <div class="fin-card-label">Runway</div>
        <div class="fin-card-val runway-val ${runway!==null&&runway<=7?'low':runway!==null&&runway<=30?'mid':'ok'}"
          style="color:${runwayColor};font-size:${runway!==null&&runway<=30?'36px':'28px'} !important">
          ${runway!==null?runway+' días':'—'}
        </div>
        <div class="fin-card-sub">al ritmo actual</div>
      </div>
      <div class="fin-card">
        <div class="fin-card-label">Gasto/día prom.</div>
        <div class="fin-card-val">$ ${(m.gastoPorDiaPromedio||0).toLocaleString('es-MX')}</div>
        <div class="fin-card-sub">últimos 30 días</div>
      </div>
      <div class="fin-card">
        <div class="fin-card-label">% Ahorro mes</div>
        <div class="fin-card-val" style="color:${ahorroColor}">${m.porcentajeAhorro||0}%</div>
        <div class="fin-card-sub">meta: ≥20%</div>
      </div>
    </div>`;

  // ── Este mes ──
  const esteMes = `
    <div style="padding:0 var(--pad) 8px">
      <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m);margin-bottom:8px">Este mes</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
        <div class="fin-card" style="text-align:center">
          <div class="fin-card-label">Ingresos</div>
          <div class="fin-card-val" style="font-size:16px;color:var(--ok)">$ ${(mes.ingresos||0).toLocaleString('es-MX')}</div>
        </div>
        <div class="fin-card" style="text-align:center">
          <div class="fin-card-label">Egresos</div>
          <div class="fin-card-val" style="font-size:16px;color:var(--err)">$ ${(mes.egresos||0).toLocaleString('es-MX')}</div>
        </div>
        <div class="fin-card" style="text-align:center">
          <div class="fin-card-label">Excedente</div>
          <div class="fin-card-val" style="font-size:16px;color:${(mes.excedente||0)>=0?'var(--ok)':'var(--err)'}">
            ${fmtMoneda(mes.excedente).txt}
          </div>
        </div>
      </div>
    </div>`;

  // ── Proyección — solo mostrar si difiere de los datos reales del mes ──
  const _proyDiferente = mes.proyeccion && mes.proyeccion.diasRestantes > 0 &&
    Math.abs((mes.proyeccion.egresos||0) - Math.abs(mes.egresos||0)) > 100;
  const proyeccion = _proyDiferente ? `
    <div style="margin:0 var(--pad) 8px;padding:10px 14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:var(--rad)">
      <div style="font-size:10px;font-weight:600;color:var(--m);margin-bottom:6px">
        📈 Proyección fin de mes (${mes.proyeccion.diasRestantes} días restantes)
      </div>
      <div style="display:flex;justify-content:space-between;font-size:13px">
        <span style="color:var(--m)">Egresos proyectados</span>
        <span style="color:var(--err);font-weight:600">$ ${(mes.proyeccion.egresos||0).toLocaleString('es-MX')}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-top:4px">
        <span style="color:var(--m)">Excedente proyectado</span>
        <span style="color:${(mes.proyeccion.excedente||0)>=0?'var(--ok)':'var(--err)'};font-weight:700">
          ${fmtMoneda(mes.proyeccion.excedente).txt}
        </span>
      </div>
    </div>` : '';

  // ── Análisis del período (Revisión) ──
  var revHtml = '';
  if(rev.ok){
    const scoreInv = id.scoreInversionista||0;
    const scoreCon = id.scoreConsumidor||0;
    revHtml = `
    <div id="revision-body" style="padding:0 var(--pad) 8px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div style="font-size:11px;color:var(--m)">${rev.periodo?rev.periodo.inicio+' — '+rev.periodo.fin:''}</div>
        <div style="font-size:10px;color:#C4B5FD;font-weight:600;text-transform:uppercase">${rev.tipo||''}</div>
      </div>
      <div class="rev-score-wrap">
        <div class="rev-score inv">
          <div class="rev-score-num">${scoreInv}%</div>
          <div class="rev-score-lbl">Inversionista</div>
        </div>
        <div class="rev-score con">
          <div class="rev-score-num">${scoreCon}%</div>
          <div class="rev-score-lbl">Consumidor</div>
        </div>
      </div>
      ${ins.length ? `
      <div style="margin-top:8px">
        <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m);margin-bottom:6px">💡 Insights</div>
        <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:var(--rad);overflow:hidden">
          ${ins.map(i=>`<div class="insight-item">
            <div class="insight-dot ${i.tipo}"></div>
            <span style="color:${i.tipo==='alerta'?'var(--err)':i.tipo==='positivo'?'var(--ok)':i.tipo==='identidad'?'#C4B5FD':'var(--m)'}">
              ${i.msg}
            </span>
          </div>`).join('')}
        </div>
      </div>` : ''}
    </div>`;
  } else {
    revHtml = '<div id="revision-body" style="padding:8px var(--pad);color:var(--m);font-size:12px;text-align:center">Selecciona período para ver análisis</div>';
  }

  body.innerHTML = vitales + esteMes + proyeccion + revHtml;
  // Inicializar saldo después de renderizar
  setTimeout(function(){
    const sf = document.getElementById('saldo-fecha');
    if(sf && !sf.value){
      const h = new Date();
      sf.value = h.getFullYear()+'-'+String(h.getMonth()+1).padStart(2,'0')+'-'+String(h.getDate()).padStart(2,'0');
    }
    if(typeof consultarSaldo==='function') consultarSaldo();
  }, 50);

}

// ══════════════════════════════════════════
//  RELACIONES
// ══════════════════════════════════════════
let _relacionesData = [];

function renderRelaciones(data){
  _relacionesData = (data && data.items) ? data.items : [];
  const body = document.getElementById('relaciones-body');
  if(!body) return;
  if(!_relacionesData.length){
    body.innerHTML='<div style="padding:24px;text-align:center;color:var(--m)">Sin relaciones — agrega personas con el tab 👥</div>';
    return;
  }

  const sorted = [..._relacionesData].sort((a,b)=>{
    // Más reciente primero
    if(!a.ultimaVez && !b.ultimaVez) return 0;
    if(!a.ultimaVez) return 1;
    if(!b.ultimaVez) return -1;
    return new Date(b.ultimaVez) - new Date(a.ultimaVez);
  });

  const hoy = new Date(); hoy.setHours(0,0,0,0);

  body.innerHTML = sorted.map(p=>{
    const inicial = (p.nombre||'?')[0].toUpperCase();
    const eClass  = p.energia > 0 ? 'positivo' : p.energia < 0 ? 'negativo' : '';
    const eLbl    = p.energia > 0 ? '+ energía' : p.energia < 0 ? '− energía' : 'neutral';
    const eColor  = p.energia > 0 ? 'pos' : p.energia < 0 ? 'neg' : 'neu';

    let diasStr = '';
    if(p.ultimaVez){
      const diff = Math.floor((hoy - new Date(p.ultimaVez)) / 86400000);
      diasStr = diff===0?'Hoy':diff===1?'Ayer':diff+' días';
    }

    return `<div class="rel-item">
      <div class="rel-avatar ${eClass}">${inicial}</div>
      <div class="rel-info">
        <div class="rel-nombre">${p.nombre} ${p.sos?'<span style="font-size:10px;color:var(--err)">🚨</span>':''}</div>
        <div class="rel-meta">${p.tipo||''}${diasStr?' · '+diasStr:''}</div>
      </div>
      <div class="rel-energia ${eColor}">${eLbl}</div>
    </div>`;
  }).join('');
}

// ══════════════════════════════════════════
//  SALUD
// ══════════════════════════════════════════
let _saludData = [];

function renderSalud(data){
  _saludData = (data && data.items) ? data.items : [];
  const body    = document.getElementById('salud-body');
  const proxBox = document.getElementById('salud-proximas');
  if(!body) return;

  // Próximas citas
  const proximas = (data && data.proximas) ? data.proximas : [];
  if(proxBox && proximas.length){
    proxBox.innerHTML = proximas.slice(0,3).map(c=>`
      <div class="proxima-cita">
        <div style="font-size:11px;font-weight:600;color:var(--warn)">📅 Próxima cita</div>
        <div style="font-size:13px;color:#fff;margin-top:3px">${c.descripcion}</div>
        <div style="font-size:11px;color:var(--m);margin-top:2px">${c.doctor?c.doctor+' · ':''}${c.proxima}</div>
      </div>`).join('');
  } else if(proxBox){
    proxBox.innerHTML = '';
  }

  if(!_saludData.length){
    body.innerHTML='<div style="padding:24px;text-align:center;color:var(--m)">Sin registros — agrega con el tab 🏥</div>';
    return;
  }

  body.innerHTML = _saludData.slice(0,20).map(item=>{
    const badgeClass = ['Cita','Síntoma','Medicamento','Resultado','Vacuna'].includes(item.tipo)
      ? item.tipo : 'salud-badge-default';
    return `<div class="salud-item">
      <div>
        <span class="salud-tipo-badge ${badgeClass}">${item.tipo||'—'}</span>
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:600;color:#fff">${item.descripcion}</div>
        <div style="font-size:11px;color:var(--m)">${item.doctor?item.doctor+' · ':''}${item.fecha}</div>
        ${item.notas?`<div style="font-size:11px;color:var(--m);margin-top:2px">${item.notas}</div>`:''}
      </div>
      <div style="font-size:11px;font-weight:500;color:${item.estado==='Completado'?'var(--ok)':item.estado==='Cancelado'?'var(--err)':'var(--m)'}">
        ${item.estado||''}
      </div>
    </div>`;
  }).join('');
}

// ══════════════════════════════════════════
//  APARTADOS
// ══════════════════════════════════════════
let _apartadosData = [];

function renderApartados(data){
  _apartadosData = (data && data.items) ? data.items : [];
  const body = document.getElementById('apartados-list') || document.getElementById('apartados-body');
  if(!body) return;
  const total = document.getElementById('apartados-total');
  const totalEl = document.getElementById('apartados-total');
  if(!body) return;

  if(totalEl){
    const {txt,cls} = fmtMoneda(data && data.totalApartado ? data.totalApartado : 0);
    totalEl.textContent = txt;
    totalEl.className = 'sec-hdr-val '+cls;
  }

  if(!_apartadosData.length){
    body.innerHTML='<div style="padding:24px;text-align:center;color:var(--m)">Sin apartados — agrega con el tab 💰</div>';
    return;
  }

  const hoy = new Date(); hoy.setHours(0,0,0,0);

  body.innerHTML = _apartadosData.map(ap=>{
    const {txt:mTxt} = fmtMoneda(ap.monto);
    const usado = ap.estado === 'Usado';
    let metaStr = '';
    if(ap.meta){
      const diff = Math.floor((new Date(ap.meta) - hoy) / 86400000);
      metaStr = diff < 0 ? 'Vencido' : diff===0 ? 'Hoy' : 'en '+diff+' días';
    }
    return `<div class="apartado-item ${usado?'usado':''}">
      <div class="apartado-icon">💰</div>
      <div class="apartado-info">
        <div class="apartado-nombre">${ap.nombre}</div>
        <div class="apartado-meta">${ap.banco||''}${ap.banco&&ap.categoria?' · ':''}${ap.categoria||''}${metaStr?' · '+metaStr:''}</div>
      </div>
      <div>
        <div class="apartado-monto">${mTxt}</div>
        ${!usado?`<button onclick="_marcarApartadoUsado(${ap.fila})"
          style="font-size:10px;padding:2px 8px;border-radius:var(--rad-pill);border:1px solid rgba(255,255,255,.1);
          background:none;color:var(--m);cursor:pointer;font-family:inherit;margin-top:4px;display:block">
          Usar
        </button>`:''}
      </div>
    </div>`;
  }).join('');
}

function _marcarApartadoUsado(fila){
  api.actualizarApartado(fila, 'Usado')
    .then(r=>{
      if(r.ok){ showToast('Apartado marcado como usado'); api.getApartados().then(renderApartados); }
      else showToast(r.mensaje||'Error', false);
    }).catch(()=>showToast('Error',false));
}

// ══════════════════════════════════════════
//  PENSAMIENTOS
// ══════════════════════════════════════════
let _pensamientosData = [];

function renderPensamientos(data){
  _pensamientosData = (data && data.items) ? data.items : [];
  const body = document.getElementById('pensamientos-body');
  if(!body) return;
  if(!_pensamientosData.length){
    body.innerHTML='<div style="padding:24px;text-align:center;color:var(--m)">Sin registros — usa el tab 💭 para agregar</div>';
    return;
  }
  const CAT_COLORS = {
    'Emoción':'#EC4899','Idea':'#3B82F6','Reflexión':'#8B5CF6',
    'Decisión':'#F59E0B','Sueño':'#06B6D4'
  };
  body.innerHTML = _pensamientosData.slice(0,30).map(p=>{
    const color = CAT_COLORS[p.categoria] || 'var(--m)';
    const energiaIcons = p.energia ? '⚡'.repeat(Math.min(p.energia,5)) : '';
    return `<div style="padding:12px var(--pad);border-bottom:1px solid rgba(255,255,255,.04)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
        <div style="display:flex;align-items:center;gap:8px">
          ${p.categoria?`<span style="font-size:10px;padding:2px 8px;border-radius:var(--rad-pill);background:${color}22;color:${color};font-weight:600;border:1px solid ${color}44">${p.categoria}</span>`:''}
          ${p.etiquetas?`<span style="font-size:10px;color:var(--m)">${p.etiquetas}</span>`:''}
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          ${energiaIcons?`<span style="font-size:10px">${energiaIcons}</span>`:''}
          <span style="font-size:10px;color:var(--m)">${p.fecha}</span>
        </div>
      </div>
      <div style="font-size:13px;color:var(--t);line-height:1.5">${p.texto}</div>
    </div>`;
  }).join('');
}

// ══════════════════════════════════════════
//  GRÁFICAS — Chart.js via CDN
// ══════════════════════════════════════════
let grafChart = null;
let grafData  = null;

const GRAF_COLORS = {
  'Final':{'line':'#FFFFFF','width':3},'P':{'line':'#3B82F6','width':1.5},
  'M':{'line':'#06B6D4','width':1.5},'BW':{'line':'#8B5CF6','width':1.5},
  'Foodies':{'line':'#F59E0B','width':1.5},'Blue':{'line':'#4ADE80','width':1.5},
  'Espiritu':{'line':'#EF4444','width':1.5},'Espíritu':{'line':'#EF4444','width':1.5},
  'Mercader':{'line':'#EC4899','width':1.5},'Aseo':{'line':'#FB923C','width':1.5},
  'Suscripción':{'line':'#A78BFA','width':1.5},'Inicio':{'line':'#34D399','width':1.5},
  '∴':{'line':'#67E8F9','width':1.5},
};
const PALETA_ROTATIVA=['#3B82F6','#06B6D4','#8B5CF6','#F59E0B','#4ADE80','#EF4444','#EC4899','#FB923C','#A78BFA','#34D399','#67E8F9','#FBBF24','#F472B6','#60A5FA','#2DD4BF','#C084FC','#FCA5A5','#86EFAC','#7DD3FC','#FCD34D','#E879F9','#4ADE80','#F87171','#38BDF8','#A3E635','#FB7185','#818CF8','#34D399','#FDBA74','#E2E8F0'];
let _paletaIdx=0;
const _colorCache={};
function getEnteColor(ente){
  if(GRAF_COLORS[ente])return GRAF_COLORS[ente];
  if(!_colorCache[ente]){_colorCache[ente]={line:PALETA_ROTATIVA[_paletaIdx%PALETA_ROTATIVA.length],width:1.5};_paletaIdx++;}
  return _colorCache[ente];
}
function initGraficas(data){
  grafData=data;
  if(!window.Chart){
    const s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
    s.onload=()=>{setTimeout(mostrarGraficaAnual,100);};
    s.onerror=()=>{const l=document.getElementById('graf-loading');if(l)l.innerHTML='<span style="color:var(--err)">Error cargando Chart.js</span>';};
    document.head.appendChild(s);
  } else { setTimeout(mostrarGraficaAnual,50); }
}
function mostrarGraficaAnual(){
  const data=grafData;
  if(!data||!data.meses||!window.Chart)return;
  const entesSet=new Set();
  data.meses.forEach(mes=>{(data.grupos[mes]||[]).forEach(e=>entesSet.add(e.ente));});
  const entes=[...entesSet];
  const idx={};
  data.meses.forEach(mes=>{idx[mes]={};(data.grupos[mes]||[]).forEach(e=>idx[mes][e.ente]=e.monto);});
  const entesGraf=entes.filter(e=>e!=='BW'&&e!=='Final'&&e!=='Inicio');
  const dsets=entesGraf.map(ente=>{
    const cfg=getEnteColor(ente);
    return{label:ente,data:data.meses.map(mes=>{const v=idx[mes]?.[ente];if(v===null||v===undefined)return null;return Math.abs(v);}),borderColor:cfg.line,borderWidth:1.5,pointRadius:3,pointHoverRadius:6,fill:false,tension:0.3,spanGaps:true,order:1};
  });
  renderChart(data.meses,dsets,'Vista Anual');
}
function renderChart(labels,datasets,titulo){
  const loading=document.getElementById('graf-loading');
  const canvas=document.getElementById('graf-canvas');
  if(!canvas)return;
  if(loading)loading.style.display='none';
  canvas.style.display='block';
  if(grafChart){try{grafChart.destroy();}catch(e){}grafChart=null;}
  grafChart=new Chart(canvas,{type:'line',data:{labels,datasets},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{display:false},tooltip:{backgroundColor:'rgba(15,23,42,.95)',borderColor:'rgba(59,130,246,.3)',borderWidth:1,titleColor:'#fff',bodyColor:'#94A3B8',padding:10,callbacks:{label:ctx=>{const v=ctx.raw;if(v===null||v===undefined)return null;const fmt=(v<0?'− ':'')+'$ '+Math.abs(v).toLocaleString('es-MX',{minimumFractionDigits:2});return' '+ctx.dataset.label+': '+fmt;}}}},scales:{x:{grid:{color:'rgba(255,255,255,.05)'},ticks:{color:'#64748B',font:{size:11}}},y:{grid:{color:'rgba(255,255,255,.05)'},ticks:{color:'#64748B',font:{size:11},callback:v=>'$'+Math.abs(v/1000).toFixed(0)+'k'}}}}});
  const ley=document.getElementById('graf-leyenda');
  ley.innerHTML=datasets.map(d=>`<div style="display:flex;align-items:center;gap:5px;font-size:11px;color:${d.borderColor};font-weight:${d.label==='Final'?'700':'400'}"><div style="width:16px;height:2px;background:${d.borderColor};border-radius:1px"></div>${d.label}</div>`).join('');
}
function syncFijosHeight(){
  // sec-entrada moved to popup, no sync needed
}
window.addEventListener('DOMContentLoaded',()=>{setTimeout(syncFijosHeight,300);});
window.addEventListener('resize',syncFijosHeight);

// ══════════════════════════════════════════
//  FLUJO MENSUAL
// ══════════════════════════════════════════
function renderFlujoMensual(data){
  const body = document.getElementById('flujo-mensual-body') || document.getElementById('flujo-body');
  if(!body) return;
  if(!data||!data.meses||!data.meses.length){body.innerHTML='<div style="padding:16px;color:var(--m);text-align:center">Sin datos</div>';return;}
  const mesActual=MESES_ES[new Date().getMonth()];
  const rows=data.meses.map(mes=>{
    const g=data.grupos[mes]||{ingresos:0,egresos:0,excedente:null};
    const ingresos=g.ingresos||0,egresos=g.egresos||0;
    const excedente=g.excedente!==undefined?g.excedente:(ingresos+egresos);
    const esActual=false; // El mes actual ya se muestra en 'Este Mes' arriba
    const fmtMXN=v=>'$ '+Math.abs(v).toLocaleString('es-MX',{minimumFractionDigits:2});
    const ingCell=ingresos===0?`<td class="r" style="color:var(--m)">$ 0</td>`:`<td class="r" style="color:var(--ok);font-weight:600">${fmtMXN(ingresos)}</td>`;
    const egrCell=egresos===0?`<td class="r" style="color:var(--m)">$ 0</td>`:`<td class="r" style="color:var(--err);font-weight:600">− ${fmtMXN(Math.abs(egresos))}</td>`;
    const excCell=excedente===0?`<td class="r" style="color:var(--m)">$ 0</td>`:`<td class="r" style="color:${excedente>0?'var(--ok)':'var(--err)'};font-weight:700">${excedente<0?'− ':''}${fmtMXN(excedente)}</td>`;
    return `<tr style="${esActual?'background:rgba(59,130,246,.08)':''}"><td style="font-weight:${esActual?700:500};color:${esActual?'var(--p)':'var(--t)'}">${mes}${esActual?' ↑':''}</td>${ingCell}${egrCell}${excCell}</tr>`;
  }).join('');
  body.innerHTML=`
    <style>
      #flujo-tbl{width:100%;border-collapse:collapse;font-size:12px}
      #flujo-tbl th,#flujo-tbl td{padding:7px 10px;border-bottom:1px solid rgba(255,255,255,.05)}
      #flujo-tbl th{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--m);padding-bottom:6px}
      #flujo-tbl .r{text-align:right}
      #flujo-tbl .c-mes{width:70px}
      #flujo-tbl .c-num{width:110px}
    </style>
    <table id="flujo-tbl">
      <colgroup><col class="c-mes"><col class="c-num"><col class="c-num"><col class="c-num"></colgroup>
      <thead><tr>
        <th>Mes</th>
        <th class="r" style="color:var(--ok)">Ingresos</th>
        <th class="r" style="color:var(--err)">Egresos</th>
        <th class="r">Excedente</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

// ══════════════════════════════════════════
//  GRÁFICA FIJOS
// ══════════════════════════════════════════
let grafFijosChart=null;
const FIJOS_COLORS=['#3B82F6','#06B6D4','#8B5CF6','#F59E0B','#4ADE80','#EF4444','#EC4899','#FB923C','#A78BFA','#34D399','#67E8F9','#FBBF24','#F472B6','#60A5FA','#2DD4BF','#C084FC','#FCA5A5','#86EFAC','#7DD3FC','#FCD34D','#E879F9','#F87171','#38BDF8','#A3E635','#FB7185','#818CF8','#FDBA74','#E2E8F0','#84CC16','#6366F1'];
function initGraficaFijos(data){
  if(!data||!data.ok||!data.grupos||!data.grupos.length)return;
  if(!window.Chart){const wait=setInterval(()=>{if(window.Chart){clearInterval(wait);renderGraficaFijos(data);}},100);return;}
  renderGraficaFijos(data);
}
function renderGraficaFijos(data){
  const loading=document.getElementById('graf-fijos-loading');
  const canvas=document.getElementById('graf-fijos-canvas');
  const leyenda=document.getElementById('graf-fijos-leyenda');
  if(!canvas)return;
  const claves=[...new Set(data.grupos.flatMap(g=>g.items.map(it=>it.clave)))];
  const datasets=data.grupos.map((g,i)=>{
    const color=FIJOS_COLORS[i%FIJOS_COLORS.length];
    const puntos=claves.map(clave=>{const it=g.items.find(it=>it.clave===clave);return it&&it.monto!==null?Math.abs(it.monto):null;});
    return{label:g.concepto,data:puntos,borderColor:color,borderWidth:1.5,pointRadius:3,pointHoverRadius:6,fill:false,tension:0.3,spanGaps:true};
  });
  if(loading)loading.style.display='none';
  canvas.style.display='block';
  if(grafFijosChart){try{grafFijosChart.destroy();}catch(e){}grafFijosChart=null;}
  grafFijosChart=new Chart(canvas,{type:'line',data:{labels:claves,datasets},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{display:false},tooltip:{backgroundColor:'rgba(15,23,42,.95)',borderColor:'rgba(6,182,212,.3)',borderWidth:1,titleColor:'#fff',bodyColor:'#94A3B8',padding:10,callbacks:{label:ctx=>{const v=ctx.raw;if(v===null||v===undefined)return null;return' '+ctx.dataset.label+': $ '+Math.abs(v).toLocaleString('es-MX',{minimumFractionDigits:2});}}}},scales:{x:{grid:{color:'rgba(255,255,255,.05)'},ticks:{color:'#64748B',font:{size:11}}},y:{grid:{color:'rgba(255,255,255,.05)'},ticks:{color:'#64748B',font:{size:11},callback:v=>'$'+Math.abs(v/1000).toFixed(1)+'k'}}}}});
  if(leyenda){leyenda.innerHTML=datasets.map(d=>`<div style="display:flex;align-items:center;gap:5px;font-size:11px;color:${d.borderColor}"><div style="width:16px;height:2px;background:${d.borderColor};border-radius:1px"></div>${d.label}</div>`).join('');}
}

// ══════════════════════════════════════════
//  SCORE DE VIDA
// ══════════════════════════════════════════
let _scoreData = null;

function cargarScore(){
  const body = document.getElementById('score-body');
  if(!body) return;
  if(body) body.innerHTML = '<div style="text-align:center;padding:40px;color:var(--m)"><i class="fas fa-circle-notch fa-spin" style="font-size:20px;color:#8B5CF6"></i></div>';
  api.getScoreVida().then(function(d){ _scoreData=d; renderScore(d); }).catch(function(e){ var b=document.getElementById('score-body'); if(b) b.innerHTML='<div style="color:#EF4444;padding:16px;font-size:12px">Error: '+String(e)+'</div>'; });
}

function renderScore(data){
  var body = document.getElementById('score-body');
  if(!body) return;
  if(!data || !data.ok){
    body.innerHTML = '<div style="padding:20px;color:#EF4444;font-size:12px">Sin datos del score</div>';
    return;
  }

  var pct   = (data.score||{}).total || 0;
  var des   = (data.score||{}).desglose || {};
  var mx    = (data.score||{}).maximos  || {dinero:25,habitos:25,salud:20,relaciones:15,mental:15};
  var fin   = data.finDetalle || {};
  var color = pct>=70?'#4ADE80':pct>=55?'#F59E0B':'#EF4444';
  var estado = (data.score||{}).estado || '';

  var R = 54, C = 2*Math.PI*R;

  var html = '';

  // Gauge
  html += '<div style="display:flex;flex-direction:column;align-items:center;padding:20px 16px 8px">';
  html += '<svg width="140" height="140" viewBox="0 0 140 140">';
  html += '<circle cx="70" cy="70" r="'+R+'" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="12"/>';
  html += '<circle cx="70" cy="70" r="'+R+'" fill="none" stroke="'+color+'" stroke-width="12"';
  html += ' stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+(C*(1-pct/100)).toFixed(1)+'"';
  html += ' stroke-linecap="round" transform="rotate(-90 70 70)" style="transition:stroke-dashoffset .8s ease"/>';
  html += '<text x="70" y="65" text-anchor="middle" font-size="32" font-weight="700" fill="'+color+'" font-family="system-ui">'+pct+'</text>';
  html += '<text x="70" y="82" text-anchor="middle" font-size="11" fill="rgba(255,255,255,.4)" font-family="system-ui">/100</text>';
  html += '</svg>';
  html += '<div style="font-size:12px;color:rgba(255,255,255,.5);margin-top:4px">'+estado+'</div>';
  html += '</div>';

  // Alertas/positivos rápidos
  var msgs = (data.alertas||[]).concat(data.positivos||[]);
  if(msgs.length){
    html += '<div style="padding:0 16px 8px">';
    msgs.slice(0,3).forEach(function(m){
      var c = m.nivel==='critico'?'#EF4444':m.nivel==='positivo'?'#4ADE80':'#F59E0B';
      html += '<div style="font-size:11px;color:'+c+';padding:2px 0">'+m.area+' '+m.msg+'</div>';
    });
    html += '</div>';
  }

  // Estado
  html += '<div style="text-align:center;font-size:10px;color:rgba(255,255,255,.25);padding:0 16px 8px;letter-spacing:.05em;text-transform:uppercase">'+estado+'</div>';

  // Barras con desglose
  var areas = [
    {key:'dinero',    label:'Dinero',     icon:'💰', color:'#4ADE80', max:mx.dinero||25,
     info:'Ahorro: '+fin.pctAhorro+'% · Runway: '+fin.runway+' días · Vel: '+fin.velGasto+'%'},
    {key:'habitos',   label:'Hábitos',    icon:'⚡', color:'#3B82F6', max:mx.habitos||25,
     info:'Checks esta semana: '+fin.checksRecientes},
    {key:'salud',     label:'Salud',      icon:'🏥', color:'#EF4444', max:mx.salud||20,
     info:'Registros: '+fin.numSalud+' · Citas vencidas: '+fin.citasVencidas},
    {key:'relaciones',label:'Relaciones', icon:'👥', color:'#06B6D4', max:mx.relaciones||15,
     info:'Personas: '+fin.numPersonas+' · Recientes: '+fin.interRecientes},
    {key:'mental',    label:'Mental',     icon:'🧠', color:'#8B5CF6', max:mx.mental||15,
     info:'Logros: '+fin.logrosComp+' de '+fin.logrosTotal},
  ];

  html += '<div style="padding:4px 16px 16px">';
  areas.forEach(function(a){
    var val  = des[a.key]||0;
    var pctA = Math.min(100,Math.round(val/a.max*100));
    html += '<div style="margin-bottom:14px">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">';
    html += '<span style="font-size:13px;font-weight:600;color:#fff">'+a.icon+' '+a.label+'</span>';
    html += '<span style="font-size:13px;font-weight:700;color:'+a.color+'">'+val+'<span style="font-size:10px;color:rgba(255,255,255,.3)">/'+a.max+'</span></span>';
    html += '</div>';
    html += '<div style="height:4px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;margin-bottom:4px">';
    html += '<div style="height:100%;width:'+pctA+'%;background:'+a.color+';border-radius:2px"></div>';
    html += '</div>';
    html += '<div style="font-size:10px;color:rgba(255,255,255,.4)">'+a.info+'</div>';
    html += '</div>';
  });
  html += '</div>';

  body.innerHTML = html;
}



// ══════════════════════════════════════════
//  MASLOW INLINE — Anverso col-4
// ══════════════════════════════════════════
var _necInlineData = null;
var _necInlineVista = 'piramide';
var _radarInlineChart = null;

// switchNecInline eliminado — vista única sin toggle

function renderNecesidadesInline(data){
  if(!data) return;
  _necInlineData = data;
  var niveles = data.niveles || [];
  // Radar y pirámide visual en mismo renglón
  _dibujarRadarYPiramideInline(niveles);
  // Barras con detalle abajo
  _dibujarPiramideInline(niveles);
}

function _dataNivelInline(key, arr){
  return (arr||[]).find(function(n){ return n.key===key; }) || {key:key,total:0,conceptos:[]};
}

function _dibujarRadarYPiramideInline(niveles){
  var wrap = document.getElementById('nec-inline-radar-wrap');
  if(!wrap) return;

  var totalSum = NEC_NIVELES.reduce(function(s,n){ return s+Math.abs(_dataNivelInline(n.key,niveles).total||0); },0);

  // Pirámide SVG — cada nivel tiene ancho proporcional a su %
  var pisos = NEC_NIVELES.slice().reverse(); // 5 arriba, 1 abajo
  var svgH = 160;
  var svgW = 160;
  var nivH = svgH / pisos.length; // altura de cada piso
  var rects = pisos.map(function(niv, i){
    var d   = _dataNivelInline(niv.key, niveles);
    var abs = Math.abs(d.total||0);
    var pct = totalSum > 0 ? abs/totalSum : 0;
    // Ancho mínimo 8% para que se vea, máximo 100%
    var w   = Math.max(0.08, pct) * svgW;
    var x   = (svgW - w) / 2;
    var y   = i * nivH;
    return {niv:niv, abs:abs, pct:pct, w:w, x:x, y:y, h:nivH-2, vacio:abs===0};
  });

  var svgRects = rects.map(function(r){
    var op = r.vacio ? 0.2 : 0.85;
    return '<rect x="'+r.x.toFixed(1)+'" y="'+r.y.toFixed(1)+'" width="'+r.w.toFixed(1)+'" height="'+r.h.toFixed(1)+'" rx="3"'+
      ' fill="'+r.niv.color+'" opacity="'+op+'"/>';
  }).join('');

  var piramideSVG = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:160px;flex-shrink:0">'+
    '<svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">'+
      svgRects+
    '</svg>'+
    '<div style="font-size:10px;color:rgba(255,255,255,.35);margin-top:2px;text-align:center">Distribución</div>'+
  '</div>';

  wrap.innerHTML = '<div style="display:flex;align-items:center;gap:8px;padding:12px 16px 4px">'+
    '<canvas id="radar-inline-canvas" style="width:160px;height:160px;flex-shrink:0"></canvas>'+
    piramideSVG+
  '</div>';

  // Leyenda debajo
  var leyenda = '<div style="display:flex;flex-wrap:wrap;gap:6px 12px;padding:0 16px 8px">';
  NEC_NIVELES.forEach(function(niv){
    var d   = _dataNivelInline(niv.key, niveles);
    var abs = Math.abs(d.total||0);
    var pct = totalSum > 0 ? Math.round(abs/totalSum*100) : 0;
    leyenda += '<div style="display:flex;align-items:center;gap:4px">'+
      '<div style="width:8px;height:8px;border-radius:2px;background:'+niv.color+';opacity:'+(abs===0?.3:1)+'"></div>'+
      '<span style="font-size:10px;color:var(--m)">'+niv.label+'</span>'+
      '<span style="font-size:10px;font-weight:700;color:#fff">'+pct+'%</span>'+
    '</div>';
  });
  leyenda += '</div>';
  wrap.insertAdjacentHTML('beforeend', leyenda);

  // Inicializar radar
  setTimeout(function(){
    var canvas = document.getElementById('radar-inline-canvas');
    if(!canvas || !window.Chart) return;
    var labels  = NEC_NIVELES.map(function(n){ return n.label; });
    var valores = NEC_NIVELES.map(function(n){ return Math.abs(_dataNivelInline(n.key,niveles).total||0); });
    var colors  = NEC_NIVELES.map(function(n){ return n.color; });
    var maxVal  = Math.max.apply(null, valores.concat([1]));
    var norm    = valores.map(function(v){ return v/maxVal*100; });
    if(_radarInlineChart){ try{_radarInlineChart.destroy();}catch(e){} _radarInlineChart=null; }
    _radarInlineChart = new Chart(canvas,{
      type:'radar',
      data:{ labels:labels, datasets:[{ data:norm,
        backgroundColor:'rgba(139,92,246,.15)', borderColor:'rgba(139,92,246,.7)',
        borderWidth:2, pointBackgroundColor:colors, pointBorderColor:'#111',
        pointBorderWidth:2, pointRadius:4, fill:true }]},
      options:{ responsive:false, plugins:{ legend:{display:false},
        tooltip:{ backgroundColor:'rgba(15,23,42,.95)', callbacks:{
          label:function(ctx){ return ' $'+valores[ctx.dataIndex].toLocaleString('es-MX',{minimumFractionDigits:0}); }}}},
        scales:{ r:{ min:0, max:100,
          angleLines:{color:'rgba(255,255,255,.06)'}, grid:{color:'rgba(255,255,255,.06)'},
          ticks:{display:false},
          pointLabels:{ font:{size:9,weight:'600',family:'system-ui'},
            color:function(ctx){ return colors[ctx.index]||'#94A3B8'; }}}}}
    });
  }, 80);
}

function _dibujarPiramideInline(niveles){
  var cont = document.getElementById('nec-inline-container');
  if(!cont) return;
  var totalSum = NEC_NIVELES.reduce(function(s,n){ return s+Math.abs(_dataNivelInline(n.key,niveles).total||0); },0);
  var maxAbs = 1;
  NEC_NIVELES.forEach(function(n){ var v=Math.abs(_dataNivelInline(n.key,niveles).total||0); if(v>maxAbs) maxAbs=v; });

  // Donut
  var donutHTML = '<div style="display:flex;align-items:center;gap:12px;padding:12px 16px 8px">';
  donutHTML += '<canvas id="nec-donut-canvas" width="80" height="80" style="flex-shrink:0"></canvas>';
  donutHTML += '<div style="flex:1">';
  var sorted = NEC_NIVELES.map(function(n){ var d=_dataNivelInline(n.key,niveles); return {label:n.label,color:n.color,abs:Math.abs(d.total||0),pct:totalSum>0?(Math.abs(d.total||0)/totalSum*100):0}; }).sort(function(a,b){return b.abs-a.abs;});
  sorted.forEach(function(n){
    if(n.abs===0) return;
    donutHTML += '<div style="display:flex;align-items:center;gap:5px;margin-bottom:3px">';
    donutHTML += '<div style="width:6px;height:6px;border-radius:50%;background:'+n.color+';flex-shrink:0"></div>';
    donutHTML += '<span style="font-size:10px;color:var(--m)">'+n.label+'</span>';
    donutHTML += '<span style="font-size:10px;font-weight:700;color:#fff;margin-left:auto">'+Math.round(n.pct)+'%</span>';
    donutHTML += '</div>';
  });
  donutHTML += '</div></div>';

  // Barras con status fusionado
  var pisos = NEC_NIVELES.slice().reverse();
  var barrasHTML = '<div style="padding:0 16px 12px">';
  pisos.forEach(function(niv){
    var d    = _dataNivelInline(niv.key, niveles);
    var abs  = Math.abs(d.total||0);
    var pct  = totalSum>0 ? (abs/totalSum*100) : 0;
    var barW = maxAbs>0 ? (abs/maxAbs*100) : 0;
    var vacio= abs===0;
    var tops = (d.conceptos||[]).slice(0,3).join(', ');
    var status = vacio
      ? '<span style="font-size:9px;color:var(--warn);background:rgba(245,158,11,.1);padding:1px 6px;border-radius:8px">⚠</span>'
      : (pct>40
        ? '<span style="font-size:9px;color:var(--err);background:rgba(239,68,68,.08);padding:1px 6px;border-radius:8px">Alto</span>'
        : '<span style="font-size:9px;color:var(--ok);background:rgba(74,222,128,.08);padding:1px 6px;border-radius:8px">✓</span>');
    barrasHTML += '<div style="margin-bottom:10px">';
    barrasHTML += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px">';
    barrasHTML += '<div style="display:flex;align-items:center;gap:5px">';
    barrasHTML += '<div style="width:7px;height:7px;border-radius:50%;background:'+(vacio?'var(--dim)':niv.color)+';flex-shrink:0"></div>';
    barrasHTML += '<span style="font-size:12px;font-weight:600;color:'+(vacio?'var(--m)':'var(--t)')+'">'+niv.label+'</span>';
    barrasHTML += status+'</div>';
    barrasHTML += '<span style="font-size:12px;font-weight:700;color:'+(vacio?'var(--dim)':niv.color)+'">'+( vacio?'—':'$ '+abs.toLocaleString('es-MX',{minimumFractionDigits:0}))+'<span style="font-size:10px;color:var(--m);font-weight:400"> '+Math.round(pct)+'%</span></span>';
    barrasHTML += '</div>';
    barrasHTML += '<div style="height:5px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden">';
    barrasHTML += '<div style="height:100%;width:'+barW.toFixed(1)+'%;background:'+niv.color+';border-radius:3px;opacity:'+(vacio?.2:.85)+'"></div>';
    barrasHTML += '</div>';
    if(tops) barrasHTML += '<div style="font-size:10px;color:var(--m);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">↳ '+tops+'</div>';
    barrasHTML += '</div>';
  });
  barrasHTML += '</div>';

  cont.innerHTML = donutHTML + barrasHTML;

  setTimeout(function(){
    var dc = document.getElementById('nec-donut-canvas');
    if(!dc || !window.Chart) return;
    var vals   = NEC_NIVELES.map(function(n){ return Math.abs(_dataNivelInline(n.key,niveles).total||0); });
    var colors = NEC_NIVELES.map(function(n){ return n.color; });
    if(window._donutInlineChart){ try{window._donutInlineChart.destroy();}catch(e){} }
    window._donutInlineChart = new Chart(dc,{
      type:'doughnut',
      data:{ datasets:[{ data:vals, backgroundColor:colors.map(function(c){ return c+'99'; }),
        borderColor:colors, borderWidth:1.5, hoverOffset:4 }],
        labels:NEC_NIVELES.map(function(n){ return n.label; }) },
      options:{ responsive:false, cutout:'72%',
        plugins:{ legend:{display:false},
          tooltip:{ backgroundColor:'rgba(15,23,42,.95)', borderColor:'rgba(255,255,255,.1)', borderWidth:1,
            callbacks:{ label:function(ctx){ return ' $ '+ctx.raw.toLocaleString('es-MX',{minimumFractionDigits:0}); }}}}}
    });
  }, 50);
}

function _dibujarRadarInline(niveles){
  var wrap = document.getElementById('nec-inline-radar-wrap');
  if(!wrap) return;
  wrap.innerHTML = '<canvas id="radar-inline-canvas" style="max-height:300px"></canvas>';
  var canvas = document.getElementById('radar-inline-canvas');
  if(!canvas || !window.Chart) return;
  var labels  = NEC_NIVELES.map(function(n){ return n.label; });
  var valores = NEC_NIVELES.map(function(n){ return Math.abs(_dataNivelInline(n.key,niveles).total||0); });
  var colors  = NEC_NIVELES.map(function(n){ return n.color; });
  var maxVal  = Math.max.apply(null, valores.concat([1]));
  var norm    = valores.map(function(v){ return v/maxVal*100; });
  if(_radarInlineChart){ try{_radarInlineChart.destroy();}catch(e){} _radarInlineChart=null; }
  _radarInlineChart = new Chart(canvas, {
    type: 'radar',
    data: { labels: labels, datasets: [{ label: 'Gasto', data: norm,
      backgroundColor: 'rgba(139,92,246,.12)', borderColor: 'rgba(139,92,246,.6)',
      borderWidth: 1.5, pointBackgroundColor: colors, pointBorderColor: '#111',
      pointBorderWidth: 2, pointRadius: 5, pointHoverRadius: 7, fill: true }]},
    options: { responsive: true, maintainAspectRatio: true, aspectRatio: 1.3,
      plugins: { legend: {display: false},
        tooltip: { backgroundColor: 'rgba(15,23,42,.95)', borderColor: 'rgba(139,92,246,.3)',
          borderWidth: 1, titleColor: '#fff', bodyColor: '#94A3B8', padding: 10,
          callbacks: { label: function(ctx) {
            return ' ' + NEC_NIVELES[ctx.dataIndex].emoji + ' $ ' + valores[ctx.dataIndex].toLocaleString('es-MX',{minimumFractionDigits:0});
          }}}},
      scales: { r: { min: 0, max: 100, backgroundColor: 'rgba(0,0,0,.15)',
        angleLines: {color: 'rgba(255,255,255,.06)', lineWidth: 1},
        grid: {color: 'rgba(255,255,255,.06)'},
        ticks: {display: false, stepSize: 25},
        pointLabels: { font: {size: 11, weight: '600', family: 'system-ui'},
          color: function(ctx){ return colors[ctx.index]||'#94A3B8'; },
          callback: function(label, i){ return [label, '$'+Math.round(valores[i]/1000)+'k']; }}}}}
  });
}
