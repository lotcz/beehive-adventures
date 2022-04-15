import GridModel from "./GridModel";
import Vector2 from "../class/Vector2";
import ModelBase from "../class/ModelBase";
import DirtyValue from "../class/DirtyValue";
import PlantModel from "./PlantModel";
import GroundModel from "./GroundModel";
import SpriteModel from "./SpriteModel";
import CollectionModel from "./CollectionModel";
import ParallaxModel from "./ParallaxModel";
import BeeModel from "./BeeModel";
import {GROUND_TYPE_CLOUD, GROUND_TYPE_WATER} from "../builder/GroundStyle";
import {PARALLAX_HILLS, PARALLAX_STYLES} from "../builder/ParallaxStyle";
import ParallaxLayerModel from "./ParallaxLayerModel";
import HashTableModel from "./HashTableModel";
import {BEE_CENTER} from "../controller/BeeController";
import Pixies from "../class/Pixies";
import {
	IMAGE_BEE,
	IMAGE_BEE_CRAWL,
	IMAGE_BEE_CRAWL_1, IMAGE_BEE_WING,
	IMAGE_STARS_1,
	IMAGE_STARS_2, IMAGE_STARS_3
} from "../builder/sprites/SpriteStyleBees";
import {IMAGE_BEE_DEAD} from "../builder/sprites/SpriteStyleObjects";
import {SPRITE_TYPE_RESPAWN} from "../builder/sprites/SpriteStyleSpecial";
import {SPRITE_STYLES} from "../builder/SpriteStyle";

export default class LevelModel extends ModelBase {
	name;
	grid;
	parallaxType;
	parallax;
	plants;
	bee;
	sprites;
	resources;
	viewBoxScale;
	viewBoxSize;
	viewBoxCoordinates;
	clipAmount; // 0 - no clipping, 1 - whole image clipped
	isPlayable;
	exitLeft;
	exitRight;
	exitTop;
	exitBottom;

	constructor(state) {
		super();

		this.name = 'untitled';
		this.isPlayable = true;

		this.grid = new GridModel();
		this.addChild(this.grid);

		this.plants = new CollectionModel();
		this.addChild(this.plants);

		this.ground = new GroundModel();
		this.addChild(this.ground);

		this.sprites = new CollectionModel();
		this.addChild(this.sprites);

		this.resources = new HashTableModel();
		this.addChild(this.resources);

		this.viewBoxScale = new DirtyValue(1);
		this.addChild(this.viewBoxScale);
		this.viewBoxSize = new Vector2();
		this.addChild(this.viewBoxSize);
		this.viewBoxCoordinates = new Vector2();
		this.addChild(this.viewBoxCoordinates);
		this.clipAmount = new DirtyValue(0);
		this.addChild(this.clipAmount);
		this.clipCenter = new Vector2();
		this.addChild(this.clipCenter);

		this.exitLeft = '';
		this.exitRight = '';
		this.exitTop = '';
		this.exitBottom = '';

		this.parallaxType = new DirtyValue();
		this.addChild(this.parallaxType);
		this.parallaxType.addOnChangeListener((value) => this.setParallaxFromStyle(value));
		this.parallaxType.set(PARALLAX_HILLS);

		this.levelMusic = new DirtyValue(null);
		this.addChild(this.levelMusic);

		// auto recalculate parallax offset
		this.viewBoxChangedHandler = () => this.updateCameraOffset();
		this.viewBoxScale.addOnChangeListener(this.viewBoxChangedHandler);
		this.viewBoxSize.addOnChangeListener(this.viewBoxChangedHandler);
		this.viewBoxCoordinates.addOnChangeListener(this.viewBoxChangedHandler);

		if (state) {
			this.restoreState(state);
		}
	}

	getState() {
		this.sanitizeGround();
		return {
			name: this.name,
			grid: this.grid.getState(),
			parallaxType: this.parallaxType.get(),
			levelMusic: this.levelMusic.get(),
			plants: this.plants.getState(),
			ground: this.ground.getState(),
			sprites: this.sprites.getState(),
			resources: this.resources.getState(),
			viewBoxScale: this.viewBoxScale.get(),
			viewBoxSize: this.viewBoxSize.toArray(),
			viewBoxCoordinates: this.viewBoxCoordinates.toArray(),
			bee: this.bee ? this.bee.getState() : null,
			exitLeft: this.exitLeft,
			exitRight: this.exitRight,
			exitTop: this.exitTop,
			exitBottom: this.exitBottom,
		}
	}

