import Animation from "../components/Animation";
import GSAP from "gsap";
import {calculate, split} from "../utils/text";

export default class Highlight extends Animation {
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

        window.addEventListener('resize', () => this.onResize())
    }

    animateIn() {
        const timeline = GSAP.timeline({
            delay: 0.5
        });

        timeline.set(this.element, {autoAlpha: 1})

        timeline.fromTo(this.element, {autoAlpha: 0, scale: 1.2}, {autoAlpha: 1, scale: 1})

        // this.paragraphLines.forEach((line, index) => {
        //     timeline.fromTo(
        //         line,
        //         {
        //             autoAlpha: 0,
        //             y: '100%',
        //         },
        //         {
        //             autoAlpha: 1,
        //             y: 0,
        //             delay: index * 0.2,
        //             duration: 1,
        //             ease: 'expo.out'
        //         }, 0
        //     )
        // })
    }

    animateOut() {
        GSAP.set(this.element, {autoAlpha: 0})
    }

    onResize() {
        this.paragraphLines = calculate(this.paragraphSpans);
    }
}