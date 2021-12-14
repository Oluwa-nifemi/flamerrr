import Component from "../classes/Component";
import GSAP from "gsap";
import {split} from "../utils/text";

export default class Preloader extends Component {
    constructor() {
        super({
            element: '.preloader',
            elements: {
                number: '.preloader__number__text',
                text: '.preloader__text',
                images: document.querySelectorAll('img')
            }
        });
    }

    create() {
        super.create();

        this.elements.images.forEach(image => {
            image.onload = () => this.onAssetLoaded(image)
            image.src = image.getAttribute('data-src');
        })

        split({
            element: this.elements.text,
            expression: '<br/>'
        })

        split({
            element: this.elements.text,
            expression: '<br/>'
        })

        this.elements.titleSpans = this.elements.text.querySelectorAll('span span')

        this.loadedImages = 0;
    }

    onAssetLoaded() {
        this.loadedImages++;

        this.percent = Math.round(this.loadedImages * 100 / this.elements.images.length)

        this.elements.number.innerHTML = `${this.percent}%`;

        if (this.percent === 100) {
            this.onLoaded()
        }
    }

    onLoaded() {
        this.animateOut = GSAP.timeline({
            onComplete: () => this.emit('completed')
        });

        this.animateOut.to(this.elements.titleSpans, {
            y: '100%',
            duration: 1.5,
            ease: 'expo.out',
            stagger: 0.1
        })

        this.animateOut.to(this.elements.number, {
            y: '100%',
            duration: 1.5,
            ease: 'expo.out'
        }, '-=1.4')

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