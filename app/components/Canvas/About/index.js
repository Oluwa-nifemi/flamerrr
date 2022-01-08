import {Plane, Transform} from 'ogl'

import Gallery from './Gallery'

export default class About {
    constructor({gl, scene, sizes}) {
        this.gl = gl
        this.sizes = sizes

        this.group = new Transform()

        this.createGeometry()
        this.createGalleries()

        this.group.setParent(scene)

        this.show()
    }

    //Setup webgl
    createGeometry() {
        this.geometry = new Plane(this.gl)
    }

    //Setup galleries
    createGalleries() {
        this.galleriesElements = [...document.querySelectorAll('.about__gallery')]


        this.galleries = this.galleriesElements.map((element, index) => {
            return new Gallery({
                element,
                geometry: this.geometry,
                index,
                gl: this.gl,
                scene: this.group,
                sizes: this.sizes
            })
        })
    }

    //Animations
    show() {
        this.galleries.forEach(gallery => gallery.show())
    }

    hide() {
        this.galleries.forEach(gallery => gallery.hide())
    }

    //Events
    onResize(event) {
        this.galleries.forEach(gallery => gallery.onResize(event))
    }

    onTouchDown(event) {
        this.galleries.forEach(gallery => gallery.onTouchDown(event))
    }

    onTouchMove(event) {
        this.galleries.forEach(gallery => gallery.onTouchMove(event))
    }

    onTouchUp(event) {
        this.galleries.forEach(gallery => gallery.onTouchUp(event))
    }

    onWheel({pixelX, pixelY}) {

    }

    //Update loop
    update(scroll) {
        this.galleries.forEach(gallery => gallery.update(scroll))
    }

    //Destroy
    destroy() {
        this.galleries.forEach(gallery => gallery.destroy())
    }
}
