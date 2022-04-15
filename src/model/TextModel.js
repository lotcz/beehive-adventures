import ModelBase from "../class/ModelBase";
import DirtyValue from "../class/DirtyValue";

export default class TextModel extends ModelBase {
	label;

	constructor(state) {
		super();

		this.label = new DirtyValue('');
		this.addChild(this.label);

		if (state) {
			this.restoreState(state);
		}
	}

	restoreState(state) {
		this.label.set(state.label);
	}

	getState() {
		return {
			label: this.label.get()
		}
	}

}
