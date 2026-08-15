import * as THREE from 'three';

// ── Grid & Axes ───────────────────────────────────────────────────────────────

export function createGrid() {
  const grid = new THREE.GridHelper(20, 20, 0x223322, 0x112211);
  grid.position.y = -3;
  return grid;
}

export function createAxes() {
  const axisLength = 10;

  function makeLine(from, to, color) {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...from),
      new THREE.Vector3(...to),
    ]);
    return new THREE.Line(geo, new THREE.LineBasicMaterial({ color }));
  }

  const axes = new THREE.Group();
  axes.add(makeLine([-axisLength, 0, 0], [axisLength, 0, 0], 0x442222));
  axes.add(makeLine([0, -axisLength, 0], [0, axisLength, 0], 0x224422));
  axes.add(makeLine([0, 0, -axisLength], [0, 0, axisLength], 0x222244));
  return axes;
}

// ── Environment definitions ───────────────────────────────────────────────────

const ENV_DURATION = 5 * 60 * 1000;

const DEFS = {
  sunny: {
    label: 'SUNNY',
    bg:       new THREE.Color(0x0d1b2a),
    ambient:  { color: new THREE.Color(0xffffff), intensity: 0.7 },
    dir:      { color: new THREE.Color(0xfff5e0), intensity: 1.0, pos: new THREE.Vector3(5, 8, 3) },
    fog:      { color: new THREE.Color(0x0d1b2a), near: 40, far: 100 },
    particles: 'none',
    sunRays:   1.0,
    lightning: false,
  },
  sunset: {
    label: 'SUNSET',
    bg:       new THREE.Color(0x1a0a05),
    ambient:  { color: new THREE.Color(0xff8844), intensity: 0.5 },
    dir:      { color: new THREE.Color(0xff6622), intensity: 0.8, pos: new THREE.Vector3(8, 2, 3) },
    fog:      { color: new THREE.Color(0x1a0a05), near: 20, far: 60 },
    particles: 'none',
    sunRays:   0.7,
    lightning: false,
  },
  night: {
    label: 'NIGHT',
    bg:       new THREE.Color(0x020408),
    ambient:  { color: new THREE.Color(0x334466), intensity: 0.25 },
    dir:      { color: new THREE.Color(0x445566), intensity: 0.2, pos: new THREE.Vector3(-3, 5, -2) },
    fog:      { color: new THREE.Color(0x020408), near: 15, far: 50 },
    particles: 'none',
    sunRays:   0.0,
    lightning: false,
  },
  rain: {
    label: 'RAIN',
    bg:       new THREE.Color(0x080c10),
    ambient:  { color: new THREE.Color(0x667788), intensity: 0.35 },
    dir:      { color: new THREE.Color(0x8899aa), intensity: 0.3, pos: new THREE.Vector3(3, 8, 2) },
    fog:      { color: new THREE.Color(0x080c10), near: 10, far: 35 },
    particles: 'rain',
    sunRays:   0.0,
    lightning: false,
  },
  thunderstorm: {
    label: 'THUNDERSTORM',
    bg:       new THREE.Color(0x050709),
    ambient:  { color: new THREE.Color(0x445566), intensity: 0.2 },
    dir:      { color: new THREE.Color(0x6677aa), intensity: 0.15, pos: new THREE.Vector3(3, 8, 2) },
    fog:      { color: new THREE.Color(0x050709), near: 5, far: 20 },
    particles: 'rain-heavy',
    sunRays:   0.0,
    lightning: true,
  },
  snow: {
    label: 'SNOW',
    bg:       new THREE.Color(0x0a0f15),
    ambient:  { color: new THREE.Color(0xaabbcc), intensity: 0.5 },
    dir:      { color: new THREE.Color(0xccddee), intensity: 0.4, pos: new THREE.Vector3(3, 8, 2) },
    fog:      { color: new THREE.Color(0x0a0f15), near: 12, far: 40 },
    particles: 'snow',
    sunRays:   0.0,
    lightning: false,
  },
  fog: {
    label: 'FOG',
    bg:       new THREE.Color(0x0c1015),
    ambient:  { color: new THREE.Color(0x889aaa), intensity: 0.4 },
    dir:      { color: new THREE.Color(0x99aacc), intensity: 0.25, pos: new THREE.Vector3(3, 8, 2) },
    fog:      { color: new THREE.Color(0x0c1015), near: 2, far: 12 },
    particles: 'fog',
    sunRays:   0.0,
    lightning: false,
    haze:      0.75,
  },
};

const CYCLE = ['sunny', 'sunset', 'night', 'rain', 'thunderstorm', 'snow', 'fog'];

