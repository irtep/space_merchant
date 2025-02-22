import { Character, Coordinates, GameObject } from "../interfaces/sharedInterfaces";
import { isCircleColliding } from "./collisions";
import { draw } from "./draw";
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
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    liveGameObject: GameObject,
    setGameObject: React.Dispatch<React.SetStateAction<GameObject>>
) => {
    if (e.key === ' ') {
        setPause((prevPause) => {
            const newPauseState = !prevPause;
            pauseRef.current = newPauseState; // Ensure pauseRef is updated
            console.log('Paused:', newPauseState);
            setMessage(newPauseState ? 'PAUSED' : 'not in pause');
            return newPauseState;
        });
        
        setGameObject(liveGameObject);  
    }
};

export const handleMouseDown = (
    e: MouseEvent,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    gameObject: GameObject,
    indexOfSelected: number,
    setIndexOfSelected: React.Dispatch<React.SetStateAction<number>>/*,
    setPause: React.Dispatch<React.SetStateAction<boolean>>,
    pause: boolean*/
) => {
    if (!canvasRef.current) return;
    const clickSize: number = 1;
    const canvas = canvasRef.current;
    const rect: DOMRect = canvas.getBoundingClientRect();
    const mouseX: number = e.clientX - rect.left;
    const mouseY: number = e.clientY - rect.top;
    const player: Character | undefined = gameObject.characters.find((c: Character, i: number) => c.isPlayer === true);
    let playersTeam: string = gameObject.characters[0].team;
    //let indexOfSelected: number | undefined = undefined;
    let indexOfClicked: number | undefined = undefined;
    if (player) { playersTeam = player.team };
    //gameObject.mouseNowX = mouseX; just for hover, i think these
    //gameObject.mouseNowY = mouseY;
    const clickedLocation: Coordinates = { x: mouseX, y: mouseY };
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

        };
        // check also, just in case, who is selected
        if (c.selected) { indexOfSelected = i; };
    });

    // if is character, check if it is of players team
    if (indexOfClicked !== undefined) {

        console.log('hit');
        console.log('comparing: ', gameObject.characters[indexOfClicked].team, ' vs ', playersTeam);

        if (gameObject.characters[indexOfClicked].team === playersTeam) {
            // clicked is in players team
            // if already was selected
            if (indexOfClicked === indexOfSelected) {
                // switch to next action
                if (gameObject.characters[indexOfClicked].action === 'wait') {
                    gameObject.characters[indexOfClicked].action = 'move';
                } else if (gameObject.characters[indexOfClicked].action === 'move') {
                    gameObject.characters[indexOfClicked].action = 'attack';
                } else if (gameObject.characters[indexOfClicked].action === 'attack') {
                    gameObject.characters[indexOfClicked].action = 'wait';
                }
            } else {
            // set all unselected
            gameObject.characters.forEach((c: Character) => { c.selected = false });
            // set this clicked as selected
            gameObject.characters[indexOfClicked].selected = true;
            setIndexOfSelected(indexOfClicked);
            }
            console.log('in players team');

        } else {
            // not in players team
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
            console.log('i o s: ', indexOfSelected);
        }
    }
    draw(canvas, gameObject);
};
