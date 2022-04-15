import MenuModel from "../model/MenuModel";
import MenuLineModel from "../model/MenuLineModel";

export default class MenuBuilder {
	menu;

	constructor(css = null) {
		this.menu = new MenuModel();

		if (css) {
			this.setCss(css);
		}
	}

	setCss(css) {
		this.menu.css = css;
	}

	addLine(label, onClick) {
		const menuLine = new MenuLineModel({
			text: {
				label: label
			},
			onClick: onClick
		});
		this.menu.addChild(menuLine);
		return menuLine;
	}

	build() {
		return this.menu;
	}

}
