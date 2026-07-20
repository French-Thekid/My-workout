/* ---------------- MAIN APP CONTROLLER ---------------- */

function render() {
    const v = document.getElementById('view');
    v.className = 'fade';
    if (currentTab === 'today') renderToday(v);
    else if (currentTab === 'week') renderWeek(v);
    else if (currentTab === 'history') renderHistory(v);
    else if (currentTab === 'settings') renderSettings(v);
    
    v.classList.remove('fade');
    void v.offsetWidth;
    v.classList.add('fade');
  }
  
  /* ---- TODAY ---- */
  let todaySession = null;
  let todayPrev = {};
  let saveTimer = null;
  let wasComplete = false;
  
  function persistToday() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => putSession(todaySession.date, todaySession), 400);
  }
  
  function updateProgress() {
    recompute(todaySession);
    const p = todaySession.total_count ? todaySession.completed_count / todaySession.total_count : 0;
    
    const circleEl = document.getElementById('today-ring-circle');
    const textEl = document.getElementById('today-ring-text');
    
    if (circleEl && textEl) {
      const size = 56;
      const stroke = 5;
      const r = (size - stroke) / 2;
      const c = 2 * Math.PI * r;
      const off = c - Math.min(Math.max(p, 0), 1) * c;
      
      // Smoothly update SVG circle offset & numeric text
      circleEl.style.strokeDashoffset = off;
      textEl.textContent = Math.round(p * 100);
    } else {
      // Fallback if the element wasn't rendered yet
      const ring = document.getElementById('today-ring');
      if (ring) ring.innerHTML = ringWithLabel(p, 56, 5, 'hsl(var(--primary))');
    }
  
    const cnt = document.getElementById('today-count');
    if (cnt) cnt.textContent = `${todaySession.completed_count} / ${todaySession.total_count} exercises done`;
    
    const banner = document.getElementById('complete-banner');
    if (banner) banner.style.display = todaySession.completed ? 'flex' : 'none';
    
    if (todaySession.completed && !wasComplete) {
      wasComplete = true;
      toast('Workout crushed!', 'Logged to your history. Great work.');
    }
    if (!todaySession.completed) wasComplete = false;
  }
  
  function summaryStr(prev) {
    if (!prev || !prev.sets.length) return null;
    return prev.sets.map(s => `${s.weight != null ? s.weight + 'kg' : '—'}×${s.reps != null ? s.reps : '—'}`).join('  ·  ');
  }
  
  function relDay(iso) {
    const then = new Date(iso + 'T00:00:00');
    const now = new Date();
    const days = Math.round((now.setHours(0, 0, 0, 0) - then.setHours(0, 0, 0, 0)) / 864e5);
    if (days <= 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 7) return days + 'd ago';
    return then.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  
  function renderToday(v) {
    const wd = weekdayIndex();
    const date = todayStr();
    const day = PLAN[wd];
    const saved = getSession(date);
    
    todaySession = (saved && saved.exercises && saved.exercises.length) ? saved : buildSession(wd, date);
    recompute(todaySession);
    wasComplete = todaySession.completed;
    todayPrev = getPrevious(date);
    
    const isRest = day.exercises.length === 0;
    const p = todaySession.total_count ? todaySession.completed_count / todaySession.total_count : 0;
  
    let html = `<div class="hero">
      <img src="${day.image}" alt="${day.title}"/><div class="ov"></div>
      <div class="top">
        <div><div class="eyebrow">${DAY_NAMES[wd]}</div><div class="muted" style="font-size:12px;margin-top:4px;font-weight:600">${day.focus}</div></div>
        ${isRest ? '' : `<div class="ring-wrap" id="today-ring">${ringWithLabel(p, 56, 5, 'hsl(var(--primary))')}</div>`}
      </div>
      <div class="bot"><h1 class="display">${day.title}</h1>
        ${isRest ? '' : `<div id="today-count" style="color:rgba(255,255,255,.8);font-size:14px;font-weight:600;margin-top:8px">${todaySession.completed_count} / ${todaySession.total_count} exercises done</div>`}
      </div>
    </div><div class="px" style="margin-top:24px">`;
  
    if (isRest) {
      html += `<div style="text-align:center;padding:64px 0" class="fade">
        <div style="color:hsl(var(--primary));display:flex;justify-content:center;margin-bottom:16px">${icon('flame', 48)}</div>
        <h2 class="display" style="font-size:36px;text-transform:uppercase">Rest Day</h2>
        <p class="muted" style="font-size:14px;margin-top:8px;max-width:280px;margin-left:auto;margin-right:auto">Muscles grow when you recover. Hydrate, stretch, and come back stronger tomorrow.</p>
      </div>`;
    } else {
      html += `<div id="complete-banner" class="banner" style="display:${todaySession.completed ? 'flex' : 'none'}">
        <span style="color:hsl(var(--success))">${icon('trophy', 24)}</span>
        <div><div class="t">Session Complete</div><div class="s">Nice — this counts toward your streak.</div></div></div>`;
      html += `<div class="stack" id="ex-list"></div>`;
    }
    html += `</div>`;
    v.innerHTML = html;
    if (!isRest) buildCards();
  }
  
  function buildCards() {
    const list = document.getElementById('ex-list');
    if (!list) return;
    list.innerHTML = ''; // <-- Clear existing cards so re-rendering doesn't duplicate them

    todaySession.exercises.forEach((exr, i) => {
      const el = document.createElement('div');
      if (exr.kind === 'break') {
        el.innerHTML = `<button class="breakbtn">${icon('timer', 16)} Start Rest Timer</button>`;
        el.querySelector('button').onclick = openTimer;
        list.appendChild(el);
        return;
      }
      const simple = exr.kind === 'cardio';
      const prev = todayPrev[exr.name];
      const summ = summaryStr(prev);
      
      // Set class states
      el.className = 'card' + (exr.skipped ? ' skipped' : exr.done ? ' done' : '');
      el.dataset.idx = i;
      
      // Card Header with Skip Toggle Button
      let inner = `
        <div class="ex-head" style="justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="color:${exr.skipped ? 'hsl(var(--muted-foreground))' : exr.done ? 'hsl(var(--success))' : 'hsl(var(--primary))'}">
              ${icon(simple ? 'waves' : 'dumbbell', 16)}
            </span>
            <div style="min-width:0"><div class="ex-name">${exr.name}</div></div>
          </div>
          <button class="skip-btn ${exr.skipped ? 'on' : ''}" type="button">
            ${exr.skipped ? 'Skipped' : 'Skip'}
          </button>
        </div>
        <div class="ex-target">${exr.target}</div>
      `;
  
      if (summ && !exr.skipped) {
        inner += `<div class="prev-hint">${icon('trendingUp', 14)}<span>Last ${relDay(prev.date)}: <span class="v">${summ}</span></span></div>`;
      }
  
      if (simple) {
        inner += `<button class="simplebtn ${exr.done && !exr.skipped ? 'on' : ''}" ${exr.skipped ? 'disabled' : ''}>
          ${icon('check', 20)} ${exr.skipped ? 'Skipped' : exr.done ? 'Completed' : 'Mark Done'}
        </button>`;
        el.innerHTML = inner;
  
        el.querySelector('.simplebtn').onclick = () => {
          if (exr.skipped) return;
          exr.done = !exr.done;
          el.querySelector('.simplebtn').classList.toggle('on', exr.done);
          el.querySelector('.simplebtn').innerHTML = `${icon('check', 20)} ${exr.done ? 'Completed' : 'Mark Done'}`;
          el.classList.toggle('done', exr.done);
          updateProgress();
          persistToday();
        };
      } else {
        inner += `<div class="sets-wrap ${exr.skipped ? 'disabled-sets' : ''}" style="display:flex;flex-direction:column;gap:8px;margin-top:12px">`;
        exr.sets.forEach((st, si) => {
          const ps = prev && prev.sets[si];
          inner += `<div class="setrow" data-si="${si}">
            <span class="setnum">${si + 1}</span>
            <div style="flex:1;display:flex;align-items:center;gap:8px">
              <div class="setcell"><input type="number" inputmode="decimal" class="w" placeholder="${ps && ps.weight != null ? ps.weight : 'kg'}" value="${st.weight ?? ''}" ${exr.skipped ? 'disabled' : ''}/></div>
              <span class="xsign">×</span>
              <div class="setcell"><input type="number" inputmode="numeric" class="r" placeholder="${ps && ps.reps != null ? ps.reps : 'reps'}" value="${st.reps ?? ''}" ${exr.skipped ? 'disabled' : ''}/></div>
            </div>
            <button class="checkbtn ${st.done && !exr.skipped ? 'on' : ''}" ${exr.skipped ? 'disabled' : ''}>${icon('check', 20)}</button></div>`;
        });
        inner += `</div>`;
        el.innerHTML = inner;
  
        el.querySelectorAll('.setrow').forEach(row => {
          const si = +row.dataset.si;
          const st = exr.sets[si];
          row.querySelector('.w').oninput = e => {
            st.weight = e.target.value === '' ? null : parseFloat(e.target.value);
            persistToday();
          };
          row.querySelector('.r').oninput = e => {
            st.reps = e.target.value === '' ? null : parseInt(e.target.value);
            persistToday();
          };
          row.querySelector('.checkbtn').onclick = () => {
            if (exr.skipped) return;
            st.done = !st.done;
            row.querySelector('.checkbtn').classList.toggle('on', st.done);
            exr.done = exr.sets.every(s => s.done);
            el.classList.toggle('done', exr.done);
            updateProgress();
            persistToday();
          };
        });
      }
  
      // Attach Header Skip Handler
      el.querySelector('.skip-btn').onclick = () => {
        exr.skipped = !exr.skipped;
        if (exr.skipped) {
          exr.done = true; // Counts towards overall workout progress
        } else {
          exr.done = simple ? exr.done : exr.sets.every(s => s.done);
        }
        
        // Re-render card list state smoothly
        updateProgress();
        persistToday();
        buildCards();
      };
  
      list.appendChild(el);
    });
  }

  /* ---- WEEK ---- */
  let weekSel = weekdayIndex();
  
  function renderWeek(v) {
    const day = PLAN[weekSel];
    let pills = PLAN.map((d, i) => {
        const rest = d.exercises.length === 0;
        return `<button class="pill ${i === weekSel ? 'active' : ''}" onclick="weekSel=${i};render()"><span class="d">${SHORT[i]}</span>${rest ? `<span class="moon-icon">${icon('moon', 14)}</span>` : '<span class="dot"></span>'}</button>`;
      }).join('');
    
    let ex = '';
    if (day.exercises.length === 0) {
      ex = `<p class="muted" style="font-size:14px;padding:32px 0;text-align:center">Recovery day — no exercises scheduled.</p>`;
    } else {
      ex = '<div class="stack">' + day.exercises.map(e => {
        if (e.kind === 'break') return `<div class="breaklabel">${icon('timer', 14)} Short Break</div>`;
        return `<div class="exrow"><div class="l"><span style="color:hsl(var(--primary))">${icon(e.kind === 'cardio' ? 'waves' : 'dumbbell', 16)}</span><span class="n">${e.name}</span></div><span class="r">${e.sets > 1 ? e.sets + ' × ' : ''}${e.target}</span></div>`;
      }).join('') + '</div>';
    }
    
    v.innerHTML = `<div class="px" style="padding-top:32px">
      <div class="eyebrow">The Split</div><h1 class="display" style="font-size:48px;text-transform:uppercase;line-height:1;margin-top:4px">Weekly Plan</h1>
      <div class="no-sb" style="display:flex;gap:8px;margin-top:24px;overflow-x:auto">${pills}</div>
      <div style="margin-top:24px" class="fade">
        <div class="wk-hero"><img src="${day.image}"/><div class="ov"></div><div class="cap"><div class="eyebrow">${DAY_NAMES[weekSel]}</div><h2>${day.title}</h2></div></div>
        ${ex}
      </div></div>`;
  }
  
  /* ---- HISTORY ---- */
  function fmtDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  }
  
  function renderHistory(v) {
    const s = computeStats();
    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  
    let sessions = s.sessions.length === 0 
      ? `<p class="muted" style="font-size:14px;padding:32px 0;text-align:center">No workouts logged yet. Head to Today and start lifting! 💪</p>`
      : '<div class="stack">' + s.sessions.map((x) => {
          // Filter out breaks
          const trackableExercises = (x.exercises || []).filter(e => e.kind !== 'break');
  
          const detailsHtml = trackableExercises.map(e => {
            const simple = e.kind === 'cardio';
            
            // Filter sets that actually have weight or reps logged
            const loggedSets = (e.sets || []).filter(st => st.weight != null || st.reps != null || st.done);
  
            let setChips = '';

            // --- SKIP LOGIC HERE ---
            if (e.skipped) {
              setChips = `<span class="badge skipped-badge">Skipped</span>`;
            } else if (simple) {
              setChips = `<span class="badge ${e.done ? 'on' : ''}">${e.done ? 'Completed' : 'Skipped'}</span>`;
            } else if (loggedSets.length > 0) {
              setChips = loggedSets.map((st, i) => `
                <span class="set-chip">
                  <span class="num">S${i + 1}</span>
                  <span class="val">${st.weight != null ? st.weight + 'kg' : '—'} × ${st.reps != null ? st.reps : '—'}</span>
                </span>
              `).join('');
            } else {
              setChips = `<span class="muted" style="font-size:11px;">No sets logged</span>`;
            }
  
            return `
              <div class="history-ex-item">
                <div class="history-ex-header">
                  <span style="color:${e.skipped ? 'hsl(var(--muted-foreground))' : 'hsl(var(--primary))'}">${icon(simple ? 'waves' : 'dumbbell', 14)}</span>
                  <span style="${e.skipped ? 'opacity:0.7;' : ''}">${e.name}</span>
                </div>
                <div class="history-sets-wrap">
                  ${setChips}
                </div>
              </div>
            `;
          }).join('');
  
          return `
            <details class="history-card">
              <summary>
                <div style="min-width:0">
                  <div style="font-weight:700;font-size:15px;line-height:1.2;">${x.title}</div>
                  <div class="muted" style="font-size:12px;margin-top:2px;">${fmtDate(x.date)}</div>
                </div>
                <div style="display:flex;align-items:center;gap:8px;">
                  <span class="muted" style="font-size:12px;font-weight:700;">${x.completed_count}/${x.total_count}</span>
                  <span class="badge ${x.completed ? 'on' : ''}">${x.completed ? 'Done' : 'Partial'}</span>
                  <span class="history-chevron">${icon('chevronDown', 18)}</span>
                </div>
              </summary>
              <div class="history-body">
                ${detailsHtml}
              </div>
            </details>
          `;
        }).join('') + '</div>';
      
    v.innerHTML = `<div class="px" style="padding-top:32px">
      <div class="eyebrow">Progress</div><h1 class="display" style="font-size:48px;text-transform:uppercase;line-height:1;margin-top:4px">History</h1>
      <div class="statgrid">
        <div class="stat"><span style="color:hsl(var(--primary))">${icon('flame', 20)}</span><span class="v">${s.streak}</span><span class="l">Day Streak</span></div>
        <div class="stat"><span style="color:hsl(var(--primary))">${icon('trophy', 20)}</span><span class="v">${s.weekDone}/5</span><span class="l">This Week</span></div>
        <div class="stat"><span style="color:hsl(var(--primary))">${icon('dumbbell', 20)}</span><span class="v">${s.total}</span><span class="l">Total Done</span></div>
      </div>
      <div class="wkgrid">
        <div class="l" style="font-size:11px;text-transform:uppercase;letter-spacing:.05em;font-weight:700;color:hsl(var(--muted-foreground));margin-bottom:12px">This Week</div>
        <div class="row">${s.grid.map((g, i) => `<div class="col"><span class="dl">${DAYS[i]}</span><div class="circle ${g.done ? 'on' : ''}">${g.done ? icon('check', 20) : '<span style="width:6px;height:6px;border-radius:99px;background:hsl(var(--muted-foreground)/.4)"></span>'}</div></div>`).join('')}</div>
      </div>
      <h2 class="display" style="font-size:24px;text-transform:uppercase;margin-top:32px;margin-bottom:12px">Recent Sessions</h2>
      ${sessions}
    </div>`;
  }
  
