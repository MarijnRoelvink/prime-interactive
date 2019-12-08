class Point {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    move(x, y, z) {
        this.x += x;
        this.y += y;
        this.z += z;
    }
}

function transform(p, x, y, z) {
    return new Point(p.x + x, p.y + y, p.z + z);
}

function getNormalsFromPlane(vertices) {
    let pA = vec3.clone(vertices.slice(0, 3));
    let pB = vec3.clone(vertices.slice(3, 6));
    let pC = vec3.clone(vertices.slice(6, 9));
    let norm = vec3.normalize(vec3.create(), vec3.cross(vec3.create(),
        vec3.sub(vec3.create(), pB, pA),
        vec3.sub(vec3.create(), pC, pA)));
    let res = [];
    for (let i = 0; i < 4; i++) {
        res = res.concat([norm[0], norm[1], norm[2]]);
    }
    return res;
}

/**
 * D------C
 * |      |
 * |      |
 * A------B
 * @returns texCoordinates
 */
function getTexCoordinatesFromPlane() {
    return [0, 1,
        1, 1,
        0, 0,
        1, 0];
}

function getBox(width, height, depth, base) {
    var wRadius = width / 2;
    var hRadius = height / 2;
    var dRadius = depth / 2;
    //     7-------6
    //  / |     / |
    // 3--4----2  5
    // |/      |/
    // 0------1
    var points = [new Point(base[0] - wRadius, base[1] - hRadius, base[2] - dRadius),
        new Point(base[0] + wRadius, base[1] - hRadius, base[2] - dRadius),
        new Point(base[0] + wRadius, base[1] + hRadius, base[2] - dRadius),
        new Point(base[0] - wRadius, base[1] + hRadius, base[2] - dRadius)];
    var vertices = getPlane(points[0], points[1], points[2], points[3]);
    for (var i = 0; i < 4; i++) {
        vertices = vertices.concat(getPlane(points[i], points[(i + 1) % 4],
            transform(points[(i + 1) % 4], 0, 0, depth), transform(points[i], 0, 0, depth)));
    }
    vertices = vertices.concat(getPlane(transform(points[0], 0, 0, depth),
        transform(points[1], 0, 0, depth),
        transform(points[2], 0, 0, depth),
        transform(points[3], 0, 0, depth)));
    return vertices;
}

// D------C
// |      |
// |      |
// A------B
function getPlane(pA, pB, pC, pD) {
    return [
        pB.x, pB.y, pB.z,
        pA.x, pA.y, pA.z,
        pC.x, pC.y, pC.z,
        pD.x, pD.y, pD.z
    ];
}