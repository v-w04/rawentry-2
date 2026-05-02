// ══════════════════════════════════════════
//  NECESIDADES INLINE — control de período
// ══════════════════════════════════════════
function actualizarNecInline(){
  var anio = document.getElementById('nec-inline-anio');
  var mes  = document.getElementById('nec-inline-mes');
  if(!anio) return;
  var a = anio.value;
  var m = mes ? mes.value : '';
  api.getNecesidades(a, m).then(function(data){
    _necInlineData = data;
    if(data && data.ok){
      var niveles = data.niveles || [];
      _dibujarRadarYPiramideInline(niveles);
      _dibujarPiramideInline(niveles);
    }
  }).catch(function(){});
}

function _initNecInlineSelectors(){
  var anioEl = document.getElementById('nec-inline-anio');
  var mesEl  = document.getElementById('nec-inline-mes');
  if(!anioEl || !mesEl) return;
  var hoy = new Date();
  anioEl.value = hoy.getFullYear();
  mesEl.value  = hoy.getMonth() + 1;
}

/* RAW Entry — Dashboard v.5.058
   Patrimonio fusionado con Bancos · renderPatrimonio rediseñado
*/

// ══════════════════════════════════════════
//  ANUALIDAD (Fijos)
// ══════════════════════════════════════════
function renderAnualidad(data){
  const body=document.getElementById('gastos-body');
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
  const body=document.getElementById('anualidad-body');
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
//  CFO — Financiero + Revisión
//  v2: sin % duplicado, semáforo único, barra temporal
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
  api.getRevision(_revTipo, anio, mes, semana)
    .then(d=>{ _revData=d; _renderCFO(); })
    .catch(()=>{});
}

function renderRevision(data){ _revData = data; _renderCFO(); }
function renderFinancieroAvanzado(data){ if(data && data.ok) _finData = data; _renderCFO(); }

