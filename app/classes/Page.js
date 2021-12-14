import GSAP from 'gsap'
import Prefix from 'prefix'

export default class Page {
  constructor({
                element,
                elements,
                id
              }) {
    this.selector = element
    this.selectorChildren = {
      ...elements
    }

    this.id = id

    this.transformPrefix = Prefix('transform')

    this.onMouseWheelEvent = this.onMouseWheel.bind(this)
  }

  create() {
    this.element = document.querySelector(this.selector)
    this.elements = {}

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0
    }

    Object.entries(this.selectorChildren).forEach(([key, entry]) => {
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)) {
        this.elements[key] = entry
      } else {
        this.elements[key] = document.querySelector(entry) || null
      }
    })
  }

  show() {
    return new Promise(resolve => {
      this.animationIn = GSAP.timeline()

      this.animationIn.fromTo(this.element, {
        autoAlpha: 0
      }, {
        autoAlpha: 1
      })

      this.animationIn.call(_ => {
        this.addEventListeners()

        resolve()
      })
    })
  }

  hide() {
    return new Promise(resolve => {
      this.removeEventListeners()

      this.animationOut = GSAP.timeline()

      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve
      })
    })
  }

  onMouseWheel(event) {
    const {deltaY} = event
    console.log(deltaY)
    this.scroll.target += deltaY
  }

  onResize() {
    if (this.elements.wrapper) {
      this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight
    }
  }

  update() {
    this.scroll.target = GSAP.utils.clamp(0, this.scroll.limit, this.scroll.target)

    this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, 0.1)

    if (this.scroll.current < 0.01) {
      this.scroll.current = 0
    }

    if (this.elements.wrapper) {
      this.elements.wrapper.style[this.transformPrefix] = `translateY(-${this.scroll.current}px)`
    }
  }

  addEventListeners() {
    window.addEventListener('mousewheel', this.onMouseWheelEvent)
  }

  removeEventListeners() {
    window.removeEventListener('mousewheel', this.onMouseWheelEvent)
  }
}
