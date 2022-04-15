import {SPRITE_STYLES} from "../../../builder/SpriteStyle";
import StaticStrategy from "../StaticStrategy";
import {NEIGHBOR_TYPE_DOWN} from "../../../model/GridModel";
import {STRATEGY_DOOR_MOUTH} from "../../../builder/sprites/SpriteStyleBasic";

const FRIEND_TIMEOUT = 2000;
const MAX_CONSUMED_AMOUNT = 1;

export default class FriendStrategy extends StaticStrategy {

	constructor(game, model, controls) {
		super(game, model, controls, FRIEND_TIMEOUT);

		this.oriented = true;
		this.model._is_penetrable = false;
		this.model._is_crawlable = true;

		if (!this.model.data.consumesAmount) {
			this.model.data.consumesAmount = MAX_CONSUMED_AMOUNT;
		}
		if (!this.model.data.consumedAmount) {
			this.model.data.consumedAmount = 0;
		}
		if (!this.model.data.openDoors) {
			this.model.data.openDoors = 0;
			this.model.data.doorsOpened = false;
		}
		if (!this.model.data.producesAmount) {
			this.model.data.producesAmount = MAX_CONSUMED_AMOUNT;
		}
		if (!this.model.data.producesGifts) {
			this.model.data.producesGifts = MAX_CONSUMED_AMOUNT;
		}
		if (!this.model.data.producedGifts) {
			this.model.data.producedGifts = 0;
		}
		if (this.model.data.producesAt === undefined) {
			this.model.data.producesAt = NEIGHBOR_TYPE_DOWN;
		}
		this.updateHintContent();
	}

	getHintContent() {
		if (!this.model.data.consumes) {
			return this.model.data.hint;
		}
		if (!this.hasGifts()) {
			return this.model.data.defaultHint;
		}
		if (this.model.data.consumesHint) {
			return this.model.data.consumesHint;
		} else {
			const style = SPRITE_STYLES[this.model.data.consumes];
			return [style.image.uri];
		}
	}

	updateHintContent() {
		this.model.data.hint = this.getHintContent();
		this.resetHintController();
	}

	updateStrategy() {
		if (this.level.isPlayable && this.level.bee) {
			this.decision();
		}
		super.updateStrategy();
	}

	canEat() {
		return this.hasGifts() && this.isHungry();
	}

	canProduce() {
		return this.model.data.produces && this.hasGifts() && !this.isHungry();
	}

	isHungry() {
		return (this.model.data.consumedAmount < this.model.data.consumesAmount);
	}

	hasGifts() {
		return (this.model.data.producedGifts < this.model.data.producesGifts);
	}

	decision() {
		if (this.canEat()) {
			this.eat();
		} else if (this.hasGifts()) {
			if (this.model.data.openDoors) {
				this.openDoors();
			}
			if (this.canProduce()) {
				this.produce();
			}
			this.model.data.consumedAmount = 0;
			this.model.data.producedGifts += 1;
			this.updateHintContent();
		}
	}

	eat() {
		if (!this.canEat()) {
			return;
		}
		const area = this.grid.getAffectedPositions(this.model.position, 2);
		const consumables = area.reduce((prev, current) => prev.concat(this.chessboard.getVisitors(current, (v) => v._is_sprite && v.type === this.model.data.consumes)), []);
		if (consumables.length > 0) {
			const food = consumables[0];
			while (this.isHungry() && food.data.amount > 0) {
				food.data.amount -= 1;
				this.model.data.consumedAmount += 1;
			}
			if (food.data.amount <= 0) {
				this.level.sprites.remove(food);
			}
		}
	}

	produce() {
		this.level.addSpriteFromStyle(this.grid.getNeighbor(this.model.position, this.model.data.producesAt, 1), this.model.data.produces);
	}

	openDoors() {
		const affectedPositions = this.grid.getAffectedPositions(this.model.position, 10);
		const mouths = this.chessboard.getVisitorsMultiple(affectedPositions, (v) => v._is_sprite && v.strategy.equalsTo(STRATEGY_DOOR_MOUTH));
		mouths.forEach((m) => {
			if (m.data) {
				if (m.data.isOpen !== true) {
					m.triggerEvent('door-open-signal', true);
				}
			}
		});
	}
}
