import {
	BLUE_MEDIUM,
	BROWN_DARK,
	BROWN_DARKEST,
	BROWN_LIGHT,
	BROWN_MEDIUM,
	GRAY_DARK,
	GRAY_DARKEST,
	GRAY_LIGHT,
	GRAY_MEDIUM,
	GREEN_DARKEST,
	GREEN_LIGHT,
	GREEN_LIGHTEST,
	ORANGE_LIGHT,
	ORANGE_DARK,
	YELLOW_DARK,
	YELLOW_DARKEST,
	RED_LIGHT,
	RED_DARKEST,
	RED_LIGHTEST,
	ORANGE_LIGHTEST, PURPLE_LIGHTEST, PURPLE_DARK, PURPLE_DARKEST, RED_DARK, PURPLE_MEDIUM
} from "./Palette";

export const GROUND_TYPE_BASIC = 'basic';
export const GROUND_TYPE_SOIL = 'soil';
export const GROUND_TYPE_WOOD = 'wood';
export const GROUND_TYPE_ROCK = 'rock';
export const GROUND_TYPE_GRASS = 'grass';
export const GROUND_TYPE_HONEY = 'honey';
export const GROUND_TYPE_WAX = 'wax';
export const GROUND_TYPE_WAX_DOOR = 'wax-door';
export const GROUND_TYPE_WATER = 'water';
export const GROUND_TYPE_CLOUD = 'cloud';
export const GROUND_TYPE_SOIL_BACKGROUND = 'background-soil';
export const GROUND_TYPE_ROCK_BACKGROUND = 'background-rock';
export const GROUND_TYPE_WAX_BACKGROUND = 'background-wax';
export const GROUND_TYPE_KEYHOLE_BACKGROUND = 'keyhole-background';
export const GROUND_TYPE_GRASS_BACKGROUND = 'background-grass';

export const GROUND_STYLES = [];

GROUND_STYLES[GROUND_TYPE_BASIC] = {
	fill: GRAY_DARK,
	stroke: { width: 10, color: GRAY_DARKEST},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_SOIL] = {
	fill: BROWN_MEDIUM,
	stroke: { width: 10, color: BROWN_DARK},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_WOOD] = {
	fill: ORANGE_DARK,
	stroke: { width: 10, color: BROWN_DARKEST},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_ROCK] = {
	fill: GRAY_MEDIUM,
	stroke: { width: 10, color: GRAY_DARK},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_GRASS] = {
	fill: GREEN_LIGHT,
	stroke: { width: 10, color: GREEN_DARKEST},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_HONEY] = {
	fill: 'orange',
	stroke: { width: 140, color: 'darkOrange', linejoin: 'round'},
	background: true
};

GROUND_STYLES[GROUND_TYPE_WAX] = {
	fill: ORANGE_LIGHT,
	stroke: { width: 10, color: ORANGE_DARK},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_WAX_DOOR] = {
	fill: YELLOW_DARK,
	stroke: { width: 10, color: YELLOW_DARKEST},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_WATER] = {
	fill: BLUE_MEDIUM,
	stroke: { width: 160, color: BLUE_MEDIUM},
	background: true,
	penetrable: true
};

GROUND_STYLES[GROUND_TYPE_CLOUD] = {
	fill: 'rgba(255, 255, 255, 0.3)',
	stroke: { width: 0},
	background: true,
	penetrable: true
};

GROUND_STYLES[GROUND_TYPE_ROCK_BACKGROUND] = {
	fill: GRAY_LIGHT,
	stroke: { width: 0},
	background: true,
	penetrable: true,
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_SOIL_BACKGROUND] = {
	fill: BROWN_LIGHT,
	stroke: { width: 20, color: BROWN_LIGHT},
	background: true,
	penetrable: true,
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_WAX_BACKGROUND] = {
	fill: ORANGE_LIGHTEST,
	stroke: { width: 20, color: ORANGE_LIGHTEST},
	background: true,
	penetrable: true,
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_KEYHOLE_BACKGROUND] = {
	fill: ORANGE_LIGHTEST,
	stroke: { width: 20, color: ORANGE_LIGHTEST},
	background: true,
	penetrable: true,
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_GRASS_BACKGROUND] = {
	fill: GREEN_LIGHTEST,
	stroke: { width: 20, color: GREEN_LIGHTEST},
	background: true,
	penetrable: true,
	renderCorners: true
};

export const GROUND_TYPE_RED_FLOWER = 'red-flower';

GROUND_STYLES[GROUND_TYPE_RED_FLOWER] = {
	fill: RED_LIGHT,
	stroke: { width: 10, color: RED_DARKEST},
	renderCorners: true
};

export const GROUND_TYPE_RED_FLOWER_BACKGROUND = 'red-flower-background';

GROUND_STYLES[GROUND_TYPE_RED_FLOWER_BACKGROUND] = {
	fill: RED_LIGHTEST,
	stroke: { width: 20, color: RED_LIGHTEST},
	background: true,
	penetrable: true,
	renderCorners: true
};

export const GROUND_TYPE_RED_FLOWER_DOOR = 'red-flower-door';

GROUND_STYLES[GROUND_TYPE_RED_FLOWER_DOOR] = {
	fill: RED_DARK,
	stroke: { width: 10, color: RED_DARKEST},
	background: false,
	penetrable: false,
	renderCorners: true
};

export const GROUND_TYPE_PURPLE_FLOWER = 'purple-flower';

GROUND_STYLES[GROUND_TYPE_PURPLE_FLOWER] = {
	fill: PURPLE_MEDIUM,
	stroke: { width: 10, color: PURPLE_DARKEST},
	renderCorners: true
};

export const GROUND_TYPE_PURPLE_FLOWER_BACKGROUND = 'purple-flower-background';

GROUND_STYLES[GROUND_TYPE_PURPLE_FLOWER_BACKGROUND] = {
	fill: PURPLE_LIGHTEST,
	stroke: { width: 20, color: PURPLE_LIGHTEST},
	background: true,
	penetrable: true,
	renderCorners: true
};

export const GROUND_TYPE_PURPLE_FLOWER_DOOR = 'purple-flower-door';

GROUND_STYLES[GROUND_TYPE_PURPLE_FLOWER_DOOR] = {
	fill: PURPLE_DARK,
	stroke: { width: 10, color: PURPLE_DARKEST},
	background: false,
	penetrable: false,
	renderCorners: true
};
