// Reusable slide-in explanation panel, used by interactive models to
// show concise educational text when a diagram node is clicked.

export function createExplanationPanel(container) {
  const panel = document.createElement('div')
  panel.className = 'explanation-panel'
  panel.setAttribute('role', 'dialog')
  panel.setAttribute('aria-live', 'polite')

  const closeButton = document.createElement('button')
  closeButton.className = 'explanation-panel__close'
  closeButton.setAttribute('aria-label', 'Close explanation')
  closeButton.textContent = '✕'

  const titleEl = document.createElement('h3')
  titleEl.className = 'explanation-panel__title'

  const bodyEl = document.createElement('div')
  bodyEl.className = 'explanation-panel__body'

  const metaEl = document.createElement('div')
  metaEl.className = 'explanation-panel__meta'

  panel.appendChild(closeButton)
  panel.appendChild(titleEl)
  panel.appendChild(bodyEl)
  panel.appendChild(metaEl)

  container.appendChild(panel)

  function hide() {
    panel.classList.remove('open')
  }

  function show({ title, body, meta }) {
    titleEl.textContent = title || ''
    bodyEl.textContent = body || ''
    metaEl.textContent = meta || ''
    metaEl.style.display = meta ? 'block' : 'none'
    panel.classList.add('open')
  }

  closeButton.addEventListener('click', hide)

  return { el: panel, show, hide }
}
