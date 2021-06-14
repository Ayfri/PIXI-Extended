import * as PIXI from 'pixi.js';
import {Sprite} from '../sprites';
import {Color} from '../utils';

/**
 * A texture or its name.
 */
export type TextureOrName = string | PIXI.Texture;
/**
 * A tuple containing the texture name and its path.
 */
export type TextureNameAndPath = [name: string, path: string];
/**
 * A record containing texture names as keys, and their paths as values.
 */
export type TexturesNameAndPath = Record<string, string>;
/**
 * A record containing textures names as keys, and themselves as values.
 */
export type TexturesAndName = Record<string, PIXI.Texture>;

/**
 * The list of textures loaded via the {@link loadTextures} and {@link loadTexture} functions.
 */
export const loadedTexturesNames: string[] = [];

export async function loadTextures(texturesNamesAndPath: TexturesNameAndPath): Promise<TexturesAndName>;
export async function loadTextures(texturesNamesAndPath: TextureNameAndPath[]): Promise<TexturesAndName>;
/**
 * Loads the following textures via the {@link PIXI.Loader.shared} loader.
 *
 * @param texturesNamesAndPath - The textures to load, as a list or a record.
 * @returns - The loaded textures as a record.
 */
export async function loadTextures(texturesNamesAndPath: TextureNameAndPath[] | TexturesNameAndPath): Promise<TexturesAndName> {
	const textures: TextureNameAndPath[] = texturesNamesAndPath instanceof Array ? texturesNamesAndPath : Object.entries(texturesNamesAndPath);

	await new Promise(resolve => {
		textures.forEach(([name, path]) => PIXI.Loader.shared.add(name, path));
		PIXI.Loader.shared.load(resolve);
	});
	loadedTexturesNames.push(...textures.map(t => t[0]));

	const result: TexturesAndName = {};
	textures.forEach(([name]) => (result[name] = PIXI.Loader.shared.resources[name].texture!));
	return result;
}

export async function loadTexture(name: string, path: string): Promise<PIXI.Texture>;
export async function loadTexture(texturesNameAndPath: TextureNameAndPath): Promise<PIXI.Texture>;
/**
 * Loads the following texture via the {@link PIXI.Loader.shared} loader.
 *
 * @param texture - The texture to load or the texture and the path/.
 * @param path - The texture path if not put in the first argument.
 * @returns - The loaded texture.
 */
export async function loadTexture(texture: TextureNameAndPath | string, path?: string): Promise<PIXI.Texture> {
	const name = texture instanceof Array ? texture[0] : texture;
	path ??= texture[1];

	await new Promise(resolve => {
		PIXI.Loader.shared.add(name, path!);
		PIXI.Loader.shared.load(resolve);
	});
	loadedTexturesNames.push(name);

	return PIXI.Loader.shared.resources[name].texture!;
}

/**
 * Get a texture from the {@link PIXI.Loader.shared} loader, must be present in the {@link loadedTexturesNames} to asserts that it has been loaded.
 *
 * @param name - The name of the texture to search.
 * @returns - The resulting texture or null if not found.
 */
export function getTexture(name: string): PIXI.Texture | null {
	return loadedTexturesNames.includes(name) ? PIXI.Loader.shared.resources[name].texture! : null;
}

/**
 * Get a texture from the {@link PIXI.Loader.shared} loader, must be present in the {@link loadedTexturesNames} to asserts that it has been loaded.
 *
 * @remarks Throws an error if the texture was not found in the {@link loadedTexturesNames}.
 *
 * @param name - The name of the texture to search.
 * @returns - The resulting texture.
 */
export function getTextureOrThrow(name: string): PIXI.Texture {
	if (loadedTexturesNames.includes(name)) return PIXI.Loader.shared.resources[name].texture!;
	else throw new Error(`Texture '${name}' not found.`);
}

/**
 * The options for a colored texture.
 */
export interface ColoredTextureOptions {
	/**
	 * The color of the texture.
	 * @default {@link Color.WHITE}
	 */
	color?: Color;
	/**
	 * The height of the texture.
	 * @default 100
	 */
	height?: number;
	/**
	 * The width of the texture.
	 * @default 100
	 */
	width?: number;
}

/**
 * Generate a texture from the Application renderer and options.
 *
 * @param application - The application, needed to get the renderer.
 * @param options - The options of the colored texture.
 * @returns - The resulting texture.
 */
export function getColoredTexture(application: PIXI.Application, options: ColoredTextureOptions): PIXI.Texture {
	const sprite = new Sprite(PIXI.Texture.WHITE);
	sprite.width = options.width ?? 100;
	sprite.height = options.height ?? 100;
	sprite.color = options.color ?? Color.WHITE;

	return application.renderer.generateTexture(sprite, PIXI.SCALE_MODES.LINEAR, 1, sprite.hitBox);
}
