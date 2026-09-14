// Lightweight hamburger sidebar for switching between models.
// No routing library — just a small DOM component driven by callbacks.

export function createNav({ models, onSelect }) {
  let open = false
  let activeId = null

  const hamburger = document.createElement('button')
  hamburger.className = 'nav-hamburger'
  hamburger.setAttribute('aria-label', 'Open model menu')
  hamburger.setAttribute('aria-expanded', 'false')
  hamburger.innerHTML = '<span></span><span></span><span></span>'

  const topbar = document.createElement('div')
  topbar.className = 'nav-topbar'

  const title = document.createElement('div')
  title.className = 'nav-title'
  title.textContent = 'Medical Visualizer'

  const modelName = document.createElement('div')
  modelName.className = 'nav-model-name'

  topbar.appendChild(hamburger)
  topbar.appendChild(title)
  topbar.appendChild(modelName)

  const overlay = document.createElement('div')
  overlay.className = 'nav-overlay'

  const sidebar = document.createElement('nav')
  sidebar.className = 'nav-sidebar'
  sidebar.setAttribute('aria-label', 'Model selection')

  const sidebarHeading = document.createElement('div')
  sidebarHeading.className = 'nav-sidebar-heading'
  sidebarHeading.textContent = 'Models'
  sidebar.appendChild(sidebarHeading)

  const list = document.createElement('ul')
  list.className = 'nav-list'
  sidebar.appendChild(list)

  const itemButtons = new Map()

  models.forEach((model) => {
    const li = document.createElement('li')

    const button = document.createElement('button')
    button.className = 'nav-item'
    button.textContent = model.label
    button.setAttribute('aria-current', 'false')

    button.addEventListener('click', () => {
      onSelect(model.id)
      setOpen(false)
    })

    li.appendChild(button)
    list.appendChild(li)
    itemButtons.set(model.id, button)
  })

  function setOpen(next) {
    open = next
    sidebar.classList.toggle('open', open)
    overlay.classList.toggle('open', open)
    hamburger.classList.toggle('active', open)
    hamburger.setAttribute('aria-expanded', String(open))
  }

  hamburger.addEventListener('click', () => setOpen(!open))
  overlay.addEventListener('click', () => setOpen(false))

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) {
      setOpen(false)
      hamburger.focus()
    }
  })

  function setActive(id) {
    activeId = id

    itemButtons.forEach((button, modelId) => {
      const isActive = modelId === id
      button.classList.toggle('active', isActive)
      button.setAttribute('aria-current', isActive ? 'true' : 'false')
    })

    const activeModel = models.find((model) => model.id === id)
    modelName.textContent = activeModel ? activeModel.label : ''
  }

  document.body.appendChild(topbar)
  document.body.appendChild(overlay)
  document.body.appendChild(sidebar)

  return { setActive }
}
