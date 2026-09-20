// ==UserScript==
// @name         TIMERS
// @description  Показывает таймер оставшегося времени / просрочки для закреплённых тем в разделе Жалобы на игроков
// @version      1.0
// @namespace    https://forum.blackrussia.online
// @match        https://forum.blackrussia.online/forums/*
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    // === НАСТРОЙКИ ===
    const MAX_ALLOWED_HOURS = 48; // Лимит времени на рассмотрение темы (в часах)

    // === ПРОВЕРКА РАЗДЕЛА ===
    // Скрипт работает только в разделе "Жалобы на игроков" (.1614)
    function isExactComplaintsSection() {
        return window.location.href.includes('.1614') ||
               window.location.href.includes('/forums/Жалобы-на-игроков');
    }

    // === АНИМАЦИЯ КРАСНОГО БЕЙДЖА (ПРОСРОЧКА) ===
    if (isExactComplaintsSection() && !document.getElementById('gkf-animation-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'gkf-animation-styles';
        styleEl.innerHTML = `
            @keyframes gkfGlowLaser {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            .gkf-laser-badge {
                background: linear-gradient(90deg, #dc3545 0%, #ff6b6b 40%, #ffffff 50%, #ff6b6b 60%, #dc3545 100%) !important;
                background-size: 200% auto !important;
                animation: gkfGlowLaser 2.5s linear infinite !important;
            }
        `;
        document.head.appendChild(styleEl);
    }

    // === ПАРСЕР ДАТЫ СОЗДАНИЯ ТЕМЫ (XenForo) ===
    function parseXenForoTime(element) {
        if (!element) return null;
        const timeEl = element.querySelector('time');
        if (timeEl) {
            const dataTime = timeEl.getAttribute('data-time');
            if (dataTime) return new Date(parseInt(dataTime) * 1000);
            const datetime = timeEl.getAttribute('datetime');
            if (datetime) return new Date(datetime);
        }
        const text = element.innerText.trim();
        const now = new Date();
        if (text.includes('Сегодня в')) {
            const parts = text.split('в').trim().split(':');
            now.setHours(parseInt(parts[0]), parseInt(parts[1]), 0, 0);
            return now;
        } else if (text.includes('Вчера в')) {
            const yesterday = new Date(now.setDate(now.getDate() - 1));
            const parts = text.split('в').trim().split(':');
            yesterday.setHours(parseInt(parts[0]), parseInt(parts[1]), 0, 0);
            return yesterday;
        }
        const parsedMs = Date.parse(text);
        if (!isNaN(parsedMs)) return new Date(parsedMs);
        return null;
    }

    // === ОСНОВНАЯ ФУНКЦИЯ ===
    function runGkfDashboard() {
        if (!window.location.href.includes('/forums/') || !isExactComplaintsSection()) return;

        const stickyGroup = document.querySelector('.structItemContainer-group--sticky');
        if (!stickyGroup) return;

        const stickyItems = stickyGroup.querySelectorAll('.structItem');

        let countConsideration = 0;
        let countTech = 0;
        let countTotal = stickyItems.length;
        let countOverdue = 0;

        stickyItems.forEach(item => {
            // Подсчёт меток
            const label = item.querySelector('.labelLink, .label, .structItem-status--label');
            if (label) {
                const labelText = label.innerText.trim().toLowerCase();
                if (labelText.includes('рассмотрении')) {
                    countConsideration++;
                } else if (labelText.includes('тех') || labelText.includes('спец') || labelText.includes('теху')) {
                    countTech++;
                }
            }

            // Вставка таймера (только один раз)
            const dateContainer = item.querySelector('.structItem-minor .structItem-startDate');

            if (dateContainer && !item.querySelector('.gkf-exact-timer')) {
                const timeCreated = parseXenForoTime(dateContainer);
                if (timeCreated) {
                    const now = new Date();
                    const diffMs = now - timeCreated;

                    const timerContainer = document.createElement('div');
                    timerContainer.className = 'gkf-exact-timer';
                    timerContainer.style =
                        'display: inline-block; float: right; font-size: 11px; font-weight: bold; ' +
                        'font-family: sans-serif; margin-top: 4px; padding: 4px 12px; ' +
                        'border-radius: 20px; color: #ffffff; pointer-events: none; ' +
                        'line-height: 1.2; box-shadow: 0 1px 3px rgba(0,0,0,0.3);';

                    const limitMs = MAX_ALLOWED_HOURS * 60 * 60 * 1000;

                    if (diffMs >= limitMs) {
                        // Тема просрочена
                        countOverdue++;
                        const overdueMs = diffMs - limitMs;
                        const overdueHours = Math.floor(overdueMs / (1000 * 60 * 60));
                        const overdueMins = Math.floor((overdueMs % (1000 * 60 * 60)) / (1000 * 60));

                        timerContainer.innerText = `Просрочено: ${overdueHours} ч ${overdueMins} мин`;
                        timerContainer.classList.add('gkf-laser-badge');

                        item.style.border = '2px solid #dc3545';
                        item.style.borderRadius = '4px';
                        item.style.margin = '5px 0';
                    } else {
                        // Ещё в пределах лимита
                        const leftMs = limitMs - diffMs;
                        const leftHours = Math.floor(leftMs / (1000 * 60 * 60));
                        const leftMins = Math.floor((leftMs % (1000 * 60 * 60)) / (1000 * 60));

                        timerContainer.innerText = `Осталось: ${leftHours} ч ${leftMins} мин`;
                        timerContainer.style.background = '#2ebd59';
                    }

                    const minorCell = item.querySelector('.structItem-cell--main .structItem-minor');
                    if (minorCell) {
                        minorCell.appendChild(timerContainer);

                        // Очистка float
                        if (!minorCell.querySelector('.gkf-clear-block')) {
                            const clearBlock = document.createElement('div');
                            clearBlock.className = 'gkf-clear-block';
                            clearBlock.style = 'clear: both;';
                            minorCell.appendChild(clearBlock);
                        }
                    }
                }
            }
        });

        // === КАСТОМНЫЙ ЗАГОЛОВОК НАД ЗАКРЕПЛЕННЫМИ ТЕМАМИ ===
        const headers = document.querySelectorAll('.structItemContainer-groupBlockHeader, .block-header');
        let nativeHeader = null;
        for (let h of headers) {
            if (h.innerText.toUpperCase().includes('ЗАКРЕПЛЕННЫЕ ТЕМЫ') ||
                h.innerText.toUpperCase().includes('ЗАКРЕПЛЁННЫЕ ТЕМЫ')) {
                nativeHeader = h;
                break;
            }
        }

        if (nativeHeader) nativeHeader.style.display = 'none';

        let customHeader = document.getElementById('gkf-perfect-header');
        if (!customHeader && stickyGroup) {
            customHeader = document.createElement('div');
            customHeader.id = 'gkf-perfect-header';
            customHeader.style =
                'padding: 6px 10px; font-size: 12px; font-weight: 700; color: #9ca3af; ' +
                'background: #1d1e22; border-bottom: 1px solid #2c2d30; text-transform: uppercase; ' +
                'font-family: sans-serif; letter-spacing: 0.3px; margin-bottom: 2px;';
            stickyGroup.parentNode.insertBefore(customHeader, stickyGroup);
        }

        if (customHeader) {
            customHeader.innerText =
                `ЗАКРЕПЛЕННЫЕ ТЕМЫ | ТЕХ. СПЕЦИАЛИСТУ: ${countTech} | ` +
                `РАССМОТРЕНИЕ: ${countConsideration} | ВСЕГО: ${countTotal} | ` +
                `ПРОСРОЧЕК: ${countOverdue}`;
        }
    }

    // === ИНИЦИАЛИЗАЦИЯ + НАБЛЮДАТЕЛЬ (с дебаунсом) ===
    function initGkfDashboard() {
        if (!isExactComplaintsSection()) return;

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runGkfDashboard);
        } else {
            runGkfDashboard();
        }

        const targetNode = document.querySelector('.p-body-pageContent');
        if (!targetNode) return;

        let gkfTimer = null;
        const observer = new MutationObserver((mutations) => {
            // Игнорируем собственные изменения скрипта
            let relevant = false;
            for (const m of mutations) {
                for (const n of m.addedNodes) {
                    if (n.nodeType === 1 &&
                        !n.classList?.contains('gkf-exact-timer') &&
                        !n.classList?.contains('gkf-clear-block') &&
                        n.id !== 'gkf-perfect-header') {
                        relevant = true;
                        break;
                    }
                }
                if (relevant) break;
            }
            if (!relevant) return;

            if (gkfTimer) return;
            gkfTimer = setTimeout(() => {
                gkfTimer = null;
                runGkfDashboard();
            }, 400);
        });
        observer.observe(targetNode, { childList: true, subtree: true });
    }

    initGkfDashboard();
})();
