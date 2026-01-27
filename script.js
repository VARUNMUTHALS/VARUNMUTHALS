class SnakeGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.snake = [];
        this.direction = { x: 1, y: 0, z: 0 };
        this.nextDirection = { x: 1, y: 0, z: 0 };
        this.food = null;
        this.gameStarted = false;
        this.gameOver = false;
        this.gamePaused = false;
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gridSize = 20;
        this.cubeSize = 1;
        this.moveSpeed = 150;
        this.lastMoveTime = 0;
        this.gridBounds = {
            x: { min: -10, max: 10 },
            y: { min: -10, max: 10 },
            z: { min: -10, max: 10 }
        };
        
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        const container = document.getElementById('game-container');
        
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a1a);
        this.scene.fog = new THREE.Fog(0x0a0a1a, 20, 50);
        
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(25, 25, 25);
        this.camera.lookAt(0, 0, 0);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);
        
        this.addLights();
        this.createGrid();
        this.createBoundaryBox();
        
        window.addEventListener('resize', () => this.onWindowResize());
        
        this.updateHighScoreDisplay();
        this.animate();
    }
    
    addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight1.position.set(20, 30, 20);
        directionalLight1.castShadow = true;
        directionalLight1.shadow.camera.left = -30;
        directionalLight1.shadow.camera.right = 30;
        directionalLight1.shadow.camera.top = 30;
        directionalLight1.shadow.camera.bottom = -30;
        this.scene.add(directionalLight1);
        
        const directionalLight2 = new THREE.DirectionalLight(0x00d4ff, 0.3);
        directionalLight2.position.set(-20, 20, -20);
        this.scene.add(directionalLight2);
        
        const pointLight = new THREE.PointLight(0x00ff88, 1, 50);
        pointLight.position.set(0, 10, 0);
        this.scene.add(pointLight);
    }
    
    createGrid() {
        const gridHelper = new THREE.GridHelper(40, 40, 0x00ff88, 0x334455);
        gridHelper.position.y = -10;
        this.scene.add(gridHelper);
        
        const gridHelper2 = new THREE.GridHelper(40, 40, 0x00d4ff, 0x334455);
        gridHelper2.rotation.x = Math.PI / 2;
        gridHelper2.position.z = -10;
        this.scene.add(gridHelper2);
    }
    
    createBoundaryBox() {
        const geometry = new THREE.BoxGeometry(20, 20, 20);
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x00ff88, 
            linewidth: 2,
            transparent: true,
            opacity: 0.6
        });
        const wireframe = new THREE.LineSegments(edges, lineMaterial);
        wireframe.position.set(0, 0, 0);
        this.scene.add(wireframe);
    }
    
    createSnake() {
        const snakeGeometry = new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize);
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x00ff88,
            emissive: 0x00ff88,
            emissiveIntensity: 0.3,
            metalness: 0.7,
            roughness: 0.3
        });
        
        const head = new THREE.Mesh(snakeGeometry, headMaterial);
        head.position.set(0, 0, 0);
        head.castShadow = true;
        head.receiveShadow = true;
        this.scene.add(head);
        
        this.snake = [{ 
            mesh: head, 
            position: { x: 0, y: 0, z: 0 } 
        }];
        
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x00d4ff,
            emissive: 0x00d4ff,
            emissiveIntensity: 0.2,
            metalness: 0.5,
            roughness: 0.4
        });
        
        for (let i = 1; i < 3; i++) {
            const bodyPart = new THREE.Mesh(snakeGeometry, bodyMaterial.clone());
            bodyPart.position.set(-i, 0, 0);
            bodyPart.castShadow = true;
            bodyPart.receiveShadow = true;
            this.scene.add(bodyPart);
            
            this.snake.push({ 
                mesh: bodyPart, 
                position: { x: -i, y: 0, z: 0 } 
            });
        }
    }
    
    createFood() {
        if (this.food) {
            this.scene.remove(this.food);
        }
        
        const geometry = new THREE.SphereGeometry(this.cubeSize * 0.6, 16, 16);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xff0044,
            emissive: 0xff0044,
            emissiveIntensity: 0.5,
            metalness: 0.3,
            roughness: 0.4
        });
        
        this.food = new THREE.Mesh(geometry, material);
        this.food.castShadow = true;
        
        let foodPosition;
        let validPosition = false;
        
        while (!validPosition) {
            foodPosition = {
                x: Math.floor(Math.random() * (this.gridBounds.x.max - this.gridBounds.x.min + 1)) + this.gridBounds.x.min,
                y: Math.floor(Math.random() * (this.gridBounds.y.max - this.gridBounds.y.min + 1)) + this.gridBounds.y.min,
                z: Math.floor(Math.random() * (this.gridBounds.z.max - this.gridBounds.z.min + 1)) + this.gridBounds.z.min
            };
            
            validPosition = !this.snake.some(segment => 
                segment.position.x === foodPosition.x &&
                segment.position.y === foodPosition.y &&
                segment.position.z === foodPosition.z
            );
        }
        
        this.food.position.set(foodPosition.x, foodPosition.y, foodPosition.z);
        this.scene.add(this.food);
    }
    
    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    handleKeyPress(event) {
        if (!this.gameStarted) return;
        
        if (event.code === 'Space') {
            event.preventDefault();
            this.togglePause();
            return;
        }
        
        if (this.gamePaused) return;
        
        const oppositeDirection = {
            x: -this.direction.x,
            y: -this.direction.y,
            z: -this.direction.z
        };
        
        switch(event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (!(oppositeDirection.x === 0 && oppositeDirection.y === 1 && oppositeDirection.z === 0)) {
                    this.nextDirection = { x: 0, y: 1, z: 0 };
                }
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (!(oppositeDirection.x === 0 && oppositeDirection.y === -1 && oppositeDirection.z === 0)) {
                    this.nextDirection = { x: 0, y: -1, z: 0 };
                }
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (!(oppositeDirection.x === -1 && oppositeDirection.y === 0 && oppositeDirection.z === 0)) {
                    this.nextDirection = { x: -1, y: 0, z: 0 };
                }
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (!(oppositeDirection.x === 1 && oppositeDirection.y === 0 && oppositeDirection.z === 0)) {
                    this.nextDirection = { x: 1, y: 0, z: 0 };
                }
                break;
            case 'q':
            case 'Q':
                if (!(oppositeDirection.x === 0 && oppositeDirection.y === 0 && oppositeDirection.z === 1)) {
                    this.nextDirection = { x: 0, y: 0, z: 1 };
                }
                break;
            case 'e':
            case 'E':
                if (!(oppositeDirection.x === 0 && oppositeDirection.y === 0 && oppositeDirection.z === -1)) {
                    this.nextDirection = { x: 0, y: 0, z: -1 };
                }
                break;
        }
    }
    
    togglePause() {
        this.gamePaused = !this.gamePaused;
        const pauseScreen = document.getElementById('pause-screen');
        
        if (this.gamePaused) {
            pauseScreen.classList.remove('hidden');
        } else {
            pauseScreen.classList.add('hidden');
        }
    }
    
    startGame() {
        document.getElementById('start-screen').classList.add('hidden');
        this.gameStarted = true;
        this.createSnake();
        this.createFood();
    }
    
    restartGame() {
        this.snake.forEach(segment => this.scene.remove(segment.mesh));
        this.snake = [];
        
        if (this.food) {
            this.scene.remove(this.food);
            this.food = null;
        }
        
        this.direction = { x: 1, y: 0, z: 0 };
        this.nextDirection = { x: 1, y: 0, z: 0 };
        this.gameOver = false;
        this.gamePaused = false;
        this.score = 0;
        this.updateScore();
        
        document.getElementById('game-over-screen').classList.add('hidden');
        document.getElementById('pause-screen').classList.add('hidden');
        
        this.createSnake();
        this.createFood();
    }
    
    moveSnake() {
        this.direction = { ...this.nextDirection };
        
        const head = this.snake[0];
        const newPosition = {
            x: head.position.x + this.direction.x,
            y: head.position.y + this.direction.y,
            z: head.position.z + this.direction.z
        };
        
        if (this.checkCollision(newPosition)) {
            this.endGame();
            return;
        }
        
        const ateFood = this.checkFoodCollision(newPosition);
        
        if (ateFood) {
            this.score += 10;
            this.updateScore();
            
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('snakeHighScore', this.highScore);
                this.updateHighScoreDisplay();
            }
            
            if (this.moveSpeed > 80) {
                this.moveSpeed = Math.max(80, this.moveSpeed - 2);
            }
            
            this.createFood();
            
            const tailGeometry = new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize);
            const tailMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x00d4ff,
                emissive: 0x00d4ff,
                emissiveIntensity: 0.2,
                metalness: 0.5,
                roughness: 0.4
            });
            
            const newTail = new THREE.Mesh(tailGeometry, tailMaterial);
            const lastSegment = this.snake[this.snake.length - 1];
            newTail.position.set(lastSegment.position.x, lastSegment.position.y, lastSegment.position.z);
            newTail.castShadow = true;
            newTail.receiveShadow = true;
            this.scene.add(newTail);
            
            this.snake.push({
                mesh: newTail,
                position: { ...lastSegment.position }
            });
        }
        
        for (let i = this.snake.length - 1; i > 0; i--) {
            this.snake[i].position = { ...this.snake[i - 1].position };
            this.snake[i].mesh.position.set(
                this.snake[i].position.x,
                this.snake[i].position.y,
                this.snake[i].position.z
            );
        }
        
        this.snake[0].position = newPosition;
        this.snake[0].mesh.position.set(newPosition.x, newPosition.y, newPosition.z);
        
        this.updateCameraPosition();
    }
    
    checkCollision(position) {
        if (position.x < this.gridBounds.x.min || position.x > this.gridBounds.x.max ||
            position.y < this.gridBounds.y.min || position.y > this.gridBounds.y.max ||
            position.z < this.gridBounds.z.min || position.z > this.gridBounds.z.max) {
            return true;
        }
        
        for (let i = 1; i < this.snake.length; i++) {
            if (this.snake[i].position.x === position.x &&
                this.snake[i].position.y === position.y &&
                this.snake[i].position.z === position.z) {
                return true;
            }
        }
        
        return false;
    }
    
    checkFoodCollision(position) {
        if (!this.food) return false;
        
        return Math.abs(position.x - this.food.position.x) < 0.5 &&
               Math.abs(position.y - this.food.position.y) < 0.5 &&
               Math.abs(position.z - this.food.position.z) < 0.5;
    }
    
    updateCameraPosition() {
        if (this.snake.length === 0) return;
        
        const head = this.snake[0].position;
        const targetPosition = new THREE.Vector3(
            head.x + 15,
            head.y + 15,
            head.z + 15
        );
        
        this.camera.position.lerp(targetPosition, 0.05);
        this.camera.lookAt(head.x, head.y, head.z);
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
    }
    
    updateHighScoreDisplay() {
        document.getElementById('high-score').textContent = this.highScore;
    }
    
    endGame() {
        this.gameOver = true;
        
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-high-score').textContent = this.highScore;
        document.getElementById('game-over-screen').classList.remove('hidden');
    }
    
    animateFood() {
        if (this.food) {
            this.food.rotation.y += 0.02;
            this.food.position.y += Math.sin(Date.now() * 0.002) * 0.01;
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.gameStarted && !this.gameOver && !this.gamePaused) {
            const currentTime = Date.now();
            
            if (currentTime - this.lastMoveTime > this.moveSpeed) {
                this.moveSnake();
                this.lastMoveTime = currentTime;
            }
            
            this.animateFood();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});
