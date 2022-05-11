import {
	SPRITE_TYPE_BEE_DEAD,
	SPRITE_TYPE_BEE_EGG,
	SPRITE_TYPE_BUG_DEAD,
	SPRITE_TYPE_BUG_EGG
} from "./SpriteStyleObjects";
import {
	SPRITE_TYPE_NECTAR, SPRITE_TYPE_NECTAR_RED,
	SPRITE_TYPE_POTASSIUM,
	SPRITE_TYPE_PURPLE_JELLY,
	SPRITE_TYPE_YELLOW_JELLY
} from "./SpriteStyleMinerals";
import {
	STRATEGY_DOOR_MOUTH,
	STRATEGY_FLYING_BUG,
	STRATEGY_LARVA, STRATEGY_OBJECT,
	STRATEGY_STATIC
} from "./SpriteStyleBasic";
import {BUG_MAX_AMOUNT} from "../../strategy/sprites/animals/BugStrategy";

export const SPRITE_STYLES_ANIMALS = [];

export const SPRITE_TYPE_TICK = 'tick';

export const SPRITE_TYPE_BUG = 'bug';
export const IMAGE_BUG = 'img/bug.svg';
export const STRATEGY_BUG = 'bug';
import BugImage from "../../../res/img/bug.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_BUG] = {
	strategy: STRATEGY_BUG,
	image: {
		uri: IMAGE_BUG,
		resource: BugImage
	},
	data: {
		amount: 5,
		hurts: 0.1,
		deadSprite: SPRITE_TYPE_BUG_DEAD,
		consumes: [SPRITE_TYPE_POTASSIUM],
		carries: [SPRITE_TYPE_BUG_EGG],
		repelledBy: [SPRITE_TYPE_PURPLE_JELLY],
		poisonedBy: [SPRITE_TYPE_NECTAR_RED]
	}
};

export const SPRITE_TYPE_STAG_BEETLE = 'stag-beetle';
export const IMAGE_STAG_BEETLE = 'img/stag-beetle.svg';
import StagBeetleImage from "../../../res/img/stag-beetle.svg";

export const IMAGE_STAG_BEETLE_WALKING_1 = 'img/stag-beetle-walk-1.svg';
import StagBeetleWalking1Image from "../../../res/img/stag-beetle-walk-1.svg";
export const IMAGE_STAG_BEETLE_WALKING_2 = 'img/stag-beetle-walk-2.svg';
import StagBeetleWalking2Image from "../../../res/img/stag-beetle-walk-2.svg";

export const IMAGE_STAG_BEETLE_ATTACKING_1 = 'img/stag-beetle-attack-1.svg';
import StagBeetleAttacking1Image from "../../../res/img/stag-beetle-attack-1.svg";
export const IMAGE_STAG_BEETLE_ATTACKING_2 = 'img/stag-beetle-attack-2.svg';
import StagBeetleAttacking2Image from "../../../res/img/stag-beetle-attack-2.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_STAG_BEETLE] = {
	strategy: STRATEGY_BUG,
	image: {
		uri: IMAGE_STAG_BEETLE,
		resource: StagBeetleImage
	},
	data: {
		amount: BUG_MAX_AMOUNT,
		penetrable: false,
		hurts: 0.5,
		deadSprite: SPRITE_TYPE_BUG_DEAD,
		consumes: [SPRITE_TYPE_POTASSIUM, SPRITE_TYPE_NECTAR, SPRITE_TYPE_NECTAR_RED],
		attacks: [SPRITE_TYPE_TICK],
		carries: [SPRITE_TYPE_BUG_EGG, SPRITE_TYPE_BEE_EGG, SPRITE_TYPE_BEE_DEAD],
		repelledBy: [SPRITE_TYPE_YELLOW_JELLY]
	},
	animations: {
		walking: [
			{
				uri: IMAGE_STAG_BEETLE,
				resource: StagBeetleImage,
				frameRate: 5
			},
			{
				uri: IMAGE_STAG_BEETLE_WALKING_1,
				resource: StagBeetleWalking1Image
			},
			{
				uri: IMAGE_STAG_BEETLE_WALKING_2,
				resource: StagBeetleWalking2Image
			},
			{
				uri: IMAGE_STAG_BEETLE_WALKING_1,
				resource: StagBeetleWalking1Image
			}
		],
		attacking: [
			{
				uri: IMAGE_STAG_BEETLE,
				resource: StagBeetleImage,
				frameRate: 10
			},
			{
				uri: IMAGE_STAG_BEETLE_ATTACKING_1,
				resource: StagBeetleAttacking1Image
			},
			{
				uri: IMAGE_STAG_BEETLE_ATTACKING_2,
				resource: StagBeetleAttacking2Image
			},
			{
				uri: IMAGE_STAG_BEETLE_ATTACKING_1,
				resource: StagBeetleAttacking1Image
			}
		],
		running: [
			{
				uri: IMAGE_STAG_BEETLE,
				resource: StagBeetleImage,
				frameRate: 15
			},
			{
				uri: IMAGE_STAG_BEETLE_WALKING_1,
				resource: StagBeetleWalking1Image
			},
			{
				uri: IMAGE_STAG_BEETLE_WALKING_2,
				resource: StagBeetleWalking2Image
			},
			{
				uri: IMAGE_STAG_BEETLE_WALKING_1,
				resource: StagBeetleWalking1Image
			}
		]
	}
};

