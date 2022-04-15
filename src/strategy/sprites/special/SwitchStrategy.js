import AnimatedStrategy from "../AnimatedStrategy";
import {STRATEGY_DOOR_MOUTH} from "../../../builder/sprites/SpriteStyleBasic";
import Pixies from "../../../class/Pixies";

const SWITCH_TIMEOUT = 99000;
const DEFAULT_SWITCH_RANGE = 3;

export default class SwitchStrategy extends AnimatedStrategy {
	on;
	range;
	affectedPositions;

	constructor(game, model, controls) {
		super(game, model, controls, SWITCH_TIMEOUT);

		this.level.addResource(this.model.data.imageOn);
		this.level.addResource(this.model.data.imageOff);

		if (this.model.data.controlDoors === undefined) {
			this.model.data.controlDoors = true;
		}
		if (this.model.data.on === undefined) {
			this.model.data.on = false;
		}
		if (this.model.data.range === undefined) {
			this.model.data.range = DEFAULT_SWITCH_RANGE;
		}
		this.affectedPositions = this.grid.getAffectedPositions(this.model.position, this.model.data.range);
		this.on = this.model.data.on;
		this.updateImage();
	}

	updateInternal(delta) {
		if (this.on !== this.model.data.on) {
			this.on = this.model.data.on;
			this.updateImage();
			if (this.model.data.controlDoors) {
				const mouths = this.chessboard.getVisitorsMultiple(this.affectedPositions, (v) => v._is_sprite && v.strategy.equalsTo(STRATEGY_DOOR_MOUTH));
				Pixies.toUnique(mouths).forEach((m) => {
					if (m.data) {
						m.triggerEvent('door-open-signal', !m.data.isOpen);
					}
				});
			}
		}
	}

	updateImage() {
		const path = this.on ? this.model.data.imageOn : this.model.data.imageOff;
		this.model.image.path.set(path);
	}

}
