import SvgRenderer from "./SvgRenderer";
import ImageRenderer from "./ImageRenderer";

export default class AnimationRenderer extends SvgRenderer {
	imageRenderer;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.imageRenderer = new ImageRenderer(this.game, this.model.image, this.draw);
		this.addChild(this.imageRenderer);

	}

}
