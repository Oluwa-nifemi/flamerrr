import Media from "./Media";
import {Plane, Transform} from "ogl";
import GSAP from "gsap";
import Prefix from 'prefix'

export default class Collections {
    constructor({gl, scene, transition, sizes}) {
        this.galleryElement = document.querySelector('.collections__gallery')
        this.galleryWrapperElement = document.querySelector('.collections__gallery__wrapper')
        this.mediaElements = [...document.querySelectorAll('.collections__gallery__media')];

        this.gl = gl;
        this.group = new Transform();
        this.scene = scene;
        this.transition = transition;
        this.sizes = sizes;

        this.createGeometry();
        this.createGallery();

        this.group.setParent(scene)

        this.currentMediaElementIndex = 0;
        this.collectionElements = [...document.querySelectorAll('.collections__article')];
        this.collectionElementActiveClass = 'collections__article--active'

        this.titlesElement = document.querySelector('.collections__titles')

        this.transformPrefix = Prefix('transform')

        //Setup values used for scroll calculations
        this.scroll = {
            current: 0,
            target: 0,
            lerp: 0.1,
            x: 0,
        }

        this.scrollCurrent = {
            x: 0,
            y: 0
        }

        this.onResize({sizes})

        this.show()
    }

    createGeometry() {
        this.geometry = new Plane(this.gl);
    }

    createGallery() {
        //Create media instances
        this.mediaScenes = this.mediaElements.map((element, index) => {
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
        this.bounds = this.galleryWrapperElement.getBoundingClientRect()
        this.scroll.limit = this.bounds.width - this.mediaScenes[0].element.clientWidth

        this.sizes = event.sizes

        //Recalculate gallery size relative to canvas plane on resize
        this.gallerySizes = {
            height: (this.bounds.height / window.innerHeight) * this.sizes.height,
            width: (this.bounds.width / window.innerWidth) * this.sizes.width,
        }

        this.mediaScenes.forEach(media => media.onResize(event))
    }

    onTouchDown() {
        //Save current scroll position when user touches canvas
        this.scrollCurrent.x = this.scroll.x
        this.scrollCurrent.y = this.scroll.y
    }

    onTouchMove({x}) {
        const xDistance = x.end - x.start

        //Calculate new target using initial scroll position + distance dragged
        this.scroll.target = this.scrollCurrent.x + xDistance
    }

    onTouchUp() {

    }

    onWheel({pixelY}) {
        //Calculate new target based on distance scrolled
        this.scroll.target -= pixelY
    }

    //Animations
    show() {
        if (this.transition) {
            const elementSrc = this.transition.element.element.src;
            const targetMedia = this.mediaScenes.find(media => media.texture.image.src === elementSrc)

            const scrollDistance = (targetMedia.mesh.position.x / this.sizes.width) * window.innerWidth;
            this.scroll.current = this.scroll.target = -scrollDistance

            this.transition.animate({
                mesh: {
                    ...targetMedia.mesh,
                    position: {
                        x: 0,
                        y: targetMedia.mesh.position.y
                    }
                }
            }).then(() => {
                this.mediaScenes.forEach(media => {
                    if (targetMedia === media) {
                        targetMedia.program.uniforms.uAlpha = {
                            value: 1
                        }
                    } else {
                        media.show()
                    }
                })
            })
        } else {
            this.mediaScenes.forEach(media => media.show())
        }
    }

    hide() {
        this.mediaScenes.forEach(media => media.hide())
    }

    //Request animation frame loop
    update() {
        if (!this.bounds) return

        this.scroll.target = GSAP.utils.clamp(-this.scroll.limit, 0, this.scroll.target)

        //Interpolate new current based for smooth scroll effect
        this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.lerp)

        //Move gallery element with webgl canvas to ensure that the links behind the canvas stay clickable and match the positions
        this.galleryElement.style[this.transformPrefix] = `translateX(${this.scroll.current}px)`

        //Derive scroll directions
        if (this.scroll.x < this.scroll.current) {
            this.scroll.direction = 'right'
        } else if (this.scroll.x > this.scroll.current) {
            this.scroll.direction = 'left'
        }

        this.scroll.x = this.scroll.current

        this.mediaScenes.forEach((media) => {
            media.update(this.scroll.current)

            media.mesh.position.y += Math.cos((media.mesh.position.x / this.sizes.width) * Math.PI * 0.1) * 75 - 75
        })

        //Get the current media element in the center
        const index = Math.floor(Math.abs(this.scroll.current / this.scroll.limit) * this.mediaElements.length);

        if (this.currentMediaElementIndex !== index) {
            this.handleElementChange(index)
        }
    }

    //On change media element
    handleElementChange(index) {
        const previousElement = this.mediaScenes[this.currentMediaElementIndex];
        previousElement.hideActive()

        const currentElement = this.mediaScenes[index];
        currentElement.showActive()

        this.currentMediaElementIndex = index;

        //Hide currently active collection
        document.querySelector(`.${this.collectionElementActiveClass}`).classList.remove(this.collectionElementActiveClass);


        //Show new active collection
        const activeCollection = this.mediaElements[index].getAttribute('data-collection');
        this.collectionElements[activeCollection].classList.add(this.collectionElementActiveClass)

        this.titlesElement.style[this.transformPrefix] = `translateY(-${25 * activeCollection}%) translate(-50%, -50%) rotate(-90deg)`

        document.querySelector('.collections__gallery__link.is-active').classList.remove('is-active');
        const activeLink = document.querySelector(`.collections__gallery__link:nth-child(${index + 1})`);

        activeLink.classList.add('is-active')
    }

    destroy() {
        this.scene.removeChild(this.group)
    }
}