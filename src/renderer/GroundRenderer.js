import {
	CORNER_LEFT,
	CORNER_LOWER_LEFT,
	CORNER_LOWER_RIGHT,
	CORNER_RIGHT,
	CORNER_UPPER_LEFT,
	CORNER_UPPER_RIGHT
} from "../model/GridModel";
import {GROUND_STYLES} from "../builder/GroundStyle";
import DomRenderer from "./DomRenderer";
import {SVG} from "@svgdotjs/svg.js";
import ParallaxRenderer from "./ParallaxRenderer";
import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";

const DEBUG_GROUND_RENDERER = false;
const MAX_CANVAS_SIZE = new Vector2(8000, 8000);

export default class GroundRenderer extends DomRenderer {
	canvasHost;
	canvas;
	context2d;
	svgHost;
	group;
	parallax;
	cacheImage;
	cacheImageScale;

	constructor(game, ground, parallax, dom) {
		super(game, ground, dom);

		this.parallax = parallax;
		this.cacheImage = null;
		this.cacheImageScale = 1;
		this.updatingCache = false;

		this.onViewBoxSizeChangeHandler = () => this.updateViewBoxSize();
		this.onViewBoxScaleChangeHandler = () => this.updateImageCache(() => this.render());
	}

	activateInternal() {
		this.canvasHost = this.addChildElement('div', 'ground-canvas-host');
		this.canvas = this.createElement(this.canvasHost, 'canvas');
		this.context2d = this.canvas.getContext("2d");

		this.svgHost = this.addChildElement('div', 'ground-svg-host');

		this.updateViewBoxSize();
		this.level.viewBoxSize.addOnChangeListener(this.onViewBoxSizeChangeHandler);
		//this.level.viewBoxScale.addOnChangeListener(this.onViewBoxScaleChangeHandler);
	}

	deactivateInternal() {
		this.removeElement(this.canvasHost);
		this.canvasHost = null;
		this.removeElement(this.svgHost);
		this.svgHost = null;
		this.level.viewBoxSize.removeOnChangeListener(this.onViewBoxSizeChangeHandler);
		//this.level.viewBoxScale.removeOnChangeListener(this.onViewBoxScaleChangeHandler);
	}

	render() {
		if (!this.cacheImage) {
			this.updateImageCache(() => {
				console.log('Cache loaded');
				this.render();
			});
			return;
		}
		this.context2d.clearRect(
			0,
			0,
			this.level.viewBoxSize.x,
			this.level.viewBoxSize.y
		);
		this.context2d.drawImage(
			this.cacheImage,
			this.level.viewBoxCoordinates.x * this.cacheImageScale,
			this.level.viewBoxCoordinates.y * this.cacheImageScale,
			this.level.viewBoxSize.x * this.level.viewBoxScale.get() * this.cacheImageScale,
			this.level.viewBoxSize.y * this.level.viewBoxScale.get() * this.cacheImageScale,
			0,
			0,
			this.level.viewBoxSize.x,
			this.level.viewBoxSize.y
		);
	}

	updateViewBoxSize() {
		this.canvas.width = this.level.viewBoxSize.x;
		this.canvas.height = this.level.viewBoxSize.y;
	}

