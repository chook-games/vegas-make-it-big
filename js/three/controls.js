import { camera, renderer } from './scene.js';
import { state } from '../core/state.js';

function lim() {
  return Math.floor(state.gridSize / 2) * state.tileSize + 2;
}

export const camTarget = new THREE.Vector3(0, 0, 1.5);
let camRadius = 21;
let camElevation = 0.85;
let camAngle = Math.PI / 4;
let camTargetAngle = Math.PI / 4;

export function updateCameraPosition() {
  camera.position.x = camTarget.x + camRadius * Math.sin(camAngle) * Math.cos(camElevation);
  camera.position.y = camTarget.y + camRadius * Math.sin(camElevation);
  camera.position.z = camTarget.z + camRadius * Math.cos(camAngle) * Math.cos(camElevation);
  camera.lookAt(camTarget);
}

export function rotateCameraStep() {
  camTargetAngle += Math.PI / 2;
}

export function updateCamera() {
  if (Math.abs(camTargetAngle - camAngle) > 0.005) {
    camAngle += (camTargetAngle - camAngle) * 0.12;
    updateCameraPosition();
  }
}

export function focusOn(worldX, worldZ) {
  camTarget.x = Math.max(-lim(), Math.min(lim(), worldX));
  camTarget.z = Math.max(-lim(), Math.min(lim() + 1, worldZ));
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

export function initControls(onTap) {
  const tap = onTap || (() => {});
  const dom = renderer.domElement;

  let isDragging = false;
  let startX = 0, startY = 0, lastX = 0, lastY = 0;
  let pinchDist = 0;
  let lastTouch = 0;

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
      if (isDragging) {
        camTarget.x = Math.max(-lim(), Math.min(lim(), camTarget.x - (cx - lastX) * 0.032));
        camTarget.z = Math.max(-lim(), Math.min(lim() + 1, camTarget.z - (cy - lastY) * 0.032));
        updateCameraPosition();
      }
      lastX = cx; lastY = cy;
    } else if (e.touches.length === 2) {
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      camRadius = Math.max(12, Math.min(32, camRadius + (pinchDist - newDist) * 0.045));
      pinchDist = newDist;
      updateCameraPosition();
    }
  }, { passive: false });

  dom.addEventListener('touchend', (e) => {
    lastTouch = Date.now();
    if (!isDragging && e.changedTouches.length === 1) {
      tap(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
  });

  let mouseDown = false;
  dom.addEventListener('mousedown', (e) => {
    if (Date.now() - lastTouch < 600) return;
    mouseDown = true;
    isDragging = false;
    startX = lastX = e.clientX;
    startY = lastY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!mouseDown || Date.now() - lastTouch < 600) return;
    if (Math.hypot(e.clientX - startX, e.clientY - startY) > 6) isDragging = true;
    if (isDragging) {
      camTarget.x = Math.max(-lim(), Math.min(lim(), camTarget.x - (e.clientX - lastX) * 0.03));
      camTarget.z = Math.max(-lim(), Math.min(lim() + 1, camTarget.z - (e.clientY - lastY) * 0.03));
      updateCameraPosition();
    }
    lastX = e.clientX; lastY = e.clientY;
  });

  window.addEventListener('mouseup', (e) => {
    if (Date.now() - lastTouch < 600) return;
    if (mouseDown && !isDragging && e.target === dom) {
      tap(e.clientX, e.clientY);
    }
    mouseDown = false;
  });

  dom.addEventListener('wheel', (e) => {
    camRadius = Math.max(12, Math.min(32, camRadius + e.deltaY * 0.015));
    updateCameraPosition();
  });

  updateCameraPosition();
}
