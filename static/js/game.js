
import Player from './player.js';
import GameMap from './map.js';

class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        this.playerElement = document.getElementById("player");
        
        this.player = new Player(this.playerElement);
        this.gameMap = new GameMap(this.container);
        
        this.keys = { up: false, down: false, left: false, right: false };
        
        this.setupControls();
        this.player.updateDOMPosition();
        
        requestAnimationFrame(() => this.gameLoop());
    }

    setupControls() {
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowUp":
                    event.preventDefault();
                    this.keys.up = true;
                    break;
                case "ArrowDown":
                    event.preventDefault();
                    this.keys.down = true;
                    break;
                case "ArrowLeft":
                    event.preventDefault();
                    this.keys.left = true;
                    break;
                case "ArrowRight":
                    event.preventDefault();
                    this.keys.right = true;
                    break;
            }
        });

        document.addEventListener("keyup", (event) => {
            switch (event.key) {
                case "ArrowUp":
                    this.keys.up = false;
                    break;
                case "ArrowDown":
                    this.keys.down = false;
                    break;
                case "ArrowLeft":
                    this.keys.left = false;
                    break;
                case "ArrowRight":
                    this.keys.right = false;
                    break;
            }
        });
    }

    gameLoop() {
        let dx = 0;
        let dy = 0;
        this.player.isMoving = false;

        if (this.keys.up) {
            dy -= this.player.moveSpeed;
            this.player.facing = "up";
            this.player.isMoving = true;
        }
        if (this.keys.down) {
            dy += this.player.moveSpeed;
            this.player.facing = "down";
            this.player.isMoving = true;
        }
        if (this.keys.left) {
            dx -= this.player.moveSpeed;
            this.player.facing = "left";
            this.player.isMoving = true;
        }
        if (this.keys.right) {
            dx += this.player.moveSpeed;
            this.player.facing = "right";
            this.player.isMoving = true;
        }

        const newX = this.player.x + dx;
        if (this.gameMap.canMovePixel(newX, this.player.y)) {
            this.player.x = newX;
        }

        const newY = this.player.y + dy;
        if (this.gameMap.canMovePixel(this.player.x, newY)) {
            this.player.y = newY;
        }

        this.player.updateDOMPosition();

        if (this.player.isMoving && !this.player.animationTimer) {
            this.player.updateAnimation();
        }

        requestAnimationFrame(() => this.gameLoop());
    }
}

export default Game;
