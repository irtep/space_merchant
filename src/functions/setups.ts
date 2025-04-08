import { Armour, Character, GameObject, Item, Loot, Weapon } from "../interfaces/sharedInterfaces";

export const giveIdsToItem = (gameObject: GameObject): GameObject => {
    let itemId: number = 0;

    console.log('giving ids to items');
    // give all items unique id
    gameObject.characters.forEach( (c: Character) => {
        Object.entries(c.armours).forEach(([_slot, armour]) => {
            //console.log('slot/ armour ', slot, armour);
            if (armour !== '') {
                armour.id = itemId;
                itemId++;
            } 
        });
        Object.entries(c.weapons).forEach(([_slot, weapon]) => {
            if (weapon !== '') {
                weapon.id = itemId;
                itemId++;
            }
        })
        c.inventory.forEach( (i: Item | Weapon | Armour) => {
            i.id = itemId;
            itemId++;
        });
    });
    gameObject.gameMap.loots.forEach( (l: Loot) => {
        l.what.id = itemId;
        itemId++;
    });

    return gameObject;
}
