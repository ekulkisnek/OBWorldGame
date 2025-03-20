
class GameMap {
    constructor(container) {
        this.container = container;
        this.map = [];
        this.initMap();
    }

    initMap() {
        for (let y = 0; y < MAP_HEIGHT; y++) {
            this.map[y] = [];
            for (let x = 0; x < MAP_WIDTH; x++) {
                this.map[y][x] = 0;
            }
        }

        this.placeObject(1, 1, 3, 3, 2, "house");
        this.placeObject(15, 1, 2, 3, 1, "tree");
        this.placeObject(15, 10, 2, 3, 1, "tree");
        this.placeObject(5, 10, 1, 1, 3, "rock");

        for (let i = 0; i < 3; i++) {
            this.placeRandomObject(1, 2, 4, "small-tree");
        }

        for (let i = 0; i < 2; i++) {
            this.placeRandomObject(1, 1, 5, "hay");
        }

        this.placeObject(10, 5, 1, 1, 6, "signpost");
    }

    placeRandomObject(width, height, type, className) {
        let placed = false;
        while (!placed) {
            const rx = Math.floor(Math.random() * MAP_WIDTH);
            const ry = Math.floor(Math.random() * MAP_HEIGHT);
            if (this.canPlace(rx, ry, width, height) && (rx !== 9 || ry !== 7)) {
                this.placeObject(rx, ry, width, height, type, className);
                placed = true;
            }
        }
    }

    canPlace(x, y, width, height) {
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                const checkX = x + dx;
                const checkY = y + dy;
                if (
                    checkX < 0 || checkX >= MAP_WIDTH ||
                    checkY < 0 || checkY >= MAP_HEIGHT ||
                    this.map[checkY][checkX] !== 0
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    placeObject(x, y, width, height, type, className) {
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                this.map[y + dy][x + dx] = type;
            }
        }
        const obj = document.createElement("div");
        obj.className = `tile ${className}`;
        obj.style.left = (x * TILE_SIZE) + "px";
        obj.style.top = (y * TILE_SIZE) + "px";
        this.container.appendChild(obj);
    }

    canMovePixel(px, py) {
        const playerSize = 16;
        const corners = [
            { x: px, y: py },
            { x: px + playerSize - 1, y: py },
            { x: px, y: py + playerSize - 1 },
            { x: px + playerSize - 1, y: py + playerSize - 1 }
        ];
        for (let c of corners) {
            const tileX = Math.floor(c.x / TILE_SIZE);
            const tileY = Math.floor(c.y / TILE_SIZE);
            if (
                tileX < 0 || tileX >= MAP_WIDTH ||
                tileY < 0 || tileY >= MAP_HEIGHT ||
                this.map[tileY][tileX] !== 0
            ) {
                return false;
            }
        }
        return true;
    }
}

export default GameMap;
