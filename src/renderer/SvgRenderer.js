import RendererBase from "../class/RendererBase";
import Pixies from "../class/Pixies";

export default class SvgRenderer extends RendererBase {
	draw;

	constructor(game, model, draw) {
		super(game, model);
		this.draw = draw;
	}

	getDefs() {
		return this.draw.root().defs();
	}

	getRef(uri) {
		const token = Pixies.token(uri);
		const defs = this.draw.root().defs();
		let ref = defs.findOne('#' + token);
		if (!ref) {
			console.error(`Resource ${uri} (token: ${token}) not found!`)
		}
		return ref;
	}

	setRef(uri, ref) {
		const defs = this.draw.root().defs();
		const token = Pixies.token(uri);
		const resource = defs.findOne('#' + token);
		if (!resource) {
			defs.add(ref);
			ref.attr({id:token});
		} else {
			console.log(`Resource ${uri} already loaded.`);
			this.loaded = true;
		}
	}

}
