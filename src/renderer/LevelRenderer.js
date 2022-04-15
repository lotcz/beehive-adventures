import SvgRenderer from "./SvgRenderer";
import BeeRenderer from "./BeeRenderer";
import GroundRenderer from "./GroundRenderer";
import SpriteCollectionRenderer from "./SpriteCollectionRenderer";
import ParallaxRenderer from "./ParallaxRenderer";
import ResourceLoader from "../class/ResourceLoader";

export const HIDE_WHEN_OUTTA_SIGHT = false;
const DEBUG_LEVEL_RENDERER = false;

export default class LevelRenderer extends SvgRenderer {
	group;

	constructor(game, model, draw, bg) {
		super(game, model, draw);

		this.bg = bg;
		this.groundRenderer = new GroundRenderer(this.game, this.model.ground, this.model.parallax, this.bg);

		this.group = this.draw.group();
		this.group.addClass('level');

		// SPRITES
		this.sprites = this.group.group().addClass('sprites');
		this.spritesRenderer = new SpriteCollectionRenderer(this.game, this.model.sprites, this.sprites);
		this.addChild(this.spritesRenderer);

		// BEE
		if (this.model.bee) {
			this.beeRenderer = new BeeRenderer(this.game, this.model.bee, this.group);
			this.addChild(this.beeRenderer);
		}

		this.model.resources.addOnAddListener((resource) => this.onAddResource(resource));

		this.clipPath = null;
		this.clipCircle = null;
	}

	activateInternal() {
		if (!this.model.isPlayable) {
			const text = this.draw.defs().text(function(add) {
				add.tspan("Beehive").newLine();
				add.tspan("Adventures").newLine();
			}).fill('#fff');
			const center = this.model.grid.getMaxCoordinates().multiply(0.5);
			text.center(center.x, center.y);
			text.scale(40);
			//const path = text.path('M 100 200 C 200 100 300 0 400 100 C 500 200 600 300 700 200 C 800 100 900 100 900 100');

			const clipPath = this.draw.clip().add(text);
			this.group.clipWith(clipPath);
		}
		this.groundRenderer.activate();
	}

	deactivateInternal() {
		if (this.group) this.group.remove();
		this.groundRenderer.deactivate();
	}

	renderInternal() {
		if (this.beeRenderer && this.beeRenderer.isDeleted()) {
			this.removeChild(this.beeRenderer);
			this.beeRenderer = new BeeRenderer(this.game, this.model.bee, this.group);
			this.addChild(this.beeRenderer);
		}

		if (this.model.viewBoxSize.isDirty() || this.model.viewBoxCoordinates.isDirty() || this.model.viewBoxScale.isDirty()) {
			this.draw.size(this.model.viewBoxSize.x, this.model.viewBoxSize.y);
			this.draw.viewbox(
				this.model.viewBoxCoordinates.x,
				this.model.viewBoxCoordinates.y,
				this.model.viewBoxSize.x * this.model.viewBoxScale.get(),
				this.model.viewBoxSize.y * this.model.viewBoxScale.get()
			);
			this.groundRenderer.render();
			this.model.viewBoxCoordinates.clean();
			this.model.viewBoxScale.clean();
		}

		if (this.model.clipAmount.isDirty() || this.model.clipCenter.isDirty()) {
			if (this.model.clipAmount.get() > 0) {
				if (!this.clipPath) {
					this.clipCircle = this.draw.circle(150);
					this.clipPath = this.draw.clip().add(this.clipCircle);
					this.group.clipWith(this.clipPath);
				}
				const diameter = this.model.viewBoxSize.size();
				const radius = (diameter * this.model.viewBoxScale.get()) * (1 - this.openTween(this.model.clipAmount.get()));
				this.clipCircle.radius(Math.max(radius, 0));
				this.clipCircle.center(this.model.clipCenter.x, this.model.clipCenter.y);
			} else {
				if (this.clipPath) {
					this.group.unclip();
					this.clipPath.remove();
					this.clipPath = null;
					this.clipCircle = null;
				}
			}
			this.model.clipAmount.clean();
			this.model.clipCenter.clean();
		}
	}

	openTween(value) {
		const boundary1 = 0.3;
		const boundary2 = 0.7;
		const staticValue = 0.9;
		if (value < boundary1) {
			return staticValue * (value / boundary1);
		} else if (value < boundary2) {
			return staticValue;
		} else {
			return staticValue + ((value - boundary2) / (1 - boundary2));
		}
	}

	onAddResource(resource) {
		if (DEBUG_LEVEL_RENDERER) console.log('Resource added.', resource);
		const loader = new ResourceLoader(this.game.resources, this.draw, resource);
		loader.load((r) => {
			if (DEBUG_LEVEL_RENDERER) console.log('Resource loaded', r);
		});
	}

}
