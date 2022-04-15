import ModelBase from "../class/ModelBase";

export default class CollectionModel extends ModelBase {
	constructor(state, restoreFunc) {
		super();

		if (restoreFunc && state) {
			this.restoreState(state, restoreFunc);
		}
	}

	getState() {
		return this.getChildrenState();
	}

	restoreState(state, restoreFunc) {
		this.reset();
		const children = state.map(restoreFunc);
		children.forEach((ch) => this.add(ch));
	}

	add(element) {
		this.addChild(element);
		this.triggerEvent('add', element);
		return element;
	}

	remove(element) {
		const child = this.removeChild(element);
		if (child) this.triggerEvent('remove', child);
		return child;
	}

	reset() {
		while (this.removeFirst()) {
		}
	}

	count() {
		return this.children.length;
	}

	clone() {
		return new CollectionModel(this.getState(), this.res)
	}

	removeFirst() {
		if (this.count() > 0) {
			return this.remove(this.children[0]);
		}
		return false;
	}

	addOnRemoveListener(listener) {
		this.addEventListener('remove', listener);
	}

	removeOnRemoveListener(listener) {
		this.removeEventListener('remove', listener);
	}

	addOnAddListener(listener) {
		this.addEventListener('add', listener);
	}

	removeOnAddListener(listener) {
		this.removeEventListener('add', listener);
	}

	forEach(func) {
		this.children.forEach(func);
	}

	filter(func) {
		return this.children.filter(func);
	}

}
