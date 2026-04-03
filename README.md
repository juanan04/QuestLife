# Quest Life

An RPG-style personal productivity app. Turn your goals into quests, build daily habits, and level up your character as you complete real-world tasks.

> **Requires a Supabase account.** There is no offline or local-only mode — all data is stored in your own Supabase project.

---

## Features

- **Quest Board** — Organize goals into acts. Each quest has a category, difficulty rating, and XP reward.
- **Habit Tracker** — Log daily habits and visualize streaks with a heatmap.
- **XP & Leveling System** — Earn experience points by completing quests and habits. Watch your level and rank grow.
- **Weekly Stats Chart** — A bar chart showing XP earned each day of the current week.
- **Mind Map** — An interactive canvas that renders all your quests as a node graph with pan and zoom.
- **Data Export** — Download your quest and habit data as JSON at any time.
- **Secure by default** — All data is isolated per user via Supabase Row Level Security (RLS).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Backend / Auth / DB | Supabase |
| Routing | React Router 6 |
| Charts | Recharts |
| Icons | Lucide React |

---

## Prerequisites

- **Node.js 18 or later** — [nodejs.org](https://nodejs.org)
- **A Supabase account (free tier works)** — [supabase.com](https://supabase.com)

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/juanan04/QuestLife.git
cd QuestLife
```

### 2. Configure environment variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Open `.env.local` and replace the placeholder values:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

You can find both values in your Supabase project under **Settings → API**.

### 3. Initialize the database

1. Go to your Supabase project dashboard.
2. Open **SQL Editor**.
3. Paste the entire contents of `supabase/schema.sql` and click **Run**.

This creates the `profiles`, `quests`, `habits`, and `xp_log` tables, enables Row Level Security on all of them, and sets up a trigger that automatically creates a player profile when a new user is added.

> User accounts are managed directly from the Supabase dashboard (**Authentication → Users → Add user**). There is no sign-up form in the app.

### 4. Install dependencies

```bash
npm install
```

### 5. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Deploy to Vercel

1. Push your fork to GitHub. Make sure `.env.local` is **not** committed — it is already excluded by `.gitignore`.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project → Import Git Repository**.
3. During the import, add the following **Environment Variables** in the Vercel dashboard:

   | Variable | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | Your Supabase project URL |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

4. Vercel detects Vite automatically. The default build settings work without changes:
   - Build command: `vite build`
   - Output directory: `dist`

5. Click **Deploy**.

---

## Project Structure

```
QuestLife/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── dashboard/    # PlayerStats, XPBar, ActiveQuests, WeeklyChart
│   │   ├── habits/       # HabitTracker, HabitCard, HabitHeatmap
│   │   ├── layout/       # Sidebar, Header
│   │   ├── mindmap/      # MindMapCanvas, QuestNode, QuestEdge
│   │   ├── quests/       # QuestBoard, QuestCard, ActSection, QuestEditModal
│   │   ├── stats/        # StatsPage
│   │   └── ui/           # Card, Badge, ProgressBar, DifficultyStars, XPPopup
│   ├── context/
│   │   └── GameContext.jsx   # Global state provider
│   ├── data/
│   │   ├── initialData.js    # Seed data: 27 quests, 7 habits
│   │   └── supabaseClient.js # Supabase client initialization
│   ├── hooks/
│   │   ├── useAuth.js        # Authentication state
│   │   ├── useGameData.js    # Data sync with Supabase
│   │   └── useXP.js          # XP animation logic
│   ├── pages/                # Dashboard, QuestBoard, Habits, Stats, MindMap, Login
│   └── utils/
│       ├── questHelpers.js   # Quest filtering and unlocking utilities
│       └── xpCalculator.js   # XP and level calculation functions
├── supabase/
│   └── schema.sql            # Full database schema — run this in Supabase SQL Editor
├── .env.example              # Environment variable template
├── CHANGELOG.md
├── LICENSE
└── README.md
```

---

## License

MIT — see [LICENSE](./LICENSE) for details.
