import SvgRenderer from "./SvgRenderer";
import ImageRenderer from "./ImageRenderer";
import {BEE_CENTER} from "../controller/BeeController";
import AnimationRenderer from "./AnimationRenderer";
import SpriteCollectionRenderer from "./SpriteCollectionRenderer";
import SpriteController from "../controller/SpriteController";
import SpriteRenderer from "./SpriteRenderer";

const DEBUG_BEE = false;

export default class BeeRenderer extends SvgRenderer {
	lastScale;
	dead;
	group;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.lastScale = this.model.scale.get();
		this.dead = false;

		this.svg = this.draw.nested().addClass('bee');
		this.group = this.svg.group();

		this.imageRenderer = new ImageRenderer(game, this.model.image, this.group);
		this.addChild(this.imageRenderer);

		this.crawlingAnimationRenderer = new AnimationRenderer(game, this.model.crawlingAnimation, this.group);
		this.addChild(this.crawlingAnimationRenderer);

		this.starsAnimationRenderer = new AnimationRenderer(game, this.model.starsAnimation, this.group);
		this.addChild(this.starsAnimationRenderer);

		this.leftWingRenderer = new ImageRenderer(game, this.model.leftWing, this.group);
		this.addChild(this.leftWingRenderer);

		this.rightWingRenderer = new ImageRenderer(game, this.model.rightWing, this.group);
		this.addChild(this.rightWingRenderer);

		this.inventoryGroup = this.group.group();
		this.inventoryChangeHandler = () => this.updateInventory();

		this.spritesGroup = this.group.group();
		this.spritesRenderer = new SpriteCollectionRenderer(game, this.model.sprites, this.spritesGroup);
		this.addChild(this.spritesRenderer);

		this.beeStrategyChangedHandler = () => this.updateBeeState();
		this.visibilityChangedHandler = () => this.updateBeeState();

		if (DEBUG_BEE) {
			this.helper = this.group.group();
			this.helper.circle(10).fill('red');
			this.helper.center(BEE_CENTER.x, BEE_CENTER.y);
		}
	}

	activateInternal() {
		this.updateBeeState();
		this.updateFlip();
		this.updateInventory();
		this.model.inventory.addOnChangeListener(this.inventoryChangeHandler);
		this.model.addOnStrategyChangedListener(this.beeStrategyChangedHandler);
		this.model.visible.addOnChangeListener(this.visibilityChangedHandler);
	}

	deactivateInternal() {
		this.model.inventory.removeOnChangeListener(this.inventoryChangeHandler);
		this.model.removeOnStrategyChangedListener(this.beeStrategyChangedHandler);
		this.model.visible.removeOnChangeListener(this.visibilityChangedHandler);
	}

	renderInternal() {
		if (this.model.crawling.isDirty()) {
			this.updateBeeState();
			this.model.crawling.clean();
		}
		if (this.model.coordinates.isDirty()) {
			const coords = this.model.coordinates.subtract(BEE_CENTER);
			this.svg.move(coords.x, coords.y);
			this.model.coordinates.clean();
		}
		if (this.model.scale.isDirty()) {
			const scale = this.model.scale.get() / this.lastScale;
			this.lastScale = this.model.scale.get();
			this.model.scale.clean();
			this.group.scale(scale);
		}
		if (this.model.image.flipped.isDirty()) {
			this.updateFlip();
		}

		if (this.model.starsVisible.get() && !this.starsAnimationRenderer.isActivated()) {
			this.starsAnimationRenderer.activate();
		}
		if (this.starsAnimationRenderer.isActivated() && !this.model.starsVisible.get()) {
			this.starsAnimationRenderer.deactivate();
		}

		if (DEBUG_BEE) this.helper.front();
	}

	updateInventory() {
		if (this.inventoryRenderer) this.removeChild(this.inventoryRenderer);
		if (this.model.inventory.isSet()) {
			this.inventoryRenderer = new ImageRenderer(this.game, this.model.inventory.get().image, this.inventoryGroup);
			this.addChild(this.inventoryRenderer);
			this.inventoryRenderer.activate();
		}
	}

	updateFlip() {
		if (this.model.isFlying() && this.game.beeState.isAlive()) {
			if (this.model.image.flipped.get()) {
				this.leftWingRenderer.group.back();
				this.rightWingRenderer.group.front();
			} else {
				this.leftWingRenderer.group.front();
				this.rightWingRenderer.group.back();
			}
		}
	}

	updateBeeState() {
		this.imageRenderer.deactivate();
		this.crawlingAnimationRenderer.deactivate();
		this.leftWingRenderer.deactivate();
		this.rightWingRenderer.deactivate();

		if (this.model.visible.get() === false) {
			this.starsAnimationRenderer.deactivate();
			return;
		}

		if (this.game.beeState.isDead()) {
			this.starsAnimationRenderer.deactivate();
			this.imageRenderer.activate();
		} else if (this.model.isFlying()) {
			this.imageRenderer.activate();
			this.leftWingRenderer.activate();
			this.rightWingRenderer.activate();
			this.updateFlip();
		} else {
			this.crawlingAnimationRenderer.activate();
		}
		this.spritesGroup.front();
		this.inventoryGroup.front();
	}

}
