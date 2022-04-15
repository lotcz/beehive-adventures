import ModelBase from "../class/ModelBase";
import Vector2 from "../class/Vector2";
import {NEIGHBOR_TYPE_UP} from "./GridModel";

const DEFAULT_HINT_SIZE = 2;

export default class HintModel extends ModelBase {
	position;
	imagePaths;
	direction;
	size;

	constructor() {
		super();

		this.position = new Vector2();
		this.imagePaths = [];
		this.direction = NEIGHBOR_TYPE_UP;
		this.size = DEFAULT_HINT_SIZE;
		this.frameRate = 0.5;
	}

}
