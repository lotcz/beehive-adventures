import {
	IMAGE_HINT_ANTS,
	IMAGE_HINT_BUGS_AND_BEETLES_1, IMAGE_HINT_BUGS_AND_BEETLES_10,
	IMAGE_HINT_BUGS_AND_BEETLES_2,
	IMAGE_HINT_BUGS_AND_BEETLES_3,
	IMAGE_HINT_BUGS_AND_BEETLES_4,
	IMAGE_HINT_BUGS_AND_BEETLES_5,
	IMAGE_HINT_BUGS_AND_BEETLES_6,
	IMAGE_HINT_BUGS_AND_BEETLES_7, IMAGE_HINT_BUGS_AND_BEETLES_8, IMAGE_HINT_BUGS_AND_BEETLES_9,
	IMAGE_HINT_GIRL_TRAPPED,
	IMAGE_HINT_KEYHOLE_1,
	IMAGE_HINT_KEYHOLE_2
} from "./SpriteStyleHints";
import {NEIGHBOR_TYPE_UP, NEIGHBOR_TYPE_UPPER_LEFT} from "../../model/GridModel";
import {
	STRATEGY_FRIEND,
	STRATEGY_JELLY_MAKER,
	STRATEGY_LARVA,
	STRATEGY_OBJECT,
	STRATEGY_STATIC
} from "./SpriteStyleBasic";
import {
	SPRITE_TYPE_GREEN_JELLY,
	SPRITE_TYPE_HONEY,
	SPRITE_TYPE_NECTAR,
	SPRITE_TYPE_PINK_JELLY, SPRITE_TYPE_POLLEN_RED,
	SPRITE_TYPE_POTASSIUM,
	SPRITE_TYPE_YELLOW_JELLY
} from "./SpriteStyleMinerals";

export const SPRITE_STYLES_BEES = [];

export const IMAGE_BEE = 'img/bee.svg';
export const IMAGE_BEE_CRAWL = 'img/bee-walk.svg';
export const IMAGE_BEE_CRAWL_1 = 'img/bee-walk-1.svg';
export const IMAGE_BEE_WING = 'img/wing.svg';
export const IMAGE_STARS_1 = 'img/stars-1.svg';
export const IMAGE_STARS_2 = 'img/stars-2.svg';
export const IMAGE_STARS_3 = 'img/stars-3.svg';

export const SPRITE_TYPE_BEE_LARVA = 'bee-larva';
export const IMAGE_BEE_LARVA = 'img/bee-larva.svg';
import BeeLarvaImage from "../../../res/img/bee-larva.svg";

SPRITE_STYLES_BEES[SPRITE_TYPE_BEE_LARVA] = {
	strategy: STRATEGY_LARVA,
	image: {
		uri: IMAGE_BEE_LARVA,
		resource: BeeLarvaImage
	},
	data: {amount: 1, penetrable: true}
};

export const SPRITE_TYPE_BEE_FRIEND = 'bee-friend';
export const IMAGE_BEE_FRIEND = 'img/bee-friend.svg';
import BeeFriendImage from "../../../res/img/bee-friend.svg";

SPRITE_STYLES_BEES[SPRITE_TYPE_BEE_FRIEND] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_BEE_FRIEND,
		resource: BeeFriendImage
	},
	data: {
		penetrable: false,
		crawlable: true,
		hintDirection: NEIGHBOR_TYPE_UP,
		hintSize: 3,
		hint: [IMAGE_HINT_KEYHOLE_1, IMAGE_HINT_KEYHOLE_2]
	}
};

export const SPRITE_TYPE_BEE_SOLDIER = 'bee-soldier';
export const IMAGE_BEE_SOLDIER = 'img/bee-soldier.svg';
import BeeSoldierImage from "../../../res/img/bee-soldier.svg";

SPRITE_STYLES_BEES[SPRITE_TYPE_BEE_SOLDIER] = {
	strategy: STRATEGY_FRIEND,
	image: {
		uri: IMAGE_BEE_SOLDIER,
		resource: BeeSoldierImage
	},
	data: {
		penetrable: false,
		crawlable: true,
		openDoors: true,
		hintDirection: NEIGHBOR_TYPE_UPPER_LEFT,
		consumes: SPRITE_TYPE_NECTAR,
		defaultHint: null
	}
};

export const SPRITE_TYPE_BEE_GIRL = 'bee-girl';
export const IMAGE_BEE_GIRL = 'img/bee-friend-girl.svg';
import BeeGirlImage from "../../../res/img/bee-friend-girl.svg";

SPRITE_STYLES_BEES[SPRITE_TYPE_BEE_GIRL] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_BEE_GIRL,
		resource: BeeGirlImage
	},
	data: {}
};

export const SPRITE_TYPE_BEE_BOY = 'bee-boy';
export const IMAGE_BEE_BOY = `img/bee-friend-boy.svg`;
import BeeBoyImage from "../../../res/img/bee-friend-boy.svg";

SPRITE_STYLES_BEES[SPRITE_TYPE_BEE_BOY] = {
	strategy: STRATEGY_FRIEND,
	image: {
		uri: IMAGE_BEE_BOY,
		resource: BeeBoyImage
	},
	data: {
		penetrable: false,
		crawlable: true,
		consumes: SPRITE_TYPE_BEE_GIRL,
		consumesAmount: DEFAULT_OBJECT_MAX_AMOUNT,
		consumesHint: [IMAGE_BEE_GIRL, IMAGE_HINT_ANTS, IMAGE_HINT_GIRL_TRAPPED],
		produces: SPRITE_TYPE_PINK_JELLY,
		defaultHint: [IMAGE_BEE_BOY],
		hintDirection: NEIGHBOR_TYPE_UP,
		hintSize: 3
	}
};

