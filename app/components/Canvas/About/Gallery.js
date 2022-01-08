import {Transform} from 'ogl'
import GSAP from 'gsap'

import Media from './Media'

export default class Gallery {
    constructor({element, geometry, index, gl, scene, sizes}) {
        this.element = element
        this.elementWrapper = element.querySelector('.about__gallery__wrapper')

        this.geometry = geometry
        this.index = index
        this.gl = gl
        this.scene = scene
        this.sizes = sizes

        this.group = new Transform()

        this.scroll = {
            current: 0,
            start: 0,
            target: 0,
            lerp: 0.1,
            velocity: 1 // This variable is used to make the gallery auto move in a direction either left or right depending on whether it is -1 or 1 respectively
        }

        this.createMedias()

        this.group.setParent(this.scene)
    }

    //Setup media elements
    createMedias() {
        this.mediasElements = [...this.element.querySelectorAll('.about__gallery__media')]

        this.medias = this.mediasElements.map((element, index) => {
            return new Media({
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
        this.medias.forEach(media => media.show())
    }

    hide() {
        this.medias.forEach(media => media.hide())
    }

    //Events
    onResize(event) {
        this.bounds = this.elementWrapper.getBoundingClientRect()

        this.sizes = event.sizes

        //On resize recalculate width of gallery relative to canvas
        this.width = (this.bounds.width / window.innerWidth) * this.sizes.width

        this.scroll.current = this.scroll.target = 0

        this.medias.forEach(media => media.onResize(event, this.scroll.current, this.width))
    }

    onTouchDown() {
        //On touch down
        this.scroll.start = this.scroll.current
    }

    onTouchMove({x}) {
        //Increase target based on distance dragged
        const distance = x.end - x.start

        this.scroll.target = this.scroll.start + distance
    }

    onTouchUp({x, y}) {

    }

    //Update
    update(scroll) {
        if (!this.bounds) return

        //Calculate the distance scrolled in the page and scale it down
        const distanceScrolled = (scroll.current - scroll.target) * 0.1

        //If scrolling down move gallery right else move gallery left
        if (this.scroll.current < this.scroll.target) {
            this.direction = 'right'

            this.scroll.velocity = -1
        } else if (this.scroll.current > this.scroll.target) {
            this.direction = 'left'

            this.scroll.velocity = 1
        }

        //Use velocity to auto move the gallery in either direction
        this.scroll.target -= this.scroll.velocity

        //Add scaled down distance scrolled to scroll the gallery
        this.scroll.target += distanceScrolled

        //Interpolate for smooth scroll
        this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.lerp)


        this.medias.forEach((media) => {
            //Get half of media width + buffer
            const scaleX = media.mesh.scale.x / 2 + 0.25

            if (this.direction === 'left') {
                //If scrolling left get right edge of mesh
                const x = media.mesh.position.x + scaleX

                //If out of view move the element to the right edge
                if (x < -this.sizes.width / 2) {
                    media.extra += this.width
                }
            } else if (this.direction === 'right') {
                //If scrolling right get left edge of mesh
                const x = media.mesh.position.x - scaleX

                //If out of view move the element to the left edge
                if (x > this.sizes.width / 2) {
                    media.extra -= this.width
                }
            }

            //Update media
            media.update(this.scroll.current)
        })

        //Calculate the percentage distance scrolled and use that to scroll the canvas vertically
        const y = scroll.current / window.innerHeight
        this.group.position.y = y * this.sizes.height
    }

    //Destroy
    destroy() {
        this.scene.removeChild(this.group)
    }
}
