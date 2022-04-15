import DirtyValue from "./DirtyValue";

export default class RotationValue extends DirtyValue {
	value;

	constructor(value) {
		super();
		if (value !== undefined) this.set(value);
	}

	static normalizeValue(value) {
		let result = value % 360;
		if (result > 180) {
			result = result - 360;
		}
		if (result < -180) {
			result = result + 360;
		}
		return result;
	}

	set(value) {
		const normalized = RotationValue.normalizeValue(value);
		if (this.value !== normalized) {
			this.value = normalized;
			this.makeDirty();
		}
	}

	add(value) {
		this.set(this.get() + value);
	}

	static subtractValues(a, b) {
		let diff = a - b;
		if (diff > 180) {
			diff = 360 - diff;
		}
		if (diff < -180) {
			diff = 360 + diff;
		}
		return diff;
	}

	equalsTo(value) {
		return (this.value === RotationValue.normalizeValue(value));
	}

	clone() {
		return new RotationValue(this.value);
	}

}
