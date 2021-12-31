import {Renderer, Camera, Transform, Box, Mesh, Program} from "ogl";
import planeFragment from "../../shaders/plane-fragment.glsl";
import planeVertex from "../../shaders/plane-vertex.glsl";
import Home from "./Home";

export default class Canvas {
    constructor() {
        this.createRenderer()
        this.createCamera()
        this.createScene()
        this.createHome()

        this.onResize()
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

    createHome() {
        this.home = new Home({gl: this.gl, scene: this.scene})
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


        this.camera.perspective({
            aspect: window.innerWidth / window.innerHeight
        })

        const fov = this.camera.fov * (Math.PI / 180)
        const height = 2 * Math.tan(fov / 2) * this.camera.position.z
        const width = height * this.camera.aspect

        this.sizes = {
            height,
            width
        }

        if (this.home) {
            this.home.onResize({
                sizes: this.sizes
            })
        }
    }

    update() {
        this.renderer.render({scene: this.scene, camera: this.camera})
    }

}