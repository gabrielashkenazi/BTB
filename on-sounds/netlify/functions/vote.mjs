// POST /api/vote  { voterId, ratings: { [soundId]: 1-5 }, favorites: [soundId] }
// Saves (replaces) one anonymous voter's ballot. The voter id is a random UUID the page keeps in the browser.
import { getStore } from '@netlify/blobs';
import { SOUND_IDS, MAX_FAVORITES, STORE_NAME, json } from '../../lib/sounds.mjs';

const KNOWN = new Set(SOUND_IDS);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, { allow: 'POST' });

  let body;
  try { body = await req.json(); } catch { return json({ error: 'invalid_json' }, 400); }
  const { voterId, ratings, favorites } = body ?? {};
  if (typeof voterId !== 'string' || !UUID.test(voterId)) return json({ error: 'invalid_voter_id' }, 400);

  const cleanRatings = {};
  if (ratings && typeof ratings === 'object' && !Array.isArray(ratings)) {
    for (const [id, n] of Object.entries(ratings)) {
      if (KNOWN.has(id) && Number.isInteger(n) && n >= 1 && n <= 5) cleanRatings[id] = n;
    }
  }
  const cleanFavorites = [...new Set(Array.isArray(favorites) ? favorites : [])]
    .filter((id) => KNOWN.has(id))
    .slice(0, MAX_FAVORITES);

  const store = getStore({ name: STORE_NAME, consistency: 'strong' });
  await store.setJSON(voterId.toLowerCase(), {
    ratings: cleanRatings,
    favorites: cleanFavorites,
    updatedAt: new Date().toISOString(),
  });
  return json({ ok: true });
};

export const config = { path: '/api/vote' };
