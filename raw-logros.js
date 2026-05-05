(function _estilosLogros(){
  if(document.getElementById('lgr-css')) return;
  var s=document.createElement('style');
  s.id='lgr-css';
  s.textContent=`
#board-logros{display:flex;flex-direction:column;overflow:hidden;background:#020810;position:absolute;inset:0}
#lgr-hdr{display:flex;align-items:center;gap:14px;padding:10px 20px;background:rgba(2,4,12,0.97);border-bottom:1px solid rgba(255,255,255,0.09);flex-shrink:0;flex-wrap:wrap}
#lgr-badge{width:52px;height:52px;border-radius:50%;flex-shrink:0;background:rgba(0,10,20,0.95);border:2px solid rgba(255,255,255,0.25);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 0 16px rgba(255,255,255,0.06);animation:lgrBadge 4s ease-in-out infinite}
@keyframes lgrBadge{0%,100%{border-color:rgba(255,255,255,0.20)}50%{border-color:rgba(255,255,255,0.45);box-shadow:0 0 24px rgba(255,255,255,0.10)}}
#lgr-nivel-n{font-size:18px;font-weight:800;color:#fff;line-height:1}
#lgr-nivel-l{font-size:7px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,0.4)}
#lgr-xp-wrap{display:flex;flex-direction:column;gap:4px;flex:0 0 200px}
#lgr-xp-lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,0.28)}
#lgr-xp-bar{height:4px;background:rgba(255,255,255,0.06);overflow:hidden}
#lgr-xp-fill{height:100%;background:#fff;box-shadow:0 0 8px rgba(255,255,255,0.5);transition:width 1s ease;animation:xpGlow 2.5s ease-in-out infinite}
@keyframes xpGlow{0%,100%{box-shadow:0 0 6px rgba(255,255,255,0.4)}50%{box-shadow:0 0 14px rgba(255,255,255,0.8)}}
#lgr-xp-txt{font-size:10px;font-weight:600;color:rgba(255,255,255,0.5);display:flex;justify-content:space-between}
#lgr-xp-frac{color:#fff;font-weight:700}
#lgr-info{display:flex;flex-direction:column;gap:2px}
#lgr-titulo{font-size:16px;font-weight:800;color:#fff;letter-spacing:-.01em;text-transform:uppercase}
#lgr-subtitulo{font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:.04em}
#lgr-prox{display:flex;align-items:center;gap:8px;margin-left:auto;font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:.04em;white-space:nowrap}
.lgr-chip{padding:4px 10px;border:1px solid rgba(255,255,255,0.14);font-size:11px;font-weight:800;display:flex;align-items:center;gap:5px}
.lgr-chip.xp  {color:#fbbf24;border-color:rgba(251,191,36,0.30);background:rgba(251,191,36,0.07)}
.lgr-chip.cash{color:#4ADE80;border-color:rgba(74,222,128,0.28);background:rgba(74,222,128,0.06)}
#lgr-filtros{display:flex;align-items:center;gap:8px;padding:8px 20px;background:rgba(1,3,10,0.95);border-bottom:1px solid rgba(255,255,255,0.06);flex-shrink:0;flex-wrap:wrap}
.lgr-sel{background:rgba(14,14,20,0.95);border:1px solid rgba(255,255,255,0.10);border-radius:0;color:rgba(255,255,255,0.7);font-family:inherit;font-size:10px;font-weight:700;padding:5px 10px;outline:none;cursor:pointer;letter-spacing:.04em;text-transform:uppercase;-webkit-appearance:none;appearance:none;transition:border-color .15s}
.lgr-sel:hover{border-color:rgba(255,255,255,0.25);color:#fff}
.lgr-sel option{background:#020810;color:#fff}
.lgr-grp{display:flex;gap:1px;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.08);padding:2px}
.lgr-pill{padding:5px 12px;border:none;font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;background:none;color:rgba(255,255,255,0.32);cursor:pointer;font-family:inherit;transition:all .12s}
.lgr-pill:hover{color:rgba(255,255,255,0.8);background:rgba(255,255,255,0.05)}
.lgr-pill.on{color:#fff;background:rgba(255,255,255,0.13)}
.lgr-tog{padding:5px 12px;border:1px solid rgba(255,255,255,0.08);background:none;color:rgba(255,255,255,0.35);font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;font-family:inherit;transition:all .12s}
.lgr-tog:hover{border-color:rgba(255,255,255,0.22);color:#fff}
.lgr-tog.on{border-color:rgba(74,222,128,0.35);color:#4ADE80;background:rgba(74,222,128,0.05)}
.lgr-volver{display:flex;align-items:center;gap:6px;padding:5px 14px;border:1px solid rgba(255,255,255,0.14);background:none;color:rgba(255,255,255,0.6);font-family:inherit;font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;cursor:pointer;transition:all .12s;margin-left:auto}
.lgr-volver:hover{border-color:rgba(255,255,255,0.35);color:#fff}
#lgr-body{display:grid;grid-template-columns:1fr 280px;flex:1;overflow:hidden;min-height:0}
#lgr-scroll{overflow-y:auto;overflow-x:hidden;padding:14px 16px 24px}
#lgr-scroll::-webkit-scrollbar{width:4px}
#lgr-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15)}
#lgr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:8px}
.lgr-card{position:relative;display:flex;flex-direction:column;align-items:center;background:rgba(14,14,22,0.92);border:1px solid rgba(255,255,255,0.08);cursor:pointer;overflow:hidden;transition:transform .18s cubic-bezier(.34,1.56,.64,1),border-color .15s,box-shadow .15s;user-select:none}
.lgr-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--lgr-c,rgba(255,255,255,0.2));box-shadow:0 0 10px var(--lgr-c,rgba(255,255,255,0.2));opacity:.65;transition:opacity .15s}
.lgr-card::after{content:'';position:absolute;bottom:0;right:0;width:8px;height:8px;border-bottom:2px solid var(--lgr-c,rgba(255,255,255,0.2));border-right:2px solid var(--lgr-c,rgba(255,255,255,0.2));opacity:.5}
.lgr-card:hover{transform:translateY(-5px) scale(1.025);border-color:rgba(255,255,255,0.22);box-shadow:0 8px 28px rgba(0,0,0,0.55),0 0 0 1px rgba(255,255,255,0.14)}
.lgr-card:hover::before{opacity:1}
.lgr-card.done{border-color:rgba(255,255,255,0.14);background:rgba(10,18,12,0.90)}
.lgr-card.done::before{opacity:1;box-shadow:0 0 14px var(--lgr-c)}
.lgr-card:active{transform:scale(.98)}
.lgr-ico-wrap{width:100%;padding:20px 12px 14px;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.22);position:relative}
.lgr-ico{font-size:38px;line-height:1;transition:filter .18s,transform .18s}
.lgr-card:not(.done) .lgr-ico{filter:grayscale(50%) brightness(.45);opacity:.55}
.lgr-card:hover .lgr-ico,.lgr-card.done .lgr-ico{filter:drop-shadow(0 0 12px var(--lgr-c)) none;opacity:1;transform:scale(1.1)}
.lgr-lock{position:absolute;top:6px;right:8px;font-size:10px;color:rgba(255,255,255,0.18)}
.lgr-card.done .lgr-lock{display:none}
.lgr-done-ico{position:absolute;top:6px;left:8px;font-size:11px;color:#4ADE80;filter:drop-shadow(0 0 4px rgba(74,222,128,0.6));display:none}
.lgr-card.done .lgr-done-ico{display:block}
.lgr-info{width:100%;padding:10px 10px 14px;display:flex;flex-direction:column;gap:5px}
.lgr-nombre{font-size:11px;font-weight:700;color:rgba(255,255,255,0.8);text-align:center;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.lgr-card.done .lgr-nombre{color:#fff}
.lgr-monto{text-align:center;font-size:14px;font-weight:800;font-variant-numeric:tabular-nums;letter-spacing:-.01em;color:rgba(255,255,255,0.35)}
.lgr-card.done .lgr-monto{color:var(--lgr-c);text-shadow:0 0 8px var(--lgr-c)}
.lgr-cat{display:flex;align-items:center;justify-content:center;padding:2px 8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,0.32);align-self:center}
.lgr-proy{text-align:center;font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:2px 8px;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.25);color:#fbbf24;align-self:center}
.lgr-desc{font-size:9px;color:rgba(255,255,255,0.25);text-align:center;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.lgr-prog{display:flex;align-items:center;gap:5px;padding:0 2px}
.lgr-prog-bar{flex:1;height:2px;background:rgba(255,255,255,0.06);overflow:hidden}
.lgr-prog-fill{height:100%;transition:width .6s ease}
.lgr-prog-txt{font-size:9px;font-weight:700;color:rgba(255,255,255,0.22);flex-shrink:0}
.lgr-card.done .lgr-prog-txt{color:var(--lgr-c)}
.lgr-fecha{font-size:8px;color:rgba(255,255,255,0.2);text-align:center;letter-spacing:.03em}
.lgr-card.done .lgr-fecha{color:rgba(255,255,255,0.35)}
#lgr-sb{overflow-y:auto;overflow-x:hidden;border-left:1px solid rgba(255,255,255,0.07);background:rgba(1,3,10,0.97);display:flex;flex-direction:column}
#lgr-sb::-webkit-scrollbar{width:3px}
#lgr-sb::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12)}
.lgr-sb-sec{border-bottom:1px solid rgba(255,255,255,0.06);flex-shrink:0}
.lgr-sb-title{padding:9px 14px 7px;font-size:8px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);display:flex;align-items:center;justify-content:space-between;gap:8px}
.lgr-comp-item{display:flex;flex-direction:column;gap:2px;padding:8px 14px;border-bottom:1px solid rgba(255,255,255,0.04);transition:background .12s}
.lgr-comp-item:hover{background:rgba(255,255,255,0.02)}
.lgr-comp-nombre{font-size:11px;font-weight:700;color:rgba(255,255,255,0.8);line-height:1.3}
.lgr-comp-meta{display:flex;justify-content:space-between;align-items:center}
.lgr-comp-monto{font-size:11px;font-weight:800;color:#4ADE80;font-variant-numeric:tabular-nums}
.lgr-comp-fecha{font-size:9px;color:rgba(255,255,255,0.28)}
.lgr-comp-empty{padding:12px 14px;font-size:10px;color:rgba(255,255,255,0.2);letter-spacing:.06em;text-align:center}
.lgr-nav{display:flex;gap:3px}
.lgr-nav-btn{width:20px;height:20px;border:1px solid rgba(255,255,255,0.12);background:none;color:rgba(255,255,255,0.4);cursor:pointer;font-size:10px;display:flex;align-items:center;justify-content:center;transition:all .12s}
.lgr-nav-btn:hover{border-color:rgba(255,255,255,0.3);color:#fff}
.lgr-cat-row{display:flex;align-items:center;gap:8px;padding:6px 14px;cursor:pointer;transition:background .12s}
.lgr-cat-row:hover{background:rgba(255,255,255,0.025)}
.lgr-cat-row.on{background:rgba(255,255,255,0.04)}
.lgr-cat-ico{font-size:12px;width:16px;text-align:center;flex-shrink:0}
.lgr-cat-nom{flex:1;font-size:10px;font-weight:700;color:rgba(255,255,255,0.5);letter-spacing:.03em}
.lgr-cat-row.on .lgr-cat-nom{color:#fff}
.lgr-cat-pbw{width:44px;height:2px;background:rgba(255,255,255,0.06);flex-shrink:0;overflow:hidden}
.lgr-cat-pf{height:100%}
.lgr-cat-fr{font-size:9px;font-weight:700;color:rgba(255,255,255,0.28);min-width:22px;text-align:right}
.lgr-rec-wrap{padding:12px 14px 16px;display:flex;flex-direction:column;gap:8px}
.lgr-rec-sub{font-size:9px;color:rgba(255,255,255,0.3);letter-spacing:.05em}
.lgr-rec-chips{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.lgr-rec-bar-w{height:3px;background:rgba(251,191,36,0.10);overflow:hidden}
.lgr-rec-bar{height:100%;background:linear-gradient(90deg,rgba(251,191,36,0.5),#fbbf24);transition:width .8s ease;box-shadow:0 0 6px rgba(251,191,36,0.4)}
#lgr-tip{display:flex;align-items:center;gap:8px;padding:7px 16px;background:rgba(1,3,10,0.98);border-top:1px solid rgba(255,255,255,0.07);font-size:10px;color:rgba(255,255,255,0.35);flex-shrink:0}
.lgr-tip-badge{padding:2px 7px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);color:rgba(255,255,255,0.6);font-size:8px;font-weight:800;letter-spacing:.12em;flex-shrink:0}
@media(max-width:899px){#lgr-body{grid-template-columns:1fr}#lgr-sb{display:none}#lgr-grid{grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:6px}}
`;
  document.head.appendChild(s);
})();

