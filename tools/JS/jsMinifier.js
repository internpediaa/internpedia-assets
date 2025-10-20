const inputCSS = document.getElementById("inputCSS"), outputCSS = document.getElementById("outputCSS"), minifyBtn = document.getElementById("minifyBtn"), copyBtn = document.getElementById("copyBtn"), clearBtn = document.getElementById("clearBtn"), sampleBtn = document.getElementById("sampleBtn"), inputCount = document.getElementById("inputCount"), outputCount = document.getElementById("outputCount"), savings = document.getElementById("savings"), successMessage = document.getElementById("successMessage"), toast = document.getElementById("toast"), toastMessage = document.getElementById("toastMessage"), sampleCSS = `// Sample JavaScript for demonstration
function calculateTotal(items) {
    let total = 0;
    
    // Calculate total price
    for (let i = 0; i < items.length; i++) {
        total += items[i].price * items[i].quantity;
    }
    
    // Apply discount if applicable
    if (total > 100) {
        total = total * 0.9; // 10% discount
    }
    
    return total;
}

// Event handler for form submission
document.getElementById('checkoutForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const items = [
        { name: 'Product 1', price: 25.99, quantity: 2 },
        { name: 'Product 2', price: 15.50, quantity: 1 }
    ];
    
    const total = calculateTotal(items);
    document.getElementById('totalAmount').textContent = 'Total: $' + total.toFixed(2);
    
    // Show success message
    alert('Order processed successfully!');
});`; 
function minifyCSS(t) { return (t = (t = (t = (t = (t = (t = (t = (t = t.replace(/\/\*[\s\S]*?\*\//g, "")).replace(/\/\/.*$/gm, "")).replace(/\s*{\s*/g, "{")).replace(/\s*}\s*/g, "}")).replace(/\s*;\s*/g, ";")).replace(/\s*,\s*/g, ",")).replace(/\s+/g, " ")).trim())} function showToast(t, e = "success") { toastMessage.textContent = t, "error" === e ? (toast.classList.add("bg-red-500"), toast.classList.remove("bg-green")) : (toast.classList.add("bg-green"), toast.classList.remove("bg-red-500")), toast.classList.remove("hidden"), toast.classList.remove("translate-y-16"), toast.classList.add("translate-y-0"), setTimeout((() => { toast.classList.remove("translate-y-0"), toast.classList.add("translate-y-16"), setTimeout((() => { toast.classList.add("hidden") }), 300) }), 3000) } inputCSS.addEventListener("input", (() => { const t = inputCSS.value.length; inputCount.textContent = `${t} characters` })), clearBtn.addEventListener("click", (() => { inputCSS.value = "", outputCSS.value = "", inputCount.textContent = "0 characters", outputCount.textContent = "0 characters", savings.classList.add("hidden"), successMessage.classList.add("hidden") })), sampleBtn.addEventListener("click", (() => { inputCSS.value = sampleCSS; const t = inputCSS.value.length; inputCount.textContent = `${t} characters` })), minifyBtn.addEventListener("click", (() => { const t = inputCSS.value.trim(); if (!t) return void showToast("Please enter JavaScript code to minify!", "error"); const e = minifyCSS(t); outputCSS.value = e; const n = t.length, s = e.length, a = n - s, o = (a / n * 100).toFixed(1); inputCount.textContent = `${n} characters`, outputCount.textContent = `${s} characters`, a > 0 ? (savings.textContent = `(${o}%) Saved`, savings.classList.remove("hidden")) : savings.classList.add("hidden"), successMessage.classList.remove("hidden"), showToast("JavaScript minified successfully!") })), copyBtn.addEventListener("click", (() => { outputCSS.value ? (outputCSS.select(), document.execCommand("copy"), showToast("Copied to clipboard!")) : showToast("No minified JavaScript to copy!", "error") })), inputCount.textContent = "0 characters", outputCount.textContent = "0 characters";
