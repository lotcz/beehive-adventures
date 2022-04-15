import SvgRenderer from "./SvgRenderer";
import ImageRenderer from "./ImageRenderer";
import AnimationRenderer from "./AnimationRenderer";

export default class SpriteRenderer extends SvgRenderer {
	constructor(game, model, draw) {
		super(game, model, draw);

		this.attachedSpriteChangedHandler = () => this.updateAttachedSprite();
		this.attachedSpriteRenderer = null;
		this.imageRenderer = null;
		this.group = null;
		this.backGroup = null;
		this.middleGroup = null;
		this.frontGroup = null;
		this.animationRenderer = null;
		if (this.model.animations) {
			this.model.activeAnimation.addOnChangeListener((animation) => this.updateAnimation(animation));
		}
	}

	activateInternal() {
		this.group = this.draw.group();
		this.backGroup = this.group.group();
		this.middleGroup = this.group.group();
		this.frontGroup = this.group.group();

		this.imageRenderer = null;
		if (this.model.image) {
			this.imageRenderer = new ImageRenderer(this.game, this.model.image, this.middleGroup);
			this.addChild(this.imageRenderer);
			this.imageRenderer.activate();
			if (this.model.onClick) {
				this.imageRenderer.setOnClick(this.model.onClick);
			}
		}
		this.updateAttachedSprite();
		this.model.attachedSprite.addOnChangeListener(this.attachedSpriteChangedHandler);

		if (this.model.activeAnimation.isSet() && this.model.animations && this.model.animations.exists(this.model.activeAnimation.get())) {
			this.animationRenderer = new AnimationRenderer(this.game, this.model.animations.get(this.model.activeAnimation.get()), this.middleGroup);
			this.addChild(this.animationRenderer);
			this.animationRenderer.activate();
			if (this.imageRenderer) {
				this.imageRenderer.deactivate();
			}
		}
	}

	deactivateInternal() {
		this.model.attachedSprite.removeOnChangeListener(this.attachedSpriteChangedHandler);
		if (this.group) {
			this.group.remove();
			this.group = null;
		}
		if (this.backGroup) {
			this.backGroup.remove();
			this.backGroup = null;
		}
	}

	updateAttachedSprite() {
		if (this.attachedSpriteRenderer) this.removeChild(this.attachedSpriteRenderer);
		if (this.model.attachedSprite.isSet()) {
			this.attachedSpriteRenderer = new SpriteRenderer(this.game, this.model.attachedSprite.get(), this.model.attachedSpriteBehind ? this.backGroup : this.frontGroup);
			this.addChild(this.attachedSpriteRenderer);
			this.attachedSpriteRenderer.activate();
		}
	}

	updateAnimation(animation) {
		if (this.animationRenderer) {
			this.removeChild(this.animationRenderer);
		}
		if (animation && this.model.animations && this.model.animations.exists(animation)) {
			if (this.imageRenderer) {
				this.imageRenderer.deactivate();
			}
			this.animationRenderer = new AnimationRenderer(this.game, this.model.animations.get(animation), this.middleGroup);
			this.addChild(this.animationRenderer);
			if (this.isActivated()) {
				this.animationRenderer.activate();
			}
		} else {
			if (this.isActivated()) {
				this.imageRenderer.activate();
			}
		}
	}

	updateOuttaSight() {
		if (!this.imageRenderer) return;

		if (!this.imageRenderer.isActivated()) {
			if (this.level.isCoordinateInView(this.model.image.coordinates)) {
				this.imageRenderer.activate();
				if (this.attachedSpriteRenderer) this.attachedSpriteRenderer.activate();
			}
		} else if (this.imageRenderer.isActivated()) {
			if (!this.level.isCoordinateInView(this.model.image.coordinates)) {
				this.imageRenderer.deactivate();
				if (this.attachedSpriteRenderer) this.attachedSpriteRenderer.deactivate();
			}
		}
	}

}
