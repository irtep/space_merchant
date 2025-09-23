// ====== Base Items ======
export interface ItemBase {
    id: string;
    name: string;
    shortName: string;
    desc: string;
    type: "weapon" | "armour" | "item" | "money" | "ammunition";
    value: number;
    weight: number;
    rarity: string;
    stackable: boolean; // always present now
}

export interface Weapon extends ItemBase {
    type: "weapon";
    handlingSkill: string;
    range: number;
    rangedWeapon: boolean;
    slotsNeeded: number;
    stats: StatMod[];
    combatSpeed: number;
    effects: string[];
    damage: DamageTypes;
    coolDownCounter: number;
    armourPiercing: number;
    ammunition?: string; // ID of ammo type
}

export interface Armour extends ItemBase {
    type: "armour";
    slot: "head" | "neck" | "upperBody" | "legs" | "hands" | "feet";
    stats: StatMod[];
    effects: string[];
}

export interface Item extends ItemBase {
    type: "item" | "money" | "ammunition";
}


// ====== Shared Item Store ======
export type AnyItem = Weapon | Armour | Item;

export interface ItemStore {
    [id: string]: AnyItem;
}

export interface Character {
    id: string;
    title: string;
    name: string;
    race: string;
    profession: string;
    team: string;
    stats: Stats;
    location: Coordinates;
    world: string;
    zone: string;

    hitPoints: number;
    maxHitPoints: number;
    magicPoints: number;
    maxMagicPoints: number;
    endurancePoints: number;
    maxEndurancePoints: number;

    // Equipped items store IDs, not full objects
    equipment: {
        head?: string;
        neck?: string;
        upperBody?: string;
        legs?: string;
        hands?: string;
        feet?: string;
        leftHand?: string;
        rightHand?: string;
    };

    // Inventory is just a list of item IDs
    inventory: InventoryEntry[];

    // Character meta
    npc: boolean;
    aggressive: boolean;
    status: string[];
    active: boolean;
    enemies: string[];
    friends: string[];
    canTalk: boolean;
    action: string;
    actionTarget: Character;
    targetLocation?: Coordinates;
    isPlayer: boolean;
    selected: boolean;
    desc?: string;
    abilities: Ability[];
    skills: Skill[];
    path: number[][];
}

// Inventory entries always store quantity
export interface InventoryEntry {
    itemId: string;   // reference to ItemStore
    quantity: number; // >= 1
}

export interface Ability {
    name: string;
    desc: string;
};

export interface Skill {
    name: string;
    level: number;
    learnPoints: number;
    desc: string;
};

export interface Stats {
    strength: number;
    dexterity: number;
    toughness: number;
    perception: number;
    learning: number;
    size: number;
    magic: number;
    physicalResistance: number;
    magicResistance: number;
    fireResistance: number;
    poisonResistance: number;
    coldResistance: number;
    psionicResistance: number;
};

export interface Coordinates {
    x: number;
    y: number;
    z?: number;
};

export interface ItemLocation {
    onGround: boolean;
    onHoldOfCharacter: boolean;
    location?: Coordinates;
    charactersId?: string;
    tradeable: boolean;
}

export interface StatMod {
    stat: string;
    value: number;
};

export interface DamageTypes {
    physical?: number;
    magic?: number;
    fire?: number;
    poison?: number;
    cold?: number;
    psionic?: number;
};

export interface RectObstacle {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    door?: Coordinates;
    name?: string;
};

export interface CircleObstacle {
    x: number;
    y: number;
    size: number;
    color: string;
    door?: Coordinates;
    name: string;
};

export interface Loot {
  id: string;            // unique instance ID (e.g. uuid)
  itemId: string;        // references itemStore
  quantity: number;
  location: { x: number; y: number };
}

export interface GameMap {
    rectObstacles: RectObstacle[];
    circleObstacles: CircleObstacle[];
    loots: Loot[];
};

export interface Hit {
    coordinates: Coordinates;
    size: number;
};

export interface GameObject {
    characters: Character[];
    mouseNowX: number;
    mouseNowY: number;
    gameMap: GameMap;
    clickedCharacterIndex: number;
    updateCounter: number;
    hits: Hit[];
};

export interface Circle {
    x: number;
    y: number;
    size: number;
};

export interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
};

export interface Race {
    name: string;
    desc: string;
    stats: Stats;
    skills: Skill[];
    abilities: Ability[];
};

export interface Profession {
    name: string;
    desc: string;
    stats: Stats;
    skills: Skill[];
    abilities: Ability[];
};

export interface Background {
    name: string;
};
