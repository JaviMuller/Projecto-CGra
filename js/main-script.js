//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var cameras = []; 
var camera, scene, renderer;

var robot, trailer;
var worldPosition = new THREE.Vector3();

var geometry, materials, mesh;

var trailer_speed = 0.05;

var vector = new THREE.Vector3();

const SCENE_WIDTH = 250;
const SCENE_HEIGHT = 150;
const SCENE_DEPTH = SCENE_WIDTH;
var worldPosition = new THREE.Vector3();

var end = 0;

var collision_animation = {
    playing: false,
    direction: new THREE.Vector3(0, 0, 0),
    distance: 0
}

var coupled = false;

const controller = {
    "1": { pressed: false, function: () => { camera = cameras[0]; controller["1"].pressed = false; } },
    "2": { pressed: false, function: () => { camera = cameras[1]; controller["2"].pressed = false; } },
    "3": { pressed: false, function: () => { camera = cameras[2]; controller["3"].pressed = false; } },
    "4": { pressed: false, function: () => { camera = cameras[3]; controller["4"].pressed = false; } },
    "5": { pressed: false, function: () => { camera = cameras[4]; controller["5"].pressed = false; } },

    "6": { pressed: false, function: () => { 
                            Object.keys(materials).forEach((e) =>
                                materials[e].wireframe = !materials[e].wireframe
                            );
                            controller["6"].pressed = false;
                        }
        },

    "7": { pressed: false, function: () => { if(coupled) uncoupleTrailer(); }},

    "Q": { pressed: false, function: () => { if(!collision_animation.playing && !coupled) extend_feet() } },
    "A": { pressed: false, function: () => { if(!collision_animation.playing && !coupled) contract_feet() } },
    "W": { pressed: false, function: () => { if(!collision_animation.playing && !coupled) extend_legs() } },
    "S": { pressed: false, function: () => { if(!collision_animation.playing && !coupled) contract_legs() } },
    "E": { pressed: false, function: () => { if(!collision_animation.playing && !coupled) contract_arms() } },    
    "D": { pressed: false, function: () => { if(!collision_animation.playing && !coupled) extend_arms() } },
    "R": { pressed: false, function: () => { if(!collision_animation.playing && !coupled) extend_head() } },
    "F": { pressed: false, function: () => { if(!collision_animation.playing && !coupled) contract_head() } },
    
    "ARROWUP": { pressed: false, function: () => { if(!collision_animation.playing && !coupled) move_up() } },
    "ARROWDOWN": { pressed: false, function: () => { if(!collision_animation.playing && !coupled) move_down() } },
    "ARROWLEFT": { pressed: false, function: () => { if(!collision_animation.playing && !coupled) move_left() } },
    "ARROWRIGHT": { pressed: false, function: () => { if(!collision_animation.playing && !coupled) move_right() } },
}

var cyan = 0xe3e5e6;
var blue = 0x1332a1;
var red = 0xeb1e1e
var yellow = 0xdbb809;
var gray = 0x808080;
var black = 0x202020;
var lightgray = 0xbbbbbb;

var time;

materials = {
    black: new THREE.MeshBasicMaterial({ color: black, wireframe: false }),
    red: new THREE.MeshBasicMaterial({ color: red, wireframe: false }),
    yellow: new THREE.MeshBasicMaterial({ color: yellow, wireframe: false }),
    gray: new THREE.MeshBasicMaterial({ color: gray, wireframe: false }),
    blue: new THREE.MeshBasicMaterial({ color: blue, wireframe: false }),
    lightgray: new THREE.MeshBasicMaterial({ color: lightgray, wireframe: false }),
}

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

    trailer = new THREE.Object3D();
    trailer.position.set(x, y, z);

    trailer.name = "Trailer";

    // Cargo
    geometry = new THREE.BoxGeometry(24, 32, 92);
    mesh = new THREE.Mesh(geometry, materials.lightgray);
    mesh.position.set(0, 0, 0);
    trailer.add(mesh);

    // Coupling piece
    geometry = new THREE.CylinderGeometry(4, 4, 2, 16);
    mesh = new THREE.Mesh(geometry, materials.red);
    mesh.name = "TrailerCoupling";
    mesh.position.set(0, -17, -38);
    trailer.add(mesh);

    addWheel(trailer, -6, -20, 18, 90, 90, 0);
    addWheel(trailer, 6, -20, 18, 90, 90, 0);
    addWheel(trailer, -6, -20, 34, 90, 90, 0);
    addWheel(trailer, 6, -20, 34, 90, 90, 0);
    
    trailer.x_min = () => { trailer.getWorldPosition(worldPosition); return worldPosition.x - 12; }
    trailer.x_max = () => { trailer.getWorldPosition(worldPosition); return worldPosition.x + 12; }
    trailer.z_min = () => { trailer.getWorldPosition(worldPosition); return worldPosition.z - 46; }
    trailer.z_max = () => { trailer.getWorldPosition(worldPosition); return worldPosition.z + 46; }

    scene.add(trailer);
}

