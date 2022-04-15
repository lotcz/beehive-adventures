import ControllerBase from "../class/ControllerBase";
import SpriteCollectionController from "./SpriteCollectionController";
import BeeController from "./BeeController";
import GroundController from "./GroundController";
import {START_LEVEL} from "../model/GameModel";
import {MAX_HEALTH} from "../model/BeeStateModel";
import {SPRITE_TYPE_BEE_DEAD} from "../builder/sprites/SpriteStyleObjects";

const DEBUG_LEVEL_CONTROLLER = false;

export default class LevelController extends ControllerBase {
	isDead;
	travelling; // false or level name
	isFadingIn;

	constructor(game, model, controls) {
		super(game, model, controls);

		this.isDead = false;
		this.travelling = false;
		this.isFadingIn = false;

		this.groundController = new GroundController(game, model.ground, controls);
		this.addChild(this.groundController);

		this.spritesController = new SpriteCollectionController(game, model.sprites, controls);
		this.addChild(this.spritesController);

		this.beeChanged();
	}

	beeChanged() {
		if (this.beeController) {
			this.removeChild(this.beeController);
			this.beeController = null;
		}
		if (this.model.bee) {
			this.beeController = new BeeController(this.game, this.model.bee, this.controls);
			this.addChild(this.beeController);
			if (this.isActivated()) {
				this.beeController.activate();
			}
			this.model.bee.addOnDeathListener(() => this.onDeath());
			this.model.bee.addOnTravelListener((param) => this.onTravel(param));
			this.fadeIn();
		}
	}

	onDeath() {
		this.isDead = true;
		this.travelling = false;
		this.isFadingIn = false;
		this.model.clipAmount.set(0);
		this.model.bee.held.set(false);
	}

	onTravel(levelName) {
		this.travelling = levelName;
		this.isDead = false;
		this.isFadingIn = false;
		this.model.clipAmount.set(0);
		this.model.bee.held.set(false);
	}

	fadeIn() {
		this.isFadingIn = true;
		this.isDead = false;
		this.travelling = false;
		this.model.clipAmount.set(1);
	}

	activateInternal() {
		if (DEBUG_LEVEL_CONTROLLER) console.log('Activated level controller');
	}

	deactivateInternal() {
		if (DEBUG_LEVEL_CONTROLLER) console.log('Deactivated level controller');
	}

	updateInternal(delta) {
		if (this.beeController && this.beeController.isDeleted()) {
			this.beeChanged();
		}

		if (this.isFadingIn) {
			if (this.model.clipAmount.get() > 0) {
				this.model.clipCenter.set(this.model.bee.coordinates);
				this.model.clipAmount.set(Math.max(this.level.clipAmount.get() - (0.5 * delta / 1000), 0));
			} else {
				this.isFadingIn = false;
			}
		}

		if ((this.isDead === true) || (this.travelling !== false)) {
			if (this.level.clipAmount.get() < 1) {
				if (DEBUG_LEVEL_CONTROLLER) console.log(`Fading out`);
				this.level.clipCenter.set(this.model.bee.coordinates);
				this.level.clipAmount.set(Math.min(this.level.clipAmount.get() + (0.5 * delta / 1000), 1));
			} else {
				if (this.travelling !== false) {
					if (DEBUG_LEVEL_CONTROLLER) console.log(`Travelling to ${this.travelling}`);
					this.game.levelName.set(this.travelling);
					this.travelling = false;
				} else {
					this.game.beeState.lives.set(this.game.beeState.lives.get() - 1);
					if (this.model.bee.visible.get() === true) {
						this.model.addSpriteFromStyle(this.model.bee.position, SPRITE_TYPE_BEE_DEAD);
					}
					if (this.level.name === START_LEVEL) {
						if (DEBUG_LEVEL_CONTROLLER) console.log('Died in start level');
						this.game.beeState.health.set(MAX_HEALTH);
						this.model.spawn(this.model.bee, 'start');
						this.beeChanged();
						this.fadeIn();
					} else {
						if (this.game.beeState.lives.get() < 0) {
							if (DEBUG_LEVEL_CONTROLLER) console.log('Died and transferring to start level.');
							this.game.beeState.lives.set(this.game.beeState.maxLives.get());
							this.game.levelName.set(START_LEVEL);
						} else {
							if (DEBUG_LEVEL_CONTROLLER) console.log('Died and respawning in the same level.');
							this.game.beeState.health.set(MAX_HEALTH);
							this.model.spawn(this.model.bee, this.game.lastLevelName);
							this.beeChanged();
							this.fadeIn();
						}
					}
					this.isDead = false;
				}
			}
		}

	}

}
