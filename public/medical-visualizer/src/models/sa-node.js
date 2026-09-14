import * as THREE from 'three'

// SA node / cardiac pacemaker model.
// Unchanged in behaviour from the original standalone version — only
// wrapped in init/destroy so it can be mounted into a shared container
// and swapped out for other models.
export function initSANode(container) {
  const disposables = []
  const rafIds = []

  const scene = new THREE.Scene()

  const mechanism = document.createElement('div')

  mechanism.textContent = 'β₁ → Gs → ↑ cAMP → ↑ HCN → ↑ If'

  mechanism.style.position = 'absolute'
  mechanism.style.left = '20px'
  mechanism.style.top = '70px'
  mechanism.style.padding = '10px 14px'
  mechanism.style.background = 'rgba(0, 0, 0, 0.75)'
  mechanism.style.color = 'white'
  mechanism.style.fontFamily = 'Arial'
  mechanism.style.fontSize = '16px'

  container.appendChild(mechanism)

  const ionDirection = document.createElement('div')

  ionDirection.innerHTML = `
    <strong>Ion movement</strong><br>
    If: <strong>inward</strong> → Phase 4<br>
    Ca²⁺: <strong>inward</strong> → Phase 0<br>
    K⁺: <strong>outward</strong> → Phase 3
  `

  ionDirection.style.position = 'absolute'
  ionDirection.style.right = '20px'
  ionDirection.style.top = '420px'
  ionDirection.style.padding = '12px'
  ionDirection.style.background = 'rgba(0, 0, 0, 0.8)'
  ionDirection.style.color = 'white'
  ionDirection.style.fontFamily = 'Arial'
  ionDirection.style.fontSize = '14px'
  ionDirection.style.lineHeight = '1.5'

  container.appendChild(ionDirection)

  const legend = document.createElement('div')

  legend.innerHTML = `
    <div>
      <span style="color:white">●</span>
      <strong>If</strong> = funny current
    </div>

    <div style="font-size:12px; margin-left:18px;">
      Net inward Na⁺/K⁺ current through HCN channels
    </div>

    <div style="margin-top:6px;">
      <span style="color:#66ccff">●</span>
      <strong>Ca²⁺</strong> = inward current
    </div>

    <div>
      <span style="color:#ff66aa">●</span>
      <strong>K⁺</strong> = outward current
    </div>
  `

  legend.style.position = 'absolute'
  legend.style.left = '20px'
  legend.style.bottom = '20px'
  legend.style.padding = '12px'
  legend.style.background = 'rgba(0, 0, 0, 0.8)'
  legend.style.color = 'white'
  legend.style.fontFamily = 'Arial'
  legend.style.fontSize = '14px'
  legend.style.lineHeight = '1.5'

  container.appendChild(legend)

  const phaseLabel = document.createElement('div')

  phaseLabel.textContent = 'Phase 4: Pacemaker depolarization'

  phaseLabel.style.position = 'absolute'
  phaseLabel.style.right = '20px'
  phaseLabel.style.bottom = '20px'
  phaseLabel.style.padding = '14px 18px'
  phaseLabel.style.background = 'rgba(0, 0, 0, 0.8)'
  phaseLabel.style.color = 'white'
  phaseLabel.style.fontFamily = 'Arial'
  phaseLabel.style.fontSize = '18px'
  phaseLabel.style.fontWeight = 'bold'

  container.appendChild(phaseLabel)

  const campLabel = document.createElement('div')

  campLabel.textContent = 'cAMP: baseline'

  campLabel.style.position = 'absolute'
  campLabel.style.left = '50%'
  campLabel.style.bottom = '20px'
  campLabel.style.transform = 'translateX(-50%)'
  campLabel.style.padding = '10px 16px'
  campLabel.style.background = 'rgba(0, 0, 0, 0.8)'
  campLabel.style.color = 'white'
  campLabel.style.fontFamily = 'Arial'
  campLabel.style.fontSize = '16px'

  container.appendChild(campLabel)

  const heartRateLabel = document.createElement('div')

  heartRateLabel.textContent = 'Heart rate: 75 bpm'

  heartRateLabel.style.position = 'absolute'
  heartRateLabel.style.right = '20px'
  heartRateLabel.style.top = '300px'
  heartRateLabel.style.padding = '10px 14px'
  heartRateLabel.style.background = 'rgba(0, 0, 0, 0.8)'
  heartRateLabel.style.color = 'white'
  heartRateLabel.style.fontFamily = 'Arial'
  heartRateLabel.style.fontSize = '16px'

  container.appendChild(heartRateLabel)

  const rateStatus = document.createElement('div')

  rateStatus.textContent = 'Normal pacemaker rate'

  rateStatus.style.position = 'absolute'
  rateStatus.style.right = '20px'
  rateStatus.style.top = '330px'
  rateStatus.style.padding = '8px 12px'
  rateStatus.style.background = 'rgba(0, 0, 0, 0.7)'
  rateStatus.style.color = 'white'
  rateStatus.style.fontFamily = 'Arial'
  rateStatus.style.fontSize = '14px'

  container.appendChild(rateStatus)

  const summary = document.createElement('div')

  summary.innerHTML = `
    <strong>β₁ effect on SA node</strong><br><br>
    β₁ → Gs → ↑ cAMP<br>
    ↑ cAMP → ↑ HCN / If<br>
    ↑ If → steeper Phase 4<br>
    Steeper Phase 4 → threshold sooner<br>
    Threshold sooner → ↑ HR
  `

  summary.style.position = 'absolute'
  summary.style.left = '20px'
  summary.style.top = '125px'
  summary.style.padding = '14px'
  summary.style.background = 'rgba(0, 0, 0, 0.8)'
  summary.style.color = 'white'
  summary.style.fontFamily = 'Arial'
  summary.style.fontSize = '14px'
  summary.style.lineHeight = '1.5'

  container.appendChild(summary)

  const controls = document.createElement('div')

  controls.style.position = 'absolute'
  controls.style.left = '50%'
  controls.style.top = '20px'
  controls.style.transform = 'translateX(-50%)'
  controls.style.display = 'flex'
  controls.style.gap = '8px'

  const previousButton = document.createElement('button')
  previousButton.textContent = '← Previous'

  const playButton = document.createElement('button')
  playButton.textContent = '▶ Play'

  const nextButton = document.createElement('button')
  nextButton.textContent = 'Next →'

  const skipButton = document.createElement('button')
  skipButton.textContent = '⏭ Skip'

  controls.appendChild(previousButton)
  controls.appendChild(playButton)
  controls.appendChild(nextButton)
  controls.appendChild(skipButton)

  container.appendChild(controls)

  const phaseSelector = document.createElement('select')

  phaseSelector.innerHTML = `
    <option value="0">Phase 4: Pacemaker depolarization</option>
    <option value="1">Phase 0: Ca²⁺ influx</option>
    <option value="2">Phase 3: K⁺ efflux</option>
  `

  phaseSelector.style.marginLeft = '8px'
  phaseSelector.style.padding = '8px'

  controls.appendChild(phaseSelector)

  const onPhaseSelectorChange = () => {
    isPlaying = false
    playButton.textContent = '▶ Play'

    goToPhase(Number(phaseSelector.value))
  }

  phaseSelector.addEventListener('change', onPhaseSelectorChange)

  const onPlayClick = () => {
    isPlaying = !isPlaying

    if (isPlaying) {
      playButton.textContent = '⏸ Pause'
      phaseLabel.textContent = phases[phaseIndex].name
    } else {
      playButton.textContent = '▶ Play'
      phaseLabel.textContent = phases[phaseIndex].name + ' — PAUSED'
    }
  }

  playButton.addEventListener('click', onPlayClick)

  const onNextClick = () => {
    isPlaying = false
    playButton.textContent = '▶ Play'

    goToPhase(phaseIndex + 1)
  }

  nextButton.addEventListener('click', onNextClick)

  const onPreviousClick = () => {
    isPlaying = false
    playButton.textContent = '▶ Play'

    goToPhase(phaseIndex - 1)
  }

  previousButton.addEventListener('click', onPreviousClick)

  const onSkipClick = () => {
    isPlaying = false
    playButton.textContent = '▶ Play'

    phaseIndex = 0
    time = 0
  }

  skipButton.addEventListener('click', onSkipClick)

  let beta1Active = false

  const geometry = new THREE.SphereGeometry(1, 32, 32)
  const material = new THREE.MeshBasicMaterial({
    color: 0x44aaff,
    transparent: true,
    opacity: 0.35
  })

  const cell = new THREE.Mesh(geometry, material)

  scene.add(cell)

  const nucleusGeometry = new THREE.SphereGeometry(0.4, 32, 32)
  const nucleusMaterial = new THREE.MeshBasicMaterial({ color: 0xff5555 })

  const nucleus = new THREE.Mesh(
    nucleusGeometry,
    nucleusMaterial
  )

  scene.add(nucleus)

  const membraneGeometry = new THREE.SphereGeometry(1.08, 32, 32)

  const membraneMaterial = new THREE.MeshBasicMaterial({
    color: 0x66ccff,
    transparent: true,
    opacity: 0.2
  })

  const membrane = new THREE.Mesh(
    membraneGeometry,
    membraneMaterial
  )

  scene.add(membrane)

  const hcnGeometry = new THREE.CylinderGeometry(
    0.08,
    0.08,
    0.3,
    16
  )

  const hcnMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00
  })

  const hcnChannels = []

  for (let i = 0; i < 8; i++) {
    const channel = new THREE.Mesh(
      hcnGeometry,
      hcnMaterial
    )

    const angle = (i / 8) * Math.PI * 2

    channel.position.set(
      Math.cos(angle) * 1.08,
      Math.sin(angle) * 1.08,
      0
    )

    channel.rotation.z = Math.PI / 2

    membrane.add(channel)
    hcnChannels.push(channel)
  }

  const particleGeometry = new THREE.SphereGeometry(0.04, 8, 8)

  const particleMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
  })

  const particles = []

  for (let i = 0; i < 20; i++) {
    const particle = new THREE.Mesh(
      particleGeometry,
      particleMaterial
    )

    const angle = Math.random() * Math.PI * 2
    const radius = 1.5

    particle.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    )

    scene.add(particle)

    particles.push(particle)
  }

  const calciumGeometry = new THREE.SphereGeometry(0.05, 8, 8)

  const calciumMaterial = new THREE.MeshBasicMaterial({
    color: 0x66ccff
  })

  const calciumParticles = []

  for (let i = 0; i < 10; i++) {
    const calcium = new THREE.Mesh(
      calciumGeometry,
      calciumMaterial
    )

    const angle = Math.random() * Math.PI * 2
    const radius = 1.5

    calcium.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0.2
    )

    scene.add(calcium)
    calciumParticles.push(calcium)
  }

  const potassiumGeometry = new THREE.SphereGeometry(0.05, 8, 8)

  const potassiumMaterial = new THREE.MeshBasicMaterial({
    color: 0xff66aa
  })

  const potassiumParticles = []

  for (let i = 0; i < 10; i++) {
    const potassium = new THREE.Mesh(
      potassiumGeometry,
      potassiumMaterial
    )

    const angle = Math.random() * Math.PI * 2
    const radius = 0.8

    potassium.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0.3
    )

    scene.add(potassium)
    potassiumParticles.push(potassium)
  }

  disposables.push(
    geometry, material,
    nucleusGeometry, nucleusMaterial,
    membraneGeometry, membraneMaterial,
    hcnGeometry, hcnMaterial,
    particleGeometry, particleMaterial,
    calciumGeometry, calciumMaterial,
    potassiumGeometry, potassiumMaterial
  )

  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  )

  const renderer = new THREE.WebGLRenderer({
    antialias: true
  })

  renderer.setSize(container.clientWidth, container.clientHeight)

  container.appendChild(renderer.domElement)

  camera.position.z = 5

  const onResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
  }

  window.addEventListener('resize', onResize)

  let time = 0
  let isPlaying = true
  let phaseIndex = 0

  const phases = [
    { name: 'Phase 4: Pacemaker depolarization', start: 0 },
    { name: 'Phase 0: Ca²⁺ influx', start: 6 },
    { name: 'Phase 3: K⁺ efflux', start: 7 }
  ]

  function goToPhase(index) {
    phaseIndex = (index + phases.length) % phases.length
    time = phases[phaseIndex].start

    phaseSelector.value = phaseIndex
    phaseLabel.textContent = phases[phaseIndex].name
  }

  function animate() {
    rafIds[0] = requestAnimationFrame(animate)

    renderer.render(scene, camera)
  }

  animate()

  const graph = document.createElement('canvas')

  graph.width = 500
  graph.height = 250

  graph.style.position = 'absolute'
  graph.style.right = '20px'
  graph.style.top = '20px'
  graph.style.background = '#111'
  graph.style.border = '1px solid #555'

  container.appendChild(graph)

  const ctx = graph.getContext('2d')

  function getMembranePotential(t) {
    const cycle = t % 10

    // Phase 4: slow pacemaker depolarization
    if (cycle < 6) {
      const slope = beta1Active ? 1.5 : 1

      return -60 + (cycle / 6) * 20 * slope
    }

    // Phase 0: rapid depolarization
    if (cycle < 7) {
      return -40 + ((cycle - 6) / 1) * 40
    }

    // Phase 3: repolarization
    return 0 - ((cycle - 7) / 3) * 60
  }

  function drawWaveform() {
    ctx.clearRect(0, 0, graph.width, graph.height)

    // Axes
    ctx.strokeStyle = '#555'
    ctx.beginPath()
    ctx.moveTo(40, 20)
    ctx.lineTo(40, 220)
    ctx.lineTo(480, 220)
    ctx.stroke()

    // Labels
    ctx.fillStyle = 'white'
    ctx.font = '14px Arial'

    ctx.fillText('Membrane potential (mV)', 50, 20)
    ctx.fillText('Time', 450, 240)

    ctx.fillText('0', 20, 80)
    ctx.fillText('-40', 10, 140)
    ctx.fillText('-60', 10, 190)

    // Threshold line
    ctx.strokeStyle = '#888'
    ctx.setLineDash([6, 6])

    ctx.beginPath()
    ctx.moveTo(40, 140)
    ctx.lineTo(480, 140)
    ctx.stroke()

    ctx.setLineDash([])

    ctx.fillStyle = 'white'
    ctx.fillText('Threshold ≈ -40 mV', 350, 135)

    // Waveform
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 3

    ctx.beginPath()

    for (let x = 0; x <= 420; x++) {
      const t = time + x / 100
      const voltage = getMembranePotential(t)

      const y = 190 - ((voltage + 60) / 60) * 110

      if (x === 0) {
        ctx.moveTo(40 + x, y)
      } else {
        ctx.lineTo(40 + x, y)
      }
    }

    ctx.stroke()
  }

  function animateGraph() {
    if (isPlaying) {
      time += 0.02

      if (time >= 10) {
        time = 0
      }
    }

    const voltage = getMembranePotential(time)

    // HCN activity increases as the membrane becomes more negative
    let hcnActivity = Math.max(
      0,
      Math.min(1, (-voltage - 40) / 20)
    )

    if (beta1Active) {
      hcnActivity = Math.min(1, hcnActivity + 0.3)
    }

    hcnChannels.forEach((channel) => {
      const scale = 0.7 + hcnActivity * 0.8

      channel.scale.set(
        scale,
        scale,
        scale
      )

      channel.material.color.set(
        beta1Active
          ? 0xffcc00
          : 0xffff00
      )
    })

    particles.forEach((particle) => {
      if (hcnActivity > 0.1) {
        const direction = particle.position.clone().normalize()

        particle.position.x -= direction.x * (0.005 + hcnActivity * 0.01)
        particle.position.y -= direction.y * (0.005 + hcnActivity * 0.01)

        if (particle.position.length() < 0.8) {
          particle.position.multiplyScalar(1.8)
        }
      }
    })

    const cycle = time % 10

    if (cycle < 6) {
      phaseIndex = 0
    } else if (cycle < 7) {
      phaseIndex = 1
    } else {
      phaseIndex = 2
    }

    phaseLabel.textContent = phases[phaseIndex].name

    if (beta1Active) {
      campLabel.textContent = 'cAMP: ↑↑'
    } else {
      campLabel.textContent = 'cAMP: baseline'
    }

    if (beta1Active) {
      heartRateLabel.textContent = 'Heart rate: 105 bpm'
    } else {
      heartRateLabel.textContent = 'Heart rate: 75 bpm'
    }

    if (beta1Active) {
      rateStatus.textContent = 'β₁ ON → pacemaker fires sooner'
    } else {
      rateStatus.textContent = 'β₁ OFF → normal pacemaker rate'
    }

    const atThreshold = cycle >= 6 && cycle < 7

    if (atThreshold) {
      phaseLabel.style.transform = 'scale(1.08)'
    } else {
      phaseLabel.style.transform = 'scale(1)'
    }

    calciumParticles.forEach((calcium) => {
      if (cycle >= 6 && cycle < 7) {
        const direction = calcium.position.clone().normalize()

        calcium.position.x -= direction.x * 0.02
        calcium.position.y -= direction.y * 0.02

        if (calcium.position.length() < 0.8) {
          calcium.position.multiplyScalar(1.8)
        }
      }
    })

    potassiumParticles.forEach((potassium) => {
      if (cycle >= 7) {
        const direction = potassium.position.clone().normalize()

        potassium.position.x += direction.x * 0.015
        potassium.position.y += direction.y * 0.015

        if (potassium.position.length() > 1.5) {
          potassium.position.multiplyScalar(0.5)
        }
      }
    })

    drawWaveform()

    rafIds[1] = requestAnimationFrame(animateGraph)
  }

  animateGraph()

  const beta1Button = document.createElement('button')

  beta1Button.textContent = 'β₁ stimulation: OFF'

  beta1Button.style.position = 'absolute'
  beta1Button.style.left = '20px'
  beta1Button.style.top = '20px'
  beta1Button.style.padding = '12px 18px'
  beta1Button.style.fontSize = '16px'
  beta1Button.style.cursor = 'pointer'

  container.appendChild(beta1Button)

  const onBeta1Click = () => {
    beta1Active = !beta1Active

    beta1Button.textContent =
      beta1Active
        ? 'β₁ stimulation: ON'
        : 'β₁ stimulation: OFF'

    if (beta1Active) {
      beta1Button.style.background = '#ffcc00'
      beta1Button.style.color = 'black'
    } else {
      beta1Button.style.background = ''
      beta1Button.style.color = ''
    }
  }

  beta1Button.addEventListener('click', onBeta1Click)

  return function destroySANode() {
    rafIds.forEach((id) => cancelAnimationFrame(id))
    window.removeEventListener('resize', onResize)

    renderer.dispose()
    disposables.forEach((resource) => resource.dispose())

    container.innerHTML = ''
  }
}
