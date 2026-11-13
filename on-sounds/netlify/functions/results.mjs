// GET /api/results -> { voters, stats: { [soundId]: { sum, n, favs } } }
// Aggregates every stored ballot. Individual ballots are never returned.
import { getStore } from '@netlify/blobs';
import { SOUND_IDS, STORE_NAME, json } from '../../lib/sounds.mjs';

const BATCH = 50; // parallel reads per round

export default async (req) => {
  if (req.method !== 'GET') return json({ error: 'method_not_allowed' }, 405, { allow: 'GET' });

  const store = getStore({ name: STORE_NAME, consistency: 'strong' });
  const { blobs } = await store.list();

  const stats = Object.fromEntries(SOUND_IDS.map((id) => [id, { sum: 0, n: 0, favs: 0 }]));
  let voters = 0;

  for (let i = 0; i < blobs.length; i += BATCH) {
    const ballots = await Promise.all(blobs.slice(i, i + BATCH).map((b) => store.get(b.key, { type: 'json' })));
    for (const ballot of ballots) {
      if (!ballot) continue;
      let counted = false;
      for (const [id, n] of Object.entries(ballot.ratings ?? {})) {
        if (stats[id] && Number.isInteger(n) && n >= 1 && n <= 5) { stats[id].sum += n; stats[id].n += 1; counted = true; }
      }
      for (const id of ballot.favorites ?? []) {
        if (stats[id]) { stats[id].favs += 1; counted = true; }
      }
      if (counted) voters += 1;
    }
  }

  return json({ voters, stats, updatedAt: new Date().toISOString() }, 200, { 'cache-control': 'public, max-age=10' });
};

export const config = { path: '/api/results' };