export const SPRITE_TYPE_ANT = 'ant';
export const STRATEGY_ANT = 'ant';
export const IMAGE_ANT = 'img/ant.svg';
import AntImage from "../../../res/img/ant.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_ANT] = {
	strategy: STRATEGY_ANT,
	image: {
		uri: IMAGE_ANT,
		resource: AntImage
	},
	data: {
		amount: 5,
		penetrable: true,
		hurts: 0.3,
		deadSprite: SPRITE_TYPE_BUG_DEAD,
		consumes: [SPRITE_TYPE_POTASSIUM, SPRITE_TYPE_NECTAR, SPRITE_TYPE_NECTAR_RED, SPRITE_TYPE_YELLOW_JELLY],
		carries: [SPRITE_TYPE_BUG_EGG, SPRITE_TYPE_BEE_EGG, SPRITE_TYPE_BUG_DEAD],
		repelledBy: [SPRITE_TYPE_YELLOW_JELLY]
	}
};

export const IMAGE_BUTTERFLY = 'img/butterfly.svg';
import ButterflyImage from "../../../res/img/butterfly.svg";

export const IMAGE_BUTTERFLY_FLYING_1 = 'img/butterfly-flight-1.svg';
import ButterflyFlying1Image from "../../../res/img/butterfly-flight-1.svg";
export const IMAGE_BUTTERFLY_FLYING_2 = 'img/butterfly-flight-2.svg';
import ButterflyFlying2Image from "../../../res/img/butterfly-flight-2.svg";
export const IMAGE_BUTTERFLY_FLYING_3 = 'img/butterfly-flight-3.svg';
import ButterflyFlying3Image from "../../../res/img/butterfly-flight-3.svg";

export const SPRITE_TYPE_BUTTERFLY = 'butterfly';

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_BUTTERFLY] = {
	strategy: STRATEGY_FLYING_BUG,
	data: {
		size: 2
	},
	image: {
		uri: IMAGE_BUTTERFLY,
		resource: ButterflyImage
	},
	animations: {
		flying: [
			{
				uri: IMAGE_BUTTERFLY_FLYING_1,
				resource: ButterflyFlying1Image,
				frameRate: 5
			},
			{
				uri: IMAGE_BUTTERFLY_FLYING_2,
				resource: ButterflyFlying2Image
			},
			{
				uri: IMAGE_BUTTERFLY_FLYING_3,
				resource: ButterflyFlying3Image
			},
			{
				uri: IMAGE_BUTTERFLY_FLYING_2,
				resource: ButterflyFlying2Image
			}
		],
		landing: [
			{
				uri: IMAGE_BUTTERFLY_FLYING_1,
				resource: ButterflyFlying1Image,
				frameRate: 3
			},
			{
				uri: IMAGE_BUTTERFLY_FLYING_2,
				resource: ButterflyFlying2Image
			},
			{
				uri: IMAGE_BUTTERFLY_FLYING_3,
				resource: ButterflyFlying3Image
			},
			{
				uri: IMAGE_BUTTERFLY_FLYING_2,
				resource: ButterflyFlying2Image
			}
		]
	}
};

export const IMAGE_HORNET = 'img/hornet.svg';
import HornetImage from "../../../res/img/hornet.svg";

