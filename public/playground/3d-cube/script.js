import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/controls/OrbitControls.js';

window.addEventListener('contextmenu', (e) => e.preventDefault());

const canvas = document.querySelector('#bg');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 8);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// --- Fixed background grid (screen-filling plane) ---
const gridHelper = new THREE.GridHelper(20, 20, 0x223322, 0x112211);
gridHelper.position.y = -3;
scene.add(gridHelper);

// X axis
const axisLength = 10;
function makeLine(from, to, color) {
  const geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(...from),
    new THREE.Vector3(...to)
  ]);
  return new THREE.Line(geo, new THREE.LineBasicMaterial({ color }));
}
scene.add(makeLine([-axisLength, 0, 0], [axisLength, 0, 0], 0x442222));
scene.add(makeLine([0, -axisLength, 0], [0, axisLength, 0], 0x224422));
scene.add(makeLine([0, 0, -axisLength], [0, 0, axisLength], 0x222244));

// --- Wireframe cube ---
const geometry = new THREE.BoxGeometry(2, 2, 2);
const edges = new THREE.EdgesGeometry(geometry);
const cube = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
scene.add(cube);

// Invisible hit mesh for raycasting
const hitBox = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide })
);
scene.add(hitBox);

// --- Controls — orbit around fixed origin, never follows cube ---
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

// --- Drag state ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const dragPlane = new THREE.Plane();
const intersection = new THREE.Vector3();
const offset = new THREE.Vector3();
let isDragging = false;

window.addEventListener('mousedown', (e) => {
  if (e.button !== 2) return;

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObject(hitBox);
  if (hits.length === 0) return;

  isDragging = true;
  controls.enabled = false;

  // Drag plane perpendicular to camera through cube center
  const camDir = new THREE.Vector3();
  camera.getWorldDirection(camDir);
  dragPlane.setFromNormalAndCoplanarPoint(camDir, cube.position);

  raycaster.ray.intersectPlane(dragPlane, intersection);
  offset.copy(intersection).sub(cube.position);
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
    const newPos = intersection.sub(offset);

    // Move only along camera's screen-space X and Y
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
  if (e.button !== 2 || !isDragging) return;

  isDragging = false;

  // Re-enable controls — target stays at origin, camera doesn't move
  controls.enableDamping = false;
  controls.update();
  controls.enabled = true;
  requestAnimationFrame(() => { controls.enableDamping = true; });
});

// --- Animate ---
function animate() {
  requestAnimationFrame(animate);
  if (!isDragging) controls.update();
  renderer.render(scene, camera);
}
animate();

// --- Resize ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// -------------------------
// Reset cube
// -------------------------

const initialCubePosition = new THREE.Vector3(0, 0, 0);
const initialCubeRotation = new THREE.Euler(0, 0, 0);

window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() !== 'r') return;

  cube.position.copy(initialCubePosition);
  cube.rotation.copy(initialCubeRotation);

  hitBox.position.copy(cube.position);
  hitBox.rotation.copy(cube.rotation);
});