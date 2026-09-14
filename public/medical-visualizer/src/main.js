import './style.css'
import { createNav } from './components/nav.js'
import { initSANode } from './models/sa-node.js'
import { initT1DM } from './models/t1dm/index.js'

const STORAGE_KEY = 'medical-visualizer:model'

const MODELS = [
  { id: 'sa-node', label: 'SA Node', init: initSANode },
  { id: 't1dm', label: 'Type 1 Diabetes', init: initT1DM }
]

const appRoot = document.getElementById('app')

const modelContainer = document.createElement('div')
modelContainer.id = 'model-container'
appRoot.appendChild(modelContainer)

let currentDestroy = null

function loadModel(id) {
  const model = MODELS.find((m) => m.id === id) || MODELS[0]

  if (currentDestroy) {
    currentDestroy()
    currentDestroy = null
  }

  modelContainer.innerHTML = ''
  nav.setActive(model.id)

  try {
    localStorage.setItem(STORAGE_KEY, model.id)
  } catch (error) {
    // localStorage may be unavailable (e.g. private browsing) — non-fatal
  }

  currentDestroy = model.init(modelContainer)
}

const nav = createNav({
  models: MODELS.map(({ id, label }) => ({ id, label })),
  onSelect: (id) => loadModel(id)
})

let initialId = MODELS[0].id

try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && MODELS.some((m) => m.id === saved)) {
    initialId = saved
  }
} catch (error) {
  // ignore
}

loadModel(initialId)