var _lgr={
  items:[],orden:'az',mostrarDone:true,
  filProy:'',filGrupo:'',filCat:'',
  nivel:1,xpActual:0,xpMax:500,
  pagComp:0,perPag:5,tipIdx:0,
  tips:['Completa logros para ganar XP y subir de nivel.','Los logros activos tienen proyecto asignado.','Filtra por categoría para enfocarte en un área.','Los montos muestran el valor de cada logro.'],
};

var _LGR_CAT={
  'Accesorios':{ico:'⌚',c:'#c4b5fd'},'Audio':{ico:'🎧',c:'#a5b4fc'},'Baño':{ico:'🚿',c:'#67e8f9'},
  'Computación':{ico:'💻',c:'#22d3ee'},'Consumible':{ico:'🧴',c:'#86efac'},'Ejercicio':{ico:'🏋️',c:'#fb923c'},
  'Hogar':{ico:'🏠',c:'#fbbf24'},'Ropa':{ico:'👕',c:'#f0abfc'},'Salud':{ico:'❤️',c:'#f87171'},
  'Educación':{ico:'📚',c:'#60a5fa'},'Tecnología':{ico:'⚡',c:'#38bdf8'},'Personal':{ico:'✨',c:'#e879f9'},
  'Entretenimiento':{ico:'🎮',c:'#f59e0b'},'Misceláneos':{ico:'📦',c:'#94a3b8'},
};
function _lgrCI(cat){return _LGR_CAT[cat]||{ico:'🎯',c:'rgba(255,255,255,0.45)'};}
function _lgrIsDone(l){var v=String(l.completado||'').trim();return v==='Sí'||v==='Si'||v==='sí'||v==='si'||v===true;}
function _lgrFmt(v){if(v===null||v===undefined||v==='')return '';var n=parseFloat(String(v).replace(/[^0-9.\-]/g,''));return isNaN(n)?'':'$ '+n.toLocaleString('es-MX',{minimumFractionDigits:0,maximumFractionDigits:0});}
function _lgrCatDe(l){return l.categoria||l.concepto||'Misceláneos';}
function _lgrXP(items){var done=(items||[]).filter(_lgrIsDone).length;var xpTotal=done*50,nivel=1,acc=0;while(acc+nivel*500<=xpTotal){acc+=nivel*500;nivel++;}_lgr.nivel=nivel;_lgr.xpActual=xpTotal-acc;_lgr.xpMax=nivel*500;}
function _esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