export const IMAGE_HORNET_FLIGHT_1 = 'img/hornet-flight-1.svg';
import HornetFlight1Image from "../../../res/img/hornet-flight-1.svg";
export const IMAGE_HORNET_FLIGHT_2 = 'img/hornet-flight-2.svg';
import HornetFlight2Image from "../../../res/img/hornet-flight-2.svg";
export const IMAGE_HORNET_FLIGHT_3 = 'img/hornet-flight-3.svg';
import HornetFlight3Image from "../../../res/img/hornet-flight-3.svg";

export const IMAGE_HORNET_LANDING_1 = 'img/hornet-landing-1.svg';
import HornetLanding1Image from "../../../res/img/hornet-landing-1.svg";
export const IMAGE_HORNET_LANDING_2 = 'img/hornet-landing-2.svg';
import HornetLanding2Image from "../../../res/img/hornet-landing-2.svg";

export const IMAGE_HORNET_ATTACKING_1 = 'img/hornet-attack-1.svg';
import HornetAttacking1Image from "../../../res/img/hornet-attack-1.svg";
export const IMAGE_HORNET_ATTACKING_2 = 'img/hornet-attack-2.svg';
import HornetAttacking2Image from "../../../res/img/hornet-attack-2.svg";

export const SPRITE_TYPE_HORNET = 'hornet';

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_HORNET] = {
	strategy: STRATEGY_FLYING_BUG,
	data: {
		size: 2,
		hurts: 0.04,
		stayHome: true
	},
	image: {
		uri: IMAGE_HORNET,
		resource: HornetImage
	},
	animations: {
		flying: [
			{
				uri: IMAGE_HORNET_FLIGHT_1,
				resource: HornetFlight1Image,
				frameRate: 60
			},
			{
				uri: IMAGE_HORNET_FLIGHT_2,
				resource: HornetFlight2Image
			},
			{
				uri: IMAGE_HORNET_FLIGHT_3,
				resource: HornetFlight3Image
			},
			{
				uri: IMAGE_HORNET_FLIGHT_2,
				resource: HornetFlight2Image
			},
		],
		landing: [
			{
				uri: IMAGE_HORNET_LANDING_1,
				resource: HornetLanding1Image,
				frameRate: 5
			},
			{
				uri: IMAGE_HORNET_LANDING_2,
				resource: HornetLanding2Image
			}
		],
		attacking: [
			{
				uri: IMAGE_HORNET_ATTACKING_1,
				resource: HornetAttacking1Image,
				frameRate: 5
			},
			{
				uri: IMAGE_HORNET_ATTACKING_2,
				resource: HornetAttacking2Image
			}
		]
	}
};

export const SPRITE_TYPE_TOAD = 'toad';
export const STRATEGY_TOAD = 'toad';
export const IMAGE_TOAD_HEAD = 'img/toad-head.svg';
import ToadHeadImage from "../../../res/img/toad-head.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_TOAD] = {
	strategy: STRATEGY_TOAD,
	image: {
		uri: IMAGE_TOAD_HEAD,
		resource: ToadHeadImage
	},
};

export const SPRITE_TYPE_TOAD_BODY = 'toad-body';
export const IMAGE_TOAD_BODY = 'img/toad-body.svg';
import ToadBodyImage from "../../../res/img/toad-body.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_TOAD_BODY] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_TOAD_BODY,
		resource: ToadBodyImage
	},
};

export const SPRITE_TYPE_TOAD_TONGUE = 'toad-tongue';
export const IMAGE_TOAD_TONGUE = 'img/toad-tongue.svg';
import ToadTongueImage from "../../../res/img/toad-tongue.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_TOAD_TONGUE] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_TOAD_TONGUE,
		resource: ToadTongueImage
	},
};

export const SPRITE_TYPE_TOAD_HEAD_OPEN = 'toad-head-open';
export const IMAGE_TOAD_HEAD_OPEN = 'img/toad-head-open.svg';
import ToadHeadOpenImage from "../../../res/img/toad-head-open.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_TOAD_HEAD_OPEN] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_TOAD_HEAD_OPEN,
		resource: ToadHeadOpenImage
	},
};

export const SPRITE_TYPE_GRASSHOPPER_BODY = 'grasshopper-body';
export const IMAGE_GRASSHOPPER_BODY = 'img/grasshopper-body.svg';
import GrasshopperBodyImage from "../../../res/img/grasshopper-body.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_GRASSHOPPER_BODY] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_GRASSHOPPER_BODY,
		resource: GrasshopperBodyImage
	}
};

