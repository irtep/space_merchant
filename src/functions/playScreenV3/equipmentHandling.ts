import { AnyItem, Character, CombatProps, ItemStore, Weapon } from "../../interfaces/sharedInterfaces";
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

// Default combat properties
let defaultCloseCombat: CombatProps = {
  damage: 0,
  type: ['physical'],
  skill: 'unarmed',
  epCost: 1,
  coolDown: 0,
  coolDownCounter: 0,
  range: 1
};

let defaultRangedCombat: CombatProps = {
  damage: 0,
  type: ['physical'],
  skill: 'not available',
  epCost: 1,
  coolDown: 0,
  coolDownCounter: 0,
  range: 1
};

// Update equipItem function
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
  let updatedCloseCombat = { ...character.closeCombat };
  let updatedRangedCombat = { ...character.rangedCombat };

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

  // Handle weapon combat properties
  if (item.type === 'weapon') {
    const weapon = item as Weapon;
    
    if (weapon.rangedWeapon) {
      // Update ranged combat with weapon properties (except coolDownCounter)
      updatedRangedCombat = {
        damage: weapon.damage || 0,
        type: weapon.damageTypes || ['physical'],
        skill: weapon.handlingSkill || 'not available',
        epCost: weapon.epCost || 1,
        coolDown: weapon.coolDown || 0,
        coolDownCounter: character.rangedCombat.coolDownCounter, // Preserve current counter
        range: weapon.range || 1
      };
    } else {
      // Update close combat with weapon properties (except coolDownCounter)
      updatedCloseCombat = {
        damage: weapon.damage || 0,
        type: weapon.damageTypes || ['physical'],
        skill: weapon.handlingSkill || 'unarmed',
        epCost: weapon.epCost || 1,
        coolDown: weapon.coolDown || 0,
        coolDownCounter: character.closeCombat.coolDownCounter, // Preserve current counter
        range: weapon.range || 1
      };
    }
  }

  return {
    ...character,
    equipment: { ...character.equipment, [slot]: itemId },
    inventory: newInventory,
    stats: updatedStats,
    closeCombat: updatedCloseCombat,
    rangedCombat: updatedRangedCombat,
  };
};

// Update unequipItem function
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
  let updatedCloseCombat = { ...character.closeCombat };
  let updatedRangedCombat = { ...character.rangedCombat };

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

  // Reset combat properties if unequipping a weapon from hand slots
  if (item?.type === 'weapon' && (slot === 'leftHand' || slot === 'rightHand')) {
    const weapon = item as Weapon;
    
    if (weapon.rangedWeapon) {
      // Reset ranged combat to defaults
      updatedRangedCombat = {
        ...defaultRangedCombat,
        coolDownCounter: character.rangedCombat.coolDownCounter // Preserve current counter
      };
    } else {
      // Reset close combat to defaults
      updatedCloseCombat = {
        ...defaultCloseCombat,
        coolDownCounter: character.closeCombat.coolDownCounter // Preserve current counter
      };
    }
  }

  return {
    ...character,
    equipment: { ...character.equipment, [slot]: undefined },
    inventory: newInventory,
    stats: updatedStats,
    closeCombat: updatedCloseCombat,
    rangedCombat: updatedRangedCombat,
  };
};