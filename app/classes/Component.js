import GSAP from 'gsap'

import EventEmitter from "events";


export default class Component extends EventEmitter {
    constructor(
        {
            element,
            elements,
        }
    ) {
        super()
        this.selector = element
        this.selectorChildren = {
            ...elements
        }

        this.create()

        this.addEventListeners()
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

    addEventListeners() {

    }

    removeEventListeners() {

    }

    show() {
        return new Promise(resolve => {
            GSAP.from(this.element, {
                autoAlpha: 0,
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
