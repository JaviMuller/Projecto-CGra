//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var cameras = []; 
var camera, scene, renderer;

var geometry, mesh, material, color;

var textureLoader = new THREE.TextureLoader();

var vector = new THREE.Vector3();

var ovni;
var pointLights = 12;

var light = true;
var mat_type = "Phong";

// Field texture
var textureLoader = new THREE.TextureLoader();
var terrain_texture = textureLoader.load('assets/heightmap.png');
var terrain_bump = textureLoader.load('assets/bumpmap.png');
var field_texture = textureLoader.load('assets/grass.png');
field_texture.wrapS = field_texture.wrapT = THREE.RepeatWrapping;
field_texture.repeat.set(5, 5);


// Skydome texture
var skydome_texture = textureLoader.load('assets/sky.png');
skydome_texture.wrapS = skydome_texture.wrapT = THREE.RepeatWrapping;
skydome_texture.repeat.set(5, 2);

var cyan = 0xe3e5e6;
var blue = 0x1332a1;
var red = 0xeb1e1e
var yellow = 0xdbb809;
var gray = 0x808080;
var black = 0x202020;
var lightgray = 0xbbbbbb;
var orange = 0xed7117;
var white = 0xffffff;
var brown = 0x5e2c04;

var meshes = {
    black: [],
    red: [],
    yellow: [],
    gray: [],
    blue: [],
    lightgray: [],
    orange: [],
    brown: [],
    white: [],
    field: [],
};

var materials_phong = {
    black: new THREE.MeshPhongMaterial({ color: black }),
    red: new THREE.MeshPhongMaterial({ color: red, specular: 0x999999 }),
    yellow: new THREE.MeshPhongMaterial({ color: yellow }),
    gray: new THREE.MeshPhongMaterial({ color: gray }),
    blue: new THREE.MeshPhongMaterial({ color: blue, specular: 0x999999 }),
    lightgray: new THREE.MeshPhongMaterial({ color: lightgray }),
    orange: new THREE.MeshPhongMaterial({ color: orange}),
    brown: new THREE.MeshPhongMaterial({ color: brown}),
    white: new THREE.MeshPhongMaterial({ color: white}),
    field: new THREE.MeshPhongMaterial({
        bumpMap: terrain_bump,
        bumpScale: 40,
        displacementMap: terrain_texture,
        displacementScale: 300,
        map: field_texture,
    }),
}

var materials_gouraud = {
    black: new THREE.MeshLambertMaterial({ color: black }),
    red: new THREE.MeshLambertMaterial({ color: red, specular: 0x999999 }),
    yellow: new THREE.MeshLambertMaterial({ color: yellow }),
    gray: new THREE.MeshLambertMaterial({ color: gray }),
    blue: new THREE.MeshLambertMaterial({ color: blue, specular: 0x999999 }),
    lightgray: new THREE.MeshLambertMaterial({ color: lightgray }),
    orange: new THREE.MeshLambertMaterial({ color: orange }),
    brown: new THREE.MeshLambertMaterial({ color: brown }),
    white: new THREE.MeshLambertMaterial({ color: white }),
    field: new THREE.MeshLambertMaterial({
        bumpMap: terrain_bump,
        bumpScale: 40,
        displacementMap: terrain_texture,
        displacementScale: 300,
        map: field_texture,
    }),
}

var materials_cartoon = {
    black: new THREE.MeshToonMaterial({ color: black }),
    red: new THREE.MeshToonMaterial({ color: red, specular: 0x999999 }),
    yellow: new THREE.MeshToonMaterial({ color: yellow }),
    gray: new THREE.MeshToonMaterial({ color: gray }),
    blue: new THREE.MeshToonMaterial({ color: blue, specular: 0x999999 }),
    lightgray: new THREE.MeshToonMaterial({ color: lightgray }),
    orange: new THREE.MeshToonMaterial({ color: orange}),
    brown: new THREE.MeshToonMaterial({ color: brown}),
    white: new THREE.MeshToonMaterial({ color: white}),
    field: new THREE.MeshToonMaterial({
        bumpMap: terrain_bump,
        bumpScale: 40,
        displacementMap: terrain_texture,
        displacementScale: 300,
        map: field_texture,
    }),
}

