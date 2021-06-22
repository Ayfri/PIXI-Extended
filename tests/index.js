const assert = require('assert');
const {clamp, Color, FPSCounter, getColoredTexture, isOdd, map, mousePosition, PIXI, Sprite, Text, updateMousePosition, Vector2} = require('../dist/index.js');

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

	describe('Color', () => {
		it('should be random color', () => {
			assert.notDeepStrictEqual(Color.random(), Color.WHITE);
		});

		it('should be inverted', () => {
			assert.deepStrictEqual(Color.WHITE, Color.BLACK.invert());
		});

		it('should be in hexadecimal format', () => {
			assert.deepStrictEqual(Color.GREEN.toHex(), 0x00ff00);
		});

		it('should be in hexadecimal stringed format', () => {
			assert.deepStrictEqual(Color.BLUE.toHexString(), '#0000ff');
		});

		it('should be red color from hex forms', () => {
			assert.deepStrictEqual(Color.RED, Color.fromHex(0xff0000));
			assert.deepStrictEqual(Color.RED, Color.fromHexString('#ff0000'));
		});

		it('should emit redChange event', () => {
			const color = new Color();
			color.on('redChange', v => assert.deepStrictEqual(v, 0.5));
			color.red = 0.5;
		});
	});

	describe('Math functions', () => {
		it('should be odd', () => {
			assert.ok(isOdd(2));
			assert.ok(!isOdd(1));
		});

		it('should be clamped', () => {
			assert.deepStrictEqual(clamp(10, 0, 5), 5);
			assert.deepStrictEqual(clamp(2, 0, 5), 2);
		});

		it('should be mapped', () => {
			assert.deepStrictEqual(map(10, 0, 20, 20, 40), 30);
			assert.deepStrictEqual(map(0, 10, 20, 20, 40), 0);
		});
	});

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

		it('should have a value', () => {
			counter.on('ready', async () => {
				assert.notDeepStrictEqual(counter.text, '');
				assert.ok(counter.ready);
			});
		});
	});

	describe('Mouse manager', () => {
		it('should have a value', () => {
			updateMousePosition(app);
			assert.notDeepStrictEqual(mousePosition, Vector2.ZERO);
		});
	});
});
