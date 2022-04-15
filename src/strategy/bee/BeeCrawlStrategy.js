import ControllerBase from "../../class/ControllerBase";
import BeeController, {BEE_CENTER} from "../../controller/BeeController";
import {
	NEIGHBOR_TYPE_LOWER_LEFT,
	NEIGHBOR_TYPE_LOWER_RIGHT,
	NEIGHBOR_TYPE_UP,
	NEIGHBOR_TYPE_UPPER_LEFT,
	NEIGHBOR_TYPE_UPPER_RIGHT
} from "../../model/GridModel";
import RotationValue from "../../class/RotationValue";

import CrawlSound from "../../../res/sound/pop-1.mp3";
import UnCrawlSound from "../../../res/sound/pop-2.mp3";
import Sound from "../../class/Sound";
import {CRAWLING_MATRIX, FALLBACK_FLY, FALLBACK_PROCEED} from "../../builder/CrawlingMatrix";
import WaterStrategy from "../sprites/minerals/WaterStrategy";
import {SPRITE_TYPE_WATER} from "../../builder/sprites/SpriteStyleMinerals";

const CRAWL_SPEED = 500; //pixels per second
const ROTATION_SPEED = 220; //angles per second
const CONTROLS_TIMEOUT = 300;
const DEFAULT_HIT_TIMEOUT = 300;

export default class BeeCrawlStrategy extends ControllerBase {
	static crawlSound = new Sound(CrawlSound);
	static uncrawlSound = new Sound(UnCrawlSound);

	targetCoordinates;
	targetRotation;
	timeout;

	constructor(game, model, controls) {
		super(game, model, controls);

		this.targetCoordinates = null;
		this.targetRotation = null;
		this.timeout = CONTROLS_TIMEOUT;
		this.hitTimeout = 0;
		this.pushedListener = (p) => this.pushed(p);

		BeeCrawlStrategy.crawlSound.play();
	}

	activateInternal() {
		const crawlingPosition = this.grid.getNeighbor(this.model.position, this.model.crawling.get());
		const down = this.grid.getNeighborDown(crawlingPosition);
		if (this.level.isPenetrable(down)) {
			this.parent.inspectForMinerals(crawlingPosition);
		}

		this.model.rotation.set(this.getRotation(this.model.crawling.get()));
		this.model.crawlingAnimation.image.coordinates.set(BEE_CENTER);
		this.targetCoordinates = this.grid.getCoordinates(this.model.position);
		this.model.addOnPushedListener(this.pushedListener);
		this.updateBee();
	}

	deactivateInternal() {
		this.model.removeOnPushedListener(this.pushedListener);
	}

