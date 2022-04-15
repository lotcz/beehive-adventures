export const MUSIC_STYLES = [];

export const MUSIC_NONE = '--none--';

MUSIC_STYLES[MUSIC_NONE] = {
	url: null
};

export const MUSIC_BIRDS = 'birds-chirping.mp3';
import BirdsChirpingMusic from "../../res/sound/birds-chirping.mp3";

MUSIC_STYLES[MUSIC_BIRDS] = {
	url: MUSIC_BIRDS,
	resource: BirdsChirpingMusic
};

export const MUSIC_CAVE = 'the-cave.mp3';
import CaveMusic from "../../res/sound/the-cave.mp3";

MUSIC_STYLES[MUSIC_CAVE] = {
	url: MUSIC_CAVE,
	resource: CaveMusic
};

export const MUSIC_HAPPY_TUNE = 'happy-tune.mp3';
import HappyTuneMusic from "../../res/sound/happy-tune.mp3";

MUSIC_STYLES[MUSIC_HAPPY_TUNE] = {
	url: MUSIC_HAPPY_TUNE,
	resource: HappyTuneMusic
};

export const MUSIC_SPRING = 'spring-of-spring.mp3';
import SpringMusic from "../../res/sound/spring-of-spring.mp3";

MUSIC_STYLES[MUSIC_SPRING] = {
	url: MUSIC_SPRING,
	resource: SpringMusic
};

export const MUSIC_TYPES = Object.keys(MUSIC_STYLES).sort();
