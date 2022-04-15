import MineralStrategy from "./MineralStrategy";

const BUBBLE_TIMEOUT = 2000;

export default class BubbleStrategy extends MineralStrategy {
	constructor(game, model, controls) {
		super(game, model, controls, BUBBLE_TIMEOUT);
	}

	updateStrategy() {
		if (this.level.isWater(this.model.position)) {
			const up = this.grid.getNeighborUp(this.model.position);
			this.setTargetPosition(up);
			this.model.data.amount = this.model.data.amount * 0.8;
			this.updateAmount();
			if (this.model.data.amount <= 0) {
				this.level.sprites.remove(this.model);
			}
		} else {
			this.level.sprites.remove(this.model);
			//this.level.addSpriteFromStyle(this.model.position, SPRITE_TYPE_WATER);
		}
	}

}
