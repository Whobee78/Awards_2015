// Flags to track which mode is enabled
let christmasModeEnabled = false;
let halloweenModeEnabled = false;
let combinedModeEnabled = false;

// Light mode tracking
let currentLightMode = 'random';
const lightModes = ['random', 'sequential', 'alternating', 'wave', 'chasing', 'colorgroups', 'heartbeat', 'morse', 'rainbow', 'cascade'];
let lightIntervals = []; // Store intervals to clear them when changing modes

// Halloween light modes
let currentHalloweenLightMode = 'spooky';
const halloweenLightModes = ['spooky', 'flicker', 'pulse', 'thunder', 'colorshift', 'witch', 'zombie'];
let halloweenLightIntervals = [];

// Combined light modes
let currentCombinedLightMode = 'fusion';
const combinedLightModes = ['fusion', 'alternating', 'dualtone', 'chaotic', 'seasonal', 'festive', 'spookymas', 'candycane', 'haunted'];
let combinedLightIntervals = [];

// Keyboard event listeners for music control
document.addEventListener('keydown', function (event) {
    if (event.key === 'p' || event.key === 'P') {
        if (playerReady && player) {
            player.playVideo();
            console.log("Playing music...");
        }
    }
    if (event.key === 's' || event.key === 'S') {
        if (playerReady && player) {
            player.pauseVideo();
            console.log("Music stopped.");
        }
    }
});

let isGlowActive = false;

document.addEventListener('keydown', function (event) {
    if (event.key === 'g' || event.key === 'G') {
        const glowOverlay = document.getElementById('glow-overlay');
        isGlowActive = !isGlowActive;
        glowOverlay.style.opacity = isGlowActive ? '1' : '0';
    }
});
function autoToggleGlow() {
    const glowOverlay = document.getElementById('glow-overlay');
    isGlowActive = !isGlowActive;
    glowOverlay.style.opacity = isGlowActive ? '1' : '0';
}

// Start auto-toggling glow every 1.5 seconds
setInterval(autoToggleGlow, 1500);

// YouTube player code
let player;
let playerReady = false;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtubePlayer', {
        videoId: 'hxpuusU8sTM', // PlayStation awards music
        playerVars: {
            'autoplay': 0, // Don't autoplay initially
            'loop': 1,
            'playlist': 'hxpuusU8sTM',
            'controls': 0,
            'showinfo': 0,
            'mute': 0 // Ensure it's not muted
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// Define the callback functions
function onPlayerReady(event) {
    playerReady = true;
    // Don't play automatically - wait for key press
    console.log("YouTube player is ready. Press 'P' to start playing.");
}

function onPlayerStateChange(event) {
    // If video ends, restart it
    if (event.data === YT.PlayerState.ENDED) {
        player.playVideo();
    }
}

// Add keyboard event listener to start playing when 'P' is pressed
document.addEventListener('keydown', function (event) {
    if (event.key === 'p' || event.key === 'P') {
        if (playerReady && player) {
            player.playVideo();
            console.log("Playing music...");
        }
    }
});

// Ultra-bright neon colors for maximum intensity
const neonColors = [
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
    '#ffff00', // Yellow
    '#00ff00', // Lime
    '#ff0000', // Red
    '#0000ff', // Blue
    '#ff8000', // Orange
    '#ff00cc', // Pink
    '#00ff9c'  // Aqua
];

// Christmas colors added to the mix
const christmasColors = [
    '#ff0000', // Red
    '#00ff00', // Green
    '#FFD700', // Gold
    '#ffffff', // White
    '#E6252C'  // Christmas Red
];

// Halloween colors
const halloweenColors = [
    '#ff6600', // Orange
    '#6600cc', // Purple
    '#00cc00', // Toxic green
    '#ff0000', // Blood red
    '#66ccff', // Ghost blue
    '#ffcc00'  // Pumpkin gold
];

// Array to keep track of all active symbols and their positions
let activeSymbols = [];
// Minimum spacing between symbols in pixels
const MIN_SPACING = 200;

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    document.getElementById('clock').textContent = displayHours + ':' + minutes + " " + period;
}
setInterval(updateClock, 1000);
updateClock();

function getRandomColors(count) {
    // Choose colors based on active theme
    let colorsToUse = neonColors;

    if (christmasModeEnabled) {
        colorsToUse = [...neonColors, ...christmasColors];
    } else if (halloweenModeEnabled) {
        colorsToUse = [...neonColors, ...halloweenColors];
    } else if (combinedModeEnabled) {
        colorsToUse = [...neonColors, ...christmasColors, ...halloweenColors];
    }

    let selectedColors = [];
    while (selectedColors.length < count) {
        let color = colorsToUse[Math.floor(Math.random() * colorsToUse.length)];
        if (!selectedColors.includes(color)) {
            selectedColors.push(color);
        }
    }
    return selectedColors;
}

