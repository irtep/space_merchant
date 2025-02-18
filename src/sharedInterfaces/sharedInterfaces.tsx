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
    type: string;
    desc: string;

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
};

export interface Profession {
    name: string;
};

export interface Background {
    name: string;
};