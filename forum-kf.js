// ==UserScript==
// @name    Кураторы Форума GROZNY | Black Russia
// @name:ru Кураторы Форума GROZNY | Black Russia
// @name:uk Кураторы Форума GROZNY | Black Russia
// @description  Предложения по улучшению скрипта писать сюда ---> https://vk.com/salafi_nn
// @description:ru Предложения по улучшению скрипта писать сюда ---> https://vk.com/salafi_nn
// @description:uk Приятного использования ---> https://vk.com/salafi_nn
// @version 3.0
// @namespace https://forum.blackrussia.online
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @match        https://forum.blackrussia.online/forums/*
// @include      https://forum.blackrussia.online/forums/
// @grant        none
// @license    MIT
// @supportURL https://vk.com/salafi_nn
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/596533/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20GROZNY%20%7C%20Black%20Russia.user.js
// @updateURL https://update.greasyfork.org/scripts/596533/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20GROZNY%20%7C%20Black%20Russia.meta.js
// ==/UserScript==

(function () {
  `use strict`;

  /* === GROZNY SERIOUS / MODERN ANIMATED UI === */
  (function () {
    if (document.getElementById("grozny-dark-theme")) return;
    const s = document.createElement("style");
    s.id = "grozny-dark-theme";
    s.textContent = `
      :root{
        --gz-panel:#25292e;
        --gz-panel-2:#2a2f35;
        --gz-head:#474e57;
        --gz-border:#454c55;
        --gz-text:#e4e7eb;
        --gz-blue:#4a90e2;
        --gz-red:#e74c3c;
        --gz-orange:#e67e22;
        --gz-green:#2ecc71;
        --gz-yellow:#f1c40f;
      }

      .grozny-answer-toolbar,
      .grozny-answer-btn,
      .grozny-modal,
      .grozny-choice,
      .grozny-prefix-btn{
        -webkit-font-smoothing:antialiased!important;
      }

      .grozny-answer-toolbar{
        display:flex!important;
        flex-wrap:wrap!important;
        align-items:stretch!important;
        gap:8px!important;
        margin:7px 0 10px!important;
        padding:5px!important;
        background:#24282d!important;
        border:1px solid #383e46!important;
        border-radius:8px!important;
        box-shadow:0 3px 12px rgba(0,0,0,.18)!important;
        animation:gzToolbarIn .28s ease-out both!important;
        column-gap:4px!important;
        row-gap:4px!important;
      }

      .grozny-answer-btn{
        display:inline-flex!important;
        align-items:center!important;
        justify-content:center!important;
        vertical-align:middle!important;
        position:relative!important;
        overflow:hidden!important;
        appearance:none!important;
        min-height:38px!important;
        padding:0 15px!important;
        margin:0 6px 6px 0!important;
        border:1px solid #4b535d!important;
        border-radius:6px!important;
        background:#2c3035!important;
        color:#e5e8eb!important;
        font:700 13px/1 Arial,sans-serif!important;
        letter-spacing:.1px!important;
        text-transform:uppercase!important;
        cursor:pointer!important;
        box-shadow:0 1px 2px rgba(0,0,0,.25),inset 0 1px rgba(255,255,255,.035)!important;
        transition:all .18s ease!important;
      }

      .grozny-answer-btn::after{
        content:""!important;
        position:absolute!important;
        left:50%!important;
        top:50%!important;
        width:0!important;
        height:0!important;
        border-radius:50%!important;
        background:rgba(255,255,255,.08)!important;
        transform:translate(-50%,-50%)!important;
        transition:width .35s ease,height .35s ease!important;
        pointer-events:none!important;
      }

      .grozny-answer-btn:hover{
        background:#353a40!important;
        border-color:#68727e!important;
        color:#fff!important;
        transform:translateY(-1px)!important;
        box-shadow:0 4px 8px rgba(0,0,0,.3)!important;
      }

      .grozny-answer-btn:hover::after{
        width:150px!important;
        height:150px!important;
      }

      .grozny-answer-btn:active{
        transform:translateY(0) scale(.98)!important;
        box-shadow:0 1px 3px rgba(0,0,0,.25)!important;
      }

      .grozny-answer-btn[data-kind="blue"]{border-color:var(--gz-blue)!important}
      .grozny-answer-btn[data-kind="green"]{border-color:var(--gz-green)!important}
      .grozny-answer-btn[data-kind="red"]{border-color:var(--gz-red)!important}
      .grozny-answer-btn[data-kind="orange"]{border-color:var(--gz-orange)!important}
      .grozny-answer-btn[data-kind="yellow"]{border-color:var(--gz-yellow)!important}

      #selectAnswer.grozny-answer-btn{
        border-color:var(--gz-orange)!important;
        background:#35322e!important;
      }

      #groznyCustomPrefixBtn.grozny-answer-btn{
        border-color:var(--gz-yellow)!important;
      }

      #groznyAnswerOverlay,#prefixModalOverlay{
        position:fixed!important;
        inset:0!important;
        z-index:999999!important;
        display:flex!important;
        align-items:center!important;
        justify-content:center!important;
        padding:16px!important;
        box-sizing:border-box!important;
        background:rgba(8,10,12,.78)!important;
        animation:gzOverlayIn .2s ease-out both!important;
      }

      .grozny-modal{
        width:min(920px,96vw)!important;
        max-height:88vh!important;
        overflow:hidden!important;
        box-sizing:border-box!important;
        background:#25292e!important;
        border:1px solid #515964!important;
        border-radius:9px!important;
        color:var(--gz-text)!important;
        font-family:Arial,sans-serif!important;
        box-shadow:0 18px 50px rgba(0,0,0,.58),0 0 0 1px rgba(255,255,255,.025)!important;
        animation:gzModalIn .24s cubic-bezier(.2,.8,.2,1) both!important;
      }

      .grozny-modal-header{
        height:48px!important;
        display:flex!important;
        align-items:center!important;
        justify-content:space-between!important;
        padding:0 16px!important;
        box-sizing:border-box!important;
        background:linear-gradient(180deg,#4c535d 0%,#454b54 100%)!important;
        border-bottom:1px solid #5c646e!important;
      }

      .grozny-modal-title{
        margin:0!important;
        color:#f0f2f4!important;
        font-size:15px!important;
        line-height:1!important;
        font-weight:800!important;
        text-transform:uppercase!important;
        letter-spacing:.15px!important;
      }

      .grozny-modal-close{
        appearance:none!important;
        width:31px!important;
        height:31px!important;
        border:0!important;
        border-radius:7px!important;
        background:transparent!important;
        color:#dce0e4!important;
        font-size:24px!important;
        line-height:29px!important;
        cursor:pointer!important;
        transition:background .15s,color .15s,transform .15s!important;
      }

      .grozny-modal-close:hover{
        background:rgba(255,255,255,.08)!important;
        color:#fff!important;
        transform:rotate(90deg)!important;
      }

      .grozny-modal-body{
        max-height:calc(88vh - 48px)!important;
        overflow-y:auto!important;
        padding:15px!important;
        box-sizing:border-box!important;
        scrollbar-color:#626a74 #202328!important;
      }

      .grozny-answer-grid{
        display:flex!important;
        flex-wrap:wrap!important;
        gap:9px!important;
        align-items:center!important;
      }

      .grozny-choice{
        position:relative!important;
        overflow:hidden!important;
        appearance:none!important;
        min-height:36px!important;
        padding:0 12px!important;
        border:1px solid #5b8fbd!important;
        border-radius:7px!important;
        background:linear-gradient(180deg,#30353b,#292e33)!important;
        color:#e3e6e9!important;
        font:600 12px/1 Arial,sans-serif!important;
        cursor:pointer!important;
        box-shadow:0 1px 3px rgba(0,0,0,.22)!important;
        transition:transform .16s ease,background .16s ease,border-color .16s ease,box-shadow .16s ease!important;
      }

      .grozny-choice:hover{
        background:linear-gradient(180deg,#3a4047,#30353b)!important;
        border-color:#7aa7cf!important;
        color:#fff!important;
        transform:translateY(-1px)!important;
        box-shadow:0 4px 10px rgba(0,0,0,.24)!important;
      }

      .grozny-choice:active{ transform:scale(.98)!important; }

      .grozny-choice[data-kind="red"]{border-color:#b74b4b!important}
      .grozny-choice[data-kind="green"]{border-color:#5d9072!important}
      .grozny-choice[data-kind="orange"]{border-color:#b67b48!important}
      .grozny-choice[data-kind="yellow"]{border-color:#aaa052!important}

      .grozny-section{
        position:relative!important;
        flex:0 0 100%!important;
        margin:8px 0 4px!important;
        padding:9px 12px!important;
        border-radius:6px!important;
        background:linear-gradient(180deg,#c7443c 0%,#b83b35 100%)!important;
        color:#fff!important;
        font:800 12px/1 Arial,sans-serif!important;
        text-align:center!important;
        text-transform:uppercase!important;
        letter-spacing:.25px!important;
        box-sizing:border-box!important;
        box-shadow:0 2px 6px rgba(0,0,0,.18)!important;
        animation:gzSectionIn .25s ease-out both!important;
      }

      #prefixModalOverlay .grozny-modal{ width:min(620px,94vw)!important; }

      .grozny-prefix-grid{
        display:grid!important;
        grid-template-columns:repeat(2,minmax(0,1fr))!important;
        gap:9px!important;
      }

      .grozny-prefix-btn{
        min-height:40px!important;
        padding:0 11px!important;
        border:1px solid #5b8fbd!important;
        border-radius:7px!important;
        background:linear-gradient(180deg,#30353b,#292e33)!important;
        color:#e3e6e9!important;
        font:600 12px/1 Arial,sans-serif!important;
        cursor:pointer!important;
        transition:transform .16s ease,background .16s ease,border-color .16s ease!important;
      }

      .grozny-prefix-btn:hover{
        background:linear-gradient(180deg,#3a4047,#30353b)!important;
        border-color:#7aa7cf!important;
        color:#fff!important;
        transform:translateY(-1px)!important;
      }

      .grozny-prefix-btn[data-pin="true"]{ border-color:#b67b48!important; }

      #bio-checker-advanced-widget{
        background:#25292e!important;
        border-color:#414850!important;
        border-radius:8px!important;
        box-shadow:0 5px 18px rgba(0,0,0,.2)!important;
      }

      @keyframes gzToolbarIn{ from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
      @keyframes gzOverlayIn{ from{opacity:0} to{opacity:1} }
      @keyframes gzModalIn{ from{opacity:0;transform:translateY(12px) scale(.985)} to{opacity:1;transform:translateY(0) scale(1)} }
      @keyframes gzSectionIn{ from{opacity:0;transform:translateX(-5px)} to{opacity:1;transform:translateX(0)} }

      @media(max-width:700px){
        .grozny-answer-btn{ min-height:36px!important; padding:0 11px!important; font-size:12px!important; margin:0 4px 4px 0!important; }
        .grozny-prefix-grid{grid-template-columns:1fr!important}
        .grozny-modal{width:98vw!important}
        .grozny-modal-body{padding:11px!important}
      }
    `;
    document.head.appendChild(s);
  })();

  // === ЧАСТЬ 1: ФУНКЦИИ АНАЛИЗА И ПРОВЕРОК ===

  function isBioSection() {
    const crumbs = document.querySelectorAll('.p-breadcrumbs a[href*="/forums/"]');
    for (let crumb of crumbs) {
      if (crumb.innerText.includes('РП биограф') || crumb.getAttribute('href').includes('.1594')) {
        return true;
      }
    }
    return false;
  }

  function getBioText() {
    const firstPost = document.querySelector('.message-inner .message-userContent .bbWrapper');
    if (!firstPost) return "";
    const clone = firstPost.cloneNode(true);
    const quotes = clone.querySelectorAll('blockquote');
    quotes.forEach(q => q.remove());
    return clone.innerText.trim();
  }

  async function checkOrtho(text) {
    if (!text) return 0;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 4000);
      const response = await fetch(
        `https://speller.yandex.net/services/spellservice.json/checkText?text=${encodeURIComponent(text.slice(0, 5000))}`,
        { signal: ctrl.signal }
      );
      clearTimeout(timer);
      const data = await response.json();
      return Array.isArray(data) ? data.length : 0;
    } catch (e) { return 0; }
  }

  function analyzeTextQuality(text) {
    let punctErrors = 0; let grammarErrors = 0;
    const spaceBeforePunct = (text.match(/\s[.,;:!?]/g) || []).length;
    const noSpaceAfterPunct = (text.match(/[.,;:!?][А-Яа-яA-Za-z]/g) || []).length;
    const doublePunct = (text.match(/[.,;:!?]{2,}/g) || []).length - (text.match(/\.{3}/g) || []).length;
    const missingCommaIntro = (text.match(/(короче|вероятно|конечно|например|к сожалению|итак)\s[^,]/gi) || []).length;
    punctErrors = spaceBeforePunct + noSpaceAfterPunct + doublePunct + missingCommaIntro;
    const lowercaseSentenceStart = (text.match(/[.!?]\s+[а-я]/g) || []).length;
    const missingHyphenParticles = (text.match(/\b(кто|что|где|когда|как|чей|кого)\s+(то|либо|нибудь)\b/gi) || []).length;
    const wrongTsa = (text.match(/\b\w+ться\s+(он|она|оно|они)\b/gi) || []).length;
    grammarErrors = lowercaseSentenceStart + missingHyphenParticles + wrongTsa;
    return { punctErrors, grammarErrors };
  }

  function checkFormStructure(text) {
    const requiredFields = [
      { name: "Имя и фамилия персонажа", regex: /Имя\s+и\s+фамилия(\s+персонажа)?\s*:/i },
      { name: "Пол", regex: /Пол\s*:/i }, { name: "Возраст", regex: /Возраст\s*:/i },
      { name: "Национальность", regex: /Национальность\s*:/i }, { name: "Образование", regex: /Образование\s*:/i },
      { name: "Описание внешности", regex: /Описание\s+внешности\s*:/i }, { name: "Характер", regex: /Характер\s*:/i },
      { name: "Детство", regex: /Детство\s*:/i }, { name: "Настоящее время", regex: /Настоящее\s+время\s*:/i },
      { name: "Итог", regex: /Итог\s*:/i }
    ];
    let results = []; let allValid = true;
    requiredFields.forEach(field => {
      const exists = field.regex.test(text);
      if (!exists) allValid = false;
      results.push({ name: field.name, exists: exists });
    });
    return { allValid, fieldsReport: results };
  }

  function analyzeAgeLogic(text) {
    let alerts = [];
    const ageMatch = text.match(/Возраст\s*:\s*(\d+)/i);
    let mainAge = ageMatch ? parseInt(ageMatch, 10) : null;

    if (mainAge !== null) {
      if (mainAge < 18) {
        alerts.push(`Минимальный возраст персонажа должен быть 18+ лет (указано: ${mainAge})`);
      }
    }

    const ageRegex = /(\d+)\s*(лет|года|году)/gi;
    let match; let foundAges = [];
    while ((match = ageRegex.exec(text)) !== null) { foundAges.push(parseInt(match[1], 10)); }
    const dynamicAges = foundAges.filter(a => a >= 14 && a <= 90);

    if (mainAge !== null && dynamicAges.length > 0) {
      const maxMentionedAge = Math.max(...dynamicAges);
      if (maxMentionedAge > mainAge + 2) {
        alerts.push(`Нестыковка возраста: в анкете указано ${mainAge} лет, но в тексте упоминается возраст ${maxMentionedAge} лет`);
      }
      if (dynamicAges.length > 1) {
        const minAge = Math.min(...dynamicAges.filter(a => a > 18));
        if (maxMentionedAge - minAge > 15 && mainAge < maxMentionedAge) {
          alerts.push(`Нарушена логика дат: в истории персонажа слишком резкие прыжки возраста (${minAge} лет -> ${maxMentionedAge} лет)`);
        }
      }
    }
    return { isValid: alerts.length === 0, message: alerts.length > 0 ? alerts.join('<br> • ') : 'Логика возраста и дат соблюдена' };
  }

  // === ЧАСТЬ 2: ВИЗУАЛИЗАЦИЯ И ИНТЕГРАЦИЯ В ИНТЕРФЕЙС ===

  async function analyzeBiography() {
    if (!window.location.href.includes('forum.blackrussia.online/threads/')) return;
    if (!isBioSection()) return;

    const text = getBioText(); if (!text) return;
    const quickReplyForm = document.querySelector('.js-quickReply');

    let loadingPlaceholder = document.getElementById('bio-loading-pl');
    if (!loadingPlaceholder) {
      loadingPlaceholder = document.createElement('div');
      loadingPlaceholder.id = 'bio-loading-pl';
      loadingPlaceholder.style = 'text-align:center; color:#a5a6a9; margin:20px; font-size:14px; font-family:sans-serif;';
      loadingPlaceholder.innerText = '⏳ Проверка формы, возраста и грамотности...';
      if (quickReplyForm) quickReplyForm.parentNode.insertBefore(loadingPlaceholder, quickReplyForm);
    }

    const orthoErrors = await checkOrtho(text);
    const { punctErrors, grammarErrors } = analyzeTextQuality(text);
    const formCheck = checkFormStructure(text);
    const ageCheck = analyzeAgeLogic(text);

    if (loadingPlaceholder) loadingPlaceholder.remove();

    const rawWords = text.split(/\s+/).filter(word => word.length > 0);
    const originalCount = rawWords.length;
    const finalCount = Math.max(0, originalCount - 15);
    const isWordsOk = finalCount >= 200 && finalCount <= 600;

    const totalOk = isWordsOk && orthoErrors <= 10 && punctErrors <= 15 && grammarErrors <= 8 && formCheck.allValid && ageCheck.isValid;
    let statusColor = totalOk ? "#28a745" : "#dc3545";

    let formReportHtml = "";
    formCheck.fieldsReport.forEach(f => {
      formReportHtml += `<span style="color: ${f.exists ? '#28a745' : '#dc3545'}; display: inline-block; margin: 3px 8px; font-size: 13px;">${f.exists ? '✓' : '✗'} ${f.name}</span>`;
    });

    const ageStatusHtml = ageCheck.isValid
      ? `<span style="color: #28a745; font-weight: bold;">«Логика соблюдена»</span>`
      : `<span style="color: #dc3545; font-weight: bold;">${ageCheck.message}</span>`;

    const widget = document.createElement('div');
    widget.id = 'bio-checker-advanced-widget';
    widget.style = `background: #18191d; border: 2px solid ${statusColor}; border-radius: 8px; padding: 20px; margin: 20px auto; max-width: 650px; text-align: center; font-family: sans-serif; color: #e3e4e8; box-shadow: 0 4px 15px rgba(0,0,0,0.5);`;
    widget.innerHTML = `
        <h3 style="color: ${statusColor}; font-size: 22px; margin: 0 0 15px 0; font-weight: bold;">${totalOk ? '✅ Биография проходит' : '❌ Биография не проходит'}</h3>

        <div style="font-size: 15px; margin-bottom: 10px;">Соответствие шаблону: <span style="font-weight:bold; color:${formCheck.allValid ? '#28a745':'#dc3545'}">${formCheck.allValid ? '«по форме»':'«не по форме»'}</span></div>
        <div style="background: #121316; border-radius: 6px; padding: 10px; margin-bottom: 15px; text-align: left;">${formReportHtml}</div>

        <div style="font-size: 15px; margin-bottom: 12px; border-top: 1px solid #2c2d30; padding-top: 10px; text-align: left;">
            <div style="text-align: center; margin-bottom: 5px;">Проверка хронологии возраста:</div>
            <div style="background: #121316; border-radius: 6px; padding: 8px; font-size: 13px;">
                ${ageStatusHtml}
            </div>
        </div>

        <div style="font-size: 14px; color: #a5a6a9; margin-bottom: 5px;">Слов: <b>${finalCount}</b> (всего: ${originalCount}, вычет: 15)</div>
        <div style="font-weight: bold; color: ${isWordsOk ? '#28a745' : '#dc3545'};">${isWordsOk ? 'Объем слов в норме' : (finalCount > 600 ? 'Превышение лимита!' : 'Недостаточно слов!')}</div>

        <div style="border-top: 1px solid #2c2d30; margin-top: 10px; padding-top: 10px; font-size: 15px;">
            <b>Статистика грамотности:</b><br>
            <div style="margin: 10px 0; text-align: left; display: inline-block;">
                • Орфография: <b style="color: ${orthoErrors > 10 ? '#dc3545' : '#28a745'}">${orthoErrors}</b> (Допустимо: 5-10)<br>
                • Пунктуация: <b style="color: ${punctErrors > 15 ? '#dc3545' : '#28a745'}">${punctErrors}</b> (Допустимо: 10-15)<br>
                • Грамматика: <b style="color: ${grammarErrors > 8 ? '#dc3545' : '#28a745'}">${grammarErrors}</b> (Допустимо: до 8)
            </div>
        </div>`;

    if (quickReplyForm) quickReplyForm.parentNode.insertBefore(widget, quickReplyForm);
    else { const mc = document.querySelector('.p-body-content .p-body-pageContent'); if (mc) mc.appendChild(widget); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', analyzeBiography); else analyzeBiography();

  const UNACCСEPT_PREFIX = 4;
  const ACCСEPT_PREFIX = 8;
  const RESHENO_PREFIX = 6;
  const PINN_PREFIX = 2;
  const GA_PREFIX = 12;
  const COMMAND_PREFIX = 10;
  const WATCHED_PREFIX = 9;
  const CLOSE_PREFIX = 7;
  const SPECY_PREFIX = 11;
  const TEXY_PREFIX = 13;
  const OTKAZBIO_PREFIX = 4;
  const ODOBRENOBIO_PREFIX = 8;
  const NARASSMOTRENIIBIO_PREFIX = 2;
  const OTKAZRP_PREFIX = 4;
  const ODOBRENORP_PREFIX = 8;
  const NARASSMOTRENIIRP_PREFIX = 2;
  const OTKAZORG_PREFIX = 4;
  const ODOBRENOORG_PREFIX = 8;
  const NARASSMOTRENIIORG_PREFIX = 2;

  const buttons = [
    {
      title: `Отказано, закрыто`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE]<br><br>`+
               `[CENTER][color=red]Отказано, закрыто.[/CENTER][/color]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
	  title: `Приветствие`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE]<br><br>`+
		       `[CENTER] ваш текст [/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
     title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила Role Play процесса ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    },
    {
      title: `Нонрп поведение`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.01[/COLOR]. Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=Red]| Jail 30 минут [/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Уход от РП`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.02[/COLOR]. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=Red]| Jail 30 минут / Warn[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Нонрп вождение`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.03[/color]. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=Red]| Jail 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Аморал действия`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.08[/color]. Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=Red]| Jail 30 минут / Warn[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `РК`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
      `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.14[/color]. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=Red]| Jail 30 минут[/color][/CENTER]<br><br>` +
      `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `ТК`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.15[/color]. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=Red]| Jail 60 минут / Warn[/color] ([Color=Orange]за два и более убийства[/color])[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
        prefix: ACCСEPT_PREFIX,
        status: false,
    },
    {
      title: `СК`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.16[/color]. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=Red]| Jail 60 минут / Warn[/color] ([Color=Orange]за два и более убийства[/color]).[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
        prefix: ACCСEPT_PREFIX,
        status: false,
    },
    {
      title: `ПГ`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.17[/color]. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=Red]| Jail 30 минут[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
        prefix: ACCСEPT_PREFIX,
        status: false,
    },
    {
      title: `MG`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.18[/color]. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=Red]| Mute 30 минут[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Масс дм`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по пункту правил:<br> [Color=Red]2.20[/color]. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=Red]| Warn / Ban 3 - 7 дней[/color]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Реклама сторонние ресурсы`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.31[/color]. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=Red]| Ban 7 дней / PermBan[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Обман адм`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.32[/color]. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=Red]| Ban 7 - 15 дней[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Уяз.правил`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.33[/color]. Запрещено пользоваться уязвимостью правил [Color=Red]| Ban 15 дней / Permban[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Уход от наказания`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.34[/color]. Запрещен уход от наказания [Color=Red]| Ban 15 - 30 дней[/color]([Color=Orange]суммируется к общему наказанию дополнительно[/color])[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Не возврат долга`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.57[/color]. Запрещается брать в долг игровые ценности и не возвращать их [Color=Red]| Ban 30 дней / Pemban[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Арест/Задержание`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.50[/color]. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях, в интерьере аукциона, казино, а также во время системных мероприятий [Color=Red]| Warn / Ban 10 дней[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `ООС Угрозы`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.37[/color]. Запрещены OOC угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации [Color=Red]| Mute 120 минут / Ban 7-15 дней [/color]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Злоуп наказаниями`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.39[/color]. Злоупотребление нарушениями правил сервера [Color=Red]| Ban 7 - 15 дней [/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Оск проекта`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.40[/color]. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=Red]| Mute 300 минут / Ban 30 дней[/color] ([Color=Cyan]Ban выдается по согласованию с главным администратором[/color])[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Продажа промо`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.43[/color]. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=Red]| Mute 120 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `ЕПП Фура`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.47[/color]. Запрещено передвигаться по полям на рабочем грузовом транспорте, если это не обусловлено игровым процессом данной работы [Color=Red]| Jail 60 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Покупка фам.репы`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.48[/color]. Продажа или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи. [Color=Red]| Обнуление рейтинга семьи / Обнуление игрового аккаунта лидера семьи[/color]<br><br>` +
        `[CENTER][Color=Orange]Примечание[/color]: скрытие информации о продаже репутации семьи приравнивается к [Color=Red]пункту правил 2.24.[/color][/CENTER]<br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Помеха РП процессу`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.04[/color]. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы [Color=Red]| Ban 10 дней[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Нонрп акс`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.52[/color]. Запрещено неадекватное использование аксессуаров: их неестественное расположение (создающее непристойные образы) или чрезмерное увеличение размера, мешающее игровому процессу (огромные объекты, закрывающие персонажа) [Color=Red]| Обнуление аксессуаров / обнуление аксессуаров + JAIL 30 минут (при повторном нарушении)[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `2.53(Названия маты)`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.53[/color]. Запрещено устанавливать названия для внутриигровых ценностей (семей, бизнесов, компаний и др.) с использованием нецензурной лексики, оскорблений, слов политической или религиозной направленности. [Color=Red]| Принудительная смена названия / Ban 1 день / При повторном нарушении обнуление[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Оск/Неуваж адм`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.54[/color]. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации в любом из чатов [Color=Red]| Mute 180 / 300 минут (при повторном нарушении)[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Багоюз аним`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.55[/color]. Запрещается багоюз связанный с анимацией в любых проявлениях. [Color=Red]| Jail 120 минут [/color]<br>` +
        `[Color=red]Примечание:[/color] наказание применяется в случаях, когда, используя ошибку, игрок получает преимущество перед другими игроками.<br>` +
        `[Color=red]Пример:[/color] если игрок, используя баг, убирает ограничение на использование оружия в зелёной зоне, сбивает темп стрельбы или быстро перемещается используя баг анимации.<br>` +
        `[Color=red]Исключение:[/color] разрешается использование сбива темпа стрельбы в войне за бизнес при согласии обеих сторон и с предварительным уведомлением следящего администратора в соответствующей беседе.<br>` +
        `[Color=red]Исключение:[/color] на семейных активностях (например, захват завода, фермы Гарели и т. п.), а также в зонах криминальной активности допускается сбив анимации стрельбы.<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Игровые чаты ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    },
    {
      title: `Транслит`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.20[/color]. Запрещено использование транслита в любом из чатов [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Оскорбление в IC`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.24[/color]. Запрещено токсичное поведение в IC чате направленное на унижение чести и достоинства личности игрока. В частности, запрещены оскорбления, затрагивающие половую принадлежность, физические или речевые особенности, в том числе в завуалированной форме [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Мат в вип чат`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил: [COLOR=Red]3.23[/COLOR]. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [COLOR=Red]| Mute 30 минут[/COLOR].<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Оскорбление в OOC`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.03[/color]. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Флуд`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.05[/color]. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=Red]| Mute 30 минут[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Злоуп знаками`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.06[/color]. Запрещено злоупотребление знаков препинания и прочих символов [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Слив СМИ`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.08[/color]. Запрещены любые формы «слива» посредством использования глобальных чатов [Color=Red]| PermBan[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]` ,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Выдача себя за адм `,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.10[/color]. Запрещена выдача себя за администратора, если игрок таковым не являетется [Color=Red]| Ban 7 - 15 + ЧС Сервера[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Ввод в заблуждение`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.11[/color]. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=Red]| Ban 15 - 30 дней / PermBan[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: `Репорт Капс + Оффтоп + Транслит`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.12[/color]. Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) [Color=Red]| Report Mute 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
     {
      title: `Музыка в войс`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.14[/color]. Запрещено включать музыку в Voice Chat [Color=Red]| Mute 60 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Изменение голоса в войс`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.19[/color]. Запрещено использование сторонних программ для изменения голоса [Color=Red]| Mute 60 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Шум в войс`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.16[/color]. Запрещено создавать посторонние шумы или звуки [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Оск Нации и Религии`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.18[/color]. Запрещены споры, конфликты, обсуждения и пропаганда на основе политических, религиозных, расовых, национальных идей, а также провокация игроков к коллективному флуду и токсичным беспорядкам в любом из чатов [Color=Red]| Mute 180 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Реклама промо`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.21[/color]. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=Red]| Ban 15 дней[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Торговля на тт госс`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.22[/color]. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=Red]| Mute 30 минут[/color][/CENTER]<br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Нарушение правил казино╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    },
    {
      title: `Продажа должности`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [B][COLOR=rgb(255, 0, 0)]2.01.[/COLOR] Владельцу и менеджерам казино и ночного клуба [COLOR=rgb(255, 0, 0)][U]запрещено[/U][/COLOR] принимать работников за денежные средства на должность охранника, крупье или механика.[COLOR=rgb(255, 0, 0)] | Ban 3 - 5 дней.[/COLOR][/B]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Положение об игровых аккаунтах ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    },
    {
      title: `Мультиаккаунт (3+)`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]4.04[/color]. Разрешается зарегистрировать максимально только три игровых аккаунта на сервере [Color=Red]| PermBan[/color].<br><br>` +
        `[Color=Orange]Примечание[/color]: блокировке подлежат все аккаунты созданные после третьего твинка.[/CENTER]<br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Фейк аккаунт`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]4.10[/color]. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=Red]| Устное замечание + смена игрового никнейма / PermBan[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Переадресация жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    },
    {
      title: `Жалобу на сотрудника`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/CENTER]<br><br>`+
        `[CENTER]Вы ошиблись с разделом. Обратитесь в раздел жалобы на сотрудников.[/CENTER]<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Жалобу на лидера`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/CENTER]<br><br>`+
        `[CENTER]Вы ошиблись с разделом. Обратитесь в раздел жалобы на лидеров.[/CENTER]<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
     title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила Государственных Структур╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    },
    {
      title: `Н/П/Р/О (Объявы)`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пунтку правил:<br> [Color=Red]4.01[/color]. Запрещено редактирование объявлений, не соответствующих ПРО [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Нон рп ГОСС`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пунтку правил:<br> [Color=Red]6.03[/color]. Запрещено nRP поведение | Warn [Color=Red]| Warn[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Розыск без причины(ГИБДД/МВД/ФСБ)`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пунтку правил:<br> [Color=Red]6.02[/color]. Запрещено выдавать розыск без Role Play причины [Color=Red]| Warn[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Редактирование в личных целях`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
       `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]4.04.[/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=Red]|  Ban 7 дней + ЧС организации[/color][CENTER]<br><br>` +
       `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
       prefix: ACCСEPT_PREFIX,
       status: false,
    },
    {
     title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила ОПГ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    },
    {
      title: `Нарушение правил В/Ч`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пунтку правил: За нарушение правил нападения на [Color=Orange]Войсковую Часть[/color] выдаётся предупреждение [Color=Red]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Нападение на В/Ч через стену`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пунтку правил: Нападение на [Color=Orange]военную часть[/color] разрешено только через блокпост КПП с последовательностью взлома [Color=Red]| Warn NonRP В/Ч[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Похищение/Ограбления нарушение правил`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан за Нонрп Ограбление\Похищениее в соответствии с этими правилами [URL=https://forum.blackrussia.online/threads/Правила-ограблений-и-похищений.29/]Кликабельно[/URL][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отсутствие пунка жалоб╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    },
    {
      title: `В жалобы на адм`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Вы ошиблись разделом. Обратитесь в раздел [Color=Red]Жалобы на администрацию[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `В обжалования`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Вы ошиблись разделом. Обратитесь в раздел [Color=Red]Обжалование наказаний[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Жалоба не по форме`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Ваша жалоба составлена не по форме. Убедительная просьба ознакомиться [Color=Red]с правилами подачи жалоб на игроков[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Таймкоды больше 3 мин`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Ваша жалоба отказана, т.к в ней нету таймкодов.<br>Если видео длится больше 3-ех минут Вы должны указать таймкоды нарушений.[/CENTER]<br><br>` +
        `[Color=Red][CENTER]Отказано[/CENTER][/color]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Более 72 часов`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][B][I][FONT=georgia]С момента нарушения игроком правил серверов прошло более 72 часов[/CENTER]<br>` +
        `[CENTER][B][I][FONT=georgia]Рассмотрению не подлежит.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Доква через запрет соц сети`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][B][I][FONT=georgia]3.6. Прикрепление доказательств обязательно. <br>` +
        `[Color=Orange]Примечание[/color]: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Нету условий сделки`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][B][I][FONT=georgia]В данных доказательствах отсутствуют условия сделки[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Нужен фрапс`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][B][I][FONT=georgia]В таких случаях нужнен фрапс[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Недостаточно докв`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Недостаточно доказательств на нарушение от данного игрока. Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Доква отредактированы`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][B][I][FONT=georgia]Ваши докозательства отредактированы.[/CENTER]<br>` +
        `[CENTER][B][I][FONT=georgia]Какие либо линии, чёрточки, обводка, ускорение, замедление, обрезка экрана.[/CENTER]<br>` +
        `[CENTER][B][I][FONT=georgia]Всё вышеперечисленное является редактированием доказательств.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `От 3-го лица`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][B][I][FONT=georgia]Жалобы от 3-их лиц не принимаются[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Ответный ДМ`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][B][I][FONT=georgia]В случае ответного ДМ нужен видиозапись. Пересоздайте тему и прекрепите видиозапись.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Фотохостинги`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Доказательства должны быть загружены на Yapx/Imgur/YouTube.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
     title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП биографии╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    },
    {
      title: `био одобрено`,
      content: `[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>` +
        `[CENTER]Ваша РП биография получает статус: [Color=Lime]Одобрено.[/I][/CENTER][/color][/FONT]` +
        `[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]`,
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
    },
    {
      title: `Био отказ (фото)`,
      content: `[Color=rgb(255, 0, 0)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>` +
        `[CENTER][B][I][FONT=georgia]В биографии должны присутствовать фотографии или иные материалы относящиеся к истории персонажа.[/CENTER]<br>` +
        `[CENTER][Color=rgb(255, 0, 0)]Отказано[/CENTER][/color]`,
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: `Био отказ (не по форме)`,
      content: `[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>` +
        `[CENTER]Ваша РП биография получает статус:  [color=red]Отказано.[/color]<br>Причиной отказа могло послужить заполнение биографии не по форме. Ознакомьтесь с правилами подачи.[/CENTER]`,
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: `Био отказ (лишние пункты)`,
      content: `[Color=rgb(222, 0, 0)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>` +
        `[CENTER]В биографии присутствуют лишние пунты. Ознакомьтесь с правилами подачи.[/CENTER]<br>` +
        `[Color=rgb(222, 0, 0)][FONT=Georgia][CENTER][I]Отказано.[/CENTER]`,
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: `КОПИПАСТА`,
      content: `[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>` +
        `[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к вы ее скопировали у другого человека. [/COLOR]<br><br>` +
       `[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]`,
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: `био отказ(заголовок темы)`,
      content: `[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>` +
        `[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить неправильное заполнение загловка темы. Ознакомьтесь с правилам подачи .[/CENTER][/FONT]`,
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: `био отказ(1е лицо)`,
      content: `[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>` +
        `[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить создание биографии от 1го лица.[/CENTER][/FONT]`,
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: `био отказ(Ошибки)`,
      content: `[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>` +
        `[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить большое количество грамматических ошибок.[/CENTER][/FONT]`,
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: `био отказ(Возраст и Дата)`,
      content: `[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>` +
        `[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить несовпадение возраста и даты рождения.[/CENTER][/FONT]`,
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: `био отказ(18 лет)`,
      content: `[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>` +
        `[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина отказа: минимальный возраст для составления биографии: 18 лет.[/CENTER][/FONT]`,
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: `био отказ(200-600)`,
      content: `[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>` +
        `[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Минимальный объём RP биографии — 200 слов, максимальный — 600.[/CENTER][/FONT]`,
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
     title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП ситуации╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    },
    {
      title: `РП ситуация одобрено`,
      content: `[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>` +
        `[CENTER]Ваша РП ситуация получает статус: [Color=Lime]Одобрено.[/I][/CENTER][/color][/FONT]` +
        `[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]`,
      prefix: ODOBRENORP_PREFIX,
      status: false,
    },
    {
      title: `РП ситуация на дороботке`,
      content: `[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>` +
        `[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение вашей РП ситуации[/CENTER]`,
      prefix: NARASSMOTRENIIRP_PREFIX,
      status: false,
    },
    {
      title: `РП ситуация отказ`,
      content: `[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>` +
        `[CENTER]Ваша РП ситуация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из Правила RP ситуаций[/CENTER][/FONT]`,
      prefix: OTKAZRP_PREFIX,
      status: false,
    },
    {
     title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    },
    {
      title: `Неофициальная Орг Одобрено`,
      content: `[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>` +
        `[CENTER]Ваша РП ситуация получает статус: [Color=Lime]Одобрено.[/I][/CENTER][/color][/FONT]` +
        `[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]`,
      prefix: ODOBRENOORG_PREFIX,
      status: false,
    },
    {
      title: `Неофициальная Орг на дороботке`,
      content: `[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>` +
        `[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение вашей Неофициальная Орг[/CENTER]`,
      prefix: NARASSMOTRENIIORG_PREFIX,
      status: false,
    },
    {
      title: `Неофициальная Орг отказ`,
      content: `[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>` +
        `[CENTER]Ваша РП ситуация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из Правила создания неофициальной RolePlay организации.[/CENTER][/FONT]`,
      prefix: OTKAZORG_PREFIX,
      status: false,
    },
    {
      title: `Неофициальная Орг запроси активности`,
      content: `[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>` +
        `[CENTER][B][I][FONT=georgia]Ваша неофициальная РП организация может быть закрыта по пункту правил: Неактив в топике организации более недели, он закрывается. Прекрипите отчёт о активности организации в виде скриншотов. Через 24 часа если отчёта не будет или он будет некорректный организация будет закрыта.[/CENTER]`,
      prefix: PINN_PREFIX,
      status: false,
    },
    {
      title: `Неофициальная Орг закрытие активности`,
      content: `[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>` +
        `[CENTER][B][I][FONT=georgia]Активность небыла предоставлена. Организация закрыта.[/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
  ];

  let buttons2 = [
    {
      title: `На рассмотрении`,
      content: `Ваша жалоба находится на рассмотрении.<br><br>`+
        `Прикрепите доп. фрапс со следующими действиями в этой теме:<br>` +
        `1. Включите фрапс<br>`+
        `2. Пропишите /time<br>`+
        `3. Загрузите транспортное средство которое вам передал игрок<br>`+
        `4. Покажите что в автомобиле нету тех опций которые были указаны в условиях сделки<br>`+
        `5. Выключите фрапс<br>`+
        `6. Загрузите фрапс на один из рабочих видеохостингов<br><br>`+
        `У вас есть 24 часа на предоставление видео доказательства`,
      prefix: PINN_PREFIX,
      status: true,
    },
    { title: `Главному куратору Форума`, content: ``, prefix: NARASSMOTRENIIBIO_PREFIX, status: true },
    { title: `Техническому специалисту`, content: ``, prefix: TEXY_PREFIX, status: true },
    {
      title: `NonRP Обман`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.05[/color]. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=Red]| Ban 15 - 30 дней / PermBan[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Оск/Упом родни`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.04[/color]. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=Red]| Mute 300 минут / Ban 7 дней[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Слив склада`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.09[/color]. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=Red]| Ban 15 - 30 дней / PermBan[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `ДМ`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
      `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.19[/color]. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=Red]| Jail 90 минут[/color].[/CENTER]<br><br>` +
      `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Стороннее ПО`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
      `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.22[/color]. Запрещено хранить / использовать / распространять стороннее программное обеспечение или иные средства, позволяющие получить преимущество над другими игроками, включая макросы (в том числе с эмуляторов) [Color=Red]| Ban 15 - 30 дней / Permban[/color][/CENTER]<br><br>` +
      `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `ДБ`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.13[/color]. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=Red]| Jail 60 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Нарушений не найдено`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушений со стороны данного игрока не было найдено.[/CENTER]<br><br>` +
        `[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Нелогир Чат/Действие`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нам не удалось подтвердить нарушение со стороны игрока.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Дублирование темы`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Дублирование темы. Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Нет /time`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]На ваших доказательствах отсутствует /time.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Неполный фрапс`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][B][I][FONT=georgia]Фрапс обрывается. Загрузите полный фрапс на ютуб.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `Не работают доква`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Не работают доказательства[/CENTER]<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: `CapsLook`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.02[/color]. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
   ];

  // ============================================================
  //             ОСНОВНАЯ ИНФРАСТРУКТУРА СКРИПТА
  // ============================================================

  function groznyButtonKind(id, name = '') {
    const value = `${id} ${name}`.toLowerCase();
    if (/otkaz|закры|нарушений|дубликат|нет \/time|неполный|не работают|нелогир/.test(value)) return 'red';
    if (/pin|рассмотр|гкф|теху|texy/.test(value)) return 'orange';
    if (/prefix|префикс/.test(value)) return 'yellow';
    if (/selectanswer|ответ/.test(value)) return 'orange';
    if (/одобр|принят/.test(value)) return 'green';
    return 'blue';
  }

  function addButton(name, id) {
    if (document.getElementById(id)) return;
    $('.button--icon--reply').before(
        `<button type="button" class="button ripple grozny-answer-btn" data-kind="${groznyButtonKind(id, name)}" id="${id}">${name}</button>`
    );
  }

  function buttonsMarkup(buttons) {
    return `<div class="grozny-answer-grid">${buttons.map((btn, i) => {
      const title = String(btn.title || '');
      if (!btn.content && /╴/.test(title)) return `<div class="grozny-section">${title.replace(/╴/g, '').trim()}</div>`;
      return `<button id="answers-${i}" class="grozny-choice" data-kind="${groznyButtonKind(`answer-${i}`, title)}"><span class="button-text">${title}</span></button>`;
    }).join('')}</div>`;
  }

  function pasteContent(id, data = {}, send = false) {
    if (!buttons[id]) return;
    const template = Handlebars.compile(buttons[id].content || '');
    // Полная очистка поля ввода перед вставкой нового ответа
    $(`div.fr-element.fr-view`).empty();
    $(`span.fr-placeholder`).empty();
    $(`div.fr-element.fr-view`).append(`<p>${template(data)}</p>`);
    $(`a.overlay-titleCloser`).trigger(`click`);

    if (send === true) {
      editThreadData(buttons[id].prefix, buttons[id].status);
      $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
    }
  }

  function pasteContent2(id, data = {}, send = false) {
    if (!buttons2[id]) return;
    const template = Handlebars.compile(buttons2[id].content || '');
    // Полная очистка поля ввода перед вставкой нового ответа
    $(`div.fr-element.fr-view`).empty();
    $(`span.fr-placeholder`).empty();
    $(`div.fr-element.fr-view`).append(`<p>${template(data)}</p>`);
    $(`a.overlay-titleCloser`).trigger(`click`);

    if (send === true) {
      editThreadData(buttons2[id].prefix, buttons2[id].status);
      $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
    }
  }

  function getThreadData() {
    const $author = $(`a.username`).first();
    const hours = new Date().getHours();

    const greeting =
      4 < hours && hours <= 11 ? `Доброе утро` :
      11 < hours && hours <= 15 ? `Добрый день` :
      15 < hours && hours <= 21 ? `Добрый вечер` :
      `Доброй ночи`;

    if (!$author.length) {
      return { user: { id: '', name: '', mention: '' }, greeting: () => greeting };
    }
    const authorID = $author.attr('data-user-id') || '';
    const authorName = $author.html() || '';
    return {
      user: {
        id: authorID,
        name: authorName,
        mention: `[USER=${authorID}]${authorName}[/USER]`,
      },
      greeting: () => greeting,
    };
  }

  // === ОДИН запрос — одна перезагрузка. Убрано дублирование. ===
  function editThreadData(prefix, pin = false) {
    const titleEl = document.querySelector('.p-title-value');
    if (!titleEl || !titleEl.lastChild) return;
    const threadTitle = titleEl.lastChild.textContent;

    const payload = {
      prefix_id: prefix,
      title: threadTitle,
      _xfToken: XF.config.csrf,
      _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
      _xfWithData: 1,
      _xfResponseType: `json`,
    };
    if (pin === true) payload.pin = 1;

    fetch(`${document.URL}edit`, {
      method: `POST`,
      body: getFormData(payload),
    }).then(() => location.reload());
  }

  function moveThread(prefix, type) {
    const titleEl = document.querySelector('.p-title-value');
    if (!titleEl || !titleEl.lastChild) return;
    const threadTitle = titleEl.lastChild.textContent;

    fetch(`${document.URL}move`, {
      method: `POST`,
      body: getFormData({
        prefix_id: prefix,
        title: threadTitle,
        target_node_id: type,
        redirect_type: `none`,
        notify_watchers: 1,
        starter_alert: 1,
        starter_alert_reason: 1,
        _xfToken: XF.config.csrf,
        _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
        _xfWithData: 1,
        _xfResponseType: `json`,
      }),
    }).then(() => location.reload());
  }

  function getFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(i => formData.append(i[0], i[1]));
    return formData;
  }

  // === Создание модалки префиксов (без изменений) ===
  function openPrefixModal() {
    if (document.getElementById('prefixModalOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'prefixModalOverlay';

    const modal = document.createElement('div');
    modal.className = 'grozny-modal';

    const header = document.createElement('div');
    header.className = 'grozny-modal-header';
    header.innerHTML = '<h2 class="grozny-modal-title">Выберите префикс</h2><button id="closeGroznyModal" class="grozny-modal-close" type="button">&times;</button>';
    modal.appendChild(header);

    const body = document.createElement('div');
    body.className = 'grozny-modal-body';
    const container = document.createElement('div');
    container.className = 'grozny-prefix-grid';

    const prefixes = [
      { name: 'На рассмотрении', id: 2, pin: true, color: '#FF9800' },
      { name: 'Одобрено', id: 8, pin: false, color: '#4CAF50' },
      { name: 'Отказано', id: 4, pin: false, color: '#D32F2F' },
      { name: 'Закрыто', id: 7, pin: false, color: '#D32F2F' },
      { name: 'Решено', id: 6, pin: false, color: '#4CAF50' },
      { name: 'Главному администратору', id: 12, pin: true, color: '#e74c3c' },
      { name: 'Тех. специалисту', id: 13, pin: true, color: '#0D47A1' },
      { name: 'Команда проекта', id: 10, pin: true, color: '#FFEB3B' },
      { name: 'Специальному администратору', id: 11, pin: true, color: '#DB2309' }
    ];

    for (let i = 0; i < prefixes.length; i++) {
      const p = prefixes[i];
      const btn = document.createElement('button');
      btn.textContent = p.name;
      btn.className = 'grozny-prefix-btn';
      btn.dataset.pin = String(p.pin);

      if (p.color) {
        btn.style.setProperty('border-color', p.color, 'important');
        btn.style.setProperty('color', p.color, 'important');
      }

      btn.onclick = (function (prefixId, needPin) {
        return function () {
          overlay.remove();
          editThreadData(prefixId, needPin);
        };
      })(p.id, p.pin);

      container.appendChild(btn);
    }

    body.appendChild(container);
    modal.appendChild(body);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    document.getElementById('closeGroznyModal').onclick = () => overlay.remove();
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  }

  // === Открытие модалки выбора ответа ===
  function openAnswerModal(threadData) {
    if (document.getElementById('groznyAnswerOverlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'groznyAnswerOverlay';
    const modal = document.createElement('div');
    modal.className = 'grozny-modal';
    const header = document.createElement('div');
    header.className = 'grozny-modal-header';
    header.innerHTML = `<h2 class="grozny-modal-title">Выберите ответ</h2><button type="button" class="grozny-modal-close" id="closeGroznyAnswer">&times;</button>`;
    const body = document.createElement('div');
    body.className = 'grozny-modal-body';
    body.innerHTML = buttonsMarkup(buttons);
    modal.appendChild(header); modal.appendChild(body);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const closeModal = () => overlay.remove();
    document.getElementById('closeGroznyAnswer').onclick = closeModal;
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

    buttons.forEach((btn, id) => {
      if (!btn.content) return;
      const el = document.getElementById(`answers-${id}`);
      if (!el) return;
      el.addEventListener('click', () => { closeModal(); pasteContent(id, threadData, id > 0); });
    });
  }

  // === Инициализация кнопок тулбара с ретраем ===
  let ensureTimer = null;
  function ensureToolbarButtons() {
    if (!$('.button--icon--reply').length) {
      ensureTimer = setTimeout(ensureToolbarButtons, 400);
      return;
    }

    // Основные кнопки панели
    addButton(`На рассмотрении`, `pin`);
    addButton(`ГКФу`, `gkf`);
    addButton(`Теху`, `texy`);
    addButton(`NonRP Обман`, `obman`);
    addButton(`Оск/Упом родни`, `rodn`);
    addButton(`Слив склада`, `slivskl`);
    addButton(`ДМ`, `dm`);
    addButton(`ДБ`, `db`);
    addButton(`Стороннее ПО`, `soft`);
    addButton(`CapsLook`, `caps`);
    addButton(`Нарушений нет`, `otkazano`);
    addButton(`Нелогир Чат/Действие`, `malo`);
    addButton(`Дубликат`, `dublikat`);
    addButton(`Нет /time`, `time`);
    addButton(`Неполный фрапс`, `fraps`);
    addButton(`Не работают док-ва`, `opra`);
    addButton(`Нажми`, `selectAnswer`);

    if (!document.getElementById('groznyCustomPrefixBtn')) {
      $('.button--icon--reply').before(
          `<button type="button" class="button ripple grozny-answer-btn" id="groznyCustomPrefixBtn" data-kind="yellow">ПРЕФИКСЫ</button>`
      );
    }
  }

  // === Точка входа ===
  $(document).ready(() => {
    if (!window.Handlebars) {
      $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);
    }

    ensureToolbarButtons();

    const threadData = getThreadData();

    // Привязка кнопок панели (с .off() чтобы избежать двойных подписок)
    const bindings = [
      ['pin',        0],  ['gkf',        1],  ['texy',       2],
      ['obman',      3],  ['rodn',       4],  ['slivskl',    5],
      ['dm',         6],  ['soft',       7],  ['db',         8],
      ['otkazano',   9],  ['malo',      10],  ['dublikat',  11],
      ['time',      12],  ['fraps',     13],  ['opra',      14],
      ['caps',      15],
    ];
    bindings.forEach(([id, idx]) => {
      $(`button#${id}`).off('click').on('click', () => pasteContent2(idx, threadData, true));
    });

    // Кнопка "Нажми" — модалка выбора ответа
    $(`button#selectAnswer`).off('click').on('click', () => openAnswerModal(threadData));

    // Кнопка префиксов — бронебойный обработчик
    $(document).off('click', '#groznyCustomPrefixBtn').on('click', '#groznyCustomPrefixBtn', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openPrefixModal();
    });
  });
})();