function _renderCFO(){
  const fin  = _finData || {};
  const m    = fin.metricas || {};
  const mes  = fin.mes || {};
  const rev  = _revData || {};
  const id   = rev.identidad || {};
  const ins  = rev.insights || [];

  const body = document.getElementById('fin-avanzado-body');
  if(!body) return;

  // helpers
  const fmtM  = v => '$ ' + Math.abs(v||0).toLocaleString('es-MX', {minimumFractionDigits:0});
  const fmtM2 = v => '$ ' + Math.abs(v||0).toLocaleString('es-MX', {minimumFractionDigits:2, maximumFractionDigits:2});

  const runway      = m.runwayDias;
  const pctAhorro   = m.porcentajeAhorro || 0;
  const gastoDia    = m.gastoPorDiaPromedio || 0;
  const saldo       = m.saldoActual || 0;
  const ingresosMes = mes.ingresos || 0;
  const egresosMes  = mes.egresos  || 0;
  const excedente   = mes.excedente || 0;
  const proy        = mes.proyeccion || {};

  // Semáforo único
  let saludColor, saludLabel, saludIcon;
  if(runway !== null && runway < 7 || pctAhorro < 0){
    saludColor='#EF4444'; saludLabel='Crítico'; saludIcon='▲';
  } else if(runway !== null && runway < 30 || pctAhorro < 10){
    saludColor='#F59E0B'; saludLabel='Atención'; saludIcon='◆';
  } else {
    saludColor='#4ADE80'; saludLabel='Saludable'; saludIcon='●';
  }

  const runwayColor = runway===null?'var(--m)':runway<7?'#EF4444':runway<30?'#F59E0B':'#4ADE80';

  // Barra temporal del mes
  const hoy       = new Date();
  const diasMes   = new Date(hoy.getFullYear(), hoy.getMonth()+1, 0).getDate();
  const diaActual = hoy.getDate();
  const pctMes    = Math.round(diaActual / diasMes * 100);
  const pctGasto  = ingresosMes > 0 ? Math.round(Math.abs(egresosMes) / ingresosMes * 100) : 0;
  const velColor  = pctGasto > pctMes + 20 ? '#EF4444' : pctGasto > pctMes + 10 ? '#F59E0B' : '#4ADE80';

  // Identidad
  const scoreInv    = id.scoreInversionista || 0;
  const scoreConsum = id.scoreConsumidor || 0;
  const tieneRevision = rev.ok && scoreInv > 0;

  // Filtrar insights — no repetir ahorro % que ya se muestra
  const insightsFiltrados = ins.filter(i => !i.msg.includes('Buen ritmo de ahorro'));

  body.innerHTML = `
    <!-- ① SALDO — fila completa sin semáforo flotante -->
    <div style="padding:14px 16px 12px;border-bottom:1px solid rgba(255,255,255,.06)">

      <!-- Fila superior: etiqueta SALDO + controles -->
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--m)">SALDO</div>
        <input type="date" id="saldo-fecha" onchange="consultarSaldo()"
          style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:20px;
          color:var(--t);font-family:inherit;font-size:10px;padding:2px 6px;outline:none;cursor:pointer;-webkit-appearance:none">
        <button onclick="consultarSaldo()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);
          border-radius:20px;color:var(--m);cursor:pointer;font-size:10px;padding:2px 8px;font-family:inherit;line-height:1.6">
          <i class="fas fa-arrows-rotate"></i>
        </button>
        <button onclick="irASheet()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);
          border-radius:20px;color:var(--m);cursor:pointer;font-size:10px;padding:2px 8px;font-family:inherit;line-height:1.6">
          <i class="fas fa-table-cells"></i>
        </button>
      </div>

      <!-- Fila de métricas: saldo + separadores + gasto/día + runway + ahorro -->
      <div style="display:flex;align-items:center;gap:0;width:100%">
        <!-- Saldo -->
        <div style="flex:0 0 auto">
          <div id="saldo-val" style="font-size:34px;font-weight:800;letter-spacing:-.04em;
            color:${saldo>=0?'#4ADE80':'#EF4444'};line-height:1;white-space:nowrap">
            ${fmtM2(saldo)}
          </div>
        </div>
        <div style="width:1px;height:32px;background:rgba(255,255,255,.1);margin:0 18px;flex-shrink:0"></div>
        <!-- Gasto/día -->
        <div style="flex:1;min-width:0">
          <div style="font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m);margin-bottom:3px">Gasto/día prom.</div>
          <div style="font-size:18px;font-weight:700;color:rgba(255,255,255,.75);letter-spacing:-.02em">${fmtM(gastoDia)}</div>
        </div>
        <div style="width:1px;height:32px;background:rgba(255,255,255,.1);margin:0 18px;flex-shrink:0"></div>
        <!-- Runway -->
        <div style="flex:1;min-width:0">
          <div style="font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m);margin-bottom:3px">Runway</div>
          <div style="font-size:18px;font-weight:700;color:${runwayColor};letter-spacing:-.02em">
            ${runway !== null ? runway+' días' : '—'}
          </div>
          <div style="font-size:9px;color:${runwayColor};margin-top:1px;opacity:.8">
            ${runway===null?'':runway<7?'⚠ Crítico':runway<14?'⚠ &lt;2 semanas':runway<30?'Cuidado':''}
          </div>
        </div>
        <div style="width:1px;height:32px;background:rgba(255,255,255,.1);margin:0 18px;flex-shrink:0"></div>
        <!-- Tasa ahorro -->
        <div style="flex:1;min-width:0">
          <div style="font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m);margin-bottom:3px">Tasa ahorro</div>
          <div style="font-size:18px;font-weight:700;letter-spacing:-.02em;
            color:${pctAhorro<0?'#EF4444':pctAhorro<10?'#F59E0B':pctAhorro>=20?'#4ADE80':'#F59E0B'}">
            ${pctAhorro}%
          </div>
          <div style="height:3px;background:rgba(255,255,255,.08);border-radius:2px;overflow:hidden;margin-top:4px">
            <div style="height:100%;width:${Math.min(100,Math.max(0,pctAhorro))}%;border-radius:2px;
              background:${pctAhorro<0?'#EF4444':pctAhorro<10?'#F59E0B':'#4ADE80'}"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ③ FLUJO DEL MES con barra temporal -->
    <div style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.06)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--m)">
          ESTE MES · DÍA ${diaActual} DE ${diasMes}
        </div>
      </div>

      <!-- Barra tiempo transcurrido vs gasto ejecutado -->
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--m);margin-bottom:3px">
          <span>Mes transcurrido</span><span style="color:rgba(255,255,255,.5)">${pctMes}%</span>
        </div>
        <div style="height:5px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden;margin-bottom:5px;position:relative">
          <div style="height:100%;width:${pctMes}%;background:rgba(255,255,255,.2);border-radius:3px"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:3px">
          <span style="color:var(--m)">Gasto ejecutado</span>
          <span style="color:${velColor};font-weight:600">${pctGasto}% de ingresos</span>
        </div>
        <div style="height:5px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden;margin-bottom:5px">
          <div style="height:100%;width:${Math.min(100,pctGasto)}%;background:${velColor};border-radius:3px;transition:width .4s"></div>
        </div>
        <div style="font-size:10px;color:${velColor};font-weight:500">
          ${pctGasto > pctMes + 20 ? '⚠ Gastas más rápido de lo que avanza el mes' :
            pctGasto > pctMes + 10 ? '◆ Ritmo de gasto algo elevado' :
            pctGasto > 0 ? '✓ Ritmo proporcional al mes' : '—'}
        </div>
      </div>

      <!-- I / E / Excedente -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px">
        <div style="background:rgba(74,222,128,.07);border:1px solid rgba(74,222,128,.15);border-radius:8px;padding:8px 10px">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:rgba(74,222,128,.7);margin-bottom:3px">Ingresos</div>
          <div style="font-size:14px;font-weight:700;color:#4ADE80;font-variant-numeric:tabular-nums">${fmtM(ingresosMes)}</div>
        </div>
        <div style="background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.15);border-radius:8px;padding:8px 10px">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:rgba(239,68,68,.7);margin-bottom:3px">Egresos</div>
          <div style="font-size:14px;font-weight:700;color:#EF4444;font-variant-numeric:tabular-nums">${fmtM(egresosMes)}</div>
        </div>
        <div style="background:${excedente>=0?'rgba(74,222,128,.07)':'rgba(239,68,68,.07)'};border:1px solid ${excedente>=0?'rgba(74,222,128,.15)':'rgba(239,68,68,.15)'};border-radius:8px;padding:8px 10px">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:${excedente>=0?'rgba(74,222,128,.7)':'rgba(239,68,68,.7)'};margin-bottom:3px">Excedente</div>
          <div style="font-size:14px;font-weight:700;color:${excedente>=0?'#4ADE80':'#EF4444'};font-variant-numeric:tabular-nums">${excedente>=0?'+':''}${fmtM(excedente)}</div>
        </div>
      </div>
    </div>

    <!-- ④ PROYECCIÓN FIN DE MES — solo excedente, sin repetir egresos -->
    ${proy.diasRestantes > 0 ? `
    <div style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,.06)">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--m);margin-bottom:3px">
            Proyección fin de mes · ${proy.diasRestantes} días restantes
          </div>
          <div style="font-size:11px;color:var(--m)">Al ritmo actual de ${fmtM(gastoDia)}/día</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m);margin-bottom:3px">Excedente proyectado</div>
          <div style="font-size:22px;font-weight:800;letter-spacing:-.03em;color:${(proy.excedente||0)>=0?'#4ADE80':'#EF4444'};font-variant-numeric:tabular-nums">
            ${(proy.excedente||0)>=0?'+':''}${fmtM(proy.excedente)}
          </div>
        </div>
      </div>
    </div>` : ''}

    <!-- ⑤ IDENTIDAD DEL PERÍODO — barra bipolar (una sola visualización) -->
    ${tieneRevision ? `
    <div style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,.06)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--m)">
          IDENTIDAD ${rev.periodo ? '· '+rev.periodo.inicio+' – '+rev.periodo.fin : ''}
        </div>
        <div style="font-size:9px;color:#C4B5FD;font-weight:600;text-transform:uppercase;letter-spacing:.06em">${(rev.tipo||'').toUpperCase()}</div>
      </div>
      <!-- Barra bipolar: verde=inversionista, rojo=consumidor -->
      <div>
        <div style="height:8px;border-radius:4px;overflow:hidden;display:flex">
          <div style="height:100%;width:${scoreInv}%;background:linear-gradient(90deg,#22C55E,#4ADE80);transition:width .6s ease"></div>
          <div style="height:100%;flex:1;background:linear-gradient(90deg,#EF4444,#DC2626)"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:5px">
          <div style="display:flex;align-items:center;gap:5px">
            <div style="width:8px;height:8px;border-radius:50%;background:#4ADE80"></div>
            <span style="font-size:11px;font-weight:700;color:#4ADE80">${scoreInv}% Inversionista</span>
          </div>
          <div style="display:flex;align-items:center;gap:5px">
            <span style="font-size:11px;font-weight:700;color:#EF4444">${scoreConsum}% Consumidor</span>
            <div style="width:8px;height:8px;border-radius:50%;background:#EF4444"></div>
          </div>
        </div>
      </div>
    </div>` : `<div id="revision-body" style="padding:10px 16px;color:var(--m);font-size:11px;text-align:center;border-bottom:1px solid rgba(255,255,255,.06)">
      Selecciona período para ver análisis
    </div>`}

    <!-- ⑥ INSIGHTS (sin el "Buen ritmo de ahorro" que ya se ve arriba) -->
    ${insightsFiltrados.length ? `
    <div style="padding:10px 16px">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--m);margin-bottom:8px">💡 INSIGHTS</div>
      <div style="display:flex;flex-direction:column;gap:5px">
        ${insightsFiltrados.map(i=>`
          <div style="display:flex;align-items:flex-start;gap:8px;padding:7px 10px;border-radius:6px;
            background:${i.tipo==='alerta'?'rgba(239,68,68,.06)':i.tipo==='positivo'?'rgba(74,222,128,.06)':'rgba(255,255,255,.03)'};
            border:1px solid ${i.tipo==='alerta'?'rgba(239,68,68,.12)':i.tipo==='positivo'?'rgba(74,222,128,.12)':'rgba(255,255,255,.06)'}">
            <div style="width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:5px;
              background:${i.tipo==='alerta'?'#EF4444':i.tipo==='positivo'?'#4ADE80':i.tipo==='identidad'?'#C4B5FD':'var(--m)'}"></div>
            <span style="font-size:12px;line-height:1.5;color:${i.tipo==='alerta'?'#FCA5A5':i.tipo==='positivo'?'#86EFAC':i.tipo==='identidad'?'#C4B5FD':'var(--m)'}">
              ${i.msg}
            </span>
          </div>`).join('')}
      </div>
    </div>` : ''}
  `;

  // Inicializar fecha del saldo
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
      <div><span class="salud-tipo-badge ${badgeClass}">${item.tipo||'—'}</span></div>
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
//  APARTADOS — fix: renderApartados usa fila real del GAS
// ══════════════════════════════════════════
let _apartadosData = [];

