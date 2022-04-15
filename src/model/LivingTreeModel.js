import Vector2 from "../class/Vector2";
import PositionedTreeModel from "./PositionedTreeModel";

export default class LivingTreeModel extends PositionedTreeModel {
	power;
	_is_plant;

	constructor(state) {
		super();

		if (state) {
			this.restoreState(state);
		}

		// for visitor to be recognized as plant
		this._is_plant = true;
	}

	powerUpdateRequested() {
		const root = this.findRoot();
		root.updatePower();
	}

	updatePower() {
		let power = 1;
		for (let i = 0, max = this.children.length; i < max; i++) {
			const child = this.children[i];
			child.updatePower();
			power += child.power;
		}
		if (this.power !== power) {
			this.power = power;
			this.makeDirty();
		}
	}

	addChild(node) {
		super.addChild(node);
		this.children = this.children.sort((a, b) => a.position.x - b.position.x);
		this.powerUpdateRequested();
		return node;
	}

	restoreState(state) {
		this.position = Vector2.fromArray(state.position);
		this.power = state.power;
		if (state.children) {
			this.restoreChildren(state.children, (childState) => new LivingTreeModel(childState));
		}
	}

	getState() {
		return {
			position: this.position.toArray(),
			power: this.power,
			children: this.getChildrenState()
		}
	}

}
