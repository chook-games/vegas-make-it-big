import { animatedObjects } from './scene.js';

export const scaleFor = (level) => 1 + (level - 1) * 0.25;

export function std(color, opts) {
  return new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.5 }, opts || {}));
}
export function bas(color) {
  return new THREE.MeshBasicMaterial({ color });
}
export function glow(color, opacity) {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: opacity == null ? 0.7 : opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
}
export function box(w, h, d, material) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
}
export function cyl(rt, rb, h, seg, material) {
  return new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), material);
}
export function at(obj, x, y, z) {
  obj.position.set(x, y, z);
  return obj;
}
export function spin(obj) {
  animatedObjects.push({ mesh: obj, type: 'spin' });
}
export function cone(r, h, seg, material) {
  return new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), material);
}
export function sphere(r, seg, material) {
  return new THREE.Mesh(new THREE.SphereGeometry(r, seg, seg), material);
}
