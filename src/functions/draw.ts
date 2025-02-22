import { Character, GameObject } from "../interfaces/sharedInterfaces";

export const draw = (
    canvas: HTMLCanvasElement,
    gameObject: GameObject): void => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //console.log('loca y size ', p.r.location, p.r.stats.size);    

    // draw buildings

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