/* ---- SETTINGS ---- */
function renderSettings(v) {
    const dark = (localStorage.getItem(LS_THEME) || 'dark') === 'dark';
    v.innerHTML = `<div class="px" style="padding-top:32px">
      <div class="eyebrow">You</div><h1 class="display" style="font-size:48px;text-transform:uppercase;line-height:1;margin-top:4px">Settings</h1>
      
      <div class="card" style="margin-top:24px;padding:20px">
        <div class="l" style="font-size:11px;text-transform:uppercase;letter-spacing:.05em;font-weight:700;color:hsl(var(--muted-foreground));margin-bottom:16px">Appearance</div>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:12px">
            <span style="color:hsl(var(--primary))">${icon(dark ? 'moon' : 'sun', 20)}</span>
            <div><div style="font-weight:700;font-size:14px">${dark ? 'Dark Mode' : 'Light Mode'}</div><div class="muted" style="font-size:12px">Tap to switch theme</div></div>
          </div>
          <button class="toggle ${dark ? 'on' : ''}" id="theme-toggle"><span class="knob">${icon(dark ? 'moon' : 'sun', 16)}</span></button>
        </div>
      </div>
  
      <div class="card" style="margin-top:12px;padding:20px">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:44px;height:44px;border-radius:12px;background:hsl(var(--primary));display:flex;align-items:center;justify-content:center;color:hsl(var(--primary-foreground))">${icon('dumbbell', 24)}</div>
          <div><div class="display" style="font-size:24px;text-transform:uppercase;line-height:1">Iron Log</div><div class="muted" style="font-size:12px;margin-top:4px">Darryl's personal training companion</div></div>
        </div>
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid hsl(var(--border));display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px" class="muted">
          <div><div style="font-weight:700;color:hsl(var(--foreground))">5-Day Split</div><div>Push / Pull / Legs blend</div></div>
          <div><div style="font-weight:700;color:hsl(var(--foreground))">Saved on device</div><div>Works fully offline</div></div>
        </div>
      </div>
  
      <div class="card" style="margin-top:12px;padding:20px;border-color:hsl(var(--destructive) / .3);">
        <div class="l" style="font-size:11px;text-transform:uppercase;letter-spacing:.05em;font-weight:700;color:hsl(var(--destructive));margin-bottom:8px">Danger Zone</div>
        <div class="muted" style="font-size:12px;margin-bottom:16px;">Resetting will permanently erase all workout logs and history stored on this device.</div>
        <button class="reset-btn" id="reset-app-btn">
          ${icon('x', 18)} Reset All App Data
        </button>
      </div>
    </div>`;
  
    document.getElementById('theme-toggle').onclick = () => { toggleTheme(); renderSettings(v); };
    
    document.getElementById('reset-app-btn').onclick = () => {
      if (confirm('Are you sure you want to reset Iron Log? This will delete all logged workouts and history.')) {
        localStorage.clear();
        location.reload();
      }
    };
  }
  
  /* ---------------- INIT APP ---------------- */
  initTheme();
  renderNav();
  render();
