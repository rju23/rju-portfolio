import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// Real extruded 3D letters standing on the ground plane, like signage set
// back behind the cube — not a camera-facing overlay. Triggered by
// EnvironmentManager whenever a transition starts, whether from the
// automatic timer or a manual weather pick.

const FONT_URL = 'https://cdn.jsdelivr.net/npm/three@0.158/examples/fonts/helvetiker_bold.typeface.json';
const GROUND_Y = -3; // matches createGrid()'s position.y
const LINES = ['WEATHER', 'CHANGING'];
const FONT_SIZE = 1.1;
const EXTRUDE_DEPTH = 0.5;

function buildLineMesh(font, text, material) {
  const geometry = new TextGeometry(text, {
    font,
    size: FONT_SIZE,
    height: EXTRUDE_DEPTH,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.035,
    bevelSegments: 2,
  });
  geometry.computeBoundingBox();
  geometry.computeVertexNormals();

  const width = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
  const height = geometry.boundingBox.max.y - geometry.boundingBox.min.y;

  const mesh = new THREE.Mesh(geometry, material);
  // Center each line horizontally; caller stacks lines vertically.
  mesh.position.x = -width / 2;
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return { mesh, width, height };
}

export class WeatherChangeText {
  constructor(scene) {
    this.group = new THREE.Group();
    this.group.visible = false;
    scene.add(this.group);

    this._active = false;
    this._elapsed = 0;
    this._duration = 0;
    this._pendingTrigger = null;
    this._ready = false;

    this._material = new THREE.MeshStandardMaterial({
      color: 0xf4faff,
      emissive: 0x2a5a8a,
      emissiveIntensity: 0.35,
      metalness: 0.25,
      roughness: 0.35,
      transparent: true,
      opacity: 0,
    });

    new FontLoader().load(FONT_URL, (font) => {
      const lineGap = FONT_SIZE * 0.35;
      const lineMeshes = LINES.map((text) => buildLineMesh(font, text, this._material));
      const totalHeight = lineMeshes.reduce((sum, l) => sum + l.height, 0) + lineGap * (lineMeshes.length - 1);

      // Stack lines top-to-bottom, whole block resting on the ground.
      let y = totalHeight;
      lineMeshes.forEach(({ mesh, height }) => {
        y -= height;
        mesh.position.y = y;
        this.group.add(mesh);
        y -= lineGap;
      });

      // Set back and off to the side so it reads as background signage next
      // to the cube rather than overlapping it.
      this.group.position.set(-8, GROUND_Y, -15);
      this._ready = true;

      if (this._pendingTrigger !== null) {
        this.trigger(this._pendingTrigger);
        this._pendingTrigger = null;
      }
    });
  }

  // Called once when a weather transition begins.
  trigger(durationMs) {
    if (!this._ready) {
      this._pendingTrigger = durationMs;
      return;
    }
    this.group.visible = true;
    this._active = true;
    this._elapsed = 0;
    this._duration = durationMs;
  }

  tick(deltaMs) {
    if (!this._active) return;

    this._elapsed += deltaMs;
    const t = Math.min(1, this._elapsed / this._duration);

    // Rise up out of the ground, hold, then sink back down.
    let opacity;
    let rise;
    if (t < 0.15) {
      const s = t / 0.15;
      opacity = s;
      rise = s;
    } else if (t < 0.8) {
      opacity = 1;
      rise = 1;
    } else if (t < 1) {
      const s = (t - 0.8) / 0.2;
      opacity = 1 - s;
      rise = 1 - s * 0.4;
    } else {
      opacity = 0;
      rise = 0;
    }

    this._material.opacity = opacity;
    this.group.scale.y = Math.max(0.001, rise);

    // Slow turntable so the letters read as real geometry from any orbit angle.
    this.group.rotation.y = Math.sin(this._elapsed / 4000) * 0.15;

    if (t >= 1) {
      this._active = false;
      this.group.visible = false;
      this.group.scale.y = 1;
    }
  }

  dispose() {
    this.group.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
    });
    this._material.dispose();
  }
}
