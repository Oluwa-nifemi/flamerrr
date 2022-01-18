import Media from "./Media";
import {Plane, Transform} from "ogl";
import GSAP from "gsap";

export default class Home {
    constructor({gl, scene, sizes}) {
        this.galleryElement = document.querySelector('.home__gallery')
        this.mediasElements = [...document.querySelectorAll('.home__gallery__media')];

        this.gl = gl;
        this.group = new Transform();
        this.scene = scene;
        this.sizes = sizes;

        this.createGeometry();
        this.createGallery();

        this.group.setParent(scene)


        //Setup values used for scroll calculations
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

        this.speed = {
            current: 0,
            target: 0,
            lerp: .1
        }
    }

    createGeometry() {
        this.geometry = new Plane(this.gl, {
            widthSegments: 50,
            heightSegments: 50
        });
    }

    createGallery() {
        //Create media instances
        this.mediaScenes = this.mediasElements.map((element, index) => {
            return new Media({
                element,
                index,
                gl: this.gl,
                scene: this.group,
                geometry: this.geometry,
                sizes: this.sizes
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
        this.scrollCurrent.y = this.scroll.y
    }

    onTouchMove({x, y}) {
        const yDistance = y.end - y.start

        //Calculate new target using initial scroll position + distance dragged
        this.y.target = this.scrollCurrent.y + yDistance
    }

    onTouchUp() {

    }

    onWheel({pixelY}) {
        //Calculate new target based on distance scrolled
        this.y.target += pixelY
    }

    //Animations
    show() {
        this.mediaScenes.forEach(media => media.show())
    }

    hide() {
        this.mediaScenes.forEach(media => media.hide())
    }

    //Request animation frame loop
    update() {
        if (!this.galleryBounds) return

        //Calculate distance travelled and scale it down by 1e3
        // 1e3 is an arbitrary value you can select a larger value to get a more pronounced effect... play around with it you can get some pretty goofy effects : )
        this.speed.target = .001 * (this.y.target - this.y.current);
        //Interpolate between current speed and the target speed to get smooth zoom effect
        this.speed.current = GSAP.utils.interpolate(this.speed.current, this.speed.target, this.speed.lerp)

        //Interpolate new current based for smooth scroll effect
        this.y.current = GSAP.utils.interpolate(this.y.current, this.y.target, this.y.lerp)

        if (this.scroll.y < this.y.current) {
            this.y.direction = 'top'
        } else if (this.scroll.y > this.y.current) {
            this.y.direction = 'bottom'
        }

        this.scroll.y = this.y.current

        this.mediaScenes.forEach((media) => {
            //Get half of element relative to canvas
            const scaleY = media.mesh.scale.y / 2

            if (this.y.direction === 'top') {
                //Derive bottom edge of media element
                const y = media.mesh.position.y + scaleY

                //If the bottom edge of the media element is outside the canvas from the top
                // then move the media element to the bottom of the canvas to give the illusion of infinity
                if (y < -this.sizes.height / 2) {
                    media.extra.y += this.gallerySizes.height
                }
            } else if (this.y.direction === 'bottom') {
                //Derive top edge of media element
                const y = media.mesh.position.y - scaleY

                //If the top edge of the media element is outside the canvas from the bottom
                // then move the media element to the top of the canvas to give the illusion of infinity
                if (y > this.sizes.height / 2) {
                    media.extra.y -= this.gallerySizes.height
                }
            }

            media.update(this.scroll, this.speed.current)
        })
    }

    destroy() {
        this.scene.removeChild(this.group)
    }
}