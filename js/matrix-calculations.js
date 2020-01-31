/**
 * Adds row1 to row2 with a given factor
 * @param row1: [a1, b1, c1, d1]
 * @param row2: [a2, b2, c2, d2]
 * @param factor
 * @returns updated row2
 */
function rowAddition(row1, row2, factor) {
	let res = [];
	for (let i = 0; i < 4; i++) {
		res.push(row2[i] + row1[i] * factor);
	}
	return res;
}

/**
 * Multiply row with factor
 * @param row: [a, b, c, d]
 * @param factor
 * @returns updated row
 */
function rowMultiplication(row, factor) {
	let res = [];
	for (let i = 0; i < row.length; i++) {
		res.push(factor * row[i]);
	}
	return res;
}

/**
 * Solves z for the formula ax + by + cz = d:
 * ax + by - d = -cz
 * (ax + by - d)/-c = z
 * @param x: x coordinate
 * @param y: y coordinate
 * @param params: [a, b, c, d]
 * @returns z
 */
function getZ(x, y, params) {
	return (params[0] * x + params[1] * y - params[3]) / (-1 * params[2]);
}

/**
 * Solves y for the formula ax + by + cz = d:
 * ax + cz - d = -by
 * (ax + cz - d)/-b = y
 * @param x: x coordinate
 * @param z: z coordinate
 * @param params: [a, b, c, d]
 * @returns y
 */
function getY(x, z, params) {
	return (params[0] * x + params[2] * z - params[3]) / (-1 * params[1]);
}

/**
 * Solves x for the formula ax + by + cz = d:
 * by + cz - d = -ax
 * (by + cz - d)/-a = x
 * @param y: y coordinate
 * @param z: z coordinate
 * @param params [a, b, c, d]
 * @returns x
 */
function getX(y, z, params) {
	return (params[1] * y + params[2] * z - params[3]) / (-1 * params[0]);
}

/**
 * solves the matrix equation A*X = B
 * @param mA: mat2
 * @param mB: mat2
 * @returns mat2
 */
function solve2DMatrixEquation(mA, mB) {
	if (mat2.determinant(mA)) {
		return mat2.multiply(mat2.create(), mB, mat2.invert(mA, mA));
	} else {
		console.log("matrix A was not invertible");
		return mat2.create();
	}
}