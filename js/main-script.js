//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var cameras = []; 
var camera, scene, renderer;

var geometry, materials, mesh;

var cyan = 0xe3e5e6;
var blue = 0x1332a1;
var red = 0xeb1e1e
var yellow = 0xdbb809;
var gray = 0x808080;
var black = 0x202020;

materials = {
    black: new THREE.MeshBasicMaterial({ color: black, wireframe: false }),
    red: new THREE.MeshBasicMaterial({ color: red, wireframe: false }),
    yellow: new THREE.MeshBasicMaterial({ color: yellow, wireframe: false }),
    gray: new THREE.MeshBasicMaterial({ color: gray, wireframe: false }),
    blue: new THREE.MeshBasicMaterial({ color: blue, wireframe: false }),
};

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

    scene.background = new THREE.Color(cyan);

    scene.add(new THREE.AxisHelper(10));

}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
    'use strict';
    var window_ratio = window.innerWidth / window.innerHeight;
    
    // Front view
    var front_camera = new THREE.OrthographicCamera(-SCENE_WIDTH/2, SCENE_WIDTH/2, SCENE_HEIGHT/2, -SCENE_HEIGHT/2, SCENE_DEPTH/1000, SCENE_DEPTH);
    front_camera.position.set(0, 0, -SCENE_DEPTH/2);
    front_camera.lookAt(scene.position);
    scene.add(front_camera);
    cameras.push(front_camera);

    // Lateral view
    var lateral_camera = new THREE.OrthographicCamera(-SCENE_DEPTH/2, SCENE_DEPTH/2, SCENE_HEIGHT/2, -SCENE_HEIGHT/2, SCENE_WIDTH/1000, SCENE_WIDTH);
    lateral_camera.position.set(-SCENE_WIDTH/2, 0, 0);
    lateral_camera.lookAt(scene.position);
    scene.add(lateral_camera);
    cameras.push(lateral_camera);

    // Top view
    var top_camera = new THREE.OrthographicCamera(-SCENE_WIDTH/2, SCENE_WIDTH/2, SCENE_DEPTH/2, -SCENE_DEPTH/2, SCENE_HEIGHT/1000, SCENE_HEIGHT);
    top_camera.position.set(0, SCENE_HEIGHT/2, 0);

    top_camera.lookAt(scene.position);
    top_camera.rotateZ(deg_to_rad(180));
    scene.add(top_camera);
    cameras.push(top_camera);

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
    cameras.push(iso_orth_camera);

    // Perspective isometric view
    var iso_persp_camera = new THREE.PerspectiveCamera(60, window_ratio, 1, 1000);
    iso_persp_camera.position.set(vec.x, vec.y, vec.z);
    iso_persp_camera.lookAt(scene.position);
    scene.add(iso_persp_camera);
    cameras.push(iso_persp_camera);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createTrailer(x, y, z) {
    'use strict';

    var trailer = new THREE.Object3D();

    geometry = new THREE.BoxGeometry(92, 32, 24);
    mesh = new THREE.Mesh(geometry, materials.gray);
    mesh.position.set(x, y, z);
    trailer.add(mesh);
    geometry = new THREE.CylinderGeometry(4, 4, 2, 16);
    mesh = new THREE.Mesh(geometry, materials.red);
    mesh.position.set(x+40, y-17, z);
    trailer.add(mesh);

    addWheel(trailer, x-18, y-20, z-6, 90, 0, 90);
    addWheel(trailer, x-18, y-20, z+6, 90, 0, 90);
    addWheel(trailer, x-34, y-20, z-6, 90, 0, 90);
    addWheel(trailer, x-34, y-20, z+6, 90, 0, 90);

    scene.add(trailer);
}

function createRobot(x, y, z) {
    'use strict';

    var robot = new THREE.Object3D();

    addBody(robot, x, y, z);
    addLegs(robot, x, y-18, z+4);
    addLeftArm(robot, x+15, y, z+5);
    addRightArm(robot, x-15, y, z+5);
    addHead(robot, x, y+6, z);

    scene.add(robot);
}

function addBody(obj, x, y, z) {
    'use strict';
    // Chest
    geometry = new THREE.BoxGeometry(24, 12, 16);
    mesh = new THREE.Mesh(geometry, materials.red);
    mesh.position.set(x, y, z);
    obj.add(mesh);

    // Abdomen
    geometry = new THREE.BoxGeometry(12, 16, 18);
    mesh = new THREE.Mesh(geometry, materials.red);
    mesh.position.set(x, y-10, z-1);
    obj.add(mesh);

    // Plate
    geometry = new THREE.BoxGeometry(24, 4, 1);
    mesh = new THREE.Mesh(geometry, materials.gray);
    mesh.position.set(x, y-15, z-10.5);
    obj.add(mesh);
    addWheel(obj, x+8, y-15, z-2, 0, 90, 90);
    addWheel(obj, x-8, y-15, z-2, 0, 90, 90);
}