// Calculate distance between two points (x1,y1) and (x2,y2)
function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function createSymbol(type) {
    const container = document.getElementById('container');
    const containerHeight = container.clientHeight;
    const containerWidth = container.clientWidth;

    // Generate a random position
    // Keep positions within 5-85% range to avoid edges
    let topPosition = 5 + Math.random() * 80;
    let attempts = 0;
    const maxAttempts = 10;

    // Try to find a position that's not too close to other symbols near the right edge
    while (attempts < maxAttempts) {
        let tooClose = false;

        // Check against existing symbols that are near the right edge
        for (let symbolInfo of activeSymbols) {
            const symbolTopPercentage = symbolInfo.topPercentage;
            const symbolRightPosition = symbolInfo.rightPosition || containerWidth;

            // Only check symbols that are near the right edge
            if (symbolRightPosition > containerWidth - 300) {
                const symbolTopPixels = (containerHeight * symbolTopPercentage) / 100;
                const posTopPixels = (containerHeight * topPosition) / 100;

                if (Math.abs(symbolTopPixels - posTopPixels) < MIN_SPACING) {
                    tooClose = true;
                    break;
                }
            }
        }

        // If this position works, use it
        if (!tooClose) {
            break;
        }

        // Otherwise, try another random position
        topPosition = 5 + Math.random() * 80;
        attempts++;
    }

    const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    symbol.classList.add('ps-symbol');
    symbol.setAttribute('viewBox', '0 0 24 24');
    symbol.style.top = topPosition + '%';

    // Store information about this symbol
    const symbolId = 'symbol-' + Math.random().toString(36).substr(2, 9);
    symbol.id = symbolId;

    // Add to active symbols list
    activeSymbols.push({
        id: symbolId,
        topPercentage: topPosition,
        rightPosition: containerWidth
    });

    // Update symbol positions during animation
    const updateSymbolPosition = () => {
        const rect = symbol.getBoundingClientRect();
        const symbolInfo = activeSymbols.find(s => s.id === symbolId);
        if (symbolInfo) {
            symbolInfo.rightPosition = rect.right;
        }

        if (rect.right > 0) {
            requestAnimationFrame(updateSymbolPosition);
        }
    };
    requestAnimationFrame(updateSymbolPosition);

    // Set up removal when animation ends
    symbol.addEventListener('animationend', () => {
        symbol.remove();
        // Remove from active symbols array
        activeSymbols = activeSymbols.filter(s => s.id !== symbolId);
    });

    let parts = [];
    let colorSet = [];

    // Choose between normal, Christmas, Halloween or combined shapes based on mode
    if (combinedModeEnabled && Math.random() > 0.6) {
        // Combined themed symbols (mix of both themes)
        const combinedType = ['hybrid', 'mixed-icon', 'dual-color'][Math.floor(Math.random() * 3)];
        
        switch (combinedType) {
            case 'hybrid': // Christmas tree with pumpkin decorations
                colorSet = [...getRandomColors(2), halloweenColors[0]]; // Mix of colors
                parts = [
                    { x1: '12', y1: '4', x2: '12', y2: '20' }, // Tree trunk
                    { d: 'M12 4 L6 10 L18 10 Z' }, // Top part
                    { d: 'M12 8 L3 16 L21 16 Z' }  // Bottom part
                ];
                break;
            case 'mixed-icon': // Pumpkin with santa hat
                colorSet = [halloweenColors[0], christmasColors[0], christmasColors[3]]; // Orange, red, white
                parts = [
                    { d: 'M7 10 A5 7 0 0 0 17 10 L15 17 L9 17 Z' }, // Pumpkin body
                    { d: 'M7 6 L12 3 L17 6' }, // Santa hat
                    { d: 'M16 7 L18 7' } // Hat pom
                ];
                break;
            case 'dual-color': // PlayStation shapes in mixed Christmas/Halloween colors
                colorSet = [christmasColors[0], halloweenColors[0], christmasColors[1], halloweenColors[1]];
                
                // Use a PlayStation shape but with mixed colors
                const psShape = ['cross', 'circle', 'triangle', 'square'][Math.floor(Math.random() * 4)];
                
                switch (psShape) {
                    case 'cross':
                        parts = [
                            { x1: '6', y1: '6', x2: '12', y2: '12' },
                            { x1: '18', y1: '6', x2: '12', y2: '12' },
                            { x1: '6', y1: '18', x2: '12', y2: '12' },
                            { x1: '18', y1: '18', x2: '12', y2: '12' }
                        ];
                        break;
                    case 'circle':
                        parts = [
                            { d: 'M12 4 A8 8 0 1 1 12 20' },
                            { d: 'M12 20 A8 8 0 1 1 12 4' }
                        ];
                        break;
                    case 'triangle':
                        parts = [
                            { x1: '4', y1: '18', x2: '12', y2: '4' },
                            { x1: '20', y1: '18', x2: '12', y2: '4' },
                            { x1: '4', y1: '18', x2: '20', y2: '18' }
                        ];
                        break;
                    case 'square':
                        parts = [
                            { x1: '5', y1: '5', x2: '19', y2: '5' },
                            { x1: '19', y1: '5', x2: '19', y2: '19' },
                            { x1: '19', y1: '19', x2: '5', y2: '19' },
                            { x1: '5', y1: '19', x2: '5', y2: '5' }
                        ];
                        break;
                }
                break;
        }
    } else if (halloweenModeEnabled && Math.random() > 0.5) {
        // Halloween themed symbols
        const halloweenType = ['pumpkin', 'ghost', 'bat', 'witch-hat', 'skull'][Math.floor(Math.random() * 5)];

        switch (halloweenType) {
            case 'pumpkin': // Jack-o'-lantern
                colorSet = [halloweenColors[0]]; // Orange
                parts = [
                    { d: 'M7 10 A5 7 0 0 0 17 10 L15 17 L9 17 Z' }, // Pumpkin body
                    { d: 'M12 5 L12 8' }, // Stem
                    { d: 'M10 12 L10 13 L12 13 L12 14 L14 14 L14 12 L12 12 L12 11 L10 11 Z' } // Face
                ];
                break;
            case 'ghost': // Ghost
                colorSet = ['#ffffff']; // White
                parts = [
                    { d: 'M8 6 A4 4 0 0 0 16 6 L16 14 C16 14 14 16 12 14 C10 16 8 14 8 14 Z' }, // Ghost body
                    { x1: '10', y1: '10', x2: '11', y2: '10' }, // Left eye
                    { x1: '13', y1: '10', x2: '14', y2: '10' }  // Right eye
                ];
                break;
            case 'bat': // Bat
                colorSet = ['#ff6600', '#6600cc', '#39ff14']; // Orange, Purple, Neon Green
                parts = [
                    { d: 'M12 8 L8 12 L10 16 L14 16 L16 12 Z' }, // Bat body
                    { d: 'M8 12 L4 8 L8 8' }, // Left wing
                    { d: 'M16 12 L20 8 L16 8' }  // Right wing
                ];
                break;
            case 'witch-hat': // Witch hat
                colorSet = ['#222222', '#6600cc']; // Black and purple
                parts = [
                    { d: 'M8 16 L16 16 L12 6 Z' }, // Hat cone
                    { d: 'M6 16 L18 16' } // Hat brim
                ];
                break;
            case 'skull': // Skull
                colorSet = ['#ffffff']; // White
                parts = [
                    { d: 'M8 8 A4 4 0 0 0 16 8 L16 12 A4 4 0 0 1 8 12 Z' }, // Skull
                    { d: 'M10 12 L14 16' }, // Jaw
                    { d: 'M10 11 L11 11' }, // Left eye
                    { d: 'M13 11 L14 11' }  // Right eye
                ];
                break;
        }
    } else if (christmasModeEnabled && Math.random() > 0.5) {
        // Christmas themed symbols
        const christmasType = ['tree', 'snowflake', 'gift'][Math.floor(Math.random() * 3)];

        switch (christmasType) {
            case 'tree': // Christmas tree
                colorSet = getRandomColors(3);
                parts = [
                    { x1: '12', y1: '4', x2: '12', y2: '20' }, // Tree trunk
                    { d: 'M12 4 L6 10 L18 10 Z' }, // Top part
                    { d: 'M12 8 L3 16 L21 16 Z' }  // Bottom part
                ];
                break;
            case 'snowflake': // Snowflake
                colorSet = getRandomColors(4);
                parts = [
                    { x1: '12', y1: '3', x2: '12', y2: '21' }, // Vertical line
                    { x1: '3', y1: '12', x2: '21', y2: '12' }, // Horizontal line
                    { x1: '6', y1: '6', x2: '18', y2: '18' },  // Diagonal \
                    { x1: '6', y1: '18', x2: '18', y2: '6' }   // Diagonal /
                ];
                break;
            case 'gift': // Gift box
                colorSet = getRandomColors(3);
                parts = [
                    { d: 'M4 7 L20 7 L20 20 L4 20 Z' }, // Box
                    { d: 'M12 7 L12 20' }, // Ribbon vertical
                    { d: 'M4 13 L20 13' }  // Ribbon horizontal
                ];
                break;
        }
    } else {
        // Original PlayStation shapes
        switch (type) {
            case 'cross':
                colorSet = getRandomColors(4);
                parts = [
                    { x1: '6', y1: '6', x2: '12', y2: '12' },
                    { x1: '18', y1: '6', x2: '12', y2: '12' },
                    { x1: '6', y1: '18', x2: '12', y2: '12' },
                    { x1: '18', y1: '18', x2: '12', y2: '12' }
                ];
                break;
            case 'circle':
                colorSet = getRandomColors(2);
                parts = [
                    { d: 'M12 4 A8 8 0 1 1 12 20' },
                    { d: 'M12 20 A8 8 0 1 1 12 4' }
                ];
                break;
            case 'triangle':
                colorSet = getRandomColors(3);
                parts = [
                    { x1: '4', y1: '18', x2: '12', y2: '4' },
                    { x1: '20', y1: '18', x2: '12', y2: '4' },
                    { x1: '4', y1: '18', x2: '20', y2: '18' }
                ];
                break;
            case 'square':
                colorSet = getRandomColors(4);
                parts = [
                    { x1: '5', y1: '5', x2: '19', y2: '5' },
                    { x1: '19', y1: '5', x2: '19', y2: '19' },
                    { x1: '19', y1: '19', x2: '5', y2: '19' },
                    { x1: '5', y1: '19', x2: '5', y2: '5' }
                ];
                break;
        }
    }

    // Add defs for gradients
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    // Create lamp-like gradient
    const lampGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    lampGradient.id = `lamp-gradient-${symbolId}`;
    lampGradient.setAttribute('gradientUnits', 'userSpaceOnUse');
    lampGradient.setAttribute('x1', '0%');
    lampGradient.setAttribute('y1', '0%');
    lampGradient.setAttribute('x2', '100%');
    lampGradient.setAttribute('y2', '100%');

    // Create gradient stops for a glass/lamp-like appearance
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#666666');

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '50%');
    stop2.setAttribute('stop-color', '#444444');

    const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop3.setAttribute('offset', '100%');
    stop3.setAttribute('stop-color', '#222222');

    lampGradient.appendChild(stop1);
    lampGradient.appendChild(stop2);
    lampGradient.appendChild(stop3);

    defs.appendChild(lampGradient);

    // Create advanced filter for inactive segments
    const inactiveFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    inactiveFilter.id = `inactive-filter-${symbolId}`;
    inactiveFilter.innerHTML = `
        <feGaussianBlur stdDeviation="0.3" result="blur"/>
        <feSpecularLighting result="specOut" specularExponent="20" lighting-color="#ffffff">
            <fePointLight x="50" y="50" z="300"/>
        </feSpecularLighting>
        <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="0.3" k3="0.3" k4="0"/>
    `;
    defs.appendChild(inactiveFilter);

    // Create glow filter for active segments
    const activeFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    activeFilter.id = `glow-${symbolId}`;
    activeFilter.innerHTML = `
        <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
        <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
    `;
    defs.appendChild(activeFilter);

    symbol.appendChild(defs);

    let svgParts = parts.map((attrs, index) => {
        let element = document.createElementNS('http://www.w3.org/2000/svg', attrs.d ? 'path' : 'line');
        Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));

        // Use a much darker gradient for inactive parts
        element.setAttribute('stroke', '#333333');
        element.setAttribute('stroke-width', '1');
        element.setAttribute('stroke-linecap', 'round');
        element.setAttribute('filter', `url(#inactive-filter-${symbolId})`);
        element.classList.add('lamp-texture');
        element.setAttribute('fill', 'transparent');

        symbol.appendChild(element);
        return { element, color: colorSet[index % colorSet.length] };
    });

    let activePartIndex = 0;
    function updateActiveSegment() {
        svgParts.forEach(({ element }) => {
            // Reset to lamp texture for inactive segments
            element.setAttribute('stroke', '#333333');
            element.classList.remove('neon-glow');
            element.classList.add('lamp-texture');
            element.setAttribute('filter', `url(#inactive-filter-${symbolId})`);
            element.setAttribute('stroke-width', '1');
        });

        const currentPart = svgParts[activePartIndex];
        currentPart.element.setAttribute('stroke', currentPart.color);
        currentPart.element.classList.add('neon-glow');
        currentPart.element.classList.remove('lamp-texture');

        // Special treatment for blue
        if (currentPart.color === '#0000ff') {
            // Slightly increased thickness for blue
            currentPart.element.setAttribute('stroke-width', '2.5');

            // Enhanced filter only for blue
            const blueEnhancedFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            blueEnhancedFilter.id = `blue-glow-${symbolId}`;
            blueEnhancedFilter.innerHTML = `
                <feGaussianBlur stdDeviation="5.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            `;

           // Add filter to defs if it doesn't exist yet
           const defs = symbol.querySelector('defs');
            if (!defs.querySelector(`#blue-glow-${symbolId}`)) {
                defs.appendChild(blueEnhancedFilter);
            }

            currentPart.element.setAttribute('filter', `url(#blue-glow-${symbolId})`);
        }
        // Special treatment for Halloween orange if Halloween mode is enabled
        else if ((halloweenModeEnabled || combinedModeEnabled) && (currentPart.color === '#ff6600')) {
            // Enhanced orange for Halloween
            currentPart.element.setAttribute('stroke-width', '2.5');

            // Special filter for orange
            const orangeEnhancedFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            orangeEnhancedFilter.id = `orange-glow-${symbolId}`;
            orangeEnhancedFilter.innerHTML = `
                <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            `;

            // Add filter to defs if it doesn't exist yet
            const defs = symbol.querySelector('defs');
            if (!defs.querySelector(`#orange-glow-${symbolId}`)) {
                defs.appendChild(orangeEnhancedFilter);
            }

            currentPart.element.setAttribute('filter', `url(#orange-glow-${symbolId})`);
        }
        // Special treatment for Halloween purple if Halloween mode is enabled
        else if ((halloweenModeEnabled || combinedModeEnabled) && (currentPart.color === '#6600cc')) {
            // Enhanced purple for Halloween
            currentPart.element.setAttribute('stroke-width', '2.5');

            // Special filter for purple
            const purpleEnhancedFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            purpleEnhancedFilter.id = `purple-glow-${symbolId}`;
            purpleEnhancedFilter.innerHTML = `
                <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            `;

            // Add filter to defs if it doesn't exist yet
            const defs = symbol.querySelector('defs');
            if (!defs.querySelector(`#purple-glow-${symbolId}`)) {
                defs.appendChild(purpleEnhancedFilter);
            }

            currentPart.element.setAttribute('filter', `url(#purple-glow-${symbolId})`);
        }
        // Special treatment for Christmas green if Christmas mode is enabled
        else if ((christmasModeEnabled || combinedModeEnabled) && (currentPart.color === '#00ff00')) {
            // Enhanced green for Christmas
            currentPart.element.setAttribute('stroke-width', '2.5');

            // Special filter for green
            const greenEnhancedFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            greenEnhancedFilter.id = `green-glow-${symbolId}`;
            greenEnhancedFilter.innerHTML = `
                <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            `;

            // Add filter to defs if it doesn't exist yet
            const defs = symbol.querySelector('defs');
            if (!defs.querySelector(`#green-glow-${symbolId}`)) {
                defs.appendChild(greenEnhancedFilter);
            }

            currentPart.element.setAttribute('filter', `url(#green-glow-${symbolId})`);
        }
        // Special treatment for Christmas red if Christmas mode is enabled
        else if ((christmasModeEnabled || combinedModeEnabled) && (currentPart.color === '#ff0000' || currentPart.color === '#E6252C')) {
            // Enhanced red for Christmas
            currentPart.element.setAttribute('stroke-width', '2.5');

            // Special filter for red
            const redEnhancedFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            redEnhancedFilter.id = `red-glow-${symbolId}`;
            redEnhancedFilter.innerHTML = `
                <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            `;

            // Add filter to defs if it doesn't exist yet
            const defs = symbol.querySelector('defs');
            if (!defs.querySelector(`#red-glow-${symbolId}`)) {
                defs.appendChild(redEnhancedFilter);
            }

            currentPart.element.setAttribute('filter', `url(#red-glow-${symbolId})`);
        }
        else {
            // Standard settings for other colors
            currentPart.element.setAttribute('filter', `url(#glow-${symbolId})`);
            currentPart.element.setAttribute('stroke-width', '2');
        }

        activePartIndex = (activePartIndex + 1) % svgParts.length;
    }

    updateActiveSegment();
    setInterval(updateActiveSegment, 500);

    document.getElementById('container').appendChild(symbol);
}

