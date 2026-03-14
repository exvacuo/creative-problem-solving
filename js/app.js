/* ═══════════════════════════════════════════════════════════════
   SafeSpace Stealth Calculator — App Logic
   ═══════════════════════════════════════════════════════════════
   
   Provides optional demo interactivity for the calculator screen.
   The secret trigger: press π three times then = to unlock.
   
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

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
  updateDisplay();

})();