export const SPRITE_TYPE_GRASSHOPPER = 'grasshopper';
export const IMAGE_GRASSHOPPER_HEAD = 'img/grasshopper-head.svg';
import GrasshopperHeadImage from "../../../res/img/grasshopper-head.svg";
export const STRATEGY_GRASSHOPPER = 'grasshopper';

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_GRASSHOPPER] = {
	strategy: STRATEGY_GRASSHOPPER,
	image: {
		uri: IMAGE_GRASSHOPPER_HEAD,
		resource: GrasshopperHeadImage
	},
	data: {
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
		hintSize: 3,
		hintFrameRate: 2,
		hintDirection: NEIGHBOR_TYPE_LOWER_LEFT,
	}
};

export const SPRITE_TYPE_SNAIL = 'snail';
export const STRATEGY_SNAIL = 'snail';

export const IMAGE_SNAIL_STANDING = 'img/snail-standing.svg';
import SnailStandingImage from "../../../res/img/snail-standing.svg";
export const IMAGE_SNAIL_STANDING_2 = 'img/snail-standing-2.svg';
import SnailStandingImage2 from "../../../res/img/snail-standing-2.svg";
export const IMAGE_SNAIL_STANDING_3 = 'img/snail-standing-3.svg';
import SnailStandingImage3 from "../../../res/img/snail-standing-3.svg";

export const IMAGE_SNAIL_WALKING_1 = 'img/snail-walk-1.svg';
import SnailWalkingImage1 from "../../../res/img/snail-walk-1.svg";
export const IMAGE_SNAIL_WALKING_2 = 'img/snail-walk-2.svg';
import SnailWalkingImage2 from "../../../res/img/snail-walk-2.svg";

export const IMAGE_SNAIL_HIDING_1 = 'img/snail-hiding-1.svg';
import SnailHidingImage1 from "../../../res/img/snail-hiding-1.svg";
export const IMAGE_SNAIL_HIDING_2 = 'img/snail-hiding-2.svg';
import SnailHidingImage2 from "../../../res/img/snail-hiding-2.svg";
export const IMAGE_SNAIL_HIDING_3 = 'img/snail-hiding-3.svg';
import SnailHidingImage3 from "../../../res/img/snail-hiding-3.svg";
export const IMAGE_SNAIL_HIDING_4 = 'img/snail-hiding-4.svg';
import SnailHidingImage4 from "../../../res/img/snail-hiding-4.svg";
export const IMAGE_SNAIL_HIDDEN_1 = 'img/snail-hidden-1.svg';
import SnailHiddenImage1 from "../../../res/img/snail-hidden-1.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_SNAIL] = {
	strategy: STRATEGY_SNAIL,
	image: {
		uri: IMAGE_SNAIL_HIDDEN_1,
		resource: SnailHiddenImage1
	},
	data: {
		amount: 3
	},
	animations: {
		walking: [
			{
				uri: IMAGE_SNAIL_STANDING,
				resource: SnailStandingImage,
				frameRate: 5
			},
			{
				uri: IMAGE_SNAIL_WALKING_1,
				resource: SnailWalkingImage1
			},
			{
				uri: IMAGE_SNAIL_WALKING_2,
				resource: SnailWalkingImage2
			},
			{
				uri: IMAGE_SNAIL_WALKING_1,
				resource: SnailWalkingImage1
			},
		],
		hiding: [
			{
				uri: IMAGE_SNAIL_HIDING_1,
				resource: SnailHidingImage1,
				frameRate: 10,
				repeat: false
			},
			{
				uri: IMAGE_SNAIL_HIDING_2,
				resource: SnailHidingImage2
			},
			{
				uri: IMAGE_SNAIL_HIDING_3,
				resource: SnailHidingImage3
			},
			{
				uri: IMAGE_SNAIL_HIDING_4,
				resource: SnailHidingImage4
			},
			{
				uri: IMAGE_SNAIL_HIDDEN_1,
				resource: SnailHiddenImage1
			}
		],
		unhiding: [
			{
				uri: IMAGE_SNAIL_HIDDEN_1,
				resource: SnailHiddenImage1,
				frameRate: 5,
				repeat: false
			},
			{
				uri: IMAGE_SNAIL_HIDING_4,
				resource: SnailHidingImage4,
			},
			{
				uri: IMAGE_SNAIL_HIDING_3,
				resource: SnailHidingImage3
			},
			{
				uri: IMAGE_SNAIL_HIDING_2,
				resource: SnailHidingImage2
			},
			{
				uri: IMAGE_SNAIL_HIDING_1,
				resource: SnailHidingImage1
			},
			{
				uri: IMAGE_SNAIL_STANDING,
				resource: SnailStandingImage
			}
		],
		hidden: [
			{
				uri: IMAGE_SNAIL_HIDDEN_1,
				resource: SnailHiddenImage1
			}
		],
		standing: [
			{
				uri: IMAGE_SNAIL_STANDING,
				resource: SnailStandingImage,
				frameRate: 1,
				repeat: true
			},
			{
				uri: IMAGE_SNAIL_STANDING_2,
				resource: SnailStandingImage2,
			},
			{
				uri: IMAGE_SNAIL_STANDING_3,
				resource: SnailStandingImage3,
			},
			{
				uri: IMAGE_SNAIL_STANDING_2,
				resource: SnailStandingImage2,
			}
		]
	}
};


