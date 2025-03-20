
import Projectile from './projectile.js';

class Player {
    constructor(element) {
        this.element = element;
        this.x = 9 * TILE_SIZE;
        this.y = 7 * TILE_SIZE;
        this.facing = "down";
        this.currentFrame = 0;
        this.animationTimer = null;
        this.isMoving = false;
        this.moveSpeed = 1.5;
        this.health = 100;
        this.isAlive = true;
        this.regenRate = 0.1;
        
        this.healthBar = document.createElement('div');
        this.healthBar.className = 'health-bar';
        this.healthBarFill = document.createElement('div');
        this.healthBarFill.className = 'health-bar-fill';
        this.healthBar.appendChild(this.healthBarFill);
        this.element.appendChild(this.healthBar);
    }

    respawn() {
        this.health = 100;
        this.isAlive = true;
        this.x = Math.random() * (window.innerWidth - TILE_SIZE);
        this.y = Math.random() * (window.innerHeight - TILE_SIZE);
        this.element.style.display = "block";
        this.healthBarFill.style.width = "100%";
        this.updateDOMPosition();
    }

    update() {
        if (this.health <= 0 && this.isAlive) {
            this.isAlive = false;
            this.element.style.display = "none";
            setTimeout(() => this.respawn(), 1000);
            return;
        }

        if (!this.isAlive) return;

        if (this.health < 100) {
            this.health = Math.min(100, this.health + this.regenRate);
            this.healthBarFill.style.width = this.health + "%";
        }
    }

    updateDOMPosition() {
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
    }

    updateAnimation() {
        const row = {
            down: 0,
            left: 1,
            right: 2,
            up: 3,
        }[this.facing];

        const frameX = this.isMoving ? (this.currentFrame % ANIMATION_FRAMES) * 16 : 0;
        const frameY = row * 16;
        this.element.style.backgroundPosition = `-${frameX}px -${frameY}px`;

        if (this.animationTimer) {
            clearTimeout(this.animationTimer);
            this.animationTimer = null;
        }

        if (this.isMoving) {
            this.currentFrame = (this.currentFrame + 1) % ANIMATION_FRAMES;
            this.animationTimer = setTimeout(() => {
                this.updateAnimation();
            }, ANIMATION_SPEED);
        } else if (this.currentFrame !== 0) {
            this.currentFrame = 0;
            this.updateAnimation();
        }
    }

    attack(enemy) {
        const projectile = new Projectile(this.x, this.y, this.facing, false);
        projectile.element.projectileObj = projectile;
    }
}

export default Player;
