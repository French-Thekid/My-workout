/* ---------------- TOAST ---------------- */
let toastTimer;
function toast(title, sub) {
  const el = document.getElementById('toast');
  document.getElementById('toast-icon').innerHTML = `<span style="color:hsl(var(--success))">${icon('trophy', 20)}</span>`;
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-sub').textContent = sub || '';
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

/* ---------------- PROGRESS RING ---------------- */
function ringSVG(progress, size, stroke, color) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const off = c - Math.min(Math.max(progress, 0), 1) * c;
    
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(-90deg); display:block;">
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="hsl(var(--muted))" stroke-width="${stroke}"/>
      <circle id="today-ring-circle" cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round"
        stroke-dasharray="${c}" stroke-dashoffset="${off}" 
        style="transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1);"/>
    </svg>`;
  }
  
  function ringWithLabel(progress, size, stroke, color) {
    return `<div class="ring-container" style="width:${size}px; height:${size}px;">
      ${ringSVG(progress, size, stroke, color)}
      <span class="ring-label" id="today-ring-text" style="color:${color}; font-size:${Math.round(size * 0.28)}px;">
        ${Math.round(progress * 100)}
      </span>
    </div>`;
  }

/* ---------------- REST TIMER ---------------- */
let timerInt = null;
function openTimer() {
  let remaining = 90;
  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.id = 'timer-ov';

  function tpl() {
    const mins = pad(Math.floor(remaining / 60));
    const secs = pad(remaining % 60);
    const danger = remaining <= 5 && remaining > 0;
    const done = remaining === 0;

    return `<div style="width:100%;max-width:360px;text-align:center">
      <div class="eyebrow" style="margin-bottom:16px;display:flex;justify-content:center;gap:8px;align-items:center">${icon('flame', 16)} ${done ? 'Back to it' : 'Rest'}</div>
      <div class="timer-num ${danger ? 'danger pop' : ''} ${done ? 'done' : ''}">${done ? 'GO' : mins + ':' + secs}</div>
      <div class="timer-actions">
        <button class="btn-ghost" id="add10">${icon('plus', 20)} 10s</button>
        <button class="btn-primary" id="skip">${icon('x', 20)} ${done ? 'Close' : 'Skip'}</button>
      </div></div>`;
  }

  function redraw() {
    ov.innerHTML = tpl();
    ov.querySelector('#add10').onclick = () => { remaining += 10; redraw(); };
    ov.querySelector('#skip').onclick = close;
  }

  function close() {
    clearInterval(timerInt);
    ov.remove();
  }

  redraw();
  document.body.appendChild(ov);
  timerInt = setInterval(() => {
    if (remaining <= 1) {
      remaining = 0;
      clearInterval(timerInt);
      try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (e) {}
      redraw();
      return;
    }
    remaining--;
    redraw();
  }, 1000);
}

/* ---------------- NAV ---------------- */
let currentTab = 'today';
const TABS = [
  { id: 'today', icon: 'dumbbell', label: 'Today' },
  { id: 'week', icon: 'calendar', label: 'Week' },
  { id: 'history', icon: 'flame', label: 'History' },
  { id: 'settings', icon: 'settings', label: 'Settings' },
];

function renderNav() {
  document.getElementById('nav').innerHTML = TABS.map(t => `
    <button class="nav-btn ${t.id === currentTab ? 'active' : ''}" onclick="switchTab('${t.id}')">
      <span class="bar"></span>${icon(t.icon, 22)}<span class="lbl">${t.label}</span>
    </button>`).join('');
}

function switchTab(id) {
  currentTab = id;
  renderNav();
  render();
  window.scrollTo(0, 0);
}
