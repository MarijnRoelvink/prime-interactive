class Camera {
    constructor(position, target = vec3.create([0,0,0]), up = vec3.create([0, 1, 0]), zoom = 1) {
        this.position = position;
        this.up = up;
        this.target = target;
        this.zoom = zoom;
        this.matrix = mat4.create();
        this.updateMatrix();
    }

    setPosition(position) {
        this.position = position;
        this.updateMatrix();
    }

    getPosition() {
        return vec3.scale(vec3.create(), this.position, this.zoom);
    }

    setTarget(target) {
        this.target = target;
        this.updateMatrix();
    }

    setUpVec(up) {
        this.up = up;
        this.updateMatrix();
    }

    setZoom(zoom) {
        this.zoom = zoom;
        this.updateMatrix();
    }

    move(direction) {
        this.position = vec3.add(this.position, direction);
        this.target = vec3.add(this.target, direction);
        this.updateMatrix();
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
        this.updateMatrix();
    }

    updateMatrix() {
        this.matrix = mat4.lookAt(this.matrix, this.getPosition(), this.target, this.up);
    }

}