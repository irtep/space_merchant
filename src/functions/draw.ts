import { Character, GameObject } from "../interfaces/sharedInterfaces";

export const draw = (
    canvas: HTMLCanvasElement,
    gameObject: GameObject): void => {
    const player: Character = gameObject.playerCharacter;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    console.log('loca y size ', player.location, player.stats.size);    

    // draw buildings

    // draw characters
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(player.location.x, player.location.y, player.stats.size * 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '14px Arial';
    ctx.fillStyle = 'cyan';
    ctx.fillText('characteri', player.location.x, player.location.y - 10);
};