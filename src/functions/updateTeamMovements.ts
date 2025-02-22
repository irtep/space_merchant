import { Character, Coordinates, GameObject } from "../interfaces/sharedInterfaces";
import { isCircleColliding } from "./collisions";

const makeMovement = (direction: string, speed: number, locationATM: Coordinates): Coordinates => {
    let newLocation: Coordinates = locationATM;

    switch (direction) {
        case 'n':
            newLocation = {
                x: newLocation.x,
                y: newLocation.y - speed
            };
            break;
        case 'ne':
            newLocation = {
                x: newLocation.x + speed,
                y: newLocation.y - speed
            };
            break;
        case 'e':
            newLocation = {
                x: newLocation.x + speed,
                y: newLocation.y
            };
            break;
        case 'se':
            newLocation = {
                x: newLocation.x + speed,
                y: newLocation.y + speed
            };
            break;
        case 's':
            newLocation = {
                x: newLocation.x,
                y: newLocation.y + speed
            };
            break;
        case 'sw':
            newLocation = {
                x: newLocation.x - speed,
                y: newLocation.y + speed
            };
            break;
        case 'w':
            newLocation = {
                x: newLocation.x - speed,
                y: newLocation.y
            };
            break;
        case 'nw':
            newLocation = {
                x: newLocation.x + speed,
                y: newLocation.y - speed
            };
            break;
        default: console.log('');
    };

    return newLocation;
};

export const updateTeamMovements = (gameObject: GameObject) => {
    gameObject.characters.forEach((c: Character, i: number) => {
        
        // define movement speed
        const movementSpeed: number = c.stats.dexterity * c.stats.size / 10;
        
        // make movement test to all directions
        const tests: Coordinates[] = [
            makeMovement('n', movementSpeed, c.location),
            makeMovement('ne', movementSpeed, c.location),
            makeMovement('e', movementSpeed, c.location),
            makeMovement('se', movementSpeed, c.location),
            makeMovement('s', movementSpeed, c.location),
            makeMovement('sw', movementSpeed, c.location),
            makeMovement('w', movementSpeed, c.location),
            makeMovement('nw', movementSpeed, c.location)
        ];
        /*
        const movementToN: Coordinates = makeMovement('n', movementSpeed, c.location);
        const movementToNE: Coordinates = makeMovement('ne', movementSpeed, c.location);
        const movementToE: Coordinates = makeMovement('e', movementSpeed, c.location);
        const movementToSE: Coordinates = makeMovement('se', movementSpeed, c.location);
        const movementToS: Coordinates = makeMovement('s', movementSpeed, c.location);
        const movementToSW: Coordinates = makeMovement('sw', movementSpeed, c.location);
        const movementToW: Coordinates = makeMovement('w', movementSpeed, c.location);
        const movementToNW: Coordinates = makeMovement('nw', movementSpeed, c.location);
        */
        // check from valid directions, what is closest to target
        gameObject.characters.forEach( (ch: Character, index: number) => {
            let collisionDetected: boolean = false;

            if (i !== index) {
                const collisionTest: boolean = isCircleColliding({
                    x: c.location.x,
                    y: c.location.y,
                    size: c.stats.size
                }, {
                    x: ch.location.x,
                    y: ch.location.y,
                    size: ch.stats.size                 
                });

                if (collisionTest) { collisionDetected = true; }
            }

        });
        // move character

        // check if in target, if is, change action to "wait"        
    });

};