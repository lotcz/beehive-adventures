import ModelBase from "../class/ModelBase";
import Vector2 from "../class/Vector2";
import DirtyValue from "../class/DirtyValue";
import VectorCollectionModel from "./VectorCollectionModel";
import {GROUND_STYLES} from "../builder/GroundStyle";
import {SPRITE_STYLES, SPRITE_TYPES} from "../builder/SpriteStyle";
import {PARALLAX_STYLES} from "../builder/ParallaxStyle";
import {MUSIC_TYPES} from "../builder/MusicStyle";

export const EDITOR_MODE_SPRITES = 'Sprites';
export const EDITOR_MODE_GROUND = 'Ground';
export const EDITOR_MODE_PLANT = 'Plant';

export const EDITOR_TOOL_DELETE = '--delete--';
export const EDITOR_TOOL_SELECT = '--select--';

export default class LevelEditorModel extends ModelBase {
	modes;
	selectedMode;
	showGroundTiles;
	brushSize;
	groundTypes;
	selectedGroundType;
	spriteTypes;
	selectedSpriteType;
	showSpriteHelpers;
	highlightedTilePosition;
	highlights;
	parallaxTypes;
	levelMusicTypes;
	levelLoadRequest;
	selectedSprites;

	constructor() {
		super();

		this.modes = [
			EDITOR_MODE_GROUND,
			EDITOR_MODE_SPRITES,
			EDITOR_MODE_PLANT
		];
		this.selectedMode = new DirtyValue(EDITOR_MODE_SPRITES);
		this.addChild(this.selectedMode);
		this.showGroundTiles = new DirtyValue(false);
		this.addChild(this.showGroundTiles);
		this.showSpriteHelpers = new DirtyValue(false);
		this.addChild(this.showSpriteHelpers);
		this.levelLoadRequest = new DirtyValue(false);
		this.addChild(this.levelLoadRequest);

		this.brushSize = 1;

		this.groundTypes = Object.keys(GROUND_STYLES);
		this.groundTypes.unshift(EDITOR_TOOL_DELETE);
		this.groundTypes.sort();
		this.selectedGroundType = this.groundTypes[0];

		this.spriteTypes = [...SPRITE_TYPES];
		this.spriteTypes.unshift(EDITOR_TOOL_SELECT);
		this.spriteTypes.unshift(EDITOR_TOOL_DELETE);
		this.spriteTypes.sort();
		this.selectedSpriteType = this.spriteTypes[0];

		this.selectedSprites = new DirtyValue([]);
		this.addChild(this.selectedSprites);

		this.parallaxTypes = Object.keys(PARALLAX_STYLES);
		this.levelMusicTypes = MUSIC_TYPES;

		this.highlightedTilePosition = new Vector2();
		this.addChild(this.highlightedTilePosition);
		this.highlights = new VectorCollectionModel();
		this.addChild(this.highlights);

	}

}
