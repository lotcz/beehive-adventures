import Pixies from "../class/Pixies";
import {SPRITE_STYLES_SPECIAL} from "./sprites/SpriteStyleSpecial";
import {SPRITE_STYLES_OBJECTS} from "./sprites/SpriteStyleObjects";
import {SPRITE_STYLES_BEES} from "./sprites/SpriteStyleBees";
import {SPRITE_STYLES_MINERALS} from "./sprites/SpriteStyleMinerals";
import {SPRITE_STYLES_ANIMALS} from "./sprites/SpriteStyleAnimals";
import {SPRITE_STYLES_HINTS} from "./sprites/SpriteStyleHints";

export const SPRITE_STYLES = Object.assign([], SPRITE_STYLES_SPECIAL, SPRITE_STYLES_HINTS, SPRITE_STYLES_OBJECTS, SPRITE_STYLES_MINERALS, SPRITE_STYLES_ANIMALS, SPRITE_STYLES_BEES);
export const SPRITE_STRATEGIES = Pixies.toUnique(Object.values(SPRITE_STYLES).map((style) => style.strategy)).sort();
export const SPRITE_TYPES =  Object.keys(SPRITE_STYLES).sort();
