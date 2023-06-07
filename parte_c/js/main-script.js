//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var cameras = []; 
var camera, scene, renderer;

var sides = 12;

var cyan = 0xe3e5e6;
var blue = 0x1332a1;
var red = 0xeb1e1e
var yellow = 0xdbb809;
var gray = 0x808080;
var black = 0x202020;
var lightgray = 0xbbbbbb;

var materials = {
    black: new THREE.MeshBasicMaterial({ color: black, wireframe: false }),
    red: new THREE.MeshBasicMaterial({ color: red, wireframe: false }),
    yellow: new THREE.MeshBasicMaterial({ color: yellow, wireframe: false }),
    gray: new THREE.MeshBasicMaterial({ color: gray, wireframe: false }),
    blue: new THREE.MeshBasicMaterial({ color: blue, wireframe: false }),
    lightgray: new THREE.MeshBasicMaterial({ color: lightgray, wireframe: false }),
}

const controller = {
    // Lights
    "P": { pressed: false, function: () => { toggle_point_light() } },
    "S": { pressed: false, function: () => { toggle_spot_light() } },
    "R": { pressed: false, function: () => { toggle_material_lightning() } },
    
    // Textures
    "Q": { pressed: false, function: () => { toggle_texture("Gouraud") } },
    "W": { pressed: false, function: () => { toggle_texture("Phong") } },
    "E": { pressed: false, function: () => { toggle_texture("Cartoon") } },

    // Movement
    "ARROWUP": { pressed: false, function: () => { rotate_clockwise() } },
    "ARROWDOWN": { pressed: false, function: () => { rotate_counter_clockwise() } },
    "ARROWLEFT": { pressed: false, function: () => { move_left() } },
    "ARROWRIGHT": { pressed: false, function: () => { move_right() } },
}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 500);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createAmbientLight() {
    'use strict';
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
}


////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

//fixme lights
function createOvni(x,y,z) {
    'use strict';

    var ovni = new THREE.Object3D();
    ovni.name = "Ovni";

    // Base
    geometry = new THREE.SphereGeometry(1);
    geometry.scale(48,12,48);
    mesh = new THREE.Mesh(geometry, materials.red);
    mesh.position.set(x, y, z);
    ovni.add(mesh);
    
    // Cockpit
    geometry = new THREE.SphereGeometry(1);
    geometry.scale(24,24,24);
    mesh = new THREE.Mesh(geometry, materials.blue);
    mesh.position.set(x, y + 12, z);
    ovni.add(mesh);

    // Main Light
    geometry = new THREE.CylinderGeometry(12, 12, 3);
    mesh = new THREE.Mesh(geometry, materials.gray);
    mesh.position.set(x, y - 12, z);
    ovni.add(mesh);

    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 0, - 14.5, 0 );

    scene.add(spotLight);

    scene.add(ovni);

    var dist = new THREE.Vector3(36, -8, 0);
    var sphericalCoord = new THREE.Spherical();
    sphericalCoord.setFromVector3(dist);

    for(let i = 0; i < sides; i++) {
        dist.setFromSpherical(sphericalCoord);
        addSmallLight(ovni, dist.x, dist.y, dist.z);
        sphericalCoord.theta += Math.PI*2/sides;
    }
}

function addSmallLight(obj,x,y,z) {
    'use strict';

    //Small Light
    var pointLight = new THREE.PointLight( 0xffffff, 1);
    pointLight.position.set(x, y, z);
    obj.add(pointLight);

    const sphereSize = 1;
    const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
    obj.add( pointLightHelper );
}



function createTree (name, x, y, z) {
    'use strict';

    var tree = new THREE.Object3D();
    tree.name = name;

    geometry = new THREE.SphereGeometry(1);
    geometry.scale(5,3,6);
    mesh = new THREE.Mesh(geometry, materials.darkgreen);
    mesh.rotateZ(deg_to_rad(-30));
    mesh.position.set(x + 2.5, y + 2, z - 1);
    tree.add(mesh);

    geometry = new THREE.SphereGeometry(1);
    geometry.scale(4,3,5);
    mesh = new THREE.Mesh(geometry, materials.darkgreen);
    mesh.rotateZ(deg_to_rad(30));
    mesh.position.set(x - 3, y + 2, z + 1);
    tree.add(mesh);

    geometry = new THREE.CylinderGeometry(1,1,6);
    mesh = new THREE.Mesh(geometry, materials.brown);
    mesh.rotateZ(deg_to_rad(-30));
    mesh.position.set(x, y - 2, z - 1);
    tree.add(mesh);

    geometry = new THREE.CylinderGeometry(1,1,4 );
    mesh = new THREE.Mesh(geometry, materials.brown);
    mesh.rotateZ(deg_to_rad(30));
    mesh.rotateX(deg_to_rad(30));
    mesh.position.set(x - 1, y - 1, z);
    tree.add(mesh);

    scene.add(tree);
}

