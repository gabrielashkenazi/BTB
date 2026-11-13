// The candidate sound ids. The page and both functions use this list; a vote for any other id is ignored.
export const SOUND_IDS = [
  's01-payment-by-on', 's02-coin-landing', 's03-digital-register', 's04-power-on', 's05-pulse-on',
  's06-tap', 's07-premium', 's08-pop', 's09-jackpot', 's10-rolling-o',
  's11-ching-on', 's12-ching-on-fast', 's13-ching-spoken-on', 's14-ching-on-jackpot',
  's15-payment-by-on-ryan', 's16-payment-by-on-serena', 's17-on-payment-ryan', 's18-on-glass-ryan',
  's19-on-glass-serena', 's20-he-kibalta-glass', 's21-he-hitkabel', 's22-money-groove',
  'm01-music-1', 'm02-music-2', 'm03-music-3',
];
export const MAX_FAVORITES = 3;
export const STORE_NAME = 'on-sound-votes';

export function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  });
}
