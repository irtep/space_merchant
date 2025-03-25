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

export interface Item {
    name: string;
    shortName: string;
    type: 'item' | 'money';
    desc: string;
    value: number;
    weight: number;
    rarity: string;
};

export interface StatMod {
    stat: string;
    value: number;
};

export interface Armour {
    name: string;
    shortName: string;
    desc: string;
    type: 'armour';
    slot: string;
    value: number;
    weight: number;
    stats: StatMod[];
    rarity: string;
    effects: string[];
};

export interface DamageTypes {
    physical?: number;
    magic?: number;
    fire?: number;
    poison?: number;
    cold?: number;
    psionic?: number;
};

export interface Weapon {
    name: string;
    shortName: string;
    desc: string;
    type: 'weapon';
    handlingSkill: string;
    range: number;
    rangedWeapon: boolean;
    slotsNeeded: number;
    value: number;
    weight: number;
    stats: StatMod[];
    combatSpeed: number;
    effects: string[];
    damage: DamageTypes;
    coolDownCounter: number;
    rarity: string;
    armourPiercing: number;
};

export interface Armours {
    head: Armour | '';
    neck: Armour | '';
    upperBody: Armour | '';
    legs: Armour | '';
    hands: Armour | '';
    feet: Armour | '';
}

export interface Weapons {
    leftHand: Weapon | '';
    rightHand: Weapon | '';
};

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
    endurancePoints: number;
    armours: Armours;
    weapons: Weapons;
    npc: boolean;
    aggressive: boolean;
    status: string[];
    active: boolean;
    enemies: string[];
    friends: string[];
    canTalk: boolean;
    action: string;
    actionTarget: string;
    targetLocation: Coordinates;
    inventory: (Weapon | Armour | Item)[];
    isPlayer: boolean;
    selected: boolean;
    desc?: string;
    abilities: Ability[];
    skills: Skill[];
};

export interface Loot {
    x: number;
    y: number;
    what: Weapon | Armour | Item
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

export interface GameMap {
    rectObstacles: RectObstacle[];
    circleObstacles: CircleObstacle[];
    loots: Loot[];
};

export interface GameObject {
    characters: Character[];
    mouseNowX: number;
    mouseNowY: number;
    gameMap: GameMap;
    clickedCharacterIndex: number;
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
};

export interface Background {
    name: string;
};

/*
export class Character {
    title: string;
    name: string;
    race: string;
    profession: string;
    ship: string;
    stats: Stats;
    location: Coordinates;
    world: string;
    zone: string;
    hitPoints: number;
    maxHitPoints: number;
    magicPoints: number;
    endurancePoints: number;
    armours: Armours;
    weapons: Weapons;
    npc: boolean;
    aggressive: boolean;
    status: string[];
    active: boolean;
    enemies: string[];
    friends: string[];
    canTalk: boolean;
    action: string;
    actionTarget: string;
    inventory: Weapons[] | Armours[] | Item[];

    constructor(data: Omit<Character, 'attack' | 'move' | 'defend' | 'useItem'>) {
        this.title = data.title;
        this.name = data.name;
        this.race = data.race;
        this.profession = data.profession;
        this.ship = data.ship;
        this.stats = data.stats;
        this.location = data.location;
        this.world = data.world;
        this.zone = data.zone;
        this.hitPoints = data.hitPoints;
        this.maxHitPoints = data.maxHitPoints;
        this.magicPoints = data.magicPoints;
        this.endurancePoints = data.endurancePoints;
        this.armours = data.armours;
        this.weapons = data.weapons;
        this.npc = data.npc;
        this.aggressive = data.npc;
        this.status =  data.status;
        this.active = data.active;
        this.enemies = data.enemies;
        this.friends = data.friends;
        this.canTalk = data.canTalk;
        this.action = data.action;
        this.actionTarget = data.actionTarget;
        this.inventory = data.inventory;
    }

    attack(target: Character) {
        const damage = this.stats.strength * 2; // Example formula
        target.hitPoints -= damage;
        console.log(`${this.name} attacks ${target.name} for ${damage} damage!`);
    }

    move(newLocation: Coordinates) {
        this.location = newLocation;
        console.log(`${this.name} moves to (${newLocation.x}, ${newLocation.y})`);
    }
};
*/