/* ---------------- STATE / STORAGE ---------------- */
const LS_SESSIONS = 'ironlog-sessions';
const LS_THEME = 'ironlog-theme';

const pad = n => String(n).padStart(2, '0');

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const weekdayIndex = () => ((new Date().getDay()) + 6) % 7;

function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem(LS_SESSIONS)) || {};
  } catch (e) {
    return {};
  }
}

function saveSessions(s) {
  localStorage.setItem(LS_SESSIONS, JSON.stringify(s));
}

function getSession(date) {
  return loadSessions()[date] || null;
}

function putSession(date, sess) {
  const all = loadSessions();
  all[date] = sess;
  saveSessions(all);
}

function buildSession(dayIdx, date) {
  const day = PLAN[dayIdx];
  const exercises = day.exercises.map(e => ({
    name: e.name,
    kind: e.kind,
    target: e.target,
    sets: (e.kind === 'break' || e.kind === 'cardio') ? [] : Array.from({ length: e.sets }, () => ({ weight: null, reps: null, done: false })),
    done: false
  }));
  return {
    date,
    weekday: dayIdx,
    title: day.title,
    muscle: day.muscle,
    exercises,
    completed: false,
    completed_count: 0,
    total_count: exercises.filter(e => e.kind !== 'break').length
  };
}

function recompute(s) {
    const trackable = s.exercises.filter(e => e.kind !== 'break');
    const done = trackable.filter(e => e.done || e.skipped).length;
    s.completed_count = done;
    s.total_count = trackable.length;
    s.completed = trackable.length > 0 && done === trackable.length;
    return s;
}

function getPrevious(date) {
  const all = loadSessions();
  const dates = Object.keys(all).filter(d => d < date).sort().reverse();
  const wd = (new Date(date + 'T00:00:00').getDay() + 6) % 7;
  const names = PLAN[wd].exercises.filter(e => e.kind !== 'break').map(e => e.name);
  const res = {};
  names.forEach(name => {
    for (const d of dates) {
      const sess = all[d];
      const m = (sess.exercises || []).find(x => x.name === name);
      if (!m) continue;
      const logged = (m.sets || []).filter(s => s.weight != null || s.reps != null);
      if (logged.length || m.done) {
        res[name] = { date: d, sets: logged };
        break;
      }
    }
  });
  return res;
}

function computeStats() {
  const all = loadSessions();
  const doneDates = new Set(Object.values(all).filter(s => s.completed).map(s => s.date));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  // Streak
  let streak = 0;
  let cur = new Date(today);
  for (let k = 0; k < 60; k++) {
    const wd = (cur.getDay() + 6) % 7;
    if (wd < 5) {
      if (doneDates.has(iso(cur))) streak++;
      else if (iso(cur) === iso(today)) {}
      else break;
    }
    cur.setDate(cur.getDate() - 1);
  }

  // Week Grid
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const grid = [];
  let weekDone = 0;
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const done = doneDates.has(iso(d));
    if (done) weekDone++;
    grid.push({ wd: i, done });
  }

  return {
    streak,
    weekDone,
    grid,
    total: doneDates.size,
    sessions: Object.values(all).sort((a, b) => b.date < a.date ? -1 : 1)
  };
}

/* ---------------- THEME ---------------- */
function initTheme() {
  const t = localStorage.getItem(LS_THEME) || 'dark';
  applyTheme(t);
}

function applyTheme(t) {
  document.documentElement.classList.toggle('dark', t === 'dark');
  localStorage.setItem(LS_THEME, t);
}

function toggleTheme() {
  const cur = localStorage.getItem(LS_THEME) || 'dark';
  applyTheme(cur === 'dark' ? 'light' : 'dark');
}
