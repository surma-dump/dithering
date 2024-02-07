import Color from 'colorjs.io';

/**
 * @typedef {[number, number, number]} Triple
 */

/**
 * @param {number} v
 * @return {number}
 */
function normalize(v) {
	return v / 255;
}

/**
 * Calculates the DeltaE OK distance between two sRGB colors.
 *
 * @param {Triple} c1 Triple A
 * @param {Triple} c2 Triple B
 * @return {number} Delta E distance
 */
export function deltaEsrgbSquared(c1, c2) {
	return Color.deltaEOK(new Color('srgb', c1.map(normalize)), new Color('srgb', c2.map(normalize)));
}