function spawnSymbols() {
    const symbolTypes = ['cross', 'circle', 'triangle', 'square'];
    createSymbol(symbolTypes[Math.floor(Math.random() * symbolTypes.length)]);
    // Fixed delay for consistent appearance
    setTimeout(spawnSymbols, 1000);
}

// Clear all intervals for light animations
function clearLightIntervals() {
    lightIntervals.forEach(interval => clearInterval(interval));
    lightIntervals = [];
}

// Clear Halloween light intervals
function clearHalloweenLightIntervals() {
    halloweenLightIntervals.forEach(interval => clearInterval(interval));
    halloweenLightIntervals = [];
}

// Clear combined light intervals
function clearCombinedLightIntervals() {
    combinedLightIntervals.forEach(interval => clearInterval(interval));
    combinedLightIntervals = [];
}

// Create Christmas tree LED-style lights with different modes
function createChristmasLights() {
    // Clear existing lights and intervals
    document.querySelectorAll('.christmas-light').forEach(light => light.remove());
    clearLightIntervals();

    const lightsContainer = document.getElementById('lights-container');
    lightsContainer.style.display = 'block';

    // Show light cord
    document.querySelector('.light-cord').style.display = 'block';

    // Expanded Christmas light colors - more varied for LED effect
    const lightColors = [
        '#ff0000', // Red
        '#00ff00', // Green
        '#0000ff', // Blue
        '#ffff00', // Yellow
        '#ff00ff', // Magenta
        '#00ffff', // Cyan
        '#ff8000', // Orange
        '#ffffff', // White
        '#39ff14', // Neon green
        '#FF10F0', // Hot pink
        '#7df9ff', // Electric blue
        '#FF1493', // Deep pink
        '#00FF7F', // Spring green
        '#FFA500', // Orange
        '#9400D3', // Violet
        '#FB33DB', // Bright pink
        '#7CFC00', // Lawn green
        '#FF6347', // Tomato
        '#1E90FF', // Dodger blue
        '#FFFF00'  // Yellow
    ];

    // Animation patterns
    const animationPatterns = [
        'twinkle1',
        'twinkle2',
        'twinkle3',
        'pulse',
        'blink'
    ];

    const windowWidth = window.innerWidth;
    const lightCount = Math.floor(windowWidth / 25) + 4; // One light every 25px for more lights

    // Create all lights
    for (let i = 0; i < lightCount; i++) {
        const light = document.createElement('div');
        light.className = 'christmas-light';
        light.dataset.index = i;

        // Random color assignment
        const randomColorIndex = Math.floor(Math.random() * lightColors.length);
        const color = lightColors[randomColorIndex];
        light.style.backgroundColor = color;
        light.dataset.color = color;

        // Position light
        light.style.left = (i * 25) + 'px';

        // Add a glow effect based on color
        light.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;

        // Store in container
        lightsContainer.appendChild(light);
    }

    // Apply the current mode
    setLightMode(currentLightMode);

    // Decorate the tree with lights too
    decorateTreeWithLights();
}

// Create Halloween lights
function createHalloweenLights() {
    // Clear existing lights and intervals
    document.querySelectorAll('.halloween-light').forEach(light => light.remove());
    clearHalloweenLightIntervals();

    const lightsContainer = document.getElementById('halloween-lights-container');
    lightsContainer.style.display = 'block';

    // Show light cord
    document.querySelector('.halloween-light-cord').style.display = 'block';

    // Halloween light colors
    const lightColors = [
        '#ff6600', // Orange
        '#6600cc', // Purple
        '#00cc00', // Toxic green
        '#ff0000', // Blood red
        '#66ccff', // Ghost blue
        '#ffcc00', // Pumpkin gold
        '#39ff14', // Slime green
        '#ff00ff'  // Magenta
    ];

    const windowWidth = window.innerWidth;
    const lightCount = Math.floor(windowWidth / 25) + 4; // One light every 25px

    // Create all lights
    for (let i = 0; i < lightCount; i++) {
        const light = document.createElement('div');
        light.className = 'halloween-light';
        light.dataset.index = i;

        // Random color assignment
        const randomColorIndex = Math.floor(Math.random() * lightColors.length);
        const color = lightColors[randomColorIndex];
        light.style.backgroundColor = color;
        light.dataset.color = color;

        // Position light
        light.style.left = (i * 25) + 'px';

        // Add a glow effect based on color
        light.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;

        // Store in container
        lightsContainer.appendChild(light);
    }

    // Apply the current Halloween light mode
    setHalloweenLightMode(currentHalloweenLightMode);

    // Create pumpkin patch
    createPumpkinPatch();
}

// Create pumpkin patch decoration
function createPumpkinPatch() {
    const pumpkinPatch = document.getElementById('pumpkin-patch');

    // Clear existing pumpkins
    pumpkinPatch.innerHTML = '';

    // Create 3-5 pumpkins in different positions
    const numPumpkins = Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < numPumpkins; i++) {
        const pumpkin = document.createElement('div');
        pumpkin.className = 'pumpkin';

        // Random position within the patch
        pumpkin.style.left = (Math.random() * 100) + 'px';
        pumpkin.style.bottom = (Math.random() * 40) + 'px';

        // Random size variation
        const sizeFactor = 0.8 + (Math.random() * 0.4);
        pumpkin.style.transform = `scale(${sizeFactor})`;

        // Create stem
        const stem = document.createElement('div');
        stem.className = 'pumpkin-stem';
        pumpkin.appendChild(stem);

        // Create face
        const face = document.createElement('div');
        face.className = 'pumpkin-face';

        // Eyes
        const eyes = document.createElement('div');
        eyes.className = 'pumpkin-eyes';

        const eyeLeft = document.createElement('div');
        eyeLeft.className = 'pumpkin-eye';

        const eyeRight = document.createElement('div');
        eyeRight.className = 'pumpkin-eye';

        eyes.appendChild(eyeLeft);
        eyes.appendChild(eyeRight);

        // Mouth
        const mouth = document.createElement('div');
        mouth.className = 'pumpkin-mouth';

        // Random face shape
        if (Math.random() > 0.5) {
            // Triangle eyes
            eyeLeft.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
            eyeRight.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
        }

        if (Math.random() > 0.5) {
            // Zigzag mouth
            mouth.style.clipPath = 'polygon(0% 0%, 25% 100%, 50% 0%, 75% 100%, 100% 0%)';
        }

        face.appendChild(eyes);
        face.appendChild(mouth);
        pumpkin.appendChild(face);

        pumpkinPatch.appendChild(pumpkin);
    }
}

// Create Halloween elements (bats, leaves, etc.)
function createHalloweenElements() {
    // Clear existing elements
    document.querySelectorAll('.halloween-element').forEach(element => element.remove());

    const elements = ['🦇', '🍂', '🕸️', '🕷️', '👻', '💀'];
    const numElements = 30; // Number of falling elements

    for (let i = 0; i < numElements; i++) {
        const element = document.createElement('div');
        element.className = 'halloween-element';

        // Random element
        const randomElementIndex = Math.floor(Math.random() * elements.length);
        element.innerHTML = elements[randomElementIndex];

        // Random size
        element.style.fontSize = (Math.random() * 20 + 10) + 'px';

        // Random opacity
        element.style.opacity = Math.random() * 0.7 + 0.3;

        // Random position
        element.style.left = Math.random() * 100 + '%';

        // Different animation duration for each element
        const animationDuration = Math.random() * 15 + 10;
        element.style.animationDuration = animationDuration + 's';

        // Random animation delay
        element.style.animationDelay = Math.random() * 5 + 's';

        document.body.appendChild(element);

        // Make sure it's visible if Halloween mode is enabled
        if (halloweenModeEnabled || combinedModeEnabled) {
            element.style.display = 'block';
        }
    }
}

