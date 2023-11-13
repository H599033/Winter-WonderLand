import * as THREE from "../lib/three.module.js";


export default class Snow {
    constructor(scene, snowflakeCount = 3000, snowflakeSpeed = 5) {
        this.scene = scene;
        this.snowflakeCount = snowflakeCount;
        this.snowflakeSpeed = snowflakeSpeed;

        this.snowflakeTexture = new THREE.TextureLoader().load('resources/textures/snowflake.png');
        this.snowflakeMaterial = new THREE.PointsMaterial({
            size: 5,
            map: this.snowflakeTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.snowflakeGeometry = new THREE.Geometry();

        for (let i = 0; i < this.snowflakeCount; i++) {
            const snowflake = new THREE.Vector3(
                Math.random() * 2000 - 1000,
                Math.random() * 4000 - 500,
                Math.random() * 2000 - 1000
            );
            this.snowflakeGeometry.vertices.push(snowflake);
        }

        this.snowflakeSystem = new THREE.Points(this.snowflakeGeometry, this.snowflakeMaterial);
        this.scene.add(this.snowflakeSystem);
    }

    animateSnowfall() {
        for (let i = 0; i < this.snowflakeGeometry.vertices.length; i++) {
            const snowflake = this.snowflakeGeometry.vertices[i];
            snowflake.y -= this.snowflakeSpeed;

            if (snowflake.y < -1000) {
                snowflake.y = 1000;
            }
        }

        this.snowflakeGeometry.verticesNeedUpdate = true;
    }
}