	updateInternal(delta) {
		if (this.model.crawling.get() === null) {
			this.fly();
			return;
		} else {
			const crawlingPosition = this.grid.getNeighbor(this.model.position, this.model.crawling.get());
			if (!this.level.isCrawlable(crawlingPosition)) {
				this.fly();
				return;
			}
		}

		if ((this.targetCoordinates !== null) || (this.targetRotation !== null)) {
			const secsDelta = delta / 1000;
			if (this.targetCoordinates !== null) {
				const diff = this.targetCoordinates.subtract(this.model.coordinates);
				const distance = diff.size();
				if (distance === 0) {
					this.targetCoordinates = null;
				} else {
					diff.setSize(Math.min(distance, CRAWL_SPEED * secsDelta));
					this.model.coordinates.set(this.model.coordinates.add(diff));
				}
			}
			if (this.targetRotation !== null) {
				const diff = new RotationValue(this.targetRotation.get() - this.model.rotation.get()).get();
				if (Math.abs(diff) > 180) {
					console.log(diff);
				}
				if (diff === 0) {
					this.targetRotation = null;
				} else {
					let step = ((diff < 0) ? -1 : 1) * ROTATION_SPEED * secsDelta;
					if (Math.abs(step) > Math.abs(diff)) {
						step = diff;
					}
					this.model.rotation.add(step);
				}
			}
			this.updateBee();
			this.model.crawlingAnimation.paused.set(false);
			return;
		} else {
			this.model.crawlingAnimation.paused.set(true);
		}

		if (this.timeout > 0) {
			this.timeout -= delta;
			return;
		}

		if (this.controls.anyMovement()) {
			if (this.controls.movingUp.get()) {
				if (this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_LEFT || this.model.crawling.get() === NEIGHBOR_TYPE_LOWER_LEFT) {
					this.model.headingLeft.set(true);
				}
				if (this.model.crawling.get() === NEIGHBOR_TYPE_LOWER_RIGHT || this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_RIGHT) {
					this.model.headingLeft.set(false);
				}
			} else if (this.controls.movingDown.get()) {
				if (this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_LEFT || this.model.crawling.get() === NEIGHBOR_TYPE_LOWER_LEFT) {
					this.model.headingLeft.set(false);
				}
				if (this.model.crawling.get() === NEIGHBOR_TYPE_LOWER_RIGHT || this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_RIGHT) {
					this.model.headingLeft.set(true);
				}
			}
			if (this.controls.movingLeft.get()) {
				if (this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_LEFT || this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_RIGHT || this.model.crawling.get() === NEIGHBOR_TYPE_UP) {
					this.model.headingLeft.set(false);
				} else {
					this.model.headingLeft.set(true);
				}
			} else if (this.controls.movingRight.get()) {
				if (this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_LEFT || this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_RIGHT || this.model.crawling.get() === NEIGHBOR_TYPE_UP) {
					this.model.headingLeft.set(true);
				} else {
					this.model.headingLeft.set(false);
				}
			}
			const matrix = CRAWLING_MATRIX[this.model.crawling.get()];
			if (!matrix) {
				console.log('Matrix not found');
				return;
			}
			const options = matrix.options[this.controls.direction.get()];
			if (options === false || options === undefined) {
				console.log('No crawling options!');
				return;
			} else if (options === true) {
				this.fly();
				return;
			} else {
				let fallBack = true;

				const nextPosition = this.grid.getNeighbor(this.model.position, options.nextPosition);

				const possibleExit = this.level.isPossibleExit(nextPosition);
				if (possibleExit) {
					this.model.triggerOnTravelEvent(possibleExit);
					return;
				}

				if (options.skipMovement !== true) {
					if (this.level.isPenetrable(nextPosition)) {
						this.model.position.set(nextPosition);
						this.targetCoordinates = this.grid.getCoordinates(nextPosition);
						this.model.crawling.set(options.nextNeighbor);
						this.targetRotation = new RotationValue(this.getRotation(options.nextNeighbor));
						fallBack = false;
					}
				} else {
					if (this.level.isCrawlable(nextPosition)) {
						this.model.crawling.set(options.nextPosition);
						this.targetRotation = new RotationValue(this.getRotation(options.nextPosition));
						fallBack = false;
					}
				}

				if (fallBack) {
					if (options.fallback === FALLBACK_PROCEED) {
						if (this.level.isCrawlable(nextPosition)) {
							this.model.crawling.set(options.nextPosition);
							this.targetRotation = new RotationValue(this.getRotation(options.nextPosition));
						}
					} else if (options.fallback === FALLBACK_FLY) {
						this.fly();
						return;
					}
				}
			}
		}

		if (this.hitTimeout > 0) {
			this.hitTimeout -= delta;
		}

		const waterAbove = this.chessboard.getVisitors(this.grid.getNeighborUp(this.model.position), (v) => v._is_sprite && v.type === SPRITE_TYPE_WATER);
		if (waterAbove.length > 0) {
			const water = waterAbove[0];
			if (this.model.coordinates.distanceTo(water.image.coordinates) < (this.grid.tileRadius.get() * 2)) {
				if (this.hitTimeout <= 0) {
					BeeController.splashSound.replay();
					this.game.beeState.hurt(0.2);
					this.hitTimeout = DEFAULT_HIT_TIMEOUT;
				}
			}
		}
	}

	updateBee() {
		const rotation = this.model.rotation.get();
		this.model.crawlingAnimation.image.rotation.set(rotation);
		this.model.crawlingAnimation.image.flipped.set(this.model.headingLeft.get());
		this.model.starsAnimation.image.rotation.set(rotation);
		this.model.starsAnimation.image.flipped.set(this.model.headingLeft.get());
		this.parent.updateMovement();
	}

	getRotation(direction) {
		return (60 * (direction - 3));
	}

	fly() {
		if (this.model.crawling.isSet()) {
			const crawlingPosition = this.grid.getNeighbor(this.model.position, this.model.crawling.get());
			this.parent.inspectForMinerals(crawlingPosition);
			BeeCrawlStrategy.uncrawlSound.play();
		}
		this.parent.fly();
	}

	pushed(push) {
		this.fly();
		this.model.triggerOnPushedEvent(push);
	}

}
