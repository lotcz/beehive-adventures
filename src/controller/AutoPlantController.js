import Vector2 from "../class/Vector2";
import LivingTreeModel from "../model/LivingTreeModel";
import Pixies from "../class/Pixies";
import PlantController from "./PlantController";

const AUTO_PLANT_TIMEOUT = 500;
const AUTO_PLANT_MAX_POWER = 30;

export default class AutoPlantController extends PlantController {
	constructor(game, model, controls) {
		super(game, model, controls);

		this.timeout = AUTO_PLANT_TIMEOUT;

	}

	updateInternal(delta) {
		if (this.model.roots.power > AUTO_PLANT_MAX_POWER) {
			return;
		}

		if (this.timeout <= 0) {

			if (Math.random() < 0.5) {
				const leaf = this.findRandomRootLeaf();
				this.growRootIfPossible(leaf);
			} else {
				const node = this.findRandomRootBranch();
				this.growRootIfPossible(node);
			}

			if (Math.random() < 0.5) {
				const leaf = this.findRandomStemLeaf();
				this.growStemIfPossible(leaf);
			} else {
				const node = this.findRandomStemBranch();
				this.growStemIfPossible(node);
			}

			this.timeout = AUTO_PLANT_TIMEOUT * (this.model.roots.power / AUTO_PLANT_MAX_POWER);
		}
		this.timeout -= delta;
	}

	growRootIfPossible(node) {
		if (!node) {
			return;
		}
		const candidates = [];
		const left = this.grid.getNeighborLowerLeft(node.position);
		if (!this.model.roots.nodeExists(left)) {
			candidates.push(left);
		}
		const center = this.grid.getNeighborDown(node.position);
		if (!this.model.roots.nodeExists(center)) {
			candidates.push(center);
		}
		const right = this.grid.getNeighborLowerRight(node.position);
		if (!this.model.roots.nodeExists(right)) {
			candidates.push(right);
		}
		const position = Pixies.randomElement(candidates);
		if (position) {
			this.addNode(node, position);
		}
	}

	growStemIfPossible(node) {
		if (!node) {
			return;
		}
		const candidates = [];
		const left = this.grid.getNeighborUpperLeft(node.position);
		if (!this.model.stem.nodeExists(left)) {
			candidates.push(left);
		}
		const center = this.grid.getNeighborUp(node.position);
		if (!this.model.stem.nodeExists(center)) {
			candidates.push(center);
		}
		const right = this.grid.getNeighborUpperRight(node.position);
		if (!this.model.stem.nodeExists(right)) {
			candidates.push(right);
		}
		const position = Pixies.randomElement(candidates);
		if (position) {
			this.addNode(node, position);
		}
	}

	findRandomRootLeaf() {
		return this.findRandomLeaf(this.model.roots);
	}

	findRandomStemLeaf() {
		return this.findRandomLeaf(this.model.stem);
	}

	findRandomLeaf(node) {
		if (node.children.length === 0) {
			return node;
		}
		return this.findRandomLeaf(Pixies.randomElement(node.children));
	}

	findRandomRootBranch() {
		return this.findRandomBranch(this.model.roots.children[0]);
	}

	findRandomStemBranch() {
		return this.findRandomBranch(this.model.stem.children[0]);
	}

	findRandomBranch(node) {
		const power = this.model.roots.power * Math.random();
		if (node.power < power) {
			return node;
		}
		const child = Pixies.randomElement(node.children);
		if (!child) {
			return null;
		}
		return this.findRandomBranch(child);
	}

}