function renderApartados(data){
  _apartadosData = (data && data.items) ? data.items : [];
  const body = document.getElementById('apartados-list') || document.getElementById('apartados-body');
  if(!body) return;

  const totalEl = document.getElementById('apartados-total');
  if(totalEl){
    const {txt,cls} = fmtMoneda(data && data.totalApartado ? data.totalApartado : 0);
    totalEl.textContent = txt;
    totalEl.className = 'sec-hdr-val '+cls;
  }

  if(!_apartadosData.length){
    body.innerHTML='<div style="padding:16px;text-align:center;color:var(--m)">Sin apartados activos</div>';
    return;
  }

  const hoy = new Date(); hoy.setHours(0,0,0,0);

  body.innerHTML = _apartadosData.map(ap=>{
    const {txt:mTxt} = fmtMoneda(ap.monto);
    const usado = ap.estado && ap.estado.toLowerCase() === 'usado';
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
        ${!usado ? `<button
          onclick="_marcarApartadoUsado(${ap.fila})"
          style="font-size:10px;padding:3px 10px;border-radius:var(--rad-pill);border:1px solid rgba(74,222,128,.25);
          background:rgba(74,222,128,.08);color:#4ADE80;cursor:pointer;font-family:inherit;
          margin-top:5px;display:block;transition:all .2s"
          onmouseover="this.style.background='rgba(74,222,128,.2)'"
          onmouseout="this.style.background='rgba(74,222,128,.08)'">
          Usar ✓
        </button>` : '<div style="font-size:10px;color:var(--m);margin-top:4px">Usado</div>'}
      </div>
    </div>`;
  }).join('');
}

function _marcarApartadoUsado(fila){
  if(!confirm('¿Marcar este apartado como Usado?')) return;
  api.actualizarApartado(fila, 'Usado')
    .then(r=>{
      if(r.ok){
        showToast('✓ Apartado marcado como Usado');
        api.getApartados().then(renderApartados);
      } else {
        showToast(r.mensaje||'Error al actualizar', false);
      }
    })
    .catch(()=>showToast('Error de conexión', false));
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
//  GRÁFICAS — Chart.js
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
  if(ley)ley.innerHTML=datasets.map(d=>`<div style="display:flex;align-items:center;gap:5px;font-size:11px;color:${d.borderColor};font-weight:${d.label==='Final'?'700':'400'}"><div style="width:16px;height:2px;background:${d.borderColor};border-radius:1px"></div>${d.label}</div>`).join('');
}
function syncFijosHeight(){}
window.addEventListener('DOMContentLoaded',()=>{setTimeout(syncFijosHeight,300);});
window.addEventListener('resize',syncFijosHeight);

// ══════════════════════════════════════════
//  FLUJO MENSUAL
// ══════════════════════════════════════════
function renderFlujoMensual(data){
  const body = document.getElementById('flujo-mensual-body') || document.getElementById('flujo-body');
  if(!body) return;
  if(!data||!data.meses||!data.meses.length){body.innerHTML='<div style="padding:16px;color:var(--m);text-align:center">Sin datos</div>';return;}
  const rows=data.meses.map(mes=>{
    const g=data.grupos[mes]||{ingresos:0,egresos:0,excedente:null};
    const ingresos=g.ingresos||0,egresos=g.egresos||0;
    const excedente=g.excedente!==undefined?g.excedente:(ingresos+egresos);
    const fmtMXN=v=>'$ '+Math.abs(v).toLocaleString('es-MX',{minimumFractionDigits:2});
    const ingCell=ingresos===0?`<td class="r" style="color:var(--m)">$ 0</td>`:`<td class="r" style="color:var(--ok);font-weight:600">${fmtMXN(ingresos)}</td>`;
    const egrCell=egresos===0?`<td class="r" style="color:var(--m)">$ 0</td>`:`<td class="r" style="color:var(--err);font-weight:600">− ${fmtMXN(Math.abs(egresos))}</td>`;
    const excCell=excedente===0?`<td class="r" style="color:var(--m)">$ 0</td>`:`<td class="r" style="color:${excedente>0?'var(--ok)':'var(--err)'};font-weight:700">${excedente<0?'− ':''}${fmtMXN(excedente)}</td>`;
    return `<tr><td style="font-weight:500;color:var(--t)">${mes}</td>${ingCell}${egrCell}${excCell}</tr>`;
  }).join('');
  body.innerHTML=`
    <style>
      #flujo-tbl{width:100%;border-collapse:collapse;font-size:12px}
      #flujo-tbl th,#flujo-tbl td{padding:7px 10px;border-bottom:1px solid rgba(255,255,255,.05)}
      #flujo-tbl th{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--m);padding-bottom:6px}
      #flujo-tbl .r{text-align:right}
    </style>
    <table id="flujo-tbl">
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
  var msgs = (data.alertas||[]).concat(data.positivos||[]);
  if(msgs.length){
    html += '<div style="padding:0 16px 8px">';
    msgs.slice(0,3).forEach(function(m){
      var c = m.nivel==='critico'?'#EF4444':m.nivel==='positivo'?'#4ADE80':'#F59E0B';
      html += '<div style="font-size:11px;color:'+c+';padding:2px 0">'+m.area+' '+m.msg+'</div>';
    });
    html += '</div>';
  }
  html += '<div style="text-align:center;font-size:10px;color:rgba(255,255,255,.25);padding:0 16px 8px;letter-spacing:.05em;text-transform:uppercase">'+estado+'</div>';
  var areas = [
    {key:'dinero',    label:'Dinero',     icon:'💰', color:'#4ADE80', max:mx.dinero||25},
    {key:'habitos',   label:'Hábitos',    icon:'⚡', color:'#3B82F6', max:mx.habitos||25},
    {key:'salud',     label:'Salud',      icon:'🏥', color:'#EF4444', max:mx.salud||20},
    {key:'relaciones',label:'Relaciones', icon:'👥', color:'#06B6D4', max:mx.relaciones||15},
    {key:'mental',    label:'Mental',     icon:'🧠', color:'#8B5CF6', max:mx.mental||15},
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
    html += '<div style="height:4px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden">';
    html += '<div style="height:100%;width:'+pctA+'%;background:'+a.color+';border-radius:2px"></div>';
    html += '</div></div>';
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

function renderNecesidadesInline(data){
  if(!data) return;
  _necInlineData = data;
  _initNecInlineSelectors();
  actualizarNecInline();
}

function _dataNivelInline(key, arr){
  return (arr||[]).find(function(n){ return n.key===key; }) || {key:key,total:0,conceptos:[]};
}

function _dibujarRadarYPiramideInline(niveles){
  var wrap = document.getElementById('nec-inline-radar-wrap');
  if(!wrap) return;
  var totalSum = NEC_NIVELES.reduce(function(s,n){ return s+Math.abs(_dataNivelInline(n.key,niveles).total||0); },0);
  var pisos = NEC_NIVELES.slice().reverse();
  var svgRects = pisos.map(function(niv, i){
    var d   = _dataNivelInline(niv.key, niveles);
    var abs = Math.abs(d.total||0);
    var pct = totalSum > 0 ? abs/totalSum : 0;
    var w   = Math.max(16, pct * 200);
    var x   = (200 - w) / 2;
    var y   = i * 34;
    var op  = abs===0 ? 0.15 : 0.85;
    return '<rect x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+w.toFixed(1)+'" height="30" rx="4" fill="'+niv.color+'" opacity="'+op+'"/>'+
      '<text x="100" y="'+(y+20).toFixed(1)+'" text-anchor="middle" font-size="9" fill="rgba(255,255,255,.8)" font-family="system-ui" font-weight="600">'+niv.label+'</text>';
  }).join('');
  wrap.innerHTML =
    '<div style="display:flex;align-items:flex-start;justify-content:center;gap:24px;padding:20px 16px 8px;width:100%;box-sizing:border-box">' +
      '<div style="display:flex;flex-direction:column;align-items:center;flex:1;min-width:0">' +
        '<div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:rgba(255,255,255,.35);margin-bottom:10px">Radar</div>' +
        '<div style="width:240px;height:240px;max-width:100%"><canvas id="radar-inline-canvas" width="240" height="240"></canvas></div>' +
      '</div>' +
      '<div style="display:flex;flex-direction:column;align-items:center;flex:1;min-width:0">' +
        '<div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:rgba(255,255,255,.35);margin-bottom:10px">Distribución</div>' +
        '<svg width="100%" height="200" viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg" style="max-width:240px">'+svgRects+'</svg>' +
      '</div>' +
    '</div>';
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
        pointBorderWidth:2, pointRadius:5, fill:true }]},
      options:{ responsive:false, maintainAspectRatio:false,
        plugins:{ legend:{display:false},
          tooltip:{ backgroundColor:'rgba(15,23,42,.95)', borderColor:'rgba(255,255,255,.1)', borderWidth:1,
            callbacks:{ label:function(ctx){ return ' $'+valores[ctx.dataIndex].toLocaleString('es-MX',{minimumFractionDigits:0}); }}}},
        scales:{ r:{ min:0, max:100,
          angleLines:{color:'rgba(255,255,255,.06)'}, grid:{color:'rgba(255,255,255,.06)'},
          ticks:{display:false},
          pointLabels:{ font:{size:10,weight:'600',family:'system-ui'},
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
  var pisos = NEC_NIVELES.slice().reverse();
  var html = '<div style="padding:0 16px 16px">';
  html += '<div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:rgba(255,255,255,.35);margin-bottom:12px;text-align:center">Detalle por nivel</div>';
  pisos.forEach(function(niv){
    var d    = _dataNivelInline(niv.key, niveles);
    var abs  = Math.abs(d.total||0);
    var pct  = totalSum>0 ? (abs/totalSum*100) : 0;
    var barW = maxAbs>0 ? (abs/maxAbs*100) : 0;
    var vacio= abs===0;
    var tops = (d.conceptos||[]).slice(0,4).join(', ');
    var status = vacio
      ? '<span style="font-size:9px;color:var(--warn);background:rgba(245,158,11,.1);padding:1px 7px;border-radius:10px;white-space:nowrap">⚠ descuidado</span>'
      : (pct>40
        ? '<span style="font-size:9px;color:var(--err);background:rgba(239,68,68,.08);padding:1px 7px;border-radius:10px;white-space:nowrap">Alto</span>'
        : '<span style="font-size:9px;color:var(--ok);background:rgba(74,222,128,.08);padding:1px 7px;border-radius:10px;white-space:nowrap">✓ OK</span>');
    html += '<div style="margin-bottom:14px">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">';
    html += '<div style="display:flex;align-items:center;gap:7px">';
    html += '<div style="width:9px;height:9px;border-radius:50%;background:'+(vacio?'rgba(255,255,255,.15)':niv.color)+';flex-shrink:0"></div>';
    html += '<span style="font-size:13px;font-weight:600;color:'+(vacio?'var(--m)':'#fff')+'">'+niv.label+'</span>';
    html += status;
    html += '</div>';
    html += '<span style="font-size:14px;font-weight:700;color:'+(vacio?'rgba(255,255,255,.2)':niv.color)+';font-variant-numeric:tabular-nums">';
    html += (vacio ? '—' : '$ '+abs.toLocaleString('es-MX',{minimumFractionDigits:0}));
    html += '<span style="font-size:11px;color:rgba(255,255,255,.3);font-weight:400"> '+Math.round(pct)+'%</span></span>';
    html += '</div>';
    html += '<div style="height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden;margin-bottom:4px">';
    html += '<div style="height:100%;width:'+barW.toFixed(1)+'%;background:'+niv.color+';border-radius:3px;opacity:'+(vacio?.15:.9)+';transition:width .5s ease"></div>';
    html += '</div>';
    if(tops) html += '<div style="font-size:10px;color:rgba(255,255,255,.4);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">↳ '+tops+'</div>';
    html += '</div>';
  });
  html += '</div>';
  cont.innerHTML = html;
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
    type: 'radar', data: { labels: labels, datasets: [{ label: 'Gasto', data: norm,
      backgroundColor: 'rgba(139,92,246,.12)', borderColor: 'rgba(139,92,246,.6)',
      borderWidth: 1.5, pointBackgroundColor: colors, pointBorderColor: '#111',
      pointBorderWidth: 2, pointRadius: 5, pointHoverRadius: 7, fill: true }]},
    options: { responsive: true, maintainAspectRatio: true, aspectRatio: 1.3,
      plugins: { legend: {display: false} },
      scales: { r: { min: 0, max: 100,
        angleLines: {color: 'rgba(255,255,255,.06)'},
        grid: {color: 'rgba(255,255,255,.06)'},
        ticks: {display: false},
        pointLabels: { font: {size: 11, weight: '600', family: 'system-ui'},
          color: function(ctx){ return colors[ctx.index]||'#94A3B8'; }}}}}
  });
}

// ══════════════════════════════════════════
//  PATRIMONIO — fusionado con datos reales de Bancos
// ══════════════════════════════════════════
function renderPatrimonio(data){
  var body = document.getElementById('patrimonio-body');
  if(!body) return;
  if(!data||!data.ok){
    body.innerHTML='<div style="padding:20px;text-align:center;color:var(--m)">Sin datos</div>';
    return;
  }
  var fmt = function(v){ return '$ '+Math.abs(v||0).toLocaleString('es-MX',{minimumFractionDigits:0}); };
  var fmt2= function(v){ return '$ '+Math.abs(v||0).toLocaleString('es-MX',{minimumFractionDigits:2,maximumFractionDigits:2}); };

  var f         = data.fondo     || {};
  var banco     = data.banco     || {saldo:0, pct:0, items:[]};
  var fisico    = data.fisico    || {saldo:0, pct:0, items:[]};
  var inversion = data.inversion || {saldo:0, pct:0, rendimientoTotal:0, items:[]};
  var total     = data.total     || 0;
  var prestamo  = data.prestamo  || 0;

  var saludColor = f.salud==='ok'?'#4ADE80':f.salud==='warn'?'#F59E0B':'#EF4444';
  var saludLbl   = f.salud==='ok'?'Fondo completo':f.salud==='warn'?'Fondo parcial':'Sin fondo';

  var html = '';

  // ── Cabecera: total + barra de distribución ──
  html += '<div style="padding:14px 16px 10px">';
  html += '<div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--m);margin-bottom:4px">Patrimonio neto líquido</div>';
  html += '<div style="font-size:30px;font-weight:800;letter-spacing:-.04em;color:#fff;line-height:1">'+fmt2(total)+'</div>';
  if(prestamo > 0){
    html += '<div style="font-size:11px;color:var(--m);margin-top:3px">Pasivo: <span style="color:#F59E0B">− '+fmt(prestamo)+'</span> (no incluido en total)</div>';
  }
  html += '</div>';

  // Barra distribución proporcional
  if(total > 0){
    html += '<div style="margin:0 16px 12px;height:6px;border-radius:3px;overflow:hidden;display:flex;gap:1px">';
    if(banco.pct > 0)     html += '<div style="width:'+banco.pct+'%;background:#4ADE80;border-radius:3px" title="Banco '+banco.pct+'%"></div>';
    if(fisico.pct > 0)    html += '<div style="width:'+fisico.pct+'%;background:#FBBF24;border-radius:3px" title="Efectivo '+fisico.pct+'%"></div>';
    if(inversion.pct > 0) html += '<div style="width:'+inversion.pct+'%;background:#8B5CF6;border-radius:3px" title="Inversión '+inversion.pct+'%"></div>';
    html += '</div>';
  }

  // ── Tres columnas de categorías ──
  html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;padding:0 16px 12px">';

  // Banco — detalle por institución
  html += '<div style="background:rgba(74,222,128,.06);border:1px solid rgba(74,222,128,.15);border-radius:10px;padding:10px 12px">';
  html += '<div style="display:flex;align-items:center;gap:5px;margin-bottom:6px">';
  html += '<span style="font-size:14px">🏦</span>';
  html += '<span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:rgba(74,222,128,.7)">Banco</span>';
  html += '</div>';
  html += '<div style="font-size:18px;font-weight:800;color:#4ADE80;letter-spacing:-.03em;line-height:1;margin-bottom:2px">'+fmt(banco.saldo)+'</div>';
  html += '<div style="font-size:10px;color:rgba(74,222,128,.5);margin-bottom:6px">'+banco.pct+'% del total</div>';
  // items individuales
  (banco.items||[]).forEach(function(it){
    html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-top:1px solid rgba(74,222,128,.08)">';
    html += '<span style="font-size:11px;font-weight:600;color:rgba(255,255,255,.6)">'+it.nombre+'</span>';
    html += '<span style="font-size:11px;font-weight:700;color:#4ADE80;font-variant-numeric:tabular-nums">'+fmt(it.monto)+'</span>';
    html += '</div>';
  });
  html += '</div>';

  // Efectivo — detalle
  html += '<div style="background:rgba(251,191,36,.06);border:1px solid rgba(251,191,36,.15);border-radius:10px;padding:10px 12px">';
  html += '<div style="display:flex;align-items:center;gap:5px;margin-bottom:6px">';
  html += '<span style="font-size:14px">💵</span>';
  html += '<span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:rgba(251,191,36,.7)">Efectivo</span>';
  html += '</div>';
  html += '<div style="font-size:18px;font-weight:800;color:#FBBF24;letter-spacing:-.03em;line-height:1;margin-bottom:2px">'+fmt(fisico.saldo)+'</div>';
  html += '<div style="font-size:10px;color:rgba(251,191,36,.5);margin-bottom:6px">'+fisico.pct+'% del total</div>';
  (fisico.items||[]).forEach(function(it){
    html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-top:1px solid rgba(251,191,36,.08)">';
    html += '<span style="font-size:11px;font-weight:600;color:rgba(255,255,255,.6)">'+it.nombre+'</span>';
    html += '<span style="font-size:11px;font-weight:700;color:#FBBF24;font-variant-numeric:tabular-nums">'+fmt(it.monto)+'</span>';
    html += '</div>';
  });
  html += '</div>';

  // Inversión — detalle
  html += '<div style="background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.15);border-radius:10px;padding:10px 12px">';
  html += '<div style="display:flex;align-items:center;gap:5px;margin-bottom:6px">';
  html += '<span style="font-size:14px">📈</span>';
  html += '<span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:rgba(139,92,246,.7)">Inversión</span>';
  html += '</div>';
  html += '<div style="font-size:18px;font-weight:800;color:#C4B5FD;letter-spacing:-.03em;line-height:1;margin-bottom:2px">'+fmt(inversion.saldo)+'</div>';
  html += '<div style="font-size:10px;color:rgba(139,92,246,.5);margin-bottom:6px">'+inversion.pct+'% del total</div>';
  if(inversion.rendimientoTotal > 0){
    html += '<div style="font-size:10px;color:rgba(139,92,246,.6);padding:4px 0;border-top:1px solid rgba(139,92,246,.08)">';
    html += 'Rendimiento: <b style="color:#C4B5FD">+'+fmt(inversion.rendimientoTotal)+'</b>';
    html += '</div>';
  }
  (inversion.items||[]).slice(0,2).forEach(function(it){
    html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-top:1px solid rgba(139,92,246,.08)">';
    html += '<span style="font-size:10px;color:rgba(255,255,255,.5)">'+it.instrumento+'</span>';
    html += '<span style="font-size:11px;font-weight:700;color:#C4B5FD;font-variant-numeric:tabular-nums">'+fmt(it.saldo||0)+'</span>';
    html += '</div>';
  });
  if(!inversion.saldo){
    html += '<div style="font-size:10px;color:rgba(255,255,255,.2);margin-top:4px">Sin inversiones</div>';
  }
  html += '</div>';

  html += '</div>'; // /grid

  // ── Fondo de emergencia ──
  if(f.meta > 0){
    html += '<div style="margin:0 16px 12px;padding:12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:10px">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">';
    html += '<span style="font-size:11px;color:var(--m)">🎯 Fondo de emergencia <span style="color:var(--m);font-size:10px">(3 meses de gasto)</span></span>';
    html += '<span style="font-size:12px;font-weight:700;color:'+saludColor+'">'+(f.avance||0)+'% · '+saludLbl+'</span>';
    html += '</div>';
    html += '<div style="height:5px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden;margin-bottom:6px">';
    html += '<div style="height:100%;width:'+Math.min(100,f.avance||0)+'%;background:'+saludColor+';border-radius:3px;transition:width .5s"></div>';
    html += '</div>';
    html += '<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--m)">';
    html += '<span>Actual en banco: <b style="color:rgba(255,255,255,.6)">'+fmt(banco.saldo)+'</b></span>';
    html += '<span>Meta: <b style="color:rgba(255,255,255,.6)">'+fmt(f.meta)+'</b> · '+(f.meses||0)+' meses cubiertos</span>';
    html += '</div></div>';
  }

  body.innerHTML = html;
}
