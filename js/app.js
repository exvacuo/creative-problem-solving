/* ═══════════════════════════════════════════════════════════════
   SafeSpace Stealth Calculator — App Logic
   ═══════════════════════════════════════════════════════════════
   
   Provides optional demo interactivity for the calculator screen.
   The secret trigger: press π three times then = to unlock.
   
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Global Emergency Exit Logic ──────────────────────────────
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') window.location.href = 'https://www.google.com';
  });
  document.addEventListener('click', function(e) {
    const fab = e.target.closest('.emergency-fab');
    if (fab) {
      e.preventDefault();
      window.location.href = 'https://www.google.com';
    }
  });

  // ── State ──────────────────────────────────────────────────
  let display = '0';
  let expression = '';
  let piCount = 0;
  const SECRET_PI_COUNT = 3;

  const resultEl = document.getElementById('result');
  const exprEl = document.getElementById('expression');
  const piBtn = document.getElementById('pi-btn');
  const equalsBtn = document.getElementById('equals-btn');
  const clearBtn = document.getElementById('clear-btn');

  if (!resultEl) return; // Not on calculator page

  // ── Helpers ────────────────────────────────────────────────
  function updateDisplay() {
    resultEl.textContent = display;
    exprEl.textContent = expression;
    // Shrink font if number is long
    resultEl.classList.toggle('small', display.length > 9);
  }

  function appendToDisplay(val) {
    if (display === '0' && val !== '.') {
      display = val;
    } else {
      display += val;
    }
    expression += val;
    updateDisplay();
  }

  // ── Button handlers ────────────────────────────────────────
  // Number and operator buttons
  document.querySelectorAll('.calc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.textContent.trim();

      // Skip special buttons (handled separately)
      if (btn.id === 'clear-btn' || btn.id === 'equals-btn') return;
      if (text === '±' || text === '%') {
        // Simple visual toggle
        if (text === '±' && display !== '0') {
          display = display.startsWith('-') ? display.slice(1) : '-' + display;
          updateDisplay();
        }
        return;
      }

      // Reset pi count for non-pi presses
      piCount = 0;

      appendToDisplay(text);
    });
  });

  // Scientific buttons
  document.querySelectorAll('.calc-sci-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.val;

      if (val === 'π') {
        piCount++;
        // Flash animation
        btn.classList.remove('pi-flash');
        void btn.offsetWidth; // Force reflow
        btn.classList.add('pi-flash');

        // Visual feedback: show pi count
        if (piCount <= SECRET_PI_COUNT) {
          display = 'π'.repeat(piCount);
          expression = display;
          updateDisplay();
        }
        return;
      }

      // Reset pi count for non-pi presses
      piCount = 0;
      appendToDisplay(val);
    });
  });

  // Clear button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      display = '0';
      expression = '';
      piCount = 0;
      updateDisplay();
    });
  }

  // Equals button — check for secret trigger
  if (equalsBtn) {
    equalsBtn.addEventListener('click', () => {
      if (piCount >= SECRET_PI_COUNT) {
        // SECRET TRIGGER ACTIVATED!
        display = '▓▓▓';
        expression = 'π π π =';
        updateDisplay();

        // Brief delay then redirect
        setTimeout(() => {
          window.location.href = 'trigger.html';
        }, 600);
        return;
      }

      // Normal equals — just show as evaluated (cosmetic)
      piCount = 0;
      try {
        // Replace display operators with JS operators for eval
        let evalStr = expression
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/−/g, '-')
          .replace(/π/g, Math.PI.toString())
          .replace(/e(?![xv])/g, Math.E.toString());

        // Basic safety — only allow math-like expressions
        if (/^[\d\s+\-*/().%eπ]+$/.test(evalStr.replace(/\d+\.?\d*/g, ''))) {
          const result = Function('"use strict"; return (' + evalStr + ')')();
          display = parseFloat(result.toPrecision(10)).toString();
        }
      } catch (e) {
        display = 'Error';
      }
      expression = '';
      updateDisplay();
    });
  }

  // ── Initial display ────────────────────────────────────────
  if (resultEl) updateDisplay();

  // ── Sub-Page Initializations ────────────────────────────────
  
  // Initialize F7 Main View to enable routing, if it hasn't been initialized
  function initMainView() {
    if (window.app && window.app.views && !window.app.views.main) {
      const viewEl = document.querySelector('.view-main');
      if (viewEl) {
        window.app.views.create('.view-main', {
          url: window.location.pathname
        });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMainView);
  } else {
    initMainView();
  }

  document.addEventListener('page:init', function (e) {
    const page = e.detail;
    const app = window.app || (page && page.app); // framework7 app instance
    if (!app) return;

    if (page.name === 'resource-finder') {
      initResourceFinder(app, page);
    } else if (page.name === 'peer-support') {
      initPeerSupport(app, page);
    } else if (page.name === 'professional-help') {
      initProfessionalHelp(app, page);
    }
  });

  function initResourceFinder(app, page) {
    const resources = [
        { name: 'Haven Shelter Network', location: 'London, UK', desc: 'Emergency accommodation and 24/7 crisis support for women and children fleeing abuse.', details: 'Haven provides safe housing for up to 90 days, including meals, counselling referrals, and legal support coordination. Capacity: 42 beds. Languages: English, Arabic, Spanish.\n\nHotline: 0800 123 4567 (24/7, free)' },
        { name: 'Community Legal Aid Centre', location: 'Manchester, UK', desc: 'Free legal advice on protective orders, divorce, custody, and housing rights for abuse survivors.', details: 'Staffed by volunteer solicitors and barristers. Same-day appointments available for emergency situations. No means testing required for DV cases.\n\nBook: legal@clac.example.org' },
        { name: 'National Domestic Abuse Helpline', location: 'Nationwide (UK)', desc: 'Confidential telephone and online chat support, 7 days a week, 365 days a year.', details: 'All calls are free and will not appear on your itemised phone bill. Trained advisors available 24 hours. Also offers BSL video relay.\n\nPhone: 0808 2000 247' }
    ];

    const icons = ['house_fill', 'building_2_fill', 'phone_fill'];
    const colors = ['#3b82f6', '#8b5cf6', '#10b981'];
    const bgColors = ['rgba(59,130,246,0.2)', 'rgba(139,92,246,0.2)', 'rgba(16,185,129,0.2)'];

    const ul = page.el.querySelector('#resource-list');
    if (ul) {
      ul.innerHTML = '';
      resources.forEach((r, i) => {
        const icon = icons[i % icons.length];
        const color = colors[i % colors.length];
        const bgColor = bgColors[i % bgColors.length];
        
        ul.innerHTML += `
          <li>
            <a href="#" class="item-link item-content resource-item" data-index="${i}">
              <div class="item-media">
                <div style="width:40px; height:40px; border-radius:8px; background:${bgColor}; display:flex; align-items:center; justify-content:center;">
                  <i class="f7-icons" style="font-size:20px; color:${color};">${icon}</i>
                </div>
              </div>
              <div class="item-inner">
                <div class="item-title-row">
                  <div class="item-title" style="color:var(--safe-text); font-weight:600;">${r.name}</div>
                  <div class="item-after" style="color:var(--safe-accent); font-size:14px;">${r.location}</div>
                </div>
                <div class="item-text" style="color:var(--safe-text-dim); height:auto;">${r.desc}</div>
              </div>
            </a>
          </li>`;
      });

      // Bind clicks
      page.el.querySelectorAll('.resource-item').forEach(el => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          const r = resources[parseInt(el.dataset.index)];
          const popupHTML = `
            <div class="popup" style="background:var(--safe-surface);">
              <div class="page dark-support">
                <div class="navbar" style="background:transparent;">
                  <div class="navbar-bg" style="background:transparent;"></div>
                  <div class="navbar-inner">
                    <div class="left"></div>
                    <div class="title" style="color:var(--safe-text);">${r.name}</div>
                    <div class="right" style="margin-right:8px;">
                      <a href="#" class="link popup-close" style="color:var(--safe-danger); padding:0;">
                        <i class="f7-icons" style="font-size:24px; font-weight:bold;">xmark</i>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="page-content" style="padding: 24px; color:var(--safe-text);">
                  <h3 style="margin-top:0; color:var(--safe-primary);">${r.location}</h3>
                  <p style="white-space: pre-line; line-height: 1.6; color:var(--safe-text-dim);">${r.details}</p>
                </div>
              </div>
            </div>`;
          app.popup.create({ content: popupHTML, swipeToClose: true }).open();
        });
      });
    }

    // Initialize F7 Searchbar
    var searchbarEl = page.el.querySelector('.searchbar');
    if (searchbarEl) {
      app.searchbar.create({
        el: searchbarEl,
        searchContainer: page.el.querySelector('.search-list'),
        searchIn: '.item-title, .item-text',
      });
    }
  }

  function initPeerSupport(app, page) {
    const $$ = Framework7.$;
    // Init Messages
    var messagesEl = page.el.querySelector('.messages');
    var messages = null;
    if (messagesEl) {
      messages = app.messages.create({
        el: messagesEl,
        firstMessageRule: function (message, previousMessage, nextMessage) {
          if (message.isTitle) return false;
          if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name) return true;
          return false;
        },
        lastMessageRule: function (message, previousMessage, nextMessage) {
          if (message.isTitle) return false;
          if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
          return false;
        },
        tailMessageRule: function (message, previousMessage, nextMessage) {
          if (message.isTitle) return false;
          if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
          return false;
        }
      });
    }

    // Init Messagebar
    var messagebarEl = page.el.querySelector('.messagebar');
    var messagebar = null;
    if (messagebarEl) {
      messagebar = app.messagebar.create({
        el: messagebarEl
      });
    }

    const replies = [
        "Thank you for reaching out. What you're feeling is valid. Would you like to share more about what's happening?",
        "I hear you, and I want you to know you're not alone. Take your time — I'm here.",
        "That sounds incredibly difficult. You've shown real courage by speaking up. How can I support you right now?",
        "Your safety is the most important thing. Would it be helpful if I shared some local resources with you?",
    ];
    let replyIndex = 0;

    // Handle Send Event
    $$(page.el).find('.send-link').on('click', function () {
      if (!messagebar || !messages) return;
      var text = messagebar.getValue().replace(/\n/g, '<br>').trim();
      if (!text.length) return;

      messagebar.clear();
      messagebar.focus();

      // Add user message
      messages.addMessage({
        text: text,
        type: 'sent',
      });

      // Simulate bot reply
      setTimeout(function () {
        messages.showTyping({
          header: 'Volunteer is typing',
          avatar: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E"
        });

        setTimeout(function () {
          const replyText = replies[replyIndex % replies.length];
          replyIndex++;
          messages.addMessage({
            text: replyText,
            type: 'received',
            name: 'Volunteer',
            avatar: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E"
          });
          messages.hideTyping();
        }, 1200);
      }, 500);
    });
  }

  function initProfessionalHelp(app, page) {
    const counselors = [
      { name: 'Dr. Amara Khan', title: 'Licensed Trauma Counselor', desc: 'Specialises in trauma-informed care, PTSD recovery, and emotional resilience for survivors of domestic abuse.', initials: 'AK', color1: '#7c6acf', color2: '#56cfe1', status: 'Online' },
      { name: 'Marcus Reid', title: 'Legal Advisor & Advocate', desc: 'Provides confidential legal guidance on protective orders, housing rights, custody, and emergency legal pathways.', initials: 'MR', color1: '#56cfe1', color2: '#7c6acf', status: 'Online' }
    ];

    const ul = page.el.querySelector('#counselor-list');
    if (ul) {
      ul.innerHTML = '';
      counselors.forEach((c, i) => {
        ul.innerHTML += `
          <li>
            <a href="#" class="item-link item-content pro-item" data-index="${i}">
              <div class="item-media">
                <div style="width:44px; height:44px; border-radius: 22px; background: linear-gradient(135deg, ${c.color1}, ${c.color2}); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:bold; font-size:18px;">
                  ${c.initials}
                </div>
              </div>
              <div class="item-inner">
                <div class="item-title-row">
                  <div class="item-title" style="color:var(--safe-text); font-weight:600;">${c.name}</div>
                  <div class="item-after"><span class="badge color-green">${c.status}</span></div>
                </div>
                <div class="item-subtitle" style="color:var(--safe-primary); font-size:13px;">${c.title}</div>
                <div class="item-text" style="color:var(--safe-text-dim);">${c.desc}</div>
              </div>
            </a>
          </li>
        `;
      });

      page.el.querySelectorAll('.pro-item').forEach(el => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          const i = parseInt(el.closest('.pro-item').dataset.index);
          const sessionId = Math.random().toString(36).substring(2, 8).toUpperCase();
          const popupHTML = `
            <div class="popup" style="background:var(--safe-surface); display:flex; flex-direction:column; justify-content:center;">
              <div class="page dark-support" style="background:transparent;">
                <div class="navbar" style="background:transparent;">
                  <div class="navbar-bg" style="background:transparent;"></div>
                  <div class="navbar-inner">
                    <div class="left"></div>
                    <div class="title"></div>
                    <div class="right" style="margin-right:8px;">
                      <a href="#" class="link popup-close" style="color:var(--safe-danger); padding:0;">
                        <i class="f7-icons" style="font-size:24px; font-weight:bold;">xmark</i>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="page-content" style="padding: 32px; color:var(--safe-text); text-align:center; display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%;">
                  <div style="width:64px; height:64px; background:rgba(6,214,160,0.15); border-radius:32px; display:flex; align-items:center; justify-content:center; margin-bottom:24px;">
                    <i class="f7-icons" style="font-size:32px; color:var(--safe-success);">checkmark_shield_fill</i>
                  </div>
                  <h3 style="font-size:22px; font-weight:700; margin-bottom:12px; margin-top:0;">Request Received</h3>
                  <p style="color:var(--safe-text-dim); line-height:1.6; margin-bottom:12px; font-size:15px;">Your secure consultation request with <strong>${counselors[i].name}</strong> has been received.</p>
                  <p style="color:var(--safe-text-dim); line-height:1.6; margin-bottom:24px; font-size:15px;">A confidential session link has been generated and will be shared via your chosen secure channel.</p>
                  
                  <div style="background:rgba(124,106,207,0.15); border-radius:16px; padding:16px 24px; color:var(--safe-primary); font-weight:600; font-family: monospace; font-size:16px;">
                    🔒 Session ID: SS-${sessionId}
                  </div>
                </div>
              </div>
            </div>`;
          app.popup.create({ content: popupHTML, swipeToClose: true }).open();
        });
      });
    }
  }

})();
