import planeFragment from "../../shaders/collections-fragment.glsl";
import planeVertex from "../../shaders/plane-vertex.glsl";
import {Mesh, Plane, Program, Texture} from "ogl";
import GSAP from "gsap";

export const TRANSITION_DURATION = 1;

export default class Transition {
    constructor({element, gl, scene, sizes}) {
        this.element = element;
        this.gl = gl;
        this.scene = scene;
        this.sizes = sizes;

        this.createGeometry()
        this.createProgram()
        this.createMesh()
    }


    //Webgl functions
    createProgram() {
        const dimensions = window.DIMENSIONS[this.element.imageUrl]

        this.program = new Program(this.gl, {
            vertex: planeVertex,
            fragment: planeFragment,
            uniforms: {
                tMap: {value: this.element.texture},
                uAlpha: {value: 1},
                uImageSize: {value: [dimensions.width, dimensions.height]},
                uResolution: {value: [this.element.bounds.width, this.element.bounds.height]}
            }
        })
    }

    createGeometry() {
        this.geometry = new Plane(this.gl);
    }

    createMesh() {
        this.mesh = new Mesh(this.gl, {geometry: this.geometry, program: this.program})

        this.mesh.scale.x = this.element.mesh.scale.x;
        this.mesh.scale.y = this.element.mesh.scale.y;
        this.mesh.scale.z = this.element.mesh.scale.z;

        this.mesh.position.x = this.element.mesh.position.x;
        this.mesh.position.y = this.element.mesh.position.y;
        this.mesh.position.z = this.element.mesh.position.z + 0.01;

        this.mesh.setParent(this.scene)
    }

    //Animations
    animate(element) {
        const timeline = GSAP.timeline({
            onComplete: () => this.destroy()
        });

        timeline.to(this.mesh.position, {
            x: element.mesh.position.x,
            y: element.mesh.position.y,
            duration: TRANSITION_DURATION,
            ease: 'expo.inOut'
        }, 0)

        timeline.to(this.mesh.scale, {
            x: element.mesh.scale.x,
            y: element.mesh.scale.y,
            duration: TRANSITION_DURATION,
            ease: 'expo.inOut'
        }, 0)

        return timeline
    }

    destroy() {
        this.scene.removeChild(this.mesh)
    }
}