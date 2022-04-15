import ModelBase from "../class/ModelBase";
import DirtyValue from "../class/DirtyValue";
import ImageModel from "./ImageModel";

export default class AnimationModel extends ModelBase {
	image;
	paths;
	frameRate; //frames per second
	paused;
	repeat;

	constructor(state) {
		super();

		this.image = new ImageModel();
		this.addChild(this.image);
		this.paths = [];
		this.frameRate = new DirtyValue(2);
		this.addChild(this.frameRate);
		this.paused = new DirtyValue(false);
		this.addChild(this.paused);
		this.repeat = new DirtyValue(true);
		this.addChild(this.repeat);

		if (state) {
			this.restoreState(state);
		}
	}

	getState() {
		return {
			image: this.image.getState(),
			paths: this.paths,
			frameRate: this.frameRate.getState(),
			paused: this.paused.getState(),
			repeat: this.repeat.getState()
		}
	}

	restoreState(state) {
		if (state.image) this.image.restoreState(state.image);
		if (state.paths) this.paths = state.paths;
		if (state.frameRate) this.frameRate.restoreState(state.frameRate);
		if (state.paused !== undefined) this.paused.restoreState(state.paused);
		if (state.repeat !== undefined) this.repeat.restoreState(state.repeat);
	}

	setImageModel(image) {
		this.removeChild(this.image);
		this.image = image;
		this.addChild(this.image);
	}
}