	restoreState(state) {
		this.name = state.name;

		if (state.grid) this.grid.restoreState(state.grid);
		if (state.parallaxType) this.parallaxType.set(state.parallaxType);
		if (state.levelMusic) this.levelMusic.set(state.levelMusic);
		if (state.plants) this.plants.restoreState(state.plants, (p) => new PlantModel(p));
		if (state.ground) this.ground.restoreState(state.ground);
		if (state.bee) this.addBee(new BeeModel(state.bee));
		if (state.sprites) this.sprites.restoreState(state.sprites, (s) => new SpriteModel(s));
		if (state.resources) this.resources.restoreState(state.resources, (r) => null);
		if (state.viewBoxScale) this.viewBoxScale.set(state.viewBoxScale);
		if (state.viewBoxSize) this.viewBoxSize.restoreState(state.viewBoxSize);
		if (state.viewBoxCoordinates) this.viewBoxCoordinates.restoreState(state.viewBoxCoordinates);

		if (state.exitLeft) this.exitLeft = state.exitLeft;
		if (state.exitRight) this.exitRight = state.exitRight;
		if (state.exitTop) this.exitTop = state.exitTop;
		if (state.exitBottom) this.exitBottom = state.exitBottom;

	}

	setSize(size) {
		this.grid.size.set(size);
	}

	setViewBoxSize(size) {
		this.viewBoxSize.set(size);
	}

	setTileRadius(size) {
		this.grid.tileRadius.set(size);
	}

	setName(name) {
		this.name = name;
	}

	setViewBoxScale(scale) {
		this.viewBoxScale.set(scale);
	}

	setStart(position) {
		this.centerOnPosition(position);
	}

	createBee(position) {
		return new BeeModel({
			lives: 0,
			direction: [0,0],
			speed: 0,
			position: position.toArray(),
			coordinates: this.grid.getCoordinates(position),
			image: {
				coordinates: BEE_CENTER.clone(),
				scale: 1,
				flipped: false,
				rotation: 0,
				path: IMAGE_BEE
			},
			crawlingAnimation: {
				image: {
					coordinates: BEE_CENTER.clone(),
					scale: 1,
					flipped: false,
					rotation: 0,
					path: IMAGE_BEE_CRAWL
				},
				frameRate: 3,
				paths: [IMAGE_BEE_CRAWL, IMAGE_BEE_CRAWL_1]
			},
			starsAnimation: {
				image: {
					coordinates: BEE_CENTER.clone(),
					scale: 1,
					flipped: false,
					rotation: 0,
					path: IMAGE_STARS_1
				},
				paths: [IMAGE_STARS_1, IMAGE_STARS_2, IMAGE_STARS_3],
				frameRate: 5
			},
			leftWing: {
				coordinates: BEE_CENTER.clone(),
				scale: 1,
				flipped: false,
				rotation: 0,
				path: IMAGE_BEE_WING
			},
			rightWing: {
				coordinates: BEE_CENTER.clone(),
				scale: 1,
				flipped: true,
				rotation: 0,
				path: IMAGE_BEE_WING
			},
		});
	}

	addBee(bee) {
		this.addResource(IMAGE_BEE);
		this.addResource(IMAGE_BEE_DEAD);
		this.addResource(IMAGE_BEE_CRAWL);
		this.addResource(IMAGE_BEE_CRAWL_1);
		this.addResource(IMAGE_BEE_WING);
		this.addResource(IMAGE_STARS_1);
		this.addResource(IMAGE_STARS_2);
		this.addResource(IMAGE_STARS_3);

		this.removeBee();
		this.bee = bee;
		return this.addChild(this.bee);
	}

	createBeeOnPosition(position) {
		const bee = this.createBee(position);
		return this.addBee(bee);
	}

	removeBee() {
		if (this.bee) this.removeChild(this.bee);
		this.bee = null;
	}

	findRespawn(name) {
		return this.sprites.children.find((s) => s.type === SPRITE_TYPE_RESPAWN && s.data.name === name);
	}

	spawn(bee, name) {
		const respawn = this.findRespawn(name);
		if (!respawn) {
			console.log(`Respawn spot '${name}' not found!`);
			return;
		}
		if (bee) {
			bee.position.set(respawn.position);
			bee.coordinates.set(this.grid.getCoordinates(respawn.position));
		} else {
			bee = this.createBee(respawn.position);
		}
		this.addBee(bee);
	}

	addResource(uri) {
		this.resources.add(uri);
	}

