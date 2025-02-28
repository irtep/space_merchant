import { Character, GameObject } from "../interfaces/sharedInterfaces";

const marginLeft: number = 20;
const marginTop: number = 20;
let lines: number = 0;

export const drawConsole = (
    canvas: HTMLCanvasElement,
    gameObject: GameObject): void => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gameObject.characters.forEach( (c: Character) => {
        if (c.selected) {
            ctx.font = '14px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText(`${c.name} the ${c.race} ${c.profession}`, marginLeft, marginTop);
        };
    });
};