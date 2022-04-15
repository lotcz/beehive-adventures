import ControllerBase from "../class/ControllerBase";
import BugStrategy from "../strategy/sprites/animals/BugStrategy";
import FlyingBugStrategy from "../strategy/sprites/animals/FlyingBugStrategy";
import StaticStrategy from "../strategy/sprites/StaticStrategy";
import WaterStrategy from "../strategy/sprites/minerals/WaterStrategy";
import MineralStrategy from "../strategy/sprites/minerals/MineralStrategy";
import ExitStrategy from "../strategy/sprites/special/ExitStrategy";
import EmitterStrategy from "../strategy/sprites/special/EmitterStrategy";
import BubbleStrategy from "../strategy/sprites/minerals/BubbleStrategy";
import JellyMakerStrategy from "../strategy/sprites/animals/JellyMakerStrategy";
import HintStrategy from "../strategy/sprites/special/HintStrategy";
import DoorSlotStrategy from "../strategy/sprites/special/DoorSlotStrategy";
import EmptyStrategy from "../strategy/sprites/EmptyStrategy";
import ObjectStrategy from "../strategy/sprites/ObjectStrategy";
import BeeQueenStrategy from "../strategy/sprites/animals/BeeQueenStrategy";
import {
	STRATEGY_DOOR_MOUTH,
	STRATEGY_DOOR_MOUTH_TRIGGER,
	STRATEGY_EMITTER,
	STRATEGY_EMPTY, STRATEGY_FRIEND,
	STRATEGY_JELLY_MAKER, STRATEGY_LARVA,
	STRATEGY_OBJECT,
	STRATEGY_STATIC,
	STRATEGY_FLYING_BUG
} from "../builder/sprites/SpriteStyleBasic";
import {
	STRATEGY_ANT, STRATEGY_BAIT,
	STRATEGY_BUG, STRATEGY_CARNI_PLANT, STRATEGY_GRASSHOPPER, STRATEGY_SNAIL,
	STRATEGY_TOAD
} from "../builder/sprites/SpriteStyleAnimals";
import {STRATEGY_BUBBLE, STRATEGY_MINERAL, STRATEGY_WATER} from "../builder/sprites/SpriteStyleMinerals";
import {
	STRATEGY_DOOR_SLOT,
	STRATEGY_EXIT,
	STRATEGY_SWITCH
} from "../builder/sprites/SpriteStyleSpecial";
import {STRATEGY_QUEEN} from "../builder/sprites/SpriteStyleBees";
import {STRATEGY_HINT} from "../builder/sprites/SpriteStyleHints";
import LarvaStrategy from "../strategy/sprites/animals/LarvaStrategy";
import AntStrategy from "../strategy/sprites/animals/AntStrategy";
import ToadStrategy from "../strategy/sprites/animals/ToadStrategy";
import FriendStrategy from "../strategy/sprites/animals/FriendStrategy";
import SwitchStrategy from "../strategy/sprites/special/SwitchStrategy";
import MouthTriggerStrategy from "../strategy/sprites/special/MouthTriggerStrategy";
import DoorMouthStrategy from "../strategy/sprites/special/DoorMouthStrategy";
import AnimationController from "./AnimationController";
import GrasshopperStrategy from "../strategy/sprites/animals/GrasshopperStrategy";
import SnailStrategy from "../strategy/sprites/animals/SnailStrategy";
import BaitStrategy from "../strategy/sprites/animals/BaitStrategy";
import CarniPlantStrategy from "../strategy/sprites/animals/CarniPlantStrategy";

export default class SpriteController extends ControllerBase {
	strategy;

	/*
	@type SpriteModel
	 */
	model;

	/**
	 *
	 * @param GameModel game
	 * @param SpriteModel model
	 * @param ControlsModel controls
	 */
	constructor(game, model, controls) {
		super(game, model, controls);

		this.model = model;
		this.strategy = this.createStrategy(model);
		if (this.strategy) {
			this.addChild(this.strategy);
		}

		model.onClick = (e) => this.onClick(e);

		this.animationController = null;
		if (this.model.animations) {
			this.model.activeAnimation.addOnChangeListener((animation) => this.updateAnimation(animation));
			this.model.animations.forEach((name, animation) => {
				animation.paths.forEach((path) => {
					this.level.addResource(path);
				});
			});
		}
		if (this.model.activeAnimation.isSet()) {
			this.updateAnimation(this.model.activeAnimation.get());
		}
	}