// Flash random lightning/thunder
function triggerLightning() {
    if (!halloweenModeEnabled && !combinedModeEnabled) return;

    const thunderFlash = document.getElementById('thunder-flash');
    thunderFlash.style.animation = 'lightning-flash 1s';

    // Reset animation after it completes
    setTimeout(() => {
        thunderFlash.style.animation = '';
    }, 1000);

    // Schedule next lightning
    if (halloweenModeEnabled || combinedModeEnabled) {
        const nextLightning = 5000 + Math.random() * 20000; // Random between 5-25 seconds
        setTimeout(triggerLightning, nextLightning);
    }
}

// Set light mode based on selection
function setLightMode(mode) {
    currentLightMode = mode;
    document.getElementById('light-mode-label').textContent = `Light Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;

    // Clear previous animations
    clearLightIntervals();

    const lights = document.querySelectorAll('.christmas-light');

    // Reset all lights
    lights.forEach(light => {
        // Clear any inline styles from previous modes
        light.style.animation = '';
        light.style.animationDelay = '';
        light.style.opacity = '1';
        light.style.transform = 'scale(1)';
    });

    switch (mode) {
        case 'random':
            applyRandomMode(lights);
            break;
        case 'sequential':
            applySequentialMode(lights);
            break;
        case 'alternating':
            applyAlternatingMode(lights);
            break;
        case 'wave':
            applyWaveMode(lights);
            break;
        case 'chasing':
            applyChasingMode(lights);
            break;
        case 'colorgroups':
            applyColorGroupsMode(lights);
            break;
        case 'heartbeat':
            applyHeartbeatMode(lights);
            break;
        case 'morse':
            applyMorseCodeMode(lights);
            break;
        case 'rainbow':
            applyRainbowMode(lights);
            break;
        case 'cascade':
            applyCascadeMode(lights);
            break;
    }
}

// Set Halloween light mode
function setHalloweenLightMode(mode) {
    currentHalloweenLightMode = mode;
    document.getElementById('halloween-light-label').textContent = `Light Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;

    // Clear previous animations
    clearHalloweenLightIntervals();

    const lights = document.querySelectorAll('.halloween-light');

    // Reset all lights
    lights.forEach(light => {
        light.style.animation = '';
        light.style.animationDelay = '';
        light.style.opacity = '1';
        light.style.transform = 'scale(1)';
    });

    switch (mode) {
        case 'spooky':
            applySpookyMode(lights);
            break;
        case 'flicker':
            applyFlickerMode(lights);
            break;
        case 'pulse':
            applyPulseMode(lights);
            break;
        case 'thunder':
            applyThunderMode(lights);
            break;
        case 'colorshift':
            applyColorShiftMode(lights);
            break;
        case 'witch':
            applyWitchMode(lights);
            break;
        case 'zombie':
            applyZombieMode(lights);
            break;
    }
}

// Halloween Light Modes

// Spooky mode - random flickering
function applySpookyMode(lights) {
    const lightsArray = Array.from(lights);

    lightsArray.forEach(light => {
        // Random flickering
        const randomFlickerSpeed = 0.5 + Math.random() * 2;
        light.style.animation = `twinkle${Math.floor(Math.random() * 3) + 1} ${randomFlickerSpeed}s infinite`;

        // Random delay
        light.style.animationDelay = (Math.random() * 2) + 's';
    });

    // Occasional random dimming
    const interval = setInterval(() => {
        lightsArray.forEach(light => {
            if (Math.random() > 0.8) {
                light.style.opacity = Math.random() * 0.7 + 0.3;
            }
        });
    }, 200);

    halloweenLightIntervals.push(interval);
}

// Flicker mode - lights rapidly turn on and off randomly
function applyFlickerMode(lights) {
    const lightsArray = Array.from(lights);

    // Set all lights dim initially
    lightsArray.forEach(light => {
        light.style.opacity = '0.3';
    });

    // Rapid random flickering
    const interval = setInterval(() => {
        lightsArray.forEach(light => {
            if (Math.random() > 0.5) {
                light.style.opacity = Math.random() > 0.5 ? '1' : '0.1';
            }
        });
    }, 100);

    halloweenLightIntervals.push(interval);
}

// Pulse mode - all lights pulse together like a heartbeat
function applyPulseMode(lights) {
    const lightsArray = Array.from(lights);

    let pulseState = 0;
    const interval = setInterval(() => {
        switch (pulseState) {
            case 0: // First beat
                lightsArray.forEach(light => {
                    light.style.opacity = '1';
                    light.style.transform = 'scale(1.2)';
                });
                pulseState = 1;
                setTimeout(() => pulseState = 2, 100);
                break;
            case 2: // Back to dim
                lightsArray.forEach(light => {
                    light.style.opacity = '0.3';
                    light.style.transform = 'scale(0.8)';
                });
                pulseState = 3;
                setTimeout(() => pulseState = 4, 300);
                break;
            case 4: // Second beat
                lightsArray.forEach(light => {
                    light.style.opacity = '1';
                    light.style.transform = 'scale(1.2)';
                });
                pulseState = 5;
                setTimeout(() => pulseState = 6, 100);
                break;
            case 6: // Back to dim for longer pause
                lightsArray.forEach(light => {
                    light.style.opacity = '0.3';
                    light.style.transform = 'scale(0.8)';
                });
                pulseState = 0;
                break;
        }
    }, 800);

    halloweenLightIntervals.push(interval);
}

// Thunder mode - occasional flashes of all lights
function applyThunderMode(lights) {
    const lightsArray = Array.from(lights);

    // Set all lights dim initially
    lightsArray.forEach(light => {
        light.style.opacity = '0.3';
        light.style.transform = 'scale(0.8)';
    });

    // Occasional lightning flash
    function lightningFlash() {
        // All lights flash bright
        lightsArray.forEach(light => {
            light.style.opacity = '1';
            light.style.transform = 'scale(1.2)';
        });

        // Dim after short time
        setTimeout(() => {
            lightsArray.forEach(light => {
                light.style.opacity = '0.3';
                light.style.transform = 'scale(0.8)';
            });
        }, 200);

        // Secondary flash sometimes
        if (Math.random() > 0.5) {
            setTimeout(() => {
                lightsArray.forEach(light => {
                    light.style.opacity = '1';
                    light.style.transform = 'scale(1.2)';
                });

                setTimeout(() => {
                    lightsArray.forEach(light => {
                        light.style.opacity = '0.3';
                        light.style.transform = 'scale(0.8)';
                    });
                }, 100);
            }, 300);
        }

        // Schedule next flash
        const nextFlash = 3000 + Math.random() * 10000; // 3-13 seconds
        setTimeout(lightningFlash, nextFlash);
    }

    // Start the lightning
    lightningFlash();
}

// Color shift mode - colors gradually shift
function applyColorShiftMode(lights) {
    const lightsArray = Array.from(lights);
    const colors = [
        '#ff6600', // Orange
        '#6600cc', // Purple
        '#00cc00', // Toxic green
        '#ff0000', // Blood red
        '#66ccff', // Ghost blue
        '#ffcc00'  // Pumpkin gold
    ];

    // Start with random colors
    lightsArray.forEach(light => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        light.style.backgroundColor = randomColor;
        light.style.boxShadow = `0 0 5px ${randomColor}, 0 0 10px ${randomColor}`;
    });

    // Gradually shift colors
    const interval = setInterval(() => {
        lightsArray.forEach(light => {
            if (Math.random() > 0.8) {
                const currentColor = light.style.backgroundColor;
                let currentIndex = -1;
                
                // Find the index of the current color
                for (let i = 0; i < colors.length; i++) {
                    if (rgbToHex(currentColor) === colors[i]) {
                        currentIndex = i;
                        break;
                    }
                }
                
                // If color not found or at end of array, pick random color
                const newColorIndex = (currentIndex !== -1) ? 
                    (currentIndex + 1) % colors.length : 
                    Math.floor(Math.random() * colors.length);
                    
                const newColor = colors[newColorIndex];
                light.style.backgroundColor = newColor;
                light.style.boxShadow = `0 0 5px ${newColor}, 0 0 10px ${newColor}`;
            }
        });
    }, 500);

    halloweenLightIntervals.push(interval);
}

// Helper function to convert RGB to HEX format
function rgbToHex(rgb) {
    // If it's already a hex color, return it
    if (rgb.startsWith('#')) return rgb;
    
    // Extract RGB values
    const rgbValues = rgb.match(/\d+/g);
    if (!rgbValues || rgbValues.length < 3) return '#000000';
    
    // Convert to hex
    return '#' + 
        parseInt(rgbValues[0]).toString(16).padStart(2, '0') +
        parseInt(rgbValues[1]).toString(16).padStart(2, '0') +
        parseInt(rgbValues[2]).toString(16).padStart(2, '0');
}

// Witch mode - green and purple alternating pattern
function applyWitchMode(lights) {
    const lightsArray = Array.from(lights);
    const witchColors = ['#00cc00', '#6600cc']; // Green and purple

    // Set colors alternating
    lightsArray.forEach((light, index) => {
        const color = witchColors[index % 2];
        light.style.backgroundColor = color;
        light.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
    });

    let isFirstGroupActive = true;
    const interval = setInterval(() => {
        lightsArray.forEach((light, index) => {
            const isInFirstGroup = index % 2 === 0;

            if (isInFirstGroup === isFirstGroupActive) {
                light.style.opacity = '1';
                light.style.transform = 'scale(1.2)';
            } else {
                light.style.opacity = '0.3';
                light.style.transform = 'scale(0.8)';
            }
        });

        isFirstGroupActive = !isFirstGroupActive;
    }, 500);

    halloweenLightIntervals.push(interval);
}

