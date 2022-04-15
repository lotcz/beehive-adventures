import Vector2 from "../class/Vector2";
import ModelBase from "../class/ModelBase";
import Chessboard from "../class/Chessboard";
import DirtyValue from "../class/DirtyValue";

const NEIGHBOR_VECTOR_UP = new Vector2(0, -1);
const NEIGHBOR_VECTOR_DOWN = new Vector2(0, 1);
const NEIGHBOR_VECTOR_LEFT = new Vector2(-1, 0);
const NEIGHBOR_VECTOR_RIGHT = new Vector2(1, 0);

export const NEIGHBOR_TYPE_UP = 0;
export const NEIGHBOR_TYPE_UPPER_RIGHT = 1;
export const NEIGHBOR_TYPE_LOWER_RIGHT = 2;
export const NEIGHBOR_TYPE_DOWN = 3;
export const NEIGHBOR_TYPE_LOWER_LEFT = 4;
export const NEIGHBOR_TYPE_UPPER_LEFT = 5;
export const NEIGHBOR_TYPE_SELF = 6;

export const NEIGHBOR_TYPES = [NEIGHBOR_TYPE_UP, NEIGHBOR_TYPE_UPPER_RIGHT, NEIGHBOR_TYPE_LOWER_RIGHT, NEIGHBOR_TYPE_DOWN, NEIGHBOR_TYPE_LOWER_LEFT, NEIGHBOR_TYPE_UPPER_LEFT, NEIGHBOR_TYPE_SELF];

export const CORNER_RIGHT = 0;
export const CORNER_LOWER_RIGHT = 1;
export const CORNER_LOWER_LEFT = 2;
export const CORNER_LEFT = 3;
export const CORNER_UPPER_LEFT = 4;
export const CORNER_UPPER_RIGHT = 5;

export default class GridModel extends ModelBase {
	size;
	tileRadius;
	tileSize;
	chessboard;

	constructor(state) {
		super();
		this.chessboard = new Chessboard();

		this.size = new Vector2(100, 50);
		this.addChild(this.size);
		this.tileSize = new Vector2();
		this.addChild(this.tileSize);
		this.tileRadius = new DirtyValue();
		this.tileRadius.addOnChangeListener((value) => this.updateTileSize());
		this.addChild(this.tileRadius);
		this.tileRadius.set(50);

		if (state) this.restoreState(state);
	}

	getState() {
		return {
			size: this.size.toArray(),
			tileRadius: this.tileRadius.get()
		}
	}

	updateTileSize() {
		this.tileSize.set(2 * this.tileRadius.get(), Math.sqrt(3) * this.tileRadius.get());
	}

	restoreState(state) {
		this.chessboard = new Chessboard();
		if (state.size) this.size.restoreState(state.size);
		if (state.tileRadius) this.tileRadius.set(state.tileRadius);
	}

	getCoordinates(position) {
		const offset = (position.x % 2) === 0 ? 0 : this.tileSize.y / 2;
		return new Vector2(position.x * this.tileSize.x * 3/4, offset + (position.y * this.tileSize.y));
	}

	getMaxCoordinates() {
		const maxPos = this.getMaxPosition();
		return new Vector2(maxPos.x * this.tileSize.x * 3/4, maxPos.y * this.tileSize.y);
	}

	getPosition(coordinates) {
		const x = Math.round(coordinates.x / (this.tileSize.x * 3/4));
		const offset = (x % 2) === 0 ? 0 : this.tileSize.y / 2;
		const y = Math.round((coordinates.y - offset) / this.tileSize.y)
		return new Vector2(x, y);
	}

	getMaxPosition() {
		return this.size.subtract(new Vector2(1, 1));
	}

	getCorners(position) {
		const corners = [];
		const coordinates = this.getCoordinates(position);
		for (let i = 0, max = 6; i < max; i++) {
			corners.push(this.getCornerFromCoordinates(coordinates, i));
		}
		return corners;
	}

	getCornerFromCoordinates(coordinates, i, radius = null) {
		const angle_rad = (Math.PI/3 * i);
		radius = radius || this.tileRadius.get();
		return new Vector2(coordinates.x + radius * Math.cos(angle_rad), coordinates.y + radius * Math.sin(angle_rad));
	}

	getCorner(position, i, radius = null) {
		return this.getCornerFromCoordinates(this.getCoordinates(position), i, radius);
	}

