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
  controls.update();
  return controls;
}

// Right-click + drag moves the cube along the camera's screen-space X/Y plane.
// Returns a state object so the animate loop can skip controls.update() while dragging.
export function setupCubeDrag({ camera, controls, cube, hitBox }) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const dragPlane = new THREE.Plane();
  const intersection = new THREE.Vector3();
  const offset = new THREE.Vector3();
  const state = { isDragging: false };

  window.addEventListener('contextmenu', (e) => e.preventDefault());

  window.addEventListener('mousedown', (e) => {
    if (e.button !== 2) return;

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObject(hitBox);
    if (hits.length === 0) return;

    state.isDragging = true;
    controls.enabled = false;

    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    dragPlane.setFromNormalAndCoplanarPoint(camDir, cube.position);

    raycaster.ray.intersectPlane(dragPlane, intersection);
    offset.copy(intersection).sub(cube.position);
  });

  window.addEventListener('mousemove', (e) => {
    if (!state.isDragging) return;

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

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
  });

  window.addEventListener('mouseup', (e) => {
    if (e.button !== 2 || !state.isDragging) return;

    state.isDragging = false;

    // Re-enable controls — target stays at origin, camera doesn't move
    controls.enableDamping = false;
    controls.update();
    controls.enabled = true;
    requestAnimationFrame(() => { controls.enableDamping = true; });
  });

  return state;
}
