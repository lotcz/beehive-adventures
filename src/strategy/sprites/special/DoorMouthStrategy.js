import AnimatedStrategy from "../AnimatedStrategy";
import AnimatedVector2 from "../../../class/AnimatedVector2";
import {
	NEIGHBOR_TYPE_LOWER_RIGHT,
	NEIGHBOR_TYPE_UP
} from "../../../model/GridModel";
import {STRATEGY_STATIC} from "../../../builder/sprites/SpriteStyleBasic";

const DOOR_MOUTH_TIMEOUT = 700;
const DOOR_MOUTH_DEFAULT_LENGTH = 2;

export default class DoorMouthStrategy extends AnimatedStrategy {
	mouth;
	mouthLength;
	openDirection;
	closedDirection;
	currentDirection;
	mouthAnimations;
	isOpen;

	/**
	 * @param {GameModel} game
	 * @param {SpriteModel} model
	 * @param {ControlsModel} controls
	 */
	constructor(game, model, controls) {
		super(game, model, controls, DOOR_MOUTH_TIMEOUT);

		this.model._is_penetrable = false;
		this.model._is_crawlable = this.model.data.crawlable || false;

		this.mouthAnimations = null;
		this.mouth = [];
		this.model.data.isOpen = this.model.data.isOpen === undefined ? true : this.model.data.isOpen;
		this.model.data.mouthLength = this.mouthLength = this.model.data.mouthLength || DOOR_MOUTH_DEFAULT_LENGTH;
		this.model.data.openDirection = this.openDirection = this.model.data.openDirection === undefined ? NEIGHBOR_TYPE_UP : this.model.data.openDirection;
		this.model.data.closedDirection = this.closedDirection = this.model.data.closedDirection === undefined ? NEIGHBOR_TYPE_LOWER_RIGHT : this.model.data.closedDirection;
		this.currentDirection = this.model.data.isOpen ? this.openDirection : this.closedDirection;
		this.openingStep = (this.closedDirection < this.openDirection) ? 1 : -1;
		if (Math.abs((this.closedDirection - this.openDirection) / this.openingStep) > 3) {
			this.openingStep = -this.openingStep;
		}

		this.model.addEventListener('door-open-signal', (open) => this.onDoorSignal(open))
		this.mapAttachedSprites();
	}

	activateInternal() {
		super.activateInternal();
		this.addMouthVisitors();
	}

	deactivateInternal() {
		super.deactivateInternal();
		this.removeMouthVisitors();
	}

	updateInternal(delta) {
		super.updateInternal(delta);

		if (this.isAnimating()) {
			for (let i = 0; i < this.mouth.length; i++) {
				const oldPosition = this.mouth[i].position.clone();
				this.mouth[i].image.coordinates.set(this.mouthAnimations[i].get(delta));
				this.mouth[i].position.set(this.grid.getPosition(this.mouth[i].image.coordinates));
				if (!oldPosition.equalsTo(this.mouth[i].position)) {
					this.chessboard.removeVisitor(oldPosition, this.model);
					this.chessboard.addVisitor(this.mouth[i].position, this.model);

					if (this.mouth[i].position.equalsTo(this.level.bee.position)) {
						const push = this.mouth[i].position.subtract(oldPosition);
						push.setSize(this.grid.tileRadius.get() * 15);
						this.level.bee.direction.set(0,0);
						this.level.bee.triggerOnPushedEvent(push);
					}
				}
			}
			if (this.mouthAnimations[this.mouth.length - 1].isFinished()) {
				this.mouthAnimations = null;
				this.updateStrategy();
			}
		}
	}

	updateStrategy() {
		if (this.isAnimating()) {
			return;
		}

		if (this.model.data.isOpen) {
			this.open();
		} else {
			this.close();
		}
	}

	// ATTACHED SPRITES

	mapAttachedSprites() {
		this.mouth = [];
		let sprite = this.model;
		let position = this.model.position;
		for (let i = 0; i < this.mouthLength; i++) {
			let m = sprite.attachedSprite.get();
			if (!m) {
				m = this.level.createSprite(this.model.position, STRATEGY_STATIC, {}, this.model.image.path.get(), 1, 0, false);
				sprite.attachedSprite.set(m);
			}
			position = this.grid.getNeighbor(position, this.currentDirection);
			m.position.set(position);
			m.image.coordinates.set(this.grid.getCoordinates(position));
			this.chessboard.addVisitor(position, this.model);
			this.mouth[i] = sprite = m;
		}
		if (sprite.attachedSprite.isSet()) {
			sprite.attachedSprite.set(null);
		}
	}

	isAnimating() {
		return this.mouthAnimations;
	}

	onDoorSignal(open) {
		if (open) {
			this.open();
		} else {
			this.close();
		}
	}

	open() {
		this.model.data.isOpen = true;
		if (this.currentDirection != this.openDirection) {
			this.currentDirection = (this.currentDirection + this.openingStep + 6) % 6;
			this.applyDirection();
		}
	}

	close() {
		this.model.data.isOpen = false;
		if (this.currentDirection != this.closedDirection) {
			this.currentDirection = (this.currentDirection - this.openingStep + 6) % 6;
			this.applyDirection();
		}
	}

	applyDirection() {
		this.mouthAnimations = [];
		let position = this.model.position;
		for (let i = 0; i < this.mouth.length; i++) {
			position = this.grid.getNeighbor(position, this.currentDirection);
			this.mouthAnimations[i] = new AnimatedVector2(this.mouth[i].image.coordinates, this.grid.getCoordinates(position), DOOR_MOUTH_TIMEOUT);
		}
	}

	addMouthVisitors() {
		this.mouth.forEach((m) => this.chessboard.addVisitor(m.position, this.model));
	}

	removeMouthVisitors() {
		this.mouth.forEach((m) => this.chessboard.removeVisitor(m.position, this.model));
	}

}
