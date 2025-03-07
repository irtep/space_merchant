import { Character, GameObject } from "../interfaces/sharedInterfaces";

const buttonWidth: number = 120;
const buttonHeight: number = 30;
const smallButtonWidth: number = 80;
const smallButtonHeight: number = 14;
const fontSize: number = 14;
let detailsButtonX: number = 0;
let detailsButtonY: number = 0;
let pauseButtonX: number = 0;
let pauseButtonY: number = 0;
const unequipButtons: { x: number; y: number; slot: string; type: "weapon" | "armour" }[] = [];
const dropButtons: { x: number; y: number; itemIndex: number }[] = [];

export const handleMouseDownToConsole = (
    event: MouseEvent,
    canvas: HTMLCanvasElement,
    gameObject: GameObject,
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setPause: React.Dispatch<React.SetStateAction<boolean>>,
    pauseRef: React.RefObject<boolean>,
    setMessage: React.Dispatch<React.SetStateAction<string>>/*,
    setGameObject: React.Dispatch<React.SetStateAction<GameObject>>*/
) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    console.log('x and y ', clickX, clickY);
    console.log('console listens');

    // Check if click is inside the "More Details" button
    if (
        clickX >= detailsButtonX &&
        clickX <= detailsButtonX + buttonWidth &&
        clickY >= detailsButtonY &&
        clickY <= detailsButtonY + buttonHeight
    ) {
        // Get clicked character
        const clickedCharacter = gameObject.characters[gameObject.clickedCharacterIndex];

        if (clickedCharacter) {
            /*
            alert(
                `More Details:\n` +
                `Name: ${clickedCharacter.name}\n` +
                `Race: ${clickedCharacter.race}\n` +
                `Profession: ${clickedCharacter.profession}\n` +
                `Description: ${clickedCharacter.desc}\n`
            );
            */
            setDialogOpen(true);
        }
    }

    // Check if click is inside the "pause" button
    if (
        clickX >= pauseButtonX &&
        clickX <= pauseButtonX + buttonWidth &&
        clickY >= pauseButtonY &&
        clickY <= pauseButtonY + buttonHeight
    ) {
        setPause((prevPause) => {
            const newPauseState = !prevPause;
            pauseRef.current = newPauseState; // Ensure pauseRef is updated
            console.log('Paused:', newPauseState);
            setMessage(newPauseState ? 'PAUSED' : 'not in pause');
            return newPauseState;
        });

        //setGameObject(gameObject); // ref to gameObject is actually liveGameObject
    }

    // Check for "Unequip" button clicks
    unequipButtons.forEach(({ x, y, slot, type }) => {
        if (clickX >= x && clickX <= x + smallButtonWidth && clickY >= y && clickY <= y + smallButtonHeight) {
            const character = gameObject.characters[gameObject.clickedCharacterIndex];
            if (character) {
                if (type === "weapon") {
                    console.log('Unequipping:', character.weapons[slot as keyof typeof character.weapons]);

                    // Store the item before clearing it
                    const unequippedWeapon = character.weapons[slot as keyof typeof character.weapons];
                    if (unequippedWeapon) {
                        character.inventory.push(unequippedWeapon);
                    }

                    // Clear the slot
                    character.weapons[slot as keyof typeof character.weapons] = "" as any;
                } else {
                    console.log('Unequipping Armour:', character.armours[slot as keyof typeof character.armours]);

                    const unequippedArmour = character.armours[slot as keyof typeof character.armours];
                    if (unequippedArmour) {
                        character.inventory.push(unequippedArmour);
                    }

                    character.armours[slot as keyof typeof character.armours] = "" as any;
                }

                //setGameObject({ ...gameObject });
            }
        }
    });

    // Check for "Drop" button clicks
    dropButtons.forEach(({ x, y, itemIndex }) => {
        if (clickX >= x && clickX <= x + smallButtonWidth && clickY >= y && clickY <= y + smallButtonHeight) {
            const character = gameObject.characters[gameObject.clickedCharacterIndex];
            if (character) {
                // Ensure itemIndex is within the valid inventory range
                if (itemIndex >= 0 && itemIndex < character.inventory.length) {
                    // Retrieve the item before removing it
                    const droppedItem = character.inventory[itemIndex];

                    if (droppedItem) {
                        // Add dropped item to the gameMap loots
                        gameObject.gameMap.loots.push({
                            x: character.location.x, // Assuming character has a position
                            y: character.location.y,
                            what: droppedItem
                        });

                        // Remove from inventory
                        character.inventory.splice(itemIndex, 1);
                    }
                }
            }
        }
    });

};