	updateImageCache(onReady) {
		if (this.updatingCache) return;
		this.updatingCache = true;

		if (DEBUG_GROUND_RENDERER) console.log('Rendering ground');

		this.draw = SVG().addTo(this.svgHost);

		this.group = this.draw.group();
		this.behind = this.group.group();
		this.back = this.group.group();
		this.front = this.group.group();

		const levelSize = this.grid.getMaxCoordinates();
		this.draw.size(levelSize.x, levelSize.y);
		this.draw.viewbox(
			0,
			0,
			levelSize.x,
			levelSize.y
		);
/*
		this.parallaxRenderer = new ParallaxRenderer(this.game, this.parallax, this.behind, this.behind);
		this.parallaxRenderer.activate();
		this.parallaxRenderer.render();
*/
		const tilesCollection = this.model.tiles;
		const remaining = [...tilesCollection.children];

		while (remaining.length > 0) {

			// find starting tile (must not have neighbors from all sides)
			let startTile = null;
			let i = 0;

			while (startTile === null && i < remaining.length) {
				const tile = remaining[i];
				const neighborPositions = this.grid.getNeighbors(tile.position);
				let neighborCount = neighborPositions.reduce((prev, current) => prev + this.chessboard.getVisitors(current, (v) => v.type === tile.type).length, 0);
				if (neighborCount < 6) {
					startTile = tile;
				}
				i++;
			}

			if (!startTile) {
				console.log('No start tile');
				return;
			}

			const style = GROUND_STYLES[startTile.type];

			if (!style) {
				console.error(`Style ${startTile.type} not present in GROUND_STYLES.`);
				return;
			}

			// remove all neighboring tiles of the same type recursively from remaining
			this.removeTileNeighbors(remaining, startTile);

			let currentCorner = CORNER_UPPER_RIGHT;
			let currentTile = startTile;

			// find starting corner
			while (!this.canUseCorner(currentTile, currentCorner)) {
				currentCorner = (currentCorner + 1) % 6;
			}

			const startCorner = currentCorner;

			if (DEBUG_GROUND_RENDERER) {
				const corner = this.getCorner(startTile.position, startCorner);
				this.front.circle(50).fill('rgba(80, 80, 80, 0.5)').center(corner.x, corner.y);
			}

			const points = [];

			if (style.renderCorners) {
				points.push(this.grid.getCorner(startTile.position, startCorner));
			} else {
				points.push(this.grid.getCoordinates(startTile.position));
			}

			// find edged tiles and push them into single group
			do {
				let nextPosition = this.getCornerNeighbor(currentTile, currentCorner);
				let visitors = this.chessboard.getVisitors(nextPosition, (v) => v._is_ground && v.type === startTile.type);
				const endCorner = (currentCorner + 5) % 6;
				while (visitors.length === 0 && endCorner !== currentCorner)
				{
					currentCorner = (currentCorner + 1) % 6;
					if ((currentTile === startTile) && (currentCorner === startCorner)) {
						break;
					}
					nextPosition = this.getCornerNeighbor(currentTile, currentCorner);
					visitors = this.chessboard.getVisitors(nextPosition, (v) => v._is_ground && v.type === startTile.type);
					if (style.renderCorners)
						points.push(this.getCorner(currentTile.position, currentCorner));
				}
				if (visitors.length > 0 && ((currentTile !== startTile) || (currentCorner !== startCorner))) {
					currentTile = visitors[0];
					currentCorner = (currentCorner + 4) % 6;
				} else {
					currentTile = null;
				}
				if (!style.renderCorners) {
					if (currentTile !== null && currentTile !== startTile) {
						//this.grid.getCoordinates(currentTile.position)
						points.push(this.grid.getCoordinates(currentTile.position));
					}
				}
			} while (currentTile !== null && ((currentTile !== startTile) || (currentCorner !== startCorner)));

			// last
			if (style.renderCorners) {
				if (!points[0].equalsToDiscrete(points[points.length-1])) {
					points.push(points[0]);
				}
				points.push(points[1]);
			} else {
				points.push(points[0]);
				points.push(points[1]);
			}

			// render
			if (points.length > 1) {

				let middle = points[0].add(points[1]).multiply(0.5);

				let path = '';
				path = `M${middle.x} ${middle.y} `;

				if (DEBUG_GROUND_RENDERER) {
					//this.front.circle(25).fill('rgba(100, 100, 255, 0.5)').center(points[0].x, points[0].y);
					this.front.circle(20).fill('rgba(100, 100, 20, 0.5)').center(middle.x, middle.y);
				}

				for (let i = 1, max = points.length - 1; i < max; i++) {
					middle = points[i].add(points[i + 1]).multiply(0.5);
					path += `S ${points[i].x} ${points[i].y}, ${middle.x} ${middle.y}`;
					if (DEBUG_GROUND_RENDERER) {
						this.front.circle(25).fill('rgba(100, 100, 255, 0.5)').center(points[i].x, points[i].y);
						this.front.circle(20).fill('rgba(100, 100, 20, 0.5)').center(middle.x, middle.y);
					}
				}

				//if ()
				//path += ` Z`;

				let group = (style.background === true) ? this.back : this.front;
				const pathDraw = group.path(path).stroke(style.stroke).fill(style.fill);
				if (style.renderCorners === true) {
					pathDraw.back();
				} else {
					pathDraw.front();
				}
			}

		}

		const svgImage = new Image();
		svgImage.onload = () => {
			const canvas = this.createElement(this.svgHost, 'canvas');
			this.cacheImageScale = 1;
			if (svgImage.width > MAX_CANVAS_SIZE.x) {
				this.cacheImageScale = MAX_CANVAS_SIZE.x / svgImage.width;
			}
			if ((svgImage.height * this.cacheImageScale) > MAX_CANVAS_SIZE.y) {
				this.cacheImageScale = MAX_CANVAS_SIZE.y / svgImage.height;
			}
			canvas.width = svgImage.width * this.cacheImageScale;
			canvas.height = svgImage.height * this.cacheImageScale;
			console.log(svgImage.width);
			console.log(svgImage.height);
			const canvasCtx = canvas.getContext('2d');
			canvasCtx.drawImage(
				svgImage,
				0,
				0,
				svgImage.width,
				svgImage.height,
				0,
				0,
				canvas.width,
				canvas.height
			);
			this.cacheImage = new Image();
			this.cacheImage.onload = () => {
				this.updatingCache = false;
				onReady();
			}
			this.cacheImage.src = canvas.toDataURL('image/png');
			this.removeElement(canvas);
		}
		svgImage.src = Pixies.svg2url(this.draw.root().node);

		this.group.remove();
		this.group = null;
		this.draw.remove();
		this.draw = null;
	}

