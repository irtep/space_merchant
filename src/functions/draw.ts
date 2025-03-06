import { Character, CircleObstacle, GameObject, RectObstacle } from "../interfaces/sharedInterfaces";

export const draw = (
    canvas: HTMLCanvasElement,
    gameObject: GameObject): void => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //console.log('gameO: ', gameObject);

    // Draw buildings (rectObstacles)
    gameObject.gameMap.rectObstacles.forEach((building: RectObstacle) => {
        ctx.fillStyle = building.color || 'black';
        ctx.fillRect(building.x, building.y, building.w, building.h);

        // Draw door
        if (building.door) {
            ctx.fillStyle = 'brown';
            ctx.fillRect(building.door.x - 5, building.door.y - 5, 10, 10);
        }

        // Draw building name
        if (building.name) {
            ctx.font = '14px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText(building.name, building.x + building.w / 2 - ctx.measureText(building.name).width / 2, building.y - 5);
        }

    });

    // Draw circular obstacles (e.g., watchtowers, trees)
    gameObject.gameMap.circleObstacles.forEach((obstacle: CircleObstacle) => {
        ctx.fillStyle = obstacle.color || 'black';
        ctx.beginPath();
        ctx.arc(obstacle.x, obstacle.y, obstacle.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw name
        ctx.font = '14px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(obstacle.name, obstacle.x - ctx.measureText(obstacle.name).width / 2, obstacle.y - obstacle.size - 5);
    });

    // Draw loots
    gameObject.gameMap.loots.forEach((loot) => {
        ctx.fillStyle = 'gold';
        ctx.beginPath();
        ctx.arc(loot.x, loot.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw loot name
        ctx.font = '12px Arial';
        ctx.fillStyle = 'yellow';
        ctx.fillText(loot.what.name, loot.x - ctx.measureText(loot.what.name).width / 2, loot.y - 10);
    });

    // draw characters
    gameObject.characters.forEach((c: Character) => {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(c.location.x, c.location.y, c.stats.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '14px Arial';
        ctx.fillStyle = 'cyan';
        ctx.fillText(c.name, c.location.x, c.location.y - 14);
        ctx.fillText(c.action, c.location.x, c.location.y);
        if (c.action === 'move' && c.selected === true) {
            ctx.fillText('to where?', c.location.x, c.location.y + 14);
        }
        else if (c.action === 'attack' && c.selected === true) {
            if (c.actionTarget === '') {
                ctx.fillText('who?', c.location.x, c.location.y + 14);
            } else {
                ctx.fillText(c.actionTarget, c.location.x, c.location.y + 14);
            }
        }
        // green circle if selected
        if (c.selected) {
            ctx.strokeStyle = 'green';
            ctx.beginPath();
            ctx.arc(c.location.x, c.location.y, c.stats.size + 10, 0, Math.PI * 2);
            ctx.stroke();
        }

    });
};