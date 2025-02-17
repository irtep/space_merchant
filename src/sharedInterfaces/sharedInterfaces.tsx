export interface Character {
    name: string;
    race: string;
    profession: string;
    crew: string;
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