var materials_basic = {
    black: new THREE.MeshBasicMaterial({ color: black }),
    red: new THREE.MeshBasicMaterial({ color: red }),
    yellow: new THREE.MeshBasicMaterial({ color: yellow }),
    gray: new THREE.MeshBasicMaterial({ color: gray }),
    blue: new THREE.MeshBasicMaterial({ color: blue }),
    lightgray: new THREE.MeshBasicMaterial({ color: lightgray }),
    orange: new THREE.MeshBasicMaterial({ color: orange}),
    brown: new THREE.MeshBasicMaterial({ color: brown}),
    white: new THREE.MeshBasicMaterial({ color: white}),
    field: new THREE.MeshBasicMaterial({
        map: field_texture,
    }),
}

const controller = {
    // Lights
    "P": { pressed: false, function: () => { toggle_point_light(); controller["P"].pressed = false; } },
    "S": { pressed: false, function: () => { toggle_spot_light(); controller["S"].pressed = false; } },
    "D": { pressed: false, function: () => { toggle_moon_light(); controller["D"].pressed = false; } },
    
    // Textures
    "Q": { pressed: false, function: () => { toggle_texture("Gouraud"); controller["Q"].pressed = false; } },
    "W": { pressed: false, function: () => { toggle_texture("Phong"); controller["W"].pressed = false; } },
    "E": { pressed: false, function: () => { toggle_texture("Cartoon"); controller["E"].pressed = false; } },
    "R": { pressed: false, function: () => { toggle_texture("Basic"); controller["R"].pressed = false; } },

    // Movement
    "ARROWUP": { pressed: false, function: () => { move_far() } },
    "ARROWDOWN": { pressed: false, function: () => { move_near() } },
    "ARROWLEFT": { pressed: false, function: () => { move_left() } },
    "ARROWRIGHT": { pressed: false, function: () => { move_right() } },
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
function createScene(){
    'use strict';
    scene = new THREE.Scene();
    scene.background = new THREE.Color(black);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 150, 500);
    camera.lookAt(0,0,0);
    scene.add(camera);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createAmbientLight() {
    'use strict';
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(ambientLight);
}


////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createMoon(x,y,z) {
    'use strict';

    var moon = new THREE.Object3D();
    moon.name = "Moon";

    color = "yellow";
    geometry = new THREE.SphereGeometry(1);
    geometry.scale(50,50,50);
    mesh = new THREE.Mesh(geometry, materials_phong[color]);
    mesh.position.set(0,0,0);
    meshes[color].push(mesh);

    var directionalLight = new THREE.DirectionalLight( 0xfeff84, 0.3 );
    directionalLight.name = "MoonLight";
    directionalLight.step = 0;
    moon.add(directionalLight);

    moon.add(mesh);
    moon.position.set(x,y,z);
    directionalLight.lookAt(0,0,0);

    scene.add(moon);
}

//fixme lights
function createOvni(x,y,z) {
    'use strict';

    var ovni = new THREE.Object3D();
    ovni.name = "Ovni";

    // Base
    color = "red";
    geometry = new THREE.SphereGeometry(1);
    geometry.scale(48,12,48);
    mesh = new THREE.Mesh(geometry, materials_phong[color]); 
    mesh.position.set(x, y, z);
    meshes[color].push(mesh);
    ovni.add(mesh);
    
    // Cockpit
    color = "blue";
    geometry = new THREE.SphereGeometry(1);
    geometry.scale(24,24,24);
    mesh = new THREE.Mesh(geometry, materials_phong[color]);
    mesh.position.set(x, y + 12, z);
    meshes[color].push(mesh);
    ovni.add(mesh);

    // Main Light
    geometry = new THREE.CylinderGeometry(12, 12, 3);
    mesh = new THREE.Mesh(geometry, materials_phong.gray);
    mesh.position.set(x, y - 12, z);
    ovni.add(mesh);

    var spotLight = new THREE.SpotLight( 0xffffff, 0.5, 0, Math.PI/4, 0.5, 0.5);
    spotLight.name="spotlight";
    spotLight.position.set( 0, -16, 0 );

    ovni.add(spotLight);

    scene.add(ovni);

    var dist = new THREE.Vector3(36, -8, 0);
    var sphericalCoord = new THREE.Spherical();
    sphericalCoord.setFromVector3(dist);

    for(let i = 0; i < pointLights; i++) {
        dist.setFromSpherical(sphericalCoord);
        addSmallLight(ovni, dist.x, dist.y, dist.z);
        sphericalCoord.theta += Math.PI*2/pointLights;
    }
}