export const SPRITE_TYPE_BEE_OLD = 'bee-old';
export const IMAGE_BEE_OLD = `img/bee-friend-bearded.svg`;
import BeeOldImage from "../../../res/img/bee-friend-bearded.svg";

SPRITE_STYLES_BEES[SPRITE_TYPE_BEE_OLD] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_BEE_OLD,
		resource: BeeOldImage
	},
	data: {
		penetrable: false,
		crawlable: true,
		hint: [
			IMAGE_HINT_BUGS_AND_BEETLES_1,
			IMAGE_HINT_BUGS_AND_BEETLES_2,
			IMAGE_HINT_BUGS_AND_BEETLES_3,
			IMAGE_HINT_BUGS_AND_BEETLES_4,
			IMAGE_HINT_BUGS_AND_BEETLES_5,
			IMAGE_HINT_BUGS_AND_BEETLES_6,
			IMAGE_HINT_BUGS_AND_BEETLES_7,
			IMAGE_HINT_BUGS_AND_BEETLES_8,
			IMAGE_HINT_BUGS_AND_BEETLES_9,
			IMAGE_HINT_BUGS_AND_BEETLES_10
		],
		hintDirection: NEIGHBOR_TYPE_UP,
		hintSize: 3,
		hintFrameRate: 2
	}
};

export const IMAGE_BEE_QUEEN = 'img/bee-queen.svg';
export const STRATEGY_QUEEN = 'queen';
export const SPRITE_TYPE_BEE_QUEEN = 'bee-queen';
import BeeQueenImage from "../../../res/img/bee-queen.svg";
import {IMAGE_WATER_CAP} from "./SpriteStyleObjects";
import {STRATEGY_BUG} from "./SpriteStyleAnimals";

SPRITE_STYLES_BEES[SPRITE_TYPE_BEE_QUEEN] = {
	strategy: STRATEGY_QUEEN,
	image: {
		uri: IMAGE_BEE_QUEEN,
		resource: BeeQueenImage
	}
};

export const SPRITE_TYPE_JELLY_MAKER_BODY = 'bee-jelly-maker-body';
export const IMAGE_JELLY_MAKER_BODY = 'img/bee-jelly-maker-body.svg';
import JellyMakerBodyImage from "../../../res/img/bee-jellymaker-body.svg";

SPRITE_STYLES_BEES[SPRITE_TYPE_JELLY_MAKER_BODY] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_JELLY_MAKER_BODY,
		resource: JellyMakerBodyImage
	}
};

export const SPRITE_TYPE_BEE_JELLY_MAKER = 'bee-jelly-maker';
export const IMAGE_BEE_JELLY_MAKER_HEAD = 'img/bee-jelly-maker.svg';
import BeeJellyMakerHeadImage from "../../../res/img/bee-jelly-maker-head.svg";
import {DEFAULT_OBJECT_MAX_AMOUNT} from "../../strategy/sprites/ObjectStrategy";

SPRITE_STYLES_BEES[SPRITE_TYPE_BEE_JELLY_MAKER] = {
	strategy: STRATEGY_JELLY_MAKER,
	image: {
		uri: IMAGE_BEE_JELLY_MAKER_HEAD,
		resource: BeeJellyMakerHeadImage
	},
	data: {
		hintDirection: NEIGHBOR_TYPE_UP,
		consumes: SPRITE_TYPE_POLLEN_RED,
		produces: SPRITE_TYPE_PINK_JELLY
	}
};

export const SPRITE_TYPE_GREEN_JELLY_MAKER = 'bee-jelly-maker-green';

SPRITE_STYLES_BEES[SPRITE_TYPE_GREEN_JELLY_MAKER] = {
	strategy: STRATEGY_JELLY_MAKER,
	image: {
		uri: IMAGE_BEE_JELLY_MAKER_HEAD,
		resource: BeeJellyMakerHeadImage
	},
	data: {
		hintDirection: NEIGHBOR_TYPE_UP,
		consumes: SPRITE_TYPE_POTASSIUM,
		produces: SPRITE_TYPE_GREEN_JELLY
	}
};

export const SPRITE_TYPE_YELLOW_JELLY_MAKER = 'bee-jelly-maker-yellow';

SPRITE_STYLES_BEES[SPRITE_TYPE_YELLOW_JELLY_MAKER] = {
	strategy: STRATEGY_JELLY_MAKER,
	image: {
		uri: IMAGE_BEE_JELLY_MAKER_HEAD,
		resource: BeeJellyMakerHeadImage
	},
	data: {
		hintDirection: NEIGHBOR_TYPE_UP,
		consumes: SPRITE_TYPE_NECTAR,
		produces: SPRITE_TYPE_YELLOW_JELLY
	}
};

export const SPRITE_TYPE_HONEY_MAKER = 'bee-honey-maker';

SPRITE_STYLES_BEES[SPRITE_TYPE_HONEY_MAKER] = {
	strategy: STRATEGY_JELLY_MAKER,
	image: {
		uri: IMAGE_BEE_JELLY_MAKER_HEAD,
		resource: BeeJellyMakerHeadImage
	},
	data: {
		hintDirection: NEIGHBOR_TYPE_UP,
		consumes: SPRITE_TYPE_YELLOW_JELLY,
		produces: SPRITE_TYPE_HONEY
	}
};

