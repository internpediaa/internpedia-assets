// DOM Elements
        const colorPad = document.getElementById('colorPad');
        const colorPreview = document.getElementById('colorPreview');
        const hexValue = document.getElementById('hexValue');
        const rgbValue = document.getElementById('rgbValue');
        const hslValue = document.getElementById('hslValue');
        const copyHex = document.getElementById('copyHex');
        const copyRgb = document.getElementById('copyRgb');
        const copyHsl = document.getElementById('copyHsl');
        const addToPalette = document.getElementById('addToPalette');
        const clearPalette = document.getElementById('clearPalette');
        const paletteContainer = document.getElementById('paletteContainer');
        const emptyPaletteMessage = document.getElementById('emptyPaletteMessage');
        const complementaryColors = document.getElementById('complementaryColors');
        const analogousColors = document.getElementById('analogousColors');
        const triadicColors = document.getElementById('triadicColors');
        const monochromaticColors = document.getElementById('monochromaticColors');

        // Current color state
        let currentColor = '#3b82f6';
        let selectedCell = null;

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            // Load saved palette
            loadPalette();
            
            // Generate color pad
            generateColorPad();
            
            // Set initial color
            updateColor(currentColor);
            
            // Event Listeners
            copyHex.addEventListener('click', function() {
                copyToClipboard(hexValue.value, this);
            });
            
            copyRgb.addEventListener('click', function() {
                copyToClipboard(rgbValue.value, this);
            });
            
            copyHsl.addEventListener('click', function() {
                copyToClipboard(hslValue.value, this);
            });
            
            addToPalette.addEventListener('click', function() {
                addToPaletteList(currentColor);
            });
            
            clearPalette.addEventListener('click', function() {
                clearPaletteList();
            });
        });

        // Generate the color pad
        function generateColorPad() {
            // Clear any existing content
            colorPad.innerHTML = '';
            
            // Generate colors with different hues, saturations, and lightness values
            // We'll create a grid with 16 columns and 16 rows (256 colors)
            
            for (let row = 0; row < 16; row++) {
                for (let col = 0; col < 16; col++) {
                    // Calculate HSL values
                    // Hue: 0-360 (based on column)
                    // Saturation: 50-100% (based on row)
                    // Lightness: 25-75% (based on row)
                    
                    const hue = Math.round((col / 16) * 360);
                    const saturation = Math.round(50 + (row / 16) * 50);
                    const lightness = Math.round(25 + (row / 16) * 50);
                    
                    const color = hslToHex(hue, saturation, lightness);
                    
                    const cell = document.createElement('div');
                    cell.className = 'color-cell';
                    cell.style.backgroundColor = color;
                    cell.setAttribute('data-color', color);
                    
                    // Add click event to select color
                    cell.addEventListener('click', function() {
                        // Remove selected class from previously selected cell
                        if (selectedCell) {
                            selectedCell.classList.remove('selected');
                        }
                        
                        // Add selected class to current cell
                        this.classList.add('selected');
                        selectedCell = this;
                        
                        // Update color
                        updateColor(color);
                    });
                    
                    // Set the initial selected cell for the default color
                    if (color === currentColor) {
                        cell.classList.add('selected');
                        selectedCell = cell;
                    }
                    
                    colorPad.appendChild(cell);
                }
            }
        }

        // Update the entire UI with the new color
        function updateColor(color) {
            currentColor = color;
            
            // Update preview
            colorPreview.style.backgroundColor = color;
            
            // Update color values
            const rgb = hexToRgb(color);
            const hsl = hexToHsl(color);
            
            hexValue.value = color;
            rgbValue.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            hslValue.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
            
            // Generate harmony colors
            generateHarmonies(color);
        }

        // Generate color harmonies
        function generateHarmonies(hex) {
            const hsl = hexToHsl(hex);
            
            // Complementary (180° difference)
            const compHsl = { h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l };
            const compHex = hslToHex(compHsl.h, compHsl.s, compHsl.l);
            
            // Analogous (30° difference on both sides)
            const analog1Hsl = { h: (hsl.h + 30) % 360, s: hsl.s, l: hsl.l };
            const analog2Hsl = { h: (hsl.h - 30 + 360) % 360, s: hsl.s, l: hsl.l };
            const analog1Hex = hslToHex(analog1Hsl.h, analog1Hsl.s, analog1Hsl.l);
            const analog2Hex = hslToHex(analog2Hsl.h, analog2Hsl.s, analog2Hsl.l);
            
            // Triadic (120° difference)
            const triad1Hsl = { h: (hsl.h + 120) % 360, s: hsl.s, l: hsl.l };
            const triad2Hsl = { h: (hsl.h + 240) % 360, s: hsl.s, l: hsl.l };
            const triad1Hex = hslToHex(triad1Hsl.h, triad1Hsl.s, triad1Hsl.l);
            const triad2Hex = hslToHex(triad2Hsl.h, triad2Hsl.s, triad2Hsl.l);
            
            // Monochromatic (different lightness values)
            const mono1Hsl = { h: hsl.h, s: hsl.s, l: Math.max(0, hsl.l - 20) };
            const mono2Hsl = { h: hsl.h, s: hsl.s, l: Math.min(100, hsl.l + 20) };
            const mono3Hsl = { h: hsl.h, s: hsl.s, l: Math.min(100, hsl.l + 40) };
            const mono1Hex = hslToHex(mono1Hsl.h, mono1Hsl.s, mono1Hsl.l);
            const mono2Hex = hslToHex(mono2Hsl.h, mono2Hsl.s, mono2Hsl.l);
            const mono3Hex = hslToHex(mono3Hsl.h, mono3Hsl.s, mono3Hsl.l);
            
            // Clear previous harmony colors
            complementaryColors.innerHTML = '';
            analogousColors.innerHTML = '';
            triadicColors.innerHTML = '';
            monochromaticColors.innerHTML = '';
            
            // Create harmony color swatches
            createHarmonySwatch(complementaryColors, hex, 'Original');
            createHarmonySwatch(complementaryColors, compHex, 'Complementary');
            
            createHarmonySwatch(analogousColors, analog1Hex, 'Analogous 1');
            createHarmonySwatch(analogousColors, hex, 'Original');
            createHarmonySwatch(analogousColors, analog2Hex, 'Analogous 2');
            
            createHarmonySwatch(triadicColors, hex, 'Original');
            createHarmonySwatch(triadicColors, triad1Hex, 'Triadic 1');
            createHarmonySwatch(triadicColors, triad2Hex, 'Triadic 2');
            
            createHarmonySwatch(monochromaticColors, mono1Hex, 'Monochromatic 1');
            createHarmonySwatch(monochromaticColors, hex, 'Original');
            createHarmonySwatch(monochromaticColors, mono2Hex, 'Monochromatic 2');
            createHarmonySwatch(monochromaticColors, mono3Hex, 'Monochromatic 3');
        }

        // Create a harmony color swatch
        function createHarmonySwatch(container, color, label) {
            const swatch = document.createElement('div');
            swatch.className = 'harmony-swatch relative group flex-1 h-12 rounded-xl cursor-pointer shadow-md';
            swatch.style.backgroundColor = color;
            swatch.setAttribute('title', `${color} - ${label}`);
            
            // Show hex value on hover
            const tooltip = document.createElement('div');
            tooltip.className = 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30';
            tooltip.textContent = color;
            swatch.appendChild(tooltip);
            
            // Click to select this color
            swatch.addEventListener('click', function() {
                updateColor(color);
                
                // Update selected cell in color pad
                const cells = document.querySelectorAll('.color-cell');
                cells.forEach(cell => {
                    cell.classList.remove('selected');
                    if (cell.getAttribute('data-color') === color) {
                        cell.classList.add('selected');
                        selectedCell = cell;
                    }
                });
            });
            
            container.appendChild(swatch);
        }

        // Color conversion functions
        function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 0, g: 0, b: 0 };
        }

        function rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        function hexToHsl(hex) {
            const rgb = hexToRgb(hex);
            const r = rgb.r / 255;
            const g = rgb.g / 255;
            const b = rgb.b / 255;
            
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            
            if (max === min) {
                h = s = 0; // achromatic
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                
                h /= 6;
            }
            
            return {
                h: Math.round(h * 360),
                s: Math.round(s * 100),
                l: Math.round(l * 100)
            };
        }

        function hslToHex(h, s, l) {
            h /= 360;
            s /= 100;
            l /= 100;
            
            let r, g, b;
            
            if (s === 0) {
                r = g = b = l; // achromatic
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            
            const toHex = x => {
                const hex = Math.round(x * 255).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            };
            
            return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        }

        // Copy to clipboard with tooltip feedback
        function copyToClipboard(text, button) {
            navigator.clipboard.writeText(text).then(() => {
                const tooltip = button.querySelector('.tooltiptext');
                tooltip.textContent = 'Copied!';
                button.classList.add('show');
                
                setTimeout(() => {
                    button.classList.remove('show');
                    tooltip.textContent = 'Copy';
                }, 1500);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }

        // Palette management
        function addToPaletteList(color) {
            // Check if color already exists in palette
            const existingColors = Array.from(paletteContainer.querySelectorAll('.palette-item'));
            const colorExists = existingColors.some(item => {
                return item.getAttribute('data-color') === color;
            });
            
            if (colorExists) {
                // Show a temporary message that color already exists
                const existingMessage = document.createElement('div');
                existingMessage.className = 'text-center py-2 text-amber-600 text-sm bg-amber-50 rounded-lg mb-2';
                existingMessage.textContent = 'Color already in palette!';
                paletteContainer.insertBefore(existingMessage, paletteContainer.firstChild);
                
                setTimeout(() => {
                    existingMessage.remove();
                }, 2000);
                return;
            }
            
            // Hide empty message if it's the first color
            if (emptyPaletteMessage.style.display !== 'none') {
                emptyPaletteMessage.style.display = 'none';
            }
            
            // Create palette item
            const paletteItem = document.createElement('div');
            paletteItem.className = 'palette-item flex items-center justify-between p-4 rounded-xl bg-gray-50 transition-all duration-300 hover:bg-gray-100';
            paletteItem.setAttribute('data-color', color);
            
            // Color preview and value
            const colorInfo = document.createElement('div');
            colorInfo.className = 'flex items-center gap-3';
            
            const colorSwatch = document.createElement('div');
            colorSwatch.className = 'w-10 h-10 rounded-lg shadow-md';
            colorSwatch.style.backgroundColor = color;
            
            const colorText = document.createElement('div');
            colorText.className = 'text-gray-800 font-medium';
            colorText.textContent = color;
            
            colorInfo.appendChild(colorSwatch);
            colorInfo.appendChild(colorText);
            
            // Action buttons
            const actions = document.createElement('div');
            actions.className = 'flex gap-2';
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'p-2 text-gray-500 hover:text-blue-500 transition-colors duration-200 tooltip';
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                <span class="tooltiptext">Copy</span>
            `;
            copyBtn.addEventListener('click', function() {
                copyToClipboard(color, this);
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'p-2 text-gray-500 hover:text-red-500 transition-colors duration-200';
            deleteBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
            `;
            deleteBtn.addEventListener('click', function() {
                paletteItem.remove();
                savePalette();
                
                // Show empty message if no colors left
                if (paletteContainer.querySelectorAll('.palette-item').length === 0) {
                    emptyPaletteMessage.style.display = 'block';
                }
            });
            
            actions.appendChild(copyBtn);
            actions.appendChild(deleteBtn);
            
            paletteItem.appendChild(colorInfo);
            paletteItem.appendChild(actions);
            
            // Add to top of palette
            paletteContainer.insertBefore(paletteItem, paletteContainer.firstChild);
            
            // Save to localStorage
            savePalette();
        }

        function clearPaletteList() {
            const paletteItems = paletteContainer.querySelectorAll('.palette-item');
            paletteItems.forEach(item => item.remove());
            
            // Show empty message
            emptyPaletteMessage.style.display = 'block';
            
            // Save to localStorage
            savePalette();
        }

        function savePalette() {
            const paletteItems = paletteContainer.querySelectorAll('.palette-item');
            const colors = Array.from(paletteItems).map(item => item.getAttribute('data-color'));
            localStorage.setItem('colorPickerPalette', JSON.stringify(colors));
        }

        function loadPalette() {
            const savedPalette = localStorage.getItem('colorPickerPalette');
            if (savedPalette) {
                const colors = JSON.parse(savedPalette);
                
                if (colors.length > 0) {
                    emptyPaletteMessage.style.display = 'none';
                    
                    // Add colors to palette (in reverse to maintain order)
                    colors.reverse().forEach(color => {
                        addToPaletteList(color);
                    });
                }
            }
        }
