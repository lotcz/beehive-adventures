import ObjectStrategy, {DEFAULT_OBJECT_MAX_AMOUNT} from "../ObjectStrategy";
import BiteSound from "../../../../res/sound/bite.mp3";
import Sound from "../../../class/Sound";
import {GROUND_TYPE_WATER} from "../../../builder/GroundStyle";
import BeeDeathStrategy from "../../bee/BeeDeathStrategy";
import Timeout from "../../../class/Timeout";

const DEBUG_BUG_STRATEGY = false;
const BUG_TIMEOUT = 1500;
const VISIBLE_DISTANCE = 5;
export const BUG_MAX_AMOUNT = DEFAULT_OBJECT_MAX_AMOUNT

export default class BugStrategy extends ObjectStrategy {
	static biteSound = new Sound(BiteSound);

	constructor(game, model, controls) {
		super(game, model, controls, BUG_TIMEOUT);

		this.oriented = true;
		this.keepHeadUp = true;
		this.turnWhenMoving = true;
		this.rotateAttachedSprite = false;
		this.model.attachedSpriteBehind = false;
		this.attachedSpriteOffset.set(0, this.grid.tileRadius.get() * -0.5);
		this.model._is_penetrable = (this.model.data.penetrable === true);
		this.model._is_crawlable = false;

		if (this.model.data.timeout !== undefined) {
			this.defaultMoveTimeout = this.model.data.timeout;
		}
		if (!this.model.data.consumes) {
			this.model.data.consumes = [];
		}
		if (!this.model.data.attacks) {
			this.model.data.attacks = [];
		}
		if (!this.model.data.carries) {
			this.model.data.carries = [];
		}
		if (!this.model.data.repelledBy) {
			this.model.data.repelledBy = [];
		}
		if (!this.model.data.attractedBy) {
			this.model.data.attractedBy = [];
		}
		if (!this.model.data.poisonedBy) {
			this.model.data.poisonedBy = [];
		}
		if (this.model.data.isDead === undefined) {
			this.model.data.isDead = false;
		}
		this.onDeathHandler = () => this.die();
	}

	activateInternal() {
		super.activateInternal();

		this.model.addOnDeathListener(this.onDeathHandler);

		// fix bug when bugs fall down through terrain
		while (this.level.isGround(this.model.position)) {
			this.model.position.set(this.grid.getNeighborUp(this.model.position));
		}
	}

	deactivateInternal() {
		this.model.removeOnDeathListener(this.onDeathHandler);
		super.deactivateInternal();
	}

	updateStrategy() {
		if (this.model.data.isDead) {
			super.updateStrategy();
			return;
		}

		const localVisitors = this.grid.chessboard.getVisitors(this.model.position);

		// DIE
		const isWater = localVisitors.some((v) => v._is_ground === true && v.type === GROUND_TYPE_WATER);
		if (isWater) {
			this.die();
			return;
		}

		// FALL
		const down = this.grid.getNeighborDown(this.model.position);
		if (this.level.isPenetrable(down)) {
			this.defaultTimeout = this.defaultFallTimeout;
			this.turnWhenMoving = false;
			this.setTargetPosition(down);
			this.setTargetRotation(0);
			return;
		}

		const neighbors = this.grid.getValidNeighbors(this.model.position);
		const neighborVisitors = this.chessboard.getVisitorsMultiple(neighbors);

		// EAT NEARBY FOOD
		if (this.isHungry()) {
			const food = neighborVisitors.find((v) => this.filterFood(v) || this.filterPoison(v));
			if (food) {
				this.eat(food);
				return;
			}
		}

		// HURT BEE
		if (this.isBeeInRange()) {
			this.hurtBee();
			return;
		}

		// ATTACK
		if (this.model.data.attacks.length > 0) {
			const victim = neighborVisitors.find((v) => this.filterVictims(v));
			console.log('attacking', victim);
			if (victim) {
				victim.triggerOnDeathEvent();
				const angle = this.model.image.coordinates.getRotation(victim.image.coordinates);
				this.setTargetRotation(angle, 500);
				this.model.activeAnimation.set('attacking');
				BugStrategy.biteSound.replayInDistance(this.model.image.coordinates.distanceTo(victim.image.coordinates));
				return;
			}
		}

		// TAKE/DROP ITEM
		if (this.hasItem()) {
			if (Math.random() < 0.07) {
				this.dropItem();
				return;
			}
		} else if (Math.random() < 0.5) {
			let item = localVisitors.find((v) => this.filterTakeable(v));
			if (!item) {
				item = neighborVisitors.find((v) => this.filterTakeable(v));
			}
			if (item) {
				this.takeItem(item);
				if (this.level.isPenetrable(down)) {
					this.defaultTimeout = this.defaultFallTimeout;
					this.turnWhenMoving = false;
					this.setTargetPosition(down);
					this.setTargetRotation(0);
				}
				return;
			}
		}

		// FLEE/APPROACH
		if (this.isAffectedByEnvironment()) {
			if (this.fleeApproach()) {
				return;
			}
		}

		// WANDER AROUND
		const roll = Math.random();
		if (roll < 0.5) {
			if (roll < 0.3) {
				this.walkRight();
			} else {
				this.walkLeft();
			}
		} else {
			this.model.activeAnimation.set('standing');
		}
	}

