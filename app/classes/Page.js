import GSAP from 'gsap'
import Prefix from 'prefix'
import NormalizeWheel from 'normalize-wheel'
import Title from "../animations/Title";
import Paragraph from "../animations/Paragraph";
import Label from "../animations/Label";
import Highlight from "../animations/Highlight";
import {ColorManager} from "./Color";
import AsyncLoad from "../components/AsyncLoad";

export default class Page {
    constructor(
        {
            element,
            elements,
            id
        }
    ) {
        this.selector = element
        this.selectorChildren = {
            ...elements,
            animationsTitles: '[data-animation="title"]',
            animationsLabels: '[data-animation="label"]',
            animationsParagraphs: '[data-animation="paragraph"]',
            animationsHighlights: '[data-animation="highlight"]',

            images: "[data-src]"
        }

        this.id = id

        this.transformPrefix = Prefix('transform')

        this.onMouseWheelEvent = this.onMouseWheel.bind(this)
    }


    //Create and setup
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

        this.createLazyLoaders()
        this.setupAnimations()
    }

    createLazyLoaders() {
        if (this.elements.images) {
            //Concat for pages with only one image
            this.images = [].concat(this.elements.images).map(image => new AsyncLoad({element: image}))
        }
    }

    //Animations

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
            this.destroy()

            this.animationOut = GSAP.timeline()

            this.animationOut.to(this.element, {
                autoAlpha: 0,
                onComplete: resolve
            })
        })
    }

    //Event listeners

    onMouseWheel(event) {
        const {pixelY} = NormalizeWheel(event)

        this.scroll.target += pixelY
    }

    onResize() {
        if (this.elements.wrapper) {
            this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight
        }
    }


    //Loops
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


    //Remove event listeners
    addEventListeners() {
        window.addEventListener('mousewheel', this.onMouseWheelEvent)
    }

    removeEventListeners() {
        window.removeEventListener('mousewheel', this.onMouseWheelEvent)
    }

    //Destroy
    destroy() {
        this.removeEventListeners()
    }
}
