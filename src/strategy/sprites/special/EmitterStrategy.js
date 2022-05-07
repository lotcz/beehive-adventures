import Pixies from "../../../class/Pixies";
import StaticStrategy from "../StaticStrategy";
import {
	SPRITE_TYPE_GREEN_JELLY,
	SPRITE_TYPE_PINK_JELLY, SPRITE_TYPE_YELLOW_JELLY,
	STRATEGY_MINERAL
} from "../../../builder/sprites/SpriteStyleMinerals";
import {SPRITE_TYPE_RANDOM, SPRITE_TYPE_RANDOM_JELLY} from "../../../builder/sprites/SpriteStyleBasic";
import {
	SPRITE_TYPE_BEE_BROKEN_EGG, SPRITE_TYPE_BEE_DEAD,
	SPRITE_TYPE_BUG_DEAD,
	SPRITE_TYPE_BUG_EGG,
	SPRITE_TYPE_STONE
} from "../../../builder/sprites/SpriteStyleObjects";

const EMITTER_TIMEOUT = 1000;

export default class EmitterStrategy extends StaticStrategy {
	ready;

	constructor(game, model, controls) {
		super(game, model, controls, EMITTER_TIMEOUT);

		this.randomizeTimeout = true;
		this.ready = true;

		if (this.model.data.timeout !== undefined) {
			this.defaultTimeout = this.model.data.timeout;
		}
		if (this.model.data.max === undefined) {
			this.model.data.max = -1;
		}
		if (this.model.data.emitted === undefined) {
			this.model.data.emitted = 0;
		}
	}

	canEmit() {
		return (this.model.data.max === -1 || this.model.data.emitted < this.model.data.max);
	}

	updateStrategy() {
		if (this.canEmit()) {
			const visitors = this.chessboard.getVisitors(this.model.position, (v) => (v !== this.model) && ((v._is_sprite && v.type === this.model.data.type) || (v._is_penetrable === false)));
			const spotFree = (visitors.length === 0);
			if (spotFree) {
				if (!this.ready) {
					this.ready = true;
				} else {
					this.emit();
				}
			}
		}
	}

	emit() {
		let style = this.model.data.type;
		if (style === SPRITE_TYPE_RANDOM) {
			style = Pixies.randomElement([SPRITE_TYPE_BUG_DEAD, SPRITE_TYPE_STONE, SPRITE_TYPE_BUG_EGG, SPRITE_TYPE_BEE_BROKEN_EGG, SPRITE_TYPE_BEE_DEAD]);
		}
		if (style === SPRITE_TYPE_RANDOM_JELLY) {
			style = Pixies.randomElement([SPRITE_TYPE_PINK_JELLY, SPRITE_TYPE_GREEN_JELLY, SPRITE_TYPE_PINK_JELLY, SPRITE_TYPE_YELLOW_JELLY]);
		}
		const sprite = this.level.addSpriteFromStyle(this.model.position, style);
		if (this.model.data.amount) {
			sprite.data.amount = this.model.data.amount;
		}
		this.model.data.emitted += 1;
		this.ready = false;
	}

}
