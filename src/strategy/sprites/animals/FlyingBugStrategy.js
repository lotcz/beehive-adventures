import Pixies from "../../../class/Pixies";
import AnimatedStrategy from "../AnimatedStrategy";
import Vector2 from "../../../class/Vector2";

const FLYING_BUG_TIMEOUT = 150;
const FLYING_BUG_ATTACK_TIMEOUT = 500;
const FLYING_BUG_LANDING_TIMEOUT = 700;

const FLYING_BUG_MAX_CHASE = 70;
const FLYING_BUG_CHASE_TIMEOUT = 5000;

const STATE_FLYING = 0;
const STATE_LANDING = 1;
const STATE_ATTACKING = 2;

const DEBUG_FLYING_BUG = false;

export default class FlyingBugStrategy extends AnimatedStrategy {
	lastDirection;

	constructor(game, model, controls) {
		super(game, model, controls, FLYING_BUG_TIMEOUT);

		this.flyingTimeout = this.model.data.timeout || FLYING_BUG_TIMEOUT;
		this.attackTimeout = this.model.data.attackTimeout || FLYING_BUG_ATTACK_TIMEOUT;
		this.landingTimeout = this.model.data.landingTimeout || FLYING_BUG_LANDING_TIMEOUT;

		this.model.data.size = this.model.data.size || 1;
		this.model.data.hurts = this.model.data.hurts || 0;

		this.lastDirection = null;
		this.model._is_penetrable = false;
		this.turningDuration = 200;
		this.chasing = FLYING_BUG_MAX_CHASE;
		this.chasingTimeout = 0;

		this.noticeDistance = this.grid.tileRadius.get() * 2 * (this.model.data.size + 8.5);
		this.attackDistance = this.grid.tileRadius.get() * 2 * (this.model.data.size);
		this.stopChaseDistance = this.grid.tileRadius.get() * 2 * (this.model.data.size + 12);

		if (!this.model.data.homePosition) {
			this.model.data.homePosition = this.model.position.getState();
		}
		const home = new Vector2(this.model.data.homePosition);
		this.homeCoordinates = this.getCoords(home);
		this.model.data.stayHome = this.model.data.stayHome || false;
		if (this.model.data.stayHome) {
			this.model.position.set(home);
			this.model.image.coordinates.set(this.homeCoordinates);
		}

		this.visitorsPosition = null;
		this.positionChangedHandler = (p) => this.onPositionChanged(p);

		this.fly();
	}

	activateInternal() {
		super.activateInternal();
		this.model.position.addOnChangeListener(this.positionChangedHandler);
		this.updateVisitors();
	}

	deactivateInternal() {
		super.deactivateInternal();
		this.model.position.removeOnChangeListener(this.positionChangedHandler);
		if (this.visitorsPosition) {
			this.grid.getAffectedPositions(this.visitorsPosition, this.model.data.size).forEach((p) => this.chessboard.removeVisitor(p, this.model));
		}
	}

	updateStrategy() {
		const neighbors = this.level.grid.getNeighbors(this.model.position);

		if (this.model.data.hurts > 0 && this.chasingTimeout <= 0 && this.level.isPlayable && this.level.bee && this.game.beeState.isAlive()) {
			const beeDistance = this.level.bee.coordinates.distanceTo(this.model.image.coordinates);
			if (DEBUG_FLYING_BUG) console.log('bee distance', beeDistance);
			if (beeDistance < this.noticeDistance || (beeDistance < this.stopChaseDistance && this.chasing > 0)) {
				if (beeDistance < this.attackDistance) {
					if (DEBUG_FLYING_BUG) console.log('attack bee');
					this.attack();
					return;
				}
				if (DEBUG_FLYING_BUG) console.log('bee near');
				if (this.chasing > 0) {
					this.chasing -= 1;
					if (this.chasing <= 0) {
						this.chasingTimeout = FLYING_BUG_CHASE_TIMEOUT;
					}
					if (!this.isFlying()) {
						this.fly();
					}
					this.chase(this.level.bee.position);
					return;
				} else {
					this.chasing = FLYING_BUG_MAX_CHASE;
				}
			} else {
				this.chasing = 0;
			}
		}

		if (!this.isLanding()) {
			this.land();
		}

		if (this.model.data.hurts > 0) {
			this.chasingTimeout -= this.defaultTimeout;
		}

		if (this.model.data.stayHome) {
			const dist = this.model.image.coordinates.distanceTo(this.homeCoordinates);
			if (dist > this.noticeDistance) {
				this.lastDirection = null;
				this.chase(this.grid.getPosition(this.homeCoordinates));
				return;
			} else {
				this.land();
			}
		}

		if (this.lastDirection && (Math.random() < 0.95)) {
			if (this.isDirectionFree(this.lastDirection)) {
				const next = neighbors[this.lastDirection];
				this.setTargetPosition(next);
				this.model.image.flipped.set(next.x <= this.model.position.x);
				return;
			}
		}

		const directions = [];
		for (let i = 0; i < neighbors.length; i++) directions.push(i);

		let direction = null;
		while (directions.length > 0) {
			const d = Pixies.randomElement(directions);
			if (this.isDirectionFree(d)) {
				direction = d;
				break;
			}
			directions.splice(directions.indexOf(d), 1);
		}

		if (direction !== null) {
			const next = neighbors[direction];
			this.lastDirection = direction;
			this.setTargetPosition(next);
			this.model.image.flipped.set(next.x <= this.model.position.x);
		}
	}

