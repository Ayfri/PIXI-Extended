const assert = require('assert');
const {Color, FPSCounter, getColoredTexture, mousePosition, PIXI, Sprite, Text, Vector2, updateMousePosition} = require('../dist/index.js');

describe('PIXI-Extended', () => {
	const app = new PIXI.Application({
		antialias: true,
		resizeTo: window,
		backgroundColor: 0xaaaaaa,
	});
	document.body.appendChild(app.view);

	const sprite = new Sprite(PIXI.Texture.WHITE);
	sprite.width = 50;
	sprite.height = 50;
	sprite.anchor.set(0.5, 0.5);
	sprite.addToApplication(app);

	describe('Sprites', () => {
		it('should be in application ', () => {
			assert.ok(app.stage.children.includes(sprite));
		});

		it('position should be right', () => {
			sprite.setPositionFromWindow(-0.1, -0.2);
			sprite.position.negate();
			assert.deepStrictEqual(sprite.position.toJSON(), new Vector2(window.innerWidth / 10, window.innerHeight / 5).toJSON());
		});

		it('should be random color', () => {
			sprite.color = Color.random();
			assert.notDeepStrictEqual(sprite.color, Color.WHITE);
		});

		const generatedColoredTexture = getColoredTexture(app, {
			width: 100,
			height: 100,
			color: new Color(0.5, 0.2, 0.2),
		});

		it('should be generated colored texture', () => {
			assert.deepStrictEqual(generatedColoredTexture.width, 100);
			assert.deepStrictEqual(generatedColoredTexture.height, 100);
		});

		const other = new Sprite(generatedColoredTexture);
		it('should be colliding', () => {
			other.setPositionFromWindow(0.1, 0.2);
			other.addToApplication(app);
			assert.ok(other.collidesWith(sprite));
		});

		it('should have details on collision', () => {
			const hit = other.collisionWith(sprite);
			assert.ok(hit.normal.y < 0);
		});
	});

	describe('Text', () => {
		const c = new Text({
			color: Color.random(),
			text: 'testing',
		});

		it('color should be random', () => {
			assert.notDeepStrictEqual(sprite.color, Color.WHITE);
		});

		c.position.set(50, 50);
		c.addToApplication(app);
	});

	describe('FPSCounter', () => {
		const counter = new FPSCounter();
		counter.addToApplication(app);

		it('should have a value', async () => {
			await new Promise(resolve => setTimeout(resolve, 1000));
			assert.notDeepStrictEqual(counter.text, '');
		});
	});

	describe('Mouse manager', () => {
		it('should have a value', () => {
			updateMousePosition(app);
			assert.notDeepStrictEqual(mousePosition, Vector2.ZERO);
		});
	});
});
