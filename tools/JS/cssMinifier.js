// DOM Elements
    const inputCSS = document.getElementById('inputCSS');
    const outputCSS = document.getElementById('outputCSS');
    const minifyBtn = document.getElementById('minifyBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const sampleBtn = document.getElementById('sampleBtn');
    const inputCount = document.getElementById('inputCount');
    const outputCount = document.getElementById('outputCount');
    const savings = document.getElementById('savings');
    const successMessage = document.getElementById('successMessage');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    // Sample CSS for demonstration
    const sampleCSS = `/* This is a sample CSS for demonstration */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    background-color: #f8f9fa;
    padding: 15px 0;
    border-bottom: 1px solid #e9ecef;
}

.nav-item {
    display: inline-block;
    margin-right: 20px;
}

.btn {
    display: inline-block;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border-radius: 4px;
    text-decoration: none;
    transition: background-color 0.3s;
}

.btn:hover {
    background-color: #0056b3;
}

@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
    
    .nav-item {
        display: block;
        margin-right: 0;
        margin-bottom: 10px;
    }
}`;

    // Update character count for input
    inputCSS.addEventListener('input', () => {
        const count = inputCSS.value.length;
        inputCount.textContent = `${count} characters`;
    });

    // Clear input and output
    clearBtn.addEventListener('click', () => {
        inputCSS.value = '';
        outputCSS.value = '';
        inputCount.textContent = '0 characters';
        outputCount.textContent = '0 characters';
        savings.classList.add('hidden');
        successMessage.classList.add('hidden');
    });

    // Load sample CSS
    sampleBtn.addEventListener('click', () => {
        inputCSS.value = sampleCSS;
        const count = inputCSS.value.length;
        inputCount.textContent = `${count} characters`;
    });

    // Minify CSS function
    function minifyCSS(css) {
        // Remove comments
        css = css.replace(/\/\*[\s\S]*?\*\//g, '');

        // Remove whitespace around braces, colons, and semicolons
        css = css.replace(/\s*{\s*/g, '{');
        css = css.replace(/\s*}\s*/g, '}');
        css = css.replace(/\s*:\s*/g, ':');
        css = css.replace(/\s*;\s*/g, ';');
        css = css.replace(/\s*,\s*/g, ',');

        // Remove line breaks and extra spaces
        css = css.replace(/\s+/g, ' ');

        // Trim the result
        return css.trim();
    }

    // Minify button click handler
    minifyBtn.addEventListener('click', () => {
        const input = inputCSS.value.trim();

        if (!input) {
            showToast('Please enter CSS code to minify!', 'error');
            return;
        }

        const minified = minifyCSS(input);
        outputCSS.value = minified;

        // Update counts
        const inputLength = input.length;
        const outputLength = minified.length;
        const saved = inputLength - outputLength;
        const percentSaved = ((saved / inputLength) * 100).toFixed(1);

        inputCount.textContent = `${inputLength} characters`;
        outputCount.textContent = `${outputLength} characters`;

        if (saved > 0) {
            savings.textContent = `(${percentSaved}%) Saved`;
            savings.classList.remove('hidden');
        } else {
            savings.classList.add('hidden');
        }

        successMessage.classList.remove('hidden');
        showToast('CSS minified successfully!');
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        if (!outputCSS.value) {
            showToast('No minified CSS to copy!', 'error');
            return;
        }

        outputCSS.select();
        document.execCommand('copy');
        showToast('Copied to clipboard!');
    });

    // Toast notification function
    function showToast(message, type = 'success') {
        toastMessage.textContent = message;

        // Set background color based on type
        if (type === 'error') {
          toast.classList.add('bg-red-500');
          toast.classList.remove('bg-green');
          
        } else {
          toast.classList.add('bg-green');
           toast.classList.remove('bg-red-500');
        }

        toast.classList.remove('hidden');
        toast.classList.remove('translate-y-16');
        toast.classList.add('translate-y-0');

        setTimeout(() => {
            toast.classList.remove('translate-y-0');
            toast.classList.add('translate-y-16');

            setTimeout(() => {
                toast.classList.add('hidden');
            }, 300);
        }, 3000);
    }

    // Initialize character count on page load
    inputCount.textContent = '0 characters';
    outputCount.textContent = '0 characters';
