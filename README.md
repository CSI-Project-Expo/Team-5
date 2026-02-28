# 🛡️ ShieldSimulation — Interactive Cyber Defense Training Suite

> **"Train like you fight. Defend like you know the enemy."**


---

## 📌 Overview

**ShieldSimulation** is a browser-based, interactive cybersecurity training platform designed to teach Blue Team defense strategies through hands-on simulation. Instead of passive reading, learners actively experience real-world attack vectors—Brute Force, SQL Injection, and more—inside controlled, gamified environments.

The platform bridges the gap between academic theory and practical security skills using progressive level unlocking, real-time terminal simulations, and an RPG-style ranking system.

---

## 👥 Team Members
**Thanush J**  (Team Leader) ,
**Shreelakshmi Prabhu**,
**Shreya Shridhara**,
**Nidhi Shetty**,

---

## 🎨 UI Aesthetic — Neon Cyberpunk

The interface draws inspiration from terminal-hacker aesthetics:

- **Color Palette:** High-contrast `#00f5ff` cyan and `#ff3366` red on deep navy `#040d1a` backgrounds
- **Typography:** `Orbitron` (headings/UI labels) + `Share Tech Mono` (terminal/code) + `Rajdhani` (body)
- **Grid Background:** Animated CSS grid overlay simulating a digital operations center
- **Animations:** Pulsing lock rings, scrolling binary rain, glowing drop-shadows, and smooth page transitions
- **CRT Scanline Effect:** Subtle `repeating-linear-gradient` overlay on the entire viewport for an authentic terminal feel

---

## 🎮 Scenarios & Gameplay

### 🔒 Brute Force Protocol — 3 Levels

A progressive journey that puts the learner in both the attacker and defender's seat.

| Level | Title | What You Learn |
|-------|-------|----------------|
| **Level 1** | What is Brute Force? | Core concepts, 5 attack types (Dictionary, Credential Stuffing, Hybrid, Reverse, Password Spraying), real-world LinkedIn breach case study |
| **Level 2** | Offensive Operations | Social engineering intel gathering, automated dictionary attack simulation, GPU-accelerated brute force visualization |
| **Level 3** | Defense & Prevention | Engineering Lab — drag-and-drop security module installation, 60-second live botnet stress test, account lockout & MFA configuration |

**Level 3 Mechanic — Strategic Build:**
- You have **100 Security Credits** and a **Latency Meter**
- Each module (Account Lockout, Rate Limiter, MFA, IP Blacklist, CAPTCHA, SIEM) costs credits and adds latency
- Exceed 100% latency → System goes **CRITICAL**, Deploy button disabled
- The stress test outcome depends on which modules were installed — only `Account Lockout` guarantees a defended result

---

### 🗄️ SQL Injection Protocol — 3 Levels

| Level | Title | What You Learn |
|-------|-------|----------------|
| **Level 1** | Introduction to SQLi | How SQL injection occurs, error-based extraction, why parameterization matters |
| **Level 2** | Advanced Techniques | Union-based data extraction, Blind SQLi (Boolean & Time-based), WAF evasion basics |
| **Level 3** | Defense Engineering | Prepared statements, input validation layers, ORM patterns, live defense lab |

---

## 🏆 Progression & Ranking System

Progress is tracked across **18 total parts** (9 Brute Force + 9 SQL Injection), each Part consisting of theory, MCQs, and fill-in-the-blank challenges.

| Parts Completed | Rank |
|-----------------|------|
| 0 | RECRUIT |
| 1–2 | ANALYST |
| 3–4 | SPECIALIST |
| 5–6 | DEFENDER |
| 7–8 | EXPERT |
| 9–12 | ELITE |
| 13–15 | MASTER |
| 16–17 | LEGEND |
| 18/18 | **ELITE** (Full Mastery) |

The dashboard shows **Overall Mastery %**, **Parts Completed (X/18)**, and the user's **Current Rank** — updated in real time.

---

## 🧱 Technical Architecture

### Frontend Stack

| Technology | Usage |
|------------|-------|
| **HTML5** | Semantic page structure, all UI pages rendered client-side |
| **CSS3** | Custom Properties, Keyframe animations, CSS Grid/Flexbox, `clamp()` for responsive typography |
| **Vanilla JavaScript (ES6+)** | All interactivity, state, routing, and simulations — zero frameworks |

### State Management — `localStorage`

User progress is persisted across page refreshes using `localStorage` with the key `shield_users`:

```js
// Progress structure stored per user
{
  username: "defender@shieldsim.net",
  progress: {
    bruteforce: {
      level1: { p1: true, p2: true, p3: true },
      level2: { p1: true, p2: false, p3: false },
      level3: { p1: false, p2: false, p3: false }
    },
    sqli: {
      level1: { p1: true, p2: true, p3: true },
      level2: { p1: false, p2: false, p3: false },
      level3: { p1: false, p2: false, p3: false }
    }
  }
}
```

