import GSAP from 'gsap'
import Prefix from 'prefix'
import NormalizeWheel from 'normalize-wheel'
import Title from "../animations/Title";
import Paragraph from "../animations/Paragraph";
import Label from "../animations/Label";
import Highlight from "../animations/Highlight";
import {ColorManager} from "./Color";

export default class Page {
  constructor({
                element,
                elements,
                id
              }) {
    this.selector = element
    this.selectorChildren = {
        ...elements,
        animationsTitles: '[data-animation="title"]',
        animationsLabels: '[data-animation="label"]',
        animationsParagraphs: '[data-animation="paragraph"]',
        animationsHighlights: '[data-animation="highlight"]',
    }

    this.id = id

    this.transformPrefix = Prefix('transform')

    this.onMouseWheelEvent = this.onMouseWheel.bind(this)
  }

  setupAnimations() {
    this.animations = []

    const titleAnimations = this.elements.animationsTitles?.map(title => new Title({element: title}))

    this.animations = this.animations.concat(titleAnimations)

    const paragraphAnimations = this.elements.animationsParagraphs?.map(paragraph => new Paragraph({element: paragraph}))

    this.animations = this.animations.concat(paragraphAnimations)

    const labelAnimations = this.elements.animationsLabels?.map(label => new Label({element: label}))

    this.animations = this.animations.concat(labelAnimations)

    const highlightAnimations = this.elements.animationsHighlights?.map(label => new Highlight({element: label}))

    this.animations = this.animations.concat(highlightAnimations)
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
            this.elements[key] = [...document.querySelectorAll(entry)]

            if (this.elements[key].length === 0) {
                this.elements[key] = null
            } else if (this.elements[key].length === 1) {
                this.elements[key] = this.elements[key][0]
            }
        }
    })

      this.setupAnimations()
  }

  show() {
    return new Promise(resolve => {
      ColorManager.change({
        color: this.element.getAttribute('data-color'),
        backgroundColor: this.element.getAttribute('data-bg-color')
      })

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
    const {pixelY} = NormalizeWheel(event)

    this.scroll.target += pixelY
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
