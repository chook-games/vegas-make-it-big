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

export function textSprite(text, color, width) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 64;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = 'rgba(6, 8, 16, 0.62)';
    ctx.fillRect(0, 0, 256, 64);
    ctx.strokeStyle = color || '#ffd166';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 252, 60);
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color || '#ffd166';
    ctx.fillText(String(text), 128, 34);
  }
  const tex = new THREE.CanvasTexture(c);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  const w = width || 9;
  sprite.scale.set(w, w / 4, 1);
  return sprite;
}
