// ==UserScript==
// @name         BR Panel — GROZNY (35)
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Кнопки переходники GROZNY — встроены в шапку форума
// @author       Black Russia & usman
// @match        https://forum.blackrussia.online/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    if (document.body.getAttribute('data-br-panel-v7')) return;
    document.body.setAttribute('data-br-panel-v7', 'true');

    try {
        (function () {

            const BUTTONS = [
                { text: 'РПБ', link: 'https://forum.blackrussia.online/forums/РП-биографии.1594/',    color: '#0000CD' },
                { text: 'РПС', link: 'https://forum.blackrussia.online/forums/РП-ситуации.1593/',     color: '#8B008B' },
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

            // Ищем, куда вставить кнопки
            function findTarget() {
                // 1) Ищем элемент "Модер." и вставляем рядом с ним
                const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
                let node;
                while ((node = walker.nextNode())) {
                    if (node.children.length === 0) {
                        const t = (node.textContent || '').trim();
                        if (/^Модер\.?$/i.test(t)) {
                            return { parent: node.parentElement, ref: node };
                        }
                    }
                }

                // 2) Типовые контейнеры шапки XenForo
                const headerSelectors = [
                    '.p-header-content',
                    '.p-header-inner',
                    '.p-header',
                ];
                for (const sel of headerSelectors) {
                    const el = document.querySelector(sel);
                    if (el) return { parent: el, ref: el.firstChild };
                }

                // 3) Фолбэк — фикс-бар
                return { parent: document.body, ref: null, fixed: true };
            }

            function init() {
                if (document.querySelector('.bgButtonsContainer')) return;

                const target = findTarget();
                const panel = createPanel();

                if (target.fixed) {
                    panel.classList.add('fixed-fallback');
                    document.body.appendChild(panel);
                } else if (target.ref && target.ref.parentElement) {
                    target.ref.parentElement.insertBefore(panel, target.ref);
                } else if (target.parent) {
                    target.parent.appendChild(panel);
                }
            }

            const style = document.createElement('style');
            style.textContent = `
                /* ═══ ПАНЕЛЬ В ШАПКЕ ═══ */
                .bgButtonsContainer {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 0;
                    margin: 0 10px;
                    background: transparent;
                    vertical-align: middle;
                    flex-shrink: 0;
                    font-family: system-ui, -apple-system, Arial, sans-serif;
                    z-index: 10;
                }

                /* ═══ КНОПКА ═══ */
                .bgButton {
                    background: rgba(26, 26, 26, 0.75);
                    color: #fff;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 4px;
                    padding: 0 10px;
                    margin: 0;
                    font-family: inherit;
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.2px;
                    cursor: pointer;
                    transition: background 0.15s, border-color 0.15s, transform 0.1s;
                    min-width: 40px;
                    height: 26px;
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
                    background: rgba(45, 45, 45, 0.95);
                    border-color: rgba(255, 255, 255, 0.3);
                }
                .bgButton:active { transform: scale(0.95); }

                .bgButton.glow {
                    background: rgba(245, 158, 11, 0.18);
                    color: #fbbf24;
                    border-color: rgba(245, 158, 11, 0.5);
                }
                .bgButton.glow:hover {
                    background: rgba(245, 158, 11, 0.3);
                    color: #fcd34d;
                }

                /* ═══ ФОЛБЭК — если в шапку не влезло ═══ */
                .bgButtonsContainer.fixed-fallback {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    display: flex;
                    justify-content: flex-start;
                    gap: 4px;
                    padding: 4px 10px;
                    padding-top: calc(4px + env(safe-area-inset-top, 0px));
                    background: rgba(15, 15, 15, 0.9);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                    margin: 0;
                    z-index: 9997;
                }

                /* ═══ МОБИЛКА ═══ */
                @media (max-width: 900px) {
                    .bgButton {
                        min-width: 42px;
                        height: 28px;
                        padding: 0 10px;
                        font-size: 11px;
                        font-weight: 700;
                    }
                    .bgButtonsContainer {
                        gap: 5px;
                        margin: 0 6px;
                    }
                }
            `;
            document.head.appendChild(style);

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }

            // Если панель исчезла (SPA-навигация, перерисовка шапки) — вернуть
            const observer = new MutationObserver(() => {
                if (!document.querySelector('.bgButtonsContainer')) init();
            });
            observer.observe(document.body, { childList: true, subtree: true });

        })();
    } catch (e) {
        console.error('[BR Panel] Error:', e);
    }
})();
