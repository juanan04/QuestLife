# Changelog

All notable changes to Quest Life are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2025

### Added
- Mind Map page: interactive canvas visualization of quests as nodes with edges, with pan/zoom support
- XP animation system: floating XP popup on quest and habit completion
- Favicon (SVG)
- XP log synchronization with Supabase on each XP event
- Full Supabase integration: authentication, profiles, quests, habits, and xp_log tables with Row Level Security
- Automatic player profile creation trigger on user registration
- Quest Board organized by acts with difficulty stars and category badges
- Daily habit tracker with heatmap visualization and streak bonuses
- Stats page with weekly XP bar chart
- Data export via JSON popup
- Player stats panel: level, XP bar, and rank display

### Changed
- Removed self-registration (sign-up) flow — login only, accounts managed via Supabase Dashboard

### Infrastructure
- Initial project scaffold: React 18, Vite 6, Tailwind CSS 4, React Router 6, Supabase JS v2
