import MenuLineRenderer from "./MenuLineRenderer";
import DomRenderer from "./DomRenderer";

const DEBUG_MENU = true;

export default class MenuRenderer extends DomRenderer {
	menu;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.menu = null;
	}

	activateInternal() {
		this.menu = this.createElement(this.dom, 'div', 'menu');
		this.addClass(this.menu, this.model.css);
		if (this.model.text !== null) {
			const t = this.createElement(this.menu, 'div', 'text');
			t.innerHTML = this.model.text;
		}

		const ul = this.createElement(this.menu, 'ul');

		const lines = this.model.children;
		for (let i = 0, max = lines.length; i < max; i++) {
			const lineGroup = this.createElement(ul, 'li');
			const renderer = new MenuLineRenderer(this.game, lines[i], lineGroup);
			this.addChild(renderer);
			renderer.activate();
		}
	}

	deactivateInternal() {
		if (this.menu) this.removeElement(this.menu);
	}

}
