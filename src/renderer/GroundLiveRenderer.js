import {
	CORNER_LEFT,
	CORNER_LOWER_LEFT,
	CORNER_LOWER_RIGHT,
	CORNER_RIGHT,
	CORNER_UPPER_LEFT,
	CORNER_UPPER_RIGHT
} from "../model/GridModel";
import {GROUND_STYLES} from "../builder/GroundStyle";
import SvgRenderer from "./SvgRenderer";

const DEBUG_GROUND_RENDERER = false;

export default class GroundLiveRenderer extends SvgRenderer {
	group;

	constructor(game, model, parallax, draw) {
		super(game, model, draw);
		this.parallax = parallax;
		this.group = null;
	}

	activateInternal() {
		const levelSize = this.grid.getMaxCoordinates();
		let fill = null;
		if (this.model.backgroundColor !== this.model.backgroundColorEnd) {
			const gradient = this.draw.gradient('linear', (add) => {
				add.stop(0, this.parallax.backgroundColor);
				add.stop(1, this.parallax.backgroundColorEnd);
				add.from(0, 0);
				add.to(0, 1);
			});
			fill = gradient;
		} else {
			fill = this.parallax.backgroundColor;
		}

		this.bg = this.draw.rect(levelSize.x, levelSize.y).fill(fill);
	}

	deactivateInternal() {
		if (this.bg) {
			this.bg.remove();
			this.bg = null;
		}
		if (this.group) {
			this.group.remove();
			this.group = null;
		}
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

	renderInternal() {
		if (DEBUG_GROUND_RENDERER) console.log('Rendering ground LIVE');

		if (this.group) this.group.remove();
		this.group = this.draw.group();
		this.back = this.group.group();
		this.front = this.group.group();

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

	}

	getCorner(position, corner) {
		return this.grid.getCorner(position, corner);
	}

}
