export interface Ability {
    name: string;
    desc: string;
};

export interface Skill {
    name: string;
    desc: string;
    level: number;
};

export interface Stats {
    strength: number;
    dexterity: number;
    toughness: number;
    perception: number;
    magic: number;
    abilities: Ability[];
    skills: Skill[];
};

export interface Coordinates {
    x: number;
    y: number;
    z?: number;
};

export interface Item {
    name: string;
    type: 'item';
    desc: string;
    value: number;
    weight: number;
};

export interface StatMod {
    stat: string;
    value: number;
};

export interface Armour {
    name: string;
    desc: string;
    type: 'armour';
    slots: string[];
    value: number;
    weight: number;
    stats: StatMod[];
};

export interface Weapon {
    name: string;
    desc: string;
    type: 'weapon';
    slots: string[];
    value: number;
    weight: number;
    stats: StatMod[];
};

export interface Armours {
    head: Armour | '';
    upperBody: Armour | '';
    legs: Armour | '';
    hands: Armour | '';
    feet: Armour | '';
}

export interface Weapons {
    leftHand: Weapon | '';
    rightHand: Weapon | '';
};

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


export interface GameObject {
    playerCharacter: Character
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