function createRobot(x, y, z) {
    'use strict';

    robot = new THREE.Object3D();

    robot.name = "Robot";
    robot.position.set(x, y, z);

    robot.truck = () => { return Math.abs(scene.getObjectByName("GroupLegs").rotation.x + Math.PI/2) < Number.EPSILON &&
                                 Math.abs(scene.getObjectByName("GroupFeet").rotation.x + Math.PI/2) < Number.EPSILON &&
                                 Math.abs(Math.abs(scene.getObjectByName("Head").rotation.x) - Math.PI) < Number.EPSILON &&
                                 Math.abs(scene.getObjectByName("RightArm").position.x - 6) < Number.EPSILON &&
                                 Math.abs(scene.getObjectByName("LeftArm").position.x + 6) < Number.EPSILON; }

    addBody(robot, x, y, z);
    const groupLegs = new THREE.Group();
    groupLegs.name = "GroupLegs";
    robot.add(groupLegs);
    groupLegs.position.set(0,-17, 2);

    addLegs(groupLegs, x, y-1 , z-2);
    addLeftArm(robot, x+15, y, z+5);
    addRightArm(robot, x-15, y, z+5);
    addHead(robot, x, y+6, z);

    robot.x_min = () => { robot.getWorldPosition(worldPosition); return worldPosition.x - 14; }
    robot.x_max = () => { robot.getWorldPosition(worldPosition); return worldPosition.x + 14; }
    robot.z_min = () => { robot.getWorldPosition(worldPosition); return worldPosition.z - 12; }
    robot.z_max = () => { robot.getWorldPosition(worldPosition); return worldPosition.z + 44; }

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

    head.name = "Head";

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

    legs.name = "Legs";

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

    const groupFeet = new THREE.Group();
    groupFeet.name = "GroupFeet";
    groupFeet.position.set(x,y-33,z);
    addFeet(groupFeet, x, y+6, z+1);

    obj.add(groupFeet);

    obj.add(legs);
}

function addFeet(obj, x, y, z) {
    'use strict';

    var feet = new THREE.Object3D();

    feet.name = "Feet";

    geometry = new THREE.BoxGeometry(12, 6, 8);
    mesh = new THREE.Mesh(geometry, materials.blue);
    mesh.position.set(x+6, y, z);
    feet.add(mesh);
    geometry = new THREE.BoxGeometry(12, 6, 8);
    mesh = new THREE.Mesh(geometry, materials.blue);
    mesh.position.set(x-6, y, z);
    feet.add(mesh);

    obj.add(feet);
}

