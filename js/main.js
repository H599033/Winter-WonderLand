import {
    PerspectiveCamera,
    WebGLRenderer,
    PCFSoftShadowMap,
    Scene,
    Mesh,
    TextureLoader,
    RepeatWrapping,
    DirectionalLight,
    Vector3,
    AxesHelper,
} from './lib/three.module.js';

import Utilities from './lib/Utilities.js';
import MouseLookController from './controls/MouseLookController.js';

import TextureSplattingMaterial from './materials/TextureSplattingMaterial.js';
import TerrainBufferGeometry from './terrain/TerrainBufferGeometry.js';
import { GLTFLoader } from './loaders/GLTFLoader.js';
import { SimplexNoise } from './lib/SimplexNoise.js';
import * as THREE from "./lib/three.module.js";

async function main() {

    const scene = new Scene();

    const axesHelper = new AxesHelper(15);
    scene.add(axesHelper);

    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    let skyBoxloader = new THREE.CubeTextureLoader();

    let skyboxSunsett = skyBoxloader.load([
        'resources/skyBox/Sunset/Sunset-left.png','resources/skyBox/Sunset/Sunset-Right.png'
        ,'resources/skyBox/Sunset/Sunset-Bottom.png','resources/skyBox/Sunset/Sunset-Top.png'
        ,'resources/skyBox/Sunset/Sunset-Back.png','resources/skyBox/Sunset/Sunset-front.png'
    ])

    let skyboxEarlyDusk = skyBoxloader.load([
        'resources/skyBox/EarlyDusk/EarlyDusk-Left.png','resources/skyBox/EarlyDusk/EarlyDusk-Right.png'
        ,'resources/skyBox/EarlyDusk/EarlyDusk-bottom.png','resources/skyBox/EarlyDusk/EarlyDusk-top.png'
        ,'resources/skyBox/EarlyDusk/EarlyDusk-Back.png','resources/skyBox/EarlyDusk/EarlyDusk-Front.png'
    ])

    let skyboxEftermidag = skyBoxloader.load([
        'resources/skyBox/Eftermidag/Eftermidag-Left.png','resources/skyBox/Eftermidag/Eftermidag-Right.png'
        ,'resources/skyBox/Eftermidag/Eftermidag-Bottom.png','resources/skyBox/Eftermidag/Eftermidag-Topp.png'
        ,'resources/skyBox/Eftermidag/Eftermidag-back.png','resources/skyBox/Eftermidag/Eftermidag-Front.png'
    ])
    let skyboxMidnight = skyBoxloader.load([
        'resources/skyBox/Midnight/MidNight-Left.png','resources/skyBox/Midnight/MidNight-Right.png'
        ,'resources/skyBox/Midnight/MidNight-Bottum.png','resources/skyBox/Midnight/MidNight-Top.png'
        ,'resources/skyBox/Midnight/MidNight-Back.png','resources/skyBox/Midnight/MidNight-Front.png'
    ])

    let skyboxMorgen = skyBoxloader.load([
        'resources/skyBox/Morgen/Morgen-Left.png','resources/skyBox/Morgen/Morgen-Right.png'
        ,'resources/skyBox/Morgen/Morgen-bottom.png','resources/skyBox/Morgen/Morgen-Top.png'
        ,'resources/skyBox/Morgen/Morgen-Back.png','resources/skyBox/Morgen/Morgen-Front.png'
    ])
    let skyboxNight = skyBoxloader.load([
        'resources/skyBox/Night/Night-left.png','resources/skyBox/Night/Night-Right.png'
        ,'resources/skyBox/Night/Night-Bottom.png','resources/skyBox/Night/Night-Top.png'
        ,'resources/skyBox/Night/Night-back.png','resources/skyBox/Night/Night-Front.png'
    ])

    let skyboxTidligMorgen = skyBoxloader.load([
        'resources/skyBox/TidligMorgen/TidligMorgen-left.png','resources/skyBox/TidligMorgen/TidligMorgen-Right.png'
        ,'resources/skyBox/TidligMorgen/TidligMorgen-bottom.png','resources/skyBox/TidligMorgen/TidligMorgen-top.png'
        ,'resources/skyBox/TidligMorgen/TidligMorgen-back.png','resources/skyBox/TidligMorgen/TidligMorgen-Front.png'
    ])
    let skyboxNoon = skyBoxloader.load([
        'resources/skyBox/noon/Noon-left.png','resources/skyBox/noon/Noon-Right.png'
        ,'resources/skyBox/noon/Noon-bottom.png','resources/skyBox/noon/Noon-top.png'
        ,'resources/skyBox/noon/Noon-Back.png','resources/skyBox/noon/Noon-Front.png'
    ])


    let skybox = new THREE.Mesh(
        new THREE.BoxGeometry(1000, 1000, 1000),
        new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: skyboxTidligMorgen ,side: THREE.DoubleSide} )
    );
    const skyboxes = [skyboxEarlyDusk,skyboxTidligMorgen,skyboxMorgen,skyboxNoon,skyboxEftermidag,skyboxSunsett,skyboxNight,skyboxMidnight]

