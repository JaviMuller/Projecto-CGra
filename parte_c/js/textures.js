

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var camera, scene, renderer;
var number_stars = 300;
var number_flowers = 130;

var geometry, material, mesh;


// Usado para fazer download das texturas
var fileName;

const controller = {
    "1": { pressed: false, function: () => { field_texture_gen(); fileName = "field.jpeg";} },
    "2": { pressed: false, function: () => { sky_texture_gen(); fileName = "sky.jpeg";} }
}

var sky_blue = 0x06366f;
var sky_purple = 0x610264;
var white = 0xfdfdfd;
var yellow = 0xffff3a;
var archid = 0xe9b2fa;
var light_blue = 0x80c8f6;
var green = 0x609c19;

const materials = {
    star_white: new THREE.MeshBasicMaterial({ color: white }),
    white: new THREE.MeshBasicMaterial({ color: white }),
    light_blue: new THREE.MeshBasicMaterial({ color: light_blue }),
    yellow: new THREE.MeshBasicMaterial({ color: yellow }),
    archid: new THREE.MeshBasicMaterial({ color: archid })
}

sky_materials = [materials.star_white];
field_materials = [materials.white, materials.light_blue, materials.yellow, materials.archid];

stars = [];
flowers = [];

SCENE_DEPTH = 200;
SCENE_WIDTH = window.innerWidth;
SCENE_HEIGHT = window.innerHeight;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    scene = new THREE.Scene();
    
    scene.background = new THREE.Color(green);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';
    camera = new THREE.OrthographicCamera(-SCENE_WIDTH/2, SCENE_WIDTH/2, SCENE_HEIGHT/2, -SCENE_HEIGHT/2, SCENE_DEPTH/1000, SCENE_DEPTH);    
    camera.position.set(0, 0, 20);
    camera.lookAt(scene.position);
    scene.add(camera);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createSky() {
    'use strict';
    geometry = new THREE.BufferGeometry();

    const vertices = [
        -SCENE_WIDTH/2,  SCENE_HEIGHT/2,   0, // TOP LEFT
        SCENE_WIDTH,     SCENE_HEIGHT/2,   0, // TOP RIGHT
        -SCENE_WIDTH/2,  -SCENE_HEIGHT/2,  0, // BOTTOM LEFT
        SCENE_WIDTH/2,   -SCENE_HEIGHT/2,  0  // BOTTOM RIGHT
    ];

    const normals = [
        0, 0, -1, // TOP LEFT
        0, 0, -1, // TOP RIGHT
        0, 0, -1, // BOTTOM LEFT
        0, 0, -1  // BOTTOM RIGHT
    ];

    var sky_blue_color = new THREE.Color(sky_blue);
    var sky_purple_color = new THREE.Color(sky_purple);

    const colors = [
        sky_blue_color.r,    sky_blue_color.g,    sky_blue_color.b,   // TOP LEFT
        sky_blue_color.r,    sky_blue_color.g,    sky_blue_color.b,   // TOP RIGHT
        sky_purple_color.r,  sky_purple_color.g,  sky_purple_color.b, // BOTTOM LEFT
        sky_purple_color.r,  sky_purple_color.g,  sky_purple_color.b  // BOTTOM RIGHT
    ];

    const indices = [
        0, 2, 3, // BOTTOM LEFT TRIANGLE
        0, 3, 1  // TOP RIGHT TRIANGLE
    ];

    geometry.setIndex(indices);
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    material = new THREE.MeshBasicMaterial({ 
        sides: THREE.DoubleSide,
        vertexColors: true 
    });
    sky_materials.push(material);

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 50);
    scene.add(mesh);
}

function createStars() {
    'use strict';
    for (var i = 0; i < number_stars; i++) {
        geometry = new THREE.CircleGeometry(2.5, 32);
        mesh = new THREE.Mesh(geometry, materials.star_white);
        mesh.position.set(SCENE_WIDTH/2*(Math.random()*2 - 1), SCENE_HEIGHT/2*(Math.random()*2 - 1), 55);
        scene.add(mesh);
        stars.push(mesh);
    }
}

function createFlowers() {
    'use strict';
    for (var i = 0; i < number_flowers; i++) {
        geometry = new THREE.CircleGeometry(4, 32);
        mesh = new THREE.Mesh(geometry, field_materials[Math.floor(Math.random()*field_materials.length)]);
        mesh.position.set(SCENE_WIDTH/2*(Math.random()*2 - 1), SCENE_HEIGHT/2*(Math.random()*2 - 1), 10);
        scene.add(mesh);
        flowers.push(mesh);
    }
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////

////////////
/* UPDATE */
////////////
function field_texture_gen() {
    'use strict';
    flowers.forEach((e) => { e.position.set(SCENE_WIDTH/2*(Math.random()*2 - 1), SCENE_HEIGHT/2*(Math.random()*2 - 1), 10); });
    camera.position.set(0, 0, 20);
}

function sky_texture_gen() {
    'use strict';
    stars.forEach((e) => { e.position.set(SCENE_WIDTH/2*(Math.random()*2 - 1), SCENE_HEIGHT/2*(Math.random()*2 - 1), 55); });
    camera.position.set(0, 0, 100);
}

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
        antialias: true,
        preserveDrawingBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    createScene();
    createCamera();
    createFlowers();
    createStars();
    createSky();
    fileName = "field.jpeg";
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
    camera.left = -window.innerWidth / 2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = -window.innerHeight / 2;
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