const assert = require('assert');
const {
	clamp,
	Color,
	FPSCounter,
	getColoredTexture,
	isOdd,
	map,
	mousePosition,
	PIXI,
	randomArray,
	randomFloat,
	randomInt,
	Sprite,
	Text,
	updateMousePosition,
	Vector2,
} = require('../dist/index.js');

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
		it('should detect odd numbers', () => {
			assert.ok(isOdd(2));
			assert.ok(!isOdd(1));
		});

		it('should clamp number', () => {
			assert.deepStrictEqual(clamp(10, 0, 5), 5);
			assert.deepStrictEqual(clamp(2, 0, 5), 2);
		});

		it('should map number', () => {
			assert.deepStrictEqual(map(10, 0, 20, 20, 40), 30);
			assert.deepStrictEqual(map(0, 10, 20, 20, 40), 0);
		});
	});

	describe('Random functions', () => {
		it('should output a random value from the array in a uniform way', () => {
			const array = [...Array(5).keys()];
			const res = new Array(5).fill(0);
			for (let i = 0; i < 1000; i++) {
				res[randomArray(array)]++;
			}

			assert.ok(res.every(value => Math.abs(value - 1000 / res.length) < 50));
		});

		it('should output a random int from the range in a uniform way', () => {
			const res = new Array(5).fill(0);
			for (let i = 0; i < 1000; i++) {
				res[randomInt(res.length - 1)]++;
			}

			assert.ok(res.every(value => Math.abs(value - 1000 / res.length) < 50));
		});

		it('should output a random float from the range in a uniform way', () => {
			const res = [];
			for (let i = 0; i < 1000; i++) {
				res.push(randomFloat(10, 20));
			}

			assert.ok(new Set(res).size === res.length && Math.min(...res) >= 10 && Math.max(...res) <= 20);
		});
	});

	describe('Vectors', () => {
		it('should have basic vectors operations working', () => {
			const vector = new Vector2(-2, 5);

			assert.deepStrictEqual(new Vector2(1, 1).add(vector), new Vector2(-1, 6));
			assert.deepStrictEqual(new Vector2(1, 1).subtract(vector), new Vector2(3, -4));
			assert.deepStrictEqual(new Vector2(1, 1).multiply(vector), new Vector2(-2, 5));
			assert.deepStrictEqual(new Vector2(1, 1).divide(vector), new Vector2(-0.5, 0.2));
			assert.deepStrictEqual(vector.x, -2);
			assert.deepStrictEqual(vector.y, 5);
			assert.deepStrictEqual(vector.at(0), -2);
			assert.deepStrictEqual(vector.at(1), 5);
			assert.deepStrictEqual(vector.xy, [-2, 5]);
			assert.deepStrictEqual(vector.set(3, 3), new Vector2(3, 3));
			assert.deepStrictEqual(Vector2.zero, new Vector2());
		});

		it('should have basic math operations working', () => {
			assert.deepStrictEqual(new Vector2(-5, 1).abs(), new Vector2(5, 1));
			assert.deepStrictEqual(new Vector2(-5, 1).negate(), new Vector2(5, -1));
		});

		it('should have vectors comparison working', () => {
			const vector1 = new Vector2(-5, 1);

			assert.ok(vector1.equals(vector1));
			assert.ok(vector1.greaterThan(new Vector2(-6, 0)));
			assert.ok(!vector1.greaterThan(new Vector2(-5, 0)));
			assert.ok(!vector1.greaterThan(new Vector2(-6, 1)));
			assert.deepStrictEqual(Vector2.max(vector1, new Vector2(-6, 1)), vector1);
			assert.deepStrictEqual(Vector2.max(vector1, new Vector2(-4, 0)), new Vector2(-4, 1));
			assert.deepStrictEqual(Vector2.min(vector1, new Vector2(-4, 2), new Vector2(-2, -4)), new Vector2(-5, -4));
		});

		it('should have complex vectors operations working', () => {
			assert.deepStrictEqual(new Vector2(3, 4).normalize(), new Vector2(0.6, 0.8));
			assert.deepStrictEqual(new Vector2(3, 4).length(), 5);
			assert.deepStrictEqual(new Vector2(3, 4).squaredLength(), 25);
			assert.deepStrictEqual(Vector2.direction(new Vector2(2, 2), new Vector2(4, 2)), new Vector2(-1, 0));
			assert.deepStrictEqual(Vector2.lerp(new Vector2(2, 2), new Vector2(4, 4), 0.5), new Vector2(3, 3));
			assert.deepStrictEqual(Vector2.distance(new Vector2(1, 3), new Vector2(5, 2)), Math.sqrt(17));
			assert.deepStrictEqual(Vector2.dot(new Vector2(1, 3), new Vector2(5, 2)), 11);
		});

		it('should have other vectors operations working', () => {
			assert.deepStrictEqual(new Vector2(2, 6).deepClone(), new Vector2(2, 6));
		});
	});

	describe('Sprites', () => {
		it('should be in application ', () => {
			assert.ok(app.stage.children.includes(sprite));
		});

		it('should be in right position after operations on position', () => {
			sprite.setPositionFromWindow(-0.1, -0.2);
			sprite.position.negate();
			assert.deepStrictEqual(sprite.position.toJSON(), new Vector2(window.innerWidth / 10, window.innerHeight / 5).toJSON());
		});

		it('should have random color', () => {
			sprite.color = Color.random();
			assert.notDeepStrictEqual(sprite.color, Color.WHITE);
		});

		const generatedColoredTexture = getColoredTexture(app, {
			width: 100,
			height: 100,
			color: new Color(0.5, 0.2, 0.2),
		});

		it('should have generated colored texture', () => {
			assert.deepStrictEqual(generatedColoredTexture.width, 100);
			assert.deepStrictEqual(generatedColoredTexture.height, 100);
		});

		const other = new Sprite(generatedColoredTexture);
		it('should be colliding with other sprite', () => {
			other.setPositionFromWindow(0.1, 0.2);
			other.addToApplication(app);
			assert.ok(other.collidesWith(sprite));
		});

		it('should have details on collision with other sprite', () => {
			const hit = other.collisionWith(sprite);
			assert.ok(hit.normal.y < 0);
		});
	});

	describe('Text', () => {
		const c = new Text({
			color: Color.random(),
			text: 'lorem ipsum',
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

		it('should have an FPS value after some time', () => {
			counter.on('ready', async () => {
				assert.notDeepStrictEqual(counter.text, '');
				assert.ok(counter.ready);
			});
		});
	});

	describe('Mouse manager', () => {
		it('should have a value for mousePosition when updated', () => {
			updateMousePosition(app);
			assert.notDeepStrictEqual(mousePosition, Vector2.ZERO);
		});
	});
});
