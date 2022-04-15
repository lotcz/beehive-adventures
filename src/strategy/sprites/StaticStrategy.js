import AnimatedStrategy from "./AnimatedStrategy";
import HintModel from "../../model/HintModel";
import HintController from "../../controller/HintController";

const HINT_DISTANCE = 500;

export default class StaticStrategy extends AnimatedStrategy {
	hintController;

	constructor(game, model, controls, timeout) {
		super(game, model, controls, timeout);

		this.hintController = null;
		this._is_penetrable = (this.model.data.penetrable !== false);
		this._is_crawlable = (this.model.data.crawlable === true);

		this.resetHintController();
	}

	updateStrategy() {
		super.updateStrategy();

		if (this.hintController) {
			this.updateHint();
		}
	}

	resetHintController() {
		if (this.hintController) {
			this.hintController.destroy();
		}
		this.hintController = null;
		if (this.model.data.hint) {
			this.createHintController();
		}
	}

	createHintController() {
		const hintModel = new HintModel();
		hintModel.position.set(this.model.position);
		hintModel.imagePaths = [...this.model.data.hint];
		if (this.model.data.hintSize !== undefined) {
			hintModel.size = this.model.data.hintSize;
		}
		if (this.model.data.hintFrameRate !== undefined) {
			hintModel.frameRate = this.model.data.hintFrameRate;
		}
		if (this.model.data.hintDirection !== undefined) {
			hintModel.direction = this.model.data.hintDirection;
		}
		this.hintController = new HintController(this.game, hintModel, this.controls);
		this.addChild(this.hintController);
		this.hintController.activate();
	}

	updateHint() {
		if (this.level.isPlayable && this.level.bee) {
			const beeDistance = this.model.image.coordinates.distanceTo(this.level.bee.coordinates);
			if (this.hintController.isInitialized()) {
				if (beeDistance > (1.1 * HINT_DISTANCE)) {
					this.hintController.hide();
				} else {
					this.hintController.show();
				}
			} else {
				if (beeDistance < HINT_DISTANCE) {
					this.hintController.show();
				}
			}
		}
	}
}
