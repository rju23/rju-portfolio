import * as THREE from 'three';
import { createCube, createHitBox, createSolidEdges, resetCube, setupCubeInteractions, updateCubePulse } from './cube.js';
import { createOrbitControls, setupCubeDrag } from './controls.js';
import { createGrid, createAxes, EnvironmentManager } from './environment.js';
import { ParticleManager } from './particles.js';
import { getRotationSpeed, setupControlPanel, updateEnvUI, setupEnvSelector } from './ui.js';
import { WeatherChangeText } from './weather-text.js';

// Matches the layout breakpoint in style.css. On mobile the 3D scene text
// is skipped entirely in favour of a simple HTML overlay under the intro copy.
const IS_MOBILE = window.innerWidth <= 700;

const canvas = document.querySelector('#bg');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 8);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// --- Environment ---
const particles = new ParticleManager(scene);
const em = new EnvironmentManager(scene, particles);
const clock = new THREE.Clock();

const weatherText = IS_MOBILE ? null : new WeatherChangeText(scene);

const weatherOverlayEl = document.getElementById('weather-changing-overlay');
let weatherOverlayTimer = null;

function triggerWeatherOverlay(durationMs) {
  if (!weatherOverlayEl) return;
  clearTimeout(weatherOverlayTimer);
  weatherOverlayEl.classList.add('visible');
  weatherOverlayTimer = setTimeout(() => weatherOverlayEl.classList.remove('visible'), durationMs * 0.8);
}

em.onTransitionStart = (durationMs) => {
  if (IS_MOBILE) triggerWeatherOverlay(durationMs);
  else weatherText.trigger(durationMs);
};

// --- Static background (Phase 4 replaces this with EnvironmentManager) ---
const grid = createGrid();
scene.add(grid);

const axes = createAxes();
scene.add(axes);

// --- Cube ---
const cube = createCube();
scene.add(cube);

const hitBox = createHitBox();
scene.add(hitBox);

const solidEdges = createSolidEdges();
scene.add(solidEdges);

// --- Controls (orbit + drag) ---
const controls = createOrbitControls(camera, renderer);
const dragState = setupCubeDrag({ camera, controls, cube, hitBox });

// --- Reset (R key) ---
setupCubeInteractions({ camera, cube, hitBox });
setupControlPanel({ cube, hitBox, solidEdges, grid, axes, onReset: () => resetCube(cube, hitBox) });
setupEnvSelector(em);

// --- Animate ---
let animating = true;
function animate() {
  if (!animating) return;
  requestAnimationFrame(animate);
  const delta = clock.getDelta() * 1000; // ms

  if (!dragState.isDragging) controls.update();

  const speed = getRotationSpeed();
  if (speed > 0) {
    cube.rotation.y += speed;
    cube.rotation.x += speed * 0.4;
    hitBox.rotation.copy(cube.rotation);
  }
  solidEdges.position.copy(hitBox.position);
  solidEdges.rotation.copy(hitBox.rotation);
  solidEdges.scale.copy(hitBox.scale);

  em.tick(delta);
  particles.tick(delta);
  weatherText?.tick(delta);
  updateEnvUI(em.getStatus());
  updateCubePulse(cube, hitBox);
  renderer.render(scene, camera);
}
animate();

// --- Dev shortcuts (1–7 to jump environments) ---
const ENV_KEYS = ['sunny', 'sunset', 'night', 'rain', 'thunderstorm', 'snow', 'fog'];
const onKeyDown = (e) => {
  const i = parseInt(e.key) - 1;
  if (i >= 0 && i < ENV_KEYS.length) em.setEnvironment(ENV_KEYS[i]);
};
document.addEventListener('keydown', onKeyDown);

// --- Resize ---
const onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener('resize', onResize);

// --- Cleanup (called by portfolio when navigating away) ---
window.__pk1PlaygroundCleanup = () => {
  animating = false;
  renderer.dispose();
  weatherText?.dispose();
  clearTimeout(weatherOverlayTimer);
  window.removeEventListener('resize', onResize);
  document.removeEventListener('keydown', onKeyDown);
};