// Initialiser indeksen for den gjeldende skyboksen
    let currentSkyboxIndex = 0;
    let lastSkyboxChangeTime = new Date().getTime();
// Tid i millisekunder for hvert skybox-bytte


// Funksjon for å bytte til neste skyboks
    function switchToNextSkybox() {
        const timeSinceLastChange = new Date().getTime() - lastSkyboxChangeTime;
        const timePerSkyboxChange = 20000; // Tid per skyboksendring i millisekunder (her satt til 10 sekunder).

        if (timeSinceLastChange >= timePerSkyboxChange) {
            currentSkyboxIndex = (currentSkyboxIndex + 1) % skyboxes.length;
            skybox.material.envMap = skyboxes[currentSkyboxIndex];
            lastSkyboxChangeTime = new Date().getTime();
        }
    }

    function updateSkyboxPosition() {
        skybox.position.copy(camera.position);
    }
    scene.add(skybox);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    /**
     * Handle window resize:
     *  - update aspect ratio.
     *  - update projection matrix
     *  - update renderer size
     */
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    /**
     * Add canvas element to DOM.
     */
    document.body.appendChild(renderer.domElement);

    /**
     * Add light
     */
    const directionalLight = new DirectionalLight(0xffffff);
    directionalLight.position.set(300, 400, 0);

    directionalLight.castShadow = true;

    //Set up shadow properties for the light
    directionalLight.shadow.mapSize.width = 512;
    directionalLight.shadow.mapSize.height = 512;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 2000;

    scene.add(directionalLight);

    // Set direction
    directionalLight.target.position.set(0, 15, 0);
    scene.add(directionalLight.target);

    camera.position.z = 70;
    camera.position.y = 55;
    camera.rotation.x -= Math.PI * 0.25;


    /**
     * Add terrain:
     *
     * We have to wait for the image file to be loaded by the browser.
     * There are many ways to handle asynchronous flow in your application.
     * We are using the async/await language constructs of Javascript:
     *  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
     */
    const heightmapImage = await Utilities.loadImage('resources/images/heightmap.png');
    const width = 100;

    const simplex = new SimplexNoise();
    const terrainGeometry = new TerrainBufferGeometry({
        width,
        heightmapImage,
        // noiseFn: simplex.noise.bind(simplex),
        numberOfSubdivisions: 128,
        height: 40
    });

    const snowyRockTexture = new TextureLoader().load('resources/textures/snowy_rock_01.png');
    snowyRockTexture.wrapS = RepeatWrapping;
    snowyRockTexture.wrapT = RepeatWrapping;
    snowyRockTexture.repeat.set(1500 / width, 1500 / width);

    const grassTexture = new TextureLoader().load('resources/textures/grass_02.png');
    grassTexture.wrapS = RepeatWrapping;
    grassTexture.wrapT = RepeatWrapping;
    grassTexture.repeat.set(5000 / width, 5000 / width);

    const snowTexture = new TextureLoader().load('resources/textures/snow-covered-land.jpg');
    snowTexture.wrapS = RepeatWrapping;
    snowTexture.wrapT = RepeatWrapping;
    snowTexture.repeat.set(1000 / width, 1000 / width);


    const splatMap = new TextureLoader().load('resources/images/splatmap_01.png');

    const terrainMaterial = new TextureSplattingMaterial({
        color: 0xffffff,
        shininess: 0,
        textures: [snowyRockTexture, grassTexture, snowTexture],
        splatMaps: [splatMap]
    });

    const terrain = new Mesh(terrainGeometry, terrainMaterial);

    terrain.castShadow = true;
    terrain.receiveShadow = true;

    scene.add(terrain);

    /**
     * Add trees
     */

        // instantiate a GLTFLoader:
    const loader = new GLTFLoader();

    loader.load(
        // resource URL
        'resources/models/kenney_nature_kit/tree_thin.glb',
        // called when resource is loaded
        (object) => {
            for (let x = -50; x < 50; x += 8) {
                for (let z = -50; z < 50; z += 8) {

                    const px = x + 1 + (6 * Math.random()) - 3;
                    const pz = z + 1 + (6 * Math.random()) - 3;

                    const height = terrainGeometry.getHeightAt(px, pz);

                    if (height < 5) {
                        const tree = object.scene.children[0].clone();

                        tree.traverse((child) => {
                            if (child.isMesh) {
                                child.castShadow = true;
                                child.receiveShadow = true;
                            }
                        });

                        tree.position.x = px;
                        tree.position.y = height - 0.01;
                        tree.position.z = pz;

                        tree.rotation.y = Math.random() * (2 * Math.PI);

                        tree.scale.multiplyScalar(1.5 + Math.random() * 1);

                        scene.add(tree);
                    }

                }
            }
        },
        (xhr) => {
            console.log(((xhr.loaded / xhr.total) * 100) + '% loaded');
        },
        (error) => {
            console.error('Error loading model.', error);
        }
    );

    /**
     * Set up camera controller:
     */

    const mouseLookController = new MouseLookController(camera);

    // We attach a click lister to the canvas-element so that we can request a pointer lock.
    // https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
    const canvas = renderer.domElement;

    canvas.addEventListener('click', () => {
        canvas.requestPointerLock();
    });

    let yaw = 0;
    let pitch = 0;
    const mouseSensitivity = 0.001;

    function updateCamRotation(event) {
        yaw += event.movementX * mouseSensitivity;
        pitch += event.movementY * mouseSensitivity;
    }

    document.addEventListener('pointerlockchange', () => {
        if (document.pointerLockElement === canvas) {
            canvas.addEventListener('mousemove', updateCamRotation, false);
        } else {
            canvas.removeEventListener('mousemove', updateCamRotation, false);
        }
    });

    let move = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        speed: 0.0225
    };

    window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyW') {
            move.forward = true;
            e.preventDefault();
        } else if (e.code === 'KeyS') {
            move.backward = true;
            e.preventDefault();
        } else if (e.code === 'KeyA') {
            move.left = true;
            e.preventDefault();
        } else if (e.code === 'KeyD') {
            move.right = true;
            e.preventDefault();
        }
    });


    window.addEventListener('keyup', (e) => {
        if (e.code === 'KeyW') {
            move.forward = false;
            e.preventDefault();
        } else if (e.code === 'KeyS') {
            move.backward = false;
            e.preventDefault();
        } else if (e.code === 'KeyA') {
            move.left = false;
            e.preventDefault();
        } else if (e.code === 'KeyD') {
            move.right = false;
            e.preventDefault();
        }
    });

    const velocity = new Vector3(0.0, 0.0, 0.0);

    let then = performance.now();
    function loop(now) {

        const delta = now - then;
        then = now;

        const moveSpeed = move.speed * delta;

        velocity.set(0.0, 0.0, 0.0);

        if (move.left) {
            velocity.x -= moveSpeed;
        }

        if (move.right) {
            velocity.x += moveSpeed;
        }

        if (move.forward) {
            velocity.z -= moveSpeed;
        }

        if (move.backward) {
            velocity.z += moveSpeed;
        }

        // update controller rotation.
        mouseLookController.update(pitch, yaw);
        yaw = 0;
        pitch = 0;
        switchToNextSkybox(); // Bytt til den første skyboksen


        // apply rotation to velocity vector, and translate moveNode with it.
        velocity.applyQuaternion(camera.quaternion);
        camera.position.add(velocity);
        updateSkyboxPosition();
        // render scene:
        renderer.render(scene, camera);

        requestAnimationFrame(loop);

    };

    loop(performance.now());

}

main(); // Start application