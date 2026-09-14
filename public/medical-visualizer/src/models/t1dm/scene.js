import { MAJOR_AUTOANTIGENS } from './data.js'

// Cellular simulation for the T1DM model: a small islet of β-cells that
// CD8+ T cells and B cells / plasma cells / antibodies move through and
// interact with, drawn on a 2D canvas. Deliberately not a flowchart —
// the pathway information lives in data.js / the explanation panel;
// this file only owns positions, motion and state transitions.

const BETA_RADIUS = 26
const TCELL_RADIUS = 11
const BCELL_RADIUS = 11
const PLASMA_RADIUS = 15
const ANTIBODY_RADIUS = 5

const CONTACT_GAP = 10
const RECOGNITION_TIME = 0.9
const ATTACK_TIME = 0.8
const DEATH_ANIM_TIME = 1.1
const MAX_ANTIBODIES = 10
const ANTIBODY_LIFESPAN = 14

function dist(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by)
}

function randRange(min, max) {
  return min + Math.random() * (max - min)
}

function layoutBetaCells(cx, cy, count, spread) {
  const cells = []
  let placed = 0
  let r = 0

  while (placed < count) {
    const countInRing = r === 0 ? 1 : 6 * r
    const take = Math.min(countInRing, count - placed)
    const radius = r * spread

    for (let i = 0; i < take; i++) {
      const angle = (i / take) * Math.PI * 2 + r * 0.4
      cells.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius
      })
      placed++
    }

    r++
  }

  return cells
}

