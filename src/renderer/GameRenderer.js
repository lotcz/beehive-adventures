import SvgRenderer from "./SvgRenderer";
import Stats from "../class/stats.module";
import LevelRenderer from "./LevelRenderer";
import MenuRenderer from "./MenuRenderer";
import LevelEditorRenderer from "./LevelEditorRenderer";
import TextRenderer from "./TextRenderer";
import ResourcesLoader from "../class/ResourcesLoader";
import DomRenderer from "./DomRenderer";
import TextModel from "../model/TextModel";
import Pixies from "../class/Pixies";
import BeeStateRenderer from "./BeeStateRenderer";
import {SVG} from "@svgdotjs/svg.js";

const DEBUG_FPS = true;

export default class GameRenderer extends DomRenderer {
	loadingScreenRenderer;
	levelRenderer;
	menuRenderer;
	editorRenderer;
	bg;
	fg;
	draw;

	constructor(model, dom) {
		super(model, model, dom);

		this.addClass(this.dom, 'game-host');
		this.bg = this.addChildElement('div', 'game-bg');
		this.fg = this.addChildElement('div', 'game-fg');
		this.draw = SVG().addTo(this.fg);

		if (DEBUG_FPS) {
			this.stats = new Stats();
			this.dom.appendChild(this.stats.dom);
		}

		this.loadingScreenDom = null;
		this.loadingScreenRenderer = null;
		this.levelRenderer = null;
		this.menuRenderer = null;
		this.editorRenderer = null;
		this.statusBarRenderer = null;

		this.showLoading();
		Pixies.destroyElement(document.getElementById('initial_loading'));
	}

	render() {
		if (DEBUG_FPS) {
			this.stats.update();
		}

		if (this.model.isFullscreen.isDirty()) {
			if (this.model.isFullscreen.get()) {
				Pixies.addClass(this.dom, 'fullscreen');
				Pixies.removeClass(this.dom, 'window');
			} else {
				Pixies.addClass(this.dom, 'window');
				Pixies.removeClass(this.dom, 'fullscreen');
			}
			this.model.isFullscreen.clean();
		}

		if (this.model.viewBoxSize.isDirty()) {
			this.draw.size(this.model.viewBoxSize.x, this.model.viewBoxSize.y);
			this.model.viewBoxSize.clean();
		}

		if (this.model.level.isDirty()) {
			if (this.model.level.isEmpty()) {
				this.hideLevel();
				this.showLoading();
			} else {
				this.showLevel();
			}
			this.model.level.clean();
		}

		if (this.model.menu.isDirty()) {
			if (this.model.menu.isEmpty()) {
				this.hideMenu();
			} else if (this.loadingScreenRenderer === null) {
				this.showMenu();
			}
			this.model.menu.clean();
		}

		if (this.model.isInEditMode.isDirty()) {
			if (this.model.isInEditMode.get() && !this.model.level.isEmpty()) {
				this.showEditor();
			} else {
				this.hideEditor();
			}
			this.model.isInEditMode.clean();
		}

		this.children.forEach((r) => r.render());
		this.clean();
		this.model.clean();
	}

	showLoading() {
		this.hideMenu();
		if (!this.loadingScreenRenderer) {
			this.loadingScreenDom = Pixies.createElement(this.dom, 'div', 'loading');
			this.loadingScreenRenderer = new DomRenderer(this.game, this.model, this.loadingScreenDom);
			this.loadingScreenRenderer.addChild(new TextRenderer(this.game, new TextModel({label: 'Loading...'}), this.loadingScreenDom));
			this.addChild(this.loadingScreenRenderer);
			this.loadingScreenRenderer.activate();
		}
	}

	hideLoading() {
		this.showMenu();
		if (this.loadingScreenRenderer) {
			Pixies.destroyElement(this.loadingScreenDom);
			this.removeChild(this.loadingScreenRenderer);
		}
		this.loadingScreenRenderer = null;
		this.loadingScreenDom = null;
	}

	showMenu() {
		this.hideMenu();
		if (!this.game.menu.isEmpty()) {
			if (!this.game.menu.get().closed) {
				this.menuRenderer = new MenuRenderer(this.game, this.game.menu.get(), this.dom);
				this.addChild(this.menuRenderer);
				this.menuRenderer.activate();
			}
		}
	}

	hideMenu() {
		if (this.menuRenderer) this.removeChild(this.menuRenderer);
		this.menuRenderer = null;
	}

	showLevel() {
		this.hideLives();
		this.hideLevel();
		this.hideEditor();
		this.hideMenu();
		this.showLoading();

		if (!this.game.level.isEmpty()) {
			const loader = new ResourcesLoader(this.game.resources, this.draw, this.game.level.get().resources);
			loader.load(() => {
				this.levelRenderer = new LevelRenderer(this.game, this.game.level.get(), this.draw, this.bg);
				this.addChild(this.levelRenderer);
				this.levelRenderer.activate();
				console.log('activated Level renderer');
				this.hideLoading();
				this.showMenu();
				if (this.game.level.get().isPlayable) {
					this.showLives();
				}
				if (this.model.isInEditMode.get()) {
					this.showEditor();
				}
			});
		}
	}

	hideLevel() {
		if (this.levelRenderer) this.removeChild(this.levelRenderer);
		this.levelRenderer = null;
		this.hideEditor();
		this.hideLives();
	}

	showLives() {
		this.hideLives();
		this.statusBarRenderer = new BeeStateRenderer(this.game, this.game.beeState, this.dom);
		this.addChild(this.statusBarRenderer);
		this.statusBarRenderer.activate();
	}

	hideLives() {
		if (this.statusBarRenderer) this.removeChild(this.statusBarRenderer);
		this.statusBarRenderer = null;
	}

	showEditor() {
		this.hideEditor();
		this.editorRenderer = new LevelEditorRenderer(this.game, this.model.editor, this.draw, this.dom);
		this.addChild(this.editorRenderer);
		this.editorRenderer.activate();
	}

	hideEditor() {
		if (this.editorRenderer) this.removeChild(this.editorRenderer);
		this.editorRenderer = null;
	}

}
