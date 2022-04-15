import Tree from "./Tree";

export default class ActivatedTree extends Tree {
	activated;

	constructor(activated = false) {
		super();
		this.activated = activated;
	}

	isActivated() {
		return this.activated;
	}

	activate() {
		if (!this.isActivated()) {
			this.children.forEach((c) => c.activate());
			this.activateInternal();
			this.activated = true;
			this.makeDirty();
		}
	}

	activateInternal() {

	}

	deactivate() {
		if (this.isActivated()) {
			this.children.forEach((c) => c.deactivate());
			this.activated = false;
			this.deactivateInternal();
		}
	}

	deactivateInternal() {

	}

	removeChild(node) {
		node.deactivate();
		return super.removeChild(node);
	}

}
