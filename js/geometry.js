
class Point {
    constructor(x, y, z){
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

function getBox(width, height, depth, base) {
    var wRadius = width/2;
    var hRadius = height/2
    var dRadius = depth/2;
    // Global variables for lighting calculations
    //     7-------6
    //  / |     / |
    // 3--4----2  5
    // |/      |/
    // 0------1
    var points = [new Point(base[0]-wRadius, base[1]-hRadius, base[2]-dRadius),
        new Point(base[0]+wRadius, base[1]-hRadius, base[2]-dRadius),
        new Point(base[0]+wRadius, base[1]+hRadius, base[2]-dRadius),
        new Point(base[0]-wRadius, base[1] +hRadius, base[2]-dRadius)];
    var vertices = getPlane(points[0],points[1],points[2],points[3]);
    for (var i = 0; i < 4; i++) {
        vertices = vertices.concat(getPlane(points[i], points[(i+1)%4],
            transform(points[(i+1)%4], 0, 0, depth), transform(points[i], 0, 0, depth)));
    }
    vertices = vertices.concat(getPlane(transform(points[0], 0, 0, depth),
        transform(points[1], 0, 0, depth),
        transform(points[2], 0, 0, depth),
        transform(points[3], 0, 0, depth)));
    return vertices;
}

// Global variables for lighting calculations
// D------C
// |      |
// |      |
// A------B
function getPlane(pA, pB, pC, pD) {
    return vertices = [
        pB.x, pB.y, pB.z,
        pA.x, pA.y, pA.z,
        pC.x, pC.y, pC.z,
        pD.x, pD.y, pD.z
    ];
}