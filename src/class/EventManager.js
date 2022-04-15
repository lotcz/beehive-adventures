const DEBUG_EVENT_MANAGER = false;

export default class EventManager {
	handlers;

	constructor() {
		this.handlers = [];
	}

	addEventListener(eventName, eventHandler) {
		if (!this.handlers[eventName]) {
			this.handlers[eventName] = [];
		}
		const index = this.handlers[eventName].indexOf(eventHandler);
		if (index >= 0) {
			if (DEBUG_EVENT_MANAGER) console.log('Event listener already registered.');
			return;
		}
		return this.handlers[eventName].push(eventHandler);
	}

	removeEventListener(eventName, eventHandler) {
		if (!this.handlers[eventName]) {
			this.handlers[eventName] = [];
		}
		const index = this.handlers[eventName].indexOf(eventHandler);
		if (index >= 0) {
			this.handlers[eventName].splice(index, 1);
		} else {
			if (DEBUG_EVENT_MANAGER) console.log('Event listener cannot be removed - not found.');
		}
	}

	triggerEvent(eventName, param) {
		if (!this.handlers[eventName]) {
			return;
		}
		const handlers = this.handlers[eventName];
		handlers.forEach((item) => {
			item(param);
		});
	}

}
