// PlayStation Theme Script - Optimized Version

// Performance optimization: Cache frequently accessed DOM elements
const domCache = {
    container: document.getElementById('container'),
    glow: {
        overlay: document.getElementById('glow-overlay')
    },
    christmas: {
        toggle: document.getElementById('christmas-toggle'),
        lightsContainer: document.getElementById('lights-container'),
        lightCord: document.querySelector('.light-cord'),
        miniTree: document.querySelector('.mini-tree'),
        hat: document.querySelector('.christmas-hat'),
        lightModeControl: document.getElementById('light-mode-control'),
        lightModeLabel: document.getElementById('light-mode-label'),
        lightModeSlider: document.getElementById('light-mode-slider')
    },
    halloween: {
        toggle: document.getElementById('halloween-toggle'),
        lightsContainer: document.getElementById('halloween-lights-container'),
        lightCord: document.querySelector('.halloween-light-cord'),
        pumpkinPatch: document.getElementById('pumpkin-patch'),
        witchHat: document.querySelector('.witch-hat'),
        lightModeControl: document.getElementById('halloween-light-control'),
        lightModeLabel: document.getElementById('halloween-light-label'),
        lightModeSlider: document.getElementById('halloween-light-slider'),
        ghosts: document.querySelectorAll('.ghost'),
        spiderWeb: document.getElementById('spider-web'),
        fogEffect: document.getElementById('fog-effect'),
        thunderFlash: document.getElementById('thunder-flash')
    },
    combined: {
        toggle: document.getElementById('combined-toggle'),
        lightModeControl: document.getElementById('combined-light-control'),
        lightModeLabel: document.getElementById('combined-light-label'),
        lightModeSlider: document.getElementById('combined-light-slider'),
        dualHat: document.querySelector('.dual-hat'),
        corner: document.getElementById('combined-corner')
    },
    clock: document.getElementById('clock'),
    youtubePlayer: document.getElementById('youtubePlayer'),
    youtubePlayer2: document.getElementById('youtubePlayer2')
};

// State management - centralize all state variables
const state = {
    modes: {
        christmas: false,
        halloween: false,
        combined: false
    },
    lights: {
        christmas: {
            mode: 'random',
            modes: ['random', 'sequential', 'alternating', 'wave', 'chasing', 'colorgroups', 'heartbeat', 'morse', 'rainbow', 'cascade'],
            intervals: []
        },
        halloween: {
            mode: 'spooky',
            modes: ['spooky', 'flicker', 'pulse', 'thunder', 'colorshift', 'witch', 'zombie'],
            intervals: []
        },
        combined: {
            mode: 'fusion',
            modes: ['fusion', 'alternating', 'dualtone', 'chaotic', 'seasonal', 'festive', 'spookymas', 'candycane', 'haunted'],
            intervals: []
        }
    },
    glow: {
        active: false,
        interval: null
    },
    youtube: {
        player1Ready: false,
        player2Ready: false
    },
    symbols: {
        active: [],
        data: [],
        timer: null,
        maxSymbols: 30, // Performance: Limit max symbols on screen
        minSpacing: 200
    }
};

// Colors configuration
const colors = {
    neon: [
        '#ff00ff', // Magenta
        '#00ffff', // Cyan
        '#ffff00', // Yellow
        '#00ff00', // Lime
        '#ff0000', // Red
        '#0000ff', // Blue
        '#ff8000', // Orange
        '#ff00cc', // Pink
        '#00ff9c'  // Aqua
    ],
    christmas: [
        '#ff0000', // Red
        '#00ff00', // Green
        '#FFD700', // Gold
        '#ffffff', // White
        '#E6252C'  // Christmas Red
    ],
    halloween: [
        '#ff6600', // Orange
        '#6600cc', // Purple
        '#00cc00', // Toxic green
        '#ff0000', // Blood red
        '#66ccff', // Ghost blue
        '#ffcc00'  // Pumpkin gold
    ]
};

// Optimization: Pre-generate SVG filter templates
const svgFilterTemplates = {
    inactive: id => `
        <filter id="inactive-filter-${id}">
            <feGaussianBlur stdDeviation="0.3" result="blur"/>
            <feSpecularLighting result="specOut" specularExponent="20" lighting-color="#ffffff">
                <fePointLight x="50" y="50" z="300"/>
            </feSpecularLighting>
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="0.3" k3="0.3" k4="0"/>
        </filter>
    `,
    glow: id => `
        <filter id="glow-${id}">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    `,
    blueGlow: id => `
        <filter id="blue-glow-${id}">
            <feGaussianBlur stdDeviation="5.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    `,
    orangeGlow: id => `
        <filter id="orange-glow-${id}">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    `,
    purpleGlow: id => `
        <filter id="purple-glow-${id}">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    `,
    greenGlow: id => `
        <filter id="green-glow-${id}">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    `,
    redGlow: id => `
        <filter id="red-glow-${id}">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    `
};

// Performance optimization: Pre-hide YouTube player elements
document.addEventListener('DOMContentLoaded', function() {
    // Create a style element to hide YouTube players
    const style = document.createElement('style');
    style.innerHTML = `
        #youtubePlayer, #youtubePlayer2, iframe[src*="youtube.com"] {
            position: fixed !important;
            left: -9999px !important;
            top: -9999px !important;
            width: 1px !important;
            height: 1px !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            z-index: -9999 !important;
        }
    `;
    document.head.appendChild(style);
    
    // Pre-create player containers
    createOrStyleElement('youtubePlayer', 'div', 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;visibility:hidden;pointer-events:none;z-index:-9999;');
    createOrStyleElement('youtubePlayer2', 'div', 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;visibility:hidden;pointer-events:none;z-index:-9999;');
    
    // Initialize the clock
    updateClock();
    setInterval(updateClock, 1000);

    // Start auto-toggling glow
    autoToggleGlow();
});

// Helper function to create or style an element
function createOrStyleElement(id, tagName, styleString) {
    let element = document.getElementById(id);
    if (!element) {
        element = document.createElement(tagName);
        element.id = id;
        document.body.appendChild(element);
    }
    element.style.cssText = styleString;
    return element;
}

// Hide YouTube players completely
function hideYouTubePlayers() {
    ['youtubePlayer', 'youtubePlayer2'].forEach(id => {
        const player = document.getElementById(id);
        if (player) {
            player.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;visibility:hidden;pointer-events:none;z-index:-1;';
        }
    });
}

// Update clock display
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    domCache.clock.textContent = displayHours + ':' + minutes + " " + period;
}

// PERFORMANCE OPTIMIZATION: Use requestAnimationFrame for animations
function autoToggleGlow() {
    state.glow.active = !state.glow.active;
    domCache.glow.overlay.style.opacity = state.glow.active ? '1' : '0';
    
    // Schedule next toggle using timeout and requestAnimationFrame
    state.glow.interval = setTimeout(() => {
        requestAnimationFrame(autoToggleGlow);
    }, 1500);
}

// Keyboard event listeners for controls
document.addEventListener('keydown', function(event) {
    // Music control
    if (event.key === '4') {
        if (state.youtube.player1Ready && window.player) {
            if (state.youtube.player2Ready && window.player2) {
                window.player2.pauseVideo();
            }
            window.player.playVideo();
            console.log("Playing main music...");
        }
    } else if (event.key === 's' || event.key === 'S') {
        if (state.youtube.player1Ready && window.player) {
            window.player.pauseVideo();
        }
        if (state.youtube.player2Ready && window.player2) {
            window.player2.pauseVideo();
        }
        console.log("Music stopped.");
    } else if (event.key === '5') {
        if (state.youtube.player2Ready && window.player2) {
            if (state.youtube.player1Ready && window.player) {
                window.player.pauseVideo();
            }
            window.player2.playVideo();
            console.log("Playing alternate music...");
        }
    } else if (event.key === 'g' || event.key === 'G') {
        state.glow.active = !state.glow.active;
        domCache.glow.overlay.style.opacity = state.glow.active ? '1' : '0';
    }
});

// YouTube player initialization
window.onYouTubeIframeAPIReady = function() {
    // First player (original)
    window.player = new YT.Player('youtubePlayer', {
        width: '1',
        height: '1',
        videoId: 'sUOzplfB9ps',
        playerVars: {
            'autoplay': 0,
            'loop': 1,
            'playlist': 'sUOzplfB9ps',
            'controls': 0,
            'showinfo': 0,
            'rel': 0,
            'fs': 0,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
    
    // Second player (new video)
    window.player2 = new YT.Player('youtubePlayer2', {
        width: '1',
        height: '1',
        videoId: 'hxpuusU8sTM',
        playerVars: {
            'autoplay': 0,
            'loop': 1,
            'playlist': 'hxpuusU8sTM',
            'controls': 0,
            'showinfo': 0,
            'rel': 0,
            'fs': 0,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayer2Ready,
            'onStateChange': onPlayer2StateChange
        }
    });
};

function onPlayerReady(event) {
    state.youtube.player1Ready = true;
    hidePlayerIframe(event.target);
    console.log("YouTube player is ready. Press '4' to start playing.");
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        window.player.playVideo();
    }
}

function onPlayer2Ready(event) {
    state.youtube.player2Ready = true;
    hidePlayerIframe(event.target);
    console.log("Second YouTube player is ready. Press '5' to start playing.");
}

function onPlayer2StateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        window.player2.playVideo();
    }
}

function hidePlayerIframe(player) {
    if (player.getIframe) {
        const iframe = player.getIframe();
        if (iframe) {
            iframe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;visibility:hidden;pointer-events:none;z-index:-9999;';
        }
    }
}

// Helper function to get random colors
function getRandomColors(count) {
    let colorsToUse = colors.neon;

    if (state.modes.christmas) {
        colorsToUse = [...colors.neon, ...colors.christmas];
    } else if (state.modes.halloween) {
        colorsToUse = [...colors.neon, ...colors.halloween];
    } else if (state.modes.combined) {
        colorsToUse = [...colors.neon, ...colors.christmas, ...colors.halloween];
    }

    // Performance optimization: Use Set for unique colors
    const usedIndices = new Set();
    const selectedColors = [];
    
    while (selectedColors.length < count && usedIndices.size < colorsToUse.length) {
        const randomIndex = Math.floor(Math.random() * colorsToUse.length);
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            selectedColors.push(colorsToUse[randomIndex]);
        }
    }
    
    // Fill remaining if needed
    while (selectedColors.length < count) {
        selectedColors.push(colorsToUse[Math.floor(Math.random() * colorsToUse.length)]);
    }
    
    return selectedColors;
}

