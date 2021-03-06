import planeFragment from "../../../shaders/collections-fragment.glsl";
import planeVertex from "../../../shaders/plane-vertex.glsl";
import {Mesh, Program} from "ogl";
import GSAP from "gsap";
import {remToPx} from "../../../utils/remToPx";

export default class Media {
    constructor({element, gl, scene, index, geometry, sizes}) {
        this.element = element;
        this.gl = gl;
        this.scene = scene;
        this.geometry = geometry;
        this.index = index;
        this.sizes = sizes;

        this.extra = {
            x: 0,
            y: 0
        }

        this.createTexture()
        this.createProgram()
        this.createMesh()
        this.createBounds({sizes: this.sizes});
    }


    //Webgl functions
    createTexture() {
        const image = this.element.querySelector('img');
        this.imageUrl = image.getAttribute('data-src');
        this.texture = window.TEXTURES[image.getAttribute('data-src')];
    }

    createProgram() {
        const dimensions = window.DIMENSIONS[this.imageUrl]

        this.program = new Program(this.gl, {
            vertex: planeVertex,
            fragment: planeFragment,
            uniforms: {
                tMap: {value: this.texture},
                uAlpha: {value: 0},
                uImageSize: {value: [dimensions.width, dimensions.height]},
                uResolution: {value: [remToPx(33), remToPx(46.510067114)]}
            }
        })
    }

    createMesh() {
        this.mesh = new Mesh(this.gl, {geometry: this.geometry, program: this.program})

        this.mesh.setParent(this.scene)

        this.mesh.position.x = this.index * this.mesh.scale.x;
    }

    createBounds(sizes) {
        this.sizes = sizes

        this.bounds = this.element.getBoundingClientRect()

        this.updateScale()
        this.updateX()
        this.updateY()
    }

    //Event listeners
    onResize({sizes}) {
        this.extra = {
            x: 0,
            y: 0
        }

        this.createBounds(sizes)
    }

    //Update functions
    updateScale() {
        //On resize recalculate height and width percentages relative to window sizes
        this.height = this.bounds.height / window.innerHeight
        this.width = this.bounds.width / window.innerWidth

        //Use width and height percentages to generate the width and height relative to the canvas
        this.mesh.scale.x = this.sizes.width * this.width
        this.mesh.scale.y = this.sizes.height * this.height
    }

    updateX(x = 0) {
        this.x = (this.bounds.left + x) / window.innerWidth

        //Move it to the edge of the screen (because cartesian coordinates) + Move the image left by half of it's width + Move the image left by it's coordinates in the gallery + extra used for infinite scroll
        this.mesh.position.x = (-this.sizes.width / 2) + (this.mesh.scale.x / 2) + (this.x * this.sizes.width) + this.extra.x
    }

    updateY(y = 0) {
        this.y = (this.bounds.top + y) / window.innerHeight

        //Same calculation as updateX
        this.mesh.position.y = (this.sizes.height / 2) - (this.mesh.scale.y / 2) - (this.y * this.sizes.height) + this.extra.y
    }

    update(scroll) {
        if (!this.bounds) return

        this.updateX(scroll)
        this.updateY()
    }

    //Animations
    show() {
        GSAP.fromTo(this.program.uniforms.uAlpha, {
            value: 0
        }, {
            value: this.index === 0 ? 1 : 0.4
        })
    }

    hide() {
        GSAP.to(this.program.uniforms.uAlpha, {
            value: 0
        })
    }

    showActive() {
        GSAP.to(this.program.uniforms.uAlpha, {
            value: 1
        })
    }

    hideActive() {
        GSAP.to(this.program.uniforms.uAlpha, {
            value: 0.4
        })
    }
}