export const SPRITE_TYPE_BUTTERFLY_LARVA = 'butterfly-larva';
export const IMAGE_BUTTERFLY_LARVA = 'img/butterfly-larva.svg';
import ButterflyLarvaImage from "../../../res/img/butterfly-larva.svg";

export const IMAGE_BUTTERFLY_LARVA_WALKING_1 = 'img/butterfly-larva-walk-1.svg';
import ButterflyLarvaWalkingImage1 from "../../../res/img/butterfly-larva-walk-1.svg";
export const IMAGE_BUTTERFLY_LARVA_WALKING_2 = 'img/butterfly-larva-walk-2.svg';
import ButterflyLarvaWalkingImage2 from "../../../res/img/butterfly-larva-walk-2.svg";
export const IMAGE_BUTTERFLY_LARVA_WALKING_3 = 'img/butterfly-larva-walk-3.svg';
import ButterflyLarvaWalkingImage3 from "../../../res/img/butterfly-larva-walk-3.svg";
export const IMAGE_BUTTERFLY_LARVA_WALKING_4 = 'img/butterfly-larva-walk-4.svg';
import ButterflyLarvaWalkingImage4 from "../../../res/img/butterfly-larva-walk-4.svg";

export const IMAGE_BUTTERFLY_LARVA_HIDING_1 = 'img/butterfly-larva-hiding-1.svg';
import ButterflyLarvaHidingImage1 from "../../../res/img/butterfly-larva-hiding-1.svg";
export const IMAGE_BUTTERFLY_LARVA_HIDING_2 = 'img/butterfly-larva-hiding-2.svg';
import ButterflyLarvaHidingImage2 from "../../../res/img/butterfly-larva-hiding-2.svg";
export const IMAGE_BUTTERFLY_LARVA_HIDING_3 = 'img/butterfly-larva-hiding-3.svg';
import ButterflyLarvaHidingImage3 from "../../../res/img/butterfly-larva-hiding-3.svg";

