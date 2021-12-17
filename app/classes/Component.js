import EventEmitter from 'events'

export default class Component extends EventEmitter {
    constructor({
                    element,
                    elements
                }) {
        super()

        this.selector = element
        this.selectorChildren = {
            ...elements
        }

        this.create()

        this.addEventListeners()
    }

    create() {
        if (this.selector instanceof HTMLElement) {
            this.element = this.selector
        } else {
            this.element = document.querySelector(this.selector)
        }

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
}
