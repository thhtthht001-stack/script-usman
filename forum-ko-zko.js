// ==UserScript==
// @name         Ответы КО-ЗКО
// @name:ru      Ответы КО-ЗКО
// @description  Специально для BlackRussia
// @version      4.6.1
// @namespace    https://forum.blackrussia.online
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @match        https://forum.blackrussia.online/forums/*
// @include      https://forum.blackrussia.online/forums/
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  /* ================== GROZNY SERIOUS / MODERN ANIMATED UI ================== */
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

      .grozny-answer-btn,
      .grozny-modal,
      .grozny-choice,
      .grozny-prefix-btn{
        -webkit-font-smoothing:antialiased!important;
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
        left:50%!important; top:50%!important;
        width:0!important; height:0!important;
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
      .grozny-answer-btn:hover::after{ width:150px!important; height:150px!important; }
      .grozny-answer-btn:active{ transform:translateY(0) scale(.98)!important; }

      .grozny-answer-btn[data-kind="blue"]{border-color:var(--gz-blue)!important}
      .grozny-answer-btn[data-kind="green"]{border-color:var(--gz-green)!important}
      .grozny-answer-btn[data-kind="red"]{border-color:var(--gz-red)!important}
      .grozny-answer-btn[data-kind="orange"]{border-color:var(--gz-orange)!important}
      .grozny-answer-btn[data-kind="yellow"]{border-color:var(--gz-yellow)!important}

      #selectAnswer.grozny-answer-btn{
        border-color:var(--gz-orange)!important;
        background:#35322e!important;
      }
      #groznyCustomPrefixBtn.grozny-answer-btn{ border-color:var(--gz-yellow)!important; }

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
        width:31px!important; height:31px!important;
        border:0!important; border-radius:7px!important;
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

  /* ============================ ПРЕФИКСЫ ============================ */
  const UNACCEPT_PREFIX   = 4;
  const ACCEPT_PREFIX     = 8;
  const RESHENO_PREFIX    = 6;
  const PINN_PREFIX       = 2;
  const GA_PREFIX         = 12;
  const COMMAND_PREFIX    = 10;
  const WATCHED_PREFIX    = 9;
  const CLOSE_PREFIX      = 7;
  const SPECY_PREFIX      = 11;
  const TECH_PREFIX       = 13;

  // G — открывает приветствие и открывает Arial + центр для основного текста
  // E — закрывает Arial + центр
  const G = `[CENTER][SIZE=4][FONT=georgia][B][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый [/COLOR][COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/B][/FONT][/SIZE][/CENTER]<br><br>[CENTER][FONT=arial]`;
  const E = `[/FONT][/CENTER]`;

  const buttons = [
    { title: `Жалобы на администрацию` },
    {
      title: `Проведена работа`,
      content:
        G +
        `[B]С администратором будет проведена необходимая работа. Спасибо за обращение.<br><br>` +
        `[COLOR=rgb(0, 200, 83)]Одобрено.[/COLOR][/B]` + E,
      prefix: ACCEPT_PREFIX, status: false,
    },
    {
      title: `Проведена работа + снятие наказания`,
      content:
        G +
        `[B]С администратором будет проведена необходимая работа. Ваше наказание будет снято в ближайшее время, если еще не снято. Приносим извинения за предоставленные неудобства.<br><br>` +
        `[COLOR=rgb(0, 200, 83)]Одобрено.[/COLOR][/B]` + E,
      prefix: ACCEPT_PREFIX, status: false,
    },
    {
      title: `Меры приняты`,
      content:
        G +
        `[B]К администратору будут приняты необходимые меры. Спасибо за обращение.<br><br>` +
        `[COLOR=rgb(0, 200, 83)]Одобрено.[/COLOR][/B]` + E,
      prefix: ACCEPT_PREFIX, status: false,
    },
    {
      title: `Меры приняты + снятие наказания`,
      content:
        G +
        `[B]К администратору будут приняты необходимые меры. Ваше наказание будет снято в ближайшее время, если еще не снято. Приносим извинения за предоставленные неудобства.<br><br>` +
        `[COLOR=rgb(0, 200, 83)]Одобрено.[/COLOR][/B]` + E,
      prefix: ACCEPT_PREFIX, status: false,
    },
    {
      title: `Наказание по ошибке`,
      content:
        G +
        `[B]Наказание было выдано по ошибке и будет снято в ближайшее время. Приносим извинения за предоставленные неудобства.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Администратор снят`,
      content:
        G +
        `[B]Администратор снят/ушел со своего поста.<br><br>` +
        `[COLOR=rgb(0, 200, 83)]Одобрено.[/COLOR][/B]` + E,
      prefix: ACCEPT_PREFIX, status: false,
    },
    {
      title: `На рассмотрении (запрос док-вы)`,
      content:
        G +
        `[B]Запросил доказательства у администратора.<br><br>` +
        `[COLOR=rgb(255, 140, 0)]Ожидайте ответа.[/COLOR][/B]` + E,
      prefix: PINN_PREFIX, status: true,
    },
    {
      title: `На рассмотрении`,
      content:
        G +
        `[B]Ваша жалоба взята на рассмотрение.<br><br>` +
        `[COLOR=rgb(255, 140, 0)]Ожидайте ответа.[/COLOR][/B]` + E,
      prefix: PINN_PREFIX, status: true,
    },
    {
      title: `Наказание верное`,
      content:
        G +
        `[B]Проверив доказательства администратора, было принято решение, что наказание выдано верно.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `ЖБ не по форме`,
      content:
        G +
        `[B]Ваша жалоба составлена [COLOR=rgb(255, 140, 0)]не по форме[/COLOR]. Ознакомьтесь с правилами подачи жалоб → [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-администрацию.3429349/']*Кликабельно*[/URL]<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Дубликат`,
      content:
        G +
        `[B]Ответ вам был дан в предыдущей теме. За дальнейшее [COLOR=rgb(255, 140, 0)]дублирование тем[/COLOR] ваш форумный аккаунт будет заблокирован.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Жалоба уже на рассмотрении`,
      content:
        G +
        `[B]Подобная жалоба уже находится [COLOR=rgb(255, 140, 0)]на рассмотрении[/COLOR]. За дальнейшее дублирование тем ваш форумный аккаунт будет заблокирован.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Неадекват в ЖБ`,
      content:
        G +
        `[B]Ваша жалоба составлена в [COLOR=rgb(255, 140, 0)]неадекватном формате[/COLOR]. Рассмотрению не подлежит.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Нет /myreports`,
      content:
        G +
        `[B]В вашей жалобе отсутствует [COLOR=rgb(255, 140, 0)]/myreports[/COLOR]. Прикрепите скриншот и подайте обращение заново.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Странная ссылка в док-в`,
      content:
        G +
        `[B]Предоставленная ссылка на доказательства вызывает подозрения и может быть [COLOR=rgb(255, 140, 0)]небезопасной[/COLOR] для перехода. Рекомендуем загрузить материалы на более надежные и известные фото- и видеохостинги, такие как Imgur, Япикс или YouTube.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Не достал/починил`,
      content:
        G +
        `[B]В рамках RolePlay администратор [COLOR=rgb(255, 140, 0)]не предоставляет услуги[/COLOR] по извлечению автомобиля из воды или его ремонту. Для выхода из ситуации вы можете воспользоваться доступными способами: вызвать такси, сесть на автобус или обратиться за помощью к другим игрокам.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `ЖБ от 3 лица`,
      content:
        G +
        `[B]Жалоба составлена от [COLOR=rgb(255, 140, 0)]3-го лица[/COLOR]. Рассмотрению не подлежит.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Прошло 48 часов`,
      content:
        G +
        `[B]С момента выдачи наказания прошло более [COLOR=rgb(255, 140, 0)]48-ми часов[/COLOR]. В следующий при возникновении подобных ситуаций подавайте жалобы заранее.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Жалоба не подлежит рассмотрению.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Не по теме`,
      content:
        G +
        `[B]Ваше обращение [COLOR=rgb(255, 140, 0)]никаким образом не относится[/COLOR] к предназначению данного раздела. Пожалуйста, ознакомьтесь с его предназначением.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Нет нарушений`,
      content:
        G +
        `[B]Нарушения со стороны администратора [COLOR=rgb(0, 200, 83)]отсутствуют[/COLOR].<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Док-ва из соц. сетей`,
      content:
        G +
        `[B]Доказательства из [COLOR=rgb(255, 140, 0)]социальных сетей не принимаются[/COLOR]. Загрузите материалы на фото- и видеохостинги, такие как Imgur, Япикс или YouTube.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Нет окна бана`,
      content:
        G +
        `[B]В вашей жалобе отсутствует [COLOR=rgb(255, 140, 0)]окно блокировки аккаунта[/COLOR]. Создайте новую тему и прикрепите его.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Не рабочие док-ва`,
      content:
        G +
        `[B]В вашей жалобе [COLOR=rgb(255, 140, 0)]нерабочие доказательства[/COLOR]. Загрузите их повторно на фото/видео хостинг и создайте новое обращение.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Нужен фрапс`,
      content:
        G +
        `[B]В данном случае нужна [COLOR=rgb(255, 140, 0)]видеофиксация (фрапс)[/COLOR], где будет полностью видна ситуация.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Док-ва обрываются`,
      content:
        G +
        `[B]Ваши доказательства [COLOR=rgb(255, 140, 0)]обрываются[/COLOR]. Дальнейшее рассмотрение жалобы не представляется возможным.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Док-ва отредактированы`,
      content:
        G +
        `[B]Представленные доказательства были подвергнуты [COLOR=rgb(255, 140, 0)]редактированию[/COLOR].<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Подобные жалобы рассмотрению не подлежат.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Док-ва в плохом качестве`,
      content:
        G +
        `[B]Создайте новое обращение, прикрепив доказательства в [COLOR=rgb(255, 140, 0)]более хорошем качестве[/COLOR].<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Нет строки выдачи`,
      content:
        G +
        `[B]В ваших доказательствах отсутствует [COLOR=rgb(255, 140, 0)]строка выдачи наказания[/COLOR] от Администратора, следовательно жалоба не подлежит рассмотрению.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B]` + E,
      prefix: UNACCEPT_PREFIX, status: false,
    },
    {
      title: `Мало док-в`,
      content:
        G +
        `[B][COLOR=rgb(255, 140, 0)]Недостаточно доказательств[/COLOR], которые могут подтвердить нарушение администратора.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B]` + E,
      prefix: UNACCEPT_PREFIX, status: false,
    },
    {
      title: `Нет /time`,
      content:
        G +
        `[B]В предоставленных доказательствах отсутствует [COLOR=rgb(25, 0, 255)]/time[/COLOR]. Рассмотрению не подлежит.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Нет док-в в ЖБ`,
      content:
        G +
        `[B]В вашей жалобе отсутствуют [COLOR=rgb(255, 140, 0)]доказательства[/COLOR] для её рассмотрения. Загрузите их на фото/видео хостинг и создайте новое обращение.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },

    { title: `Переадресация` },
    {
      title: `Жалобу в адм раздел`,
      content:
        G +
        `[B]Внимательно ознакомившись с вашей жалобой было принято решение, что вам нужно обратиться в [COLOR=rgb(255, 0, 0)]раздел жалоб на Администрацию[/COLOR].<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `В раздел ОБЖ`,
      content:
        G +
        `[B]Внимательно ознакомившись с вашей жалобой было принято решение, что вам нужно обратиться в [COLOR=rgb(255, 140, 0)]раздел Обжалование[/COLOR].<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `В раздел жалоб на игроков`,
      content:
        G +
        `[B]Внимательно ознакомившись с вашей жалобой было принято решение, что вам нужно обратиться в [COLOR=rgb(255, 140, 0)]раздел жалоб на игроков[/COLOR].<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `В раздел жалоб на лидеров`,
      content:
        G +
        `[B]Внимательно ознакомившись с вашей жалобой было принято решение, что вам нужно обратиться в [COLOR=rgb(255, 140, 0)]раздел жалоб на лидеров[/COLOR].<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Жалоба на теха`,
      content:
        G +
        `[B]Внимательно ознакомившись с вашей жалобой было принято решение, что вам нужно обратиться в [COLOR=rgb(255, 140, 0)]раздел жалоб на технических специалистов[/COLOR].<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Передать ЗГА`,
      content:
        G +
        `[B]Ваша жалоба передана [COLOR=rgb(255, 0, 0)]Основному Заместителю Главного Администратора[/COLOR].<br><br>` +
        `[COLOR=rgb(255, 140, 0)]На рассмотрении.[/COLOR][/B]` + E,
      prefix: PINN_PREFIX, status: true,
    },
    {
      title: `Передать ГА`,
      content:
        G +
        `[B]Ваша жалоба летит на рассмотрение [COLOR=rgb(255, 0, 0)]Главному Администратору[/COLOR].<br><br>` +
        `[COLOR=rgb(255, 140, 0)]На рассмотрении.[/COLOR][/B]` + E,
      prefix: GA_PREFIX, status: true,
    },
    {
      title: `Спец. Админ`,
      content:
        G +
        `[B]Ваша жалоба передана [COLOR=rgb(255, 0, 0)]Специальной Администрации[/COLOR].<br><br>` +
        `[COLOR=rgb(255, 140, 0)]На рассмотрении.[/COLOR][/B]` + E,
      prefix: SPECY_PREFIX, status: true,
    },
    {
      title: `Рук. модер`,
      content:
        G +
        `[B]Ваша жалоба передана [COLOR=rgb(0, 26, 255)]Руководству модерации[/COLOR].<br><br>` +
        `[COLOR=rgb(255, 140, 0)]На рассмотрении.[/COLOR][/B]` + E,
      prefix: COMMAND_PREFIX, status: true,
    },

    { title: `Жалобы на лидеров` },
    {
      title: `Не по форме`,
      content:
        G +
        `[B]Ваша жалоба составлена [COLOR=rgb(255, 140, 0)]не по форме[/COLOR]. Ознакомьтесь с правилами подачи жалоб на лидеров.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Нету нарушений от лидера`,
      content:
        G +
        `[B]Нарушений со стороный лидера нету.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B]` + E,
      prefix: UNACCEPT_PREFIX, status: false,
    },
    {
      title: `Запрос док-вы у лидера`,
      content:
        G +
        `[B]Запросил доказательства у лидера.<br><br>` +
        `[COLOR=rgb(255, 140, 0)]На рассмотрении.[/COLOR][/B]` + E,
      prefix: PINN_PREFIX, status: false,
    },
    {
      title: `Лидер предоставил док-ву`,
      content:
        G +
        `[B]Лидер предоставил доказательства, наказание выдано верно.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `С лидером будет проведена беседа`,
      content:
        G +
        `[B]С лидером будет проведена профилактическая беседа.<br><br>` +
        `[COLOR=rgb(0, 200, 83)]Одобрено.[/COLOR][/B]` + E,
      prefix: ACCEPT_PREFIX, status: false,
    },
    {
      title: `Лидер ранее ушёл/снят`,
      content:
        G +
        `[B]Лидер снят/ушёл со своего поста.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Переадресация в гос раздел`,
      content:
        G +
        `[B]Обратитесь в госсударственный раздел где вас уволили.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: CLOSE_PREFIX, status: false,
    },
    {
      title: `Лидер будет наказан`,
      content:
        G +
        `[B]Лидеру было выдано соответствующее наказание.<br><br>` +
        `[COLOR=rgb(0, 200, 83)]Одобрено.[/COLOR][/B]` + E,
      prefix: ACCEPT_PREFIX, status: false,
    },
    {
      title: `Игрок будет восстановлен на свою должность`,
      content:
        G +
        `[B]Вы будете восстановлены на должность, приносим свои извинения.<br><br>` +
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B]` + E,
      prefix: ACCEPT_PREFIX, status: false,
    },
    {
      title: `С лидером будет проведена строгая беседа`,
      content:
        G +
        `[B]С лидером была проведена строгая беседа.<br><br>` +
        `[COLOR=rgb(0, 200, 83)]Одобрено.[/COLOR][/B]` + E,
      prefix: ACCEPT_PREFIX, status: false,
    },
  ];

  /* ============================ КОНФИГ БЫСТРЫХ КНОПОК ============================ */
  const QUICK_BUTTONS = [
    { id: 'quickAccept',   title: 'Одобрено',           type: 'prefix',   prefixId: ACCEPT_PREFIX,   pin: false, kind: 'green'  },
    { id: 'quickUnaccept', title: 'Отказано',           type: 'prefix',   prefixId: UNACCEPT_PREFIX, pin: false, kind: 'red'    },
    { id: 'quickClose',    title: 'Закрыто',            type: 'prefix',   prefixId: CLOSE_PREFIX,    pin: false, kind: 'red'    },
    { id: 'quickPin',      title: 'На рассмотрении',    type: 'prefix',   prefixId: PINN_PREFIX,     pin: true,  kind: 'orange' },

    { id: 'quickDubl',     title: 'Дубликат',           type: 'template', templateTitle: 'Дубликат',         kind: 'red'    },
    { id: 'quickForm',     title: 'Не по форме',        type: 'template', templateTitle: 'ЖБ не по форме',   kind: 'red'    },
    { id: 'quickTime',     title: 'Нет /time',          type: 'template', templateTitle: 'Нет /time',        kind: 'red'    },
    { id: 'quickVernoe',   title: 'Наказание верное',   type: 'template', templateTitle: 'Наказание верное', kind: 'red'    },
  ];

  /* ============================ ИНФРАСТРУКТУРА ============================ */

  function groznyButtonKind(id, name = '') {
    const value = `${id} ${name}`.toLowerCase();
    if (/отказ|закры|нарушени|дубликат|нет\s*\/time|неполн|не работают|нелогир|неадекват|не по форме|обрыв|отредакт|плох|мало док|странн|не достал|3 лица|48 часов|не по теме|нет ссылк|соц\.\s*сет|нет окна|нет строки|нет нарушен|нет док/.test(value)) return 'red';
    if (/pin|рассмотр|передать|зга|га|спец|рук\. модер/.test(value)) return 'orange';
    if (/префикс|prefix/.test(value)) return 'yellow';
    if (/ответ|selectanswer/.test(value)) return 'orange';
    if (/одобр|принят|сократить|снять|снят|проведена|меры/.test(value)) return 'green';
    return 'blue';
  }

  function addButton(name, id, kind) {
    if (document.getElementById(id)) return;
    const k = kind || groznyButtonKind(id, name);
    $('.button--icon--reply').before(
      `<button type="button" class="button ripple grozny-answer-btn" data-kind="${k}" id="${id}">${name}</button>`
    );
  }

  function findTemplateIndex(title) {
    return buttons.findIndex(b => b.title === title && b.content);
  }

  function buttonsMarkup(buttons) {
    return `<div class="grozny-answer-grid">${buttons.map((btn, i) => {
      const title = String(btn.title || '');
      if (!btn.content) return `<div class="grozny-section">${title}</div>`;
      return `<button id="answers-${i}" class="grozny-choice" data-kind="${groznyButtonKind(`answer-${i}`, title)}"><span class="button-text">${title}</span></button>`;
    }).join('')}</div>`;
  }

  function ensureHandlebars() {
    if (window.Handlebars) return Promise.resolve(window.Handlebars);
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-grozny-handlebars]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.Handlebars));
        existing.addEventListener('error', reject);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js';
      script.dataset.groznyHandlebars = '1';
      script.onload = () => resolve(window.Handlebars);
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  function pasteContent(id, data = {}, send = false) {
    const btn = buttons[id];
    if (!btn || !btn.content) return;

    ensureHandlebars().then((Handlebars) => {
      const template = Handlebars.compile(btn.content);
      $('div.fr-element.fr-view').empty();
      $('span.fr-placeholder').empty();
      $('div.fr-element.fr-view').append(`<p>${template(data)}</p>`);
      $('a.overlay-titleCloser').trigger('click');

      if (send === true && btn.prefix !== undefined) {
        editThreadData(btn.prefix, btn.status);
        $('.button--icon.button--icon--reply.rippleButton').trigger('click');
      }
    }).catch(() => {
      alert('Не удалось загрузить Handlebars. Проверьте подключение к интернету.');
    });
  }

  function getThreadData() {
    const $author = $('a.username').first();
    const greeting = 'Доброго времени суток';

    if (!$author.length) {
      return { user: { id: '', name: '', mention: '' }, greeting };
    }
    const authorID = $author.attr('data-user-id') || '';
    const authorName = $author.html() || '';
    return {
      user: {
        id: authorID,
        name: authorName,
        mention: `[USER=${authorID}]${authorName}[/USER]`,
      },
      greeting,
    };
  }

  function threadEditUrl() {
    const base = (XF && XF.config && XF.config.url && XF.config.url.fullBase) || location.origin;
    const relative = location.href.split(base)[1] || location.pathname;
    const clean = relative.endsWith('/') ? relative.slice(0, -1) : relative;
    return `${base}${clean}/edit`;
  }

  function threadMoveUrl() {
    const base = (XF && XF.config && XF.config.url && XF.config.url.fullBase) || location.origin;
    const relative = location.href.split(base)[1] || location.pathname;
    const clean = relative.endsWith('/') ? relative.slice(0, -1) : relative;
    return `${base}${clean}/move`;
  }

  function editThreadData(prefix, pin = false) {
    const titleEl = document.querySelector('.p-title-value');
    if (!titleEl || !titleEl.lastChild) return;
    const threadTitle = titleEl.lastChild.textContent;

    const payload = {
      prefix_id: prefix,
      title: threadTitle,
      _xfToken: XF.config.csrf,
      _xfRequestUri: (() => {
        const base = XF.config.url.fullBase;
        const rel = document.URL.split(base)[1] || location.pathname;
        return rel.endsWith('/') ? rel.slice(0, -1) + '/' : rel;
      })(),
      _xfWithData: 1,
      _xfResponseType: 'json',
    };
    if (pin === true) payload.pin = 1;

    fetch(threadEditUrl(), {
      method: 'POST',
      body: getFormData(payload),
    }).then(() => location.reload());
  }

  function moveThread(prefix, type) {
    const titleEl = document.querySelector('.p-title-value');
    if (!titleEl || !titleEl.lastChild) return;
    const threadTitle = titleEl.lastChild.textContent;

    fetch(threadMoveUrl(), {
      method: 'POST',
      body: getFormData({
        prefix_id: prefix,
        title: threadTitle,
        target_node_id: type,
        redirect_type: 'none',
        notify_watchers: 1,
        starter_alert: 1,
        starter_alert_reason: 1,
        _xfToken: XF.config.csrf,
        _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
        _xfWithData: 1,
        _xfResponseType: 'json',
      }),
    }).then(() => location.reload());
  }

  function getFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(i => formData.append(i[0], i[1]));
    return formData;
  }

  /* ============================ МОДАЛКА ПРЕФИКСОВ ============================ */
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
      { name: 'На рассмотрении', id: PINN_PREFIX,    pin: true,  color: '#FF9800' },
      { name: 'Одобрено',        id: ACCEPT_PREFIX,  pin: false, color: '#4CAF50' },
      { name: 'Отказано',        id: UNACCEPT_PREFIX,pin: false, color: '#D32F2F' },
      { name: 'Закрыто',         id: CLOSE_PREFIX,   pin: false, color: '#D32F2F' },
      { name: 'Решено',          id: RESHENO_PREFIX, pin: false, color: '#4CAF50' },
      { name: 'Главному администратору', id: GA_PREFIX,     pin: true, color: '#e74c3c' },
      { name: 'Тех. специалисту', id: TECH_PREFIX,          pin: true, color: '#0D47A1' },
      { name: 'Команда проекта',  id: COMMAND_PREFIX,       pin: true, color: '#FFEB3B' },
      { name: 'Специальному администратору', id: SPECY_PREFIX, pin: true, color: '#DB2309' },
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

  /* ============================ МОДАЛКА ОТВЕТОВ ============================ */
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
    modal.appendChild(header);
    modal.appendChild(body);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const closeModal = () => overlay.remove();
    document.getElementById('closeGroznyAnswer').onclick = closeModal;
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

    buttons.forEach((btn, id) => {
      if (!btn.content) return;
      const el = document.getElementById(`answers-${id}`);
      if (!el) return;
      el.addEventListener('click', () => {
        closeModal();
        pasteContent(id, threadData, btn.prefix !== undefined);
      });
    });
  }

  /* ============================ ТУЛБАР ============================ */
  let ensureTimer = null;
  function ensureToolbarButtons() {
    if (!$('.button--icon--reply').length) {
      ensureTimer = setTimeout(ensureToolbarButtons, 400);
      return;
    }

    QUICK_BUTTONS.forEach(q => addButton(q.title, q.id, q.kind));

    if (!document.getElementById('groznyCustomPrefixBtn')) {
      $('.button--icon--reply').before(
        `<button type="button" class="button ripple grozny-answer-btn" id="groznyCustomPrefixBtn" data-kind="yellow">ПРЕФИКСЫ</button>`
      );
    }
    if (!document.getElementById('selectAnswer')) {
      $('.button--icon--reply').before(
        `<button type="button" class="button ripple grozny-answer-btn" id="selectAnswer" data-kind="orange">ОТВЕТЫ</button>`
      );
    }
  }

  /* ============================ ОБРАБОТЧИКИ БЫСТРЫХ КНОПОК ============================ */
  function bindQuickButtons() {
    QUICK_BUTTONS.forEach(q => {
      $(document).off('click', `#${q.id}`).on('click', `#${q.id}`, function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (q.type === 'prefix') {
          editThreadData(q.prefixId, !!q.pin);
          return;
        }

        if (q.type === 'template' || q.type === 'template-nosend') {
          const idx = findTemplateIndex(q.templateTitle);
          if (idx === -1) {
            alert(`Шаблон "${q.templateTitle}" не найден в массиве buttons`);
            return;
          }
          const data = getThreadData();
          const send = q.type === 'template';
          pasteContent(idx, data, send);
        }
      });
    });
  }

  /* ============================ ТОЧКА ВХОДА ============================ */
  $(document).ready(() => {
    // Предзагружаем Handlebars, чтобы к моменту клика он уже был готов.
    ensureHandlebars().catch(() => {});

    ensureToolbarButtons();
    bindQuickButtons();

    const threadData = getThreadData();

    $(document).off('click', '#selectAnswer').on('click', '#selectAnswer', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openAnswerModal(threadData);
    });

    $(document).off('click', '#groznyCustomPrefixBtn').on('click', '#groznyCustomPrefixBtn', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openPrefixModal();
    });
  });
})();
