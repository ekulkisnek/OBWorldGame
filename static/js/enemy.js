
class Enemy {
    constructor(element, player) {
        this.element = element;
        this.player = player;
        this.x = Math.random() * (MAP_WIDTH - 2) * TILE_SIZE;
        this.y = Math.random() * (MAP_HEIGHT - 2) * TILE_SIZE;
        this.moveSpeed = 1.0;
        this.detectionRange = 100;
        this.isChasing = false;
        this.element.classList.add('enemy');
    }

    update() {
        const dx = this.player.x - this.x;
        const dy = this.player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.detectionRange) {
            this.isChasing = true;
        }

        if (this.isChasing) {
            if (dx !== 0) this.x += (dx / distance) * this.moveSpeed;
            if (dy !== 0) this.y += (dy / distance) * this.moveSpeed;
        }

        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";

        return distance < TILE_SIZE; // Return true if colliding with player
    }
}

export default Enemy;
