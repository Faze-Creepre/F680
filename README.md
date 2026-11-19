# 🔐 Login Test — Express + JSON

## 📁 Project structure

```
.
├── index.html      # Login / register page
├── style.css       # Styling
├── logs.html       # Login attempt viewer (table)
├── user.json       # Registered users  (auto-managed by server)
├── logs.json       # Every login attempt (auto-managed by server)
├── server.js       # Express backend
├── package.json    # Dependencies & scripts
└── README.md
```

---

## ✅ Requirements

- **Node.js 18+** (recommended: 20 LTS)
- npm (comes with Node)
- Any OS: Linux (Debian/Ubuntu tested), macOS, Windows

Check your versions:

```bash
node -v
npm -v
```

If you don't have Node, install it:

**Debian / Ubuntu**
```bash
sudo apt update
sudo apt install -y nodejs npm
```

**macOS** (with Homebrew)
```bash
brew install node
```

**Windows** — download the LTS installer from https://nodejs.org

---

## 🚀 Run locally

```bash
# 1. Clone the repo
git clone https://github.com/Faze-Creepre/F680.git
cd F680

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

Then open:

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Login / register page |
| http://localhost:3000/logs.html | View all login attempts |
| http://localhost:3000/api/logs | Raw JSON of attempts |

**Default test accounts** (in `user.json`):

| Username | Password |
|----------|----------|
| `admin` | `123456` |
| `testuser` | `password` |
| `demo` | `demo123` |


## 🌍 Deployment

The app is a standard Node.js server, so it works on any hosting that runs Node. Below are the 3 easiest free options.

### Option 1 — Render (free, easiest)

1. Push the project to GitHub.
2. Go to https://render.com → **New → Web Service**.
3. Connect your repo.
4. Fill in:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **Create Web Service**.

Render gives you a public URL like `https://your-app.onrender.com` in ~2 minutes.

### Option 3 — VPS (Debian/Ubuntu) — persistent data

If you want `user.json` / `logs.json` to **survive restarts**, run it on a real server.

```bash
# On the VPS
sudo apt update
sudo apt install -y nodejs npm git

# Clone
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install

# Keep it running forever with PM2
sudo npm install -g pm2
pm2 start server.js --name login-test
pm2 save
pm2 startup    # follow the printed command
```

Then put **Nginx** in front as a reverse proxy:

```bash
sudo apt install -y nginx
```

Create `/etc/nginx/sites-available/login-test`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/login-test /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Add HTTPS for free with Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Your app is now live at `https://your-domain.com` with persistent storage.

---

## 🛠 Configuration

- **Port**: set the `PORT` environment variable (defaults to `3000`).
  ```bash
  PORT=8080 npm start
  ```
- **Data files**: `user.json` and `logs.json` live next to `server.js`. Back them up if running on a VPS.

---


## 📜 License

MIT — do whatever you want, no warranty.

---

## 👤 Author

**Faze-Creepre** — https://github.com/Faze-Creepre
