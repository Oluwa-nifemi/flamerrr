import {Renderer, Camera, Transform, Box, Mesh, Program} from "ogl";
import planeFragment from "../../shaders/plane-fragment.glsl";
import planeVertex from "../../shaders/plane-vertex.glsl";

export default class Canvas {
    constructor() {
        this.createRenderer()
        this.createCamera()
        this.createScene()
        this.createBox()
    }

    createRenderer() {
        this.renderer = new Renderer();

        this.gl = this.renderer.gl;

        document.documentElement.append(this.gl.canvas)
    }

    createCamera() {
        this.camera = new Camera(this.gl);
        this.camera.position.z = 5;
        this.camera.perspective({
            aspect: window.innerWidth / window.innerHeight
        })
    }

    createScene() {
        this.scene = new Transform();
    }

    createBox() {
        this.geometry = new Box(this.gl);

        this.program = new Program(this.gl, {
            vertex: planeVertex,
            fragment: planeFragment,
        })

        this.mesh = new Mesh(this.gl, {geometry: this.geometry, program: this.program})

        this.mesh.setParent(this.scene)
    }

    onResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    update() {
        this.mesh.rotation.x += 0.01
        this.mesh.rotation.y += 0.01
        this.renderer.render({scene: this.scene, camera: this.camera})
    }

}