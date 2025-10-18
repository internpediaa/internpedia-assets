const inputHTML = document.getElementById("inputHTML"), outputHTML = document.getElementById("outputHTML"), minifyBtn = document.getElementById("minifyBtn"), copyBtn = document.getElementById("copyBtn"), clearBtn = document.getElementById("clearBtn"), sampleBtn = document.getElementById("sampleBtn"), inputCount = document.getElementById("inputCount"), outputCount = document.getElementById("outputCount"), savings = document.getElementById("savings"), successMessage = document.getElementById("successMessage"), toast = document.getElementById("toast"), toastMessage = document.getElementById("toastMessage"), sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Page</title>
    <style>
        /* Basic styling */
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
    </style>
</head>
<body>
    <!-- Header Section -->
    <header class="header">
        <div class="container">
            <h1>Welcome to Our Website</h1>
            <nav>
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>
    
    <!-- Main Content -->
    <main class="container">
        <section>
            <h2>About Us</h2>
            <p>This is a sample HTML page for demonstration purposes.</p>
        </section>
    </main>
    
    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2024 Sample Website. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`; function minifyHTML(t) { return (t = (t = (t = (t = (t = (t = (t = t.replace(/<!--[\s\S]*?-->/g, "")).replace(/\s+/g, " ")).replace(/>\s+</g, "><")).replace(/\s+/g, " ")).trim())).replace(/\s+/g, " ")).trim() } function showToast(t, e = "success") { toastMessage.textContent = t, "error" === e ? (toast.classList.add("bg-red-500"), toast.classList.remove("bg-green")) : (toast.classList.add("bg-green"), toast.classList.remove("bg-red-500")), toast.classList.remove("hidden"), toast.classList.remove("translate-y-16"), toast.classList.add("translate-y-0"), setTimeout((() => { toast.classList.remove("translate-y-0"), toast.classList.add("translate-y-16"), setTimeout((() => { toast.classList.add("hidden") }), 300) }), 3e3) } inputHTML.addEventListener("input", (() => { const t = inputHTML.value.length; inputCount.textContent = `${t} characters` })), clearBtn.addEventListener("click", (() => { inputHTML.value = "", outputHTML.value = "", inputCount.textContent = "0 characters", outputCount.textContent = "0 characters", savings.classList.add("hidden"), successMessage.classList.add("hidden") })), sampleBtn.addEventListener("click", (() => { inputHTML.value = sampleHTML; const t = inputHTML.value.length; inputCount.textContent = `${t} characters` })), minifyBtn.addEventListener("click", (() => { const t = inputHTML.value.trim(); if (!t) return void showToast("Please enter HTML code to minify!", "error"); const e = minifyHTML(t); outputHTML.value = e; const n = t.length, s = e.length, a = n - s, o = (a / n * 100).toFixed(1); inputCount.textContent = `${n} characters`, outputCount.textContent = `${s} characters`, a > 0 ? (savings.textContent = `(${o}%) Saved`, savings.classList.remove("hidden")) : savings.classList.add("hidden"), successMessage.classList.remove("hidden"), showToast("HTML minified successfully!") })), copyBtn.addEventListener("click", (() => { outputHTML.value ? (outputHTML.select(), document.execCommand("copy"), showToast("Copied to clipboard!")) : showToast("No minified HTML to copy!", "error") })), inputCount.textContent = "0 characters", outputCount.textContent = "0 characters";
