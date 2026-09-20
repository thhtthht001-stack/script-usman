// ==UserScript==
// @name         ✦ Black Russia Style (Chief Edition) v20.0.5
// @namespace    https://forum.blackrussia.online
// @version      20.0.5
// @description  Полная кастомизация форума + кнопка всегда рядом с bgButton + док с квадратной формой + исправлено открытие настроек
// @author       Tyzz_Unqwerdezz (модификация)
// @match        https://forum.blackrussia.online/*
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://i.postimg.cc/28kMdmFG/e65d50f699ab952ca89c8525058c4a0d.gif
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';
    if (window.brScriptActive) return;
    window.brScriptActive = true;

    // ========================================================================
    // СТИЛИ СКРЫТИЯ (чтобы не было мелькания)
    // ========================================================================
    const hideStyle = document.createElement('style');
    hideStyle.id = 'br-preload-hide';
    hideStyle.textContent = `
        body { opacity: 0 !important; background: #111 !important; transition: none !important; }
        .p-pageWrapper { background: #111 !important; }
        .br-ready { opacity: 1 !important; }
    `;
    document.documentElement.appendChild(hideStyle);

    // ========================================================================
    // УТИЛИТЫ
    // ========================================================================
    class Utils {
        static notify(text, type = 'check') {
            let c = document.querySelector('.br-toast-wrap');
            if (!c) {
                c = document.createElement('div');
                c.className = 'br-toast-wrap';
                (document.body || document.documentElement).appendChild(c);
            }
            const icons = {
                check: '<svg style="width:20px;height:20px;fill:none;stroke:var(--br-primary);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>',
                error: '<svg style="width:20px;height:20px;fill:none;stroke:#ff5555;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
                save: '<svg style="width:20px;height:20px;fill:none;stroke:var(--br-primary);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>'
            };
            const t = document.createElement('div');
            t.className = 'br-toast';
            t.innerHTML = `<div>${icons[type] || icons.check}</div><span>${text}</span>`;
            c.appendChild(t);
            const speed = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--br-speed')) * 1000;
            setTimeout(() => {
                t.classList.add('hide');
                setTimeout(() => t.remove(), speed + 100);
            }, 3000);
        }
    }

    // ========================================================================
    // СОСТОЯНИЕ
    // ========================================================================
    const DEFAULTS = {
        bg: 'https://i.postimg.cc/dQGDDmqt/8fcca2c5b152028ae257868e7016234c.jpg',
        primary: '#ff3333',
        accent: '#ff6666',
        border: '#ffffff',
        bWidth: 1,
        radius: 12,
        l1: 0.2,
        l2: 0.4,
        l3: 0.7,
        blur: 10,
        blurEnabled: false,
        font: 'Roboto',
        fontColor: '#ffffff',
        customText: false,
        secFontColor: '#aaaaaa',
        customSecText: false,
        vibration: false,
        smooth: 0.4,
        dockPos: 20,
        gearSpeed: 10,
        animStyle: 'def',
        animBlurSpeed: 0.4,
        styleBorder: 'def',
        styleHeader: 'def',
        styleDock: 'def',
        styleBtn: 'metal',
        styleInp: 'def',
        stylePrf: 'def',
        stylePanel: 'aurora',
        styleAva: 'def',
        styleScroll: 'def',
        uiScale: 100,
        uiScaleEnabled: false,
        rgbMode: false,
        stats: { saves: 0, installDate: Date.now() },
        accountMenuStyle: 'def',
        dockEnabled: true,
        dockPosition: 'bottom',
        showBackground: true,
        dockShape: 'round'
    };

    class State {
        constructor() {
            this.data = JSON.parse(JSON.stringify(DEFAULTS));
            this.load();
        }
        load() {
            for (const k in this.data) {
                const v = GM_getValue(k, DEFAULTS[k]);
                this.data[k] = v;
            }
        }
        save(k, v) {
            this.data[k] = v;
            try { GM_setValue(k, v); } catch (e) {}
        }
        get() { return this.data; }
        setAll(obj) {
            for (const k in obj) this.save(k, obj[k]);
        }
    }

    // ========================================================================
    // ТЕМА
    // ========================================================================
    class Theme {
        constructor() {
            this.addFonts();
            this.injectStaticCSS();
            this.lockBg();
            this.showReady();
        }

        showReady() {
            setTimeout(() => {
                document.documentElement.classList.add('br-ready');
                const el = document.getElementById('br-preload-hide');
                if (el) el.remove();
            }, 50);
        }

        lockBg() {
            const setBg = () => document.documentElement.style.setProperty('--true-bg-h', window.innerHeight + 'px');
            setBg();
            window.addEventListener('orientationchange', () => setTimeout(setBg, 200));
        }

        addFonts() {
            const fonts = [
                'Roboto', 'Montserrat', 'Open+Sans', 'Poppins', 'Ubuntu',
                'Orbitron', 'Russo+One', 'Exo+2', 'Comfortaa', 'Manrope',
                'Inter', 'Jura', 'Kelly+Slab', 'Fira+Sans', 'Nunito',
                'Raleway', 'Oswald', 'Lato', 'Merriweather', 'Playfair+Display',
                'MuseoModerno', 'Bebas+Neue', 'Anton', 'Pacifico', 'Caveat',
                'Lobster', 'Dancing+Script', 'Shadows+Into+Light', 'Amatic+SC',
                'Fredoka+One', 'Archivo+Black', 'Kanit', 'Quicksand', 'Work+Sans',
                'Titillium+Web', 'Asap', 'Maven+Pro', 'Josefin+Sans', 'Cormorant+Garamond',
                'Alegreya', 'Cinzel', 'Crimson+Text', 'EB+Garamond', 'Playfair+Display+SC',
                'Uncial+Antiqua', 'Rye', 'Limelight', 'Monoton', 'Fascinate'
            ];
            const l = document.createElement('link');
            l.href = 'https://fonts.googleapis.com/css2?family=' + fonts.map(f => f.replace(/\+/g, ' ') + ':wght@300;400;500;600;700;800;900').join('&family=') + '&display=swap';
            l.rel = 'stylesheet';
            (document.head || document.documentElement).appendChild(l);
        }

        update(d) {
            const r = document.documentElement.style;
            if (d.uiScaleEnabled) {
                if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
                    let vp = document.querySelector('meta[name="viewport"]');
                    if (!vp) { vp = document.createElement('meta'); vp.name = 'viewport'; document.head.appendChild(vp); }
                    vp.content = `width=device-width, initial-scale=${d.uiScale / 100}, maximum-scale=3.0`;
                    r.zoom = '';
                } else {
                    r.zoom = d.uiScale + '%';
                }
            } else {
                let vp = document.querySelector('meta[name="viewport"]');
                if (vp) vp.content = 'width=device-width, initial-scale=1.0, maximum-scale=3.0';
                r.zoom = '';
            }
            r.setProperty('--br-bg', `url('${d.bg}')`);
            r.setProperty('--br-primary', d.primary);
            r.setProperty('--br-accent', d.accent);
            r.setProperty('--br-border', d.border);
            r.setProperty('--br-bw', `${d.bWidth}px`);
            r.setProperty('--br-rad', `${d.radius}px`);
            r.setProperty('--br-blur', d.blurEnabled ? `${d.blur}px` : '0px');
            r.setProperty('--br-l1', d.l1);
            r.setProperty('--br-l2', d.l2);
            r.setProperty('--br-l3', d.l3);
            r.setProperty('--br-font', d.font);
            r.setProperty('--br-speed', `${d.smooth}s`);
            r.setProperty('--br-dock-bot', `${d.dockPos}px`);
            r.setProperty('--br-gear-speed', `${d.gearSpeed}s`);
            r.setProperty('--br-show-bg', d.showBackground ? 'block' : 'none');

            const root = document.documentElement;
            root.setAttribute('br-b', d.styleBorder);
            root.setAttribute('br-h', d.styleHeader);
            root.setAttribute('br-d', d.styleDock);
            root.setAttribute('br-s-btn', d.styleBtn);
            root.setAttribute('br-s-inp', d.styleInp);
            root.setAttribute('br-s-prf', d.stylePrf);
            root.setAttribute('br-p', d.stylePanel);
            root.setAttribute('br-a', d.animStyle);
            root.setAttribute('br-s-ava', d.styleAva);
            root.setAttribute('br-s-scroll', d.styleScroll);
            root.setAttribute('br-acc-menu', d.accountMenuStyle);
            root.setAttribute('br-dock-pos', d.dockPosition);
            root.setAttribute('br-dock-shape', d.dockShape);

            let blurStart = d.blurEnabled ? `blur(${d.blur}px)` : 'blur(0px)';
            r.setProperty('--br-anim-blur', blurStart);

            let animName = 'br-anim-def';
            let ease = 'var(--br-enter)';
            if (d.animStyle === 'spring') { animName = 'br-anim-spring'; ease = 'cubic-bezier(0.175, 0.885, 0.32, 1.25)'; }
            else if (d.animStyle === 'cascade') { animName = 'br-anim-casc'; ease = 'cubic-bezier(0.2, 0.8, 0.2, 1)'; }
            else if (d.animStyle === 'parallax') { animName = 'br-anim-para'; ease = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'; }
            else if (d.animStyle === 'glitch') { animName = 'br-anim-glitch'; ease = 'steps(3, end)'; }
            else if (d.animStyle === 'bounce') { animName = 'br-anim-bounce'; ease = 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'; }
            else if (d.animStyle === 'fade') { animName = 'br-anim-fade'; ease = 'cubic-bezier(0.4, 0, 0.2, 1)'; }
            else if (d.animStyle === 'slide') { animName = 'br-anim-slide'; ease = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'; }
            else if (d.animStyle === 'rotate') { animName = 'br-anim-rotate'; ease = 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'; }
            r.setProperty('--br-popup-anim', `${animName} ${d.animBlurSpeed}s ${ease} backwards`);

            if (d.customText) r.setProperty('--br-text-col', d.fontColor);
            else r.removeProperty('--br-text-col');
            if (d.customSecText) r.setProperty('--br-sec-text-col', d.secFontColor);
            else r.removeProperty('--br-sec-text-col');

            const h = parseInt(d.primary.replace('#', ''), 16);
            const R = (h >> 16) & 255, G = (h >> 8) & 255, B = h & 255;
            r.setProperty('--br-tint', `${Math.floor(R*0.75)},${Math.floor(G*0.75)},${Math.floor(B*0.75)}`);

            if (d.rgbMode) {
                if (!this.rgbRunning) {
                    this.rgbRunning = true;
                    let hue = 0, lF = 0;
                    const step = t => {
                        if (!this.rgbRunning) return;
                        if (!document.hidden && t - lF > 50) {
                            hue = (hue + 2) % 360;
                            r.setProperty('--br-primary', `hsl(${hue},100%,60%)`);
                            r.setProperty('--br-accent', `hsl(${(hue+20)%360},100%,60%)`);
                            lF = t;
                        }
                        this.rgbId = requestAnimationFrame(step);
                    };
                    this.rgbId = requestAnimationFrame(step);
                }
            } else {
                if (this.rgbRunning) {
                    this.rgbRunning = false;
                    cancelAnimationFrame(this.rgbId);
                    r.setProperty('--br-primary', d.primary);
                    r.setProperty('--br-accent', d.accent);
                }
            }
        }

        injectStaticCSS() {
            const css = `
            body[data-hidden="true"] *, body[data-hidden="true"] *::before, body[data-hidden="true"] *::after { animation-play-state: paused !important; transition: none !important; }
            :root { --br-ease: cubic-bezier(0.2, 0.8, 0.2, 1); --br-enter: cubic-bezier(0.2, 0.8, 0.2, 1); }
            @keyframes br-unfold { 0% { opacity: 0; transform: scale(0.96); } 100% { opacity: 1; transform: scale(1); } }
            @keyframes br-anim-def { 0% { opacity: 0; transform: scale(0.97) translateY(8px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
            @keyframes br-anim-spring { 0% { opacity: 0; transform: scale(0.85) translateY(40px); } 50% { opacity: 1; transform: scale(1.03) translateY(-5px); } 75% { transform: scale(0.98) translateY(2px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
            @keyframes br-anim-casc { 0% { opacity: 0; transform: translateY(-15px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
            @keyframes br-anim-para { 0% { opacity: 0; transform: perspective(1000px) rotateX(-10deg) rotateY(5deg) scale(0.95); } 100% { opacity: 1; transform: perspective(1000px) rotateX(0) rotateY(0) scale(1); } }
            @keyframes br-anim-glitch { 0% { opacity: 0; filter: contrast(200%) hue-rotate(90deg); transform: translate(-6px, 6px) skewX(10deg); } 50% { opacity: 0.8; filter: contrast(150%) hue-rotate(-90deg); transform: translate(6px, -6px) skewX(-10deg); } 100% { opacity: 1; filter: contrast(100%) hue-rotate(0deg); transform: translate(0,0) skewX(0); } }
            @keyframes br-anim-bounce { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.05); } 70% { transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
            @keyframes br-anim-fade { 0% { opacity: 0; } 100% { opacity: 1; } }
            @keyframes br-anim-slide { 0% { opacity: 0; transform: translateX(-30px); } 100% { opacity: 1; transform: translateX(0); } }
            @keyframes br-anim-rotate { 0% { opacity: 0; transform: rotate(-20deg) scale(0.8); } 100% { opacity: 1; transform: rotate(0) scale(1); } }
            @keyframes br-pulse-slow { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.2); opacity: 1; } }
            @keyframes brSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            * { -webkit-font-smoothing: antialiased; -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
            body::before { content: ""; position: fixed; top: 0; left: 0; width: 100%; height: var(--true-bg-h, 100vh); background: var(--br-bg) no-repeat center center; background-size: cover; z-index: -2; pointer-events: none; transform: translate3d(0,0,0); backface-visibility: hidden; display: var(--br-show-bg, block); }
            html { background: #111 !important; scrollbar-color: var(--br-primary) transparent; scrollbar-width: thin; }
            body { background: transparent !important; min-height: 100vh; color: var(--br-text-col, inherit); font-family: var(--br-font), sans-serif !important; overflow-x: hidden; touch-action: manipulation; }
            .p-pageWrapper { padding-bottom: calc(var(--br-dock-bot) + 80px) !important; }
            .u-scrollButtons { bottom: calc(var(--br-dock-bot) + 80px) !important; z-index: 99998 !important; transition: bottom var(--br-speed); }
            .p-pageWrapper, .p-body-inner, .p-footer, .p-sectionLinks { background: rgba(0,0,0,var(--br-l1)) !important; border: none !important; }
            .menu-content, .offCanvasMenu-content, .overlay-container .overlay-content, .formPopup .menu-content, .tooltip-content, .memberTooltip, .widget-container .widget, .fr-popup, .fr-dropdown-menu, .blockStatus { backdrop-filter: blur(var(--br-blur)) saturate(180%) !important; -webkit-backdrop-filter: blur(var(--br-blur)) saturate(180%) !important; transform: translateZ(0); backface-visibility: hidden; will-change: transform, backdrop-filter; }
            body:not(.template-thread_view) .block-container, .message-inner, .pageNav-page:not(.bbCodeBlock) { background: rgba(30,30,35,var(--br-l2)) !important; border: none !important; border-radius: var(--br-rad) !important; transition: box-shadow var(--br-speed) var(--br-ease), transform var(--br-speed) var(--br-ease); }
            .menu-content, .offCanvasMenu-content, .overlay-container .overlay-content, .formPopup .menu-content, .tooltip-content, .memberTooltip, .widget-container .widget, .fr-popup, .fr-dropdown-menu, .blockStatus { background: rgba(var(--br-tint),var(--br-l3)) !important; border: none !important; border-radius: var(--br-rad) !important; box-shadow: inset 0 0 0 var(--br-bw) var(--br-border), 0 10px 30px rgba(0,0,0,0.4) !important; animation: var(--br-popup-anim); transform-origin: top center !important; }
            .memberHeader-main, .memberTooltip-header { border-radius: var(--br-rad) !important; overflow: visible !important; background-color: rgba(var(--br-tint),var(--br-l2)) !important; }
            .profileHeader-cover { border-radius: var(--br-rad) var(--br-rad) 0 0 !important; overflow: hidden !important; background-color: rgba(var(--br-tint),var(--br-l2)) !important; }
            .memberHeader-content { background: transparent !important; }
            .p-nav { background: linear-gradient(180deg, rgba(var(--br-tint),0.95) 0%, rgba(var(--br-tint),0) 100%) !important; border: none !important; box-shadow: none !important; backdrop-filter: none !important; }
            .block-container:hover { transform: none !important; box-shadow: inset 0 0 0 var(--br-bw) var(--br-border), 0 10px 30px rgba(0,0,0,0.3) !important; }
            .block-filterBar, .bbCodeBlock-content, .structItem, .p-header, .p-footer, .p-body, .p-body-header, .p-body-sidebar, .menu, .menu-row, .menu-linkRow, .menu-header, .menu-footer, .menu-scroller, .menu-separator, .pageHeader, .pageNav, .pageNav-jump, .tabs-tab, .tabs--standalone, .block-header, .block-minorHeader, .block-tabHeader, .block-footer, .block-formSection, .block-formRow, .filterBar, .filterBar-menuTrigger, .p-footer-inner, .p-footer-row, .p-sectionLinks, .uix_extendedFooterRow, .fr-toolbar, .p-breadcrumbs, .memberTooltip-content, .tooltip, .reactionsBar, .attachedFiles, .bbCodeCode, .p-body-inner, .message, .message-cell, .block-body, .bbCodeBlock, .bbCodeBlock-title, .widget-container, .notice, .overlay-container .overlay, .message-responseRow, .buttonGroup, .fr-box.fr-basic.is-focused, .fr-toolbar .fr-more-toolbar, .fr-box.fr-basic, button.button, a.button.button--link, .inputGroup, .inputGroup-text, .formRow, .block-minorTabHeader, .blockMessage, .js-quickReply.block .message, .block--messages .block-row, .js-quickReply .block-row, .node--depth2:nth-child(even) .node-body, .node-body, .message-cell.message-cell--user, .message-cell.message-cell--action, .block--messages.block .message, .button.button--link, .offCanvasMenu-linkHolder, .offCanvasMenu-list, .offCanvasMenu-subList, .formPopup-outer, .inputChoices, .inputChoices-choice, .button--primary, .button--plain, .button--icon, .p-navEl, .p-navEl-link, .hScroller-action, .p-sectionLinks-list, .blockLink, .uix_extendedFooterRow .block-container, .uix_extendedFooterRow .block-body, .p-nav-search, .p-breadcrumbs--parent, .p-breadcrumbs--child, .node-main, .node-stats, .node-extra, .node-icon, .structItem-cell, .structItem-parts, .fr-wrapper, .fr-element, .menu-link, .blockStatus { background: transparent !important; border: none !important; box-shadow: none !important; }
            .structItem, .node-body, .block-header { border-bottom: 1px solid rgba(255,255,255,0.05) !important; }
            .structItem:hover { background: rgba(255,255,255,0.03) !important; transition: background var(--br-speed) var(--br-ease); }
            .button, .button--primary, .button--cta, .pageNav-page, .button--icon, .button--link { border-radius: var(--br-rad) !important; transition: all var(--br-speed) var(--br-ease); position: relative; text-decoration: none !important; display: inline-flex; align-items: center; justify-content: center; }
            .button:hover, .button--primary:hover, .button--cta:hover, .pageNav-page:hover, .button--icon:hover, .button--link:hover { transform: translateY(-2px); z-index: 2; }
            .button:active, .button--primary:active, .button--cta:active, .pageNav-page:active, .button--icon:active, .button--link:active { transform: translateY(1px); }
            .pageNav-page--current { background: #fff !important; color: var(--br-primary) !important; text-shadow: none; box-shadow: 0 0 15px rgba(255,255,255,0.5) !important; border-color: #fff !important; font-weight: 800; }

            html[br-s-btn="flat"] :is(.button,.button--primary,.button--cta,.pageNav-page) { background: var(--br-primary) !important; border: none !important; color: #fff !important; box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important; text-shadow: none !important; transition: transform var(--br-speed), box-shadow var(--br-speed), background var(--br-speed) !important; border-radius: var(--br-rad) !important; }
            html[br-s-btn="flat"] :is(.button:hover,.button--primary:hover,.button--cta:hover,.pageNav-page:hover) { transform: translateY(-2px); box-shadow: 0 8px 20px color-mix(in srgb, var(--br-primary) 40%, transparent) !important; filter: brightness(1.1); }
            html[br-s-btn="glass"] :is(.button,.button--primary,.button--cta,.pageNav-page) { background: rgba(255,255,255,0.08) !important; border: 1px solid rgba(255,255,255,0.15) !important; color: #fff !important; backdrop-filter: blur(12px) !important; -webkit-backdrop-filter: blur(12px) !important; box-shadow: 0 4px 15px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2) !important; text-shadow: 0 1px 3px rgba(0,0,0,0.5) !important; transition: 0.3s !important; border-radius: var(--br-rad) !important; }
            html[br-s-btn="glass"] :is(.button:hover,.button--primary:hover,.button--cta:hover,.pageNav-page:hover) { background: rgba(255,255,255,0.15) !important; border-color: rgba(255,255,255,0.3) !important; box-shadow: 0 8px 25px rgba(0,0,0,0.3), 0 0 15px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.4) !important; transform: translateY(-2px); }
            html[br-s-btn="solid"] :is(.button,.button--primary,.button--cta,.pageNav-page) { background: #1a1a1e !important; border: 1px solid #333 !important; border-bottom: 3px solid var(--br-primary) !important; color: #fff !important; box-shadow: 0 5px 15px rgba(0,0,0,0.7) !important; text-shadow: 0 1px 2px rgba(0,0,0,0.8) !important; transition: all 0.1s !important; border-radius: var(--br-rad) !important; font-weight: 800 !important; }
            html[br-s-btn="solid"] :is(.button:hover,.button--primary:hover,.button--cta:hover,.pageNav-page:hover) { transform: translateY(1px); border-bottom-width: 1px !important; box-shadow: 0 2px 8px rgba(0,0,0,0.8) !important; background: #222 !important; }
            html[br-s-btn="neon"] :is(.button,.button--primary,.button--cta,.pageNav-page) { background: #050505 !important; border: 1px solid var(--br-primary) !important; color: var(--br-primary) !important; box-shadow: 0 0 10px rgba(var(--br-tint), 0.2), inset 0 0 5px rgba(var(--br-tint), 0.2) !important; text-shadow: 0 0 5px var(--br-primary) !important; transition: all var(--br-speed) !important; border-radius: var(--br-rad) !important; font-weight: 900 !important; letter-spacing: 0.5px !important; }
            html[br-s-btn="neon"] :is(.button:hover,.button--primary:hover,.button--cta:hover,.pageNav-page:hover) { background: var(--br-primary) !important; color: #000 !important; box-shadow: 0 0 20px var(--br-primary), inset 0 0 10px rgba(255,255,255,0.5) !important; text-shadow: none !important; transform: translateY(-2px); border-color: #fff !important; }
            html[br-s-btn="gradient"] :is(.button,.button--primary,.button--cta,.pageNav-page) { background: linear-gradient(135deg, var(--br-primary), var(--br-accent)) !important; border: 1px solid rgba(255,255,255,0.2) !important; color: #fff !important; box-shadow: 0 4px 15px rgba(0,0,0,0.4) !important; text-shadow: 0 1px 2px rgba(0,0,0,0.5) !important; transition: all var(--br-speed) !important; border-radius: var(--br-rad) !important; font-weight: 800 !important; }
            html[br-s-btn="gradient"] :is(.button:hover,.button--primary:hover,.button--cta:hover,.pageNav-page:hover) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(var(--br-tint), 0.5) !important; filter: brightness(1.2); }
            html[br-s-btn="heavy"] :is(.button,.button--primary,.button--cta,.pageNav-page) { background: #0f0f12 !important; border: 2px solid var(--br-primary) !important; color: #fff !important; box-shadow: 0 4px 12px rgba(0,0,0,0.6) !important; transition: all var(--br-speed) !important; border-radius: var(--br-rad) !important; font-weight: 800 !important; }
            html[br-s-btn="heavy"] :is(.button:hover,.button--primary:hover,.button--cta:hover,.pageNav-page:hover) { background: var(--br-primary) !important; color: #fff !important; box-shadow: 0 0 15px var(--br-primary) !important; transform: translateY(-2px); }
            html[br-s-btn="glow"] :is(.button,.button--primary,.button--cta,.pageNav-page) { background: transparent !important; border: 2px solid var(--br-primary) !important; color: var(--br-primary) !important; box-shadow: 0 0 20px rgba(var(--br-tint),0.2), inset 0 0 20px rgba(var(--br-tint),0.1) !important; transition: all var(--br-speed) !important; border-radius: var(--br-rad) !important; font-weight: 700 !important; }
            html[br-s-btn="glow"] :is(.button:hover,.button--primary:hover,.button--cta:hover,.pageNav-page:hover) { background: var(--br-primary) !important; color: #fff !important; box-shadow: 0 0 40px var(--br-primary), inset 0 0 20px rgba(255,255,255,0.3) !important; transform: translateY(-2px) scale(1.02); }
            html[br-s-btn="3d"] :is(.button,.button--primary,.button--cta,.pageNav-page) { background: var(--br-primary) !important; border: none !important; color: #fff !important; box-shadow: 0 6px 0 rgba(0,0,0,0.3), 0 8px 20px rgba(0,0,0,0.4) !important; transform: translateY(0) !important; transition: all 0.1s !important; border-radius: var(--br-rad) !important; font-weight: 800 !important; }
            html[br-s-btn="3d"] :is(.button:hover,.button--primary:hover,.button--cta:hover,.pageNav-page:hover) { transform: translateY(-2px) !important; box-shadow: 0 8px 0 rgba(0,0,0,0.3), 0 12px 30px rgba(0,0,0,0.5) !important; }
            html[br-s-btn="3d"] :is(.button:active,.button--primary:active,.button--cta:active,.pageNav-page:active) { transform: translateY(4px) !important; box-shadow: 0 2px 0 rgba(0,0,0,0.3) !important; }

            html[br-s-scroll="def"] ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
            html[br-s-scroll="def"] ::-webkit-scrollbar-track { background: transparent; }
            html[br-s-scroll="def"] ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 6px; transition: background var(--br-speed); }
            html[br-s-scroll="def"] ::-webkit-scrollbar-thumb:hover { background: var(--br-primary); }
            html[br-s-scroll="def"] ::-webkit-scrollbar-corner { background: transparent; }
            html[br-s-scroll="mac"] ::-webkit-scrollbar { width: 14px; height: 14px; background: transparent; }
            html[br-s-scroll="mac"] ::-webkit-scrollbar-track { background: transparent; }
            html[br-s-scroll="mac"] ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; border: 4px solid rgba(0,0,0,0); background-clip: padding-box; transition: 0.2s; }
            html[br-s-scroll="mac"] ::-webkit-scrollbar-thumb:hover { background-color: var(--br-primary); border-width: 2px; }
            html[br-s-scroll="mac"] ::-webkit-scrollbar-corner { background: transparent; }
            html[br-s-scroll="hide"] ::-webkit-scrollbar { width: 0px !important; height: 0px !important; display: none !important; }
            html[br-s-scroll="thin"] ::-webkit-scrollbar { width: 3px; height: 3px; background: transparent; }
            html[br-s-scroll="thin"] ::-webkit-scrollbar-track { background: transparent; }
            html[br-s-scroll="thin"] ::-webkit-scrollbar-thumb { background: var(--br-primary); border-radius: 10px; }
            html[br-s-scroll="thin"] ::-webkit-scrollbar-thumb:hover { background: var(--br-accent); }

            @keyframes br-ava-sq { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
            html[br-s-ava="def"] :is(.avatar img, .avatar) { border-radius: 50% !important; }
            html[br-s-ava="sq"] .avatar { border-radius: 22% !important; padding: 2px !important; background: linear-gradient(45deg, var(--br-primary), transparent 30%, var(--br-accent) 70%, transparent) !important; background-size: 200% 200% !important; animation: br-ava-sq 3s infinite linear !important; display: inline-flex !important; align-items: center; justify-content: center; box-sizing: border-box !important; }
            html[br-s-ava="sq"] .avatar img { border-radius: 18% !important; width: 100% !important; height: 100% !important; display: block !important; }
            html[br-s-ava="hex"] .avatar { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%) !important; border-radius: 0 !important; background: linear-gradient(135deg, var(--br-primary), var(--br-accent)) !important; padding: 2px !important; display: inline-flex !important; align-items: center; justify-content: center; box-sizing: border-box !important; }
            html[br-s-ava="hex"] .avatar img { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%) !important; border-radius: 0 !important; width: 100% !important; height: 100% !important; display: block !important; }
            html[br-s-ava="glow"] .avatar { border-radius: 50% !important; padding: 3px !important; background: rgba(20,20,25,0.95) !important; position: relative; display: inline-flex !important; align-items: center; justify-content: center; box-sizing: border-box !important; z-index: 1; overflow: hidden !important; }
            html[br-s-ava="glow"] .avatar::before { content: ''; position: absolute; width: 150%; height: 150%; background: conic-gradient(transparent, var(--br-primary), transparent 40%); animation: brSpin 2.5s linear infinite; z-index: -1; }
            html[br-s-ava="glow"] .avatar img { border-radius: 50% !important; width: 100% !important; height: 100% !important; display: block !important; position: relative; z-index: 2; border: 1px solid rgba(255,255,255,0.05); }
            .message-avatar-wrapper .message-avatar-online { z-index: 5 !important; }

            html[br-s-inp="def"] .input, html[br-s-inp="def"] select, html[br-s-inp="def"] .textarea { border: var(--br-bw) solid rgba(255,255,255,0.1) !important; border-radius: var(--br-rad) !important; box-shadow: inset 0 1px 3px rgba(0,0,0,0.2) !important; background: rgba(var(--br-tint),var(--br-l3)) !important; }
            html[br-s-inp="def"] .input:focus, html[br-s-inp="def"] select:focus, html[br-s-inp="def"] .textarea:focus { border-color: var(--br-primary) !important; box-shadow: 0 0 0 2px rgba(var(--br-tint), 0.3) !important; }
            html[br-s-inp="line"] .input, html[br-s-inp="line"] select, html[br-s-inp="line"] .textarea { border: none !important; border-bottom: var(--br-bw) solid rgba(255,255,255,0.2) !important; border-radius: calc(var(--br-rad) / 3) calc(var(--br-rad) / 3) 0 0 !important; box-shadow: none !important; background: rgba(var(--br-tint),var(--br-l3)) !important; }
            html[br-s-inp="line"] .input:focus, html[br-s-inp="line"] select:focus, html[br-s-inp="line"] .textarea:focus { border-bottom-color: var(--br-primary) !important; background: rgba(var(--br-tint), calc(var(--br-l3) + 0.1)) !important; }
            html[br-s-inp="round"] .input, html[br-s-inp="round"] select, html[br-s-inp="round"] .textarea { border: var(--br-bw) solid rgba(255,255,255,0.1) !important; border-radius: 50px !important; padding-left: 20px !important; background: rgba(var(--br-tint),var(--br-l3)) !important; }
            html[br-s-inp="round"] .input:focus, html[br-s-inp="round"] select:focus, html[br-s-inp="round"] .textarea:focus { border-color: var(--br-primary) !important; box-shadow: 0 0 10px rgba(var(--br-tint), 0.5) !important; }
            html[br-s-inp="glass"] .input, html[br-s-inp="glass"] select, html[br-s-inp="glass"] .textarea { border: var(--br-bw) solid rgba(255,255,255,0.15) !important; border-radius: var(--br-rad) !important; backdrop-filter: blur(var(--br-blur)); box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important; background: rgba(255,255,255,0.05) !important; }
            html[br-s-inp="glass"] .input:focus, html[br-s-inp="glass"] select:focus, html[br-s-inp="glass"] .textarea:focus { border-color: var(--br-border) !important; background: rgba(255,255,255,0.1) !important; }
            html[br-s-inp="glass"] select option { background: #222 !important; color: #fff !important; }
            html[br-s-inp="neon"] :is(.input,select,.textarea){border:none!important;border-bottom:var(--br-bw) solid rgba(255,255,255,0.1)!important;border-radius:0!important;background:rgba(0,0,0,0.3)!important;box-shadow:none!important;background-image:linear-gradient(var(--br-primary),var(--br-primary))!important;background-position:center bottom!important;background-size:0 var(--br-bw)!important;background-repeat:no-repeat!important;transition:background-size var(--br-speed) ease,background-color var(--br-speed) ease!important}
            html[br-s-inp="neon"] :is(.input:focus,select:focus,.textarea:focus){background-color:rgba(var(--br-tint),0.15)!important;background-size:100% var(--br-bw)!important;box-shadow:0 10px 20px -5px rgba(var(--br-tint),0.4)!important}
            html[br-s-inp="neon"] select option { background: #050505 !important; color: #fff !important; }

            a:not(.button):not(.tabs-tab):not(.label), .p-title-value, .structItem-title, .structItem-title a, .node-title a, .block-header, .pairs dt { color: var(--br-text-col, inherit); text-decoration: none !important; text-shadow: 0 0 10px rgba(0,0,0,0.3); transition: color var(--br-speed); }
            .node-description, .node-stats, .node-extra, .structItem-minor, .structItem-parts, .structItem-parts a, time, .u-dt { color: var(--br-sec-text-col, #888888) !important; transition: color var(--br-speed); }

            html[br-s-prf="def"] .label { border-radius: var(--br-rad) !important; border: 1px solid rgba(255,255,255,0.1) !important; }
            html[br-s-prf="pill"] .label { border-radius: 99px !important; border: 1px solid rgba(255,255,255,0.2) !important; }
            html[br-s-prf="sharp"] .label { border-radius: 0 !important; transform: skewX(-10deg); border: 1px solid rgba(255,255,255,0.2) !important; margin-right: 5px; }
            html[br-s-prf="sharp"] .label span { transform: skewX(10deg); display: inline-block; }
            html[br-s-prf="left"] .label { border-radius: 0 4px 4px 0 !important; border: none !important; border-left: 3px solid #fff !important; box-shadow: -5px 0 15px -5px rgba(0,0,0,0.5) !important; }
            html[br-s-prf="glow"] .label { border-radius: var(--br-rad) !important; border: 1px solid rgba(255,255,255,0.2) !important; box-shadow: 0 0 10px -2px currentColor !important; }
            html[br-s-prf="neon"] .label { border-radius: var(--br-rad) !important; border: 1px solid var(--br-primary) !important; box-shadow: 0 0 15px var(--br-primary) !important; background: rgba(var(--br-tint),0.1) !important; }
            html[br-s-prf="minimal"] .label { border: none !important; background: transparent !important; color: var(--br-primary) !important; font-weight: 800 !important; }

            html[br-b="def"] body:not(.template-thread_view) .block-container, html[br-b="def"] .message-inner, html[br-b="def"] .pageNav-page:not(.bbCodeBlock), html[br-b="def"] .menu-content, html[br-b="def"] .offCanvasMenu-content, html[br-b="def"] .overlay-container .overlay-content, html[br-b="def"] .formPopup .menu-content, html[br-b="def"] .tooltip-content, html[br-b="def"] .memberTooltip, html[br-b="def"] .widget-container .widget, html[br-b="def"] .fr-popup, html[br-b="def"] .fr-dropdown-menu, html[br-b="def"] .blockStatus { box-shadow: inset 0 0 0 var(--br-bw) var(--br-border), 0 5px 20px rgba(0,0,0,0.2) !important; }
            html[br-b="neon"] body:not(.template-thread_view) .block-container, html[br-b="neon"] .message-inner, html[br-b="neon"] .pageNav-page:not(.bbCodeBlock), html[br-b="neon"] .menu-content, html[br-b="neon"] .offCanvasMenu-content, html[br-b="neon"] .overlay-container .overlay-content, html[br-b="neon"] .formPopup .menu-content, html[br-b="neon"] .tooltip-content, html[br-b="neon"] .memberTooltip, html[br-b="neon"] .widget-container .widget, html[br-b="neon"] .fr-popup, html[br-b="neon"] .fr-dropdown-menu, html[br-b="neon"] .blockStatus { box-shadow: inset 0 0 0 var(--br-bw) var(--br-border), 0 0 15px var(--br-border) !important; border: none !important; }
            html[br-b="glass"] body:not(.template-thread_view) .block-container, html[br-b="glass"] .message-inner, html[br-b="glass"] .pageNav-page:not(.bbCodeBlock), html[br-b="glass"] .menu-content, html[br-b="glass"] .offCanvasMenu-content, html[br-b="glass"] .overlay-container .overlay-content, html[br-b="glass"] .formPopup .menu-content, html[br-b="glass"] .tooltip-content, html[br-b="glass"] .memberTooltip, html[br-b="glass"] .widget-container .widget, html[br-b="glass"] .fr-popup, html[br-b="glass"] .fr-dropdown-menu, html[br-b="glass"] .blockStatus { box-shadow: inset 0 var(--br-bw) 0 rgba(255,255,255,0.4), inset 0 calc(var(--br-bw) * -1) 0 rgba(0,0,0,0.6), inset 0 0 0 var(--br-bw) rgba(255,255,255,0.1) !important; border: none !important; }
            html[br-b="cyber"] body:not(.template-thread_view) .block-container, html[br-b="cyber"] .message-inner, html[br-b="cyber"] .pageNav-page:not(.bbCodeBlock), html[br-b="cyber"] .menu-content, html[br-b="cyber"] .offCanvasMenu-content, html[br-b="cyber"] .overlay-container .overlay-content, html[br-b="cyber"] .formPopup .menu-content, html[br-b="cyber"] .tooltip-content, html[br-b="cyber"] .memberTooltip, html[br-b="cyber"] .widget-container .widget, html[br-b="cyber"] .fr-popup, html[br-b="cyber"] .fr-dropdown-menu, html[br-b="cyber"] .blockStatus { box-shadow: 0 0 0 var(--br-bw) var(--br-border), inset 0 0 5px rgba(0,0,0,0.5) !important; border: none !important; }
            html[br-b="none"] body:not(.template-thread_view) .block-container, html[br-b="none"] .message-inner, html[br-b="none"] .pageNav-page:not(.bbCodeBlock), html[br-b="none"] .menu-content, html[br-b="none"] .offCanvasMenu-content, html[br-b="none"] .overlay-container .overlay-content, html[br-b="none"] .formPopup .menu-content, html[br-b="none"] .tooltip-content, html[br-b="none"] .memberTooltip, html[br-b="none"] .widget-container .widget, html[br-b="none"] .fr-popup, html[br-b="none"] .fr-dropdown-menu, html[br-b="none"] .blockStatus { box-shadow: none !important; border: none !important; }

            html[br-h="min"] .p-nav { background: transparent !important; border: none !important; box-shadow: none !important; }
            @keyframes br-aurora-move { 0% { transform: translateX(-50%); } 100% { transform: translateX(0%); } }
            html[br-h="flow"] .p-nav { position: sticky !important; top: 0 !important; background: rgba(10, 10, 15, 0.5) !important; border: none !important; border-bottom: 2px solid color-mix(in srgb, var(--br-accent) 60%, transparent) !important; box-shadow: 0 10px 25px rgba(0,0,0,0.4) !important; overflow: hidden !important; z-index: 1000 !important; }
            html[br-h="flow"] .p-nav::before { content: "" !important; position: absolute !important; top: 0 !important; left: 0 !important; width: 200% !important; height: 100% !important; background: linear-gradient(90deg, color-mix(in srgb, var(--br-primary) 30%, transparent), color-mix(in srgb, var(--br-accent) 30%, transparent), color-mix(in srgb, var(--br-primary) 30%, transparent)) !important; animation: br-aurora-move 5s linear infinite alternate !important; pointer-events: none !important; z-index: -1 !important; }
            @keyframes br-levitate { 0% { transform: translateY(0px); } 50% { transform: translateY(4px); } 100% { transform: translateY(0px); } }
            html[br-h="hover"] .p-nav { position: sticky !important; top: 8px !important; margin: 8px 2% !important; width: 96% !important; border-radius: 16px !important; background: color-mix(in srgb, var(--br-primary) 15%, rgba(10, 10, 15, 0.5)) !important; border: 1px solid color-mix(in srgb, var(--br-primary) 30%, transparent) !important; box-shadow: 0 10px 25px color-mix(in srgb, var(--br-primary) 25%, transparent) !important; animation: br-levitate 4s ease-in-out infinite !important; transition: transform 0.3s ease, box-shadow 0.3s ease !important; z-index: 1000 !important; }
            html[br-h="hover"] .p-nav:hover { animation-play-state: paused !important; transform: translateY(0px) !important; box-shadow: 0 5px 15px color-mix(in srgb, var(--br-primary) 40%, transparent) !important; }
            @keyframes br-holo-glare { 0% { transform: translateX(-100%) skewX(-20deg); } 100% { transform: translateX(300%) skewX(-20deg); } }
            html[br-h="shimmer"] .p-nav { position: sticky !important; top: 0 !important; background: color-mix(in srgb, var(--br-primary) 15%, rgba(10, 10, 15, 0.5)) !important; border: none !important; border-bottom: 2px solid var(--br-primary) !important; box-shadow: 0 10px 20px rgba(0,0,0,0.5) !important; overflow: hidden !important; z-index: 1000 !important; }
            html[br-h="shimmer"] .p-nav::after { content: "" !important; position: absolute !important; top: 0 !important; left: 0 !important; width: 50% !important; height: 100% !important; background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--br-accent) 60%, rgba(255,255,255,0.2)), transparent) !important; animation: br-holo-glare 3s infinite linear !important; pointer-events: none !important; z-index: 1 !important; transform-origin: left; }
            html[br-h="glow"] .p-nav { position: sticky !important; top: 0 !important; background: rgba(10,10,15,0.8) !important; border-bottom: 2px solid var(--br-primary) !important; box-shadow: 0 0 30px var(--br-primary), 0 5px 20px rgba(0,0,0,0.5) !important; z-index: 1000 !important; }
            html[br-h="minimal"] .p-nav { background: rgba(0,0,0,0.3) !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; box-shadow: none !important; }

            /* ===== Док ===== */
            .br-dock {
                position: fixed;
                bottom: calc(var(--br-dock-bot) + env(safe-area-inset-bottom));
                left: 50%;
                transform: translateX(-50%);
                height: 56px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 8px;
                z-index: 99999;
                width: max-content;
                max-width: 90vw;
                overflow-x: auto;
                scrollbar-width: none;
                transition: transform var(--br-speed) var(--br-ease);
                border-radius: 50px;
            }
            .br-dock.hide { transform: translate(-50%, 150%); }
            .br-dock::-webkit-scrollbar { display: none; }

            .br-dock-gear {
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: var(--br-speed);
                flex-shrink: 0;
                font-size: 18px;
                line-height: 1;
                background: transparent;
                border: none;
                padding: 0 8px;
                height: 100%;
                color: currentColor;
                text-decoration: none;
                border-bottom: 2px solid rgb(170, 170, 170);
            }
            .br-dock-gear:hover {
                transform: scale(1.1);
            }

            /* Форма дока */
            html[br-dock-shape="round"] .br-dock { border-radius: 50px !important; }
            html[br-dock-shape="round"] .br-dock-gear { border-radius: 50% !important; }
            html[br-dock-shape="square"] .br-dock { border-radius: 8px !important; }
            html[br-dock-shape="square"] .br-dock-gear { border-radius: 6px !important; }

            /* Позиции дока */
            html[br-dock-pos="bottom"] .br-dock {
                bottom: calc(var(--br-dock-bot) + env(safe-area-inset-bottom));
                left: 50%;
                transform: translateX(-50%);
                top: auto;
                right: auto;
                flex-direction: row;
                border-radius: 50px;
                width: max-content;
                max-width: 90vw;
                height: 56px;
                padding: 0 16px;
            }
            html[br-dock-pos="bottom"] .br-dock.hide { transform: translate(-50%, 150%); }
            html[br-dock-pos="left"] .br-dock {
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                flex-direction: column;
                width: 56px;
                height: auto;
                max-height: 70vh;
                padding: 12px 8px;
                border-radius: 28px;
                bottom: auto;
                right: auto;
                gap: 8px;
            }
            html[br-dock-pos="left"] .br-dock-gear { width: 48px; height: 48px; }
            html[br-dock-pos="left"] .br-dock.hide { transform: translateY(-50%) translateX(-150%); }
            html[br-dock-pos="right"] .br-dock {
                right: 16px;
                top: 50%;
                transform: translateY(-50%);
                flex-direction: column;
                width: 56px;
                height: auto;
                max-height: 70vh;
                padding: 12px 8px;
                border-radius: 28px;
                bottom: auto;
                left: auto;
                gap: 8px;
            }
            html[br-dock-pos="right"] .br-dock-gear { width: 48px; height: 48px; }
            html[br-dock-pos="right"] .br-dock.hide { transform: translateY(-50%) translateX(150%); }

            /* top – встраивается в панель модеров */
            html[br-dock-pos="top"] .br-dock {
                position: static !important;
                display: inline-flex !important;
                flex-direction: row !important;
                height: 34px !important;
                padding: 0 6px !important;
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
                backdrop-filter: none !important;
                width: auto !important;
                max-width: none !important;
                transform: none !important;
                gap: 4px;
                margin-left: auto !important;
                flex-shrink: 0 !important;
                align-items: center !important;
                vertical-align: middle !important;
                order: 999 !important;
                margin-top: 0 !important;
                margin-bottom: 0 !important;
            }
            html[br-dock-pos="top"] .br-dock-gear {
                width: 32px;
                height: 32px;
                border-radius: 6px !important;
                background: rgba(255,255,255,0.06);
                border: 1px solid rgba(255,255,255,0.08);
                font-size: 14px;
                border-bottom: 2px solid rgb(170, 170, 170);
            }
            html[br-dock-pos="top"] .br-dock.hide { display: none !important; }

            html[br-d="def"] .br-dock, html[br-d="def"] .br-toast { background: rgba(20,20,25,0.7) !important; border: 1px solid rgba(255,255,255,0.08) !important; border-top: 1px solid rgba(255,255,255,0.15) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important; backdrop-filter: blur(var(--br-blur)) !important; }
            html[br-d="def"] .br-dock-gear { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); }
            html[br-d="def"] .br-dock-gear:hover { background: var(--br-primary); border-color: transparent; box-shadow: 0 5px 15px rgba(var(--br-primary), 0.4); transform: translateY(-2px); color: #fff; }
            html[br-d="neon"] .br-dock, html[br-d="neon"] .br-toast { background: rgba(10,10,12,0.9) !important; border: var(--br-bw) solid var(--br-primary) !important; box-shadow: 0 0 20px rgba(var(--br-primary), 0.2), inset 0 0 10px rgba(var(--br-primary), 0.1) !important; backdrop-filter: blur(var(--br-blur)) !important; }
            html[br-d="neon"] .br-dock-gear { background: transparent; border: 1px solid transparent; }
            html[br-d="neon"] .br-dock-gear:hover { background: rgba(var(--br-primary), 0.15); border-color: var(--br-primary); box-shadow: 0 0 15px rgba(var(--br-primary), 0.4); transform: translateY(-2px); color: #fff; filter: drop-shadow(0 0 5px #fff); }
            html[br-d="str"] .br-dock, html[br-d="str"] .br-toast { background: #121214 !important; border: 2px solid rgba(255,255,255,0.05) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.8) !important; backdrop-filter: none !important; }
            html[br-d="str"] .br-dock-gear { background: transparent; border: 1px solid rgba(255,255,255,0.08); }
            html[br-d="str"] .br-dock-gear:hover { border-color: var(--br-primary); background: rgba(255,255,255,0.02); transform: translateY(-2px); color: var(--br-primary); }
            html[br-d="inv"] .br-dock { background: transparent !important; border: none !important; box-shadow: none !important; backdrop-filter: none !important; padding: 0 !important; gap: 12px !important; }
            html[br-d="inv"] .br-toast { background: linear-gradient(135deg, rgba(40,40,45,0.8), rgba(20,20,25,0.9)) !important; backdrop-filter: blur(var(--br-blur)) !important; border: 1px solid rgba(255,255,255,0.1) !important; border-top: 1px solid rgba(255,255,255,0.2) !important; box-shadow: 0 15px 30px rgba(0,0,0,0.6) !important; }
            html[br-d="inv"] .br-dock-gear { background: linear-gradient(135deg, rgba(40,40,45,0.7), rgba(20,20,25,0.8)); backdrop-filter: blur(var(--br-blur)); border: 1px solid rgba(255,255,255,0.1); border-top: 1px solid rgba(255,255,255,0.2); box-shadow: 0 10px 25px rgba(0,0,0,0.5); border-radius: 50px; }
            html[br-d="inv"] .br-dock-gear:hover { color: #fff; background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.3); transform: translateY(-3px) scale(1.05); box-shadow: 0 15px 30px rgba(255,255,255,0.1); }
            html[br-d="glass"] .br-dock, html[br-d="glass"] .br-toast { background: rgba(255,255,255,0.06) !important; backdrop-filter: blur(20px) !important; border: 1px solid rgba(255,255,255,0.12) !important; box-shadow: 0 10px 40px rgba(0,0,0,0.4) !important; }
            html[br-d="glass"] .br-dock-gear { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
            html[br-d="glass"] .br-dock-gear:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.3); transform: translateY(-2px); box-shadow: 0 0 30px rgba(255,255,255,0.1); color: #fff; }
            html[br-d="dark"] .br-dock, html[br-d="dark"] .br-toast { background: #0a0a0c !important; border: 1px solid rgba(255,255,255,0.05) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.8) !important; }
            html[br-d="dark"] .br-dock-gear { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.03); }
            html[br-d="dark"] .br-dock-gear:hover { background: var(--br-primary); color: #fff; transform: translateY(-2px); box-shadow: 0 5px 20px rgba(var(--br-primary),0.4); }

            .br-toast-wrap { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 100002; display: flex; flex-direction: column; gap: 8px; pointer-events: none; align-items: center; width: 100%; }
            .br-toast { pointer-events: auto; display: flex; align-items: center; justify-content: center; gap: 12px; padding: 12px 24px; min-width: 280px; max-width: 90vw; color: #fff; font-size: 13px; font-weight: 700; transition: var(--br-speed); animation: br-toast-in var(--br-speed) var(--br-ease) backwards; border-radius: 50px; border: var(--br-bw) solid transparent; }
            .br-toast.hide { animation: br-toast-out var(--br-speed) var(--br-ease) forwards; }
            @keyframes br-toast-in { 0% { opacity: 0; transform: translateY(-30px) scale(0.9); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
            @keyframes br-toast-out { 0% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-30px) scale(0.9); } }

            .br-ui { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 100000; display: flex; align-items: center; justify-content: center; opacity: 0; visibility: hidden; transition: opacity var(--br-speed) var(--br-ease), visibility 0s linear var(--br-speed); backdrop-filter: none; -webkit-backdrop-filter: none; }
            .br-ui.active { opacity: 1; visibility: visible; transition: opacity var(--br-speed) var(--br-ease), visibility 0s linear 0s; pointer-events: all; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
            .br-ui:not(.active) * { animation-play-state: paused !important; }
            .br-box { width: 95vw; max-width: 750px; max-height: 90vh; background: #141414; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.5); transform: scale(0.92) translateY(15px); opacity: 0; transition: transform var(--br-speed) var(--br-enter), opacity var(--br-speed) var(--br-enter); backdrop-filter: none; will-change: transform, opacity; }
            .br-ui.active .br-box { transform: scale(1) translateY(0); opacity: 1; }
            .br-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.03); background: #1a1a1e; }
            .br-title { font-size: 15px; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
            .br-btn-close { width: 32px; height: 32px; background: #222; border: none; border-radius: 10px; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; transition: var(--br-speed); box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
            .br-btn-close:hover { background: #ff4747; color: #fff; transform: scale(1.1); box-shadow: 0 5px 15px rgba(255,70,70,0.4); }
            .br-nav { display: flex; padding: 15px 24px 0 24px; gap: 15px; background: #1a1a1e; }
            .br-nav-item { padding: 10px 0; color: #666; font-weight: 700; cursor: pointer; font-size: 12px; transition: var(--br-speed); border-bottom: 2px solid transparent; flex: 1; text-align: center; position: relative; }
            .br-nav-item.active { color: #fff; border-bottom-color: var(--br-primary); text-shadow: 0 -5px 15px var(--br-primary); }
            .br-content { flex: 1; padding: 24px; overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; background: #141414; overflow-x: hidden; }
            .br-tab-content { display: none; }
            .br-tab-content.active { display: block; }
            .br-tab-content.active { animation: br-unfold var(--br-speed) var(--br-enter) backwards; }
            @media (min-width: 650px) { .br-tab-content.active:not(.br-b-content) { column-count: 2; column-gap: 16px; } }
            @media (max-width: 649px) { .br-tab-content.active { column-count: 1 !important; } }
            @keyframes brGroupCasc { 0% { opacity: 0; transform: translateY(15px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
            .br-tab-content.active > div { animation: brGroupCasc 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }
            .br-tab-content.active > div:nth-child(1) { animation-delay: 0.05s; }
            .br-tab-content.active > div:nth-child(2) { animation-delay: 0.10s; }
            .br-tab-content.active > div:nth-child(3) { animation-delay: 0.15s; }
            .br-tab-content.active > div:nth-child(4) { animation-delay: 0.20s; }
            .br-tab-content.active > div:nth-child(5) { animation-delay: 0.25s; }
            .br-group { background: #0e0e10; border: 1px solid rgba(255,255,255,0.03); border-radius: 16px; padding: 16px; margin-bottom: 16px; box-shadow: inset 0 2px 5px rgba(0,0,0,0.3); transition: transform var(--br-speed); break-inside: avoid; page-break-inside: avoid; }
            .br-lbl { font-size: 11px; font-weight: 800; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; display: block; }
            .br-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
            .br-row:last-child { margin-bottom: 0; }
            .br-txt { font-size: 13px; font-weight: 600; color: #ddd; text-align: left; }

            .br-range-wrapper {
                position: relative;
                width: 100%;
                padding: 4px 0;
                display: flex;
                align-items: center;
            }
            .br-range-wrapper .br-range-fill {
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                height: 4px;
                border-radius: 4px;
                background: var(--br-primary);
                pointer-events: none;
                width: 0%;
                transition: width 0.15s;
                z-index: 0;
            }
            .br-range-wrapper .br-range-bg {
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                height: 4px;
                border-radius: 4px;
                background: rgba(255,255,255,0.1);
                pointer-events: none;
                width: 100%;
                z-index: 0;
            }
            .br-range {
                -webkit-appearance: none;
                appearance: none;
                width: 100%;
                height: 4px;
                border-radius: 4px;
                background: transparent;
                outline: none;
                transition: background 0.3s;
                cursor: pointer;
                margin: 4px 0;
                position: relative;
                z-index: 1;
            }
            .br-range::-webkit-slider-runnable-track {
                height: 4px;
                border-radius: 4px;
                background: transparent;
            }
            .br-range::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: var(--br-primary);
                cursor: pointer;
                box-shadow: 0 0 8px rgba(0,0,0,0.6), 0 0 0 2px var(--br-border);
                transition: 0.15s;
                margin-top: -7px;
                border: 2px solid #fff;
                position: relative;
                z-index: 2;
            }
            .br-range::-webkit-slider-thumb:hover {
                transform: scale(1.15);
                box-shadow: 0 0 12px var(--br-primary);
            }
            .br-range::-moz-range-track {
                height: 4px;
                border-radius: 4px;
                background: transparent;
                border: none;
            }
            .br-range::-moz-range-thumb {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: var(--br-primary);
                cursor: pointer;
                border: 2px solid #fff;
                box-shadow: 0 0 8px rgba(0,0,0,0.6);
            }
            .br-range::-moz-range-thumb:hover {
                transform: scale(1.15);
            }

            .br-input, .br-select { background: #08080a; border: none; box-shadow: inset 0 2px 5px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05); color: #fff; padding: 10px 14px; border-radius: 10px; font-size: 13px; width: 100%; outline: none !important; transition: var(--br-speed); -webkit-tap-highlight-color: transparent; }
            .br-select { cursor: pointer; }
            .br-select option { background: #0a0a0c; color: #fff; }
            .br-input:focus { box-shadow: inset 0 2px 5px rgba(0,0,0,0.8), 0 0 0 1px var(--br-primary); color: #fff; outline: none !important; }
            .br-select:focus { outline: none !important; box-shadow: inset 0 2px 5px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05); border-color: transparent !important; }
            html[br-s-inp="glass"] .br-select option { background: #222 !important; color: #fff !important; }
            html[br-s-inp="glass"] .br-select:focus option { background: #333 !important; }

            .br-color-circle { width: 34px; height: 34px; border-radius: 50%; border: none !important; padding: 0; cursor: pointer; -webkit-appearance: none; background: none; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: transform var(--br-speed); outline: none !important; -webkit-tap-highlight-color: transparent; }
            .br-color-circle:hover, .br-color-circle:focus { transform: scale(1.1); outline: none !important; }
            .br-color-circle::-webkit-color-swatch-wrapper { padding: 0; }
            .br-color-circle::-webkit-color-swatch { border: none; border-radius: 50%; }
            .br-toggle { position: relative; width: 44px; height: 24px; flex-shrink: 0; }
            .br-toggle input { opacity: 0; width: 0; height: 0; }
            .br-slider { position: absolute; cursor: pointer; inset: 0; background-color: #333; transition: var(--br-speed); border-radius: 34px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.1); }
            .br-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: #555; transition: var(--br-speed); border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.5); }
            input:checked + .br-slider { background-color: var(--br-primary); }
            input:checked + .br-slider:before { transform: translateX(20px); background-color: #fff; box-shadow: 0 0 10px var(--br-primary); }

            .br-btn-save, .br-btn-reset {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }
            .br-btn-save:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(var(--br-tint), 0.5);
                filter: brightness(1.1);
            }
            .br-btn-save:active {
                transform: scale(0.97);
            }
            .br-btn-reset:hover {
                transform: rotate(45deg) scale(1.1);
                background: rgba(255,50,50,0.4);
                color: #fff;
            }
            .br-btn-reset:active {
                transform: rotate(45deg) scale(0.9);
            }

            .br-footer { padding: 20px 24px; border-top: 1px solid rgba(255,255,255,0.1); background: #1a1a1e; padding-bottom: calc(20px + env(safe-area-inset-bottom)); display: flex; gap: 12px; align-items: center; }
            .br-btn-save { flex: 1; padding: 14px; background: var(--br-primary); border: none; border-radius: 14px; color: #fff; font-weight: 800; font-size: 13px; cursor: pointer; text-transform: uppercase; box-shadow: 0 10px 20px -5px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; height: 45px; gap: 8px; }
            .br-btn-reset { width: 40px; height: 40px; flex-shrink: 0; background: rgba(255,50,50,0.15); color: #ff5555; font-size: 18px; padding: 0; border-radius: 12px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }

            ::selection { background: var(--br-primary) !important; color: #fff !important; text-shadow: 0 1px 2px rgba(0,0,0,0.5) !important; }
            ::-moz-selection { background: var(--br-primary) !important; color: #fff !important; text-shadow: 0 1px 2px rgba(0,0,0,0.5) !important; }
            .tabs-tab i, .menu-linkRow i, .menu-row i, .contentRow i { font-size: 16px !important; width: auto !important; height: auto !important; line-height: 1 !important; vertical-align: middle !important; margin-right: 4px !important; }
            .tabs-tab .fa--xf { font-size: 16px !important; }
            .tabs-tab .badgeContainer { font-size: 16px !important; }
            .tabPanes .menu-row .contentRow-figure .avatar { width: 48px !important; height: 48px !important; }
            html[br-acc-menu="def"] .menu-content, html[br-acc-menu="def"] .offCanvasMenu-content { background: rgba(20,20,25,0.9) !important; backdrop-filter: blur(var(--br-blur)) !important; }
            html[br-acc-menu="glass"] .menu-content, html[br-acc-menu="glass"] .offCanvasMenu-content { background: rgba(255,255,255,0.05) !important; backdrop-filter: blur(20px) !important; border: 1px solid rgba(255,255,255,0.1) !important; box-shadow: 0 20px 40px rgba(0,0,0,0.5) !important; }
            html[br-acc-menu="glass"] .menu-content .menu-linkRow, html[br-acc-menu="glass"] .offCanvasMenu-content .menu-linkRow { color: #fff !important; }
            html[br-acc-menu="neon"] .menu-content, html[br-acc-menu="neon"] .offCanvasMenu-content { background: #0a0a0c !important; border: 1px solid var(--br-primary) !important; box-shadow: 0 0 20px var(--br-primary), inset 0 0 10px var(--br-primary) !important; }
            html[br-acc-menu="dark"] .menu-content, html[br-acc-menu="dark"] .offCanvasMenu-content { background: #111 !important; border: 1px solid rgba(255,255,255,0.05) !important; }
            `;
            const style = document.createElement('style');
            style.innerHTML = css;
            (document.head || document.documentElement).appendChild(style);
        }
    }

    // ========================================================================
    // ИНТЕРФЕЙС
    // ========================================================================
    class Interface {
        constructor(state, theme) {
            this.state = state;
            this.theme = theme;
            this.ready = false;
            this.dockElement = null;
            this.gearElement = null;
            this.panel = null;
            this.observer = null;
        }

        init() {
            if (this.ready) return;
            this.createElements();
            this.createPanel();
            document.addEventListener('visibilitychange', () => {
                (document.body || document.documentElement).setAttribute('data-hidden', document.hidden);
            });
            this.ready = true;
        }

        haptic() {
            if (this.state.get().vibration && navigator.vibrate) navigator.vibrate(3);
        }

        createElements() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            if (this.gearElement) {
                this.gearElement.remove();
                this.gearElement = null;
            }
            if (this.dockElement) {
                this.dockElement.remove();
                this.dockElement = null;
            }

            const d = this.state.get();

            // 1. Создаём кнопку
            const gear = document.createElement('button');
            gear.className = 'br-dock-gear';
            gear.textContent = '⚡';
            gear.style.borderBottom = '2px solid rgb(170, 170, 170)';
            gear.style.fontSize = '14px';
            gear.style.cursor = 'pointer';
            gear.style.background = 'transparent';
            gear.style.border = 'none';
            gear.style.padding = '0 8px';
            gear.style.display = 'inline-flex';
            gear.style.alignItems = 'center';
            gear.style.justifyContent = 'center';
            gear.type = 'button';
            gear.addEventListener('click', (e) => {
                e.preventDefault();
                this.haptic();
                this.toggle();
            });
            this.gearElement = gear;

            // 2. Если док включён — создаём док и помещаем кнопку в него
            if (d.dockEnabled) {
                const dock = document.createElement('div');
                dock.className = 'br-dock';
                dock.appendChild(gear);
                this.dockElement = dock;

                if (d.dockPosition === 'top') {
                    // Вставляем док в верхнюю панель
                    this.insertIntoTopBar(dock);
                    // Запускаем observer для отслеживания bgButton
                    this.startObserver(dock);
                } else {
                    // Вставляем док фиксированно
                    (document.body || document.documentElement).appendChild(dock);
                }
            } else {
                // Док выключен — вставляем только кнопку в верхнюю панель
                this.insertIntoTopBar(gear);
                this.startObserver(gear);
            }
        }

        insertIntoTopBar(element) {
            const bgButton = document.querySelector('.bgButton');
            if (bgButton && bgButton.parentNode) {
                bgButton.parentNode.insertBefore(element, bgButton.nextSibling);
                element.style.marginLeft = '4px';
                element.style.marginRight = '';
                element.style.position = '';
                element.style.top = '';
                element.style.right = '';
                element.style.zIndex = '';
                element.style.background = '';
                element.style.borderRadius = '';
                element.style.padding = '';
                return;
            }

            let pageContent = document.querySelector('.p-staffBar .pageContent');
            if (!pageContent) {
                const staffBar = document.querySelector('.p-staffBar');
                if (staffBar) {
                    pageContent = document.createElement('div');
                    pageContent.className = 'pageContent';
                    pageContent.style.display = 'flex';
                    pageContent.style.alignItems = 'center';
                    pageContent.style.flexWrap = 'wrap';
                    pageContent.style.justifyContent = 'flex-start';
                    while (staffBar.firstChild) {
                        pageContent.appendChild(staffBar.firstChild);
                    }
                    staffBar.appendChild(pageContent);
                }
            }
            if (pageContent) {
                pageContent.appendChild(element);
                element.style.marginLeft = '';
                element.style.marginRight = '';
                element.style.position = '';
                element.style.top = '';
                element.style.right = '';
                element.style.zIndex = '';
                element.style.background = '';
                element.style.borderRadius = '';
                element.style.padding = '';
                return;
            }

            // Fallback
            document.body.appendChild(element);
            element.style.position = 'fixed';
            element.style.top = '10px';
            element.style.right = '10px';
            element.style.zIndex = '99999';
            element.style.background = 'rgba(0,0,0,0.5)';
            element.style.borderRadius = '8px';
            element.style.padding = '8px 12px';
        }

        startObserver(element) {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            const target = document.querySelector('.p-staffBar') || document.body;
            if (!target) return;
            this.observer = new MutationObserver(() => {
                const bgButton = document.querySelector('.bgButton');
                if (bgButton && bgButton.parentNode) {
                    let isAfter = false;
                    let next = bgButton.nextSibling;
                    while (next) {
                        if (next === element) {
                            isAfter = true;
                            break;
                        }
                        next = next.nextSibling;
                    }
                    if (!isAfter) {
                        bgButton.parentNode.insertBefore(element, bgButton.nextSibling);
                        element.style.marginLeft = '4px';
                        element.style.marginRight = '';
                    }
                }
            });
            this.observer.observe(target, { childList: true, subtree: true });
        }

        createPanel() {
            if (this.panel) return;
            const panel = document.createElement('div');
            panel.className = 'br-ui';
            panel.innerHTML = `
            <div class="br-box">
                <div class="br-header">
                    <span class="br-title">⚙ Настройки</span>
                    <button class="br-btn-close" id="br-close-panel">✕</button>
                </div>
                <div class="br-nav">
                    <span class="br-nav-item active" data-tab="tab1">Дизайн</span>
                    <span class="br-nav-item" data-tab="tab2">Система</span>
                </div>
                <div class="br-content">
                    <div class="br-tab-content active" id="tab1">${this.buildDesignTab()}</div>
                    <div class="br-tab-content" id="tab2">${this.buildSystemTab()}</div>
                </div>
                <div class="br-footer">
                    <button class="br-btn-save" id="br-save-settings">💾 Сохранить</button>
                    <button class="br-btn-reset" id="br-reset-settings" title="Сбросить всё">⟳</button>
                </div>
            </div>
            `;
            (document.body || document.documentElement).appendChild(panel);
            this.panel = panel;
            this.bindEvents();
        }

        buildDesignTab() {
            const d = this.state.get();
            const fonts = [
                'Roboto', 'Montserrat', 'Open Sans', 'Poppins', 'Ubuntu',
                'Orbitron', 'Russo One', 'Exo 2', 'Comfortaa', 'Manrope',
                'Inter', 'Jura', 'Kelly Slab', 'Fira Sans', 'Nunito',
                'Raleway', 'Oswald', 'Lato', 'Merriweather', 'Playfair Display',
                'MuseoModerno', 'Bebas Neue', 'Anton', 'Pacifico', 'Caveat',
                'Lobster', 'Dancing Script', 'Shadows Into Light', 'Amatic SC',
                'Fredoka One', 'Archivo Black', 'Kanit', 'Quicksand', 'Work Sans',
                'Titillium Web', 'Asap', 'Maven Pro', 'Josefin Sans', 'Cormorant Garamond',
                'Alegreya', 'Cinzel', 'Crimson Text', 'EB Garamond', 'Playfair Display SC',
                'Uncial Antiqua', 'Rye', 'Limelight', 'Monoton', 'Fascinate'
            ];
            const fontOptions = fonts.map(f => `<option value="${f}" ${d.font === f ? 'selected' : ''}>${f}</option>`).join('');

            return `
            <div class="br-group">
                <span class="br-lbl">Обои и цвета</span>
                <div class="br-row"><span class="br-txt">Ссылка на обои</span><input class="br-input" id="br-bg" value="${d.bg}" placeholder="https://..."></div>
                <div class="br-row"><span class="br-txt">Цвет 1 (основной)</span><input type="color" class="br-color-circle" id="br-primary" value="${d.primary}"></div>
                <div class="br-row"><span class="br-txt">Цвет 2 (акцент)</span><input type="color" class="br-color-circle" id="br-accent" value="${d.accent}"></div>
                <div class="br-row"><span class="br-txt">Цвет границ</span><input type="color" class="br-color-circle" id="br-border" value="${d.border}"></div>
                <div class="br-row"><span class="br-txt">Толщина границ</span>
                    <div class="br-range-wrapper"><div class="br-range-bg"></div><div class="br-range-fill" style="width:${(d.bWidth/5)*100}%;"></div><input type="range" class="br-range" id="br-bWidth" min="0" max="5" value="${d.bWidth}" data-fill></div>
                </div>
                <div class="br-row"><span class="br-txt">Скругление</span>
                    <div class="br-range-wrapper"><div class="br-range-bg"></div><div class="br-range-fill" style="width:${(d.radius/30)*100}%;"></div><input type="range" class="br-range" id="br-radius" min="0" max="30" value="${d.radius}" data-fill></div>
                </div>
                <div class="br-row"><span class="br-txt">Размытие фона</span>
                    <div class="br-range-wrapper"><div class="br-range-bg"></div><div class="br-range-fill" style="width:${(d.blur/30)*100}%;"></div><input type="range" class="br-range" id="br-blur" min="0" max="30" value="${d.blur}" data-fill></div>
                </div>
                <div class="br-row"><span class="br-txt">Включить размытие</span><label class="br-toggle"><input type="checkbox" id="br-blurEnabled" ${d.blurEnabled ? 'checked' : ''}><span class="br-slider"></span></label></div>
                <div class="br-row"><span class="br-txt">Прозрачность (фон)</span>
                    <div class="br-range-wrapper"><div class="br-range-bg"></div><div class="br-range-fill" style="width:${d.l1*100}%;"></div><input type="range" class="br-range" id="br-l1" min="0" max="1" step="0.05" value="${d.l1}" data-fill></div>
                </div>
                <div class="br-row"><span class="br-txt">Прозрачность (блоки)</span>
                    <div class="br-range-wrapper"><div class="br-range-bg"></div><div class="br-range-fill" style="width:${d.l2*100}%;"></div><input type="range" class="br-range" id="br-l2" min="0" max="1" step="0.05" value="${d.l2}" data-fill></div>
                </div>
                <div class="br-row"><span class="br-txt">Прозрачность (меню)</span>
                    <div class="br-range-wrapper"><div class="br-range-bg"></div><div class="br-range-fill" style="width:${d.l3*100}%;"></div><input type="range" class="br-range" id="br-l3" min="0" max="1" step="0.05" value="${d.l3}" data-fill></div>
                </div>
                <div class="br-row"><span class="br-txt">RGB-режим</span><label class="br-toggle"><input type="checkbox" id="br-rgbMode" ${d.rgbMode ? 'checked' : ''}><span class="br-slider"></span></label></div>
            </div>
            <div class="br-group">
                <span class="br-lbl">Стили</span>
                <div class="br-row"><span class="br-txt">Границы</span>
                    <select class="br-select" id="br-styleBorder">
                        <option value="def" ${d.styleBorder === 'def' ? 'selected' : ''}>Стандарт</option>
                        <option value="neon" ${d.styleBorder === 'neon' ? 'selected' : ''}>Неон</option>
                        <option value="glass" ${d.styleBorder === 'glass' ? 'selected' : ''}>Стекло</option>
                        <option value="cyber" ${d.styleBorder === 'cyber' ? 'selected' : ''}>Кибер</option>
                        <option value="none" ${d.styleBorder === 'none' ? 'selected' : ''}>Без границ</option>
                    </select>
                </div>
                <div class="br-row"><span class="br-txt">Шапка</span>
                    <select class="br-select" id="br-styleHeader">
                        <option value="def" ${d.styleHeader === 'def' ? 'selected' : ''}>Стандарт</option>
                        <option value="min" ${d.styleHeader === 'min' ? 'selected' : ''}>Минимализм</option>
                        <option value="flow" ${d.styleHeader === 'flow' ? 'selected' : ''}>Поток</option>
                        <option value="hover" ${d.styleHeader === 'hover' ? 'selected' : ''}>Парящая</option>
                        <option value="shimmer" ${d.styleHeader === 'shimmer' ? 'selected' : ''}>Блик</option>
                        <option value="glow" ${d.styleHeader === 'glow' ? 'selected' : ''}>Свечение</option>
                        <option value="minimal" ${d.styleHeader === 'minimal' ? 'selected' : ''}>Минимал</option>
                    </select>
                </div>
                <div class="br-row"><span class="br-txt">Док</span>
                    <select class="br-select" id="br-styleDock">
                        <option value="def" ${d.styleDock === 'def' ? 'selected' : ''}>Стандарт</option>
                        <option value="neon" ${d.styleDock === 'neon' ? 'selected' : ''}>Неон</option>
                        <option value="str" ${d.styleDock === 'str' ? 'selected' : ''}>Строгий</option>
                        <option value="inv" ${d.styleDock === 'inv' ? 'selected' : ''}>Инверсный</option>
                        <option value="glass" ${d.styleDock === 'glass' ? 'selected' : ''}>Стекло</option>
                        <option value="dark" ${d.styleDock === 'dark' ? 'selected' : ''}>Тёмный</option>
                    </select>
                </div>
                <div class="br-row"><span class="br-txt">Кнопки</span>
                    <select class="br-select" id="br-styleBtn">
                        <option value="metal" ${d.styleBtn === 'metal' ? 'selected' : ''}>Металл</option>
                        <option value="flat" ${d.styleBtn === 'flat' ? 'selected' : ''}>Плоские</option>
                        <option value="glass" ${d.styleBtn === 'glass' ? 'selected' : ''}>Стекло</option>
                        <option value="solid" ${d.styleBtn === 'solid' ? 'selected' : ''}>Твёрдые</option>
                        <option value="neon" ${d.styleBtn === 'neon' ? 'selected' : ''}>Неон</option>
                        <option value="gradient" ${d.styleBtn === 'gradient' ? 'selected' : ''}>Градиент</option>
                        <option value="heavy" ${d.styleBtn === 'heavy' ? 'selected' : ''}>Тяжёлые</option>
                        <option value="glow" ${d.styleBtn === 'glow' ? 'selected' : ''}>Свечение</option>
                        <option value="3d" ${d.styleBtn === '3d' ? 'selected' : ''}>3D</option>
                    </select>
                </div>
                <div class="br-row"><span class="br-txt">Поля ввода</span>
                    <select class="br-select" id="br-styleInp">
                        <option value="def" ${d.styleInp === 'def' ? 'selected' : ''}>Стандарт</option>
                        <option value="line" ${d.styleInp === 'line' ? 'selected' : ''}>Линия</option>
                        <option value="round" ${d.styleInp === 'round' ? 'selected' : ''}>Круглые</option>
                        <option value="glass" ${d.styleInp === 'glass' ? 'selected' : ''}>Стекло</option>
                        <option value="neon" ${d.styleInp === 'neon' ? 'selected' : ''}>Неон</option>
                    </select>
                </div>
                <div class="br-row"><span class="br-txt">Метки</span>
                    <select class="br-select" id="br-stylePrf">
                        <option value="def" ${d.stylePrf === 'def' ? 'selected' : ''}>Стандарт</option>
                        <option value="pill" ${d.stylePrf === 'pill' ? 'selected' : ''}>Пилюли</option>
                        <option value="sharp" ${d.stylePrf === 'sharp' ? 'selected' : ''}>Острые</option>
                        <option value="left" ${d.stylePrf === 'left' ? 'selected' : ''}>Слева</option>
                        <option value="glow" ${d.stylePrf === 'glow' ? 'selected' : ''}>Свечение</option>
                        <option value="neon" ${d.stylePrf === 'neon' ? 'selected' : ''}>Неон</option>
                        <option value="minimal" ${d.stylePrf === 'minimal' ? 'selected' : ''}>Минимал</option>
                    </select>
                </div>
                <div class="br-row"><span class="br-txt">Аватарки</span>
                    <select class="br-select" id="br-styleAva">
                        <option value="def" ${d.styleAva === 'def' ? 'selected' : ''}>Круг</option>
                        <option value="sq" ${d.styleAva === 'sq' ? 'selected' : ''}>Квадрат</option>
                        <option value="hex" ${d.styleAva === 'hex' ? 'selected' : ''}>Шестигранник</option>
                        <option value="glow" ${d.styleAva === 'glow' ? 'selected' : ''}>Свечение</option>
                    </select>
                </div>
                <div class="br-row"><span class="br-txt">Скролл</span>
                    <select class="br-select" id="br-styleScroll">
                        <option value="def" ${d.styleScroll === 'def' ? 'selected' : ''}>Стандарт</option>
                        <option value="mac" ${d.styleScroll === 'mac' ? 'selected' : ''}>Mac</option>
                        <option value="hide" ${d.styleScroll === 'hide' ? 'selected' : ''}>Скрыть</option>
                        <option value="thin" ${d.styleScroll === 'thin' ? 'selected' : ''}>Тонкий</option>
                    </select>
                </div>
                <div class="br-row"><span class="br-txt">Анимация</span>
                    <select class="br-select" id="br-animStyle">
                        <option value="def" ${d.animStyle === 'def' ? 'selected' : ''}>Стандарт</option>
                        <option value="spring" ${d.animStyle === 'spring' ? 'selected' : ''}>Пружина</option>
                        <option value="cascade" ${d.animStyle === 'cascade' ? 'selected' : ''}>Каскад</option>
                        <option value="parallax" ${d.animStyle === 'parallax' ? 'selected' : ''}>Параллакс</option>
                        <option value="glitch" ${d.animStyle === 'glitch' ? 'selected' : ''}>Глитч</option>
                        <option value="bounce" ${d.animStyle === 'bounce' ? 'selected' : ''}>Подскок</option>
                        <option value="fade" ${d.animStyle === 'fade' ? 'selected' : ''}>Затухание</option>
                        <option value="slide" ${d.animStyle === 'slide' ? 'selected' : ''}>Слайд</option>
                        <option value="rotate" ${d.animStyle === 'rotate' ? 'selected' : ''}>Вращение</option>
                    </select>
                </div>
                <div class="br-row"><span class="br-txt">Стиль меню аккаунта</span>
                    <select class="br-select" id="br-accountMenuStyle">
                        <option value="def" ${d.accountMenuStyle === 'def' ? 'selected' : ''}>Стандарт</option>
                        <option value="glass" ${d.accountMenuStyle === 'glass' ? 'selected' : ''}>Стекло</option>
                        <option value="neon" ${d.accountMenuStyle === 'neon' ? 'selected' : ''}>Неон</option>
                        <option value="dark" ${d.accountMenuStyle === 'dark' ? 'selected' : ''}>Тёмный</option>
                    </select>
                </div>
            </div>
            <div class="br-group">
                <span class="br-lbl">Текст</span>
                <div class="br-row"><span class="br-txt">Цвет текста</span><input type="color" class="br-color-circle" id="br-fontColor" value="${d.fontColor}"></div>
                <div class="br-row"><span class="br-txt">Кастомный цвет</span><label class="br-toggle"><input type="checkbox" id="br-customText" ${d.customText ? 'checked' : ''}><span class="br-slider"></span></label></div>
                <div class="br-row"><span class="br-txt">Цвет втор. текста</span><input type="color" class="br-color-circle" id="br-secFontColor" value="${d.secFontColor}"></div>
                <div class="br-row"><span class="br-txt">Кастомный втор.</span><label class="br-toggle"><input type="checkbox" id="br-customSecText" ${d.customSecText ? 'checked' : ''}><span class="br-slider"></span></label></div>
                <div class="br-row"><span class="br-txt">Шрифт</span>
                    <select class="br-select" id="br-font">${fontOptions}</select>
                </div>
                <div class="br-row"><span class="br-txt">Виброотклик</span><label class="br-toggle"><input type="checkbox" id="br-vibration" ${d.vibration ? 'checked' : ''}><span class="br-slider"></span></label></div>
            </div>
            <div class="br-group">
                <span class="br-lbl">Док и фон</span>
                <div class="br-row"><span class="br-txt">Расположение дока</span>
                    <select class="br-select" id="br-dockPosition">
                        <option value="bottom" ${d.dockPosition === 'bottom' ? 'selected' : ''}>Снизу</option>
                        <option value="left" ${d.dockPosition === 'left' ? 'selected' : ''}>Слева</option>
                        <option value="right" ${d.dockPosition === 'right' ? 'selected' : ''}>Справа</option>
                        <option value="top" ${d.dockPosition === 'top' ? 'selected' : ''}>Сверху (в панель Модер.)</option>
                    </select>
                </div>
                <div class="br-row"><span class="br-txt">Отступ от края (px)</span><input type="number" class="br-input" id="br-dockPos" value="${d.dockPos}" style="width:80px;"></div>
                <div class="br-row"><span class="br-txt">Форма дока</span>
                    <select class="br-select" id="br-dockShape">
                        <option value="round" ${d.dockShape === 'round' ? 'selected' : ''}>Круглый</option>
                        <option value="square" ${d.dockShape === 'square' ? 'selected' : ''}>Квадратный</option>
                    </select>
                </div>
                <div class="br-row"><span class="br-txt">Показывать фоновое изображение</span><label class="br-toggle"><input type="checkbox" id="br-showBackground" ${d.showBackground ? 'checked' : ''}><span class="br-slider"></span></label></div>
            </div>
            `;
        }

        buildSystemTab() {
            const d = this.state.get();
            return `
            <div class="br-group">
                <span class="br-lbl">Масштаб</span>
                <div class="br-row"><span class="br-txt">Масштаб UI (%)</span>
                    <div class="br-range-wrapper"><div class="br-range-bg"></div><div class="br-range-fill" style="width:${((d.uiScale-50)/100)*100}%;"></div><input type="range" class="br-range" id="br-uiScale" min="50" max="150" value="${d.uiScale}" data-fill></div>
                </div>
                <div class="br-row"><span class="br-txt">Включить масштаб</span><label class="br-toggle"><input type="checkbox" id="br-uiScaleEnabled" ${d.uiScaleEnabled ? 'checked' : ''}><span class="br-slider"></span></label></div>
            </div>
            <div class="br-group">
                <span class="br-lbl">Сброс</span>
                <div class="br-row"><button class="br-btn-reset" id="br-reset-system" style="width:auto;padding:10px 20px;background:rgba(255,50,50,0.2);color:#ff5555;border-radius:12px;border:1px solid rgba(255,50,50,0.3);">Сбросить все настройки</button></div>
            </div>
            <div class="br-group">
                <span class="br-lbl">Статистика</span>
                <div class="br-row"><span class="br-txt">Сохранений</span><span>${d.stats.saves}</span></div>
                <div class="br-row"><span class="br-txt">Установлен</span><span>${new Date(d.stats.installDate).toLocaleDateString()}</span></div>
            </div>
            `;
        }

        bindEvents() {
            const self = this;

            document.querySelectorAll('.br-nav-item').forEach(item => {
                item.addEventListener('click', function() {
                    document.querySelectorAll('.br-nav-item').forEach(el => el.classList.remove('active'));
                    this.classList.add('active');
                    const tabId = this.dataset.tab;
                    document.querySelectorAll('.br-tab-content').forEach(el => el.classList.remove('active'));
                    document.getElementById(tabId).classList.add('active');
                });
            });

            document.getElementById('br-close-panel').addEventListener('click', () => self.toggle());
            document.getElementById('br-save-settings').addEventListener('click', () => self.finalSave());

            document.getElementById('br-reset-settings').addEventListener('click', () => {
                if (confirm('Сбросить все настройки?')) {
                    const defs = JSON.parse(JSON.stringify(DEFAULTS));
                    self.state.setAll(defs);
                    self.theme.update(defs);
                    self.createElements();
                    Utils.notify('Настройки сброшены', 'save');
                    self.panel.classList.remove('active');
                    location.reload();
                }
            });

            const designInputs = [
                'br-bg', 'br-primary', 'br-accent', 'br-border', 'br-bWidth', 'br-radius', 'br-blur',
                'br-blurEnabled', 'br-l1', 'br-l2', 'br-l3', 'br-font', 'br-rgbMode', 'br-fontColor',
                'br-customText', 'br-secFontColor', 'br-customSecText', 'br-styleBorder', 'br-styleHeader',
                'br-styleDock', 'br-styleBtn', 'br-styleInp', 'br-stylePrf', 'br-styleAva', 'br-styleScroll',
                'br-animStyle', 'br-accountMenuStyle', 'br-vibration', 'br-uiScale', 'br-uiScaleEnabled',
                'br-dockPosition', 'br-dockPos', 'br-dockShape', 'br-showBackground'
            ];
            designInputs.forEach(id => {
                const el = document.getElementById(id);
                if (!el) return;
                el.addEventListener('change', function() {
                    const key = id.replace('br-', '');
                    let val = this.type === 'checkbox' ? this.checked : this.value;
                    if (this.type === 'range') val = parseFloat(val);
                    self.state.save(key, val);
                    self.theme.update(self.state.get());
                    if (key === 'dockPosition' || key === 'dockShape' || key === 'dockEnabled') {
                        self.createElements();
                    }
                    const fill = this.closest('.br-range-wrapper')?.querySelector('.br-range-fill');
                    if (fill) {
                        const max = parseFloat(this.max) || 1;
                        const min = parseFloat(this.min) || 0;
                        const pct = ((val - min) / (max - min)) * 100;
                        fill.style.width = Math.min(100, Math.max(0, pct)) + '%';
                    }
                });
            });

            document.querySelectorAll('.br-range').forEach(el => {
                const fill = el.closest('.br-range-wrapper')?.querySelector('.br-range-fill');
                if (fill) {
                    const updateFill = () => {
                        const val = parseFloat(el.value);
                        const max = parseFloat(el.max) || 1;
                        const min = parseFloat(el.min) || 0;
                        const pct = ((val - min) / (max - min)) * 100;
                        fill.style.width = Math.min(100, Math.max(0, pct)) + '%';
                    };
                    el.addEventListener('input', updateFill);
                    updateFill();
                }
                el.addEventListener('input', function() {
                    const key = this.id.replace('br-', '');
                    let val = parseFloat(this.value);
                    self.state.save(key, val);
                    self.theme.update(self.state.get());
                });
            });

            document.getElementById('br-reset-system')?.addEventListener('click', () => {
                if (confirm('Сбросить все настройки?')) {
                    const defs = JSON.parse(JSON.stringify(DEFAULTS));
                    self.state.setAll(defs);
                    self.theme.update(defs);
                    self.createElements();
                    Utils.notify('Настройки сброшены', 'save');
                    self.panel.classList.remove('active');
                    location.reload();
                }
            });
        }

        toggle() {
            const panel = this.panel;
            if (!panel) return;
            panel.classList.toggle('active');
            if (panel.classList.contains('active')) {
                const d = this.state.get();
                Object.keys(d).forEach(key => {
                    const el = document.getElementById(`br-${key}`);
                    if (!el) return;
                    if (el.type === 'checkbox') el.checked = d[key];
                    else if (el.type === 'range') el.value = d[key];
                    else if (el.tagName === 'SELECT') el.value = d[key];
                    else el.value = d[key];
                });
                document.querySelectorAll('.br-range').forEach(el => {
                    const fill = el.closest('.br-range-wrapper')?.querySelector('.br-range-fill');
                    if (fill) {
                        const val = parseFloat(el.value);
                        const max = parseFloat(el.max) || 1;
                        const min = parseFloat(el.min) || 0;
                        const pct = ((val - min) / (max - min)) * 100;
                        fill.style.width = Math.min(100, Math.max(0, pct)) + '%';
                    }
                });
            }
        }

        finalSave() {
            const d = this.state.get();
            const designInputs = [
                'br-bg', 'br-primary', 'br-accent', 'br-border', 'br-bWidth', 'br-radius', 'br-blur',
                'br-blurEnabled', 'br-l1', 'br-l2', 'br-l3', 'br-font', 'br-rgbMode', 'br-fontColor',
                'br-customText', 'br-secFontColor', 'br-customSecText', 'br-styleBorder', 'br-styleHeader',
                'br-styleDock', 'br-styleBtn', 'br-styleInp', 'br-stylePrf', 'br-styleAva', 'br-styleScroll',
                'br-animStyle', 'br-accountMenuStyle', 'br-vibration', 'br-uiScale', 'br-uiScaleEnabled',
                'br-dockPosition', 'br-dockPos', 'br-dockShape', 'br-showBackground'
            ];
            designInputs.forEach(id => {
                const el = document.getElementById(id);
                if (!el) return;
                const key = id.replace('br-', '');
                let val = el.type === 'checkbox' ? el.checked : el.value;
                if (el.type === 'range') val = parseFloat(val);
                this.state.save(key, val);
            });
            const stats = this.state.get().stats;
            stats.saves += 1;
            this.state.save('stats', stats);

            this.createElements();
            Utils.notify('Настройки сохранены!', 'save');
            this.theme.update(this.state.get());
            this.panel.classList.remove('active');
            location.reload();
        }
    }

    // ========================================================================
    // ЯДРО
    // ========================================================================
    class Core {
        constructor() {
            try {
                this.state = new State();
            } catch (e) {
                this.state = { get: () => DEFAULTS, save: () => {}, setAll: () => {} };
            }

            const startScript = () => {
                try {
                    this.theme = new Theme();
                    this.theme.update(this.state.get());
                    this.ui = new Interface(this.state, this.theme);
                    this.ui.init();
                } catch (e) {
                    console.error('[BR Style] Error:', e);
                }
            };

            const launch = () => {
                if (this.launched) return;
                this.launched = true;
                startScript();
            };

            if (document.readyState === 'interactive' || document.readyState === 'complete') launch();
            else {
                document.addEventListener('DOMContentLoaded', launch);
                window.addEventListener('load', launch);
            }
        }
    }
    new Core();
})();
