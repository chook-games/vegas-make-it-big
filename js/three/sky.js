import { scene } from './scene.js';
import { state } from '../core/state.js';

const group = new THREE.Group();
group.visible = false;
scene.add(group);

const uniforms = {
  topColor: { value: new THREE.Color(0x2a6fdb) },
  bottomColor: { value: new THREE.Color(0x7fb2ff) },
  offset: { value: 12 },
  exponent: { value: 0.7 }
};

const skyMat = new THREE.ShaderMaterial({
  uniforms,
  side: THREE.BackSide,
  depthWrite: false,
  vertexShader: `
    varying vec3 vWorld;
    void main() {
      vec4 wp = modelMatrix * vec4(position, 1.0);
      vWorld = wp.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    varying vec3 vWorld;
    void main() {
      float h = normalize(vWorld + vec3(0.0, offset, 0.0)).y;
      gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
    }
  `
});

const dome = new THREE.Mesh(new THREE.SphereGeometry(120, 32, 16), skyMat);
group.add(dome);

const starGeo = new THREE.BufferGeometry();
const starCount = 600;
const positions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  const r = 100;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(Math.random() * 0.9 + 0.05);
  positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  positions[i * 3 + 1] = r * Math.cos(phi) + 5;
  positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
}
starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.4, transparent: true, opacity: 0, depthWrite: false });
const stars = new THREE.Points(starGeo, starMat);
group.add(stars);

const sun = new THREE.Mesh(new THREE.SphereGeometry(6, 16, 16), new THREE.MeshBasicMaterial({ color: 0xfff1a8 }));
const sunGlow = new THREE.Mesh(new THREE.SphereGeometry(11, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false }));
sun.add(sunGlow);
group.add(sun);

const moon = new THREE.Mesh(new THREE.SphereGeometry(4, 16, 16), new THREE.MeshBasicMaterial({ color: 0xdfe8ff }));
const moonGlow = new THREE.Mesh(new THREE.SphereGeometry(7, 16, 16), new THREE.MeshBasicMaterial({ color: 0x9fb4ff, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false }));
moon.add(moonGlow);
group.add(moon);

function lerpColor(a, b, t) {
  return new THREE.Color(a.r + (b.r - a.r) * t, a.g + (b.g - a.g) * t, a.b + (b.b - a.b) * t);
}

const dayTop = new THREE.Color(0x3d8bef);
const dayBottom = new THREE.Color(0xd6e8ff);
const nightTop = new THREE.Color(0x101a33);
const nightBottom = new THREE.Color(0x24304f);
const duskBottom = new THREE.Color(0xffa45c);

export function updateSky(hour, nightAmount) {
  group.visible = state.mode === 'exterior';
  if (!group.visible) return;

  let top = lerpColor(nightTop, dayTop, 1 - nightAmount);
  let bottom = lerpColor(nightBottom, dayBottom, 1 - nightAmount);
  const dusk = Math.max(0, 1 - Math.abs(hour - 19) / 3);
  bottom = lerpColor(bottom, duskBottom, dusk * 0.6);

  uniforms.topColor.value.copy(top);
  uniforms.bottomColor.value.copy(bottom);
  starMat.opacity = Math.max(0, nightAmount - 0.25) * 1.2;

  const sunAngle = ((hour - 6) / 12) * Math.PI;
  sun.position.set(Math.cos(sunAngle) * 70, Math.sin(sunAngle) * 60 + 5, -40);
  sun.visible = Math.sin(sunAngle) > -0.2;
  moon.position.set(-Math.cos(sunAngle) * 70, -Math.sin(sunAngle) * 55 + 8, 40);
  moon.visible = Math.sin(sunAngle) <= 0.2;
}

export function skyGroup() {
  return group;
}
