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
        this.position = vec3.rotateZ(this.position, this.position, this.target, right);
        if(up) {
            var vecXAx = vec3.fromValues(Math.sqrt(Math.pow(vec3.len(this.position), 2) - Math.pow(this.position[2],2)),
                0, this.position[2]);
            var newVec = vec3.rotateY(vec3.create(), vecXAx, this.target, up);
            vec3.rotateZ(newVec, newVec, [0,0,0], vec3.angle(this.position, vecXAx));
            this.position = newVec;
        }
        // this.up = vec3.rotateZ(this.up, this.up, [0,0,0], up);
        this.matrix = mat4.lookAt(this.matrix, this.position, this.target, this.up);
    }

}