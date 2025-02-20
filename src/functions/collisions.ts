import { Circle, Rect } from "../interfaces/sharedInterfaces";

export const isCircleColliding = (
    circle1: Circle, 
    circle2: Circle
): boolean => {
    const dx = circle2.x - circle1.x;
    const dy = circle2.y - circle1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= (circle1.size + circle2.size);
};

export const isCircleRectColliding = (
    circle: Circle, // Circle: x, y, radius
    rect: Rect,
    //rx: number, ry: number, rw: number, rh: number // Rect: x, y, width, height
): boolean => {
    // Find the closest point on the rectangle to the circle
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));

    // Calculate the distance between the circle's center and this closest point
    const dx = closestX - circle.x;
    const dy = closestY - circle.y;
    const distanceSquared = dx * dx + dy * dy;

    return distanceSquared <= (circle.size * circle.size);
};