function renderLogros(data){
  _lgr.items=(data&&data.items)?data.items:(Array.isArray(data)?data:[]);
  window._logrosData={items:_lgr.items};
  _lgrXP(_lgr.items);
  _lgrShell();_lgrHeader();_lgrFiltros();_lgrGrid();_lgrSidebar();_lgrTip();
}

function _lgrShell(){
  var b=document.getElementById('board-logros');
  if(!b)return;
  b.innerHTML='<div id="lgr-hdr"></div><div id="lgr-filtros"></div><div id="lgr-body"><div id="lgr-scroll"><div id="lgr-grid"></div></div><div id="lgr-sb"></div></div><div id="lgr-tip"><span class="lgr-tip-badge">TIP</span><span id="lgr-tip-txt"></span></div>';
}

function _lgrHeader(){
  var h=document.getElementById('lgr-hdr');if(!h)return;
  var total=_lgr.items.length,done=_lgr.items.filter(_lgrIsDone).length,pct=total>0?Math.round(done/total*100):0;
  h.innerHTML='<div id="lgr-badge"><div id="lgr-nivel-n">'+_lgr.nivel+'</div><div id="lgr-nivel-l">Nivel</div></div>'+
    '<div id="lgr-info"><div id="lgr-titulo">Logros</div><div id="lgr-subtitulo">'+done+' completados &middot; '+(total-done)+' pendientes</div></div>'+
    '<div id="lgr-xp-wrap"><div id="lgr-xp-lbl">Progreso general</div><div id="lgr-xp-bar"><div id="lgr-xp-fill" style="width:'+pct+'%"></div></div><div id="lgr-xp-txt"><span id="lgr-xp-frac">'+done+' / '+total+'</span><span>'+pct+'%</span></div></div>'+
    '<div id="lgr-prox">Próxima recompensa:&nbsp;<span class="lgr-chip xp"><i class="fas fa-bolt" style="font-size:9px"></i> +500 XP</span><span class="lgr-chip cash"><i class="fas fa-dollar-sign" style="font-size:9px"></i> +$250</span></div>';
}

