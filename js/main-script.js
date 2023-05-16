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
    createLeftLeg(robot, x-3, y-21, z-5);
    createRightLeg(robot, x+3, y-21, z-5);
    createLeftArm(robot, x-15, y, z-5);
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
}

function addWheel(obj, x, y, z) {
    geometry = new THREE.CylinderGeometry(24, 12, 16);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
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