function addSmallLight(obj,x,y,z) {
    'use strict';

    //Small Light
    var pointLight = new THREE.PointLight( 0xffffff, 0.1);
    pointLight.position.set(x, y-4, z);
    obj.add(pointLight);

    const sphereSize = 1;
    const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
    obj.add( pointLightHelper );
}



function createTree (name, x, y, z) {
    'use strict';

    var tree = new THREE.Object3D();
    tree.name = name;

    // Treetop
    color = "darkgreen";

    geometry = new THREE.SphereGeometry(1);
    geometry.scale(5,3,6);
    mesh = new THREE.Mesh(geometry, materials_phong[color]);
    mesh.rotateZ(deg_to_rad(-30));
    mesh.position.set(x + 2.5, y + 2, z - 1);
    tree.add(mesh);
    meshes[color].push(mesh);

    geometry = new THREE.SphereGeometry(1);
    geometry.scale(4,3,5);
    mesh = new THREE.Mesh(geometry, materials_phong[color]);
    mesh.rotateZ(deg_to_rad(30));
    mesh.position.set(x - 3, y + 2, z + 1);
    tree.add(mesh);
    meshes[color].push(mesh);

    // Trunk
    color = "brown";
    geometry = new THREE.CylinderGeometry(1,1,6);
    mesh = new THREE.Mesh(geometry, materials_phong[color]);
    mesh.rotateZ(deg_to_rad(-30));
    mesh.position.set(x, y - 2, z - 1);
    tree.add(mesh);
    meshes[color].push(mesh);

    geometry = new THREE.CylinderGeometry(1,1,4 );
    mesh = new THREE.Mesh(geometry, materials_phong[color]);
    mesh.rotateZ(deg_to_rad(30));
    mesh.rotateX(deg_to_rad(30));
    mesh.position.set(x - 1, y - 1, z);
    tree.add(mesh);
    meshes[color].push(mesh);

    scene.add(tree);
}

//fixme arranjar os pontos bem
function createHouse(x, y, z) {

    var house = new THREE.Object3D();
    house.name = "House";

    // Contour details

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

    
    color = "blue";
    geom.setIndex( indicesOfFaces );
    geom.setAttribute ( 'position', new THREE.BufferAttribute( verticesOfCube, 3 ) );
    geom.computeVertexNormals();
    mesh = new THREE.Mesh( geom, materials_phong[color] );
    house.add(mesh);
    meshes[color].push(mesh);



    // Door

    geom = new THREE.BufferGeometry();

    indicesOfFaces = [
        7, 8, 11,
        7, 11, 2,
        2, 11, 1,
    ];

    color = "brown";
    geom.setIndex( indicesOfFaces );
    geom.setAttribute ( 'position', new THREE.BufferAttribute( verticesOfCube, 3 ) );
    geom.computeVertexNormals();
    mesh = new THREE.Mesh( geom, materials_phong[color] );
    house.add(mesh);
    meshes[color].push(mesh);


    // Main walls
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

    color = "white";
    geom.setIndex( indicesOfFaces );
    geom.setAttribute ( 'position', new THREE.BufferAttribute( verticesOfCube, 3 ) );
    geom.computeVertexNormals();
    mesh = new THREE.Mesh( geom, materials_phong[color] );
    house.add(mesh);
    meshes[color].push(mesh);


    // Roof

    geom = new THREE.BufferGeometry();

    indicesOfFaces = [
        35, 14, 15,
        27, 14, 35,
        14, 26, 27,
        35, 15, 34,
    ];

    color = "orange";
    geom.setIndex( indicesOfFaces );
    geom.setAttribute ( 'position', new THREE.BufferAttribute( verticesOfCube, 3 ) );
    geom.computeVertexNormals();
    mesh = new THREE.Mesh( geom, materials_phong[color] );
    house.add(mesh);
    meshes[color].push(mesh);


    // Windows

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

    color = "lightgray"
    geom.setIndex( indicesOfFaces );
    geom.setAttribute ( 'position', new THREE.BufferAttribute( verticesOfCube, 3 ) );
    geom.computeVertexNormals();
    mesh = new THREE.Mesh( geom, materials_phong[color] );
    house.add(mesh);
    meshes[color].push(mesh);



    house.position.set(x,y,z);

    house.rotateY(12*Math.PI/13);
    house.scale.set(3,3,3);

    scene.add(house);
}

