import SpriteStrategy from "./SpriteStrategy";
import Pixies from "../../class/Pixies";

export const DEFAULT_UPDATE_TIMEOUT = 1000;

export default class UpdatedStrategy extends SpriteStrategy {
	defaultTimeout;
	timeout;
	randomizeTimeout;
	randomizeInitialTimeout;
	initialTimeoutRandomized;

	/**
	 * @param {GameModel} game
	 * @param {SpriteModel} model
	 * @param {ControlsModel} controls
	 * @param {number=} timeout
	 */
	constructor(game, model, controls, timeout = DEFAULT_UPDATE_TIMEOUT) {
		super(game, model, controls);

		this.defaultTimeout = timeout;
		this.timeout = Math.random() * this.defaultTimeout;
		this.randomizeTimeout = false;
		this.randomizeInitialTimeout = true;
		this.initialTimeoutRandomized = false;
	}

	updateStrategy() {

	}

	/**
	 * @param {number} delta - in millisecs
	 */
	update(delta) {
		this.timeout -= delta;
		if (this.timeout <= 0) {
			if (!this.level.isValidPosition(this.model.position)) {
				this.removeMyself();
				if (this.model.isPersistent) {
					const exit = this.level.isPossibleExit(this.model.position);
					if (exit) {
						this.game.fallenItems.addFallenItem(this.level.name, exit, this.model);
						console.log('Sprite going to another level:', exit);
					}
				}
				console.log('Sprite over board!', this.model);
				return;
			}
			if (!this.game.isInEditMode.get()) {
				this.updateStrategy();
			}
			if (this.randomizeTimeout || (this.randomizeInitialTimeout && !this.initialTimeoutRandomized)) {
				this.timeout = Pixies.random(this.defaultTimeout * 0.5, this.defaultTimeout * 1.5);
				this.initialTimeoutRandomized = true;
			} else {
				this.timeout = this.defaultTimeout;
			}
		}
		super.update(delta);
	}

}
