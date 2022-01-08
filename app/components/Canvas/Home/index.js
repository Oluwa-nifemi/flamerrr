import Media from "./Media";
import {Plane, Transform} from "ogl";
import GSAP from "gsap";
import map from 'lodash/map'

export default class Home {
    constructor({gl, scene}) {
        this.galleryElement = document.querySelector('.home__gallery')
        this.mediasElements = [...document.querySelectorAll('.home__gallery__media__image')];

        this.gl = gl;
        this.group = new Transform();
        this.scene = scene;

        this.createGeometry();
        this.createGallery();

        this.group.setParent(scene)


        //Setup values used for scroll calculations
        this.x = {
            current: 0,
            target: 0,
            lerp: 0.1
        }

        this.y = {
            current: 0,
            target: 0,
            lerp: 0.1
        }

        this.scrollCurrent = {
            x: 0,
            y: 0
        }

        this.scroll = {
            x: 0,
            y: 0
        }
    }

    createGeometry() {
        this.geometry = new Plane(this.gl);
    }

    createGallery() {
        //Create media instances
        this.mediaScenes = this.mediasElements.map((element, index) => {
            return new Media({
                element,
                index,
                gl: this.gl,
                scene: this.group,
                geometry: this.geometry
            })
        })
    }

    //On resize recalculate
    onResize(event) {
        this.galleryBounds = this.galleryElement.getBoundingClientRect()

        this.sizes = event.sizes

        //Recalculate gallery size relative to canvas plane on resize
        this.gallerySizes = {
            height: (this.galleryBounds.height / window.innerHeight) * this.sizes.height,
            width: (this.galleryBounds.width / window.innerWidth) * this.sizes.width,
        }

        this.mediaScenes.forEach(media => media.onResize(event))
    }

    onTouchDown() {
        //Save current scroll position when user touches canvas
        this.scrollCurrent.x = this.scroll.x
        this.scrollCurrent.y = this.scroll.y
    }

    onTouchMove({x, y}) {
        const xDistance = x.end - x.start
        const yDistance = y.end - y.start

        //Calculate new target using initial scroll position + distance dragged
        this.x.target = this.scrollCurrent.x + xDistance
        this.y.target = this.scrollCurrent.y + yDistance
    }

    onTouchUp() {

    }

    onWheel({pixelX, pixelY}) {
        //Calculate new target based on distance scrolled
        this.x.target += pixelX
        this.y.target += pixelY
    }

    //Animations
    show() {
        map(this.mediaScenes, media => media.show())
    }

    hide() {
        map(this.mediaScenes, media => media.hide())
    }

    //Request animation frame loop
    update() {
        if (!this.galleryBounds) return

        //Interpolate new current based for smooth scroll effect
        this.x.current = GSAP.utils.interpolate(this.x.current, this.x.target, this.x.lerp)
        this.y.current = GSAP.utils.interpolate(this.y.current, this.y.target, this.y.lerp)

        //Derive scroll directions
        if (this.scroll.x < this.x.current) {
            this.x.direction = 'right'
        } else if (this.scroll.x > this.x.current) {
            this.x.direction = 'left'
        }

        if (this.scroll.y < this.y.current) {
            this.y.direction = 'top'
        } else if (this.scroll.y > this.y.current) {
            this.y.direction = 'bottom'
        }

        this.scroll.x = this.x.current
        this.scroll.y = this.y.current

        this.mediaScenes.forEach((media) => {
            //Get half of element relative to canvas
            const scaleX = media.mesh.scale.x / 2

            if (this.x.direction === 'left') {
                //Derive right edge of media element
                const x = media.mesh.position.x + scaleX

                //If the right edge of the media element is outside the canvas from the left
                // then move the media element to the right of the canvas to give the illusion of infinity : )
                if (x < -this.sizes.width / 2) {
                    media.extra.x += this.gallerySizes.width

                    media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
                }

            } else if (this.x.direction === 'right') {
                //Derive left edge of media element
                const x = media.mesh.position.x - scaleX

                //If the left edge of the media element is outside the canvas from the right
                // then move the media element to the left of the canvas to give the illusion of infinity
                if (x > this.sizes.width / 2) {
                    media.extra.x -= this.gallerySizes.width

                    media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
                }
            }

            const scaleY = media.mesh.scale.y / 2

            if (this.y.direction === 'top') {
                //Derive bottom edge of media element
                const y = media.mesh.position.y + scaleY

                //If the bottom edge of the media element is outside the canvas from the top
                // then move the media element to the bottom of the canvas to give the illusion of infinity
                if (y < -this.sizes.height / 2) {
                    media.extra.y += this.gallerySizes.height

                    media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
                }
            } else if (this.y.direction === 'bottom') {
                //Derive top edge of media element
                const y = media.mesh.position.y - scaleY

                //If the top edge of the media element is outside the canvas from the bottom
                // then move the media element to the top of the canvas to give the illusion of infinity
                if (y > this.sizes.height / 2) {
                    media.extra.y -= this.gallerySizes.height

                    media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
                }
            }

            media.update(this.scroll)
        })
    }

    destroy() {
        this.scene.removeChild(this.group)
    }
}