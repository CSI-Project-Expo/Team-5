const API = window.location.origin;
let user = null, mcqDone = {}, fitbDone = {}, curPart = 1;
const saved = localStorage.getItem('ss_user');
if (saved) { user = JSON.parse(saved); enterApp(); }

function goTo(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById(id);
  pg.classList.add('active');
  pg.scrollTo({ top: 0, behavior: 'instant' });
}

function showNav(on) {
  document.getElementById('navUser').classList.toggle('show', on);
  document.getElementById('navLogout').classList.toggle('show', on);
}

async function doLogin() {
  const u = document.getElementById('lu').value.trim(), p = document.getElementById('lp').value;
  if (!u || !p) { setErr('loginErr', 'Please fill in both fields.'); return; }
  const btn = document.getElementById('loginBtn');
  btn.disabled = true; btn.textContent = 'AUTHENTICATING...';
  try {
    const r = await fetch(`${API}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, password: p }) });
    const d = await r.json();
    if (!r.ok) { setErr('loginErr', d.error || 'Invalid credentials'); setSt(true); btn.disabled = false; btn.textContent = 'INITIALIZE SESSION'; return; }
    user = d.user;
  } catch {
    user = { username: u, progress: { bruteforce: { level1: { p1: false, p2: false, p3: false }, completion: 0 } } };
    setSt(false, 'System Status: Demo Mode');
  }
  localStorage.setItem('ss_user', JSON.stringify(user));
  btn.disabled = false; btn.textContent = 'INITIALIZE SESSION';
  enterApp();
}

async function doRegister() {
  const u = document.getElementById('ru').value.trim(), p = document.getElementById('rp').value;
  if (!u || !p) { setErr('regErr', 'Fill all fields'); return; }
  try {
    const r = await fetch(`${API}/api/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, password: p }) });
    const d = await r.json();
    if (!r.ok) { setErr('regErr', d.error || 'Error'); return; }
    setErr('regErr', '✓ Account created! Login above.');
  } catch { setErr('regErr', 'Server offline — use any credentials for demo mode'); }
}

function logout() { user = null; localStorage.removeItem('ss_user'); showNav(false); goTo('page-login'); }

function toggleReg() {
  const s = document.getElementById('regSection');
  s.style.display = s.style.display === 'block' ? 'none' : 'block';
}

function enterApp() {
  document.getElementById('navUser').textContent = user.username;
  showNav(true);
  document.getElementById('scUser').textContent = user.username;
  updateStats();
  checkLevelUnlocks();
  goTo('page-scenarios');
}

function updateStats() {
  const l1 = user.progress?.bruteforce?.level1 || {};
  const l2 = user.progress?.bruteforce?.level2 || {};
  const doneL1 = [l1.p1, l1.p2, l1.p3].filter(Boolean).length;
  const doneL2 = [l2.p1, l2.p2, l2.p3].filter(Boolean).length;
  const totalDone = doneL1 + doneL2;
  const pct = Math.round((totalDone / 6) * 100);
  document.getElementById('stM').textContent = pct + '%';
  document.getElementById('stD').textContent = totalDone + '/6';
  document.getElementById('bfPct').textContent = Math.round((doneL1 / 3) * 100) + '%';
  document.getElementById('bfBar').style.width = Math.round((doneL1 / 3) * 100) + '%';
  const ranks = ['RECRUIT', 'ANALYST', 'SPECIALIST', 'DEFENDER', 'EXPERT', 'ELITE', 'MASTER'];
  document.getElementById('stR').textContent = ranks[totalDone] || 'MASTER';
}

function startL1() { curPart = 1; mcqDone = {}; fitbDone = {}; renderStepper(); showPart(1); goTo('page-l1'); }

function startL2() {
  const l1 = user.progress?.bruteforce?.level1 || {};
  const l1Done = [l1.p1, l1.p2, l1.p3].filter(Boolean).length === 3;
  if (!l1Done) return; // still locked
  window.location.href = 'brute-force-level2.html';
}

function checkLevelUnlocks() {
  const l1 = user.progress?.bruteforce?.level1 || {};
  const l1Done = [l1.p1, l1.p2, l1.p3].filter(Boolean).length === 3;
  const l2card = document.getElementById('l2card');
  const l2badge = document.getElementById('l2badge');
  if (l1Done && l2card) {
    l2card.classList.remove('lv-locked');
    if (l2badge) { l2badge.textContent = 'AVAILABLE'; l2badge.className = 'lv-badge open'; }
  }
  const l2 = user.progress?.bruteforce?.level2 || {};
  const l2Done = [l2.p1, l2.p2, l2.p3].filter(Boolean).length === 3;
  if (l2Done && l2badge) { l2badge.textContent = 'COMPLETE'; l2badge.className = 'lv-badge done'; }
}

function goPart(n) {
  curPart = n; renderStepper(); showPart(n);
  document.getElementById('page-l1').scrollTo({ top: 0, behavior: 'smooth' });
}

function showPart(n) {
  for (let i = 1; i <= 3; i++) {
    const e = document.getElementById('part' + i);
    e.className = 'part' + (i === n ? ' part-on' : '');
  }
}

function renderStepper() {
  for (let i = 1; i <= 3; i++) {
    const e = document.getElementById('stp' + i);
    e.className = 'stp' + (i < curPart ? ' stp-done' : i === curPart ? ' stp-active' : '');
  }
  document.getElementById('sl1').className = 'stp-line' + (curPart > 1 ? ' stp-done' : '');
  document.getElementById('sl2').className = 'stp-line' + (curPart > 2 ? ' stp-done' : '');
}

