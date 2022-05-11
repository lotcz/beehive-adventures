import {
	STRATEGY_DOOR_MOUTH,
	STRATEGY_DOOR_MOUTH_TRIGGER,
	STRATEGY_EMITTER,
	STRATEGY_EMPTY,
	STRATEGY_STATIC
} from "./SpriteStyleBasic";
import {SPRITE_TYPE_POTASSIUM} from "./SpriteStyleMinerals";
import {GROUND_TYPE_WAX_DOOR} from "../GroundStyle";

export const SPRITE_STYLES_SPECIAL = [];

export const SPRITE_TYPE_EXIT = 'exit';
export const STRATEGY_EXIT = 'exit';
export const IMAGE_EXIT = 'img/exit.svg';
import ExitImage from "../../../res/img/exit.svg";

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_EXIT] = {
	strategy: STRATEGY_EXIT,
	image: {
		uri: IMAGE_EXIT,
		resource: ExitImage
	},
	data: {level: 'level-0'}
};

export const SPRITE_TYPE_RESPAWN = 'respawn';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_RESPAWN] = {
	strategy: STRATEGY_EMPTY,
	data: {name: 'start'}
};

export const SPRITE_TYPE_EMITTER = 'emitter';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_EMITTER] = {
	strategy: STRATEGY_EMITTER,
	data: {type:'water', timeout:3000, max:-1}
};

export const SPRITE_TYPE_DOOR_SLOT = 'door-slot';
export const STRATEGY_DOOR_SLOT = 'door-slot';
import KeyholeImage from "../../../res/img/keyhole.svg";
export const IMAGE_KEYHOLE = 'img/keyhole.svg';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_DOOR_SLOT] = {
	strategy: STRATEGY_DOOR_SLOT,
	data: {key: SPRITE_TYPE_POTASSIUM, door: GROUND_TYPE_WAX_DOOR, size:4},
	image: {
		uri: IMAGE_KEYHOLE,
		resource: KeyholeImage
	},
};

export const SPRITE_TYPE_CARNI_PLANT_MOUTH = 'carni-plant-mouth';
export const IMAGE_CARNI_PLANT_MOUTH  = 'img/carni-plant-mouth.svg';
import CarniPlantMouthImage from "../../../res/img/carni-plant-mouth.svg";

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_CARNI_PLANT_MOUTH] = {
	strategy: STRATEGY_DOOR_MOUTH,
	image: {
		uri: IMAGE_CARNI_PLANT_MOUTH,
		resource: CarniPlantMouthImage
	},
};

export const SPRITE_TYPE_WAX_DOOR_MOUTH = 'wax-door-mouth';
export const IMAGE_WAX_DOOR_MOUTH  = 'img/wax-door-mouth.svg';
import WaxDoorMouthImage from "../../../res/img/wax-door-mouth.svg";

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_WAX_DOOR_MOUTH] = {
	strategy: STRATEGY_DOOR_MOUTH,
	image: {
		uri: IMAGE_WAX_DOOR_MOUTH,
		resource: WaxDoorMouthImage
	},
	data: {
		crawlable: true
	}
};

export const SPRITE_TYPE_SOIL_DOOR_MOUTH = 'soil-door-mouth';
export const IMAGE_SOIL_DOOR_MOUTH  = 'img/soil-door-mouth.svg';
import SoilDoorMouthImage from "../../../res/img/soil-door-mouth.svg";

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_SOIL_DOOR_MOUTH] = {
	strategy: STRATEGY_DOOR_MOUTH,
	image: {
		uri: IMAGE_SOIL_DOOR_MOUTH,
		resource: SoilDoorMouthImage
	},
	data: {
		crawlable: true
	}
};

export const SPRITE_TYPE_ROCK_DOOR_MOUTH = 'rock-door-mouth';
export const IMAGE_ROCK_DOOR_MOUTH  = 'img/rock-door-mouth.svg';
import RockDoorMouthImage from "../../../res/img/rock-door-mouth.svg";

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_ROCK_DOOR_MOUTH] = {
	strategy: STRATEGY_DOOR_MOUTH,
	image: {
		uri: IMAGE_ROCK_DOOR_MOUTH,
		resource: RockDoorMouthImage
	},
	data: {
		crawlable: true
	}
};

export const SPRITE_TYPE_DOOR_MOUTH_TRIGGER = 'door-mouth-trigger';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_DOOR_MOUTH_TRIGGER] = {
	strategy: STRATEGY_DOOR_MOUTH_TRIGGER,
};

export const SPRITE_TYPE_LEVER_ON = 'lever-on';
import LeverOnImage from "../../../res/img/lever-on.svg";
export const IMAGE_LEVER_ON = 'img/lever-on.svg';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_LEVER_ON] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_LEVER_ON,
		resource: LeverOnImage
	}
};

export const SPRITE_TYPE_LEVER_OFF = 'lever-off';
import LeverOffImage from "../../../res/img/lever-off.svg";
export const IMAGE_LEVER_OFF = 'img/lever-off.svg';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_LEVER_OFF] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_LEVER_OFF,
		resource: LeverOffImage
	}
};

export const SPRITE_TYPE_LEVER = 'lever';
export const STRATEGY_SWITCH = 'switch';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_LEVER] = {
	strategy: STRATEGY_SWITCH,
	image: {
		uri: IMAGE_LEVER_OFF,
		resource: LeverOffImage
	},
	data: {
		imageOn: IMAGE_LEVER_ON,
		imageOff: IMAGE_LEVER_OFF
	}
};

