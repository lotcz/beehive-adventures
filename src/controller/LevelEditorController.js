import ControllerBase from "../class/ControllerBase";
import {EDITOR_TOOL_DELETE, EDITOR_TOOL_SELECT} from "../model/LevelEditorModel";
import {
	EDITOR_MODE_GROUND,
	EDITOR_MODE_SPRITES
} from "../model/LevelEditorModel";

const DEBUG_EDITOR_CONTROLLER = false;

export default class LevelEditorController extends ControllerBase {

	/**
	 * @type LevelEditorModel
	 */
	model;

	/**
	 * @param {GameModel} game
	 * @param {LevelEditorModel} model
	 */
	constructor(game, model) {
		super(game, model);

		this.model = model;
		this.lastMouseCoords = null;
		this.lastHighlight = null;
		this.mouseMoveHandler = (coordinates) => this.onMouseMove(coordinates);
		this.mouseLeftHandler = (coordinates) => this.onMouseLeft(coordinates);
		this.mouseRightHandler = (coordinates) => this.onMouseRight(coordinates);
		this.zoomHandler = (zoom) => this.onZoom(zoom);
		this.controls.zoom.set(0);
	}

	activateInternal() {
		this.model.showGroundTiles.makeDirty();
		this.model.showSpriteHelpers.makeDirty();
		this.controls.mouseCoordinates.addOnChangeListener(this.mouseMoveHandler);
		this.controls.addOnLeftClickListener(this.mouseLeftHandler);
		this.controls.addOnRightClickListener(this.mouseRightHandler);
		this.controls.zoom.addOnChangeListener(this.zoomHandler);
	}

	deactivateInternal() {
		this.controls.mouseCoordinates.removeOnChangeListener(this.mouseMoveHandler);
		this.controls.removeOnLeftClickListener(this.mouseLeftHandler);
		this.controls.removeOnRightClickListener(this.mouseRightHandler);
		this.controls.zoom.removeOnChangeListener(this.zoomHandler);
	}

	getAffectedPositions(position) {
		return this.level.grid.getAffectedPositions(position, Math.round(this.model.brushSize));
	}

	addGroundTile(position) {
		if (!this.level.isValidPosition(position)) {
			if (DEBUG_EDITOR_CONTROLLER) console.log('Skipping invalid position:', position);
			return;
		}
		switch (this.model.selectedGroundType) {
			case EDITOR_TOOL_DELETE:
				const visitors = this.chessboard.getTile(position);
				const groundVisitors = visitors.filter((v) => v._is_ground === true);
				if (groundVisitors.length > 0) {
					this.level.ground.removeTile(groundVisitors[0]);
				}
				break;
			default:
				const visitors2 = this.chessboard.getTile(position);
				const groundVisitors2 = visitors2.filter((v) => v._is_ground === true);
				groundVisitors2.forEach((v) => this.level.ground.removeTile(v));
				this.level.addGroundTileFromStyle(position, this.model.selectedGroundType);
		}

	}

	processClick(position) {
		switch (this.model.selectedMode.get()) {
			case EDITOR_MODE_SPRITES:
				this.processSpriteClick(position);
				break;

			case EDITOR_MODE_GROUND:
				this.processGroundClick(position);
				break;
		}
	}

	processGroundClick(position) {
		const positions = this.getAffectedPositions(position);
		positions.forEach((p) => this.addGroundTile(p));
	}

	processSpriteClick(position) {
		switch (this.model.selectedSpriteType) {
			case EDITOR_TOOL_DELETE:
				const positions = this.getAffectedPositions(position);
				positions.forEach((pos) => {
					const visitors = this.chessboard.getTile(pos);
					const spriteVisitors = visitors.filter((v) => v._is_sprite === true);
					spriteVisitors.forEach((sprite) => this.level.sprites.remove(sprite));
				});
				break;
			case EDITOR_TOOL_SELECT:
				const visitors2 = this.chessboard.getVisitors(position, (v) => v._is_sprite === true);
				this.model.selectedSprites.set(visitors2);
				break;
			default:
				const sprite = this.level.addSpriteFromStyle(position, this.model.selectedSpriteType);
				this.model.selectedSprites.set([sprite]);
				break;
		}

	}

	getCursorGridPosition(offset) {
		return this.grid.getPosition(this.level.getAbsoluteCoordinates(offset));
	}

	activateClickWhenDragging() {
		return (this.model.selectedMode.get() === EDITOR_MODE_GROUND);
	}

	onMouseMove(coordinates) {
		const mousePosition = this.getCursorGridPosition(coordinates);

		if (this.controls.mouseDownLeft.get() && this.activateClickWhenDragging()) {
			this.processClick(mousePosition);
		}

		if (this.controls.mouseDownRight.get()) {
			this.scroll();
		} else {
			this.lastMouseCoords = null;
		}

		if ((this.lastHighlight === null) || this.lastHighlight.distanceTo(mousePosition) > 0) {
			this.model.highlightedTilePosition.set(mousePosition);
			this.model.highlights.resetChildren();
			const positions = this.getAffectedPositions(mousePosition);
			positions.forEach((p) => this.model.highlights.add(p));
			this.lastHighlight = mousePosition;
		}
	}

	onMouseLeft(coordinates) {
		const position = this.getCursorGridPosition(coordinates);
		this.processClick(position);
	}

	onMouseRight(coordinates) {
		console.log('right click');
	}

	scroll() {
		const speed = this.level.viewBoxScale.get(); //delta / 100;
		if (this.lastMouseCoords !== null) {
			const diff = this.lastMouseCoords.subtract(this.controls.mouseCoordinates);
			this.level.viewBoxCoordinates.set(this.level.viewBoxCoordinates.x + (diff.x * speed), this.level.viewBoxCoordinates.y + (diff.y * speed));
			this.level.sanitizeViewBox();
		}
		this.lastMouseCoords = this.controls.mouseCoordinates.clone();
	}

	onZoom(zoom) {
		if (zoom === 0) {
			return;
		}
		const zoomIn = zoom < 0;
		const delta = (this.level.viewBoxScale.get() / 10) * this.controls.zoom.get();
		const before = this.level.getAbsoluteCoordinates(zoomIn ? this.controls.mouseCoordinates : this.level.viewBoxSize.multiply(0.5));

		this.level.viewBoxScale.set(Math.max( 0.1, Math.min(100, this.level.viewBoxScale.get() + delta)));

		const after = this.level.getAbsoluteCoordinates(zoomIn ? this.controls.mouseCoordinates : this.level.viewBoxSize.multiply(0.5));
		const diff = after.subtract(before);
		this.level.viewBoxCoordinates.set(this.level.viewBoxCoordinates.x - diff.x, this.level.viewBoxCoordinates.y - diff.y);
		this.level.sanitizeViewBox();
		this.controls.zoom.set(0);
	}

}
