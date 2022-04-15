export default class Dirty {
	is_dirty;

	constructor(isDirty = true) {
		this.is_dirty = isDirty;
	}

	makeDirty() {
		this.is_dirty = true;
	}

	clean() {
		this.is_dirty = false;
	}

	isDirty() {
		return this.is_dirty;
	}

}