	getNeighbor(position, direction, steps = 1) {
		switch (direction) {
			case NEIGHBOR_TYPE_UP:
				return this.getNeighborUp(position, steps);
			case NEIGHBOR_TYPE_UPPER_RIGHT:
				return this.getNeighborUpperRight(position, steps);
			case NEIGHBOR_TYPE_LOWER_RIGHT:
				return this.getNeighborLowerRight(position, steps);
			case NEIGHBOR_TYPE_DOWN:
				return this.getNeighborDown(position, steps);
			case NEIGHBOR_TYPE_LOWER_LEFT:
				return this.getNeighborLowerLeft(position, steps);
			case NEIGHBOR_TYPE_UPPER_LEFT:
				return this.getNeighborUpperLeft(position, steps);
			default:
				return position;
		}
	}

	getNeighbors(position) {
		return [
			this.getNeighborUp(position),
			this.getNeighborUpperRight(position),
			this.getNeighborLowerRight(position),
			this.getNeighborDown(position),
			this.getNeighborLowerLeft(position),
			this.getNeighborUpperLeft(position)
		];
	}

	getNeighborType(position, neighbor) {
		return NEIGHBOR_TYPES.find((type) => this.getNeighbor(position, type).equalsTo(neighbor));
	}

	getNeighborUp(position, steps = 1) {
		return position.add(NEIGHBOR_VECTOR_UP.multiply(steps));
	}

	getNeighborDown(position, steps = 1) {
		return position.add(NEIGHBOR_VECTOR_DOWN.multiply(steps));
	}

	getNeighborUpperLeft(position, steps = 1) {
		const result = position.add(position.x % 2 === 0 ? NEIGHBOR_VECTOR_LEFT.addY(-1) : NEIGHBOR_VECTOR_LEFT);
		if (steps > 1) {
			return this.getNeighborUpperLeft(result, steps - 1);
		} else {
			return result;
		}
	}

	getNeighborUpperRight(position, steps = 1) {
		const result = position.add(position.x % 2 === 0 ? NEIGHBOR_VECTOR_RIGHT.addY(-1) : NEIGHBOR_VECTOR_RIGHT);
		if (steps > 1) {
			return this.getNeighborUpperRight(result, steps - 1);
		} else {
			return result;
		}
	}

	getNeighborLowerLeft(position, steps = 1) {
		const result = position.add(position.x % 2 === 0 ? NEIGHBOR_VECTOR_LEFT : NEIGHBOR_VECTOR_LEFT.addY(1));
		if (steps > 1) {
			return this.getNeighborLowerLeft(result, steps - 1);
		} else {
			return result;
		}
	}

	getNeighborLowerRight(position, steps = 1) {
		const result = position.add(position.x % 2 === 0 ? NEIGHBOR_VECTOR_RIGHT : NEIGHBOR_VECTOR_RIGHT.addY(1));
		if (steps > 1) {
			return this.getNeighborLowerRight(result, steps - 1);
		} else {
			return result;
		}
	}

	isValidPosition(position) {
		return position.x >= 0 && position.x < this.size.x && position.y >= 0 && position.y < this.size.y;
	}

	getValidNeighbors(position) {
		const neighbors = this.getNeighbors(position);
		return neighbors.filter((n) => this.isValidPosition(n));
	}

	getAffectedPositions(position, steps = 1) {
		const positions = [];
		let start = position;
		let stepsRemaining = steps;

		while (stepsRemaining > 0) {
			positions.push(start);
			for (let i = 1; i < steps; i++) {
				positions.push(this.getNeighborLowerLeft(start, i));
			}
			start = this.getNeighborUp(start);
			stepsRemaining--;
		}

		stepsRemaining = steps;
		start = position;
		while (stepsRemaining > 0) {
			for (let i = 1; i < steps; i++) {
				positions.push(this.getNeighborLowerRight(start, i));
			}
			start = this.getNeighborUp(start);
			stepsRemaining--;
		}

		stepsRemaining = steps;
		start = position;
		while (stepsRemaining > 0) {
			for (let i = 1; i < steps; i++) {
				positions.push(this.getNeighborLowerRight(start, i));
			}
			start = this.getNeighborLowerLeft(start);
			stepsRemaining--;
		}

		return positions;
	}

}


