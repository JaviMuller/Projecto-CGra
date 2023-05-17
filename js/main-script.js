//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;

var geometry, material, mesh;

const SCENE_WIDTH = 250;
const SCENE_HEIGHT = 100;
const SCENE_DEPTH = SCENE_WIDTH;

function deg_to_rad(degrees) {
    return degrees * (Math.PI/180);
}

function rad_to_deg(radians) {
    return radians * (180/Math.PI);
}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0xbae5f2);

    scene.add(new THREE.AxisHelper(10));

}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
    'use strict';
    // Front view
    var front_camera = new THREE.OrthographicCamera(-SCENE_WIDTH/2, SCENE_WIDTH/2, SCENE_HEIGHT/2, -SCENE_HEIGHT/2, SCENE_DEPTH/1000, SCENE_DEPTH);
    front_camera.position.set(0, 0, SCENE_DEPTH/2);
    front_camera.lookAt(scene.position);
    scene.add(front_camera);
    //camera = front_camera;

    // Lateral view
    var lateral_camera = new THREE.OrthographicCamera(-SCENE_DEPTH/2, SCENE_DEPTH/2, SCENE_HEIGHT/2, -SCENE_HEIGHT/2, SCENE_WIDTH/1000, SCENE_WIDTH);
    lateral_camera.position.set(SCENE_WIDTH/2, 0, 0);
    lateral_camera.lookAt(scene.position);
    scene.add(lateral_camera);
    //camera = lateral_camera;

    // Top view
    var top_camera = new THREE.OrthographicCamera(-SCENE_WIDTH/2, SCENE_WIDTH/2, SCENE_DEPTH/2, -SCENE_DEPTH/2, SCENE_HEIGHT/1000, SCENE_HEIGHT);
    top_camera.position.set(0, SCENE_HEIGHT/2, 0);

    top_camera.lookAt(scene.position);
    scene.add(top_camera);

    /////////// ISOMETRIC VIEWS ///////////
    const VERTICAL_ROTATION = rad_to_deg(Math.atan(Math.sin(Math.PI/4)));

    var dist = new THREE.Vector3(0, 0, SCENE_DEPTH/2);
    var sphericalCoord = new THREE.Spherical();
    sphericalCoord.setFromVector3(dist);
    sphericalCoord.phi = THREE.Math.degToRad(-45);
    sphericalCoord.theta = THREE.Math.degToRad(VERTICAL_ROTATION);

    var vec = new THREE.Vector3().setFromSpherical(sphericalCoord);

    // Orthogonal isometric view
    var iso_orth_camera = new THREE.OrthographicCamera(-SCENE_WIDTH/2, SCENE_WIDTH/2, SCENE_HEIGHT/2, -SCENE_HEIGHT/2, SCENE_DEPTH/1000, SCENE_DEPTH);    
    iso_orth_camera.position.set(vec.x, vec.y, vec.z);
    iso_orth_camera.lookAt(scene.position);
    scene.add(iso_orth_camera);
    //camera = iso_orth_camera;

    // Perspective isometric view
    var iso_persp_camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    iso_persp_camera.position.set(vec.x, vec.y, vec.z);
    iso_persp_camera.lookAt(scene.position);
    scene.add(iso_persp_camera);
    camera = iso_persp_camera;
}

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
    addLegs(robot, x, y-18, z-5);
    addLeftArm(robot, x+15, y, z+5);
    addRightArm(robot, x-15, y, z+5);
    addHead(robot, x, y+6, z);

    scene.add(robot);
}

function addBody(obj, x, y, z) {
    'use strict';

    geometry = new THREE.BoxGeometry(24, 12, 16);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
    geometry = new THREE.BoxGeometry(12, 16, 18);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y-10, z-1);
    obj.add(mesh);
    geometry = new THREE.BoxGeometry(24, 4, 2);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y-15, z-11);
    obj.add(mesh);
    addWheel(obj, x+8, y-15, z-2, 0, 90, 90);
    addWheel(obj, x-8, y-15, z-2, 0, 90, 90);
}

function addWheel(obj, x, y, z, rotX, rotY, rotZ) {
    'use strict';

    geometry = new THREE.CylinderGeometry(4, 4, 4);
    geometry.rotateX(deg_to_rad(rotX));
    geometry.rotateY(deg_to_rad(rotY));
    geometry.rotateZ(deg_to_rad(rotZ));
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addHead(obj, x, y, z) {
    'use strict';

    var head = new THREE.Object3D();

    geometry = new THREE.BoxGeometry(6, 6, 6);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y+3, z);
    head.add(mesh);

    geometry = new THREE.BoxGeometry(1, 1, 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x+2, y+4, z-3);
    head.add(mesh);
    geometry = new THREE.BoxGeometry(1, 1, 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-2, y+4, z-3);
    head.add(mesh);

    geometry = new THREE.CylinderGeometry(0.5, 0.5, 3);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x+3.5, y+4, z);
    head.add(mesh);
    geometry = new THREE.CylinderGeometry(0.5, 0.5, 3);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-3.5, y+4, z);
    head.add(mesh);
    
    obj.add(head);
}

function addLegs(obj, x, y, z) {
    'use strict';

    var legs = new THREE.Object3D();

    addWheel(legs, x+8, y-17, z-1, 0, 90, 90);
    addWheel(legs, x+8, y-26, z-1, 0, 90, 90);
    addWheel(legs, x-8, y-17, z-1, 0, 90, 90);
    addWheel(legs, x-8, y-26, z-1, 0, 90, 90);

    geometry = new THREE.BoxGeometry(4, 6, 4);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x+3, y-3, z);
    legs.add(mesh);
    geometry = new THREE.BoxGeometry(4, 6, 4);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-3, y-3, z);
    legs.add(mesh);

    geometry = new THREE.BoxGeometry(6, 24, 6);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x+3, y-18, z);
    legs.add(mesh);
    geometry = new THREE.BoxGeometry(6, 24, 6);
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

    geometry = new THREE.BoxGeometry(12, 6, 8);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x+6, y-3, z);
    feet.add(mesh);
    geometry = new THREE.BoxGeometry(12, 6, 8);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-6, y-3, z);
    feet.add(mesh);

    obj.add(feet);
}

function addLeftArm(obj, x, y, z) {
    'use strict';

    var leftArm = new THREE.Object3D();

    geometry = new THREE.BoxGeometry(6, 12, 6);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    leftArm.add(mesh);
    geometry = new THREE.BoxGeometry(6, 12, 18);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y-12, z-6);
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
    geometry.rotateX(deg_to_rad(90));
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y-10, z-15.5);
    leftArm.add(mesh);

    obj.add(leftArm);
}

function addRightArm(obj, x, y, z) {
    'use strict';

    var rightArm = new THREE.Object3D();

    geometry = new THREE.BoxGeometry(6, 12, 6);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    rightArm.add(mesh);
    geometry = new THREE.BoxGeometry(6, 12, 18);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y-12, z-6);
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
    geometry.rotateX(deg_to_rad(90));
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y-10, z-15.5);
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
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    createScene();
    createCameras();
    createRobot(0, 20, 0);

    render();

}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    update();
    requestAnimationFrame(animate);
    render();
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