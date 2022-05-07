import "./style.css";
import GameController from "./controller/GameController";
import GameModel from "./model/GameModel";
import GameRenderer from "./renderer/GameRenderer";

const MAX_DELTA = 500;
const DEBUG_MASTER = true;

const game = new GameModel();

const dom = window.document.body;

const controller = new GameController(game, dom);
controller.activate();

const renderer = new GameRenderer(game, dom);
renderer.activate();

if (DEBUG_MASTER) {
	window['game'] = game;
}

let lastTime = null;

const updateLoop = function ()
{
	const time = performance.now();
	if (!lastTime) lastTime = time;
	const delta = (time - lastTime);
	lastTime = time;

	if (delta < MAX_DELTA)
	{
		controller.update(delta);
		renderer.render();
	} else {
		console.log('skipped frame');
	}
	requestAnimationFrame(updateLoop);
}

requestAnimationFrame(updateLoop);
