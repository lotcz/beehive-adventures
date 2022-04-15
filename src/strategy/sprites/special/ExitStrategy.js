import AnimatedStrategy from "../AnimatedStrategy";

const RESPAWN_TIMEOUT = 1000;

export default class ExitStrategy extends AnimatedStrategy {
	triggered;

	constructor(game, model, controls) {
		super(game, model, controls, RESPAWN_TIMEOUT);

		this.triggered = false;
	}

	updateStrategy() {
		if (!this.level.bee) {
			return;
		}
		if ((!this.triggered) && (this.game.beeState.isAlive())) {
			if (this.model.position.distanceTo(this.level.bee.position) < 3) {
				this.level.bee.position.set(this.model.position);
				this.level.bee.triggerOnTravelEvent(this.model.data.level);
				this.triggered = true;
			}
		}
	}

}
