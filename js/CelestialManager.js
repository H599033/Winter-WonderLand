import * as THREE from "./lib/three.module.js";

export default class CelestialManager {
    constructor(scene) {
        this.scene = scene;
        this.setupDirectionalLight();
        this.setupSun();
        this.setupMoon();
        this.setupCelestialGroup();
        this.setupMoonDirectionalLight();
        this.setupAnimation();
    }

    setupDirectionalLight() {
        this.directionalLight = new THREE.DirectionalLight(0xffccaa,1); // hvit lys0xfffffff gult  0xffccaa
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 5000;
        this.directionalLight.shadow.camera.left = -1000;
        this.directionalLight.shadow.camera.right = 1000;
        this.directionalLight.shadow.camera.top = 1000;
        this.directionalLight.shadow.camera.bottom = -1000;

        this.scene.add(this.directionalLight);
    }


    setupSun() {
        const sunGeometry = new THREE.SphereGeometry(100, 132, 132, Math.PI);
        const sunTexture = new THREE.TextureLoader().load('resources/textures/texture_sun.jpg');
        const sunMaterial = new THREE.MeshBasicMaterial({
            map: sunTexture,
        });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(this.sun);
    }

    setupMoon() {
        const moonGeometry = new THREE.SphereGeometry(100, 132, 132, 0);
        const moonTexture = new THREE.TextureLoader().load('resources/textures/2k_moon.jpg');
        const moonMaterial = new THREE.MeshBasicMaterial({
            map: moonTexture,
        });
        this.moon = new THREE.Mesh(moonGeometry, moonMaterial);
        this.scene.add(this.moon);
    }

    setupCelestialGroup() {
        this.celestialGroup = new THREE.Group();
        this.scene.add(this.celestialGroup);
        this.celestialGroup.add(this.sun);
        this.celestialGroup.add(this.moon);
    }

    setupMoonDirectionalLight() {
        this.moonDirectionalLight = new THREE.DirectionalLight(0x375a7f , 0.3);
        this.moonDirectionalLight.castShadow = true;
        this.moonDirectionalLight.shadow.mapSize.width = 2048;
        this.moonDirectionalLight.shadow.mapSize.height = 2048;
        this.moonDirectionalLight.shadow.camera.near = 0.5;
        this.moonDirectionalLight.shadow.camera.far = 5000;
        this.moonDirectionalLight.shadow.camera.left = -1000;
        this.moonDirectionalLight.shadow.camera.right = 1000;
        this.moonDirectionalLight.shadow.camera.top = 1000;
        this.moonDirectionalLight.shadow.camera.bottom = -1000;
        this.scene.add(this.moonDirectionalLight);
    }



  // Juster etter behov
    // Juster etter behov

    setupAnimation() {
        this.distance = 3000;
        this.sunSpeed = 0.065;
        this.moonSpeed = 0.065;
        this.clock = new THREE.Clock();

        this.animateCelestials();
    }

    animateCelestials() {
        const elapsedTime = this.clock.getElapsedTime();
        const sunX = this.distance * Math.cos(elapsedTime * this.sunSpeed);
        const sunY = this.distance * Math.sin(elapsedTime * this.sunSpeed);
        const moonX = this.distance * Math.cos(Math.PI + elapsedTime * this.moonSpeed);
        const moonY = this.distance * Math.sin(Math.PI + elapsedTime * this.moonSpeed);
        this.sun.position.set(sunX, sunY, 0);
        this.moon.position.set(moonX, moonY, 0);
        this.directionalLight.position.copy(this.sun.position);
        this.moonDirectionalLight.position.copy(this.moon.position);

        requestAnimationFrame(() => this.animateCelestials());
    }
}