function _lgrFiltros(){
  var f=document.getElementById('lgr-filtros');if(!f)return;
  var proyectos=[...new Set(_lgr.items.map(function(l){return l.proyecto||'';}).filter(Boolean))].sort();
  var contactos=[...new Set(_lgr.items.map(function(l){return l.contacto||'';}).filter(Boolean))].sort();
  var optsProy='<option value="">Proyecto</option>'+proyectos.map(function(p){return'<option value="'+_esc(p)+'">'+_esc(p)+'</option>';}).join('');
  var optsGrp='<option value="">Contacto</option>'+contactos.map(function(c){return'<option value="'+_esc(c)+'">'+_esc(c)+'</option>';}).join('');
  f.innerHTML=
    '<select class="lgr-sel" id="lgr-sel-proy" onchange="_lgrApplyFil()">'+optsProy+'</select>'+
    '<select class="lgr-sel" id="lgr-sel-grp"  onchange="_lgrApplyFil()">'+optsGrp+'</select>'+
    '<div class="lgr-grp"><button class="lgr-pill on" id="lgr-ord-az"   onclick="_lgrOrden(\'az\',this)">A\u2013Z</button><button class="lgr-pill" id="lgr-ord-desc" onclick="_lgrOrden(\'desc\',this)">$ \u2193</button><button class="lgr-pill" id="lgr-ord-asc" onclick="_lgrOrden(\'asc\',this)">$ \u2191</button></div>'+
    '<button class="lgr-tog on" id="lgr-tog-done" onclick="_lgrTogDone(this)"><i class="fas fa-check" style="font-size:9px"></i> Completados</button>'+
    '<button class="lgr-volver" onclick="volverAlAnverso()"><i class="fas fa-chevron-left" style="font-size:9px"></i> Volver</button>';
  var ps=document.getElementById('lgr-sel-proy'),gs=document.getElementById('lgr-sel-grp');
  if(ps)ps.value=_lgr.filProy;if(gs)gs.value=_lgr.filGrupo;
  if(!_lgr.mostrarDone){var td=document.getElementById('lgr-tog-done');if(td)td.classList.remove('on');}
}

