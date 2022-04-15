import ObjectStrategy from "../ObjectStrategy";
import {STRATEGY_MINERAL} from "../../../builder/sprites/SpriteStyleMinerals";
import Pixies from "../../../class/Pixies";

const MINERAL_TIMEOUT = 1000;

export const MINERAL_MAX_AMOUNT = 5;

export default class MineralStrategy extends ObjectStrategy {
	constructor(game, model, controls) {
		super(game, model, controls, MINERAL_TIMEOUT);

		this.maxAmount = MINERAL_MAX_AMOUNT;
	}

	updateStrategy() {
		super.updateStrategy();

		this.model._is_penetrable = (this.model.data.amount < this.maxAmount);
		this.model._is_crawlable = !this.model._is_penetrable;
	}

	updateStillObject() {
		if (this.model.data.amount > this.maxAmount) {
			const amount = this.model.data.amount - this.maxAmount;
			this.separate(amount);
		}

		const visitors = this.chessboard.getVisitors(this.model.position, (v) => v !== this.model);
		const impenetrable = visitors.filter((v) => v._is_penetrable === false);

		if (impenetrable.length > 0) {
			const available = [];
			const u = this.grid.getNeighborUp(this.model.position);
			if (this.level.isPenetrable(u)) {
				available.push(u);
			}
			const ul = this.grid.getNeighborUpperLeft(this.model.position);
			if (this.level.isPenetrable(ul)) {
				available.push(ul);
			}
			const ur = this.grid.getNeighborUpperRight(this.model.position);
			if (this.level.isPenetrable(ur)) {
				available.push(ur);
			}
			if (available.length > 0) {
				this.setTargetPosition(Pixies.randomElement(available));
				return;
			}
		}

		visitors
			.filter((v) =>
				v._is_sprite === true
				&& v.strategy.get() === STRATEGY_MINERAL
				&& v.type === this.model.type
			).forEach((v) => this.absorb(v));
	}

	separate(amount) {
		if (amount > this.model.data.amount) amount = this.model.data.amount;
		let position = this.grid.getNeighborUp(this.model.position);
		if (!this.level.isPenetrable(position)) {
			position = this.grid.getNeighborUpperLeft(this.model.position);
			if (!this.level.isPenetrable(position)) {
				position = this.grid.getNeighborUpperRight(this.model.position);
			}
		}
		if (this.level.isPenetrable(position)) {
			this.model.data.amount -= amount;
			const sprite = this.level.addSpriteFromStyle(position, this.model.type);
			sprite.data.amount = amount;
		}
	}

	absorb(node) {
		if (node.data.amount <= this.model.data.amount && node.image.scale.get() <= this.model.image.scale.get()) {
			this.model.data.amount += node.data.amount;
			this.level.sprites.remove(node);
		}
	}

}