// Calculate distance between two points
function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

// Update all symbols' active segments simultaneously
function updateAllSymbols() {
    state.symbols.data.forEach(symbolData => {
        const { svgParts, symbolId } = symbolData;
        
        // Performance optimization: Batch DOM operations
        // Reset all parts of this symbol
        svgParts.forEach(({ element }) => {
            element.setAttribute('stroke', '#333333');
            element.classList.remove('neon-glow');
            element.classList.add('lamp-texture');
            element.setAttribute('filter', `url(#inactive-filter-${symbolId})`);
            element.setAttribute('stroke-width', '1');
        });

        // Activate current part
        const currentPart = svgParts[symbolData.activePartIndex];
        const currentColor = currentPart.color;
        
        // Apply appropriate filter based on color and mode
        let filter = `url(#glow-${symbolId})`;
        let strokeWidth = '2';
        
        if (currentColor === '#0000ff') {
            filter = `url(#blue-glow-${symbolId})`;
            strokeWidth = '2.5';
        } else if ((state.modes.halloween || state.modes.combined) && currentColor === '#ff6600') {
            filter = `url(#orange-glow-${symbolId})`;
            strokeWidth = '2.5';
        } else if ((state.modes.halloween || state.modes.combined) && currentColor === '#6600cc') {
            filter = `url(#purple-glow-${symbolId})`;
            strokeWidth = '2.5';
        } else if ((state.modes.christmas || state.modes.combined) && currentColor === '#00ff00') {
            filter = `url(#green-glow-${symbolId})`;
            strokeWidth = '2.5';
        } else if ((state.modes.christmas || state.modes.combined) && 
                   (currentColor === '#ff0000' || currentColor === '#E6252C')) {
            filter = `url(#red-glow-${symbolId})`;
            strokeWidth = '2.5';
        }
        
        // Apply all changes at once to minimize DOM operations
        currentPart.element.setAttribute('stroke', currentColor);
        currentPart.element.classList.add('neon-glow');
        currentPart.element.classList.remove('lamp-texture');
        currentPart.element.setAttribute('filter', filter);
        currentPart.element.setAttribute('stroke-width', strokeWidth);

        // Move to next part for next update
        symbolData.activePartIndex = (symbolData.activePartIndex + 1) % svgParts.length;
    });
    
    // Schedule next update using setTimeout and requestAnimationFrame
    if (state.symbols.data.length > 0) {
        state.symbols.timer = setTimeout(() => {
            requestAnimationFrame(updateAllSymbols);
        }, 500);
    }
}

// Start the global timer if it's not already running
function startGlobalTimer() {
    if (state.symbols.timer === null && state.symbols.data.length > 0) {
        requestAnimationFrame(updateAllSymbols);
    }
}