	removeResource(uri) {
		this.resources.remove(uri);
	}

	isPositionInView(position) {
		const coords = this.grid.getCoordinates(position);
		return this.isCoordinateInView(coords);
	}

	isCoordinateInView(coords, threshold) {
		const min = this.viewBoxCoordinates.clone();
		const max = min.add(this.viewBoxSize.multiply(this.viewBoxScale.get()));
		if (!threshold) {
			threshold = this.grid.tileSize.clone();
		}
		return coords.x >= (min.x - threshold.x) && coords.x <= (max.x + threshold.x) && coords.y >= (min.y - threshold.y) && coords.y <= (max.y + threshold.y);
		return coords.x >= (min.x - threshold.x) && coords.x <= (max.x + threshold.x) && coords.y >= (min.y - threshold.y) && coords.y <= (max.y + threshold.y);
	}

	isValidPosition(position) {
		return this.grid.isValidPosition(position);
	}

	isPossibleExit(position) {
		if (this.grid.isValidPosition(position)) {
			return false;
		}
		if (position.x < 0 && this.exitLeft.length > 0) {
			return this.exitLeft;
		}
		if (position.x >= this.grid.size.x && this.exitRight.length > 0) {
			return this.exitRight;
		}
		if (position.y < 0 && this.exitTop.length > 0) {
			return this.exitTop;
		}
		if (position.y >= this.grid.size.y && this.exitBottom.length > 0) {
			return this.exitBottom;
		}
		return false;
	}

	isGround(position) {
		if (!this.isValidPosition(position)) {
			return false;
		}
		const visitors = this.grid.chessboard.getVisitors(position, (v) => v._is_ground === true && v.type !== GROUND_TYPE_WATER && v._is_penetrable === false);
		return visitors.length > 0;
	}

	isWater(position) {
		if (!this.isValidPosition(position)) {
			return false;
		}
		const visitors = this.grid.chessboard.getVisitors(position, (v) => v._is_ground === true && v.type === GROUND_TYPE_WATER);
		return visitors.length > 0;
	}

	isCloud(position) {
		if (!this.isValidPosition(position)) {
			return false;
		}
		const visitors = this.grid.chessboard.getVisitors(position, (v) => v._is_ground === true && v.type === GROUND_TYPE_CLOUD);
		return visitors.length > 0;
	}

	isPenetrable(position, exclude = null) {
		if (!this.isValidPosition(position)) {
			return false;
		}
		const visitors = this.grid.chessboard.getVisitors(position, (v) => (exclude === null || v != exclude) && v._is_penetrable === false);
		return visitors.length === 0;
	}

	isAir(position, exclude = null) {
		if (!this.isValidPosition(position)) {
			return false;
		}
		const visitors = this.grid.chessboard.getVisitors(position, (v) => (exclude === null || v != exclude) && (v._is_penetrable === false || v.type === GROUND_TYPE_WATER));
		return visitors.length === 0;
	}

	isCrawlable(position) {
		if (!this.isValidPosition(position)) {
			return false;
		}
		const visitors = this.grid.chessboard.getVisitors(position, (v) => v._is_penetrable === false && v._is_crawlable !== false);
		return visitors.length > 0;
	}

	getAbsoluteCoordinates(offset) {
		return new Vector2(this.viewBoxCoordinates.x + (offset.x * this.viewBoxScale.get()), this.viewBoxCoordinates.y + (offset.y * this.viewBoxScale.get()));
	}

	centerOnCoordinates(coordinates) {
		this.viewBoxCoordinates.setX(coordinates.x - (this.viewBoxScale.get() * this.viewBoxSize.x / 2));
		this.viewBoxCoordinates.setY(coordinates.y - (this.viewBoxScale.get() * this.viewBoxSize.y / 2));
	}

	centerOnPosition(position) {
		this.centerOnCoordinates(this.grid.getCoordinates(position));
	}

	centerOnLevel() {
		const max = this.grid.getMaxCoordinates();
		const aspectRatio = this.viewBoxSize.y / this.viewBoxSize.x;
		let newWidth = max.x;
		const newHeight = newWidth * aspectRatio;
		if (newHeight > max.y) {
			newWidth = max.y / aspectRatio;
		}
		this.viewBoxScale.set(newWidth / this.viewBoxSize.x);
		const center = new Vector2(Math.round(this.grid.size.x / 2), Math.round(this.grid.size.y / 2));
		this.centerOnPosition(center);
	}