// Zombie mode - sickly green pulsing
function applyZombieMode(lights) {
    const lightsArray = Array.from(lights);
    const zombieGreen = '#39ff14'; // Toxic green

    // Set all lights to zombie green
    lightsArray.forEach(light => {
        light.style.backgroundColor = zombieGreen;
        light.style.boxShadow = `0 0 5px ${zombieGreen}, 0 0 10px ${zombieGreen}`;
    });

    // Slow, creepy pulse
    let intensity = 0;
    let increasing = true;

    const interval = setInterval(() => {
        if (increasing) {
            intensity += 0.1;
            if (intensity >= 1) {
                intensity = 1;
                increasing = false;
            }
        } else {
            intensity -= 0.1;
            if (intensity <= 0.3) {
                intensity = 0.3;
                increasing = true;
            }
        }

        lightsArray.forEach(light => {
            light.style.opacity = intensity.toString();
            light.style.transform = `scale(${0.8 + (0.4 * intensity)})`;
        });
    }, 200);

    halloweenLightIntervals.push(interval);
}

// Random mode - lights randomly twinkle
function applyRandomMode(lights) {
    const animationPatterns = ['twinkle1', 'twinkle2', 'twinkle3', 'pulse'];

    lights.forEach(light => {
        // Random animation
        const randomAnimIndex = Math.floor(Math.random() * animationPatterns.length);
        const animationName = animationPatterns[randomAnimIndex];
        const animationDuration = 1 + Math.random() * 3; // 1-4 seconds
        light.style.animation = `${animationName} ${animationDuration}s infinite`;

        // Random delay for each light
        light.style.animationDelay = (Math.random() * 2) + 's';
    });

    // Random changes
    const interval = setInterval(() => {
        lights.forEach(light => {
            // Random chance to change state
            if (Math.random() > 0.7) {
                light.style.opacity = Math.random() > 0.5 ? '1' : '0.3';
                light.style.transform = Math.random() > 0.5 ? 'scale(1.2)' : 'scale(0.8)';
            }
        });
    }, 200);

    lightIntervals.push(interval);
}

// Sequential mode - lights light up in sequence
function applySequentialMode(lights) {
    const lightsArray = Array.from(lights);
    let currentIndex = 0;

    // Turn off all lights initially
    lightsArray.forEach(light => {
        light.style.opacity = '0.3';
    });

    // Sequential pattern
    const interval = setInterval(() => {
        // Reset previous light
        if (currentIndex > 0) {
            lightsArray[currentIndex - 1].style.opacity = '0.3';
            lightsArray[currentIndex - 1].style.transform = 'scale(1)';
        } else if (currentIndex === 0 && lightsArray.length > 0) {
            lightsArray[lightsArray.length - 1].style.opacity = '0.3';
            lightsArray[lightsArray.length - 1].style.transform = 'scale(1)';
        }

        // Light up current light
        lightsArray[currentIndex].style.opacity = '1';
        lightsArray[currentIndex].style.transform = 'scale(1.2)';

        // Move to next light
        currentIndex = (currentIndex + 1) % lightsArray.length;
    }, 100);

    lightIntervals.push(interval);
}

// Alternating mode - lights alternate between even and odd
function applyAlternatingMode(lights) {
    const lightsArray = Array.from(lights);
    let isEvenActive = true;

    // Initial state - all on
    lightsArray.forEach(light => {
        light.style.opacity = '1';
    });

    // Alternating pattern
    const interval = setInterval(() => {
        lightsArray.forEach((light, index) => {
            const isEven = index % 2 === 0;
            if (isEven === isEvenActive) {
                light.style.opacity = '1';
                light.style.transform = 'scale(1.2)';
            } else {
                light.style.opacity = '0.3';
                light.style.transform = 'scale(0.8)';
            }
        });

        isEvenActive = !isEvenActive;
    }, 500);

    lightIntervals.push(interval);
}

// Wave mode - creates a wave-like effect
function applyWaveMode(lights) {
    const lightsArray = Array.from(lights);

    // Set up wave animation
    lightsArray.forEach((light, index) => {
        // Calculation for wave effect
        const delay = (index * 0.1) % 2; // 0.1 second delay per light, repeat every 2 seconds
        light.style.animation = 'pulse 2s infinite';
        light.style.animationDelay = `${delay}s`;
    });
}

// Chasing mode - lights move in chasing pattern
function applyChasingMode(lights) {
    const lightsArray = Array.from(lights);
    const groupSize = 3; // Number of lights in each chase group

    // Turn off all lights initially
    lightsArray.forEach(light => {
        light.style.opacity = '0.3';
    });

    let position = 0;
    const interval = setInterval(() => {
        // Reset all lights
        lightsArray.forEach(light => {
            light.style.opacity = '0.3';
            light.style.transform = 'scale(0.8)';
        });

        // Light up the chase group
        for (let i = 0; i < groupSize; i++) {
            const lightIndex = (position + i) % lightsArray.length;
            if (lightsArray[lightIndex]) {
                lightsArray[lightIndex].style.opacity = '1';
                lightsArray[lightIndex].style.transform = 'scale(1.2)';
            }
        }

        // Move position forward
        position = (position + 1) % lightsArray.length;
    }, 100);

    lightIntervals.push(interval);
}

// Color groups mode - lights of the same color blink together
function applyColorGroupsMode(lights) {
    const lightsArray = Array.from(lights);
    const colorGroups = {};

    // Group lights by color
    lightsArray.forEach(light => {
        const color = light.dataset.color;
        if (!colorGroups[color]) {
            colorGroups[color] = [];
        }
        colorGroups[color].push(light);
    });

    // Turn all lights dim initially
    lightsArray.forEach(light => {
        light.style.opacity = '0.3';
        light.style.transform = 'scale(0.8)';
    });

    // Iterate through color groups
    let colorIndex = 0;
    const colorKeys = Object.keys(colorGroups);

    const interval = setInterval(() => {
        // Reset all lights
        lightsArray.forEach(light => {
            light.style.opacity = '0.3';
            light.style.transform = 'scale(0.8)';
        });

        // Activate current color group
        const currentColor = colorKeys[colorIndex];
        if (colorGroups[currentColor]) {
            colorGroups[currentColor].forEach(light => {
                light.style.opacity = '1';
                light.style.transform = 'scale(1.2)';
            });
        }

        // Move to next color
        colorIndex = (colorIndex + 1) % colorKeys.length;
    }, 500);

    lightIntervals.push(interval);
}

// Heartbeat mode - pulse like a heartbeat
function applyHeartbeatMode(lights) {
    const lightsArray = Array.from(lights);

    // Set all lights to a dim state initially
    lightsArray.forEach(light => {
        light.style.opacity = '0.3';
        light.style.transform = 'scale(0.8)';
    });

    let step = 0;
    const interval = setInterval(() => {
        if (step === 0 || step === 2) {
            // First or second pulse - lights on
            lightsArray.forEach(light => {
                light.style.opacity = '1';
                light.style.transform = 'scale(1.2)';
            });
        } else if (step === 1) {
            // Brief pause between pulses
            lightsArray.forEach(light => {
                light.style.opacity = '0.5';
                light.style.transform = 'scale(1)';
            });
        } else {
            // Longer pause after second pulse
            lightsArray.forEach(light => {
                light.style.opacity = '0.3';
                light.style.transform = 'scale(0.8)';
            });
        }

        // Advance to next step in heartbeat pattern
        step = (step + 1) % 4;
    }, 400);

    lightIntervals.push(interval);
}

// Morse code mode - "HO HO HO" in Morse code
function applyMorseCodeMode(lights) {
    const lightsArray = Array.from(lights);

    // "HO HO HO" in Morse code: .... --- / .... --- / .... ---
    const morsePattern = [
        1, 0, 1, 0, 1, 0, 1, 0, // H (4 dots)
        2, 0, 2, 0, 2, 0, // O (3 dashes)
        0, 0, // Space
        1, 0, 1, 0, 1, 0, 1, 0, // H
        2, 0, 2, 0, 2, 0, // O
        0, 0, // Space
        1, 0, 1, 0, 1, 0, 1, 0, // H
        2, 0, 2, 0, 2, 0, // O
    ];

    // Set all lights off initially
    lightsArray.forEach(light => {
        light.style.opacity = '0.3';
        light.style.transform = 'scale(0.8)';
    });

    let patternIndex = 0;

    const interval = setInterval(() => {
        const currentCode = morsePattern[patternIndex];

        if (currentCode === 1) {
            // Dot - short flash
            lightsArray.forEach(light => {
                light.style.opacity = '1';
                light.style.transform = 'scale(1.2)';
            });

            setTimeout(() => {
                lightsArray.forEach(light => {
                    light.style.opacity = '0.3';
                    light.style.transform = 'scale(0.8)';
                });
            }, 250); // Short duration for dot

        } else if (currentCode === 2) {
            // Dash - longer flash
            lightsArray.forEach(light => {
                light.style.opacity = '1';
                light.style.transform = 'scale(1.2)';
            });

            setTimeout(() => {
                lightsArray.forEach(light => {
                    light.style.opacity = '0.3';
                    light.style.transform = 'scale(0.8)';
                });
            }, 550); // Longer duration for dash
        }

        // Move to next part of pattern
        patternIndex = (patternIndex + 1) % morsePattern.length;
    }, 650);

    lightIntervals.push(interval);
}

// Rainbow mode - lights change colors in sequence
function applyRainbowMode(lights) {
    const lightsArray = Array.from(lights);
    const rainbowColors = [
        '#ff0000', // Red
        '#ff7f00', // Orange
        '#ffff00', // Yellow
        '#00ff00', // Green
        '#0000ff', // Blue
        '#4b0082', // Indigo
        '#9400d3'  // Violet
    ];

    // Set initial state
    lightsArray.forEach((light, index) => {
        const initialColorIndex = index % rainbowColors.length;
        light.style.backgroundColor = rainbowColors[initialColorIndex];
        light.style.boxShadow = `0 0 5px ${rainbowColors[initialColorIndex]}, 0 0 10px ${rainbowColors[initialColorIndex]}`;
    });

    let step = 0;
    const interval = setInterval(() => {
        lightsArray.forEach((light, index) => {
            const colorIndex = (index + step) % rainbowColors.length;
            light.style.backgroundColor = rainbowColors[colorIndex];
            light.style.boxShadow = `0 0 5px ${rainbowColors[colorIndex]}, 0 0 10px ${rainbowColors[colorIndex]}`;
        });

        step = (step + 1) % rainbowColors.length;
    }, 200);

    lightIntervals.push(interval);
}

