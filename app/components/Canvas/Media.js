import planeFragment from "../../shaders/plane-fragment.glsl";
import planeVertex from "../../shaders/plane-vertex.glsl";
import {Mesh, Program, Texture} from "ogl";

export default class Media {
    constructor({element, gl, scene, index, geometry}) {
        this.element = element;
        this.gl = gl;
        this.scene = scene;
        this.geometry = geometry;
        this.index = index;

        this.createTexture()
        this.createProgram()
        this.createMesh()

        this.extra = {
            x: 0,
            y: 0
        }
    }

    createTexture() {
        this.texture = new Texture(this.gl);

        this.image = new Image();

        this.image.onload = () => {
            this.texture.image = this.image
        }

        this.image.crossOrigin = 'anonymous'

        this.image.src = this.element.getAttribute('data-src')
    }

    createProgram() {
        this.program = new Program(this.gl, {
            vertex: planeVertex,
            fragment: planeFragment,
            uniforms: {
                tMap: {value: this.texture}
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

    onResize({sizes}) {
        this.extra = {
            x: 0,
            y: 0
        }

        this.createBounds(sizes)
    }

    updateScale() {
        this.height = this.bounds.height / window.innerHeight
        this.width = this.bounds.width / window.innerWidth

        this.mesh.scale.x = this.sizes.width * this.width
        this.mesh.scale.y = this.sizes.height * this.height
    }

    updateX(x = 0) {
        this.x = (this.bounds.left + x) / window.innerWidth

        this.mesh.position.x = (-this.sizes.width / 2) + (this.mesh.scale.x / 2) + (this.x * this.sizes.width) + this.extra.x
    }

    updateY(y = 0) {
        this.y = (this.bounds.top + y) / window.innerHeight

        this.mesh.position.y = (this.sizes.height / 2) - (this.mesh.scale.y / 2) - (this.y * this.sizes.height) + this.extra.y
    }

    update(scroll) {
        if (!this.bounds) return

        this.updateX(scroll.x)
        this.updateY(scroll.y)
    }
}