import StaticStrategy from "../StaticStrategy";
import AnimatedVector2 from "../../../class/AnimatedVector2";
import {
	IMAGE_TOAD_HEAD,
	IMAGE_TOAD_HEAD_OPEN,
	SPRITE_TYPE_TOAD_BODY,
	SPRITE_TYPE_TOAD_TONGUE
} from "../../../builder/sprites/SpriteStyleAnimals";
import {SPRITE_TYPE_BEE_DEAD} from "../../../builder/sprites/SpriteStyleObjects";

const TOAD_TONGUE_LENGTH = 10;
const TOAD_TIMEOUT = 1000;
const TOAD_CLOSE_TIMEOUT = 500;
const TOAD_TONGUE_SPEED = 3000; // pixels per second
const TOAD_NOTICE_DISTANCE = 3000;
const TOAD_ATTACK_DISTANCE = 1500;

export default class ToadStrategy extends StaticStrategy {
	tongue;
	body;
	tongueAnimations;
	foodCoordinates;
	held;
	heldIndex;

	constructor(game, model, controls) {
		super(game, model, controls, TOAD_TIMEOUT);

		this.oriented = true;
		this.model._is_penetrable = false;
		this.model._is_crawlable = true;

		this.rotateAttachedSprite = false;
		this.flipAttachedSprite = false;
		this.scaleAttachedSprite = true;
		this.model.attachedSpriteBehind = true;

		this.tongue = null;
		this.body = null;
		this.tongueAnimations = null;
		this.foodCoordinates = null;
		this.usedTongLength = 0;
		this.held = null;
		this.heldIndex = 0;

		this.level.addResource(IMAGE_TOAD_HEAD_OPEN);

		if (this.model.attachedSprite.isEmpty()) {
			this.createAttachedSprites();
		} else {
			this.mapAttachedSprites();
		}

	}

	activateInternal() {
		super.activateInternal();
		const positions = this.getVisitorPositions();
		positions.forEach((p) => this.chessboard.addVisitor(p, this.model));
	}

	deactivateInternal() {
		super.deactivateInternal();
		const positions = this.getVisitorPositions();
		positions.forEach((p) => this.chessboard.removeVisitor(p, this.model));
	}

	updateInternal(delta) {
		super.updateInternal(delta);

		if (this.isSnapping()) {
			const unused = TOAD_TONGUE_LENGTH - this.usedTongLength;
			for (let i = TOAD_TONGUE_LENGTH - 1; i >= unused; i--) {
				this.tongue[i].image.coordinates.set(this.tongueAnimations[i].get(delta));
			}
			if (this.held) {
				const coords = this.tongue[this.heldIndex].image.coordinates;
				this.held.image.coordinates.set(coords);
				this.level.bee.coordinates.set(coords);
			}
			if (this.tongueAnimations[TOAD_TONGUE_LENGTH - 1].isFinished()) {
				this.tongueAnimations = null;
				if (this.foodCoordinates) {
					this.snapped();
				}
			}
		}
	}

	updateStrategy() {
		if (this.isSnapping()) {
			return;
		}

		this.model.image.path.set(IMAGE_TOAD_HEAD);
		this.held = null;
		this.heldIndex = 0;

		if (this.isFocused()) {
			this.eat();
		} else {
			this.lookForFood();
		}
	}

	getVisitorPositions() {
		return this.grid.getAffectedPositions(this.model.position, Math.round(3 * this.model.image.scale.get()));
	}

	// ATTACHED SPRITES

	createAttachedSprites() {
		const body = this.level.createSpriteFromStyle(this.model.position, SPRITE_TYPE_TOAD_BODY);
		body.position.set(this.model.position);
		body.image.coordinates.set(this.model.image.coordinates);
		this.model.attachedSprite.set(body);
		let sprite = body;
		for (let i = 0; i < TOAD_TONGUE_LENGTH; i++) {
			const t = this.level.createSpriteFromStyle(this.model.position, SPRITE_TYPE_TOAD_TONGUE);
			t.position.set(this.model.position);
			t.image.coordinates.set(this.model.image.coordinates);
			t.image.scale.set(this.model.image.scale.get());
			sprite.attachedSprite.set(t);
			sprite = t;
		}
		this.mapAttachedSprites();
	}

	mapAttachedSprites() {
		this.tongue = [];
		this.body = this.model.attachedSprite.get();
		this.body.position.set(this.model.position);
		this.body.image.coordinates.set(this.model.image.coordinates);
		let sprite = this.body;
		for (let i = 0; i < TOAD_TONGUE_LENGTH; i++) {
			const t = sprite.attachedSprite.get();
			if (t) {
				t.position.set(this.model.position);
				t.image.coordinates.set(this.model.image.coordinates);
				t.image.scale.set(this.model.image.scale.get());
				this.tongue[i] = sprite = t;
			}
		}
	}

	// DECISIONS

	isFocused() {
		return this.foodCoordinates;
	}

