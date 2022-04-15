import AnimatedValue from "./AnimatedValue";
import RotationValue from "./RotationValue";

export default class AnimatedRotation extends AnimatedValue {
	constructor(start, end, duration, elapsed = 0) {
		super(start, start + RotationValue.normalizeValue(end - start), duration, elapsed);

	}
}
