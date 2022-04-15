import ActivatedTree from "./ActivatedTree";

export default class Timeout extends ActivatedTree {
	time;
	onFinished;

	constructor(interval, onFinished) {
		super();
		this.time = interval;
		this.onFinished = onFinished;
	}

	update(delta) {
		this.time -= delta;
		if (this.time <= 0) {
			console.log('tie out');
			if (this.onFinished) {
				this.onFinished();
			}
			if (this.parent) {
				this.parent.removeChild(this);
			}
		}
	}

}
