import ControllerBase from "../../class/ControllerBase";
import Sound from "../../class/Sound";
import HitSound from "../../../res/sound/hit.mp3";
//import WingSound from "../../../res/sound/wing.mp3";
import BeeController, {BEE_CENTER} from "../../controller/BeeController";
import {MINERAL_MAX_AMOUNT} from "../sprites/minerals/MineralStrategy";
import Pixies from "../../class/Pixies";
import AnimatedValue from "../../class/AnimatedValue";
import AnimatedVector2 from "../../class/AnimatedVector2";
import {NEIGHBOR_TYPE_UP, NEIGHBOR_TYPE_UPPER_LEFT, NEIGHBOR_TYPE_UPPER_RIGHT} from "../../model/GridModel";
import {IMAGE_BEE} from "../../builder/sprites/SpriteStyleBees";
import {SPRITE_TYPE_WATER} from "../../builder/sprites/SpriteStyleMinerals";

// max length of direction vector, pixels per second
const MAX_SPEED = 1500;

// max length of direction vector to allow crawling
const MAX_CRAWL_SPEED = 1000;

// how quickly will speed drop down, pixels per second
const SLOWDOWN_SPEED = 800;

// how quickly will speed build up, pixels per second
const SPEEDUP_SPEED = 1800;

const DEFAULT_HIT_TIMEOUT = 300;

const WATER_HURT = 0.2;
const HIT_HURT = 0.1;

export default class BeeFlightStrategy extends ControllerBase {
	static hitSound = new Sound(HitSound);
	//static wingSound = new Sound(WingSound);
	wingRotation;
	speed;
	dead;
	leaving;
	scaleAnimation;
	coordinatesAnimation;

	/**
	 * @type BeeModel
	 */
	model;

	/**
	 * @param {GameModel} game
	 * @param {BeeModel} model
	 * @param {ControlsModel} controls
	 */
	constructor(game, model, controls) {
		super(game, model, controls);

		this.model = model;
		this.wingRotation = 0;
		this.speed = 0;
		this.dead = false;
		this.leaving = false;
		this.hitTimeout = 0;
		this.pushedListener = (p) => this.pushed(p);
	}

	activateInternal() {
		this.model.image.path.set(IMAGE_BEE);
		this.model.leftWing.flipped.set(false);
		this.model.rightWing.flipped.set(true);
		this.model.starsAnimation.image.rotation.set(0);
		this.model.direction.set(0,0);
		this.speed = 0;
		if (this.controls.movingLeft.get()) {
			this.model.headingLeft.set(true);
		} else if (this.controls.movingRight.get()) {
			this.model.headingLeft.set(false);
		}
		this.model.addOnPushedListener(this.pushedListener);
		this.updateBee();
		//console.log('flying');
	}

	deactivateInternal() {
		this.model.removeOnPushedListener(this.pushedListener);
	}

