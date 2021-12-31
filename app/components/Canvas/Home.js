import Media from "./Media";
import {Plane, Transform} from "ogl";

export default class Home {
    constructor({gl, scene}) {
        this.medias = [...document.querySelectorAll('.home__gallery__media__image')];
        this.gl = gl;
        this.group = new Transform();

        this.createGeometry();
        this.createGallery();

        this.group.setParent(scene)
    }

    createGeometry() {
        this.geometry = new Plane(this.gl);
    }

    createGallery() {
        this.mediaScenes = this.medias.map((element, index) => {
            return new Media({
                element,
                index,
                gl: this.gl,
                scene: this.group,
                geometry: this.geometry
            })
        })
    }
}