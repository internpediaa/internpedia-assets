// HTML Unescape Tool functionality
    const inputHtml = document.getElementById('inputHtml');
    const outputHtml = document.getElementById('outputHtml');
    const autoUpdateCheckbox = document.getElementById('autoUpdate');
    const unescapeBtn = document.getElementById('escapeBtn'); // reuse same button ID
    const copyInputBtn = document.getElementById('copyInputBtn');
    const copyOutputBtn = document.getElementById('copyOutputBtn');
    const clearInputBtn = document.getElementById('clearInputBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyFeedback = document.getElementById('copyFeedback');

    // Unescape HTML function
    function unescapeHtml(text) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    }

    // Process HTML unescape
    function processUnescape() {
        const input = inputHtml.value;
        const unescapedHtml = unescapeHtml(input);
        outputHtml.value = unescapedHtml;
        autoResize(outputHtml);
    }

    // Auto-update functionality
    inputHtml.addEventListener('input', () => {
        autoResize(inputHtml);
        if (autoUpdateCheckbox.checked) {
            processUnescape();
        }
    });

    // Manual unescape button
    unescapeBtn.addEventListener('click', processUnescape);

    // Copy functionality
    async function copyToClipboard(text, showFeedback = true) {
        try {
            await navigator.clipboard.writeText(text);
            if (showFeedback) showCopyFeedback();
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            if (showFeedback) showCopyFeedback();
        }
    }

    copyInputBtn.addEventListener('click', () => {
        copyToClipboard(inputHtml.value);
    });

    copyOutputBtn.addEventListener('click', () => {
        copyToClipboard(outputHtml.value);
    });

    // Clear input
    clearInputBtn.addEventListener('click', () => {
        inputHtml.value = '';
        if (autoUpdateCheckbox.checked) {
            outputHtml.value = '';
        }
        autoResize(inputHtml);
        autoResize(outputHtml);
        inputHtml.focus();
    });

    // Download functionality
    downloadBtn.addEventListener('click', () => {
        const content = outputHtml.value;
        if (!content.trim()) {
            alert('No content to download');
            return;
        }

        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'unescaped-html.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Show copy feedback
    function showCopyFeedback() {
        copyFeedback.classList.add('show');
        setTimeout(() => {
            copyFeedback.classList.remove('show');
        }, 2000);
    }

    // Auto-resize textareas
    function autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(200, textarea.scrollHeight) + 'px';
    }

    // Initialize auto-resize
    autoResize(inputHtml);
    autoResize(outputHtml);

    // Focus input on page load
    window.addEventListener('load', () => {
        inputHtml.focus();
    });