	fleeApproach() {
		let step = 0;
		let firstLeft = null;
		let lastLeft = this.model.position;
		let firstRight = null;
		let lastRight = this.model.position;
		let leftBlocked = false;
		let rightBlocked = false;

		while (leftBlocked === false && rightBlocked === false && step < VISIBLE_DISTANCE) {
			if (!leftBlocked) {
				const left = this.getLeftWalkPath(lastLeft);
				if (left) {
					if (!firstLeft) {
						firstLeft = left;
					}
				} else {
					leftBlocked = true;
				}
				const position = left ? left : this.grid.getNeighborUpperLeft(lastLeft);
				const visitors = this.chessboard.getVisitorsMultiple([position, this.grid.getNeighborDown(position)] );
				const isThereRepellent = visitors.some((v) => this.filterRepellents(v));
				if (isThereRepellent) {
					if (firstRight) {
						this.runTo(firstRight);
					} else {
						this.runRight();
					}
					if (DEBUG_BUG_STRATEGY) console.log('repelled from left', left);
					return true;
				}
				const isThereAttraction = visitors.some((v) => this.filterAttractions(v));
				if (isThereAttraction) {
					this.walkTo(firstLeft);
					if (DEBUG_BUG_STRATEGY) console.log('attracted to left', left);
					return true;
				}
				lastLeft = left;
			}
			if (!rightBlocked) {
				const right = this.getRightWalkPath(lastRight);
				if (right) {
					if (!firstRight) {
						firstRight = right;
					}
				} else {
					rightBlocked = true;
				}
				const position = right ? right : this.grid.getNeighborUpperRight(lastRight);
				const visitors = this.chessboard.getVisitorsMultiple([position, this.grid.getNeighborDown(position)]);
				const isThereRepellent = visitors.some((v) => this.filterRepellents(v));
				if (isThereRepellent) {
					if (firstLeft) {
						this.runTo(firstLeft);
					} else {
						this.runLeft();
					}
					if (DEBUG_BUG_STRATEGY) console.log('repelled from right', right);
					return true;
				}
				const isThereAttraction = visitors.some((v) => this.filterAttractions(v));
				if (isThereAttraction) {
					this.walkTo(firstRight);
					if (DEBUG_BUG_STRATEGY) console.log('attracted to right', right);
					return true;
				}
				lastRight = right;
			}
			step += 1;
		}
		return false;
	}

	filterFood(visitor) {
		return visitor._is_sprite && this.model.data.consumes.includes(visitor.type);
	}

	filterTakeable(visitor) {
		return visitor._is_sprite && this.model.data.carries.includes(visitor.type);
	}

	filterRepellents(visitor) {
		return visitor._is_sprite && this.model.data.repelledBy.includes(visitor.type);
	}

	filterVictims(visitor) {
		return visitor._is_sprite && visitor.data.isDead !== true && this.model.data.attacks.includes(visitor.type);
	}

	filterAttractions(visitor) {
		return (this.filterFood(visitor) || this.filterTakeable(visitor) || this.filterVictims(visitor) || (visitor._is_sprite && this.model.data.attractedBy.includes(visitor.type)));
	}

	filterPoison(visitor) {
		return visitor._is_sprite && this.model.data.poisonedBy.includes(visitor.type);
	}

	isAffectedByEnvironment() {
		return ((this.model.data.repelledBy.length > 0) || (this.model.data.attractedBy.length > 0) || (this.model.data.carries.length > 0) || (this.model.data.consumes.length > 0));
	}

	isHungry() {
		return (this.model.data.consumes.length > 0 || this.model.data.poisonedBy.length > 0);
	}

	eat(food) {
		if (!this.isHungry()) {
			return;
		}
		this.turnWhenMoving = false;
		const angle = this.model.image.coordinates.getRotation(food.image.coordinates);
		this.setTargetRotation(angle, 500);
		this.model.activeAnimation.set(null);

		if (!this.isGrown()) {
			this.model.data.amount += 1;
			this.updateAmount();
		}
		food.data.amount -= 1;
		if (food.data.amount <= 0) {
			this.level.sprites.remove(food);
		}
		if (this.level.isPlayable && this.level.bee) {
			if (this.model.position.distanceTo(this.level.bee.position) < 10) {
				BugStrategy.biteSound.play();
			}
		}
		if (this.filterPoison(food)) {
			this.die();
		}
	}

