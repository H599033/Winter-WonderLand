import * as THREE from './lib/three.module.js';

export default class SkyboxManager {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.currentSkyboxIndex = 1;
        this.lastSkyboxChangeTime = new Date().getTime();
        this.skyboxes = this.loadSkyboxes(); // Load skyboxes
        this.skybox = this.createSkybox();
    }

    loadSkyboxes() {
        const skyBoxloader = new THREE.CubeTextureLoader();

        return [
            skyBoxloader.load([
                'resources/skyBox/TidligMorgen/TidligMorgen-left.png','resources/skyBox/TidligMorgen/TidligMorgen-Right.png'
                ,'resources/skyBox/TidligMorgen/TidligMorgen-bottom.png','resources/skyBox/TidligMorgen/TidligMorgen-top.png'
                ,'resources/skyBox/TidligMorgen/TidligMorgen-Front.png','resources/skyBox/TidligMorgen/TidligMorgen-back.png'
            ]),

            skyBoxloader.load([
                'resources/skyBox/Morgen/Morgen-Left.png','resources/skyBox/Morgen/Morgen-Right.png'
                ,'resources/skyBox/Morgen/Morgen-bottom.png','resources/skyBox/Morgen/Morgen-Top.png'
                ,'resources/skyBox/Morgen/Morgen-Front.png','resources/skyBox/Morgen/Morgen-Back.png'
            ]),

            skyBoxloader.load([
                'resources/skyBox/noon/Noon-left.png','resources/skyBox/noon/Noon-Right.png'
                ,'resources/skyBox/noon/Noon-bottom.png','resources/skyBox/noon/Noon-top.png'
                ,'resources/skyBox/noon/Noon-Front.png','resources/skyBox/noon/Noon-Back.png'
            ]),

            skyBoxloader.load([
                'resources/skyBox/Eftermidag/Eftermidag-Left.png','resources/skyBox/Eftermidag/Eftermidag-Right.png'
                ,'resources/skyBox/Eftermidag/Eftermidag-Bottom.png','resources/skyBox/Eftermidag/Eftermidag-Topp.png'
                ,'resources/skyBox/Eftermidag/Eftermidag-Front.png','resources/skyBox/Eftermidag/Eftermidag-back.png'
            ]),

            skyBoxloader.load([
                'resources/skyBox/Sunset/Sunset-left.png', 'resources/skyBox/Sunset/Sunset-Right.png',
                'resources/skyBox/Sunset/Sunset-Bottom.png', 'resources/skyBox/Sunset/Sunset-Top.png',
                'resources/skyBox/Sunset/Sunset-front.png', 'resources/skyBox/Sunset/Sunset-Back.png'
            ]),

            skyBoxloader.load([
                'resources/skyBox/Night/Night-left.png','resources/skyBox/Night/Night-Right.png'
                ,'resources/skyBox/Night/Night-Bottom.png','resources/skyBox/Night/Night-Top.png'
                ,'resources/skyBox/Night/Night-Front.png','resources/skyBox/Night/Night-back.png'
            ]),

            skyBoxloader.load([
                'resources/skyBox/Midnight/MidNight-Left.png','resources/skyBox/Midnight/MidNight-Right.png'
                ,'resources/skyBox/Midnight/MidNight-Bottum.png','resources/skyBox/Midnight/MidNight-Top.png'
                ,'resources/skyBox/Midnight/MidNight-Front.png','resources/skyBox/Midnight/MidNight-Back.png'
            ]),

            skyBoxloader.load([
                'resources/skyBox/Midnight/MidNight-Left.png','resources/skyBox/Midnight/MidNight-Right.png'
                ,'resources/skyBox/Midnight/MidNight-Bottum.png','resources/skyBox/Midnight/MidNight-Top.png'
                ,'resources/skyBox/Midnight/MidNight-Front.png','resources/skyBox/Midnight/MidNight-Back.png'
            ]),

            skyBoxloader.load([
                'resources/skyBox/Midnight/MidNight-Left.png','resources/skyBox/Midnight/MidNight-Right.png'
                ,'resources/skyBox/Midnight/MidNight-Bottum.png','resources/skyBox/Midnight/MidNight-Top.png'
                ,'resources/skyBox/Midnight/MidNight-Front.png','resources/skyBox/Midnight/MidNight-Back.png'
            ]),

            skyBoxloader.load([
                'resources/skyBox/EarlyDusk/EarlyDusk-Left.png','resources/skyBox/EarlyDusk/EarlyDusk-Right.png'
                ,'resources/skyBox/EarlyDusk/EarlyDusk-bottom.png','resources/skyBox/EarlyDusk/EarlyDusk-top.png'
                ,'resources/skyBox/EarlyDusk/EarlyDusk-Front.png','resources/skyBox/EarlyDusk/EarlyDusk-Back.png'
            ])
        ];
    }

    createSkybox() {
        const skyboxGeometry = new THREE.BoxGeometry(7500, 7500, 7500);
        const skyboxMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            envMap: this.skyboxes[0],
            side: THREE.DoubleSide
        });

        const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
        this.scene.add(skybox);

        return skybox;
    }

    switchToNextSkybox() {
        const timeSinceLastChange = new Date().getTime() - this.lastSkyboxChangeTime;
        const timePerSkyboxChange = 10000;

        if (timeSinceLastChange >= timePerSkyboxChange) {
            this.currentSkyboxIndex = (this.currentSkyboxIndex + 1) % this.skyboxes.length;
            this.skybox.material.envMap = this.skyboxes[this.currentSkyboxIndex];
            this.lastSkyboxChangeTime = new Date().getTime();
        }
    }

    updateSkyboxPosition() {
        this.skybox.position.copy(this.camera.position);
    }
}