import { Character, Coordinates, GameObject } from "../interfaces/sharedInterfaces";
import { isCircleColliding } from "./collisions";
import { draw } from "./draw";

// for canvas 2 (the console) controls are in drawConsole

export const handleKeyDown = (
    e: KeyboardEvent,
    setPause: React.Dispatch<React.SetStateAction<boolean>>,
    pauseRef: React.RefObject<boolean>,
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
    //indexOfSelected: number,
    //setIndexOfSelected: React.Dispatch<React.SetStateAction<number>>/*,
    //setPause: React.Dispatch<React.SetStateAction<boolean>>,
    //pause: boolean*/
) => {
    if (!canvasRef.current) return;
    const clickSize: number = 1;
    const canvas = canvasRef.current;
    const rect: DOMRect = canvas.getBoundingClientRect();
    const mouseX: number = e.clientX - rect.left;
    const mouseY: number = e.clientY - rect.top;
    const player: Character | undefined = gameObject.characters.find((c: Character) => c.isPlayer === true);
    let playersTeam: string = gameObject.characters[0].team;
    let indexOfSelected: number | undefined = undefined;
    //let gameObject.clickedCharacterIndex: number | undefined = undefined;
    if (player) { playersTeam = player.team };
    //gameObject.mouseNowX = mouseX; just for hover, i think these
    //gameObject.mouseNowY = mouseY;
    const clickedLocation: Coordinates = { x: mouseX, y: mouseY };
    let hitToCharacter: boolean = false;
    //console.log('clicked: ', mouseX, mouseY);
    //console.log('go: ', gameObject);

    // check if any of characters where clicked or if anyone is selected already
    gameObject.characters.forEach((c: Character, i: number) => {

        if (c.selected) { indexOfSelected = i; };

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
            gameObject.clickedCharacterIndex = i;
            console.log('found in index: ', i);
            hitToCharacter = true;
        }
    });

    // if is character, check if it is of players team
    if (hitToCharacter) {

        console.log('hit');
        //console.log('comparing: ', gameObject.characters[gameObject.clickedCharacterIndex].team, ' vs ', playersTeam);

        if (gameObject.characters[gameObject.clickedCharacterIndex].team === playersTeam) {
            // clicked is in players team
            console.log('in players team');
            // if already was selected
            if (gameObject.clickedCharacterIndex === indexOfSelected) {
                // switch to next action
                if (gameObject.characters[gameObject.clickedCharacterIndex].action === 'wait') {
                    // reset movement target. x: 0 and y: 0 is "don't move"
                    gameObject.characters[gameObject.clickedCharacterIndex].targetLocation = { x: 0, y: 0 };
                    gameObject.characters[gameObject.clickedCharacterIndex].action = 'move';
                } else if (gameObject.characters[gameObject.clickedCharacterIndex].action === 'move') {
                    gameObject.characters[gameObject.clickedCharacterIndex].actionTarget = '';
                    gameObject.characters[gameObject.clickedCharacterIndex].action = 'attack';
                } else if (gameObject.characters[gameObject.clickedCharacterIndex].action === 'attack') {
                    gameObject.characters[gameObject.clickedCharacterIndex].action = 'wait';
                }
            } else {
            // set all unselected
            console.log('not in players team');
            gameObject.characters.forEach((c: Character) => { c.selected = false });
            // set this clicked as selected
            gameObject.characters[gameObject.clickedCharacterIndex].selected = true;
            indexOfSelected = gameObject.clickedCharacterIndex;
            }
            console.log('in players team');

        } else {
            // not in players team
            // make this targeted, target of selected
            if (indexOfSelected !== undefined) {
                gameObject.characters.forEach((c: Character) => {
                    if (c.selected && gameObject.clickedCharacterIndex) {
                        // if selected action is attack
                        if (c.action == 'attack') {
                            c.actionTarget = gameObject.characters[gameObject.clickedCharacterIndex].id;
                            // add target and his team of the target to your enemies list:
                            c.enemies.push(gameObject.characters[gameObject.clickedCharacterIndex].id);
                            c.enemies.push(gameObject.characters[gameObject.clickedCharacterIndex].team);
                        }
                    }
                });
            }
        }
    } else {
        // if walking, then target location
        console.log('no gameObject.clickedCharacterIndex, indexOfSelected:', indexOfSelected);
        if (indexOfSelected !== undefined && gameObject.characters[indexOfSelected].action === 'move') {
            console.log('move target to ', gameObject.characters[indexOfSelected]);
            gameObject.characters[indexOfSelected].targetLocation = { x: mouseX, y: mouseY };
        } else {
            console.log('i o s: ', indexOfSelected, );
            if (indexOfSelected !== undefined) {
                console.log('action: ', gameObject.characters[indexOfSelected].action);
            }
        }
    }
    draw(canvas, gameObject);
};
