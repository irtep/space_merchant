import { Character, Coordinates, GameObject } from "../interfaces/sharedInterfaces";
import { isCircleColliding, isRectColliding } from "./collisions";
import { getDistance } from "./gamePlay";

interface MovementTestResult {
    direction: string;
    result: boolean;
    location: Coordinates;
    distanceToTarget: number;
};

const makeMovement = (direction: string, speed: number, locationATM: Coordinates): Coordinates => {
    let newLocation: Coordinates = { ...locationATM }; // Ensure a new object is created

    switch (direction) {
        case 'n':
            newLocation.y -= speed;
            break;
        case 'ne':
            newLocation.x += speed;
            newLocation.y -= speed;
            break;
        case 'e':
            newLocation.x += speed;
            break;
        case 'se':
            newLocation.x += speed;
            newLocation.y += speed;
            break;
        case 's':
            newLocation.y += speed;
            break;
        case 'sw':
            newLocation.x -= speed;
            newLocation.y += speed;
            break;
        case 'w':
            newLocation.x -= speed;
            break;
        case 'nw':
            newLocation.x -= speed; // Fixed from +speed to -speed
            newLocation.y -= speed;
            break;
        default:
            console.log(`Invalid direction: ${direction}`);
    }

    return newLocation;
};

export const testCollisions = (c: Character, gameObject: GameObject, locationToTest: Coordinates): boolean => {
    // Check collision with other characters
    const collidesWithCharacter = gameObject.characters.some((ch: Character) =>
        c.id !== ch.id &&
        isCircleColliding(
            { x: locationToTest.x, y: locationToTest.y, size: c.stats.size },
            { x: ch.location.x, y: ch.location.y, size: ch.stats.size }
        )
    );

    // Check collision with circular obstacles (e.g., watchtowers)
    const collidesWithCircleObstacle = gameObject.gameMap.circleObstacles.some((obstacle) =>
        isCircleColliding(
            { x: locationToTest.x, y: locationToTest.y, size: c.stats.size },
            { x: obstacle.x, y: obstacle.y, size: obstacle.size }
        )
    );

    // Check collision with rectangular obstacles (e.g., buildings)
    const collidesWithRectObstacle = gameObject.gameMap.rectObstacles.some((obstacle) =>
        isRectColliding(
            { x: locationToTest.x, y: locationToTest.y, size: c.stats.size }, // Character as a small box
            { x: obstacle.x, y: obstacle.y, w: obstacle.w, h: obstacle.h } // Obstacle rectangle
        )
    );

    return collidesWithCharacter || collidesWithCircleObstacle || collidesWithRectObstacle;
};

/*
export const testCollisions = (c: Character, gameObject: GameObject, locationToTest: Coordinates): boolean => {
    return gameObject.characters.some((ch: Character) =>
        c.id !== ch.id &&
        isCircleColliding(
            { x: locationToTest.x, y: locationToTest.y, size: c.stats.size },
            { x: ch.location.x, y: ch.location.y, size: ch.stats.size }
        )
    );
};
*/

export const updateTeamMovements = (gameObject: GameObject) => {
    gameObject.characters.forEach((c: Character) => {
        const movementSpeed: number = (c.stats.dexterity * c.stats.size) / 100;

        // ACTION === MOVE
        if (c.action === 'move' && c.targetLocation.x !== 0 && c.targetLocation.y !== 0) {
            // Test all movement directions
            const tests: MovementTestResult[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].map((direction) => {
                const location = makeMovement(direction, movementSpeed, c.location);
                return {
                    direction,
                    location,
                    result: testCollisions(c, gameObject, location),
                    distanceToTarget: getDistance(c.targetLocation, location)
                };
            });

            // Find the best movement option
            const bestMove = tests
                .filter((test) => !test.result) // No collision
                .reduce((best, current) => (current.distanceToTarget < best.distanceToTarget ? current : best), tests[0]);

            if (bestMove && !bestMove.result) {
                c.location = bestMove.location; // Move character to best position
            }
        };

        // ACTION === ATTACK
        if (c.action === 'action' && c.actionTarget !== '') {

            // get location of target
            //const locationOfTarget = ''

            // if not find or close enough already, don't move
                // else

            // Test all movement directions
            const tests: MovementTestResult[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].map((direction) => {
                const location = makeMovement(direction, movementSpeed, c.location);
                return {
                    direction,
                    location,
                    result: testCollisions(c, gameObject, location),
                    distanceToTarget: getDistance(c.targetLocation, location)
                };
            });

            // Find the best movement option
            const bestMove = tests
                .filter((test) => !test.result) // No collision
                .reduce((best, current) => (current.distanceToTarget < best.distanceToTarget ? current : best), tests[0]);

            if (bestMove && !bestMove.result) {
                c.location = bestMove.location; // Move character to best position
            }
        };
    });

    return gameObject;
};



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
/*
gameObject.characters.forEach((ch: Character, index: number) => {
    let collisionDetected: boolean = false;

    if (i !== index) {
        // this character tests versus other characters
        const collisionTest: boolean = isCircleColliding({
            x: c.location.x,
            y: c.location.y,
            size: c.stats.size
        }, {
            x: ch.location.x,
            y: ch.location.y,
            size: ch.stats.size
        });

        // here will come test vs buildings and possible other stuff too

        if (collisionTest) { collisionDetected = true; }
    }

});
*/
// move character

// check if in target, if is, change action to "wait"   