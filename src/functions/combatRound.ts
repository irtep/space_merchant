import { Character, GameObject } from "../interfaces/sharedInterfaces";

export const combatRound = (gameObject: GameObject): GameObject => {
    const alreadyFought: number[] = [];

    gameObject.characters.forEach( (c: Character, i: number) => {
        if (!alreadyFought.includes(i)) {
            c.enemies.forEach( (e: string) => {
                // check if enemies at combat range
                    
                    // check how many of each team in combat

                    // who manages to attacks first

                    // if target can parry or dodge (evade)

                        // if evaded

                            // if can counter attack or gets re-attacked

                        // if hit

                            // if hits to armoured part

                            // if hits unarmoured part
            });
        }
    });
    
    return gameObject;
};