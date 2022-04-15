import RendererBase from "../class/RendererBase";
import Pixies from "../class/Pixies";

export default class DomRenderer extends RendererBase {
	dom;

	constructor(game, model, dom) {
		super(game, model);

		this.dom = dom;
	}

	addClass(element, css) {
		Pixies.addClass(element, css);
	}

	removeClass(element, css) {
		Pixies.removeClass(element, css);
	}

	createElement(parent, tag, css = null) {
		return Pixies.createElement(parent, tag, css);
	}

	addChildElement(tag, css = null) {
		return this.createElement(this.dom, tag, css);
	}

	addChildDomRenderer(tag, css = null) {
		const el = this.addChildElement(tag, css);
		return new DomRenderer(this.game, this.model, el);
	}

	removeElement(el) {
		Pixies.destroyElement(el);
	}

}
