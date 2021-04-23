![npm](https://img.shields.io/npm/dt/pixi-extended?style=flat-square)
![npm bundle size](https://img.shields.io/bundlephobia/min/pixi-extended?style=flat-square)

# PIXI-Extended

A framework as a npm library to help you develop with PIXI 2d games.

> Note:
> This package is bundled with PIXI `v6.0.2`, you don't have to install it.

## Installation

`npm i -s pixi-extended`

## Basic Usage
```js
import {Color, loadTexture, PIXI, Sprite} from 'pixi-extended';

const app = new PIXI.Application({
	backgroundColor: Color.BLACK.toHex(),
});

document.body.appendChild(app.view);

async function start() {
	await loadTexture("myTexture", "textures/myTexture.png");

	const red = new Color(1, 0, 0);
	const sprite = new Sprite("myTexture");
	sprite.color = red;

	sprite.addToApplication(app);
}

start();
```

## Documentation

The documentation is automatically generated and updated from the code.
[You can find it here.](https://ayfri.github.io/PIXI-Extended/index.html)
