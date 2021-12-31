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

}