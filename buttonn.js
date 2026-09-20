// ==UserScript==
// @name         BR Panel — GROZNY (35)
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Кнопки переходники GROZNY — встроены в шапку форума
// @author       Black Russia & usman
// @match        https://forum.blackrussia.online/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    if (document.body.getAttribute('data-br-panel-v8')) return;
    document.body.setAttribute('data-br-panel-v8', 'true');

    const BUTTONS = [
        { text: 'РПБ', link: 'https://forum.blackrussia.online/forums/РП-биографии.1594/',    color: '#0000CD' },
        { text: 'РПС', link: 'https://forum.blackrussia.online/forums/РП-ситуации.1593/',     color: '#8B008B' },
        { text: 'ЖБИ', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1614/', color: '#DC143C' },
        { text: 'ОПС', link: 'https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/', color: '#f59e0b', glow: true },
    ];

    function buildPanel() {
        const panel = document.createElement('div');
        panel.className = 'bgButtonsContainer';
        BUTTONS.forEach(cfg => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'bgButton' + (cfg.glow ? ' glow' : '');
            btn.textContent = cfg.text;
            if (!cfg.glow) btn.style.borderBottom = `2px solid ${cfg.color}`;
            btn.addEventListener('click', () => { window.location.href = cfg.link; });
            panel.appendChild(btn);
        });
        return panel;
    }

    // Ищем элемент "Модер." по тексту
    function findМодер() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            const t = (node.textContent || '').trim();
            if (/^Модер\.?$/i.test(t) && node.parentElement) return node.parentElement;
        }
        return null;
    }

    function insertPanel() {
        if (document.querySelector('.bgButtonsContainer')) return;
        const panel = buildPanel();

        // 1) Рядом с "Модер."
        const moder = findМодер();
        if (moder && moder.parentElement) {
            moder.parentElement.insertBefore(panel, moder);
            return;
        }

        // 2) В шапку
        const headerSels = ['.p-header-content', '.p-header-inner', '.p-header', '.p-nav-inner'];
        for (const s of headerSels) {
            const el = document.querySelector(s);
            if (el) { el.appendChild(panel); return; }
        }

        // 3) В начало контента
        const page = document.querySelector('.pageContent, .p-body-pageContent, .p-body-main');
        if (page) { page.insertBefore(panel, page.firstChild); return; }

        // 4) Фолбэк — фикс-бар
        panel.classList.add('bg-fixed');
        document.body.appendChild(panel);
        document.body.classList.add('br-panel-push');
    }

    const style = document.createElement('style');
    style.textContent = `
        /* ═══ ПАНЕЛЬ В ШАПКЕ ═══ */
        .bgButtonsContainer {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin: 0 10px 0 0;
            padding: 0;
            vertical-align: middle;
            flex-wrap: wrap;
            font-family: system-ui, -apple-system, Arial, sans-serif;
        }

        /* ═══ КОМПАКТНАЯ КНОПКА ═══ */
        .bgButton {
            background: #1a1a1a;
            color: #fff;
            border: 1px solid #333;
            border-radius: 4px;
            padding: 0 10px;
            margin: 0;
            font-family: inherit;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.2px;
            cursor: pointer;
            transition: background 0.15s, border-color 0.15s, transform 0.1s;
            min-width: 42px;
            height: 28px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            white-space: nowrap;
            flex-shrink: 0;
            -webkit-tap-highlight-color: transparent;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
            box-sizing: border-box;
        }
        .bgButton:hover { background: #2a2a2a; border-color: #555; }
        .bgButton:active { transform: scale(0.96); }

        .bgButton.glow {
            background: rgba(245, 158, 11, 0.15);
            color: #fbbf24;
            border-color: rgba(245, 158, 11, 0.4);
        }
        .bgButton.glow:hover { background: rgba(245, 158, 11, 0.28); }

        /* ═══ ФОЛБЭК ═══ */
        .bgButtonsContainer.bg-fixed {
            position: fixed;
            top: 0; left: 0; right: 0;
            display: flex;
            justify-content: flex-start;
            gap: 4px;
            padding: 4px 8px;
            padding-top: calc(4px + env(safe-area-inset-top, 0px));
            background: rgba(15, 15, 15, 0.94);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            margin: 0;
            z-index: 9997;
        }
        body.br-panel-push { padding-top: 36px !important; }

        /* ═══ МОБИЛКА ═══ */
        @media (max-width: 900px) {
            .bgButtonsContainer {
                gap: 6px;
                margin: 0 6px 0 0;
                max-width: 100%;
                overflow-x: auto;
                flex-wrap: nowrap;
                scrollbar-width: none;
            }
            .bgButtonsContainer::-webkit-scrollbar { display: none; }
            .bgButton {
                min-width: 46px;
                height: 30px;
                padding: 0 10px;
                font-size: 11px;
                font-weight: 700;
            }
        }
    `;
    document.head.appendChild(style);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertPanel);
    } else {
        insertPanel();
    }

    const observer = new MutationObserver(() => {
        if (!document.querySelector('.bgButtonsContainer')) insertPanel();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
