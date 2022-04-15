import CrawlingSound from "../../../../res/sound/larva-crawling.mp3";
import Sound from "../../../class/Sound";
import BugStrategy from "./BugStrategy";

const LARVA_TIMEOUT = 5000;
export const LARVA_MAX_AMOUNT = 5;

export default class LarvaStrategy extends BugStrategy {
	constructor(game, model, controls) {
		super(game, model, controls);

		this.oriented = true;
		this.turnWhenMoving = true;
		this.maxAmount = LARVA_MAX_AMOUNT;
		this.defaultMoveTimeout = LARVA_TIMEOUT;
		//this.defaultTimeout = this.defaultMoveTimeout;

		this.model._is_penetrable = false;
		this.model._is_crawlable = true;

		this.crawlingSound = new Sound(CrawlingSound);
	}

	updateInternal(delta) {
		const dist = this.level.bee.coordinates.distanceTo(this.model.image.coordinates);
		this.crawlingSound.playInDistance(dist);

		super.updateInternal(delta);
	}

}
