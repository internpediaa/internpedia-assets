// DOM Elements
        const jsonInput = document.getElementById('json-input');
        const jsonOutput = document.getElementById('json-output');
        const jsonMinified = document.getElementById('json-minified');
        const jsonTree = document.getElementById('json-tree');
        const formatBtn = document.getElementById('format-btn');
        const clearBtn = document.getElementById('clear-btn');
        const copyBtn = document.getElementById('copy-btn');
        const validateBtn = document.getElementById('validate-btn');
        const minifyBtn = document.getElementById('minify-btn');
        const uploadBtn = document.getElementById('upload-btn');
        const downloadBtn = document.getElementById('download-btn');
        const sampleBtn = document.getElementById('sample-btn');
        const fileInput = document.getElementById('file-input');
        const errorMessage = document.getElementById('error-message');
        const errorDetails = document.getElementById('error-details');
        const validationSuccess = document.getElementById('validation-success');
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        const stats = document.getElementById('stats');
        const propertyCount = document.getElementById('property-count');
        const objectCount = document.getElementById('object-count');
        const arrayCount = document.getElementById('array-count');
        const sizeElement = document.getElementById('size');
        
        // Tab elements
        const formattedTab = document.getElementById('formatted-tab');
        const treeTab = document.getElementById('tree-tab');
        const minifiedTab = document.getElementById('minified-tab');
        const formattedView = document.getElementById('formatted-view');
        const treeView = document.getElementById('tree-view');
        const minifiedView = document.getElementById('minified-view');
        
        // Current state
        let currentJSON = null;
        let currentView = 'formatted';
        
        // Sample JSON data
        const sampleJSON = {
            "application": "Modern JSON Formatter",
            "version": "2.1.0",
            "description": "A powerful tool for formatting and analyzing JSON data",
            "features": [
                "Syntax Highlighting",
                "Tree View",
                "Validation",
                "Minification",
                "Statistics"
            ],
            "metadata": {
                "created": "2023-06-15",
                "updated": "2023-10-20",
                "author": {
                    "name": "JSON Tools Team InternPedia",
                    "email": "contact@internpedia.in"
                }
            },
            "stats": {
                "users": 15000,
                "rating": 4.8,
                "active": true
            }
        };
        
        // Initialize with sample data
        window.addEventListener('DOMContentLoaded', () => {
            jsonInput.value = JSON.stringify(sampleJSON, null, 2);
        });
        
        // Format JSON function
        function formatJSON() {
            try {
                // Reset UI states
                errorMessage.classList.add('hidden');
                validationSuccess.classList.add('hidden');
                stats.classList.add('hidden');
                
                // Parse and format JSON
                currentJSON = JSON.parse(jsonInput.value);
                const formattedJSON = JSON.stringify(currentJSON, null, 2);
                const minifiedJSON = JSON.stringify(currentJSON);
                
                // Display formatted JSON with syntax highlighting
                jsonOutput.innerHTML = syntaxHighlight(formattedJSON);
                jsonMinified.textContent = minifiedJSON;
                
                // Generate tree view
                generateTreeView(currentJSON, jsonTree);
                
                // Calculate and display stats
                const statsData = calculateStats(currentJSON);
                propertyCount.textContent = statsData.properties;
                objectCount.textContent = statsData.objects;
                arrayCount.textContent = statsData.arrays;
                sizeElement.textContent = formatBytes(new Blob([minifiedJSON]).size);
                stats.classList.remove('hidden');
                
                // Show formatted view by default
                showView('formatted');
               showToast('JSON Formatted!', 'green');
                
            } catch (error) {
                // Show error message
                errorDetails.textContent = error.message;
                errorMessage.classList.remove('hidden');
                jsonOutput.textContent = '';
                jsonMinified.textContent = '';
                jsonTree.innerHTML = '';
                stats.classList.add('hidden');
            }
        }
        
        // Syntax highlighting function
        function syntaxHighlight(json) {
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                let cls = 'json-number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'json-key';
                    } else {
                        cls = 'json-string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'json-boolean';
                } else if (/null/.test(match)) {
                    cls = 'json-null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        }
        
        // Generate tree view
        function generateTreeView(obj, container) {
            container.innerHTML = '';
            if (obj && typeof obj === 'object') {
                buildTree(obj, container, 'root');
            }
        }
        
        // Recursive function to build tree view
        function buildTree(obj, parentElement, key, depth = 0) {
            const item = document.createElement('div');
            item.className = 'tree-node';
            
            const isObject = obj !== null && typeof obj === 'object';
            const isArray = Array.isArray(obj);
            
            if (isObject) {
                const header = document.createElement('div');
                header.className = 'flex items-center';
                
                if (Object.keys(obj).length > 0) {
                    const toggle = document.createElement('span');
                    toggle.className = 'tree-toggle';
                    toggle.innerHTML = '<i class="fas fa-caret-right"></i>';
                    toggle.addEventListener('click', function() {
                        const isCollapsed = item.classList.contains('collapsed');
                        if (isCollapsed) {
                            item.classList.remove('collapsed');
                            toggle.innerHTML = '<i class="fas fa-caret-down"></i>';
                        } else {
                            item.classList.add('collapsed');
                            toggle.innerHTML = '<i class="fas fa-caret-right"></i>';
                        }
                    });
                    header.appendChild(toggle);
                } else {
                    const spacer = document.createElement('span');
                    spacer.className = 'w-4';
                    header.appendChild(spacer);
                }
                
                const keyElement = document.createElement('span');
                keyElement.className = 'json-key';
                keyElement.textContent = key + ': ';
                header.appendChild(keyElement);
                
                const type = document.createElement('span');
                type.className = 'text-gray-500 ml-1';
                type.textContent = isArray ? `Array[${obj.length}]` : `Object{${Object.keys(obj).length}}`;
                header.appendChild(type);
                
                item.appendChild(header);
                
                const children = document.createElement('div');
                children.className = 'tree-children';
                
                for (const k in obj) {
                    if (obj.hasOwnProperty(k)) {
                        buildTree(obj[k], children, k, depth + 1);
                    }
                }
                
                item.appendChild(children);
            } else {
                const line = document.createElement('div');
                line.className = 'flex items-center';
                
                const keyElement = document.createElement('span');
                keyElement.className = 'json-key';
                keyElement.textContent = key + ': ';
                line.appendChild(keyElement);
                
                const value = document.createElement('span');
                if (typeof obj === 'string') {
                    value.className = 'json-string';
                    value.textContent = `"${obj}"`;
                } else if (typeof obj === 'number') {
                    value.className = 'json-number';
                    value.textContent = obj;
                } else if (typeof obj === 'boolean') {
                    value.className = 'json-boolean';
                    value.textContent = obj;
                } else if (obj === null) {
                    value.className = 'json-null';
                    value.textContent = 'null';
                }
                line.appendChild(value);
                
                item.appendChild(line);
            }
            
            parentElement.appendChild(item);
        }
        
        // Calculate JSON statistics
        function calculateStats(obj) {
            let properties = 0;
            let objects = 0;
            let arrays = 0;
            
            function traverse(o) {
                if (o && typeof o === 'object') {
                    if (Array.isArray(o)) {
                        arrays++;
                    } else {
                        objects++;
                    }
                    
                    for (const k in o) {
                        if (o.hasOwnProperty(k)) {
                            properties++;
                            traverse(o[k]);
                        }
                    }
                }
            }
            
            traverse(obj);
            return { properties, objects, arrays };
        }
        
        // Format bytes to human readable format
        function formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';
            
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }
        
        // Validate JSON function
        function validateJSON() {
            try {
                JSON.parse(jsonInput.value);
                errorMessage.classList.add('hidden');
                validationSuccess.classList.remove('hidden');
                showToast('JSON is valid!', 'green');
            } catch (error) {
                errorDetails.textContent = error.message;
                errorMessage.classList.remove('hidden');
                validationSuccess.classList.add('hidden');
            }
        }
        
        // Minify JSON function
        function minifyJSON() {
            try {
                const minified = JSON.stringify(JSON.parse(jsonInput.value));
                jsonInput.value = minified;
                showToast('JSON minified!', 'blue');
            } catch (error) {
                errorDetails.textContent = error.message;
                errorMessage.classList.remove('hidden');
            }
        }
        
        // Clear all fields
        function clearAll() {
            jsonInput.value = '';
            jsonOutput.textContent = '';
            jsonMinified.textContent = '';
            jsonTree.innerHTML = '';
            errorMessage.classList.add('hidden');
            validationSuccess.classList.add('hidden');
            stats.classList.add('hidden');
        }
        
        // Copy to clipboard
        function copyToClipboard() {
            let textToCopy = '';
            
            if (currentView === 'formatted') {
                textToCopy = jsonOutput.textContent;
            } else if (currentView === 'minified') {
                textToCopy = jsonMinified.textContent;
            } else if (currentView === 'tree') {
                textToCopy = JSON.stringify(currentJSON, null, 2);
            }
            
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        showToast('Copied to clipboard!', 'green');
                    })
                    .catch(err => {
                        console.error('Failed to copy: ', err);
                        showToast('Failed to copy!', 'red');
                    });
            }
        }
        
        // Download JSON
        function downloadJSON() {
            let content = '';
            let filename = 'formatted.json';
            
            if (currentView === 'formatted') {
                content = jsonOutput.textContent;
            } else if (currentView === 'minified') {
                content = jsonMinified.textContent;
                filename = 'minified.json';
            } else if (currentView === 'tree') {
                content = JSON.stringify(currentJSON, null, 2);
            }
            
            if (content) {
                const blob = new Blob([content], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast('File downloaded!', 'green');
            }
        }
        
        // Load sample JSON
        function loadSample() {
            jsonInput.value = JSON.stringify(sampleJSON, null, 2);
            formatJSON();
            showToast('Sample JSON loaded!', 'purple');
        }
        
        // Handle file upload
        function handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    jsonInput.value = e.target.result;
                    formatJSON();
                    showToast('File uploaded successfully!', 'blue');
                };
                reader.readAsText(file);
            }
        }
        
        // Show specific view
        function showView(view) {
            // Hide all views
            formattedView.classList.add('hidden');
            treeView.classList.add('hidden');
            minifiedView.classList.add('hidden');
            
            // Remove active class from all tabs
            formattedTab.classList.remove('tab-active');
            treeTab.classList.remove('tab-active');
            minifiedTab.classList.remove('tab-active');
            
            // Show selected view and set active tab
            if (view === 'formatted') {
                formattedView.classList.remove('hidden');
                formattedTab.classList.add('tab-active');
            } else if (view === 'tree') {
                treeView.classList.remove('hidden');
                treeTab.classList.add('tab-active');
            } else if (view === 'minified') {
                minifiedView.classList.remove('hidden');
                minifiedTab.classList.add('tab-active');
            }
            
            currentView = view;
        }
        
        // Show toast notification
        function showToast(message, color = 'gray') {
            toastMessage.textContent = message;
            
            // Set color based on type
            if (color === 'green') {
                toast.className = toast.className.replace(/bg-\[^\s]*/, 'bg-green-600');
            } else if (color === 'red') {
                toast.className = toast.className.replace(/bg-\[^\s]*/, 'bg-red-600');
            } else if (color === 'blue') {
                toast.className = toast.className.replace(/bg-\[^\s]*/, 'bg-blue-600');
            } else if (color === 'purple') {
                toast.className = toast.className.replace(/bg-\[^\s]*/, 'bg-purple-600');
            } else {
                toast.className = toast.className.replace(/bg-\[^\s]*/, 'bg-gray-800');
            }
            
            toast.classList.remove('opacity-0', 'translate-y-10');
            toast.classList.add('opacity-100', 'translate-y-0');
            
            setTimeout(() => {
                toast.classList.remove('opacity-100', 'translate-y-0');
                toast.classList.add('opacity-0', 'translate-y-10');
            }, 3000);
        }
        
        // Add event listeners
        formatBtn.addEventListener('click', formatJSON);
        clearBtn.addEventListener('click', clearAll);
        copyBtn.addEventListener('click', copyToClipboard);
        validateBtn.addEventListener('click', validateJSON);
        minifyBtn.addEventListener('click', minifyJSON);
        uploadBtn.addEventListener('click', () => fileInput.click());
        downloadBtn.addEventListener('click', downloadJSON);
        sampleBtn.addEventListener('click', loadSample);
        fileInput.addEventListener('change', handleFileUpload);
        
        // Tab event listeners
        formattedTab.addEventListener('click', () => showView('formatted'));
        treeTab.addEventListener('click', () => showView('tree'));
        minifiedTab.addEventListener('click', () => showView('minified'));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+Enter to format (Cmd+Enter on Mac)
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                formatJSON();
            }
            
            // Escape to clear
            if (e.key === 'Escape') {
                clearAll();
            }
            
            // Ctrl+Shift+M to minify (Cmd+Shift+M on Mac)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
                e.preventDefault();
                minifyJSON();
            }
        });
