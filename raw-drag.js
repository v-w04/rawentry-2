/* RAW Entry — Drag & Drop v.5.045
   Fix: col-empty solo durante drag (body.drag-active)
   Fix: mcol-2 duplicado → mcol-1 correcto
   Fix: restoreLayout valida IDs antes de mover
   Fix: grid-row:1 forzado en columnas al terminar drag
*/
(function(){
  var STORAGE_KEY = 'lifeos_layout_v1';
  var _dragSec = null;
  var _dragCol = null;

  function saveLayout(){
    var layout = {};
    ['col-1','col-2','col-3','col-4'].forEach(function(colId){
      var col = document.getElementById(colId);
      if(!col) return;
      layout[colId] = Array.from(col.querySelectorAll('.section')).map(function(s){ return s.id; });
    });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(layout)); } catch(e){}
  }

  function restoreLayout(){
    var raw;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch(e){}
    if(!raw) return;
    var layout;
    try { layout = JSON.parse(raw); } catch(e){ return; }

    // Solo mover secciones que existen en el DOM y pertenecen a mob-sections
    var validCols = ['col-1','col-2','col-3','col-4'];
    Object.keys(layout).forEach(function(colId){
      if(validCols.indexOf(colId) === -1) return;   // columna desconocida → ignorar
      var col = document.getElementById(colId);
      if(!col) return;
      (layout[colId] || []).forEach(function(secId){
        var sec = document.getElementById(secId);
        // Solo mover si la sección existe y está dentro de #mob-sections
        if(sec && document.getElementById('mob-sections') && document.getElementById('mob-sections').contains(sec)){
          col.appendChild(sec);
        }
      });
    });
  }

  function addHandle(sec){
    var hdr = sec.querySelector('.sec-hdr');
    if(!hdr || hdr.querySelector('.drag-handle')) return;

    var handle = document.createElement('div');
    handle.className = 'drag-handle';
    handle.innerHTML = '<i class="fas fa-grip-vertical"></i>';
    handle.title = 'Arrastrar módulo';
    hdr.insertBefore(handle, hdr.firstChild);

    handle.addEventListener('mousedown', function(e){ e.stopPropagation(); });

    sec.setAttribute('draggable', 'true');

    sec.addEventListener('dragstart', function(e){
      _dragSec = sec;
      _dragCol = sec.parentElement;
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(function(){
        sec.classList.add('dragging');
        document.body.classList.add('drag-active');   // ← activa col-empty en CSS
        updateEmptyColumns();
      }, 0);
    });

    sec.addEventListener('dragend', function(){
      sec.classList.remove('dragging');
      document.body.classList.remove('drag-active');  // ← oculta col-empty
      document.querySelectorAll('.drop-indicator').forEach(function(el){ el.remove(); });
      document.querySelectorAll('.col-drop-over').forEach(function(el){ el.classList.remove('col-drop-over'); });
      _dragSec = null;
      _dragCol = null;
      saveLayout();
      updateEmptyColumns();
    });
  }

  // Solo marca la clase; el CSS la muestra/oculta según body.drag-active
  function updateEmptyColumns(){
    ['col-1','col-2','col-3','col-4'].forEach(function(colId){
      var col = document.getElementById(colId);
      if(!col) return;
      var hasSections = col.querySelectorAll('.section').length > 0;
      col.classList.toggle('col-empty', !hasSections);
    });
  }

  function initColumns(){
    ['col-1','col-2','col-3','col-4'].forEach(function(colId){
      var col = document.getElementById(colId);
      if(!col) return;

      col.addEventListener('dragover', function(e){
        if(!_dragSec) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        col.classList.add('col-drop-over');

        document.querySelectorAll('.drop-indicator').forEach(function(el){ el.remove(); });
        var sections = Array.from(col.querySelectorAll('.section:not(.dragging)'));
        var indicator = document.createElement('div');
        indicator.className = 'drop-indicator';

        var inserted = false;
        for(var i = 0; i < sections.length; i++){
          var rect = sections[i].getBoundingClientRect();
          if(e.clientY < rect.top + rect.height / 2){
            col.insertBefore(indicator, sections[i]);
            inserted = true;
            break;
          }
        }
        if(!inserted) col.appendChild(indicator);
      });

      col.addEventListener('dragleave', function(e){
        if(!col.contains(e.relatedTarget)){
          col.classList.remove('col-drop-over');
          document.querySelectorAll('.drop-indicator').forEach(function(el){ el.remove(); });
        }
      });

      col.addEventListener('drop', function(e){
        e.preventDefault();
        col.classList.remove('col-drop-over');
        if(!_dragSec) return;

        var indicator = col.querySelector('.drop-indicator');
        if(indicator){
          col.insertBefore(_dragSec, indicator);
          indicator.remove();
        } else {
          col.appendChild(_dragSec);
        }
        saveLayout();
      });
    });
  }

  function initMaslowColumns(){
    // FIX: era ['mcol-2','mcol-2','mcol-3','mcol-4','mcol-5'] — mcol-1 faltaba
    var mCols = ['mcol-1','mcol-2','mcol-3','mcol-4','mcol-5'];
    mCols.forEach(function(colId){
      var col = document.getElementById(colId);
      if(!col) return;

      col.addEventListener('dragover', function(e){
        if(!_dragSec) return;
        e.preventDefault();
        col.classList.add('col-drop-over');
        document.querySelectorAll('.drop-indicator').forEach(function(el){ el.remove(); });
        var indicator = document.createElement('div');
        indicator.className = 'drop-indicator';
        var sections = Array.from(col.querySelectorAll('.section:not(.dragging)'));
        var inserted = false;
        for(var i = 0; i < sections.length; i++){
          var r = sections[i].getBoundingClientRect();
          if(e.clientY < r.top + r.height / 2){
            col.insertBefore(indicator, sections[i]);
            inserted = true;
            break;
          }
        }
        if(!inserted) col.appendChild(indicator);
      });

      col.addEventListener('dragleave', function(e){
        if(!col.contains(e.relatedTarget)){
          col.classList.remove('col-drop-over');
          document.querySelectorAll('.drop-indicator').forEach(function(el){ el.remove(); });
        }
      });

      col.addEventListener('drop', function(e){
        e.preventDefault();
        col.classList.remove('col-drop-over');
        if(!_dragSec) return;
        document.querySelectorAll('.drop-indicator').forEach(function(el){ el.remove(); });
        col.appendChild(_dragSec);
      });
    });

    document.querySelectorAll('#maslow-sections .section').forEach(addHandle);
  }

  function saveDefaultLayout(){
    try {
      if(localStorage.getItem(STORAGE_KEY)) return;
      var layout = {};
      ['col-1','col-2','col-3','col-4'].forEach(function(colId){
        var col = document.getElementById(colId);
        if(!col) return;
        layout[colId] = Array.from(col.querySelectorAll('.section')).map(function(s){ return s.id; });
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    } catch(e){}
  }

  function init(){
    if(window.innerWidth < 900) return;
    document.querySelectorAll('#mob-sections .section').forEach(addHandle);
    initColumns();
    restoreLayout();
    updateEmptyColumns();
    saveDefaultLayout();
    initMaslowColumns();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      setTimeout(init, 500);
    });
  } else {
    setTimeout(init, 500);
  }

  window._initDragDrop = init;
})();