function addLeftArm(obj, x, y, z) {
    'use strict';

    var leftArm = new THREE.Object3D();

    leftArm.name = "LeftArm";

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

    rightArm.name = "RightArm";

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
function checkCollisions() {
    'use strict';
    return robot.x_max() > trailer.x_min() &&
           robot.x_min() < trailer.x_max() &&
           robot.z_max() > trailer.z_min() &&
           robot.z_min() < trailer.z_max();
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions() {
    'use strict';
    if (!collision_animation.playing) {
        collision_animation.playing = true;
        var pos_init_truck = new THREE.Vector3();
        var pos_init_trailer = new THREE.Vector3();

        trailer.getObjectByName("TrailerCoupling").getWorldPosition(pos_init_trailer);
        robot.getObjectByName("Legs").getWorldPosition(pos_init_truck);
        pos_init_trailer.z -= 20;
        pos_init_trailer.y = 0;
        pos_init_truck.y = 0;
        
        collision_animation.distance = pos_init_truck.distanceTo(pos_init_trailer);
        collision_animation.direction.addVectors(pos_init_truck, pos_init_trailer.negate()).normalize();

    } else if (collision_animation.distance > trailer_speed*(end-time)) { // Playing animation
        trailer.translateOnAxis(collision_animation.direction, trailer_speed*(end-time));
        collision_animation.distance-=trailer_speed*(end-time);

    } else { // Animation finished
        trailer.translateOnAxis(collision_animation.direction, collision_animation.distance);
        collision_animation.playing = false;
        coupled = true;
    }
}

////////////
/* UPDATE */
//////////// 
function extend_feet(){
    if(scene.getObjectByName("GroupFeet").rotation.x > -Math.PI/2) {
        var rotation = -(end-time)*Math.PI/1800;
        if((rotation + scene.getObjectByName("GroupFeet").rotation.x) < -Math.PI/2) {
            scene.getObjectByName("GroupFeet").rotation.x = -Math.PI/2;
        }
        else {
            scene.getObjectByName("GroupFeet").rotateOnAxis(new THREE.Vector3(1,0,0), rotation);
        }
    }
}
function contract_feet(){
    if(scene.getObjectByName("GroupFeet").rotation.x < 0) {
        var rotation = (end-time)*Math.PI/1800;
        if((rotation + scene.getObjectByName("GroupFeet").rotation.x) > 0) {
            scene.getObjectByName("GroupFeet").rotation.x = 0;
        }
        else {
            scene.getObjectByName("GroupFeet").rotateOnAxis(new THREE.Vector3(1,0,0), rotation);
        }
    }
}
function extend_arms(){
    if(scene.getObjectByName("RightArm").position.x > 0) {
        var translation = -0.05*(end-time);
        if(translation + scene.getObjectByName("RightArm").position.x < 0) {
            translation = (0 - scene.getObjectByName("RightArm").position.x);
        }
        scene.getObjectByName("RightArm").translateX(translation);
    }
    if(scene.getObjectByName("LeftArm").position.x < 0) {
        var translation = -0.05*(end-time);
        if(-translation + scene.getObjectByName("LeftArm").position.x > 0) {
            translation = (0 + scene.getObjectByName("LeftArm").position.x);
        }   
        scene.getObjectByName("LeftArm").translateX(-translation);  
    }
}
function contract_arms(){
    if(scene.getObjectByName("RightArm").position.x < 6) {
        var translation = 0.05*(end-time);
        if(translation + scene.getObjectByName("RightArm").position.x > 6) {
            translation = (6 - scene.getObjectByName("RightArm").position.x);
        }
        scene.getObjectByName("RightArm").translateX(translation);   
    }
    if(scene.getObjectByName("LeftArm").position.x > -6) {
        var translation = 0.05*(end-time);
        if(-translation + scene.getObjectByName("LeftArm").position.x < -6) {
            translation = (6 + scene.getObjectByName("LeftArm").position.x);
        }
        scene.getObjectByName("LeftArm").translateX(-translation);  
    }
}
function extend_head(){
    if(scene.getObjectByName("Head").rotation.x > -Math.PI && scene.getObjectByName("Head").rotation.x <= 0) {
        var rotation = -(end-time)*Math.PI/1600;
        if((rotation + scene.getObjectByName("Head").rotation.x) < -Math.PI) {
            scene.getObjectByName("Head").rotation.x = -Math.PI;
        }
        else {
            scene.getObjectByName("Head").rotateOnAxis(new THREE.Vector3(1,0,0), rotation);
        }
    }
}
function contract_head(){
    if(scene.getObjectByName("Head").rotation.x < 0) {
        var rotation = (end-time)*Math.PI/1600;
        if((rotation + scene.getObjectByName("Head").rotation.x) > 0) {
            scene.getObjectByName("Head").rotation.x = 0;
        }
        else {
            scene.getObjectByName("Head").rotateOnAxis(new THREE.Vector3(1,0,0), rotation);
        }
    }
}
function extend_legs(){
    if(scene.getObjectByName("GroupLegs").rotation.x > -Math.PI/2) {
        var rotation = -(end-time)*Math.PI/1800;
        if((rotation + scene.getObjectByName("GroupLegs").rotation.x) < -Math.PI/2) {
            scene.getObjectByName("GroupLegs").rotation.x = -Math.PI/2;
        }
        else {
            scene.getObjectByName("GroupLegs").rotateOnAxis(new THREE.Vector3(1,0,0), rotation);
        }
    }
}
function contract_legs(){
    if(scene.getObjectByName("GroupLegs").rotation.x < 0) {
        var rotation = (end-time)*Math.PI/1800;
        if((rotation + scene.getObjectByName("GroupLegs").rotation.x) > 0) {
            scene.getObjectByName("GroupLegs").rotation.x = 0;
        }
        else {
            scene.getObjectByName("GroupLegs").rotateOnAxis(new THREE.Vector3(1,0,0), rotation);
        }
    }
}

function move_up() {
    vector.z += 1;
}
function move_down() {
    vector.z -= 1;
}
function move_right() {
    vector.x += 1;
}
function move_left() {
    vector.x -= 1;
}

function move_trailer() {
    vector.normalize();
    trailer.translateOnAxis(vector,trailer_speed*(end-time));
}

function uncoupleTrailer() {
    trailer.translateZ(100);
    coupled = false;
}

function update() {
    'use strict';
    end = Date.now();
    vector.set(0,0,0);
    // Collision handling
    if (collision_animation.playing || (robot.truck() && checkCollisions() && !coupled)) { handleCollisions(); }
    // Event handling
    Object.keys(controller).forEach((e) => { if (controller[e].pressed) { controller[e].function(); }})
    move_trailer();
    time = end;
    
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
    createRobot(0, -5, 0);
    createTrailer(0,-5,100);
    time = Date.now()
    render();

}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    update();
    render();
    requestAnimationFrame(animate);
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
document.addEventListener("keydown", (e) => {
        if (controller[e.key.toUpperCase()]) { controller[e.key.toUpperCase()].pressed = true; }
    });

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
document.addEventListener("keyup", (e) => {
        if (controller[e.key.toUpperCase()]) { controller[e.key.toUpperCase()].pressed = false; }
    });
