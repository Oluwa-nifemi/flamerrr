import Page from 'classes/Page'
import Button from "../../components/Button";

export default class Detail extends Page {
  constructor() {
    super({
      id: 'detail',

      element: '.detail',
      elements: {
        link: '.detail__button'
      }
    })
  }

  create() {
    super.create()

    this.link = new Button({element: this.elements.link});
  }

  destroy() {
    super.destroy()

    this.link.removeEventListeners();
  }
}
