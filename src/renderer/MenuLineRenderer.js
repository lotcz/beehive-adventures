import TextRenderer from "./TextRenderer";
import DomRenderer from "./DomRenderer";

const DEBUG_MENU = true;

export default class MenuLineRenderer extends DomRenderer {
	textRenderer;
	linkElement;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.linkElement = null;
		this.textRenderer = null;

	}

	activateInternal() {
		this.linkElement = this.createElement(this.dom, 'a');
		this.textRenderer = new TextRenderer(this.game, this.model.text, this.linkElement);
		this.addChild(this.textRenderer);
		this.textRenderer.activate();

		const clickHandler = this.model.onClick.get();
		if (clickHandler) {
			this.linkElement.addEventListener('click', clickHandler);
		}
	}

	deactivateInternal() {
		if (this.linkElement) this.removeElement(this.linkElement);
		if (this.textRenderer) this.removeChild(this.textRenderer);
	}

}
