import ModelBase from "../class/ModelBase";
import DirtyValue from "../class/DirtyValue";
import Vector2 from "../class/Vector2";
import LevelEditorModel from "./LevelEditorModel";
import HashTableModel from "./HashTableModel";
import ResourceModel, {RESOURCE_TYPE_IMAGE, RESOURCE_TYPE_SOUND} from "./ResourceModel";
import {
	IMAGE_BEE,
	IMAGE_BEE_CRAWL,
	IMAGE_BEE_CRAWL_1,
	IMAGE_BEE_WING,
	IMAGE_STARS_1,
	IMAGE_STARS_2, IMAGE_STARS_3
} from "../builder/sprites/SpriteStyleBees";
import {PARALLAX_STYLES} from "../builder/ParallaxStyle";
import {SPRITE_STYLES} from "../builder/SpriteStyle";
import {MUSIC_STYLES} from "../builder/MusicStyle";
import BeeImage from "../../res/img/bee.svg";
import BeeDeadImage from "../../res/img/bee-dead.svg";
import BeeCrawlImage from "../../res/img/bee-walk.svg";
import BeeCrawl1Image from "../../res/img/bee-walk-1.svg";
import BeeWingImage from "../../res/img/wing.svg";
import Stars1Image from "../../res/img/stars-1.svg";
import Stars2Image from "../../res/img/stars-2.svg";
import Stars3Image from "../../res/img/stars-3.svg";
import HintBackgroundImage from "../../res/img/hint-background.svg";
import ControlsModel from "./ControlsModel";
import BeeStateModel from "./BeeStateModel";
import {IMAGE_BEE_DEAD} from "../builder/sprites/SpriteStyleObjects";
import {IMAGE_HINT_BACKGROUND} from "../builder/sprites/SpriteStyleHints";
import FallenItemsModel from "./FallenItemsModel";

import LevelIntro from "../../levels/intro.json";
import LevelHatching from "../../levels/hatching.json";
import LevelTutorial1 from "../../levels/tutorial-1.json";
import LevelTutorial2 from "../../levels/tutorial-2.json";
import LevelTutorial3 from "../../levels/tutorial-3.json";
import LevelTutorial4 from "../../levels/tutorial-4.json";
import LevelJunction from "../../levels/junction.json";
import LevelBeehive from "../../levels/beehive.json";
import LevelMeadow1 from "../../levels/meadow-1.json";
import LevelMeadow2 from "../../levels/meadow-2.json";
import LevelPond from "../../levels/pond.json";
import LevelForest from "../../levels/forest.json";
import LevelHermit from "../../levels/hermit.json";

export const EDIT_MODE_ENABLED = true;
export const START_LEVEL = 'hatching';

export default class GameModel extends ModelBase {
	id;

	/**
	 * @type ControlsModel
	 */
	controls;

	levels;
	level;
	levelName;
	lastLevelName;
	beeState;
	menu;
	editor;
	soundEnabled;
	isInEditMode;
	isFullscreen;
	viewBoxSize;
	resources;
	fallenItems;

