import ControllerBase from "../../class/ControllerBase";

export default class SpriteStrategy extends ControllerBase {
	lastVisited;

	/**
	 * @type SpriteModel
	 */
	model;

	/**
	 *
	 * @param {GameModel} game
	 * @param {SpriteModel} model
	 * @param {ControlsModel=} controls
	 */
	constructor(game, model, controls) {
		super(game, model, controls);

		this.model = model;
		this.lastVisited = null;
	}

	activateInternal() {
		if (!this.level.isValidPosition(this.model.position)) {
			console.warn('Invalid position, removing sprite', this.model);
			this.removeMyself();
			return;
		}
		this.visit(this.model.position);
	}

	deactivateInternal() {
		this.unvisit();
	}

	visit(position) {
		this.unvisit();
		this.lastVisited = position.clone();
		this.chessboard.addVisitor(this.lastVisited, this.model);
	}

	unvisit() {
		if (this.lastVisited) this.chessboard.removeVisitor(this.lastVisited, this.model);
		this.lastVisited = null;
	}

	setPosition(position) {
		this.model.position.set(position);
		if (this.model.attachedSprite.isSet()) {
			this.model.attachedSprite.get().position.set(position);
		}
		this.visit(position);
	}

	removeMyself() {
		this.level.sprites.remove(this.model);
	}
}
