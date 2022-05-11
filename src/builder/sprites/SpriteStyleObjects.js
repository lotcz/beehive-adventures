import {STRATEGY_EMITTER, STRATEGY_OBJECT, STRATEGY_STATIC} from "./SpriteStyleBasic";

export const SPRITE_STYLES_OBJECTS = [];

export const SPRITE_TYPE_STONE = 'stone';
export const IMAGE_STONE = 'img/stone.svg';
import StoneImage from "../../../res/img/stone.svg";

SPRITE_STYLES_OBJECTS[SPRITE_TYPE_STONE] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_STONE,
		resource: StoneImage
	},
	data: {
		sinks: true
	}
};

export const SPRITE_TYPE_STONE_SOIL = 'stone-soil';
export const IMAGE_STONE_SOIL = 'img/stone-soil.svg';
import StoneSoilImage from "../../../res/img/stone-soil.svg";

SPRITE_STYLES_OBJECTS[SPRITE_TYPE_STONE_SOIL] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_STONE_SOIL,
		resource: StoneSoilImage
	},
	data: {
		sinks: true
	}
};

export const SPRITE_TYPE_CHLOROPLAST = 'chloroplast';
export const IMAGE_CHLOROPLAST = 'img/chloroplast.svg';
import ChloroplastImage from "../../../res/img/chloroplast.svg";

SPRITE_STYLES_OBJECTS[SPRITE_TYPE_CHLOROPLAST] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_CHLOROPLAST,
		resource: ChloroplastImage
	}
};

export const SPRITE_TYPE_BEE_LIFE = 'bee-life';
export const IMAGE_BEE_LIFE = 'img/bee-life.svg';
import BeeLifeImage from "../../../res/img/bee-life.svg";

SPRITE_STYLES_OBJECTS[SPRITE_TYPE_BEE_LIFE] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_BEE_LIFE,
		resource: BeeLifeImage
	}
};

export const SPRITE_TYPE_BEE_DEAD = 'bee-dead';
export const IMAGE_BEE_DEAD = 'img/bee-dead.svg';
import BeeDeadImage from "../../../res/img/bee-dead.svg";

SPRITE_STYLES_OBJECTS[SPRITE_TYPE_BEE_DEAD] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_BEE_DEAD,
		resource: BeeDeadImage
	}
};

export const SPRITE_TYPE_MUSHROOM = 'mushroom';
export const IMAGE_MUSHROOM = 'img/mushroom.svg';
import MushroomImage from "../../../res/img/mushroom.svg";

SPRITE_STYLES_OBJECTS[SPRITE_TYPE_MUSHROOM] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_MUSHROOM,
		resource: MushroomImage,
	}
};

export const SPRITE_TYPE_BEE_EGG = 'bee-egg';
export const IMAGE_BEE_EGG = 'img/bee-egg.svg';
import BeeEggImage from "../../../res/img/bee-egg.svg";

SPRITE_STYLES_OBJECTS[SPRITE_TYPE_BEE_EGG] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_BEE_EGG,
		resource: BeeEggImage,
		scale: 0.5
	}
};

export const SPRITE_TYPE_BEE_BROKEN_EGG = 'bee-egg-broken';
export const IMAGE_BEE_BROKEN_EGG = 'img/bee-egg-broken.svg';
import BeeBrokenEggImage from "../../../res/img/bee-egg-broken.svg";

SPRITE_STYLES_OBJECTS[SPRITE_TYPE_BEE_BROKEN_EGG] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_BEE_BROKEN_EGG,
		resource: BeeBrokenEggImage
	}
};

export const SPRITE_TYPE_BUG_EGG = 'bug-egg';
export const IMAGE_BUG_EGG = 'img/bug-egg.svg';
import BugEggImage from "../../../res/img/bug-egg.svg";

SPRITE_STYLES_OBJECTS[SPRITE_TYPE_BUG_EGG] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_BUG_EGG,
		resource: BugEggImage
	}
};

export const SPRITE_TYPE_BUG_DEAD = 'bug-dead';
export const IMAGE_BUG_DEAD = 'img/bug-dead.svg';
import BugDeadImage from "../../../res/img/bug-dead.svg";

SPRITE_STYLES_OBJECTS[SPRITE_TYPE_BUG_DEAD] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_BUG_DEAD,
		resource: BugDeadImage
	}
};

export const SPRITE_TYPE_JAR_HONEY = 'jar-honey';
export const IMAGE_JAR_HONEY = 'img/jar-honey.svg';
import JarHoneyImage from "../../../res/img/jar-honey.svg";

SPRITE_STYLES_OBJECTS[SPRITE_TYPE_JAR_HONEY] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_JAR_HONEY,
		resource: JarHoneyImage
	}
};

export const SPRITE_TYPE_SPORE_PURPLE = 'spore-purple';
export const IMAGE_SPORE_PURPLE = 'img/spore-purple.svg';
import SporePurpleImage from "../../../res/img/spore-purple.svg";

SPRITE_STYLES_OBJECTS[SPRITE_TYPE_SPORE_PURPLE] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_SPORE_PURPLE,
		resource: SporePurpleImage
	},
	data: {
		sinks: true
	}
};
