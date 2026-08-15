import * as THREE from 'three';

// --- Hover & click interaction state ---
const baseColor = new THREE.Color(0x00ff00);
const hoverColor = new THREE.Color(0x66ff66);

export function setCubeColor(cube, hitBox, hex) {
  baseColor.setHex(hex);
  hoverColor.copy(baseColor).lerp(new THREE.Color(0xffffff), 0.3);
  cube.material.color.copy(baseColor);
  hitBox.material.color.copy(baseColor);
}

let pulseStart = null;
const PULSE_DURATION = 300; // ms
const PULSE_SCALE = 1.15;

export function createCube() {
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const edges = new THREE.EdgesGeometry(geometry);
  return new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
}

// Invisible hit mesh for raycasting (drag interaction, hover/click in later phases)
export function createHitBox() {
  return new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({
      visible: false,
      color: 0x00ff00,
      roughness: 0.4,
      metalness: 0.3,
    })
  );
}

export function createSolidEdges() {
  const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2, 2));
  const line  = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.25,
  }));
  line.visible = false;
  return line;
}

export const initialCubeState = {
  position: new THREE.Vector3(0, 0, 0),
  rotation: new THREE.Euler(0, 0, 0),
};

export function resetCube(cube, hitBox) {
  cube.position.copy(initialCubeState.position);
  cube.rotation.copy(initialCubeState.rotation);
  cube.scale.set(1, 1, 1);
  cube.visible = true;
  baseColor.setHex(0x00ff00);
  cube.material.color.copy(baseColor);
  hitBox.material.visible = false;
  hitBox.castShadow = false;
  hitBox.receiveShadow = false;
  hitBox.scale.set(1, 1, 1);
  hitBox.position.copy(cube.position);
  hitBox.rotation.copy(cube.rotation);
  pulseStart = null;
}

// Hover (color) + click (pulse) + double-click (reset)
export function setupCubeInteractions({ camera, cube, hitBox }) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let downPos = null;

  function hitTest(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    return raycaster.intersectObject(hitBox).length > 0;
  }

  window.addEventListener('mousemove', () => {
    document.body.style.cursor = 'default';
  });

  // Manual click detection (not native 'click') so orbiting the camera
  // over the cube doesn't accidentally trigger a pulse on mouseup.
  window.addEventListener('mousedown', (e) => {
    if (e.button === 0) downPos = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', (e) => {
    if (e.button !== 0 || !downPos) return;
    const moved = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
    downPos = null;
    if (moved > 5) return; // was an orbit drag, not a click
    if (hitTest(e)) pulseStart = performance.now();
  });

  // double-click reset removed
}

// Call every frame from the animate loop to drive the pulse animation
export function updateCubePulse(cube, hitBox) {
  if (pulseStart === null) return;

  const elapsed = performance.now() - pulseStart;
  if (elapsed >= PULSE_DURATION) {
    cube.scale.set(1, 1, 1);
    hitBox.scale.set(1, 1, 1);
    pulseStart = null;
    return;
  }

  const t = elapsed / PULSE_DURATION;
  const scale = 1 + Math.sin(t * Math.PI) * (PULSE_SCALE - 1);
  cube.scale.setScalar(scale);
  hitBox.scale.setScalar(scale);
}
