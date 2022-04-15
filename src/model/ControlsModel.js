import Vector2 from "../class/Vector2";
import DirtyValue from "../class/DirtyValue";
import ModelBase from "../class/ModelBase";

export const CONTROLS_UP = 0;
export const CONTROLS_UPPER_RIGHT = 1;
export const CONTROLS_RIGHT = 2;
export const CONTROLS_LOWER_RIGHT = 3;
export const CONTROLS_DOWN = 4;
export const CONTROLS_LOWER_LEFT = 5;
export const CONTROLS_LEFT = 6;
export const CONTROLS_UPPER_LEFT = 7;
export const CONTROLS_NONE = 8;

const CLICK_TIMEOUT = 150;

export default class ControlsModel extends ModelBase {
	isMouseOver;
	mouseCoordinates;
	mouseDownLeft;
	mouseDownRight;
	leftClickTime;
	rightClickTime;
	movingUp;
	movingLeft;
	movingDown;
	movingRight;
	direction;
	interacting;
	menuRequested;
	editModeRequested;
	zoom;

	constructor() {
		super();

		this.isMouseOver = new DirtyValue(false);
		this.addChild(this.isMouseOver);
		this.mouseCoordinates = new Vector2();
		this.addChild(this.mouseCoordinates);
		this.mouseDownLeft = new DirtyValue(false);
		this.mouseDownLeft.addOnChangeListener((value) => this.onMouseLeftChange(value));
		this.addChild(this.mouseDownLeft);
		this.mouseDownRight = new DirtyValue(false);
		this.mouseDownRight.addOnChangeListener((value) => this.onMouseRightChange(value));
		this.addChild(this.mouseDownRight);

		this.menuRequested = new DirtyValue(false);
		this.addChild(this.menuRequested);
		this.editModeRequested = new DirtyValue(false);
		this.addChild(this.editModeRequested);

		this.zoom = new DirtyValue(0);
		this.addChild(this.zoom);

		this.onMovementChangeHandler = () => this.updateDirection();
		this.movingUp = new DirtyValue(false);
		this.movingUp.addOnChangeListener(this.onMovementChangeHandler);
		this.addChild(this.movingUp);
		this.movingLeft = new DirtyValue(false);
		this.movingLeft.addOnChangeListener(this.onMovementChangeHandler);
		this.addChild(this.movingLeft);
		this.movingDown = new DirtyValue(false);
		this.movingDown.addOnChangeListener(this.onMovementChangeHandler);
		this.addChild(this.movingDown);
		this.movingRight = new DirtyValue(false);
		this.movingRight.addOnChangeListener(this.onMovementChangeHandler);
		this.addChild(this.movingRight);

		this.direction = new DirtyValue(CONTROLS_NONE);
		this.addChild(this.direction);

		this.interacting = new DirtyValue(false);
		this.addChild(this.interacting);

		this.leftClickTime = 0;
		this.rightClickTime = 0;
	}

	anyMovement() {
		return this.movingUp.get() || this.movingLeft.get() || this.movingDown.get() || this.movingRight.get();
	}

	updateDirection() {
		if (this.movingUp.get()) {
			if (this.movingLeft.get()) {
				this.direction.set(CONTROLS_UPPER_LEFT);
			} else if (this.movingRight.get()) {
				this.direction.set(CONTROLS_UPPER_RIGHT);
			} else {
				this.direction.set(CONTROLS_UP);
			}
		} else if (this.movingDown.get()) {
			if (this.movingLeft.get()) {
				this.direction.set(CONTROLS_LOWER_LEFT);
			} else if (this.movingRight.get()) {
				this.direction.set(CONTROLS_LOWER_RIGHT);
			} else {
				this.direction.set(CONTROLS_DOWN);
			}
		} else if (this.movingLeft.get()) {
			this.direction.set(CONTROLS_LEFT);
		} else if (this.movingRight.get()) {
			this.direction.set(CONTROLS_RIGHT);
		} else {
			this.direction.set(CONTROLS_NONE);
		}
	}

	onMouseLeftChange(value) {
		const time = performance.now();
		if (value) {
			this.leftClickTime = time;
		} else {
			if ((time - this.leftClickTime) < CLICK_TIMEOUT) {
				this.triggerEvent('left-click', this.mouseCoordinates.clone());
			}
		}
	}

	onMouseRightChange(value) {
		const time = performance.now();
		if (value) {
			this.rightClickTime = time;
		} else {
			if ((time - this.rightClickTime) < CLICK_TIMEOUT) {
				this.triggerEvent('right-click', this.mouseCoordinates.clone());
			}
		}
	}

	addOnLeftClickListener(listener) {
		this.addEventListener('left-click', listener);
	}

	addOnRightClickListener(listener) {
		this.addEventListener('right-click', listener);
	}

	removeOnLeftClickListener(listener) {
		this.removeEventListener('left-click', listener);
	}

	removeOnRightClickListener(listener) {
		this.removeEventListener('right-click', listener);
	}

}
