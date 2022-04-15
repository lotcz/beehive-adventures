import AnimatedStrategy from "../AnimatedStrategy";
import DrJonesSound from "../../../../res/sound/door-open.mp3";
import Sound from "../../../class/Sound";
import {STRATEGY_DOOR_MOUTH} from "../../../builder/sprites/SpriteStyleBasic";

const DOOR_TIMEOUT = 1000;

export default class DoorSlotStrategy extends AnimatedStrategy {
	static drJonesSound = new Sound(DrJonesSound);

	constructor(game, model, controls) {
		super(game, model, controls, DOOR_TIMEOUT);
	}

	updateStrategy() {
		const keys = this.chessboard.getVisitors(this.model.position, (v) => v._is_sprite && v.type === this.model.data.key);
		if (keys.length > 0) {
			DoorSlotStrategy.drJonesSound.play();

			const affected = this.grid.getAffectedPositions(this.model.position, this.model.data.size);
			affected.forEach(
				(position) => {
					const doors = this.chessboard.getVisitors(position, (v) => v._is_ground && v.type === this.model.data.door);
					if (doors.length > 0) {
						doors.forEach((d) => this.level.ground.removeTile(d));
						if (this.model.data.replaceWith) {
							this.level.addGroundTileFromStyle(position, this.model.data.replaceWith);
						}
					}
					const mouths = this.chessboard.getVisitorsMultiple(affected, (v) => v._is_sprite && v.strategy.equalsTo(STRATEGY_DOOR_MOUTH));
					mouths.forEach((m) => {
						if (m.data) {
							if (!m.data.isOpen) {
								m.triggerEvent('door-open-signal', true);
							}
						}
					});
				}
			);

			keys.forEach((v) => this.level.sprites.remove(v));
			this.level.sprites.remove(this.model);
		}
	}

}
