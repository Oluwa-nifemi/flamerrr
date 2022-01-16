import Component from "../classes/Component";
import GSAP from "gsap";
import {split} from "../utils/text";
import {Texture} from "ogl";

export default class Preloader extends Component {
    constructor({canvas}) {
        super({
            element: '.preloader',
            elements: {
                number: '.preloader__number__text',
                text: '.preloader__text',
            }
        });

        this.canvas = canvas

        window.TEXTURES = {}

        this.createLoader()
    }

    create() {
        super.create()

        //Split elements inside preloader into spans to allow easy animations
        split({
            element: this.elements.text,
            expression: '<br/>'
        })

        split({
            element: this.elements.text,
            expression: '<br/>'
        })

        this.elements.titleSpans = this.elements.text.querySelectorAll('span span')

        //Variable that keeps track of loaded images in order to calculate and display percentage
        this.loadedImages = 0;
    }

    createLoader() {
        //Preload images onto GPU
        window.ASSETS.forEach(imageUrl => {
            const texture = new Texture(this.canvas.gl, {
                generateMipmaps: true
            })

            const image = new Image();

            image.crossOrigin = 'anonymous'

            image.onload = () => {
                texture.image = image;

                window.TEXTURES[imageUrl] = texture;

                this.onAssetLoaded()
            }

            image.src = imageUrl
        })
    }

    onAssetLoaded() {
        this.loadedImages++;

        //Calculate and display percentage of loaded images
        this.percent = Math.round(this.loadedImages * 100 / window.ASSETS.length)

        this.elements.number.innerHTML = `${this.percent}%`;

        if (this.percent === 100) {
            this.onLoaded()
        }
    }

    onLoaded() {
        this.animateOut = GSAP.timeline({
            onComplete: () => this.emit('completed')
        });

        //Ease out title row by row
        this.animateOut.to(this.elements.titleSpans, {
            y: '100%',
            duration: 1.5,
            ease: 'expo.out',
            stagger: 0.3
        })

        //Ease out number
        this.animateOut.to(this.elements.number, {
            y: '100%',
            duration: 1.5,
            ease: 'expo.out'
        }, '-=1.4')

        //Scale down preloader
        this.animateOut.to(this.element, {
            scaleY: '0',
            transformOrigin: '100% 100%',
            duration: 1.5,
            ease: 'expo.out'
        }, '-=1')
    }

    destroy() {
        this.element.parentNode.removeChild(this.element)
    }
}