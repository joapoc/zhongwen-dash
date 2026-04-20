// Widget layout: per-tab hidden list + drag reorder, persisted in localStorage.
// Idempotent — safe to call multiple times; handles widgets added dynamically
// (e.g. topic-widgets.js, initHandwritingZone, initWordsZone) via MutationObserver.

(function () {
  var STORAGE_KEY = 'zw.widgetLayout.v1';
  var SEEN_ATTR = 'data-layout-wired';

  function readState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }

  function writeState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {
      /* quota/disabled — best-effort */
    }
    queueServerSync(state);
  }

  // Debounced mirror to the server. Upsert-per-tab on the backend means a
  // flurry of rapid writes collapses into one request and can't wipe anything
  // not present in the payload.
  var __syncTimer = null;
  function queueServerSync(state) {
    clearTimeout(__syncTimer);
    __syncTimer = setTimeout(function () {
      fetch('/api/layout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layouts: state || {} }),
        keepalive: true,
      }).catch(function () {
        /* Offline / server down — we already have localStorage as a failsafe. */
      });
    }, 300);
  }

  function hydrateFromServer() {
    return fetch('/api/layout')
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (data) {
        if (!data || !data.ok || !data.layouts) return false;
        var serverTabs = Object.keys(data.layouts);
        if (!serverTabs.length) return false;
        var local = readState();
        var merged = {};
        // Server wins when it has an entry; any tab only in localStorage is kept.
        Object.keys(local).forEach(function (t) {
          merged[t] = local[t];
        });
        serverTabs.forEach(function (t) {
          merged[t] = data.layouts[t];
        });
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch (_) {}
        return true;
      })
      .catch(function () {
        return false;
      });
  }

  function tabIdFor(container) {
    var tab = container.closest('.tab-content');
    return tab ? tab.id : 'global';
  }

  // Slugify a title into a reasonably stable id fragment.
  function slug(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40);
  }

  function widgetTitle(widget) {
    var titleEl = widget.querySelector('.widget-title');
    var text = titleEl ? titleEl.textContent.trim() : widget.getAttribute('data-keywords') || '';
    return text;
  }

  // Assign stable ids to all widgets in a container. Id = titleSlug, deduped
  // by suffix when multiple widgets share a title.
  function ensureWidgetIds(container) {
    var seen = {};
    var widgets = container.querySelectorAll(':scope > .widget');
    widgets.forEach(function (w, idx) {
      if (w.getAttribute('data-widget-id')) return;
      var base = slug(widgetTitle(w)) || 'w' + idx;
      var id = base;
      var n = 2;
      while (seen[id]) id = base + '-' + n++;
      seen[id] = true;
      w.setAttribute('data-widget-id', id);
    });
  }

  function closeButton(onClick) {
    var btn = document.createElement('button');
    btn.className = 'widget-close';
    btn.type = 'button';
    btn.title = 'Hide widget';
    btn.setAttribute('aria-label', 'Hide widget');
    btn.innerHTML = '✕';
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      onClick(e);
    });
    return btn;
  }

  function injectCloseButton(widget, tabId) {
    if (widget.querySelector(':scope > .widget-close')) return;
    widget.appendChild(
      closeButton(function () {
        hideWidget(widget, tabId);
      }),
    );
  }

  function hideWidget(widget, tabId) {
    widget.style.display = 'none';
    var state = readState();
    var entry = (state[tabId] = state[tabId] || { hidden: [], order: [] });
    var id = widget.getAttribute('data-widget-id');
    if (id && entry.hidden.indexOf(id) === -1) entry.hidden.push(id);
    writeState(state);
    refreshRestoreBadge(tabId);
  }

  function showWidget(widget, tabId) {
    widget.style.display = '';
    var state = readState();
    var entry = state[tabId];
    if (!entry) return;
    var id = widget.getAttribute('data-widget-id');
    entry.hidden = (entry.hidden || []).filter(function (h) {
      return h !== id;
    });
    writeState(state);
    refreshRestoreBadge(tabId);
  }

  function applyOrder(container) {
    var tabId = tabIdFor(container);
    var state = readState();
    var order = state[tabId] && state[tabId].order;
    if (!order || !order.length) return;
    order
      .slice()
      .reverse()
      .forEach(function (id) {
        var el = container.querySelector(':scope > .widget[data-widget-id="' + id + '"]');
        if (el) container.insertBefore(el, container.firstChild);
      });
  }

  function applyHidden(container) {
    var tabId = tabIdFor(container);
    var state = readState();
    var hidden = (state[tabId] && state[tabId].hidden) || [];
    hidden.forEach(function (id) {
      var el = container.querySelector(':scope > .widget[data-widget-id="' + id + '"]');
      if (el) el.style.display = 'none';
    });
  }

  function saveOrder(container) {
    var tabId = tabIdFor(container);
    var state = readState();
    var entry = (state[tabId] = state[tabId] || { hidden: [], order: [] });
    entry.order = Array.prototype.map.call(
      container.querySelectorAll(':scope > .widget'),
      function (w) {
        return w.getAttribute('data-widget-id');
      },
    );
    writeState(state);
  }

  function initSortable(container) {
    if (typeof Sortable === 'undefined') return;
    if (container.__sortable) return;
    container.__sortable = Sortable.create(container, {
      handle: '.widget-header',
      draggable: '.widget',
      animation: 180,
      ghostClass: 'widget-drag-ghost',
      chosenClass: 'widget-drag-chosen',
      onEnd: function () {
        saveOrder(container);
      },
    });
  }

  function restoreAllInTab(tabContent) {
    var tabId = tabContent.id;
    var state = readState();
    if (state[tabId]) state[tabId].hidden = [];
    writeState(state);
    tabContent.querySelectorAll('.widget').forEach(function (w) {
      w.style.display = '';
    });
    refreshRestoreBadge(tabId);
  }

  function resetLayoutForTab(tabContent) {
    var tabId = tabContent.id;
    if (!window.confirm('Reset layout for this tab?\n\nShows all hidden widgets and clears your custom order. This cannot be undone.')) {
      return;
    }
    // Drop local state for this tab, then tell the server to forget it too.
    var state = readState();
    if (state[tabId]) {
      delete state[tabId];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
    }
    fetch('/api/layout/' + encodeURIComponent(tabId), { method: 'DELETE', keepalive: true }).catch(function () {});

    // Unhide everything.
    tabContent.querySelectorAll('.widget').forEach(function (w) {
      w.style.display = '';
    });

    // Re-sort containers back to natural DOM order — i.e. the order the
    // widgets were rendered by the app. We do that by sorting them alphabetically
    // by an insertion-index we re-derive from the live DOM… but the simplest
    // approach is: clear any saved order and re-attach children in insertion
    // order, which the browser preserves. Since the widgets were moved by
    // Sortable, we need a reference ordering: use `data-default-order` if set,
    // otherwise snapshot current order as the new default (first reset wins).
    tabContent.querySelectorAll('.grid, #widgets-textclipper').forEach(function (container) {
      if (!container.querySelector(':scope > .widget')) return;
      var widgets = Array.prototype.slice.call(container.querySelectorAll(':scope > .widget'));
      widgets.sort(function (a, b) {
        var aIdx = parseInt(a.getAttribute('data-default-order') || '-1', 10);
        var bIdx = parseInt(b.getAttribute('data-default-order') || '-1', 10);
        return aIdx - bIdx;
      });
      widgets.forEach(function (w) { container.appendChild(w); });
    });

    refreshRestoreBadge(tabId);
  }

  // Capture natural DOM order once per widget so we have something to reset to.
  function stampDefaultOrder(container) {
    var idx = 0;
    container.querySelectorAll(':scope > .widget').forEach(function (w) {
      if (!w.hasAttribute('data-default-order')) {
        w.setAttribute('data-default-order', String(idx));
      }
      idx += 1;
    });
  }

  function ensureRestoreButton(tabContent) {
    var topicShell = tabContent.querySelector(':scope > .topic-shell');
    var target = topicShell || tabContent;
    var bar = target.querySelector(':scope > .widget-layout-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'widget-layout-bar';
      bar.setAttribute('data-for-tab', tabContent.id);
      target.insertBefore(bar, target.firstChild);
    }
    var restore = bar.querySelector('.widget-restore-chip');
    if (!restore) {
      restore = document.createElement('button');
      restore.className = 'widget-restore-chip';
      restore.type = 'button';
      restore.style.display = 'none';
      restore.addEventListener('click', function () { restoreAllInTab(tabContent); });
      bar.appendChild(restore);
    }
    var reset = bar.querySelector('.widget-reset-chip');
    if (!reset) {
      reset = document.createElement('button');
      reset.className = 'widget-reset-chip';
      reset.type = 'button';
      reset.textContent = '⟲ Reset layout';
      reset.title = 'Restore all widgets and default order for this tab';
      reset.addEventListener('click', function () { resetLayoutForTab(tabContent); });
      bar.appendChild(reset);
    }
    return restore;
  }

  function refreshRestoreBadge(tabId) {
    var tab = document.getElementById(tabId);
    if (!tab) return;
    var bar = tab.querySelector(':scope > .topic-shell > .widget-layout-bar, :scope > .widget-layout-bar');
    if (!bar) return;
    var restore = bar.querySelector('.widget-restore-chip');
    var reset = bar.querySelector('.widget-reset-chip');
    var state = readState();
    var entry = state[tabId] || {};
    var hiddenCount = (entry.hidden || []).length;
    if (restore) {
      if (hiddenCount > 0) {
        restore.textContent = '↻ Restore hidden (' + hiddenCount + ')';
        restore.style.display = '';
      } else {
        restore.style.display = 'none';
      }
    }
    // Reset chip: show only when the tab has any saved customization.
    if (reset) {
      var hasCustom = hiddenCount > 0 || ((entry.order || []).length > 0);
      reset.style.display = hasCustom ? '' : 'none';
    }
  }

  // Find all plausible widget containers: .grid inside .tab-content, plus
  // freestanding widget wrappers created dynamically.
  function findContainers(root) {
    var tabs = (root || document).querySelectorAll('.tab-content');
    var containers = [];
    tabs.forEach(function (tab) {
      tab.querySelectorAll('.grid, #widgets-textclipper').forEach(function (c) {
        // Only wire containers that actually hold widgets.
        if (c.querySelector(':scope > .widget')) containers.push(c);
      });
    });
    return containers;
  }

  function wireContainer(container) {
    if (!container) return;
    ensureWidgetIds(container);
    stampDefaultOrder(container);
    applyOrder(container);
    applyHidden(container);
    var tabId = tabIdFor(container);
    container.querySelectorAll(':scope > .widget').forEach(function (w) {
      if (w.getAttribute(SEEN_ATTR)) return;
      w.setAttribute(SEEN_ATTR, '1');
      injectCloseButton(w, tabId);
    });
    initSortable(container);
  }

  // Close-only fallback: widgets that aren't inside a recognized drag container
  // still get an × button so they're hideable, but can't be reordered.
  function wireLooseWidgets(tabContent) {
    var tabId = tabContent.id;
    var state = readState();
    var hidden = (state[tabId] && state[tabId].hidden) || [];
    tabContent.querySelectorAll('.widget').forEach(function (w) {
      if (w.getAttribute(SEEN_ATTR)) return;
      w.setAttribute(SEEN_ATTR, '1');
      if (!w.getAttribute('data-widget-id')) {
        var base = slug(widgetTitle(w)) || 'w-' + Math.random().toString(36).slice(2, 7);
        w.setAttribute('data-widget-id', base);
      }
      injectCloseButton(w, tabId);
      if (hidden.indexOf(w.getAttribute('data-widget-id')) !== -1) {
        w.style.display = 'none';
      }
    });
  }

  function initAll() {
    document.querySelectorAll('.tab-content').forEach(ensureRestoreButton);
    findContainers().forEach(wireContainer);
    document.querySelectorAll('.tab-content').forEach(wireLooseWidgets);
    document.querySelectorAll('.tab-content').forEach(function (tab) {
      refreshRestoreBadge(tab.id);
    });
  }

  // Re-scan when new widgets appear (topic-widgets.js, initHandwritingZone, etc.).
  function observeDynamic() {
    var observer = new MutationObserver(function (mutations) {
      var needsScan = false;
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var n = added[j];
          if (n.nodeType !== 1) continue;
          if (n.classList && n.classList.contains('widget')) {
            needsScan = true;
            break;
          }
          if (n.querySelector && n.querySelector('.widget')) {
            needsScan = true;
            break;
          }
        }
        if (needsScan) break;
      }
      if (needsScan) {
        // Small debounce so a flurry of inserts batches into one pass.
        clearTimeout(observeDynamic._t);
        observeDynamic._t = setTimeout(initAll, 30);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function start() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
      return;
    }
    initAll();
    observeDynamic();

    // Hydrate from server in the background. If server state differs, re-apply
    // to every container so the user sees their saved layout across devices.
    hydrateFromServer().then(function (changed) {
      if (!changed) return;
      findContainers().forEach(function (container) {
        // Wipe existing DOM order signal so applyOrder re-sorts from fresh state.
        container.querySelectorAll(':scope > .widget').forEach(function (w) {
          w.style.display = '';
        });
        applyOrder(container);
        applyHidden(container);
      });
      document.querySelectorAll('.tab-content').forEach(function (tab) {
        refreshRestoreBadge(tab.id);
      });
    });
  }

  start();
})();
