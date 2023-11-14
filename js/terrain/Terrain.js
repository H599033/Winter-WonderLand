import Utilities from "../lib/Utilities.js";
import {SimplexNoise} from "../lib/SimplexNoise.js";
import TerrainBufferGeometry from "./TerrainBufferGeometry.js";
import {GLTFLoader} from "../loaders/GLTFLoader.js";
import * as THREE from "../lib/three.module.js";
import {Mesh, RepeatWrapping, TextureLoader,} from "../lib/three.module.js";
import TextureSplattingMaterial from "../materials/TextureSplattingMaterial.js";

export default class Terrain {
    constructor(scene, width, height) {
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.setupTerrain();
        this.loadCabin();
    }

    async setupTerrain() {
        const heightmapImage = await Utilities.loadImage('resources/images/heightmap.png');
        const simplex = new SimplexNoise();
        this.terrainGeometry = new TerrainBufferGeometry({
            width: this.width,
            heightmapImage,
            numberOfSubdivisions: 128,
            height: 700
        });

        const snowyRockTexture = this.loadTexture('resources/textures/snowy_rock_01.png', 3000);
        const grassTexture = this.loadTexture('resources/textures/grass_02.png', 3000);
        const snowTexture = this.loadTexture('resources/textures/snow-covered-land.jpg', 12000);
        const waterTexture = this.loadTexture('resources/textures/water.png', 5000);

        const splatMap = this.loadSplatMap('resources/images/splatmapI.png');
        const splatMap2 = this.loadSplatMap('resources/images/splatmapV.png');
        const splatMap3 = this.loadSplatMap('resources/images/splatmapVI.png');
        const splatMap4 = this.loadSplatMap('resources/images/splatmapVII.png');

        const terrainMaterial = new TextureSplattingMaterial({
            shininess: 0,
            textures: [snowyRockTexture, snowTexture, waterTexture, grassTexture],
            splatMaps: [splatMap, splatMap2, splatMap3, splatMap4]
        });

        this.terrain = new Mesh(this.terrainGeometry, terrainMaterial);

        this.terrain.castShadow = true;
        this.terrain.receiveShadow = true;

        this.loadTrees();

        this.scene.add(this.terrain);
    }

    loadTexture(path, repeatWidth) {
        const texture = new TextureLoader().load(path);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(repeatWidth / this.width, repeatWidth / this.width);
        return texture;
    }

    loadSplatMap(path) {
        return new TextureLoader().load(path);
    }

    loadCabin() {
        const loader = new GLTFLoader();
        loader.load(
            'resources/models/hytte.glb',
            (object) => {
                const cabin = object.scene.children[0].clone();

                cabin.traverse((child) => {

                    if (child.isMesh) {

                        const texture = new TextureLoader().load('resources/textures/hytte_texture.png');
                        child.material = new THREE.MeshStandardMaterial({map: texture});
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                // Set cabin position, rotation, and scale as per your requirements
                cabin.position.x = 100;
                cabin.position.y = this.height - 370;
                cabin.position.z = -200;

                cabin.rotation.y = Math.PI / 4;

                cabin.scale.multiplyScalar(0.08);

                this.scene.add(cabin);
            },
            (xhr) => {
                console.log(((xhr.loaded / xhr.total) * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading cabin model.', error);
            }
        );
    }


    loadTrees() {
        const loader = new GLTFLoader();
        loader.load(
            'resources/models/kenney_nature_kit/tree_thin.glb',
            (object) => {
                this.placeTrees(object);
            },
            (xhr) => {
                console.log(((xhr.loaded / xhr.total) * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading model.', error);
            }
        );
    }

    placeTrees(treeObject) {
        for (let x = -400; x < 210; x += Math.random() * 115 + 157) {
            for (let z = -190; z < 210; z += Math.random() * 120 + 143) {
                const px = x + 1 + (6 * Math.random()) - 3;
                const pz = z + 1 + (6 * Math.random()) - 3;
                const height = this.terrainGeometry.getHeightAt(px, pz);

                if (height < 600) {
                    const tree = treeObject.scene.children[0].clone();

                    tree.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    tree.position.x = px + 300;
                    tree.position.y = height - 260;
                    tree.position.z = pz + 800;

                    tree.rotation.y = Math.random() * (2 * Math.PI);

                    tree.scale.multiplyScalar(120 + Math.random() * 1);

                    this.scene.add(tree);
                }
            }
        }
    }
}