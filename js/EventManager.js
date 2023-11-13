class EventListeners {
    constructor(canvas, camera, mouseLookController, move) {
        this.canvas = canvas;
        this.camera = camera;
        this.mouseLookController = mouseLookController;
        this.move = move;
        this.yaw = 0;
        this.pitch = 0;
        this.mouseSensitivity = 0.001;
    }

    setupEventListeners() {
        this.setupResizeListener();
        this.setupClickListener();
        this.setupKeyListeners();
        this.setupPointerLockListener();
    }

    setupResizeListener() {
        window.addEventListener('resize', () => {
            this.handleResize();
        }, false);
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setupClickListener() {
        this.canvas.addEventListener('click', () => {
            this.handleCanvasClick();
        });
    }

    handleCanvasClick() {
        this.canvas.requestPointerLock();
    }

    setupPointerLockListener() {
        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement === this.canvas) {
                this.canvas.addEventListener('mousemove', this.updateCamRotation.bind(this), false);
            } else {
                this.canvas.removeEventListener('mousemove', this.updateCamRotation.bind(this), false);
            }
        });
    }

    updateCamRotation(event) {
        this.yaw += event.movementX * this.mouseSensitivity;
        this.pitch += event.movementY * this.mouseSensitivity;
    }

    setupKeyListeners() {
        window.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });

        window.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });
    }

    handleKeyDown(e) {
        switch (e.code) {
            case 'KeyW':
                this.move.forward = true;
                e.preventDefault();
                break;
            case 'KeyS':
                this.move.backward = true;
                e.preventDefault();
                break;
            case 'KeyA':
                this.move.left = true;
                e.preventDefault();
                break;
            case 'KeyD':
                this.move.right = true;
                e.preventDefault();
                break;
            // Add more cases as needed...
        }
    }

    handleKeyUp(e) {
        switch (e.code) {
            case 'KeyW':
                this.move.forward = false;
                e.preventDefault();
                break;
            case 'KeyS':
                this.move.backward = false;
                e.preventDefault();
                break;
            case 'KeyA':
                this.move.left = false;
                e.preventDefault();
                break;
            case 'KeyD':
                this.move.right = false;
                e.preventDefault();
                break;
            // Add more cases as needed...
        }
    }
}

// Usage in your main function:
const eventListeners = new EventListeners(canvas, camera, mouseLookController, move);
eventListeners.setupEventListeners();