import Component from "../classes/Component";

//Class for lazy loading images
export default class AsyncLoad extends Component {
    constructor({element}) {
        super({element});

        this.createObserver()

        this.observer.observe(this.element)
    }

    createObserver() {
        this.observer = new IntersectionObserver(entries => {
            if (entries.find(entry => entry.isIntersecting)) {
                //Add event listeners then set image src
                this.element.onload = () => this.element.classList.add('is-loaded')

                this.element.src = this.element.dataset.src;

                this.observer.unobserve(this.element)
            }
        }, {rootMargin: "100px 0px 0px"})
    }
}