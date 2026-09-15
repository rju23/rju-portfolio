import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createOrbitControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.target.set(0, 0, 0); // fixed forever
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: null,
  };
  // One finger orbits; two fingers pinch-zoom. Moving the cube on touch is
  // handled separately by setupCubeDrag (a two-finger drag over the cube).
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY,
  };
  controls.update();
  return controls;
}

// Desktop: right-click + drag. Touch: two-finger drag over the cube (there's
// no right-click equivalent on a touchscreen). Both move the cube along the
// camera's screen-space X/Y plane. Returns a state object so the animate
// loop can skip controls.update() while dragging.
export function setupCubeDrag({ camera, controls, cube, hitBox }) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const dragPlane = new THREE.Plane();
  const intersection = new THREE.Vector3();
  const offset = new THREE.Vector3();
  const state = { isDragging: false };

  function hitTestAt(x, y) {
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    return raycaster.intersectObject(hitBox).length > 0;
  }

  function beginDrag(x, y) {
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    state.isDragging = true;
    controls.enabled = false;

    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    dragPlane.setFromNormalAndCoplanarPoint(camDir, cube.position);

    raycaster.ray.intersectPlane(dragPlane, intersection);
    offset.copy(intersection).sub(cube.position);
  }

  function updateDrag(x, y) {
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
      const newPos = intersection.sub(offset);

      const right = new THREE.Vector3();
      const up = new THREE.Vector3();
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);
      right.crossVectors(camDir, camera.up).normalize();
      up.crossVectors(right, camDir).normalize();

      const dx = newPos.dot(right) - cube.position.dot(right);
      const dy = newPos.dot(up) - cube.position.dot(up);

      cube.position.addScaledVector(right, dx);
      cube.position.addScaledVector(up, dy);
      hitBox.position.copy(cube.position);
      hitBox.rotation.copy(cube.rotation);
    }
  }

  function endDrag() {
    state.isDragging = false;

    // Re-enable controls — target stays at origin, camera doesn't move
    controls.enableDamping = false;
    controls.update();
    controls.enabled = true;
    requestAnimationFrame(() => { controls.enableDamping = true; });
  }

  // --- Desktop: right-click + drag ---
  window.addEventListener('contextmenu', (e) => e.preventDefault());

  window.addEventListener('mousedown', (e) => {
    if (e.button !== 2) return;
    if (!hitTestAt(e.clientX, e.clientY)) return;
    beginDrag(e.clientX, e.clientY);
  });

  window.addEventListener('mousemove', (e) => {
    if (!state.isDragging) return;
    updateDrag(e.clientX, e.clientY);
  });

  window.addEventListener('mouseup', (e) => {
    if (e.button !== 2 || !state.isDragging) return;
    endDrag();
  });

  // --- Touch: two-finger drag over the cube ---
  const activeTouches = new Map(); // pointerId -> {x, y}

  function midpoint() {
    const pts = [...activeTouches.values()];
    return {
      x: (pts[0].x + pts[1].x) / 2,
      y: (pts[0].y + pts[1].y) / 2,
    };
  }

  window.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'touch') return;
    activeTouches.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activeTouches.size === 2 && !state.isDragging) {
      const mid = midpoint();
      if (hitTestAt(mid.x, mid.y)) beginDrag(mid.x, mid.y);
    }
  });

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'touch' || !activeTouches.has(e.pointerId)) return;
    activeTouches.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (state.isDragging && activeTouches.size === 2) {
      const mid = midpoint();
      updateDrag(mid.x, mid.y);
    }
  });

  function releaseTouch(e) {
    if (e.pointerType !== 'touch') return;
    activeTouches.delete(e.pointerId);
    if (state.isDragging && activeTouches.size < 2) endDrag();
  }

  window.addEventListener('pointerup', releaseTouch);
  window.addEventListener('pointercancel', releaseTouch);

  return state;
}