export const SPRITE_TYPE_DOOR_LEVER = 'door-lever';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_DOOR_LEVER] = {
	strategy: STRATEGY_SWITCH,
	image: {
		uri: IMAGE_LEVER_OFF,
		resource: LeverOffImage
	},
	data: {
		imageOn: IMAGE_LEVER_ON,
		imageOff: IMAGE_LEVER_OFF,
		controlDoors: true
	}
};

export const SPRITE_TYPE_WAX_LEVER_ON = 'wax-lever-on';
import WaxLeverOnImage from "../../../res/img/wax-lever-on.svg";
export const IMAGE_WAX_LEVER_ON = 'img/wax-lever-on.svg';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_WAX_LEVER_ON] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_WAX_LEVER_ON,
		resource: WaxLeverOnImage
	}
};

export const SPRITE_TYPE_WAX_LEVER_OFF = 'wax-lever-off';
import WaxLeverOffImage from "../../../res/img/wax-lever-off.svg";
export const IMAGE_WAX_LEVER_OFF = 'img/wax-lever-off.svg';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_WAX_LEVER_OFF] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_WAX_LEVER_OFF,
		resource: WaxLeverOffImage
	}
};

export const SPRITE_TYPE_WAX_DOOR_LEVER = 'wax-door-lever';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_WAX_DOOR_LEVER] = {
	strategy: STRATEGY_SWITCH,
	image: {
		uri: IMAGE_WAX_LEVER_OFF,
		resource: WaxLeverOffImage
	},
	data: {
		imageOn: IMAGE_WAX_LEVER_ON,
		imageOff: IMAGE_WAX_LEVER_OFF,
		controlDoors: true
	}
};

export const SPRITE_TYPE_GRASS_LEVER_ON = 'grass-lever-on';
import GrassLeverOnImage from "../../../res/img/grass-lever-on.svg";
export const IMAGE_GRASS_LEVER_ON = 'img/grass-lever-on.svg';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_GRASS_LEVER_ON] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_GRASS_LEVER_ON,
		resource: GrassLeverOnImage
	}
};

export const SPRITE_TYPE_GRASS_LEVER_OFF = 'grass-lever-off';
import GrassLeverOffImage from "../../../res/img/grass-lever-off.svg";
export const IMAGE_GRASS_LEVER_OFF = 'img/grass-lever-off.svg';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_GRASS_LEVER_OFF] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_GRASS_LEVER_OFF,
		resource: GrassLeverOffImage
	}
};

export const SPRITE_TYPE_GRASS_DOOR_LEVER = 'grass-door-lever';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_GRASS_DOOR_LEVER] = {
	strategy: STRATEGY_SWITCH,
	image: {
		uri: IMAGE_GRASS_LEVER_OFF,
		resource: GrassLeverOffImage
	},
	data: {
		imageOn: IMAGE_GRASS_LEVER_ON,
		imageOff: IMAGE_GRASS_LEVER_OFF,
		controlDoors: true
	}
};

export const SPRITE_TYPE_BASIC_LEVER_ON = 'basic-lever-on';
import BasicLeverOnImage from "../../../res/img/basic-lever-on.svg";
export const IMAGE_BASIC_LEVER_ON = 'img/basic-lever-on.svg';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_BASIC_LEVER_ON] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_BASIC_LEVER_ON,
		resource: BasicLeverOnImage
	}
};

export const SPRITE_TYPE_BASIC_LEVER_OFF = 'basic-lever-off';
import BasicLeverOffImage from "../../../res/img/basic-lever-off.svg";
export const IMAGE_BASIC_LEVER_OFF = 'img/basic-lever-off.svg';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_BASIC_LEVER_OFF] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_BASIC_LEVER_OFF,
		resource: BasicLeverOffImage
	}
};

export const SPRITE_TYPE_BASIC_DOOR_LEVER = 'basic-door-lever';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_BASIC_DOOR_LEVER] = {
	strategy: STRATEGY_SWITCH,
	image: {
		uri: IMAGE_BASIC_LEVER_OFF,
		resource: BasicLeverOffImage
	},
	data: {
		imageOn: IMAGE_BASIC_LEVER_ON,
		imageOff: IMAGE_BASIC_LEVER_OFF,
		controlDoors: true
	}
};

export const SPRITE_TYPE_WATER_CAP = 'water-cap';
export const IMAGE_WATER_CAP = 'img/water-cap.svg';
import WaterCapImage from "../../../res/img/water-cap.svg";

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_WATER_CAP] = {
	strategy: STRATEGY_EMITTER,
	data: {type:'water', timeout:3000, max:-1, penetrable: false, crawlable: false},
	image: {
		uri: IMAGE_WATER_CAP,
		resource: WaterCapImage,
	}
};

export const SPRITE_TYPE_SPIKE_SOIL = 'spike-soil';
export const IMAGE_SPIKE_SOIL = 'img/spike-soil.svg';
import SpikeSoilImage from "../../../res/img/spike-soil.svg";

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_SPIKE_SOIL] = {
	strategy: STRATEGY_STATIC,
	data: {
		penetrable: false,
		crawlable: false,
		hits: 0.5
	},
	image: {
		uri: IMAGE_SPIKE_SOIL,
		resource: SpikeSoilImage,
	}
};
