function initGL() {
    var canvas = document.getElementById('glCanvas');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    var gl = canvas.getContext('webgl');
    // Only continue if WebGL is available and working
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    return gl;
}

function loadMesh(gl, programInfo, mesh) {
    //load the mesh into buffers for vertex, normal and texture coordinates and add those to the mesh object
    OBJ.initMeshBuffers(gl, mesh);

    //mesh.vertexBuffer is now current buffer retrieve data from
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
    //binds the current vertex buffer to the pos attribute in the shader
    gl.vertexAttribPointer(programInfo.attribLocations.pos, mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.pos);

    //mesh.normalBuffer is now current buffer retrieve data from
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
    //binds the current vertex buffer to the norm attribute in the shader
    gl.vertexAttribPointer(programInfo.attribLocations.norm, mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.norm);
    return mesh;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function loadShaders(gl) {

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, document.getElementById("vertex-shader").text);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, document.getElementById("fragment-shader").text);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function loadPlane(gl, programInfo, pA, pC) {
    var vertexBuffer = gl.createBuffer();

    //vertexBuffer is now current buffer retrieve data from
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    const vertices = [
        pC.x, pA.y, 0.0,
        pA.x, pA.y, 0.0,
        pC.x, pC.y, 0.0,
        pA.x, pC.y, 0.0
    ];

    programInfo.pA = pA;
    programInfo.pC = pC;
    //insert data into the current vertex buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    //binds the current vertex buffer to the pos attribute in the shader
    gl.vertexAttribPointer(programInfo.attribLocations.pos, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.pos);
}

function loadTexture(gl, programInfo, image) {
    const texture = gl.createTexture();

    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    return texture;
}

function draw(meshes) {
    var gl = initGL();
    var shaderProgram = loadShaders(gl);
    gl.useProgram(shaderProgram);
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            pos: gl.getAttribLocation(shaderProgram, 'pos'),
            norm: gl.getAttribLocation(shaderProgram, 'norm')
        },
        uniformLocations: {
            textoon: gl.getUniformLocation(shaderProgram, 'texToon'),
        },
    };
    var mesh = loadMesh(gl,  programInfo, meshes.gears);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
    gl.drawElements(gl.TRIANGLES, mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

OBJ.downloadMeshes({
    'gears': 'assets/mesh/Gear.obj'
}, draw);