// Cascade mode - twinkling starts at one end and cascades
function applyCascadeMode(lights) {
    const lightsArray = Array.from(lights);
    const numLights = lightsArray.length;
    let wavePosition = 0;
    const waveWidth = Math.floor(numLights / 4); // Wave spans about 1/4 of the lights

    // Turn all lights to dim initially
    lightsArray.forEach(light => {
        light.style.opacity = '0.3';
        light.style.transform = 'scale(0.8)';
    });

    const interval = setInterval(() => {
        // Reset all lights
        lightsArray.forEach(light => {
            light.style.opacity = '0.3';
            light.style.transform = 'scale(0.8)';
        });

        // Create the wave effect
        for (let i = 0; i < waveWidth; i++) {
            const pos = (wavePosition + i) % numLights;
            // Calculate intensity based on position in wave (brightest at center)
            const intensity = 1 - Math.abs((i - waveWidth / 2) / (waveWidth / 2));

            if (lightsArray[pos]) {
                lightsArray[pos].style.opacity = Math.max(0.3, intensity).toString();
                lightsArray[pos].style.transform = `scale(${0.8 + 0.4 * intensity})`;
            }
        }

        // Move the wave
        wavePosition = (wavePosition + 1) % numLights;
    }, 100);

    lightIntervals.push(interval);
}

// Add lights to the Christmas tree
function decorateTreeWithLights() {
    const tree = document.querySelector('.mini-tree');
    const lightColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ffffff'];
    const positions = [
        { top: '20%', left: '20%' },
        { top: '20%', left: '80%' },
        { top: '40%', left: '30%' },
        { top: '40%', left: '70%' },
        { top: '60%', left: '20%' },
        { top: '60%', left: '80%' },
        { top: '80%', left: '30%' },
        { top: '80%', left: '70%' },
        { top: '30%', left: '50%' },
        { top: '50%', left: '40%' },
        { top: '70%', left: '60%' }
    ];

    // Clear existing tree lights
    document.querySelectorAll('.tree-light').forEach(light => light.remove());

    // Add new lights
    positions.forEach((pos, i) => {
        const light = document.createElement('div');
        light.className = 'tree-light';
        light.style.top = pos.top;
        light.style.left = pos.left;

        const color = lightColors[i % lightColors.length];
        light.style.backgroundColor = color;
        light.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;

        // Random animation
        const animDelay = Math.random() * 3;
        const animDuration = 1 + Math.random() * 2;
        light.style.animation = `pulse ${animDuration}s infinite ${animDelay}s`;

        tree.appendChild(light);
    });
}

// Create snowflakes
function createSnowflakes() {
    // Clear existing snowflakes first
    document.querySelectorAll('.snowflake').forEach(flake => flake.remove());

    const snowflakeChars = ['❄', '❅', '❆', '*'];
    const numFlakes = 50; // Increased number of snowflakes

    for (let i = 0; i < numFlakes; i++) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.innerHTML = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
        flake.style.fontSize = (Math.random() * 20 + 10) + 'px'; // Larger snowflakes
        flake.style.opacity = Math.random() * 0.7 + 0.3;
        flake.style.left = Math.random() * 100 + '%';

        // Different animation duration for each snowflake
        const animationDuration = Math.random() * 15 + 10;
        flake.style.animationDuration = animationDuration + 's';

        // Random animation delay
        flake.style.animationDelay = Math.random() * 5 + 's';

        document.body.appendChild(flake);

        // Make sure it's visible if Christmas mode is enabled
        if (christmasModeEnabled || combinedModeEnabled) {
            flake.style.display = 'block';
        }
    }
}

// Function to toggle Christmas mode
function toggleChristmasMode() {
    // Disable other modes if they're enabled
    if (halloweenModeEnabled) {
        toggleHalloweenMode();
    }
    if (combinedModeEnabled) {
        toggleCombinedMode();
    }

    christmasModeEnabled = !christmasModeEnabled;

    const toggleButton = document.getElementById('christmas-toggle');
    const lightModeControl = document.getElementById('light-mode-control');
    const miniTree = document.querySelector('.mini-tree');
    const christmasHat = document.querySelector('.christmas-hat');
    const lightsContainer = document.getElementById('lights-container');

    if (christmasModeEnabled) {
        // Enable Christmas mode
        toggleButton.textContent = 'Disable Christmas Mode';
        toggleButton.style.backgroundColor = '#00aa00'; // Green button

        // Create and show Christmas elements
        createSnowflakes();
        createChristmasLights();

        // Show elements
        lightModeControl.style.display = 'block';
        miniTree.style.display = 'block';
        christmasHat.style.display = 'block';
        lightsContainer.style.display = 'block';

        // Show snowflakes
        document.querySelectorAll('.snowflake').forEach(flake => {
            flake.style.display = 'block';
        });

    } else {
        // Disable Christmas mode
        toggleButton.textContent = 'Enable Christmas Mode';
        toggleButton.style.backgroundColor = '#ff0000'; // Red button

        // Hide Christmas elements
        lightModeControl.style.display = 'none';
        miniTree.style.display = 'none';
        christmasHat.style.display = 'none';
        lightsContainer.style.display = 'none';
        document.querySelector('.light-cord').style.display = 'none';

        // Clear light animations
        clearLightIntervals();

        // Hide snowflakes
        document.querySelectorAll('.snowflake').forEach(flake => {
            flake.style.display = 'none';
        });
    }
}

// Function to toggle Halloween mode
function toggleHalloweenMode() {
    // Disable other modes if they're enabled
    if (christmasModeEnabled) {
        toggleChristmasMode();
    }
    if (combinedModeEnabled) {
        toggleCombinedMode();
    }

    halloweenModeEnabled = !halloweenModeEnabled;

    const toggleButton = document.getElementById('halloween-toggle');
    const halloweenLightControl = document.getElementById('halloween-light-control');
    const pumpkinPatch = document.getElementById('pumpkin-patch');
    const witchHat = document.querySelector('.witch-hat');
    const halloweenLightsContainer = document.getElementById('halloween-lights-container');
    const ghosts = document.querySelectorAll('.ghost');
    const spiderWeb = document.getElementById('spider-web');
    const fogEffect = document.getElementById('fog-effect');

    if (halloweenModeEnabled) {
        // Enable Halloween mode
        toggleButton.textContent = 'Disable Halloween Mode';
        toggleButton.style.backgroundColor = '#6600cc'; // Purple button

        // Create and show Halloween elements
        createHalloweenElements();
        createHalloweenLights();

        // Show elements
        halloweenLightControl.style.display = 'block';
        pumpkinPatch.style.display = 'block';
        witchHat.style.display = 'block';
        halloweenLightsContainer.style.display = 'block';
        spiderWeb.style.display = 'block';

        // Show ghosts
        ghosts.forEach(ghost => {
            ghost.style.display = 'block';
        });

        // Show falling elements
        document.querySelectorAll('.halloween-element').forEach(element => {
            element.style.display = 'block';
        });

        // Show fog effect
        fogEffect.style.opacity = '1';
    } else {
        // Disable Halloween mode
        toggleButton.textContent = 'Enable Halloween Mode';
        toggleButton.style.backgroundColor = '#ff6600'; // Orange button

        // Hide Halloween elements
        halloweenLightControl.style.display = 'none';
        pumpkinPatch.style.display = 'none';
        witchHat.style.display = 'none';
        halloweenLightsContainer.style.display = 'none';
        spiderWeb.style.display = 'none';
        document.querySelector('.halloween-light-cord').style.display = 'none';

        // Clear light animations
        clearHalloweenLightIntervals();

        // Hide ghosts
        ghosts.forEach(ghost => {
            ghost.style.display = 'none';
        });

        // Hide falling elements
        document.querySelectorAll('.halloween-element').forEach(element => {
            element.style.display = 'none';
        });

        // Hide fog effect
        fogEffect.style.opacity = '0';
    }
}

// Function to toggle combined mode
function toggleCombinedMode() {
    // Disable other modes if they're enabled
    if (christmasModeEnabled) {
        toggleChristmasMode();
    }
    if (halloweenModeEnabled) {
        toggleHalloweenMode();
    }
    
    combinedModeEnabled = !combinedModeEnabled;
    
    const toggleButton = document.getElementById('combined-toggle');
    const combinedLightControl = document.getElementById('combined-light-control');
    const dualHat = document.querySelector('.dual-hat');
    const combinedCorner = document.getElementById('combined-corner');
    
    if (combinedModeEnabled) {
        // Enable combined mode
        toggleButton.textContent = 'Disable Combined Mode';
        toggleButton.style.background = 'linear-gradient(to right, #00aa00, #6600cc)';
        
        // Create and show combined elements
        createDualEffects();
        
        // Show elements
        combinedLightControl.style.display = 'block';
        dualHat.style.display = 'block';
        combinedCorner.style.display = 'block';
        
        // Show both Christmas and Halloween elements
        document.querySelectorAll('.snowflake').forEach(flake => {
            flake.style.display = 'block';
        });
        document.querySelectorAll('.halloween-element').forEach(element => {
            element.style.display = 'block';
        });
        
        // Show lights from both themes
        document.getElementById('lights-container').style.display = 'block';
        document.querySelector('.light-cord').style.display = 'block';
        document.getElementById('halloween-lights-container').style.display = 'block';
        document.querySelector('.halloween-light-cord').style.display = 'block';
        
        // Enable fog with reduced opacity
        document.getElementById('fog-effect').style.opacity = '0.5';
        
        // Show ghosts
        document.querySelectorAll('.ghost').forEach(ghost => {
            ghost.style.display = 'block';
        });
        
        // Show spider web
        document.getElementById('spider-web').style.display = 'block';
    } else {
        // Disable combined mode
        toggleButton.textContent = 'Enable Combined Mode';
        toggleButton.style.background = 'linear-gradient(to right, #ff0000, #ff6600)';
        
        // Hide combined elements
        combinedLightControl.style.display = 'none';
        dualHat.style.display = 'none';
        combinedCorner.style.display = 'none';
        
        // Hide Christmas elements
        document.getElementById('lights-container').style.display = 'none';
        document.querySelector('.light-cord').style.display = 'none';
        document.querySelectorAll('.snowflake').forEach(flake => {
            flake.style.display = 'none';
        });
        
        // Hide Halloween elements
        document.getElementById('halloween-lights-container').style.display = 'none';
        document.querySelector('.halloween-light-cord').style.display = 'none';
        document.querySelectorAll('.halloween-element').forEach(element => {
            element.style.display = 'none';
        });
        document.querySelectorAll('.ghost').forEach(ghost => {
            ghost.style.display = 'none';
        });
        document.getElementById('spider-web').style.display = 'none';
        document.getElementById('fog-effect').style.opacity = '0';
        
        // Clear light animations
        clearCombinedLightIntervals();
    }
}

