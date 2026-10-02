# 🔄 Transfer Buddy

Send files and messages between two devices using a **5-digit code**. No sign-up, no cloud upload — files travel **directly from one browser to the other** over WebRTC.

---

## ✨ Features

- 🔢 **Code-based pairing** — every visitor gets a 5-digit code; enter a friend's code to connect
- 📁 **Peer-to-peer file transfer** — drag & drop or click to pick any file
- 💬 **Live chat** — text messages over the same connection, with new-message notifications
- ⬇️ **Received files list** — name, size and a one-click download
- 📋 **Clipboard helpers** — copy your code or paste a friend's code in one tap
- 🌙 **Dark UI**, fully responsive for phones and desktops
- ⏱️ **Codes expire after 5 minutes**

---

## 🏗️ How It Works

```
 Device A                       Next.js API                      Device B
 ────────                       ───────────                      ────────
 1. Create PeerJS peer
 2. POST /api/register ───────► store code → peerId
    ◄─────── "48213"
                                                                 3. Enter "48213"
                                 POST /api/resolve ◄─────────── 4. look up code
                                 ─────────────────► peerId A
 5. ◄═══════════ direct WebRTC data channel (files + chat) ═══════════► 
```

The server only matches **code → peer ID**. File contents and messages never pass through it.

---

## 🧰 Tech Stack

| Layer | Tools |
|---|---|
| Framework | **Next.js 16** (App Router), **React 19**, **TypeScript** |
| P2P transport | **PeerJS** (WebRTC data channels) |
| Styling | **Tailwind CSS 4**, `tw-animate-css` |
| UI | **lucide-react** icons, **sonner** toasts, `next-themes` |

---

## 📁 Project Structure

```
transfer-buddy/
├── app/
│   ├── page.tsx                 # main logic: peer setup, connect, send/receive
│   ├── layout.tsx               # root layout, fonts, toaster
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── FileDropzone.tsx     # drag & drop file picker
│   │   └── Chat.tsx             # chat window
│   └── api/
│       ├── register/route.js    # POST: peerId → 5-digit code
│       └── resolve/route.js     # POST: code → peerId
├── components/ui/sonner.tsx     # toast wrapper
├── lib/utils.ts
└── public/                      # logo
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install and run

```bash
git clone https://github.com/akhhhh/transfer-buddy.git
cd transfer-buddy
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

---

## 📖 Usage

### Worked example: send a PDF from your laptop to your phone

1. **Laptop** — open the app. Your code appears, e.g. `48213`.
2. **Phone** — open the same site, type `48213` under *Enter code to connect*, tap **Connect**.
3. Both screens show a **Peer Connected!** toast.
4. **Laptop** — drag `notes.pdf` into the dropzone and press **Send File**.
5. **Phone** — a **File Received!** toast appears. Scroll to *Received Files* and tap **Download**.
6. Tap the 💬 button on either device to chat.

---

## 🔌 API

### `POST /api/register`

```json
// request
{ "peerId": "a1b2c3d4-..." }
// response
{ "code": "48213" }
```

### `POST /api/resolve`

```json
// request
{ "code": "48213" }
// response (200)
{ "peerId": "a1b2c3d4-..." }
// response (404)
{ "error": "Invalid code" }
```

---

## ⚠️ Known Limitations

| Limitation | Details |
|---|---|
| In-memory code store | Codes live in server memory. They reset on restart, and may not work on serverless hosts (e.g. Vercel) where requests can hit different instances |
| Whole-file transfer | Each file is sent as a single buffer, so very large files can use a lot of memory |
| Strict networks | Uses PeerJS defaults (STUN only). Some corporate or mobile networks need a TURN server to connect |
| Code collisions | 5-digit codes are random with no uniqueness check |

---

## 🗺️ Roadmap

- [ ] Persistent code store (Redis / Upstash)
- [ ] Chunked transfer with a progress bar
- [ ] Multiple files at once
- [ ] Configurable TURN server
- [ ] Shared clipboard sync

---

## 👨‍🎓 Author

**Abhishek Rajput** — BTech CSE, Bennett University
[LinkedIn](https://www.linkedin.com/in/abhishek-rajput-304b2a320/) • [GitHub](https://github.com/akhhhh)
