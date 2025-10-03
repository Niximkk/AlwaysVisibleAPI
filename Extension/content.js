(function() {
    'use strict';

    // ========================================
    // PART 1: OVERRIDE VISIBILITY & FOCUS PROPERTIES
    // ========================================

    // Always report document as visible and focused
    Object.defineProperty(document, 'hidden', {
        get: function() { return false; },
        configurable: true
    });

    Object.defineProperty(document, 'visibilityState', {
        get: function() { return 'visible'; },
        configurable: true
    });

    document.hasFocus = function() { return true; };

    // Override vendor-specific visibility properties
    Object.defineProperty(document, 'webkitHidden', {
        get: function() { return false; },
        configurable: true
    });

    Object.defineProperty(document, 'mozHidden', {
        get: function() { return false; },
        configurable: true
    });

    Object.defineProperty(document, 'msHidden', {
        get: function() { return false; },
        configurable: true
    });

    // ========================================
    // PART 2: BLOCK EVENT LISTENER REGISTRATION FOR TRACKING EVENTS
    // ========================================

    const eventsToBlock = [
        // Visibility events
        'visibilitychange',
        'webkitvisibilitychange',
        'mozvisibilitychange',
        'msvisibilitychange',
        
        // Focus events (exit)
        'blur',
        'focusout',
        
        // Focus events (entry)
        'focus',
        'focusin',
        'pageshow',
        
        // Page lifecycle events
        'pagehide',
        'beforeunload',
        'unload',
        
        // Mouse events (exit)
        'mouseleave',
        'mouseout',
        
        // Mouse events (entry)
        'mouseenter',
        'mouseover',
        'mousemove', // First mousemove after return
        
        // Pointer events (entry)
        'pointerenter',
        'pointerover'
    ];

    // Prevent adding listeners for blocked events
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (eventsToBlock.includes(type.toLowerCase())) {
            console.log(`💸 Bribed event: ${type}`);
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    // Allow removing listeners as normal
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.removeEventListener = function(type, listener, options) {
        return originalRemoveEventListener.call(this, type, listener, options);
    };

    // ========================================
    // PART 3: BLOCK ALREADY REGISTERED TRACKING EVENTS
    // ========================================

    // Prevent propagation of blocked events
    const blockEvent = function(e) {
        if (eventsToBlock.includes(e.type.toLowerCase())) {
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    };

    // Attach blocking handlers in capture phase
    eventsToBlock.forEach(eventType => {
        window.addEventListener(eventType, blockEvent, true);
        document.addEventListener(eventType, blockEvent, true);
        document.body?.addEventListener(eventType, blockEvent, true);
    });

    // ========================================
    // PART 4: OVERRIDE FULLSCREEN PROPERTIES & EVENTS
    // ========================================

    // Always report fullscreen as active
    Object.defineProperty(document, 'fullscreenElement', {
        get: function() { return document.documentElement; },
        configurable: true
    });

    Object.defineProperty(document, 'webkitFullscreenElement', {
        get: function() { return document.documentElement; },
        configurable: true
    });

    Object.defineProperty(document, 'mozFullScreenElement', {
        get: function() { return document.documentElement; },
        configurable: true
    });

    Object.defineProperty(document, 'msFullscreenElement', {
        get: function() { return document.documentElement; },
        configurable: true
    });

    // Block fullscreen change events
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange'].forEach(event => {
        document.addEventListener(event, function(e) {
            e.stopImmediatePropagation();
            e.stopPropagation();
        }, true);
    });

    // ========================================
    // PART 5: SIMULATE CONSTANT USER ACTIVITY
    // ========================================

    // Keep requestAnimationFrame running
    const originalRAF = window.requestAnimationFrame;
    let rafRunning = true;
    
    function keepActive() {
        if (rafRunning) {
            originalRAF(keepActive);
        }
    }
    keepActive();

    // Regularly call performance.now()
    setInterval(function() {
        performance.now();
    }, 16); // ~60fps

    // ========================================
    // PART 6: BLOCK EXIT TRACKING REQUESTS
    // ========================================

    // Prevent navigator.sendBeacon from sending data
    navigator.sendBeacon = function() {
        console.log('🚫 sendBeacon blocked');
        return true;
    };

    // Block fetch requests to analytics/tracking URLs
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        if (typeof url === 'string') {
            if (url.includes('analytics') || url.includes('tracking') || url.includes('beacon')) {
                console.log('🚫 Tracking request blocked:', url);
                return Promise.resolve(new Response());
            }
        }
        return originalFetch.apply(this, args);
    };

    // ========================================
    // PART 7: OVERRIDE INTERSECTION OBSERVER
    // ========================================

    // Always report elements as visible/intersecting
    const OriginalIntersectionObserver = window.IntersectionObserver;
    window.IntersectionObserver = function(callback, options) {
        const modifiedCallback = function(entries, observer) {
            entries = entries.map(entry => ({
                ...entry,
                isIntersecting: true,
                intersectionRatio: 1,
                boundingClientRect: entry.target.getBoundingClientRect(),
                intersectionRect: entry.target.getBoundingClientRect(),
                rootBounds: entry.target.getBoundingClientRect()
            }));
            callback(entries, observer);
        };
        return new OriginalIntersectionObserver(modifiedCallback, options);
    };

    // ========================================
    // PART 8: BLOCK WINDOW.BLUR AND WINDOW.FOCUS
    // ========================================

    window.blur = function() {
        console.log('🚫 window.blur() blocked');
    };

    window.focus = function() {
        console.log('🚫 window.focus() blocked');
    };

    // ========================================
    // PART 9: BLOCK IFRAME DETECTION
    // ========================================

    // Always report window.top as self
    try {
        Object.defineProperty(window, 'top', {
            get: function() { return window; },
            configurable: true
        });
    } catch(e) {}

    // ========================================
    // PART 10: OVERRIDE POINTER LOCK PROPERTIES
    // ========================================

    Object.defineProperty(document, 'pointerLockElement', {
        get: function() { return document.body; },
        configurable: true
    });

    
    // ========================================
    // CONSOLE LOG BULLSHITTING
    // ========================================

    // Modified console.image.min.js from https://github.com/SOKHUONG/console.image (bullshit removed)
    !function(t){"use strict";t.image=function(n,i){i=i||1;var o=new Image;o.onload=function(){var o,r,s=(o=this.width*i,{string:"+",style:"font-size: 1px; padding: "+Math.floor((r=this.height*i/2)/2)+"px "+Math.floor(o/2)+"px; line-height: "+r+"px;"});t.log("%c"+s.string,s.style+"background: url("+n+"); color: transparent;")},o.src=n}}(console);
    
    // console.gif from https://jess.sh/blog/console-gif
    const convertBlobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });
    console.gif = async (url) => {
        return fetch(url)
            .then(async (res) => res.blob())
            .then(convertBlobToBase64)
            .then((base64Gif) => {
                console.image(base64Gif);
                return base64Gif;
            });
    };

    setTimeout(() => {
        console.log('%c👁️‍🗨️ You are now invisible', 'font-size: 32px; font-weight: bold;');
        console.gif('https://j.gifs.com/y7J9Db.gif');
    }, 100);

})();
