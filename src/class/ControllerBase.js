import ActivatedTree from "./ActivatedTree";

export default class ControllerBase extends ActivatedTree {
	/**
	 * @type GameModel
	 */
	game;

	/**
	 * @type ModelBase
	 */
	model;

	/**
	 * @type ControlsModel
	 */
	controls;

	/**
	 * @type LevelModel
	 */
	level;

	/**
	 * @type GridModel
	 */
	grid;

	/**
	 * @type Chessboard
	 */
	chessboard;

	/**
	 * @param {GameModel} game
	 * @param {SpriteModel} model
	 * @param {ControlsModel=} controls
	 */
	constructor(game, model, controls = null) {
		super();
		this.game = game;
		this.model = model;
		this.controls = controls || game.controls;

		this.level = game.level.get();
		if (this.level) {
			this.grid = this.level.grid;
			this.chessboard = this.level.grid.chessboard;
		}
	}

	/**
	 * @param {number} delta - in millisecs
	 */
	update(delta) {
		if (this.model.isDeleted()) {
			this.setDeleted(true);
			console.log('model deleted!', this.model);
			return;
		}

		if (!this.isActivated()) {
			return;
		}

		this.children.forEach((c) => c.update(delta));
		this.updateInternal(delta);
	}

	/**
	 * @param {number} delta - in millisecs
	 */
	updateInternal(delta) {

	}

}
