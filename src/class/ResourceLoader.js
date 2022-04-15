import Tree from "./Tree";
import {RESOURCE_TYPE_IMAGE} from "../model/ResourceModel";
import Pixies from "./Pixies";

const DEBUG_RESOURCE_LOADER = false;

export default class ResourceLoader extends Tree {
	resources;
	uri;
	loaded;
	onLoaded;
	draw;
	def;

	constructor(resources, draw, uri) {
		super();

		this.resources = resources;
		this.draw = draw;
		this.uri = uri;

		this.loaded = false;
		this.onLoaded = null;
		this.def = null;
	}

	update() {
		if (this.isLoaded()) {
			this.onLoaded(this.def);
		}
	}

	isLoaded() {
		return this.loaded;
	}

	loadInternal() {
		const resource = this.resources.get(this.uri);
		if (resource === undefined) {
			console.error(`Resource '${this.uri}' not found!`);
			this.triggerEvent('not-found', this.uri);
			this.loaded = true;
			this.update();
			return;
		}

		switch (resource.type) {
			case RESOURCE_TYPE_IMAGE:
				const defs = this.draw.root().defs();
				const token = Pixies.token(resource.uri);
				this.def = defs.findOne('#' + token);
				if (!this.def) {
					this.def = defs.image(
						resource.data,
						() => {
							this.loaded = true;
							this.update();
						}
					);
					this.def.attr({id:token});
				} else {
					if (DEBUG_RESOURCE_LOADER) console.log(`Resource ${resource.uri} already loaded in defs.`);
					this.loaded = true;
				}
				break;
			default:
				console.error(`Resource type '${resource.type}' doesn't exist!`);
		}
		this.update();
	}

	load(onLoaded) {
		this.onLoaded = onLoaded;
		this.loadInternal();
	}

}
