import SvgRenderer from "./SvgRenderer";
import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";

const DEBUG_IMAGE_RENDERER = false;

export default class ImageRenderer extends SvgRenderer {
	static cycles = 0;
	static session = null;
	static scaleSession = null;
	static rotationSession = null;
	static coordinatesSession = null;
	group;
	image;
	lastRotation;
	lastScale;
	flipped;
	onClick;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.group = null;
		this.image = null;
		this.imageSize = null;

		if (DEBUG_IMAGE_RENDERER && !ImageRenderer.session) {
			ImageRenderer.session = Pixies.startDebugSession(`Image rendering ${ImageRenderer.cycles} cycles`);
			ImageRenderer.scaleSession = Pixies.startDebugSession(`Image scaling`);
			ImageRenderer.rotationSession = Pixies.startDebugSession(`Image rotation`);
			ImageRenderer.coordinatesSession = Pixies.startDebugSession(`Image movement`);
		}
	}

	activateInternal() {
		this.group = this.draw.group();
		this.createImage();
	}

	deactivateInternal() {
		if (this.group) {
			this.group.remove();
			this.group = null;
		}
	}

	render() {
		if (DEBUG_IMAGE_RENDERER) {
			if (ImageRenderer.cycles <= 0) {
				ImageRenderer.cycles = 10000;
				if (ImageRenderer.session) Pixies.finishDebugSession(ImageRenderer.session);
				if (ImageRenderer.scaleSession) Pixies.finishDebugSession(ImageRenderer.scaleSession);
				if (ImageRenderer.rotationSession) Pixies.finishDebugSession(ImageRenderer.rotationSession);
				if (ImageRenderer.coordinatesSession) Pixies.finishDebugSession(ImageRenderer.coordinatesSession);
				ImageRenderer.session = Pixies.startDebugSession(`Image rendering ${ImageRenderer.cycles} cycles`);
				ImageRenderer.scaleSession = Pixies.startDebugSession(`Image scaling`);
				ImageRenderer.rotationSession = Pixies.startDebugSession(`Image rotation`);
				ImageRenderer.coordinatesSession = Pixies.startDebugSession(`Image movement`);
				Pixies.pauseDebugSession(ImageRenderer.session);
				Pixies.pauseDebugSession(ImageRenderer.scaleSession);
				Pixies.pauseDebugSession(ImageRenderer.rotationSession);
				Pixies.pauseDebugSession(ImageRenderer.coordinatesSession);
			}
			ImageRenderer.cycles--;
			Pixies.resumeDebugSession(ImageRenderer.session);
		}

		super.render();

		if (DEBUG_IMAGE_RENDERER) {
			Pixies.pauseDebugSession(ImageRenderer.session);
		}
	}

	renderInternal() {
		if (this.model.path.isDirty()) {
			this.createImage();
		} else {
			if (this.model.scale.isDirty()) {
				this.updateScale();
			} else if (this.model.coordinates.isDirty()) {
				this.updateCoordinates();
			}
			if (this.model.flipped.isDirty()) {
				this.updateFlip();
			}
			if (this.model.rotation.isDirty()) {
				this.updateRotation();
			}
		}
	}

	createImage() {
		if (this.image) this.image.remove();
		this.flipped = false;
		this.lastRotation = 0;
		this.lastScale = 1;
		const ref = this.getRef(this.model.path.get());
		this.model.path.clean();
		this.image = this.group.use(ref);

		if (this.onClick) {
			this.setOnClick(this.onClick);
		}
		this.updateFromModel();
	}

	updateFromModel() {
		this.updateScale();
		this.updateFlip();
		this.updateRotation();
	}

	updateScale() {
		if (DEBUG_IMAGE_RENDERER) {
			Pixies.resumeDebugSession(ImageRenderer.scaleSession);
		}
		const scale = this.model.scale.get() / this.lastScale;
		this.lastScale = this.model.scale.get();
		this.model.scale.clean();
		this.image.scale(scale);
		if (DEBUG_IMAGE_RENDERER) {
			Pixies.pauseDebugSession(ImageRenderer.scaleSession);
		}
		this.updateCoordinates();
	}

	updateCoordinates() {
		if (DEBUG_IMAGE_RENDERER) {
			Pixies.resumeDebugSession(ImageRenderer.coordinatesSession);
		}
		this.group.center(this.model.coordinates.x, this.model.coordinates.y);
		this.model.coordinates.clean();
		if (DEBUG_IMAGE_RENDERER) {
			Pixies.pauseDebugSession(ImageRenderer.coordinatesSession);
		}
	}

	updateFlip() {
		this.image.rotate(-this.lastRotation);
		if (this.model.flipped.get() && !this.flipped) {
			this.image.flip('x');
			this.flipped = true;
		}
		if (this.flipped && !this.model.flipped.get()) {
			this.image.flip('x');
			this.flipped = false;
		}
		this.image.rotate(this.lastRotation);
		this.model.flipped.clean();
	}

	updateRotation() {
		if (DEBUG_IMAGE_RENDERER) {
			Pixies.resumeDebugSession(ImageRenderer.rotationSession);
		}
		this.image.rotate(-this.lastRotation);
		this.lastRotation = this.model.rotation.get();
		this.image.rotate(this.lastRotation);
		this.model.rotation.clean();
		if (DEBUG_IMAGE_RENDERER) {
			Pixies.pauseDebugSession(ImageRenderer.rotationSession);
		}
	}

	setOnClick(onClick) {
		this.onClick = onClick;
		if (this.image) {
			this.image.on('click', onClick);
		}
	}

}
