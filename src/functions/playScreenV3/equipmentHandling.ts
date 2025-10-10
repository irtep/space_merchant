import { AnyItem, Character, ItemStore, Weapon } from "../../interfaces/sharedInterfaces";
import { itemStore } from "../../data/itemStore";

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

  // Get the item data from your items database
  const item = getItem(itemId, itemStore);
  if (!item) return character;

  const newInventory = [...character.inventory];
  
  // Decrease quantity
  if (newInventory[entryIndex].quantity > 1) {
    newInventory[entryIndex] = {
      ...newInventory[entryIndex],
      quantity: newInventory[entryIndex].quantity - 1,
    };
  } else {
    // Remove entry entirely if quantity becomes 0
    newInventory.splice(entryIndex, 1);
  }

// Apply stat modifications
let updatedStats = { ...character.stats };

if (item && 'stats' in item && Array.isArray(item.stats)) {
  item.stats.forEach(statMod => {
    const statName = statMod.stat.toLowerCase();
    
    // Handle resistance stats
    if (statName.includes('resistance')) {
      const resistType = statName.replace(' resistance', '').trim() as keyof typeof character.stats.resists;
      if (character.stats.resists.hasOwnProperty(resistType)) {
        updatedStats = {
          ...updatedStats,
          resists: {
            ...updatedStats.resists,
            [resistType]: updatedStats.resists[resistType] + statMod.value
          }
        };
      }
    }
    // Handle base stats
    else if (character.stats.hasOwnProperty(statName)) {
      updatedStats = {
        ...updatedStats,
        [statName]: (updatedStats as any)[statName] + statMod.value
      };
    }
  });
}

  return {
    ...character,
    equipment: { ...character.equipment, [slot]: itemId },
    inventory: newInventory,
    stats: updatedStats,
  };
};

// Unequip item (adds 1 back to inventory, clears equipment slot)
export const unequipItem = (
  character: Character,
  slot: keyof Character["equipment"]
): Character => {
  const itemId = character.equipment[slot];
  if (!itemId) return character;

  // Get the item data to access its stats
  const item = getItem(itemId, itemStore);
  
  // See if item already exists in inventory
  const entryIndex = character.inventory.findIndex(e => e.itemId === itemId);
  const newInventory = [...character.inventory];
  
  if (entryIndex !== -1) {
    // Increase quantity
    newInventory[entryIndex] = {
      ...newInventory[entryIndex],
      quantity: newInventory[entryIndex].quantity + 1,
    };
  } else {
    // Add new entry
    newInventory.push({ itemId, quantity: 1 });
  }

// Remove stat modifications
let updatedStats = { ...character.stats };

if (item && 'stats' in item && Array.isArray(item.stats)) {
  item.stats.forEach(statMod => {
    const statName = statMod.stat.toLowerCase();
    
    // Handle resistance stats
    if (statName.includes('resistance')) {
      const resistType = statName.replace(' resistance', '').trim() as keyof typeof character.stats.resists;
      if (character.stats.resists.hasOwnProperty(resistType)) {
        updatedStats = {
          ...updatedStats,
          resists: {
            ...updatedStats.resists,
            [resistType]: updatedStats.resists[resistType] - statMod.value
          }
        };
      }
    }
    // Handle base stats
    else if (character.stats.hasOwnProperty(statName)) {
      updatedStats = {
        ...updatedStats,
        [statName]: (updatedStats as any)[statName] - statMod.value
      };
    }
  });
}

  return {
    ...character,
    equipment: { ...character.equipment, [slot]: undefined },
    inventory: newInventory,
    stats: updatedStats,
  };
};
