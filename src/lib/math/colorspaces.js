/**
 * @typedef {[number, number, number]} Triple
 */

/**
 * D65 in XYZ.
 * @type {Triple}
 */
export const D65 = [95.0489, 100, 108.884];

/**
 * Removes sRGB gamma from a channel value.
 *
 * @param {number} v sRGB Value (range: 0-255)
 * @return {number} Linear sRGB value (range: 0-1)
 */
export function toLinearSRGB(v) {
	v = v / 255;
	if (v <= 0.04045) {
		return v / 12.92;
	}
	return ((v + 0.055) / 1.055) ** 2.4;
}

/**
 * Converts an sRGB color to XYZ.
 * https://en.wikipedia.org/wiki/SRGB#From_sRGB_to_CIE_XYZ
 *
 * @param {Triple} Channel values [r; g; b] (Range: 0-255)
 * @return {Triple} [X; Y; Z]
 */
export function sRGBtoXYZ([r, g, b]) {
	r = toLinearSRGB(r);
	g = toLinearSRGB(g);
	b = toLinearSRGB(b);
	const x = 0.4124 * r + 0.3576 * g + 0.1805 * b;
	const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
	const z = 0.0193 * r + 0.1192 * g + 0.9505 * b;
	return [x, y, z];
}

/**
 * Converts an XYZ color to LAB;
 * https://en.wikipedia.org/wiki/CIELAB_color_space#Converting_between_CIELAB_and_CIEXYZ_coordinates
 *
 * @param {Triple} Channel values [X; Y; Z]
 * @param {Triple} White point [X; Y; Z]
 * @return {Triple} [L; a; b]
 */
export function XYZtoLAB([x, y, z], [xn, yn, zn] = D65) {
	/**
	 * @param {number} t
	 * @return {number}
	 */
	function f(t) {
		const d = 6 / 29;
		if (t > d ** 3) {
			return t ** (1 / 3);
		}
		return (1 / 3) * t * d ** -2 + 4 / 29;
	}
	const l = f(y / yn);
	const L = 116 * l - 16;
	const a = 500 * (f(x / xn) - l);
	const b = 200 * (l - f(z / zn));
	return [L, a, b];
}

/**
 * Calculates euclidian distance between two tripels
 *
 * @param {Triple} Triple A
 * @param {Triple} Triple B
 * @return {number} Euclidian distance
 */
export function euclidianDistanceSquared([ca1, ca2, ca3], [cb1, cb2, cb3]) {
	return (ca1 - cb1) ** 2 + (ca2 - cb2) ** 2 + (ca3 - cb3) ** 2;
}

/**
 * Calculates the CIE65 Delta E distance between two sRGB colors.
 * It's the most perceptually uniform, but it's the easiest to implement :3
 * https://en.wikipedia.org/wiki/Color_difference#CIE76
 *
 * @param {Triple} c1 Triple A
 * @param {Triple} c2 Triple B
 * @return {number} Euclidian distance
 */
export function deltaEsrgbSquared(c1, c2) {
	const lab1 = XYZtoLAB(sRGBtoXYZ(c1));
	const lab2 = XYZtoLAB(sRGBtoXYZ(c2));
	const d = euclidianDistanceSquared(lab1, lab2);
	return d;
}
