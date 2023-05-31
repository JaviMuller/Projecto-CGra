//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var sides = 12;


var materials = {
    black: new THREE.MeshBasicMaterial({ color: black, wireframe: false }),
    red: new THREE.MeshBasicMaterial({ color: red, wireframe: false }),
    yellow: new THREE.MeshBasicMaterial({ color: yellow, wireframe: false }),
    gray: new THREE.MeshBasicMaterial({ color: gray, wireframe: false }),
    blue: new THREE.MeshBasicMaterial({ color: blue, wireframe: false }),
    lightgray: new THREE.MeshBasicMaterial({ color: lightgray, wireframe: false }),
}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

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

    const verticesOfCube = [
        0, 0, 0,        0, 1, 0,        17, 0, 0,       17, 1, 0,
        7, 1, 0,        7.5, 0, 0,      9.5, 0, 0,      10, 1, 0,
        7.5, 3.5, 0,    9.5, 3.5, 0,    0, 6, 0,        17, 6, 0,
        0, 0, 7,        17, 0, 7,       0, 8, 3.5,      17, 8, 3.5,
        0, 1, 7,        17, 1, 7,       17, 6, 7,       0, 6, 7,
        7, 0, 4,        10, 0, 4
    ];

    const indicesOfFaces = [
        0, 12, 16, 1,                           2, 3, 17, 13,
        0, 1, 4, 20, 21, 7, 3, 2, 6, 9, 8, 5,   5, 6, 9, 8,
        12, 14, 19,                             13, 15, 18,
        10, 11, 15, 14,                         15, 14, 19, 18
    ];

    const geometry = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 6, 2 );
    mesh = new THREE.Mesh(geometry, materials.blue);
    house.add(mesh);
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