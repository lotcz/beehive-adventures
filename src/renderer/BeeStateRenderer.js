import DomRenderer from "./DomRenderer";
import LifeImage from "../../res/img/life.svg";
import HeartImage from "../../res/img/heart.svg";

import {MAX_HEALTH} from "../model/BeeStateModel";
import {
	GREEN_DARKEST,
	GREEN_LIGHT,
	ORANGE_DARK,
	ORANGE_DARKEST, ORANGE_LIGHT, ORANGE_MEDIUM,
	RED_DARKEST,
	RED_LIGHT,
	RED_MEDIUM
} from "../builder/Palette";
import {EDIT_MODE_ENABLED} from "../model/GameModel";
import Pixies from "../class/Pixies";

const HEALTH_COLORS = [
	{
		maxHealth: 0.25,
		color: RED_LIGHT,
		borderColor: RED_MEDIUM
	},
	{
		maxHealth: 0.5,
		color: ORANGE_MEDIUM,
		borderColor: ORANGE_DARKEST
	},
	{
		maxHealth: MAX_HEALTH,
		color: GREEN_LIGHT,
		borderColor: GREEN_DARKEST
	}
];

const HEALTH_UNIT_WIDTH = 140;
const LIFE_WIDTH = 35;

export default class BeeStateRenderer extends DomRenderer {
	mainElement;
	livesElement;
	healthElement;
	healthWrapperElement;

	/**
	 * @type BeeStateModel
	 */
	model;

	/**
	 * @param {GameModel} game
	 * @param {BeeStateModel} model
	 * @param dom
	 */
	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.mainElement = null;
		this.livesElement = null;
		this.healthElement = null;
		this.healthWrapperElement = null;
	}

	activateInternal() {
		this.mainElement = this.createElement(this.dom, 'div', ['menu', 'status-bar']);

		this.healthWrapperElement = this.createElement(this.mainElement, 'div', ['health-wrapper']);
		this.healthElement =  this.createElement(this.healthWrapperElement, 'div', ['health']);
		this.healthWrapperElement.style.backgroundImage = `url('${HeartImage}')`;
		this.healthElement.style.backgroundImage = `url('${HeartImage}')`;

		this.livesElement = this.createElement(this.mainElement, 'div', ['lives']);

		this.renderLives();
	}

	deactivateInternal() {
		if (this.mainElement) this.removeElement(this.mainElement);
		this.mainElement = null;
	}

	renderInternal() {
		if (this.model.lives.isDirty() || this.model.maxLives.isDirty()) {
			this.renderLives();
			this.model.lives.clean();
			this.model.maxLives.clean();
		}
		if (this.model.health.isDirty() || this.model.maxHealth.isDirty()) {
			this.renderHealth();
			this.model.health.clean();
			this.model.maxHealth.clean();
		}
		if (this.model.healthHighlighted.isDirty()) {
			if (this.model.healthHighlighted.get()) {
				Pixies.addClass(this.healthWrapperElement, 'highlighted');
			} else {
				Pixies.removeClass(this.healthWrapperElement, 'highlighted');
			}
			this.model.healthHighlighted.clean();
		}
		if (this.model.lifeHighlighted.isDirty()) {
			if (this.model.lifeHighlighted.get()) {
				setTimeout(() =>	Pixies.addClass(this.livesElement, 'highlighted'), 100);
			} else {
				Pixies.removeClass(this.livesElement, 'highlighted');
			}
			this.model.lifeHighlighted.clean();
		}
		this.model.clean();
	}

	renderLives() {
		this.livesElement.innerHTML = '';
		const max = this.model.maxLives.get();
		for (let i = 0; i < max; i++) {
			const img = this.createElement(this.livesElement, 'img', i < this.model.lives.get() ? 'unused' : 'used');
			img.src = LifeImage;
		}
		this.renderHealth();
	}

	renderHealth() {
		const health = this.model.health.get();
		const state = health / this.model.maxHealth.get();
		this.healthElement.style.width = `${state * 100}%`;

		let i = 0;
		const len = HEALTH_COLORS.length - 1;
		while (i < len && state > HEALTH_COLORS[i].maxHealth) {
			i++;
		}
		this.healthElement.style.backgroundColor = HEALTH_COLORS[i].color;
		this.healthWrapperElement.style.borderColor = HEALTH_COLORS[i].borderColor;
		this.updateWidth();
	}

	updateWidth() {
		const healthWidth = this.model.maxHealth.get() * HEALTH_UNIT_WIDTH;
		this.healthWrapperElement.style.width = `${healthWidth}px`;
		const livesWidth = LIFE_WIDTH * this.model.maxLives.get();
		const totalWidth = Math.max(healthWidth, livesWidth);
		this.mainElement.style.marginLeft = `-${totalWidth / 2}px`;
	}
}
