import {STRATEGY_OBJECT} from "./SpriteStyleBasic";

export const SPRITE_STYLES_MINERALS = [];

export const STRATEGY_MINERAL = 'mineral';

export const SPRITE_TYPE_WATER = 'water';
export const IMAGE_WATER = 'img/water.svg';
export const STRATEGY_WATER = 'water';
import WaterImage from "../../../res/img/water.svg";

SPRITE_STYLES_MINERALS[SPRITE_TYPE_WATER] = {
	strategy: STRATEGY_WATER,
	image: {
		uri: IMAGE_WATER,
		resource: WaterImage,
		scale: 0.1
	},
	data: {amount: 1}
};

export const SPRITE_TYPE_BUBBLE = 'bubble';
export const STRATEGY_BUBBLE = 'bubble';
export const IMAGE_BUBBLE = 'img/bubble.svg';
import BubbleImage from "../../../res/img/bubble.svg";

SPRITE_STYLES_MINERALS[SPRITE_TYPE_BUBBLE] = {
	strategy: STRATEGY_BUBBLE,
	image: {
		uri: IMAGE_BUBBLE,
		resource: BubbleImage,
		scale: 0.01
	},
	data: {amount: 1}
};

export const SPRITE_TYPE_POTASSIUM = 'potassium';
export const IMAGE_POTASSIUM = 'img/potassium.svg';
import PotassiumImage from "../../../res/img/potassium.svg";

SPRITE_STYLES_MINERALS[SPRITE_TYPE_POTASSIUM] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_POTASSIUM,
		resource: PotassiumImage,
		scale: 0.1
	},
	data: {amount: 1}
};

export const SPRITE_TYPE_NECTAR = 'nectar';
export const IMAGE_NECTAR = 'img/nectar.svg';
import NectarImage from "../../../res/img/nectar.svg";

SPRITE_STYLES_MINERALS[SPRITE_TYPE_NECTAR] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_NECTAR,
		resource: NectarImage,
		scale: 0.1
	},
	data: {amount: 1}
};

export const SPRITE_TYPE_NECTAR_RED = 'nectar-red';
export const IMAGE_NECTAR_RED = 'img/nectar-red.svg';
import NectarRedImage from "../../../res/img/nectar-red.svg";

SPRITE_STYLES_MINERALS[SPRITE_TYPE_NECTAR_RED] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_NECTAR_RED,
		resource: NectarRedImage,
		scale: 0.01
	},
	data: {amount: 1}
};

export const SPRITE_TYPE_NECTAR_PURPLE = 'nectar-purple';
export const IMAGE_NECTAR_PURPLE = 'img/nectar-purple.svg';
import NectarPurpleImage from "../../../res/img/nectar-purple.svg";

SPRITE_STYLES_MINERALS[SPRITE_TYPE_NECTAR_PURPLE] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_NECTAR_PURPLE,
		resource: NectarPurpleImage,
		scale: 0.01
	},
	data: {amount: 1}
};

export const SPRITE_TYPE_POLLEN_PURPLE = 'pollen-purple';
export const IMAGE_POLLEN_PURPLE = 'img/pollen-purple.svg';
import PollenPurpleImage from "../../../res/img/pollen-purple.svg";

SPRITE_STYLES_MINERALS[SPRITE_TYPE_POLLEN_PURPLE] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_POLLEN_PURPLE,
		resource: PollenPurpleImage,
		scale: 0.1
	},
	data: {amount: 3}
};

export const SPRITE_TYPE_POLLEN_RED = 'pollen-red';
export const IMAGE_POLLEN_RED = 'img/pollen-red.svg';
import PollenRedImage from "../../../res/img/pollen-red.svg";

SPRITE_STYLES_MINERALS[SPRITE_TYPE_POLLEN_RED] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_POLLEN_RED,
		resource: PollenRedImage,
		scale: 0.1
	},
	data: {amount: 3}
};

export const SPRITE_TYPE_POLLEN_YELLOW = 'pollen-yellow';
export const IMAGE_POLLEN_YELLOW = 'img/pollen-yellow.svg';
import PollenYellowImage from "../../../res/img/pollen-yellow.svg";

SPRITE_STYLES_MINERALS[SPRITE_TYPE_POLLEN_YELLOW] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_POLLEN_YELLOW,
		resource: PollenYellowImage,
		scale: 0.1
	},
	data: {amount: 3}
};

export const SPRITE_TYPE_PINK_JELLY = 'jelly-pink';
export const IMAGE_PINK_JELLY = 'img/pink-jelly.svg';
import PinkJellyImage from "../../../res/img/pink-jelly.svg";

SPRITE_STYLES_MINERALS[SPRITE_TYPE_PINK_JELLY] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_PINK_JELLY,
		resource: PinkJellyImage,
		scale: 0.2
	},
	data: {
		amount: 1
	}
};

export const SPRITE_TYPE_GREEN_JELLY = 'jelly-green';
export const IMAGE_GREEN_JELLY = 'img/green-jelly.svg';
import GreenJellyImage from "../../../res/img/green-jelly.svg";

SPRITE_STYLES_MINERALS[SPRITE_TYPE_GREEN_JELLY] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_GREEN_JELLY,
		resource: GreenJellyImage,
		scale: 0.2
	},
	data: {
		amount: 1
	}
};

export const SPRITE_TYPE_YELLOW_JELLY = 'jelly-yellow';
export const IMAGE_YELLOW_JELLY = 'img/yellow-jelly.svg';
import YellowJellyImage from "../../../res/img/yellow-jelly.svg";

SPRITE_STYLES_MINERALS[SPRITE_TYPE_YELLOW_JELLY] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_YELLOW_JELLY,
		resource: YellowJellyImage,
		scale: 0.2
	},
	data: {
		amount: 1
	}
};

export const SPRITE_TYPE_PURPLE_JELLY = 'jelly-purple';
export const IMAGE_PURPLE_JELLY = 'img/purple-jelly.svg';
import PurpleJellyImage from "../../../res/img/purple-jelly.svg";

SPRITE_STYLES_MINERALS[SPRITE_TYPE_PURPLE_JELLY] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_PURPLE_JELLY,
		resource: PurpleJellyImage,
		scale: 0.2
	},
	data: {
		amount: 1
	}
};

export const SPRITE_TYPE_HONEY = 'honey';
export const IMAGE_HONEY = 'img/honey.svg';
import HoneyImage from "../../../res/img/honey.svg";
import {DEFAULT_OBJECT_MAX_AMOUNT} from "../../strategy/sprites/ObjectStrategy";

SPRITE_STYLES_MINERALS[SPRITE_TYPE_HONEY] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_HONEY,
		resource: HoneyImage,
		scale: 0.2
	},
	data: {
		amount: 1
	}
};