const CANS = { q1: 1, q2: 2, q3: 1, q4: 2, q5: 2 };
const CFBT = {
  q1: ['❌ Brute force needs no vulnerability — it just tries everything.', '✅ Correct! Pure trial-and-error — no exploits, just trying every possibility.', '❌ That is phishing — a completely different attack.', '❌ That is a Man-in-the-Middle attack.'],
  q2: ['❌ Dictionary uses wordlists but not precomputed lookups.', '❌ Hybrid combines dictionary words with brute-force additions.', '✅ Correct! Rainbow tables are precomputed hash databases for instant reversal.', '❌ Reverse brute force uses one password against many usernames.'],
  q3: ['❌ LinkedIn did hash their passwords — just with weak, unsalted SHA-1.', '✅ Exactly! Unsalted SHA-1 + rainbow tables = cracked within hours.', '❌ The breach was technical, not social engineering.', '❌ The vulnerability was weak hashing, not an open SSH port.'],
  q4: ['❌ That is standard brute force — many passwords on one account.', '❌ That describes cryptanalysis, not reverse brute force.', '✅ Spot on! One known password tested against thousands of different usernames.', '❌ "Reversing" here means flipping who vs what is fixed — not reversing the list.'],
  q5: ['❌ Weak dictionary-style password — cracks instantly.', '❌ "P@ssw0rd" substitutions are in every dictionary list.', '✅ Correct! Long, random, mixed characters = exponentially harder to brute force.', '❌ Season+Year+Symbol pattern appears in many hybrid attack wordlists.']
};

function ansQ(qId, chosen) {
  const c = CANS[qId];
  const opts = document.getElementById(qId).querySelectorAll('.q-opt');
  opts.forEach(o => o.classList.add('q-dis'));
  opts[chosen].classList.add(chosen === c ? 'q-ok' : 'q-no');
  if (chosen !== c) opts[c].classList.add('q-ok');
  const fb = document.getElementById(qId + 'fb');
  fb.textContent = CFBT[qId][chosen];
  fb.className = 'q-fb show ' + (chosen === c ? 'ok' : 'no');
  mcqDone[qId] = (chosen === c);
  if (Object.keys(mcqDone).length === 5) {
    const score = Object.values(mcqDone).filter(Boolean).length;
    const sv = document.getElementById('mcqSV');
    sv.textContent = score + '/5';
    sv.style.color = score >= 4 ? 'var(--green)' : score >= 3 ? 'var(--yellow)' : 'var(--red)';
    document.getElementById('mcqScore').classList.add('show');
    document.getElementById('btnP3').disabled = false;
    saveP('p2');
  }
}

const BANS = { b1: 'brute force', b2: 'dictionary', b3: 'rainbow table', b4: 'hydra', b5: 'salting', b6: 'hybrid' };

function chkB(id, ans, fbId) {
  const inp = document.getElementById(id);
  const val = inp.value.trim().toLowerCase();
  const fb = document.getElementById(fbId);
  if (!val) { fb.textContent = '⚠️ Type an answer first.'; fb.className = 'fitb-fb show no'; return; }
  if (val === ans) {
    inp.classList.add('bok'); inp.disabled = true;
    fb.textContent = '✅ Correct!'; fb.className = 'fitb-fb show ok';
    fitbDone[id] = true;
  } else {
    inp.classList.add('bno');
    fb.textContent = '❌ Not quite — check the word bank and try again.'; fb.className = 'fitb-fb show no';
    fitbDone[id] = false;
    setTimeout(() => { inp.classList.remove('bno'); inp.value = ''; }, 1300);
  }
  if (Object.keys(BANS).every(k => fitbDone[k] === true)) {
    const sv = document.getElementById('fitbSV');
    sv.textContent = '6/6'; sv.style.color = 'var(--green)';
    document.getElementById('fitbScore').classList.add('show');
    document.getElementById('btnFinish').disabled = false;
    saveP('p3');
  }
}

async function finishL1() {
  saveP('p1', 'level1'); saveP('p2', 'level1'); saveP('p3', 'level1');
  document.getElementById('l1badge').textContent = 'COMPLETE';
  document.getElementById('l1badge').className = 'lv-badge done';
  updateStats();
  goTo('page-bflevels');
}

async function saveP(part, level) {
  level = level || 'level1'; // default to level1 for backward compatibility
  if (!user.progress) user.progress = {};
  if (!user.progress.bruteforce) user.progress.bruteforce = {};
  if (!user.progress.bruteforce[level]) user.progress.bruteforce[level] = {};
  user.progress.bruteforce[level][part] = true;
  localStorage.setItem('ss_user', JSON.stringify(user));
  try {
    await fetch(`${API}/api/progress/${user.username}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ game: 'bruteforce', level, mode: part, completed: true }) });
  } catch {}
}

function setErr(id, msg) { document.getElementById(id).textContent = msg; }

function setSt(err, msg) {
  document.getElementById('stext').textContent = msg || (err ? 'Access Denied' : 'System Status: Operational');
  document.getElementById('sdot').className = 'sdot' + (err ? ' red' : '');
}

document.getElementById('lp').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
document.getElementById('lu').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('lp').focus(); });
