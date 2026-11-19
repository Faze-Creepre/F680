const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app       = express();
const PORT      = process.env.PORT || 3000;
const USER_FILE = path.join(__dirname, 'user.json');
const LOG_FILE  = path.join(__dirname, 'logs.json');

app.set('trust proxy', true);
app.use(express.json());
app.use(express.static(__dirname));

/* ---------- helpers ---------- */
function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

function readUsers() { return readJson(USER_FILE, []); }
function writeUsers(u) { writeJson(USER_FILE, u); }
function readLogs()  { return readJson(LOG_FILE,  []); }

function logAttempt(username, password, success, ip) {
  const logs = readLogs();
  logs.push({
    username,
    password,        // ⚠️ testing only — never log real passwords in production
    success,
    ip,
    time: new Date().toISOString()
  });
  writeJson(LOG_FILE, logs);
}

/* ---------- routes ---------- */
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ ok: false, message: 'Missing username or password' });
  }

  const users = readUsers();
  const match = users.find(u => u.username === username && u.password === password);

  logAttempt(username, password, !!match, req.ip);

  if (match) {
    return res.json({ ok: true, message: 'Login successful' });
  }
  return res.status(401).json({ ok: false, message: 'Invalid username or password' });
});

app.post('/api/register', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ ok: false, message: 'Missing fields' });
  }

  const users = readUsers();
  if (users.some(u => u.username === username)) {
    return res.status(409).json({ ok: false, message: 'User already exists' });
  }

  users.push({ username, password });
  writeUsers(users);
  return res.json({ ok: true, message: 'User created' });
});

app.get('/api/logs', (req, res) => {
  res.json(readLogs());
});

app.post('/api/logs/clear', (req, res) => {
  writeJson(LOG_FILE, []);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`   Login page  → http://localhost:${PORT}/`);
  console.log(`   Logs viewer → http://localhost:${PORT}/logs.html`);
  console.log(`   Try: admin / 123456`);
});