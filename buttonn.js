// ==UserScript==
// @name         BR Panel — GROZNY (35)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Панель кнопок для сервера GROZNY (35)
// @author       Black Russia & usman
// @match        https://forum.blackrussia.online/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // --- ИСПРАВЛЕНИЕ ОШИБКИ (предотвращение двойной загрузки) ---
    if (document.body.getAttribute('data-br-script-injected-header')) {
        return;
    }
    document.body.setAttribute('data-br-script-injected-header', 'true');
    // ---------------------------------------------------------

    try {
        (function() {

            // --- ДАННЫЕ О РАЗДЕЛАХ (ТОЛЬКО GROZNY, сервер 35) ---
            const TECH_LINK    = 'https://forum.blackrussia.online/forums/РП-ситуации.1593/';
            const TECH_COMPLAINT_LINK = 'https://forum.blackrussia.online/forums/РП-биографии.1594/';
            const PLAYER_COMPLAINT_LINK = 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1614/';
            const OPS_LINK = 'https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/';

            // --- Функция для создания кнопок ---
            function createButtonsContainer() {
                const container = document.createElement('div');
                container.className = 'bgButtonsContainer';

                const createButton = (text, link, color = '#2563eb', isGlow = false) => {
                    const btn = document.createElement('button');
                    btn.textContent = text;
                    btn.className = 'bgButton';
                    if (isGlow) {
                        btn.style.background = 'rgba(245, 158, 11, 0.15)';
                        btn.style.color = '#fbbf24';
                        btn.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                    } else {
                        btn.style.borderBottom = `2px solid ${color}`;
                    }
                    btn.addEventListener('click', () => {
                        window.location.href = link;
                    });
                    return btn;
                };

                // ЖБТ 35 — Жалобы на тех. специалистов
                container.appendChild(createButton('РПБ 35', TECH_COMPLAINT_LINK, '#0000CD'));

                // ТР 35 — Технический раздел
                container.appendChild(createButton('ТР 35', TECH_LINK, '#8B008B'));

                // ЖБИ 35 — Жалобы на игроков
                container.appendChild(createButton('ЖБИ 35', PLAYER_COMPLAINT_LINK, '#DC143C'));

                // ОПС — Общие правила серверов
                container.appendChild(createButton('ОПС', OPS_LINK, '#f59e0b', true));

                return container;
            }

            function initializeScript() {
                const pageContent = document.querySelector(".pageContent");
                if (pageContent && !document.querySelector('.bgButtonsContainer')) {
                    const buttonsContainer = createButtonsContainer();
                    pageContent.appendChild(buttonsContainer);
                }
            }

            // --- СТИЛИ ---
            const style = document.createElement('style');
            style.textContent = `
                .bgButton {
                    background: #1a1a1a;
                    color: #ffffff;
                    border: 1px solid #333;
                    border-radius: 4px;
                    padding: 6px 8px;
                    margin: 2px;
                    font-size: 11px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: center;
                    min-width: 50px;
                    max-width: 55px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1.1;
                    word-break: break-word;
                    white-space: normal;
                    flex-shrink: 0;
                }

                .bgButton:hover {
                    background: #2a2a2a;
                    border-color: #555;
                }

                .bgButtonsContainer {
                    display: flex;
                    gap: 2px;
                    flex-wrap: nowrap;
                    overflow-x: auto;
                    padding: 5px 0;
                    margin-bottom: 10px;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                }

                .bgButtonsContainer::-webkit-scrollbar {
                    display: none;
                }

                /* Мобильная версия */
                @media (max-width: 768px) {
                    .bgButton {
                        min-width: 48px;
                        max-width: 52px;
                        font-size: 10px;
                        padding: 5px 6px;
                    }
                }

                /* ПК версия - перенос на новые строки */
                @media (min-width: 769px) {
                    .bgButtonsContainer {
                        flex-wrap: wrap;
                        overflow-x: visible;
                    }
                }
            `;
            document.head.appendChild(style);

            // --- Инициализация ---
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeScript);
            } else {
                initializeScript();
            }

            const observer = new MutationObserver(() => {
                if (!document.querySelector('.bgButtonsContainer')) {
                    initializeScript();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });

        })();
    } catch (e) {
        console.error('[BR Script] Panel Error:', e);
    }
})();
