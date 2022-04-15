import UpdatedStrategy from "../UpdatedStrategy";
import {STRATEGY_DOOR_MOUTH} from "../../../builder/sprites/SpriteStyleBasic";
import Pixies from "../../../class/Pixies";

const MOUTH_TRIGGER_TIMEOUT = 1000;
const MOUTH_TRIGGER_CLOSE_TIMEOUT = 500;
const MOUTH_TRIGGER_DEFAULT_SIZE = 2;

export default class MouthTriggerStrategy extends UpdatedStrategy {
	noticeDistance;
	monitoredPositions;
	affectedPositions;

	/**
	 * @param {GameModel} game
	 * @param {SpriteModel} model
	 * @param {ControlsModel} controls
	 */
	constructor(game, model, controls) {
		super(game, model, controls, MOUTH_TRIGGER_TIMEOUT);

		if (!this.model.data.monitoredRange) {
			this.model.data.monitoredRange = MOUTH_TRIGGER_DEFAULT_SIZE;
		}
		if (!this.model.data.affectedRange) {
			this.model.data.affectedRange = this.model.data.monitoredRange;
		}
		if (!this.model.data.triggeredBy) {
			this.model.data.triggeredBy = [];
		}

		this.noticeDistance = (this.grid.tileRadius.get() * 2) * this.model.data.monitoredRange * 2;
		this.centerCoordinates = this.grid.getCoordinates(this.model.position);
		this.monitoredPositions = this.grid.getAffectedPositions(this.model.position, this.model.data.monitoredRange);
		this.affectedPositions = this.grid.getAffectedPositions(this.model.position, this.model.data.affectedRange);
	}

	updateStrategy() {
		if (this.level.isPlayable && this.level.bee) {
			const distance = this.level.bee.coordinates.distanceTo(this.centerCoordinates);
			if (distance < this.noticeDistance) {
				this.defaultTimeout = MOUTH_TRIGGER_CLOSE_TIMEOUT;
				const food = this.chessboard.getVisitorsMultiple(this.monitoredPositions, (v) => v._is_sprite && this.model.data.triggeredBy.includes(v.type));
				if (food.length > 0) {
					this.triggeredBySprite(food[0]);
					return;
				}
				if (this.monitoredPositions.some((p) => p.equalsTo(this.level.bee.position))) {
					this.triggeredByBee();
				} else {
					this.noTriggerPresent();
				}
			} else {
				this.defaultTimeout = MOUTH_TRIGGER_TIMEOUT;
			}
		}
	}

	sendSignal(open) {
		const mouths = this.chessboard.getVisitorsMultiple(this.affectedPositions, (v) => v._is_sprite && v.strategy.equalsTo(STRATEGY_DOOR_MOUTH));
		Pixies.toUnique(mouths).forEach((m) => {
			if (m.data) {
				if (m.data.isOpen !== open) {
					m.triggerEvent('door-open-signal', open);
				}
			}
		});
	}

	open() {
		this.sendSignal(true);
	}

	close() {
		this.sendSignal(false);
	}

	triggeredByBee() {
		this.close();
	}

	triggeredBySprite(sprite) {
		this.close();
		sprite.triggerOnDeathEvent();
	}

	noTriggerPresent() {
		this.open();
	}

}
