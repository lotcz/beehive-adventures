import StaticStrategy from "../StaticStrategy";
import AnimatedValue from "../../../class/AnimatedValue";
import {SPRITE_TYPE_BEE_EGG} from "../../../builder/sprites/SpriteStyleObjects";

const QUEEN_TIMEOUT = 5000;

export default class BeeQueenStrategy extends StaticStrategy {
	hintController;

	constructor(game, model, controls) {
		super(game, model, controls, QUEEN_TIMEOUT);

		this.randomizeTimeout = true;
		this.model._is_penetrable = false;
		this.model._is_crawlable = true;
		this.egg = null;
		this.eggScaleAnimation = null;
	}

	updateStrategy() {
		if (!this.hasEgg()) {
			this.spawnEgg();
		}
	}

	updateInternal(delta) {
		if (this.eggScaleAnimation) {
			const scale = this.eggScaleAnimation.get(delta);
			//console.log(scale);
			this.egg.image.scale.set(scale);
			if (this.eggScaleAnimation.isFinished()) {
				this.eggScaleAnimation = null;
				this.releaseEgg();
			}
		}
		super.updateInternal(delta);
	}

	spawnEgg() {
		if (!this.hasEgg()) {
			this.egg = this.level.addSpriteFromStyle(this.model.position.addY(2), SPRITE_TYPE_BEE_EGG);
			this.level.sprites.remove(this.egg);
			this.egg.setDeleted(false);
			this.egg.image.scale.set(0.3);
			this.eggScaleAnimation = new AnimatedValue(0.3, 1, 2000);
			this.model.attachedSprite.set(this.egg);
			this.setTargetScale(0.7);
		}
	}

	releaseEgg() {
		if (this.hasEgg()) {
			this.model.attachedSprite.set(null);
			//this.egg.position.set(this.model.position.addY(2));
			//this.egg.setDeleted(false);
			this.setTargetScale(1);
			this.level.sprites.add(this.egg);
			this.egg = null;
		}
	}

	hasEgg() {
		return this.egg;
	}

}
