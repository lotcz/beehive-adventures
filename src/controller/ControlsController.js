import ControllerBase from "../class/ControllerBase";

export default class ControlsController extends ControllerBase {
	dom;

	constructor(game, model, dom) {
		super(game, model);

		this.dom = dom || window.document.body;
	}

	activateInternal() {
		this.deactivateInternal();
		this.dom.addEventListener('mousemove', (e) => this.onMouseMove(e));
		this.dom.addEventListener('mouseenter', (e) => this.onMouseEnter(e));
		this.dom.addEventListener('mouseleave', (e) => this.onMouseLeave(e));
		//this.dom.addEventListener('click', (e) => this.onClick(e));
		this.dom.addEventListener('mousedown', (e) => this.updateMouseButtons(e));
		this.dom.addEventListener('mouseup', (e) => this.updateMouseButtons(e));
		this.dom.addEventListener('wheel', (e) => this.onZoom(e), {passive: true});
		this.dom.addEventListener('keydown', (e) => this.onKeyDown(e), false );
		this.dom.addEventListener('keyup', (e) => this.onKeyUp(e), false );
		this.dom.addEventListener('contextmenu', (e) => this.onContextMenu(e), false );
	}

	deactivateInternal() {

	}

	onKeyDown(event) {
		//this.caps = event.getModifierState("CapsLock");
		//console.log(event);
		const key = event.keyCode ? event.keyCode : event.charCode;
		switch (key) {
			case 38: /*up*/
			case 87: /*W*/ this.model.movingUp.set(true); break;
			case 37: /*left*/
			case 65: /*A*/ this.model.movingLeft.set(true); break;
			case 40: /*down*/
			case 83: /*S*/ this.model.movingDown.set(true); break;
			case 39: /*right*/
			case 68: /*D*/ this.model.movingRight.set(true); break;
			case 69: /*E*/
			case 32: /*space*/
			case 13: /*Enter*/
				this.model.interacting.set(true);
				break;
			case 27: /*Ecs*/ this.model.menuRequested.set(true); break;
			case 192: /*~*/ this.model.editModeRequested.set(true); break;
		}
	}

	onKeyUp(event) {
		//this.caps = event.getModifierState("CapsLock");
		const key = event.keyCode ? event.keyCode : event.charCode;
		//console.log("key:" + key);
		switch( key ) {
			case 38: /*up*/
			case 87: /*W*/ this.model.movingUp.set(false); break;
			case 37: /*left*/
			case 65: /*A*/ this.model.movingLeft.set(false); break;
			case 40: /*down*/
			case 83: /*S*/ this.model.movingDown.set(false); break;
			case 39: /*right*/
			case 68: /*D*/ this.model.movingRight.set(false); break;
			case 69: /*E*/
			case 32: /*space*/
			case 13: /*Enter*/
				this.model.interacting.set(false);
				break;
		}
		this.makeDirty();
	}


	onMouseMove(e) {
		this.model.mouseCoordinates.set(e.offsetX, e.offsetY);
		this.model.isMouseOver.set(true);
		e.stopPropagation();
	}

	onMouseEnter(e) {
		this.model.isMouseOver.set(true);
		this.updateMouseButtons(e);
	}

	onMouseLeave(e) {
		this.model.isMouseOver.set(false);
	}

	onContextMenu(e) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	updateMouseButtons(e) {
		const left = ((e.buttons == 1) || (e.buttons == 3));
		const right = (e.buttons == 2);
		this.model.mouseDownLeft.set(left);
		this.model.mouseDownRight.set(right);
	}

	onZoom(e) {
		this.model.zoom.set(e.deltaY > 0 ? 1 : -1);
	}

}