function addWheel(obj, x, y, z, rotX, rotY, rotZ) {
    'use strict';
    geometry = new THREE.CylinderGeometry(4, 4, 4, 16);
    geometry.rotateX(deg_to_rad(rotX));
    geometry.rotateY(deg_to_rad(rotY));
    geometry.rotateZ(deg_to_rad(rotZ));
    mesh = new THREE.Mesh(geometry, materials.black);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addHead(obj, x, y, z) {
    'use strict';

    var head = new THREE.Object3D();

    // Head
    geometry = new THREE.BoxGeometry(6, 6, 6);
    mesh = new THREE.Mesh(geometry, materials.blue);
    mesh.position.set(x, y+3, z);
    head.add(mesh);

    // Eyes
    geometry = new THREE.BoxGeometry(1, 1, 1);
    mesh = new THREE.Mesh(geometry, materials.yellow);
    mesh.position.set(x+2, y+4, z-3);
    head.add(mesh);
    geometry = new THREE.BoxGeometry(1, 1, 1);
    mesh = new THREE.Mesh(geometry, materials.yellow);
    mesh.position.set(x-2, y+4, z-3);
    head.add(mesh);

    // Antennae
    geometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 16);
    mesh = new THREE.Mesh(geometry, materials.black);
    mesh.position.set(x+3.5, y+4, z);
    head.add(mesh);
    geometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 16);
    mesh = new THREE.Mesh(geometry, materials.black);
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

    // Top joint
    geometry = new THREE.BoxGeometry(4, 6, 4);
    mesh = new THREE.Mesh(geometry, materials.gray);
    mesh.position.set(x+3, y-3, z);
    legs.add(mesh);
    geometry = new THREE.BoxGeometry(4, 6, 4);
    mesh = new THREE.Mesh(geometry, materials.gray);
    mesh.position.set(x-3, y-3, z);
    legs.add(mesh);

    // Main legs
    geometry = new THREE.BoxGeometry(6, 24, 6);
    mesh = new THREE.Mesh(geometry, materials.blue);
    mesh.position.set(x+3, y-18, z);
    legs.add(mesh);
    geometry = new THREE.BoxGeometry(6, 24, 6);
    mesh = new THREE.Mesh(geometry, materials.blue);
    mesh.position.set(x-3, y-18, z);
    legs.add(mesh);

    // Tanks
    geometry = new THREE.CylinderGeometry(2.5, 2.5, 6, 16);
    mesh = new THREE.Mesh(geometry, materials.gray);
    mesh.position.set(x-8.5, y-9, z);
    legs.add(mesh);
    geometry = new THREE.CylinderGeometry(2.5, 2.5, 6, 16);
    mesh = new THREE.Mesh(geometry, materials.gray);
    mesh.position.set(x+8.5, y-9, z);
    legs.add(mesh);
    geometry = new THREE.CylinderGeometry(2.5, 2.5, 6, 16);

    addFeet(legs, x, y-30, z-1);

    obj.add(legs);
}

function addFeet(obj, x, y, z) {
    'use strict';

    var feet = new THREE.Object3D();

    geometry = new THREE.BoxGeometry(12, 6, 8);
    mesh = new THREE.Mesh(geometry, materials.blue);
    mesh.position.set(x+6, y-3, z);
    feet.add(mesh);
    geometry = new THREE.BoxGeometry(12, 6, 8);
    mesh = new THREE.Mesh(geometry, materials.blue);
    mesh.position.set(x-6, y-3, z);
    feet.add(mesh);

    obj.add(feet);
}

function addLeftArm(obj, x, y, z) {
    'use strict';

    var leftArm = new THREE.Object3D();
    // Top joint
    geometry = new THREE.BoxGeometry(6, 12, 6);
    mesh = new THREE.Mesh(geometry, materials.red);
    mesh.position.set(x, y, z);
    leftArm.add(mesh);
    // Bottom joint
    geometry = new THREE.BoxGeometry(6, 12, 18);
    mesh = new THREE.Mesh(geometry, materials.blue);
    mesh.position.set(x, y-12, z-6);
    leftArm.add(mesh);
    // Exhaust
    geometry = new THREE.CylinderGeometry(1, 1, 8, 16);
    mesh = new THREE.Mesh(geometry, materials.gray);
    mesh.position.set(x+4, y-2, z);
    leftArm.add(mesh);
    geometry = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
    mesh = new THREE.Mesh(geometry, materials.gray);
    mesh.position.set(x+3.5, y+6, z);
    leftArm.add(mesh);
    // Light
    geometry = new THREE.CylinderGeometry(2, 2, 1, 16);
    geometry.rotateX(deg_to_rad(90));
    mesh = new THREE.Mesh(geometry, materials.yellow);
    mesh.position.set(x, y-10, z-15.5);
    leftArm.add(mesh);

    obj.add(leftArm);
}

function addRightArm(obj, x, y, z) {
    'use strict';

    var rightArm = new THREE.Object3D();
    // Top joint
    geometry = new THREE.BoxGeometry(6, 12, 6);
    mesh = new THREE.Mesh(geometry, materials.red);
    mesh.position.set(x, y, z);
    rightArm.add(mesh);
    // Bottom joint
    geometry = new THREE.BoxGeometry(6, 12, 18);
    mesh = new THREE.Mesh(geometry, materials.blue);
    mesh.position.set(x, y-12, z-6);
    rightArm.add(mesh);
    // Exhaust
    geometry = new THREE.CylinderGeometry(1, 1, 8, 16);
    mesh = new THREE.Mesh(geometry, materials.gray);
    mesh.position.set(x-4, y-2, z);
    rightArm.add(mesh);
    geometry = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
    mesh = new THREE.Mesh(geometry, materials.gray);
    mesh.position.set(x-3.5, y+6, z);
    rightArm.add(mesh);
    // Light
    geometry = new THREE.CylinderGeometry(2, 2, 1, 16);
    geometry.rotateX(deg_to_rad(90));
    mesh = new THREE.Mesh(geometry, materials.yellow);
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
    camera = cameras[0];
    createRobot(0, 20, 0);
    createTrailer(70,0,0);

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
    if(e.which >= 49 && e.which < 54) { // 1 to 5
        camera = cameras[e.which - 49];
    }
    if (e.which == 54) { // 6
        Object.keys(materials).forEach(e => materials[e].wireframe = !materials[e].wireframe);
    }
}

document.addEventListener("keydown", onKeyDown);

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}