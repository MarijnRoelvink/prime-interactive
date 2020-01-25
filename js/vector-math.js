function dot(vec1, vec2) {
    var res = 0;
    for(var  i = 0; i < vec1.length; i++) {
        res += vec1[i]*vec2[i];
    }
    return res;
}

function cross2d(vec1, vec2) {
    return vec1[0]*vec2[1] - vec1[1]*vec2[0];
}

function cross3d(vec1, vec2) {
    return [vec1[1] * vec2[2] - vec1[2] * vec2[1], vec1[2] * vec2[0] - vec1[0] * vec2[2], vec1[0] * vec2[1] - vec1[1] * vec2[0]];
}

function getVecSize(vec) {
    var res = 0;
    for(var  i = 0; i<vec.length; i++) {
        res += vec[i]*vec[i];
    }
    return Math.sqrt(res);
}

function getVecDistance(vec1, vec2) {
    let len = Math.min(vec1.length, vec2.length);
    let dist = 0;
    for (let i = 0; i < len; i++) {
        dist += Math.pow(vec1[i] - vec2[i], 2);
    }
    return Math.sqrt(dist);
}

/**
 * Calculate directed angle between two vectors
 * @param vec1 2D vector
 * @param vec2 2D vector
 * @returns {number}
 */
function getVectorAngle(vec1, vec2) {
    var cosT = Math.min(dot(vec1, vec2)/(getVecSize(vec1)*getVecSize(vec2)), 1.0);
    var sinT = cross2d(vec1, vec2)/(getVecSize(vec1)*getVecSize(vec2));
    return Math.atan(sinT/cosT);
}

function getXAxisAngle(vec) {
    let angle = vec3.angle(vec, [1, 0, 0]);
    if(vec[1] < 0) {
        angle = -angle;
    }
    return angle
}