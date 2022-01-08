import Component from "../classes/Component";
import GSAP from "gsap";

export default class Button extends Component {
    constructor({element}) {
        super({element});

        const path = this.element.querySelector('path:last-child');

        this.timeline = GSAP.timeline({paused: true});

        const totalLength = path.getTotalLength();

        //Path animation for button
        this.timeline.fromTo(
            path,
            {
                strokeDasharray: totalLength,
                strokeDashoffset: totalLength
            },
            {
                strokeDashoffset: 0,
            }
        )
    }

    //Event listeners
    onMouseEnter() {
        this.timeline.play();
    }

    onMouseLeave() {
        this.timeline.reverse();
    }

    //Setup event listeners
    addEventListeners() {
        this.onMouseEnterEvent = this.onMouseEnter.bind(this)
        this.onMouseLeaveEvent = this.onMouseLeave.bind(this)

        this.element.addEventListener('mouseenter', this.onMouseEnterEvent)
        this.element.addEventListener('mouseleave', this.onMouseLeaveEvent)
    }

    removeEventListeners() {
        this.element.removeEventListener('mouseenter', this.onMouseEnterEvent)
        this.element.removeEventListener('mouseleave', this.onMouseLeaveEvent)
    }
}