	isBeeInRange() {
		if (this.level.isPlayable && this.level.bee && (this.model.data.hurts > 0) && (this.game.beeState.isAlive())) {
			return (this.model.image.coordinates.distanceTo(this.level.bee.coordinates) < (this.grid.tileRadius.get() * 3));
		} else {
			return false;
		}
	}

	hurtBee() {
		this.turnWhenMoving = false;
		BugStrategy.biteSound.replay();
		this.game.beeState.hurt(this.model.data.hurts);
		const angle = this.model.image.coordinates.getRotation(this.level.bee.coordinates);
		this.setTargetRotation(angle, 500);
		this.model.activeAnimation.set('attacking');
	}

	die() {
		if (this.model.data.isDead) {
			return;
		}
		this.model.data.isDead = true;
		if (this.model.animations && this.model.animations.exists('dying')) {
			//this.oriented = false;
			//this.setTargetRotation(0, 500);
			this.model.activeAnimation.set('dying');
			this.addChild(new Timeout(1500, () => this.becomeCorpse()));
		} else {
			this.becomeCorpse();
		}
	}

	becomeCorpse() {
		console.log('corpse');
		if (this.model.data.deadSprite === undefined) {
			return;
		}
		const carcass = this.level.addSpriteFromStyle(this.model.position, this.model.data.deadSprite);
		carcass.data.amount = this.model.data.amount;
		carcass.image.rotation.set(this.model.image.rotation.get());
		//console.log(carcass);
		if (this.level.isPlayable && this.level.bee) {
			if (this.model.position.distanceTo(this.level.bee.position) < 10) {
				BeeDeathStrategy.deathSound.play();
			}
		}
		this.removeMyself();
	}

	hasItem() {
		return this.model.attachedSprite.isSet();
	}

	takeItem(item) {
		const taken = item.clone();
		this.level.sprites.remove(item);
		taken.image.rotation.set(0);
		taken.image.coordinates.set(this.model.image.coordinates.add(this.attachedSpriteOffset));
		this.model.attachedSprite.set(taken);
		this.model.activeAnimation.set(null);
	}

	dropItem() {
		if (!this.hasItem()) {
			return;
		}
		this.model.activeAnimation.set(null);
		const item = this.model.attachedSprite.get().clone();
		this.model.attachedSprite.set(null);
		item.position.set(this.grid.getNeighborUp(this.model.position));
		this.level.sprites.add(item);
		return item;
	}

	isGrown() {
		return (this.model.data.amount >= this.maxAmount);
	}

	isWalkablePath(position) {
		return this.level.isPenetrable(position) && this.level.isCrawlable(this.grid.getNeighborDown(position));
	}

	getLeftWalkPath(position) {
		const ll = this.grid.getNeighborLowerLeft(position);
		if (this.isWalkablePath(ll)) {
			return ll;
		}
		const ul = this.grid.getNeighborUpperLeft(position);
		if (this.isWalkablePath(ul)) {
			return ul;
		}
		return null;
	}

	getRightWalkPath(position) {
		const lr = this.grid.getNeighborLowerRight(position);
		if (this.isWalkablePath(lr)) {
			return lr;
		}
		const ur = this.grid.getNeighborUpperRight(position);
		if (this.isWalkablePath(ur)) {
			return ur;
		}
		return null;
	}

	walkLeft() {
		this.walkTo(this.getLeftWalkPath(this.model.position));
	}

	walkRight() {
		this.walkTo(this.getRightWalkPath(this.model.position));
	}

	walkTo(position) {
		if (!position) {
			return;
		}
		this.defaultTimeout = this.defaultMoveTimeout;
		this.turnWhenMoving = true;
		this.setTargetPosition(position);
		this.model.activeAnimation.set('walking');
	}

	runLeft() {
		const ll = this.grid.getNeighborLowerLeft(this.model.position);
		if (this.level.isPenetrable(ll)) {
			this.runTo(ll);
			return;
		}
		const ul = this.grid.getNeighborUpperLeft(this.model.position);
		if (this.level.isPenetrable(ul)) {
			this.runTo(ul);
			return;
		}
	}

	runRight() {
		const lr = this.grid.getNeighborLowerRight(this.model.position);
		if (this.level.isPenetrable(lr)) {
			this.runTo(lr);
			return;
		}
		const ur = this.grid.getNeighborUpperRight(this.model.position);
		if (this.level.isPenetrable(ur)) {
			this.runTo(ur);
		}
	}

	runTo(position) {
		if (!position) {
			return;
		}
		this.defaultTimeout = this.defaultMoveTimeout / 2;
		this.turnWhenMoving = true;
		this.setTargetPosition(position);
		this.model.activeAnimation.set('running');
	}

}
