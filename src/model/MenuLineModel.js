import ModelBase from "../class/ModelBase";
import DirtyValue from "../class/DirtyValue";
import TextModel from "./TextModel";

export default class MenuLineModel extends ModelBase {
	text;
	onClick;

	constructor(state) {
		super();

		this.text = new TextModel();
		this.addChild(this.text);
		this.onClick = new DirtyValue(null);
		this.addChild(this.onClick);

		if (state) {
			this.restoreState(state);
		}
	}

	restoreState(state) {
		this.text.restoreState(state.text);
		this.onClick.set(state.onClick);
		this.makeDirty();
	}

	getState() {
		return {
			text: this.text.getState(),
			onClick: this.onClick.get()
		}
	}

}
