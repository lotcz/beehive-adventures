import ControllerBase from "../class/ControllerBase";

export default class AnimationController extends ControllerBase {
	currentFrame;
	frameDelay;
	frameTimeout;

	/**
	 * @type AnimationModel
	 */
	model;

	/**
	 * @param GameModel game
	 * @param AnimationModel model
	 * @param ControlsModel controls
	 */
	constructor(game, model, controls) {
		super(game, model, controls);

		this.model = model;

		this.currentFrame = 0;
		this.frameDelay = 1000 / this.model.frameRate.get();
		this.frameTimeout = this.frameDelay;

		this.model.paths.forEach((p) => this.level.addResource(p));
	}

	activateInternal() {
		super.activateInternal();
		this.model.image.path.set(this.model.paths[this.currentFrame]);
	}

	updateInternal(delta) {
		if (this.model.paused.get()) return;

		if (this.frameTimeout <= 0) {
			this.currentFrame += 1;
			if (this.currentFrame >= this.model.paths.length) {
				if (this.model.repeat.get()) {
					this.currentFrame = 0;
				} else {
					this.model.paused.set(true);
					return;
				}
			}
			this.model.image.path.set(this.model.paths[this.currentFrame]);
			this.frameTimeout = this.frameDelay;
		}
		this.frameTimeout -= delta;
	}

}