// Create dual effects (snowflakes and halloween elements)
function createDualEffects() {
    // Create both types of elements
    createSnowflakes();
    createHalloweenElements();
    
    // Create lights for both themes
    createChristmasLights();
    createHalloweenLights();
    
    // Apply combined light mode
    setCombinedLightMode(currentCombinedLightMode);
    
    // Create combined corner decoration
    createCombinedCorner();
}

// Create combined corner decoration (tree with pumpkins)
function createCombinedCorner() {
    const combinedCorner = document.getElementById('combined-corner');
    
    // Clear existing decorations
    combinedCorner.innerHTML = '';
    
    // Create mini tree (same as Christmas tree)
    const miniTree = document.createElement('div');
    miniTree.className = 'mini-tree';
    miniTree.style.display = 'block';
    
    // Tree parts
    for (let i = 0; i < 3; i++) {
        const treePart = document.createElement('div');
        treePart.className = 'tree-part';
        miniTree.appendChild(treePart);
    }
    
    // Tree trunk
    const treeTrunk = document.createElement('div');
    treeTrunk.className = 'tree-trunk';
    miniTree.appendChild(treeTrunk);
    
    // Add tree to corner
    combinedCorner.appendChild(miniTree);
    
    // Create 2-3 pumpkins near the tree
    const numPumpkins = Math.floor(Math.random() * 2) + 2;
    
    for (let i = 0; i < numPumpkins; i++) {
        const pumpkin = document.createElement('div');
        pumpkin.className = 'pumpkin';
        
        // Position pumpkins around the tree
        pumpkin.style.left = (120 + Math.random() * 60) + 'px';
        pumpkin.style.bottom = (Math.random() * 30) + 'px';
        
        // Random size variation
        const sizeFactor = 0.8 + (Math.random() * 0.4);
        pumpkin.style.transform = `scale(${sizeFactor})`;
        
        // Create stem
        const stem = document.createElement('div');
        stem.className = 'pumpkin-stem';
        pumpkin.appendChild(stem);
        
        // Create face
        const face = document.createElement('div');
        face.className = 'pumpkin-face';
        
        // Eyes
        const eyes = document.createElement('div');
        eyes.className = 'pumpkin-eyes';
        
        const eyeLeft = document.createElement('div');
        eyeLeft.className = 'pumpkin-eye';
        
        const eyeRight = document.createElement('div');
        eyeRight.className = 'pumpkin-eye';
        
        eyes.appendChild(eyeLeft);
        eyes.appendChild(eyeRight);
        
        // Mouth
        const mouth = document.createElement('div');
        mouth.className = 'pumpkin-mouth';
        
        // Random face shape
        if (Math.random() > 0.5) {
            // Triangle eyes
            eyeLeft.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
            eyeRight.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
        }
        
        if (Math.random() > 0.5) {
            // Zigzag mouth
            mouth.style.clipPath = 'polygon(0% 0%, 25% 100%, 50% 0%, 75% 100%, 100% 0%)';
        }
        
        face.appendChild(eyes);
        face.appendChild(mouth);
        pumpkin.appendChild(face);
        
        combinedCorner.appendChild(pumpkin);
    }
    
    // Add tree lights similar to Christmas tree decoration
    decorateCombinedTree();
}

// Decorate combined tree with both themed lights
function decorateCombinedTree() {
    const combinedCorner = document.getElementById('combined-corner');
    
    // Combined colors from both themes
    const lightColors = [
        '#ff0000', // Red (Christmas)
        '#00ff00', // Green (Christmas)
        '#ffff00', // Yellow (Christmas)
        '#ff6600', // Orange (Halloween)
        '#6600cc', // Purple (Halloween)
        '#00cc00'  // Toxic green (Halloween)
    ];
    
    // Similar positions as the Christmas tree
    const positions = [
        { top: '20%', left: '50%' },
        { top: '30%', left: '30%' },
        { top: '30%', left: '70%' },
        { top: '50%', left: '40%' },
        { top: '50%', left: '60%' },
        { top: '70%', left: '30%' },
        { top: '70%', left: '70%' },
        { top: '85%', left: '50%' }
    ];
    
    // Create lights
    positions.forEach((pos, i) => {
        const light = document.createElement('div');
        light.className = 'tree-light';
        light.style.top = pos.top;
        light.style.left = pos.left;
        
        // Alternating Christmas and Halloween colors
        const color = lightColors[i % lightColors.length];
        light.style.backgroundColor = color;
        light.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
        
        // Random animation
        const animDelay = Math.random() * 3;
        const animDuration = 1 + Math.random() * 2;
        light.style.animation = `pulse ${animDuration}s infinite ${animDelay}s`;
        
        combinedCorner.appendChild(light);
    });
}

