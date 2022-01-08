import GSAP from 'gsap'
import {Mesh, Program, Texture} from 'ogl'

import fragment from 'shaders/plane-fragment.glsl'
import vertex from 'shaders/plane-vertex.glsl'

export default class Media {
    constructor({element, geometry, gl, index, scene, sizes}) {
        this.element = element
        this.geometry = geometry
        this.gl = gl
        this.index = index
        this.scene = scene
        this.sizes = sizes

        this.createTexture()
        this.createProgram()
        this.createMesh()

        this.extra = {
            x: 0,
            y: 0
        }
    }

    //Webgl setup
    createTexture() {
        this.texture = new Texture(this.gl)

        const image = this.element.querySelector('img')

        this.image = new window.Image()
        this.image.crossOrigin = 'anonymous'
        this.image.src = image.getAttribute('data-src')
        this.image.onload = _ => (this.texture.image = this.image)
    }

    createProgram() {
        this.program = new Program(this.gl, {
            fragment,
            vertex,
            uniforms: {
                uAlpha: {value: 0},
                tMap: {value: this.texture}
            }
        })
    }

    createMesh() {
        this.mesh = new Mesh(this.gl, {
            geometry: this.geometry,
            program: this.program
        })

        this.mesh.setParent(this.scene)
    }

    //Generate bounds
    createBounds({sizes}) {
        this.sizes = sizes

        this.bounds = this.element.getBoundingClientRect()

        this.updateScale()
        this.updateX()
        this.updateY()
    }

    //Animations
    show() {
        GSAP.fromTo(this.program.uniforms.uAlpha, {
            value: 0
        }, {
            value: 1
        })
    }

    hide() {
        GSAP.to(this.program.uniforms.uAlpha, {
            value: 0
        })
    }

    //Events
    onResize(sizes, scroll, width) {
        this.extra = 0
        this.widthTotal = width

        this.createBounds(sizes)
        this.updateX(scroll)
        this.updateY(0)
    }

    //Loop
    updateRotation() {
        /*
            Use algebra to rotate the media based on it's current scroll position
            It uses converts the current scroll position from the range of the width of the canvas [left edge, right edge] to the equivalent value between [-PI,+PI]
         */

        this.mesh.rotation.z = GSAP.utils.mapRange(
            -this.sizes.width / 2,
            this.sizes.width / 2,
            Math.PI * 0.1,
            -Math.PI * 0.1,
            this.mesh.position.x
        )
    }

    updateScale() {
        //Calculate percentage of image element relative to window
        this.height = this.bounds.height / window.innerHeight
        this.width = this.bounds.width / window.innerWidth

        //Set size of image relative to canvas
        this.mesh.scale.x = this.sizes.width * this.width
        this.mesh.scale.y = this.sizes.height * this.height
    }

    updateX(x = 0) {
        //Position of image in window + target position
        this.x = (this.bounds.left + x) / window.innerWidth

        //left edge of plane + Left edge of image + Position of image scaled to Canvas + Extra used for infinite illusion
        this.mesh.position.x = (-this.sizes.width / 2) + (this.mesh.scale.x / 2) + (this.x * this.sizes.width) + this.extra
    }

    updateY(y = 0) {
        //Position of image in window + target position
        this.y = (this.bounds.top + y) / window.innerHeight

        //Top edge of plane - Top edge of image + Position of image scaled to Canvas
        this.mesh.position.y = (this.sizes.height / 2) - (this.mesh.scale.y / 2) - (this.y * this.sizes.height)

        //This generates a sin curve based on the position of the image within the canvas. The closer to either edge the image gets the lower it goes down.
        // The value 56 is a "magic" number it can be tweaked to the convenience of the programmer
        this.mesh.position.y += Math.cos((this.mesh.position.x / this.sizes.width) * Math.PI * 0.1) * 56 - 56
    }

    update(scroll) {
        if (!this.bounds) return

        this.updateRotation()
        this.updateScale()
        this.updateX(scroll)
        this.updateY(0)
    }
}
