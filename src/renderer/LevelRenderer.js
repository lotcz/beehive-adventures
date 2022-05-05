import SvgRenderer from "./SvgRenderer";
import BeeRenderer from "./BeeRenderer";
import GroundCachedRenderer from "./GroundCachedRenderer";
import SpriteCollectionRenderer from "./SpriteCollectionRenderer";
import ResourceLoader from "../class/ResourceLoader";
import GroundLiveRenderer from "./GroundLiveRenderer";

const DEBUG_LEVEL_RENDERER = false;

export default class LevelRenderer extends SvgRenderer {
	group;

	constructor(game, model, draw, bg) {
		super(game, model, draw);

		this.bg = bg;
		this.groundRenderer = null;

		this.group = this.draw.group();
		this.group.addClass('level');

		// for live ground in edit mode
		this.ground = this.group.group().addClass('ground');

		// SPRITES
		this.sprites = this.group.group().addClass('sprites');
		this.spritesRenderer = new SpriteCollectionRenderer(this.game, this.model.sprites, this.sprites);
		this.addChild(this.spritesRenderer);

		// BEE
		if (this.model.bee) {
			this.beeRenderer = new BeeRenderer(this.game, this.model.bee, this.group);
			this.addChild(this.beeRenderer);
		}

		this.curtain = this.group.group().addClass('curtain');

		this.resourceAddedHandler = (resource) => this.onAddResource(resource);
		this.editModeChangedHandler = () => {
			if (this.isActivated()) {
				this.updateGroundRenderer();
				this.groundRenderer.activate();
			}
		}

		this.clipPath = null;
		this.clipCircle = null;
	}

	activateInternal() {
		if (!this.model.isPlayable) {
			const levelSize = this.model.grid.getMaxCoordinates();
			this.curtainContent = this.curtain.rect(
				levelSize.x,
				levelSize.y
			).fill('black');
			this.maskBg = this.curtain.defs().rect(
				levelSize.x,
				levelSize.y
			).fill('white');
			this.clipPath = this.curtain.mask();
			this.clipPath.add(this.maskBg);
			const text = this.curtain.text(function(add) {
				add.tspan("Beehive").newLine();
				add.tspan("Adventures").newLine();
			}).fill('black');
			const center = levelSize.multiply(0.5);
			text.center(center.x, center.y);
			text.scale(40);
			this.clipPath.add(text);
			this.curtain.maskWith(this.clipPath);
		}

		this.updateGroundRenderer();
		this.groundRenderer.activate();

		this.model.resources.addOnAddListener(this.resourceAddedHandler);
		this.game.isInEditMode.addOnChangeListener(this.editModeChangedHandler);
	}

	deactivateInternal() {
		if (this.group) this.group.remove();
		if (this.groundRenderer) {
			this.removeChild(this.groundRenderer);
			this.groundRenderer = null;
		}
		this.model.resources.removeOnAddListener(this.resourceAddedHandler);
		this.game.isInEditMode.removeOnChangeListener(this.editModeChangedHandler);
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
			//this.groundRenderer.render();

			this.model.viewBoxCoordinates.clean();
			this.model.viewBoxScale.clean();
		}

		if (this.model.clipAmount.isDirty() || this.model.clipCenter.isDirty()) {
			if (this.model.clipAmount.get() > 0 || !this.model.isPlayable) {
				if (this.model.clipAmount.get() > 0) {
					if (!this.clipPath) {
						const levelSize = this.model.grid.getMaxCoordinates();
						this.curtainContent = this.curtain.rect(
							levelSize.x,
							levelSize.y
						).fill('black');
						this.maskBg = this.curtain.rect(
							levelSize.x,
							levelSize.y
						).fill('white');
						this.clipCircle = this.curtain.circle(15).fill('black');
						this.clipPath = this.curtain.mask();
						this.clipPath.add(this.maskBg);
						this.clipPath.add(this.clipCircle);
						this.curtain.maskWith(this.clipPath);
					}
					const diameter = this.model.viewBoxSize.size() * this.model.viewBoxScale.get();
					const radius = diameter * (1 - this.openTween(this.model.clipAmount.get()));
					this.clipCircle.radius(Math.max(radius, 0));
					this.clipCircle.center(this.model.clipCenter.x, this.model.clipCenter.y);
				}
			} else {
				if (this.clipPath) {
					this.curtain.unmask();
					this.clipPath.remove();
					this.clipPath = null;
					this.curtainContent.remove();
					this.curtainContent = null;
					if (this.clipCircle) this.clipCircle.remove();
					this.clipCircle = null;
				}
			}
			this.model.clipAmount.clean();
			this.model.clipCenter.clean();
		}
	}

	updateGroundRenderer() {
		if (this.groundRenderer) {
			this.removeChild(this.groundRenderer);
			this.groundRenderer = null;
		}
		if (this.game.isInEditMode.get()) {
			this.groundRenderer = new GroundLiveRenderer(this.game, this.model.ground,  this.model.parallax, this.ground);
		} else {
			this.groundRenderer = new GroundCachedRenderer(this.game, this.model.ground, this.model.parallax, this.bg);
		}
		this.addChild(this.groundRenderer);
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