	isDirectionFree(direction) {
		const position = this.grid.getNeighbor(this.model.position, direction, this.model.data.size);
		return this.isPositionFree(position);
	}

	isPositionFree(position) {
		const affected = this.grid.getAffectedPositions(position, this.model.data.size);
		if (this.level.isPlayable && this.level.bee) {
			if (affected.some((p) => this.level.bee.position.equalsTo(p))) {
				return false;
			}
		}
		return !affected.some((p) => !this.level.isAir(p, this.model));
	}

	chase(position) {
		const neighbors = this.level.grid.getNeighbors(this.model.position);
		const available = neighbors.filter((n) => this.isPositionFree(n));
		let minDist = null;
		let nearestPosition = null;
		for (let i = 0; i < available.length; i++) {
			const dist = position.distanceTo(available[i]);
			if (minDist === null || minDist > dist) {
				minDist = dist;
				nearestPosition = available[i];
			}
		}
		if (nearestPosition) {
			this.setTargetPosition(nearestPosition);
			this.model.image.flipped.set(nearestPosition.x <= this.model.position.x);
		}
	}

	fly() {
		this.state = STATE_FLYING;
		this.oriented = true;
		this.turnWhenMoving = false;
		this.defaultTimeout = this.flyingTimeout;
		if (this.model.animations && this.model.animations.exists('flying')) {
			this.model.activeAnimation.set('flying');
		}
		this.setTargetRotation(0);
		if (DEBUG_FLYING_BUG) console.log('flying');
	}

	isFlying() {
		return this.state === STATE_FLYING;
	}

	land() {
		this.state = STATE_LANDING;
		this.oriented = true;
		this.turnWhenMoving = false;
		this.defaultTimeout = this.landingTimeout;
		if (this.model.animations && this.model.animations.exists('landing')) {
			this.model.activeAnimation.set('landing');
		}
		this.setTargetRotation(0);
		if (DEBUG_FLYING_BUG) console.log('landing');
	}

	isLanding() {
		return this.state === STATE_LANDING;
	}

	attack() {
		this.state = STATE_ATTACKING;
		this.oriented = true;
		this.turnWhenMoving = false;
		this.defaultTimeout = this.attackTimeout;
		if (this.model.animations && this.model.animations.exists('attacking')) {
			this.model.activeAnimation.set('attacking');
		}
		this.setTargetRotation(this.model.image.coordinates.getRotation(this.level.bee.coordinates));
		this.game.beeState.hurt(DEBUG_FLYING_BUG ? 0.001 : this.model.data.hurts);
		this.chasing = FLYING_BUG_MAX_CHASE;
		if (DEBUG_FLYING_BUG) console.log('attacking');
	}

	onPositionChanged(p) {
		this.updateVisitors();
	}

	updateVisitors() {
		if (this.model.data.size <= 1) {
			return;
		}
		if (this.visitorsPosition) {
			this.grid.getAffectedPositions(this.visitorsPosition, this.model.data.size).forEach((p) => this.chessboard.removeVisitor(p, this.model));
		}
		this.grid.getAffectedPositions(this.model.position, this.model.data.size).forEach((p) => this.chessboard.addVisitor(p, this.model));
		this.visitorsPosition = this.model.position.clone();
	}

}
