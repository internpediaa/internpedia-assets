// DOM Elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadPreview = document.getElementById('uploadPreview');
    const originalPreview = document.getElementById('originalPreview');
    const fileName = document.getElementById('fileName');
    const fileDimensions = document.getElementById('fileDimensions');
    const fileSize = document.getElementById('fileSize');
    const fileFormat = document.getElementById('fileFormat');
    const changeImageBtn = document.getElementById('changeImageBtn');
    const nextToCustomize = document.getElementById('nextToCustomize');
    const customizeSection = document.getElementById('customizeSection');
    const uploadSection = document.getElementById('uploadSection');
    const backToUpload = document.getElementById('backToUpload');
    const generateFavicons = document.getElementById('generateFavicons');
    const resultsSection = document.getElementById('resultsSection');
    const progressFill = document.getElementById('progressFill');
    const step1 = document.getElementById('step1'); // AlsoUsedBackto-Upload.
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const step4 = document.getElementById('step4');
    const settingsToggle = document.getElementById('settingsToggle');
    const settingsPanel = document.getElementById('settingsPanel');
    const platformsCount = document.getElementById('platformsCount');
    const sizesCount = document.getElementById('sizesCount');
    const formatsCount = document.getElementById('formatsCount');
    const estimatedSize = document.getElementById('estimatedSize');
    const quickPreview = document.getElementById('quickPreview');
    const previewSize = document.getElementById('previewSize');
    const prevSize = document.getElementById('prevSize');
    const nextSize = document.getElementById('nextSize');
    const browserFavicon = document.getElementById('browserFavicon');
    const mobileFavicon = document.getElementById('mobileFavicon');
    const faviconsGrid = document.getElementById('faviconsGrid');
    const htmlCode = document.getElementById('htmlCode');
    const copyHtmlBtn = document.getElementById('copyHtmlBtn');
    const downloadHtmlBtn = document.getElementById('downloadHtmlBtn');
    const fileList = document.getElementById('fileList');
    const selectAllFiles = document.getElementById('selectAllFiles');
    const downloadZipBtn = document.getElementById('downloadZipBtn');
    const downloadSelectedBtn = document.getElementById('downloadSelectedBtn');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    // State variables
    let uploadedImage = null;
    let originalFile = null;
    let selectedPlatforms = ['desktop', 'ios', 'android'];
    let selectedFormats = ['png', 'ico'];
    let selectedBackground = 'transparent';
    let paddingValue = 0;
    let generatedFavicons = [];
    let currentPreviewIndex = 0;

    // Platform sizes mapping
    const platformSizes = {
        desktop: [16, 32, 48],
        ios: [60, 76, 180],
        android: [192, 512],
        windows: [70, 150]
    };

    // Event Listeners
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    changeImageBtn.addEventListener('click', () => fileInput.click());
    nextToCustomize.addEventListener('click', goToCustomize);
    backToUpload.addEventListener('click', goToUpload);
    step1.addEventListener('click', goToUpload); //MySelfCreated
    generateFavicons.addEventListener('click', generateFaviconsHandler);
    settingsToggle.addEventListener('click', toggleSettings);
    prevSize.addEventListener('click', showPrevSize);
    nextSize.addEventListener('click', showNextSize);
    copyHtmlBtn.addEventListener('click', copyHtmlCode);
    downloadHtmlBtn.addEventListener('click', downloadHtmlFile);
    selectAllFiles.addEventListener('click', selectAllFilesHandler);
    downloadZipBtn.addEventListener('click', downloadZipPackage);
    downloadSelectedBtn.addEventListener('click', downloadSelectedFiles);

    // Platform selection
    document.querySelectorAll('.option-card[data-platform]').forEach(card => {
        card.addEventListener('click', function() {
            const platform = this.dataset.platform;
            
            if (selectedPlatforms.includes(platform)) {
                selectedPlatforms = selectedPlatforms.filter(p => p !== platform);
                this.classList.remove('selected');
            } else {
                selectedPlatforms.push(platform);
                this.classList.add('selected');
            }
            
            updateStats();
        });
    });

    // Format selection
    document.querySelectorAll('.option-card[data-format]').forEach(card => {
        card.addEventListener('click', function() {
            const format = this.dataset.format;
            
            if (selectedFormats.includes(format)) {
                selectedFormats = selectedFormats.filter(f => f !== format);
                this.classList.remove('selected');
            } else {
                selectedFormats.push(format);
                this.classList.add('selected');
            }
            
            updateStats();
        });
    });

    // Background selection
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedBackground = this.dataset.bg;
            
            if (selectedBackground === 'custom') {
                selectedBackground = document.getElementById('customColor').value;
            }
            
            updateQuickPreview();
            updateLivePreview(); // ADDED: Update live preview when background changes
        });
    });

    // Custom color picker
    document.getElementById('customColor').addEventListener('input', function() {
        selectedBackground = this.value;
        updateQuickPreview();
        updateLivePreview(); // ADDED: Update live preview when custom color changes
    });

    // Padding slider
    document.getElementById('paddingSlider').addEventListener('input', function() {
        paddingValue = parseInt(this.value);
        document.getElementById('paddingValue').textContent = `${paddingValue}%`;
        updateQuickPreview();
        updateLivePreview(); // ADDED: Update live preview when padding changes
    });

    // Tab functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show active tab content
            tabContents.forEach(content => content.classList.add('hidden'));
            document.getElementById(`${tabId}-tab`).classList.remove('hidden');
        });
    });

    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropZone.classList.add('active');
    }

    function unhighlight() {
        dropZone.classList.remove('active');
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length) {
            handleFiles(files);
        }
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        if (files.length) {
            handleFiles(files);
        }
    }

    // Handle uploaded files
    function handleFiles(files) {
        const file = files[0];
        if (!file.type.match('image.*')) {
            showToast('Please select an image file (JPG, PNG, SVG, or WebP)', 'error');
            return;
        }

        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            showToast('File size exceeds 10MB limit. Please choose a smaller image.', 'error');
            return;
        }

        originalFile = file;

        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImage = new Image();
            uploadedImage.onload = function() {
                // Display original image preview
                originalPreview.src = e.target.result;

                // Update file info
                fileName.textContent = file.name;
                fileDimensions.textContent = `${uploadedImage.width} X ${uploadedImage.height}px`;
                fileSize.textContent = formatFileSize(file.size);
                fileFormat.textContent = file.type.split('/')[1].toUpperCase();

                // Show upload preview
                uploadPreview.classList.remove('hidden');
                
                // Update quick preview
                updateQuickPreview();
                
                // Update live preview - ADDED: Update live preview when image is uploaded
                updateLivePreview();

                // Show success toast
                showToast('Image uploaded successfully!');
            };
            uploadedImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Update stats
    function updateStats() {
        // Calculate total sizes
        let totalSizes = 0;
        selectedPlatforms.forEach(platform => {
            totalSizes += platformSizes[platform].length;
        });
        
        // Update counts
        platformsCount.textContent = selectedPlatforms.length;
        sizesCount.textContent = totalSizes;
        formatsCount.textContent = selectedFormats.length;
        
        // Estimate size (rough calculation)
        const estimatedSizeKB = totalSizes * 2; // Rough estimate of 2KB per favicon
        estimatedSize.textContent = `~${estimatedSizeKB} KB`;
    }

    // Update quick preview
    function updateQuickPreview() {
        if (!uploadedImage) return;
        
        const size = 180; // Quick preview size
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Set background
        if (selectedBackground !== 'transparent') {
            ctx.fillStyle = selectedBackground === 'white' ? '#ffffff' : 
                           selectedBackground === 'black' ? '#000000' :
                           selectedBackground === 'primary' ? '#4361ee' :
                           selectedBackground === 'secondary' ? '#7209b7' : selectedBackground;
            ctx.fillRect(0, 0, size, size);
        }
        
        // Calculate image dimensions with padding
        const padding = size * (paddingValue / 100);
        const imgSize = size - (padding * 2);
        
        // Draw image
        ctx.drawImage(uploadedImage, padding, padding, imgSize, imgSize);
        
        // Update quick preview
        quickPreview.innerHTML = '';
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        img.className = 'w-full h-full';
        quickPreview.appendChild(img);
        
        // Update preview text
        previewSize.textContent = `${size}X${size} px`;
    }

    // NEW: Update live preview (browser and mobile previews)
    function updateLivePreview() {
        if (!uploadedImage) return;
        
        // Create a canvas for the live preview - Use 180x180 for better quality
        const canvas = document.createElement('canvas');
        canvas.width = 180;
        canvas.height = 180;
        const ctx = canvas.getContext('2d');
        
        // Set background
        if (selectedBackground !== 'transparent') {
            ctx.fillStyle = selectedBackground === 'white' ? '#ffffff' : 
                           selectedBackground === 'black' ? '#000000' :
                           selectedBackground === 'primary' ? '#4361ee' :
                           selectedBackground === 'secondary' ? '#7209b7' : selectedBackground;
            ctx.fillRect(0, 0, 180, 180);
        }
        
        // Calculate image dimensions with padding
        const padding = 180 * (paddingValue / 100);
        const imgSize = 180 - (padding * 2);
        
        // Draw image
        ctx.drawImage(uploadedImage, padding, padding, imgSize, imgSize);
        
        // Update browser and mobile previews in real-time
        const previewDataURL = canvas.toDataURL('image/png');
        browserFavicon.src = previewDataURL;
        mobileFavicon.src = previewDataURL;
        
        // Also update the favicons grid if it exists
        if (faviconsGrid.children.length > 0) {
            updateFaviconsGridPreview();
        }
    }

    // NEW: Update all favicon previews in the grid
    function updateFaviconsGridPreview() {
        const faviconCards = faviconsGrid.querySelectorAll('.favicon-preview');
        faviconCards.forEach((card, index) => {
            if (generatedFavicons[index]) {
                const newCanvas = createFaviconCanvas(generatedFavicons[index].size);
                const img = card.querySelector('img');
                img.src = newCanvas.toDataURL('image/png');
                
                // Update the generated favicon data
                generatedFavicons[index].canvas = newCanvas;
            }
        });
    }

    // Toggle settings panel
    function toggleSettings() {
        settingsPanel.classList.toggle('open');
        settingsToggle.querySelector('i').classList.toggle('fa-chevron-down');
        settingsToggle.querySelector('i').classList.toggle('fa-chevron-up');
    }

    // Navigation functions
    function goToCustomize() {
        uploadSection.classList.add('hidden');
        customizeSection.classList.remove('hidden');
        updateProgress(2);
        updateStats();
    }

    function goToUpload() {
        customizeSection.classList.add('hidden');
        uploadSection.classList.remove('hidden');
        updateProgress(1);
    }

    // Update progress indicator
    function updateProgress(step) {
        // Update step indicators
        [step1, step2, step3, step4].forEach((stepEl, index) => {
            if (index + 1 < step) {
                stepEl.classList.remove('active');
                stepEl.classList.add('completed');
            } else if (index + 1 === step) {
                stepEl.classList.add('active');
                stepEl.classList.remove('completed');
            } else {
                stepEl.classList.remove('active', 'completed');
            }
        });
        
        // Update progress bar
        const progressPercentage = (step - 1) * 33.33;
        progressFill.style.width = `${progressPercentage}%`;
    }

    // Generate favicons
    function generateFaviconsHandler() {
        if (!uploadedImage) {
            showToast('Please upload an image first', 'error');
            return;
        }
        
        // Show generating state
        generateFavicons.disabled = true;
        generateFavicons.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Generating...';
        
        // Simulate generation time
        setTimeout(() => {
            // Generate all required sizes based on selected platforms
            generatedFavicons = [];
            
            selectedPlatforms.forEach(platform => {
                platformSizes[platform].forEach(size => {
                    // Generate PNG for all sizes
                    const canvas = createFaviconCanvas(size);
                    generatedFavicons.push({
                        platform,
                        size,
                        format: 'png',
                        canvas: canvas,
                        filename: getFilename(platform, size, 'png')
                    });
                    
                    // Generate ICO if selected and for desktop
                    if (selectedFormats.includes('ico') && platform === 'desktop' && size === 32) {
                        const icoCanvas = createFaviconCanvas(32);
                        generatedFavicons.push({
                            platform,
                            size: 32,
                            format: 'ico',
                            canvas: icoCanvas,
                            filename: 'favicon.ico'
                        });
                    }
                });
            });
            
            // Display results
            displayResults();
            
            // Update progress
            updateProgress(3);
            
            // Reset generate button
            generateFavicons.disabled = false;
            generateFavicons.innerHTML = 'Generate Favicons <i class="fas fa-bolt ml-2"></i>';
            
            // Show success toast
            showToast('Favicons generated successfully!');
        }, 1500);
    }
    
    // Create favicon canvas
    function createFaviconCanvas(size) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Set background
        if (selectedBackground !== 'transparent') {
            ctx.fillStyle = selectedBackground === 'white' ? '#ffffff' : 
                           selectedBackground === 'black' ? '#000000' :
                           selectedBackground === 'primary' ? '#4361ee' :
                           selectedBackground === 'secondary' ? '#7209b7' : selectedBackground;
            ctx.fillRect(0, 0, size, size);
        }
        
        // Calculate image dimensions with padding
        const padding = size * (paddingValue / 100);
        const imgSize = size - (padding * 2);
        
        // Draw image
        ctx.drawImage(uploadedImage, padding, padding, imgSize, imgSize);
        
        return canvas;
    }
    
    // Get filename for favicon
    function getFilename(platform, size, format) {
        if (platform === 'desktop') {
            return `favicon-${size} \u00D7 ${size}.${format}`;
        } else if (platform === 'ios') {
            return `apple-touch-icon${size === 180 ? '' : `-${size} \u00D7 ${size}`}.${format}`;
        } else if (platform === 'android') {
            return `android-chrome-${size} \u00D7 ${size}.${format}`;
        } else if (platform === 'windows') {
            return `mstile-${size} \u00D7 ${size}.${format}`;
        }
    }
    
    // Display generated results
    function displayResults() {
        // Show results section
        customizeSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        
        // Update progress to final step
        updateProgress(4);
        
        // Update preview images - CHANGED: Use updateLivePreview instead of manual updates
        updateLivePreview();
        
        // Set initial quick preview
        currentPreviewIndex = 0;
        updateFaviconPreview();
        
        // Display all generated favicons
        faviconsGrid.innerHTML = '';
        generatedFavicons.forEach((favicon, index) => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-xl border border-gray-200 p-4 text-center favicon-preview';
            
            // Create favicon preview
            const faviconPreview = document.createElement('div');
            faviconPreview.className = 'mx-auto mb-3 rounded-lg overflow-hidden border border-gray-300 bg-white flex items-center justify-center';
            const displaySize = Math.min(favicon.size, 80);
            faviconPreview.style.width = `${displaySize}px`;
            faviconPreview.style.height = `${displaySize}px`;
            
            const faviconImg = document.createElement('img');
            faviconImg.src = favicon.canvas.toDataURL('image/png');
            faviconImg.className = 'max-w-full max-h-full';
            faviconImg.alt = `Favicon ${favicon.size} \u00D7 ${favicon.size}`;
            faviconPreview.appendChild(faviconImg);
            
            // Create size label
            const sizeLabel = document.createElement('p');
            sizeLabel.className = 'text-sm font-medium text-gray-700 mb-1';
            sizeLabel.textContent = `${favicon.size} \u00D7 ${favicon.size}`;
            
            // Create platform label
            const platformLabel = document.createElement('p');
            platformLabel.className = 'text-xs text-gray-500 mb-2';
            platformLabel.textContent = `${favicon.platform} \u25CF ${favicon.format.toUpperCase()}`;
            
            // Create download button
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-3 rounded-lg transition-colors duration-300 w-full flex items-center justify-center';
            downloadBtn.innerHTML = `
                <i class="fas fa-download mr-1"></i>
                Download
            `;
            downloadBtn.addEventListener('click', () => {
                downloadFavicon(favicon);
            });
            
            // Assemble the card
            card.appendChild(faviconPreview);
            card.appendChild(sizeLabel);
            card.appendChild(platformLabel);
            card.appendChild(downloadBtn);
            
            faviconsGrid.appendChild(card);
        });
        
        // Update file list
        updateFileList();
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Update file list for download
    function updateFileList() {
        fileList.innerHTML = '';
        
        generatedFavicons.forEach((favicon, index) => {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between py-2 border-b border-gray-200 last:border-0';
            
            const label = document.createElement('label');
            label.className = 'flex items-center cursor-pointer';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'mr-3 rounded text-blue-600 focus:ring-blue-500';
            checkbox.checked = true;
            checkbox.dataset.index = index;
            
            const fileInfo = document.createElement('div');
            fileInfo.innerHTML = `
                <div class="font-medium text-gray-500">${favicon.filename}</div>
                <div class="text-xs text-gray-500">${favicon.size} \u00D7 ${favicon.size} \u25CF ${favicon.format.toUpperCase()} \u25CF ${favicon.platform}</div>
            `;
            
            label.appendChild(checkbox);
            label.appendChild(fileInfo);
            
            div.appendChild(label);
            
            fileList.appendChild(div);
        });
        
        // Add additional files if selected
        if (document.getElementById('manifestOption').checked) {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between py-2 border-b border-gray-200 last:border-0';
            
            const label = document.createElement('label');
            label.className = 'flex items-center cursor-pointer';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'mr-3 rounded text-blue-600 focus:ring-blue-500';
            checkbox.checked = true;
            checkbox.dataset.file = 'manifest';
            
            const fileInfo = document.createElement('div');
            fileInfo.innerHTML = `
                <div class="font-medium text-gray-500">site.webmanifest</div>
                <div class="text-xs text-gray-500">Web App Manifest ● JSON</div>
            `;
            
            label.appendChild(checkbox);
            label.appendChild(fileInfo);
            
            div.appendChild(label);
            
            fileList.appendChild(div);
        }
        
        if (document.getElementById('htmlOption').checked) {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between py-2 border-b border-gray-200 last:border-0';
            
            const label = document.createElement('label');
            label.className = 'flex items-center cursor-pointer';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'mr-3 rounded text-blue-600 focus:ring-blue-500';
            checkbox.checked = true;
            checkbox.dataset.file = 'html';
            
            const fileInfo = document.createElement('div');
            fileInfo.innerHTML = `
                <div class="font-medium text-gray-500">favicon.html</div>
                <div class="text-xs text-gray-500">HTML Code ● Instructions</div>
            `;
            
            label.appendChild(checkbox);
            label.appendChild(fileInfo);
            
            div.appendChild(label);
            
            fileList.appendChild(div);
        }
    }
    
    // Update favicon preview
    function updateFaviconPreview() {
        if (generatedFavicons.length === 0) return;
        
        const favicon = generatedFavicons[currentPreviewIndex];
        quickPreview.innerHTML = '';
        const img = document.createElement('img');
        img.src = favicon.canvas.toDataURL('image/png');
        img.className = 'w-full h-full';
        quickPreview.appendChild(img);
        
        previewSize.textContent = `${favicon.size} \u00D7 ${favicon.size} px \u25CF ${favicon.platform}`;
    }
    
    // Show previous size in preview
    function showPrevSize() {
        if (generatedFavicons.length === 0) return;
        
        currentPreviewIndex = (currentPreviewIndex - 1 + generatedFavicons.length) % generatedFavicons.length;
        updateFaviconPreview();
    }
    
    // Show next size in preview
    function showNextSize() {
        if (generatedFavicons.length === 0) return;
        
        currentPreviewIndex = (currentPreviewIndex + 1) % generatedFavicons.length;
        updateFaviconPreview();
    }
  
    // Auto-click 6 times when page is fully loaded
    window.addEventListener('load', () => {
        let clickCount = 0;
        const interval = setInterval(() => {
            if (generatedFavicons.length > 0) {
                nextSize.click();
                clickCount++;
            }
            if (clickCount === 6) clearInterval(interval);
        }, 10);
    });
    
    // Download individual favicon
    function downloadFavicon(favicon) {
        updateProgress(4);
        favicon.canvas.toBlob(blob => {
            const link = document.createElement('a');
            link.download = favicon.filename;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
            
            showToast(`Downloaded ${favicon.filename}`);
        });
    }
    
    // Copy HTML code to clipboard
    function copyHtmlCode() {
        const textArea = document.createElement('textarea');
        textArea.value = htmlCode.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        showToast('HTML code copied to clipboard!');
    }
    
    // Download HTML file
    function downloadHtmlFile() {
        updateProgress(4);
        const blob = new Blob([htmlCode.textContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.download = 'favicon-code.html';
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
        
        showToast('HTML file downloaded!');
    }
    
    // Select all files
    function selectAllFilesHandler() {
        const checkboxes = fileList.querySelectorAll('input[type="checkbox"]');
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = !allChecked;
        });
        
        selectAllFiles.textContent = allChecked ? 'Select All' : 'Deselect All';
    }
    
    // Download selected files
    function downloadSelectedFiles() {
        const checkboxes = fileList.querySelectorAll('input[type="checkbox"]:checked');
        updateProgress(4);
        if (checkboxes.length === 0) {
            showToast('Please select at least one file to download', 'error');
            return;
        }
        
        checkboxes.forEach(checkbox => {
            if (checkbox.dataset.index !== undefined) {
                const index = parseInt(checkbox.dataset.index);
                downloadFavicon(generatedFavicons[index]);
            } else if (checkbox.dataset.file === 'html') {
                downloadHtmlFile();
            }
            // Note: Manifest file download would be implemented similarly
        });
    }
    
    // Download ZIP package
    function downloadZipPackage() {

        updateProgress(4);
        const zip = new JSZip();
        const faviconsFolder = zip.folder("favicons");
        
        // Add all generated favicons
        generatedFavicons.forEach(favicon => {
            favicon.canvas.toBlob(blob => {
                faviconsFolder.file(favicon.filename, blob);
            });
        });
        
        // Add web app manifest if selected
        if (document.getElementById('manifestOption').checked) {
            const manifest = {
                "name": "My Website",
                "short_name": "Website",
                "icons": [
                    {
                        "src": "/android-chrome-192x192.png",
                        "sizes": "192x192",
                        "type": "image/png"
                    },
                    {
                        "src": "/android-chrome-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png"
                    }
                ],
                "theme_color": "#ffffff",
                "background_color": "#ffffff",
                "display": "standalone"
            };
            
            faviconsFolder.file("site.webmanifest", JSON.stringify(manifest, null, 2));
        }
        
        // Add HTML file if selected
        if (document.getElementById('htmlOption').checked) {
            faviconsFolder.file("favicon.html", htmlCode.textContent);
        }
        
        // Add README file
        const readme = `# Favicon Package

This package contains all the favicon files needed for your website.

## Installation

1. Extract all files to the root directory of your website
2. Add the provided HTML code to the <head> section of your website
3. Test your favicons using a favicon checker tool

## Files Included

${generatedFavicons.map(f => `- ${f.filename} (${f.size}×${f.size}, ${f.format})`).join('\n')}

${document.getElementById('manifestOption').checked ? '- site.webmanifest (Web App Manifest)' : ''}
${document.getElementById('htmlOption').checked ? '- favicon.html (HTML code for your website)' : ''}

## Support

If you have any issues, please visit our website for help.
`;
        
        faviconsFolder.file("README.txt", readme);
        
        // Generate and download ZIP
        zip.generateAsync({type:"blob"}).then(content => {
            saveAs(content, "favicon-package.zip");
            updateProgress(4);
            showToast('Favicon package downloaded!');
        });
    }

    // Show toast notification
    function showToast(message, type = 'success') {
        toastMessage.textContent = message;
        
        // Change color based on type
        if (type === 'error') {
            toast.style.background = '#ef476f';
            toast.querySelector('i').className = 'fas fa-exclamation-circle mr-2';
        } else {
            toast.style.background = '#06d6a0';
            toast.querySelector('i').className = 'fas fa-check-circle mr-2';
        }
        
        // Show toast
        toast.classList.add('show');
        
        // Hide after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
    
    // Initialize
    updateStats();
