import Vector2 from "../class/Vector2";
import LivingTreeModel from "../model/LivingTreeModel";
import ControllerBase from "../class/ControllerBase";
import SpriteCollectionController from "./SpriteCollectionController";

export default class PlantController extends ControllerBase {
	constructor(game, model, controls) {
		super(game, model, controls);

		this.grid = game.level.get().grid;

		this.model.roots.forEach((r) => this.grid.chessboard.addVisitor(r.position, r));
		this.model.stem.forEach((s) => this.grid.chessboard.addVisitor(s.position, s));
	}

	updateInternal(delta) {


	}

	findRootCandidate(position) {
		const node = this.model.roots.findNodeOnPos(position);
		if (node && !node.isRoot()) return node;
		return null;
	}

	findStemCandidate(position) {
		const node = this.model.stem.findNodeOnPos(position);
		if (node && !node.isRoot()) return node;
		return null;
	}

	addNode(parent, position) {
		const node = parent.addChild(new LivingTreeModel({position: position.toArray(), power: 1}));
		this.grid.chessboard.addVisitor(position, node);
	}

	onClick(position) {
		const root = this.model.roots.findNodeOnPos(position);
		const stem = this.model.stem.findNodeOnPos(position);
		if (root === null && stem === null) {
			// ROOTS
			const above = this.findRootCandidate(this.grid.getNeighborUp(position));
			if (above !== null) {
				this.addNode(above, position);
				return;
			}
			const upperLeft = this.findRootCandidate(this.grid.getNeighborUpperLeft(position));
			if (upperLeft !== null) {
				this.addNode(upperLeft, position);
				return;
			}
			const upperRight = this.findRootCandidate(this.grid.getNeighborUpperRight(position));
			if (upperRight !== null) {
				this.addNode(upperRight, position);
				return;
			}
			// STEM
			const below = this.findStemCandidate(this.grid.getNeighborDown(position));
			if (below !== null) {
				this.addNode(below, position);
				return;
			}
			const lowerLeft = this.findStemCandidate(this.grid.getNeighborLowerLeft(position));
			if (lowerLeft !== null) {
				this.addNode(lowerLeft, position);
				return;
			}
			const lowerRight = this.findStemCandidate(this.grid.getNeighborLowerRight(position));
			if (lowerRight !== null) {
				this.addNode(lowerRight, position);
				return;
			}
		}

		const visitors = this.grid.chessboard.getTile(position);
	}

}