export const drawConsole = (
    canvas: HTMLCanvasElement,
    gameObject: GameObject
): void => {
    const marginLeft: number = 20;
    const marginTop: number = 20;
    let lines: number = 0;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gameObject.characters.forEach((c: Character, i: number) => {
        if (i === gameObject.clickedCharacterIndex) {
            ctx.font = `16px Arial`;
            ctx.fillStyle = "white";

            // Character info
            ctx.fillText(
                `${c.name} the ${c.race} ${c.profession}`,
                marginLeft,
                marginTop + lines * fontSize
            );
            lines++;
            lines++;

            ctx.font = `${fontSize}px Arial`;

            if (c.desc !== '' && c.desc) {
                ctx.fillText(c.desc, marginLeft, marginTop + lines * fontSize);
                lines++;
                lines++;
            }

            ["leftHand", "rightHand"].forEach((slot) => {
                const weapon = c.weapons[slot as keyof typeof c.weapons];
                if (weapon) {
                    ctx.fillText(`Wielded in ${slot}: ${weapon.name}`, marginLeft, marginTop + lines * fontSize);
                    ctx.fillStyle = "red";
                    ctx.fillRect(marginLeft + 200, marginTop + lines * fontSize - 10, smallButtonWidth, smallButtonHeight);
                    ctx.fillStyle = "white";
                    ctx.fillText("Unequip", marginLeft + 210, marginTop + lines * fontSize);
                    unequipButtons.push({ x: marginLeft + 200, y: marginTop + lines * fontSize - 10, slot, type: "weapon" });
                    lines++;
                }
            });

            lines++;
            ctx.fillText(`Armours:`, marginLeft, marginTop + lines * fontSize);
            lines++;
            Object.entries(c.armours).forEach(([slot, armour]) => {
                if (armour) {
                    ctx.fillText(`${armour.name} (${slot})`, marginLeft, marginTop + lines * fontSize);
                    ctx.fillStyle = "red";
                    ctx.fillRect(marginLeft + 200, marginTop + lines * fontSize - 10, smallButtonWidth, smallButtonHeight);
                    ctx.fillStyle = "white";
                    ctx.fillText("Unequip", marginLeft + 210, marginTop + lines * fontSize);
                    unequipButtons.push({ x: marginLeft + 200, y: marginTop + lines * fontSize - 10, slot, type: "armour" });
                    lines++;
                }
            });

            lines++;
            ctx.fillText(`Inventory:`, marginLeft, marginTop + lines * fontSize);
            lines++;
            c.inventory.forEach((item, index) => {
                ctx.fillText(`${item.name}`, marginLeft, marginTop + lines * fontSize);
                ctx.fillStyle = "yellow";
                ctx.fillRect(marginLeft + 200, marginTop + lines * fontSize - 10, smallButtonWidth, smallButtonHeight);
                ctx.fillStyle = "black";
                ctx.fillText("Drop", marginLeft + 210, marginTop + lines * fontSize);
                dropButtons.push({ x: marginLeft + 200, y: marginTop + lines * fontSize - 10, itemIndex: index });
                lines++;
            });
            // ground
            lines++;
            ctx.fillText(`On ground near:`, marginLeft, marginTop + lines * fontSize);
            lines++;
            // code to check if something near

            // Draw "More Details" Button
            lines += 2;
            detailsButtonX = marginLeft;
            detailsButtonY = marginTop + lines * fontSize;
            ctx.fillStyle = "blue"; // Button color
            ctx.fillRect(detailsButtonX, detailsButtonY, buttonWidth, buttonHeight);
            ctx.fillStyle = "white"; // Text color
            ctx.font = "14px Arial";
            ctx.fillText("More Details", detailsButtonX + 10, detailsButtonY + 20);
            // Draw "Pause toggle button" Button
            lines += 3;
            pauseButtonX = marginLeft;
            pauseButtonY = marginTop + lines * fontSize;
            ctx.fillStyle = "green"; // Button color
            ctx.fillRect(pauseButtonX, pauseButtonY, buttonWidth, buttonHeight);
            ctx.fillStyle = "white"; // Text color
            ctx.font = "14px Arial";
            ctx.fillText("Pause/unpause", pauseButtonX + 10, pauseButtonY + 20);
        }
    });
};