	removeTileNeighbors(remaining, tile) {
		const candidates = [];
		candidates.push(tile);

		while (candidates.length > 0) {
			const candidate = candidates[0];
			candidates.splice(0, 1);
			const index = remaining.indexOf(candidate);
			if (index >= 0) {
				remaining.splice(index, 1);
				const neighborPositions = this.grid.getNeighbors(candidate.position);
				const neighbors = neighborPositions.reduce((prev, current) => prev.concat(this.chessboard.getVisitors(current, (v) => v.type === candidate.type)), []);
				neighbors.forEach((n) => {if (remaining.includes(n) && !candidates.includes(n)) candidates.push(n);});
			}
		}
	}

	getCornerNeighbor(tile, cornerType) {
		let neighborPosition = null;
		switch (cornerType) {
			case CORNER_UPPER_LEFT:
				neighborPosition = this.grid.getNeighborUp(tile.position);
				break;
			case CORNER_UPPER_RIGHT:
				neighborPosition = this.grid.getNeighborUpperRight(tile.position);
				break;
			case CORNER_RIGHT:
				neighborPosition = this.grid.getNeighborLowerRight(tile.position);
				break;
			case CORNER_LOWER_RIGHT:
				neighborPosition = this.grid.getNeighborDown(tile.position);
				break;
			case CORNER_LOWER_LEFT:
				neighborPosition = this.grid.getNeighborLowerLeft(tile.position);
				break;
			case CORNER_LEFT:
				neighborPosition = this.grid.getNeighborUpperLeft(tile.position);
				break;
		}
		return neighborPosition;
	}

	canUseCorner(tile, cornerType) {
		const position = this.getCornerNeighbor(tile, cornerType);
		const visitors = this.chessboard.getVisitors(position, (v) => v.type === tile.type);
		return visitors.length === 0;
	}

	getCorner(position, corner) {
		return this.grid.getCorner(position, corner);
	}

}
