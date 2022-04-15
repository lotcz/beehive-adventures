import ModelBase from "../class/ModelBase";
import CollectionModel from "./CollectionModel";
import GroundTileModel from "./GroundTileModel";

export default class GroundModel extends ModelBase {
	tiles;

	constructor(state) {
		super();

		this.tiles = new CollectionModel();
		this.addChild(this.tiles);
		this.tileRestoreFunc = (s) => new GroundTileModel(s);

		if (state) {
			this.restoreState(state);
		}
	}

	restoreState(state) {
		this.tiles.reset();
		if (state.tiles) {
			this.tiles.restoreState(state.tiles, this.tileRestoreFunc);
		}
	}

	addTile(state) {
		this.tiles.add(this.tileRestoreFunc(state));
	}

	removeTile(tile) {
		this.tiles.remove(tile);
	}

	getState() {
		return {
			tiles: this.tiles.getState()
		}
	}

}
