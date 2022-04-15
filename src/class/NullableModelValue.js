import DirtyValue from "./DirtyValue";

export default class NullableModelValue extends DirtyValue {
	model;

	set(model) {
		super.set(model);
		if (this.model) {
			this.model.dirtyParent = this.model.parent;
		}
		this.model = model;
		if (this.model) {
			this.model.dirtyParent = this;
		}
	}

}