function _lgrOrden(o,btn){
  _lgr.orden=o;
  document.querySelectorAll('#lgr-filtros .lgr-grp .lgr-pill').forEach(function(b){b.classList.remove('on');});
  if(btn)btn.classList.add('on');
  _lgrGrid();
}
function _lgrTogDone(btn){
  _lgr.mostrarDone=!_lgr.mostrarDone;
  if(btn)btn.classList.toggle('on',_lgr.mostrarDone);
  _lgrGrid();
}
function _lgrApplyFil(){
  var ps=document.getElementById('lgr-sel-proy'),gs=document.getElementById('lgr-sel-grp');
  _lgr.filProy=(ps&&ps.value)||'';_lgr.filGrupo=(gs&&gs.value)||'';
  _lgrGrid();_lgrSidebar();
}

/* Aliases compatibilidad */
function setOrdenLogros(o){var m={az:'az','monto-desc':'desc','monto':'asc'};_lgrOrden(m[o]||o,document.getElementById('lgr-ord-'+(m[o]||o)));}
function toggleReversoMostrarDone(){_lgrTogDone(document.getElementById('lgr-tog-done'));}
function pintarReverso(){_lgrApplyFil();}
function resetReverso(){_lgr.filProy='';_lgr.filGrupo='';_lgr.filCat='';_lgr.mostrarDone=true;_lgr.orden='az';_lgrFiltros();_lgrGrid();_lgrSidebar();}

