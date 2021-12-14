import GSAP from 'gsap'

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
            ...elements
        }

        this.id = id
    }

    create() {
        this.element = document.querySelector(this.selector)
        this.elements = {}

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
            GSAP.fromTo(this.element, {
                autoAlpha: 0,
            }, {
                autoAlpha: 1,
                onComplete: resolve
            })
        })
    }

    hide() {
        return new Promise(resolve => {
            GSAP.to(this.element, {
                autoAlpha: 0,
                onComplete: resolve
            })
        })
    }
}