export const IMAGE_BUTTERFLY_LARVA_HIDDEN = 'img/butterfly-larva-hidden.svg';
import ButterflyLarvaHiddenImage from "../../../res/img/butterfly-larva-hidden.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_BUTTERFLY_LARVA] = {
	strategy: STRATEGY_SNAIL,
	image: {
		uri: IMAGE_BUTTERFLY_LARVA_HIDDEN,
		resource: ButterflyLarvaHiddenImage
	},
	data: {amount: 5, penetrable: false, timeout: 2000},
	animations: {
		walking: [
			{
				uri: IMAGE_BUTTERFLY_LARVA,
				resource: ButterflyLarvaImage,
				frameRate: 6
			},
			{
				uri: IMAGE_BUTTERFLY_LARVA_WALKING_1,
				resource: ButterflyLarvaWalkingImage1
			},
			{
				uri: IMAGE_BUTTERFLY_LARVA_WALKING_2,
				resource: ButterflyLarvaWalkingImage2
			},
			{
				uri: IMAGE_BUTTERFLY_LARVA_WALKING_3,
				resource: ButterflyLarvaWalkingImage3
			},
			{
				uri: IMAGE_BUTTERFLY_LARVA_WALKING_4,
				resource: ButterflyLarvaWalkingImage4
			},
			{
				uri: IMAGE_BUTTERFLY_LARVA_WALKING_2,
				resource: ButterflyLarvaWalkingImage2
			}
		],
		hiding: [
			{
				uri: IMAGE_BUTTERFLY_LARVA_HIDING_1,
				resource: ButterflyLarvaHidingImage1,
				frameRate: 8,
				repeat: false
			},
			{
				uri: IMAGE_BUTTERFLY_LARVA_HIDING_2,
				resource: ButterflyLarvaHidingImage2
			},
			{
				uri: IMAGE_BUTTERFLY_LARVA_HIDING_3,
				resource: ButterflyLarvaHidingImage3
			},
			{
				uri: IMAGE_BUTTERFLY_LARVA_HIDDEN,
				resource: ButterflyLarvaHiddenImage
			},
		],
		unhiding: [
			{
				uri: IMAGE_BUTTERFLY_LARVA_HIDDEN,
				resource: ButterflyLarvaHiddenImage,
				frameRate: 5,
				repeat: false
			},
			{
				uri: IMAGE_BUTTERFLY_LARVA_HIDING_3,
				resource: ButterflyLarvaHidingImage3
			},
			{
				uri: IMAGE_BUTTERFLY_LARVA_HIDING_2,
				resource: ButterflyLarvaHidingImage2
			},
			{
				uri: IMAGE_BUTTERFLY_LARVA_HIDING_1,
				resource: ButterflyLarvaHidingImage1
			},
			{
				uri: IMAGE_BUTTERFLY_LARVA,
				resource: ButterflyLarvaImage,
			},
		],
		hidden: [
			{
				uri: IMAGE_BUTTERFLY_LARVA_HIDDEN,
				resource: ButterflyLarvaHiddenImage
			}
		],
		standing: [
			{
				uri: IMAGE_BUTTERFLY_LARVA,
				resource: ButterflyLarvaImage,
				repeat: false
			}
		]
	}
};

export const IMAGE_TICK_DEAD = 'img/tick-dead.svg';
import TickDeadImage from "../../../res/img/tick-dead.svg";

export const SPRITE_TYPE_TICK_DEAD = 'tick-dead';

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_TICK_DEAD] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_TICK_DEAD,
		resource: TickDeadImage
	},
};

export const IMAGE_TICK_STANDING_1 = 'img/tick.svg';
import TickStandingImage1 from "../../../res/img/tick.svg";

export const IMAGE_TICK_WALKING_1 = 'img/tick-walk-1.svg';
import TickWalkingImage1 from "../../../res/img/tick-walk-1.svg";
export const IMAGE_TICK_WALKING_2 = 'img/tick-walk-2.svg';
import TickWalkingImage2 from "../../../res/img/tick-walk-2.svg";

export const IMAGE_TICK_HIDING_1 = 'img/tick-hiding-1.svg';
import TickHidingImage1 from "../../../res/img/tick-hiding-1.svg";
export const IMAGE_TICK_HIDING_2 = 'img/tick-hiding-2.svg';
import TickHidingImage2 from "../../../res/img/tick-hiding-2.svg";

export const IMAGE_TICK_HIDDEN = 'img/tick-hidden.svg';
import TickHiddenImage from "../../../res/img/tick-hidden.svg";

