/* RAW Entry — Dashboard v.5.001
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
        <div class="fin-card-label">Saldo actual</div>
        <div class="fin-card-val" style="color:${(m.saldoActual||0)>=0?'var(--ok)':'var(--err)'}">
          ${fmtMoneda(m.saldoActual).txt}
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

  // ── Proyección ──
  const proyeccion = mes.proyeccion ? `
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
  if(window.innerWidth<900)return;
  const entrada=document.getElementById('sec-entrada');
  if(!entrada)return;
  const h=entrada.offsetHeight;
  if(h>0)document.documentElement.style.setProperty('--entrada-h',h+'px');
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
    const esActual=mes===mesActual;
    const fmtMXN=v=>'$ '+Math.abs(v).toLocaleString('es-MX',{minimumFractionDigits:2});
    const ingCell=ingresos===0?`<td class="r" style="color:var(--m)">$ 0</td>`:`<td class="r" style="color:var(--ok);font-weight:600">${fmtMXN(ingresos)}</td>`;
    const egrCell=egresos===0?`<td class="r" style="color:var(--m)">$ 0</td>`:`<td class="r" style="color:var(--err);font-weight:600">− ${fmtMXN(Math.abs(egresos))}</td>`;
    const excCell=excedente===0?`<td class="r" style="color:var(--m)">$ 0</td>`:`<td class="r" style="color:${excedente>0?'var(--ok)':'var(--err)'};font-weight:700">${excedente<0?'− ':''}${fmtMXN(excedente)}</td>`;
    return `<tr style="${esActual?'background:rgba(59,130,246,.08)':''}"><td style="font-weight:${esActual?700:500};color:${esActual?'var(--p)':'var(--t)'}">${mes}${esActual?' ↑':''}</td>${ingCell}${egrCell}${excCell}</tr>`;
  }).join('');
  body.innerHTML=`<table id="flujo-tbl"><colgroup><col class="c-mes"><col class="c-num"><col class="c-num"><col class="c-num"></colgroup><thead><tr><th>Mes</th><th class="r" style="color:var(--ok)">Ingresos</th><th class="r" style="color:var(--err)">Egresos</th><th class="r">Excedente</th></tr></thead><tbody>${rows}</tbody></table>`;
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
  api.getScoreVida().then(d=>{ _scoreData=d; renderScore(d); }).catch(()=>{});
}

function renderScore(data){
  const body = document.getElementById('score-body');
  if(!body) return;
  const fecha = document.getElementById('score-fecha');
  if(!body) return;
  if(!data||!data.ok){ body.innerHTML='<div style="padding:16px;color:var(--m);text-align:center">Error calculando score</div>'; return; }
  if(fecha) fecha.textContent = data.timestamp || '';

  const s  = data.score || {};
  const d  = s.desglose || {};
  const mx = s.maximos  || {};

  const pct = s.total || 0;
  const color = pct>=70?'var(--ok)':pct>=55?'var(--warn)':'var(--err)';

  // Gauge central
  const circleR  = 54;
  const circleC  = 2 * Math.PI * circleR;
  const dashArr  = circleC;
  const dashOff  = circleC * (1 - pct/100);

  const areas = [
    { key:'dinero',    label:'Dinero',     emoji:'💰', max: mx.dinero||25 },
    { key:'habitos',   label:'Hábitos',    emoji:'⚡', max: mx.habitos||25 },
    { key:'salud',     label:'Salud',      emoji:'🏥', max: mx.salud||20 },
    { key:'relaciones',label:'Relaciones', emoji:'👥', max: mx.relaciones||15 },
    { key:'mental',    label:'Mental',     emoji:'🧠', max: mx.mental||15 },
  ];

  const areaColors = {
    dinero:'#4ADE80', habitos:'#3B82F6', salud:'#EF4444', relaciones:'#06B6D4', mental:'#8B5CF6'
  };

  body.innerHTML = `
    <!-- Gauge central -->
    <div style="display:flex;flex-direction:column;align-items:center;padding:24px 16px 8px">
      <div style="position:relative;width:140px;height:140px">
        <svg width="140" height="140" viewBox="0 0 140 140" style="transform:rotate(-90deg)">
          <circle cx="70" cy="70" r="${circleR}" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="12"/>
          <circle cx="70" cy="70" r="${circleR}" fill="none" stroke="${color}" stroke-width="12"
            stroke-dasharray="${dashArr.toFixed(1)}" stroke-dashoffset="${dashOff.toFixed(1)}"
            stroke-linecap="round" style="transition:stroke-dashoffset .8s ease"/>
        </svg>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
          <div style="font-size:36px;font-weight:700;color:${color};font-variant-numeric:tabular-nums;line-height:1">${pct}</div>
          <div style="font-size:11px;color:var(--m);margin-top:2px">/100</div>
        </div>
      </div>
      <div style="font-size:13px;font-weight:600;color:#fff;margin-top:8px">${s.estado||''}</div>
    </div>

    <!-- Barras por área -->
    <div style="padding:4px var(--pad) 16px">
      ${areas.map(a=>{
        const val = d[a.key]||0;
        const pctA = Math.round(val/a.max*100);
        const col = areaColors[a.key]||'var(--p)';
        return `<div style="margin-bottom:10px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
            <div style="display:flex;align-items:center;gap:6px">
              <span>${a.emoji}</span>
              <span style="font-size:12px;font-weight:600;color:#fff">${a.label}</span>
            </div>
            <span style="font-size:12px;font-weight:700;color:${col};font-variant-numeric:tabular-nums">${val}/${a.max}</span>
          </div>
          <div style="height:4px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden">
            <div style="height:100%;width:${pctA}%;background:${col};border-radius:2px;transition:width .6s ease"></div>
          </div>
        </div>`;
      }).join('')}
    </div>

    <!-- Alertas -->
    ${(data.alertas||[]).length ? `
    <div style="padding:0 var(--pad) 8px">
      <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--err);margin-bottom:8px">⚠️ Alertas</div>
      <div style="background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.15);border-radius:var(--rad);overflow:hidden">
        ${(data.alertas||[]).map(a=>`
          <div class="insight-item">
            <div class="insight-dot alerta"></div>
            <span style="color:rgba(255,255,255,.8);font-size:12px">${a.area} ${a.msg}</span>
          </div>`).join('')}
      </div>
    </div>` : ''}

    <!-- Positivos -->
    ${(data.positivos||[]).length ? `
    <div style="padding:0 var(--pad) 8px">
      <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--ok);margin-bottom:8px">✅ Positivo</div>
      <div style="background:rgba(74,222,128,.06);border:1px solid rgba(74,222,128,.15);border-radius:var(--rad);overflow:hidden">
        ${(data.positivos||[]).map(p=>`
          <div class="insight-item">
            <div class="insight-dot positivo"></div>
            <span style="color:rgba(255,255,255,.8);font-size:12px">${p.area} ${p.msg}</span>
          </div>`).join('')}
      </div>
    </div>` : ''}

    <!-- Para reflexionar -->
    ${(data.insights||[]).length ? `
    <div style="padding:0 var(--pad) 16px">
      <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m);margin-bottom:8px">💭 Para reflexionar</div>
      ${(data.insights||[]).map(i=>`
        <div style="padding:8px 12px;background:rgba(255,255,255,.03);border-radius:var(--rad);margin-bottom:6px;font-size:12px;color:rgba(255,255,255,.7)">
          ${i.area} ${i.msg}
        </div>`).join('')}
    </div>` : ''}
  `;
}

// ══════════════════════════════════════════
//  PATRIMONIO
// ══════════════════════════════════════════
function renderPatrimonio(data){
  const body = document.getElementById('patrimonio-body');
  if(!body) return;
  if(!data||!data.ok){
    body.innerHTML='<div style="padding:20px;text-align:center;color:var(--m)">Sin datos — agrega movimientos con el tab 🏦</div>';
    return;
  }
  // Hojas vacías = datos válidos con saldo 0
  const totalPatrimonio = (data.banco?.saldo||0) + (data.fisico?.saldo||0) + (data.inversion?.saldo||0);
  if(totalPatrimonio === 0 && !(data.banco?.items?.length) && !(data.fisico?.items?.length) && !(data.inversion?.items?.length)){
    body.innerHTML='<div style="padding:24px;text-align:center;color:var(--m)">' +
      '<div style="font-size:32px;margin-bottom:12px">🏦</div>' +
      '<div style="font-size:13px;font-weight:600;color:#fff;margin-bottom:6px">Sin movimientos aún</div>' +
      '<div style="font-size:12px">Usa el tab 🏦 en Nueva Entrada para registrar tu primer ahorro, efectivo o inversión</div>' +
      '</div>';
    return;
  }

  const fmtMXN = v => '$ ' + Math.abs(v).toLocaleString('es-MX',{minimumFractionDigits:0});
  const f = data.fondo || {};

  // Salud del fondo
  const saludColor = f.salud==='ok'?'var(--ok)':f.salud==='warn'?'var(--warn)':'var(--err)';
  const saludEmoji = f.salud==='ok'?'🟢':f.salud==='warn'?'🟡':'🔴';
  const saludLbl   = f.salud==='ok'?'Fondo completo':f.salud==='warn'?'Fondo parcial':'Sin fondo';

  // Barras de distribución
  const bloques = [
    { label:'💳 Banco',     val:data.banco?.saldo||0,     pct:data.banco?.pct||0,     color:'#4ADE80' },
    { label:'💵 Efectivo',  val:data.fisico?.saldo||0,    pct:data.fisico?.pct||0,    color:'#FBBF24' },
    { label:'📈 Inversión', val:data.inversion?.saldo||0, pct:data.inversion?.pct||0, color:'#8B5CF6' },
  ];

  const totalHtml = `
    <div style="padding:16px var(--pad) 8px">
      <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m);margin-bottom:6px">Patrimonio total</div>
      <div style="font-size:32px;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-.03em;color:#fff">
        ${fmtMXN(data.total||0)}
      </div>
      <div style="font-size:11px;margin-top:4px">
        <span style="color:${saludColor}">${saludEmoji} ${saludLbl}</span>
        <span style="color:var(--m);margin-left:8px">${f.meses||0} meses cubiertos</span>
      </div>
    </div>`;

  // Barra de distribución visual
  const barHtml = data.total > 0 ? `
    <div style="margin:0 var(--pad) 12px;height:8px;border-radius:4px;overflow:hidden;display:flex;gap:2px">
      ${bloques.map(b=>b.pct>0?`<div style="width:${b.pct}%;background:${b.color};border-radius:4px;transition:width .6s ease"></div>`:'').join('')}
    </div>` : '';

  // Cards por tipo
  const cardsHtml = `
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:0 var(--pad) 12px">
      ${bloques.map(b=>`
        <div style="background:var(--card2);border-radius:var(--rad);padding:12px;text-align:center">
          <div style="font-size:18px;margin-bottom:4px">${b.label.split(' ')[0]}</div>
          <div style="font-size:11px;font-weight:600;color:var(--m);margin-bottom:6px">${b.label.split(' ')[1]}</div>
          <div style="font-size:16px;font-weight:700;color:${b.color};font-variant-numeric:tabular-nums">${fmtMXN(b.val)}</div>
          <div style="font-size:10px;color:var(--m);margin-top:2px">${b.pct}% del total</div>
        </div>`).join('')}
    </div>`;

  // Meta fondo emergencia
  const metaHtml = f.meta > 0 ? `
    <div style="margin:0 var(--pad) 12px;padding:12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:var(--rad)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <div style="font-size:11px;font-weight:600;color:var(--m)">🎯 Fondo de emergencia (3 meses)</div>
        <div style="font-size:11px;font-weight:700;color:${saludColor}">${f.avance||0}%</div>
      </div>
      <div style="height:4px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${Math.min(100,f.avance||0)}%;background:${saludColor};border-radius:2px;transition:width .6s ease"></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:10px;color:var(--m)">
        <span>Actual: ${fmtMXN(data.banco?.saldo||0)}</span>
        <span>Meta: ${fmtMXN(f.meta)}</span>
      </div>
    </div>` : '';

  // Últimos movimientos combinados
  const movs = [
    ...(data.banco?.items||[]).map(i=>({...i,_tipo:'banco'})),
    ...(data.fisico?.items||[]).map(i=>({...i,_tipo:'efectivo'})),
    ...(data.inversion?.items||[]).map(i=>({...i,_tipo:'inversion'})),
  ].sort((a,b)=>b.fecha.localeCompare(a.fecha)).slice(0,8);

  const movsHtml = movs.length ? `
    <div style="padding:0 var(--pad) 4px">
      <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m);margin-bottom:8px">Últimos movimientos</div>
      ${movs.map(m=>{
        const tipoColor = m._tipo==='banco'?'#4ADE80':m._tipo==='efectivo'?'#FBBF24':'#8B5CF6';
        const tipoEmoji = m._tipo==='banco'?'💳':m._tipo==='efectivo'?'💵':'📈';
        const montoColor = (m.monto||0)>=0?'var(--ok)':'var(--err)';
        return `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04)">
          <div style="width:28px;height:28px;border-radius:8px;background:${tipoColor}22;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0">${tipoEmoji}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:500;color:#fff">${m.concepto}</div>
            <div style="font-size:10px;color:var(--m)">${m.fecha}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:13px;font-weight:700;color:${montoColor};font-variant-numeric:tabular-nums">${(m.monto||0)>=0?'+':''}${fmtMXN(m.monto||0)}</div>
            <div style="font-size:10px;color:var(--m)">${fmtMXN(m.saldo||0)}</div>
          </div>
        </div>`;
      }).join('')}
    </div>` : '<div style="padding:16px var(--pad);color:var(--m);font-size:13px">Sin movimientos — agrega con el tab 🏦</div>';

  body.innerHTML = totalHtml + barHtml + cardsHtml + metaHtml + movsHtml;
}

// ══════════════════════════════════════════
//  NUTRICIÓN (Lose It! style)
// ══════════════════════════════════════════
var _nutMetas = null;
var _nutData  = null;
var _nutVista = 'hoy'; // hoy | semana

function renderNutricion(data, metas){
  _nutData  = data  || _nutData;
  _nutMetas = metas || _nutMetas || { calorias:1800, proteina:150, carbos:180, grasa:60, agua:2.5 };
  var body = document.getElementById('nutricion-body');
  if(!body) return;
  if(!_nutData||!_nutData.ok){
    body.innerHTML='<div style="padding:24px;text-align:center;color:var(--m)">Sin datos — agrega desde Nueva Entrada 🥗</div>';
    return;
  }
  if(_nutVista==='hoy') _renderNutricionHoy(body);
  else                   _renderNutricionSemana(body);
}

function _nutricionTabBar(){
  var onH = 'onclick="_nutTab(this.dataset.v)" data-v="hoy"';
  var onS = 'onclick="_nutTab(this.dataset.v)" data-v="semana"';
  return '<div style="display:flex;gap:6px;padding:12px var(--pad) 8px">' +
    '<button '+onH+' id="nut-tab-hoy" style="'+_nutTabStyle(_nutVista==='hoy')+'">Hoy</button>' +
    '<button '+onS+' id="nut-tab-sem" style="'+_nutTabStyle(_nutVista==='semana')+'">Semana</button>' +
  '</div>';
}
function _nutTabStyle(on){ return 'padding:4px 12px;border-radius:20px;font-size:11px;font-weight:'+(on?'700':'500')+';cursor:pointer;font-family:inherit;transition:all .15s;border:1px solid '+(on?'rgba(74,222,128,.5)':'rgba(255,255,255,.1)')+';background:'+(on?'rgba(74,222,128,.15)':'rgba(255,255,255,.04)')+';color:'+(on?'#4ADE80':'var(--m)'); }
function _nutTab(elOrV){ _nutVista = (typeof elOrV==='string') ? elOrV : elOrV.dataset.v; renderNutricion(); }

function _renderNutricionHoy(body){
  var hoy   = _nutData.hoy  || {};
  var metas = _nutMetas;
  var calPct   = metas.calorias  > 0 ? Math.min(100, Math.round(hoy.cal/metas.calorias*100))    : 0;
  var protPct  = metas.proteina  > 0 ? Math.min(100, Math.round(hoy.prot/metas.proteina*100))   : 0;
  var carPct   = metas.carbos    > 0 ? Math.min(100, Math.round(hoy.carbos/metas.carbos*100))   : 0;
  var grasPct  = metas.grasa     > 0 ? Math.min(100, Math.round(hoy.grasa/metas.grasa*100))     : 0;
  var aguaPct  = metas.agua      > 0 ? Math.min(100, Math.round(hoy.agua/metas.agua*100))       : 0;
  var calRest  = metas.calorias - (hoy.cal||0);
  var calColor = calRest < 0 ? 'var(--err)' : calRest < 200 ? 'var(--warn)' : '#4ADE80';

  // Gauge circular de calorías
  var circ = 2*Math.PI*36;
  var dash = circ - (calPct/100*circ);

  var gauge = '<div style="display:flex;flex-direction:column;align-items:center;padding:16px var(--pad) 8px">' +
    '<svg width="100" height="100" viewBox="0 0 80 80">' +
      '<circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="7"/>' +
      '<circle cx="40" cy="40" r="36" fill="none" stroke="'+calColor+'" stroke-width="7"' +
        ' stroke-dasharray="'+circ.toFixed(1)+'" stroke-dashoffset="'+dash.toFixed(1)+'"' +
        ' stroke-linecap="round" transform="rotate(-90 40 40)" style="transition:stroke-dashoffset .6s ease"/>' +
      '<text x="40" y="37" text-anchor="middle" font-size="14" font-weight="700" fill="'+calColor+'" font-family="system-ui">'+(hoy.cal||0)+'</text>' +
      '<text x="40" y="50" text-anchor="middle" font-size="8" fill="rgba(255,255,255,.4)" font-family="system-ui">/ '+metas.calorias+'</text>' +
    '</svg>' +
    '<div style="font-size:11px;color:'+calColor+';font-weight:600;margin-top:2px">' +
      (calRest>=0 ? calRest+' kcal restantes' : Math.abs(calRest)+' kcal sobre el límite') +
    '</div>' +
  '</div>';

  // Macros
  function macroBar(label, val, meta, pct, color){
    return '<div>' +
      '<div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:3px">' +
        '<span style="color:var(--m);font-weight:600">'+label+'</span>' +
        '<span style="color:var(--t)">'+val+'<span style="color:var(--m)"> / '+meta+'g</span></span>' +
      '</div>' +
      '<div style="height:5px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden">' +
        '<div style="height:100%;width:'+pct+'%;background:'+color+';border-radius:3px;transition:width .5s ease"></div>' +
      '</div>' +
    '</div>';
  }

  var macros = '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;padding:4px var(--pad) 12px">' +
    macroBar('Proteína', hoy.prot||0, metas.proteina, protPct, '#60A5FA') +
    macroBar('Carbos',   hoy.carbos||0, metas.carbos, carPct,  '#FBBF24') +
    macroBar('Grasa',    hoy.grasa||0, metas.grasa,  grasPct, '#F87171') +
  '</div>';

  // Agua y sodio
  var extras = '<div style="display:flex;gap:12px;padding:0 var(--pad) 12px">' +
    '<div style="flex:1;background:rgba(56,189,248,.06);border:1px solid rgba(56,189,248,.15);border-radius:10px;padding:8px 12px;text-align:center">' +
      '<div style="font-size:18px;font-weight:700;color:#38BDF8">'+(hoy.agua||0).toFixed(1)+'L</div>' +
      '<div style="font-size:9px;color:var(--m)">Agua · meta '+metas.agua+'L</div>' +
      '<div style="height:3px;background:rgba(255,255,255,.06);border-radius:2px;margin-top:6px;overflow:hidden">' +
        '<div style="height:100%;width:'+aguaPct+'%;background:#38BDF8;border-radius:2px"></div>' +
      '</div>' +
    '</div>' +
    '<div style="flex:1;background:rgba(251,191,36,.06);border:1px solid rgba(251,191,36,.15);border-radius:10px;padding:8px 12px;text-align:center">' +
      '<div style="font-size:18px;font-weight:700;color:#FBBF24">'+(hoy.fibra||0)+'g</div>' +
      '<div style="font-size:9px;color:var(--m)">Fibra</div>' +
    '</div>' +
  '</div>';

  // Items de hoy agrupados por momento
  var MOMENTO_COLOR = {Desayuno:'#F59E0B',Comida:'#4ADE80',Cena:'#8B5CF6',Snack:'#60A5FA','Post-entreno':'#F87171'};
  var MOMENTO_EMOJI = {Desayuno:'🌅',Comida:'☀️',Cena:'🌙',Snack:'🍎','Post-entreno':'💪'};
  var items = (hoy.items||[]);
  var grupos = {};
  items.forEach(function(it){
    var m = it.momento||'Otro';
    if(!grupos[m]) grupos[m] = { items:[], cal:0 };
    grupos[m].items.push(it);
    grupos[m].cal += it.cal||0;
  });
  var ORDER = ['Desayuno','Comida','Cena','Snack','Post-entreno','Otro'];
  var itemsHtml = ORDER.filter(function(m){ return grupos[m]; }).map(function(m){
    var g = grupos[m];
    var color = MOMENTO_COLOR[m]||'var(--m)';
    var emoji = MOMENTO_EMOJI[m]||'🍽️';
    return '<div style="margin:0 var(--pad) 10px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
        '<div style="font-size:11px;font-weight:700;color:'+color+'">' + emoji + ' ' + m + '</div>' +
        '<div style="font-size:11px;color:var(--m)">'+g.cal+' kcal</div>' +
      '</div>' +
      g.items.map(function(it){
        return '<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.03)">' +
          '<div style="font-size:12px;color:var(--t);flex:1">' + it.alimento + '</div>' +
          '<div style="font-size:11px;color:var(--m);margin-left:8px;flex-shrink:0">' +
            (it.cal?it.cal+' kcal':'') +
            (it.prot?' · '+it.prot+'g P':'') +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>';
  }).join('');

  if(!items.length) itemsHtml = '<div style="padding:16px var(--pad);color:var(--m);font-size:13px;text-align:center">Sin registros hoy — agrega desde Nueva Entrada 🥗</div>';

  body.innerHTML = _nutricionTabBar() + gauge + macros + extras +
    '<div style="border-top:1px solid rgba(255,255,255,.06);padding-top:8px">' + itemsHtml + '</div>';
}

function _renderNutricionSemana(body){
  var semana = (_nutData.semana||[]).slice().reverse(); // cronológico
  var metas  = _nutMetas;

  var bars = semana.map(function(d){
    var pct = metas.calorias > 0 ? Math.min(120, d.cal/metas.calorias*100) : 0;
    var over = d.cal > metas.calorias;
    var color = over ? '#EF4444' : d.cal > metas.calorias*0.8 ? '#4ADE80' : 'rgba(255,255,255,.2)';
    var label = d.fecha ? d.fecha.slice(5) : '';
    return '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1">' +
      '<div style="font-size:9px;color:var(--m)">'+(d.cal||0)+'</div>' +
      '<div style="width:100%;height:80px;display:flex;align-items:flex-end">' +
        '<div style="width:100%;height:'+Math.max(4,pct*.8)+'%;background:'+color+';border-radius:4px 4px 0 0;transition:height .5s ease;min-height:4px"></div>' +
      '</div>' +
      '<div style="font-size:9px;color:var(--m)">'+label+'</div>' +
    '</div>';
  }).join('');

  var chartHtml = '<div style="padding:12px var(--pad)">' +
    '<div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m);margin-bottom:8px">Calorías últimos 7 días</div>' +
    '<div style="display:flex;gap:4px;align-items:flex-end;height:110px">' + bars + '</div>' +
    '<div style="font-size:9px;color:var(--m);text-align:center;margin-top:4px">Meta: '+metas.calorias+' kcal/día</div>' +
  '</div>';

  // Promedios
  var dias = semana.filter(function(d){ return d.cal > 0; });
  var avg  = function(key){ return dias.length ? Math.round(dias.reduce(function(s,d){ return s+(d[key]||0); },0)/dias.length) : 0; };
  var statsHtml = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:0 var(--pad) 12px">' +
    ['cal','prot','carbos','grasa'].map(function(k,i){
      var labels = ['kcal','P(g)','C(g)','G(g)'];
      var colors = ['#4ADE80','#60A5FA','#FBBF24','#F87171'];
      return '<div style="text-align:center;background:rgba(255,255,255,.03);border-radius:8px;padding:8px 4px">' +
        '<div style="font-size:16px;font-weight:700;color:'+colors[i]+'">'+avg(k)+'</div>' +
        '<div style="font-size:9px;color:var(--m)">prom '+labels[i]+'</div>' +
      '</div>';
    }).join('') +
  '</div>';

  body.innerHTML = _nutricionTabBar() + chartHtml + statsHtml;
}

// ══════════════════════════════════════════
//  ENTRENAMIENTO
// ══════════════════════════════════════════
function renderEntrenamiento(data){
  var body = document.getElementById('entrenamiento-body');
  if(!body) return;
  if(!data||!data.ok||!data.items||!data.items.length){
    body.innerHTML='<div style="padding:20px;text-align:center;color:var(--m);font-size:13px">Sin registros — agrega desde el formulario</div>';
    return;
  }
  var TIPO_COLOR = {Fuerza:'#EF4444',Cardio:'#F59E0B',HIIT:'#8B5CF6',Flexibilidad:'#4ADE80',Deporte:'#3B82F6'};
  var rows = data.items.map(function(it){
    var color = TIPO_COLOR[it.tipo] || '#94A3B8';
    var detalles = [];
    if(it.duracion) detalles.push(it.duracion+'min');
    if(it.series&&it.reps) detalles.push(it.series+'x'+it.reps+(it.peso?' @'+it.peso+'kg':''));
    if(it.distancia) detalles.push(it.distancia+'km');
    return '<div style="display:flex;align-items:center;gap:10px;padding:8px var(--pad);border-bottom:1px solid rgba(255,255,255,.04)">' +
      '<div style="width:6px;height:32px;border-radius:3px;background:'+color+';flex-shrink:0"></div>' +
      '<div style="flex:1;min-width:0">' +
        '<div style="font-size:12px;color:var(--t)">' + it.ejercicio + '</div>' +
        '<div style="font-size:10px;color:var(--m);margin-top:2px">' + it.fecha + ' · ' + it.tipo + (detalles.length?' · '+detalles.join(' · '):'') + '</div>' +
      '</div>' +
    '</div>';
  }).join('');
  body.innerHTML = rows;
}