	updateInternal(delta) {
		const secsDelta = delta / 1000;

		//animate wings
		if (this.wingRotation > 60) {
			this.wingRotation = -60;
			//BeeFlightStrategy.wingSound.replay();
		}
		this.wingRotation += secsDelta * (100 + (400 * this.speed / MAX_SPEED));
		//BeeFlightStrategy.wingSound.speed(1 + this.speed / MAX_SPEED);

		if (this.leaving) {
			this.model.scale.set(this.scaleAnimation.get(delta));
			this.model.coordinates.set(this.coordinatesAnimation.get(delta));
			this.updateBee();
			this.parent.updateMovement();
			return;
		}

		let direction = this.model.direction;

		if (this.controls.anyMovement() && !this.dead) {
			const carriedAmount = this.model.inventory.children.reduce((prev, current) => prev + current.data.amount, 0);
			const speedup = SPEEDUP_SPEED * (1 - Pixies.between(0, 0.5, 0.5 * carriedAmount / MINERAL_MAX_AMOUNT));
			if (this.controls.movingUp.get()) {
				direction = direction.addY(-speedup * secsDelta);
			} else if (this.controls.movingDown.get()) {
				direction = direction.addY(speedup * secsDelta);
			}
			if (this.controls.movingLeft.get()) {
				direction = direction.addX(-speedup * secsDelta);
				this.model.headingLeft.set(true);
			} else if (this.controls.movingRight.get()) {
				direction = direction.addX(speedup * secsDelta);
				this.model.headingLeft.set(false);
			}
		}

		//slow down
		this.speed = direction.size();
		if (this.speed > 0) {
			const slowDown = (this.dead) ? SLOWDOWN_SPEED * 4 : SLOWDOWN_SPEED;
			direction.setSize(Math.max(0, this.speed - (slowDown * secsDelta)));
		}

		if (this.hitTimeout > 0) {
			this.hitTimeout -= delta;
		}

		const upperNeighbors = [NEIGHBOR_TYPE_UP, NEIGHBOR_TYPE_UPPER_RIGHT, NEIGHBOR_TYPE_UPPER_LEFT];
		const waterAbove = upperNeighbors.reduce(
			(prev, current) => prev.concat(
				this.chessboard.getVisitors(
					this.grid.getNeighbor(this.model.position, current),
				(v) => v._is_sprite && v.type === SPRITE_TYPE_WATER && this.model.coordinates.distanceTo(v.image.coordinates) < (this.grid.tileRadius.get() * 2))),
			[]);

		if (waterAbove.length > 0) {
			direction = direction.addY(SPEEDUP_SPEED * secsDelta * 10);
			if (this.hitTimeout <= 0) {
				BeeController.splashSound.replay();
				this.game.beeState.hurt(WATER_HURT);
				this.hitTimeout = DEFAULT_HIT_TIMEOUT;
			}
		}

		this.speed = direction.size();

		// limit speed
		if (this.speed > MAX_SPEED) {
			direction.setSize(MAX_SPEED);
		}

		if (this.speed > 0) {
			let coords = null;
			let position = null;

			const distance = direction.multiply(secsDelta);
			const crashDistance = distance.clone();
			crashDistance.setSize(crashDistance.size() + (this.grid.tileRadius.get() * 0.8));

			const crashCoords = this.model.coordinates.add(crashDistance);
			let crashPosition = this.grid.getPosition(crashCoords);
			let penetrable = this.level.isPenetrable(crashPosition);

			if (penetrable && this.model.inventory.isSet() && this.model.inventory.get()._is_crawlable) {
				const inventoryCrashCoords = crashCoords.addY(this.grid.tileSize.y);
				const inventoryCrashPosition = this.grid.getPosition(inventoryCrashCoords);
				if (this.level.isValidPosition(inventoryCrashPosition) && !this.level.isPenetrable(inventoryCrashPosition)) {
					penetrable = false;
					this.parent.dropItem();
					this.parent.dropItemTimeout = 100;
					crashPosition = this.grid.getNeighborDown(this.model.position);
				}
			}

			if (penetrable) {
				coords = this.model.coordinates.add(distance);
				position = this.grid.getPosition(coords);
			} else {
				if (this.speed < MAX_CRAWL_SPEED && this.level.isCrawlable(crashPosition)) {
					const crawl = this.grid.getNeighborType(this.model.position, crashPosition);
					if (crawl !== undefined) {
						this.parent.crawl(crawl);
						return;
					}
					console.log('Uncrawlable');
					console.log(`[${this.model.position.x}, ${this.model.position.y}], [${crashPosition.x}, ${crashPosition.y}]`);
				}

				const possibleExit = this.level.isPossibleExit(crashPosition);
				if (possibleExit) {
					this.model.triggerOnTravelEvent(possibleExit);
					return;
				}

				if (this.speed > MAX_CRAWL_SPEED) {
					BeeFlightStrategy.hitSound.replay();
					this.parent.emptyInventory();
					this.game.beeState.hurt(HIT_HURT * this.speed / MAX_SPEED);
					if (this.game.beeState.isAlive()) {
						const hitVisitor = this.chessboard.getVisitors(crashPosition).find((v) => v._is_sprite && v.data !== undefined && v.data.hits !== undefined && v.data.hits > 0);
						if (hitVisitor) {
							this.game.beeState.hurt(hitVisitor.data.hits);
						}
					}
					if (this.game.beeState.isDead()) {
						this.dead = true;
						this.game.beeState.health.set(0.001);
					}
				}

				coords = this.model.coordinates.subtract(distance);
				direction = direction.multiply(-0.5);

				const newPosition = this.grid.getPosition(coords);
				const newPenetrable = this.level.isPenetrable(newPosition);
				if (!newPenetrable) {
					const nei = this.grid.getNeighbors(this.model.position);
					const free = nei.filter((n) => this.level.isPenetrable(n));
					if (free.length > 0) {
						position = newPosition;
						coords = this.grid.getCoordinates(free[0]);
					} else {
						console.log('Lost');
					}
				} else {
					position = this.grid.getPosition(coords);
				}

			}
			// apply movement
			this.model.position.set(position);
			this.model.coordinates.set(coords);
			this.model.direction.set(direction);

			this.parent.updateMovement();
		} else {
			if (this.dead) {
				this.parent.die();
				return;
			}
			this.speed = 0;
		}

		this.updateBee();
	}

	updateBee() {
		this.model.image.flipped.set(this.model.headingLeft.get());
		this.model.starsAnimation.image.flipped.set(this.model.headingLeft.get());

		const rotation = Math.abs(this.wingRotation) - 30;
		this.model.leftWing.rotation.set(rotation);
		this.model.rightWing.rotation.set(-rotation);

		let idle = BEE_CENTER.addY((rotation / 3) * (1 - (this.speed / MAX_SPEED)));

		this.model.image.coordinates.set(idle);
		this.model.leftWing.coordinates.set(idle);
		this.model.rightWing.coordinates.set(idle);
	}

	leave() {
		this.leaving = true;
		this.scaleAnimation = new AnimatedValue(this.model.scale.get(), 0.1, 2000);
		this.coordinatesAnimation = new AnimatedVector2(this.model.coordinates, this.grid.getCoordinates(this.model.position), 2000);
	}

	pushed(push) {
		this.model.direction.set(this.model.direction.add(push));
	}

}
