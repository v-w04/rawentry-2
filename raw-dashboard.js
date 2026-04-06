/* RAW Entry — Dashboard v.4.020
   Tablas Variables/Fijos · Flujo Mensual · Gráficas
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
        return `<div style="display:flex;justify-content:space-between;align-items:center;
          padding:9px 14px;border-bottom:1px solid rgba(255,255,255,.05)">
          <span style="font-size:13px;color:var(--m);font-weight:600">${it.clave}</span>
          <span style="font-size:13px;font-weight:700;font-variant-numeric:tabular-nums;
            color:${pag?'var(--ok)':'var(--err)'}">${pag?'✓ ':''}${mtxt}</span>
        </div>`;
      }).join('');
      return `<div class="kard" style="border-color:${border};cursor:pointer"
        onclick="togKard('${cardId}')">
        <div class="kard-name">${g.concepto}
          <span class="kard-chev" style="float:right;font-size:11px;color:var(--m)">▾</span>
        </div>
        <div class="kard-val ${pagados>0?'pos':cls}">${txt}</div>
        <div class="kard-prog"><div class="kard-prog-fill" style="width:${pct}%"></div></div>
        <div class="kard-meta">${pagados}/12 pagados</div>
        <div id="${cardId}" style="display:none;margin:8px -14px -14px;
          border-top:1px solid rgba(255,255,255,.08)">${mesesRows}</div>
      </div>`;
    }).join('');
    body.innerHTML=`<div class="cards-grid">${cards}</div>`;
  } else {
    const claves=[...new Set(data.grupos.flatMap(g=>g.items.map(it=>it.clave)))];
    const idx={};data.grupos.forEach(g=>{idx[g.concepto]={};g.items.forEach(it=>idx[g.concepto][it.clave]=it);});
    const mesActual=MESES_ES[new Date().getMonth()];
    const thead=`<tr><th>Concepto</th>${claves.map(c=>{
      const esA=c.toUpperCase()===mesActual.toUpperCase();
      return `<th class="${esA?'mes-actual':''}" style="text-align:center">${c}</th>`;
    }).join('')}</tr>`;
    const tbody=data.grupos.map(g=>{
      const celdas=claves.map(clave=>{
        const it=idx[g.concepto][clave];
        if(!it)return`<td style="text-align:center;color:var(--err);font-size:13px">✗</td>`;
        const {txt,cls}=fmtMoneda(it.monto);
        const pag=it.pagado==='Sí'||it.pagado==='Si'||it.pagado==='sí';
        const esA=clave.toUpperCase()===mesActual.toUpperCase();
        const tieneMonto = it.monto !== null && it.monto !== 0;
        const colorCls = tieneMonto ? (pag ? 'pos' : cls) : '';
        return `<td class="${colorCls}${esA?' mes-actual':''}" style="text-align:center">
          ${tieneMonto ? `<div>${txt}</div>` : `<div style="color:var(--err);font-size:13px">✗</div>`}
        </td>`;
      }).join('');
      return `<tr><td>${g.concepto}</td>${celdas}</tr>`;
    }).join('');
    body.innerHTML=`<div class="tbl-wrap"><table class="tbl"><thead>${thead}</thead><tbody>${tbody}</tbody></table></div>`;
  }
  initGraficaFijos(data);
}

// ══════════════════════════════════════════
//  GASTOS POR MES
// ══════════════════════════════════════════
function onDatosMes(data){datosMes=data;renderGastos();initGraficas(data);}
function renderGastos(){
  const body=document.getElementById('gastos-body');
  const data=datosMes;
  if(!data.meses||!data.meses.length){
    body.innerHTML='<div style="padding:16px;color:var(--m);text-align:center">Sin datos</div>';return;
  }
  const esMob=document.documentElement.classList.contains('mob')||window.innerWidth<900;
  const mesActual=MESES_ES[new Date().getMonth()];

  if(esMob){
    const entesSet=new Set();
    data.meses.forEach(m=>(data.grupos[m]||[]).forEach(e=>entesSet.add(e.ente)));
    const entes=[...entesSet];
    const idx={};
    data.meses.forEach(mes=>{
      idx[mes]={};
      (data.grupos[mes]||[]).forEach(e=>idx[mes][e.ente]={monto:e.monto,inicio:e.inicio,fin:e.fin});
    });
    const uid2 = 'gs_'+Date.now();
    const cards = entes.map((ente,ei)=>{
      const cardId = uid2+'_'+ei;
      const entesMesActual = ['Final','P'];
      let total=0;
      if(entesMesActual.includes(ente)){
        total=idx[mesActual]?.[ente]?.monto||0;
      } else {
        data.meses.forEach(m=>{
          const mIdx=MESES_ES.indexOf(m);
          if(mIdx<=new Date().getMonth()) total+=idx[m]?.[ente]?.monto||0;
        });
      }
      const {txt,cls}=fmtMoneda(total||null);
      const mesesHTML = data.meses.map(mes=>{
        const item=idx[mes]?.[ente];
        if(!item||item.monto===null) return '';
        const {txt:mtxt,cls:mcls}=fmtMoneda(item.monto);
        const esActual=mes.toUpperCase()===mesActual.toUpperCase();
        return `<div style="display:flex;justify-content:space-between;align-items:center;
          padding:8px 14px;border-bottom:1px solid rgba(255,255,255,.05);
          ${esActual?'background:rgba(59,130,246,.08)':''}">
          <span style="font-size:13px;font-weight:${esActual?'700':'500'};
            color:${esActual?'var(--p)':'var(--m)'}">${mes}${esActual?' 📍':''}</span>
          <span style="font-size:14px;font-weight:700;font-variant-numeric:tabular-nums;
            color:${mcls==='pos'?'var(--ok)':mcls==='neg'?'var(--err)':'var(--m)'}">${mtxt}</span>
        </div>`;
      }).filter(Boolean).join('');
      return `<div class="kard" style="cursor:pointer;grid-column:span 1"
          onclick="togKard('${cardId}')">
        <div class="kard-name">${ente}
          <span class="kard-chev" style="float:right;font-size:11px;color:var(--m);font-weight:400">▾</span>
        </div>
        <div class="kard-val ${cls}">${txt}</div>
        <div id="${cardId}" style="display:none;margin:8px -14px -14px;
          border-top:1px solid rgba(255,255,255,.08)">${mesesHTML}</div>
      </div>`;
    }).join('');
    body.innerHTML=`<div class="cards-grid">${cards}</div>`;
  } else {
    const entesSet=new Set();
    data.meses.forEach(m=>(data.grupos[m]||[]).forEach(e=>entesSet.add(e.ente)));
    const entes=[...entesSet];
    const idx={};
    data.meses.forEach(mes=>{idx[mes]={};(data.grupos[mes]||[]).forEach(e=>idx[mes][e.ente]=e.monto);});
    const thead=`<tr><th>Ente</th>${data.meses.map(m=>{
      const esA=m.toUpperCase()===mesActual.toUpperCase();
      return `<th class="${esA?'mes-actual':''}">${m}</th>`;
    }).join('')}</tr>`;
    const tbody=entes.map(ente=>{
      const celdas=data.meses.map(mes=>{
        const {txt,cls}=fmtMoneda(idx[mes]?.[ente]??null);
        const esA=mes.toUpperCase()===mesActual.toUpperCase();
        return `<td class="${cls}${esA?' mes-actual':''}">${txt}</td>`;
      }).join('');
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
      <div class="panel-chips" id="pchips-${idx}">
        ${col.valores.map(v=>`<span class="chip">${v}</span>`).join('')}
      </div>
    </div>
  `).join('');
}
function addItem(idx){
  const inp=document.getElementById('pi-'+idx);
  const val=inp.value.trim();if(!val)return;
  inp.disabled=true;
  api.agregarALista(idx,val)
    .then(r=>{
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
    })
    .catch(()=>{inp.disabled=false;});
}

// ══════════════════════════════════════════
//  REFRESH GLOBAL
// ══════════════════════════════════════════
function refreshTodo(){
  const btn=document.getElementById('btn-rf');
  btn.classList.add('spinning');btn.disabled=true;
  progStart();
  setChip('load','Actualizando');
  // Una sola llamada getAll + saldo por separado (depende de fecha dinámica)
  Promise.all([
    api.getAll(),
    consultarSaldo()
  ])
  .then(([d])=>{
    if(d && d.catalogos) onCats(d.catalogos);
    if(d && d.fijos)     renderEntes(d.fijos);
    if(d && d.datosMes)  onDatosMes(d.datosMes);
    if(d && d.gastos)    renderAnualidad(d.gastos);
    if(d && d.logros)    renderLogros(d.logros);
    if(d && d.necesidades) renderNecesidades(d.necesidades);
    if(d && d.flujoPorMes) renderFlujoMensual(d.flujoPorMes);
    btn.classList.remove('spinning');btn.disabled=false;
    progDone();
    showToast('Datos actualizados');
  })
  .catch(()=>{
    btn.classList.remove('spinning');btn.disabled=false;
    progDone();
    showToast('Error al actualizar',false);
  });
}

// ══════════════════════════════════════════
//  GRÁFICAS — Chart.js via CDN
// ══════════════════════════════════════════
let grafChart = null;
let grafData  = null;

const GRAF_COLORS = {
  'Final':       { line:'#FFFFFF', width:3 },
  'P':           { line:'#3B82F6', width:1.5 },
  'M':           { line:'#06B6D4', width:1.5 },
  'BW':          { line:'#8B5CF6', width:1.5 },
  'Foodies':     { line:'#F59E0B', width:1.5 },
  'Blue':        { line:'#4ADE80', width:1.5 },
  'Espiritu':    { line:'#EF4444', width:1.5 },
  'Espíritu':    { line:'#EF4444', width:1.5 },
  'Mercader':    { line:'#EC4899', width:1.5 },
  'Aseo':        { line:'#FB923C', width:1.5 },
  'Suscripción': { line:'#A78BFA', width:1.5 },
  'Inicio':      { line:'#34D399', width:1.5 },
  '∴':           { line:'#67E8F9', width:1.5 },
};

const PALETA_ROTATIVA = [
  '#3B82F6','#06B6D4','#8B5CF6','#F59E0B','#4ADE80','#EF4444',
  '#EC4899','#FB923C','#A78BFA','#34D399','#67E8F9','#FBBF24',
  '#F472B6','#60A5FA','#2DD4BF','#C084FC','#FCA5A5','#86EFAC',
  '#7DD3FC','#FCD34D','#E879F9','#4ADE80','#F87171','#38BDF8',
  '#A3E635','#FB7185','#818CF8','#34D399','#FDBA74','#E2E8F0'
];
let _paletaIdx = 0;
const _colorCache = {};

function getEnteColor(ente){
  if(GRAF_COLORS[ente]) return GRAF_COLORS[ente];
  if(!_colorCache[ente]){
    _colorCache[ente] = { line: PALETA_ROTATIVA[_paletaIdx % PALETA_ROTATIVA.length], width:1.5 };
    _paletaIdx++;
  }
  return _colorCache[ente];
}

function initGraficas(data){
  grafData = data;
  if(!window.Chart){
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
    s.onload = ()=>{ setTimeout(mostrarGraficaAnual, 100); };
    s.onerror = ()=>{ const l=document.getElementById('graf-loading');if(l)l.innerHTML='<span style="color:var(--err)">Error cargando Chart.js</span>'; };
    document.head.appendChild(s);
  } else {
    setTimeout(mostrarGraficaAnual, 50);
  }
}

function mostrarGraficaAnual(){
  const data = grafData;
  if(!data||!data.meses||!window.Chart) return;

  const entesSet = new Set();
  data.meses.forEach(mes=>{ (data.grupos[mes]||[]).forEach(e=>entesSet.add(e.ente)); });
  const entes = [...entesSet];
  const idx = {};
  data.meses.forEach(mes=>{ idx[mes]={};(data.grupos[mes]||[]).forEach(e=>idx[mes][e.ente]=e.monto); });

  const entesGraf = entes.filter(e=>e!=='BW'&&e!=='Final');

  const dsets = entesGraf.map(ente=>{
    const cfg = getEnteColor(ente);
    return {
      label: ente,
      data: data.meses.map(mes=>{
        const v = idx[mes]?.[ente];
        if(v===null||v===undefined) return null;
        return Math.abs(v);
      }),
      borderColor: cfg.line,
      borderWidth: 1.5,
      pointRadius: 3,
      pointHoverRadius: 6,
      fill: false, tension:0.3, spanGaps:true,
      order: 1,
    };
  });

  renderChart(data.meses, dsets, 'Vista Anual');
}

function renderChart(labels, datasets, titulo){
  const loading = document.getElementById('graf-loading');
  const canvas  = document.getElementById('graf-canvas');
  if(!canvas) return;
  if(loading) loading.style.display='none';
  canvas.style.display='block';
  if(grafChart){ try{grafChart.destroy();}catch(e){} grafChart=null; }

  grafChart = new Chart(canvas, {
    type:'line',
    data:{ labels, datasets },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      interaction:{ mode:'index', intersect:false },
      plugins:{
        legend:{ display:false },
        tooltip:{
          backgroundColor:'rgba(15,23,42,.95)',
          borderColor:'rgba(59,130,246,.3)',
          borderWidth:1,
          titleColor:'#fff',
          bodyColor:'#94A3B8',
          padding:10,
          callbacks:{
            label: ctx=>{
              const v = ctx.raw;
              if(v===null||v===undefined) return null;
              const fmt = (v<0?'− ':'')+'$ '+Math.abs(v).toLocaleString('es-MX',{minimumFractionDigits:2});
              return ' '+ctx.dataset.label+': '+fmt;
            }
          }
        }
      },
      scales:{
        x:{
          grid:{ color:'rgba(255,255,255,.05)' },
          ticks:{ color:'#64748B', font:{size:11} }
        },
        y:{
          grid:{ color:'rgba(255,255,255,.05)' },
          ticks:{
            color:'#64748B', font:{size:11},
            callback: v=>'$'+Math.abs(v/1000).toFixed(0)+'k'
          }
        }
      }
    }
  });

  const ley = document.getElementById('graf-leyenda');
  ley.innerHTML = datasets.map(d=>`
    <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:${d.borderColor};font-weight:${d.label==='Final'?'700':'400'}">
      <div style="width:16px;height:2px;background:${d.borderColor};border-radius:1px"></div>
      ${d.label}
    </div>`).join('');
}

function syncFijosHeight(){
  if(window.innerWidth < 900) return;
  const entrada = document.getElementById('sec-entrada');
  if(!entrada) return;
  const h = entrada.offsetHeight;
  if(h > 0) document.documentElement.style.setProperty('--entrada-h', h + 'px');
}
window.addEventListener('DOMContentLoaded', ()=>{ setTimeout(syncFijosHeight, 300); });
window.addEventListener('resize', syncFijosHeight);


// ══════════════════════════════════════════
//  FLUJO MENSUAL
// ══════════════════════════════════════════
function renderFlujoMensual(data){
  const body = document.getElementById('flujo-body');
  if(!data||!data.meses||!data.meses.length){
    body.innerHTML='<div style="padding:16px;color:var(--m);text-align:center">Sin datos</div>';return;
  }
  const mesActual = MESES_ES[new Date().getMonth()];

  const rows = data.meses.map(mes=>{
    const g = data.grupos[mes]||{ingresos:0,egresos:0,excedente:null};
    const ingresos   = g.ingresos||0;
    const egresos    = g.egresos||0;
    const excedente  = g.excedente!==undefined ? g.excedente : (ingresos+egresos);
    const esActual   = mes===mesActual;
    const fmtMXN = v=>'$ '+Math.abs(v).toLocaleString('es-MX',{minimumFractionDigits:2});

    const ingCell = ingresos===0
      ? `<td class="r" style="color:var(--m)">$ 0</td>`
      : `<td class="r" style="color:var(--ok);font-weight:600">${fmtMXN(ingresos)}</td>`;
    const egrCell = egresos===0
      ? `<td class="r" style="color:var(--m)">$ 0</td>`
      : `<td class="r" style="color:var(--err);font-weight:600">− ${fmtMXN(Math.abs(egresos))}</td>`;
    const excCell = excedente===0
      ? `<td class="r" style="color:var(--m)">$ 0</td>`
      : `<td class="r" style="color:${excedente>0?'var(--ok)':'var(--err)'};font-weight:700">${excedente<0?'− ':''}${fmtMXN(excedente)}</td>`;

    return `<tr style="${esActual?'background:rgba(59,130,246,.08)':''}">
      <td style="font-weight:${esActual?700:500};color:${esActual?'var(--p)':'var(--t)'}">${mes}${esActual?' ↑':''}</td>
      ${ingCell}${egrCell}${excCell}
    </tr>`;
  }).join('');

  body.innerHTML=`<table id="flujo-tbl">
    <colgroup>
      <col class="c-mes"><col class="c-num"><col class="c-num"><col class="c-num">
    </colgroup>
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
let grafFijosChart = null;

const FIJOS_COLORS = [
  '#3B82F6','#06B6D4','#8B5CF6','#F59E0B','#4ADE80','#EF4444',
  '#EC4899','#FB923C','#A78BFA','#34D399','#67E8F9','#FBBF24',
  '#F472B6','#60A5FA','#2DD4BF','#C084FC','#FCA5A5','#86EFAC',
  '#7DD3FC','#FCD34D','#E879F9','#F87171','#38BDF8','#A3E635',
  '#FB7185','#818CF8','#FDBA74','#E2E8F0','#84CC16','#6366F1'
];

function initGraficaFijos(data){
  if(!data||!data.ok||!data.grupos||!data.grupos.length) return;
  if(!window.Chart){
    const wait = setInterval(()=>{
      if(window.Chart){ clearInterval(wait); renderGraficaFijos(data); }
    }, 100);
    return;
  }
  renderGraficaFijos(data);
}

function renderGraficaFijos(data){
  const loading = document.getElementById('graf-fijos-loading');
  const canvas  = document.getElementById('graf-fijos-canvas');
  const leyenda = document.getElementById('graf-fijos-leyenda');
  if(!canvas) return;

  const claves = [...new Set(data.grupos.flatMap(g => g.items.map(it => it.clave)))];

  const datasets = data.grupos.map((g, i) => {
    const color = FIJOS_COLORS[i % FIJOS_COLORS.length];
    const puntos = claves.map(clave => {
      const it = g.items.find(it => it.clave === clave);
      return it && it.monto !== null ? Math.abs(it.monto) : null;
    });
    return {
      label: g.concepto,
      data: puntos,
      borderColor: color,
      borderWidth: 1.5,
      pointRadius: 3,
      pointHoverRadius: 6,
      fill: false,
      tension: 0.3,
      spanGaps: true,
    };
  });

  if(loading) loading.style.display = 'none';
  canvas.style.display = 'block';

  if(grafFijosChart){ try{ grafFijosChart.destroy(); }catch(e){} grafFijosChart = null; }

  grafFijosChart = new Chart(canvas, {
    type: 'line',
    data: { labels: claves, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15,23,42,.95)',
          borderColor: 'rgba(6,182,212,.3)',
          borderWidth: 1,
          titleColor: '#fff',
          bodyColor: '#94A3B8',
          padding: 10,
          callbacks: {
            label: ctx => {
              const v = ctx.raw;
              if(v === null || v === undefined) return null;
              return ' ' + ctx.dataset.label + ': $ ' + Math.abs(v).toLocaleString('es-MX', {minimumFractionDigits:2});
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,.05)' },
          ticks: { color: '#64748B', font: { size: 11 } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,.05)' },
          ticks: {
            color: '#64748B', font: { size: 11 },
            callback: v => '$' + Math.abs(v/1000).toFixed(1) + 'k'
          }
        }
      }
    }
  });

  if(leyenda){
    leyenda.innerHTML = datasets.map(d =>
      `<div style="display:flex;align-items:center;gap:5px;font-size:11px;color:${d.borderColor}">
        <div style="width:16px;height:2px;background:${d.borderColor};border-radius:1px"></div>
        ${d.label}
      </div>`
    ).join('');
  }
}
