import {
    PerspectiveCamera,
    WebGLRenderer,
    PCFSoftShadowMap,
    Scene,
    Vector3,
    AxesHelper,
} from './lib/three.module.js';

import MouseLookController from './controls/MouseLookController.js';

import SkyboxManager from './SkyboxManager.js';
import FogManager from "./terrain/FogManager.js";
import Snow from './terrain/Snow.js';
import CelestialManager from './CelestialManager.js'
import Terrain from './terrain/Terrain.js'

async function main() {

    const scene = new Scene();
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

    const axesHelper = new AxesHelper(15);
    scene.add(axesHelper);

    /**
       Initialize Managers
    */
    const skyboxManager = new SkyboxManager(scene, camera);
    const fogManager = new FogManager(scene);
    const SnowManager = new Snow(scene, 3000, 5);
    const celestial = new CelestialManager(scene);
    const terrainManager = new Terrain(scene, 2000, 700);

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

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


    camera.position.z = 500;
    camera.position.y = 1000;
    camera.rotation.x -= Math.PI * 0.25;

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
        speed: 0.75
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
        skyboxManager.switchToNextSkybox(); // Bytt til den første skyboksen


        // apply rotation to velocity vector, and translate moveNode with it.
        velocity.applyQuaternion(camera.quaternion);
        camera.position.add(velocity);
        skyboxManager.updateSkyboxPosition();
        SnowManager.animateSnowfall();
        // render scene:
        renderer.render(scene, camera);

        requestAnimationFrame(loop);

    };

    loop(performance.now());

}

main(); // Start application