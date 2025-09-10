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

// Equip item (keep stack in inventory, just mark equipped)
export const equipItem = (
    character: Character,
    itemId: string,
    slot: keyof Character["equipment"]
): Character => {
    const entry = character.inventory.find(e => e.itemId === itemId && e.quantity > 0);
    if (!entry) return character; // item not in inventory

    return {
        ...character,
        equipment: { ...character.equipment, [slot]: itemId },
    };
};

// Unequip item (doesn't touch quantity, just clears slot)
export const unequipItem = (
    character: Character,
    slot: keyof Character["equipment"]
): Character => {
    const itemId = character.equipment[slot];
    if (!itemId) return character;

    return {
        ...character,
        equipment: { ...character.equipment, [slot]: undefined },
    };
};
