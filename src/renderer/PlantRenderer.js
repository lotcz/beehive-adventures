import SvgRenderer from "./SvgRenderer";
import LivingTreeRenderer, {CURVES_STANDARD, CURVES_WAVY} from "./LivingTreeRenderer";
import {BROWN_DARK, BROWN_LIGHT, GREEN_DARK, GREEN_LIGHT} from "../builder/Palette";

export default class PlantRenderer extends SvgRenderer {

	constructor(game, model, draw) {
		super(game, model, draw);

		this.plantGroup = draw.group();
		this.rootsAndStemGroup = this.plantGroup.group();
		this.addChild(new LivingTreeRenderer(game, model.roots, this.rootsAndStemGroup, false, BROWN_LIGHT, {width: 5, color: BROWN_DARK}, CURVES_STANDARD));
		this.addChild(new LivingTreeRenderer(game, model.stem, this.rootsAndStemGroup, true, GREEN_LIGHT, {width: 5, color: GREEN_DARK}, CURVES_WAVY));

		this.ringInner = null;
		this.ringOuter = null;
	}

	renderRing() {
		if (this.ringInner !== null) {
			this.ringInner.remove();
		}

		if (this.ringOuter !== null) {
			this.ringInner.remove();
		}

		const power = Math.max(this.model.roots.power, this.model.stem.power);
		const width = 10 + Math.min(25, power);
		const height = width * 0.8;
		const coordinates = this.grid.getCoordinates(this.model.roots.position);
		this.ringOuter = this.plantGroup.path(
			`m ${coordinates.x + width}, ${coordinates.y - (height*0.3)} c` +
			`0,${height/2} ${-width/2},${height} ${-width},${height} ` +
			`${-width/2},0 ${-width},${-height/2} ${-width},${-height} ` +
			`0,${-height} ${width/2},${height*0.1} ${width},${height*0.1} ` +
			`${width/2},0 ${width},${-height} ${width},${-height*0.1} z`
		).fill(GREEN_DARK).stroke({width: 1});
		this.ringOuter.front();

		this.ringInner = this.plantGroup.path(
			`m ${coordinates.x + width}, ${coordinates.y - (height*0.3)} c` +
			`0,${height/2} ${-width/2},${height} ${-width},${height} ` +
			`${-width/2},0 ${-width},${-height/2} ${-width},${-height} ` +
			`0,${-height} ${width/2},${-height} ${width},${-height} ` +
			`${width/2},0 ${width},${height} ${width},${height} z`
		).fill(GREEN_DARK);
		this.ringInner.back();

	}

	renderInternal() {
		if (this.model.roots.isDirty() || this.model.stem.isDirty()) {
			this.renderRing();
		}
	}

}
