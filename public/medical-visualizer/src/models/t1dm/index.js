import { createExplanationPanel } from '../../components/explanationPanel.js'
import { createScene } from './scene.js'
import {
  MAJOR_AUTOANTIGENS,
  NODE_EXPLANATIONS,
  STUDY_STEPS
} from './data.js'

const ANTIGEN_LOOKUP = new Map(MAJOR_AUTOANTIGENS.map((a) => [a.id, a]))
const STEP_LOOP_MS = 3200

export function initT1DM(container) {
  const timeouts = []
  const intervals = []

  const wrapper = document.createElement('div')
  wrapper.className = 't1dm-wrapper'
  container.appendChild(wrapper)

  const header = document.createElement('div')
  header.className = 't1dm-header'
  header.innerHTML = `
    <h2>Type 1 Diabetes — Autoimmune β-cell Destruction</h2>
    <p>Watch CD8+ T cells and B cells interact with β-cells in a simplified islet. Click any cell or antibody for details.</p>
  `
  wrapper.appendChild(header)

  // --- Controls ---------------------------------------------------------
  const controls = document.createElement('div')
  controls.className = 't1dm-controls'

  const playButton = document.createElement('button')
  playButton.className = 't1dm-btn'
  playButton.textContent = '⏸ Pause'

  const restartButton = document.createElement('button')
  restartButton.className = 't1dm-btn'
  restartButton.textContent = '⏮ Restart'

  const studyModeButton = document.createElement('button')
  studyModeButton.className = 't1dm-btn'
  studyModeButton.textContent = 'Study Mode: OFF'
  studyModeButton.setAttribute('aria-pressed', 'false')

  const stepControls = document.createElement('div')
  stepControls.className = 't1dm-step-controls'
  stepControls.hidden = true

  const prevButton = document.createElement('button')
  prevButton.className = 't1dm-btn'
  prevButton.textContent = '← Previous'

  const nextButton = document.createElement('button')
  nextButton.className = 't1dm-btn'
  nextButton.textContent = 'Next →'

  stepControls.appendChild(prevButton)
  stepControls.appendChild(nextButton)

  controls.appendChild(playButton)
  controls.appendChild(restartButton)
  controls.appendChild(studyModeButton)
  controls.appendChild(stepControls)
  wrapper.appendChild(controls)

  const stepPanel = document.createElement('div')
  stepPanel.className = 't1dm-step-panel'
  stepPanel.hidden = true
  wrapper.appendChild(stepPanel)

  const stageLabel = document.createElement('div')
  stageLabel.className = 't1dm-stage-label'
  wrapper.appendChild(stageLabel)

  // --- Insulin meter ------------------------------------------------------
  const meterWrap = document.createElement('button')
  meterWrap.className = 't1dm-meter'
  meterWrap.type = 'button'
  meterWrap.setAttribute('aria-label', 'Insulin output — click for details')
  meterWrap.innerHTML = `
    <div class="t1dm-meter__label">Insulin output</div>
    <div class="t1dm-meter__track"><div class="t1dm-meter__fill"></div></div>
    <div class="t1dm-meter__value">100%</div>
  `
  wrapper.appendChild(meterWrap)
  const meterFill = meterWrap.querySelector('.t1dm-meter__fill')
  const meterValue = meterWrap.querySelector('.t1dm-meter__value')

  meterWrap.addEventListener('click', () => {
    panel.show(NODE_EXPLANATIONS['insulin-deficiency'])
  })

  // --- Downstream metabolic strip (secondary, not the main visual) -------
  const downstream = document.createElement('div')
  downstream.className = 't1dm-downstream'
  downstream.innerHTML = `<span class="t1dm-downstream__label">Downstream if untreated:</span>`
  const downstreamIds = ['hyperglycaemia', 'lipolysis', 'ketogenesis', 'dka']
  downstreamIds.forEach((id, index) => {
    if (index > 0) {
      const arrow = document.createElement('span')
      arrow.className = 't1dm-downstream__arrow'
      arrow.textContent = '→'
      downstream.appendChild(arrow)
    }
    const btn = document.createElement('button')
    btn.className = 't1dm-downstream__item'
    btn.type = 'button'
    btn.textContent = NODE_EXPLANATIONS[id].title
    btn.addEventListener('click', () => panel.show(NODE_EXPLANATIONS[id]))
    downstream.appendChild(btn)
  })
  wrapper.appendChild(downstream)

  // --- Scene ---------------------------------------------------------------
  const sceneContainer = document.createElement('div')
  sceneContainer.className = 't1dm-scene-container'
  wrapper.appendChild(sceneContainer)

  const panel = createExplanationPanel(wrapper)

  function explanationForHit(hit) {
    if (hit.type === 'antibody') {
      const antigen = ANTIGEN_LOOKUP.get(hit.entity.antigenId)
      const base = NODE_EXPLANATIONS.antibody
      return {
        title: antigen ? `Anti-${antigen.name} antibody` : base.title,
        body: `${base.body} ${antigen ? antigen.what : ''}`,
        meta: antigen ? antigen.marker : ''
      }
    }
    return NODE_EXPLANATIONS[hit.type] || null
  }

  const scene = createScene(sceneContainer, {
    onEntityClick: (hit) => {
      const info = explanationForHit(hit)
      if (info) panel.show(info)
    }
  })

  // --- HUD updates (insulin meter + stage label) --------------------------
  function updateHud() {
    const fraction = scene.getInsulinFraction()
    const pct = Math.round(fraction * 100)
    meterFill.style.width = `${pct}%`
    meterValue.textContent = `${pct}%`
    meterFill.classList.toggle('t1dm-meter__fill--low', pct < 40)
    stageLabel.textContent = scene.getStageLabel()
  }
  const hudInterval = setInterval(updateHud, 250)
  intervals.push(hudInterval)
  updateHud()

  // --- Play / Pause / Restart ---------------------------------------------
  let playing = true

  playButton.addEventListener('click', () => {
    playing = !playing
    scene.setPlaying(playing)
    playButton.textContent = playing ? '⏸ Pause' : '▶ Play'
  })

  restartButton.addEventListener('click', () => {
    scene.restart()
    playing = true
    scene.setPlaying(true)
    playButton.textContent = '⏸ Pause'
  })

  // --- Study mode -----------------------------------------------------------
  let studyMode = false
  let stepIndex = 0
  let loopInterval = null

  function clearLoop() {
    if (loopInterval) {
      clearInterval(loopInterval)
      loopInterval = null
    }
  }

  function applyStep(index) {
    const step = STUDY_STEPS[index]
    if (!step) return

    stepPanel.innerHTML = `<strong>Step ${index + 1} of ${STUDY_STEPS.length}: ${step.title}</strong><p>${step.text}</p>`

    scene.setStudyStep(step.id)
    clearLoop()
    loopInterval = setInterval(() => scene.setStudyStep(step.id), STEP_LOOP_MS)
    intervals.push(loopInterval)
    updateHud()
  }

  function goToStep(index) {
    stepIndex = Math.max(0, Math.min(STUDY_STEPS.length - 1, index))
    applyStep(stepIndex)
  }

  function setStudyMode(next) {
    studyMode = next
    studyModeButton.textContent = `Study Mode: ${studyMode ? 'ON' : 'OFF'}`
    studyModeButton.setAttribute('aria-pressed', String(studyMode))
    stepControls.hidden = !studyMode
    stepPanel.hidden = !studyMode
    playButton.disabled = studyMode
    restartButton.disabled = studyMode

    if (studyMode) {
      scene.enterStudyMode(STUDY_STEPS[0].id)
      goToStep(0)
    } else {
      clearLoop()
      scene.exitStudyMode()
      scene.setPlaying(playing)
    }
  }

  studyModeButton.addEventListener('click', () => setStudyMode(!studyMode))

  prevButton.addEventListener('click', () => goToStep(stepIndex - 1))
  nextButton.addEventListener('click', () => goToStep(stepIndex + 1))

  return function destroyT1DM() {
    clearLoop()
    intervals.forEach((id) => clearInterval(id))
    timeouts.forEach((id) => clearTimeout(id))
    scene.destroy()
    container.innerHTML = ''
  }
}