function _lgrGrid(){
  var g=document.getElementById('lgr-grid');if(!g)return;
  var items=_lgr.items.slice();
  if(_lgr.filProy)  items=items.filter(function(l){return l.proyecto===_lgr.filProy;});
  if(_lgr.filGrupo) items=items.filter(function(l){return l.contacto===_lgr.filGrupo;});
  if(_lgr.filCat)   items=items.filter(function(l){return _lgrCatDe(l)===_lgr.filCat;});
  if(!_lgr.mostrarDone) items=items.filter(function(l){return !_lgrIsDone(l);});
  items.sort(function(a,b){
    if(_lgr.orden==='az')return String(a.nombre||a.concepto||'').localeCompare(String(b.nombre||b.concepto||''),'es');
    var ma=parseFloat(String(a.ie||'0').replace(/[^0-9.\-]/g,''))||0;
    var mb=parseFloat(String(b.ie||'0').replace(/[^0-9.\-]/g,''))||0;
    return _lgr.orden==='desc'?mb-ma:ma-mb;
  });
  if(!items.length){g.innerHTML='<div style="grid-column:1/-1;padding:48px;text-align:center;color:rgba(255,255,255,0.2);font-size:12px;letter-spacing:.10em;font-weight:700">SIN RESULTADOS</div>';return;}
  g.innerHTML='';
  items.forEach(function(l){
    var done=_lgrIsDone(l);
    var cat=_lgrCatDe(l);
    var ci=_lgrCI(cat);
    var nombre=l.nombre||l.concepto||l.descripcion||'\u2014';
    var monto=_lgrFmt(l.ie);
    var desc=l.descripcion&&l.descripcion!==nombre?l.descripcion:'';
    var proy=l.proyecto||'';
    var fecha=l.fecha||'';
    var card=document.createElement('div');
    card.className='lgr-card'+(done?' done':'');
    card.style.setProperty('--lgr-c',ci.c);
    card.innerHTML=
      '<div class="lgr-ico-wrap">'+
        '<span class="lgr-lock"><i class="fas fa-lock"></i></span>'+
        '<span class="lgr-done-ico"><i class="fas fa-check-circle"></i></span>'+
        '<div class="lgr-ico">'+ci.ico+'</div>'+
      '</div>'+
      '<div class="lgr-info">'+
        '<div class="lgr-nombre">'+_esc(nombre)+'</div>'+
        (monto?'<div class="lgr-monto">'+_esc(monto)+'</div>':'')+
        '<div class="lgr-cat">'+_esc(cat)+'</div>'+
        (proy&&!done?'<div class="lgr-proy">'+_esc(proy)+'</div>':'')+
        (desc?'<div class="lgr-desc">'+_esc(desc)+'</div>':'')+
        '<div class="lgr-prog"><div class="lgr-prog-bar"><div class="lgr-prog-fill" style="width:'+(done?100:0)+'%;background:'+ci.c+';box-shadow:0 0 4px '+ci.c+'"></div></div><div class="lgr-prog-txt">'+(done?'1':'0')+'/1</div></div>'+
        (done&&fecha?'<div class="lgr-fecha">'+_esc(fecha)+'</div>':'')+
      '</div>';
    g.appendChild(card);
  });
}