// Combined light modes
function setCombinedLightMode(mode) {
    currentCombinedLightMode = mode;
    document.getElementById('combined-light-label').textContent = `Light Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
    
    // Clear previous animations
    clearCombinedLightIntervals();
    clearLightIntervals();
    clearHalloweenLightIntervals();
    
    const christmasLights = document.querySelectorAll('.christmas-light');
    const halloweenLights = document.querySelectorAll('.halloween-light');
    
    // Reset all lights
    [...christmasLights, ...halloweenLights].forEach(light => {
        light.style.animation = '';
        light.style.animationDelay = '';
        light.style.opacity = '1';
        light.style.transform = 'scale(1)';
    });
    
    switch (mode) {
        case 'fusion':
            applyFusionMode(christmasLights, halloweenLights);
            break;
        case 'alternating':
            applyAlternatingThemeMode(christmasLights, halloweenLights);
            break;
        case 'dualtone':
            applyDualtoneMode(christmasLights, halloweenLights);
            break;
        case 'chaotic':
            applyChaoticMode(christmasLights, halloweenLights);
            break;
        case 'seasonal':
            applySeasonalMode(christmasLights, halloweenLights);
            break;
        case 'festive':
            applyFestiveMode(christmasLights, halloweenLights);
            break;
        case 'spookymas':
            applySpookymasMode(christmasLights, halloweenLights);
            break;
        case 'candycane':
            applyCandycaneMode(christmasLights, halloweenLights);
            break;
        case 'haunted':
            applyHauntedMode(christmasLights, halloweenLights);
            break;
    }
}

// Fusion mode - synchronized pulses across all lights
function applyFusionMode(christmasLights, halloweenLights) {
    const allLights = [...christmasLights, ...halloweenLights];
    
    let pulseState = true;
    const interval = setInterval(() => {
        allLights.forEach(light => {
            if (pulseState) {
                light.style.opacity = '1';
                light.style.transform = 'scale(1.2)';
            } else {
                light.style.opacity = '0.4';
                light.style.transform = 'scale(0.8)';
            }
        });
        
        pulseState = !pulseState;
    }, 800);
    
    combinedLightIntervals.push(interval);
}

// Alternating theme mode - Christmas and Halloween lights alternate
function applyAlternatingThemeMode(christmasLights, halloweenLights) {
    let christmasActive = true;
    
    const interval = setInterval(() => {
        if (christmasActive) {
            // Activate Christmas lights
            christmasLights.forEach(light => {
                light.style.opacity = '1';
                light.style.transform = 'scale(1.2)';
            });
            
            // Dim Halloween lights
            halloweenLights.forEach(light => {
                light.style.opacity = '0.3';
                light.style.transform = 'scale(0.8)';
            });
        } else {
            // Activate Halloween lights
            halloweenLights.forEach(light => {
                light.style.opacity = '1';
                light.style.transform = 'scale(1.2)';
            });
            
            // Dim Christmas lights
            christmasLights.forEach(light => {
                light.style.opacity = '0.3';
                light.style.transform = 'scale(0.8)';
            });
        }
        
        christmasActive = !christmasActive;
    }, 1000);
    
    combinedLightIntervals.push(interval);
}

// Dualtone mode - red/green for Christmas, orange/purple for Halloween simultaneously
function applyDualtoneMode(christmasLights, halloweenLights) {
    // Color patterns
    const christmasColors = ['#ff0000', '#00ff00']; // Red and green
    const halloweenColors = ['#ff6600', '#6600cc']; // Orange and purple
    
    // Set initial colors - alternating red/green for Christmas
    christmasLights.forEach((light, index) => {
        const color = christmasColors[index % 2];
        light.style.backgroundColor = color;
        light.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
    });
    
    // Set initial colors - alternating orange/purple for Halloween
    halloweenLights.forEach((light, index) => {
        const color = halloweenColors[index % 2];
        light.style.backgroundColor = color;
        light.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
    });
    
    // Alternating blink pattern for both sets
    let evenActive = true;
    const interval = setInterval(() => {
        [...christmasLights, ...halloweenLights].forEach((light, index) => {
            const isEven = index % 2 === 0;
            if (isEven === evenActive) {
                light.style.opacity = '1';
                light.style.transform = 'scale(1.2)';
            } else {
                light.style.opacity = '0.3';
                light.style.transform = 'scale(0.8)';
            }
        });
    
        evenActive = !evenActive;
    }, 500);

 combinedLightIntervals.push(interval);
}

// Chaotic mode - random flickering with combined colors
function applyChaoticMode(christmasLights, halloweenLights) {
    const allLights = [...christmasLights, ...halloweenLights];
    
    // Combined colors from both themes
    const combinedColors = [
        '#ff0000', // Red (Christmas)
        '#00ff00', // Green (Christmas)
        '#0000ff', // Blue (Christmas)
        '#ffff00', // Yellow (Christmas)
        '#ff6600', // Orange (Halloween)
        '#6600cc', // Purple (Halloween)
        '#00cc00', // Toxic green (Halloween)
        '#ffcc00'  // Pumpkin gold (Halloween)
    ];
    
    // Set random colors initially
    allLights.forEach(light => {
        const randomColor = combinedColors[Math.floor(Math.random() * combinedColors.length)];
        light.style.backgroundColor = randomColor;
        light.style.boxShadow = `0 0 5px ${randomColor}, 0 0 10px ${randomColor}`;
    });
    
    // Random chaotic changes
    const interval = setInterval(() => {
        allLights.forEach(light => {
            // 20% chance to change color
            if (Math.random() < 0.2) {
                const newColor = combinedColors[Math.floor(Math.random() * combinedColors.length)];
                light.style.backgroundColor = newColor;
                light.style.boxShadow = `0 0 5px ${newColor}, 0 0 10px ${newColor}`;
            }
            
            // 30% chance to change brightness
            if (Math.random() < 0.3) {
                light.style.opacity = (0.3 + Math.random() * 0.7).toString();
            }
            
            // 20% chance to change size
            if (Math.random() < 0.2) {
                light.style.transform = `scale(${0.8 + Math.random() * 0.4})`;
            }
        });
    }, 100);
    
    combinedLightIntervals.push(interval);
}

// Seasonal mode - Christmas and Halloween lights interact to tell a story
function applySeasonalMode(christmasLights, halloweenLights) {
    const allLights = [...christmasLights, ...halloweenLights];
    let step = 0;
    const totalSteps = 8;
    
    const interval = setInterval(() => {
        switch (step % totalSteps) {
            case 0: // Halloween starts (only Halloween lights)
                christmasLights.forEach(light => {
                    light.style.opacity = '0.1';
                });
                halloweenLights.forEach(light => {
                    light.style.opacity = '1';
                    light.style.transform = 'scale(1.2)';
                });
                break;
            case 1: // Halloween fades
                halloweenLights.forEach(light => {
                    light.style.opacity = '0.5';
                    light.style.transform = 'scale(1)';
                });
                break;
            case 2: // Transition - all lights dim
                allLights.forEach(light => {
                    light.style.opacity = '0.3';
                    light.style.transform = 'scale(0.8)';
                });
                break;
            case 3: // Christmas starts to appear
                christmasLights.forEach(light => {
                    light.style.opacity = '0.7';
                    light.style.transform = 'scale(1)';
                });
                break;
            case 4: // Christmas dominates
                christmasLights.forEach(light => {
                    light.style.opacity = '1';
                    light.style.transform = 'scale(1.2)';
                });
                halloweenLights.forEach(light => {
                    light.style.opacity = '0.1';
                });
                break;
            case 5: // Christmas fades a bit
                christmasLights.forEach(light => {
                    light.style.opacity = '0.5';
                    light.style.transform = 'scale(1)';
                });
                break;
            case 6: // Both combine
                allLights.forEach(light => {
                    light.style.opacity = '0.8';
                    light.style.transform = 'scale(1.1)';
                });
                break;
            case 7: // Big finale - all bright
                allLights.forEach(light => {
                    light.style.opacity = '1';
                    light.style.transform = 'scale(1.2)';
                });
                break;
        }
        
        step = (step + 1) % totalSteps;
    }, 1500);
    
    combinedLightIntervals.push(interval);
}

// Festive mode - joyful and bright theme
function applyFestiveMode(christmasLights, halloweenLights) {
    // Festive colors - bright and cheerful
    const festiveColors = [
        '#ff0000', // Red
        '#00ff00', // Green
        '#ffff00', // Yellow
        '#ff6600', // Orange
        '#ff00ff', // Pink
        '#00ffff'  // Cyan
    ];
    
    // Set festive colors
    [...christmasLights, ...halloweenLights].forEach((light, index) => {
        const color = festiveColors[index % festiveColors.length];
        light.style.backgroundColor = color;
        light.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
    });
    
    // Create a wave pattern across all lights
    const allLights = [...christmasLights, ...halloweenLights].sort((a, b) => {
        return parseInt(a.style.left) - parseInt(b.style.left);
    });
    
    // Wave animation
    allLights.forEach((light, index) => {
        // Calculation for wave effect
        const delay = (index * 0.1) % 3; // 0.1 second delay per light, repeat every 3 seconds
        light.style.animation = 'pulse 3s infinite';
        light.style.animationDelay = `${delay}s`;
    });
}

// Spooky Christmas mode - Christmas colors with Halloween patterns
function applySpookymasMode(christmasLights, halloweenLights) {
    const allLights = [...christmasLights, ...halloweenLights];
    
    // Christmas colors
    const christmasColors = ['#ff0000', '#00ff00', '#ffffff'];
    
    // Set Christmas colors on all lights
    allLights.forEach((light, index) => {
        const color = christmasColors[index % christmasColors.length];
        light.style.backgroundColor = color;
        light.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
    });
    
    // But use Halloween-style flickering
    allLights.forEach(light => {
        // Random flickering like the spooky mode
        const randomFlickerSpeed = 0.5 + Math.random() * 2;
        light.style.animation = `twinkle${Math.floor(Math.random() * 3) + 1} ${randomFlickerSpeed}s infinite`;
        light.style.animationDelay = (Math.random() * 2) + 's';
    });
    
    // Occasional random dimming like in spooky mode
    const interval = setInterval(() => {
        allLights.forEach(light => {
            if (Math.random() > 0.8) {
                light.style.opacity = Math.random() * 0.7 + 0.3;
            }
        });
    }, 200);
    
    combinedLightIntervals.push(interval);
}

// Candy Cane mode - red and white alternating pattern
function applyCandycaneMode(christmasLights, halloweenLights) {
    const allLights = [...christmasLights, ...halloweenLights].sort((a, b) => {
        return parseInt(a.style.left) - parseInt(b.style.left);
    });
    
    // Candy cane colors
    const candyCaneColors = ['#ff0000', '#ffffff']; // Red and white
    
    // Set alternating pattern
    allLights.forEach((light, index) => {
        const color = candyCaneColors[index % 2];
        light.style.backgroundColor = color;
        light.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
    });
    
    // Rotating pattern - lights move like on a barber pole
    let offset = 0;
    const interval = setInterval(() => {
        allLights.forEach((light, index) => {
            const colorIndex = (index + offset) % 2;
            const color = candyCaneColors[colorIndex];
            
            light.style.backgroundColor = color;
            light.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
            
            // Full brightness for all
            light.style.opacity = '1';
        });
        
        offset = (offset + 1) % 2;
    }, 500);
    
    combinedLightIntervals.push(interval);
}

// Haunted mode - flickering with thunder effects
function applyHauntedMode(christmasLights, halloweenLights) {
    const allLights = [...christmasLights, ...halloweenLights];
    
    // Spooky colors
    const hauntedColors = ['#66ccff', '#6600cc', '#00cc00'];
    
    // Set colors
    allLights.forEach((light, index) => {
        const color = hauntedColors[index % hauntedColors.length];
        light.style.backgroundColor = color;
        light.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
        
        // Set to dim initially
        light.style.opacity = '0.3';
        light.style.transform = 'scale(0.8)';
    });
    
    // Lightning flash effect
    function lightningFlash() {
        // All lights flash bright
        allLights.forEach(light => {
            light.style.opacity = '1';
            light.style.transform = 'scale(1.2)';
        });
        
        // Flash the background too
        document.getElementById('thunder-flash').style.animation = 'lightning-flash 1s';
        
        // Dim after short time
        setTimeout(() => {
            allLights.forEach(light => {
                light.style.opacity = '0.3';
                light.style.transform = 'scale(0.8)';
            });
            
            // Secondary flash sometimes
            if (Math.random() > 0.5) {
                setTimeout(() => {
                    allLights.forEach(light => {
                        light.style.opacity = '1';
                        light.style.transform = 'scale(1.2)';
                    });
                    
                    setTimeout(() => {
                        allLights.forEach(light => {
                            light.style.opacity = '0.3';
                            light.style.transform = 'scale(0.8)';
                        });
                    }, 100);
                }, 300);
            }
        }, 200);
        
        // Schedule next flash
        const nextFlash = 3000 + Math.random() * 10000; // 3-13 seconds
        if (combinedModeEnabled) {
            setTimeout(lightningFlash, nextFlash);
        }
    }
    
    // Start the lightning
    lightningFlash();
    
    // Random subtle flickers between lightning
    const interval = setInterval(() => {
        allLights.forEach(light => {
            if (Math.random() > 0.8) {
                light.style.opacity = (0.2 + Math.random() * 0.3).toString();
            }
        });
    }, 200);
    
    combinedLightIntervals.push(interval);
}
// Light mode slider
document.getElementById('light-mode-slider').addEventListener('input', function () {
    // Get mode based on slider value
    const modeIndex = parseInt(this.value);
    const selectedMode = lightModes[modeIndex];

    // Apply selected mode
    setLightMode(selectedMode);
});

// Halloween light mode slider
document.getElementById('halloween-light-slider').addEventListener('input', function () {
    // Get mode based on slider value
    const modeIndex = parseInt(this.value);
    const selectedMode = halloweenLightModes[modeIndex];

    // Apply selected mode
    setHalloweenLightMode(selectedMode);
});

// Combined light mode slider
document.getElementById('combined-light-slider').addEventListener('input', function() {
    // Get mode based on slider value
    const modeIndex = parseInt(this.value);
    const selectedMode = combinedLightModes[modeIndex];
    
    // Apply selected mode
    setCombinedLightMode(selectedMode);
});
// Add event listener to Christmas toggle button
document.getElementById('christmas-toggle').addEventListener('click', toggleChristmasMode);

// Add event listener to Halloween toggle button
document.getElementById('halloween-toggle').addEventListener('click', toggleHalloweenMode);

// Add event listener to combined toggle button
document.getElementById('combined-toggle').addEventListener('click', toggleCombinedMode);
// Initialize
window.addEventListener('load', function () {
    spawnSymbols();
});
