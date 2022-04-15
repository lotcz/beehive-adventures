import ProgressValue from "./ProgressValue";
import Pixies from "./Pixies";

export default class AnimatedValue {
	progressValue;
	duration;
	elapsed;

	constructor(start, end, duration, elapsed = 0) {
		this.progressValue = new ProgressValue(start, end);
		this.duration = duration;
		this.elapsed = elapsed;
		this.updateProgress();
	}

	addElapsed(delta) {
		this.elapsed += delta;
		this.updateProgress();
	}

	updateProgress() {
		this.progressValue.progress = Pixies.between(0, 1, this.elapsed / this.duration);
	}

	get(delta = null) {
		if (delta !== null) this.addElapsed(delta);
		return this.progressValue.get();
	}

	isFinished() {
		return (this.elapsed >= this.duration);
	}

}