function _lgrSidebar(){
  var sb=document.getElementById('lgr-sb');if(!sb)return;sb.innerHTML='';
  /* Completados */
  var done=_lgr.items.filter(_lgrIsDone);
  var totalPags=Math.max(1,Math.ceil(done.length/_lgr.perPag));
  _lgr.pagComp=Math.min(_lgr.pagComp,totalPags-1);
  var pag=done.slice(_lgr.pagComp*_lgr.perPag,(_lgr.pagComp+1)*_lgr.perPag);
  var secC=document.createElement('div');secC.className='lgr-sb-sec';
  var nav=totalPags>1?'<div class="lgr-nav"><button class="lgr-nav-btn" onclick="_lgrPagPrev()">\u2039</button><button class="lgr-nav-btn" onclick="_lgrPagNext()">\u203a</button></div>':'';
  secC.innerHTML='<div class="lgr-sb-title"><span><i class="fas fa-trophy" style="color:#fbbf24"></i> &nbsp;Completados ('+done.length+')</span>'+nav+'</div>';
  if(!pag.length){secC.innerHTML+='<div class="lgr-comp-empty">Ninguno completado aún</div>';}
  else pag.forEach(function(l){
    var d=document.createElement('div');d.className='lgr-comp-item';
    d.innerHTML='<div class="lgr-comp-nombre">'+_esc(l.nombre||l.concepto||'\u2014')+'</div>'+
      '<div class="lgr-comp-meta">'+(l.ie?'<div class="lgr-comp-monto">'+_esc(_lgrFmt(l.ie))+'</div>':'')+(l.fecha?'<div class="lgr-comp-fecha">'+_esc(l.fecha)+'</div>':'')+'</div>';
    secC.appendChild(d);
  });
  sb.appendChild(secC);
  /* Categorías */
  var secCat=document.createElement('div');secCat.className='lgr-sb-sec';
  secCat.innerHTML='<div class="lgr-sb-title"><i class="fas fa-layer-group"></i> &nbsp;Categor\xedas</div>';
  var cats=[...new Set(_lgr.items.map(function(l){return _lgrCatDe(l);}).filter(Boolean))].sort();
  cats.forEach(function(cat){
    var todos=_lgr.items.filter(function(l){return _lgrCatDe(l)===cat;});
    var hechos=todos.filter(_lgrIsDone).length;
    var ci=_lgrCI(cat);var pct=todos.length>0?Math.round(hechos/todos.length*100):0;
    var isOn=_lgr.filCat===cat;
    var row=document.createElement('div');row.className='lgr-cat-row'+(isOn?' on':'');
    row.innerHTML='<span class="lgr-cat-ico">'+ci.ico+'</span><span class="lgr-cat-nom">'+_esc(cat)+'</span><div class="lgr-cat-pbw"><div class="lgr-cat-pf" style="width:'+pct+'%;background:'+ci.c+';box-shadow:0 0 4px '+ci.c+'"></div></div><span class="lgr-cat-fr">'+hechos+'/'+todos.length+'</span>';
    row.addEventListener('click',function(){_lgr.filCat=isOn?'':cat;_lgrGrid();_lgrSidebar();});
    secCat.appendChild(row);
  });
  sb.appendChild(secCat);
  /* Recompensa */
  var xpPct=_lgr.xpMax>0?Math.round(_lgr.xpActual/_lgr.xpMax*100):0;
  var secR=document.createElement('div');secR.className='lgr-sb-sec';
  secR.innerHTML='<div class="lgr-sb-title"><i class="fas fa-gift"></i> &nbsp;Recompensa por nivel</div><div class="lgr-rec-wrap"><div class="lgr-rec-sub">Nivel '+(_lgr.nivel+1)+' \xb7 '+_lgr.xpActual+' / '+_lgr.xpMax+' XP</div><div class="lgr-rec-chips"><span class="lgr-chip xp"><i class="fas fa-bolt" style="font-size:9px"></i> +500 XP</span><span class="lgr-chip cash"><i class="fas fa-dollar-sign" style="font-size:9px"></i> +$250</span></div><div class="lgr-rec-bar-w"><div class="lgr-rec-bar" style="width:'+xpPct+'%"></div></div></div>';
  sb.appendChild(secR);
}

function _lgrTip(){var el=document.getElementById('lgr-tip-txt');if(el)el.textContent=_lgr.tips[_lgr.tipIdx%_lgr.tips.length];}
function _lgrPagPrev(){_lgr.pagComp=Math.max(0,_lgr.pagComp-1);_lgrSidebar();}
function _lgrPagNext(){var d=_lgr.items.filter(_lgrIsDone).length;var mx=Math.max(0,Math.ceil(d/_lgr.perPag)-1);_lgr.pagComp=Math.min(mx,_lgr.pagComp+1);_lgrSidebar();}

function irALogros(){
  if(typeof _syncMobTab==='function')_syncMobTab('logros');
  document.querySelectorAll('.board-face').forEach(function(f){f.classList.remove('active');});
  var b=document.getElementById('board-logros');
  if(b){b.classList.add('active');b.scrollTop=0;}
  if(!_lgr.items.length&&window._logrosData)renderLogros(window._logrosData);
}
