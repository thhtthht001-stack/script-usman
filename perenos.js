// ==UserScript==
// @name         BR Panel (Thread Mover) — GROZNY
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Thread mover for GROZNY — mobile + PC
// @author       Black Russia
// @match        https://forum.blackrussia.online/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    if (document.body.getAttribute('data-br-script-injected-mover')) return;
    document.body.setAttribute('data-br-script-injected-mover', 'true');

    try {
        (function () {
            const STORAGE_PREFIX = 'br_mover_';

            // ─────── ID РАЗДЕЛОВ GROZNY ───────
            const NODES = [
                { id: 1620, label: 'БНД (Биографии на доработке)', color: '#0000CD' },
                { id: 1619, label: 'ОБ (Одобренные биографии)',    color: '#8B008B' },
                { id: 1621, label: 'НБ (Неодобренные биографии)',  color: '#DC143C' },
            ];

            // ─────── ПЕРЕНОС ТЕМЫ ───────
            function moveThreadOnly(targetNodeId) {
                const threadId = getThreadIdFromUrl();
                if (!threadId) {
                    alert('Эта функция доступна только при просмотре темы!');
                    return false;
                }

                let currentPrefixId = 0;
                const prefixElement = document.querySelector('.p-title-value .label');
                if (prefixElement) {
                    const prefixLink = prefixElement.closest('a');
                    if (prefixLink && prefixLink.href) {
                        const m = prefixLink.href.match(/prefix_id=(\d+)/);
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
                return true;
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

            // ─────── ОТРИСОВКА МЕНЮ ───────
            function renderMenu() {
                const menu = document.querySelector('.fnm-mover-menu');
                if (!menu) return;

                menu.innerHTML = '';

                const header = document.createElement('div');
                header.className = 'fnm-mover-header';
                header.textContent = 'ПЕРЕНОС ТЕМ';
                menu.appendChild(header);

                NODES.forEach((node, idx) => {
                    if (idx > 0) {
                        const div = document.createElement('div');
                        div.className = 'fnm-mover-divider';
                        menu.appendChild(div);
                    }

                    const a = document.createElement('a');
                    a.className = 'fnm-mover-link';
                    a.href = '#';
                    a.textContent = node.label;
                    a.style.borderBottom = `2px solid ${node.color}`;
                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        moveThreadOnly(node.id);
                    });
                    menu.appendChild(a);
                });
            }

            // ─────── СТИЛИ ───────
            const style = document.createElement('style');
            style.id = 'fnm-mover-styles';
            style.textContent = `
                :root {
                    --fnm-mover-btn: 48px;
                    --fnm-safe-bottom: env(safe-area-inset-bottom, 0px);
                    --fnm-safe-right: env(safe-area-inset-right, 0px);
                }

                /* ═══════ ОБЁРТКА ═══════ */
                .fnm-mover-wrapper {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 0;
                    height: 0;
                    z-index: 2147483646;
                }

                /* ═══════ КНОПКА ═══════ */
                .fnm-mover-toggle {
                    position: fixed;
                    width: var(--fnm-mover-btn);
                    height: var(--fnm-mover-btn);
                    background: #151515;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    cursor: grab;
                    touch-action: none;
                    user-select: none;
                    -webkit-user-select: none;
                    -webkit-tap-highlight-color: transparent;
                    transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
                    will-change: left, top;
                }
                .fnm-mover-toggle:active {
                    transform: scale(0.94);
                    cursor: grabbing;
                }
                .fnm-mover-toggle.active {
                    background: #dc2626;
                    border-color: #ef4444;
                }
                .fnm-mover-toggle svg {
                    transition: transform 0.25s ease;
                    pointer-events: none;
                }
                .fnm-mover-toggle.active svg {
                    transform: rotate(180deg);
                }

                /* ═══════ МЕНЮ ═══════ */
                .fnm-mover-menu {
                    position: fixed;
                    background: rgba(20, 20, 20, 0.95);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 14px;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    width: 280px;
                    max-height: 70vh;
                    overflow-y: auto;
                    opacity: 0;
                    visibility: hidden;
                    transform: scale(0.92);
                    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
                    pointer-events: none;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
                    box-sizing: border-box;
                    -webkit-overflow-scrolling: touch;
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

                /* ═══════ ЗАГОЛОВОК ═══════ */
                .fnm-mover-header {
                    text-align: center;
                    color: #fff;
                    font-weight: 700;
                    font-size: 12px;
                    padding: 6px 0;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    letter-spacing: 0.5px;
                }

                /* ═══════ ССЫЛКА-КНОПКА ═══════ */
                .fnm-mover-link {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 8px;
                    font-family: system-ui, -apple-system, sans-serif;
                    font-size: 12px;
                    font-weight: 700;
                    color: #e5e5e5;
                    text-decoration: none;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    border: 1px solid transparent;
                    transition: background 0.15s ease, transform 0.1s ease;
                    text-align: center;
                    cursor: pointer;
                    -webkit-tap-highlight-color: transparent;
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: manipulation;
                    line-height: 1.3;
                    word-break: break-word;
                }
                .fnm-mover-link:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .fnm-mover-link:active {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(1px);
                }

                /* ═══════ РАЗДЕЛИТЕЛЬ ═══════ */
                .fnm-mover-divider {
                    height: 1px;
                    background: rgba(255, 255, 255, 0.12);
                    margin: 2px 0;
                    width: 100%;
                }

                /* ═══════════ МОБИЛЬНАЯ ВЕРСИЯ ═══════════ */
                @media (max-width: 900px) {
                    :root { --fnm-mover-btn: 52px; }

                    .fnm-mover-menu {
                        width: min(340px, calc(100vw - 24px));
                        max-height: 65vh;
                        padding: 12px;
                        border-radius: 16px;
                        gap: 8px;
                    }

                    .fnm-mover-header {
                        font-size: 13px;
                        padding: 8px 0;
                    }

                    .fnm-mover-link {
                        padding: 14px 10px;
                        font-size: 13px;
                        min-height: 48px;
                    }
                }

                /* Очень узкие экраны */
                @media (max-width: 360px) {
                    .fnm-mover-menu {
                        width: calc(100vw - 16px);
                        padding: 10px;
                    }
                    .fnm-mover-link {
                        font-size: 12px;
                        padding: 12px 8px;
                    }
                }
            `;
            document.head.appendChild(style);

            // ─────── СОЗДАНИЕ UI ───────
            const wrapper = document.createElement('div');
            wrapper.className = 'fnm-mover-wrapper';

            const toggleBtn = document.createElement('div');
            toggleBtn.className = 'fnm-mover-toggle';
            toggleBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`;

            const menu = document.createElement('div');
            menu.className = 'fnm-mover-menu';

            wrapper.appendChild(menu);
            wrapper.appendChild(toggleBtn);
            document.body.appendChild(wrapper);

            // ─────── ПОЗИЦИЯ КНОПКИ ───────
            let savedPos = localStorage.getItem(STORAGE_PREFIX + 'pos');
            let pos = savedPos ? JSON.parse(savedPos) : { x: window.innerWidth - 70, y: window.innerHeight * 0.6 };
            let isDragging = false;
            let dragStartTime = 0;
            let dragStartX = 0;
            let dragStartY = 0;
            let hasMoved = false;
            let currentBtnSize = 48;

            // ─────── КОРРЕКТНОЕ ПОЗИЦИОНИРОВАНИЕ МЕНЮ ───────
            function updatePos(x, y) {
                currentBtnSize = isMobile() ? 52 : 48;

                pos.x = Math.min(Math.max(0, x), window.innerWidth - currentBtnSize);
                pos.y = Math.min(Math.max(0, y), window.innerHeight - currentBtnSize);

                toggleBtn.style.left = pos.x + 'px';
                toggleBtn.style.top = pos.y + 'px';

                positionMenu();
            }

            function positionMenu() {
                const rect = toggleBtn.getBoundingClientRect();
                const menuWidth = menu.offsetWidth || 280;
                const menuHeight = menu.offsetHeight || 300;
                const gap = 10;
                const margin = 10;

                // По горизонтали
                let left;
                if (rect.left - menuWidth - gap >= margin) {
                    // Помещается слева
                    left = rect.left - menuWidth - gap;
                } else if (rect.right + menuWidth + gap <= window.innerWidth - margin) {
                    // Помещается справа
                    left = rect.right + gap;
                } else {
                    // Прижимаем к краю, где больше места
                    const spaceLeft = rect.left;
                    const spaceRight = window.innerWidth - rect.right;
                    left = spaceLeft > spaceRight
                        ? Math.max(margin, rect.left - menuWidth - gap)
                        : Math.min(window.innerWidth - menuWidth - margin, rect.right + gap);
                }

                // По вертикали
                let top;
                if (rect.bottom + menuHeight + gap <= window.innerHeight - margin) {
                    // Помещается под кнопкой
                    top = rect.top;
                } else if (rect.top - menuHeight - gap >= margin) {
                    // Помещается над кнопкой
                    top = rect.bottom - menuHeight;
                } else {
                    // Прижимаем к краю, где больше места
                    const spaceBelow = window.innerHeight - rect.bottom;
                    const spaceAbove = rect.top;
                    top = spaceBelow > spaceAbove
                        ? Math.min(window.innerHeight - menuHeight - margin, rect.bottom + gap)
                        : Math.max(margin, rect.top - menuHeight - gap);
                }

                menu.style.left = left + 'px';
                menu.style.top = top + 'px';
            }

            // ─────── DRAG КНОПКИ ───────
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

                const half = currentBtnSize / 2;
                updatePos(e.clientX - half, e.clientY - half);
            });

            function endDrag(e) {
                if (!isDragging) return;
                isDragging = false;
                try { toggleBtn.releasePointerCapture(e.pointerId); } catch (_) {}
                toggleBtn.style.transition = 'transform 0.2s ease, background 0.2s ease, border-color 0.2s ease';
                toggleBtn.style.cursor = 'grab';

                localStorage.setItem(STORAGE_PREFIX + 'pos', JSON.stringify(pos));

                const dragDuration = Date.now() - dragStartTime;
                const isClick = !hasMoved && dragDuration < 300;

                if (isClick) {
                    const show = menu.classList.toggle('show');
                    toggleBtn.classList.toggle('active', show);
                    localStorage.setItem(STORAGE_PREFIX + 'state', show);
                    if (show) {
                        // Пересчитываем позицию после показа (offsetWidth станет известен)
                        requestAnimationFrame(positionMenu);
                    }
                }
            }

            toggleBtn.addEventListener('pointerup', endDrag);
            toggleBtn.addEventListener('pointercancel', endDrag);

            // ─────── РЕСАЙЗ / ПОВОРОТ ───────
            window.addEventListener('resize', () => {
                updatePos(pos.x, pos.y);
                if (menu.classList.contains('show')) positionMenu();
            });
            window.addEventListener('orientationchange', () => {
                setTimeout(() => updatePos(pos.x, pos.y), 250);
            });

            // ─────── СТАРТ ───────
            updatePos(pos.x, pos.y);
            renderMenu();

            if (localStorage.getItem(STORAGE_PREFIX + 'state') === 'true') {
                menu.classList.add('show');
                toggleBtn.classList.add('active');
                requestAnimationFrame(positionMenu);
            }

            // Повторный расчёт после загрузки шрифтов/иконок
            setTimeout(() => {
                updatePos(pos.x, pos.y);
                if (menu.classList.contains('show')) positionMenu();
            }, 400);

        })();
    } catch (e) {
        console.error('[BR Mover] Error:', e);
    }
})();
