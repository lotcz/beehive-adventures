const DEBUG_CHESSBOARD = false;

export default class Chessboard {
	tiles;

	constructor() {
		this.tiles = [];
	}

	getTile(position) {
		position = position.toDiscreteSpace();
		if (!this.tiles[position.x]) {
			this.tiles[position.x] = [];
		}
		if (!this.tiles[position.x][position.y]) {
			this.tiles[position.x][position.y] = [];
		}
		return this.tiles[position.x][position.y];
	}

	getVisitors(position, filter) {
		position = position.toDiscreteSpace();
		const tile = this.getTile(position);
		if (filter) {
			return tile.filter(filter);
		} else {
			return tile;
		}
	}

	getVisitorsMultiple(positions, filter) {
		return positions.reduce((visitors, position) => visitors.concat(this.getVisitors(position, filter)), []);
	}

	addVisitor(position, visitor) {
		position = position.toDiscreteSpace();
		let tile = this.getTile(position);
		if (tile.includes(visitor)) {
			if (DEBUG_CHESSBOARD) console.log('Visitor already present');
		} else {
			tile.push(visitor);
		}
	}

	removeVisitor(position, visitor) {
		position = position.toDiscreteSpace();
		const tile = this.getTile(position);
		const index = tile.indexOf(visitor);
		if (index < 0) {
			if (DEBUG_CHESSBOARD) console.log('Visitor not present');
		} else {
			tile.splice(index, 1);
		}
	}

}
