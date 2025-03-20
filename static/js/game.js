
import Player from './player.js';
import Enemy from './enemy.js';
import GameMap from './map.js';
import Projectile from './projectile.js';

class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        this.playerElement = document.getElementById("player");
        this.enemyElement = document.getElementById("enemy");
        
        this.player = new Player(this.playerElement);
        this.gameMap = new GameMap(this.container);
        this.enemy = new Enemy(this.enemyElement, this.player);
        
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
                case " ":
                    event.preventDefault();
                    this.player.attack(this.enemy);
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
        this.player.update();

        if (this.player.isMoving && !this.player.animationTimer) {
            this.player.updateAnimation();
        }

        // Check for collision with enemy
        if (this.player.isAlive && this.enemy.health > 0) {
            const dx = this.player.x - this.enemy.x;
            const dy = this.player.y - this.enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 20) {
                this.player.health = 0;
                this.player.healthBarFill.style.width = "0%";
            }
        }

        // Update and check projectiles
        const projectiles = document.querySelectorAll('.projectile');
        projectiles.forEach(projectileElement => {
            const projectile = projectileElement.projectileObj;
            if (!projectile) return;
            
            projectile.update();
            
            // Check if projectile is off screen
            if (projectile.x < 0 || projectile.x > window.innerWidth || 
                projectile.y < 0 || projectile.y > window.innerHeight) {
                projectile.remove();
                return;
            }
            
            // Check for collisions
            if (!projectile.isEnemy) {
                const dx = projectile.x - this.enemy.x;
                const dy = projectile.y - this.enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 20) {
                    this.enemy.health -= 20;
                    this.enemy.healthBarFill.style.width = this.enemy.health + "%";
                    projectile.remove();
                }
            } else {
                const dx = projectile.x - this.player.x;
                const dy = projectile.y - this.player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 20) {
                    this.player.health -= 10;
                    this.player.healthBarFill.style.width = this.player.health + "%";
                    projectile.remove();
                }
            }
        });

        this.enemy.update();
        requestAnimationFrame(() => this.gameLoop());
    }
}

export default Game;
