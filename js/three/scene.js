import { state } from '../core/state.js';

export const container = document.getElementById('canvas-container');

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x090614);
scene.fog = new THREE.FogExp2(0x090614, 0.022);

export const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 160);

export const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = state.settings.shadows;
container.appendChild(renderer.domElement);

export const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

export const dirLight = new THREE.DirectionalLight(0xffe6aa, 0.85);
dirLight.position.set(12, 22, 14);
dirLight.castShadow = state.settings.shadows;
dirLight.shadow.mapSize.set(1024, 1024);
scene.add(dirLight);

export const neonPointLight = new THREE.PointLight(0xff2a85, 1.1, 30);
neonPointLight.position.set(0, 8, 0);
scene.add(neonPointLight);

export const exteriorGroup = new THREE.Group();
export const interiorGroup = new THREE.Group();
interiorGroup.visible = false;
scene.add(exteriorGroup);
scene.add(interiorGroup);

export const pickableTilesExt = [];
export const pickableTilesInt = [];
export const animatedObjects = [];
export const vehicles = [];
export const walkers = [];

export const inspectRing = new THREE.Mesh(
  new THREE.RingGeometry(0.85, 1.05, 24),
  new THREE.MeshBasicMaterial({ color: 0xffd166, side: THREE.DoubleSide })
);
inspectRing.rotation.x = -Math.PI / 2;
inspectRing.position.y = 0.12;
inspectRing.visible = false;
scene.add(inspectRing);

export function applySettings() {
  renderer.shadowMap.enabled = state.settings.shadows;
  dirLight.castShadow = state.settings.shadows;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, state.settings.quality === 'high' ? 2 : 1.25));
}

export function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
