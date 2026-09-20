// ==UserScript==
// @name         BR Panel (Thread Mover)
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Floating menu with thread mover (All servers 1-91) + Final response button
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

            const serverNames = {
                1: 'RED', 2: 'GREEN', 3: 'BLUE', 4: 'YELLOW', 5: 'ORANGE',
                6: 'PURPLE', 7: 'LIME', 8: 'PINK', 9: 'CHERRY', 10: 'BLACK',
                11: 'INDIGO', 12: 'WHITE', 13: 'MAGENTA', 14: 'CRIMSON', 15: 'GOLD',
                16: 'AZURE', 17: 'PLATINUM', 18: 'AQUA', 19: 'GRAY', 20: 'ICE',
                21: 'CHILLI', 22: 'CHOCO', 23: 'MOSCOW', 24: 'SPB', 25: 'UFA',
                26: 'SOCHI', 27: 'KAZAN', 28: 'SAMARA', 29: 'ROSTOV', 30: 'ANAPA',
                31: 'EKB', 32: 'KRASNODAR', 33: 'ARZAMAS', 34: 'NOVOSIBIRSK', 35: 'GROZNY',
                36: 'SARATOV', 37: 'OMSK', 38: 'IRKUTSK', 39: 'VOLGOGRAD', 40: 'VORONEZH',
                41: 'BELGOROD', 42: 'MAKHACHKALA', 43: 'VLADIKAVKAZ', 44: 'VLADIVOSTOK', 45: 'KALININGRAD',
                46: 'CHELYABINSK', 47: 'KRASNOYARSK', 48: 'CHEBOKSARY', 49: 'KHABAROVSK', 50: 'PERM',
                51: 'TULA', 52: 'RYAZAN', 53: 'MURMANSK', 54: 'PENZA', 55: 'KURSK',
                56: 'ARKHANGELSK', 57: 'ORENBURG', 58: 'KIROV', 59: 'KEMEROVO', 60: 'TYUMEN',
                61: 'TOLYATTI', 62: 'IVANOVO', 63: 'STAVROPOL', 64: 'SMOLENSK', 65: 'PSKOV',
                66: 'BRYANSK', 67: 'OREL', 68: 'YAROSLAVL', 69: 'BARNAUL', 70: 'LIPETSK',
                71: 'ULYANOVSK', 72: 'YAKUTSK', 73: 'TAMBOV', 74: 'BRATSK', 75: 'ASTRAKHAN',
                76: 'CHITA', 77: 'KOSTROMA', 78: 'VLADIMIR', 79: 'KALUGA', 80: 'NOVGOROD',
                81: 'TAGANROG', 82: 'VOLOGDA', 83: 'TVER', 84: 'TOMSK', 85: 'IZHEVSK',
                86: 'SURGUT', 87: 'PODOLSK', 88: 'MAGADAN', 89: 'CHEREPOVETS', 90: 'NORILSK',
                91: 'ASTANA'
            };

            const techNodeIds = {
                1: 226, 2: 227, 3: 228, 4: 229, 5: 245, 6: 325, 7: 365, 8: 396, 9: 408, 10: 488,
                11: 493, 12: 554, 13: 613, 14: 653, 15: 660, 16: 701, 17: 757, 18: 815, 19: 857, 20: 925,
                21: 1007, 22: 1048, 23: 1052, 24: 1095, 25: 1138, 26: 1248, 27: 1290, 28: 1292, 29: 1334, 30: 1416,
                31: 1458, 32: 1460, 33: 1502, 34: 1544, 35: 1586, 36: 1628, 37: 1670, 38: 1712, 39: 1758, 40: 1800,
                41: 1842, 42: 1884, 43: 1926, 44: 1968, 45: 2010, 46: 2052, 47: 2094, 48: 2136, 49: 2178, 50: 2220,
                51: 2262, 52: 2304, 53: 2346, 54: 2388, 55: 2430, 56: 2472, 57: 2514, 58: 2516, 59: 2598, 60: 2639,
                61: 2682, 62: 2714, 63: 2747, 64: 2779, 65: 2811, 66: 2843, 67: 2875, 68: 2907, 69: 2939, 70: 2971,
                71: 3003, 72: 3035, 73: 3289, 74: 3324, 75: 3359, 76: 3394, 77: 3429, 78: 3464, 79: 3499, 80: 3535,
                81: 3570, 82: 3605, 83: 3643, 84: 3740, 85: 3747, 86: 3812, 87: 3817, 88: 3912, 89: 3978, 90: 3985,
                91: 4021
            };

            const techComplaintNodeIds = {
                1: 1182, 2: 1183, 3: 1184, 4: 1185, 5: 1186, 6: 1187, 7: 1188, 8: 1189, 9: 1190, 10: 1191,
                11: 1192, 12: 1193, 13: 1194, 14: 1195, 15: 1196, 16: 1197, 17: 1198, 18: 1199, 19: 1200, 20: 1201,
                21: 1202, 22: 1203, 23: 1204, 24: 1205, 25: 1206, 26: 1247, 27: 1289, 28: 1291, 29: 1333, 30: 1415,
                31: 1457, 32: 1459, 33: 1501, 34: 1543, 35: 1585, 36: 1627, 37: 1669, 38: 1711, 39: 1757, 40: 1801,
                41: 1841, 42: 1883, 43: 1925, 44: 1967, 45: 2009, 46: 2051, 47: 2093, 48: 2135, 49: 2177, 50: 2219,
                51: 2261, 52: 2303, 53: 2345, 54: 2387, 55: 2429, 56: 2471, 57: 2513, 58: 2515, 59: 2597, 60: 2639,
                61: 2681, 62: 2713, 63: 2746, 64: 2778, 65: 2810, 66: 2842, 67: 2874, 68: 2906, 69: 2938, 70: 2970,
                71: 3002, 72: 3034, 73: 3288, 74: 3323, 75: 3358, 76: 3393, 77: 3428, 78: 3463, 79: 3498, 80: 3533,
                81: 3569, 82: 3604, 83: 3642, 84: 3739, 85: 3746, 86: 3811, 87: 3816, 88: 3911, 89: 3946, 90: 3984,
                91: 4020
            };

            const playerComplaintNodeIds = {
                1: 88, 2: 119, 3: 156, 4: 194, 5: 273, 6: 312, 7: 352, 8: 394, 9: 435, 10: 470,
                11: 519, 12: 560, 13: 599, 14: 640, 15: 682, 16: 723, 17: 785, 18: 844, 19: 885, 20: 954,
                21: 994, 22: 1036, 23: 1082, 24: 1124, 25: 1167, 26: 1234, 27: 1276, 28: 1320, 29: 1362, 30: 1402,
                31: 1444, 32: 1488, 33: 1531, 34: 1572, 35: 1614, 36: 1656, 37: 1698, 38: 1740, 39: 1786, 40: 1828,
                41: 1870, 42: 1912, 43: 1954, 44: 1996, 45: 2038, 46: 2080, 47: 2122, 48: 2164, 49: 2206, 50: 2248,
                51: 2290, 52: 2332, 53: 2374, 54: 2416, 55: 2458, 56: 2500, 57: 2545, 58: 2584, 59: 2626, 60: 2663,
                61: 2702, 62: 2735, 63: 2767, 64: 2799, 65: 2831, 66: 2863, 67: 2895, 68: 2927, 69: 2959, 70: 2991,
                71: 3023, 72: 3055, 73: 3309, 74: 3344, 75: 3379, 76: 3414, 77: 3449, 78: 3484, 79: 3519, 80: 3555,
                81: 3590, 82: 3625, 83: 3666, 84: 3728, 85: 3767, 86: 3800, 87: 3837, 88: 3932, 89: 3967, 90: 4005,
                91: 4041
            };

            const techColor = '#8B008B';
            const techComplaintColor = '#0000CD';
            const playerComplaintColor = '#DC143C';
            
            // ID раздела "Заявки с окончательным ответом" (230)
            const FINAL_RESPONSE_NODE_ID = 230;
            const FINAL_RESPONSE_COLOR = '#40E0D0'; // Зеленый цвет для кнопки

            function getSelected() {
                const saved = localStorage.getItem(STORAGE_PREFIX + 'servers');
                return saved ? JSON.parse(saved) : [31, 32, 33, 34, 35];
            }

            function renderMenu() {
                const menu = document.querySelector('.fnm-mover-menu');
                if (!menu) return;

                menu.innerHTML = '';
                const selectedIds = getSelected();

                if (selectedIds.length === 0) {
                    const emptyMsg = document.createElement('div');
                    emptyMsg.style.cssText = 'color:#888; text-align:center; padding:10px; font-size:12px;';
                    emptyMsg.textContent = 'Серверы не выбраны. Нажмите настройки.';
                    menu.appendChild(emptyMsg);
                } else {
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

                    const techComplaintGroup = document.createElement('div');
                    techComplaintGroup.className = 'fnm-mover-grid';
                    selectedIds.forEach(id => {
                        if (techComplaintNodeIds[id]) {
                            const btn = createMoveButton(techComplaintNodeIds[id], id, 'ЖБТ', techComplaintColor);
                            techComplaintGroup.appendChild(btn);
                        }
                    });
                    menu.appendChild(techComplaintGroup);
                    
                    menu.appendChild(Object.assign(document.createElement('div'), { className: 'fnm-mover-divider' }));
                    
                    const techGroup = document.createElement('div');
                    techGroup.className = 'fnm-mover-grid';
                    selectedIds.forEach(id => {
                        if (techNodeIds[id]) {
                            const btn = createMoveButton(techNodeIds[id], id, 'ТР', techColor);
                            techGroup.appendChild(btn);
                        }
                    });
                    menu.appendChild(techGroup);
                    
                    menu.appendChild(Object.assign(document.createElement('div'), { className: 'fnm-mover-divider' }));
                    
                    const playerComplaintGroup = document.createElement('div');
                    playerComplaintGroup.className = 'fnm-mover-grid';
                    selectedIds.forEach(id => {
                        if (playerComplaintNodeIds[id]) {
                            const btn = createMoveButton(playerComplaintNodeIds[id], id, 'ЖБИ', playerComplaintColor);
                            playerComplaintGroup.appendChild(btn);
                        }
                    });
                    menu.appendChild(playerComplaintGroup);
                }

                // === НОВАЯ КНОПКА: ЗАЯВКИ С ОКОНЧ. ОТВЕТОМ ===
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
                // ========================================

                const settingsBtn = document.createElement('div');
                settingsBtn.className = 'fnm-mover-settings-btn';
                settingsBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
                settingsBtn.addEventListener('click', (e) => { e.stopPropagation(); openSettings(); });
                menu.appendChild(settingsBtn);
            }

            function openSettings() {
                const menu = document.querySelector('.fnm-mover-menu');
                const toggleBtn = document.querySelector('.fnm-mover-toggle');
                if (menu) menu.classList.remove('show');
                if (toggleBtn) toggleBtn.classList.remove('active');
                localStorage.setItem(STORAGE_PREFIX + 'state', 'false');

                let overlay = document.querySelector('.fnm-mover-modal-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'fnm-mover-modal-overlay';
                    overlay.innerHTML = `
                        <div class="fnm-mover-modal">
                            <div class="fnm-mover-modal-header">Выбор серверов (1-91)</div>
                            <div class="fnm-mover-modal-body"></div>
                            <div class="fnm-mover-modal-footer">
                                <button class="fnm-mover-btn fnm-mover-btn-secondary" id="fnm-mover-cancel">Отмена</button>
                                <button class="fnm-mover-btn fnm-mover-btn-primary" id="fnm-mover-save">Сохранить</button>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(overlay);
                    overlay.querySelector('#fnm-mover-cancel').onclick = () => overlay.classList.remove('open');
                    overlay.querySelector('#fnm-mover-save').onclick = () => {
                        const checked = Array.from(overlay.querySelectorAll('input:checked')).map(el => +el.value).sort((a, b) => a - b);
                        localStorage.setItem(STORAGE_PREFIX + 'servers', JSON.stringify(checked));
                        renderMenu();
                        overlay.classList.remove('open');
                    };
                }

                const body = overlay.querySelector('.fnm-mover-modal-body');
                body.innerHTML = '';
                const current = getSelected();
                
                for (let i = 1; i <= 91; i++) {
                    const serverName = serverNames[i] || `Server ${i}`;
                    const lbl = document.createElement('label');
                    lbl.className = 'fnm-mover-checkbox-label ' + (current.includes(i) ? 'checked' : '');
                    lbl.innerHTML = `<input type="checkbox" value="${i}" ${current.includes(i) ? 'checked' : ''}> ${i} | ${serverName}`;
                    lbl.querySelector('input').onchange = function () {
                        this.parentElement.classList.toggle('checked', this.checked);
                    };
                    body.appendChild(lbl);
                }
                setTimeout(() => overlay.classList.add('open'), 10);
            }

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
                .fnm-mover-settings-btn { 
                    width: 100%; 
                    padding: 8px; 
                    margin-top: 5px; 
                    background: rgba(255,255,255,0.05); 
                    border: 1px solid rgba(255,255,255,0.1); 
                    border-radius: 8px; 
                    color: #aaa; 
                    cursor: pointer; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                }
                .fnm-mover-settings-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
                .fnm-mover-modal-overlay { 
                    position: fixed; 
                    top: 0; 
                    left: 0; 
                    width: 100%; 
                    height: 100%; 
                    background: rgba(0,0,0,0.7); 
                    z-index: 2147483648; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    opacity: 0; 
                    visibility: hidden; 
                    transition: 0.3s; 
                }
                .fnm-mover-modal-overlay.open { opacity: 1; visibility: visible; }
                .fnm-mover-modal { 
                    background: #1a1a1a; 
                    border: 1px solid #333; 
                    border-radius: 12px; 
                    width: 90%; 
                    max-width: 600px; 
                    max-height: 85vh; 
                    display: flex; 
                    flex-direction: column; 
                    box-shadow: 0 20px 50px rgba(0,0,0,0.8); 
                }
                .fnm-mover-modal-header { padding: 15px; border-bottom: 1px solid #333; color: #fff; font-weight: bold; }
                .fnm-mover-modal-body { padding: 15px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; }
                .fnm-mover-modal-footer { padding: 15px; border-top: 1px solid #333; display: flex; justify-content: flex-end; gap: 10px; }
                .fnm-mover-checkbox-label { 
                    display: flex; 
                    align-items: center; 
                    gap: 8px; 
                    background: #222; 
                    padding: 6px; 
                    border-radius: 6px; 
                    cursor: pointer; 
                    user-select: none; 
                    color: #ccc; 
                    font-size: 11px; 
                    border: 1px solid #333; 
                }
                .fnm-mover-checkbox-label:hover { background: #2a2a2a; }
                .fnm-mover-checkbox-label input { accent-color: #dc2626; }
                .fnm-mover-checkbox-label.checked { border-color: #dc2626; background: rgba(220,38,38,0.1); color: #fff; }
                .fnm-mover-btn { padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold; transition: 0.2s; }
                .fnm-mover-btn-primary { background: #dc2626; color: #fff; }
                .fnm-mover-btn-primary:hover { background: #b91c1c; }
                .fnm-mover-btn-secondary { background: #333; color: #ccc; }
                .fnm-mover-btn-secondary:hover { background: #444; color: #fff; }
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
