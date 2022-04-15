import ProgressValue from "./ProgressValue";
import Vector2 from "./Vector2";

export default class ProgressVector2 {
	progressX;
	progressY;

	constructor(start, end, progress = 0) {
		this.progressX = new ProgressValue(start.x, end.x, progress);
		this.progressY = new ProgressValue(start.y, end.y, progress);
	}

	setProgress(progress) {
		this.progressX.progress = progress;
		this.progressY.progress = progress;
	}

	get(progress = null) {
		if (progress !== null) this.setProgress(progress);
		return new Vector2(this.progressX.get(), this.progressY.get());
	}

}
