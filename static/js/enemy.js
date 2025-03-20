
class Enemy {
    constructor(element, playerRef) {
        this.element = element;
        this.playerRef = playerRef;
        this.x = Math.random() * (window.innerWidth - TILE_SIZE);
        this.y = Math.random() * (window.innerHeight - TILE_SIZE);
        this.facing = "down";
        this.currentFrame = 0;
        this.animationTimer = null;
        this.isMoving = false;
        this.moveSpeed = 1.0;
        this.detectionRadius = 100;
        this.health = 100;
        
        this.healthBar = document.createElement('div');
        this.healthBar.className = 'health-bar';
        this.healthBarFill = document.createElement('div');
        this.healthBarFill.className = 'health-bar-fill';
        this.healthBar.appendChild(this.healthBarFill);
        this.element.appendChild(this.healthBar);
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

    respawn() {
        this.health = 100;
        this.healthBarFill.style.width = "100%";
        this.x = Math.random() * (window.innerWidth - TILE_SIZE);
        this.y = Math.random() * (window.innerHeight - TILE_SIZE);
        this.element.style.display = "block";
        this.updateDOMPosition();
    }

    update() {
        if (this.health <= 0) {
            if (this.element.style.display !== "none") {
                this.element.style.display = "none";
                setTimeout(() => this.respawn(), 1000);
            }
            return;
        }

        const dx = this.playerRef.x - this.x;
        const dy = this.playerRef.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        this.isMoving = false;

        if (distance < this.detectionRadius) {
            if (Math.abs(dx) > 1) {
                this.x += Math.sign(dx) * this.moveSpeed;
                this.facing = dx > 0 ? "right" : "left";
                this.isMoving = true;
            }
            if (Math.abs(dy) > 1) {
                this.y += Math.sign(dy) * this.moveSpeed;
                if (!this.isMoving) {
                    this.facing = dy > 0 ? "down" : "up";
                }
                this.isMoving = true;
            }
        }

        this.updateDOMPosition();
        if (this.isMoving && !this.animationTimer) {
            this.updateAnimation();
        }
    }
}

export default Enemy;
