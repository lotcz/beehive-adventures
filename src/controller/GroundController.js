import ControllerBase from "../class/ControllerBase";

const DEBUG_GROUND_CONTROLLER = false;

export default class GroundController extends ControllerBase {
	constructor(game, model, controls) {
		super(game, model, controls);

		this.model.tiles.addOnAddListener((param) => this.addVisitor(param));
		this.model.tiles.addOnRemoveListener((param) => this.removeVisitor(param));
	}

	addVisitor(tile) {
		this.chessboard.addVisitor(tile.position, tile);
	}

	removeVisitor(tile) {
		this.chessboard.removeVisitor(tile.position, tile);
	}

	activateInternal() {
		this.model.tiles.forEach((tile) => this.addVisitor(tile));
		if (DEBUG_GROUND_CONTROLLER) console.log('Ground controller activated.');
	}

	deactivateInternal() {
		this.model.tiles.forEach((tile) => this.removeVisitor(tile));
		if (DEBUG_GROUND_CONTROLLER) console.log('Ground controller deactivated.');
	}

}
