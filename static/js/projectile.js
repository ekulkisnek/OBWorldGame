
class Projectile {
    constructor(x, y, direction, isEnemy) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = 4;
        this.element = document.createElement('div');
        this.element.className = 'projectile';
        this.isEnemy = isEnemy;
        
        if (isEnemy) {
            this.element.classList.add('enemy-projectile');
        }
        
        document.getElementById('game-container').appendChild(this.element);
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
    }

    update() {
        switch(this.direction) {
            case 'up': this.y -= this.speed; break;
            case 'down': this.y += this.speed; break;
            case 'left': this.x -= this.speed; break;
            case 'right': this.x += this.speed; break;
        }
        this.updatePosition();
    }

    remove() {
        this.element.remove();
    }
}

export default Projectile;
