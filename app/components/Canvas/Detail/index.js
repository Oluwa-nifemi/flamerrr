import GSAP from 'gsap'
import {Mesh, Plane, Program, Texture} from 'ogl'

import fragment from 'shaders/collections-fragment.glsl'
import vertex from 'shaders/plane-vertex.glsl'

export default class Detail {
    constructor({gl, scene, sizes, transition}) {
        this.element = document.querySelector('.detail__media__image');
        this.gl = gl
        this.scene = scene
        this.sizes = sizes
        this.transition = transition

        this.bounds = this.element.getBoundingClientRect()

        this.createGeometry()
        this.createTexture()
        this.createProgram()
        this.createMesh()

        this.onResize({sizes: this.sizes})

        this.showTransition()
    }

    createGeometry() {
        this.geometry = new Plane(this.gl);
    }


    //Webgl setup
    createTexture() {
        this.imageUrl = this.element.getAttribute('data-src');
        this.texture = window.TEXTURES[this.imageUrl];
    }

    createProgram() {
        const dimensions = window.DIMENSIONS[this.imageUrl]

        this.program = new Program(this.gl, {
            fragment,
            vertex,
            uniforms: {
                uAlpha: {value: 0},
                tMap: {value: this.texture},
                uImageSize: {value: [dimensions.width, dimensions.height]},
                uResolution: {value: [this.bounds.width, this.bounds.height]}
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

        this.updateScale()
        this.updateX()
        this.updateY()
    }

    //Animations
    showTransition() {
        if (this.transition) {
            this.transition.animate({
                mesh: this.mesh,
                imageUrl: this.imageUrl,
                bounds: this.bounds
            }).then(() => {
                GSAP.set(this.program.uniforms.uAlpha, {value: 1})
            })
        } else {
            GSAP.to(this.program.uniforms.uAlpha, {
                value: 1
            })
        }
    }

    hide() {
        GSAP.to(this.program.uniforms.uAlpha, {
            value: 0
        })
    }

    //Events
    onResize(sizes) {
        this.createBounds(sizes)
        this.updateX()
        this.updateY(0)
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
        this.mesh.position.x = (-this.sizes.width / 2) + (this.mesh.scale.x / 2) + (this.x * this.sizes.width)
    }

    updateY(y = 0) {
        //Position of image in window + target position
        this.y = (this.bounds.top + y) / window.innerHeight

        //Top edge of plane - Top edge of image + Position of image scaled to Canvas
        this.mesh.position.y = (this.sizes.height / 2) - (this.mesh.scale.y / 2) - (this.y * this.sizes.height)
    }

    update(scroll) {
        if (!this.bounds) return

        this.updateScale()
        this.updateX()
        this.updateY()
    }

    destroy() {
        this.scene.removeChild(this.mesh)
    }
}
