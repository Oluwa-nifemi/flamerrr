import Component from "./Component";

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

        this.observer = new IntersectionObserver(entries => {
            if (entries.find(entry => entry.isIntersecting)) {
                this.animateIn()
            } else {
                this.animateOut()
            }
        }, {threshold: 0.5});

        this.observer.observe(this.element)
    }

    animateIn() {

    }

    animateOut() {

    }
}