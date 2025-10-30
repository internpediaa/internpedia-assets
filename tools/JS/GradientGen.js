        let colors = ['#3b82f6', '#8b5cf6'];
        let direction = 'to right';
        let gradientType = 'linear';
        let angle = 0;
        let opacity = 100;
        let blendMode = 'normal';
        let favorites = JSON.parse(localStorage.getItem('gradientFavorites')) || [];
        let history = JSON.parse(localStorage.getItem('gradientHistory')) || [];
        let colorPositions = [0, 100]; // Track positions for each color
        
        // DOM Elements
        const colorInputsContainer = document.getElementById('colorInputs');
        const addColorBtn = document.getElementById('addColorBtn');
        const randomizeBtn = document.getElementById('randomizeBtn');
        const gradientPreview = document.getElementById('gradientPreview');
        const cssOutput = document.getElementById('cssOutput');
        const copyBtn = document.getElementById('copyBtn');
        const copyBackground = document.getElementById('copyBackground');
        const copyBackgroundImage = document.getElementById('copyBackgroundImage');
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        const directionButtons = document.querySelectorAll('.direction-btn');
        const angleSlider = document.getElementById('angleSlider');
        const angleValue = document.getElementById('angleValue');
        const angleControl = document.getElementById('angleControl');
        const linearTypeBtn = document.getElementById('linearType');
        const radialTypeBtn = document.getElementById('radialType');
        const opacitySlider = document.getElementById('opacitySlider');
        const opacityValue = document.getElementById('opacityValue');
        const blendModeSelect = document.getElementById('blendMode');
        const favoriteBtn = document.getElementById('favoriteBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const gradientHistory = document.getElementById('gradientHistory');
        const favoritesList = document.getElementById('favoritesList');
        const gradientCanvas = document.getElementById('gradientCanvas');
        
        // Tab elements
        const customTab = document.getElementById('customTab');
        const presetsTab = document.getElementById('presetsTab');
        const favoritesTab = document.getElementById('favoritesTab');
        const customContent = document.getElementById('customContent');
        const presetsContent = document.getElementById('presetsContent');
        const favoritesContent = document.getElementById('favoritesContent');
        
        // Preset gradients
        const presetGradients = [
            { name: 'Sunset', colors: ['#ff9a9e', '#fecfef'], direction: 'to right' },
            { name: 'Ocean', colors: ['#4facfe', '#00f2fe'], direction: 'to right' },
            { name: 'Mango', colors: ['#ffecd2', '#fcb69f'], direction: 'to right' },
            { name: 'Purple', colors: ['#667eea', '#764ba2'], direction: 'to right' },
            { name: 'Green', colors: ['#c1dfc4', '#deecdd'], direction: 'to right' },
            { name: 'Pink', colors: ['#ff9a9e', '#fad0c4'], direction: '135deg' },
            { name: 'Blue', colors: ['#a1c4fd', '#c2e9fb'], direction: 'to bottom' },
            { name: 'Sunrise', colors: ['#ffecd2', '#fcb69f', '#ff9a9e'], direction: 'to right' }
        ];
        
        // Initialize
        function init() {
            renderColorInputs();
            updateGradient();
            setActiveDirectionButton();
            renderPresetGradients();
            renderGradientHistory();
            renderFavorites();
            
            // Set up event listeners
            setupEventListeners();
        }
        
        // Set up event listeners
        function setupEventListeners() {
            // Color management
            addColorBtn.addEventListener('click', addRandomColor);
            randomizeBtn.addEventListener('click', randomizeColors);
            
            // Direction and type
            directionButtons.forEach(button => {
                button.addEventListener('click', () => {
                    direction = button.dataset.direction;
                    updateGradient();
                    setActiveDirectionButton();
                });
            });
            
            // Gradient type
            linearTypeBtn.addEventListener('click', () => {
                gradientType = 'linear';
                linearTypeBtn.className = 'flex-1 py-3 rounded-lg bg-blue-500 text-white font-medium';
                radialTypeBtn.className = 'flex-1 py-3 rounded-lg bg-gray-200 text-gray-700 font-medium';
                angleControl.classList.remove('hidden');
                updateGradient();
            });
            
            radialTypeBtn.addEventListener('click', () => {
                gradientType = 'radial';
                radialTypeBtn.className = 'flex-1 py-3 rounded-lg bg-blue-500 text-white font-medium';
                linearTypeBtn.className = 'flex-1 py-3 rounded-lg bg-gray-200 text-gray-700 font-medium';
                angleControl.classList.add('hidden');
                updateGradient();
            });
            
            // Angle slider
            angleSlider.addEventListener('input', () => {
                angle = angleSlider.value;
                angleValue.textContent = `${angle}\u00B0`;
                direction = `${angle}deg`;
                updateGradient();
            });
            
            // Opacity slider
            opacitySlider.addEventListener('input', () => {
                opacity = opacitySlider.value;
                opacityValue.textContent = `${opacity}%`;
                updateGradient();
            });
            
            // Blend mode
            blendModeSelect.addEventListener('change', () => {
                blendMode = blendModeSelect.value;
                updateGradient();
            });
            
            // Copy buttons
            copyBtn.addEventListener('click', () => copyToClipboard(cssOutput.value));
            copyBackground.addEventListener('click', () => copyToClipboard(`background: ${generateGradientString()};`));
            copyBackgroundImage.addEventListener('click', () => copyToClipboard(`background-image: ${generateGradientString()};`));
            
            // Favorite button
            favoriteBtn.addEventListener('click', toggleFavorite);
            
            // Download button
            downloadBtn.addEventListener('click', downloadAsImage);
            
            // Tab switching
            customTab.addEventListener('click', () => switchTab('custom'));
            presetsTab.addEventListener('click', () => switchTab('presets'));
            favoritesTab.addEventListener('click', () => switchTab('favorites'));
        }
        
        // Switch between tabs
        function switchTab(tab) {
            // Reset all tabs
            customTab.classList.remove('active');
            presetsTab.classList.remove('active');
            favoritesTab.classList.remove('active');
            customContent.classList.add('hidden');
            presetsContent.classList.add('hidden');
            favoritesContent.classList.add('hidden');
            
            // Activate selected tab
            if (tab === 'custom') {
                customTab.classList.add('active');
                customContent.classList.remove('hidden');
            } else if (tab === 'presets') {
                presetsTab.classList.add('active');
                presetsContent.classList.remove('hidden');
            } else if (tab === 'favorites') {
                favoritesTab.classList.add('active');
                favoritesContent.classList.remove('hidden');
                renderFavorites();
            }
        }
        
        // Render color inputs
        function renderColorInputs() {
            colorInputsContainer.innerHTML = '';
            
            // Update color positions when colors array changes
            if (colorPositions.length !== colors.length) {
                colorPositions = colors.map((_, index) => {
                    if (index === 0) return 0;
                    if (index === colors.length - 1) return 100;
                    return Math.round((index / (colors.length - 1)) * 100);
                });
            }
            
            colors.forEach((color, index) => {
                const colorInput = document.createElement('div');
                colorInput.className = 'flex items-center space-x-4';
                
                colorInput.innerHTML = `
                    <div class="flex-1 flex items-center space-x-3">
                        <input 
                            type="color" 
                            value="${color}" 
                            class="color-input"
                            data-index="${index}"
                        >
                        <span class="text-gray-700 font-medium w-20">${color.toUpperCase()}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value="${colorPositions[index]}" 
                            class="slider w-20"
                            data-index="${index}"
                        >
                        <span class="percentage-display text-gray-600 text-sm w-8">${colorPositions[index]}%</span>
                        ${index > 1 ? `
                            <button class="remove-color-btn p-2 rounded-full text-red-500 hover:text-red-700" data-index="${index}">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : '<div class="w-10"></div>'}
                    </div>
                `;
                
                colorInputsContainer.appendChild(colorInput);
            });
            
            // Add event listeners to color inputs
            document.querySelectorAll('.color-input').forEach(input => {
                input.addEventListener('change', handleColorChange);
            });
            
            // Add event listeners to position sliders
            document.querySelectorAll('.slider').forEach(slider => {
                if (slider.type === 'range') {
                    slider.addEventListener('input', handlePositionChange);
                }
            });
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-color-btn').forEach(button => {
                button.addEventListener('click', handleRemoveColor);
            });
        }
        
        // Handle color change
        function handleColorChange(e) {
            const index = parseInt(e.target.dataset.index);
            colors[index] = e.target.value;
            updateGradient();
            renderColorInputs();
        }
        
        // Handle position change
        function handlePositionChange(e) {
            const index = parseInt(e.target.dataset.index);
            const position = parseInt(e.target.value);
            colorPositions[index] = position;
            
            // Update the percentage display
            const percentageDisplay = e.target.nextElementSibling;
            if (percentageDisplay && percentageDisplay.classList.contains('percentage-display')) {
                percentageDisplay.textContent = `${position}%`;
            }
            
            // Update the gradient with custom positions
            updateGradient();
        }
        
        // Handle remove color
        function handleRemoveColor(e) {
            const index = parseInt(e.currentTarget.dataset.index);
            colors.splice(index, 1);
            colorPositions.splice(index, 1);
            updateGradient();
            renderColorInputs();
        }
        
        // Add random color
        function addRandomColor() {
            const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
            colors.push(randomColor);
            
            // Add a position for the new color
            if (colors.length <= 2) {
                colorPositions = [0, 100];
            } else {
                // Add new color at a reasonable position
                const newPosition = Math.round(100 / (colors.length - 1));
                colorPositions.splice(colors.length - 2, 0, newPosition);
                colorPositions[colors.length - 1] = 100;
            }
            
            updateGradient();
            renderColorInputs();
        }
        
        // Randomize all colors
        function randomizeColors() {
            colors = colors.map(() => '#' + Math.floor(Math.random()*16777215).toString(16));
            updateGradient();
            renderColorInputs();
        }
        
        // Set active direction button
        function setActiveDirectionButton() {
            directionButtons.forEach(button => {
                if (button.dataset.direction === direction) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
        }
        
        // Update gradient preview and CSS output
        function updateGradient() {
            const gradientString = generateGradientString();
            
            // Update preview
            gradientPreview.style.background = gradientString;
            gradientPreview.style.backgroundBlendMode = blendMode;
            gradientPreview.style.opacity = `${opacity}%`;
            
            // Remove the placeholder text when gradient is applied
            if (gradientPreview.querySelector('div')) {
                gradientPreview.querySelector('div').style.display = 'none';
            }
            
            // Generate CSS code
            let cssCode = '';
            if (gradientType === 'linear') {
                cssCode = `background: ${gradientString};\nbackground-blend-mode: ${blendMode};\nopacity: ${opacity}%;`;
            } else {
                cssCode = `background: ${gradientString};\nbackground-blend-mode: ${blendMode};\nopacity: ${opacity}%;`;
            }
            
            cssOutput.value = cssCode;
            
            // Add to history
            addToHistory(gradientString);
        }
        
        // Generate gradient string
        function generateGradientString() {
            // Create color stops with positions
            const colorStops = colors.map((color, index) => {
                return `${color} ${colorPositions[index]}%`;
            }).join(', ');
            
            if (gradientType === 'radial') {
                return `radial-gradient(circle, ${colorStops})`;
            } else {
                return `linear-gradient(${direction}, ${colorStops})`;
            }
        }
        
        // Add gradient to history
        function addToHistory(gradientString) {
            // Check if already in history
            const exists = history.some(item => item.gradient === gradientString);
            if (exists) return;
            
            // Add to beginning of history
            history.unshift({
                gradient: gradientString,
                colors: [...colors],
                colorPositions: [...colorPositions],
                direction: direction,
                type: gradientType
            });
            
            // Keep only last 5 items
            if (history.length > 5) {
                history.pop();
            }
            
            // Save to localStorage
            localStorage.setItem('gradientHistory', JSON.stringify(history));
            
            // Update UI
            renderGradientHistory();
        }
        
        // Render gradient history
        function renderGradientHistory() {
            gradientHistory.innerHTML = '';
            
            history.forEach((item, index) => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item flex-shrink-0 w-16 h-16 rounded-xl shadow-md';
                historyItem.style.background = item.gradient;
                historyItem.title = `Gradient ${index + 1}`;
                
                historyItem.addEventListener('click', () => {
                    colors = [...item.colors];
                    colorPositions = [...item.colorPositions];
                    direction = item.direction;
                    gradientType = item.type;
                    updateGradient();
                    renderColorInputs();
                    setActiveDirectionButton();
                    
                    if (gradientType === 'linear') {
                        linearTypeBtn.click();
                    } else {
                        radialTypeBtn.click();
                    }
                });
                
                gradientHistory.appendChild(historyItem);
            });
        }
        
        // Render preset gradients
        function renderPresetGradients() {
            const presetsContainer = presetsContent.querySelector('.grid');
            presetsContainer.innerHTML = '';
            
            presetGradients.forEach(preset => {
                const presetElement = document.createElement('div');
                presetElement.className = 'preset-gradient h-24 rounded-xl shadow-md flex flex-col justify-end p-3';
                presetElement.style.background = `linear-gradient(${preset.direction}, ${preset.colors.join(', ')})`;
                
                presetElement.innerHTML = `
                    <div class="bg-white bg-opacity-80 rounded-lg p-2 text-center">
                        <p class="text-sm font-medium text-gray-800">${preset.name}</p>
                    </div>
                `;
                
                presetElement.addEventListener('click', () => {
                    colors = [...preset.colors];
                    // Reset positions for preset
                    colorPositions = colors.map((_, index) => {
                        if (index === 0) return 0;
                        if (index === colors.length - 1) return 100;
                        return Math.round((index / (colors.length - 1)) * 100);
                    });
                    direction = preset.direction;
                    updateGradient();
                    renderColorInputs();
                    setActiveDirectionButton();
                    
                    // Switch to custom tab
                    switchTab('custom');
                });
                
                presetsContainer.appendChild(presetElement);
            });
        }
        
        // Toggle favorite
        function toggleFavorite() {
            const gradientString = generateGradientString();
            const gradientData = {
                gradient: gradientString,
                colors: [...colors],
                colorPositions: [...colorPositions],
                direction: direction,
                type: gradientType
            };
            
            // Check if already in favorites
            const existsIndex = favorites.findIndex(fav => fav.gradient === gradientString);
            
            if (existsIndex !== -1) {
                // Remove from favorites
                favorites.splice(existsIndex, 1);
                favoriteBtn.innerHTML = '<i class="far fa-star"></i>';
                favoriteBtn.classList.remove('active');
            } else {
                // Add to favorites
                favorites.push(gradientData);
                favoriteBtn.innerHTML = '<i class="fas fa-star"></i>';
                favoriteBtn.classList.add('active');
                
                // Pulse animation for feedback
                favoriteBtn.classList.add('pulse-animation');
                setTimeout(() => {
                    favoriteBtn.classList.remove('pulse-animation');
                }, 1000);
            }
            
            // Save to localStorage
            localStorage.setItem('gradientFavorites', JSON.stringify(favorites));
            
            // Update UI
            renderFavorites();
        }
        
        // Render favorites
        function renderFavorites() {
            favoritesList.innerHTML = '';
            
            if (favorites.length === 0) {
                favoritesList.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-star text-3xl mb-2"></i>
                        <p>No favorites yet. Click the star on a gradient to save it here.</p>
                    </div>
                `;
                return;
            }
            
            favorites.forEach((fav, index) => {
                const favoriteItem = document.createElement('div');
                favoriteItem.className = 'favorite-item bg-white rounded-xl p-4 shadow-md';
                
                favoriteItem.innerHTML = `
                    <div class="flex items-center space-x-4">
                        <div class="w-16 h-16 rounded-lg shadow-md" style="background: ${fav.gradient}"></div>
                        <div class="flex-1">
                            <h4 class="font-medium text-gray-800">Favorite ${index + 1}</h4>
                            <p class="text-sm text-gray-600 truncate">${fav.gradient}</p>
                        </div>
                        <button class="apply-favorite p-2 rounded-lg bg-blue-500 text-white">
                            <i class="fas fa-paint-roller"></i>
                        </button>
                        <button class="remove-favorite p-2 rounded-lg bg-red-500 text-white" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                // Apply favorite
                favoriteItem.querySelector('.apply-favorite').addEventListener('click', () => {
                    colors = [...fav.colors];
                    colorPositions = [...fav.colorPositions];
                    direction = fav.direction;
                    gradientType = fav.type;
                    updateGradient();
                    renderColorInputs();
                    setActiveDirectionButton();
                    
                    if (gradientType === 'linear') {
                        linearTypeBtn.click();
                    } else {
                        radialTypeBtn.click();
                    }
                    
                    // Switch to custom tab
                    switchTab('custom');
                });
                
                // Remove favorite
                favoriteItem.querySelector('.remove-favorite').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const index = parseInt(e.currentTarget.dataset.index);
                    favorites.splice(index, 1);
                    localStorage.setItem('gradientFavorites', JSON.stringify(favorites));
                    renderFavorites();
                });
                
                favoritesList.appendChild(favoriteItem);
            });
        }
        
        // Download as image
        function downloadAsImage() {
            // Get the gradient preview element
            const preview = document.getElementById('gradientPreview');
            
            // Set canvas dimensions to match the preview
            const width = preview.offsetWidth;
            const height = preview.offsetHeight;
            gradientCanvas.width = width;
            gradientCanvas.height = height;
            
            // Get canvas context
            const ctx = gradientCanvas.getContext('2d');
            
            // Create gradient based on type
            let gradient;
            
            if (gradientType === 'linear') {
                // Parse direction to get coordinates for linear gradient
                let x0, y0, x1, y1;
                
                if (direction === 'to right') {
                    x0 = 0; y0 = 0; x1 = width; y1 = 0;
                } else if (direction === 'to left') {
                    x0 = width; y0 = 0; x1 = 0; y1 = 0;
                } else if (direction === 'to bottom') {
                    x0 = 0; y0 = 0; x1 = 0; y1 = height;
                } else if (direction === 'to top') {
                    x0 = 0; y0 = height; x1 = 0; y1 = 0;
                } else if (direction === '135deg') {
                    x0 = 0; y0 = 0; x1 = width; y1 = height;
                } else if (direction.endsWith('deg')) {
                    // Handle custom angle
                    const angle = parseInt(direction);
                    const radians = (angle - 90) * Math.PI / 180;
                    x0 = width / 2;
                    y0 = height / 2;
                    x1 = x0 + Math.cos(radians) * width;
                    y1 = y0 + Math.sin(radians) * height;
                } else {
                    // Default to left to right
                    x0 = 0; y0 = 0; x1 = width; y1 = 0;
                }
                
                gradient = ctx.createLinearGradient(x0, y0, x1, y1);
            } else {
                // Radial gradient
                const centerX = width / 2;
                const centerY = height / 2;
                const radius = Math.max(width, height) / 2;
                gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            }
            
            // Add color stops with positions
            colors.forEach((color, index) => {
                const offset = colorPositions[index] / 100;
                gradient.addColorStop(offset, color);
            });
            
            // Fill canvas with gradient
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            
            // Apply blend mode if supported
            if (blendMode !== 'normal') {
                ctx.globalCompositeOperation = blendMode;
            }
            
            // Apply opacity
            ctx.globalAlpha = opacity / 100;
            
            // Create download link
            const dataURL = gradientCanvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'gradient.png';
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show success message
            toastMessage.textContent = 'Image downloaded successfully!';
            showToast();
        }
        
        // Copy to clipboard
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                toastMessage.textContent = 'Copied to clipboard!';
                showToast();
            });
        }
        
        // Show toast notification
        function showToast() {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
        
        // Initialize the app
        init();
