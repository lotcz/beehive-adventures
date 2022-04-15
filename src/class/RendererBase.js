import ActivatedTree from "./ActivatedTree";

export default class RendererBase extends ActivatedTree {
	game;
	model;
	level;
	grid;
	chessboard;

	constructor(game, model) {
		super();
		this.game = game;
		this.model = model;

		this.level = game.level.get();
		if (this.level) {
			this.grid = this.level.grid;
			this.chessboard = this.level.grid.chessboard;
		}
	}

	render() {
		if (this.model.isDeleted()) {
			this.setDeleted(true);
			return;
		}

		if (!this.isActivated()) {
			return;
		}

		if (this.isDirty() || this.model.isDirty()) {
			this.renderInternal();
			this.children.forEach((r) => r.render());
			this.clean();
			this.model.clean();
		}
	}

	renderInternal() {

	}

}
