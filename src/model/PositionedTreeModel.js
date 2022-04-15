import ModelBase from "../class/ModelBase";
import Vector2 from "../class/Vector2";

export default class PositionedTreeModel extends ModelBase {
	position;

	constructor(state) {
		super();

		if (state) {
			this.restoreState(state);
		}
	}

	findNodeOnPos(position) {
		if (this.position.equalsTo(position)) return this;
		for (let i = 0, max = this.children.length; i < max; i++) {
			let result = this.children[i].findNodeOnPos(position);
			if (result) return result;
		}
		return null;
	}

	findNodesCloseTo(position, distance) {
		let result = [];
		if (this.position.distanceTo(position) < distance) result.push(this);
		for (let i = 0, max = this.children.length; i < max; i++) {
			let results = this.children[i].findNodesCloseTo(position, distance);
			if (results.length > 0)	result = result.concat(results);
		}
		return result;
	}

	nodeExists(position) {
		return this.findNodeOnPos(position) !== null;
	}

	restoreState(state) {
		this.position = Vector2.fromArray(state.position);
		if (state.children) {
			this.restoreChildren(state.children, (childState) => new PositionedTreeModel(childState));
		}
	}

	getState() {
		return {
			position: this.position.toArray(),
			children: this.getChildrenState()
		}
	}

}
