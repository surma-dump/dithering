/**
 * @param {number} value
 * @returns {boolean}
 */
export function isPowerOf2(value) {
	return (value & (value - 1)) === 0;
}
