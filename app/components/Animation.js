import Component from "../classes/Component";

export default class Animation extends Component {
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

        //Only play animation when element is in view
        this.observer = new IntersectionObserver(entries => {
            if (entries.find(entry => entry.isIntersecting)) {
                this.animateIn()
            } else {
                this.animateOut()
            }
        });

        this.observer.observe(this.element)
    }

    animateIn() {

    }

    animateOut() {

    }
}