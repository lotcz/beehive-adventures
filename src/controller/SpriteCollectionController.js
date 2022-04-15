import ControllerBase from "../class/ControllerBase";
import SpriteController from "./SpriteController";

export default class SpriteCollectionController extends ControllerBase {
	constructor(game, model, controls) {
		super(game, model, controls);

		this.model.children.forEach((m) => this.addController(m));
		this.model.addOnAddListener((param) => this.addController(param));
		this.model.addOnRemoveListener((param) => this.removeController(param));
	}

	addController(model) {
		const controller = new SpriteController(this.game, model, this.controls);
		model._controller = controller;
		this.addChild(controller);
		if (this.isActivated()) {
			controller.activate();
		}
	}

	removeController(model) {
		this.removeChild(model._controller);
	}

}
