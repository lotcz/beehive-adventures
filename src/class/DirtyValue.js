import ModelBase from "./ModelBase";

export default class DirtyValue extends ModelBase {
	value;

	constructor(value) {
		super();
		this.value = value;
	}

	set(value) {
		if (this.value !== value) {
			this.value = value;
			this.makeDirty();
			this.triggerEvent('change', value);
		}
	}

	get() {
		return this.value;
	}

	isEmpty() {
		return this.value === null || this.value === undefined;
	}

	isSet() {
		return !this.isEmpty();
	}

	getState() {
		return this.get();
	}

	equalsTo(value) {
		return (this.value === value);
	}

	restoreState(state) {
		this.set(state);
	}

	addOnChangeListener(eventHandler) {
		this.addEventListener('change', eventHandler);
	}

	removeOnChangeListener(eventHandler) {
		this.removeEventListener('change', eventHandler);
	}

}
