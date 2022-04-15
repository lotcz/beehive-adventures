import Tree from "./Tree";
import ResourceLoader from "./ResourceLoader";

const REMOVE_INVALID = true;

export default class ResourcesLoader extends Tree {
	onLoaded;

	constructor(resources, draw, levelResources) {
		super();

		this.draw = draw;
		this.levelResources = levelResources;
		this.levelResources.keys().forEach((uri) => {
			const loader = this.addChild(new ResourceLoader(resources, draw, uri));
			loader.addEventListener('not-found', (uri) => this.onResourceNotFound(uri))
		});
		this.onLoaded = null;
	}

	update() {
		if (this.isLoaded()) {
			this.onLoaded();
		}
	}

	isLoaded() {
		return this.children.every((ch) => ch.isLoaded());
	}

	load(onLoaded) {
		this.onLoaded = onLoaded;
		this.children.forEach((ch) => ch.load(() => this.update()));
	}

	onResourceNotFound(uri) {
		if (REMOVE_INVALID) {
			this.levelResources.remove(uri);
			console.warn(`Resource '${uri}' removed from level resources!`);
		}
	}

}
