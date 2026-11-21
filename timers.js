// ==UserScript==
// @name         TIMERS
// @description  Показывает таймер оставшегося времени / просрочки для закреплённых тем в разделе Жалобы на игроков
// @version      1.3
// @namespace    https://forum.blackrussia.online
// @match        https://forum.blackrussia.online/forums/*
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    // Защита от повторного запуска
    if (window.__GKF_TIMERS__) return;
    window.__GKF_TIMERS__ = true;

    // === НАСТРОЙКИ ===
    const MAX_ALLOWED_HOURS = 48;                 // лимит на рассмотрение (в часах)
    const SECTION_IDS = ['1614'];                 // ID раздела «Жалобы на игроков»
    const SECTION_TITLE_RE = /жалоб[аы]\s+на\s+игроков/i;
    const UPDATE_EVERY_MS = 30 * 1000;            
    const LIMIT_MS = MAX_ALLOWED_HOURS * 60 * 60 * 1000;

    // === ПРОВЕРКА РАЗДЕЛА ===
    function isComplaintsSection() {
        if (!location.pathname.startsWith('/forums/')) return false;
        const idRe = new RegExp('\\.(' + SECTION_IDS.join('|') + ')(/|$)');
        if (idRe.test(location.pathname)) return true;
        const title = document.querySelector('.p-title-value');
        return !!title && SECTION_TITLE_RE.test(title.textContent);
    }

    // === СТИЛИ ===
    function injectStyles() {
        if (document.getElementById('gkf-timer-styles')) return;
        const s = document.createElement('style');
        s.id = 'gkf-timer-styles';
        s.textContent = `
            @keyframes gkfGlowLaser {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            .gkf-exact-timer {
                display: inline-block;
                float: right;
                font: 600 11px/1.2 sans-serif; /* Чуть менее жирный шрифт, как на скрине */
                margin-top: 1px; /* Выравнивание по строке */
                padding: 4px 10px;
                border-radius: 20px;
                pointer-events: none;
                /* Убрана тень для более плоского дизайна */
            }
            /* Стиль для зеленого таймера (Осталось) */
            .gkf-exact-timer.gkf-ok { 
                color: #5ec28c; /* Светло-зеленый текст */
                background: #1e3126; /* Темно-зеленый фон */
            }
            /* Стиль для красного таймера (Просрочено) */
            .gkf-exact-timer.gkf-over {
                color: #ff6b6b;
                background: linear-gradient(90deg, #dc3545 0%, #ff6b6b 40%, #ffffff 50%, #ff6b6b 60%, #dc3545 100%);
                background-size: 200% auto;
                animation: gkfGlowLaser 2.5s linear infinite;
            }
            .gkf-item-overdue {
                border: 2px solid #dc3545 !important;
                border-radius: 4px;
                margin: 5px 0;
            }
        `;
        document.head.appendChild(s);
    }

    // === ДАТА СОЗДАНИЯ ТЕМЫ ===
    function getCreatedTime(item) {
        const dateEl = item.querySelector('.structItem-startDate');
        if (!dateEl) return null;

        const timeEl = dateEl.querySelector('time');
        if (timeEl) {
            const ts = timeEl.getAttribute('data-time');
            if (ts) return new Date(parseInt(ts, 10) * 1000);
            const dt = timeEl.getAttribute('datetime');
            if (dt) {
                const d = new Date(dt);
                if (!isNaN(d.getTime())) return d;
            }
        }

        const m = dateEl.textContent.match(/(Сегодня|Вчера)\s+в\s+(\d{1,2}):(\d{2})/i);
        if (m) {
            const d = new Date();
            if (/вчера/i.test(m[1])) d.setDate(d.getDate() - 1);
            d.setHours(parseInt(m[2], 10), parseInt(m[3], 10), 0, 0);
            return d;
        }
        return null;
    }

    function fmt(ms) {
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        return h + ' ч ' + m + ' мин';
    }

    // === СОЗДАНИЕ ТАЙМЕРА В СТРОКЕ ТЕМЫ ===
    function addTimer(item) {
        const created = getCreatedTime(item);
        if (!created) return null;

        const minor = item.querySelector('.structItem-cell--main .structItem-minor');
        if (!minor) return null;

        const el = document.createElement('div');
        el.className = 'gkf-exact-timer';
        el.dataset.created = String(created.getTime());
        minor.appendChild(el);

        if (!minor.querySelector('.gkf-clear-block')) {
            const clear = document.createElement('div');
            clear.className = 'gkf-clear-block';
            clear.style.clear = 'both';
            minor.appendChild(clear);
        }
        return el;
    }

    // Обновляет текст и цвет таймера. Возвращает true, если тема просрочена
    function updateTimer(el, item) {
        const diff = Date.now() - Number(el.dataset.created);
        if (diff >= LIMIT_MS) {
            el.textContent = 'Просрочено: ' + fmt(diff - LIMIT_MS);
            el.classList.add('gkf-over');
            el.classList.remove('gkf-ok');
            item.classList.add('gkf-item-overdue');
            return true;
        }
        el.textContent = 'Осталось: ' + fmt(LIMIT_MS - diff);
        el.classList.add('gkf-ok');
        el.classList.remove('gkf-over');
        item.classList.remove('gkf-item-overdue');
        return false;
    }

    // === ОСНОВНАЯ ФУНКЦИЯ ===
    function refresh() {
        if (!isComplaintsSection()) return;

        const stickyGroup = document.querySelector('.structItemContainer-group--sticky');
        if (!stickyGroup) return;

        injectStyles();

        const items = stickyGroup.querySelectorAll('.structItem');
        let countConsideration = 0;
        let countTech = 0;
        let countOverdue = 0;

        items.forEach(item => {
            const label = item.querySelector('.labelLink, .label, .structItem-status--label');
            if (label) {
                const t = label.innerText.trim().toLowerCase();
                if (t.includes('рассмотрении')) countConsideration++;
                else if (t.includes('тех') || t.includes('спец') || t.includes('теху')) countTech++;
            }

            let timer = item.querySelector('.gkf-exact-timer');
            if (!timer) timer = addTimer(item);
            if (timer && updateTimer(timer, item)) countOverdue++;
        });

        const headers = document.querySelectorAll('.structItemContainer-groupBlockHeader, .block-header');
        for (const h of headers) {
            const up = h.innerText.toUpperCase();
            if (up.includes('ЗАКРЕПЛЕННЫЕ ТЕМЫ') || up.includes('ЗАКРЕПЛЁННЫЕ ТЕМЫ')) {
                h.style.display = 'none';
                break;
            }
        }

        let customHeader = document.getElementById('gkf-perfect-header');
        if (!customHeader) {
            customHeader = document.createElement('div');
            customHeader.id = 'gkf-perfect-header';
            customHeader.style.cssText =
                'padding: 6px 10px; font-size: 12px; font-weight: 700; color: #9ca3af; ' +
                'background: #1d1e22; border-bottom: 1px solid #2c2d30; text-transform: uppercase; ' +
                'font-family: sans-serif; letter-spacing: 0.3px; margin-bottom: 2px;';
            stickyGroup.parentNode.insertBefore(customHeader, stickyGroup);
        }
        customHeader.innerText =
            'ЗАКРЕПЛЕННЫЕ ТЕМЫ | ТЕХ. СПЕЦИАЛИСТУ: ' + countTech +
            ' | РАССМОТРЕНИЕ: ' + countConsideration +
            ' | ВСЕГО: ' + items.length +
            ' | ПРОСРОЧЕК: ' + countOverdue;
    }

    // === НАБЛЮДАТЕЛЬ ===
    function startObserver() {
        const target = document.querySelector('.p-body-pageContent');
        if (!target) return;

        let pending = null;
        const observer = new MutationObserver(mutations => {
            const relevant = mutations.some(m =>
                Array.from(m.addedNodes).some(n =>
                    n.nodeType === 1 &&
                    !n.classList.contains('gkf-exact-timer') &&
                    !n.classList.contains('gkf-clear-block') &&
                    n.id !== 'gkf-perfect-header'
                )
            );
            if (!relevant || pending) return;
            pending = setTimeout(() => { pending = null; refresh(); }, 400);
        });
        observer.observe(target, { childList: true, subtree: true });
    }

    // === ИНИЦИАЛИЗАЦИЯ ===
    function init() {
        refresh();
        startObserver();
        setInterval(refresh, UPDATE_EVERY_MS); 
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
