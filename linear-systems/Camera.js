class Camera {
    constructor(position, target = vec3.create([0,0,0]), up = vec3.create([0, 1, 0])) {
        this.position = position;
        this.up = up;
        this.target = target;
        this.matrix = mat4.create();
        mat4.lookAt(this.matrix, this.position, this.target, this.up);
    }

    setPosition(position) {
        this.position = position;
        this.matrix = mat4.lookAt(this.position, this.target, this.up);
    }

    setTarget(target) {
        this.target = target;
        this.matrix = mat4.lookAt(this.position, this.target, this.up);
    }

    setUpVec(up) {
        this.up = up;
        this.matrix = mat4.lookAt(this.position, this.target, this.up);
    }

    move(direction) {
        this.position = vec3.add(this.position, direction);
        this.target = vec3.add(this.target, direction);
        this.matrix = mat4.lookAt(this.position, this.target, this.up);
    }

    gumball(right, up) {
        var rotate;
        var rotatedPosVec;
        if(right) {
            rotate = mat4.fromRotation(mat4.create(), right, this.up);
            rotatedPosVec = vec4.transformMat4(vec4.create(), vec4.fromValues(this.position[0],this.position[1],this.position[2], 1), rotate);
            this.position = vec3.fromValues(rotatedPosVec[0]/rotatedPosVec[3],rotatedPosVec[1]/rotatedPosVec[3],rotatedPosVec[2]/rotatedPosVec[3]);
        }
        if(up) {
            rotate = mat4.fromRotation(mat4.create(), up, vec3.cross(vec3.create(), this.position, this.up));
            rotatedPosVec = vec4.transformMat4(vec4.create(), vec4.fromValues(this.position[0],this.position[1],this.position[2], 1), rotate);
            this.position = vec3.fromValues(rotatedPosVec[0]/rotatedPosVec[3],rotatedPosVec[1]/rotatedPosVec[3],rotatedPosVec[2]/rotatedPosVec[3]);
        }
        this.matrix = mat4.lookAt(this.matrix, this.position, this.target, this.up);
    }

}