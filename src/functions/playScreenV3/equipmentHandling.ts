import { AnyItem, Character, ItemStore, Weapon } from "../../interfaces/sharedInterfaces";

// Get full item from store
export const getItem = (itemId: string, items: ItemStore): AnyItem | undefined => {
    return items[itemId];
};

// Get equipped weapon
export const getEquippedWeapon = (
    character: Character,
    items: ItemStore,
    hand: "leftHand" | "rightHand"
): Weapon | null => {
    const weaponId = character.equipment[hand];
    if (!weaponId) return null;
    const item = items[weaponId];
    return item && item.type === "weapon" ? (item as Weapon) : null;
};

// Equip item (takes 1 from inventory, places into equipment slot)
export const equipItem = (
    character: Character,
    itemId: string,
    slot: keyof Character["equipment"]
): Character => {
    const entryIndex = character.inventory.findIndex(e => e.itemId === itemId && e.quantity > 0);
    if (entryIndex === -1) return character; // item not in inventory

    const newInventory = [...character.inventory];

    // decrease quantity
    if (newInventory[entryIndex].quantity > 1) {
        newInventory[entryIndex] = {
            ...newInventory[entryIndex],
            quantity: newInventory[entryIndex].quantity - 1,
        };
    } else {
        // remove entry entirely if quantity becomes 0
        newInventory.splice(entryIndex, 1);
    }

    return {
        ...character,
        equipment: { ...character.equipment, [slot]: itemId },
        inventory: newInventory,
    };
};

// Unequip item (adds 1 back to inventory, clears equipment slot)
export const unequipItem = (
    character: Character,
    slot: keyof Character["equipment"]
): Character => {
    const itemId = character.equipment[slot];
    if (!itemId) return character;

    // see if item already exists in inventory
    const entryIndex = character.inventory.findIndex(e => e.itemId === itemId);
    const newInventory = [...character.inventory];

    if (entryIndex !== -1) {
        // increase quantity
        newInventory[entryIndex] = {
            ...newInventory[entryIndex],
            quantity: newInventory[entryIndex].quantity + 1,
        };
    } else {
        // add new entry
        newInventory.push({ itemId, quantity: 1 });
    }

    return {
        ...character,
        equipment: { ...character.equipment, [slot]: undefined },
        inventory: newInventory,
    };
};