	lookForFood() {
		this.foodCoordinates = null;

		if (this.level.bee.visible.get() === true) {
			const beeDistance = this.model.image.coordinates.distanceTo(this.level.bee.coordinates);
			if (beeDistance < TOAD_NOTICE_DISTANCE) {
				this.foodCoordinates = this.level.bee.coordinates;
				this.defaultTimeout = TOAD_CLOSE_TIMEOUT;
				this.setTargetRotation(this.model.image.coordinates.getRotation(this.foodCoordinates));
				return;
			}
		}

		this.defaultTimeout = TOAD_TIMEOUT;
	}

	eat() {
		if (!this.foodCoordinates) return;

		const beeDistance = this.model.image.coordinates.distanceTo(this.level.bee.coordinates);
		if (beeDistance < (TOAD_ATTACK_DISTANCE * this.model.image.scale.get())) {
			this.snap(this.level.bee.coordinates, beeDistance);
		} else if (beeDistance < TOAD_NOTICE_DISTANCE) {
			this.foodCoordinates = this.level.bee.coordinates;
			this.setTargetRotation(this.model.image.coordinates.getRotation(this.foodCoordinates));
		} else {
			this.foodCoordinates = null;
		}
	}

	isSnapping() {
		return this.tongueAnimations && (this.usedTongLength > 0);
	}

	freeForSnap(coordinates) {
		const position = this.grid.getPosition(coordinates);
		const impenetrable = this.chessboard.getVisitors(position, (v) => v._is_penetrable === false && v !== this.model);
		return (impenetrable.length === 0);
	}

	snap(coordinates, distance) {
		this.usedTongLength = Math.ceil(TOAD_TONGUE_LENGTH * (distance / (TOAD_ATTACK_DISTANCE * this.model.image.scale.get())));
		if (this.usedTongLength <= 0) {
			return;
		}
		this.foodCoordinates = coordinates;
		this.tongueAnimations = [];
		this.model.image.path.set(IMAGE_TOAD_HEAD_OPEN);
		const start = this.model.image.coordinates;
		const rotation = this.model.image.coordinates.getRotation(coordinates);
		this.setTargetRotation(rotation);
		let block = null;
		let lastValid = start;
		const duration = (distance / TOAD_TONGUE_SPEED) * 1000;
		const unused = TOAD_TONGUE_LENGTH - this.usedTongLength;
		for (let i = unused; i < TOAD_TONGUE_LENGTH; i++) {
			this.tongue[i].image.rotation.set(rotation);
			if (block) {
				this.tongueAnimations[i] = new AnimatedVector2(this.tongue[i].image.coordinates, block, duration);
			} else {
				const tc = start.add(coordinates.subtract(start).multiply((i - unused + 1) / (Math.max(this.usedTongLength - 1, 1))));
				if (this.freeForSnap(tc)) {
					lastValid = tc;
					this.tongueAnimations[i] = new AnimatedVector2(this.tongue[i].image.coordinates, tc, duration);
				} else {
					const middle = lastValid.add(tc).multiply(0.5);
					if (this.freeForSnap(middle)) {
						block = middle;
					} else {
						block = lastValid;
					}
					this.tongueAnimations[i] = new AnimatedVector2(this.tongue[i].image.coordinates, block, duration);
				}
			}
		}
	}

	snapped() {
		this.foodCoordinates = null;

		this.tongueAnimations = [];
		const unused = TOAD_TONGUE_LENGTH - this.usedTongLength;
		const lastTongue = this.tongue[TOAD_TONGUE_LENGTH - 1];
		const distance = this.model.image.coordinates.distanceTo(lastTongue.image.coordinates);
		const duration = (distance / TOAD_TONGUE_SPEED) * 1000 * 3;
		let beeHurt = false;

		for (let i = TOAD_TONGUE_LENGTH - 1; i >= unused; i--) {
			if (!beeHurt) {
				const beeDistance = this.tongue[i].image.coordinates.distanceTo(this.level.bee.coordinates);
				if (beeDistance < (this.grid.tileRadius.get() * 2)) {
					if (this.game.beeState.isAlive()) {
						this.game.beeState.hurt(0.4);
					}
					if (this.game.beeState.isAlive()) {
						const push = this.model.image.coordinates.subtract(this.level.bee.coordinates);
						push.setSize(this.grid.tileRadius.get() * 15);
						this.level.bee.triggerOnPushedEvent(push);
						beeHurt = true;
					} else {
						this.level.bee.visible.set(false);
						this.level.bee.held.set(true);
						this.held = this.level.createSpriteFromStyle(this.level.bee.position, SPRITE_TYPE_BEE_DEAD);
						this.held.image.coordinates.set(this.tongue[i].image.coordinates);
						this.heldIndex = i;
						this.tongue[TOAD_TONGUE_LENGTH - 1].attachedSprite.set(this.held);
					}
				}
			}
		}

		for (let i = TOAD_TONGUE_LENGTH - 1; i >= unused; i--) {
			this.tongueAnimations[i] = new AnimatedVector2(this.tongue[i].image.coordinates, this.model.image.coordinates, this.held ? duration * 3 : duration);
		}

	}

}
