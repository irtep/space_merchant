import { Character, Coordinates, GameObject } from "../interfaces/sharedInterfaces";
import { isCircleColliding } from "./collisions";
//import { shoot } from "./fireWeapon";

// Keyboard state
// supports arrows and wsad
/*
export const keys: { [key: string]: boolean } = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    s: false,
    a: false,
    d: false,
};
*/
// Event listeners for keyboard
/*
export const handleKeyDown = (e: KeyboardEvent) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
};

export const handleKeyUp = (e: KeyboardEvent) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
};
*/
export const handleKeyDown = (
    e: KeyboardEvent,
    setPause: React.Dispatch<React.SetStateAction<boolean>>,
    pauseRef: React.MutableRefObject<boolean>,
    setMessage: React.Dispatch<React.SetStateAction<string>>
) => {
    if (e.key === ' ') {
        setPause((prevPause) => {
            const newPauseState = !prevPause;
            pauseRef.current = newPauseState; // Ensure pauseRef is updated
            console.log('Paused:', newPauseState);
            setMessage(newPauseState ? 'PAUSED' : 'not in pause');
            return newPauseState;
        });
    }
};

export const handleMouseDown = (
    e: MouseEvent,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    gameObject: GameObject
) => {
    if (!canvasRef.current) return;
    const clickSize: number = 1;
    const canvas = canvasRef.current;
    const rect: DOMRect = canvas.getBoundingClientRect();
    const mouseX: number = e.clientX - rect.left;
    const mouseY: number = e.clientY - rect.top;
    const player: Character | undefined = gameObject.characters.find((c: Character, i: number) => c.isPlayer === true);
    let playersTeam: string = gameObject.characters[0].team;
    let indexOfSelected: number | undefined = undefined;
    let indexOfClicked: number | undefined = undefined;
    if (player) { playersTeam = player.team };
    //gameObject.mouseNowX = mouseX; just for hover, i think these
    //gameObject.mouseNowY = mouseY;
    const clickedLocation: Coordinates = { x: mouseX, y: mouseY }
    console.log('clicked: ', mouseX, mouseY);

    // check if any of characters where clicked
    gameObject.characters.forEach((c: Character, i: number) => {
        const collisionResult: boolean = isCircleColliding(
            {
                x: clickedLocation.x,
                y: clickedLocation.y,
                size: clickSize
            },
            {
                x: c.location.x,
                y: c.location.y,
                size: c.stats.size
            });
        if (collisionResult) {
            indexOfClicked = i;
            console.log('found in index: ', i);
        } else {
            /*
            console.log('no collision: ',
                clickedLocation.x,
                clickedLocation.y,
                clickSize,
                ' vs ',
                c.location.x,
                c.location.y,
                c.stats.size
            );
            */
        };
        // check also, just in case, who is selected
        if (c.selected) { indexOfSelected = i; };
    });
    // if is character, check if it is of players team
    if (indexOfClicked !== undefined) {
        console.log('hit');
        console.log('comparing: ', gameObject.characters[indexOfClicked].team, ' vs ', playersTeam);
        if (gameObject.characters[indexOfClicked].team === playersTeam) {
            console.log('in players team');
            // set all unselected
            gameObject.characters.forEach((c: Character) => { c.selected = false });
            // set this clicked as selected
            gameObject.characters[indexOfClicked].selected = true;
            indexOfSelected = indexOfClicked;
        } else {
            // make this targeted, target of selected
            if (indexOfSelected) {
                gameObject.characters.forEach((c: Character) => {
                    if (c.selected && indexOfClicked) {
                        c.actionTarget = gameObject.characters[indexOfClicked].id;
                    }
                });
            }
        }
    } else {
        // if walking, then target location
        console.log('no indexOfClicked');
        if (indexOfSelected && gameObject.characters[indexOfSelected].action === 'move') {
            console.log('move target to ', gameObject.characters[indexOfSelected]);
            gameObject.characters[indexOfSelected].targetLocation = { x: mouseX, y: mouseY };
        } else {
            console.log('i o s & action: ', indexOfSelected, gameObject.characters);
        }
    }
};