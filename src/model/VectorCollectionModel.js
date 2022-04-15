import CollectionModel from "./CollectionModel";
import Vector2 from "../class/Vector2";

export default class VectorCollectionModel extends CollectionModel {
	isUnique;

	constructor(state) {
		super();

		this.isUnique = true;

		if (state) {
			this.restoreState(state);
		}
	}

	restoreState(state) {
		const children = state.map((s) => Vector2.fromArray(s));
		children.forEach((ch) => this.add(ch));
	}

	find(x, y) {
		return this.children.find((v) => v.x === x && v.y === y);
	}

	exists(x, y) {
		return this.find(x, y) !== undefined;
	}

	add(v) {
		if (this.isUnique) {
			if (this.exists(v.x, v.y)) {
				return null;
			}
		}
		return super.add(v);
	}

}
