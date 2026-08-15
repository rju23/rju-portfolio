import { setCubeColor } from './cube.js';

const SPEEDS = {
  off:    0,
  slow:   0.003,
  normal: 0.008,
  fast:   0.02,
};

const COLORS = {
  green:  0x00ff00,
  cream:  0xfff8e7,
  blue:   0x4499ff,
  orange: 0xff8844,
  white:  0xffffff,
};

let rotationSpeed = 0;

export function getRotationSpeed() {
  return rotationSpeed;
}

function resetPanelUI({ cube, hitBox, solidEdges, grid, axes }) {
  // Color — back to green
  document.querySelectorAll('[data-color]').forEach(s => s.classList.remove('active'));
  const greenSwatch = document.querySelector('[data-color="green"]');
  if (greenSwatch) greenSwatch.classList.add('active');

  // Wireframe — back to on
  cube.visible = true;
  hitBox.material.visible = false;
  if (solidEdges) solidEdges.visible = false;
  activate('wf-on', 'wf-off');

  // Rotation — back to off
  rotationSpeed = 0;
  document.querySelectorAll('[data-speed]').forEach(b => b.classList.remove('active'));
  const offBtn = document.querySelector('[data-speed="off"]');
  if (offBtn) offBtn.classList.add('active');

  // Grid — back to on
  grid.visible = true;
  activate('grid-on', 'grid-off');

  // Axes — back to on
  axes.visible = true;
  activate('axes-on', 'axes-off');
}

export function setupControlPanel({ cube, hitBox, solidEdges, grid, axes, onReset }) {

  // --- Color swatches ---
  document.querySelectorAll('[data-color]').forEach(swatch => {
    swatch.addEventListener('click', () => {
      setCubeColor(cube, hitBox, COLORS[swatch.dataset.color]);
      document.querySelectorAll('[data-color]').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
    });
  });

  // --- Wireframe toggle ---
  document.getElementById('wf-on').addEventListener('click', () => {
    cube.visible = true;
    hitBox.material.visible = false;
    hitBox.castShadow = false;
    hitBox.receiveShadow = false;
    if (solidEdges) solidEdges.visible = false;
    activate('wf-on', 'wf-off');
  });
  document.getElementById('wf-off').addEventListener('click', () => {
    cube.visible = false;
    hitBox.material.visible = true;
    hitBox.castShadow = true;
    hitBox.receiveShadow = true;
    if (solidEdges) solidEdges.visible = true;
    activate('wf-off', 'wf-on');
  });

  // --- Rotation speed ---
  document.querySelectorAll('[data-speed]').forEach(btn => {
    btn.addEventListener('click', () => {
      rotationSpeed = SPEEDS[btn.dataset.speed] ?? 0;
      document.querySelectorAll('[data-speed]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // --- Grid toggle ---
  document.getElementById('grid-on').addEventListener('click', () => {
    grid.visible = true;
    activate('grid-on', 'grid-off');
  });
  document.getElementById('grid-off').addEventListener('click', () => {
    grid.visible = false;
    activate('grid-off', 'grid-on');
  });

  // --- Axes toggle ---
  document.getElementById('axes-on').addEventListener('click', () => {
    axes.visible = true;
    activate('axes-on', 'axes-off');
  });
  document.getElementById('axes-off').addEventListener('click', () => {
    axes.visible = false;
    activate('axes-off', 'axes-on');
  });

  // --- Reset ---
  document.getElementById('btn-reset').addEventListener('click', () => {
    onReset();
    resetPanelUI({ cube, hitBox, solidEdges, grid, axes });
  });
}

function activate(activeId, inactiveId) {
  document.getElementById(activeId).classList.add('active');
  document.getElementById(inactiveId).classList.remove('active');
}

export function updateEnvUI({ name, timer, nextName, transitioning, transitionT }) {
  const fromEl  = document.getElementById('env-name-from');
  const toEl    = document.getElementById('env-name-to');
  const timerEl = document.getElementById('environment-timer');
  if (!fromEl || !toEl) return;
  if (timerEl) timerEl.textContent = timer;

  if (transitioning) {
    fromEl.textContent   = name;
    toEl.textContent     = nextName;
    fromEl.style.opacity = 1 - transitionT;
    toEl.style.opacity   = Math.pow(transitionT, 0.35);
  } else {
    fromEl.textContent   = name;
    fromEl.style.opacity = 1;
    toEl.textContent     = '';
    toEl.style.opacity   = 0;
  }
}

export function setupEnvSelector(em) {
  const btns = document.querySelectorAll('[data-env]');

  function setActive(key) {
    btns.forEach(b => b.classList.toggle('active', b.dataset.env === key));
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      em.setEnvironment(btn.dataset.env);
      setActive(btn.dataset.env);
    });
  });

  em.onEnvironmentChange = (key) => setActive(key);
}