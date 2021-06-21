import {Color, FPSCounter, mousePosition, PIXI, Rectangle, Sprite, Text, Vector2, updateMousePosition} from '../dist/bundle.js';

const app = new PIXI.Application({
	antialias: true,
	resizeTo: window,
	backgroundColor: 0xaaaaaa,
});
document.body.appendChild(app.view);

// custom sprite class
const b = new Sprite(PIXI.Texture.WHITE);
b.width = 50;
b.height = 50;
b.addToApplication(app);

// positions
b.setPositionFromWindow(-0.1, -0.2);
b.position.negate();
console.log(JSON.stringify(new Rectangle(b.hitBox), null, 4), new Vector2(b.anchor).xy);
b.anchor.set(0.5, 0.5);
console.log(JSON.stringify(b.hitBox, null, 4), JSON.stringify(b.position, null, 4));
console.log(b.position);

// colors
b.color = Color.random();
console.log(b.tint, b.color, b.color.toHex(), b.color.toHexString(), b.color.invert());

// fps counter
const a = new FPSCounter();
a.addToApplication(app);

// text
const c = new Text({
	color: Color.random(),
	text: 'testing',
});
c.position.set(50, 50);
c.addToApplication(app);

// Testing collisions and mouse
PIXI.Ticker.shared.add(() => {
	updateMousePosition(app);
	if (b.hitBox.contains(mousePosition.x, mousePosition.y)) {
		b.color = Color.BLUE;
	} else {
		b.color = Color.WHITE;
	}
});

window.app = app;
