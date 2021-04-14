import * as PIXI from 'pixi.js';

export type TextureOrName = string | PIXI.Texture;
export type TextureNameAndPath = [name: string, path: string];
export type TexturesNameAndPath = {
	[n: string]: string;
};

export type TexturesAndName = {
	[n: string]: PIXI.Texture;
};

export const loadedTexturesNames: string[] = [];

export async function loadTextures(texturesNamesAndPath: TexturesNameAndPath): Promise<TexturesAndName>;
export async function loadTextures(texturesNamesAndPath: TextureNameAndPath[]): Promise<TexturesAndName>;
export async function loadTextures(texturesNamesAndPath: TextureNameAndPath[] | TexturesNameAndPath): Promise<TexturesAndName> {
	const textures: TextureNameAndPath[] = texturesNamesAndPath instanceof Array ? texturesNamesAndPath : Object.entries(texturesNamesAndPath);

	await new Promise(resolve => {
		textures.forEach(t => PIXI.Loader.shared.add(t[0], t[1]));
		PIXI.Loader.shared.load(resolve);
	});
	loadedTexturesNames.push(...textures.map(t => t[0]));

	const result: TexturesAndName = {};
	textures.forEach(t => (result[t[0]] = PIXI.Loader.shared.resources[t[0]].texture!));
	return result;
}

export async function loadTexture(name: string, path: string): Promise<PIXI.Texture>;
export async function loadTexture(texturesNameAndPath: TextureNameAndPath): Promise<PIXI.Texture>;
export async function loadTexture(texture: TextureNameAndPath | string, path?: string): Promise<PIXI.Texture> {
	const name = texture instanceof Array ? texture[0] : texture;

	await new Promise(resolve => {
		PIXI.Loader.shared.add(name, texture[1] ?? path);
		loadedTexturesNames.push(name);
		PIXI.Loader.shared.load(resolve);
	});

	return PIXI.Loader.shared.resources[name].texture!;
}

export function getTexture(name: string): PIXI.Texture | null {
	return loadedTexturesNames.includes(name) ? PIXI.Loader.shared.resources[name].texture! : null;
}

export function getTextureOrThrow(name: string): PIXI.Texture {
	if (loadedTexturesNames.includes(name)) return PIXI.Loader.shared.resources[name].texture!;
	else throw new Error(`Texture '${name}' not found.`);
}
