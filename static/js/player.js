
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
        this.isAttacking = false;
        this.attackCooldown = false;
    }

    attack() {
        if (!this.attackCooldown) {
            this.isAttacking = true;
            this.element.style.backgroundColor = 'yellow';
            setTimeout(() => {
                this.isAttacking = false;
                this.element.style.backgroundColor = '';
                this.attackCooldown = true;
                setTimeout(() => this.attackCooldown = false, 500);
            }, 200);
        }
    }

    takeDamage() {
        if (!this.isAttacking) {
            this.health -= 10;
            this.element.style.backgroundColor = 'red';
            setTimeout(() => this.element.style.backgroundColor = '', 200);
            if (this.health <= 0) {
                alert('Game Over!');
                window.location.reload();
            }
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
}

export default Player;