// ── Lightning ─────────────────────────────────────────────────────────────────

class LightningController {
  constructor() {
    this.active      = false;
    this._elapsed    = 0;
    this._boltIndex  = 0;
    this._bolts      = ['bolt-1', 'bolt-2', 'bolt-3']
                         .map(id => document.getElementById(id))
                         .filter(Boolean);
  }

  enable() {
    this.active   = true;
    this._elapsed = 0;
  }

  disable() {
    this.active = false;
    this._bolts.forEach(b => b.style.opacity = '0');
  }

  tick(delta) {
    if (!this.active) return;
    this._elapsed += delta;

    if (this._elapsed >= 4000) {
      this._elapsed = 0;
      const bolt = this._bolts[this._boltIndex % this._bolts.length];
      this._boltIndex++;

      bolt.style.opacity = '1';
      setTimeout(() => { bolt.style.opacity = '0'; }, 120);
    }
  }
}

// ── EnvironmentManager ────────────────────────────────────────────────────────

export class EnvironmentManager {
  constructor(scene, particleManager) {
    this.scene        = scene;
    this._particles   = particleManager;
    this._cycleIndex  = 0;
    this.currentKey   = CYCLE[0];
    this._elapsed     = 0;
    this._sunRaysEl   = document.querySelector('.sun-rays');
    this._hazeEl      = document.querySelector('.haze-overlay');

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.set(1024, 1024);
    this.dirLight.shadow.camera.near   =  0.5;
    this.dirLight.shadow.camera.far    = 50;
    this.dirLight.shadow.camera.left   = -5;
    this.dirLight.shadow.camera.right  =  5;
    this.dirLight.shadow.camera.top    =  5;
    this.dirLight.shadow.camera.bottom = -5;
    scene.add(this.dirLight);

    const shadowFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.ShadowMaterial({ opacity: 0.35 })
    );
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = -3;
    shadowFloor.receiveShadow = true;
    scene.add(shadowFloor);

    this._transitioning  = false;
    this._transitionT    = 0;
    this._fromDef        = null;
    this._nextKey        = null;
    this._rainToStorm    = false;

