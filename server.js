// ── Import the tools we installed ───��─────────────────────────
const express = require('express');   // The web server tool
const cors    = require('cors');      // Allows browser to talk to this server
const bcrypt  = require('bcryptjs'); // Password scrambler
const fs      = require('fs');        // Built into Node — reads/writes files
const path    = require('path');      // Built into Node — handles file paths

// ── Create the server app ──────────────────────────────────────
const app = express();

// ── Tell the server how to handle incoming data ────────────────
app.use(cors());              // Allow requests from your HTML pages
app.use(express.json());      // Understand JSON data sent by the browser
app.use(express.static(__dirname)); // Serve your HTML/CSS/JS files automatically

// ── Where to store user data ───────────────────────────────────
// This creates/uses a file called users.json in the same folder
const USERS_FILE = path.join(__dirname, 'users.json');

// ── Helper: Read all users from the file ──────────────────────
function loadUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch {
    return []; // If the file doesn't exist yet, return an empty list
  }
}

// ── Helper: Save all users back to the file ───────────────────
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ══════════════════════════════════════════════════════════════
// ROUTE 1: Register a new account
// When the browser sends POST /api/register, this code runs
// ══════════════════════════════════════════════════════════════
app.post('/api/register', (req, res) => {

  // req.body is the data the browser sent (username + password)
  const { username, password } = req.body;

  // Check that both fields were filled in
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  // Load existing users and check if username is already taken
  const users = loadUsers();
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  // Hash (scramble) the password before saving — NEVER save plain passwords!
  // bcrypt.hashSync scrambles it so it can't be read, but can be checked later
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create the new user object
  const newUser = {
    username: username,
    password: hashedPassword,  // scrambled password
    progress: {}               // empty progress to start
  };

  // Add to the list and save the file
  users.push(newUser);
  saveUsers(users);

  // Tell the browser it worked
  res.json({ message: 'Account created' });
});

// ══════════════════════════════════════════════════════════════
// ROUTE 2: Login
// When the browser sends POST /api/login, this code runs
// ══════════════════════════════════════════════════════════════
app.post('/api/login', (req, res) => {

  const { username, password } = req.body;

  // Load all users and find the one with matching username
  const users = loadUsers();
  const user  = users.find(u => u.username === username);

  // If user not found, or password doesn't match → deny access
  // bcrypt.compareSync checks the plain password against the scrambled one
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Login worked! Send back the user's data
  // YOUR FRONTEND expects exactly this shape: { user: { username, progress } }
  res.json({
    user: {
      username: user.username,
      progress: user.progress || {}
    }
  });
});

// ══════════════════════════════════════════════════════════════
// ROUTE 3: Save progress
// When the browser sends POST /api/progress/alice, this code runs
// Body example: { game: 'recon', level: 'level1', mode: 'p1', completed: true }
// ══════════════════════════════════════════════════════════════
app.post('/api/progress/:username', (req, res) => {

  // :username in the URL becomes req.params.username
  const { username } = req.params;

  // The progress data sent from the browser
  const { game, level, mode, completed } = req.body;

  // Make sure all required fields are present
  if (!game || !level || !mode) {
    return res.status(400).json({ error: 'Missing: game, level, or mode' });
  }

  // Find the user
  const users = loadUsers();
  const user  = users.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Build the nested progress structure step by step
  // We want: user.progress.recon.level1.p1 = true

  if (!user.progress)              user.progress = {};          // create progress if missing
  if (!user.progress[game])        user.progress[game] = {};    // create game section if missing
  if (!user.progress[game][level]) user.progress[game][level] = {}; // create level if missing

  user.progress[game][level][mode] = !!completed; // finally set the value (!! converts to true/false)

  // Save and respond
  saveUsers(users);
  res.json({ user: { username: user.username, progress: user.progress } });
});

// ══════════════════════════════════════════════════════════════
// START THE SERVER
// ══════════════════════════════════════════════════════════════
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ ShieldSimulation server running at http://localhost:${PORT}`);
});