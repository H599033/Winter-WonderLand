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
        this.directionalLight = new THREE.DirectionalLight(0xffffff);
        this.directionalLight.position.set(300, 400, 0);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 512;
        this.directionalLight.shadow.mapSize.height = 512;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 2000;
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
        this.moonDirectionalLight = new THREE.DirectionalLight(0x375a7f, 0.5);
        this.moonDirectionalLight.position.set(0, 0, 0);
        this.scene.add(this.moonDirectionalLight);
    }

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

