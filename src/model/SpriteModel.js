import ModelBase from "../class/ModelBase";
import ImageModel from "./ImageModel";
import DirtyValue from "../class/DirtyValue";
import Vector2 from "../class/Vector2";
import Pixies from "../class/Pixies";
import NullableModelValue from "../class/NullableModelValue";
import {SPRITE_STYLES_BEES} from "../builder/sprites/SpriteStyleBees";
import {SPRITE_STYLES} from "../builder/SpriteStyle";
import CollectionModel from "./CollectionModel";
import HashTableModel from "./HashTableModel";
import AnimationModel from "./AnimationModel";

const DEFAULT_ANIMATION_FRAME_RATE = 2;

export default class SpriteModel extends ModelBase {
	/**
	 * @type Vector2
	 */
	position;

	/**
	 * @type ImageModel
	 */
	image;

	/**
	 * @type NullableModelValue
	 */
	attachedSprite;

	/**
	 * @type DirtyValue
	 */
	strategy;

	data;
	type;

	/**
	 * @type HashTableModel
	 */
	animations;

	_is_sprite;
	_is_penetrable;
	_is_crawlable;
	onClick;

	constructor(state) {
		super();

		// for visitor to be recognized as sprite
		this._is_sprite = true;
		this._is_penetrable = true;
		this._is_crawlable = false;

		this.image = null;

		this.attachedSprite = new NullableModelValue(null);
		this.addChild(this.attachedSprite);
		this.attachedSpriteBehind = false;

		this.position = new Vector2();
		this.addChild(this.position);
		this.strategy = new DirtyValue();
		this.addChild(this.strategy);

		this.animations = null;
		this.activeAnimation = new DirtyValue();
		this.addChild(this.activeAnimation);

		this.type = '';
		this.data = {};

		if (state) {
			this.restoreState(state);
		}

	}

	getState() {
		//this.data.penetrable = this._is_penetrable;
		return {
			position: this.position.toArray(),
			image: (this.image) ? this.image.getState() : null,
			attachedSprite: (this.attachedSprite.isSet()) ? this.attachedSprite.get().getState() : null,
			strategy: this.strategy.get(),
			data: Pixies.clone(this.data),
			type: this.type,
			activeAnimation: this.activeAnimation.getState()
		}
	}

	restoreState(state) {
		if (state.position) this.position.restoreState(state.position);
		if (state.image) {
			if (this.image) this.removeChild(this.image);
			this.image = new ImageModel(state.image);
			this.addChild(this.image);
		}
		if (state.attachedSprite) {
			this.attachedSprite.set(new SpriteModel(state.attachedSprite));
		}
		if (state.strategy) this.strategy.restoreState(state.strategy);
		if (state.data) this.data = state.data;
		if (this.data.penetrable !== undefined) this._is_penetrable = this.data.penetrable;
		if (this.data.crawlable !== undefined) this._is_crawlable = this.data.crawlable;
		if (state.type) this.type = state.type;
		const style = SPRITE_STYLES[state.type];
		if (style && style.animations) {
			this.animations = new HashTableModel(
				style.animations,
				(animation) => new AnimationModel(
					{
						image: {path: animation[0].uri},
						paths: animation.map((img) => img.uri),
						frameRate: animation[0].frameRate || DEFAULT_ANIMATION_FRAME_RATE,
						repeat: animation[0].repeat === undefined ? true : animation[0].repeat
					})
			);
			this.addChild(this.animations);
		}
		if (state.activeAnimation) this.activeAnimation.restoreState(state.activeAnimation);
	}

	clone() {
		const state = this.getState();
		const sprite = new SpriteModel(state);
		sprite.isPersistent = this.isPersistent;
		sprite._is_penetrable = this._is_penetrable;
		sprite._is_crawlable = this._is_crawlable;
		return sprite;
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

}
