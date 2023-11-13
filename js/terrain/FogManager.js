import * as THREE from '../lib/three.module.js';

export default class FogManager {
    constructor(scene) {
        this.scene = scene;
        this.near = 1;
        this.far = 5000;
        this.color = 0xaaaaaa;
        this.setupFog();
    }

    setupFog() {
        this.scene.fog = new THREE.Fog(this.color, this.near, this.far);
    }
}