	updateInternal(delta) {
		if (this.model.activeAnimation.isSet() && this.animationController) {
			const anim = this.animationController.model;
			anim.image.coordinates.set(this.model.image.coordinates);
			anim.image.rotation.set(this.model.image.rotation.get());
			anim.image.scale.set(this.model.image.scale.get());
			anim.image.flipped.set(this.model.image.flipped.get());
		}
	}

	createStrategy(model) {
		const id = model.strategy.get();
		switch (id) {
			case STRATEGY_EMPTY:
				return new EmptyStrategy(this.game, model, this.controls);
			case STRATEGY_STATIC:
				return new StaticStrategy(this.game, model, this.controls);
			case STRATEGY_OBJECT:
				return new ObjectStrategy(this.game, model, this.controls);
			case STRATEGY_BUG:
				return new BugStrategy(this.game, model, this.controls);
			case STRATEGY_LARVA:
			case 'bee-larva':
				return new LarvaStrategy(this.game, model, this.controls);
			case STRATEGY_ANT:
				return new AntStrategy(this.game, model, this.controls);
			case STRATEGY_GRASSHOPPER:
				return new GrasshopperStrategy(this.game, model, this.controls);
			case STRATEGY_SNAIL:
				return new SnailStrategy(this.game, model, this.controls);
			case STRATEGY_BAIT:
				return new BaitStrategy(this.game, model, this.controls);
			case STRATEGY_CARNI_PLANT:
				return new CarniPlantStrategy(this.game, model, this.controls);
			case STRATEGY_FLYING_BUG:
			case 'butterfly':
				return new FlyingBugStrategy(this.game, model, this.controls);
			case STRATEGY_TOAD:
				return new ToadStrategy(this.game, model, this.controls);
			case STRATEGY_DOOR_MOUTH_TRIGGER:
				return new MouthTriggerStrategy(this.game, model, this.controls);
			case STRATEGY_DOOR_MOUTH:
				return new DoorMouthStrategy(this.game, model, this.controls);
			case STRATEGY_WATER:
				return new WaterStrategy(this.game, model, this.controls);
			case STRATEGY_BUBBLE:
				return new BubbleStrategy(this.game, model, this.controls);
			case STRATEGY_MINERAL:
				return new MineralStrategy(this.game, model, this.controls);
			case STRATEGY_EXIT:
				return new ExitStrategy(this.game, model, this.controls);
			case STRATEGY_EMITTER:
				return new EmitterStrategy(this.game, model, this.controls);
			case STRATEGY_FRIEND:
				return new FriendStrategy(this.game, model, this.controls);
			case STRATEGY_JELLY_MAKER:
				return new JellyMakerStrategy(this.game, model, this.controls);
			case STRATEGY_QUEEN:
				return new BeeQueenStrategy(this.game, model, this.controls);
			case STRATEGY_HINT:
				return new HintStrategy(this.game, model, this.controls);
			case STRATEGY_DOOR_SLOT:
				return new DoorSlotStrategy(this.game, model, this.controls);
			case STRATEGY_SWITCH:
				return new SwitchStrategy(this.game, model, this.controls);
			default:
				console.error('Strategy not found:', id);
		}
	}

	onClick(e) {
		this.strategy.onClick(e);
	}

	updateAnimation(animation) {
		if (this.animationController) {
			const anim = this.animationController.model;
			this.model.removeChild(anim);
			this.removeChild(this.animationController);
			this.animationController = null;
		}
		if (animation && this.model.animations && this.model.animations.exists(animation)) {
			const anim = this.model.animations.get(animation);
			anim.paused.set(false);
			this.animationController = new AnimationController(this.game, anim);
			this.addChild(this.animationController);
			this.model.addChild(anim);
			if (this.isActivated()) {
				this.animationController.activate();
			}
		}
	}

}
