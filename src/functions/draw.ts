import { Character, GameObject } from "../sharedInterfaces/sharedInterfaces";

export const draw = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D, 
    gameObject: GameObject): void => {
    const player: Character = gameObject.playerCharacter;

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw buildings

    // draw characters
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(player.location.x, player.location.y, player.stats.size, 0, Math.PI * 2);
    ctx.fill();
};