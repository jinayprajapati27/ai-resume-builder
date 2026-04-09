# 🧠 ResumeAI — AI-Powered Resume Builder

> Build clean, professional, ATS-optimized resumes in under 30 seconds using a 3-agent AI pipeline powered by Google Gemini.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000?logo=express)
![EJS](https://img.shields.io/badge/EJS-5.x-B4CA65)
![Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?logo=google&logoColor=white)

---

## 🎯 Features

- **3-Agent AI Pipeline** — Structuring → ATS Optimization → Formatting, powered by Google Gemini
- **Premium Dark UI** — Kodama Grove theme with earthy tones, glassmorphic floating navbar, subtle grid backgrounds
- **Multiple Resume Templates** — Executive (serif), Modern (sans-serif, green accents), Minimal (clean, understated)
- **Dual Export** — Download as **PDF** (via html2pdf.js) or **DOCX** (via html-docx-js)
- **Form Persistence** — All form data saved to `localStorage`, survives page refreshes
- **Dynamic Sections** — Add/remove unlimited work experiences, projects, and education entries
- **LinkedIn Integration** — Optional LinkedIn URL included in resume header
- **Responsive Design** — Fully responsive across desktop, tablet, and mobile

---

## 📂 Project Structure

```
resume_builder/
├── server.js                    # Express entry point, route registration
├── package.json                 # Dependencies & scripts
├── .gitignore                   # Git ignore rules
│
├── routes/
│   └── resumeRoutes.js          # POST /api/resume/generate
│
├── controllers/
│   └── resumeController.js      # Request handler, calls AI orchestrator
│
├── services/
│   ├── aiOrchestrator.js        # 3-agent pipeline orchestration + retry logic
│   └── agents/
│       ├── structuringAgent.js  # Agent 1: Structures raw input → JSON
│       ├── atsAgent.js          # Agent 2: ATS keyword optimization
│       └── formattingAgent.js   # Agent 3: Final formatting & polish
│
├── views/
│   ├── layout.ejs               # Shared layout (navbar, footer, meta)
│   ├── index.ejs                # Landing page (hero section)
│   ├── form.ejs                 # Resume builder form (standalone page)
│   ├── preview.ejs              # Resume preview + export (standalone page)
│   └── templates/
│       ├── executive.ejs        # Executive resume template
│       ├── modern.ejs           # Modern resume template
│       ├── minimal.ejs          # Minimal resume template
│       └── professional.ejs     # Professional resume template
│
└── public/
    ├── css/
    │   └── style.css            # 🎨 Kodama Grove design system (shared)
    └── js/
        └── main.js              # Client-side utilities
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or later
- **Google Gemini API Key** — [Get one here](https://aistudio.google.com/apikey)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/resume_builder.git
cd resume_builder

# 2. Install dependencies
npm install

# 3. Create environment file
echo GEMINI_API_KEY=your_api_key_here > .env

# 4. Start development server
npm run dev
```

The app will be running at **http://localhost:3000**

---

## 🗺️ Routes

| Route | Method | Description |
|---|---|---|
| `/` | GET | Landing page with hero section |
| `/create` | GET | Resume builder form |
| `/preview` | GET | Resume preview + export page |
| `/api/resume/generate` | POST | AI pipeline — generates structured resume JSON |
| `/health` | GET | Health check endpoint |

---

## 🤖 AI Pipeline

The resume generation uses a **3-agent chain** architecture:

```
Raw User Input
      │
      ▼
┌─────────────────────┐
│  Structuring Agent   │  Parses free-text into structured JSON
│  (Agent 1)           │  (personal, experience, projects, education, skills)
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  ATS Agent           │  Enhances with ATS-friendly keywords,
│  (Agent 2)           │  action verbs, and industry terms
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Formatting Agent    │  Final polish: consistency, grammar,
│  (Agent 3)           │  formatting, and professional tone
└─────────┬───────────┘
          │
          ▼
    Structured JSON → Preview Page → PDF / DOCX Export
```

Each agent call includes:
- **JSON validation** with markdown code-block stripping
- **Automatic retry** (1 retry on failure)
- **Error propagation** with descriptive messages

---

## 🎨 Design System — Kodama Grove

The app uses a warm, earthy dark theme defined in `/public/css/style.css`:

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#3a3529` | Page background |
| `--card` | `#413c33` | Section cards |
| `--primary` | `#8a9f7b` | Buttons, accents, links |
| `--primary-fg` | `#2a2521` | Text on primary buttons |
| `--text` | `#ede4d4` | Primary text |
| `--text-muted` | `#a8a096` | Secondary text |
| `--border` | `#5a5345` | Borders and dividers |
| `--accent` | `#a18f5c` | Golden accent |
| `--destructive` | `#b5766a` | Delete/remove actions |

**Fonts:** Merriweather (headings), Inter (UI), EB Garamond (resume body), JetBrains Mono (code)

---

## 📄 Resume Templates

| Template | Style | Font | Best For |
|---|---|---|---|
| **Executive** | Classic serif, centered header, black borders | EB Garamond | Senior/C-level roles |
| **Modern** | Sans-serif, green accent borders & titles | Inter | Tech & creative roles |
| **Minimal** | Clean sans-serif, left-aligned, light borders | Inter | Startup & design roles |

Templates are switched instantly on the preview page via CSS classes (`t-modern`, `t-minimal`).

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| `express` | 5.x | Web framework |
| `ejs` | 5.x | Server-side templating |
| `@google/generative-ai` | 0.24+ | Google Gemini AI SDK |
| `dotenv` | 17.x | Environment variable management |
| `nodemon` | 3.x | Dev server auto-reload |

**Client-side CDNs:**
- `html2pdf.js` — PDF export
- `html-docx-js` — DOCX export
- `FileSaver.js` — File download helper

---

## 🛠️ Scripts

```bash
npm run dev      # Start with nodemon (auto-reload)
npm start        # Production start
```

---

## 🔒 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `PORT` | ❌ | Server port (default: 3000) |


## 📝 License

ISC License

---

<p align="center">
  Built with ❤️ using Node.js, Express, EJS, and Google Gemini AI
</p>
