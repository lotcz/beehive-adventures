import FriendStrategy from "./FriendStrategy";
import {SPRITE_TYPE_BAIT_BODY, SPRITE_TYPE_GRASSHOPPER_BODY} from "../../../builder/sprites/SpriteStyleAnimals";
import Pixies from "../../../class/Pixies";

const BAIT_TIMEOUT = 2000;
const BAIT_CLOSE_TIMEOUT = 500;
const BAIT_NOTICE_DISTANCE = 2000;

const MIN_ROTATION = 55;
const MAX_ROTATION = 180;

export default class BaitStrategy extends FriendStrategy {
	hintController;

	constructor(game, model, controls) {
		super(game, model, controls, BAIT_TIMEOUT);

		this.oriented = true;
		this.model._is_penetrable = false;
		this.model._is_crawlable = true;

		this.rotateAttachedSprite = false;
		this.flipAttachedSprite = false;
		this.model.attachedSpriteBehind = true;

		if (this.model.attachedSprite.isEmpty()) {
			const body = this.level.createSpriteFromStyle(this.getBodyPosition(), SPRITE_TYPE_BAIT_BODY);
			this.model.attachedSprite.set(body);
		}

	}

	activateInternal() {
		super.activateInternal();
		const bodyPosition = this.getBodyPosition();
		this.model.attachedSprite.get().position.set(bodyPosition);
		this.model.attachedSprite.get().image.coordinates.set(this.grid.getCoordinates(bodyPosition));
		this.chessboard.addVisitor(bodyPosition, this.model);
	}

	deactivateInternal() {
		this.chessboard.removeVisitor(this.model.attachedSprite.get().position, this.model);
		super.deactivateInternal();
	}

	updateStrategy() {
		super.updateStrategy();

		if (this.level.isPlayable && this.level.bee) {
			const beeDistance = this.model.image.coordinates.distanceTo(this.level.bee.coordinates);
			if (beeDistance < BAIT_NOTICE_DISTANCE) {
				this.defaultTimeout = BAIT_CLOSE_TIMEOUT;
				const rotation = this.model.image.coordinates.getRotation(this.level.bee.coordinates);
				if (Math.abs(rotation) > MIN_ROTATION) {
					this.setTargetRotation(rotation);
					return;
				}
			}

			this.defaultTimeout = BAIT_TIMEOUT;
			this.setTargetRotation(180 + Pixies.random(-10, 10));
		}
	}

	getBodyPosition() {
		return this.grid.getNeighborDown(this.model.position);
	}

}
