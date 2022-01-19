import {Camera, Renderer, Transform} from 'ogl'

import About from './About'
import Home from './Home'
import Collections from "./Collections";
import Transition from "./Transition";
import Detail from "./Detail";

export default class Canvas {
    constructor({template}) {
        this.template = template

        this.x = {
            start: 0,
            distance: 0,
            end: 0
        }

        this.y = {
            start: 0,
            distance: 0,
            end: 0
        }

        this.createRenderer()
        this.createCamera()
        this.createScene()

        this.onResize()

    }

    onPreloaded() {
        this.onChangeEnd(this.template)
    }

    //Webgl functions
    createRenderer() {
        //Setup transparent renderer
        this.renderer = new Renderer({
            alpha: true,
            antialias: true
        })

        this.gl = this.renderer.gl

        //Attach canvas element to body for displaying items on plane
        document.body.appendChild(this.gl.canvas)
    }

    createCamera() {
        this.camera = new Camera(this.gl)
        this.camera.position.z = 5
    }

    createScene() {
        this.scene = new Transform()
    }

    //Home functions
    createHome() {
        this.home = new Home({
            gl: this.gl,
            scene: this.scene,
            sizes: this.sizes
        })
    }

    destroyHome() {
        if (!this.home) return

        this.home.destroy()
        this.home = null
    }

    //About functions
    createAbout() {
        this.about = new About({
            gl: this.gl,
            scene: this.scene,
            sizes: this.sizes
        })
    }

    destroyAbout() {
        if (!this.about) return

        this.about.destroy()
        this.about = null
    }

    //Collection functions
    createCollections() {
        this.collections = new Collections({
            gl: this.gl,
            scene: this.scene,
            sizes: this.sizes
        })
    }

    destroyCollections() {
        if (!this.collections) return

        this.collections.destroy()
        this.collections = null
    }

    //Detail functions
    createDetail() {
        this.detail = new Detail({
            gl: this.gl,
            scene: this.scene,
            sizes: this.sizes
        })
    }

    destroyDetail() {
        if (!this.detail) return

        this.detail.destroy()
        this.detail = null
    }

    //Events
    onChangeStart() {
        this.transitionBetweenDetailAndCollections = this.collections || this.detail;

        if (this.transitionBetweenDetailAndCollections) {
            this.transition = new Transition({
                element: this.collections.mediaScenes[this.collections.currentMediaElementIndex],
                gl: this.gl,
                sizes: this.sizes,
                scene: this.scene
            })
        }

        if (this.about) {
            this.about.hide()
        }

        if (this.home) {
            this.home.hide()
        }

        if (this.collections) {
            this.collections.hide()
        }

        if (this.detail) {
            this.detail.hide()
        }
    }

    onChangeEnd(template) {
        if (template === 'about') {
            this.createAbout()
        } else if (this.about) {
            this.destroyAbout()
        }

        if (template === 'collections') {
            this.createCollections()
            this.gl.canvas.style.zIndex = '1000'
        } else if (this.collections) {
            this.gl.canvas.style.zIndex = ''
            this.destroyCollections()
        }

        if (template === 'home') {
            this.createHome()
        } else if (this.home) {
            this.destroyHome()
        }

        if (template === 'detail') {
            this.createDetail()
        } else if (this.home) {
            this.destroyDetail()
        }
    }

    onResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        this.camera.perspective({
            aspect: window.innerWidth / window.innerHeight
        })

        //Calculate the height of the plan using tan = opposite/adjacent. Some pretty neat math behind the scenes here
        const fov = this.camera.fov * (Math.PI / 180)
        const height = 2 * Math.tan(fov / 2) * this.camera.position.z
        const width = height * this.camera.aspect

        this.sizes = {
            height,
            width
        }

        const values = {
            sizes: this.sizes
        }

        if (this.about) {
            this.about.onResize(values)
        }

        if (this.home) {
            this.home.onResize(values)
        }

        if (this.collections) {
            this.collections.onResize(values)
        }

        if (this.detail) {
            this.detail.onResize(values)
        }
    }

    onTouchDown(event) {
        this.isDown = true

        this.x.start = event.touches ? event.touches[0].clientX : event.clientX
        this.y.start = event.touches ? event.touches[0].clientY : event.clientY

        const values = {
            x: this.x,
            y: this.y,
        }

        if (this.about) {
            this.about.onTouchDown(values)
        }

        if (this.home) {
            this.home.onTouchDown(values)
        }

        if (this.collections) {
            this.collections.onTouchDown(values)
        }
    }

    onTouchMove(event) {
        if (!this.isDown) return

        //Check if event is a touch or mouse event and extract parameters based don that
        const x = event.touches ? event.touches[0].clientX : event.clientX
        const y = event.touches ? event.touches[0].clientY : event.clientY

        this.x.end = x
        this.y.end = y

        const values = {
            x: this.x,
            y: this.y,
        }

        if (this.about) {
            this.about.onTouchMove(values)
        }

        if (this.home) {
            this.home.onTouchMove(values)
        }

        if (this.collections) {
            this.collections.onTouchMove(values)
        }
    }

    onTouchUp(event) {
        this.isDown = false

        //Check if event is a touch or mouse event and extract parameters based don that
        const x = event.changedTouches ? event.changedTouches[0].clientX : event.clientX
        const y = event.changedTouches ? event.changedTouches[0].clientY : event.clientY

        this.x.end = x
        this.y.end = y

        const values = {
            x: this.x,
            y: this.y,
        }

        if (this.about) {
            this.about.onTouchUp(values)
        }

        if (this.home) {
            this.home.onTouchUp(values)
        }

        if (this.collections) {
            this.collections.onTouchUp(values)
        }
    }

    onWheel(event) {
        if (this.home) {
            this.home.onWheel(event)
        }

        if (this.collections) {
            this.collections.onWheel(event)
        }
    }

    /**
     * Loop.
     */
    update(scroll) {
        if (this.about) {
            this.about.update(scroll)
        }

        if (this.home) {
            this.home.update()
        }

        if (this.collections) {
            this.collections.update()
        }

        this.renderer.render({scene: this.scene, camera: this.camera})
    }

}