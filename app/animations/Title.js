import Animation from "../components/Animation";
import GSAP from "gsap";
import {calculate, split} from "../utils/text";

export default class Title extends Animation {
    constructor(
        {
            element,
            elements
        }
    ) {
        super({
            element,
            elements
        });

        split({element: this.element})
        split({element: this.element})

        this.titleSpans = this.element.querySelectorAll('span span');
        this.titleLines = calculate(this.titleSpans);

        window.addEventListener('resize', () => this.onResize())
    }

    animateIn() {
        const timeline = GSAP.timeline({
            delay: 0.5
        });

        timeline.set(this.element, {autoAlpha: 1})

        this.titleLines.forEach((line, index) => {
            timeline.fromTo(
                line,
                {
                    y: '100%',
                },
                {
                    y: 0,
                    delay: index * 0.2,
                    duration: 1,
                    ease: 'expo.out'
                }, 0
            )
        })
    }

    animateOut() {
        GSAP.set(this.element, {autoAlpha: 0})
    }

    onResize() {
        this.titleLines = calculate(this.titleSpans);
    }
}