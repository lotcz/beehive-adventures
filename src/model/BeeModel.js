import ImageModel from "./ImageModel";
import ModelBase from "../class/ModelBase";
import Vector2 from "../class/Vector2";
import CollectionModel from "./CollectionModel";
import DirtyValue from "../class/DirtyValue";
import RotationValue from "../class/RotationValue";
import AnimationModel from "./AnimationModel";
import SpriteModel from "./SpriteModel";

export default class BeeModel extends ModelBase {
	scale;
	position;
	coordinates;
	direction; // vector of movement
	rotation;
	crawling; // null or neighbor type
	headingLeft; // if false, then bee is heading right
	inventory;
	sprites;
	image;
	deadImagePath;
	crawlingAnimation;
	starsAnimation;
	leftWing;
	rightWing;

	constructor(state) {
		super();

		this.scale = new DirtyValue(1);
		this.addChild(this.scale);
		this.position = new Vector2();
		this.addChild(this.position);
		this.coordinates = new Vector2();
		this.addChild(this.coordinates);
		this.direction = new Vector2();
		this.addChild(this.direction);
		this.rotation = new RotationValue(0);
		this.addChild(this.rotation);
		this.crawling = new DirtyValue(null);
		this.addChild(this.crawling);
		this.headingLeft = new DirtyValue(false);
		this.addChild(this.headingLeft);
		this.inventory = new DirtyValue();
		this.addChild(this.inventory);
		this.sprites = new CollectionModel();
		this.addChild(this.sprites);
		this.image = new ImageModel();
		this.addChild(this.image);
		this.deadImagePath = new DirtyValue();
		this.addChild(this.deadImagePath);
		this.crawlingAnimation = new AnimationModel();
		this.addChild(this.crawlingAnimation);
		this.starsAnimation = new AnimationModel();
		this.addChild(this.starsAnimation);
		this.leftWing = new ImageModel();
		this.addChild(this.leftWing);
		this.rightWing = new ImageModel();
		this.addChild(this.rightWing);
		this.starsVisible = new DirtyValue(false);
		this.addChild(this.starsVisible);
		this.held = new DirtyValue(false);
		this.addChild(this.held);
		this.visible = new DirtyValue(true);
		this.addChild(this.visible);

		if (state) {
			this.restoreState(state);
		}
	}

	getState() {
		return {
			scale: this.scale.getState(),
			position: this.position.getState(),
			direction: this.direction.getState(),
			rotation: this.rotation.getState(),
			crawling: this.crawling.getState(),
			headingLeft: this.headingLeft.getState(),
			inventory: this.inventory.isEmpty() ? null : this.inventory.get().getState(),
			sprites: this.sprites.getState(),
			image: this.image.getState(),
			deadImagePath: this.deadImagePath.getState(),
			crawlingAnimation: this.crawlingAnimation.getState(),
			starsAnimation: this.starsAnimation.getState(),
			leftWing: this.leftWing.getState(),
			rightWing: this.rightWing.getState()
		}
	}

	restoreState(state) {
		if (state.scale) this.scale.restoreState(state.scale);
		if (state.position) this.position.restoreState(state.position);
		if (state.direction) this.direction.restoreState(state.direction);
		if (state.rotation) this.rotation.restoreState(state.rotation);
		if (state.crawling) this.crawling.restoreState(state.crawling);
		if (state.headingLeft) this.headingLeft.restoreState(state.headingLeft);
		if (state.inventory) this.inventory.set(new SpriteModel(state.inventory));
		if (state.sprites) this.sprites.restoreState(state.sprites, (s) => new SpriteModel(s));
		if (state.image) this.image.restoreState(state.image);
		if (state.deadImagePath) this.deadImagePath.restoreState(state.deadImagePath);
		if (state.crawlingAnimation) this.crawlingAnimation.restoreState(state.crawlingAnimation);
		if (state.starsAnimation) this.starsAnimation.restoreState(state.starsAnimation);
		if (state.leftWing) this.leftWing.restoreState(state.leftWing);
		if (state.rightWing) this.rightWing.restoreState(state.rightWing);
	}

	isFlying() {
		return this.crawling.isEmpty();
	}

	isCrawling() {
		return !this.isFlying();
	}

	addOnStrategyChangedListener(listener) {
		this.addEventListener('strategy-changed', listener);
	}

	removeOnStrategyChangedListener(listener) {
		this.removeEventListener('strategy-changed', listener);
	}

	triggerOnStrategyChangedEvent() {
		this.triggerEvent('strategy-changed');
	}

	addOnDeathListener(listener) {
		this.addEventListener('death', listener);
	}

	removeOnDeathListener(listener) {
		this.removeEventListener('death', listener);
	}

	triggerOnDeathEvent() {
		this.triggerEvent('death');
	}

	addOnTravelListener(listener) {
		this.addEventListener('travel', listener);
	}

	removeOnTravelListener(listener) {
		this.removeEventListener('travel', listener);
	}

	triggerOnTravelEvent(levelName) {
		this.triggerEvent('travel', levelName);
	}

	addOnPushedListener(listener) {
		this.addEventListener('bee-pushed', listener);
	}

	removeOnPushedListener(listener) {
		this.removeEventListener('bee-pushed', listener);
	}

	triggerOnPushedEvent(param) {
		this.triggerEvent('bee-pushed', param);
	}

}