function createField(x, y, z) {
    color = "field";
    geometry = new THREE.PlaneGeometry( 1300, 1300, 300, 300 );
    geometry.rotateX(-Math.PI/2);

    material = materials_phong[color];
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    meshes[color].push(mesh);
}

function createSkydome(x, y, z) {
    material = new THREE.MeshBasicMaterial({
        map: skydome_texture,
        side: THREE.DoubleSide
    });

    geometry = new THREE.SphereGeometry( 540, 100, 100 );
    
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);

    scene.add(mesh);
}

////////////
/* UPDATE */
////////////
function move_far() {
    vector.z += 1;
}
function move_near() {
    vector.z -= 1;
}
function move_right() {
    vector.x -= 1;
}
function move_left() {
    vector.x += 1;
}

function toggle_texture(texture) {
    switch(texture) {
        case "Gouraud":
            if (light)
                Object.keys(meshes).forEach((c) => { 
                    meshes[c].forEach((m) => {
                        m.material = materials_gouraud[c];
                    });
                });

            mat_type = "Gouraud";
            break;
        case "Phong":
            if (light)
                Object.keys(meshes).forEach((c) => { 
                    meshes[c].forEach((m) => {
                        m.material = materials_phong[c];
                    });
                });

            mat_type = "Phong";
            break;
        case "Cartoon":
            if (light)
                Object.keys(meshes).forEach((c) => { 
                    meshes[c].forEach((m) => {
                        m.material = materials_cartoon[c];
                    });
                });

            mat_type = "Cartoon";
            break;
        case "Basic":
            light = !light;
            if (!light)
                Object.keys(meshes).forEach((c) => { 
                    meshes[c].forEach((m) => {
                        if (c != "field")
                            m.material = materials_basic[c];
                    });
                });
            else
                toggle_texture(mat_type);

            break;
    }
}

function update(){
    'use strict';
    Object.keys(controller).forEach((e) => { if (controller[e].pressed) { controller[e].function(); }})
    if(scene.getObjectByName("MoonLight").step > 0) {
        scene.getObjectByName("MoonLight").step -= 1;
    }
    // move_ovni();
}

function toggle_moon_light() {
    if(scene.getObjectByName("MoonLight").step == 0) {
        scene.getObjectByName("MoonLight").step = 20;
        scene.getObjectByName("MoonLight").visible = !scene.getObjectByName("MoonLight").visible;
    }
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
    renderer.setPixelRatio(window.devicePixelRatio); 
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));

    createScene();
    createCamera();
    createAmbientLight();

    createOvni(0,150,0);
    //createTrees();
    createHouse(-20,65,320);
    createField(0, 0, 0);
    createSkydome(0, 0, 0);
    createMoon(350, 300,-350);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    renderer.setAnimationLoop( () => {
        update();
        render(); 
    });
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
    if (controller[e.key.toUpperCase()]) { controller[e.key.toUpperCase()].pressed = true; }
});

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
document.addEventListener("keyup", (e) => {
    if (controller[e.key.toUpperCase()]) { controller[e.key.toUpperCase()].pressed = false; }
});
