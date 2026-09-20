// ==UserScript==
// @name         BR Panel (Thread Mover) — GROZNY (35)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Floating menu with thread mover for GROZNY (35) + Final response button
// @author       Black Russia
// @match        https://forum.blackrussia.online/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Уникальный атрибут для второго скрипта
    if (document.body.getAttribute('data-br-script-injected-mover')) {
        return;
    }
    document.body.setAttribute('data-br-script-injected-mover', 'true');

    try {
        (function() {
            const STORAGE_PREFIX = 'br_mover_';

            // === ФУНКЦИИ ПЕРЕНОСА (ТОЛЬКО ПЕРЕМЕЩЕНИЕ, БЕЗ ИЗМЕНЕНИЯ ПРЕФИКСА/СТАТУСА) ===
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
                        const prefixMatch = prefixLink.href.match(/prefix_id=(\d+)/);
                        if (prefixMatch) currentPrefixId = parseInt(prefixMatch[1]);
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
                        starter_alert_reason: "",
                        _xfToken: XF.config.csrf,
                        _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                        _xfWithData: 1,
                        _xfResponseType: 'json',
                    }),
                }).then(() => location.reload());
                return true;
            }

            function getFormData(data) {
                const formData = new FormData();
                Object.entries(data).forEach(i => formData.append(i[0], i[1]));
                return formData;
            }

            function getThreadIdFromUrl() {
                const match = window.location.pathname.match(/\/threads\/[^.]+\.(\d+)/);
                return match ? match[1] : null;
            }

            // === ДАННЫЕ GROZNY (35) ===
            const GROZNY =;
            const GROZNY_TECH_NODE_ID = 1619;            // ТР 35
            const GROZNY_TECH_COMPLAINT_NODE_ID = 1620;  // ЖБТ 35
            const GROZNY_PLAYER_COMPLAINT_NODE_ID = 1621; // ЖБИ 35

            const techColor = '#8B008B';
            const techComplaintColor = '#0000CD';
            const playerComplaintColor = '#DC143C';

            // ID раздела "Заявки с окончательным ответом"
            const FINAL_RESPONSE_NODE_ID = 230;
            const FINAL_RESPONSE_COLOR = '#40E0D0';

            function renderMenu() {
                const menu = document.querySelector('.fnm-mover-menu');
                if (!menu) return;

                menu.innerHTML = '';

                const header = document.createElement('div');
                header.textContent = 'ПЕРЕНОС ТЕМ';
                header.style.cssText = 'text-align:center; color:#fff; font-weight:bold; font-size:12px; padding:5px 0; margin-bottom:5px; background: rgba(255,255,255,0.1); border-radius:6px;';
                menu.appendChild(header);

                const createMoveButton = (nodeId, serverId, label, color) => {
                    const a = document.createElement('a');
                    a.className = 'fnm-mover-link';
                    a.href = '#';
                    a.textContent = `${label} ${serverId}`;
                    a.style.borderBottom = `2px solid ${color}`;

                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        moveThreadOnly(nodeId);
                    });

                    return a;
                };

                // ЖБТ 35
                const techComplaintGroup = document.createElement('div');
                techComplaintGroup.className = 'fnm-mover-grid';
                techComplaintGroup.appendChild(
                    createMoveButton(GROZNY_TECH_COMPLAINT_NODE_ID, GROZNY, 'БНД (Биографии на дороботке)', techComplaintColor)
                );
                menu.appendChild(techComplaintGroup);

                menu.appendChild(Object.assign(document.createElement('div'), { className: 'fnm-mover-divider' }));

                // ТР 35
                const techGroup = document.createElement('div');
                techGroup.className = 'fnm-mover-grid';
                techGroup.appendChild(
                    createMoveButton(GROZNY_TECH_NODE_ID, GROZNY, 'ОБ (Одобренные биографии)', techColor)
                );
                menu.appendChild(techGroup);

                menu.appendChild(Object.assign(document.createElement('div'), { className: 'fnm-mover-divider' }));

                // ЖБИ 35
                const playerComplaintGroup = document.createElement('div');
                playerComplaintGroup.className = 'fnm-mover-grid';
                playerComplaintGroup.appendChild(
                    createMoveButton(GROZNY_PLAYER_COMPLAINT_NODE_ID, GROZNY, 'НБ (Неодобренные биографии)', playerComplaintColor)
                );
                menu.appendChild(playerComplaintGroup);

                // === КНОПКА: ЗАЯВКИ С ОКОНЧ. ОТВЕТОМ ===
                const finalResponseBtn = document.createElement('div');
                finalResponseBtn.className = 'fnm-mover-final-btn';
                finalResponseBtn.innerHTML = 'ЗАЯВКИ С ОКОНЧАТЕЛЬНЫМ ОТВЕТОМ';
                finalResponseBtn.style.cssText = `
                    margin: 5px 0;
                    padding: 8px;
                    background: rgba(16, 185, 129, 0.15);
                    border: 1px solid ${FINAL_RESPONSE_COLOR};
                    border-radius: 8px;
                    color: ${FINAL_RESPONSE_COLOR};
                    font-size: 11px;
                    font-weight: bold;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                `;
                finalResponseBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    moveThreadOnly(FINAL_RESPONSE_NODE_ID);
                });
                finalResponseBtn.addEventListener('mouseenter', () => {
                    finalResponseBtn.style.background = `rgba(16, 185, 129, 0.3)`;
                    finalResponseBtn.style.color = '#fff';
                });
                finalResponseBtn.addEventListener('mouseleave', () => {
                    finalResponseBtn.style.background = `rgba(16, 185, 129, 0.15)`;
                    finalResponseBtn.style.color = FINAL_RESPONSE_COLOR;
                });
                menu.appendChild(finalResponseBtn);
            }

            // === СТИЛИ ===
            const style = document.createElement('style');
            style.textContent = `
                :root { --fnm-mover-btn: 48px; }
                .fnm-mover-wrapper { position: fixed; top: 0; left: 0; width: 0; height: 0; z-index: 2147483646; }
                .fnm-mover-toggle {
                    position: fixed;
                    width: var(--fnm-mover-btn);
                    height: var(--fnm-mover-btn);
                    background: #151515;
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 50%;
                    box-shadow: 0 6px 25px rgba(0,0,0,0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    cursor: grab;
                    touch-action: none;
                    user-select: none;
                    transition: transform 0.2s, left 0.1s, top 0.1s;
                }
                .fnm-mover-toggle:active { transform: scale(0.95); cursor: grabbing; }
                .fnm-mover-toggle.active { background: #dc2626; border-color: #ef4444; }
                .fnm-mover-toggle svg { transition: transform 0.2s; }
                .fnm-mover-toggle.active svg { transform: rotate(180deg); }
                .fnm-mover-menu {
                    position: fixed;
                    background: rgba(20,20,20,0.95);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(255,255,255,0.12);
                    border-radius: 16px;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    width: 300px;
                    max-height: 70vh;
                    overflow-y: auto;
                    opacity: 0;
                    visibility: hidden;
                    transform: scale(0.9);
                    transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
                    pointer-events: none;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.6);
                }
                .fnm-mover-menu.show { opacity: 1; visibility: visible; transform: scale(1); pointer-events: auto; }
                .fnm-mover-menu::-webkit-scrollbar { width: 4px; }
                .fnm-mover-menu::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
                .fnm-mover-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; }
                .fnm-mover-link {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 6px 2px;
                    font-family: system-ui, -apple-system, sans-serif;
                    font-size: 10px;
                    font-weight: 700;
                    color: #e5e5e5;
                    text-decoration: none;
                    background: rgba(255,255,255,0.05);
                    border-radius: 6px;
                    border: 1px solid transparent;
                    transition: background 0.1s;
                    white-space: nowrap;
                    cursor: pointer;
                }
                .fnm-mover-link:active { background: rgba(255,255,255,0.2); transform: translateY(1px); }
                .fnm-mover-divider { height: 1px; background: rgba(255,255,255,0.15); margin: 4px 0; width: 100%; }
            `;
            document.head.appendChild(style);

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

            let savedPos = localStorage.getItem(STORAGE_PREFIX + 'pos');
            let pos = savedPos ? JSON.parse(savedPos) : { x: window.innerWidth - 70, y: window.innerHeight * 0.6 };
            let isDragging = false;
            let dragStartTime = 0;
            let dragStartX = 0;
            let dragStartY = 0;
            let hasMoved = false;

            const updatePos = (x, y) => {
                pos.x = Math.min(Math.max(0, x), window.innerWidth - 48);
                pos.y = Math.min(Math.max(0, y), window.innerHeight - 48);
                toggleBtn.style.left = pos.x + 'px';
                toggleBtn.style.top = pos.y + 'px';

                const rect = toggleBtn.getBoundingClientRect();
                menu.style.left = (rect.right + 310 > window.innerWidth ? rect.left - 310 : rect.right + 10) + 'px';
                menu.style.top = (rect.bottom + 300 > window.innerHeight ? rect.top - 300 : rect.top) + 'px';
            };

            toggleBtn.addEventListener('pointerdown', (e) => {
                isDragging = true;
                hasMoved = false;
                dragStartTime = Date.now();
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                toggleBtn.setPointerCapture(e.pointerId);
                toggleBtn.style.transition = 'none';
                toggleBtn.style.cursor = 'grabbing';
            });

            toggleBtn.addEventListener('pointermove', (e) => {
                if (!isDragging) return;
                const dx = Math.abs(e.clientX - dragStartX);
                const dy = Math.abs(e.clientY - dragStartY);
                if (dx > 5 || dy > 5) {
                    hasMoved = true;
                }
                updatePos(e.clientX - 24, e.clientY - 24);
            });

            toggleBtn.addEventListener('pointerup', (e) => {
                isDragging = false;
                toggleBtn.releasePointerCapture(e.pointerId);
                toggleBtn.style.transition = 'all 0.3s';
                toggleBtn.style.cursor = 'grab';

                localStorage.setItem(STORAGE_PREFIX + 'pos', JSON.stringify(pos));

                const dragDuration = Date.now() - dragStartTime;
                const isClick = !hasMoved && dragDuration < 200;

                if (isClick) {
                    const show = menu.classList.toggle('show');
                    toggleBtn.classList.toggle('active', show);
                    localStorage.setItem(STORAGE_PREFIX + 'state', show);
                    if (show) updatePos(pos.x, pos.y);
                }
            });

            updatePos(pos.x, pos.y);
            renderMenu();
            if (localStorage.getItem(STORAGE_PREFIX + 'state') === 'true') {
                menu.classList.add('show');
                toggleBtn.classList.add('active');
            }
        })();
    } catch (e) {
        console.error('[BR Mover] Error:', e);
    }
})();