export function createScene(container, { onEntityClick }) {
  const canvas = document.createElement('canvas')
  canvas.className = 't1dm-canvas'
  container.appendChild(canvas)
  const ctx = canvas.getContext('2d')

  let width = 0
  let height = 0
  let islet = { cx: 0, cy: 0, spread: 60 }
  let plasmaZone = { x: 0, y: 0 }

  function resize() {
    width = container.clientWidth
    height = Math.max(360, container.clientHeight)
    canvas.width = width
    canvas.height = height
    islet = { cx: width * 0.42, cy: height * 0.48, spread: Math.min(70, width * 0.09) }
    plasmaZone = { x: width * 0.85, y: height * 0.82 }
  }

  resize()
  const resizeObserver = new ResizeObserver(() => resize())
  resizeObserver.observe(container)

  // --- state ---------------------------------------------------------
  let betaCells = []
  let tCells = []
  let bCells = []
  let plasmaCells = []
  let antibodies = []
  let initialBetaCount = 9
  let killCount = 0
  let simTime = 0
  let nextTSpawn = 2.5
  let nextBSpawn = 4
  let antigenCycle = 0
  let playing = true
  let studyMode = false
  let savedLiveState = null
  let rafId = null
  let lastTs = null

  function spawnEdgePosition() {
    const side = Math.floor(Math.random() * 4)
    if (side === 0) return { x: -20, y: randRange(0, height) }
    if (side === 1) return { x: width + 20, y: randRange(0, height) }
    if (side === 2) return { x: randRange(0, width), y: -20 }
    return { x: randRange(0, width), y: height + 20 }
  }

  function resetLiveSimulation() {
    betaCells = layoutBetaCells(islet.cx, islet.cy, initialBetaCount, islet.spread).map((pos, i) => ({
      id: `beta-${i}`,
      x: pos.x,
      y: pos.y,
      r: BETA_RADIUS,
      alive: true,
      state: 'healthy', // healthy | targeted | damaged | dying
      mhcActive: false,
      deathTimer: 0,
      opacity: 1
    }))
    tCells = []
    bCells = []
    plasmaCells = []
    antibodies = []
    killCount = 0
    simTime = 0
    nextTSpawn = 3
    nextBSpawn = 4.5
    antigenCycle = 0
  }

  resetLiveSimulation()

  function aliveBetaCells() {
    return betaCells.filter((b) => b.alive && b.state !== 'dying')
  }

  function pickUntargetedBeta() {
    const candidates = aliveBetaCells().filter((b) => b.state === 'healthy')
    if (candidates.length === 0) return null
    return candidates[Math.floor(Math.random() * candidates.length)]
  }

  function spawnTCell() {
    const target = pickUntargetedBeta()
    if (!target) return
    const pos = spawnEdgePosition()
    target.state = 'targeted'
    target.mhcActive = true
    tCells.push({
      id: `t-${Math.random().toString(36).slice(2, 8)}`,
      x: pos.x,
      y: pos.y,
      state: 'approaching', // approaching | recognition | attacking | retreating
      targetId: target.id,
      timer: 0,
      opacity: 1
    })
  }

  function spawnBCell() {
    const target = pickUntargetedBeta()
    if (!target) return
    const pos = spawnEdgePosition()
    bCells.push({
      id: `b-${Math.random().toString(36).slice(2, 8)}`,
      x: pos.x,
      y: pos.y,
      state: 'approaching', // approaching | recognizing | migrating
      targetId: target.id,
      timer: 0
    })
  }

  function findBeta(id) {
    return betaCells.find((b) => b.id === id)
  }

  function stepEntities(dt) {
    simTime += dt

    if (simTime > nextTSpawn && tCells.length < 1) {
      spawnTCell()
      nextTSpawn = simTime + randRange(3.5, 5.5)
    }

    if (simTime > nextBSpawn && bCells.length < 1) {
      spawnBCell()
      nextBSpawn = simTime + randRange(5, 7.5)
    }

    // --- T cells ---
    tCells.forEach((t) => {
      const target = findBeta(t.targetId)

      if (!target || !target.alive) {
        t.state = 'retreating'
      }

      if (t.state === 'approaching' && target) {
        const d = dist(t.x, t.y, target.x, target.y)
        const contactDist = target.r + TCELL_RADIUS + CONTACT_GAP
        if (d > contactDist) {
          t.x += ((target.x - t.x) / d) * 55 * dt
          t.y += ((target.y - t.y) / d) * 55 * dt
        } else {
          t.state = 'recognition'
          t.timer = 0
        }
      } else if (t.state === 'recognition') {
        t.timer += dt
        if (t.timer > RECOGNITION_TIME) {
          t.state = 'attacking'
          t.timer = 0
          if (target) target.state = 'damaged'
        }
      } else if (t.state === 'attacking') {
        t.timer += dt
        if (t.timer > ATTACK_TIME) {
          if (target) {
            target.state = 'dying'
            target.deathTimer = 0
          }
          killCount++
          t.state = 'retreating'
        }
      } else if (t.state === 'retreating') {
        t.opacity -= dt * 1.2
        t.y -= 30 * dt
      }
    })
    tCells = tCells.filter((t) => t.opacity > 0)

    // --- B cells ---
    bCells.forEach((b) => {
      const target = findBeta(b.targetId)

      if (b.state === 'approaching' && target) {
        const d = dist(b.x, b.y, target.x, target.y)
        const contactDist = target.r + BCELL_RADIUS + CONTACT_GAP
        if (d > contactDist) {
          b.x += ((target.x - b.x) / d) * 50 * dt
          b.y += ((target.y - b.y) / d) * 50 * dt
        } else {
          b.state = 'recognizing'
          b.timer = 0
        }
      } else if (b.state === 'recognizing') {
        b.timer += dt
        if (b.timer > RECOGNITION_TIME) {
          b.state = 'migrating'
        }
      } else if (b.state === 'migrating') {
        const d = dist(b.x, b.y, plasmaZone.x, plasmaZone.y)
        if (d > 6) {
          b.x += ((plasmaZone.x - b.x) / d) * 60 * dt
          b.y += ((plasmaZone.y - b.y) / d) * 60 * dt
        } else {
          plasmaCells.push({
            id: `plasma-${Math.random().toString(36).slice(2, 8)}`,
            x: plasmaZone.x,
            y: plasmaZone.y,
            emitTimer: randRange(0, 1)
          })
          b.state = 'done'
        }
      }
    })
    bCells = bCells.filter((b) => b.state !== 'done')

    // --- Plasma cells: emit antibodies ---
    plasmaCells.forEach((p) => {
      p.emitTimer += dt
      if (p.emitTimer > 2.6 && antibodies.length < MAX_ANTIBODIES) {
        p.emitTimer = 0
        const antigen = MAJOR_AUTOANTIGENS[antigenCycle % MAJOR_AUTOANTIGENS.length]
        antigenCycle++
        const angle = randRange(0, Math.PI * 2)
        antibodies.push({
          id: `ab-${Math.random().toString(36).slice(2, 8)}`,
          x: p.x,
          y: p.y,
          angle,
          age: 0,
          antigenId: antigen.id,
          orbitTarget: null
        })
      }
    })

    // --- Antibodies: drift, gently associate with a β-cell, never attack ---
    antibodies.forEach((a) => {
      a.age += dt

      if (!a.orbitTarget) {
        const alive = aliveBetaCells()
        if (alive.length > 0 && Math.random() < 0.01) {
          a.orbitTarget = alive[Math.floor(Math.random() * alive.length)].id
        }
      }

      const target = a.orbitTarget ? findBeta(a.orbitTarget) : null

      if (target && target.alive) {
        const orbitRadius = target.r + 20
        a.angle += dt * 0.6
        const ox = target.x + Math.cos(a.angle) * orbitRadius
        const oy = target.y + Math.sin(a.angle) * orbitRadius
        a.x += (ox - a.x) * Math.min(1, dt * 2)
        a.y += (oy - a.y) * Math.min(1, dt * 2)
      } else {
        a.orbitTarget = null
        a.angle += dt * 0.4
        a.x += Math.cos(a.angle) * 12 * dt
        a.y += Math.sin(a.angle) * 12 * dt
      }
    })
    antibodies = antibodies.filter((a) => a.age < ANTIBODY_LIFESPAN)

    // --- β-cell death animation ---
    betaCells.forEach((b) => {
      if (b.state === 'dying') {
        b.deathTimer += dt
        b.opacity = Math.max(0, 1 - b.deathTimer / DEATH_ANIM_TIME)
        b.r = BETA_RADIUS * (1 - 0.4 * (b.deathTimer / DEATH_ANIM_TIME))
        if (b.deathTimer > DEATH_ANIM_TIME) {
          b.alive = false
        }
      }
    })
  }

  // --- drawing ---------------------------------------------------------

  function drawBeta(b) {
    if (!b.alive) {
      // faint ghost outline where a β-cell used to be
      ctx.save()
      ctx.globalAlpha = 0.12
      ctx.strokeStyle = '#8892a0'
      ctx.setLineDash([3, 4])
      ctx.beginPath()
      ctx.arc(b.x, b.y, BETA_RADIUS, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
      return
    }

    ctx.save()
    ctx.globalAlpha = emphasisSet ? (emphasisSet.has(b.id) ? 1 : 0.15) : b.opacity

    let fill = 'rgba(68, 170, 255, 0.28)'
    let stroke = '#44aaff'
    if (b.state === 'targeted') stroke = '#ffcc00'
    if (b.state === 'damaged') { fill = 'rgba(255, 102, 102, 0.35)'; stroke = '#ff6666' }
    if (b.state === 'dying') { fill = 'rgba(255, 80, 80, 0.25)'; stroke = '#ff5050' }

    ctx.beginPath()
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
    ctx.fillStyle = fill
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = stroke
    ctx.stroke()

    // insulin granules
    if (b.state !== 'dying') {
      ctx.fillStyle = 'rgba(255, 220, 120, 0.9)'
      const granuleCount = 5
      for (let i = 0; i < granuleCount; i++) {
        const ga = (i / granuleCount) * Math.PI * 2 + b.id.length
        const gx = b.x + Math.cos(ga) * (b.r * 0.45)
        const gy = b.y + Math.sin(ga) * (b.r * 0.45)
        ctx.beginPath()
        ctx.arc(gx, gy, 2.4, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // MHC-I marker glow when targeted/engaged
    if (b.mhcActive && b.state !== 'dying') {
      ctx.beginPath()
      ctx.arc(b.x, b.y - b.r - 6, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#ffcc00'
      ctx.fill()
    }

    ctx.restore()
  }

  function drawTCell(t) {
    const target = findBeta(t.targetId)
    ctx.save()
    ctx.globalAlpha = emphasisSet ? (emphasisSet.has(t.id) ? 1 : 0.15) : t.opacity

    // spiky lymphocyte silhouette
    ctx.fillStyle = '#ff6b6b'
    ctx.beginPath()
    ctx.arc(t.x, t.y, TCELL_RADIUS, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#ff9a9a'
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(t.x + Math.cos(a) * TCELL_RADIUS, t.y + Math.sin(a) * TCELL_RADIUS)
      ctx.lineTo(t.x + Math.cos(a) * (TCELL_RADIUS + 4), t.y + Math.sin(a) * (TCELL_RADIUS + 4))
      ctx.stroke()
    }

    if ((t.state === 'recognition' || t.state === 'attacking') && target) {
      const midX = (t.x + target.x) / 2
      const midY = (t.y + target.y) / 2
      const pulse = 6 + 6 * Math.sin(simTime * 8)

      ctx.beginPath()
      ctx.arc(midX, midY, Math.abs(pulse), 0, Math.PI * 2)
      ctx.strokeStyle = t.state === 'attacking' ? '#ff3333' : '#ffcc00'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = t.state === 'attacking' ? '#ff9a9a' : '#ffe08a'
      ctx.font = '11px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(
        t.state === 'attacking' ? 'cytotoxic attack' : 'TCR ↔ peptide-MHC I',
        midX,
        midY - 14
      )
    }

    ctx.restore()
  }

  function drawBCell(b) {
    const target = findBeta(b.targetId)
    ctx.save()
    ctx.globalAlpha = emphasisSet ? (emphasisSet.has(b.id) ? 1 : 0.15) : 1

    ctx.fillStyle = '#8fd0ff'
    ctx.beginPath()
    ctx.arc(b.x, b.y, BCELL_RADIUS, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#c9e8ff'
    ctx.lineWidth = 1.5
    ctx.stroke()

    if (b.state === 'recognizing' && target) {
      const midX = (b.x + target.x) / 2
      const midY = (b.y + target.y) / 2
      const pulse = 5 + 5 * Math.sin(simTime * 6)

      ctx.beginPath()
      ctx.arc(midX, midY, Math.abs(pulse), 0, Math.PI * 2)
      ctx.strokeStyle = '#66ccff'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = '#bfe6ff'
      ctx.font = '11px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('BCR recognition', midX, midY - 12)
    }

    ctx.restore()
  }

  function drawPlasmaCell(p) {
    ctx.save()
    ctx.fillStyle = '#d59bff'
    ctx.beginPath()
    ctx.ellipse(p.x, p.y, PLASMA_RADIUS * 1.1, PLASMA_RADIUS, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#f0d4ff'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.restore()
  }

  function antigenColor(antigenId) {
    const antigen = MAJOR_AUTOANTIGENS.find((a) => a.id === antigenId)
    return antigen ? antigen.color : '#ffffff'
  }

  function drawAntibody(a) {
    ctx.save()
    const fade = Math.min(1, (ANTIBODY_LIFESPAN - a.age) / 2)
    ctx.globalAlpha = Math.max(0, Math.min(1, fade))
    ctx.strokeStyle = antigenColor(a.antigenId)
    ctx.lineWidth = 1.6

    // simple "Y" shape
    ctx.beginPath()
    ctx.moveTo(a.x, a.y - ANTIBODY_RADIUS)
    ctx.lineTo(a.x, a.y)
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(a.x - ANTIBODY_RADIUS, a.y + ANTIBODY_RADIUS)
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(a.x + ANTIBODY_RADIUS, a.y + ANTIBODY_RADIUS)
    ctx.stroke()
    ctx.restore()
  }

  function render() {
    ctx.clearRect(0, 0, width, height)

    // islet background
    ctx.save()
    ctx.beginPath()
    ctx.arc(islet.cx, islet.cy, islet.spread * 2.4, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(68, 170, 255, 0.05)'
    ctx.fill()
    ctx.restore()

    // plasma zone label
    ctx.save()
    ctx.strokeStyle = 'rgba(213, 155, 255, 0.35)'
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.arc(plasmaZone.x, plasmaZone.y, 40, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = 'rgba(213, 155, 255, 0.7)'
    ctx.font = '11px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('plasma-cell zone', plasmaZone.x, plasmaZone.y + 56)
    ctx.restore()

    betaCells.forEach(drawBeta)
    bCells.forEach(drawBCell)
    tCells.forEach(drawTCell)
    plasmaCells.forEach(drawPlasmaCell)
    antibodies.forEach(drawAntibody)
  }

  // --- emphasis (Study Mode dimming) -----------------------------------
  // Set of entity ids to keep bright during Study Mode; null = no dimming.
  // Read directly by the draw functions above, so no per-entity sync needed.
  let emphasisSet = null

  // --- hit testing -------------------------------------------------------

  function hitTest(x, y) {
    for (const a of antibodies) {
      if (dist(x, y, a.x, a.y) <= ANTIBODY_RADIUS + 6) return { type: 'antibody', entity: a }
    }
    for (const t of tCells) {
      if (dist(x, y, t.x, t.y) <= TCELL_RADIUS + 6) return { type: 'tcell', entity: t }
    }
    for (const b of bCells) {
      if (dist(x, y, b.x, b.y) <= BCELL_RADIUS + 6) return { type: 'bcell', entity: b }
    }
    for (const p of plasmaCells) {
      if (dist(x, y, p.x, p.y) <= PLASMA_RADIUS + 6) return { type: 'plasma-cell', entity: p }
    }
    for (const b of betaCells) {
      if (b.alive && dist(x, y, b.x, b.y) <= b.r) return { type: 'beta-cell', entity: b }
    }
    return null
  }

  function onClick(event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const hit = hitTest(x, y)
    if (hit && onEntityClick) onEntityClick(hit)
  }

  canvas.addEventListener('click', onClick)

  // --- main loop -----------------------------------------------------

  function tick(ts) {
    if (lastTs === null) lastTs = ts
    const dt = Math.min(0.05, (ts - lastTs) / 1000)
    lastTs = ts

    if (playing && !studyMode) {
      stepEntities(dt)
    } else if (studyMode) {
      // keep recognition/attack timers and orbiting animation alive
      // for the scripted scenario without spawning new entities
      stepEntities(dt)
    }

    render()
    rafId = requestAnimationFrame(tick)
  }

  rafId = requestAnimationFrame(tick)

  // --- study mode scenarios -------------------------------------------

  function buildStepScenario(stepId) {
    const cx = islet.cx
    const cy = islet.cy

    const scenarios = {
      antigens: () => {
        betaCells = layoutBetaCells(cx, cy, 3, islet.spread).map((pos, i) => ({
          id: `beta-${i}`, x: pos.x, y: pos.y, r: BETA_RADIUS, alive: true,
          state: 'healthy', mhcActive: false, deathTimer: 0, opacity: 1
        }))
        tCells = []; bCells = []; plasmaCells = []; antibodies = []
        emphasisSet = new Set([betaCells[0].id])
      },
      tolerance: () => {
        betaCells = layoutBetaCells(cx, cy, 3, islet.spread).map((pos, i) => ({
          id: `beta-${i}`, x: pos.x, y: pos.y, r: BETA_RADIUS, alive: true,
          state: 'healthy', mhcActive: false, deathTimer: 0, opacity: 1
        }))
        tCells = []; bCells = []; plasmaCells = []; antibodies = []
        emphasisSet = null
      },
      presentation: () => {
        betaCells = [{ id: 'beta-0', x: cx, y: cy, r: BETA_RADIUS, alive: true, state: 'targeted', mhcActive: true, deathTimer: 0, opacity: 1 }]
        tCells = [{ id: 't-0', x: cx - 140, y: cy, state: 'approaching', targetId: 'beta-0', timer: 0, opacity: 1 }]
        bCells = []; plasmaCells = []; antibodies = []
        emphasisSet = new Set(['beta-0', 't-0'])
      },
      tcell: () => {
        betaCells = [{ id: 'beta-0', x: cx, y: cy, r: BETA_RADIUS, alive: true, state: 'targeted', mhcActive: true, deathTimer: 0, opacity: 1 }]
        tCells = [{ id: 't-0', x: cx + BETA_RADIUS + TCELL_RADIUS + CONTACT_GAP - 2, y: cy, state: 'recognition', targetId: 'beta-0', timer: 0, opacity: 1 }]
        bCells = []; plasmaCells = []; antibodies = []
        emphasisSet = new Set(['beta-0', 't-0'])
      },
      bcell: () => {
        betaCells = [{ id: 'beta-0', x: cx - 60, y: cy, r: BETA_RADIUS, alive: true, state: 'healthy', mhcActive: false, deathTimer: 0, opacity: 1 }]
        tCells = []
        bCells = [{ id: 'b-0', x: cx - 60 + BETA_RADIUS + BCELL_RADIUS + CONTACT_GAP - 2, y: cy, state: 'recognizing', targetId: 'beta-0', timer: 0 }]
        plasmaCells = []
        antibodies = []
        emphasisSet = new Set(['beta-0', 'b-0'])
      },
      loss: () => {
        const cells = layoutBetaCells(cx, cy, 9, islet.spread)
        betaCells = cells.map((pos, i) => ({
          id: `beta-${i}`, x: pos.x, y: pos.y, r: BETA_RADIUS,
          alive: i >= 4, state: i >= 4 ? 'healthy' : 'dying', mhcActive: false,
          deathTimer: i >= 4 ? 0 : DEATH_ANIM_TIME, opacity: i >= 4 ? 1 : 0
        }))
        tCells = [{ id: 't-0', x: cx, y: cy - 90, state: 'retreating', targetId: 'beta-4', timer: 0, opacity: 0.8 }]
        bCells = []
        plasmaCells = [{ id: 'plasma-0', x: plasmaZone.x, y: plasmaZone.y, emitTimer: 0 }]
        antibodies = []
        emphasisSet = null
      },
      deficiency: () => {
        const cells = layoutBetaCells(cx, cy, 9, islet.spread)
        betaCells = cells.map((pos, i) => ({
          id: `beta-${i}`, x: pos.x, y: pos.y, r: BETA_RADIUS,
          alive: i >= 7, state: i >= 7 ? 'healthy' : 'dying', mhcActive: false,
          deathTimer: i >= 7 ? 0 : DEATH_ANIM_TIME, opacity: i >= 7 ? 1 : 0
        }))
        tCells = []; bCells = []
        plasmaCells = [{ id: 'plasma-0', x: plasmaZone.x, y: plasmaZone.y, emitTimer: 0 }]
        antibodies = []
        emphasisSet = null
      },
      metabolic: () => {
        const cells = layoutBetaCells(cx, cy, 9, islet.spread)
        betaCells = cells.map((pos, i) => ({
          id: `beta-${i}`, x: pos.x, y: pos.y, r: BETA_RADIUS,
          alive: i >= 8, state: i >= 8 ? 'healthy' : 'dying', mhcActive: false,
          deathTimer: i >= 8 ? 0 : DEATH_ANIM_TIME, opacity: i >= 8 ? 1 : 0
        }))
        tCells = []; bCells = []; plasmaCells = []; antibodies = []
        emphasisSet = null
      }
    }

    const build = scenarios[stepId] || scenarios.antigens
    build()
    killCount = betaCells.filter((b) => !b.alive).length
    initialBetaCount = betaCells.length
  }

  function enterStudyMode(stepId) {
    if (!studyMode) {
      savedLiveState = { betaCells, tCells, bCells, plasmaCells, antibodies, killCount, initialBetaCount, simTime, nextTSpawn, nextBSpawn, antigenCycle }
    }
    studyMode = true
    buildStepScenario(stepId)
  }

  function setStudyStep(stepId) {
    if (!studyMode) return
    buildStepScenario(stepId)
  }

  function exitStudyMode() {
    if (!studyMode) return
    studyMode = false
    emphasisSet = null
    if (savedLiveState) {
      ;({ betaCells, tCells, bCells, plasmaCells, antibodies, killCount, initialBetaCount, simTime, nextTSpawn, nextBSpawn, antigenCycle } = savedLiveState)
      savedLiveState = null
    }
  }

  // --- public API --------------------------------------------------------

  function setPlaying(next) {
    playing = next
  }

  function restart() {
    resetLiveSimulation()
  }

  function getInsulinFraction() {
    return betaCells.length === 0 ? 1 : aliveBetaCells().length / initialBetaCount
  }

  function getStageLabel() {
    const fraction = getInsulinFraction()
    if (killCount === 0 && simTime < 3) return 'EARLY: healthy islet'
    if (killCount === 0) return 'AUTOIMMUNE RESPONSE BEGINS'
    if (fraction > 0.4) return 'PROGRESSIVE β-CELL DESTRUCTION'
    return 'LATE STAGE: substantial β-cell loss'
  }

  function destroy() {
    cancelAnimationFrame(rafId)
    resizeObserver.disconnect()
    canvas.removeEventListener('click', onClick)
    container.innerHTML = ''
  }

  return {
    setPlaying,
    restart,
    enterStudyMode,
    setStudyStep,
    exitStudyMode,
    getInsulinFraction,
    getStageLabel,
    destroy
  }
}
