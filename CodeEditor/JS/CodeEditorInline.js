// Prism for syntax highlight rendering
const loadPrism = () => new Promise((res, rej) => {
  const loadScript = (src) => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });

  (async () => {
    try {
      await loadScript('https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-core.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-markup.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-css.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-clike.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-javascript.min.js');
      res();
    } catch (err) {
      rej(err);
    }
  })();
});


    
    
    
    

    function getPreviewDocument() {
      const html = document.getElementById('html').value;
      const css = document.getElementById('css').value;
      const js = document.getElementById('js').value;
      return `<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
    }

    function updatePreview() {
      const previewFrame = document.getElementById('previewFrame');
      previewFrame.srcdoc = getPreviewDocument();
    }

    function renderHighlight(id) {
      const value = document.getElementById(id).value;
      const codeEl = document.getElementById(`hl-${id}`);
      codeEl.textContent = value;
      if (window.Prism) {
        Prism.highlightElement(codeEl);
      }
      // Sync scroll with textarea
      const ta = document.getElementById(id);
      const pre = codeEl.parentElement;
      pre.scrollTop = ta.scrollTop;
      pre.scrollLeft = ta.scrollLeft;
    }

    // Copy helpers
    async function copyCode(id, btn) {
      try {
        const value = document.getElementById(id).value;
        await navigator.clipboard.writeText(value);
        showCopied(btn);
      } catch (e) {
        console.error('Copy failed', e);
      }
    }

    function showCopied(btn) {
      if (!btn) return;
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('success');
      setTimeout(() => { btn.textContent = original; btn.classList.remove('success'); }, 1200);
    }

    // Removed formatters per request

    // Line numbers utilities
    function updateLineNumbers(textareaId, gutterId) {
      const textarea = document.getElementById(textareaId);
      const gutter = document.getElementById(gutterId);
      const lines = textarea.value.split('\n').length;
      let out = '';
      for (let i = 1; i <= lines; i++) out += i + (i < lines ? '\n' : '');
      gutter.textContent = out || '1';
      gutter.scrollTop = textarea.scrollTop;
    }

    function hookEditor(id) {
      const gutterId = `gutter-${id}`;
      const ta = document.getElementById(id);
      const gu = document.getElementById(gutterId);
      const syncScroll = () => { gu.scrollTop = ta.scrollTop; renderHighlight(id); };
      ta.addEventListener('scroll', syncScroll);
      ta.addEventListener('input', () => { updateLineNumbers(id, gutterId); autoRun(); renderHighlight(id); });
      updateLineNumbers(id, gutterId);
      renderHighlight(id);
    }

    // Auto-run on input with debounce
    const debounced = (fn, ms) => {
      let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(null, args), ms); };
    };
    const autoRun = debounced(updatePreview, 500);
    ['html', 'css', 'js'].forEach(hookEditor);

    // Keyboard shortcut: Ctrl/Cmd + Enter
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        updatePreview();
      }
    });

    // Wire up copy/format buttons
    function bindActions() {
      document.querySelectorAll('[data-copy]').forEach(btn => {
        btn.addEventListener('click', () => copyCode(btn.getAttribute('data-copy'), btn));
      });
    }

    // Open preview in new tab
    function openPreviewInNewTab() {
      const newWindow = window.open();
      newWindow.document.write(getPreviewDocument());
      newWindow.document.close();
    }
    
    
   window.addEventListener('DOMContentLoaded', () => {
      loadPrism().then(() => {
        updatePreview();
        bindActions();
        ['html', 'css', 'js'].forEach(renderHighlight);

        // Add click handler for open in new tab button
        document.getElementById('openNewTab').addEventListener('click', openPreviewInNewTab);
      });
    });
