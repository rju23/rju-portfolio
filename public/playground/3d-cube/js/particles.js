import * as THREE from 'three';

const BOUNDS = { x: 15, y: 15, z: 15 };
const FLOOR  = -3;

function rand(min, max) { return Math.random() * (max - min) + min; }

// ── Rain ─────────────────────────────────────────────────────────────────────

class RainSystem {
  constructor(scene, count) {
    this.count = count;
    const pos  = new Float32Array(count * 3);
    this._vel  = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i*3]     = rand(-BOUNDS.x, BOUNDS.x);
      pos[i*3 + 1] = rand(FLOOR, FLOOR + BOUNDS.y);
      pos[i*3 + 2] = rand(-BOUNDS.z, BOUNDS.z);
      this._vel[i] = rand(0.1, 0.2);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    this.points = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0x8899bb, size: 0.05, transparent: true, opacity: 0.6,
    }));
    this.points.visible = false;
    scene.add(this.points);
  }

  tick(delta) {
    if (!this.points.visible) return;
    const attr = this.points.geometry.attributes.position;
    const arr  = attr.array;
    const dt   = delta / 16;

    for (let i = 0; i < this.count; i++) {
      arr[i*3 + 1] -= this._vel[i] * dt;
      if (arr[i*3 + 1] < FLOOR) {
        arr[i*3]     = rand(-BOUNDS.x, BOUNDS.x);
        arr[i*3 + 1] = FLOOR + BOUNDS.y;
        arr[i*3 + 2] = rand(-BOUNDS.z, BOUNDS.z);
      }
    }
    attr.needsUpdate = true;
  }

  setOpacity(density) {
    this.points.visible = density > 0;
    if (density > 0) this.points.material.opacity = 0.6 * density;
  }
  show() { this.setOpacity(1); }
  hide() { this.points.visible = false; }
}

// ── Snow ─────────────────────────────────────────────────────────────────────

class SnowSystem {
  constructor(scene) {
    const count  = 600;
    this.count   = count;
    this._time   = 0;
    const pos    = new Float32Array(count * 3);
    this._vel    = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i*3]       = rand(-BOUNDS.x, BOUNDS.x);
      pos[i*3 + 1]   = rand(FLOOR, FLOOR + BOUNDS.y);
      pos[i*3 + 2]   = rand(-BOUNDS.z, BOUNDS.z);
      this._vel[i*3]     = rand(-0.004, 0.004);
      this._vel[i*3 + 1] = rand(0.008, 0.022);
      this._vel[i*3 + 2] = rand(-0.004, 0.004);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    this.points = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xddeeff, size: 0.09, transparent: true, opacity: 0.8,
    }));
    this.points.visible = false;
    scene.add(this.points);
  }

  tick(delta) {
    if (!this.points.visible) return;
    this._time += delta;
    const attr = this.points.geometry.attributes.position;
    const arr  = attr.array;
    const dt   = delta / 16;
    const t    = this._time;

    for (let i = 0; i < this.count; i++) {
      arr[i*3]     += this._vel[i*3]     * dt + Math.sin(t * 0.001 + i) * 0.0008;
      arr[i*3 + 1] -= this._vel[i*3 + 1] * dt;
      arr[i*3 + 2] += this._vel[i*3 + 2] * dt;
      if (arr[i*3 + 1] < FLOOR) {
        arr[i*3]     = rand(-BOUNDS.x, BOUNDS.x);
        arr[i*3 + 1] = FLOOR + BOUNDS.y;
        arr[i*3 + 2] = rand(-BOUNDS.z, BOUNDS.z);
      }
    }
    attr.needsUpdate = true;
  }

  setOpacity(density) {
    this.points.visible = density > 0;
    if (density > 0) this.points.material.opacity = 0.8 * density;
  }
  show() { this.setOpacity(1); }
  hide() { this.points.visible = false; }
}

// ── Fog ──────────────────────────────────────────────────────────────────────

class FogSystem {
  constructor(scene) {
    const count  = 80;
    this.count   = count;
    const pos    = new Float32Array(count * 3);
    this._vel    = new Float32Array(count * 2);

    for (let i = 0; i < count; i++) {
      pos[i*3]       = rand(-BOUNDS.x, BOUNDS.x);
      pos[i*3 + 1]   = rand(FLOOR, FLOOR + BOUNDS.y * 0.5);
      pos[i*3 + 2]   = rand(-BOUNDS.z, BOUNDS.z);
      this._vel[i*2]     = rand(-0.004, 0.004);
      this._vel[i*2 + 1] = rand(-0.004, 0.004);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    this.points = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0x8899aa, size: 1.8, transparent: true, opacity: 0.07,
    }));
    this.points.visible = false;
    scene.add(this.points);
  }

  tick(delta) {
    if (!this.points.visible) return;
    const attr = this.points.geometry.attributes.position;
    const arr  = attr.array;
    const dt   = delta / 16;

    for (let i = 0; i < this.count; i++) {
      arr[i*3]     += this._vel[i*2]     * dt;
      arr[i*3 + 2] += this._vel[i*2 + 1] * dt;
      if (arr[i*3]     >  BOUNDS.x) arr[i*3]     = -BOUNDS.x;
      if (arr[i*3]     < -BOUNDS.x) arr[i*3]     =  BOUNDS.x;
      if (arr[i*3 + 2] >  BOUNDS.z) arr[i*3 + 2] = -BOUNDS.z;
      if (arr[i*3 + 2] < -BOUNDS.z) arr[i*3 + 2] =  BOUNDS.z;
    }
    attr.needsUpdate = true;
  }

  setOpacity(density) {
    this.points.visible = density > 0;
    if (density > 0) this.points.material.opacity = 0.07 * density;
  }
  show() { this.setOpacity(1); }
  hide() { this.points.visible = false; }
}

// ── ParticleManager ───────────────────────────────────────────────────────────

export class ParticleManager {
  constructor(scene) {
    this._rain      = new RainSystem(scene, 1500);
    this._rainHeavy = new RainSystem(scene, 2500);
    this._snow      = new SnowSystem(scene);
    this._fog       = new FogSystem(scene);
  }

  _sys(type) {
    if (type === 'rain')       return this._rain;
    if (type === 'rain-heavy') return this._rainHeavy;
    if (type === 'snow')       return this._snow;
    if (type === 'fog')        return this._fog;
    return null;
  }

  show(type) {
    [this._rain, this._rainHeavy, this._snow, this._fog].forEach(s => s.hide());
    const sys = this._sys(type);
    if (sys) sys.show();
  }

  showWithDensity(type, density) {
    const sys = this._sys(type);
    if (sys) sys.setOpacity(density);
  }

  hideType(type) {
    const sys = this._sys(type);
    if (sys) sys.hide();
  }

  tick(delta) {
    this._rain.tick(delta);
    this._rainHeavy.tick(delta);
    this._snow.tick(delta);
    this._fog.tick(delta);
  }
}