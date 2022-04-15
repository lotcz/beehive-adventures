import ModelBase from "../class/ModelBase";
import LivingTreeModel from "./LivingTreeModel";

export default class PlantModel extends ModelBase {
	roots;
	stem;

	constructor(state) {
		super(state);

		if (state) {
			this.restoreState(state);
		}
	}

	restoreState(state) {
		this.roots = new LivingTreeModel(state.roots);
		this.roots.dirtyParent = this;
		this.stem = new LivingTreeModel(state.stem);
		this.stem.dirtyParent = this;
		this.makeDirty();
		//this.roots.restoreState(state);
		//this.stem.restoreState(state);
	}

	getState() {
		return {
			roots: this.roots.getState(),
			stem: this.stem.getState()
		}
	}

}