### Level Gating — Gate Logic

Each level checks the prior level's `p1`, `p2`, `p3` flags before allowing access:
```js
function startBF3() {
  const l2 = user.progress?.bruteforce?.level2 || {};
  if ([l2.p1, l2.p2, l2.p3].filter(Boolean).length < 3) {
    setSt(true, 'Access Denied — Complete Level 2 first');
    return;
  }
  window.location.href = 'brute-force-level3.html';
}
```

### Navigation — `sessionStorage` Return Logic

When a user completes a sub-level page (e.g., `brute-force-level3.html`), they are returned to the correct sub-menu using `sessionStorage`:

```js
// Before navigating to a level page:
sessionStorage.setItem('ss_goto', 'page-bflevels');

// On index.html load, checks and restores position:
const goto = sessionStorage.getItem('ss_goto');
if (goto) { goTo(goto); sessionStorage.removeItem('ss_goto'); }
```

This ensures users always land back on their last active section rather than the login screen.

---

## 📁 Project Structure

```
shieldf/
├── index.html                  # Main SPA — all core pages (Login, Scenarios, Levels, About, Features)
├── style.css                   # Shared stylesheet for sub-level pages
├── app.js                      # Auth, routing, progress saving, level unlock logic
├── brute-force-level2.html     # BF Offensive Operations interactive lab
├── brute-force-level3.html     # BF Defense Engineering Lab (drag-drop + stress test)
├── sql-injection-level2.html   # SQLi Advanced Techniques lab
├── sql-injection-level3.html   # SQLi Defense Engineering lab
└── README.md
```

---

## 🚀 Getting Started

ShieldSimulation is a **100% client-side** application. No server, no build tools, no dependencies.

### Option 1 — Direct Browser Open

```bash
git clone https://github.com/CSI-Project-Expo/Team-5.git
cd Team-5
# Open index.html in your browser
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux
```

### Option 2 — Live Server (Recommended)

If you have VS Code with the **Live Server** extension:
1. Open the project folder in VS Code
2. Right-click `index.html` → **"Open with Live Server"**
3. Navigate to `http://localhost:5500`

### First Run

1. Click **"Request Access"** on the login screen to register a new account
2. Your credentials are stored locally — no backend required
3. Start with **Brute Force Protocol → Level 1**
4. Complete all 3 Parts in each level to unlock the next
5. Progress automatically saves after each completed Part

---

## 🔐 Security Modules (Level 3 Labs)

| Module | Credit Cost | Latency Impact | Effect |
|--------|-------------|----------------|--------|
| Account Lockout | 20 | +15% | Blocks repeated login attempts |
| Rate Limiter | 15 | +10% | Throttles request frequency |
| MFA (TOTP) | 25 | +20% | Requires second factor |
| IP Blacklist | 10 | +8% | Blocks known malicious IPs |
| CAPTCHA | 10 | +12% | Human verification gate |
| SIEM Alert | 20 | +5% | Logs and flags anomalies |

> ⚠️ Exceeding **100% total latency** disables the Deploy button — balance security vs. performance!

---

## 📖 Pages & Navigation

| Page | Route / ID | Description |
|------|-----------|-------------|
| Login / Register | `page-login` | Account entry point |
| Scenarios Dashboard | `page-scenarios` | Mission select with stats |
| About | `page-about` | Platform overview |
| Features | `page-features` | Feature showcase grid |
| BF Level Select | `page-bflevels` | Brute Force level cards |
| SQL Level Select | `page-sqilevels` | SQL Injection level cards |
| BF Level 1 | `page-l1` (inline) | Theory + MCQ + FITB |
| SQL Level 1 | `page-sql1` (inline) | Theory + MCQ + FITB |
| BF Level 2 | `brute-force-level2.html` | Offensive lab |
| BF Level 3 | `brute-force-level3.html` | Defense engineering |
| SQL Level 2 | `sql-injection-level2.html` | Advanced SQLi lab |
| SQL Level 3 | `sql-injection-level3.html` | Defense engineering |

---

## 🌟 Key Design Principles

- **Progressive Disclosure** — Content locked until prerequisites are met
- **Blue Team Focus** — Every attack simulation ends with how to defend against it
- **Zero Dependencies** — Pure HTML/CSS/JS, works offline
- **Persistent Learning** — Progress survives page refreshes and browser restarts
- **Responsive Layout** — Adapts from 1200px desktops down to mobile viewports

---


<div align="center">

**ShieldSimulation** — *Built for defenders, by defenders.*

`CSI Project Expo | Team 5`

</div>
