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

        // Color data organized by category
        const colorData = {
            basic: [
                { name: "Black", hex: "#000000", rgb: "(0,0,0)" },
                { name: "White", hex: "#FFFFFF", rgb: "(255,255,255)" },
                { name: "Red", hex: "#FF0000", rgb: "(255,0,0)" },
                { name: "Lime", hex: "#00FF00", rgb: "(0,255,0)" },
                { name: "Blue", hex: "#0000FF", rgb: "(0,0,255)" },
                { name: "Yellow", hex: "#FFFF00", rgb: "(255,255,0)" },
                { name: "Cyan / Aqua", hex: "#00FFFF", rgb: "(0,255,255)" },
                { name: "Magenta / Fuchsia", hex: "#FF00FF", rgb: "(255,0,255)" },
                { name: "Silver", hex: "#C0C0C0", rgb: "(192,192,192)" },
                { name: "Gray", hex: "#808080", rgb: "(128,128,128)" },
                { name: "Maroon", hex: "#800000", rgb: "(128,0,0)" },
                { name: "Olive", hex: "#808000", rgb: "(128,128,0)" },
                { name: "Green", hex: "#008000", rgb: "(0,128,0)" },
                { name: "Purple", hex: "#800080", rgb: "(128,0,128)" },
                { name: "Teal", hex: "#008080", rgb: "(0,128,128)" },
                { name: "Navy", hex: "#000080", rgb: "(0,0,128)" }
            ],
            reds: [
                { name: "maroon", hex: "#800000", rgb: "(128,0,0)" },
                { name: "dark red", hex: "#8B0000", rgb: "(139,0,0)" },
                { name: "brown", hex: "#A52A2A", rgb: "(165,42,42)" },
                { name: "firebrick", hex: "#B22222", rgb: "(178,34,34)" },
                { name: "crimson", hex: "#DC143C", rgb: "(220,20,60)" },
                { name: "red", hex: "#FF0000", rgb: "(255,0,0)" },
                { name: "tomato", hex: "#FF6347", rgb: "(255,99,71)" },
                { name: "coral", hex: "#FF7F50", rgb: "(255,127,80)" },
                { name: "indian red", hex: "#CD5C5C", rgb: "(205,92,92)" },
                { name: "light coral", hex: "#F08080", rgb: "(240,128,128)" },
                { name: "dark salmon", hex: "#E9967A", rgb: "(233,150,122)" },
                { name: "salmon", hex: "#FA8072", rgb: "(250,128,114)" },
                { name: "light salmon", hex: "#FFA07A", rgb: "(255,160,122)" },
                { name: "orange red", hex: "#FF4500", rgb: "(255,69,0)" },
                { name: "deep pink", hex: "#FF1493", rgb: "(255,20,147)" },
                { name: "hot pink", hex: "#FF69B4", rgb: "(255,105,180)" },
                { name: "light pink", hex: "#FFB6C1", rgb: "(255,182,193)" },
                { name: "pink", hex: "#FFC0CB", rgb: "(255,192,203)" },
                { name: "pale violet red", hex: "#DB7093", rgb: "(219,112,147)" },
                { name: "medium violet red", hex: "#C71585", rgb: "(199,21,133)" }
            ],
            oranges: [
                { name: "dark orange", hex: "#FF8C00", rgb: "(255,140,0)" },
                { name: "orange", hex: "#FFA500", rgb: "(255,165,0)" },
                { name: "gold", hex: "#FFD700", rgb: "(255,215,0)" },
                { name: "dark golden rod", hex: "#B8860B", rgb: "(184,134,11)" },
                { name: "golden rod", hex: "#DAA520", rgb: "(218,165,32)" },
                { name: "pale golden rod", hex: "#EEE8AA", rgb: "(238,232,170)" },
                { name: "dark khaki", hex: "#BDB76B", rgb: "(189,183,107)" },
                { name: "khaki", hex: "#F0E68C", rgb: "(240,230,140)" },
                { name: "yellow", hex: "#FFFF00", rgb: "(255,255,0)" },
                { name: "yellow green", hex: "#9ACD32", rgb: "(154,205,50)" },
                { name: "olive", hex: "#808000", rgb: "(128,128,0)" },
                { name: "olive drab", hex: "#6B8E23", rgb: "(107,142,35)" },
                { name: "lawn green", hex: "#7CFC00", rgb: "(124,252,0)" },
                { name: "chartreuse", hex: "#7FFF00", rgb: "(127,255,0)" },
                { name: "green yellow", hex: "#ADFF2F", rgb: "(173,255,47)" }
            ],
            greens: [
                { name: "dark olive green", hex: "#556B2F", rgb: "(85,107,47)" },
                { name: "dark green", hex: "#006400", rgb: "(0,100,0)" },
                { name: "green", hex: "#008000", rgb: "(0,128,0)" },
                { name: "forest green", hex: "#228B22", rgb: "(34,139,34)" },
                { name: "lime", hex: "#00FF00", rgb: "(0,255,0)" },
                { name: "lime green", hex: "#32CD32", rgb: "(50,205,50)" },
                { name: "light green", hex: "#90EE90", rgb: "(144,238,144)" },
                { name: "pale green", hex: "#98FB98", rgb: "(152,251,152)" },
                { name: "dark sea green", hex: "#8FBC8F", rgb: "(143,188,143)" },
                { name: "medium spring green", hex: "#00FA9A", rgb: "(0,250,154)" },
                { name: "spring green", hex: "#00FF7F", rgb: "(0,255,127)" },
                { name: "sea green", hex: "#2E8B57", rgb: "(46,139,87)" },
                { name: "medium aqua marine", hex: "#66CDAA", rgb: "(102,205,170)" },
                { name: "medium sea green", hex: "#3CB371", rgb: "(60,179,113)" },
                { name: "light sea green", hex: "#20B2AA", rgb: "(32,178,170)" }
            ],
            blues: [
                { name: "dark slate gray", hex: "#2F4F4F", rgb: "(47,79,79)" },
                { name: "teal", hex: "#008080", rgb: "(0,128,128)" },
                { name: "dark cyan", hex: "#008B8B", rgb: "(0,139,139)" },
                { name: "aqua", hex: "#00FFFF", rgb: "(0,255,255)" },
                { name: "cyan", hex: "#00FFFF", rgb: "(0,255,255)" },
                { name: "light cyan", hex: "#E0FFFF", rgb: "(224,255,255)" },
                { name: "dark turquoise", hex: "#00CED1", rgb: "(0,206,209)" },
                { name: "turquoise", hex: "#40E0D0", rgb: "(64,224,208)" },
                { name: "medium turquoise", hex: "#48D1CC", rgb: "(72,209,204)" },
                { name: "pale turquoise", hex: "#AFEEEE", rgb: "(175,238,238)" },
                { name: "aqua marine", hex: "#7FFFD4", rgb: "(127,255,212)" },
                { name: "powder blue", hex: "#B0E0E6", rgb: "(176,224,230)" },
                { name: "cadet blue", hex: "#5F9EA0", rgb: "(95,158,160)" },
                { name: "steel blue", hex: "#4682B4", rgb: "(70,130,180)" },
                { name: "corn flower blue", hex: "#6495ED", rgb: "(100,149,237)" },
                { name: "deep sky blue", hex: "#00BFFF", rgb: "(0,191,255)" },
                { name: "dodger blue", hex: "#1E90FF", rgb: "(30,144,255)" },
                { name: "light blue", hex: "#ADD8E6", rgb: "(173,216,230)" },
                { name: "sky blue", hex: "#87CEEB", rgb: "(135,206,235)" },
                { name: "light sky blue", hex: "#87CEFA", rgb: "(135,206,250)" },
                { name: "midnight blue", hex: "#191970", rgb: "(25,25,112)" },
                { name: "navy", hex: "#000080", rgb: "(0,0,128)" },
                { name: "dark blue", hex: "#00008B", rgb: "(0,0,139)" },
                { name: "medium blue", hex: "#0000CD", rgb: "(0,0,205)" },
                { name: "blue", hex: "#0000FF", rgb: "(0,0,255)" },
                { name: "royal blue", hex: "#4169E1", rgb: "(65,105,225)" }
            ],
            purples: [
                { name: "blue violet", hex: "#8A2BE2", rgb: "(138,43,226)" },
                { name: "indigo", hex: "#4B0082", rgb: "(75,0,130)" },
                { name: "dark slate blue", hex: "#483D8B", rgb: "(72,61,139)" },
                { name: "slate blue", hex: "#6A5ACD", rgb: "(106,90,205)" },
                { name: "medium slate blue", hex: "#7B68EE", rgb: "(123,104,238)" },
                { name: "medium purple", hex: "#9370DB", rgb: "(147,112,219)" },
                { name: "dark magenta", hex: "#8B008B", rgb: "(139,0,139)" },
                { name: "dark violet", hex: "#9400D3", rgb: "(148,0,211)" },
                { name: "dark orchid", hex: "#9932CC", rgb: "(153,50,204)" },
                { name: "medium orchid", hex: "#BA55D3", rgb: "(186,85,211)" },
                { name: "purple", hex: "#800080", rgb: "(128,0,128)" },
                { name: "thistle", hex: "#D8BFD8", rgb: "(216,191,216)" },
                { name: "plum", hex: "#DDA0DD", rgb: "(221,160,221)" },
                { name: "violet", hex: "#EE82EE", rgb: "(238,130,238)" },
                { name: "magenta / fuchsia", hex: "#FF00FF", rgb: "(255,0,255)" },
                { name: "orchid", hex: "#DA70D6", rgb: "(218,112,214)" }
            ],
            browns: [
                { name: "saddle brown", hex: "#8B4513", rgb: "(139,69,19)" },
                { name: "sienna", hex: "#A0522D", rgb: "(160,82,45)" },
                { name: "chocolate", hex: "#D2691E", rgb: "(210,105,30)" },
                { name: "peru", hex: "#CD853F", rgb: "(205,133,63)" },
                { name: "sandy brown", hex: "#F4A460", rgb: "(244,164,96)" },
                { name: "burly wood", hex: "#DEB887", rgb: "(222,184,135)" },
                { name: "tan", hex: "#D2B48C", rgb: "(210,180,140)" },
                { name: "rosy brown", hex: "#BC8F8F", rgb: "(188,143,143)" },
                { name: "moccasin", hex: "#FFE4B5", rgb: "(255,228,181)" },
                { name: "navajo white", hex: "#FFDEAD", rgb: "(255,222,173)" },
                { name: "peach puff", hex: "#FFDAB9", rgb: "(255,218,185)" },
                { name: "bisque", hex: "#FFE4C4", rgb: "(255,228,196)" },
                { name: "blanched almond", hex: "#FFEBCD", rgb: "(255,235,205)" },
                { name: "wheat", hex: "#F5DEB3", rgb: "(245,222,179)" }
            ],
            grays: [
                { name: "white", hex: "#FFFFFF", rgb: "(255,255,255)" },
                { name: "snow", hex: "#FFFAFA", rgb: "(255,250,250)" },
                { name: "honeydew", hex: "#F0FFF0", rgb: "(240,255,240)" },
                { name: "mint cream", hex: "#F5FFFA", rgb: "(245,255,250)" },
                { name: "azure", hex: "#F0FFFF", rgb: "(240,255,255)" },
                { name: "alice blue", hex: "#F0F8FF", rgb: "(240,248,255)" },
                { name: "ghost white", hex: "#F8F8FF", rgb: "(248,248,255)" },
                { name: "white smoke", hex: "#F5F5F5", rgb: "(245,245,245)" },
                { name: "seashell", hex: "#FFF5EE", rgb: "(255,245,238)" },
                { name: "beige", hex: "#F5F5DC", rgb: "(245,245,220)" },
                { name: "old lace", hex: "#FDF5E6", rgb: "(253,245,230)" },
                { name: "floral white", hex: "#FFFAF0", rgb: "(255,250,240)" },
                { name: "ivory", hex: "#FFFFF0", rgb: "(255,255,240)" },
                { name: "antique white", hex: "#FAEBD7", rgb: "(250,235,215)" },
                { name: "linen", hex: "#FAF0E6", rgb: "(250,240,230)" },
                { name: "lavender blush", hex: "#FFF0F5", rgb: "(255,240,245)" },
                { name: "misty rose", hex: "#FFE4E1", rgb: "(255,228,225)" },
                { name: "gainsboro", hex: "#DCDCDC", rgb: "(220,220,220)" },
                { name: "light gray", hex: "#D3D3D3", rgb: "(211,211,211)" },
                { name: "silver", hex: "#C0C0C0", rgb: "(192,192,192)" },
                { name: "dark gray", hex: "#A9A9A9", rgb: "(169,169,169)" },
                { name: "gray", hex: "#808080", rgb: "(128,128,128)" },
                { name: "dim gray", hex: "#696969", rgb: "(105,105,105)" },
                { name: "light slate gray", hex: "#778899", rgb: "(119,136,153)" },
                { name: "slate gray", hex: "#708090", rgb: "(112,128,144)" },
                { name: "dark slate gray", hex: "#2F4F4F", rgb: "(47,79,79)" },
                { name: "black", hex: "#000000", rgb: "(0,0,0)" }
            ]
        };

        // Function to populate the table with colors
        function populateTable(category = 'all') {
            const tableBody = document.getElementById('color-table-body');
            tableBody.innerHTML = '';
            
            let allColors = [];
            
            if (category === 'all') {
                // Combine all colors from all categories
                for (const cat in colorData) {
                    allColors = allColors.concat(colorData[cat]);
                }
            } else {
                allColors = colorData[category] || [];
            }
            
            // Remove duplicates based on hex code
            const uniqueColors = [];
            const hexCodes = new Set();
            
            for (const color of allColors) {
                if (!hexCodes.has(color.hex)) {
                    hexCodes.add(color.hex);
                    uniqueColors.push(color);
                }
            }
            
            // Populate the table
            uniqueColors.forEach(color => {
                const row = document.createElement('tr');
                row.className = 'hover:bg-blue-50 transition-colors';
                
                // Determine if we need a border for light colors
                const needsBorder = color.hex === '#FFFFFF' || 
                                   color.hex === '#FFFFF0' || 
                                   color.hex === '#FFFAFA' ||
                                   color.hex === '#F0FFF0' ||
                                   color.hex === '#F5FFFA' ||
                                   color.hex === '#F0FFFF' ||
                                   color.hex === '#F0F8FF' ||
                                   color.hex === '#F8F8FF' ||
                                   color.hex === '#F5F5F5' ||
                                   color.hex === '#FFF5EE' ||
                                   color.hex === '#F5F5DC' ||
                                   color.hex === '#FDF5E6' ||
                                   color.hex === '#FFFAF0' ||
                                   color.hex === '#FFFFF0' ||
                                   color.hex === '#FAEBD7' ||
                                   color.hex === '#FAF0E6' ||
                                   color.hex === '#FFF0F5' ||
                                   color.hex === '#FFE4E1' ||
                                   color.hex === '#DCDCDC' ||
                                   color.hex === '#D3D3D3' ||
                                   color.hex === '#C0C0C0';
                
                row.innerHTML = `
                    <td class="py-3 px-4">
                        <div class="color-cellT ${needsBorder ? 'border border-gray-300' : ''}" 
                             style="background-color: ${color.hex}" 
                             data-value="${color.hex}"
                             title="Click to copy ${color.hex}"></div>
                    </td>
                    <td class="py-3 px-4 color-name-cellT font-medium">${color.name}</td>
                    <td class="py-3 px-4 hex-code-cellT" data-value="${color.hex}">${color.hex}</td>
                    <td class="py-3 px-4 decimal-code-cellT" data-value="${color.rgb}">${color.rgb}</td>
                `;
                
                tableBody.appendChild(row);
            });
            
            // Add event listeners for copy functionality
            addCopyEventListeners();
        }

        // Function to add copy event listeners
        function addCopyEventListeners() {
            // Color cells
            document.querySelectorAll('.color-cellT').forEach(cell => {
                cell.addEventListener('click', function() {
                    copyToClipboardColor(this.getAttribute('data-value'), 'Color code');
                });
            });
            
            // Hex code cells
            document.querySelectorAll('.hex-code-cellT').forEach(cell => {
                cell.addEventListener('click', function() {
                    copyToClipboardColor(this.getAttribute('data-value'), 'Hex code');
                });
            });
            
            // Decimal code cells
            document.querySelectorAll('.decimal-code-cellT').forEach(cell => {
                cell.addEventListener('click', function() {
                    copyToClipboardColor(this.getAttribute('data-value'), 'RGB code');
                });
            });
        }

        // Function to copy text to clipboard
        function copyToClipboardColor(text, type) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(`${type} <strong>${text}</strong> copied to clipboard!`);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                showToast('Failed to copy to clipboard');
            });
        }

        // Function to show toast notification
        function showToast(message) {
            const toastT = document.getElementById('toastT');
            const toastMessage = document.getElementById('toast-message');
            
            toastMessage.innerHTML = message;
            toastT.classList.add('show');
            
            setTimeout(() => {
                toastT.classList.remove('show');
            }, 3000);
        }

        // Initialize the table with all colors
        document.addEventListener('DOMContentLoaded', function() {
            populateTable('all');
            
            // Add event listeners to category tabs
            document.querySelectorAll('.category-tabT').forEach(tab => {
                tab.addEventListener('click', function() {
                    // Remove active class from all tabs
                    document.querySelectorAll('.category-tabT').forEach(t => {
                        t.classList.remove('active', 'bg-blue-500', 'text-white');
                        t.classList.add('bg-gray-200', 'text-gray-700');
                    });
                    
                    // Add active class to clicked tab
                    this.classList.remove('bg-gray-200', 'text-gray-700');
                    this.classList.add('active', 'bg-blue-500', 'text-white');
                    
                    // Populate table with selected category
                    const category = this.getAttribute('data-category');
                    populateTable(category);
                });
            });
        });