//fixme arranjar os pontos bem
function createHouse(x, y, z) {

    var house = new THREE.Object3D();
    house.name = "House";


    geom = new THREE.BufferGeometry();

    verticesOfCube = new Float32Array( [
        0, 0, 0,        7.5, 0, 0,      7.5, 1, 0,      7, 1, 0,        0, 1, 0,
        7, 4, 0,        7.5, 4, 0,      7.5, 3.5, 0,    9.5, 3.5, 0,    10, 4, 0,
        10, 1, 0,       9.5, 0, 0,      17, 1, 0,       17, 0, 0,       17, 6, 0,
        0, 6, 0,        15, 4, 0,       15, 2.5, 0,     13, 2.5, 0,     13, 4, 0,
        2, 4, 0,        4, 4, 0,        4, 2.5, 0,      2, 2.5, 0,      17, 0, 7,
        17, 1, 7,       17, 6, 7,       17, 8, 3.5,     17, 4, 4.5,     17, 2.5, 4.5,
        17, 2.5, 2.5,   17, 4, 2.5,     0, 0, 7,        0, 1, 7,        0, 6, 7,
        0, 8, 3.5,      0, 4, 4.5,      0, 2.5, 4.5,    0, 2.5, 2.5,    0, 4, 2.5,
        ] );

    indicesOfFaces = [
        0, 4, 1,
        1, 4, 3,
        1, 3, 2,
        2, 3, 5,
        5, 7, 2,
        5, 6, 7,
        6, 8, 7,
        8, 6, 9,
        8, 9, 10,
        10, 11, 8,
        10, 12, 11,
        12, 13, 11,
        12, 13, 24,
        25, 12, 24,
        0, 32, 4,
        4, 32, 33,
    ];

    geom.setIndex( indicesOfFaces );
    geom.setAttribute ( 'position', new THREE.BufferAttribute( verticesOfCube, 3 ) );
    material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
    mesh = new THREE.Mesh( geom, material );
    house.add(mesh);

    geom = new THREE.BufferGeometry();

    indicesOfFaces = [
        7, 8, 11,
        7, 11, 2,
        2, 11, 1,
    ];

    geom.setIndex( indicesOfFaces );
    geom.setAttribute ( 'position', new THREE.BufferAttribute( verticesOfCube, 3 ) );
    material = new THREE.MeshBasicMaterial( { color: 0x5e2c04 } );
    mesh = new THREE.Mesh( geom, material );
    house.add(mesh);

    geom = new THREE.BufferGeometry();

    indicesOfFaces = [
        14, 12, 17,
        14, 17, 16,
        14, 16, 19,
        14, 19, 9,
        19, 18, 9,
        9, 18, 10,
        18, 12, 10,
        18, 17, 12,
        15, 14, 9,
        15, 9, 5,
        5, 21, 15,
        5, 3, 21,
        21, 3, 22,
        3, 4, 22,
        4, 23, 22,
        20, 23, 4,
        21, 20, 15,
        20, 4, 15,
        30, 12, 25,
        29, 30, 25,
        26, 29, 25,
        28, 29, 26,
        14, 28, 26,
        14, 31, 28,
        14, 30, 31,
        14, 12, 30,
        33, 34, 37,
        34, 36, 37,
        34, 39, 36,
        15, 39, 34,
        15, 4, 39,
        4, 38, 39,
        4, 37, 38,
        37, 4, 33,
    ];

    geom.setIndex( indicesOfFaces );
    geom.setAttribute ( 'position', new THREE.BufferAttribute( verticesOfCube, 3 ) );
    material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    mesh = new THREE.Mesh( geom, material );
    house.add(mesh);

    geom = new THREE.BufferGeometry();

    indicesOfFaces = [
        35, 14, 15,
        27, 14, 35,
        14, 26, 27,
        35, 15, 34,
    ];

    geom.setIndex( indicesOfFaces );
    geom.setAttribute ( 'position', new THREE.BufferAttribute( verticesOfCube, 3 ) );
    material = new THREE.MeshBasicMaterial( { color: 0xed7117 } );
    mesh = new THREE.Mesh( geom, material );
    house.add(mesh);

    geom = new THREE.BufferGeometry();

    indicesOfFaces = [
        16, 18, 19,
        16, 17, 18,
        20, 22, 23,
        22, 20, 21,
        28, 31, 30,
        29, 28, 30,
        39, 38, 36,
        36, 38, 37,
    ];

    geom.setIndex( indicesOfFaces );
    geom.setAttribute ( 'position', new THREE.BufferAttribute( verticesOfCube, 3 ) );
    material = new THREE.MeshBasicMaterial( { color: 0xaaaaaa } );
    mesh = new THREE.Mesh( geom, material );
    house.add(mesh);


    house.position.set(x,y,z);

    scene.add(house);
}

function createField(x, y, z) {
    var terrain_texture = THREE.ImageUtils.loadTexture('textures/heightmap.png');
    var field_texture = THREE.ImageUtils.loadTexture('textures/grass.png');
    field_texture.wrapS = field_texture.wrapT = THREE.RepeatWrapping;

    var material = new THREE.ShaderMaterial({
        displacementMap: terrain_texture,
        displacementScale: 1,
        map: field_texture,
        lights:true
    });

    geometry = new THREE.PlaneGeometry( 1000, 1000, 200, 200 );

    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(0, 0, 0);
    scene.add(mesh);
}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';
    Object.keys(controller).forEach((e) => { if (controller[e].pressed) { controller[e].function(); }})
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
    createCamera();

    //createOvni();
    //createTrees();
    //createHouse();
    createField();
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
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener("resize", onWindowResize);

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
document.addEventListener("keydown", (e) => {
    if (controller[e.key]) { controller[e.key].pressed = true; }
});

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
document.addEventListener("keyup", (e) => {
    if (controller[e.key]) { controller[e.key].pressed = false; }
});