// Create a symbol with improved performance
function createSymbol(type) {
    // Performance optimization: Limit maximum number of active symbols
    if (state.symbols.active.length >= state.symbols.maxSymbols) {
        return;
    }

    const containerWidth = domCache.container.clientWidth;
    const containerHeight = domCache.container.clientHeight;

    // Generate a random position
    // Keep positions within 5-85% range to avoid edges
    let topPosition = 5 + Math.random() * 80;
    let attempts = 0;
    const maxAttempts = 5; // Reduced max attempts for performance

    // Try to find a position that's not too close to other symbols near the right edge
    while (attempts < maxAttempts) {
        let tooClose = false;

        // Performance optimization: Use a more efficient collision detection algorithm
        for (let i = 0; i < state.symbols.active.length; i++) {
            const symbolInfo = state.symbols.active[i];
            const symbolRightPosition = symbolInfo.rightPosition || containerWidth;
            
            // Only check symbols that are near the right edge
            if (symbolRightPosition > containerWidth - 300) {
                const symbolTopPixels = (containerHeight * symbolInfo.topPercentage) / 100;
                const posTopPixels = (containerHeight * topPosition) / 100;

                if (Math.abs(symbolTopPixels - posTopPixels) < state.symbols.minSpacing) {
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

    // Create SVG element using a more efficient approach
    const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const symbolId = 'symbol-' + Math.floor(Math.random() * 1000000);
    
    // Set attributes in one batch
    symbol.id = symbolId;
    symbol.className = 'ps-symbol';
    symbol.setAttribute('viewBox', '0 0 24 24');
    symbol.style.top = topPosition + '%';

    // Store information about this symbol
    state.symbols.active.push({
        id: symbolId,
        topPercentage: topPosition,
        rightPosition: containerWidth
    });

    // Use requestAnimationFrame for position updates
    function updateSymbolPosition() {
        const rect = symbol.getBoundingClientRect();
        
        // Find and update symbol position
        const symbolIndex = state.symbols.active.findIndex(s => s.id === symbolId);
        if (symbolIndex !== -1) {
            state.symbols.active[symbolIndex].rightPosition = rect.right;
        }

        if (rect.right > 0) {
            requestAnimationFrame(updateSymbolPosition);
        }
    }
    requestAnimationFrame(updateSymbolPosition);

    // Set up removal when animation ends
    symbol.addEventListener('animationend', () => {
        symbol.remove();
        
        // Remove from active symbols array
        state.symbols.active = state.symbols.active.filter(s => s.id !== symbolId);
        
        // Remove from symbolsData array
        state.symbols.data = state.symbols.data.filter(s => s.symbolId !== symbolId);
    });

    let parts = [];
    let colorSet = [];

    // Choose between normal, Christmas, Halloween or combined shapes based on mode
    if (state.modes.combined && Math.random() > 0.6) {
        // Combined themed symbols (mix of both themes)
        const combinedType = ['hybrid', 'mixed-icon', 'dual-color'][Math.floor(Math.random() * 3)];
        
        switch (combinedType) {
            case 'hybrid': // Christmas tree with pumpkin decorations
                colorSet = [...getRandomColors(2), colors.halloween[0]]; // Mix of colors
                parts = [
                    { x1: '12', y1: '4', x2: '12', y2: '20' }, // Tree trunk
                    { d: 'M12 4 L6 10 L18 10 Z' }, // Top part
                    { d: 'M12 8 L3 16 L21 16 Z' }  // Bottom part
                ];
                break;
            case 'mixed-icon': // Pumpkin with santa hat
                colorSet = [colors.halloween[0], colors.christmas[0], colors.christmas[3]]; // Orange, red, white
                parts = [
                    { d: 'M7 10 A5 7 0 0 0 17 10 L15 17 L9 17 Z' }, // Pumpkin body
                    { d: 'M7 6 L12 3 L17 6' }, // Santa hat
                    { d: 'M16 7 L18 7' } // Hat pom
                ];
                break;
            case 'dual-color': // PlayStation shapes in mixed Christmas/Halloween colors
                colorSet = [colors.christmas[0], colors.halloween[0], colors.christmas[1], colors.halloween[1]];
                
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
    } else if (state.modes.halloween && Math.random() > 0.5) {
        // Halloween themed symbols
        const halloweenType = ['pumpkin', 'ghost', 'bat', 'witch-hat', 'skull'][Math.floor(Math.random() * 5)];
        
        switch (halloweenType) {
            case 'pumpkin': // Jack-o'-lantern
                colorSet = [colors.halloween[0]]; // Orange
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
    } else if (state.modes.christmas && Math.random() > 0.5) {
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
    
    // Performance optimization: Create SVG defs using templates and innerHTML
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Combine all SVG filter templates
    defs.innerHTML = `
        ${svgFilterTemplates.inactive(symbolId)}
        ${svgFilterTemplates.glow(symbolId)}
        ${svgFilterTemplates.blueGlow(symbolId)}
        ${svgFilterTemplates.orangeGlow(symbolId)}
        ${svgFilterTemplates.purpleGlow(symbolId)}
        ${svgFilterTemplates.greenGlow(symbolId)}
        ${svgFilterTemplates.redGlow(symbolId)}
    `;
    
    symbol.appendChild(defs);

    // Create SVG parts
    let svgParts = parts.map((attrs, index) => {
        let element = document.createElementNS('http://www.w3.org/2000/svg', attrs.d ? 'path' : 'line');
        
        // Performance: Batch attribute setting
        for (const [key, value] of Object.entries(attrs)) {
            element.setAttribute(key, value);
        }
        
        // Basic styling
        element.setAttribute('stroke', '#333333');
        element.setAttribute('stroke-width', '1');
        element.setAttribute('stroke-linecap', 'round');
        element.setAttribute('filter', `url(#inactive-filter-${symbolId})`);
        element.classList.add('lamp-texture');
        element.setAttribute('fill', 'transparent');

        symbol.appendChild(element);
        return { element, color: colorSet[index % colorSet.length] };
    });

    // Add this symbol to the global symbolsData array
    state.symbols.data.push({
        symbolId,
        svgParts,
        activePartIndex: 0
    });

    // Make sure the global timer is running
    startGlobalTimer();

    // Add symbol to the DOM
    domCache.container.appendChild(symbol);
}

// Spawn symbols with throttling
function spawnSymbols() {
    // Only spawn a new symbol if we're under the limit
    if (state.symbols.active.length < state.symbols.maxSymbols) {
        const symbolTypes = ['cross', 'circle', 'triangle', 'square'];
        createSymbol(symbolTypes[Math.floor(Math.random() * symbolTypes.length)]);
    }
    
    // Set timeout for next symbol
    setTimeout(spawnSymbols, 1000);
}

// Clear all intervals for light animations with a utility function
function clearAllIntervals(intervalsArray) {
    intervalsArray.forEach(interval => clearInterval(interval));
    return [];
}

// Create snow or Halloween elements with improved performance
function createFallingElements(className, characters, count = 50) {
    // Clear existing elements first
    document.querySelectorAll('.' + className).forEach(element => element.remove());
    
    // Performance optimization: Use document fragment
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < count; i++) {
        const element = document.createElement('div');
        element.className = className;
        
        if (characters) {
            element.innerHTML = characters[Math.floor(Math.random() * characters.length)];
        }
        
        // Set random properties
        element.style.fontSize = (Math.random() * 20 + 10) + 'px';
        element.style.opacity = Math.random() * 0.7 + 0.3;
        element.style.left = Math.random() * 100 + '%';
        
        // Different animation duration for each element
        const animationDuration = Math.random() * 15 + 10;
        element.style.animationDuration = animationDuration + 's';
        
        // Random animation delay
        element.style.animationDelay = Math.random() * 5 + 's';
        
        fragment.appendChild(element);
    }
    
    // Append all elements at once
    document.body.appendChild(fragment);
    
    // Show elements based on current mode
    const showSnowflakes = state.modes.christmas || state.modes.combined;
    const showHalloweenElements = state.modes.halloween || state.modes.combined;
    
    document.querySelectorAll('.snowflake').forEach(flake => {
        flake.style.display = showSnowflakes ? 'block' : 'none';
    });
    
    document.querySelectorAll('.halloween-element').forEach(element => {
        element.style.display = showHalloweenElements ? 'block' : 'none';
    });
}

// Flash random lightning/thunder
function triggerLightning() {
    if (!state.modes.halloween && !state.modes.combined) return;

    domCache.halloween.thunderFlash.style.animation = 'lightning-flash 1s';

    // Reset animation after it completes
    setTimeout(() => {
        domCache.halloween.thunderFlash.style.animation = '';
    }, 1000);

    // Schedule next lightning
    if (state.modes.halloween || state.modes.combined) {
        const nextLightning = 5000 + Math.random() * 20000; // Random between 5-25 seconds
        setTimeout(triggerLightning, nextLightning);
    }
}

// Create Christmas lights
function createChristmasLights() {
    // Clear existing lights
    document.querySelectorAll('.christmas-light').forEach(light => light.remove());
    state.lights.christmas.intervals = clearAllIntervals(state.lights.christmas.intervals);

    // Show light cord and container
    domCache.christmas.lightsContainer.style.display = 'block';
    domCache.christmas.lightCord.style.display = 'block';

    // Expanded Christmas light colors
    const lightColors = [
        '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', 
        '#00ffff', '#ff8000', '#ffffff', '#39ff14', '#FF10F0', 
        '#7df9ff', '#FF1493', '#00FF7F', '#FFA500', '#9400D3', 
        '#FB33DB', '#7CFC00', '#FF6347', '#1E90FF', '#FFFF00'
    ];

    const windowWidth = window.innerWidth;
    const lightCount = Math.floor(windowWidth / 25) + 4; // One light every 25px

    // Performance optimization: Use document fragment
    const fragment = document.createDocumentFragment();
    
    // Create all lights
    for (let i = 0; i < lightCount; i++) {
        const light = document.createElement('div');
        light.className = 'christmas-light';
        light.dataset.index = i;

        // Random color assignment
        const color = lightColors[Math.floor(Math.random() * lightColors.length)];
        light.style.backgroundColor = color;
        light.dataset.color = color;

        // Position light
        light.style.left = (i * 25) + 'px';

        // Add a glow effect based on color
        light.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;

        fragment.appendChild(light);
    }
    
    // Append all lights at once
    domCache.christmas.lightsContainer.appendChild(fragment);

    // Apply the current mode
    setLightMode(state.lights.christmas.mode);

    // Decorate the tree with lights
    decorateTreeWithLights();
}

// Create Halloween lights with performance optimization
function createHalloweenLights() {
    // Clear existing lights
    document.querySelectorAll('.halloween-light').forEach(light => light.remove());
    state.lights.halloween.intervals = clearAllIntervals(state.lights.halloween.intervals);

    // Show light container and cord
    domCache.halloween.lightsContainer.style.display = 'block';
    domCache.halloween.lightCord.style.display = 'block';

    // Halloween light colors
    const lightColors = [
        '#ff6600', '#6600cc', '#00cc00', '#ff0000', 
        '#66ccff', '#ffcc00', '#39ff14', '#ff00ff'
    ];

    const windowWidth = window.innerWidth;
    const lightCount = Math.floor(windowWidth / 25) + 4; // One light every 25px

    // Performance optimization: Use document fragment
    const fragment = document.createDocumentFragment();
    
    // Create all lights
    for (let i = 0; i < lightCount; i++) {
        const light = document.createElement('div');
        light.className = 'halloween-light';
        light.dataset.index = i;

        // Random color assignment
        const color = lightColors[Math.floor(Math.random() * lightColors.length)];
        light.style.backgroundColor = color;
        light.dataset.color = color;

        // Position light
        light.style.left = (i * 25) + 'px';

        // Add a glow effect based on color
        light.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;

        fragment.appendChild(light);
    }
    
    // Append all lights at once
    domCache.halloween.lightsContainer.appendChild(fragment);

    // Apply the current Halloween light mode
    setHalloweenLightMode(state.lights.halloween.mode);

    // Create pumpkin patch
    createPumpkinPatch();
}

// Create pumpkin patch with performance optimization
function createPumpkinPatch() {
    // Clear existing pumpkins
    domCache.halloween.pumpkinPatch.innerHTML = '';

    // Create 3-5 pumpkins in different positions
    const numPumpkins = Math.floor(Math.random() * 3) + 3;
    
    // Performance optimization: Use document fragment
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < numPumpkins; i++) {
        const pumpkin = document.createElement('div');
        pumpkin.className = 'pumpkin';

        // Random position within the patch
        pumpkin.style.left = (Math.random() * 100) + 'px';
        pumpkin.style.bottom = (Math.random() * 40) + 'px';

        // Random size variation
        const sizeFactor = 0.8 + (Math.random() * 0.4);
        pumpkin.style.transform = `scale(${sizeFactor})`;

        // Create pumpkin parts with innerHTML for better performance
        pumpkin.innerHTML = `
            <div class="pumpkin-stem"></div>
            <div class="pumpkin-face">
                <div class="pumpkin-eyes">
                    <div class="pumpkin-eye" ${Math.random() > 0.5 ? 'style="clip-path: polygon(50% 0%, 0% 100%, 100% 100%)"' : ''}></div>
                    <div class="pumpkin-eye" ${Math.random() > 0.5 ? 'style="clip-path: polygon(50% 0%, 0% 100%, 100% 100%)"' : ''}></div>
                </div>
                <div class="pumpkin-mouth" ${Math.random() > 0.5 ? 'style="clip-path: polygon(0% 0%, 25% 100%, 50% 0%, 75% 100%, 100% 0%)"' : ''}></div>
            </div>
        `;
        
        fragment.appendChild(pumpkin);
    }
    
    // Append all pumpkins at once
    domCache.halloween.pumpkinPatch.appendChild(fragment);
}

// Decorate tree with lights
function decorateTreeWithLights() {
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
    
    const lightColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ffffff'];
    
    // Clear existing tree lights
    document.querySelectorAll('.tree-light').forEach(light => light.remove());
    
    // Performance optimization: Use document fragment
    const fragment = document.createDocumentFragment();
    
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

        fragment.appendChild(light);
    });
    
    // Append all lights at once
    domCache.christmas.miniTree.appendChild(fragment);
}

// Create dual effects (combined mode)
function createDualEffects() {
    // Create both types of elements
    createFallingElements('snowflake', ['❄', '❅', '❆', '*']);
    createFallingElements('halloween-element', ['🦇', '🍂', '🕸️', '🕷️', '👻', '💀']);
    
    // Create lights for both themes
    createChristmasLights();
    createHalloweenLights();
    
    // Apply combined light mode
    setCombinedLightMode(state.lights.combined.mode);
    
    // Create combined corner decoration
    createCombinedCorner();
}

// Create combined corner decoration
function createCombinedCorner() {
    // Clear existing decorations
    domCache.combined.corner.innerHTML = '';
    
    // Performance optimization: Use innerHTML for complex structure
    domCache.combined.corner.innerHTML = `
        <div class="mini-tree">
            <div class="tree-part"></div>
            <div class="tree-part"></div>
            <div class="tree-part"></div>
            <div class="tree-trunk"></div>
        </div>
    `;
    
    const miniTree = domCache.combined.corner.querySelector('.mini-tree');
    
    // Create 2-3 pumpkins near the tree
    const numPumpkins = Math.floor(Math.random() * 2) + 2;
    
    // Performance optimization: Use document fragment
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < numPumpkins; i++) {
        const pumpkin = document.createElement('div');
        pumpkin.className = 'pumpkin';
        
        // Position pumpkins around the tree
        pumpkin.style.left = (120 + Math.random() * 60) + 'px';
        pumpkin.style.bottom = (Math.random() * 30) + 'px';
        
        // Random size variation
        const sizeFactor = 0.8 + (Math.random() * 0.4);
        pumpkin.style.transform = `scale(${sizeFactor})`;
        
        // Create pumpkin elements with innerHTML for better performance
        pumpkin.innerHTML = `
            <div class="pumpkin-stem"></div>
            <div class="pumpkin-face">
                <div class="pumpkin-eyes">
                    <div class="pumpkin-eye" ${Math.random() > 0.5 ? 'style="clip-path: polygon(50% 0%, 0% 100%, 100% 100%)"' : ''}></div>
                    <div class="pumpkin-eye" ${Math.random() > 0.5 ? 'style="clip-path: polygon(50% 0%, 0% 100%, 100% 100%)"' : ''}></div>
                </div>
                <div class="pumpkin-mouth" ${Math.random() > 0.5 ? 'style="clip-path: polygon(0% 0%, 25% 100%, 50% 0%, 75% 100%, 100% 0%)"' : ''}></div>
            </div>
        `;
        
        fragment.appendChild(pumpkin);
    }
    
    // Append all pumpkins at once
    domCache.combined.corner.appendChild(fragment);
    
    // Decorate tree with combined lights
    decorateCombinedTree();
}

// Decorate combined tree with both themed lights
function decorateCombinedTree() {
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
    
    // Performance optimization: Use document fragment
    const fragment = document.createDocumentFragment();
    
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
        
        fragment.appendChild(light);
    });
    
    // Append all lights at once to the mini-tree inside the combined corner
    const miniTree = domCache.combined.corner.querySelector('.mini-tree');
    if (miniTree) {
        miniTree.appendChild(fragment);
    }
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

// Christmas light mode setter with performance optimizations
function setLightMode(mode) {
    state.lights.christmas.mode = mode;
    domCache.christmas.lightModeLabel.textContent = `Light Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;

    // Clear previous animations
    state.lights.christmas.intervals = clearAllIntervals(state.lights.christmas.intervals);

    const lights = document.querySelectorAll('.christmas-light');
    const lightsArray = Array.from(lights);

    // Reset all lights - batch style changes with className
    lightsArray.forEach(light => {
        light.style.animation = '';
        light.style.animationDelay = '';
        light.style.opacity = '1';
        light.style.transform = 'scale(1)';
    });
    
    // Apply the specific light mode
    switch (mode) {
        case 'random':
            applyRandomMode(lightsArray);
            break;
        case 'sequential':
            applySequentialMode(lightsArray);
            break;
        case 'alternating':
            applyAlternatingMode(lightsArray);
            break;
        case 'wave':
            applyWaveMode(lightsArray);
            break;
        case 'chasing':
            applyChasingMode(lightsArray);
            break;
        case 'colorgroups':
            applyColorGroupsMode(lightsArray);
            break;
        case 'heartbeat':
            applyHeartbeatMode(lightsArray);
            break;
        case 'morse':
            applyMorseCodeMode(lightsArray);
            break;
        case 'rainbow':
            applyRainbowMode(lightsArray);
            break;
        case 'cascade':
            applyCascadeMode(lightsArray);
            break;
    }
}

// Halloween light mode setter with performance optimizations
function setHalloweenLightMode(mode) {
    state.lights.halloween.mode = mode;
    domCache.halloween.lightModeLabel.textContent = `Light Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;

    // Clear previous animations
    state.lights.halloween.intervals = clearAllIntervals(state.lights.halloween.intervals);

    const lights = document.querySelectorAll('.halloween-light');
    const lightsArray = Array.from(lights);

    // Reset all lights
    lightsArray.forEach(light => {
        light.style.animation = '';
        light.style.animationDelay = '';
        light.style.opacity = '1';
        light.style.transform = 'scale(1)';
    });
    
    // Apply the specific Halloween light mode
    switch (mode) {
        case 'spooky':
            applySpookyMode(lightsArray);
            break;
        case 'flicker':
            applyFlickerMode(lightsArray);
            break;
        case 'pulse':
            applyPulseMode(lightsArray);
            break;
        case 'thunder':
            applyThunderMode(lightsArray);
            break;
        case 'colorshift':
            applyColorShiftMode(lightsArray);
            break;
        case 'witch':
            applyWitchMode(lightsArray);
            break;
        case 'zombie':
            applyZombieMode(lightsArray);
            break;
    }
}

// Combined light mode setter
function setCombinedLightMode(mode) {
    state.lights.combined.mode = mode;
    domCache.combined.lightModeLabel.textContent = `Light Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
    
    // Clear previous animations
    state.lights.combined.intervals = clearAllIntervals(state.lights.combined.intervals);
    state.lights.christmas.intervals = clearAllIntervals(state.lights.christmas.intervals);
    state.lights.halloween.intervals = clearAllIntervals(state.lights.halloween.intervals);
    
    const christmasLights = document.querySelectorAll('.christmas-light');
    const halloweenLights = document.querySelectorAll('.halloween-light');
    
    // Reset all lights
    [...christmasLights, ...halloweenLights].forEach(light => {
        light.style.animation = '';
        light.style.animationDelay = '';
        light.style.opacity = '1';
        light.style.transform = 'scale(1)';
    });
    
    // Apply the specific combined light mode
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

// LIGHT MODE IMPLEMENTATIONS - CHRISTMAS

// Random mode - lights randomly twinkle
function applyRandomMode(lights) {
    const animationPatterns = ['twinkle1', 'twinkle2', 'twinkle3', 'pulse'];

    // Performance: Prepare all animation settings first
    lights.forEach(light => {
        // Random animation
        const animationName = animationPatterns[Math.floor(Math.random() * animationPatterns.length)];
        const animationDuration = 1 + Math.random() * 3; // 1-4 seconds
        
        // Apply animation settings
        light.style.animation = `${animationName} ${animationDuration}s infinite`;
        light.style.animationDelay = (Math.random() * 2) + 's';
    });

    // Use a more efficient timer approach with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 200; // 200ms between updates
    
    function updateRandomLights(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
            // Batch updates
            lights.forEach(light => {
                // Random chance to change state
                if (Math.random() > 0.7) {
                    light.style.opacity = Math.random() > 0.5 ? '1' : '0.3';
                    light.style.transform = Math.random() > 0.5 ? 'scale(1.2)' : 'scale(0.8)';
                }
            });
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.christmas.mode === 'random' && state.modes.christmas) {
            requestAnimationFrame(updateRandomLights);
        }
    }
    
    requestAnimationFrame(updateRandomLights);
}

// Sequential mode - lights light up in sequence
function applySequentialMode(lights) {
    const lightsArray = Array.from(lights);
    let currentIndex = 0;

    // Turn off all lights initially
    lightsArray.forEach(light => {
        light.style.opacity = '0.3';
    });

    // Sequential pattern - better performance by using requestAnimationFrame
    let lastUpdate = 0;
    const interval = 100; // 100ms between updates
    
    function updateSequentialLights(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
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
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.christmas.mode === 'sequential' && state.modes.christmas) {
            requestAnimationFrame(updateSequentialLights);
        }
    }
    
    requestAnimationFrame(updateSequentialLights);
}

// Alternating mode - lights alternate between even and odd
function applyAlternatingMode(lights) {
    const lightsArray = Array.from(lights);
    let isEvenActive = true;

    // Initial state - all on
    lightsArray.forEach(light => {
        light.style.opacity = '1';
    });

    // Alternating pattern - better performance with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 500; // 500ms between updates
    
    function updateAlternatingLights(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
            // Batch DOM updates
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
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.christmas.mode === 'alternating' && state.modes.christmas) {
            requestAnimationFrame(updateAlternatingLights);
        }
    }
    
    requestAnimationFrame(updateAlternatingLights);
}

// Wave mode - creates a wave-like effect
function applyWaveMode(lights) {
    const lightsArray = Array.from(lights);

    // Set up wave animation with optimized approach
    lightsArray.forEach((light, index) => {
        // Calculation for wave effect using CSS animation
        const delay = (index * 0.1) % 2; // 0.1 second delay per light, repeat every 2 seconds
        light.style.animation = 'pulse 2s infinite';
        light.style.animationDelay = `${delay}s`;
    });
}

// Chasing mode - lights move in chasing pattern
function applyChasingMode(lights) {
    const lightsArray = Array.from(lights);
    const groupSize = 3; // Number of lights in each chase group
    let position = 0;

    // Turn off all lights initially
    lightsArray.forEach(light => {
        light.style.opacity = '0.3';
    });

    // Chasing pattern - better performance with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 100; // 100ms between updates
    
    function updateChasingLights(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
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
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.christmas.mode === 'chasing' && state.modes.christmas) {
            requestAnimationFrame(updateChasingLights);
        }
    }
    
    requestAnimationFrame(updateChasingLights);
}

// Color groups mode - lights of the same color blink together
function applyColorGroupsMode(lights) {
    const lightsArray = Array.from(lights);
    
    // Performance optimization: Group lights by color once
    const colorGroups = {};
    
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
    
    // Get array of color keys
    const colorKeys = Object.keys(colorGroups);
    let colorIndex = 0;
    
    // Color groups animation - better performance with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 500; // 500ms between updates
    
    function updateColorGroups(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
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
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.christmas.mode === 'colorgroups' && state.modes.christmas) {
            requestAnimationFrame(updateColorGroups);
        }
    }
    
    requestAnimationFrame(updateColorGroups);
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
    
    // Heartbeat animation - better performance with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 400; // 400ms between updates
    
    function updateHeartbeat(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
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
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.christmas.mode === 'heartbeat' && state.modes.christmas) {
            requestAnimationFrame(updateHeartbeat);
        }
    }
    
    requestAnimationFrame(updateHeartbeat);
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
    let morseTimeout = null;
    
    function playMorseCode() {
        const currentCode = morsePattern[patternIndex];
        
        if (currentCode === 1) {
            // Dot - short flash
            lightsArray.forEach(light => {
                light.style.opacity = '1';
                light.style.transform = 'scale(1.2)';
            });
            
            morseTimeout = setTimeout(() => {
                lightsArray.forEach(light => {
                    light.style.opacity = '0.3';
                    light.style.transform = 'scale(0.8)';
                });
                
                // Move to next part of pattern
                patternIndex = (patternIndex + 1) % morsePattern.length;
                
                // Continue if still in morse mode
                if (state.lights.christmas.mode === 'morse' && state.modes.christmas) {
                    morseTimeout = setTimeout(playMorseCode, 100);
                }
            }, 250); // Short duration for dot
        } else if (currentCode === 2) {
            // Dash - longer flash
            lightsArray.forEach(light => {
                light.style.opacity = '1';
                light.style.transform = 'scale(1.2)';
            });
            
            morseTimeout = setTimeout(() => {
                lightsArray.forEach(light => {
                    light.style.opacity = '0.3';
                    light.style.transform = 'scale(0.8)';
                });
                
                // Move to next part of pattern
                patternIndex = (patternIndex + 1) % morsePattern.length;
                
                // Continue if still in morse mode
                if (state.lights.christmas.mode === 'morse' && state.modes.christmas) {
                    morseTimeout = setTimeout(playMorseCode, 100);
                }
            }, 550); // Longer duration for dash
        } else {
            // Space or gap - lights remain off
            patternIndex = (patternIndex + 1) % morsePattern.length;
            
            // Continue if still in morse mode
            if (state.lights.christmas.mode === 'morse' && state.modes.christmas) {
                morseTimeout = setTimeout(playMorseCode, 100);
            }
        }
    }
    
    // Start morse code
    playMorseCode();
    
    // Store timeout to clear later
    state.lights.christmas.intervals.push(morseTimeout);
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
    
    // Rainbow animation - better performance with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 200; // 200ms between updates
    
    function updateRainbow(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
            // Batch update all lights
            lightsArray.forEach((light, index) => {
                const colorIndex = (index + step) % rainbowColors.length;
                const color = rainbowColors[colorIndex];
                
                light.style.backgroundColor = color;
                light.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
            });
            
            step = (step + 1) % rainbowColors.length;
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.christmas.mode === 'rainbow' && state.modes.christmas) {
            requestAnimationFrame(updateRainbow);
        }
    }
    
    requestAnimationFrame(updateRainbow);
}

// Cascade mode - twinkling starts at one end and cascades
function applyCascadeMode(lights) {
    const lightsArray = Array.from(lights);
    const numLights = lightsArray.length;
    const waveWidth = Math.floor(numLights / 4); // Wave spans about 1/4 of the lights
    let wavePosition = 0;

    // Turn all lights to dim initially
    lightsArray.forEach(light => {
        light.style.opacity = '0.3';
        light.style.transform = 'scale(0.8)';
    });

    // Cascade animation - better performance with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 100; // 100ms between updates
    
    function updateCascade(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
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
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.christmas.mode === 'cascade' && state.modes.christmas) {
            requestAnimationFrame(updateCascade);
        }
    }
    
    requestAnimationFrame(updateCascade);
}

// HALLOWEEN LIGHT MODES

// Spooky mode - random flickering
function applySpookyMode(lights) {
    const lightsArray = Array.from(lights);

    // Set up individual light animations
    lightsArray.forEach(light => {
        // Random flickering
        const randomFlickerSpeed = 0.5 + Math.random() * 2;
        light.style.animation = `twinkle${Math.floor(Math.random() * 3) + 1} ${randomFlickerSpeed}s infinite`;
        light.style.animationDelay = (Math.random() * 2) + 's';
    });

    // Occasional random dimming - better performance with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 200; // 200ms between updates
    
    function updateSpooky(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
            // Batch update lights that need dimming
            const updateLights = [];
            
            lightsArray.forEach(light => {
                if (Math.random() > 0.8) {
                    updateLights.push({
                        light,
                        opacity: Math.random() * 0.7 + 0.3
                    });
                }
            });
            
            // Apply updates
            updateLights.forEach(update => {
                update.light.style.opacity = update.opacity;
            });
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.halloween.mode === 'spooky' && state.modes.halloween) {
            requestAnimationFrame(updateSpooky);
        }
    }
    
    requestAnimationFrame(updateSpooky);
}

// Flicker mode - lights rapidly turn on and off randomly
function applyFlickerMode(lights) {
    const lightsArray = Array.from(lights);

    // Set all lights dim initially
    lightsArray.forEach(light => {
        light.style.opacity = '0.3';
    });

    // Rapid random flickering - better performance with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 100; // 100ms between updates
    
    function updateFlicker(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
            // Batch update lights
            lightsArray.forEach(light => {
                if (Math.random() > 0.5) {
                    light.style.opacity = Math.random() > 0.5 ? '1' : '0.1';
                }
            });
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.halloween.mode === 'flicker' && state.modes.halloween) {
            requestAnimationFrame(updateFlicker);
        }
    }
    
    requestAnimationFrame(updateFlicker);
}

// Pulse mode - all lights pulse together like a heartbeat
function applyPulseMode(lights) {
    const lightsArray = Array.from(lights);
    let pulseState = 0;
    
    // Pulse animation - better performance with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 800; // 800ms between updates
    
    function updatePulse(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
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
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.halloween.mode === 'pulse' && state.modes.halloween) {
            requestAnimationFrame(updatePulse);
        }
    }
    
    requestAnimationFrame(updatePulse);
}

// Thunder mode - occasional flashes of all lights
function applyThunderMode(lights) {
    const lightsArray = Array.from(lights);

    // Set all lights dim initially
    lightsArray.forEach(light => {
        light.style.opacity = '0.3';
        light.style.transform = 'scale(0.8)';
    });

    // Lightning flash function - more efficient with optimized timeouts
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

            // Schedule next flash if still in thunder mode
            if (state.lights.halloween.mode === 'thunder' && state.modes.halloween) {
                const nextFlash = 3000 + Math.random() * 10000; // 3-13 seconds
                setTimeout(lightningFlash, nextFlash);
            }
        }, 200);
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

    // Gradually shift colors - better performance with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 500; // 500ms between updates
    
    function updateColorShift(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
            // Batch update lights that need color shifts
            const updates = [];
            
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
                    
                    updates.push({
                        light,
                        color: newColor
                    });
                }
            });
            
            // Apply all updates at once
            updates.forEach(update => {
                update.light.style.backgroundColor = update.color;
                update.light.style.boxShadow = `0 0 5px ${update.color}, 0 0 10px ${update.color}`;
            });
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.halloween.mode === 'colorshift' && state.modes.halloween) {
            requestAnimationFrame(updateColorShift);
        }
    }
    
    requestAnimationFrame(updateColorShift);
}

// Witch mode - green and purple alternating pattern
function applyWitchMode(lights) {
    const lightsArray = Array.from(lights);
    const witchColors = ['#00cc00', '#6600cc']; // Green and purple
    let isFirstGroupActive = true;

    // Set colors alternating
    lightsArray.forEach((light, index) => {
        const color = witchColors[index % 2];
        light.style.backgroundColor = color;
        light.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
    });

    // Witch mode animation - better performance with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 500; // 500ms between updates
    
    function updateWitchMode(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
            // Batch update all lights
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
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.halloween.mode === 'witch' && state.modes.halloween) {
            requestAnimationFrame(updateWitchMode);
        }
    }
    
    requestAnimationFrame(updateWitchMode);
}

// Zombie mode - sickly green pulsing
function applyZombieMode(lights) {
    const lightsArray = Array.from(lights);
    const zombieGreen = '#39ff14'; // Toxic green
    let intensity = 0;
    let increasing = true;

    // Set all lights to zombie green
    lightsArray.forEach(light => {
        light.style.backgroundColor = zombieGreen;
        light.style.boxShadow = `0 0 5px ${zombieGreen}, 0 0 10px ${zombieGreen}`;
    });

    // Zombie mode animation - better performance with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 200; // 200ms between updates
    
    function updateZombieMode(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
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

            // Batch update all lights with the same intensity
            lightsArray.forEach(light => {
                light.style.opacity = intensity.toString();
                light.style.transform = `scale(${0.8 + (0.4 * intensity)})`;
            });
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.halloween.mode === 'zombie' && state.modes.halloween) {
            requestAnimationFrame(updateZombieMode);
        }
    }
    
    requestAnimationFrame(updateZombieMode);
}

// COMBINED LIGHT MODES

// Fusion mode - synchronized pulses across all lights
function applyFusionMode(christmasLights, halloweenLights) {
    const allLights = [...christmasLights, ...halloweenLights];
    let pulseState = true;
    
    // Fusion mode animation - better performance with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 800; // 800ms between updates
    
    function updateFusion(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
            // Batch update all lights
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
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.combined.mode === 'fusion' && state.modes.combined) {
            requestAnimationFrame(updateFusion);
        }
    }
    
    requestAnimationFrame(updateFusion);
}

// Alternating theme mode - Christmas and Halloween lights alternate
function applyAlternatingThemeMode(christmasLights, halloweenLights) {
    let christmasActive = true;
    
    // Alternating theme mode animation - better performance with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 1000; // 1000ms between updates
    
    function updateAlternatingTheme(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
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
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.combined.mode === 'alternating' && state.modes.combined) {
            requestAnimationFrame(updateAlternatingTheme);
        }
    }
    
    requestAnimationFrame(updateAlternatingTheme);
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
    
    // Dualtone mode animation - better performance with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 500; // 500ms between updates
    
    function updateDualtone(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
            // Batch update all lights
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
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.combined.mode === 'dualtone' && state.modes.combined) {
            requestAnimationFrame(updateDualtone);
        }
    }
    
    requestAnimationFrame(updateDualtone);
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
    
    // Chaotic mode animation - better performance with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 100; // 100ms between updates
    
    function updateChaotic(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
            // Prepare updates
            const updates = [];
            
            allLights.forEach(light => {
                const update = { light };
                
                // 20% chance to change color
                if (Math.random() < 0.2) {
                    const newColor = combinedColors[Math.floor(Math.random() * combinedColors.length)];
                    update.color = newColor;
                }
                
                // 30% chance to change brightness
                if (Math.random() < 0.3) {
                    update.opacity = (0.3 + Math.random() * 0.7).toString();
                }
                
                // 20% chance to change size
                if (Math.random() < 0.2) {
                    update.transform = `scale(${0.8 + Math.random() * 0.4})`;
                }
                
                // Add to updates if any property changed
                if (update.color || update.opacity || update.transform) {
                    updates.push(update);
                }
            });
            
            // Apply all updates at once
            updates.forEach(update => {
                if (update.color) {
                    update.light.style.backgroundColor = update.color;
                    update.light.style.boxShadow = `0 0 5px ${update.color}, 0 0 10px ${update.color}`;
                }
                if (update.opacity) {
                    update.light.style.opacity = update.opacity;
                }
                if (update.transform) {
                    update.light.style.transform = update.transform;
                }
            });
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.combined.mode === 'chaotic' && state.modes.combined) {
            requestAnimationFrame(updateChaotic);
        }
    }
    
    requestAnimationFrame(updateChaotic);
}

// Seasonal mode - Christmas and Halloween lights interact to tell a story
function applySeasonalMode(christmasLights, halloweenLights) {
    const allLights = [...christmasLights, ...halloweenLights];
    let step = 0;
    const totalSteps = 8;
    
    // Seasonal mode animation - better performance with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 1500; // 1500ms between updates
    
    function updateSeasonal(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
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
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.combined.mode === 'seasonal' && state.modes.combined) {
            requestAnimationFrame(updateSeasonal);
        }
    }
    
    requestAnimationFrame(updateSeasonal);
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
    const allLights = [...christmasLights, ...halloweenLights];
    
    allLights.forEach((light, index) => {
        const color = festiveColors[index % festiveColors.length];
        light.style.backgroundColor = color;
        light.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
    });
    
    // Create a wave pattern across all lights
    // Sort lights by position for proper wave
    const sortedLights = allLights.sort((a, b) => {
        return parseInt(a.style.left) - parseInt(b.style.left);
    });
    
    // Wave animation using CSS animations for each light
    sortedLights.forEach((light, index) => {
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
    
    // Occasional random dimming - better performance with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 200; // 200ms between updates
    
    function updateSpookymas(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
            // Batch update lights that need dimming
            const updates = [];
            
            allLights.forEach(light => {
                if (Math.random() > 0.8) {
                    updates.push({
                        light,
                        opacity: Math.random() * 0.7 + 0.3
                    });
                }
            });
            
            // Apply updates
            updates.forEach(update => {
                update.light.style.opacity = update.opacity;
            });
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.combined.mode === 'spookymas' && state.modes.combined) {
            requestAnimationFrame(updateSpookymas);
        }
    }
    
    requestAnimationFrame(updateSpookymas);
}

// Candy Cane mode - red and white alternating pattern
function applyCandycaneMode(christmasLights, halloweenLights) {
    // Sort all lights by position
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
    
    // Candycane mode animation - better performance with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 500; // 500ms between updates
    
    function updateCandycane(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
            // Batch update all lights
            allLights.forEach((light, index) => {
                const colorIndex = (index + offset) % 2;
                const color = candyCaneColors[colorIndex];
                
                light.style.backgroundColor = color;
                light.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
                
                // Full brightness for all
                light.style.opacity = '1';
            });
            
            offset = (offset + 1) % 2;
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.combined.mode === 'candycane' && state.modes.combined) {
            requestAnimationFrame(updateCandycane);
        }
    }
    
    requestAnimationFrame(updateCandycane);
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
    
    // Lightning flash effect using improved timeouts
    let lightningTimeout = null;
    
    function lightningFlash() {
        // All lights flash bright
        allLights.forEach(light => {
            light.style.opacity = '1';
            light.style.transform = 'scale(1.2)';
        });
        
        // Flash the background too
        domCache.halloween.thunderFlash.style.animation = 'lightning-flash 1s';
        
        // Dim after short time
        lightningTimeout = setTimeout(() => {
            allLights.forEach(light => {
                light.style.opacity = '0.3';
                light.style.transform = 'scale(0.8)';
            });
            
            // Secondary flash sometimes
            if (Math.random() > 0.5) {
                lightningTimeout = setTimeout(() => {
                    allLights.forEach(light => {
                        light.style.opacity = '1';
                        light.style.transform = 'scale(1.2)';
                    });
                    
                    lightningTimeout = setTimeout(() => {
                        allLights.forEach(light => {
                            light.style.opacity = '0.3';
                            light.style.transform = 'scale(0.8)';
                        });
                    }, 100);
                }, 300);
            }
            
            // Schedule next flash if still in haunted mode
            if (state.lights.combined.mode === 'haunted' && state.modes.combined) {
                const nextFlash = 3000 + Math.random() * 10000; // 3-13 seconds
                lightningTimeout = setTimeout(lightningFlash, nextFlash);
            }
        }, 200);
        
        // Store timeout for cleanup
        state.lights.combined.intervals.push(lightningTimeout);
    }
    
    // Start the lightning
    lightningFlash();
    
    // Random subtle flickers between lightning - better performance with requestAnimationFrame
    let lastUpdate = 0;
    const interval = 200; // 200ms between updates
    
    function updateHaunted(timestamp) {
        if (timestamp - lastUpdate > interval) {
            lastUpdate = timestamp;
            
            // Batch update lights that need subtle flicker
            const updates = [];
            
            allLights.forEach(light => {
                if (Math.random() > 0.8) {
                    updates.push({
                        light,
                        opacity: (0.2 + Math.random() * 0.3).toString()
                    });
                }
            });
            
            // Apply updates
            updates.forEach(update => {
                update.light.style.opacity = update.opacity;
            });
        }
        
        // Continue the animation loop if this mode is still active
        if (state.lights.combined.mode === 'haunted' && state.modes.combined) {
            requestAnimationFrame(updateHaunted);
        }
    }
    
    requestAnimationFrame(updateHaunted);
}

// Toggle Christmas mode
function toggleChristmasMode() {
    // Disable other modes if they're enabled
    if (state.modes.halloween) {
        toggleHalloweenMode();
    }
    if (state.modes.combined) {
        toggleCombinedMode();
    }

    state.modes.christmas = !state.modes.christmas;

    if (state.modes.christmas) {
        // Enable Christmas mode
        domCache.christmas.toggle.textContent = 'Disable Christmas Mode';
        domCache.christmas.toggle.style.backgroundColor = '#00aa00';

        // Create and show Christmas elements
        createFallingElements('snowflake', ['❄', '❅', '❆', '*']);
        createChristmasLights();

        // Show elements
        domCache.christmas.lightModeControl.style.display = 'block';
        domCache.christmas.miniTree.style.display = 'block';
        domCache.christmas.hat.style.display = 'block';
        domCache.christmas.lightsContainer.style.display = 'block';
        document.querySelectorAll('.snowflake').forEach(flake => {
            flake.style.display = 'block';
        });

    } else {
        // Disable Christmas mode
        domCache.christmas.toggle.textContent = 'Enable Christmas Mode';
        domCache.christmas.toggle.style.backgroundColor = '#ff0000';

        // Hide Christmas elements
        domCache.christmas.lightModeControl.style.display = 'none';
        domCache.christmas.miniTree.style.display = 'none';
        domCache.christmas.hat.style.display = 'none';
        domCache.christmas.lightsContainer.style.display = 'none';
        domCache.christmas.lightCord.style.display = 'none';

        // Clear light animations
        state.lights.christmas.intervals = clearAllIntervals(state.lights.christmas.intervals);

        // Hide snowflakes
        document.querySelectorAll('.snowflake').forEach(flake => {
            flake.style.display = 'none';
        });
    }
}

// Toggle Halloween mode
function toggleHalloweenMode() {
    // Disable other modes if they're enabled
    if (state.modes.christmas) {
        toggleChristmasMode();
    }
    if (state.modes.combined) {
        toggleCombinedMode();
    }

    state.modes.halloween = !state.modes.halloween;

    if (state.modes.halloween) {
        // Enable Halloween mode
        domCache.halloween.toggle.textContent = 'Disable Halloween Mode';
        domCache.halloween.toggle.style.backgroundColor = '#6600cc';

        // Create and show Halloween elements
        createFallingElements('halloween-element', ['🦇', '🍂', '🕸️', '🕷️', '👻', '💀']);
        createHalloweenLights();

        // Show elements
        domCache.halloween.lightModeControl.style.display = 'block';
        domCache.halloween.pumpkinPatch.style.display = 'block';
        domCache.halloween.witchHat.style.display = 'block';
        domCache.halloween.lightsContainer.style.display = 'block';
        domCache.halloween.spiderWeb.style.display = 'block';

        // Show ghosts
        domCache.halloween.ghosts.forEach(ghost => {
            ghost.style.display = 'block';
        });

        // Show falling elements
        document.querySelectorAll('.halloween-element').forEach(element => {
            element.style.display = 'block';
        });

        // Show fog effect
        domCache.halloween.fogEffect.style.opacity = '1';
        
        // Start lightning
        triggerLightning();
    } else {
        // Disable Halloween mode
        domCache.halloween.toggle.textContent = 'Enable Halloween Mode';
        domCache.halloween.toggle.style.backgroundColor = '#ff6600';

        // Hide Halloween elements
        domCache.halloween.lightModeControl.style.display = 'none';
        domCache.halloween.pumpkinPatch.style.display = 'none';
        domCache.halloween.witchHat.style.display = 'none';
        domCache.halloween.lightsContainer.style.display = 'none';
        domCache.halloween.spiderWeb.style.display = 'none';
        domCache.halloween.lightCord.style.display = 'none';

        // Clear light animations
        state.lights.halloween.intervals = clearAllIntervals(state.lights.halloween.intervals);

        // Hide ghosts
        domCache.halloween.ghosts.forEach(ghost => {
            ghost.style.display = 'none';
        });

        // Hide falling elements
        document.querySelectorAll('.halloween-element').forEach(element => {
            element.style.display = 'none';
        });

        // Hide fog effect
        domCache.halloween.fogEffect.style.opacity = '0';
    }
}

// Toggle combined mode
function toggleCombinedMode() {
    // Disable other modes if they're enabled
    if (state.modes.christmas) {
        toggleChristmasMode();
    }
    if (state.modes.halloween) {
        toggleHalloweenMode();
    }
    
    state.modes.combined = !state.modes.combined;
    
    if (state.modes.combined) {
        // Enable combined mode
        domCache.combined.toggle.textContent = 'Disable Combined Mode';
        domCache.combined.toggle.style.background = 'linear-gradient(to right, #00aa00, #6600cc)';
        
        // Create and show combined elements
        createDualEffects();
        
        // Show elements
        domCache.combined.lightModeControl.style.display = 'block';
        domCache.combined.dualHat.style.display = 'block';
        domCache.combined.corner.style.display = 'block';
        
        // Show both Christmas and Halloween elements
        document.querySelectorAll('.snowflake').forEach(flake => {
            flake.style.display = 'block';
        });
        document.querySelectorAll('.halloween-element').forEach(element => {
            element.style.display = 'block';
        });
        
        // Show lights from both themes
        domCache.christmas.lightsContainer.style.display = 'block';
        domCache.christmas.lightCord.style.display = 'block';
        domCache.halloween.lightsContainer.style.display = 'block';
        domCache.halloween.lightCord.style.display = 'block';
        
        // Enable fog with reduced opacity
        domCache.halloween.fogEffect.style.opacity = '0.5';
        
        // Show ghosts
        domCache.halloween.ghosts.forEach(ghost => {
            ghost.style.display = 'block';
        });
        
        // Show spider web
        domCache.halloween.spiderWeb.style.display = 'block';
        
        // Start lightning
        triggerLightning();
    } else {
        // Disable combined mode
        domCache.combined.toggle.textContent = 'Enable Combined Mode';
        domCache.combined.toggle.style.background = 'linear-gradient(to right, #ff0000, #ff6600)';
        
        // Hide combined elements
        domCache.combined.lightModeControl.style.display = 'none';
        domCache.combined.dualHat.style.display = 'none';
        domCache.combined.corner.style.display = 'none';
        
        // Hide Christmas elements
        domCache.christmas.lightsContainer.style.display = 'none';
        domCache.christmas.lightCord.style.display = 'none';
        document.querySelectorAll('.snowflake').forEach(flake => {
            flake.style.display = 'none';
        });
        
        // Hide Halloween elements
        domCache.halloween.lightsContainer.style.display = 'none';
        domCache.halloween.lightCord.style.display = 'none';
        document.querySelectorAll('.halloween-element').forEach(element => {
            element.style.display = 'none';
        });
        domCache.halloween.ghosts.forEach(ghost => {
            ghost.style.display = 'none';
        });
        domCache.halloween.spiderWeb.style.display = 'none';
        domCache.halloween.fogEffect.style.opacity = '0';
        
        // Clear light animations
        state.lights.combined.intervals = clearAllIntervals(state.lights.combined.intervals);
    }
}

// Event listeners for mode controls with performance-optimized event handling
document.getElementById('light-mode-slider').addEventListener('input', function() {
    const modeIndex = parseInt(this.value);
    const selectedMode = state.lights.christmas.modes[modeIndex];
    setLightMode(selectedMode);
});

document.getElementById('halloween-light-slider').addEventListener('input', function() {
    const modeIndex = parseInt(this.value);
    const selectedMode = state.lights.halloween.modes[modeIndex];
    setHalloweenLightMode(selectedMode);
});

document.getElementById('combined-light-slider').addEventListener('input', function() {
    const modeIndex = parseInt(this.value);
    const selectedMode = state.lights.combined.modes[modeIndex];
    setCombinedLightMode(selectedMode);
});

// Button click handlers
document.getElementById('christmas-toggle').addEventListener('click', toggleChristmasMode);
document.getElementById('halloween-toggle').addEventListener('click', toggleHalloweenMode);
document.getElementById('combined-toggle').addEventListener('click', toggleCombinedMode);

// Performance optimization: Throttle resize and visibility change events
let resizeTimer = null;
window.addEventListener('resize', function() {
    if (resizeTimer) clearTimeout(resizeTimer);
    
    resizeTimer = setTimeout(() => {
        // Clear and restart global timer
        if (state.symbols.timer !== null) {
            clearTimeout(state.symbols.timer);
            state.symbols.timer = null;
        }
        
        // Restart with requestAnimationFrame
        startGlobalTimer();
    }, 200); // Throttle to run max every 200ms
});

// Visibility change handling
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // Restart animations when tab becomes visible
        if (state.symbols.timer !== null) {
            clearTimeout(state.symbols.timer);
            state.symbols.timer = null;
        }
        
        // Only start if we have symbols
        if (state.symbols.data.length > 0) {
            startGlobalTimer();
        }
        
        // Restart glow toggle
        if (state.glow.interval) {
            clearTimeout(state.glow.interval);
        }
        autoToggleGlow();
    }
});

// Initialize
window.addEventListener('load', function() {
    // Start spawning symbols
    spawnSymbols();
    
    // Hide YouTube players initially
    hideYouTubePlayers();
});
