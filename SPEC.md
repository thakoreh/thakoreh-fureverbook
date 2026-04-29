# Pawprints — Dog Memory Journal

## Concept & Vision

Pawprints is a warm, joyful memory journal for dog lovers. It feels like opening a beautifully illustrated scrapbook — soft pastels, hand-drawn dog illustrations, playful typography, and animations that make every scroll feel like a warm hug. The app celebrates the bond between dogs and their humans by preserving precious moments in a format that feels magical and heartwarming.

## Design Language

### Aesthetic Direction
Warm scrapbook meets modern app. Think: a cozy dog's life photo album designed by someone who genuinely loves dogs. Soft, rounded, inviting. Every element should feel like it was drawn with love.

### Color Palette
- `--cream`: #FFF9F5 — page background
- `--peach`: #FFDAB3 — warm accents
- `--pink`: #FFB5C5 — primary actions, highlights
- `--coral`: #FF8A7A — CTAs, important elements
- `--mint`: #B8E8D0 — secondary accents, success states
- `--gold`: #FFD166 — stars, premium features
- `--chocolate`: #5D4037 — headings, primary text
- `--warm-gray`: #8B7355 — secondary text
- `--white`: #FFFFFF — cards, surfaces

### Typography
- Headings: **Fredoka** (Google Fonts) — rounded, playful, warm
- Body: **Nunito** (Google Fonts) — friendly, readable, soft
- Accent: **Caveat** (Google Fonts) — handwritten feel for labels/captions

### Spatial System
- Border radius: 16px (cards), 24px (buttons), 50% (avatars)
- Shadows: soft, warm-toned (`0 4px 20px rgba(93, 64, 55, 0.08)`)
- Spacing: generous — 24px minimum between sections

### Motion Philosophy
- Entrance: fade + slide up (300ms, ease-out)
- Hover: gentle scale (1.02) + shadow lift
- Page transitions: crossfade (200ms)
- Upload: bounce animation on success

### Visual Assets
- Icons: Phosphor Icons (duotone style) — playful weight
- Illustrations: Inline SVG dog illustrations (custom)
- Decorative: paw print patterns, bone shapes, floating elements

## Pages

1. **Landing** (`/`) — Hero with dog illustration, value prop, CTA
2. **Auth** (`/login`, `/signup`) — Split layout: form + dog illustration
3. **Dashboard** (`/dashboard`) — Timeline of memories
4. **New Memory** (`/memories/new`) — Beautiful form with drag-and-drop uploader
5. **Collage Studio** (`/collage`) — Canvas-based collage maker
6. **AI Gallery** (`/ai-gallery`) — Grid of AI-generated art styles
7. **Profile** (`/profile`) — Dog profile with stats

## Features

### Authentication
- Email + password signup/login
- Session persisted via cookies (JWT-like tokens with nanoid)

### Dog Profile
- Name, breed, birthday, photo
- Age calculated automatically
- Memories count tracker

### Memory Creation
- Title + date
- Drag-and-drop zone: multiple photos/videos
- Optional caption/story text
- Mood tag (playful, sleepy, adventurous, cuddly)
- Timeline appears with bounce animation

### Timeline
- Reverse chronological
- Memory cards show: photo grid, title, date, mood tag, caption preview
- Click to expand full memory

### Collage Maker
- Select 2-6 photos
- Choose layout template (grid, scattered, heart, paw)
- Download as PNG

### AI Gallery
- Select a dog photo
- Choose artistic style: Watercolor, Pixar, Oil Painting, Anime, Renaissance, Beach, Cozy Sweater
- Generated via pollinations.ai (free, no API key)
- Results saved to gallery

## Technical Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** with custom theme
- **better-sqlite3** (local SQLite)
- **bcryptjs** (password hashing)
- **nanoid** (ID generation)
- **sharp** (image processing)
- File storage: `/public/uploads`

## API Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/memories`
- `POST /api/memories`
- `GET /api/memories/[id]`
- `DELETE /api/memories/[id]`
- `GET /api/dog`
- `PUT /api/dog`
- `POST /api/ai/generate`
- `POST /api/upload`

## Data Model

```sql
users (id, email, password_hash, name, created_at)
dogs (id, user_id, name, breed, birthday, photo_url, created_at)
memories (id, user_id, dog_id, title, caption, mood, created_at)
media (id, memory_id, file_url, file_type, created_at)
ai_art (id, dog_id, prompt, image_url, style, created_at)
```
