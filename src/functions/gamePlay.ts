import { Coordinates } from "../interfaces/sharedInterfaces";

export const getDistance = (
    location1: Coordinates, 
    location2: Coordinates
): number => {
    const dx = location2.x - location1.x;
    const dy = location2.y - location1.y;
    return Math.sqrt(dx * dx + dy * dy);
};
