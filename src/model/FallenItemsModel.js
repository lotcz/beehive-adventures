import HashTableModel from "./HashTableModel";
import CollectionModel from "./CollectionModel";
import SpriteModel from "./SpriteModel";

export default class FallenItemsModel extends HashTableModel {

	restoreState(state) {
		super.restoreState(state, (state) => new HashTableModel(state, (list) => new CollectionModel(list, (sprite) => new SpriteModel(sprite))));
	}

	getByLevel(levelName) {
		if (!this.exists(levelName)) {
			this.set(levelName, new HashTableModel());
		}
		return this.get(levelName);
	}

	addFallenItem(fromLevel, toLevel, item) {
		const items = this.getByLevel(toLevel);
		if (!items.exists(fromLevel)) {
			items.set(fromLevel, new CollectionModel());
		}
		items.get(fromLevel).add(item);
	}

	flush(levelName) {
		const items = this.getByLevel(levelName);
		this.set(levelName, new HashTableModel());
		return items;
	}

}

