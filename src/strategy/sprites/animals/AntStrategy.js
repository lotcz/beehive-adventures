import CrawlingSound from "../../../../res/sound/ant-crawling.mp3";
import Sound from "../../../class/Sound";
import BugStrategy from "./BugStrategy";

const ANT_TIMEOUT = 1000;
export const ANT_MAX_AMOUNT = 15;

export default class AntStrategy extends BugStrategy {
	constructor(game, model, controls) {
		super(game, model, controls);

		this.oriented = true;
		this.turnWhenMoving = true;
		this.maxAmount = ANT_MAX_AMOUNT;
		this.defaultMoveTimeout = ANT_TIMEOUT;

		this.model._is_penetrable = false;
		this.model._is_crawlable = false;

		this.model.data.hurts = 0.2;
		this.crawlingSound = new Sound(CrawlingSound);
	}

	updateInternal(delta) {
		if (this.model.activeAnimation.equalsTo('walking')) {
			const dist = this.level.bee.coordinates.distanceTo(this.model.image.coordinates);
			this.crawlingSound.playInDistance(dist);
		} else {
			this.crawlingSound.pause();
		}
		super.updateInternal(delta);
	}

}