    this._lightning = new LightningController();
    this._restore();
    this._apply(DEFS[this.currentKey]);
  }

  _restore() {
    try {
      const saved = JSON.parse(localStorage.getItem('env-state'));
      if (saved && CYCLE.includes(saved.key)) {
        this.currentKey  = saved.key;
        this._cycleIndex = CYCLE.indexOf(saved.key);
        this._elapsed    = saved.elapsed ?? 0;
      }
    } catch(e) {}
  }

  _save() {
    try {
      localStorage.setItem('env-state', JSON.stringify({
        key:     this.currentKey,
        elapsed: this._elapsed,
      }));
    } catch(e) {}
  }

  _startTransition(toKey) {
    this._fromDef       = DEFS[this.currentKey];
    this._nextKey       = toKey;
    this._transitioning = true;
    this._transitionT   = 0;

    const fromP = this._fromDef.particles;
    const toP   = DEFS[toKey].particles;

    // rain → thunderstorm: rain already at full, just add lightning
    this._rainToStorm = (fromP === 'rain' && toP === 'rain-heavy');

    // Lightning starts immediately on thunderstorm entry
    if (toKey === 'thunderstorm') {
      this._lightning.enable();
    } else {
      this._lightning.disable();
    }

    if (!this.scene.fog) {
      this.scene.fog = new THREE.Fog(
        this._fromDef.fog.color.clone(),
        this._fromDef.fog.near,
        this._fromDef.fog.far
      );
    }
  }

  _tickTransition(deltaMs) {
    const DURATION = 15000;
    this._transitionT += deltaMs / DURATION;

    if (this._transitionT >= 1) {
      this._transitioning  = false;
      this.currentKey      = this._nextKey;
      this._cycleIndex     = CYCLE.indexOf(this.currentKey);
      this._apply(DEFS[this.currentKey]);
      return;
    }

    const t    = this._transitionT;
    const from = this._fromDef;
    const to   = DEFS[this._nextKey];

    // Background
    this.scene.background = from.bg.clone().lerp(to.bg, t);

    // Ambient light
    this.ambientLight.color.lerpColors(from.ambient.color, to.ambient.color, t);
    this.ambientLight.intensity = from.ambient.intensity +
      (to.ambient.intensity - from.ambient.intensity) * t;

    // Dir light
    this.dirLight.color.lerpColors(from.dir.color, to.dir.color, t);
    this.dirLight.intensity = from.dir.intensity +
      (to.dir.intensity - from.dir.intensity) * t;
    this.dirLight.position.lerpVectors(from.dir.pos, to.dir.pos, t);

    // Fog
    this.scene.fog.color.lerpColors(from.fog.color, to.fog.color, t);
    this.scene.fog.near = from.fog.near + (to.fog.near - from.fog.near) * t;
    this.scene.fog.far  = from.fog.far  + (to.fog.far  - from.fog.far)  * t;

    // Sun rays
    if (this._sunRaysEl) {
      this._sunRaysEl.style.opacity =
        from.sunRays + (to.sunRays - from.sunRays) * t;
    }

    // Haze
    if (this._hazeEl) {
      const fromH = from.haze ?? 0;
      const toH   = to.haze   ?? 0;
      this._hazeEl.style.opacity = fromH + (toH - fromH) * t;
    }

    // Particles — gradual build up / fade out
    const fromP = this._fromDef.particles;
    const toP   = to.particles;

    if (this._rainToStorm) {
      // rain → thunderstorm: keep rain at full, build heavy rain after midpoint
      if (t < 0.5) {
        this._particles.showWithDensity('rain', 1.0);
      } else {
        this._particles.hideType('rain');
        this._particles.showWithDensity('rain-heavy', Math.min(1, (t - 0.5) * 2));
      }
    } else {
      // Fade out from-particles over first half
      if (fromP !== 'none') {
        const outD = Math.max(0, 1 - t * 2);
        if (outD > 0) this._particles.showWithDensity(fromP, outD);
        else          this._particles.hideType(fromP);
      }
      // Fade in to-particles from t=0.3 onward
      if (toP !== 'none') {
        const inD = t < 0.3 ? 0 : Math.min(1, (t - 0.3) / 0.7);
        if (inD > 0) this._particles.showWithDensity(toP, inD);
      }
    }
  }

  _apply(def) {
    this.scene.background = def.bg.clone();
    this.scene.fog = new THREE.Fog(def.fog.color, def.fog.near, def.fog.far);

    this.ambientLight.color.copy(def.ambient.color);
    this.ambientLight.intensity = def.ambient.intensity;
    this.dirLight.color.copy(def.dir.color);
    this.dirLight.intensity = def.dir.intensity;
    this.dirLight.position.copy(def.dir.pos);

    this._particles.show(def.particles);

    if (this._sunRaysEl) {
      this._sunRaysEl.style.opacity = def.sunRays;
    }
    if (this._hazeEl) {
      this._hazeEl.style.opacity = def.haze ?? 0;
    }

    if (def.lightning) {
      this._lightning.enable();
    } else {
      this._lightning.disable();
    }
  }

  tick(deltaMs) {
    if (this._transitioning) {
      this._tickTransition(deltaMs);
      this._lightning.tick(deltaMs);
      return;
    }

    // Animate fog depth when settled in fog env
    if (this.currentKey === 'fog' && this.scene.fog) {
      const t = Date.now() / 1000;
      this.scene.fog.near = 5 + Math.sin(t * 0.25) * 1.5;
      this.scene.fog.far  = 18 + Math.sin(t * 0.18) * 4;
    }

    this._elapsed += deltaMs;
    if (this._elapsed >= ENV_DURATION) {
      this._elapsed = 0;
      const nextIndex = (this._cycleIndex + 1) % CYCLE.length;
      this._startTransition(CYCLE[nextIndex]);
    }
    if (Math.floor(this._elapsed / 2000) !== Math.floor((this._elapsed - deltaMs) / 2000)) {
      this._save();
    }

    this._lightning.tick(deltaMs);
  }

  getStatus() {
    if (this._transitioning) {
      return {
        name:          DEFS[this.currentKey].label,
        timer:         '—',
        nextName:      DEFS[this._nextKey].label,
        transitioning: true,
        transitionT:   this._transitionT,
      };
    }

    const remaining = Math.max(0, ENV_DURATION - this._elapsed);
    const mins = Math.floor(remaining / 60000).toString().padStart(2, '0');
    const secs = Math.floor((remaining % 60000) / 1000).toString().padStart(2, '0');
    const nextKey = CYCLE[(this._cycleIndex + 1) % CYCLE.length];
    return {
      name:          DEFS[this.currentKey].label,
      timer:         `${mins}:${secs}`,
      nextName:      DEFS[nextKey].label,
      transitioning: false,
    };
  }

  setEnvironment(key) {
    if (!DEFS[key]) return;
    this._cycleIndex = CYCLE.indexOf(key);
    this._elapsed    = 0;
    this._startTransition(key);
  }
}