export const IMAGE_TICK_DYING_1 = 'img/tick-dying-1.svg';
import TickDyingImage1 from "../../../res/img/tick-dying-1.svg";
export const IMAGE_TICK_DYING_2 = 'img/tick-dying-2.svg';
import TickDyingImage2 from "../../../res/img/tick-dying-2.svg";
export const IMAGE_TICK_DYING_3 = 'img/tick-dying-3.svg';
import TickDyingImage3 from "../../../res/img/tick-dying-3.svg";
export const IMAGE_TICK_DYING_4 = 'img/tick-dying-4.svg';
import TickDyingImage4 from "../../../res/img/tick-dying-4.svg";
export const IMAGE_TICK_DYING_5 = 'img/tick-dying-5.svg';
import TickDyingImage5 from "../../../res/img/tick-dying-5.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_TICK] = {
	strategy: STRATEGY_SNAIL,
	image: {
		uri: IMAGE_TICK_HIDDEN,
		resource: TickHiddenImage
	},
	data: {
		amount: BUG_MAX_AMOUNT,
		deadSprite: SPRITE_TYPE_TICK_DEAD,
	},
	animations: {
		walking: [
			{
				uri: IMAGE_TICK_STANDING_1,
				resource: TickStandingImage1,
				frameRate: 5
			},
			{
				uri: IMAGE_TICK_WALKING_1,
				resource: TickWalkingImage1,
			},
			{
				uri: IMAGE_TICK_WALKING_2,
				resource: TickWalkingImage2,
			},
			{
				uri: IMAGE_TICK_WALKING_1,
				resource: TickWalkingImage1,
			},
		],
		hiding: [
			{
				uri: IMAGE_TICK_STANDING_1,
				resource: TickStandingImage1,
				frameRate: 10,
				repeat: false
			},
			{
				uri: IMAGE_TICK_HIDING_1,
				resource: TickHidingImage1,
			},
			{
				uri: IMAGE_TICK_HIDING_2,
				resource: TickHidingImage2,
			},
			{
				uri: IMAGE_TICK_HIDDEN,
				resource: TickHiddenImage,
			}
		],
		unhiding: [
			{
				uri: IMAGE_TICK_HIDDEN,
				resource: TickHiddenImage,
				frameRate: 5,
				repeat: false
			},
			{
				uri: IMAGE_TICK_HIDING_2,
				resource: TickHidingImage2,
			},
			{
				uri: IMAGE_TICK_HIDING_1,
				resource: TickHidingImage1,
			},
			{
				uri: IMAGE_TICK_STANDING_1,
				resource: TickStandingImage1,

			}
		],
		hidden: [
			{
				uri: IMAGE_TICK_HIDDEN,
				resource: TickHiddenImage,
			}
		],
		standing: [
			{
				uri: IMAGE_TICK_STANDING_1,
				resource: TickStandingImage1
			}
		],
		dying: [
			{
				uri: IMAGE_TICK_HIDDEN,
				resource: TickHiddenImage,
				frameRate: 5,
				repeat: false
			},
			{
				uri: IMAGE_TICK_DYING_1,
				resource: TickDyingImage1,
			},
			{
				uri: IMAGE_TICK_DYING_2,
				resource: TickDyingImage2,
			},
			{
				uri: IMAGE_TICK_DYING_3,
				resource: TickDyingImage3,
			},
			{
				uri: IMAGE_TICK_DYING_4,
				resource: TickDyingImage4,
			},
			{
				uri: IMAGE_TICK_DYING_5,
				resource: TickDyingImage5,
			},
			{
				uri: IMAGE_TICK_DEAD,
				resource: TickDeadImage,
			},
		],
	}
};

export const SPRITE_TYPE_BAIT_BODY = 'bait-body';
export const IMAGE_BAIT_BODY = 'img/bait-body.svg';
import BaitBodyImage from "../../../res/img/bait-body.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_BAIT_BODY] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_BAIT_BODY,
		resource: BaitBodyImage
	},
	data: {
		hurts: 0.5
	}
};

export const STRATEGY_BAIT = 'bait';
export const SPRITE_TYPE_BAIT = 'bait';
export const IMAGE_BAIT = 'img/bait.svg';
import BaitImage from "../../../res/img/bait.svg";
import {
	IMAGE_HINT_BUGS_AND_BEETLES_1, IMAGE_HINT_BUGS_AND_BEETLES_10,
	IMAGE_HINT_BUGS_AND_BEETLES_2,
	IMAGE_HINT_BUGS_AND_BEETLES_3,
	IMAGE_HINT_BUGS_AND_BEETLES_4,
	IMAGE_HINT_BUGS_AND_BEETLES_5,
	IMAGE_HINT_BUGS_AND_BEETLES_6,
	IMAGE_HINT_BUGS_AND_BEETLES_7,
	IMAGE_HINT_BUGS_AND_BEETLES_8,
	IMAGE_HINT_BUGS_AND_BEETLES_9
} from "./SpriteStyleHints";
import {NEIGHBOR_TYPE_LOWER_LEFT, NEIGHBOR_TYPE_UP} from "../../model/GridModel";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_BAIT] = {
	strategy: STRATEGY_BAIT,
	image: {
		uri: IMAGE_BAIT,
		resource: BaitImage
	},
	data: {
		hurts: 0.3
	}
};


export const STRATEGY_CARNI_PLANT = 'carni-plant';
export const SPRITE_TYPE_CARNI_PLANT = 'carni-plant';

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_CARNI_PLANT] = {
	strategy: STRATEGY_CARNI_PLANT,
	data: {
		hurts: 0.1,
		monitoredRange: 3,
		affectedRange: 4
	}
};
