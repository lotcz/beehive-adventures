import ControllerBase from "../class/ControllerBase";
import SpriteModel from "../model/SpriteModel";
import Sound from "../class/Sound";
import AhaSound from "../../res/sound/a-ha.mp3";
import AnimationController from "./AnimationController";
import AnimationModel from "../model/AnimationModel";
import {IMAGE_HINT_BACKGROUND, SPRITE_TYPE_HINT, STRATEGY_HINT} from "../builder/sprites/SpriteStyleHints";

export default class HintController extends ControllerBase {
	static ahaSound = new Sound(AhaSound);
	background;
	hint;
	delayedHideTimer;
	sprites;
	soundPlayed;

	/**
	 * @type HintModel
	 */
	model;

	constructor(game, model, controls, sprites = null) {
		super(game, model, controls);

		this.model = model;
		this.background = [];
		this.hint = null;
		this.sprites = sprites || this.level.sprites;
		this.delayedHideTimer = null;
		this.soundPlayed = false;
		this.delayedHideHandler = () => this.handleDelayedHide();
		this.hiddenHandler = () => this.destroy();
	}

	show() {
		this.clearHideTimer();
		if (!this.isInitialized()) {
			this.initialize();
		} else if (this.hint.data.isHiding) {
			this.background.forEach((b) => b.data.isHiding = false);
			this.hint.data.isHiding = false;
		}
	}

	hide() {
		if (this.isInitialized() && (this.delayedHideTimer === null)) {
			this.setHideTimer();
		}
		//this.clearHideTimer();
	}

	isInitialized() {
		return this.hint !== null;
	}

	initialize() {
		this.destroy();
		let position = this.model.position.clone();
		for (let i = 1; i <= this.model.size; i++) {
			position = this.grid.getNeighbor(position, this.model.direction);
			const sprite = this.addSprite(this.model.position, {targetScale: (i / this.model.size), targetPosition: position, isHiding: false, }, IMAGE_HINT_BACKGROUND, 0.01);
			sprite.isPersistent = false;
			this.background.push(sprite);
		}
		position = this.grid.getNeighbor(position, this.model.direction, this.model.size + 1);
		const positions = this.grid.getAffectedPositions(position, this.model.size);
		for (let i = 0, max = positions.length; i < max; i++) {
			const sprite = this.addSprite(this.model.position, {targetScale: 2, targetPosition: positions[i], isHiding: false}, IMAGE_HINT_BACKGROUND, 0.5);
			this.background.push(sprite);
		}
		const defaultImage = this.model.imagePaths[0];
		this.hint = this.addSprite(this.model.position, {targetScale: 2, targetPosition: position, isHiding: false}, defaultImage, 0.3);
		if (this.model.imagePaths.length > 1) {
			this.model.imagePaths.forEach((path) => this.level.addResource(path));
			const anim = new AnimationModel({paths: this.model.imagePaths, frameRate: this.model.frameRate});
			anim.image = this.hint.image;
			const animationController = new AnimationController(this.game, anim, this.controls);
			this.addChild(animationController);
			animationController.activate();
		}

		this.hint.addEventListener('hidden', this.hiddenHandler);
	}

	destroy() {
		this.resetChildren();
		this.background.forEach((b) => this.sprites.remove(b));
		this.background = [];
		if (this.hint) {
			this.sprites.remove(this.hint);
			this.hint.removeEventListener('hidden', this.hiddenHandler);
			this.hint = null;
		}
		this.clearHideTimer();
		this.soundPlayed = false;
	}

	setHideTimer() {
		this.clearHideTimer();
		if (!this.soundPlayed) {
			this.delayedHideTimer = setTimeout(this.delayedHideHandler, 1000);
		}
	}

	clearHideTimer() {
		if (this.delayedHideTimer) {
			clearTimeout(this.delayedHideTimer);
			this.delayedHideTimer = null;
		}
	}

	handleDelayedHide() {
		this.background.forEach((b) => b.data.isHiding = true);
		this.hint.data.isHiding = true;
		this.playAhaSound();
	}

	playAhaSound() {
		if (!this.soundPlayed) {
			HintController.ahaSound.play();
			this.soundPlayed = true;
		}
	}

	addSprite(position, data, imagePath, scale) {
		if (imagePath) {
			this.level.addResource(imagePath);
		}
		const state = {
			position: position.toArray(),
			image: (imagePath) ? {
				scale: scale,
				path: imagePath
			} : null,
			strategy: STRATEGY_HINT,
			data: data,
			type: SPRITE_TYPE_HINT
		};
		const sprite = new SpriteModel(state);
		this.sprites.add(sprite);
		sprite.isPersistent = false;
		return sprite;
	}

}
