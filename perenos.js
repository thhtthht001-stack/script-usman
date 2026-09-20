// ==UserScript==
// @name         BR Panel (Thread Mover) — GROZNY
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Thread mover for GROZNY — larger + right-first
// @author       Black Russia
// @match        https://forum.blackrussia.online/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    if (document.body.getAttribute('data-br-mover-v7')) return;
    document.body.setAttribute('data-br-mover-v7', 'true');

    try {
        (function () {
            const STORAGE_PREFIX = 'br_mover_';

            const NODES = [
                { id: 1620, label: 'БНД', short: 'Биографии на доработке', color: '#0000CD' },
                { id: 1619, label: 'ОБ',  short: 'Одобренные биографии',   color: '#8B008B' },
                { id: 1621, label: 'НБ',  short: 'Неодобренные биографии', color: '#DC143C' },
            ];

            function moveThreadOnly(targetNodeId) {
                if (!getThreadIdFromUrl()) {
                    alert('Эта функция доступна только при просмотре темы!');
                    return;
                }
                let currentPrefixId = 0;
                const prefixEl = document.querySelector('.p-title-value .label');
                if (prefixEl) {
                    const a = prefixEl.closest('a');
                    if (a && a.href) {
                        const m = a.href.match(/prefix_id=(\d+)/);
                        if (m) currentPrefixId = parseInt(m[1]);
                    }
                }
                fetch(`${document.URL}move`, {
                    method: 'POST',
                    body: getFormData({
                        prefix_id: currentPrefixId,
                        title: document.querySelector('.p-title-value')?.lastChild?.textContent || '',
                        target_node_id: targetNodeId,
                        redirect_type: 'none',
                        notify_watchers: 1,
                        starter_alert: 1,
                        starter_alert_reason: '',
                        _xfToken: XF.config.csrf,
                        _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                        _xfWithData: 1,
                        _xfResponseType: 'json',
                    }),
                }).then(() => location.reload());
            }

            function getFormData(data) {
                const fd = new FormData();
                Object.entries(data).forEach(i => fd.append(i[0], i[1]));
                return fd;
            }

            function getThreadIdFromUrl() {
                const m = window.location.pathname.match(/\/threads\/[^.]+\.(\d+)/);
                return m ? m[1] : null;
            }

            function isMobile() {
                return window.innerWidth <= 900 ||
                       /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
            }

            function renderMenu() {
                const menu = document.querySelector('.fnm-mover-menu');
                if (!menu) return;
                menu.innerHTML = '';

                const header = document.createElement('div');
                header.className = 'fnm-mover-header';
                header.textContent = 'ПЕРЕНОС';
                menu.appendChild(header);

                NODES.forEach((node, idx) => {
                    if (idx > 0) {
                        const d = document.createElement('div');
                        d.className = 'fnm-mover-divider';
                        menu.appendChild(d);
                    }
                    const a = document.createElement('a');
                    a.className = 'fnm-mover-link';
                    a.href = '#';
                    a.innerHTML = `<b>${node.label}</b><span class="fnm-short">${node.short}</span>`;
                    a.style.borderBottom = `2px solid ${node.color}`;
                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        moveThreadOnly(node.id);
                    });
                    menu.appendChild(a);
                });
            }

            const style = document.createElement('style');
            style.textContent = `
                :root { --fnm-size: 52px; }

                .fnm-mover-wrapper {
                    position: fixed;
                    top: 0; left: 0;
                    width: 0; height: 0;
                    z-index: 2147483646;
                }

                .fnm-mover-toggle {
                    position: fixed;
                    width: var(--fnm-size);
                    height: var(--fnm-size);
                    background: #151515;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.65);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    cursor: grab;
                    touch-action: none;
                    user-select: none;
                    -webkit-user-select: none;
                    -webkit-tap-highlight-color: transparent;
                    transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
                    will-change: left, top;
                }
                .fnm-mover-toggle:active { transform: scale(0.93); cursor: grabbing; }
                .fnm-mover-toggle.active { background: #dc2626; border-color: #ef4444; }
                .fnm-mover-toggle svg {
                    width: 24px;
                    height: 24px;
                    pointer-events: none;
                    transition: transform 0.2s ease;
                }
                .fnm-mover-toggle.active svg { transform: rotate(180deg); }

                .fnm-mover-menu {
                    position: fixed;
                    background: rgba(20, 20, 20, 0.95);
                    backdrop-filter: blur(14px);
                    -webkit-backdrop-filter: blur(14px);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 14px;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    width: 260px;
                    max-height: 70vh;
                    overflow-y: auto;
                    opacity: 0;
                    visibility: hidden;
                    transform: scale(0.92);
                    transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s ease;
                    pointer-events: none;
                    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.65);
                    box-sizing: border-box;
                }
                .fnm-mover-menu.show {
                    opacity: 1;
                    visibility: visible;
                    transform: scale(1);
                    pointer-events: auto;
                }
                .fnm-mover-menu::-webkit-scrollbar { width: 4px; }
                .fnm-mover-menu::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 2px;
                }

                .fnm-mover-header {
                    text-align: center;
                    color: #fff;
                    font-weight: 700;
                    font-size: 11px;
                    letter-spacing: 0.6px;
                    padding: 6px 0;
                    background: rgba(255, 255, 255, 0.08);
                    border-radius: 8px;
                }

                .fnm-mover-link {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 3px;
                    padding: 10px 12px;
                    font-family: system-ui, -apple-system, sans-serif;
                    font-size: 12px;
                    font-weight: 500;
                    color: #d0d0d0;
                    text-decoration: none;
                    background: rgba(255, 255, 255, 0.04);
                    border-radius: 8px;
                    transition: background 0.15s ease, transform 0.1s ease;
                    cursor: pointer;
                    -webkit-tap-highlight-color: transparent;
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: manipulation;
                    line-height: 1.3;
                }
                .fnm-mover-link b {
                    color: #fff;
                    font-weight: 700;
                    font-size: 13px;
                    letter-spacing: 0.3px;
                }
                .fnm-mover-link .fnm-short {
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.5);
                }
                .fnm-mover-link:hover { background: rgba(255, 255, 255, 0.1); }
                .fnm-mover-link:active {
                    background: rgba(255, 255, 255, 0.18);
                    transform: translateY(1px);
                }

                .fnm-mover-divider {
                    height: 1px;
                    background: rgba(255, 255, 255, 0.1);
                    margin: 2px 0;
                    width: 100%;
                }

                /* ═══ МОБИЛКА ═══ */
                @media (max-width: 900px) {
                    :root { --fnm-size: 56px; }

                    .fnm-mover-menu {
                        width: min(280px, calc(100vw - 20px));
                        padding: 10px;
                    }
                    .fnm-mover-link {
                        padding: 12px 12px;
                        min-height: 48px;
                        justify-content: center;
                    }
                    .fnm-mover-link b { font-size: 14px; }
                    .fnm-mover-link .fnm-short { font-size: 11px; }
                }
            `;
            document.head.appendChild(style);

            const wrapper = document.createElement('div');
            wrapper.className = 'fnm-mover-wrapper';

            const toggleBtn = document.createElement('div');
            toggleBtn.className = 'fnm-mover-toggle';
            toggleBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`;

            const menu = document.createElement('div');
            menu.className = 'fnm-mover-menu';

            wrapper.appendChild(menu);
            wrapper.appendChild(toggleBtn);
            document.body.appendChild(wrapper);

            let savedPos = localStorage.getItem(STORAGE_PREFIX + 'pos');
            // Изначально — чуть левее правого края, чтобы справа было место для меню
            let pos = savedPos ? JSON.parse(savedPos) : { x: window.innerWidth - 420, y: window.innerHeight - 140 };
            let isDragging = false, dragStartTime = 0, dragStartX = 0, dragStartY = 0, hasMoved = false;
            let currentSize = 52;

            function updatePos(x, y) {
                currentSize = isMobile() ? 56 : 52;
                pos.x = Math.min(Math.max(0, x), window.innerWidth - currentSize);
                pos.y = Math.min(Math.max(0, y), window.innerHeight - currentSize);
                toggleBtn.style.left = pos.x + 'px';
                toggleBtn.style.top = pos.y + 'px';
                positionMenu();
            }

            // ═══ ПРИОРИТЕТ СПРАВА ═══
            function positionMenu() {
                const rect = toggleBtn.getBoundingClientRect();
                const mw = menu.offsetWidth || 260;
                const mh = menu.offsetHeight || 260;
                const gap = 10, margin = 10;

                // Сначала пробуем СПРАВА
                let left;
                if (rect.right + mw + gap <= window.innerWidth - margin) {
                    left = rect.right + gap;
                } else if (rect.left - mw - gap >= margin) {
                    // потом слева
                    left = rect.left - mw - gap;
                } else {
                    // прижимаем
                    const sl = rect.left, sr = window.innerWidth - rect.right;
                    left = sr > sl
                        ? Math.min(window.innerWidth - mw - margin, rect.right + gap)
                        : Math.max(margin, rect.left - mw - gap);
                }

                // По вертикали
                let top;
                if (rect.bottom + mh + gap <= window.innerHeight - margin) {
                    top = rect.top;
                } else if (rect.top - mh - gap >= margin) {
                    top = rect.bottom - mh;
                } else {
                    const sb = window.innerHeight - rect.bottom, sa = rect.top;
                    top = sb > sa
                        ? Math.min(window.innerHeight - mh - margin, rect.bottom + gap)
                        : Math.max(margin, rect.top - mh - gap);
                }

                menu.style.left = left + 'px';
                menu.style.top = top + 'px';
            }

            toggleBtn.addEventListener('pointerdown', (e) => {
                isDragging = true;
                hasMoved = false;
                dragStartTime = Date.now();
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                try { toggleBtn.setPointerCapture(e.pointerId); } catch (_) {}
                toggleBtn.style.transition = 'none';
                toggleBtn.style.cursor = 'grabbing';
            });

            toggleBtn.addEventListener('pointermove', (e) => {
                if (!isDragging) return;
                const dx = Math.abs(e.clientX - dragStartX);
                const dy = Math.abs(e.clientY - dragStartY);
                if (dx > 5 || dy > 5) hasMoved = true;
                updatePos(e.clientX - currentSize / 2, e.clientY - currentSize / 2);
            });

            function endDrag(e) {
                if (!isDragging) return;
                isDragging = false;
                try { toggleBtn.releasePointerCapture(e.pointerId); } catch (_) {}
                toggleBtn.style.transition = 'transform 0.15s ease, background 0.15s ease, border-color 0.15s ease';
                toggleBtn.style.cursor = 'grab';

                localStorage.setItem(STORAGE_PREFIX + 'pos', JSON.stringify(pos));

                const isClick = !hasMoved && (Date.now() - dragStartTime) < 300;
                if (isClick) {
                    const show = menu.classList.toggle('show');
                    toggleBtn.classList.toggle('active', show);
                    localStorage.setItem(STORAGE_PREFIX + 'state', show);
                    if (show) requestAnimationFrame(positionMenu);
                }
            }

            toggleBtn.addEventListener('pointerup', endDrag);
            toggleBtn.addEventListener('pointercancel', endDrag);

            window.addEventListener('resize', () => {
                updatePos(pos.x, pos.y);
                if (menu.classList.contains('show')) positionMenu();
            });
            window.addEventListener('orientationchange', () => setTimeout(() => updatePos(pos.x, pos.y), 250));

            updatePos(pos.x, pos.y);
            renderMenu();

            if (localStorage.getItem(STORAGE_PREFIX + 'state') === 'true') {
                menu.classList.add('show');
                toggleBtn.classList.add('active');
                requestAnimationFrame(positionMenu);
            }

            setTimeout(() => {
                updatePos(pos.x, pos.y);
                if (menu.classList.contains('show')) positionMenu();
            }, 400);

        })();
    } catch (e) {
        console.error('[BR Mover] Error:', e);
    }
})();