	constructor() {
		super();

		this.id = Date.now();

		this.controls = new ControlsModel();
		this.addChild(this.controls);

		this.history = new HashTableModel();
		this.addChild(this.history);

		this.level = new DirtyValue();
		this.addChild(this.level);
		this.levelName = new DirtyValue();
		this.addChild(this.levelName);
		this.lastLevelName = null;

		this.levels = new HashTableModel();
		this.levels.set('intro', LevelIntro);
		this.levels.set('hatching', LevelHatching);
		this.levels.set('tutorial-1', LevelTutorial1);
		this.levels.set('tutorial-2', LevelTutorial2);
		this.levels.set('tutorial-3', LevelTutorial3);
		this.levels.set('tutorial-4', LevelTutorial4);
		this.levels.set('junction', LevelJunction);
		this.levels.set('beehive', LevelBeehive);
		this.levels.set('meadow-1', LevelMeadow1);
		this.levels.set('meadow-2', LevelMeadow2);
		this.levels.set('pond', LevelPond);
		this.levels.set('forest', LevelForest);
		this.levels.set('hermit', LevelHermit);

		this.fallenItems = new FallenItemsModel();

		this.beeState = new BeeStateModel();
		this.addChild(this.beeState);

		this.menu = new DirtyValue();
		this.addChild(this.menu);

		this.editor = new LevelEditorModel();
		this.addChild(this.editor);
		this.isInEditMode = new DirtyValue(EDIT_MODE_ENABLED);
		this.addChild(this.isInEditMode);

		this.isFullscreen = new DirtyValue(false);
		this.addChild(this.isFullscreen);

		this.soundEnabled = new DirtyValue(true);
		this.addChild(this.soundEnabled);

		this.viewBoxSize = new Vector2();
		this.addChild(this.viewBoxSize);

		this.resources = new HashTableModel();
		this.addChild(this.resources);
		this.initResources();
	}

	getState() {
		return {
			id: this.id,
			lastLevelName: this.lastLevelName,
			levelName: this.levelName.get(),
			history: this.history.getState(),
			beeState: this.beeState.getState(),
			fallenItems: this.fallenItems.getState(),
			soundEnabled: this.soundEnabled.getState()
		}
	}

	restoreState(state) {
		if (state.id) this.id = state.id;
		if (state.lastLevelName) this.lastLevelName = state.lastLevelName;
		if (state.levelName) this.levelName.restoreState(state.levelName);
		if (state.history) this.history.restoreState(state.history, (state) => new DirtyValue(state));
		if (state.beeState) this.beeState.restoreState(state.beeState);
		if (state.fallenItems) this.fallenItems.restoreState(state.fallenItems);
		if (state.soundEnabled !== undefined) this.soundEnabled.restoreState(state.soundEnabled);
	}

	initResources() {
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BEE, BeeImage);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BEE_DEAD, BeeDeadImage);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BEE_CRAWL, BeeCrawlImage);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BEE_CRAWL_1, BeeCrawl1Image);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BEE_WING, BeeWingImage);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_STARS_1, Stars1Image);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_STARS_2, Stars2Image);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_STARS_3, Stars3Image);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_HINT_BACKGROUND, HintBackgroundImage);

		for (let type in SPRITE_STYLES) {
			const style = SPRITE_STYLES[type];
			if (style.image) {
				this.addResource(RESOURCE_TYPE_IMAGE, style.image.uri, style.image.resource);
			}
			if (style.animations) {
				Object.keys(style.animations).forEach((animationName) => style.animations[animationName].forEach((image) => this.addResource(RESOURCE_TYPE_IMAGE, image.uri, image.resource)));
			}
		}

		for (let type in MUSIC_STYLES) {
			const style = MUSIC_STYLES[type];
			if (style.resource) {
				this.addResource(RESOURCE_TYPE_SOUND, style.url, style.resource);
			}
		}

		for (let type in PARALLAX_STYLES) {
			const style = PARALLAX_STYLES[type];
			if (style.layers) {
				style.layers.forEach((layer) => {
					if (layer.image) {
						this.addResource(RESOURCE_TYPE_IMAGE, layer.image.uri, layer.image.resource);
					}
				});
			}
		}
	}

	addResource(resType, uri, data) {
		if (this.resources.exists(uri)) {
			console.log(`Resource URI ${uri} already exists in game resources store.`);
		} else {
			this.resources.add(uri, new ResourceModel({type: resType, uri: uri, data: data}));
		}
	}

	historyExists(eventName) {
		return this.history.exists(eventName);
	}

	setHistory(eventName, value = true) {
		return this.history.set(eventName, new DirtyValue(value));
	}

	getHistory(eventName) {
		return this.history.get(eventName);
	}

	removeHistory(eventName) {
		return this.history.remove(eventName);
	}

}

