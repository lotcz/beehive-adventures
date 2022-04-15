import ModelBase from "../class/ModelBase";

export const RESOURCE_TYPE_IMAGE = 'image';
export const RESOURCE_TYPE_SOUND = 'sound';

export default class ResourceModel extends ModelBase {
	type;
	uri;
	data;

	constructor(state) {
		super();

		if (state) {
			this.restoreState(state);
		}
	}

	getState() {
		return {
			type: this.type,
			uri: this.uri,
			data: this.data,

		}
	}

	restoreState(state) {
		this.type = state.type;
		this.uri = state.uri;
		this.data = state.data;
	}

}
