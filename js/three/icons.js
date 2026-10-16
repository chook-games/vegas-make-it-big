const cache = {};

export function iconTexture(emoji) {
  if (cache[emoji]) return cache[emoji];
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 64, 64);
    ctx.font = '46px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 32, 38);
  }
  const tex = new THREE.CanvasTexture(c);
  cache[emoji] = tex;
  return tex;
}

export const CATEGORY_ICON = {
  gamble: '🎰',
  food: '🍽️',
  drink: '🍸',
  restroom: '🚻',
  fun: '🎡',
  rest: '🛏️',
  leaving: '💤'
};
