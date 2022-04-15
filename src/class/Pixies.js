export default class Pixies {

	static random(min, max) {
		const diff = max - min;
		return min + (diff * Math.random());
	}

	static randomElement(arr) {
		return arr[Pixies.randomIndex(arr.length)];
	}

	static randomIndex(length) {
		return Math.floor(Math.random() * length);
	}

	static between(min, max, n) {
		const minimum = Math.min(min, max);
		const maximum = Math.max(min, max);
		return Math.min(maximum, Math.max(minimum, n));
	}

	static hash(value) {
		let hash = 0;
		if (value.length == 0) return hash;
		for (let i = 0 ; i < value.length ; i++)
		{
			let ch = value.charCodeAt(i);
			hash = ((hash << 5) - hash) + ch;
			hash = hash & hash;
		}
		return hash;
	}

	static token(value) {
		let hash = Pixies.hash(value);
		if (hash == 0) return null;
		let token = 'a';
		if (hash < 0) {
			token = 'b';
			hash = -hash;
		}
		return token + hash;
	}

	static addClass(element, css) {
		if (Array.isArray((css)) && css.length > 0) {
			css.forEach((c) => element.classList.add(c));
		} else if (css) {
			element.classList.add(css);
		}
	}

	static removeClass(element, css) {
		element.classList.remove(css);
	}

	static createElement(parent, tag, css = null) {
		const el = document.createElement(tag);
		this.addClass(el, css);
		if (parent) {
			parent.appendChild(el);
		}
		return el;
	}

	static destroyElement(el) {
		if (el) {
			el.parentNode.removeChild(el);
			el.remove();
		}
	}

	static isFullscreen() {
		return (window.fullScreen || (window.innerWidth == screen.width && window.innerHeight == screen.height))
	}

	static openFullscreen(elem) {
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.webkitRequestFullscreen) { /* Safari */
			elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) { /* IE11 */
			elem.msRequestFullscreen();
		}
		Pixies.addClass(document.body, 'fullscreen');
	}

	static closeFullscreen() {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) { /* Safari */
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) { /* IE11 */
			document.msExitFullscreen();
		}
		Pixies.removeClass(document.body, 'fullscreen');
	}

	static clone(obj) {
		if (obj === null || obj === undefined) {
			return obj;
		}
		return JSON.parse(JSON.stringify(obj));
	}

	static toUnique(arr) {
		return arr.filter((value, index, self) => self.indexOf(value) === index);
	}

	/*
	DEBUGGER

	let cycles = 0;
	let session = null;

	if (cycles <= 0) {
		cycles = 1000;
		if (session) Pixies.finishDebugSession(session);
		session = Pixies.startDebugSession(`Rendering ${cycles} cycles.`);
		Pixies.pauseDebugSession(session);
	}
	cycles--;

	Pixies.resumeDebugSession(session);
	...
	Pixies.pauseDebugSession(session);

	 */

	static startDebugSession(name) {
		const now = performance.now();
		return {
			name: name,
			start: now,
			beginning: now,
			elapsed: 0
		};
	}

	static finishDebugSession(session) {
		const now = performance.now();
		const duration = session.elapsed + (session.start ? now - session.start : 0);
		const total = now - session.beginning;
		console.log(`${session.name}' took ${Math.round(duration * 100 / total)} % (${duration} / ${total} ms.`);
		session.start = null;
	}

	static pauseDebugSession(session) {
		session.elapsed += performance.now() - session.start;
		session.start = null;
	}

	static resumeDebugSession(session) {
		session.start = performance.now();
	}

}
