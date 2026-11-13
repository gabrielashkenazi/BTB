# ON sound vote

Public page where anyone with the link listens to 22 candidate payment sounds and 3 music tracks for ON, rates them 1–5, marks up to 3 favorites, and sees the live ranking. Voting is anonymous: each browser gets a random id.

## Deploy on Netlify

1. Netlify → **Add new site** → **Import an existing project** → GitHub → `gabrielashkenazi/BTB`.
2. **Base directory:** `on-sounds` (leave build command empty; publish directory and functions come from `netlify.toml`).
3. Deploy.

Votes are stored in Netlify Blobs (store `on-sound-votes`) by `netlify/functions/vote.mjs`; `netlify/functions/results.mjs` returns only aggregated counts.

## Files

- `index.html` – the page
- `sounds/` – the 22 sound candidates (WAV, 44.1 kHz) and 3 music tracks (MP4, played as audio)
- `lib/sounds.mjs` – the list of valid sound ids, shared by both functions