	sanitizeViewBox() {
		const max = this.grid.getMaxCoordinates();
		if ((this.viewBoxSize.x * this.viewBoxScale.get()) > max.x) {
			this.viewBoxScale.set(max.x / this.viewBoxSize.x);
		}
		if ((this.viewBoxSize.y * this.viewBoxScale.get()) > max.y) {
			const before = this.getAbsoluteCoordinates(this.viewBoxSize.multiply(0.5));

			this.viewBoxScale.set(max.y / this.viewBoxSize.y);

			const after = this.getAbsoluteCoordinates(this.viewBoxSize.multiply(0.5));
			const diff = after.subtract(before);
			this.viewBoxCoordinates.set(this.viewBoxCoordinates.x - diff.x, this.viewBoxCoordinates.y - diff.y);

		}
		if (this.viewBoxCoordinates.x < 0) {
			this.viewBoxCoordinates.setX(0);
		}
		const maxX = max.x - (this.viewBoxSize.x * this.viewBoxScale.get());
		if (this.viewBoxCoordinates.x > maxX) {
			this.viewBoxCoordinates.setX(maxX);
		}
		if (this.viewBoxCoordinates.y < 0) {
			this.viewBoxCoordinates.setY(0);
		}
		const maxY = max.y - (this.viewBoxSize.y * this.viewBoxScale.get());
		if (this.viewBoxCoordinates.y > maxY) {
			this.viewBoxCoordinates.setY(maxY);
		}
	}

	updateCameraOffset() {
		const cameraCoordinates = this.viewBoxCoordinates.add(this.viewBoxSize.multiply(0.5).multiply(this.viewBoxScale.get()));
		const center = this.grid.getMaxCoordinates().multiply(0.5);
		const cameraOffset = cameraCoordinates.subtract(center);
		this.parallax.cameraOffset.set(cameraOffset);
	}

	addGroundTileFromStyle(position, groundType) {
		return this.ground.addTile({position: position.toArray(), type: groundType});
	}

	createSprite(position, strategy, data, path, scale, rotation, flipped, type) {
		if (path) {
			this.addResource(path);
		}
		const state = {
			position: position.toArray(),
			image: (path) ? {
				scale: scale,
				flipped: flipped,
				rotation: rotation,
				path: path
			} : null,
			strategy: strategy,
			data: data,
			type: type
		};
		return new SpriteModel(state);
	}

	addSprite(position, strategy, data, path, scale, rotation, flipped, type) {
		return this.sprites.add(this.createSprite(position, strategy, data, path, scale, rotation, flipped, type));
	}

	createSpriteFromStyle(position, spriteType) {
		const style = SPRITE_STYLES[spriteType];
		if (!style) {
			console.error(`Style for spriteType '${spriteType}' not found!`);
			return;
		}
		let uri = null;
		let scale = 1;
		if (style.image) {
			uri = style.image.uri;
			scale = style.image.scale || 1;
		}
		return this.createSprite(
			position,
			style.strategy,
			Pixies.clone(style.data),
			uri,
			scale,
			0,
			false,
			spriteType
		);
	}

	addSpriteFromStyle(position, spriteType) {
		return this.sprites.add(this.createSpriteFromStyle(position, spriteType));
	}

	addFallenItem(position, sprite) {
		let steps = 10;
		let down = this.grid.getNeighborDown(position);
		while (steps > 0 && this.isPenetrable(down)) {
			position = down;
			down = this.grid.getNeighborDown(position);
			steps--;
		}
		sprite.position.set(position);
		this.sprites.add(sprite);
	}

	setParallaxFromStyle(parallaxType) {
		const style = PARALLAX_STYLES[parallaxType];
		const parallax = new ParallaxModel();
		parallax.backgroundColor = style.background;
		parallax.backgroundColorEnd = style.backgroundEnd;

		if (this.parallax) {
			this.parallax.layers.forEach((l) => {
				this.removeResource(l.image.path.get());
			});
		}

		if (style.layers) {
			style.layers.forEach((l) => {
				const layer = new ParallaxLayerModel();
				layer.distance = l.distance;
				this.addResource(l.image.uri);
				layer.image.path.set(l.image.uri);
				parallax.layers.add(layer);
			});
		}

		this.parallax = parallax;
		this.updateCameraOffset();
		this.makeDirty();
	}

	sanitizeGround() {
		const outliers = this.ground.tiles.filter((t) => !this.isValidPosition(t.position));
		outliers.forEach((o) => this.ground.removeTile(o));
	}

}
