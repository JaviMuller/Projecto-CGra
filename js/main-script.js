//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;

var geometry, material, mesh;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();


    scene.add(new THREE.AxisHelper(10));

    createRobot(0,0,0);

}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createRobot(x, y, z) {
    'use strict';

    var robot = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addBody(robot, x, y, z);
    addLegs(robot, x, y-21, z-5);
    addLeftArm(robot, x-15, y, z-5);
    createRightArm(robot, x+15, y, z-5);
    createHead(robot, x, y+6, z);
}

function addBody(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(24, 12, 16);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
    geometry = new THREE.CubeGeometry(12, 16, 18);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y-10, z-1);
    obj.add(mesh);
    geometry = new THREE.CubeGeometry(24, 4, 2);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y-15, z-11);
    obj.add(mesh);
    addWheel(obj, x+8, y-15, z-2, 0, 90, 0);
    addWheel(obj, x-8, y-15, z-2, 0, 90, 0);
}

function addWheel(obj, x, y, z, rotX, rotY, rotZ) {
    'use strict';

    geometry = new THREE.CylinderGeometry(4, 4, 4);
    geometry.rotateX(rotX);
    geometry.rotateY(rotY);
    geometry.rotateZ(rotZ);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addHead(obj, x, y, z) {
    'use strict';

    var head = new THREE.Object3D();

    geometry = new THREE.CubeGeometry(6, 6, 6);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y+3, z);
    head.add(mesh);

    geometry = new THREE.CubeGeometry(1, 1, 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x+2, y+4, z-3);
    head.add(mesh);
    geometry = new THREE.CubeGeometry(1, 1, 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-2, y+4, z-3);
    head.add(mesh);

    geometry = new THREE.CubeGeometry(0.5, 0.5, 3);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x+3.5, y+4, z);
    head.add(mesh);
    geometry = new THREE.CubeGeometry(0.5, 0.5, 3);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-3.5, y+4, z);
    head.add(mesh);
}

function addLegs(obj, x, y, z) {
    'use strict';

    var legs = new THREE.Object3D();

    addWheel(legs, x+8, y-17, z-1, 0, 90, 0);
    addWheel(legs, x+8, y-26, z-1, 0, 90, 0);
    addWheel(legs, x-8, y-17, z-1, 0, 90, 0);
    addWheel(legs, x-8, y-26, z-1, 0, 90, 0);

    geometry = new THREE.CubeGeometry(4, 6, 4);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x+3, y-3, z);
    legs.add(mesh);
    geometry = new THREE.CubeGeometry(4, 6, 4);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-3, y-3, z);
    legs.add(mesh);

    geometry = new THREE.CubeGeometry(6, 24, 6);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x+3, y-18, z);
    legs.add(mesh);
    geometry = new THREE.CubeGeometry(6, 24, 6);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-3, y-18, z);
    legs.add(mesh);

    geometry = new THREE.CylinderGeometry(2.5, 2.5, 6);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-8.5, y-9, z);
    legs.add(mesh);
    geometry = new THREE.CylinderGeometry(2.5, 2.5, 6);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x+8.5, y-9, z);
    legs.add(mesh);geometry = new THREE.CylinderGeometry(2.5, 2.5, 6);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-8.5, y-9, z);
    legs.add(mesh);

    addFeet(legs, x, y-30, z-1);

    obj.add(legs);
}

function addFeet(obj, x, y, z) {
    'use strict';

    var feet = new THREE.Object3D();

    geometry = new THREE.CubeGeometry(12, 6, 8);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x+3, y-3, z);
    feet.add(mesh);
    geometry = new THREE.CubeGeometry(12, 6, 8);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-3, y-3, z);
    feet.add(mesh);

    obj.add(feet);
}

function addLeftArm(obj, x, y, z) {
    'use strict';

    var leftArm = new THREE.Object3D();

    geometry = new THREE.CubeGeometry(6, 12, 6);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    leftArm.add(mesh);
    geometry = new THREE.CubeGeometry(6, 12, 18);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y-12, z-1);
    leftArm.add(mesh);
    geometry = new THREE.CylinderGeometry(1, 1, 8);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x+4, y-2, z);
    leftArm.add(mesh);
    geometry = new THREE.CylinderGeometry(0.5, 0.5, 8);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x+3.5, y+6, z);
    leftArm.add(mesh);
    geometry = new THREE.CylinderGeometry(2, 2, 1);
    geometry.rotate(90)
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y-10, z-10.5);
    leftArm.add(mesh);

    obj.add(leftArm);
}

function addRightArm(obj, x, y, z) {
    'use strict';

    var rightArm = new THREE.Object3D();

    geometry = new THREE.CubeGeometry(6, 12, 6);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    rightArm.add(mesh);
    geometry = new THREE.CubeGeometry(6, 12, 18);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y-12, z-1);
    rightArm.add(mesh);
    geometry = new THREE.CylinderGeometry(1, 1, 8);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-4, y-2, z);
    rightArm.add(mesh);
    geometry = new THREE.CylinderGeometry(0.5, 0.5, 8);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-3.5, y+6, z);
    rightArm.add(mesh);
    geometry = new THREE.CylinderGeometry(2, 2, 1);
    geometry.rotate(90)
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y-10, z-10.5);
    rightArm.add(mesh);

    obj.add(rightArm);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.render(scene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';

}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    update();
    display();

}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}