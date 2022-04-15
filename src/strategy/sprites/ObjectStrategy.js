import AnimatedStrategy from "./AnimatedStrategy";
import Vector2 from "../../class/Vector2";
import Pixies from "../../class/Pixies";
import SplashSound from "../../../res/sound/splash.mp3";
import Sound from "../../class/Sound";

export const DEFAULT_OBJECT_MAX_AMOUNT = 5;
const DEFAULT_FALL_TIMEOUT = 200;
const DEFAULT_FLOAT_TIMEOUT = 500;
const DEBUG_OBJECT_STRATEGY = false;

export default class ObjectStrategy extends AnimatedStrategy {
	maxAmount;
	falling;

	constructor(game, model, controls, timeout) {
		super(game, model, controls, timeout);

		this.turnWhenMoving = true;
		this.maxAmount = DEFAULT_OBJECT_MAX_AMOUNT;
		this.defaultMoveTimeout = this.defaultTimeout;
		this.defaultFallTimeout = DEFAULT_FALL_TIMEOUT;
		this.defaultFloatTimeout = DEFAULT_FLOAT_TIMEOUT;
		this.lastAmount = null;
		this.timeout = 0;
		this.falling = false;

		if (!this.model.data.amount) {
			this.model.data.amount = DEFAULT_OBJECT_MAX_AMOUNT;
		}

		this.model._is_penetrable = false;
		this.model._is_crawlable = true;

		this.splashSound = null;
	}

	activateInternal() {
		this.updateAmount();
		super.activateInternal();
	}

	updateStrategy() {
		this.updateAmount();
		this.defaultTimeout = this.defaultMoveTimeout;

		const lowerLeft = this.grid.getNeighborLowerLeft(this.model.position);
		const lowerRight = this.grid.getNeighborLowerRight(this.model.position);
		const down = this.grid.getNeighborDown(this.model.position);
		const fallingOff = !(this.level.isValidPosition(down) && this.level.isValidPosition(lowerLeft) && this.level.isValidPosition(lowerRight));
		if (fallingOff) {
			this.removeMyself();
			if (this.model.isPersistent) {
				const exit = this.level.isPossibleExit(down) || this.level.isPossibleExit(lowerLeft) || this.level.isPossibleExit(lowerRight);
				if (exit) {
					this.game.fallenItems.addFallenItem(this.level.name, exit, this.model);
					if (DEBUG_OBJECT_STRATEGY) console.log('Object going to another level:', exit);
				}
			}
			if (DEBUG_OBJECT_STRATEGY) console.log('Object over board!', this.model);
			return;
		}

		if (this.level.isWater(this.model.position)) {
			const next = this.model.data.sinks ? down : this.grid.getNeighborUp(this.model.position);
			this.defaultTimeout = this.defaultFloatTimeout;
			this.setTargetPosition(next);
			this.setTargetRotation(0);
			return;
		}

		if (this.level.isPenetrable(down)) {
			if (this.level.isWater(down)) {
				this.defaultTimeout = this.defaultFloatTimeout * 1.5;
				if (this.falling) {
					this.objectHitWater();
					this.falling = false;
				}
			} else {
				this.falling = true;
				this.defaultTimeout = this.defaultFallTimeout;
			}
			this.setTargetPosition(down);
			this.setTargetRotation(0);
			return;
		}

		if (this.falling) {
			this.objectHitGround();
			this.falling = false;
		}

		const available = [];
		if (this.level.isPenetrable(lowerLeft)) {
			available.push(lowerLeft);
		}
		if (this.level.isPenetrable(lowerRight)) {
			available.push(lowerRight);
		}
		if (available.length > 0) {
			this.defaultTimeout = this.defaultFallTimeout * 2;
			this.setTargetPosition(Pixies.randomElement(available));
		} else {
			this.defaultTimeout = this.defaultMoveTimeout;
			this.updateStillObject();
		}
	}

	static getObjectScale(amount, maxAmount) {
		const portion = (amount / maxAmount);
		const scale = Math.sqrt(portion);
		return scale;
	}

	updateAmount() {
		if (this.lastAmount !== this.model.data.amount) {
			const portion = (this.model.data.amount / this.maxAmount);
			if (this.model.data.amount < this.maxAmount) {
				this.offset = new Vector2(0, this.grid.tileSize.y * 0.4 * (1 - portion));
			} else {
				this.offset = null;
			}
			if (this.isActivated() && !this.isMoving()) {
				this.setTargetCoordinates(this.getCoords(this.model.position));
			}
			const scale = Math.sqrt(portion);
			this.setTargetScale(scale);
			this.lastAmount = this.model.data.amount;
		}
	}

	updateStillObject() {
		// override
	}

	objectHitGround() {
		// override
	}

	objectHitWater() {
		if (!this.splashSound) {
			this.splashSound = new Sound(SplashSound);
		}
		this.splashSound.playInDistance(this.model.image.coordinates.distanceTo(this.level.bee.coordinates));
	}

}
