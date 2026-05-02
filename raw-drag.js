/* RAW Entry — Drag & Drop v.5.044 */
// ══════════════════════════════════════════
//  DRAG & DROP — Módulos del anverso
//  Solo desktop (≥900px)
// ══════════════════════════════════════════

(function(){
  var STORAGE_KEY = 'lifeos_layout_v1';
  var _dragSec = null;
  var _dragCol = null;

  // Guardar layout actual
  function saveLayout(){
    var layout = {};
    ['col1-wrap','col-1','col-3','col-4'].forEach(function(colId){
      var col = document.getElementById(colId);
      if(!col) return;
      layout[colId] = Array.from(col.querySelectorAll('.section')).map(function(s){ return s.id; });
    });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(layout)); } catch(e){}
  }

  // Restaurar layout guardado — NUNCA borrar, siempre respetar lo que el usuario guardó
  function restoreLayout(){
    var raw;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch(e){}
    if(!raw) return;
    var layout;
    try { layout = JSON.parse(raw); } catch(e){ return; }

    // Solo mover secciones que existen en el DOM — sin validar ni resetear
    Object.keys(layout).forEach(function(colId){
      var col = document.getElementById(colId);
      if(!col) return;
      layout[colId].forEach(function(secId){
        var sec = document.getElementById(secId);
        if(sec) col.appendChild(sec);
      });
    });
  }

  // Crear handle de drag en el header de cada sección
  function addHandle(sec){
    var hdr = sec.querySelector('.sec-hdr');
    if(!hdr || hdr.querySelector('.drag-handle')) return;

    var handle = document.createElement('div');
    handle.className = 'drag-handle';
    handle.innerHTML = '<i class="fas fa-grip-vertical"></i>';
    handle.title = 'Arrastrar módulo';
    hdr.insertBefore(handle, hdr.firstChild);

    // Drag events en el handle
    handle.addEventListener('mousedown', function(e){
      e.stopPropagation();
    });

    sec.setAttribute('draggable', 'true');

    sec.addEventListener('dragstart', function(e){
      _dragSec = sec;
      _dragCol = sec.parentElement;
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(function(){ sec.classList.add('dragging'); }, 0);
    });

    sec.addEventListener('dragend', function(){
      sec.classList.remove('dragging');
      document.querySelectorAll('.drop-indicator').forEach(function(el){ el.remove(); });
      document.querySelectorAll('.col-drop-over').forEach(function(el){ el.classList.remove('col-drop-over'); });
      _dragSec = null;
      _dragCol = null;
      saveLayout();
      updateEmptyColumns();
    });
  }

  // Mantener columnas vacías con altura mínima para poder hacer drop
  function updateEmptyColumns(){
    ['col1-wrap','col-1','col-3','col-4'].forEach(function(colId){
      var col = document.getElementById(colId);
      if(!col) return;
      var hasSections = col.querySelectorAll('.section').length > 0;
      col.classList.toggle('col-empty', !hasSections);
    });
  }

  // Drop zones en columnas
  function initColumns(){
    ['col1-wrap','col-1','col-3','col-4'].forEach(function(colId){
      var col = document.getElementById(colId);
      if(!col) return;

      col.addEventListener('dragover', function(e){
        if(!_dragSec) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        col.classList.add('col-drop-over');

        // Indicador de posición
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

  // Init — esperar a que el DOM cargue los módulos
  function init(){
    if(window.innerWidth < 900) return;
    document.querySelectorAll('#mob-sections .section').forEach(addHandle);
    initColumns();
    restoreLayout();
    updateEmptyColumns();
  }

  // Llamar init cuando la app termina de cargar
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      setTimeout(init, 500);
    });
  } else {
    setTimeout(init, 500);
  }

  // Exponer para re-init si se agregan módulos dinámicamente
  window._initDragDrop = init;
})();
