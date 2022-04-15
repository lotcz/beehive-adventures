import CrawlingSound from "../../../../res/sound/larva-crawling.mp3";
import Sound from "../../../class/Sound";
import BugStrategy, {BUG_MAX_AMOUNT} from "./BugStrategy";

const DEBUG_SNAIL = false;

const SNAIL_TIMEOUT = 2000;
const SNAIL_CLOSE_TIMEOUT = 500;
const SNAIL_NOTICE_DISTANCE = 1000;
const SNAIL_HIDE_DISTANCE = 500;
const FALL_TIMEOUT = 2000;

const STATE_ROAMING = 0;
const STATE_HIDING = 1;
const STATE_HIDDEN = 2;
const STATE_UNHIDING = 3;
const STATE_WATCHING = 4;

export default class SnailStrategy extends BugStrategy {
	constructor(game, model, controls) {
		super(game, model, controls);

		this.maxAmount = BUG_MAX_AMOUNT;
		this.defaultMoveTimeout = SNAIL_TIMEOUT;

		this.model._is_penetrable = false;
		this.model._is_crawlable = true;
		this.state = STATE_ROAMING;
		this.model.activeAnimation.set(null);
		this.fallTimeout = FALL_TIMEOUT;
		this.crawlingSound = new Sound(CrawlingSound);
	}

	updateInternal(delta) {
		const dist = this.level.bee.coordinates.distanceTo(this.model.image.coordinates);
		this.crawlingSound.playInDistance(dist);

		if (this.fallTimeout > 0) {
			this.fallTimeout -= delta;
		}

		super.updateInternal(delta);
	}

	updateStrategy() {
		const down = this.grid.getNeighborDown(this.model.position);
		if (this.level.isPenetrable(down)) {
			this.hidden();
			this.fallTimeout = FALL_TIMEOUT;
			super.updateStrategy();
			return;
		}

		if (this.fallTimeout > 0) {
			if (this.state !== STATE_HIDDEN) {
				this.hide();
			}
			return;
		}

		if (Math.abs(this.model.image.rotation.get()) < 15) {
			this.setWatchRotation();
			return;
		}

		if (this.state === STATE_HIDING) {
			this.hidden();
			return;
		}

		const beeDistance = this.model.image.coordinates.distanceTo(this.level.bee.coordinates);
		if (beeDistance < SNAIL_NOTICE_DISTANCE) {
			if (beeDistance < SNAIL_HIDE_DISTANCE) {
				if (this.state !== STATE_HIDDEN) {
					this.hide();
					return;
				}
			} else {
				if (this.state === STATE_HIDDEN) {
					this.unhide();
					return;
				} else if (this.state !== STATE_WATCHING) {
					this.watch();
					return;
				}
			}
		} else {
			if (this.state === STATE_HIDDEN) {
				this.unhide();
				return;
			}
			if (this.state === STATE_ROAMING) {
				super.updateStrategy();
				return;
			} else {
				this.roam();
				return;
			}
		}
	}

	roam() {
		if (DEBUG_SNAIL) console.log('roaming');
		this.defaultTimeout = SNAIL_TIMEOUT;
		this.model.activeAnimation.set(null);
		this.state = STATE_ROAMING;
		super.updateStrategy();
	}

	hide() {
		if (DEBUG_SNAIL) console.log('hiding');
		this.defaultTimeout = SNAIL_CLOSE_TIMEOUT;
		this.state = STATE_HIDING;
		this.model.activeAnimation.set('hiding');
		this.setWatchRotation();
	}

	unhide() {
		if (DEBUG_SNAIL) console.log('unhiding');
		this.defaultTimeout = SNAIL_TIMEOUT;
		this.state = STATE_UNHIDING;
		this.model.activeAnimation.set('unhiding');
	}

	hidden() {
		if (DEBUG_SNAIL) console.log('hidden');
		this.state = STATE_HIDDEN;
		this.model.activeAnimation.set('hidden');
		this.defaultTimeout = SNAIL_TIMEOUT;
		this.setWatchRotation();
	}

	watch() {
		if (DEBUG_SNAIL) console.log('watching');
		this.state = STATE_WATCHING;
		this.defaultTimeout = SNAIL_CLOSE_TIMEOUT;
		this.model.activeAnimation.set('standing');
		this.setWatchRotation();
	}

	setWatchRotation() {
		this.setTargetRotation(this.model.image.rotation.get() > 0 ? 90 : -90);
	}
}
