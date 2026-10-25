import { camera, renderer } from './scene.js';
import { state } from '../core/state.js';

function lim() {
  return Math.max(100, Math.floor(state.gridSize / 2) * state.tileSize + 2);
}

export const camTarget = new THREE.Vector3(0, 0, 1.5);
let camRadius = 58;
let camElevation = 0.92;
let camAngle = Math.PI / 4;
let camTargetAngle = Math.PI / 4;
const keys = new Set();

export function updateCameraPosition() {
  camera.position.x = camTarget.x + camRadius * Math.sin(camAngle) * Math.cos(camElevation);
  camera.position.y = camTarget.y + camRadius * Math.sin(camElevation);
  camera.position.z = camTarget.z + camRadius * Math.cos(camAngle) * Math.cos(camElevation);
  camera.lookAt(camTarget);
}

export function rotateCameraStep() {
  camTargetAngle += Math.PI / 2;
}

export function wanderStep(dt) {
  camTargetAngle += dt * 0.00025;
}

function panBy(dxPix, dyPix, factor) {
  const cs = Math.cos(camAngle);
  const sn = Math.sin(camAngle);
  camTarget.x -= (dxPix * cs - dyPix * sn) * factor;
  camTarget.z += (dxPix * sn + dyPix * cs) * factor;
  const l = lim();
  camTarget.x = Math.max(-l, Math.min(l, camTarget.x));
  camTarget.z = Math.max(-l, Math.min(l, camTarget.z));
  updateCameraPosition();
}

export function updateCamera(dtMs) {
  if (Math.abs(camTargetAngle - camAngle) > 0.005) {
    camAngle += (camTargetAngle - camAngle) * 0.12;
    updateCameraPosition();
  }

  if (keys.size && dtMs) {
    const speed = 0.035 * dtMs;
    const fx = -Math.sin(camAngle), fz = -Math.cos(camAngle);
    const rx = Math.cos(camAngle), rz = -Math.sin(camAngle);
    let mx = 0, mz = 0;
    if (keys.has('ArrowUp')) { mx += fx; mz += fz; }
    if (keys.has('ArrowDown')) { mx -= fx; mz -= fz; }
    if (keys.has('ArrowRight')) { mx += rx; mz += rz; }
    if (keys.has('ArrowLeft')) { mx -= rx; mz -= rz; }
    if (mx || mz) {
      const l = lim();
      camTarget.x = Math.max(-l, Math.min(l, camTarget.x + mx * speed));
      camTarget.z = Math.max(-l, Math.min(l, camTarget.z + mz * speed));
      updateCameraPosition();
    }
  }
}

export function focusOn(worldX, worldZ) {
  camTarget.x = Math.max(-lim(), Math.min(lim(), worldX));
  camTarget.z = Math.max(-lim(), Math.min(lim(), worldZ));
  updateCameraPosition();
}

const raycaster = new THREE.Raycaster();
const pointerVec = new THREE.Vector2();

export function screenRay(clientX, clientY) {
  pointerVec.x = (clientX / window.innerWidth) * 2 - 1;
  pointerVec.y = -(clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointerVec, camera);
  return raycaster;
}

export function initControls(opts) {
  const o = opts || {};
  const onTap = o.onTap || (() => {});
  const onHover = o.onHover || (() => {});
  const onDesktopClick = o.onDesktopClick || onTap;
  const onRightClick = o.onRightClick || (() => {});
  const dom = renderer.domElement;

  let isDragging = false;
  let startX = 0, startY = 0, lastX = 0, lastY = 0;
  let pinchDist = 0;
  let lastTouch = 0;
  let rightDown = false, rightDragged = false, rightLastX = 0, rightLastY = 0;

  const hovering = () => state.selectedTool || state.pendingPlacement;

  dom.addEventListener('touchstart', (e) => {
    lastTouch = Date.now();
    if (e.touches.length === 1) {
      isDragging = false;
      startX = lastX = e.touches[0].clientX;
      startY = lastY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      isDragging = true;
      pinchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }, { passive: false });

  dom.addEventListener('touchmove', (e) => {
    lastTouch = Date.now();
    e.preventDefault();
    if (e.touches.length === 1) {
      const cx = e.touches[0].clientX;
      const cy = e.touches[0].clientY;
      if (Math.hypot(cx - startX, cy - startY) > 10) isDragging = true;
      if (isDragging) panBy(cx - lastX, cy - lastY, 0.045);
      lastX = cx; lastY = cy;
    } else if (e.touches.length === 2) {
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      camRadius = Math.max(12, Math.min(150, camRadius + (pinchDist - newDist) * 0.06));
      pinchDist = newDist;
      updateCameraPosition();
    }
  }, { passive: false });

  dom.addEventListener('touchend', (e) => {
    lastTouch = Date.now();
    if (!isDragging && e.changedTouches.length === 1) {
      onTap(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
  });

  let mouseDown = false;
  dom.addEventListener('mousedown', (e) => {
    if (Date.now() - lastTouch < 600) return;
    if (e.button === 2) {
      rightDown = true;
      rightDragged = false;
      rightLastX = e.clientX;
      rightLastY = e.clientY;
      e.preventDefault();
      return;
    }
    if (e.button !== 0) return;
    mouseDown = true;
    isDragging = false;
    startX = lastX = e.clientX;
    startY = lastY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if (rightDown) {
      const dx = e.clientX - rightLastX;
      const dy = e.clientY - rightLastY;
      if (Math.abs(dx) + Math.abs(dy) > 2) rightDragged = true;
      camAngle += dx * 0.008;
      camTargetAngle = camAngle;
      camElevation = Math.max(0.32, Math.min(1.35, camElevation - dy * 0.004));
      updateCameraPosition();
      rightLastX = e.clientX;
      rightLastY = e.clientY;
      return;
    }
    if (Date.now() - lastTouch < 600) return;
    if (!mouseDown) {
      if (hovering() && e.target === dom) onHover(e.clientX, e.clientY);
      return;
    }
    if (Math.hypot(e.clientX - startX, e.clientY - startY) > 6) isDragging = true;
    if (isDragging) panBy(e.clientX - lastX, e.clientY - lastY, 0.045);
    lastX = e.clientX; lastY = e.clientY;
  });

  window.addEventListener('mouseup', (e) => {
    if (e.button === 2) {
      if (rightDown && !rightDragged) onRightClick();
      rightDown = false;
      return;
    }
    if (Date.now() - lastTouch < 600) return;
    if (mouseDown && !isDragging && e.target === dom) {
      onDesktopClick(e.clientX, e.clientY);
    }
    mouseDown = false;
  });

  dom.addEventListener('contextmenu', (e) => e.preventDefault());

  dom.addEventListener('wheel', (e) => {
    camRadius = Math.max(12, Math.min(150, camRadius + e.deltaY * 0.02));
    updateCameraPosition();
  }, { passive: true });

  window.addEventListener('keydown', (e) => {
    if (e.key.startsWith('Arrow')) { keys.add(e.key); e.preventDefault(); }
  });
  window.addEventListener('keyup', (e) => {
    if (e.key.startsWith('Arrow')) keys.delete(e.key);
  });

  updateCameraPosition();
}
