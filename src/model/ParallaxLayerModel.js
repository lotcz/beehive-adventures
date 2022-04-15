import ModelBase from "../class/ModelBase";
import ImageModel from "./ImageModel";

export default class ParallaxLayerModel extends ModelBase {
	distance; // 0 - front, 1 - infinity
	image;

	constructor(state) {
		super();

		this.distance = 0.5;
		this.image = new ImageModel();
		this.addChild(this.image);

		if (state) {
			this.restoreState(state);
		}
	}

	getState() {
		return {
			distance: this.distance,
			image: this.image.getState()
		}
	}

	restoreState(state) {
		if (state.distance)	this.distance = state.distance;
		if (state.image) this.image.restoreState(state.image);
	}

}
