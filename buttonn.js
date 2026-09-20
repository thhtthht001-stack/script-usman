// ==UserScript==
// @name         BR Panel — GROZNY (35)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Панель кнопок для GROZNY (35) — mobile + PC
// @author       Black Russia & usman
// @match        https://forum.blackrussia.online/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    if (document.body.getAttribute('data-br-script-injected-header')) return;
    document.body.setAttribute('data-br-script-injected-header', 'true');

    try {
        (function () {

            // ─────── ССЫЛКИ ───────
            const LINKS = {
                РПБ: 'https://forum.blackrussia.online/forums/РП-биографии.1594/',
                РПС: 'https://forum.blackrussia.online/forums/РП-ситуации.1593/',
                ЖБИ: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1614/',
                ОПС: 'https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/',
            };

            const BUTTONS = [
                { text: 'РПБ', link: LINKS.РПБ, color: '#0000CD' },
                { text: 'РПС', link: LINKS.РПС, color: '#8B008B' },
                { text: 'ЖБИ', link: LINKS.ЖБИ, color: '#DC143C' },
                { text: 'ОПС', link: LINKS.ОПС, color: '#f59e0b', glow: true },
            ];

            // ─────── ОПРЕДЕЛЕНИЕ МОБИЛКИ ───────
            function isMobile() {
                return window.innerWidth <= 900 ||
                       /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
            }

            // ─────── СОЗДАНИЕ ПАНЕЛИ ───────
            function createButtonsContainer() {
                const container = document.createElement('div');
                container.className = 'bgButtonsContainer';
                if (isMobile()) container.classList.add('mobile');

                BUTTONS.forEach(cfg => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'bgButton';
                    btn.textContent = cfg.text;

                    if (cfg.glow) {
                        btn.classList.add('glow');
                    } else {
                        btn.style.borderBottom = `2px solid ${cfg.color}`;
                    }

                    btn.addEventListener('click', () => {
                        window.location.href = cfg.link;
                    });

                    container.appendChild(btn);
                });

                return container;
            }

            // ─────── ПОИСК КОНТЕЙНЕРА ───────
            function findContainer() {
                const selectors = [
                    '.pageContent',
                    '.p-body-pageContent',
                    '.p-body-main',
                    '.p-body',
                    'main',
                ];
                for (const sel of selectors) {
                    const el = document.querySelector(sel);
                    if (el) return { parent: el, mode: 'inline' };
                }
                return { parent: document.body, mode: 'fixed' };
            }

            // ─────── ВСТАВКА ───────
            function initializeScript() {
                if (document.querySelector('.bgButtonsContainer')) return;

                const { parent, mode } = findContainer();
                const panel = createButtonsContainer();

                if (mode === 'fixed') {
                    panel.classList.add('fixed-top');
                    document.body.appendChild(panel);
                    document.body.classList.add('br-panel-fixed');
                } else {
                    parent.insertBefore(panel, parent.firstChild);
                }
            }

            // ─────── СТИЛИ ───────
            const style = document.createElement('style');
            style.id = 'br-panel-styles';
            style.textContent = `
                /* ═══════ БАЗА ═══════ */
                .bgButtonsContainer {
                    display: flex;
                    gap: 6px;
                    flex-wrap: wrap;
                    padding: 6px 0;
                    margin-bottom: 12px;
                    align-items: center;
                    box-sizing: border-box;
                }

                .bgButton {
                    background: #1a1a1a;
                    color: #ffffff;
                    border: 1px solid #333;
                    border-radius: 6px;
                    padding: 0 14px;
                    margin: 0;
                    font-family: system-ui, -apple-system, Arial, sans-serif;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.3px;
                    cursor: pointer;
                    transition: background 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
                    text-align: center;
                    min-width: 60px;
                    height: 36px;
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

                .bgButton:hover {
                    background: #2a2a2a;
                    border-color: #555;
                }

                .bgButton:active {
                    transform: scale(0.97);
                    background: #333;
                }

                .bgButton.glow {
                    background: rgba(245, 158, 11, 0.15);
                    color: #fbbf24;
                    border-color: rgba(245, 158, 11, 0.4);
                }
                .bgButton.glow:hover {
                    background: rgba(245, 158, 11, 0.25);
                    color: #fcd34d;
                }

                /* ═══════ МОБИЛЬНАЯ ВЕРСИЯ ═══════ */
                @media (max-width: 900px) {
                    .bgButtonsContainer.mobile {
                        gap: 8px;
                        padding: 8px 10px;
                        margin-bottom: 10px;
                        flex-wrap: nowrap;
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch;
                        scrollbar-width: none;
                    }
                    .bgButtonsContainer.mobile::-webkit-scrollbar {
                        display: none;
                    }
                    .bgButtonsContainer.mobile .bgButton {
                        min-width: 66px;
                        height: 42px;
                        padding: 0 16px;
                        font-size: 13px;
                        font-weight: 700;
                    }
                }

                /* ═══════ ФИКС-БАР (если контейнер не найден) ═══════ */
                .bgButtonsContainer.fixed-top {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 9997;
                    background: rgba(15, 15, 15, 0.94);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    margin: 0;
                    padding: 8px 12px;
                    padding-left: calc(12px + env(safe-area-inset-left, 0px));
                    padding-right: calc(12px + env(safe-area-inset-right, 0px));
                    padding-top: calc(8px + env(safe-area-inset-top, 0px));
                    gap: 8px;
                    flex-wrap: nowrap;
                    overflow-x: auto;
                    scrollbar-width: none;
                    box-sizing: border-box;
                }
                .bgButtonsContainer.fixed-top::-webkit-scrollbar {
                    display: none;
                }
                .bgButtonsContainer.fixed-top .bgButton {
                    min-width: 66px;
                    height: 42px;
                    padding: 0 16px;
                    font-size: 13px;
                    font-weight: 700;
                }

                /* Сдвиг body под фикс-бар */
                body.br-panel-fixed {
                    padding-top: calc(58px + env(safe-area-inset-top, 0px)) !important;
                }
            `;
            document.head.appendChild(style);

            // ─────── ИНИЦИАЛИЗАЦИЯ ───────
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeScript);
            } else {
                initializeScript();
            }

            // Наблюдаем за DOM — если панель пропала или появился новый контейнер
            const observer = new MutationObserver(() => {
                if (!document.querySelector('.bgButtonsContainer')) {
                    initializeScript();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });

            // Ресайз — пересоздаём панель при смене режима
            let lastMobile = isMobile();
            window.addEventListener('resize', () => {
                const nowMobile = isMobile();
                if (nowMobile !== lastMobile) {
                    lastMobile = nowMobile;
                    const old = document.querySelector('.bgButtonsContainer');
                    if (old) old.remove();
                    document.body.classList.remove('br-panel-fixed');
                    initializeScript();
                }
            });

        })();
    } catch (e) {
        console.error('[BR Panel] Error:', e);
    }
})();
