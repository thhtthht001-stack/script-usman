// ==UserScript==
// @name         BR Panel — GROZNY (35)
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Панель кнопок для GROZNY (35) — fixed top bar
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

            const BUTTONS = [
                { text: 'РПБ', link: 'https://forum.blackrussia.online/forums/РП-биографии.1594/',   color: '#0000CD' },
                { text: 'РПС', link: 'https://forum.blackrussia.online/forums/РП-ситуации.1593/',    color: '#8B008B' },
                { text: 'ЖБИ', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1614/', color: '#DC143C' },
                { text: 'ОПС', link: 'https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/', color: '#f59e0b', glow: true },
            ];

            function createPanel() {
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

            function init() {
                if (document.querySelector('.bgButtonsContainer')) return;
                const panel = createPanel();
                document.body.appendChild(panel);
                document.body.classList.add('br-panel-active');
            }

            const style = document.createElement('style');
            style.textContent = `
                /* ═══ ПАНЕЛЬ ═══ */
                .bgButtonsContainer {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 9997;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    padding: 6px 10px;
                    padding-top: calc(6px + env(safe-area-inset-top, 0px));
                    background: rgba(15, 15, 15, 0.94);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    box-sizing: border-box;
                    flex-wrap: nowrap;
                    overflow-x: auto;
                    scrollbar-width: none;
                }
                .bgButtonsContainer::-webkit-scrollbar { display: none; }

                /* ═══ КНОПКА ═══ */
                .bgButton {
                    background: #1a1a1a;
                    color: #fff;
                    border: 1px solid #333;
                    border-radius: 6px;
                    padding: 0 14px;
                    margin: 0;
                    font-family: system-ui, -apple-system, Arial, sans-serif;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.3px;
                    cursor: pointer;
                    transition: background 0.15s, border-color 0.15s, transform 0.1s;
                    min-width: 56px;
                    height: 34px;
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
                .bgButton:active { transform: scale(0.96); background: #333; }

                .bgButton.glow {
                    background: rgba(245, 158, 11, 0.15);
                    color: #fbbf24;
                    border-color: rgba(245, 158, 11, 0.4);
                }
                .bgButton.glow:hover { background: rgba(245, 158, 11, 0.25); }

                /* Отступ под панель */
                body.br-panel-active {
                    padding-top: calc(46px + env(safe-area-inset-top, 0px)) !important;
                }

                /* ═══ МОБИЛКА ═══ */
                @media (max-width: 900px) {
                    .bgButtonsContainer {
                        gap: 8px;
                        padding: 8px 10px;
                        padding-top: calc(8px + env(safe-area-inset-top, 0px));
                        justify-content: flex-start;
                    }
                    .bgButton {
                        min-width: 64px;
                        height: 40px;
                        padding: 0 16px;
                        font-size: 13px;
                        font-weight: 700;
                    }
                    body.br-panel-active {
                        padding-top: calc(56px + env(safe-area-inset-top, 0px)) !important;
                    }
                }
            `;
            document.head.appendChild(style);

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }

            const observer = new MutationObserver(() => {
                if (!document.querySelector('.bgButtonsContainer')) init();
            });
            observer.observe(document.body, { childList: true, subtree: true });

        })();
    } catch (e) {
        console.error('[BR Panel] Error:', e);
    }
})();
