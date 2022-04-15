import DomRenderer from "./DomRenderer";

export default class TextRenderer extends DomRenderer {
	text;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.text = null;
	}

	removeText() {
		if (this.text) this.removeElement(this.text);
	}

	renderInternal() {
		this.removeText();
		this.text = this.createElement(this.dom, 'span');
		this.text.innerHTML = this.model.label.get();
	}

	deactivateInternal() {
		this.removeText();
	}

}
