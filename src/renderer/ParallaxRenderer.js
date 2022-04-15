import SvgRenderer from "./SvgRenderer";
import ImageRenderer from "./ImageRenderer";
import {SVG} from "@svgdotjs/svg.js";
import {} from "@svgdotjs/svg.filter.js";

export default class ParallaxRenderer extends SvgRenderer {
	gradient;
	filter;

	constructor(game, model, background, foreground) {
		super(game, model, background);

		this.background = background;
		this.foreground = foreground;
		this.fill = null;
		this.filter = null;
	}

	activateInternal() {
		this.gridSize = this.grid.getMaxCoordinates();
		this.center = this.gridSize.multiply(0.5);

		let fill = null;
		if (this.model.backgroundColor !== this.model.backgroundColorEnd) {
			this.gradient = this.background.gradient('linear', (add) => {
				add.stop(0, this.model.backgroundColor);
				add.stop(1, this.model.backgroundColorEnd);
				add.from(0, 0);
				add.to(0, 1);
			});
			fill = this.gradient;
		} else {
			fill = this.model.backgroundColor;
		}
		this.background.rect(this.gridSize.x, this.gridSize.y).fill(fill);

		const parallaxBack = this.background.group().addClass('parallax-back');
		parallaxBack.opacity(0.1);

		this.filter = this.draw.defs().filter();
		this.filter.colorMatrix(
			'matrix',
			[
				0, 0, 1, 0, 0,
				0, 0, 1, 0, 0,
				0, 0, 1, 0, 0,
				.000, .000, .000, 1, 0
			]
		);
		parallaxBack.filterWith(this.filter);

		this.model.layers.children.sort((a, b) => (a.distance > b.distance) ? -1 : ((a.distance < b.distance) ? 1 : 0));

		this.model.layers.forEach((layer) => {
			layer.image.size = this.gridSize;
			const layerRenderer = new ImageRenderer(this.game, layer.image, layer.distance < 0 ? this.foreground : parallaxBack);
			this.addChild(layerRenderer);
			layerRenderer.activate();
		});

	}

	deactivateInternal() {
		if (this.gradient) this.gradient.remove();
		if (this.filter) this.filter.remove();
	}

	renderInternal() {
		this.model.layers.forEach((layer) => {
			const layerOffset = this.model.cameraOffset.multiply(layer.distance);
			const layerCenter = this.center.add(layerOffset);
			layer.image.coordinates.set(layerCenter.x, layerCenter.y);
		});
	}

}
